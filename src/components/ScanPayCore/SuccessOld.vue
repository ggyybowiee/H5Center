<template>
  <div class="success-page padding-lr3">
    <i class="el-icon-circle-check-outline"></i>
    <p class="pay-success">{{$t('支付成功')}}!</p>
    <p class="order-number">{{$t('订单编号')}}:</p>
    <p class="number">{{payId}}</p>
    <p>{{$t('您的服务有效期剩余')}}: {{invalidTime}}{{$t('天')}}</p>
    <footer>
      <p>{{$t('请将此页截图')}}:</p>
      <p class="email">service_abs_1231@outlook.com</p>
    </footer>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        payId: sessionStorage.getItem("payId") ?
          sessionStorage.getItem("payId") : "",
        invalidTime: sessionStorage.getItem("invalidTime") ?
          sessionStorage.getItem("invalidTime") : ""
      };
    },
    created() {
      this.invalidTime = this.common.changeTimeStr(this.invalidTime) ?
        this.common.changeTimeStr(this.invalidTime) :
        sessionStorage.getItem("remainingDays");
    }
  };

</script>

<style lang="less" scoped>
  .success-page {
    text-align: center;

    i {
      font-size: 4rem;
      color: #1bd67b;
      margin-top: 2rem;
      margin-bottom: 2.4rem;
    }

    .pay-success {
      font-size: 1.4rem;
    }

    .order-number {
      margin-top: 1rem;
      margin-bottom: 0.5rem;
    }

    .number {
      color: #d72940;
      font-weight: bold;
      font-size: 1.6rem;
      margin-bottom: 1rem;
    }

    footer {
      margin-top: 6rem;

      >p {
        line-height: 1.8rem;
      }

      .email {
        color: #007aff;
      }
    }
  }

</style>
