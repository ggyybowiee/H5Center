<template>
  <div>
    <div class="index-new-page scanpaycore-page" v-if="!showOldPage">
      <p class="head-title">
        <i class="shopIcon shop-jiantou-copy" @click="goBack()"
          v-if="routerFrom == 'app-vip' || routerFrom == 'friend-invitation'"></i>
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
              <span v-if="packageSelected && packageSelected.packageType == '1'" class="wrap-img">
                <img src="../../assets/images/phone.png" alt />
              </span>
              <span v-if="packageSelected && packageSelected.packageType == '3'" class="wrap-img">
                <img src="../../assets/images/tv-icon.png" alt />
                <img class="plus" src="../../assets/images/plus.png" alt />
                <img src="../../assets/images/phone.png" alt />
              </span>
              <span v-if="packageSelected && packageSelected.packageType == '2'" class="wrap-img">
                <img src="../../assets/images/tv-icon.png" alt />
              </span>
            </p>

            <div class="package-section">
              <ul>
                <li v-for="(item,index) in packageList" :key="item.id" :class="[ 
                {'selected': packageSelectedIndex == index },
                {'out-limit-package': item.isOutOfLimit == 1}]" @click="selectedPackage(index, item)">
                  <div class="wrap-div">
                    <div>
                      <p class="package-name">{{item.packagePlanName}}</p>
                      <p class="price">
                        <span>{{item.currency ? (currencyDic[item.currency]) : ''}}</span>
                        <span class="current-price">{{item.currentPrice|twoDecimal}}</span>
                        <span class="price-day" v-if="item.isSpecial == 1">{{$t('限购次数')}}: {{item.limitNum}}
                          {{item.limitNum > 1 ? $t('复数次') : $t('次')}}</span>
                      </p>
                      <div class="before-price">
                        <p class="origin-price" v-if="item.currentPrice != item.originalPrice">
                          <span>{{item.currency ? (currencyDic[item.currency]) : ''}}</span>
                          <span>{{item.originalPrice|twoDecimal}}</span>
                        </p>
                        <!-- 当授权天数为30时，不显示平均月价 -->
                        <span
                          v-if="item.authorizedDays != 30">({{(item.currentPrice/item.authorizedDays)*30 | twoDecimal}}/{{$t('月')}})</span>
                      </div>
                    </div>

                    <span class="huiyuan" v-show="item.isRecommend == '1' && item.isOutOfLimit != 1"></span>
                    <span class="statement" v-show="item.languageDescribe" @click="showStatement(item)"></span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div class="coupon" v-if="packageList.length > 0 && tk && loginType">
            <div>{{$t('优惠券')}}</div>
            <div @click="toSelectCoupon">
              <span v-if="!currentSelectedCoupon" style="color: #999;">{{$t('无可用')}}</span>
              <span v-if="currentSelectedCoupon">
                {{$t('已自动')}}, -{{currencyDic[packageSelected.currency]}}
                {{_.get(currentSelectedCoupon, [couponCurrencyDic[packageSelected.currency]]) | oneDecimal}}
              </span>
              <i class="shopIcon shop-jiantouyou" style="color: #999;"></i>
            </div>
          </div>

          <div class="prority">
            <p class="sub-title">{{$t('会员特权')}}</p>
            <ul>
              <li>
                <img src="../../assets/images/channel.png" alt />
                <div>
                  <p>{{$t('直播频道')}}</p>
                  <span>{{$t('几百个频道，7*24小时维护，一直稳定')}}</span>
                </div>
              </li>
              <li>
                <img src="../../assets/images/Newest-movies-and-series.png" alt />
                <div>
                  <p>{{$t('海量片库')}}</p>
                  <span>{{$t('海量点播资源，资源充足，每日更新')}}</span>
                </div>
              </li>
              <li>
                <img src="../../assets/images/control.png" alt />
                <div>
                  <p>{{$t('儿童管理')}}</p>
                  <span>{{$t('儿童管理，呵护未成年人健康成长')}}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div :class="['next-btn', {'next-btn-active': (_.get(packageSelected, 'packageCode')) && packageList.length > 0}]"
        @click="confirm()">
        {{$t("下一步")}}
        <span v-if="currentSelectedCoupon">
          ({{packageSelected.currency ? (currencyDic[packageSelected.currency]) : ''}}{{(packageSelected.currentPrice - _.get(currentSelectedCoupon, [couponCurrencyDic[packageSelected.currency]])) | twoDecimal}})
        </span>
        <span v-if="!currentSelectedCoupon">
          ({{packageSelected.currency ? (currencyDic[packageSelected.currency]) : ''}}{{packageSelected.currentPrice | twoDecimal}})
        </span>
      </div>

      <!-- 详细描述页面 -->
      <div v-if="statementFlag" class="modal statement-section">
        <div class="shadow"></div>

        <div class="main-body">
          <div class="statement-info">
            <p class="title">{{$t('套餐说明')}}</p>
            <p class="note">{{languageDescribe}}</p>
          </div>
          <img src="../../assets/images/statement-close.png" @click="close('statementFlag')" alt />
        </div>
      </div>

      <div v-if="promptFlag" class="modal statement-section">
        <div class="shadow"></div>

        <div class="main-body">
          <div class="statement-info">
            <p class="title">{{$t('提示')}}</p>
            <p class="note">{{$t('提交订单后，该优惠券则无法再次使用')}}</p>
            <div class="btn" @click="toNext()">{{$t('下一步')}}</div>
          </div>
          <img src="../../assets/images/statement-close.png" @click="close('promptFlag')" alt />
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
    </div>
    <div v-if="showOldPage">
      <IndexOld></IndexOld>
    </div>
  </div>
