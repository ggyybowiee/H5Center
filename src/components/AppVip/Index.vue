<template>
  <div class="index-page">
    <p class="head-title">
      {{$t('我的会员')}}
    </p>
    <div class="main-content">
      <div class="user-header">
        <img class="user-icon" src="../../assets/images/default-user-icon.png" alt="">
        <div class="account-info">
          <span class="account-text">Account: {{urlParams.userId}}</span>
          <span v-if="urlParams.userIdentify == 2">
            <img src="../../assets/images/vip-expire.png" alt="">
          </span>
          <span v-if="urlParams.userIdentify == 3" style="color: #f7bd46">{{$t('体验期')}}</span>
          <span v-if="urlParams.userIdentify == 4">
            <img src="../../assets/images/vip.png" alt="">
          </span>
        </div>
      </div>

      <div class="plans">
        <p class="sub-title">
          <span class="first">{{$t('会员服务')}}</span>
          <span class="second" @click="toIndex()">{{$t('购买服务')}}</span>
        </p>

        <div class="service">
          <p class="service-title">{{$t('直播服务')}}</p>
          <div class="content">
            <p class="sub-content-title">{{$t('所有直播频道，7天频道回看、限制级直播')}}</p>

            <div v-if="urlParams.userIdentify != 3 && liveServiceObj.productCode">
              <p>
                {{$t('服务到期时间')}}:
                <span class="value">{{liveServiceObj.invalidTime}}</span>
              </p>

              <p>
                {{$t('剩余天数')}}:
                <span class="value">{{liveServiceObj.authDay}}
                  {{liveServiceObj.authDay > 1 ? $t('复数天') : $t('天')}}</span>
              </p>

              <p>
                {{$t('服务状态')}}:
                <span class="value" style="color: #cc1d19" v-if="liveServiceObj.serviceStatus == 0">{{$t('过期')}}</span>
                <span class="value" style="color: #3cd977" v-if="liveServiceObj.serviceStatus == 1">{{$t('正常')}}</span>
              </p>
            </div>

            <div v-if="urlParams.userIdentify == 3 || !liveServiceObj.productCode" class="unpurchased">
              <img src="../../assets/images/unpurchased-en.png" alt="" v-if="urlParams.lang == 'en'">
              <img src="../../assets/images/unpurchased-pt.png" alt="" v-if="urlParams.lang == 'pt'">
              <img src="../../assets/images/unpurchased-es.png" alt="" v-if="urlParams.lang == 'es'">
            </div>

          </div>
        </div>

        <div class="service" style="margin-bottom: 0;">
          <p class="service-title">{{$t('点播服务')}}</p>
          <div class="content">
            <p class="sub-content-title">{{$t('海量点播资源，包含：电影、电视剧、少儿、动漫、3D、纪实、民族、限制级点播')}}</p>

            <div v-if="urlParams.userIdentify != 3 && vodServiceObj.productCode">
              <p>
                {{$t('服务到期时间')}}:
                <span class="value">{{vodServiceObj.invalidTime}}</span>
              </p>

              <p>
                {{$t('剩余天数')}}:
                <span class="value">{{vodServiceObj.authDay}}
                  {{vodServiceObj.authDay > 1 ? $t('复数天') : $t('天')}}</span>
              </p>

              <p>
                {{$t('服务状态')}}:
                <span class="value" style="color: #cc1d19" v-if="vodServiceObj.serviceStatus == 0">{{$t('过期')}}</span>
                <span class="value" style="color: #3cd977" v-if="vodServiceObj.serviceStatus == 1">{{$t('正常')}}</span>
              </p>
            </div>

            <div v-if="urlParams.userIdentify == 3 || !vodServiceObj.productCode" class="unpurchased">
              <img src="../../assets/images/unpurchased-en.png" alt="" v-if="urlParams.lang == 'en'">
              <img src="../../assets/images/unpurchased-pt.png" alt="" v-if="urlParams.lang == 'pt'">
              <img src="../../assets/images/unpurchased-es.png" alt="" v-if="urlParams.lang == 'es'">
            </div>

          </div>
        </div>

        <p class="sub-title" style="margin-bottom: -1.5rem;">
          <span class="first">{{$t('会员特权')}}</span>
        </p>

        <div class="privilege">
          <p class="privilege-title">{{$t('内容特权')}}</p>
          <div class="privilege-content">
            <p>{{$t('直播服务：直播频道、频道回看、限制级直播、手机+TV同时在线')}}</p>
            <p>{{$t('点播服务：热剧抢先看、院线新片、海量片库、限制级点播')}}</p>
          </div>
        </div>

        <div class="privilege">
          <p class="privilege-title">{{$t('应用特权')}}</p>
          <div class="privilege-content">
            <p>{{$t('允许1台手机和1台盒子同时在线观看')}}</p>
          </div>
        </div>

      </div>


      <div class="bottom">
        <span @click="toAppHelp()">{{$t('帮助中心')}}</span>
        <p>{{$t('如有疑问，请联系客服')}}: {{email}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import api from "../../api/api";
  import util from "../../common";
  export default {
    data() {
      return {
        urlParams: {},
        liveProductCode: 'fdd4e010-48a3-34cc-8b4c-9f7ad58e8da4',
        liveServiceObj: {},
        vodProductCode: 'B2665EA5062BC76199B7190BCD8AF4CE',
        vodServiceObj: {},
        email: sessionStorage.getItem("email") ?
          sessionStorage.getItem("email") : "",
      };
    },
    created() {
      this.urlParams = this.common.getUrlParams(window.location.href);
    },
    mounted() {
      document.title = this.$t("我的会员");
      this.getPlans();
    },
    directives: {},
    filters: {},
    methods: {
      getPlans() {
        let _self = this;
        let params = _.cloneDeep(this.urlParams);
        delete params.timeStamp;


        this.$http
          .post(api.getPlans(), params)
          .then(res => {
            if (res.data.returnCode == "0") {
              _.forEach(res.data.data.planList, (item) => {
                if (item.productCode === _self.liveProductCode) {
                  _self.liveServiceObj = item;
                }

                if (item.productCode === _self.vodProductCode) {
                  _self.vodServiceObj = item;
                }
              });

              if (["pt", "es"].indexOf(_self.urlParams.lang) > -1) {
                _self.liveServiceObj.invalidTime = _self.moment(_self.liveServiceObj.invalidTime).format(
                  "DD/MM/YYYY");
                _self.vodServiceObj.invalidTime = _self.moment(_self.vodServiceObj.invalidTime).format(
                  "DD/MM/YYYY");
              } else {
                _self.liveServiceObj.invalidTime = _self.moment(_self.liveServiceObj.invalidTime).format(
                  "MM/DD/YYYY");
                _self.vodServiceObj.invalidTime = _self.moment(_self.vodServiceObj.invalidTime).format(
                  "MM/DD/YYYY");
              }
            } else {
              this.message(this.$t("系统异常，请稍后重试！"));
            }
          })
          .catch(err => {
            this.message(this.$t("系统异常，请稍后重试！"));
            console.log(err);
          });
      },

      toIndex() {
        sessionStorage.setItem('routerFrom', 'app-vip');

        this.$router.push({
          path: "/index"
        });
      },

      toAppHelp() {
        sessionStorage.setItem('routerFrom', 'app-vip');

        this.$router.push({
          path: "/app-help"
        });
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
      }
    }
  };

</script>
<style lang="less" scoped>
  .index-page {
    padding: 0;
    font-size: 1.25rem;
    position: relative;
    height: 100vh;
    max-width: 800px;
    margin: 0 auto;
    background: #171516;
    color: #fff;
    display: flex;
    flex-direction: column;

    .head-title {
      text-align: center;
      background: #1a1a1a;
      height: 2.75rem;
      line-height: 2.75rem;
      padding: 0.5rem;
      font-size: 1.75rem;
    }

    .main-content {
      overflow: auto;
      padding: 1rem 1.5rem;

      .user-header {
        display: flex;
        flex-direction: row;
        margin-bottom: .5rem;

        .user-icon {
          width: 4.5rem;
        }

        .account-info {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          margin-left: 1rem;

          .account-text {
            font-size: 1.75rem;
          }

          img {
            width: 2rem;
          }
        }
      }

      .plans {
        .sub-title {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          line-height: 3.75rem;

          .first {
            font-size: 1.6rem;
            color: #c91923;
            font-weight: bold;
          }

          .second {
            color: #f7bd46;
            text-decoration: underline;
          }
        }

        .service {
          background: #272525;
          position: relative;
          border-radius: 0.625rem;
          margin-bottom: 1.25rem;

          .service-title {
            padding: 0.5rem 0.75rem;
            font-size: 1.6rem;
            border-bottom: 1px dashed rgba(255, 255, 255, 0.4);
          }

          .content {
            padding: 0.5rem 0.75rem;

            .sub-content-title {
              margin-bottom: .5rem;
              color: #fff;
            }

            p {
              color: #a8a8a8;
              margin-bottom: .2rem;

              .value {
                color: #fff;
              }
            }

            .unpurchased {
              text-align: right;

              img {
                width: 6.5rem;
              }
            }

          }
        }

        .privilege {
          .privilege-title {
            margin: 1.5rem 0 .75rem 0;
            font-size: 1.5rem;
          }

          .privilege-content {
            color: #a8a8a8;

            p {
              margin-bottom: .625rem;
            }
          }
        }
      }

      .bottom {
        text-align: center;
        margin-top: 2rem;
        color: #8d9194;

        span {
          color: #f7bd46;
          display: inline-block;
          text-decoration: underline;
          margin-bottom: 1rem;
        }
      }

    }

  }

</style>
