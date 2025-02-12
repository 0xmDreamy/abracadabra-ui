<template>
  <div class="wrapper">
    <img
      class="button-up"
      src="@/assets/images/button-up.svg"
      @click="scrollToTop"
      v-if="showButtonUp"
      alt=""
    />
    <h2 class="title">Available Cauldrons</h2>

    <EmptyMarketsList v-if="!borrowPools.length && !borrowLoading" />
    <div v-else-if="!borrowPools.length && borrowLoading" class="loader-wrap">
      <BaseLoader />
    </div>
    <div v-else class="stats-wrap">
      <div class="tools-wrap">
        <div class="search-wrap">
          <img
            class="search-icon"
            src="@/assets/images/search.svg"
            alt="search"
          />
          <input
            v-model="search"
            type="text"
            placeholder="Search"
            class="search-input"
          />
        </div>

        <DropdownWrap class="dropdown">
          <template slot="btn">
            <button class="sort-btn open-btn">
              <span class="sort-title-wrap">
                <button
                  @click.stop="sortReverse = !sortReverse"
                  @mousedown.prevent.stop=""
                  class="sort-icon-wrap"
                >
                  <img
                    class="sort-icon"
                    :class="{ 'sort-icon-reverse': sortReverse }"
                    src="@/assets/images/filter.svg"
                    alt="filter"
                  />
                </button>
                <span>{{ `Sorted by ${selectedSortData.title}` }}</span>
              </span>
              <img
                class="arrow-icon"
                src="@/assets/images/arrow-down.svg"
                alt="filter"
              />
            </button>
          </template>
          <template slot="list">
            <button
              class="sort-btn sort-item"
              v-for="(titleData, i) in sortList.filter(
                ({ name }) => name !== selectedSort
              )"
              :key="i"
              @click="select(titleData.name)"
            >
              {{ titleData.title }}
            </button>
          </template>
        </DropdownWrap>
        <div class="active-markets">
          active markets only
          <CheckBox @update="toggleActiveMarkets" :value="isActiveMarkets" />
        </div>
      </div>
      <div class="stats-list-wrap">
        <div class="stats-list-header">
          <div v-for="(title, i) in headers" :key="i">{{ title }}</div>
        </div>

        <template v-if="filteredPools.length">
          <CauldronItem
            v-for="pool in filteredPools"
            :key="pool.id"
            :pool="pool"
          />
        </template>
        <EmptyMarketsList v-else />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import cauldronsMixin from "@/mixins/borrow/cauldrons.js";
const BaseLoader = () => import("@/components/base/BaseLoader");
const EmptyMarketsList = () => import("@/components/markets/EmptyMarketsList");
const DropdownWrap = () => import("@/components/ui/DropdownWrap");
const CauldronItem = () => import("@/components/markets/CauldronItem");
const CheckBox = () => import("@/components/ui/CheckBox");
const sortKeys = {
  name: "name",
  yield: "yield",
  roi: "roi",
  tvl: "tvl",
  totalMim: "totalMim",
  mimsLeft: "mimsLeft",
  interest: "interest",
  liquidation: "liquidation",
};

export default {
  mixins: [cauldronsMixin],
  data() {
    return {
      selectedSort: sortKeys.mimsLeft,
      sortReverse: false,
      search: "",
      poolsInterval: null,
      isActiveMarkets: true,
      scrollPosition: 0,
    };
  },

  computed: {
    ...mapGetters({
      borrowPools: "getPools",
      borrowLoading: "getLoadPoolsBorrow",
    }),

    showButtonUp() {
      return this.borrowPools.length && this.scrollPosition !== 0;
    },

    selectedSortData() {
      return (
        this.sortList.find(({ name }) => this.selectedSort === name) || null
      );
    },

    sortList() {
      return [
        { title: "Title", name: sortKeys.name },
        { title: "TVL", name: sortKeys.totalMim },
        { title: "MIMs Left", name: sortKeys.mimsLeft },
        { title: "Interest", name: sortKeys.interest },
        { title: "Fee", name: sortKeys.liquidation },
      ];
    },

    filteredPools() {
      return this.sortByDepreciate(
        this.sortByTitle(this.filterBySearch(this.borrowPools, this.search))
      );
    },

    headers() {
      return [
        "CHAIN",
        "COLLATERAL",
        "TOTAL MIM BORROWED",
        "TVL",
        "MIMS LEFT TO BORROW",
        "INTEREST",
      ];
    },
  },

  methods: {
    select(name) {
      this.selectedSort = name;
    },

    filterBySearch(pools, search) {
      return search
        ? pools.filter(
            (pool) =>
              pool.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
          )
        : pools;
    },

    sortByTitle(pools) {
      const sortedPools = [...pools];
      if (this.selectedSortData !== null) {
        const prepValue = (pool, sortData) => {
          switch (sortData.name) {
            case sortKeys.name:
              return pool.name;

            case sortKeys.yield:
              return +pool.poolYield;

            case sortKeys.roi:
              return +pool.poolRoi;

            case sortKeys.tvl:
              return +pool.poolTvl;

            case sortKeys.totalMim:
              return +pool.totalBorrow;

            case sortKeys.mimsLeft:
              return +pool.dynamicBorrowAmount;

            case sortKeys.interest:
              return +pool.interest;

            case sortKeys.liquidation:
              return +pool.stabilityFee;
          }

          return null;
        };
        sortedPools.sort((aPool, bPool) => {
          const a = prepValue(aPool, this.selectedSortData);
          const b = prepValue(bPool, this.selectedSortData);

          const factor = this.sortReverse ? -1 : 1;

          if (this.selectedSort === sortKeys.name)
            return a < b ? -factor : factor;

          return a < b ? factor : -factor;
        });
      }

      return sortedPools;
    },

    sortByDepreciate(pools = []) {
      if (this.isActiveMarkets) {
        return pools.filter((pool) => {
          if (pool?.cauldronSettings)
            return !pool.cauldronSettings.isDepreciated;
          return !pool.isDepreciated;
        });
      } else {
        return pools.sort((a, b) => {
          if (a?.cauldronSettings || b?.cauldronSettings) {
            return (
              +a.cauldronSettings.isDepreciated -
              +b.cauldronSettings.isDepreciated
            );
          }

          return +a.isDepreciated - +b.isDepreciated;
        });
      }
    },

    toggleActiveMarkets() {
      this.isActiveMarkets = !this.isActiveMarkets;
    },

    depreciatedPools() {
      return this.pools.filter((pool) => pool.isDepreciated);
    },

    scrollToTop() {
      window.scrollTo(0, 0);
    },

    onScroll() {
      this.scrollPosition = window.scrollY;
    },
  },

  async created() {
    this.poolsInterval = setInterval(await this.createPools(), 5000);
    window.addEventListener("scroll", this.onScroll);
  },

  beforeDestroy() {
    clearInterval(this.poolsInterval);
    window.removeEventListener("scroll", this.onScroll);
  },
  components: {
    EmptyMarketsList,
    BaseLoader,
    DropdownWrap,
    CauldronItem,
    CheckBox,
  },
};
</script>

