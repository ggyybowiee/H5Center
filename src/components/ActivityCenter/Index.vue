<template>
  <div class="index-page">
    <!-- <p class="head-title">{{$t('活动专区')}}</p> -->

    <div class="index-tab">
      <div v-if="activityList.length > 0">
        <div v-for="(item, index) in activityList" :key="index" class="activity-div">
          <div class="pic">
            <img :src="item.iconImg" alt />
          </div>
          <div class="activity-btn" v-loading="item.loading" @click="receiveActivityReward(item)"
            v-if="activityList.length > 0">{{$t('获取专属优惠')}}</div>

          <div class="goto-outlink" v-if="item.type == '1' && item.activityAddr">
            <a :href="item.activityAddr.split(',')[0]" class="go-btn go-btn-1">{{$t('购买')}} HTV6+</a>
            <a :href="item.activityAddr.split(',')[1]" class="go-btn go-btn-2">{{$t('进入')}} Facebook</a>
          </div>
        </div>
      </div>

      <div v-if="activityList.length === 0">
        <div class="activity-div">
          <div class="pic">
            <img src="../../assets/images/brasiltv/no-activity.png" alt />
            <span>{{$t('暂无活动，尽请您持续关注')}}</span>
          </div>
        </div>
      </div>

      <div class="my-rewards" v-if="rewardInfoList.length > 0">
        <h4>{{$t('我的福利')}}</h4>

        <ul v-for="(rewardInfo) in rewardInfoList" :key="rewardInfo.id">
          <li v-for="(item) in rewardInfo.exchangeInfoList" :key="item.exchangeCode"
            :class="['ticket', {'used': item.status === '0'}, {'unused': item.status !== '0'}]">
            <div class="auth-day">
              <p>{{item.authDay}}{{$t('复数天')}}</p>
              <p>
                <span>{{item.status === '0' ? $t('状态：已使用') : $t('状态：未使用') }}</span>
              </p>
            </div>
            <div class="code-info">
              <p class="code">
                <span :id="'hiddenText' + item.exchangeCode"
                  style="position: absolute; top: -9999rem;">{{item.exchangeCode.replace(/-/g, '')}}</span>
                <span :id="'text' + item.exchangeCode">{{item.exchangeCode}}</span>
                <span class="copy" @click="copy(item.exchangeCode)">{{$t("复制")}}</span>
              </p>

              <p class="record-date">
                <span>{{$t('领取日期')}}: {{rewardInfo.recordDate}}</span>
              </p>

              <p class="record-date">
                <span>{{$t('截取使用日期')}}: {{rewardInfo.endDate}}</span>
              </p>

              <p class="tips">{{$t('注：只包含手机端会员服务')}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import api from "../../api/api";
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
        rewardInfoList: []
      };
    },
    mounted() {
      document.title = this.$t("活动专区");
      this.getActivities();
    },
    watch: {},
    directives: {},
    filters: {},
    methods: {
      // 获取用户活动信息
      getActivities() {
        let params = {
          uid: this.uid,
          tk: this.tk,
          appId: this.appId,
          loginType: this.loginType
        };

        this.$http
          .post(api.getActivities(), params)
          .then(res => {
            if (res.data.returnCode == 0) {
              this.activityList = res.data.data.activityList || [];

              _.forEach(this.activityList, item => {
                item.loading = false;
              });
              this.getActivityRewardInfo();
            } else {
              this.activityList = [];
              this.message(this.$t("系统异常，请稍后重试！"));
            }
          })
          .catch(err => {
            this.activityList = [];
            this.message(this.$t("系统异常，请稍后重试！"));
            console.log(err);
          });
      },

      // 领取活动奖励
      receiveActivityReward(item) {
        item.loading = true;
        let params = {
          uid: this.uid,
          tk: this.tk,
          appId: this.appId,
          loginType: this.loginType,
          lang: this.lang,
          activityCode: item.activityCode
        };

        this.$http
          .post(api.receiveActivityReward(), params)
          .then(res => {
            if (res.data.returnCode === "0") {
              this.message(this.$t("恭喜你，领取成功！"));
              this.getActivityRewardInfo();
            } else if (res.data.returnCode === "activity_003") {
              this.message(
                this.$t("该活动已过期，敬请您持续关注我们的其他活动！")
              );
            } else if (res.data.returnCode == "activity_005") {
              this.message(
                this.$t(
                  "你暂无可领取的优惠，此次活动仅针对活动期间购买H6+盒子的用户，敬请您持续关注我们的其他活动！"
                ),
                10 * 1000
              );
            } else if (res.data.returnCode == "activity_006") {
              this.message(this.$t("你已经领取过了"));
            } else if (res.data.returnCode == "activity_007") {
              this.message(this.$t("操作太过频繁，请稍后再试"));
            } else {
              this.message(this.$t("系统异常，请稍后重试！"));
            }
            item.loading = false;
          })
          .catch(err => {
            this.message(this.$t("系统异常，请稍后重试！"));
            item.loading = false;
            console.log(err);
          });
      },

      // 已领取奖励信息
      getActivityRewardInfo() {
        let that = this;
        let params = {
          uid: this.uid,
          tk: this.tk,
          appId: this.appId,
          loginType: this.loginType
        };

        this.$http
          .post(api.getActivityRewardInfo(), params)
          .then(res => {
            if (res.data.returnCode == 0) {
              this.rewardInfoList = res.data.data.rewardInfoList || [];
              _.forEach(this.rewardInfoList, item => {
                if (item.recordDate) {
                  if (["pt", "es"].indexOf(that.lang) > -1) {
                    item.recordDate = that
                      .moment(item.recordDate)
                      .format("DD/MM/YYYY");
                    item.endDate = that.moment("2020.07.30").format("DD/MM/YYYY");
                  } else {
                    item.recordDate = that
                      .moment(item.recordDate)
                      .format("MM/DD/YYYY");
                    item.endDate = that.moment("2020.07.30").format("MM/DD/YYYY");
                  }
                }
                _.forEach(item.exchangeInfoList, subItem => {
                  let str = "";
                  for (
                    let i = 0, len = subItem.exchangeCode.length; i < len; i++
                  ) {
                    if (i > 0 && i % 4 === 0) {
                      str += "-";
                    }
                    str += subItem.exchangeCode[i];
                  }
                  subItem.exchangeCode = str;
                });
              });
            }
          })
          .catch(err => {
            this.message(this.$t("系统异常，请稍后重试！"));
            console.log(err);
          });
      },

      copy(index) {
        if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
          //区分iPhone设备
          window.getSelection().removeAllRanges(); //这段代码必须放在前面否则无效
          var Url2 = document.getElementById(`hiddenText${index}`); //要复制文字的节点
          var range = document.createRange();
          // 选中需要复制的节点
          range.selectNode(Url2);
          // 执行选中元素
          window.getSelection().addRange(range);
          // 执行 copy 操作
          document.execCommand("copy");

          // 移除选中的元素
          window.getSelection().removeAllRanges();
        } else {
          var text = document.getElementById(`hiddenText${index}`).innerText;
          const textarea = document.createElement("textarea");
          textarea.style.position = "fixed";
          textarea.style.top = 0;
          textarea.style.left = 0;
          textarea.style.border = "none";
          textarea.style.outline = "none";
          textarea.style.resize = "none";
          textarea.style.background = "transparent";
          textarea.style.color = "transparent";
          textarea.value = text; // 修改文本框的内容
          document.body.appendChild(textarea);
          textarea.select(); // 选中文本
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }
        this.message(this.$t("复制成功！"));
      },

      // 消息提示
      message(msg, duration) {
        this.$message.closeAll();

        this.$message({
          duration: duration || 5000,
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
    font-size: 1.5rem;
    position: relative;
    height: 100vh;
    max-width: 800px;
    margin: 0 auto;
    background: #20202a;
    color: #fff;
    display: flex;
    flex-direction: column;

    .head-title {
      text-align: center;
      background: #1a1a24;
      color: #fff;
      height: 2.75rem;
      line-height: 2.75rem;
      padding: 0.5rem;
      font-size: 1.75rem;
    }

    .index-tab {
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      overflow: auto;

      .activity-div {
        margin-bottom: 1.5rem;

        .pic {
          position: relative;

          img {
            width: 100%;
          }

          span {
            position: absolute;
            display: inline-block;
            width: calc(100% - 2rem);
            left: 1rem;
            right: 0;
            text-align: center;
            bottom: 1rem;
          }
        }

        .activity-btn {
          text-align: center;
          line-height: 3rem;
          height: 3rem;
          margin-top: 1.5rem;
          color: #3cd977;
          border: 2px solid #3cd977;
          font-weight: 700;
          cursor: pointer;
        }

        .goto-outlink {
          text-align: center;
          margin-top: 1.5rem;
          display: flex;
          justify-content: space-between;

          .go-btn {
            color: #f7bd46;
            border: 2px solid #f7bd46;
          }

          a {
            flex: 0 0 46%;
            line-height: 3rem;
            height: 3rem;
          }
        }
      }

      .my-rewards {
        ul {
          width: 100%;

          .used {
            background: url("../../assets/images/used.png") no-repeat;
            background-size: cover;
            border-radius: 0.8rem;

            .code {
              color: #fff !important;

              .copy {
                color: #b5b5b5 !important;
                border: 1px solid #b5b5b5 !important;
              }
            }
          }

          .unused {
            background: url("../../assets/images/unused.png") no-repeat;
            background-size: cover;
            border-radius: 0.8rem;
          }

          li {
            width: 100%;
            margin-top: 1rem;
            clear: both;
            overflow: hidden;
            height: 8.5rem;

            .auth-day {
              float: left;
              width: 6.9rem;
              text-align: center;
              padding: 0.5rem 0rem;
              height: 7.5rem;

              p {
                color: #1f202a;
              }

              p:first-child {
                font-weight: 700;
                margin-top: 1.7rem;
                font-size: 2.2rem;
                height: 2rem;
                line-height: 2rem;
              }

              p:last-child {
                font-size: 1.4rem;
                height: 1.6rem;
                line-height: 1.6rem;
              }
            }

            .code-info {
              float: left;
              width: calc(100% - 8.4rem);
              padding: 0.85rem 0.5rem 0.75rem 1rem;
              height: 7rem;
              font-size: 1.3rem;

              .code {
                color: #ffbd3a;
                font-weight: 700;
                line-height: 1.6rem;

                .copy {
                  font-weight: 400;
                  border: 1px solid #ffbd3a;
                  border-radius: 0.5rem;
                  padding: 0rem 0.75rem;
                  margin-left: 0.5rem;
                }
              }

              .status {
                font-size: 1.15rem;
              }

              .record-date {
                font-size: 1.15rem;
                line-height: 1.5rem;
              }

              .tips {
                font-size: 1rem;
                line-height: 1.1rem;
                color: #ccc;
              }
            }
          }
        }
      }
    }
  }

  @media (min-width: 320px) {
    .my-rewards {
      li {
        height: 8rem !important;

        .auth-day {
          width: 6.4rem !important;
          padding: 0.5rem 0rem !important;
          height: 7rem !important;

          p:first-child {
            margin-top: 1.7rem !important;
            margin-bottom: 1rem !important;
            font-size: 1.8rem !important;
            height: 2rem !important;
            line-height: 2rem !important;
          }

          p:last-child {
            font-size: 1.25rem !important;
            height: 1.6rem !important;
            line-height: 1.6rem !important;
          }
        }

        .code-info {
          width: calc(100% - 7.3rem) !important;
          padding: 0.85rem 0.1rem 0.75rem 0.8rem !important;
          height: 6.5rem !important;
          font-size: 1.25rem !important;

          .code {
            line-height: 1.5rem !important;

            .copy {
              border-radius: 0.5rem !important;
              padding: 0rem 0.1rem !important;
              margin-left: 0rem !important;
            }
          }

          .status {
            font-size: 1.15rem !important;
          }

          .record-date {
            font-size: 1.15rem !important;
            line-height: 1.4rem !important;
          }

          .tips {
            font-size: 1rem !important;
            line-height: 1rem !important;
          }
        }
      }
    }
  }

  @media (min-width: 360px) {
    .my-rewards {
      li {
        height: 8.5rem !important;

        .auth-day {
          width: 7.1rem !important;
          padding: 0.5rem 0rem !important;
          height: 7.5rem !important;

          p:first-child {
            margin-top: 1.95rem !important;
            margin-bottom: 1rem !important;
            font-size: 1.8rem !important;
            height: 2rem !important;
            line-height: 2rem !important;
          }

          p:last-child {
            font-size: 1.25rem !important;
            height: 1.6rem !important;
            line-height: 1.6rem !important;
          }
        }

        .code-info {
          width: calc(100% - 8.3rem) !important;
          padding: 0.85rem 0.3rem 0.75rem 0.9rem !important;
          height: 7rem !important;
          font-size: 1.3rem !important;

          .code {
            line-height: 1.6rem !important;

            .copy {
              border-radius: 0.5rem !important;
              padding: 0rem 0.25rem !important;
              margin-left: 0.25rem !important;
            }
          }

          .status {
            font-size: 1.2rem !important;
          }

          .record-date {
            font-size: 1.2rem !important;
            line-height: 1.5rem !important;
          }

          .tips {
            font-size: 1rem !important;
            line-height: 1.1rem !important;
          }
        }
      }
    }
  }

  @media (min-width: 400px) {
    .my-rewards {
      li {
        height: 9rem !important;

        .auth-day {
          width: 7.4rem !important;
          padding: 0.5rem 0rem !important;
          height: 8rem !important;

          p:first-child {
            margin-top: 2rem !important;
            margin-bottom: 1rem !important;
            font-size: 1.8rem !important;
            height: 2rem !important;
            line-height: 2rem !important;
          }

          p:last-child {
            font-size: 1.25rem !important;
            height: 2rem !important;
            line-height: 2rem !important;
          }
        }

        .code-info {
          width: calc(100% - 8.8rem) !important;
          padding: 0.85rem 0.4rem 0.75rem 1rem !important;
          height: 7.5rem !important;
          font-size: 1.45rem !important;

          .code {
            line-height: 1.8rem !important;

            .copy {
              border-radius: 0.5rem !important;
              padding: 0rem 0.25rem !important;
              margin-left: 0rem !important;
            }
          }

          .status {
            font-size: 1.3rem !important;
          }

          .record-date {
            font-size: 1.3rem !important;
            line-height: 1.8rem !important;
          }

          .tips {
            font-size: 1.1rem !important;
            line-height: 1.2rem !important;
          }
        }
      }
    }
  }

  @media (min-width: 480px) {
    .my-rewards {
      li {
        height: 10.5rem !important;

        .auth-day {
          width: 8.4rem !important;
          padding: 0.5rem 0rem !important;
          height: 9.5rem !important;

          p:first-child {
            margin-top: 2.5rem !important;
            margin-bottom: 1.3rem !important;
            font-size: 2.2rem !important;
            height: 2.5rem !important;
            line-height: 2.5rem !important;
          }

          p:last-child {
            font-size: 1.4rem !important;
            height: 2rem !important;
            line-height: 2rem !important;
          }
        }

        .code-info {
          width: calc(100% - 10.8rem) !important;
          padding: 0.95rem 0.9rem 0.75rem 1.5rem !important;
          height: 9rem !important;
          font-size: 1.7rem !important;

          .code {
            line-height: 2rem !important;

            .copy {
              border-radius: 0.5rem !important;
              padding: 0rem 0.45rem !important;
              margin-left: 0.25rem !important;
            }
          }

          .status {
            font-size: 1.5rem !important;
          }

          .record-date {
            font-size: 1.5rem !important;
            line-height: 2rem !important;
          }

          .tips {
            font-size: 1.3rem !important;
            line-height: 1.4rem !important;
          }
        }
      }
    }
  }

  @media (min-width: 600px) {
    .my-rewards {
      li {
        height: 12.5rem !important;

        .auth-day {
          width: 10.4rem !important;
          padding: 0.5rem 0rem !important;
          height: 11.5rem !important;

          p:first-child {
            margin-top: 3rem !important;
            margin-bottom: 1.5rem !important;
            font-size: 2.5rem !important;
            height: 3rem !important;
            line-height: 3rem !important;
          }

          p:last-child {
            font-size: 1.4rem !important;
            height: 2.5rem !important;
            line-height: 2.5rem !important;
          }
        }

        .code-info {
          width: calc(100% - 13.2rem) !important;
          padding: 1rem 1rem 1rem 1.8rem !important;
          height: 11rem !important;
          font-size: 1.8rem !important;

          .code {
            line-height: 2.5rem !important;

            .copy {
              border-radius: 0.5rem !important;
              padding: 0rem 0.75rem !important;
              margin-left: 1rem !important;
            }
          }

          .status {
            font-size: 1.5rem !important;
          }

          .record-date {
            font-size: 1.5rem !important;
            line-height: 2.5rem !important;
          }

          .tips {
            font-size: 1.3rem !important;
            line-height: 1.5rem !important;
          }
        }
      }
    }
  }

  @media (min-width: 768px) {
    .my-rewards {
      li {
        height: 15.5rem !important;

        .auth-day {
          width: 12.4rem !important;
          padding: 0.5rem 0rem !important;
          height: 14.5rem !important;

          p:first-child {
            margin-top: 4.5rem !important;
            margin-bottom: 2rem !important;
            font-size: 3rem !important;
            height: 3rem !important;
            line-height: 3rem !important;
          }

          p:last-child {
            font-size: 1.5rem !important;
            height: 2.5rem !important;
            line-height: 2.5rem !important;
          }
        }

        .code-info {
          width: calc(100% - 15.5rem) !important;
          padding: 1rem 1rem 1rem 2.1rem !important;
          height: 14rem !important;
          font-size: 2rem !important;

          .code {
            line-height: 3.5rem !important;

            .copy {
              border-radius: 0.5rem !important;
              padding: 0rem 0.75rem !important;
              margin-left: 1rem !important;
            }
          }

          .status {
            font-size: 1.5rem !important;
          }

          .record-date {
            font-size: 1.5rem !important;
            line-height: 3rem !important;
          }

          .tips {
            font-size: 1.3rem !important;
            line-height: 2rem !important;
          }
        }
      }
    }
  }

  @media (min-width: 960px) {
    .my-rewards {
      li {
        height: 12.5rem !important;

        .auth-day {
          width: 10.4rem !important;
          padding: 0.5rem 0rem !important;
          height: 11.5rem !important;

          p:first-child {
            margin-top: 3rem !important;
            margin-bottom: 1.5rem !important;
            font-size: 2.5rem !important;
            height: 3rem !important;
            line-height: 3rem !important;
          }

          p:last-child {
            font-size: 1.4rem !important;
            height: 2.5rem !important;
            line-height: 2.5rem !important;
          }
        }

        .code-info {
          width: calc(100% - 13.2rem) !important;
          padding: 1rem 1rem 1rem 1.8rem !important;
          height: 11rem !important;
          font-size: 1.8rem !important;

          .code {
            line-height: 2.5rem !important;

            .copy {
              border-radius: 0.5rem !important;
              padding: 0rem 0.75rem !important;
              margin-left: 1rem !important;
            }
          }

          .status {
            font-size: 1.5rem !important;
          }

          .record-date {
            font-size: 1.5rem !important;
            line-height: 2.5rem !important;
          }

          .tips {
            font-size: 1.3rem !important;
            line-height: 1.5rem !important;
          }
        }
      }
    }
  }

</style>
