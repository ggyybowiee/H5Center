<template>
  <div class="index-page">
    <p class="head-title">
      <i class="shopIcon shop-jiantou-copy" @click="goBack()"></i>
      {{$t('优惠券')}}
    </p>

    <div class="main-content">
      <ul v-if="currentPackageLinkConpon.length > 0">
        <li v-for="(item,index) in currentPackageLinkConpon" :key="item.id" :class="[
        {'selected': currentSelectedCouponIndex == index }, 
        {'out-limit-coupon': (item.status != 0) || (item.status == 0 && item.packageCode != _.get(packageSelected, 'packageCode'))}
        ]" @click="selectedCoupon(index, item)">
          <div class="li-div">
            <div class="left-price">
              <span>{{currencyDic[item.currency.toUpperCase()]}}</span>
              <span class="price">{{_.get(item, [item.currency]) | oneDecimal}}</span>
            </div>
            <div class="right-detail">
              <p class="title">{{item.couponTitle}}</p>
              <p class="text" v-if="item.couponEffectType == '1'">{{$t('截止日期')}}: {{item.invalidTime}}</p>
              <p class="text" v-if="item.couponEffectType == '2'">{{item.effectTime}} {{$t('至')}}
                {{item.invalidTime}}
              </p>
              <p class="text">(dd-mm-yyyy)</p>
              <p class="text">{{$t('适用于')}} {{item.packagePlanName}}</p>
              <p class="text discount" v-if="(item.currency.toUpperCase()) != _.get(packageSelected, 'currency')">
                {{$t('可抵扣')}}
                {{currencyDic[_.get(packageSelected, 'currency')]}}
                {{_.get(item, [couponCurrencyDic[_.get(packageSelected, 'currency')]]) | oneDecimal}}</p>
              <p v-if="(item.currency.toUpperCase()) == _.get(packageSelected, 'currency')" style="opacity: 0">空</p>
            </div>


            <img src="../../assets/images/coupon/coupon-unused-en.png" alt=""
              v-if="item.status == 0 && item.packageCode != _.get(packageSelected, 'packageCode') && (lang != 'pt' || lang != 'es')">

            <img src="../../assets/images/coupon/coupon-unused-pt.png" alt=""
              v-if="item.status == 0 && item.packageCode != _.get(packageSelected, 'packageCode') && lang == 'pt'">

            <img src="../../assets/images/coupon/coupon-unused-es.png" alt=""
              v-if="item.status == 0 && item.packageCode != _.get(packageSelected, 'packageCode') && lang == 'es'">


            <img src="../../assets/images/coupon/coupon-used-en.png" alt=""
              v-if="item.status == 1 && (lang != 'pt' || lang != 'es')">

            <img src="../../assets/images/coupon/coupon-used-pt.png" alt="" v-if="item.status == 1 && lang == 'pt'">

            <img src="../../assets/images/coupon/coupon-used-es.png" alt="" v-if="item.status == 1 && lang == 'es'">


            <img src="../../assets/images/coupon/coupon-expired-en.png" alt=""
              v-if="item.status == 2 && (lang != 'pt' || lang != 'es')">

            <img src="../../assets/images/coupon/coupon-expired-pt.png" alt="" v-if="item.status == 2 && lang == 'pt'">

            <img src="../../assets/images/coupon/coupon-expired-es.png" alt="" v-if="item.status == 2 && lang == 'es'">
          </div>
        </li>
      </ul>

      <div v-if="currentPackageLinkConpon.length === 0">
        <div class="coupon-div">
          <div class="pic">
            <img src="../../assets/images/coupon/no-coupon.png" alt />
            <p>{{$t('您还没有优惠券')}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from "../../api/api";
  export default {
    computed: {
      ...Vuex.mapState([
        "currencyDic",
        "couponCurrencyDic",
        "packageSelected",
        "currentPackageLinkConpon"
      ])
    },
    data() {
      return {
        lang: sessionStorage.getItem("lang") ?
          sessionStorage.getItem("lang") : "",
        currentSelectedCouponIndex: '-1'
      };
    },
    mounted() {
      document.title = this.$t("优惠券");

      _.forEach(this.currentPackageLinkConpon, (item) => {
        let offSet = this.moment().utcOffset(); //时差
        let formatArrProperty = ["invalidTime", "effectTime"];

        _.forEach(formatArrProperty, (property) => {
          if (item[property]) {
            item[property] = this.moment(item[property]).add(offSet, 'm').format('DD-MM-YYYY');
          }
        });
      });

      sessionStorage.setItem("couponId", "");
      if (sessionStorage.getItem("currentSelectedCoupon")) {
        let currentSelectedCoupon = JSON.parse(sessionStorage.getItem("currentSelectedCoupon"));
        this.currentSelectedCouponIndex = _.findIndex(this.currentPackageLinkConpon, item => {
          return item.id === _.get(currentSelectedCoupon, 'id');
        });
      }
    },
    directives: {},
    methods: {
      // 选择优惠券
      selectedCoupon(index, item) {
        if (item.status != 0 || (item.status == 0 && item.packageCode != _.get(this.packageSelected, 'packageCode'))) {
          return;
        }

        this.currentSelectedCouponIndex = index;
      },
      // 消息提示
      message(msg) {
        this.$message.closeAll();

        this.$message({
          duration: 4000,
          showClose: true,
          message: `${msg}`,
          type: "",
          iconClass: ""
        });
      },

      goBack() {
        if (Number(this.currentSelectedCouponIndex) > 0) {
          sessionStorage.setItem(
            "currentSelectedCoupon",
            JSON.stringify(this.currentPackageLinkConpon[this.currentSelectedCouponIndex])
          );
        } else {
          sessionStorage.setItem("currentSelectedCoupon", '');
        }

        this.$router.go(-1);
      }
    }
  };

</script>
<style lang="less" scoped>
  .index-page {
    padding: 0;
    font-size: 1.5rem;
    position: relative;
    height: 100vh;
    max-width: 800px;
    margin: 0 auto;
    background: #1d2837;
    color: #fff;
    display: flex;
    flex-direction: column;

    .head-title {
      text-align: center;
      background: #1d2837;
      color: #fff;
      height: 2.75rem;
      line-height: 2.75rem;
      padding: 0.5rem;
      font-size: 1.75rem;

      i {
        position: absolute;
        left: 0rem;
        color: #fff;
        width: 3rem;
        font-size: 1.75rem;
      }
    }

    .main-content {
      overflow: auto;
      background: #f5f5f5;
      height: calc(100vh - 3.75rem);
      padding: 1rem .625rem;

      ul {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        li {
          border: 2px solid #f5f5f5;
          position: relative;
          padding: 2px;
          margin-bottom: 1rem;

          .li-div {
            background: #df2727;
            display: flex;

            .left-price {
              display: flex;
              justify-content: center;
              align-items: center;
              background: url("../../assets/images/coupon/coupon-bg.png") no-repeat center right;
              background-size: cover;
              color: #df2727;
              padding: 0.5rem;
              font-size: 1.4rem;
              flex-basis: 6rem;

              .price {
                font-size: 2.75rem;
              }
            }

            .right-detail {
              flex: 1;
              color: #fff;
              padding: 0.5rem;
              font-size: 1.4rem;
              z-index: 1;

              .title {
                font-size: 1.5rem;
                font-weight: bold;
                margin-bottom: .5rem;
              }

              .discount {
                color: #ffe3ac
              }
            }

            img {
              position: absolute;
              width: 5rem;
              right: 2px;
              bottom: 2px;
            }
          }
        }

        .selected {
          border: 2px solid #3cd977;
        }

        .out-limit-coupon {

          .li-div {
            background: #999;

            .left-price {
              background: url("../../assets/images/coupon/coupon-unused-bg.png") no-repeat center right;
              background-size: cover;
              color: #1f202a;
            }

            .right-detail {
              color: #333;

              .discount {
                color: #333
              }
            }
          }

        }
      }

      .coupon-div {
        color: #666;
        font-size: 1.25rem;

        .pic {
          img {
            width: 80%;
            margin: 0 auto;
            display: block;
            margin-top: 5rem;
          }

          p {
            text-align: center;
            margin-top: 2rem;
          }
        }
      }
    }
  }

</style>
