<template>
  <div class="index-new-page scanpaycore-page">
    <img src="../../assets/images/friend-recommend/share-link-bg.jpg" alt />

    <div class="contact">
      <p>{{$t('我有更多问题想咨询')}} whatsapp: {{_.get(setting, 'whatsapp')}}</p>
    </div>

    <a class="downloadBtn" @click="openOrDownloadApp()" :href="_.get(setting, 'openBrasilTvAppLink')" id="zjmobliestart"
      target="_blank">Abrir/Instalar o App "Brasil TV"</a>
  </div>
</template>

<script>
  import api from "../../api/api";
  export default {
    data() {
      return {
        setting: setting,
        userId: ""
      };
    },
    mounted() {
      document.title = "Brasil TV";
      this.userId = _.get(
        this.common.getUrlParams(window.location.href),
        "userId"
      );
    },
    watch: {},
    directives: {},
    filters: {},
    methods: {
      countClickTimes: _.debounce(function () {
        let params = {
          userId: this.userId
        };
        this.$http
          .get(api.countClickTimes(), {
            params
          })
          .then(res => {
            if (res.data.returnCode == "0") {
              _self.promptFlag = true;
            } else {
              _self.message(this.$t("系统异常，请稍后重试！"));
            }
          })
          .catch(() => {});
      }, 3000),
      openOrDownloadApp() {
        this.countClickTimes();
        let clickedAt = +new Date();
        setTimeout(() => {
          !window.document.webkitHidden &&
            setTimeout(() => {
              if (+new Date() - clickedAt < 2000) {
                window.location.href = _.get(this.setting, "brasilTvDownloadUrl");
              }
            }, 500);
        }, 500);
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
    overflow: auto;
    background: #fb6531;
    display: flex;
    flex-direction: column;

    img {
      width: 100%;
    }

    .downloadBtn {
      position: fixed;
      bottom: 0;
      height: 4rem;
      line-height: 4rem;
      border: none;
      background: #2881db;
      color: #fff;
      width: 100%;
      max-width: 800px;
      text-align: center;
      font-size: 1.6rem;
    }

    .contact {
      margin: 2rem 1rem;
      margin-bottom: 6rem;
      padding: 1rem 0;
      text-align: center;
      color: #fff;
      border-radius: 0.75rem;
      font-size: 1.4rem;
      background-color: #dc5c30;
    }
  }

</style>
