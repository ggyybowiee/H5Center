<template>
  <div class="index-page">
    <p class="head-title"><i class="shopIcon shop-jiantou-copy" @click="goBack()"></i>{{$t('意见反馈')}}</p>
    <img class="paper-plane" src="../../assets/images/fail.png" v-if="returnCode != '0'" />
    <img class="paper-plane" src="../../assets/images/success.png" v-if="returnCode == '0'" />
    <div v-if="returnCode != '0'" class="message">
      <p>{{$t('提交失败，请检查您的网络')}}</p>
    </div>

    <div v-if="returnCode == '0'" class="message">
      <p>{{$t('感谢您的反馈，我们会尽快跟进处理')}}</p>
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
        returnCode: sessionStorage.getItem("feedBackReturnCode") ?
          sessionStorage.getItem("feedBackReturnCode") : "",
      };
    },
    mounted() {
      document.title = this.$t("意见反馈");
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
      },
    }
  };

</script>
<style lang="less" scoped>
  .index-page {
    padding: 0;
    font-size: 1.25rem;
    position: relative;
    height: 100vh;
    max-width: 800px;
    margin: 0 auto;
    background: #20202a;
    color: #fff;
    display: flex;
    flex-direction: column;

    .head-title {
      text-align: center;
      background: #1a1a24;
      color: #fff;
      height: 2.75rem;
      line-height: 2.75rem;
      padding: 0.5rem;
      font-size: 1.75rem;

      i {
        position: absolute;
        left: 0rem;
        color: #fff;
        width: 3rem;
        font-size: 1.75rem;
      }
    }

    .paper-plane {
      width: 6.5rem;
      margin: 0 auto;
      margin-top: 8rem;
    }

    .message {
      color: #fff;
      line-height: 2.5rem;
      height: 2.5rem;
      text-align: center;
      margin-top: 1.5rem;
      width: calc(100% - 4rem);
      margin-left: 2rem;
    }
  }

</style>
