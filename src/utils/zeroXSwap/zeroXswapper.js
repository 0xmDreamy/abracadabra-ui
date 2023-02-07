import { swap0xRequest } from "@/helpers/0x"
import { BigNumber, ethers } from "ethers";

const getBigNumber = (amount, decimals) => {
  return BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals));
};

const initializeProps = async (pool) => {
  const MIM = pool.borrowToken.contract;
  const Pair = pool.lpLogic.lpContract;
  const { _reserve0: token0Reserve, _reserve1: token1Reserve } =
    await Pair.getReserves();
  const totalSupply = await Pair.totalSupply();

  const token0Contract = pool.token0.contract;
  const token0Desimals = await token0Contract.decimals();
  const token0ChainlinkContract = pool.chainlinks.token0;
  const token0PriceInUsd = await token0ChainlinkContract.latestAnswer();
  const token0PriceDesimals = await token0ChainlinkContract.decimals();

  const token1Contract = pool.token1.contract;
  const token1Desimals = await token1Contract.decimals();
  const token1ChainlinkContract = pool.chainlinks.token1;
  const token1PriceInUsd = await token1ChainlinkContract.latestAnswer();
  const token1PriceDesimals = await token1ChainlinkContract.decimals();

  const token0 = {
    contract: token0Contract,
    decimals: token0Desimals,
    priceInUsd: token0PriceInUsd,
    priceDesimals: token0PriceDesimals,
    reserve: token0Reserve,
  };

  const token1 = {
    contract: token1Contract,
    decimals: token1Desimals,
    priceInUsd: token1PriceInUsd,
    priceDesimals: token1PriceDesimals,
    reserve: token1Reserve,
  };

  return {
    MIM,
    Pair,
    token0,
    token1,
    totalSupply,
  };
};

const getTokenValue = (decimals0, decimals1, value0, value1) => {
  const totalDesimals = decimals0 + decimals1;

  if (totalDesimals < 18) {
    return value0.mul(value1).mul(BigNumber.from(10).pow(18 - totalDesimals));
  } else if (totalDesimals > 18) {
    return value0.mul(value1).div(BigNumber.from(10).pow(totalDesimals - 18));
  } else {
    return value0.mul(value1).div(BigNumber.from(10).pow(decimals1)); // 18 decimals
  }
};

const getLev0xData = async (mimAmount, pool, slipage = 1) => {
  const { MIM, token0, token1 } = await initializeProps(pool);

  const token0ReserveTotalValueInUsd = getTokenValue(
    token0.decimals,
    token0.priceDesimals,
    token0.reserve,
    token0.priceInUsd
  ); // 18 decimals

  const token1ReserveTotalValueInUsd = getTokenValue(
    token1.decimals,
    token1.priceDesimals,
    token1.reserve,
    token1.priceInUsd
  ); // 18 decimals

  const lpTotalValueInUsd = token0ReserveTotalValueInUsd.add(
    token1ReserveTotalValueInUsd
  ); // 18 decimals

  const percentToken0 = lpTotalValueInUsd
    .mul(BigNumber.from(10).pow(18))
    .div(token0ReserveTotalValueInUsd); // 18 decimals

  const queryMimAmountFromToken0 = mimAmount
    .mul(BigNumber.from(10).pow(18))
    .div(percentToken0); // 18 decimals

  const queryMimAmountFromToken1 = mimAmount.sub(queryMimAmountFromToken0); // 18 decimals

  const queryToken0AmountFromMim = await swap0xRequest(
    10,
    token0.contract.address,
    MIM.address,
    slipage,
    queryMimAmountFromToken0
  );

  const queryToken1AmountFromMim = await swap0xRequest(
    10,
    token1.contract.address,
    MIM.address,
    slipage,
    queryMimAmountFromToken1
  );

  const totalMimAmountToSwap = queryMimAmountFromToken0.add(
    queryMimAmountFromToken1
  );

  if (totalMimAmountToSwap.gt(mimAmount)) {
    throw new Error(
      `total mim amount to swap ${totalMimAmountToSwap.toString()} exceed ${mimAmount.toString()}`
    );
  }

  const minimumToken0ToSwapAgainForMoreLp = getBigNumber(1, 16);
  const minimumToken1ToSwapAgainForMoreLp = getBigNumber(1, 16);

  const data = ethers.utils.defaultAbiCoder.encode(
    ["bytes[]", "uint256", "uint256"],
    [
      [queryToken0AmountFromMim.data, queryToken1AmountFromMim.data],
      minimumToken0ToSwapAgainForMoreLp,
      minimumToken1ToSwapAgainForMoreLp,
    ]
  );

  return data;
};

const getLiq0xData = async (lpAmount, pool, slipage = 1) => {
  const { Pair, MIM, token0, token1, totalSupply } = await initializeProps(
    pool
  );

  const lpAmountToken0 = await token0.contract.balanceOf(Pair.address);
  const lpAmountToken1 = await token1.contract.balanceOf(Pair.address);
  const amount0 = lpAmount.mul(lpAmountToken0).div(totalSupply);
  const amount1 = lpAmount.mul(lpAmountToken1).div(totalSupply);

  const queryToken0ToMim = await swap0xRequest(
    10,
    MIM.address,
    token0.contract.address,
    slipage,
    amount0
  );

  const queryToken1ToMim = await swap0xRequest(
    10,
    MIM.address,
    token1.contract.address,
    slipage,
    amount1
  );

  const data = ethers.utils.defaultAbiCoder.encode(
    ["bytes[]"],
    [[queryToken0ToMim.data, queryToken1ToMim.data]]
  );

  return data;
};

export { getLev0xData, getLiq0xData };