<template>
  <div class="fail-page padding-lr3 scanpaycore-page">
    <img src="../../assets/images/fail.png" alt class="fail-img" />
    <p class="pay-fail">{{$t('支付失败')}}!</p>
    <p class="desp">{{$t('请将此页截图')}}: {{email}}</p>
    <p class="number">{{$t('订单编号')}}: {{payId}}</p>
    <p class="reorder" @click="reOrder()">{{$t('重新下单')}}</p>
    <p class="tips">{{$t('温馨提示：您可以尝试其他支付方式进行支付，谢谢！')}}</p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        payId: sessionStorage.getItem("payId") ? sessionStorage.getItem("payId") : "",
        email: sessionStorage.getItem("email") ? sessionStorage.getItem("email") : ""
      };
    },
    methods: {
      copy() {
        let url = document.querySelector("#copyObj");
        url.select(); // 选择对象
        document.execCommand("Copy");
        document.activeElement.blur();
        this.$message.closeAll();

        this.$message({
          duration: 4000,
          showClose: true,
          message: `${this.$t("复制成功")}`,
          type: "",
          iconClass: ""
        });
      },
      reOrder() {
        this.$router.push({
          path: "/index"
        });
      }
    }
  };

</script>

<style lang="less" scoped>
  .fail-page {
    text-align: center;
    font-size: 1.25rem;

    .fail-img {
      width: 6rem;
      margin: 5rem auto 2rem;
    }

    .pay-fail {
      font-size: 1.8rem;
      color: #333;
    }

    .number {
      color: #ff4e53;
      margin: 3rem 0rem;
    }

    .desp {
      line-height: 2.1rem;
      color: #999;
      margin-top: 1rem;
    }

    .reorder {
      margin-bottom: 2rem;
      color: #fff;
      padding: 0.75rem 0;
      background: #3cd977;
      font-size: 1.8rem;
    }

    .tips {
      color: #666;
      text-decoration: underline;
    }
  }

</style>
