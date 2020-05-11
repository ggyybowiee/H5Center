<template>
  <div class="index-page">
    <div class="index-tab">
      <div v-if="activityList.length > 0" style="width: 100%; height: 100%;">
        <div v-for="(item, index) in activityList" :key="index" class="activity-div" :id="'activity-div' + index">
          <div class="activity-img">
            <div :id="'activity' + index" hidefocus="false" :tabindex="index+1" @focus="getFocus(index)"
              :nextUpFocusId="getUpDirectionId(index)" :nextDownFocusId="getDownDirectionId(index)" class="activity-btn"
              @click="receiveActivityReward(item, index)">Participação no Evento</div>
          </div>
        </div>
      </div>

      <!-- 没有活动展示默认图 -->
      <div class="default-div" v-if="activityList.length === 0">
        <div class="default-img">
          <img src="../../assets/images/brasiltv/activity/default-img.png" alt />
          <p>
            No momento não há promoções,
            <br />fique antenado para futuras promoções.
          </p>
        </div>
      </div>

      <!-- 确认信息提示页面 -->
      <div v-if="confirmTips" :class="['modal', 'brasiltv-tips-section']">
        <div class="shadow"></div>
        <div class="content">
          <p class="tips">{{tips}}</p>
          <!-- 按钮区域-->
          <div class="submit-section">
            <span @click="modalClose()" tabindex="-1" hidefocus="true" id="yes-confirm" nextRightFocusId="yes-confirm"
              nextLeftFocusId="yes-confirm" nextUpFocusId="yes-confirm">Confirmar</span>
          </div>
        </div>
      </div>

      <!-- 网络超时，请稍后重试 -->
      <div v-if="networkTimeout" class="network-timeout">{{msg}}</div>
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
        uid: sessionStorage.getItem("uid") ? sessionStorage.getItem("uid") : "",
        tk: sessionStorage.getItem("tk") ? sessionStorage.getItem("tk") : "",
        appId: sessionStorage.getItem("appId") ?
          sessionStorage.getItem("appId") : "",
        loginType: sessionStorage.getItem("loginType") ?
          sessionStorage.getItem("loginType") : "",
        activityList: {},
        networkTimeout: false,
        msg: "",
        confirmTips: false,
        tips: ""
      };
    },
    mounted() {
      document.title = "Brasil TV · Centro de Eventos";
      this.getActivities();
    },
    watch: {},
    directives: {},
    filters: {},
    methods: {
      modalClose() {
        this.confirmTips = false;
        if (window.android) {
          android.showDialog(false);
        }

        if (document.getElementById("activity0")) {
          document.getElementById("activity0").focus();
        }
      },
      // 获取焦点
      getFocus(index) {
        document.getElementById(`activity${index}`).focus();
      },

      // 领取活动奖励
      receiveActivityReward(item, index) {
        let that = this;
        let params = {
          uid: this.uid,
          tk: this.tk,
          appId: this.appId,
          loginType: this.loginType,
          lang: this.lang,
          activityCode: item.activityCode
        };

        /* params = {
          uid: "8009966",
          tk: "02d95e12-cb81-4d4f-a365-34b9e6e8c120",
          appId: "com.interactive.brasiliptv",
          loginType: "1",
          lang: "pt",
          activityCode: item.activityCode
        }; */

        $.ajax({
          type: "POST",
          url: api.receiveActivityReward(),
          contentType: "application/json;charset=utf-8",
          data: JSON.stringify(params),
          success: function (res) {
            let resData = res.data;
            if (res.returnCode === "0") {
              if (resData.userType != 3) {
                that.confirmTips = true;
                setTimeout(() => {
                  document.getElementById("yes-confirm").focus();
                  if (window.android) {
                    android.showDialog(true);
                  }
                }, 0);
              }
              if (resData.userType == 1) {
                // 老用户
                that.tips =
                  `Depois que a pessoa que foi recomendada a comprar o aparelho HTV, fazer a compra do HTV, Peça a ele para ir no Centro de Eventos>>Participação no Evento>>Inserir a sua conta!(A conta de quem recomendou). Após isso, você e seu amigo poderão entrar em contato com “${resData.facebookAccount}” no Facebokk para obter a premiação!`;
              } else if (resData.userType == 2) {
                // 已参加活动的新用户
                that.tips =
                  `Você já submeteu a conta de seu amigo! Você e seu amigo vão ganhar a premiação juntos! Entre em contato com “${resData.facebookAccount}” no Facebook para obtê-la! Recomendar outros amigos para comprarem o aparelho HTV, você poderá ganhar novamente a recompensa!`;
              } else if (resData.userType == 3) {
                // 未参加过活动的新用户
                sessionStorage.setItem("userInfo", JSON.stringify(params));
                that.$router.push({
                  path: "/friend-recommend"
                });
              }
            } else if (res.returnCode === "activity_003") {
              // 活动信息已过期
              that.tips =
                "Está promoção já acabou, fique antenado e não perca nossas novas promoções! Mais informações em breve!";
              that.confirmTips = true;
              setTimeout(() => {
                document.getElementById("yes-confirm").focus();
                if (window.android) {
                  android.showDialog(true);
                }
              }, 0);
            } else if (res.returnCode == "activity_007") {
              // 操作太过频繁，请稍后再试
              that.message(
                "Sistema ocupado, por favor tente novamente mais tarde!"
              );
            } else {
              // 连接超时，请稍后重试！
              that.message(
                "Tempo de conexão expirou! Por favor tente novamente mais tarde!"
              );
            }
          },
          error: function () {
            // 连接超时，请稍后重试！
            that.message(
              "Tempo de conexão expirou! Por favor tente novamente mais tarde!"
            );
          }
        });
      },
      // 获取用户活动信息
      getActivities() {
        let that = this;
        let params = {
          uid: this.uid,
          tk: this.tk,
          appId: this.appId,
          loginType: this.loginType
        };

        $.ajax({
          type: "POST",
          url: api.getActivities(),
          contentType: "application/json;charset=utf-8",
          data: JSON.stringify(params),
          success: function (res) {
            if (res.returnCode == 0) {
              that.activityList = res.data.activityList || [];
              setTimeout(() => {
                _.forEach(that.activityList, (item, index) => {
                  $(`#activity-div${index}`).css({
                    background: `url(${item.iconImg}) no-repeat center`,
                    "background-size": "cover"
                  });
                });
                if (document.getElementById("activity0")) {
                  document.getElementById("activity0").focus();
                }
              }, 0);
            } else {
              that.activityList = [];
              // 连接超时
              that.message(
                "Tempo de conexão expirou! Por favor tente novamente mais tarde!"
              );
            }
          },
          error: function () {
            that.activityList = [];
            // 连接超时
            that.message(
              "Tempo de conexão expirou! Por favor tente novamente mais tarde!"
            );
          }
        });
      },
      getUpDirectionId: function (index) {
        if (index == 0 || index == 1) {
          return "activity0";
        } else {
          return "activity" + (index - 1);
        }
      },
      getDownDirectionId: function (index) {
        if (index == this.activityList.length - 1) {
          return "activity0";
        } else {
          return "activity" + (index + 1);
        }
      },
      // 消息提示
      message(msg) {
        let that = this;
        that.networkTimeout = true;
        that.msg = msg;

        setTimeout(() => {
          that.networkTimeout = false;
        }, 5000);
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
    margin: 0 auto;
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
      background: #3a3a3a;
    }

    .index-tab {
      width: 100%;
      height: 100vh;

      .activity-div {
        position: relative;
        width: 100%;
        height: 100vh;

        .activity-img {
          position: absolute;
          bottom: 10%;
          right: 0;
          left: 0;
          margin: auto;
          width: fit-content;
          height: fit-content;

          .activity-btn {
            font-size: 1rem;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 1.5rem;
            padding: 0.5rem 1.5rem;
            background-size: contain;
            color: #fff;
            cursor: pointer;
            outline: none;
          }

          .activity-btn:focus {
            background: #3276e3;
            // background: url("../../assets/images/brasiltv/activity/btn-focus.gif") no-repeat center;
            animation: glow 1s infinite alternate;
          }
        }
      }

      .default-div {
        position: relative;
        text-align: center;
        width: 100%;
        height: 100vh;
        background: url("../../assets/images/brasiltv/activity/default-bg.jpg") no-repeat center;
        background-size: cover;

        .default-img {
          margin: auto;
          margin: auto;
          position: absolute;
          width: fit-content;
          height: fit-content;
          top: 0;
          right: 0;
          bottom: 10%;
          left: 0;

          img {
            display: block;
            margin: 0 auto;
            width: 14rem;
          }

          p {
            font-size: 1rem;
          }
        }
      }

      .network-timeout {
        position: absolute;
        font-size: 0.8rem;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        margin: auto;
        padding: 0.5rem 4%;
        border-radius: 4px;
        width: 90%;
        max-width: 800px;
        text-align: center;
        width: fit-content;
        height: fit-content;
        background: rgba(0, 0, 0, 0.8);
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
        text-align: left;
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
          padding: 2rem 1.5rem;
          background: url("../../assets/images/弹窗背景.png") 50% no-repeat;
          position: fixed;
          background-size: cover;
          box-shadow: 0px 0px 7px #3276e3;

          .tips {
            font-size: 1rem;
          }

          .submit-section {
            text-align: center;
            margin-top: 2rem;
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
