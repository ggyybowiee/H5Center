<template>
  <div class="success-page padding-lr3 scanpaycore-page">
    <i class="el-icon-circle-check-outline"></i>
    <p class="pay-success" v-if="fromFeedback">{{$t('非常感谢您的反馈')}}</p>
    <div v-if="!fromFeedback">
      <p class="pay-success">{{$t('支付成功')}}!</p>
      <p class="service-time">{{$t('您的服务有效期增加')}}: <strong>{{authorizedDays}}</strong> {{$t('复数天')}}
      </p>
      <p class="tip">{{$t('提示：服务使用时长已增加，建议退出应用重进')}}</p>
      <p class="number">{{$t('订单编号')}}: {{payId}}</p>
      <footer>
        <p>{{$t('请将此页截图')}}:</p>
        <p class="email">{{email}}</p>
      </footer>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        fromFeedback: false,
        payId: sessionStorage.getItem("payId") ? sessionStorage.getItem("payId") : "",
        authorizedDays: sessionStorage.getItem("authorizedDays") ?
          sessionStorage.getItem("authorizedDays") : "",
        email: sessionStorage.getItem("email") ? sessionStorage.getItem("email") : ""
      };
    },
    created() {
      if (this.$route.params.fromFeedback) {
        this.fromFeedback = true;
      }
    }
  };

</script>

<style lang="less" scoped>
  .success-page {
    text-align: center;
    font-size: 1.4rem;

    i {
      font-size: 4rem;
      color: #1bd67b;
      margin-top: 2rem;
      margin-bottom: 2.4rem;
    }

    .pay-success {
      font-size: 1.75rem;
      font-weight: bold;
    }

    .service-time {
      font-size: 1.5rem;
      font-weight: bold;

      strong {
        color: #d72940;
        font-size: 1.75rem;
      }
    }

    .order-number {
      margin-top: 1rem;
      margin-bottom: 0.5rem;
    }

    .number {
      color: #1bd67b;
      font-size: 1.6rem;
    }

    .tip {
      line-height: 2.1rem;
      margin: 2rem 0rem 4rem 0rem;
    }

    footer {
      margin-top: 2rem;

      >p {
        line-height: 2.1rem;
      }

      .email {
        color: #1bd67b;
      }
    }
  }

</style>
