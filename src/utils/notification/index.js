export default {
  approve: {
    pending: {
      title: "Pending",
      discription: "Approve in progress",
      type: "pending",
    },
    error: {
      title: "Error",
      msg: "Unexpected Error",
      type: "error",
    },
  },
  transaction: {
    pending: {
      title: "Pending",
      discription: "Transaction in progress",
      type: "pending",
    },
    successAddCollateral: {
      title: "Success",
      discription: "Thanks for taking part in the innovation of MIM.",
      msg: `Consider yourself extremely early in taking part in
        creating the stablecoin that has no bias and knows no walls.
        $MIM- stable for everyone, everywhere.`,
      type: "success",
    },
    success: {
      title: "Success",
      msg: `Transaction Success`,
      type: "success",
    },
    error: {
      title: "Error",
      msg: "Transaction in error",
      type: "error",
    },

    liquidation: {
      title: "Error",
      msg: "Opening such position will put you at an instant liquidation flag.",
      type: "error",
    },
  },

  allowBorrow: {
    title: "Info",
    msg: "This Lending Market has reached its MIM borrowable limit, please wait for the next MIM replenish to borrow more!",
    type: "info",
  },

  userDenied: {
    title: "Error",
    msg: "User denied transaction signature.",
    type: "error",
  },
  bridgeNotAvailable: {
    title: "Error",
    msg: "The bridge is not available on this network",
    type: "error",
  },
};