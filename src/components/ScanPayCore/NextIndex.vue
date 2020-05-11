<template>
  <div class="index-new-page scanpaycore-page">
    <p class="head-title">
      <i class="shopIcon shop-jiantou-copy" @click="goBack()"></i>
      {{$t('开通会员')}}
    </p>

    <div class="page-container">
      <div class="top">
        <div class="head-bg">
          <img src="../../assets/images/vip-bg.png" alt style="width: 100%; max-width: 750px;" />
          <div class="account-info">
            <div class="user">
              <p class="account-number">{{$t('账号')}}: {{userId}}</p>
              <p v-if="_.get(addressInfo, 'email')">{{$t('邮箱')}}: {{_.get(addressInfo, 'email')}}</p>
              <p v-if="_.get(addressInfo, 'mobile')">{{$t('手机号')}}: {{_.get(addressInfo, 'mobile')}}</p>
            </div>

            <p class="location">
              <img src="../../assets/images/location.png" alt />
              <span>{{_.get(addressInfo, 'country')}}</span>
            </p>
          </div>
        </div>
      </div>

      <div class="main-content">
        <div class="middle">
          <p class="sub-title">
            <strong v-if="appId.indexOf('brasil') > -1">{{$t('Brasil TV 会员')}}</strong>
            <strong v-if="appId.indexOf('unitv') > -1">{{$t('Unitv 会员')}}</strong>
            <strong v-if="appId.indexOf('latino') > -1">{{$t('Tele Latino 会员')}}</strong>
          </p>

          <div class="package-section">
            <p style="margin-bottom: 0.25rem;">
              {{$t('支付方式')}}
            </p>
            <ul>
              <li v-for="(item, index) in payWayList" :key="index" @click.prevent="choosePayWay(item)"
                :class="{'selected': payWay == item }">
                <label>
                  <!-- 巴西信用卡 -->
                  <img v-if="item == 'Payment by Card'" src="../../assets/images/payment/credit-card.png" />

                  <!-- Boleto -->
                  <img v-if="item == 'Boleto'" src="../../assets/images/payment/boleto.png" />

                  <!-- PayPal -->
                  <img v-if="item == 'PayPal'" src="../../assets/images/payment/paypal.png" />

                  <!-- Bank deposits -->
                  <img v-if="item == 'Bank deposits'" src="../../assets/images/payment/cash.png" />

                  <!-- Payment in lotteries -->
                  <img v-if="item == 'Payment in lotteries'" src="../../assets/images/payment/lotteries.png" />

                  <span>{{payWayRenderTextDic[item]}}</span>

                  <!-- 现金转账、彩票店指引页 -->
                  <img class="guide-icon" src="../../assets/images/payment/guide-icon.png" alt=""
                    v-if="item == 'Bank deposits'" @click.stop="toGuide(item)">

                  <img class="guide-icon" src="../../assets/images/payment/guide-icon.png" alt=""
                    v-if="item == 'Payment in lotteries'" @click.stop="toGuide(item)">
                </label>
              </li>
            </ul>
            <p style="text-align: center;">
              <span class="more-pay-way" @click="morePayWay()">({{$t('更多支付方式？')}})</span>
            </p>
          </div>
        </div>

        <div class="pay-section">
          <p class="tips">
            {{$t('提示')}}: {{$t('购买服务成功后，请退出重进应用刷新服务时长。')}}
          </p>
          <div class="read-service">
            <span style="color: #999;">{{$t('购买即同意')}}</span>
            <span class="service">
              <a @click="toService()">({{$t('服务条款')}})</a>
            </span>
          </div>

          <!-- paypal支付按钮 -->
          <div id="paypal-button"></div>
          <div class="pay-button" @click="boletoClick(payWay)" :disabled="!payWay" v-loading="loading">
            {{$t('立即购买')}}
            <span v-if="currentSelectedCoupon">
              ({{packageSelected.currency ? (currencyDic[packageSelected.currency]) : ''}}{{(packageSelected.currentPrice - _.get(currentSelectedCoupon, [couponCurrencyDic[packageSelected.currency]])) | twoDecimal}})
            </span>
            <span v-if="!currentSelectedCoupon">
              ({{packageSelected.currency ? (currencyDic[packageSelected.currency]) : ''}}{{packageSelected.currentPrice | twoDecimal}})
            </span>
          </div>
        </div>

        <div class="bottom">
          <a @click="toAppHelp()" class="normal-question">
            {{$t('常见问题')}}
          </a>

          <p>
            {{$t('如有疑问请联系')}}: {{email}}
          </p>
        </div>
      </div>
    </div>

    <!-- 错误信息提示页面 -->
    <div v-if="failTips" class="modal tips-section">
      <div class="shadow"></div>
      <div class="content">
        <i @click="close('failTips')" class="closeIcon el-icon-circle-close-outline"></i>
        <i class="shopIcon shop-jinggao"></i>
        <p class="tips" v-if="errorCode == 1">{{$t('页面已失效请重新操作')}}!</p>
        <p class="tips" v-if="errorCode == 2">{{$t('信息错误请重新操作')}}!</p>
        <p class="tips" v-if="errorCode == 3">{{$t('系统繁忙')}}!</p>
        <p class="help" v-if="errorCode != 1">{{$t('如有疑问请联系')}}:</p>
        <p class="email">{{email}}</p>
      </div>
    </div>

    <!-- 详细描述页面 -->
    <div v-if="statementFlag" class="modal statement-section">
      <div class="shadow"></div>

      <div class="main-body">
        <div class="statement-info">
          <p class="title">{{$t('提示')}}: [{{_.get(statementObj, 'title')}}]</p>
          <p class="note">{{_.get(statementObj, 'note')}}</p>
        </div>
        <img src="../../assets/images/statement-close.png" @click="close('statementFlag')" alt />
      </div>
    </div>

    <div v-if="promptFlag" class="modal statement-section">
      <div class="shadow"></div>

      <div class="main-body">
        <div class="statement-info">
          <p class="title">{{$t('消息提醒')}}</p>
          <p class="note">
            {{$t('系统检测到您在24小时内通过信用卡下单')}} {{orderTimes}}
            {{$t('次，若您已付款且会员未生效，请耐心等候10分钟，请确认是否继续购买？')}}
          </p>
          <div class="btn" @click="boletoPay()">{{$t('继续购买')}}</div>
        </div>
        <img src="../../assets/images/statement-close.png" @click="close('promptFlag')" alt />
      </div>
    </div>

    <!-- 信用卡支付表单信息 -->
    <form id="pagsmile_pay" method="post" name="pagsmile_pay"
      action="https://testenv.pagsmile.com/pserver/gateway.json">
      <!-- Pagsmile Configuration -->
      <input type="hidden" name="merchant_no" v-model="pagsmileForm.merchant_no" />
      <input type="hidden" name="app_id" v-model="pagsmileForm.app_id" />
      <input type="hidden" name="method" v-model="pagsmileForm.method" />
      <input type="hidden" name="out_order_no" v-model="pagsmileForm.out_order_no" />
      <input type="hidden" name="cpf_no" v-model="pagsmileForm.cpf_no" />
      <input type="hidden" name="username" v-model="pagsmileForm.username" />
      <input type="hidden" name="out_uid" v-model="pagsmileForm.out_uid" />
      <input type="hidden" name="subject" v-model="pagsmileForm.subject" />
      <input type="hidden" name="content" v-model="pagsmileForm.content" />
      <input type="hidden" name="order_amount" v-model="pagsmileForm.order_amount" />
      <input type="hidden" name="currency" v-model="pagsmileForm.currency" />
      <input type="hidden" name="charset" v-model="pagsmileForm.charset" />
      <input type="hidden" name="timestamp" v-model="pagsmileForm.timestamp" />
      <input type="hidden" name="version" v-model="pagsmileForm.version" />
      <input type="hidden" name="email" v-model="pagsmileForm.email" />
      <input type="hidden" name="timeout_express" v-model="pagsmileForm.timeout_express" />
      <input type="hidden" name="passback_params" v-model="pagsmileForm.passback_params" />
      <input type="hidden" name="notify_url" v-model="pagsmileForm.notify_url" />
      <input type="hidden" name="return_url" v-model="pagsmileForm.return_url" />
      <input type="hidden" name="sign_type" v-model="pagsmileForm.sign_type" />
      <input type="hidden" name="sign" v-model="pagsmileForm.sign" />
    </form>
  </div>
