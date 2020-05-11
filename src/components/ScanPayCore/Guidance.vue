<template>
  <div class="index-new-page scanpaycore-page">
    <p class="head-title">
      <i class="shopIcon shop-jiantou-copy" @click="goBack()"></i>
      {{title}} - {{$t('操作指引')}}
    </p>

    <div class="page-container" v-if="payWay == 'Payment in lotteries'">
      <div class="step">
        <div class="step1-img">
          <img src="../../assets/images/coupon/lotteries/step-1.png" alt="">
          <span>{{$t('第一步')}}</span>
        </div>
        <p>{{$t('选择您购买的套餐，并选择彩票店支付方式，点击【立即购买】进入Pagsmile平台的支付页面。')}}</p>
      </div>

      <img class="arrow-down" src="../../assets/images/coupon/lotteries/arrow-down.png" alt="">

      <div class="step">
        <div class="step2-img">
          <img src="../../assets/images/coupon/lotteries/step-2.png" alt="">
          <span>{{$t('第二步')}}</span>
        </div>
        <p>{{$t('填写您的姓名、CPF、CEP、邮箱、手机号码，勾选隐私政策，点击【确认】生成彩票店支付账单。')}}</p>
        <img class="step-content-img" src="../../assets/images/coupon/lotteries/step-2-img.png" alt="">
      </div>

      <img class="arrow-down" src="../../assets/images/coupon/lotteries/arrow-down.png" alt="">

      <div class="step">
        <div class="step1-img">
          <img src="../../assets/images/coupon/lotteries/step-3.png" alt="">
          <span>{{$t('第三步')}}</span>
        </div>
        <p>{{$t('请截图保存支付账单，前往附近的彩票店完成交易。')}}</p>
        <img class="step-content-img" src="../../assets/images/coupon/lotteries/step-3-img.png" alt="">
      </div>

      <img class="arrow-down" src="../../assets/images/coupon/lotteries/arrow-down.png" alt="">

      <div class="step">
        <div class="step2-img">
          <img src="../../assets/images/coupon/lotteries/step-4.png" alt="">
          <span>{{$t('第四步')}}</span>
        </div>
        <p>{{$t('当您在彩票店完成交易后，请您耐心等待，您购买的服务将10分钟以内生效，感谢您的支持。')}}</p>
      </div>

    </div>

    <div class="page-container" v-if="payWay == 'Bank deposits'">
      <div class="step">
        <div class="step1-img">
          <img src="../../assets/images/coupon/cash/step-1.png" alt="">
          <span>{{$t('第一步')}}</span>
        </div>
        <p>{{$t('选择您购买的套餐，并选择现金转账支付方式，点击【立即购买】进入Pagsmile平台的支付页面。')}}</p>
      </div>

      <img class="arrow-down" src="../../assets/images/coupon/cash/arrow-down.png" alt="">

      <div class="step">
        <div class="step2-img">
          <img src="../../assets/images/coupon/cash/step-2.png" alt="">
          <span>{{$t('第二步')}}</span>
        </div>
        <p>{{$t('选择转账的银行，填写您的姓名、CPF、邮箱、手机号码，勾选同意隐私政策，点击【确认】生成银行转账的账单。')}}</p>
        <img class="step-content-img" src="../../assets/images/coupon/cash/step-2-img.png" alt="">
      </div>

      <img class="arrow-down" src="../../assets/images/coupon/cash/arrow-down.png" alt="">

      <div class="step">
        <div class="step1-img">
          <img src="../../assets/images/coupon/cash/step-3.png" alt="">
          <span>{{$t('第三步')}}</span>
        </div>
        <p>{{$t('Pagsmile平台将向您填写的手机号发送短信，短信包含账单信息和上传支付凭证的链接，请妥善保存！')}}</p>
        <img class="step-content-img" src="../../assets/images/coupon/cash/step-3-img.png" alt="">
      </div>

      <img class="arrow-down" src="../../assets/images/coupon/cash/arrow-down.png" alt="">

      <div class="step">
        <div class="step2-img">
          <img src="../../assets/images/coupon/cash/step-4.png" alt="">
          <span>{{$t('第四步')}}</span>
        </div>
        <p>{{$t('请前往对应的银行完成转账，并保留支付凭证。')}}</p>
        <p>{{$t('转账完成后您可打开短信的链接，完成支付凭证上传，Pagsmile平台将尽快完成审核。')}}</p>
      </div>

      <img class="arrow-down" src="../../assets/images/coupon/cash/arrow-down.png" alt="">

      <div class="step">
        <div class="step1-img">
          <img src="../../assets/images/coupon/cash/step-5.png" alt="">
          <span>{{$t('第五步')}}</span>
        </div>
        <p>{{$t('当您的凭证审核通过或者不通过，Pagsmile平台都会向您填写的邮箱发送邮件，请注意查收，谢谢！')}}</p>
      </div>

      <div class="tip">
        <p>{{$t('提示')}}: </p>
        <p>{{$t('1. 当您无法打开链接上传支付凭证，或者上传支付凭证失败，请您尝试切换网络重新打开链接上传，或者稍后重试。')}}</p>
        <p>{{$t('2. 为确保审核通过，请您上传真实有效且内容完整，图片清晰的支付凭证，谢谢。')}}</p>
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
        lang: sessionStorage.getItem("lang") ?
          sessionStorage.getItem("lang") : "",
        title: 'Payment in lotteries',
        payWay: 'Payment in lotteries'
      };
    },
    mounted() {
      this.title = _.get(this.$route.query, 'title');
      this.payWay = _.get(this.$route.query, 'payWay');
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
      padding: 0 1.5rem;
      text-align: center;
      padding-top: 2rem;
      padding-bottom: 1rem;

      .step {
        position: relative;
        background: #fff;
        border-radius: 1.25rem;
        margin: 1rem 0;
        padding: 3rem 1rem;
        color: #666;

        p {
          text-align: left;
        }

        .step-content-img {
          width: 80%;
          margin: 1rem auto;
        }

        .step1-img {
          position: absolute;
          left: -0.5rem;
          top: -2.5rem;

          img {
            height: 5rem;
          }

          span {
            position: absolute;
            color: #fff;
            right: 2rem;
            bottom: 1.5rem;
            font-size: 1.5rem;
            font-weight: bold;
          }
        }

        .step2-img {
          position: absolute;
          right: -0.5rem;
          top: -2.5rem;

          img {
            height: 5rem;
          }

          span {
            position: absolute;
            color: #fff;
            left: 2rem;
            bottom: 1.5rem;
            font-size: 1.5rem;
            font-weight: bold;
          }
        }
      }

      .arrow-down {
        width: 1rem;
        margin: 0 auto;
      }

      .tip {
        text-align: left;
        color: #333;
        margin: 2rem .5rem 1rem .5rem;
      }
    }
  }

</style>
