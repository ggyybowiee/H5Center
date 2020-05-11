<template>
  <div class="register-scuccess scanpaycore-page">
    <div v-if="isShow">
      <img src="../../assets/images/bindEmail.png" alt style="height: 90px;" />
      <h3>{{$t('绑定成功')}}!</h3>
      <p v-if="!changeBind">{{$t('绑定成功进入应用')}}{{apkName}}{{$t('服务')}}!</p>
    </div>
  </div>
</template>
<script>
  import api from "../../api/api";
  export default {
    data() {
      return {
        changeBind: false,
        isShow: false,
        apkName: sessionStorage.getItem("apkName") ?
          sessionStorage.getItem("apkName").replace(/%20/g, " ") : "Brasil TV"
      };
    },
    created() {
      if (this.$route.params.changeBind) {
        this.changeBind = true;
      }

      let urlParams = this.common.getUrlParams(window.location.href);

      if (urlParams["access"] && urlParams["access"] !== "") {
        //调用后台，把数据传给后台
        let params = {
          token: urlParams["access"]
        };
        this.$http
          .post(api.bindEmail(), params)
          .then(res => {
            if (res.data.returnCode == "0") {
              this.isShow = true;
            } else if (res.data.returnCode == "portal100055") {
              this.message(this.$t("链接失效，请重新操作"));
            } else {
              this.message(this.$t("系统繁忙"));
            }
          })
          .catch(() => {
            this.message(this.$t("网络异常"));
          });
      } else {
        this.isShow = true;
      }
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
    }
  };

</script>
<style lang="less">
  .register-scuccess {
    text-align: center;
    padding: 6rem 3%;
    line-height: 1.8rem;
    font-size: 1.4rem;

    h3 {
      margin-top: 2rem;
      color: #1bd67b;
      font-size: 1.75rem;
    }

    p {
      margin-top: 1rem;
    }
  }

</style>