</template>

<script src="./nextIndex.js"></script>
<style lang="less" scoped>
  .index-new-page {
    padding: 0;
    font-size: 1.25rem;
    position: relative;
    max-width: 800px;
    height: 100vh;
    margin: 0 auto;
    background: #1d2837;
    display: flex;
    flex-direction: column;

    .head-title {
      text-align: center;
      background: #1d2837;
      color: #fff;
      height: 2.75rem;
      line-height: 2.75rem;
      padding: 0.5rem 0rem;
      font-size: 1.75rem;

      i {
        position: absolute;
        left: 0rem;
        color: #fff;
        width: 3rem;
        font-size: 1.75rem;
      }
    }

    .page-container {
      overflow: auto;
      background: #f5f5f5;
      height: calc(100vh - 3.75rem);

      .top {
        border: none;
        position: relative;
        background: url('../../assets/images/head-inner-bg.png') no-repeat center top;
        background-size: 100%;

        .head-bg {
          height: auto;
          position: relative;
          text-align: center;

          .account-info {
            position: absolute;
            height: calc(100% - 4rem);
            padding: 1rem 2rem 3rem 2rem;
            top: 0;
            right: 0;
            left: 0;
            width: calc(100% - 4rem);
            max-width: calc(750px - 4rem);
            margin: 0 auto;
            text-align: left;

            .location {
              position: absolute;
              bottom: 2.2rem;
              color: #333;

              img {
                width: 1.4rem;
              }

              span,
              img {
                vertical-align: middle;
              }
            }

            .user {
              color: #333;

              p {
                height: auto;
                line-height: normal;
              }

              .account-number {
                height: auto;
                line-height: 2.5rem;
                font-size: 2rem;
                color: #a06601;
              }
            }
          }
        }
      }

      .main-content {
        padding: 0 1.5rem;

        .middle {
          .sub-title {
            height: 2.75rem;
            line-height: 2.75rem;
            color: #333;
            font-size: 1.6rem;
            font-weight: bold;
          }

          .package-section {
            background: #fff;
            padding: 0.75rem 1rem 1.25rem 1rem;
            margin-top: 0.5rem;
            border-radius: 0.625rem;

            p {
              color: #333;
              font-size: 1.6rem;

              .more-pay-way {
                font-size: 1.2rem;
                color: #999;
                text-decoration: underline;
              }
            }

            ul {
              width: 100%;
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;

              li {
                width: 100%;
                padding: 1.25rem;
                text-align: center;
                border: 1px solid #ededed;
                border-radius: 0.3rem;
                display: inline-block;
                position: relative;
                vertical-align: middle;
                margin: 0.75rem 0rem;

                label {
                  width: 100%;
                  text-align: left;
                  display: flex;
                  justify-content: flex-start;
                  align-items: center;

                  img {
                    height: 3rem;
                  }

                  span {
                    color: #1a1a1a;
                    font-size: 1.4rem;
                    display: inline-block;
                    margin-left: .75rem;
                  }

                  .guide-icon {
                    position: absolute;
                    right: .75rem;
                    bottom: .75rem;
                    height: 2.2rem;
                  }
                }
              }

              .selected {
                border: 1px solid #3cd977;
                background-color: #e8fbf2;
              }
            }
          }
        }

        .pay-section {
          text-align: left;
          position: relative;

          .read-service {
            margin: 1rem 0rem 2rem 0rem;
          }

          .tips {
            font-size: 1.25rem;
            color: #404040;
            margin-top: 1rem;
          }

          #paypal-button {
            position: absolute;
            width: 100%;
            opacity: 0;
            left: 0;
            height: 3.6em;
            line-height: 3.6rem;
            max-height: 3.6rem;
          }

          .pay-button {
            color: #ffffff;
            text-align: center;
            height: 3.6em;
            line-height: 3.6rem;
            max-height: 3.6rem;
            margin: 1rem 0;
            border-radius: 0.2rem;
            background-color: #1bd67b;
            font-size: 1.6rem;
            cursor: pointer;

            span {
              font-size: 1.25rem;
            }
          }

          >p>span {
            text-align: center;
            color: #999999;
            display: inline-block;
            border-bottom: 1px solid #999999;
          }

          .service {
            text-decoration: underline;
            color: #1aa7ed;
            margin-left: .2rem;

            a,
            a:active,
            a:hover,
            a:link,
            a:visited {
              color: #1aa7ed;
            }
          }
        }

        .bottom {
          position: relative;
          width: 100%;
          margin: 2rem 0;
          text-align: center;
          color: #999;

          .normal-question {
            display: block;
            margin-bottom: 1rem;
            text-decoration: underline;
          }
        }

      }
    }

    .modal {
      .shadow {
        opacity: 0.7;
        z-index: 3;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        position: absolute;
        background-color: #000000;
      }

      .content {
        z-index: 5;
        top: 0;
        left: 0;
        position: fixed;
        border-radius: 0.5rem;
        overflow: auto;
        max-height: 80%;
      }
    }

    .statement-section {
      text-align: center;

      .main-body {
        width: 87%;
        top: 15%;
        position: fixed;
        z-index: 5;
        left: 0;
        right: 0;
        margin: 6% auto;
        max-width: calc(800px - 12%);
        position: fixed;
        overflow: auto;
        max-height: 80%;

        .statement-info {
          text-align: left;
          position: relative;
          background-color: #fff;
          border-radius: 0.5rem;
          max-height: 40vh;
          overflow: auto;
          padding-bottom: 3.5rem;
          min-height: 5rem;

          .title {
            font-size: 1.6rem;
            line-height: 3rem;
            color: #333;
            font-weight: bold;
            padding: .5rem 1rem;
            border-bottom: 1px solid #ddd;
            text-align: center;
          }

          .note {
            padding: 1rem;
          }

          .btn {
            width: 60%;
            margin: 0 auto;
            margin-top: 4rem;
            text-align: center;
            border-radius: 0.2rem;
            background-color: #1bd67b;
            color: #fff;
            line-height: 2.8rem;
          }
        }

        img {
          margin-top: 1.25rem;
          width: 3rem;
        }
      }
    }

    .tips-section {
      text-align: center;

      .content {
        width: 87%;
        top: 15%;
        margin: 6%;
        background-color: #ffffff;
        position: fixed;

        .closeIcon {
          float: right;
          font-size: 1.8rem;
          padding-top: 0.8rem;
          padding-right: 1.6rem;
        }

        .shopIcon {
          color: #ffc600;
          font-size: 5rem;
          display: block;
          margin: 3rem 0 1.4rem 0;
        }

        .tips {
          line-height: 1.6rem;
          padding: 0rem 1rem;
          margin-bottom: 1.6rem;
        }

        .email {
          color: #007aff;
          margin: 0.3rem 0 3.6rem 0;
        }
      }
    }
  }


  @media (min-width: 415px) {
    .location {
      bottom: 2.5rem !important;
    }
  }

  @media (min-width: 600px) {

    .account-info {
      padding: 1rem 2.5rem 3rem 2.5rem !important;
      width: calc(100% - 5rem) !important;
      max-width: calc(750px - 5rem) !important;

      .location {
        bottom: 3rem !important;
      }
    }

  }

</style>
