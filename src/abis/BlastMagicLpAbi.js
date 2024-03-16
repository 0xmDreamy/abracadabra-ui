export default [
  {
    inputs: [
      {
        internalType: "contract BlastTokenRegistry",
        name: "registry_",
        type: "address",
      },
      {
        internalType: "address",
        name: "feeTo_",
        type: "address",
      },
      {
        internalType: "address",
        name: "owner_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AllowanceOverflow",
    type: "error",
  },
  {
    inputs: [],
    name: "AllowanceUnderflow",
    type: "error",
  },
  {
    inputs: [],
    name: "ErrBaseQuoteSame",
    type: "error",
  },
  {
    inputs: [],
    name: "ErrExpired",
    type: "error",
  },
  {
    inputs: [],
    name: "ErrFlashLoanFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "ErrInitialized",
    type: "error",
  },
  {
    inputs: [],
    name: "ErrInvalidI",
    type: "error",
  },
  {
    inputs: [],
    name: "ErrInvalidK",
    type: "error",
  },
  {
    inputs: [],
    name: "ErrInvalidSignature",
    type: "error",
  },
  {
    inputs: [],
    name: "ErrIsZero",
    type: "error",
  },
  {
    inputs: [],
    name: "ErrMintAmountNotEnough",
    type: "error",
  },
  {
    inputs: [],
    name: "ErrNoBaseInput",
    type: "error",
  },
  {
    inputs: [],
    name: "ErrNotAllowedImplementationOperator",
    type: "error",
  },
  {
    inputs: [],
    name: "ErrNotClone",
    type: "error",
  },
  {
    inputs: [],
    name: "ErrNotEnough",
    type: "error",
  },
  {
    inputs: [],
    name: "ErrNotImplementation",
    type: "error",
  },
  {
    inputs: [],
    name: "ErrNotImplementationOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "ErrSellBackNotAllowed",
    type: "error",
  },
  {
    inputs: [],
    name: "ErrWithdrawNotEnough",
    type: "error",
  },
  {
    inputs: [],
    name: "ErrZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "ErrZeroQuoteAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientAllowance",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidPermit",
    type: "error",
  },
  {
    inputs: [],
    name: "PermitExpired",
    type: "error",
  },
  {
    inputs: [],
    name: "Reentrancy",
    type: "error",
  },
  {
    inputs: [],
    name: "TotalSupplyOverflow",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Burn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "increaseShares",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalShares",
        type: "uint256",
      },
    ],
    name: "BuyShares",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "borrower",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "assetTo",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "baseAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "quoteAmount",
        type: "uint256",
      },
    ],
    name: "FlashLoan",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "LogBlastETHClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "LogBlastGasClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
    ],
    name: "LogBlastNativeClaimableEnabled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "LogBlastTokenClaimableEnabled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "LogBlastTokenClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "feeTo",
        type: "address",
      },
    ],
    name: "LogFeeToChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    name: "LogOperatorChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "gasAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "nativeAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "token0Amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "token1Amount",
        type: "uint256",
      },
    ],
    name: "LogYieldClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Mint",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum PMMPricing.RState",
        name: "newRState",
        type: "uint8",
      },
    ],
    name: "RChange",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "payer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "decreaseShares",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalShares",
        type: "uint256",
      },
    ],
    name: "SellShares",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "fromToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "toToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "fromAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "toAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "Swap",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "result",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_I",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_K",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_BASE_PRICE_CUMULATIVE_LAST_",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_BASE_RESERVE_",
    outputs: [
      {
        internalType: "uint112",
        name: "",
        type: "uint112",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_BASE_TARGET_",
    outputs: [
      {
        internalType: "uint112",
        name: "",
        type: "uint112",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_BASE_TOKEN_",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_BLOCK_TIMESTAMP_LAST_",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_I_",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_K_",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_LP_FEE_RATE_",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_MAINTAINER_",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_MT_FEE_RATE_MODEL_",
    outputs: [
      {
        internalType: "contract IFeeRateModel",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_QUOTE_RESERVE_",
    outputs: [
      {
        internalType: "uint112",
        name: "",
        type: "uint112",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_QUOTE_TARGET_",
    outputs: [
      {
        internalType: "uint112",
        name: "",
        type: "uint112",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_QUOTE_TOKEN_",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_RState_",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "result",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "result",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "buyShares",
    outputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "baseInput",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "quoteInput",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimYields",
    outputs: [
      {
        internalType: "uint256",
        name: "gasAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "nativeAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "token0Amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "token1Amount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "correctRState",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "feeTo",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "baseAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "quoteAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "assetTo",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "flashLoan",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getBaseInput",
    outputs: [
      {
        internalType: "uint256",
        name: "input",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMidPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "midPrice",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPMMState",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "i",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "K",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "B",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "Q",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "B0",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "Q0",
            type: "uint256",
          },
          {
            internalType: "enum PMMPricing.RState",
            name: "R",
            type: "uint8",
          },
        ],
        internalType: "struct PMMPricing.PMMState",
        name: "state",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPMMStateForCall",
    outputs: [
      {
        internalType: "uint256",
        name: "i",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "K",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "B",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "Q",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "B0",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "Q0",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "R",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getQuoteInput",
    outputs: [
      {
        internalType: "uint256",
        name: "input",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserFeeRate",
    outputs: [
      {
        internalType: "uint256",
        name: "lpFeeRate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "mtFeeRate",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getReserves",
    outputs: [
      { internalType: "uint256", name: "baseReserve", type: "uint256" },
      { internalType: "uint256", name: "quoteReserve", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getVaultReserve",
    outputs: [
      {
        internalType: "uint256",
        name: "baseReserve",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "quoteReserve",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "implementation",
    outputs: [
      {
        internalType: "contract BlastMagicLP",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "maintainer",
        type: "address",
      },
      {
        internalType: "address",
        name: "baseTokenAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "quoteTokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "lpFeeRate",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "mtFeeRateModel",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "i",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "k",
        type: "uint256",
      },
    ],
    name: "init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "result",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "operators",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "payBaseAmount",
        type: "uint256",
      },
    ],
    name: "querySellBase",
    outputs: [
      {
        internalType: "uint256",
        name: "receiveQuoteAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "mtFee",
        type: "uint256",
      },
      {
        internalType: "enum PMMPricing.RState",
        name: "newRState",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "newBaseTarget",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "payQuoteAmount",
        type: "uint256",
      },
    ],
    name: "querySellQuote",
    outputs: [
      {
        internalType: "uint256",
        name: "receiveBaseAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "mtFee",
        type: "uint256",
      },
      {
        internalType: "enum PMMPricing.RState",
        name: "newRState",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "newQuoteTarget",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "registry",
    outputs: [
      {
        internalType: "contract BlastTokenRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "sellBase",
    outputs: [
      {
        internalType: "uint256",
        name: "receiveQuoteAmount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "sellQuote",
    outputs: [
      {
        internalType: "uint256",
        name: "receiveBaseAmount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "shareAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "baseMinAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "quoteMinAmount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
    ],
    name: "sellShares",
    outputs: [
      {
        internalType: "uint256",
        name: "baseAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "quoteAmount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "feeTo_",
        type: "address",
      },
    ],
    name: "setFeeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "status",
        type: "bool",
      },
    ],
    name: "setOperator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "sync",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "result",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "updateTokenClaimables",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];
