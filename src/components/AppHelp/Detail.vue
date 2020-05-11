<template>
  <div class="index-page">
    <p class="head-title"><i class="shopIcon shop-jiantou-copy" @click="goBack()"></i>{{$t('问题详情')}}</p>
    <div class="index-tab">
      <h5>{{$t(detailObj.question)}}</h5>
      <p v-html="detailObj.answer" class="ql-editor"></p>
    </div>
    <p class="email">
      <span>{{$t('客服邮箱')}}</span>
      <span>{{email}}</span>
    </p>
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
        detailObj: sessionStorage.getItem("detailObj") ?
          JSON.parse(sessionStorage.getItem("detailObj")) : {},
        email: sessionStorage.getItem("email") ?
          sessionStorage.getItem("email") : ""
      };
    },
    mounted() {
      document.title = this.$t("问题详情");
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

    .index-tab {
      min-height: 20rem;
      background: #2d2d39;
      padding: 1rem;
      margin-top: 1rem;
      overflow: auto;

      h5 {
        font-size: 1.75rem;
        margin-bottom: 0.5rem;
      }

      p {
        line-height: inherit;
        font-size: 1.4rem;
      }
    }

    .email {
      color: #fff;
      height: 2.5rem;
      line-height: 2.5rem;
      text-align: center;
      height: 3.75rem;
      line-height: 3.75rem;
      margin-top: 1rem;
      border: 1px solid #2d2d39;
      background: #2d2d39;
      padding: 0 1rem;
      display: flex;
      justify-content: space-between;

      span:first-child {
        font-size: 1.75rem;
      }

      span:last-child {
        color: #ccc;
        font-size: 1.4rem;
      }
    }
  }

</style>
