<template>
  <div class="borrow" :class="{ 'borrow-loading': followLink }">
    <template v-if="!followLink">
      <div
        class="deposit-block"
        :class="{ 'ape-bg': isMagicApe }"
        :style="bgApe"
      >
        <h4>Choose Chain</h4>
        <div class="underline">
          <NetworksList />
        </div>

        <div class="collateral-input underline">
          <div class="header-balance">
            <h4>Collateral assets</h4>
            <p v-if="selectedPool">
              {{ maxCollateralValue | formatTokenBalance }}
            </p>
          </div>

          <BaseTokenInput
            :icon="mainValueTokenName"
            :name="mainTokenFinalText"
            v-model="collateralValue"
            :max="maxCollateralValue"
            :error="collateralError"
            :disabled="!selectedPool"
            @input="updateCollateralValue"
            @openTokensList="isOpenPollPopup = true"
            isChooseToken
          />

          <div
            class="checkbox-wrap"
            v-if="acceptUseDefaultBalance"
            :class="{ active: useDefaultBalance }"
            @click="toggleUseDefaultBalance"
          >
            <img
              class="checkbox-img"
              src="@/assets/images/checkbox/active.svg"
              alt=""
              v-if="useDefaultBalance"
            />
            <img
              class="checkbox-img"
              src="@/assets/images/checkbox/default.svg"
              alt=""
              v-else
            />

            <p class="label-text" v-if="networkValuteName">
              Use {{ networkValuteName }}
            </p>
          </div>

          <div
            class="checkbox-wrap"
            v-if="isCheckBox"
            :class="{ active: useCheckBox }"
            @click="toggleCheckBox"
          >
            <img
              class="checkbox-img"
              src="@/assets/images/checkbox/active.svg"
              alt=""
              v-if="useCheckBox"
            />
            <img
              class="checkbox-img"
              src="@/assets/images/checkbox/default.svg"
              alt=""
              v-else
            />
            <p class="label-text">Use {{ selectedPool.name }}</p>
          </div>
        </div>
        <div class="borrow-input underline">
          <div class="header-balance">
            <h4>MIM to Borrow</h4>
          </div>

          <BaseTokenInput
            :name="borrowToken.name"
            :icon="borrowToken.icon"
            v-model="borrowValue"
            :max="maxBorrowValue"
            :error="borrowError"
            :disabled="!selectedPool"
            @input="updateBorrowValue"
          />
        </div>
        <template v-if="selectedPool">
          <div class="deposit-info underline">
            <span>
              <img
                class="tooltip-icon"
                src="@/assets/images/info.svg"
                v-tooltip="ltvTooltip"
                alt="info"
              />
              LTV</span
            >
            <span>{{ calculateLtv }}%</span>
          </div>

          <div class="percent-wrap">
            <PercentageButtons
              :liquidationPrice="depositExpectedLiquidationPrice"
              :collateralValue="collateralValue"
              @onchange="updatePercentValue"
              :maxValue="ltv"
            />
          </div>

          <BalanceBlock :pool="selectedPool" />
        </template>

        <router-link class="link choose-link" :to="{ name: 'MyPositions' }"
          >Go to Positions</router-link
        >
      </div>

      <div
        class="info-block"
        :class="{ 'ape-bg': isMagicApe }"
        :style="bgApeInfo"
      >
        <h1 class="title">
          Borrow
          <img
            class="title-ape"
            src="@/assets/images/ape/ape.png"
            v-if="isMagicApe"
            alt=""
          />
          MIM
        </h1>
        <BorrowPoolStand
          :pool="selectedPool"
          :collateralExpected="collateralValue"
          :mimExpected="mimExpected"
          :liquidationPrice="depositExpectedLiquidationPrice"
          :emptyData="emptyData"
          :poolId="selectedPoolId"
        />

        <CollateralApyBlock
          v-if="selectedPool"
          :pool="selectedPool"
          :isApe="isMagicApe"
        />

        <template v-if="selectedPool">
          <div class="btn-wrap">
            <BaseButton
              @click="approveTokenHandler"
              primary
              :disabled="isTokenApprove"
              >Approve</BaseButton
            >
            <BaseButton
              @click="actionHandler"
              :disabled="actionBtnText === 'Nothing to do'"
              >{{ actionBtnText }}</BaseButton
            >
          </div>

          <div class="info-wrap">
            <InfoBlock :pool="selectedPool" :price="tokenToMim" />
          </div>

          <LeftBorrow :borrowLeft="selectedPool.dynamicBorrowAmount" />
        </template>
      </div>
    </template>

    <BaseLoader v-else />

    <LocalPopupWrap v-model="isOpenPollPopup">
      <MarketsListPopup
        @select="chosePool($event)"
        @close="isOpenPollPopup = false"
        :pools="filteredPool"
        popupType="cauldron"
    /></LocalPopupWrap>
  </div>
