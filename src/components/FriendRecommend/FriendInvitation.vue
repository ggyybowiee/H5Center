<template>
  <div class="index-new-page">
    <!-- <p class="head-title">
      {{$t('好友邀请')}}
    </p> -->
    <div class="page-container">
      <div class="top">
        <img src="../../assets/images/friend-recommend/invite-header.png" alt="" />
        <span class="rule-btn" @click="toRule">{{$t('规则')}}</span>
        <div class="text">
          <p class="impact title">{{$t('邀好友，得VIP，解锁HOT')}}</p>
          <p class="sub-title">
            {{$t('每邀请')}}
            <span>3</span>
            {{$t('位好友领券下单，可得')}}
            <span>{{_.get(setting, 'sendVIPAuthDay')}}</span>
            {{$t('天VIP会员好友可得')}}
            <span>{{lang == 'pt' ? 'R$' : '$'}}{{_.get(setting, 'couponAmount')}}</span>
            {{$t('专享优惠券')}}
          </p>
          <sapn class="impact btn" @click="toInviteFriend">{{$t('立即邀请朋友')}}</sapn>
        </div>
      </div>

      <div class="input-inviteCode" v-if="hasInvite == '0'">
        <el-input v-model="inputInviteCode" :placeholder="$t('邀请码')"></el-input>
        <span :class="['impact', {'active': !!inputInviteCode}]" @click="getInvitedReward">{{$t('领取')}}</span>
      </div>

      <div class="bottom">
        <img src="../../assets/images/friend-recommend/invite-bottom.png" alt="" />
        <div class="text">
          <p class="impact title">
            {{$t('再邀请')}}
            <span>{{(3 - _self.inviteRecordList.length % 3)}}</span>
            {{$t('人，立即获得')}}
            <span>{{_.get(setting, 'sendVIPAuthDay')}}</span>
            {{$t('天VIP会员！')}}
          </p>

          <div class="img-list">
            <img src="../../assets/images/friend-recommend/invite-3.png" alt=""
              v-if="(3 - _self.inviteRecordList.length % 3) == 3">
            <img src="../../assets/images/friend-recommend/invite-2.png" alt=""
              v-if="(3 - _self.inviteRecordList.length % 3) == 2">
            <img src="../../assets/images/friend-recommend/invite-1.png" alt=""
              v-if="(3 - _self.inviteRecordList.length % 3) == 1">
            <span class="brand" v-if="getRewardCount > 0">{{getRewardCount}}</span>
          </div>

          <div class="btn-wrap">
            <span :class="['claim-btn', {'claim-btn-active': getRewardCount > 0}]"
              @click="getInviteReward">{{$t('领取')}}</span>
          </div>

          <div class="tips">
            {{$t('您已经免费获得')}} {{totalDay}} {{$t('天VIP会员')}},
            <span class="invite-record-btn" @click="toInviteRecord">{{$t('查看我的邀请记录')}}</span>
          </div>
        </div>
        <div class="participate">
          <p class="impact title">
            {{$t('怎么参与？')}}
          </p>

          <p class="desp">
            <span>1.</span>
            <span>{{$t('点击')}} "<strong>{{$t('立即邀请朋友')}}"</strong></span>
          </p>

          <p class="desp">
            <span>2.</span>
            <span>{{$t('好友在Brasil TV Mobile APP内，填写你的邀请码并领取优惠券')}}</span>
          </p>

          <p class="desp">
            <span>3.</span>
            <span>{{$t('邀请成功')}}</span>
          </p>
        </div>
      </div>

      <div class="contact">
        <p>{{$t('我有更多问题想咨询')}} whatsapp: {{_.get(setting, 'whatsapp')}}</p>
      </div>

      <!-- 绑定账号 -->
      <el-dialog :visible.sync="commonModalFlag" :show-close="false" :close-on-click-modal="false"
        custom-class="common-dialog">
        <p>{{descriptionText}}</p>
        <div class="btn" @click="goAndroidBindPage" v-if="userIdentify == '1'">{{$t('立即绑定')}}</div>
        <div class="btn" @click="useNow" v-if="userIdentify != '1'">{{$t('立即使用')}}</div>

        <img src="../../assets/images/statement-close.png" class="close-btn-img" @click="close('commonModalFlag')"
          alt />
      </el-dialog>

      <!-- 复制信息 -->
      <el-dialog :visible.sync="copyModalFlag" :show-close="false" :close-on-click-modal="false"
        custom-class="common-dialog">
        <div class="text" id="text">
          <p>
            {{$t('Hi，送你')}}
            <span>{{lang == 'pt' ? 'R$' : '$'}}{{_.get(setting, 'couponAmount')}}</span>
            {{$t('优惠券，和我一起享受看电视神器 #Brasil TV Mobile#！')}}
          </p>
          <p>{{$t('几百个直播，最新的点播！还有免费试用！成为VIP马上解锁HOT内容！')}}</p>
          <p>{{$t('打开你的Brasil TV Mobile，填写我的邀请码：')}}
            <span>{{selfInviteCode}}</span>
            {{$t('，马上领取')}}
            <span>{{lang == 'pt' ? 'R$' : '$'}}{{_.get(setting, 'couponAmount')}}</span>
            {{$t('新人优惠券')}}
          </p>
          <p>{{$t('快去领吧！')}}</p>
          <p style="font-size: 1.2rem; margin-top: 4rem;">{{$t('了解详情：')}}
            {{_.get(setting, 'shareLinkDomain') + `/#/share-link?userId=${userId}`}}</p>
        </div>
        <div class="btn" style="margin-top: 1rem;" @click="copyText">{{$t('复制发给好友')}}</div>

        <img src="../../assets/images/statement-close.png" class="close-btn-img" @click="close('copyModalFlag')" alt />
      </el-dialog>

      <!-- 点击礼盒弹框提醒 -->
      <el-dialog :visible.sync="giftModalFlag" :show-close="false" :close-on-click-modal="false"
        custom-class="gift-dialog">
        <div class="bg-img">
          <img src="../../assets/images/friend-recommend/gift.png" alt="">
          <p>{{$t('恭喜你获得')}} <span>{{_.get(setting, 'sendVIPAuthDay')}}</span> {{$t('天vip时长！')}}</p>
        </div>

        <img src="../../assets/images/statement-close.png" class="close-btn-img" @click="close('giftModalFlag')" alt />
      </el-dialog>

      <!-- 赠送优惠券弹框提醒 -->
      <el-dialog :visible.sync="sendCouponModalFlag" :show-close="false" :close-on-click-modal="false"
        custom-class="send-coupon-dialog">
        <div class="bg-img">
          <img src="../../assets/images/friend-recommend/send-coupon.png" alt="">
          <div class="description">
            <h5>{{$t('Hi，好友送您')}}
              <span>{{currencyDic[invitedReward.currency.toUpperCase()]}} {{invitedReward.price}}</span>
              {{$t('优惠券，拿去买买买！')}}
            </h5>
            <p>{{$t('已自动领取到“我的福利”')}}</p>
            <p>{{$t('用券下单GET历史最低价，解锁HOT内容，快去看看吧！')}}</p>
            <div class="btn" @click="useNow">{{$t('立即使用')}}</div>
          </div>
        </div>

        <img src="../../assets/images/statement-close.png" class="close-btn-img" @click="close('sendCouponModalFlag')"
          alt />
      </el-dialog>

    </div>
  </div>
