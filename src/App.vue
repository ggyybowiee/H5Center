<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  import api from "./api/api";

  export default {
    name: "App",
    data() {
      return {
        urlParams: null,
      }
    },
    created() {
      let findIndex = window.location.href.indexOf("%3F");
      let href = window.location.href;

      if (findIndex > -1) {
        href = href.replace('%3F', '&');
        href = href.replace('%3D', '=');
        window.location.href = href;
      }

      this.urlParams = this.common.getUrlParams(window.location.href);

      // 缓存入参
      for (let i in this.urlParams) {
        sessionStorage.setItem(i, this.urlParams[i]);
      }

      // V3.1版本TV端支持西语
      let langArr = ["en", "zh", "pt", "es"];

      if (langArr.indexOf(sessionStorage.getItem("lang")) > -1) {
        this.$i18n.locale = sessionStorage.getItem("lang");
      } else {
        this.$i18n.locale = "en";
      }

      if (!sessionStorage.getItem("lang")) {
        let navigatorLang = (navigator.language || navigator.browserLanguage).toLowerCase();
        if (navigatorLang.indexOf("en") > -1) {
          this.$i18n.locale = "en";
        } else if (navigatorLang.indexOf("pt") > -1) {
          this.$i18n.locale = "pt";
        }
      }

      // V3.1.1 兼容Tv端不支持西语的情况，等后续TV端更新至最新版本后，再去除该逻辑判断
      if (href.indexOf('tv-help') > -1 && !!sessionStorage.getItem("tvType")) {
        this.$i18n.locale = "en";
      }

    },
    mounted() {
      sessionStorage.setItem('email', _.get(setting.appIdMap, [this.urlParams.appId]));
    },
    methods: {},
  };

</script>

<style></style>