</template>

<script>
const NetworksList = () => import("@/components/ui/NetworksList");
const BaseTokenInput = () => import("@/components/base/BaseTokenInput");
const BorrowPoolStand = () => import("@/components/borrow/BorrowPoolStand");
const PercentageButtons = () => import("@/components/borrow/PercentageButtons");
const BalanceBlock = () => import("@/components/borrow/BalanceBlock");
const BaseButton = () => import("@/components/base/BaseButton");
const InfoBlock = () => import("@/components/borrow/InfoBlock");
const LeftBorrow = () => import("@/components/borrow/LeftBorrow");
const BaseLoader = () => import("@/components/base/BaseLoader");
const LocalPopupWrap = () => import("@/components/popups/LocalPopupWrap");
const MarketsListPopup = () => import("@/components/popups/MarketsListPopup");
const CollateralApyBlock = () =>
  import("@/components/borrow/CollateralApyBlock");

import Vue from "vue";

import cauldronsMixin from "@/mixins/borrow/cauldrons.js";
import cookMixin from "@/mixins/borrow/cooksV2.js";
import {
  approveToken,
  isApprowed,
  isTokenApprowed,
} from "@/utils/approveHelpers.js";
import notification from "@/helpers/notification/notification.js";

import { mapGetters } from "vuex";
import bg from "@/assets/images/ape/bg.png";
import bgInfo from "@/assets/images/ape/bg-info.png";

