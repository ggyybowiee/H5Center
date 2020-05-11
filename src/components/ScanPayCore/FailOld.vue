<template>
  <div class="fail-page padding-lr3">
    <i class="el-icon-circle-close-outline"></i>
    <p class="pay-fail">{{$t('支付失败')}}!</p>
    <p class="order-number">{{$t('订单编号')}}:</p>
    <p class="number">{{payId}}</p>
    <!-- <span
      id="copy"
      onclick="_czc.push(['_trackEvent', '复制', '复制', '','','copy']);"
      @click="copy()"
    >{{$t('复制')}}</span>
    <input type="text" v-model="payId" id="copyObj">-->

    <footer>
      <p>{{$t('请将此页截图')}}:</p>
      <p class="email">service_abs_1231@outlook.com</p>
      <span class="reorder" @click="reOrder()">{{$t('重新下单')}}</span>
    </footer>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        payId: sessionStorage.getItem("payId") ?
          sessionStorage.getItem("payId") :
          ""
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

    #copyObj {
      display: block;
      opacity: 0;
    }

    i {
      font-size: 4rem;
      color: #d72940;
      margin-top: 2rem;
      margin-bottom: 2.4rem;
    }

    .pay-fail {
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
      margin-bottom: 1.2rem;
    }

    >span {
      color: #ffffff;
      padding: 0.4rem 1rem;
      background-color: #e5e5e5;
      display: inline-block;
      border-radius: 0.2rem;
    }

    footer {
      margin-top: 4rem;

      >p {
        line-height: 1.8rem;
      }

      .email {
        color: #007aff;
      }

      .reorder {
        margin-top: 4rem;
        font-size: 1.4rem;
        color: #999999;
        display: inline-block;
        border-bottom: 1px solid #999;
      }
    }
  }

</style>
