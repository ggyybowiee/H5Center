<template>
  <div class="scanpaycore-page">

  </div>
</template>

<script>
  import api from "../../api/api";

  export default {
    data() {},
    created() {},
    mounted() {
      var that = this;
      document.title = this.$t("绑定邮箱");

      //调用后台，把数据传给后台
      let params = {
        token: sessionStorage.getItem("access") ?
          sessionStorage.getItem("access") : ""
      };
      this.$http
        .post(api.bindEmail(), params)
        .then(res => {
          if (res.data.returnCode == "0") {
            //成功，跳转到成功页面
            this.$router.push({
              name: 'BindEmailSuccess',
              params: {
                changeBind: true
              }
            });
          } else if (res.data.returnCode == "portal100055") {
            this.message(this.$t("链接失效，请重新操作"));
          } else {
            this.message(this.$t("系统繁忙"));
          }
        })
        .catch(() => {
          this.message(this.$t("网络异常"));
        });
    },
    methods: {
      // 消息提示
      message(parame) {
        this.$message.closeAll();

        this.$message({
          duration: 4000,
          showClose: true,
          message: `${parame}`,
          type: "",
          iconClass: ""
        });
      }
    },
  }

</script>

<style lang="less">

</style>