export default {
  mixins: [cauldronsMixin, cookMixin],
  data() {
    return {
      collateralValue: "",
      borrowValue: "",
      poolId: null,
      isOpenPollPopup: false,
      useDefaultBalance: false,
      updateInterval: null,
      emptyData: {
        img: require(`@/assets/images/empty_borrow.png`),
        text: "Choose the asset and amount you want to use as collateral as well as the amount of MIM you want to Borrow",
        bottom: "If you want to learn more read our docs",
        link: "https://docs.abracadabra.money/intro/lending-markets",
      },
      ltvTooltip:
        "Loan to Value: percentage of debt compared to the collateral. The higher it is, the riskier the position",
      glpPoolsId: [2, 3],
      useCheckBox: false,
      bg,
      bgInfo,
    };
  },

  computed: {
    ...mapGetters({
      pools: "getPools",
      account: "getAccount",
    }),

    filteredPool() {
      if (this.account && this.pools[0]?.userInfo) {
        return this.pools
          .filter((pool) => !pool.cauldronSettings.isDepreciated)
          .sort((a, b) =>
            a.userInfo.balanceUsd < b.userInfo.balanceUsd ? 1 : -1
          );
      }

      return this.pools.filter((pool) => !pool.cauldronSettings.isDepreciated);
    },

    selectedPool() {
      if (this.poolId) {
        let pool = this.$store.getters.getPoolById(+this.poolId);
        if (pool) return pool;
        return null;
      }
      return null;
    },

    borrowToken() {
      if (this.selectedPool)
        return {
          name: this.selectedPool.borrowToken.name,
          icon: this.selectedPool.borrowToken.icon,
        };

      return {
        name: "MIM",
        icon: require("@/assets/images/tokens/MIM.png"),
      };
    },

    collateralError() {
      if (isNaN(this.collateralValue)) return "Please input valid value";

      if (
        parseFloat(this.collateralValue) > parseFloat(this.maxCollateralValue)
      )
        return `The value cannot be greater than ${this.maxCollateralValue}`;

      return "";
    },

    borrowError() {
      if (isNaN(this.borrowValue)) return "Please input valid value";

      if (parseFloat(this.borrowValue) > parseFloat(this.maxBorrowValue))
        return `The value cannot be greater than ${this.maxBorrowValue}`;

      return "";
    },

    isLpLogic() {
      return !!this.selectedPool.lpLogic;
    },

    maxCollateralValue() {
      if (this.selectedPool?.userInfo && this.account) {
        if (this.isLpLogic && !this.useCheckBox) {
          return this.$ethers.utils.formatUnits(
            this.selectedPool.userInfo.lpInfo.balance,
            this.selectedPool.lpLogic.lpDecimals
          );
        }

        if (this.useDefaultBalance) {
          return this.$ethers.utils.formatUnits(
            this.selectedPool.userInfo.networkBalance,
            this.selectedPool.collateralToken.decimals
          );
        }

        return this.$ethers.utils.formatUnits(
          this.selectedPool.userInfo.userBalance,
          this.selectedPool.collateralToken.decimals
        );
      }

      return 0;
    },

    maxBorrowValue() {
      if (this.selectedPool?.userInfo && this.account) {
        let valueInDolars;
        let maxPairValue;

        if (this.collateralValue) {
          valueInDolars =
            this.collateralValue / this.selectedPool.borrowToken.exchangeRate;
          maxPairValue = (valueInDolars / 100) * (this.selectedPool.ltv - 1);
        } else {
          valueInDolars =
            this.selectedPool.userInfo.userCollateralShare /
            this.selectedPool.borrowToken.exchangeRate;
          maxPairValue =
            (valueInDolars / 100) * (this.selectedPool.ltv - 1) -
            this.selectedPool.userInfo?.userBorrowPart;
        }

        if (maxPairValue < 0) {
          return 0;
        }

        return maxPairValue;
      }

      return 0;
    },

    actionBtnText() {
      if (!this.isTokenApprove) return "Nothing to do";

      if (this.isUserLocked && +this.collateralValue > 0)
        return "Nothing to do";

      if (this.collateralError || this.borrowError) return "Nothing to do";

      if (
        +this.borrowValue > 0 &&
        +this.collateralValue > 0 &&
        !this.collateralError &&
        !this.borrowError
      )
        return "Add collateral and borrow";

      if (
        +this.collateralValue > 0 &&
        !this.collateralError &&
        !this.borrowError
      )
        return "Add collateral";

      if (+this.borrowValue > 0 && !this.collateralError && !this.borrowError)
        return "Borrow";

      return "Nothing to do";
    },

    isUserLocked() {
      return (
        this.selectedPool.userInfo?.userLockedTimestamp &&
        Number(this.selectedPool.userInfo?.userLockedTimestamp) !== 0
      );
    },

    calculateLtv() {
      if (this.collateralValue && !this.collateralError && !this.borrowError) {
        const percent = this.maxBorrowValue / this.selectedPool.ltv;

        let ltv = this.borrowValue / percent;

        if (ltv > this.selectedPool.ltv) return this.selectedPool.ltv;

        return parseFloat(ltv).toFixed(0);
      }

      if (this.borrowValue && !this.borrowError && !this.collateralError) {
        const tokenToMim =
          this.selectedPool.userInfo?.userCollateralShare /
          this.selectedPool.borrowToken.exchangeRate;
        let ltv =
          Math.round(
            ((+this.borrowValue + +this.selectedPool.userInfo?.userBorrowPart) /
              tokenToMim) *
              100
          ) + 1;

        if (ltv <= this.selectedPool.ltv) {
          return parseFloat(ltv).toFixed(0);
        }
        return this.selectedPool.ltv;
      }

      return 0;
    },

    mimExpected() {
      if (!this.borrowError) return this.borrowValue;

      return 0;
    },

    depositExpectedLiquidationPrice() {
      if (this.selectedPool && this.account) {
        return (
          +this.depositExpectedBorrowed /
            +this.depositExpectedCollateral /
            this.liquidationMultiplier || 0
        );
      }
      return 0;
    },

    depositExpectedBorrowed() {
      if (this.borrowError || this.collateralError)
        return +this.selectedPool.userInfo?.userBorrowPart;
      return +this.borrowValue + +this.selectedPool.userInfo?.userBorrowPart;
    },

    depositExpectedCollateral() {
      if (this.borrowError || this.collateralError)
        return +this.selectedPool.userInfo?.userCollateralShare;
      return (
        +this.collateralValue + +this.selectedPool.userInfo?.userCollateralShare
      );
    },

    liquidationMultiplier() {
      return this.selectedPool.ltv / 100;
    },

    followLink() {
      return !!(this.$route.params.id && !this.pools.length);
    },

    acceptUseDefaultBalance() {
      if (this.selectedPool)
        return this.selectedPool.cauldronSettings.acceptUseDefaultBalance;

      return false;
    },

    networkValuteName() {
      if (this.chainId === 1) return "ETH";
      if (this.chainId === 250) return "FTM";
      if (this.chainId === 137) return "MATIC";
      if (this.chainId === 43114) return "AVAX";
      if (this.chainId === 42161) return "ETH";
      if (this.chainId === 56) return "BNB";

      return false;
    },

    mainValueTokenName() {
      if (this.selectedPool) {
        if (this.networkValuteName === "FTM" && this.useDefaultBalance)
          return require(`@/assets/images/tokens/${this.networkValuteName}2.png`);

        if (this.networkValuteName && this.useDefaultBalance)
          return require(`@/assets/images/tokens/${this.networkValuteName}.png`);

        if (!this.useCheckBox && this.isCheckBox)
          return this.selectedPool.lpLogic.icon;

        return this.selectedPool.icon;
      }
      return "";
    },

    mainTokenFinalText() {
      if (this.selectedPool) {
        if (this.networkValuteName && this.useDefaultBalance)
          return this.networkValuteName;

        if (this.selectedPool.lpLogic && !this.useCheckBox)
          return this.selectedPool.lpLogic.name;

        return this.selectedPool.collateralToken.name;
      }
      return "";
    },

    isTokenApprove() {
      if (this.selectedPool && this.selectedPool.userInfo && this.account) {
        if (this.isLpLogic && !this.useCheckBox)
          return this.selectedPool.userInfo.lpInfo.isApprove;

        return this.selectedPool.userInfo.isApproveTokenCollateral;
      }

      return true;
    },

    ltv() {
      if (this.selectedPool) {
        return this.selectedPool.ltv;
      }
      return 0;
    },

    selectedPoolId() {
      if (this.selectedPool) return this.selectedPool.id;

      return null;
    },

    tokenToMim() {
      if (this.selectedPool) {
        const tokenToMim = 1 / this.selectedPool.borrowToken.exchangeRate;

        let decimals = 4;

        if (this.selectedPool.name === "SHIB") decimals = 6;

        return Vue.filter("formatToFixed")(tokenToMim, decimals);
      }
      return "0.0";
    },

    isCheckBox() {
      return (
        (this.chainId === 42161 && this.selectedPool?.id === 3) ||
        (this.chainId === 1 && this.selectedPool?.id === 39)
      );
    },

    isMagicApe() {
      return this.selectedPool?.id === 39;
    },

    bgApe() {
      return this.isMagicApe ? `background-image: url(${this.bg})` : "";
    },

    bgApeInfo() {
      return this.isMagicApe ? `background-image: url(${this.bgInfo})` : "";
    },
  },

  watch: {
    account() {
      this.createPools();
    },

    pools() {
      if (this.poolId) {
        let pool = this.$store.getters.getPoolById(+this.poolId);
        if (!pool) this.$router.push(`/borrow`);
      }

      return false;
    },
  },

  methods: {
    updateCollateralValue(value) {
      this.collateralValue = value;
    },

    updateBorrowValue(value) {
      this.borrowValue = value;
    },

    async approveTokenHandler() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.approvePending
      );
      let approve;

      const collateralToken =
        this.isLpLogic && !this.useCheckBox
          ? this.selectedPool.lpLogic.lpContract
          : this.selectedPool.collateralToken.contract;

      if (this.isLpLogic) {
        approve = await approveToken(
          collateralToken,
          this.selectedPool.masterContractInstance.address
        );
      } else {
        approve = await approveToken(
          collateralToken,
          this.selectedPool.masterContractInstance.address
        );
      }

      if (approve) {
        await this.$store.commit("notifications/delete", notificationId);
      } else {
        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch(
          "notifications/new",
          notification.approveError
        );
      }

      return false;
    },

    async chosePool(pool) {
      this.clearData();

      this.useDefaultBalance = false;

      this.poolId = pool.id;

      let duplicate = this.$route.fullPath === `/borrow/${pool.id}`;

      if (!duplicate) {
        this.$router.push(`/borrow/${pool.id}`);
      }
    },

    checkIsPoolAllowBorrow(amount, notificationId) {
      let dynamicBorrowAmount;
      let borrowlimit;

      if (+this.selectedPool.borrowlimit) {
        borrowlimit = +amount < +this.selectedPool.borrowlimit;
      } else {
        borrowlimit = true;
      }

      dynamicBorrowAmount = +amount < +this.selectedPool.dynamicBorrowAmount;

      if (dynamicBorrowAmount && borrowlimit) return true;

      if (notificationId) {
        this.$store.commit("notifications/delete", notificationId);
      }

      if (!dynamicBorrowAmount) {
        this.$store.dispatch("notifications/new", notification.allowBorrow);
      } else {
        this.$store.dispatch("notifications/new", notification.borrowLimit);
      }

      return false;
    },

    checkIsUserWhitelistedBorrow() {
      if (!this.selectedPool.userInfo?.whitelistedInfo) return true;

      if (!this.selectedPool.userInfo?.whitelistedInfo?.isUserWhitelisted) {
        const notification = {
          msg: "Your wallet is not currently whitelisted. Please try again once the whitelist is removed.",
          type: "error",
        };

        this.$store.dispatch("notifications/new", notification);

        return false;
      }

      return true;
    },

    checkIsAcceptNewYvcrvSTETHBorrow() {
      if (this.selectedPool.id === 33 && this.chainId === 1) {
        const oldYvCrvSTETH = this.$store.getters.getPoolById(12);
        const hasOpenedBorrowPosition = +oldYvCrvSTETH.userBorrowPart > 50;

        if (hasOpenedBorrowPosition) {
          const notification = {
            msg: "Please close down your old yvcrvSTETH position before opening a new one.",
            type: "error",
          };

          this.$store.dispatch("notifications/new", notification);

          return false;
        }

        return true;
      }

      return true;
    },

    async actionHandler() {
      if (
        +this.borrowValue > 0 &&
        +this.collateralValue > 0 &&
        !this.collateralError &&
        !this.borrowError
      ) {
        this.collateralAndBorrowHandler();
        return false;
      }

      if (
        +this.collateralValue > 0 &&
        !this.collateralError &&
        !this.borrowError
      ) {
        this.collateralHandler();
        return false;
      }

      if (+this.borrowValue > 0 && !this.collateralError && !this.borrowError) {
        this.borrowHandler();
        return false;
      }
    },

    async collateralAndBorrowHandler() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );

      const collateralDecimals =
        this.isLpLogic && !this.useCheckBox
          ? this.selectedPool.lpLogic.lpDecimals
          : this.selectedPool.collateralToken.decimals;

      const parsedCollateral = this.$ethers.utils.parseUnits(
        this.collateralValue.toString(),
        collateralDecimals
      );

      if (!this.checkIsPoolAllowBorrow(+this.borrowValue, notificationId)) {
        return false;
      }

      const parsedBorrow = this.$ethers.utils.parseUnits(
        Vue.filter("formatToFixed")(
          this.borrowValue,
          this.selectedPool.borrowToken.decimals
        ),
        this.selectedPool.borrowToken.decimals
      );

      const payload = {
        collateralAmount: parsedCollateral,
        amount: parsedBorrow,
        updatePrice: this.selectedPool.askUpdatePrice,
        itsDefaultBalance: this.useDefaultBalance,
      };

      const collateralToken =
        this.isLpLogic && !this.useCheckBox
          ? this.selectedPool.lpLogic.lpContract
          : this.selectedPool.collateralToken.contract;

      let isTokenToCookApprove = await isTokenApprowed(
        collateralToken,
        this.selectedPool.masterContractInstance.address,
        this.account
      );

      if (isTokenToCookApprove.lt(payload.collateralAmount)) {
        isTokenToCookApprove = await approveToken(
          collateralToken,
          this.selectedPool.masterContractInstance.address
        );
      }

      let isApproved = await isApprowed(this.selectedPool, this.account);

      if (+isTokenToCookApprove) {
        await this.cookAddCollateralAndBorrow(
          payload,
          isApproved,
          this.selectedPool,
          notificationId,
          this.isLpLogic,
          !this.useCheckBox
        );

        return false;
      }

      await this.$store.commit("notifications/delete", notificationId);
      await this.$store.dispatch(
        "notifications/new",
        notification.approveError
      );

      return false;
    },

    async collateralHandler() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );

      const collateralDecimals =
        this.isLpLogic && !this.useCheckBox
          ? this.selectedPool.lpLogic.lpDecimals
          : this.selectedPool.collateralToken.decimals;

      const parsedCollateralValue = this.$ethers.utils.parseUnits(
        this.collateralValue.toString(),
        collateralDecimals
      );

      const payload = {
        amount: parsedCollateralValue,
        updatePrice: this.selectedPool.askUpdatePrice,
        itsDefaultBalance: this.useDefaultBalance,
      };

      const collateralToken =
        this.isLpLogic && !this.useCheckBox
          ? this.selectedPool.lpLogic.lpContract
          : this.selectedPool.collateralToken.contract;

      let isTokenToCookApprove = await isTokenApprowed(
        collateralToken,
        this.selectedPool.masterContractInstance.address,
        this.account
      );

      if (isTokenToCookApprove.lt(payload.amount)) {
        isTokenToCookApprove = await approveToken(
          collateralToken,
          this.selectedPool.masterContractInstance.address
        );
      }

      let isApproved = await isApprowed(this.selectedPool, this.account);

      if (+isTokenToCookApprove) {
        await this.cookAddCollateral(
          payload,
          isApproved,
          this.selectedPool,
          notificationId,
          this.isLpLogic,
          !this.useCheckBox
        );
        return false;
      }

      await this.$store.commit("notifications/delete", notificationId);
      await this.$store.dispatch(
        "notifications/new",
        notification.approveError
      );

      return false;
    },

    async borrowHandler() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );

      if (!this.checkIsPoolAllowBorrow(+this.borrowValue, notificationId)) {
        return false;
      }

      if (!this.checkIsUserWhitelistedBorrow()) {
        return false;
      }

      if (!this.checkIsAcceptNewYvcrvSTETHBorrow()) {
        return false;
      }

      const parsedBorrowValue = this.$ethers.utils.parseUnits(
        Vue.filter("formatToFixed")(
          this.borrowValue,
          this.selectedPool.borrowToken.decimals
        ),
        this.selectedPool.borrowToken.decimals
      );

      const payload = {
        amount: parsedBorrowValue,
        updatePrice: this.selectedPool.askUpdatePrice,
      };

      const collateralToken =
        this.isLpLogic && !this.useCheckBox
          ? this.selectedPool.lpLogic.lpContract
          : this.selectedPool.collateralToken.contract;

      let isTokenToCookApprove = await isTokenApprowed(
        collateralToken,
        this.selectedPool.masterContractInstance.address,
        this.account
      );

      if (isTokenToCookApprove.eq(0)) {
        isTokenToCookApprove = await approveToken(
          collateralToken,
          this.selectedPool.masterContractInstance.address
        );
      }

      let isApproved = await isApprowed(this.selectedPool, this.account);

      if (+isTokenToCookApprove) {
        await this.cookBorrow(
          payload,
          isApproved,
          this.selectedPool,
          notificationId
        );

        return false;
      }

      await this.$store.commit("notifications/delete", notificationId);
      await this.$store.dispatch(
        "notifications/new",
        notification.approveError
      );

      return false;
    },

    toggleUseDefaultBalance() {
      this.clearData();

      this.useDefaultBalance = !this.useDefaultBalance;
    },

    clearData() {
      this.collateralValue = "";
      this.borrowValue = "";
    },

    updatePercentValue(value) {
      if (this.collateralValue && value) {
        const newBorrowValue =
          (this.maxBorrowValue * value) / this.selectedPool.ltv;
        this.borrowValue =
          +newBorrowValue > +this.maxBorrowValue
            ? this.maxBorrowValue
            : newBorrowValue;
      } else {
        this.borrowValue = "";
      }
    },

    toggleCheckBox() {
      this.clearData();
      this.useCheckBox = !this.useCheckBox;
    },
  },

  created() {
    this.poolId = this.$route.params.id;

    this.updateInterval = setInterval(async () => {
      this.createPools();
    }, 15000);
  },

  beforeDestroy() {
    clearInterval(this.updateInterval);
  },

  components: {
    NetworksList,
    BaseTokenInput,
    BorrowPoolStand,
    PercentageButtons,
    BalanceBlock,
    BaseButton,
    InfoBlock,
    LeftBorrow,
    BaseLoader,
    LocalPopupWrap,
    MarketsListPopup,
    CollateralApyBlock,
  },
};
</script>

