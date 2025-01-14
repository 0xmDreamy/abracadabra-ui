const moment = require("moment");
const getGlpData = require('./get-glp-data');
const getFeesData = require("./get-fees-data");
const getGlpPerformanceData = require('./get-glp-performance-data');

export async function apy(){
    const pastMonth =  moment().subtract(2, 'month').toDate();
    const groupPeriod = 86400;

    const from = Math.floor(+new Date(pastMonth) / 1000);
    const to = Math.floor(Date.now() / 1000);

    const params = { from, to, groupPeriod };

    const glpData = await getGlpData(params);
    const feesData = await getFeesData(params);

    const glpPerformanceData = await getGlpPerformanceData(glpData, feesData, params);

    console.log(glpPerformanceData);
}