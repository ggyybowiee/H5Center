<template>
  <div class="index-page" hidefocus tabindex="6">
    <div class="invite-title">Recomendar para Amigos</div>
    <div class="wrap">
      <div class="fill-content">
        <p class="main-title">Insira a conta de seu amigo</p>
        <p class="sub-title">Só pode inserir uma conta!</p>

        <div class="friend-recommend">
          <el-input class="input-username" v-model="userName" id="input-username" hidefocus tabindex="1"
            @keyup.enter.native="pressEnter()" @focus="getFocus()" nextDownFocusId="ok-btn"
            placeholder="Insira a conta ou e-mail vinculado de seu amigo"></el-input>
          <p class="error-info">{{showErrorText}}</p>

          <div hidefocus tabindex="2" id="ok-btn" class="ok-btn" nextRightFocusId="input-username"
            nextLeftFocusId="input-username" nextUpFocusId="input-username" nextDownFocusId="input-username"
            @click="recommentFriend()">OK</div>
        </div>
      </div>

      <!-- 确认信息提示页面 -->
      <div v-if="confirmTips" :class="['modal', 'brasiltv-tips-section']">
        <div class="shadow"></div>
        <div class="content">
          <p class="tips">A conta de seu amigo é:</p>
          <p class="input-username">{{userName}}</p>
          <!-- 按钮区域-->
          <div class="submit-section clearfloat">
            <span @click="submitModal()" class="float-l" tabindex="3" hidefocus id="yes-confirm"
              nextRightFocusId="no-confirm" v-loading.fullscreen.lock="fullscreenLoading">Confirmar</span>
            <span @click="modalClose()" class="float-r" tabindex="4" hidefocus id="no-confirm"
              nextLeftFocusId="yes-confirm">Não</span>
          </div>
          <p class="only-one">Dicas: você só pode inserir uma conta! Por favor, reveja a conta!</p>
        </div>
      </div>

      <!-- 确认信息提示页面 -->
      <div v-if="errorTips" :class="['modal', 'error-tips-section']">
        <div class="shadow"></div>
        <div class="content">
          <p class="tips">{{tips}}</p>
          <!-- 按钮区域-->
          <div class="submit-section">
            <span @click="modalClose()" tabindex="5" hidefocus id="error-confirm" nextRightFocusId="error-confirm"
              nextLeftFocusId="error-confirm" nextUpFocusId="error-confirm"
              nextDownFocusId="error-confirm">Confirmar</span>
          </div>
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
        userInfo: sessionStorage.getItem("userInfo") ?
          JSON.parse(sessionStorage.getItem("userInfo")) : '',
        showErrorInfo: false,
        confirmTips: false,
        errorTips: false,
        fullscreenLoading: false,
        showErrorText: "",
        userType: 1, // 1：ID账号，2：邮箱账号
        userName: "",
        tips: "",
        isRecommendSuccess: false
      };
    },
    mounted() {
      document.title = "Recomendar para Amigos";
      document.getElementById("ok-btn").focus();
    },
    watch: {},
    directives: {},
    filters: {},
    methods: {
      // 校验输入格式
      checkUser(value) {
        let regUsername = /^[0-9]*$/;
        let regEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        value = value.trim();
        this.userName = value;

        if (value.indexOf("@") > -1) {
          this.userType = 2;
          if (!regEmail.test(value)) {
            this.showErrorText = "Formato incorreto!";
            return false;
          }
        } else {
          this.userType = 1;
          if (!value || !regUsername.test(value)) {
            this.showErrorText = "Formato incorreto!";
            return false;
          }
        }

        this.showErrorText = "";
        return true;
      },
      // 推荐好友
      recommentFriend() {
        if (!this.checkUser(this.userName)) {
          return;
        }

        this.confirmTips = true;

        setTimeout(() => {
          document.getElementById("yes-confirm").focus();
          if (window.android) {
            android.showDialog(true);
          }
        }, 0);
      },
      modalClose() {
        this.confirmTips = false;
        this.errorTips = false;
        if (window.android) {
          android.showDialog(false);
        }

        if (this.isRecommendSuccess) {
          delete this.userInfo.userType;
          delete this.userInfo.userName;
          this.$router.go(-1);
        } else {
          if (document.getElementById("ok-btn")) {
            document.getElementById("ok-btn").focus();
          }
        }
      },
      pressEnter() {
        if (window.android) {
          android.showInput(true);
        }
      },
      getFocus() {
        this.showErrorText = "";
      },
      submitModal() {
        this.fullscreenLoading = true;
        this.isRecommendSuccess = false;
        let that = this;
        //调用后台，把数据传给后台
        let params = _.assign(this.userInfo, {
          userType: this.userType,
          userName: this.userName
        });

        $.ajax({
          type: "POST",
          url: api.addFriendRecommend(),
          contentType: "application/json;charset=utf-8",
          data: JSON.stringify(params),
          success: function (res) {
            that.fullscreenLoading = false;
            let resData = res.data;
            let returnCode = res.returnCode;

            that.confirmTips = false;
            that.errorTips = true;
            setTimeout(() => {
              document.getElementById("error-confirm").focus();
            }, 0);

            switch (returnCode) {
              case "0": // 成功
                that.isRecommendSuccess = true;
                that.tips = `Obrigado por participar deste evento! Você e seu amigo podem entrar em contato com
                “${_.get(
                  resData,
                  "facebookAccount"
                )}” no Facebook para obter a premiação!`;
                break;
              case "activity_009": // 该账号不存在，请核实后再输
                that.tips =
                  "Conta inextente! Por favor, reveja e insira novamente!";
                break;
              case "activity_010": // 填写的推荐人的账号不满足活动要求
                that.tips =
                  "Essa conta não está elegível para participar do evento.";
                break;
              case "activity_011": // 无法推荐自己
                that.tips = "Insira a conta ou e-mail vinculado de seu amigo";
                break;
              default:
                // 连接超时，请稍后重试！
                that.tips =
                  "Tempo de conexão expirou! Por favor tente novamente mais tarde!";
                break;
            }
          },
          error: function () {
            // 连接超时，请稍后重试！
            that.fullscreenLoading = false;
            that.confirmTips = false;
            that.errorTips = true;
            setTimeout(() => {
              document.getElementById("error-confirm").focus();
            }, 0);
            that.tips =
              "Tempo de conexão expirou! Por favor tente novamente mais tarde!";
          }
        });
      }
    }
  };

