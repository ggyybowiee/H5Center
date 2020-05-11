<template>
  <div class="index-page">
    <p class="head-text"><i class="shopIcon shop-jiantou-copy" @click="goBack()"></i>{{$t('奖励详情')}}</p>
    <div class="index-tab">
      <div class="tab">
        <p class="head-title">{{$t('活动简介')}}</p>
        <p class="content">{{$t('活动内容')}}</p>

        <p class="head-title">{{$t('参与流程')}}</p>
        <img src="../../assets/images/rule-en.png" alt="" v-if="lang == 'zh' || lang == 'en'">
        <img src="../../assets/images/rule-pt.png" alt="" v-if="lang == 'pt'">
        <img src="../../assets/images/rule-es.png" alt="" v-if="lang == 'es'">

        <p class="head-title">{{$t('注意事项')}}</p>
        <p class="content">{{$t('事项1')}}</p><br>
        <p class="content">{{$t('事项2')}}</p><br>
        <p class="content">{{$t('事项3')}}</p>
        <p class="content">{{$t('奖励1')}}</p>
        <p class="content">{{$t('奖励2')}}</p><br>
        <p class="content">{{$t('事项4')}}</p><br>
        <p class="content">{{$t('事项5')}} {{email}}</p><br>
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
        email: sessionStorage.getItem("email") ?
          sessionStorage.getItem("email") : ""
      };
    },
    mounted() {
      document.title = this.$t("详细规则");
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
    min-height: 100vh;
    background: #20202a;
    color: #fff;

    .head-text {
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
      display: flex;
      flex-direction: column;

      .tab {
        flex: 1;
        border-radius: 0.5rem;
        max-height: calc(100vh - 3.75rem);
        overflow-y: auto;
        padding: 0rem 1rem;
        text-align: center;

        .head-title {
          color: #ffaa01;
          margin: 1rem 0rem;
          font-size: 1.5rem;
        }

        .content {
          font-size: 1.3rem;
          color: #fff;
        }

        img {
          width: 100%;
        }

        p {
          text-align: left;
        }
      }
    }
  }

</style>
