import stakeInfo from "@/utils/contracts/sSpellStakesInfo.js";
// import moment from "moment";
import { mapMutations } from "vuex";
// import { ethers } from "ethers";
import { getSpellStakingApr, getTokensRate } from "@/helpers/spellStakingApr";

export default {
  data() {
    return {
      spellPrice: null,
    };
  },
  computed: {
    chainId() {
      return this.$store.getters.getChainId;
    },
    signer() {
      return this.$store.getters.getSigner;
    },
    account() {
      return this.$store.getters.getAccount;
    },
  },
  methods: {
    ...mapMutations({ setLoadingSSpellStake: "setLoadingSSpellStake" }),
    async createStakePool() {
      this.setLoadingSSpellStake(true);
      if (this.account) {
        if (!stakeInfo) {
          this.setLoadingSSpellStake(false);
          return false;
        }

        if (this.chainId !== 1) {
          this.setLoadingSSpellStake(false);
          return false;
        }
        console.log("ethers", this.$ethers)
        const { mainToken, stakeToken } = stakeInfo;

        const mainTokenInstance = new this.$ethers.Contract(
          mainToken.address,
          JSON.stringify(mainToken.abi),
          this.signer
        );
        console.log("mainTokenInstance", mainTokenInstance)
        let mainTokenBalance = await mainTokenInstance.balanceOf(this.account);

        mainTokenBalance = this.$ethers.utils.formatEther(
          mainTokenBalance.toString()
        );

        const stakeTokenInstance = new this.$ethers.Contract(
          stakeToken.address,
          JSON.stringify(stakeToken.abi),
          this.signer
        );
        console.log("mainTokenInstance", stakeTokenInstance)
        let stakeTokenBalance = await stakeTokenInstance.balanceOf(
          this.account
        );
        
        stakeTokenBalance = this.$ethers.utils.formatEther(
          stakeTokenBalance.toString()
        );
        console.log("stakeTokenBalance",stakeTokenBalance)
        let tokensRate;
        try {
           tokensRate = await getTokensRate();
        } catch (error) {
          console.log("tokensRateError",error)
        }

        let stakeTokenPrice, mainTokenPrice;
        try {
          stakeTokenPrice = this.spellPrice
            ? this.spellPrice
            : await this.getTokenPrice("Spell");

          mainTokenPrice = +stakeTokenPrice * +tokensRate;
        } catch (e) {
          console.log("FETCH SPELL PRICE ERR:", e);

          stakeTokenPrice = null;
          mainTokenPrice = null;
        }

        let { tvl } = await this.getSpellApr(
          mainTokenInstance,
          stakeTokenInstance
        );
        
        console.log("tvl",tvl)
        // const startDate = moment("2021-5-25");
        // const date = moment();

        // const dayDiff = date.diff(startDate, "days");

        // const aprNew = (((tokensRate - 1) * 100) / dayDiff) * 365;
          
        const { sSpellApr } = await getSpellStakingApr();
        console.log("sSpellApr",sSpellApr);
        let isTokenApprowed;
        try {
          isTokenApprowed = await this.isTokenApprowed(
            stakeTokenInstance,
            this.account,
            mainToken.address
          );
        } catch (error) {
          console.log("isTokenApprowed", error)
        }
        console.log("isTokenApprowed",isTokenApprowed);

        const stakeObject = {
          tokensRate,
          apr: parseFloat(sSpellApr).toFixed(4),
          tvl,
          mainToken: {
            ...mainToken,
            contractInstance: mainTokenInstance,
            balance: mainTokenBalance,
            price: mainTokenPrice,
          },
          stakeToken: {
            ...stakeToken,
            contractInstance: stakeTokenInstance,
            balance: stakeTokenBalance,
            isTokenApprowed,
            price: stakeTokenPrice,
          },
        };
        this.setLoadingSSpellStake(false);
        console.log("stakeObject",stakeObject)
        this.$store.commit("setSSpellObject", stakeObject);
      } else {
        this.setLoadingSSpellStake(false);
      }
    },
    async getSpellRate(spellContract, sspellContract) {
      try {
        const sspellBalance = await spellContract.balanceOf(
          sspellContract.address
        );
        const totalSupply = await sspellContract.totalSupply();

        const parsedBalance = this.$ethers.utils.formatEther(
          sspellBalance.toString()
        );
        const parsedTotalSupply = this.$ethers.utils.formatEther(totalSupply);

        const tokenRate = parsedBalance / parsedTotalSupply;

        return tokenRate;
      } catch (e) {
        console.log("getSpellRate err:", e);
      }
    },
    async isTokenApprowed(tokenContract, userAddr, approveAddr) {
      try {
        const addressApprowed = await tokenContract.allowance(
          userAddr,
          approveAddr,
          {
            gasLimit: 1000000,
          }
        );

        return parseFloat(addressApprowed.toString()) > 0;
      } catch (e) {
        console.log("SPELL isApprowed err:", e);
        return false;
      }
    },
    async getSpellApr(mainTokenContract, stakeTokenContract) {
      try {
        let spellPrice = this.spellPrice
          ? this.spellPrice
          : await this.getTokenPrice("Spell");

        const tokenCount =
          (977704.87 + 131899.08 + 58477.01 + 737592.22) / spellPrice;

        const strangeNumber = this.$ethers.utils.parseUnits(
          parseFloat(tokenCount).toFixed(18),
          18
        );

        let spellPer1000Bucks = this.$ethers.utils.parseUnits(
          parseFloat(1000 / spellPrice).toFixed(18),
          18
        );

        let totalTokens = await stakeTokenContract.balanceOf(
          mainTokenContract.address
        );

        const sSpellTLV = this.$ethers.utils.formatUnits(totalTokens, 18);

        let totalSupply = await mainTokenContract.totalSupply();

        let shares = totalSupply.eq(0)
          ? spellPer1000Bucks
          : spellPer1000Bucks.mul(totalSupply).div(totalTokens);

        totalTokens = totalTokens.add(spellPer1000Bucks).add(strangeNumber);
        totalSupply = totalSupply.add(shares);

        let amount = shares.mul(totalTokens).div(totalSupply);

        let withdrawInUsd =
          this.$ethers.utils.formatUnits(amount, 18) * spellPrice;

        const apr = (withdrawInUsd * 100) / 1000;

        return {
          apr: parseFloat(apr - 100).toFixed(2),
          tvl: parseFloat(sSpellTLV).toFixed(2),
        };
      } catch (e) {
        console.log("getNiceApr err:", e);
      }
    },

  },
};