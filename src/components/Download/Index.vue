<template>
  <div class="index-page">
    <div v-if="appId.indexOf('unitv') == -1">
      <img class="logoImg" src="../../assets/images/brasiltv-logo.png" alt />
      <p class="desp">{{$t('请点击下方的按钮，下载Brasil TV 手机app')}}</p>
      <a class="downloadBtn" :href="_.get(setting, 'brasilTvDownloadUrl')">{{$t('立即下载')}}</a>
      <p class="limit">* {{$t('仅支持安卓设备')}}</p>
      <p class="tip">{{$t('Brasil TV下载提示信息')}}</p>
    </div>

    <div v-if="appId.indexOf('unitv') > -1">
      <img class="logoImg" src="../../assets/images/unitv-logo.png" alt />
      <p class="desp">{{$t('请点击下方的按钮，下载UniTV手机app')}}</p>
      <a class="downloadBtn" style="background: #c91923" :href="_.get(setting, 'uniTvDownloadUrl')">{{$t('立即下载')}}</a>
      <p class="limit">* {{$t('仅支持安卓设备')}}</p>
      <p class="tip">{{$t('UniTV下载提示信息')}}</p>
    </div>

  </div>
</template>

<script>
  import api from "../../api/api";
  export default {
    data() {
      return {
        lang: sessionStorage.getItem("lang") ? sessionStorage.getItem("lang") : "",
        appId: sessionStorage.getItem("appId") ? sessionStorage.getItem("appId") : "",
        setting: setting
      };
    },
    mounted() {
      document.title = this.$t("下载");
    },
    watch: {},
    directives: {},
    filters: {},
    methods: {
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
    padding: 0 5%;
    text-align: center;
    font-size: 1.5rem;
    max-width: 800px;
    margin: 0 auto;
    position: relative;
    background: #fff;
    height: 100vh;

    .logoImg {
      width: 8rem;
      margin: 5rem 0 3rem 0;
    }

    p {
      line-height: 2rem;
    }

    .desp {
      color: #333;
      font-size: 1.75rem;
      margin-bottom: 3rem;
      word-break: break-all;
    }

    a {
      cursor: pointer;
      color: #fff;
      background: #2ac665;
      padding: 0.8rem 2rem;
      border-radius: 0.3rem;
      width: calc(100% - 4rem);
      display: inline-block;
    }

    .limit {
      color: #f00;
      margin-top: 1rem;
    }

    .tip {
      margin-top: 7rem;
      color: #999;
    }
  }

</style>