<style lang="scss" scoped>
.borrow {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 30px;
  margin: 0 auto;
  max-width: calc(100% - 20px);
  width: 95%;
  padding: 100px 0;
}

.primary-api {
  margin: 16px 0;
}

.borrow-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.deposit-block {
  padding: 30px 30px 50px;
  border-radius: 30px;
  background-color: $clrBg2;
  max-width: 100%;
  overflow: hidden;
  position: relative;
}

.ape-bg {
  background-position: center;
  background-size: cover;
}

.underline {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.collateral-input {
  padding-top: 27px;
  padding-bottom: 24px;
}

.borrow-input {
  padding-top: 27px;
  padding-bottom: 14px;
}

.deposit-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 25px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 25px;
  padding-bottom: 12px;
}

.deposit-info span {
  display: flex;
  align-items: center;
  line-height: 24px;
}

.tooltip-icon {
  margin-right: 5px;
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.percent-wrap {
  padding: 30px 0;
}

.choose-link {
  position: absolute;
  bottom: 10px;
  right: 0;
  left: 0;
  margin: 0 auto;
}

.info-block {
  min-height: 520px;
  padding: 30px;
  border-radius: 30px;
  background-color: $clrBg2;
  text-align: center;
}

.title {
  font-size: 24px;
  text-transform: uppercase;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-ape {
  max-width: 27px;
  margin: 0 10px;
}

.btn-wrap {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  margin-bottom: 30px;
}

.checkbox-wrap {
  background: #333141;
  border-radius: 20px;
  padding: 8px 16px;
  display: inline-flex;
  align-items: center;
  border: 2px solid transparent;
  cursor: pointer;

  &.active {
    border: 2px solid #8180ff;
  }

  .label-text {
    cursor: pointer;
  }

  .checkbox-img {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
}

.info-wrap {
  margin-bottom: 20px;
}

@media (max-width: 1200px) {
  .borrow {
    grid-gap: 15px;
  }

  .info-block {
    padding: 30px 20px;
  }

  .deposit-block {
    padding: 30px 15px 50px;
  }
}

@media (max-width: 600px) {
  .borrow {
    grid-gap: 20px;
  }

  .collateral-input {
    padding: 20px 0 15px;
  }

  .choose-link {
    bottom: 15px;
  }

  .info-block {
    padding: 20px 10px;
    min-height: auto;
  }

  .title {
    margin-bottom: 20px;
  }

  .btn-wrap {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
  }
}

@media (max-width: 375px) {
  .btn-wrap {
    grid-gap: 10px;

    .default-button {
      padding: 0 10px;
    }
  }
}

@media (min-width: 1024px) {
  .borrow {
    grid-template-columns: 550px 1fr;
    width: 1320px;
  }

  .choose {
    padding: 30px;
  }
}
</style>
