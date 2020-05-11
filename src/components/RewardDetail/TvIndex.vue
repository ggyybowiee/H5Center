<template>
  <div :class="['index-page', {'unitv-tab': tvType == 2}]" hidefocus tabindex="6">
    <div class="invite-title">
      {{$t('邀请有奖')}}
    </div>
    <div class="wrap">
      <div class="left-part">
        <p class="invite-code">{{$t('您的邀请码')}}: <span id="text" class="num-color">{{selfInviteCode}}</span></p>
        <p class="invite-prize">{{$t('奖励详情')}}:</p>
        <p class="invite-people"><span class="num-color">{{hasInvitedPeople}}</span> {{$t('人已被成功邀请')}}</p>
        <p class="invite-days">{{$t('系统累积赠送应用服务时长')}} <span class="num-color">{{rewardDays}}</span> {{$t('复数天')}}</p>
        <div v-if="!hasFillInviteCode">
          <hr class="hr-line">
          <p class="word-description">{{$t('填写好友邀请码')}}</p>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="tv-reward-ruleForm">
            <el-form-item prop="inviteCode">
              <el-input v-model="ruleForm.inviteCode" id="input-code" hidefocus tabindex="1">
              </el-input>
              <el-button @click="submitForm('ruleForm')" hidefocus tabindex="2"
                :class="[tvType == '2'?'unitv-check-btn':'brasiltv-check-btn']" id="check-btn">
                {{$t('兑换')}}
              </el-button>
            </el-form-item>
          </el-form>
          <p class="submit-success-info" v-if="showSuccessInfo">{{$t('已兑换服务时长为')}} {{gotRewardDays}} {{$t('复数天')}}.
            {{$t('请退出应用重新进入“个人中心”刷新')}}</p>
          <p class="submit-error-info" v-if="showErrorInfo">{{showErrorText}}</p>
        </div>

        <p class="bottom num-color">
          <span @click="showRules()" tabindex="3" hidefocus id="show-rule">{{$t('查看邀请有奖规则')}}</span>
        </p>
      </div>

      <div class="right-part">
        <img src="../../assets/images/brasiltv/brasiltv-gift-box.png" alt="" v-if="tvType == '1'">
        <img src="../../assets/images/unitv/unitv-gift-box.png" alt="" v-if="tvType == '2'">
      </div>

      <!-- 确认信息提示页面 -->
      <div v-if="confirmTips"
        :class="['modal', {'unitv-tips-section': tvType=='2'},{'brasiltv-tips-section': tvType=='1'}]">
        <div class="shadow"></div>
        <div class="content">
          <p class="tips">{{$t('你输入的邀请码是')}}</p>
          <p class="input-code">{{ruleForm.inviteCode}}</p>
          <!-- 按钮区域-->
          <div class="submit-section clearfloat">
            <span @click="submitModal()" class="float-l" tabindex="4" hidefocus id="yes-confirm"
              nextRightFocusId="no-confirm" v-loading.fullscreen.lock="fullscreenLoading">{{$t('确定')}}</span>
            <span @click="modalClose()" class="float-r" tabindex="5" hidefocus id="no-confirm"
              nextLeftFocusId="yes-confirm">{{$t('取消')}}</span>
          </div>
          <p class="only-one">{{$t('仅可使用一次邀请码，请确认是否使用？')}}</p>
        </div>
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
        hasFillInviteCode: sessionStorage.getItem("hasFillInviteCode") == 'true' ? true : false,
        selfInviteCode: sessionStorage.getItem("selfInviteCode") ?
          sessionStorage.getItem("selfInviteCode") : "XXXXXX",
        rewardDays: sessionStorage.getItem("rewardDays") ?
          sessionStorage.getItem("rewardDays") : "20",
        hasInvitedPeople: sessionStorage.getItem("hasInvitedPeople") ?
          sessionStorage.getItem("hasInvitedPeople") : "10",
        showSuccessInfo: false,
        showErrorInfo: false,
        confirmTips: false,
        fullscreenLoading: false,
        showErrorText: '',
        tvType: sessionStorage.getItem("tvType") ?
          sessionStorage.getItem("tvType") : 1,
        gotRewardDays: '',
        ruleForm: {
          inviteCode: ''
        },
        rules: {}
      };
    },
    mounted() {
      document.title = this.$t("邀请有奖");
      document.getElementById("input-code").focus();
    },
    watch: {},
    directives: {},
    filters: {},
    methods: {
      showRules() {
        this.$router.push({
          path: "/tv-rules-detail"
        });
      },
      modalClose() {
        this.confirmTips = false;
        if (android) {
          android.showDialog(false);
        }
      },
      submitModal() {
        let urlParams = this.common.getUrlParams(window.location.href);
        this.fullscreenLoading = true;

        //调用后台，把数据传给后台
        let params = {
          inviteCode: this.ruleForm.inviteCode,
          uid: urlParams.uid,
          app: urlParams.app,
          token: this.$md5(urlParams['uid'] + urlParams['app'] + this.ruleForm.inviteCode + 'K07WCqxe')
        };

        this.$http
          .post(api.exchangeInviteCode(), params)
          .then(res => {
            this.confirmTips = false;
            if (android) {
              android.showDialog(false);
            }
            this.fullscreenLoading = false;
            let returnCode = res.data.returnCode;
            if (returnCode == 0) {
              this.gotRewardDays = res.data.data.rewardDays;
              this.showSuccessInfo = true;
            } else if (returnCode == 'aaa100086') {
              this.showErrorInfo = true;
              this.showErrorText = this.$t("邀请码无效！");
            } else if (returnCode == 'aaa100087') {
              this.showErrorInfo = true;
              this.showErrorText = this.$t("邀请码已失效！");
            } else if (returnCode == 'aaa100085') {
              this.showErrorInfo = true;
              this.showErrorText = this.$t("此账号已使用过邀请码！");
            } else if (returnCode == 'aaa100075') {
              this.showErrorInfo = true;
              this.showErrorText = this.$t("你的账号异常，无法使用邀请码！");
            } else if (returnCode == 'aaa100088') {
              this.showErrorInfo = true;
              this.showErrorText = this.$t("邀请码使用异常，请联系客服");
            } else if (returnCode == '1' || returnCode == '500') {
              this.showErrorInfo = true;
              this.showErrorText = this.$t("系统异常，请稍后重试！");
            }
          })
          .catch(err => {
            this.showErrorInfo = true;
            this.confirmTips = false;
            if (android) {
              android.showDialog(false);
            }
            this.fullscreenLoading = false;
            this.showErrorText = this.$t("网络超时，请重试！");
            console.log(err);
          });
      },
      submitForm(formName, e) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.showSuccessInfo = false;
            this.showErrorInfo = false;

            if (this.ruleForm.inviteCode == '') {
              this.showErrorInfo = true;
              this.showErrorText = this.$t("邀请码不能为空！");
              return;
            }

            if (this.ruleForm.inviteCode.length != 6) {
              this.showErrorInfo = true;
              this.showErrorText = this.$t("请输入6位邀请码！");
              return;
            }

            if (this.ruleForm.inviteCode == this.selfInviteCode) {
              this.showErrorInfo = true;
              this.showErrorText = this.$t("您无法使用自己的邀请码，请输入其他的邀请码！");
              return;
            }

            this.confirmTips = true;

            setTimeout(() => {
              document.getElementById("yes-confirm").focus();
              if (android) {
                android.showDialog(true);
              }
            }, 0);

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
    background: #1c1d22 url('../../assets/images/brasiltv/bg.png') no-repeat;
    background-size: cover;
    overflow-y: auto;
    color: #fff;

    /*滚动条样式*/
    ::-webkit-scrollbar {
      width: 0.5rem;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #ccc;
    }

    ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 0;
      background: transparent;
    }

    .invite-title {
      height: 4rem;
      line-height: 4.5rem;
      color: #A8A8A8;
      font-size: 2.4rem;
      border-bottom: 1px solid #b2b5b9;
      padding: 0.5rem 3rem 0rem;
    }

    .wrap {
      display: flex;
      flex-direction: row;
      padding: 1rem 3rem;

      .left-part {
        flex: 1;
        padding-right: 2rem;
        position: relative;

        .invite-code {
          margin-bottom: 0.5rem;
          font-size: 1.4rem;
        }

        .invite-prize {
          margin-bottom: 0.5rem;
          font-size: 1.4rem;
        }

        .invite-people,
        .invite-days {
          color: #b2b5b9;
        }

        .hr-line {
          border: none;
          height: 1px;
          background: #b2b5b9;
          margin: 0.8rem 0;
        }

        .word-description {
          margin-bottom: 0.5rem;
          color: #b2b5b9;
        }

        .unitv-check-btn {
          background: url('../../assets/images/unitv/默认按钮.png') 50%;
        }

        .unitv-check-btn:focus {
          background: url('../../assets/images/unitv/焦点按钮.png') 50%;
        }

        .brasiltv-check-btn {
          background: url('../../assets/images/brasiltv/默认按钮.png') 50%;
        }

        .brasiltv-check-btn:focus {
          background: url('../../assets/images/brasiltv/焦点按钮.png') 50%;
        }

        .submit-success-info,
        .submit-error-info {
          color: #229c08;
          position: relative;
          bottom: 0.5rem;
        }

        .submit-error-info {
          color: #f56c6c;
        }

        .el-input {
          width: 60%;
          margin-right: 5%;
        }

        .el-button {
          padding: 0 2rem;
          line-height: 2.5rem;
          vertical-align: top;
          font-size: 1.25rem;
        }

        .num-color {
          color: #ffaa00;
        }

        .bottom {
          margin-top: 1.2rem;

          span {
            cursor: pointer;
            border-bottom: 1px solid #fa0;
          }
        }
      }

      .right-part {
        flex-basis: 12rem;

        img {
          width: 100%;
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
          background: url('../../assets/images/遮罩层.png') center center;
        }

        .content {
          z-index: 1999;
          top: 0;
          left: 0;
          position: fixed;
          border-radius: 4px;
          overflow: auto;
          max-height: 80%;
        }
      }

      .unitv-tips-section {
        text-align: center;

        .content {
          width: 44%;
          top: 15%;
          left: 19%;
          margin: 6%;
          padding: 3%;
          background: url('../../assets/images/弹窗背景.png') 50% no-repeat;
          position: fixed;
          background-size: cover;

          .input-code {
            color: #ffa900;
            margin: 1rem 0;
            font-size: 1.6rem;
          }

          .only-one {
            color: #848484;
            font-size: 1rem;
            text-align: center;
          }

          .submit-section {
            text-align: center;
            margin-top: 1rem;
            margin-bottom: 1rem;

            span {
              padding: 0.4rem 0;
              display: inline-block;
              background: url('../../assets/images/unitv/弹窗按钮-默认.png') 50% no-repeat;
              background-size: contain;
              border-radius: 1rem;
              width: 35%;
              cursor: pointer;
              font-size: 1.1rem;
              outline: none;
            }

            span:focus {
              background: url('../../assets/images/unitv/弹窗按钮-焦点.png') 50% no-repeat;
              background-size: contain;
            }

            .float-l {
              margin-left: 12%;
            }

            .float-r {
              margin-right: 12%;
            }
          }
        }
      }


      .brasiltv-tips-section {
        text-align: center;

        .content {
          width: 44%;
          top: 15%;
          left: 19%;
          margin: 6%;
          padding: 3%;
          background: url('../../assets/images/弹窗背景.png') 50% no-repeat;
          position: fixed;
          background-size: cover;

          .input-code {
            color: #ffa900;
            margin: 1rem 0;
            font-size: 1.6rem;
          }

          .only-one {
            color: #848484;
            font-size: 1rem;
            text-align: center;
          }

          .submit-section {
            text-align: center;
            margin-top: 1rem;
            margin-bottom: 1rem;

            span {
              padding: 0.4rem 0;
              display: inline-block;
              background: url('../../assets/images/brasiltv/弹窗按钮-默认.png') 50% no-repeat;
              background-size: contain;
              border-radius: 1rem;
              width: 35%;
              cursor: pointer;
              font-size: 1.1rem;
              outline: none;
            }

            span:focus {
              background: url('../../assets/images/brasiltv/弹窗按钮-焦点.png') 50% no-repeat;
              background-size: contain;
            }

            .float-l {
              margin-left: 12%;
            }

            .float-r {
              margin-right: 12%;
            }
          }
        }
      }
    }
  }

  .unitv-tab {
    background: #220000 url('../../assets/images/unitv/bg.png') no-repeat;
    background-size: cover;
  }

</style>
