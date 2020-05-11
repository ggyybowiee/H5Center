<template>
  <div class="index-new-page scanpaycore-page">
    <!-- <p class="head-title">
      <i class="shopIcon shop-jiantou-copy" @click="goBack()"></i>{{$t('规则')}}
    </p> -->

    <div class="page-container" id="page-container">
      <div class="top">
        <img src="../../assets/images/friend-recommend/rules.png" alt="">
        <div class="text">
          <p class="impact">{{$t('邀好友，双方得优惠')}}</p>
          <p class="impact">{{$t('宅家也能轻松得奖励，省心更省钱！')}}</p>
        </div>
      </div>

      <div class="content">
        <p class="text question">
          <span>1</span>
          <span>{{$t('我已有朋友分享给我邀请码，如何获得优惠券？')}}</span>
        </p>

        <p class="text answer">
          <span></span>
          <span>{{$t('活动期间，进入APP “我的”-“邀请好友”，填写好友的邀请码，立即领取优惠券，优惠券将自动发放到您的“我的福利”')}}</span>
        </p>


        <p class="text question">
          <span>2</span>
          <span>{{$t('我可以多次领取优惠券吗？')}}</span>
        </p>

        <p class="text answer">
          <span></span>
          <span>{{$t('该优惠券为专享优惠券，每位用户限领取一次')}}</span>
        </p>

        <p class="text question">
          <span>3</span>
          <span>{{$t('优惠券领取后如何使用？')}}</span>
        </p>

        <p class="text answer">
          <span></span>
          <span>{{$t('您可以在领取后点击“立即使用”；或者稍后在“我的福利”查看及使用优惠券；或者在APP套餐购买页面选择可用券套餐，系统将直接为您使用最佳优惠券。任意方式购买VIP，马上解锁HOT内容')}}</span>
        </p>

        <p class="text question">
          <span>4</span>
          <span>{{$t('优惠券的有效期？')}}</span>
        </p>

        <p class="text answer">
          <span></span>
          <span>
            {{$t('优惠券自领取之日起')}} {{_.get(setting, 'couponExpiredDay')}}
            {{$t('天有效，过期自动失效，该优惠券为168天历史最低价，只可领取一次，建议您尽快使用。')}}
          </span>
        </p>

        <p class="text question">
          <span>5</span>
          <span>{{$t('我也想邀请好友，如何参加？')}}</span>
        </p>

        <p class="text answer">
          <span></span>
          <span>{{$t('复制您的邀请码发送给好友，邀请对象不限，好友安装/打开Brasil TV Mobile，填写您的邀请码，可以立即领取优惠券下单')}}</span>
        </p>

        <p class="text question">
          <span>6</span>
          <span>{{$t('邀请人的奖励如何获取？')}}</span>
        </p>

        <p class="text answer">
          <span></span>
          <span>
            {{$t('活动期间邀请好友，每满3人通过您的推荐码领券下单，您的账户将自动获得')}} {{_.get(setting, 'sendVIPAuthDay')}}
            {{$t('天VIP服务，您可以在“我的邀请记录”查看明细，奖励可累加，累计获得奖励VIP时长不超过360天。')}}
          </span>
        </p>
      </div>

      <div class="tip">
        {{$t('温馨提示')}}: {{$t('为保护广大用户的利益，若出现不正当方式获取奖励或优惠券的行为，我们有权利取消该账户的奖励，优惠券不与其他特价活动同时享受，活动最终解释权归举办方所有')}}
      </div>

      <div class="bottom">
        <p>{{$t('我有更多问题想咨询')}} whatsapp: {{_.get(setting, 'whatsapp')}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import api from "../../api/api";
  export default {
    data() {
      return {
        lang: sessionStorage.getItem("lang") ?
          sessionStorage.getItem("lang") : "",
        appId: sessionStorage.getItem("appId") ?
          sessionStorage.getItem("appId") : "",
        setting: setting
      };
    },
    mounted() {
      document.title = this.$t("规则");
    },
    watch: {},
    directives: {},
    filters: {},
    methods: {
      goBack() {
        this.$router.go(-1);
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
      position: relative;
      overflow: auto;
      background: #f7a546;
      height: 100vh;
      // height: calc(100vh - 3.75rem);

      .top {
        position: relative;

        img {
          width: 100%;
        }

        .text {
          position: absolute;
          top: 1.8rem;
          left: 2rem;
          color: #fff;
          font-size: 1.6rem;
          width: 72%;

          p {
            margin-bottom: .3rem;
          }
        }
      }

      .content {
        margin: 1rem;
        padding: 1.5rem;
        border-radius: 0.625rem;
        color: #666;
        background: #fff;

        .text {
          display: flex;

          span:first-child {
            flex-basis: 1.8rem;
            height: 1.8rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            background: #ec3232;
            color: #fff;
            margin-right: .5rem;
            font-size: 1.4rem;
          }

          span:last-child {
            flex: 1;
          }
        }

        .question {
          font-size: 1.5rem;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .answer {
          font-size: 1.3rem;
          margin-bottom: 1rem;

          span:first-child {
            visibility: hidden;
          }
        }
      }

      .tip {
        margin: 1rem;
        padding: 1rem;
        color: #fff;
        background: #e65032;
        border-radius: 0.625rem;
      }

      .bottom {
        text-align: center;
        color: #1a1a1a;
        margin-bottom: 2rem;
      }
    }
  }

</style>