<style lang="scss" scoped>
.button-up {
  position: fixed;
  right: 10%;
  bottom: 10%;
  z-index: 9;
  cursor: pointer;
}
.wrapper {
  padding-top: 160px;
  padding-bottom: 100px;
  margin: 0 auto;
  width: 940px;
  max-width: calc(100% - 20px);
  box-sizing: border-box;
  scroll-behavior: smooth;
}

.title {
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 40px;
}
.tools-wrap {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 10px;
  margin-bottom: 10px;
}

.dropdown {
  grid-column: auto / span 1;
  &:focus-within {
    .open-btn {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      background-color: #55535d;
      color: white !important;
    }
    .sort-btn {
      background-color: #55535d;
      &:hover {
        color: #76c3f5;
      }
    }
  }
}

.open-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 20px;
  padding: 0 17px 0 12px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.06);

  &:hover {
    background-color: #55535d;
  }

  .sort-icon {
    width: 20px;
    &-reverse {
      transform: rotate(180deg);
    }
    &-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: transparent;
      border: none;
      cursor: pointer;

      margin-right: 10px;
    }
  }

  .arrow-icon {
    margin-left: 25px;
  }
}

.sort-btn {
  height: 50px;
  color: white;
  cursor: pointer;
  border: none;
}

.sort-title-wrap {
  display: flex;
  align-items: center;
}

.sort-item {
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
  }
}

.search-wrap {
  display: grid;
  grid-template-columns: 30px auto;
  align-items: center;
  padding-left: 10px;
  background-color: rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  height: 50px;
  grid-column: auto / span 1;

  .search-icon {
    width: 20px;
    pointer-events: none;
  }

  .search-input {
    background-color: transparent;
    border: none;
    outline: none;
    color: white;
    width: 100%;

    &::placeholder {
      color: white;
    }
  }
}

.stats-list-wrap {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 10px;
  grid-column: 1;
  margin-top: 10px;
}

.stats-list-header {
  display: none;
  grid-template-columns: 0.5fr 1.5fr 1fr 1fr 1fr 1fr 180px;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  font-size: 14px;
  border-radius: 30px;
  background-color: #2a2835;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;

  &-farm {
    grid-template-columns: 1fr 1fr 1fr 1fr 60px;
  }
}
.loader-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
}

.active-markets {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px;
  font-size: 16px;
  line-height: 24px;
}

@media (min-width: 768px) {
  .dropdown {
    grid-column: auto / span 5;
  }
  .search-wrap {
    grid-column: auto / span 3;
  }
  .active-markets {
    grid-column: auto / span 4;
  }
  .tools-wrap {
    grid-template-columns: repeat(12, 1fr);
  }
}

@media (min-width: 1024px) {
  .dropdown {
    grid-column: auto / span 5;
  }
  .search-wrap {
    grid-column: auto / span 4;
  }
  .active-markets {
    grid-column: auto / span 3;
  }
  .stats-list-wrap {
    grid-column: 1 / 5;
    margin-top: 0;
  }
  .stats-list-header {
    display: grid;
  }
}

@media screen and (max-width: 767px) {
  .active-markets {
    justify-content: center;
  }
}
</style>
