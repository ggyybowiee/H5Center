<template>
  <div class="success-page padding-lr3 scanpaycore-page">
    <i class="el-icon-my-checking"></i>
    <p class="pay-success">{{$t('订单审核中')}}...</p>
    <p class="tip">{{$t('提示：此订单会在48小时内审核完成，审核通过后，会自动为你增加服务使用时长。')}}</p>
    <p class="number">{{$t('订单编号')}}: {{payId}}</p>
    <footer>
      <p>{{$t('请将此页截图')}}:</p>
      <p class="email">{{email}}</p>
    </footer>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        fromFeedback: false,
        payId: sessionStorage.getItem("payId") ? sessionStorage.getItem("payId") : "",
        email: sessionStorage.getItem("email") ? sessionStorage.getItem("email") : ""
      };
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