</script>
<style lang="less" scoped>
  .index-page {
    padding: 0;
    font-size: 1.5rem;
    position: relative;
    height: 100vh;
    background: url("../../assets/images/brasiltv/activity/bg.jpg") no-repeat center;
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
      font-size: 2.4rem;
      border-bottom: 1px solid #fff;
      padding: 1rem 3rem 0.5rem;
      position: relative;
    }

    .wrap {
      .fill-content {
        position: absolute;
        text-align: center;
        margin: auto;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 60%;
        height: fit-content;

        .main-title {
          font-size: 1.5rem;
        }

        .sub-title {
          color: #cfe6dd;
          margin-bottom: 1rem;
          font-size: 1rem;
        }

        .friend-recommend {
          .error-info {
            height: 2.8rem;
            line-height: 2.8rem;
            font-size: 1rem;
            color: #e83f3f;
          }

          .ok-btn {
            width: 8rem;
            font-size: 1rem;
            margin: 0 auto;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 1.5rem;
            padding: 0.5rem 1.5rem;
            background-size: contain;
            color: #fff;
            cursor: pointer;
            outline: none;
          }

          .ok-btn:focus {
            background-color: #3276e3;
          }
        }
      }

      .modal {
        width: auto;
        height: auto;

        .shadow {
          z-index: 3;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          position: fixed;
          background: url("../../assets/images/遮罩层.png") center center;
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

      .brasiltv-tips-section {
        text-align: center;
        width: auto;
        height: auto;

        .content {
          width: 44%;
          top: 0;
          height: fit-content;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          padding: 2rem 1.5rem 0.5rem;
          background: url("../../assets/images/弹窗背景.png") 50% no-repeat;
          position: fixed;
          background-size: cover;
          box-shadow: 0px 0px 7px #3276e3;

          .tips {
            font-size: 1rem;
          }

          .input-username {
            color: #ffa900;
            margin: 1rem 0;
            font-size: 2.2rem;
            word-break: break-all;
          }

          .only-one {
            color: #848484;
            font-size: 0.8rem;
            text-align: center;
          }

          .submit-section {
            text-align: center;
            margin: 1rem 0rem;
            font-size: 1rem;

            span {
              padding: 0.4rem 0;
              display: inline-block;
              background: url("../../assets/images/brasiltv/弹窗按钮-默认.png") 50% no-repeat;
              background-size: contain;
              border-radius: 1rem;
              width: 35%;
              cursor: pointer;
              outline: none;
            }

            span:focus {
              background: url("../../assets/images/brasiltv/弹窗按钮-焦点.png") 50% no-repeat;
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

      .error-tips-section {
        text-align: center;

        .content {
          width: 44%;
          top: 0;
          height: fit-content;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          padding: 3rem 2rem;
          background: url("../../assets/images/弹窗背景.png") 50% no-repeat;
          position: fixed;
          background-size: cover;
          box-shadow: 0px 0px 7px #3276e3;

          .tips {
            font-size: 1rem;
          }

          .submit-section {
            margin-top: 2.5rem;
            font-size: 1rem;

            span {
              padding: 0.4rem 0;
              display: inline-block;
              background: url("../../assets/images/brasiltv/弹窗按钮-默认.png") 50% no-repeat;
              background-size: contain;
              border-radius: 1rem;
              width: 48%;
              cursor: pointer;
              outline: none;
            }

            span:focus {
              background: url("../../assets/images/brasiltv/弹窗按钮-焦点.png") 50% no-repeat;
              background-size: contain;
            }
          }
        }
      }
    }
  }

</style>