</template>

<script src="./index.js"></script>

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
        background: url("../../assets/images/head-inner-bg.png") no-repeat center top;
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

          .wrap-img {
            margin-left: 0.5rem;
            display: inline-block;

            img {
              vertical-align: middle;
              height: 1.5rem;
            }

            .plus {
              height: 100%;
            }
          }

          .package-section {
            ul {
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;
              margin-top: -0.5rem;

              li {
                text-align: left;
                border: 1px solid #f5f5f5;
                background: #fff;
                padding: 0.75rem 1.25rem;
                border-radius: 0.625rem;
                position: relative;
                vertical-align: middle;
                width: 100%;
                margin-top: 1rem;

                .wrap-div {
                  overflow: auto;
                  width: 100%;
                  height: 100%;

                  .package-name {
                    color: #333;
                    font-size: 1.6rem;
                    margin-bottom: .5rem;
                    word-break: break-all;
                  }

                  .price {
                    font-weight: bold;
                    color: #f67d36;
                    margin: 0.5rem 0;

                    span {
                      display: inline-block;
                      vertical-align: middle;
                    }

                    .current-price {
                      font-size: 1.8rem;
                      margin-left: -3px;
                    }

                    .price-day {
                      color: #fa5546;
                      margin-left: 1rem;
                      font-weight: 400;
                      font-size: 1.1rem;
                      border: 1px solid #fa5546;
                      padding: 0 0.5rem;
                      border-radius: 0.25rem;
                    }
                  }

                  .before-price {
                    color: #999;

                    .origin-price {
                      display: inline-block;
                      font-weight: bold;
                      text-decoration: line-through;
                      margin-right: 1rem;

                      span:first-child {
                        font-size: 1rem;
                      }

                      span:last-child {
                        margin-left: -3px;
                      }
                    }
                  }
                }

                .huiyuan {
                  top: -0.8rem;
                  left: -1rem;
                  width: 2.2rem;
                  height: 2.2rem;
                  text-align: center;
                  display: inline-block;
                  border-radius: 50%;
                  background-color: #f5c607;
                  position: absolute;
                  background: url("../../assets/images/recommend.png") no-repeat center center;
                  background-size: 100%;
                }

                .statement {
                  right: 0.5rem;
                  bottom: 0.75rem;
                  width: 2.2rem;
                  height: 2.2rem;
                  text-align: center;
                  display: inline-block;
                  background-color: #f5c607;
                  position: absolute;
                  background: url("../../assets/images/statement.png") no-repeat center center;
                  background-size: 100%;
                }
              }

              .selected {
                border: 1px solid #3cd977;
                background-color: #e8fbf2;
              }

              .out-limit-package {
                background-color: #eee;
                opacity: 0.6;
                cursor: not-allowed;
              }
            }
          }
        }

        .coupon {
          margin-top: 1.5rem;
          padding: 0 1.25rem;
          background: #ffffff;
          border-radius: 0.625rem;
          height: 3.75rem;
          line-height: 3.75rem;
          font-size: 1.6rem;
          color: #333;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;

          >div:last-child {
            font-size: 1.25rem;
            color: #a70a00;

            .shopIcon {
              color: #999;
              font-size: 1.4rem;
            }
          }
        }

        .prority {
          margin-top: 1.5rem;
          margin-bottom: 6rem;

          .sub-title {
            height: 2.75rem;
            line-height: 2.75rem;
            color: #333;
            font-size: 1.6rem;
            font-weight: bold;
          }

          ul {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            margin-top: 1rem;
            background: #fff;
            margin-bottom: 4rem;
            border-radius: 0.625rem;

            li {
              width: 100%;
              padding: 1.5rem;
              border-bottom: 1px solid #f4f5f5;
              display: flex;
              justify-content: flex-start;
              align-items: center;

              >div {
                margin-left: 1rem;

                p {
                  margin-bottom: 0.5rem;
                  font-size: 1.6rem;
                  color: #333;
                }

                span {
                  color: #999;
                }
              }

              img {
                width: 6.5rem;
              }
            }

            li:last-child {
              border-bottom: none;
            }
          }
        }
      }
    }



    .next-btn {
      position: fixed;
      bottom: 0;
      height: 4rem;
      line-height: 4rem;
      border: none;
      background: #ddd;
      color: #fff;
      width: 100%;
      max-width: 800px;
      text-align: center;
      font-size: 2rem;

      span {
        font-size: 1.25rem;
      }
    }

    .next-btn-active {
      background: #3cd977;
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
        background-color: #fff;
        position: fixed;
        margin: 6% auto;
        max-width: calc(800px - 12%);
        left: 0;
        right: 0;

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