</template>

<script src="./friendInvitation.js"></script>

<style lang="less" scoped>
  .index-new-page {
    padding: 0;
    font-size: 1.25rem;
    position: relative;
    max-width: 800px;
    height: 100vh;
    margin: 0 auto;
    background: #fff;
    display: flex;
    flex-direction: column;

    .page-container {
      position: relative;
      overflow: auto;
      background: #e02523;
      height: 100vh;

      .top {
        position: relative;

        img {
          width: 100%;
        }

        .rule-btn {
          position: absolute;
          display: inline-block;
          border-radius: 1.875rem 0rem 0rem 1.875rem;
          width: 5.5rem;
          right: 0;
          line-height: 2.6rem;
          color: #fff;
          text-align: center;
          background-color: #dc211f;
          top: 2rem;
        }

        .text {
          position: absolute;
          color: #1a1a1a;
          font-size: 1.6rem;
          width: 86%;
          bottom: 1rem;
          left: 7%;
          text-align: center;

          .title {
            margin-bottom: .5rem;
          }

          .sub-title {
            font-size: 1.25rem;

            span {
              color: #eb4026;
            }
          }

          .btn {
            display: inline-block;
            min-width: 60%;
            max-width: 420px;
            background: url('../../assets/images/friend-recommend/invite-btn.png') no-repeat center center;
            color: #fff;
            border-radius: 2.8125rem;
            padding: 0.6rem;
            text-align: center;
            margin-top: 2rem;
            font-size: 1.75rem;
          }
        }
      }

      .input-inviteCode {
        display: flex;
        line-height: 3.75rem;
        margin: 2rem 2rem 0rem 2rem;
        border-radius: 3.125rem;
        background: #fff;
        color: #EA3C24;

        .el-input {
          flex: 1;
        }

        span {
          flex-basis: 9rem;
          text-align: center;
          background: #b3b3b3;
          color: #fff;
          border-radius: 0rem 3.125rem 3.125rem 0rem;
          font-size: 1.5rem;
        }

        .active {
          color: #EA3C24;
          background: #ffAe14;
        }

      }

      .bottom {
        position: relative;

        img {
          width: 100%;
        }

        .text {
          position: absolute;
          color: #1a1a1a;
          font-size: 1.6rem;
          width: 80%;
          top: 9%;
          left: 10%;
          text-align: center;

          .title {
            margin-bottom: .5rem;

            span {
              color: #eb4026;
            }
          }

          .btn {
            display: inline-block;
            width: 60%;
            max-width: 420px;
            background: url('../../assets/images/friend-recommend/invite-btn.png') no-repeat center center;
            color: #fff;
            border-radius: 2.8125rem;
            padding: 0.6rem;
            text-align: center;
            margin-top: 2rem;
            font-size: 1.75rem;
          }


          .img-list {
            position: relative;

            .brand {
              width: 1.8rem;
              height: 1.8rem;
              line-height: 1.8rem;
              font-size: 1rem;
              text-align: center;
              position: absolute;
              right: 0;
              top: -.2rem;
              display: inline-block;
              border-radius: 50%;
              color: #fff;
              background-image: linear-gradient(0deg,
                  #ff1800 0%,
                  #ff5353 100%),
                linear-gradient(#ffffff,
                  #ffffff);
              box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.3),
                inset 0px -1px 2px 0px rgba(4, 0, 0, 0.25);
            }
          }

          .btn-wrap {
            text-align: right;
            font-size: 1.25rem;
            padding-right: 5%;
            margin-top: .5rem;

            .claim-btn {
              color: #fff;
              display: inline-block;
              padding: 0.25rem 1rem;
              box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.25);
              border-radius: 20px;
              background: linear-gradient(0deg,
                  #999999 0%,
                  #cccccc 100%) no-repeat center center;
              background-size: 100%;
            }

            .claim-btn-active {
              color: #e12d22;
              background: linear-gradient(0deg,
                  #ff9c28 0%,
                  #ffd321 100%) no-repeat center center;
            }
          }

          .tips {
            font-size: 1.25rem;
            margin-top: 1.5rem;

            .invite-record-btn {
              display: inline-block;
              color: #2790c4;
              text-align: center;
              text-decoration: underline;
            }
          }
        }

        .participate {
          position: absolute;
          color: #1a1a1a;
          font-size: 1.25rem;
          width: 80%;
          top: 60%;
          left: 10%;

          .title {
            margin-bottom: 1.25rem;
            font-size: 1.6rem;
            text-align: center;
          }

          .desp {
            text-align: left;
            line-height: 1.8rem;
            display: flex;

            span:first-child {
              flex-basis: 1.8rem;
            }

            span:last-child {
              flex: 1;
            }
          }
        }
      }

      .contact {
        margin: 2rem 1rem;
        text-align: center;
        color: #fff;
        border-radius: 0.75rem;
      }

    }
  }

  @media (min-width: 320px) {
    .page-container {
      .top {
        .text {
          bottom: 2% !important;

          .btn {
            margin-top: 1.5rem !important;
          }
        }
      }

      .bottom {
        .text {
          top: 9% !important;

          .tips {
            margin-top: 1rem !important;
          }
        }

        .participate {
          top: 60% !important;

          .title {
            margin-bottom: 0.5rem !important;
          }
        }
      }
    }
  }

  @media (min-width: 360px) {
    .page-container {
      .top {
        .text {
          bottom: 4% !important;
        }
      }

      .bottom {
        .text {
          top: 10% !important;
        }

        .participate {
          top: 62% !important;

          .title {
            margin-bottom: 0.75rem !important;
          }
        }
      }
    }
  }

  @media (min-width: 410px) {
    .page-container {
      .top {
        .text {
          width: 80% !important;
          left: 10% !important;
          bottom: 5% !important;

          .btn {
            margin-top: 2rem !important;
          }
        }
      }

      .bottom {
        .text {
          top: 10% !important;

          .tips {
            margin-top: 1.5rem !important;
          }
        }

        .participate {
          top: 62% !important;

          .title {
            margin-bottom: 0.85rem !important;
          }
        }
      }
    }
  }

  @media (min-width: 600px) {
    .page-container {
      .top {
        .rule-btn {
          width: 7rem !important;
          line-height: 3.2rem !important;
          font-size: 1.6rem !important;
        }

        .text {

          bottom: 6% !important;

          .title {
            font-size: 2rem !important;
          }

          .sub-title {
            font-size: 1.6rem !important;
            margin-top: 1rem !important;
          }

          .btn {
            font-size: 2.2rem !important;
            padding: 1rem !important;
          }
        }
      }

      .input-inviteCode {
        line-height: 4.5rem !important;

        .el-input {
          font-size: 1.8rem !important;

          .el-input__inner {
            height: 3.75rem !important;
          }
        }

        span {
          font-size: 1.8rem !important;
        }
      }

      .bottom {
        .text {
          font-size: 2rem !important;
          top: 11% !important;

          .img-list {
            margin-top: 1.5rem !important;

            .brand {
              right: .5rem !important;
            }
          }

          .btn-wrap {
            font-size: 1.4rem !important;
            margin-top: 1rem !important;
          }

          .tips {
            font-size: 1.6rem !important;
          }
        }

        .participate {
          top: 62% !important;

          .title {
            font-size: 2rem !important;
            margin-bottom: 2rem !important;
          }

          .desp {
            font-size: 1.6rem !important;
          }
        }
      }
    }
  }

</style>


<style lang="less">
  .common-dialog {
    background: #fff !important;
    border-radius: 1.25rem !important;
    width: 87% !important;
    max-width: 720px !important;

    .el-dialog__header {
      padding: 0;
    }

    .el-dialog__body {
      position: relative;
      color: #1a1a1a;
      text-align: center;
      font-size: 1.3rem;

      .text {
        text-align: left;

        p {
          margin-bottom: .2rem;

          span {
            color: #eb4026;
            font-size: 1.4rem;
          }
        }
      }

      .btn {
        width: 70%;
        margin: 0 auto;
        margin-top: 4rem;
        font-size: 1.5rem;
        text-align: center;
        background-color: #ffae14;
        border-radius: 2.8125rem;
        color: #fff;
        line-height: 3.75rem;
      }

      .close-btn-img {
        position: absolute;
        bottom: -5rem;
        width: 3rem;
        left: 0;
        right: 0;
        margin: 0 auto;
      }
    }

  }

  .gift-dialog {
    width: 87% !important;
    max-width: 720px !important;
    background: transparent !important;
    box-shadow: none !important;
    border-radius: 1.25rem !important;

    .el-dialog__header {
      padding: 0;
    }

    .el-dialog__body {
      padding: 0;
      position: relative;
      color: #1a1a1a;
      text-align: center;
      font-size: 1.3rem;

      .bg-img {
        width: 100%;
        max-width: 800px;
        position: relative;
        text-align: center;

        img {
          width: 100%;
        }

        p {
          position: absolute;
          top: 56%;
          width: 60%;
          left: 0;
          right: 0;
          margin: 0 auto;

          span {
            color: #eb4026;
            font-size: 1.4rem;
          }
        }
      }

      .close-btn-img {
        position: absolute;
        bottom: -5rem;
        width: 3rem;
        left: 0;
        right: 0;
        margin: 0 auto;
      }
    }
  }

  .send-coupon-dialog {
    width: 87% !important;
    max-width: 720px !important;
    background: transparent !important;
    box-shadow: none !important;
    border-radius: 1.25rem !important;

    .el-dialog__header {
      padding: 0;
    }

    .el-dialog__body {
      padding: 0;
      position: relative;
      color: #1a1a1a;
      text-align: center;
      font-size: 1.3rem;

      .bg-img {
        width: 100%;
        max-width: 800px;
        position: relative;
        text-align: center;

        img {
          width: 100%;
        }

        .description {
          position: absolute;
          bottom: 6%;
          width: 90%;
          left: 0;
          right: 0;
          margin: 0 auto;
          text-align: left;

          h5 {
            font-size: 1.5rem;

            span {
              color: #eb4026;
            }
          }

          .btn {
            width: 70%;
            margin: 0 auto;
            margin-top: 2rem;
            font-size: 1.5rem;
            text-align: center;
            background-color: #fff;
            border-radius: 2.8125rem;
            color: #ff6c03;
            line-height: 3.75rem;
          }
        }
      }

      .close-btn-img {
        position: absolute;
        bottom: -5rem;
        width: 3rem;
        left: 0;
        right: 0;
        margin: 0 auto;
      }
    }
  }

  @media (min-width: 320px) {
    .send-coupon-dialog .el-dialog__body .bg-img .description {
      bottom: 6% !important;
    }

    .gift-dialog .el-dialog__body .bg-img p {
      top: 56% !important;
    }

    .index-new-page .page-container .bottom .text .btn-wrap {
      padding-right: 4% !important;
    }
  }

  @media (min-width: 360px) {
    .send-coupon-dialog .el-dialog__body .bg-img .description {
      bottom: 8% !important;
    }

    .gift-dialog .el-dialog__body .bg-img p {
      top: 58% !important;
    }

    .index-new-page .page-container .bottom .text .btn-wrap {
      padding-right: 4% !important;
    }
  }

  @media (min-width: 410px) {
    .send-coupon-dialog .el-dialog__body .bg-img .description {
      bottom: 10% !important;
    }

    .send-coupon-dialog .el-dialog__body .bg-img .description h5 {
      font-size: 1.75rem !important;
    }

    .gift-dialog .el-dialog__body .bg-img p {
      top: 60% !important;
    }

    .index-new-page .page-container .bottom .text .btn-wrap {
      padding-right: 5% !important;
    }
  }

  @media (min-width: 600px) {
    .send-coupon-dialog .el-dialog__body .bg-img .description {
      bottom: 16% !important;
      font-size: 1.75rem !important;
    }

    .send-coupon-dialog .el-dialog__body .bg-img .description h5 {
      font-size: 2rem !important;
    }

    .send-coupon-dialog .el-dialog__body .bg-img .description .btn {
      font-size: 2rem !important;
      line-height: 4.5rem !important;
    }

    .gift-dialog .el-dialog__body .bg-img p {
      top: 60% !important;
      font-size: 2rem !important;
    }

    .gift-dialog .el-dialog__body .bg-img p span {
      font-size: 2rem !important;
    }

    .index-new-page .page-container .bottom .text .btn-wrap {
      padding-right: 7% !important;
    }
  }

</style>
