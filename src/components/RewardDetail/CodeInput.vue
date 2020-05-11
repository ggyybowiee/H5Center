<template>
  <div class="index-page">
    <p class="head-title">
      <i class="shopIcon shop-jiantou-copy" @click="goBack()"></i>
      {{$t('奖励详情1')}}
    </p>
    <div class="invite-code-input-div common-margin">
      <p class="word-description">{{$t('填写好友邀请码，您和他都能获得奖励')}}</p>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="reward-ruleForm">
        <el-form-item prop="inviteCode">
          <el-input v-model="ruleForm.inviteCode" :placeholder="$t('请输入好友的邀请码')"></el-input>
        </el-form-item>
        <el-form-item class="submit-button">
          <el-button type="primary" @click="submitForm('ruleForm')">{{$t('确定')}}</el-button>
        </el-form-item>
      </el-form>
    </div>

    <p class="bottom common-margin">
      <span @click="showRules()">{{$t('查看邀请有奖规则')}}</span>
    </p>

    <!-- 确认信息提示页面 -->
    <div v-if="confirmTips" class="modal confirm-tips">
      <div class="shadow"></div>
      <div class="content">
        <h3>{{$t('注意')}}</h3>
        <p class="tips">{{$t('你输入的邀请码是')}}: {{ruleForm.inviteCode}}</p>
        <p class="only-one">{{$t('仅可使用一次邀请码')}}</p>
        <p class="only-one">{{$t('请确认是否使用？')}}</p>
        <!-- 按钮区域-->
        <span @click="submitModal()" class="ok-btn">{{$t('确定')}}</span>
        <span @click="modalClose()" class="cancel-btn">{{$t('取消')}}</span>
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
        selfInviteCode: sessionStorage.getItem("selfInviteCode") ?
          sessionStorage.getItem("selfInviteCode") : "",
        confirmTips: false,
        ruleForm: {
          inviteCode: ""
        },
        rules: {}
      };
    },
    mounted() {
      document.title = this.$t("邀请有奖");
    },
    watch: {},
    directives: {},
    filters: {},
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      showRules() {
        this.$router.push({
          path: "/rules-detail"
        });
      },
      modalClose() {
        this.confirmTips = false;
      },
      submitModal() {
        let urlParams = this.common.getUrlParams(window.location.href);

        //调用后台，把数据传给后台
        let params = {
          inviteCode: this.ruleForm.inviteCode,
          uid: urlParams.uid,
          app: urlParams.app,
          token: this.$md5(
            urlParams["uid"] +
            urlParams["app"] +
            this.ruleForm.inviteCode +
            "K07WCqxe"
          )
        };
        this.$http
          .post(api.exchangeInviteCode(), params)
          .then(res => {
            this.confirmTips = false;
            let returnCode = res.data.returnCode;
            if (returnCode == 0) {
              let text =
                this.$t("恭喜你获得服务时长") +
                res.data.data.rewardDays +
                this.$t("复数天") +
                this.$t("请退出应用重新进入“我的”刷新服务时长");
              this.message(text);
            } else if (returnCode == "aaa100086") {
              this.message(this.$t("邀请码无效！"));
            } else if (returnCode == "aaa100087") {
              this.message(this.$t("邀请码已失效！"));
            } else if (returnCode == "aaa100085") {
              this.message(this.$t("此账号已使用过邀请码！"));
            } else if (returnCode == "aaa100075") {
              this.message(this.$t("你的账号异常，无法使用邀请码！"));
            } else if (returnCode == "aaa100088") {
              this.message(this.$t("邀请码使用异常，请联系客服"));
            } else if (returnCode == "1" || returnCode == "500") {
              this.message(this.$t("系统异常，请稍后重试！"));
            }
          })
          .catch(err => {
            this.confirmTips = false;
            this.message(this.$t("网络超时，请重试！"));
            console.log(err);
          });
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (this.ruleForm.inviteCode == "") {
              this.message(this.$t("邀请码不能为空！"));
              return;
            }

            if (this.ruleForm.inviteCode.length != 6) {
              this.message(this.$t("请输入6位邀请码！"));
              return;
            }

            if (this.ruleForm.inviteCode == this.selfInviteCode) {
              this.message(
                this.$t("您无法使用自己的邀请码，请输入其他的邀请码！")
              );
              return;
            }

            this.confirmTips = true;
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      // 消息提示
      message(msg) {
        this.$message.closeAll();

        this.$message({
          duration: 5000,
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
    font-size: 1.3rem;
    position: relative;
    min-height: 100vh;
    background: #20202a;
    color: #fff;
    display: flex;
    flex-direction: column;
    text-align: center;

    .el-message {
      font-size: 1.3rem;
    }

    .common-margin {
      margin-left: 3%;
      margin-right: 3%;
    }

    .head-title {
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

    .invite-code-input-div {
      padding: 1rem;

      .word-description {
        margin: 0.5rem 0rem 2rem 0rem;
        font-size: 1.5rem;
      }

      .el-button {
        color: #ffffff;
        border: unset;
        background-color: #3bda76;
        padding: 1rem;
        font-size: 1.4rem;
        width: 50%;
        margin-top: 2rem;
      }

      .tips {
        color: #dcb442;
      }
    }

    .bottom {
      position: absolute;
      bottom: 0;
      width: 100%;
      text-align: center;
      margin: 2rem 0;

      span {
        text-align: center;
        color: #999;
        display: inline-block;
        border-bottom: 1px solid #999;
      }
    }

    .modal {
      .shadow {
        z-index: 3;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        position: absolute;
        background: rgba(0, 0, 0, 0.5);
      }

      .content {
        z-index: 9999;
        top: 22%;
        left: 10%;
        width: 80%;
        position: fixed;
        border-radius: 4px;
        overflow: auto;
        max-height: 80%;
        background: #fff;
        color: #666;
      }
    }

    .confirm-tips {
      text-align: center;

      h3 {
        border-bottom: 1px solid #e4e4e4;
        color: #3bda76;
        padding: 1rem;
      }

      .tips {
        margin-top: 1rem;
      }

      .only-one {
        margin-top: 0.5rem;
      }

      span {
        cursor: pointer;
        display: block;
        width: 60%;
        border: 1px solid #3bda76;
        border-radius: 4px;
        margin: 1rem auto;
        padding: 0.5rem 0;
      }

      .ok-btn {
        background: #3bda76;
        color: #fff;
        margin-top: 3rem;
      }

      .cancel-btn {
        background: #fff;
        color: #3bda76;
      }
    }
  }

</style>
