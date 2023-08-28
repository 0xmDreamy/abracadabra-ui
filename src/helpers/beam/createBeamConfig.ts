import { Contract, providers, utils } from "ethers";
import mimConfigs from "@/utils/contracts/mimToken";
import chainConfig from "@/utils/beam/chainConfig";
import beamConfigs from "@/utils/beam/beamConfigs";
import { isTokenApprowed } from "@/utils/approveHelpers.js";
import { markRaw } from "vue";
import type { BeamConfig, UserInfo } from "@/helpers/beam/types";

const emptyState = {
  contractInstance: null,
  balance: "0",
  nativeTokenBalance: "0",
  isTokenApprove: false,
  tokenContractInstance: null,
};

const getUserInfo = async (
  provider: providers.BaseProvider,
  account: string,
  contract: Contract,
  address: string
): Promise<UserInfo> => {
  if (!provider)
    return {
      balance: "0.0",
      nativeTokenBalance: "0.0",
      isTokenApprove: false,
    };

  const userBalamce = await contract.balanceOf(account);
  const nativeTokenBalance = await provider.getBalance(account);

  return {
    balance: utils.formatUnits(userBalamce),
    nativeTokenBalance: utils.formatUnits(nativeTokenBalance),
    isTokenApprove: await isTokenApprowed(contract, address, account, true),
  };
};

export const createBeamConfig = async (
  chainId: number,
  signer: providers.BaseProvider,
  account: string,
  provider: providers.BaseProvider
): Promise<BeamConfig> => {
  const mimConfig = mimConfigs.find((item) => item.chainId === chainId);

  const beamConfig = beamConfigs.find((item) => item.chainId === chainId);

  const fromChains = beamConfigs.map((configItem) => {
    return {
      chainId: configItem.chainId,
      title: configItem.chainName,
      icon: configItem.chainIcon,
      defaultValue: configItem.defaultValue,
    };
  });

  const chainsInfo = chainConfig.filter((chain) => chain.chainId !== chainId);

  const toChains = chainsInfo.map((chainItem) => {
    return {
      chainId: chainItem.chainId,
      lzChainId: chainItem.lzChainId,
      title: chainItem.name,
      icon: chainItem.icon,
    };
  });

  if (!beamConfig && !mimConfig)
    return markRaw({
      ...emptyState,
      chainsInfo,
      fromChains,
      toChains,
    });

  const contractInstance = new Contract(
    beamConfig!.contract.address,
    JSON.stringify(beamConfig!.contract.abi),
    signer
  );

  const tokenContractInstance = new Contract(
    mimConfig!.address,
    JSON.stringify(mimConfig!.abi),
    signer
  );
  const { balance, isTokenApprove, nativeTokenBalance } = await getUserInfo(
    provider,
    account,
    tokenContractInstance,
    beamConfig!.contract.address
  );

  return markRaw({
    contractInstance,
    balance,
    nativeTokenBalance,
    isTokenApprove,
    tokenContractInstance,
    chainsInfo: chainsInfo,
    fromChains,
    toChains,
  });
};
