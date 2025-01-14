const {
  getPoolContract,
  getVaultContract,
  getGlpManagerContract,
  getRewardReaderContract,
  getReaderContract,
  getGmxGlpWrapperContract,
  getMagicGlpHarvestorContract
} = require("./contracts");
const {
  weth,
  gmx,
  nativeToken,
  address,
  rewardTrackersForStakingInfo,
  walletTokens,
} = require("./constants");
const { Token } = require("@uniswap/sdk-core");
const { Pool } = require("@uniswap/v3-sdk");
const { expandDecimals, parseValue } = require("./utils");

module.exports.getGmxPrice = async () => {
  const poolContract = getPoolContract();
  const uniPoolSlot0 = await poolContract.slot0();

  const vaultContract = getVaultContract();
  const ethPrice = await vaultContract.getMinPrice(weth);

  const tokenA = new Token(42161, weth, 18, "SYMBOL", "NAME");
  const tokenB = new Token(42161, gmx, 18, "SYMBOL", "NAME");

  const pool = new Pool(
    tokenA, // tokenA
    tokenB, // tokenB
    10000, // fee
    uniPoolSlot0.sqrtPriceX96, // sqrtRatioX96
    1, // liquidity
    uniPoolSlot0.tick, // tickCurrent
    []
  );

  const poolTokenPrice = pool.priceOf(tokenB).toSignificant(6);
  const poolTokenPriceAmount = parseValue(poolTokenPrice, 18);
  return poolTokenPriceAmount?.mul(ethPrice).div(expandDecimals(1, 18));
};

module.exports.getNativeTokenPrice = () => {
  const contract = getVaultContract();
  return contract.getMinPrice(nativeToken);
};

module.exports.getAum = async () => {
  const glpManagerContract = getGlpManagerContract();
  const [aum0, aum1] = await glpManagerContract.getAums();
  return aum0.add(aum1).div(2);
};

function getStakingInfo() {
  const rewardReaderContract = getRewardReaderContract();
  return rewardReaderContract.getStakingInfo(
    address,
    rewardTrackersForStakingInfo
  );
}

module.exports.getStakingData = async () => {
  const stakingInfo = await getStakingInfo();

  const keys = [
    "stakedGmxTracker",
    "bonusGmxTracker",
    "feeGmxTracker",
    "stakedGlpTracker",
    "feeGlpTracker",
  ];
  const data = {};
  const propsLength = 5;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    data[key] = {
      claimable: stakingInfo[i * propsLength],
      tokensPerInterval: stakingInfo[i * propsLength + 1],
      averageStakedAmounts: stakingInfo[i * propsLength + 2],
      cumulativeRewards: stakingInfo[i * propsLength + 3],
      totalSupply: stakingInfo[i * propsLength + 4],
    };
  }

  return data;
};

function getBalances() {
  const contract = getReaderContract();
  return contract.getTokenBalancesWithSupplies(address, walletTokens);
}

module.exports.getBalanceAndSupplyData = async () => {
  const balances = await getBalances();
  const keys = ["gmx", "esGmx", "glp", "stakedGmxTracker"];
  const balanceData = {};
  const supplyData = {};
  const propsLength = 2;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    balanceData[key] = balances[i * propsLength];
    supplyData[key] = balances[i * propsLength + 1];
  }

  return { balanceData, supplyData };
};

module.exports.getFeePercent = async () => {
  const GmxGlpWrapperContract = await getGmxGlpWrapperContract();
  return await GmxGlpWrapperContract.feePercent();
};

module.exports.getMagicFeePercent = async () => {
  const MagicGlpHarvestorContrac = await getMagicGlpHarvestorContract();
  return await MagicGlpHarvestorContrac.feePercentBips();
};