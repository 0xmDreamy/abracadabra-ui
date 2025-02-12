const adjustForDecimals = require('../utils/adjust-for-decimals');
const getFeeBasisPoints = require('./get-fee-basis-points');
const bigNumberify = require('../utils/big-numberify');
const { GLP_DECIMALS, PRECISION, BASIS_POINTS_DIVISOR, TAX_BASIS_POINTS, MINT_BURN_FEE_BASIS_POINTS } = require('../constants');

module.exports = (toAmount, fromTokenAddress, infoTokens, glpPrice, usdgSupply, totalTokenWeights) => {
    const defaultValue = { amount: bigNumberify(0) };
    if (!toAmount || !fromTokenAddress || !infoTokens || !glpPrice || !usdgSupply || !totalTokenWeights) {
        return defaultValue;
    }

    const fromToken = infoTokens[fromTokenAddress];
    if (!fromToken || !fromToken.minPrice) {
        return defaultValue;
    }

    let fromAmount = toAmount.mul(glpPrice).div(fromToken.minPrice);
    fromAmount = adjustForDecimals(fromAmount, GLP_DECIMALS, fromToken.decimals);

    const usdgAmount = toAmount.mul(glpPrice).div(PRECISION);
    const feeBasisPoints = getFeeBasisPoints(
        fromToken,
        fromToken.usdgAmount,
        usdgAmount,
        MINT_BURN_FEE_BASIS_POINTS,
        TAX_BASIS_POINTS,
        true,
        usdgSupply,
        totalTokenWeights
      );
    
      fromAmount = fromAmount.mul(BASIS_POINTS_DIVISOR).div(BASIS_POINTS_DIVISOR - feeBasisPoints);
    
    return { amount: fromAmount, feeBasisPoints };
}