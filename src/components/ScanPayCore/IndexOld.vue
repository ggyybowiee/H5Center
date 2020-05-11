<template>
  <div class="index-page">
    <div class="index-section top">
      <p class="clearfloat">
        <span class="float-l">{{$t('设备ID')}}</span>
        <span class="float-r">{{userName}}</span>
      </p>
      <p>
        <span>{{$t('您的服务有效期仅剩')}} {{remainingDays}} {{$t('天')}}</span>
      </p>
    </div>
    <div class="index-section middle">
      <p>{{$t('套餐选择')}}</p>
      <div class="package-section">
        <div>
          <ul>
            <li v-for="(item,index) in packageList" :key="index" :class="{ selected:packageSelectedIndex == index} "
              @click="slectedPackage(index,item)">
              <span class="time">{{$t(item.packageName)}}</span>
              <!-- {{item.authDays/30}}{{$t('月')}} -->
              <p>
                <span class="price">${{item.currentPrice}}</span>
                <span class="price-day">{{item.currentPrice/item.authDays | oneDecimal}}/{{$t('天')}}</span>
              </p>
              <!-- <span
                class="lisheng"
              >{{$t('立省')}} ${{(item.originalPrice-item.currentPrice) | keepTwoNum}}</span>-->
              <span class="huiyuan"
                v-show="(index < 2 && packageList.length >= 5) || (index < 1 && packageList.length < 5)">
                <i class="shopIcon shop-huiyuan"></i>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="index-section bottom">
      <p class="clearfloat">
        <span class="float-l">{{$t('支付金额')}}</span>
        <span class="price float-r">${{packageSelected.currentPrice}}</span>
      </p>
    </div>
    <div class="index-section bottom">
      <p class="clearfloat">
        <span class="float-l">{{$t('支付方式')}}</span>
        <span class="paypal float-r">
          <img src="../../assets/images/Paypal.png" />
        </span>
      </p>
    </div>
    <div class="pay-section padding-lr3">
      <!-- paypal支付按钮 -->
      <div id="paypal-button" style="width: 94%; left: auto;"></div>
      <div class="pay-button">{{$t('立即购买')}}</div>
      <p>
        <span class="service">
          <router-link :to="'service'">{{$t('服务条款')}}</router-link>
        </span>
      </p>
      <!-- <p><span @click="showFeedback()">{{$t('暂不购买的原因')}}</span></p> -->
    </div>

    <footer>
      <p>{{$t('如有疑问请联系')}}:</p>
      <p>service_abs_1231@outlook.com</p>
    </footer>
    <!-- 反馈页面 -->
    <div v-if="feedback" class="modal feedback-section">
      <div class="shadow"></div>
      <div class="content">
        <!-- 关闭按钮 -->
        <i @click="showFeedback()" class="el-icon-circle-close-outline"></i>
        <div class="feedback-form">
          <p>{{$t('欢迎反馈')}}</p>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
            <!-- 选择区域 -->
            <ul class="formsection">
              <p>{{$t('反馈选项')}}:</p>
              <li v-for="(item, index) in problemList" :key="index" @click="chooseProblem(item, index)">
                <i class="shopIcon shop-circle"></i>
                <i v-if="selectedProblemIndex == index" class="checkIcon el-icon-circle-check"></i>
                <span>{{item.value}}</span>
              </li>
            </ul>
            <!-- 备注区域 -->
            <div class="formsection">
              <p>{{$t('其他选填')}}:</p>
              <textarea v-model="ruleForm.message"></textarea>
            </div>
            <!-- 邮件区域 -->
            <div class="formsection email-section">
              <p>{{$t('您的邮箱选填')}}:</p>
              <el-form-item prop="email">
                <el-input v-model="ruleForm.email"></el-input>
              </el-form-item>
            </div>
            <!--onclick="_czc.push(['_trackEvent', '续费网站', '反馈', '过期',3,'feedback']);"-->
            <!-- 按钮区域-->
            <div class="submit-section clearfloat">
              <span @click="showFeedback()" class="float-l">{{$t('取消')}}</span>
              <span id="feedback" @click="submitForm('ruleForm')" class="float-r confirm-button">{{$t('确认')}}</span>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <!-- 错误信息提示页面 -->
    <div v-if="failTips" class="modal tips-section">
      <div class="shadow"></div>
      <div class="content">
        <i @click="showTips()" class="closeIcon el-icon-circle-close-outline"></i>
        <i class="shopIcon shop-jinggao"></i>
        <p class="tips">{{$t('页面已失效请重新扫码')}}!</p>
        <p class="help">{{$t('如需帮助请联系')}}:</p>
        <p class="email">service_abs_1231@outlook.com</p>
      </div>
    </div>
  </div>
</template>

<script>
  import api from "../../api/api";
  export default {
    data() {
      return {
        userName: sessionStorage.getItem("userName") ?
          sessionStorage.getItem("userName") : "",
        remainingDays: sessionStorage.getItem("remainingDays") ?
          sessionStorage.getItem("remainingDays") : 0,
        lang: sessionStorage.getItem("lang") ?
          sessionStorage.getItem("lang") : "",
        userType: sessionStorage.getItem("userType") ?
          sessionStorage.getItem("userType") : "",
        packageSelectedIndex: 0,
        payMode: "sandbox",
        selectedProblemIndex: 0,
        selectedProblemType: "1",
        feedback: false,
        failTips: false,
        packageSelected: "",
        packageId: "",
        domain: "",
        browserObj: "",
        feedbackString: "",
        feedbackDetail: "",
        ruleForm: {
          sn: "",
          packageCode: "",
          type: "",
          message: "",
          email: ""
        },
        rules: {
          email: [{
            type: "email",
            message: this.$t("邮箱格式不正确"),
            trigger: ["blur", "change"]
          }]
        },
        packageList: [],
        problemList: [{
            type: "1",
            value: this.$t("价格贵了")
          },
          {
            type: "2",
            value: this.$t("我想更多的了解此页")
          },
          {
            type: "3",
            value: this.$t("点击立即购买按钮后网页加载失败")
          },
          {
            type: "4",
            value: this.$t("希望用其他支付方式")
          }
        ]
      };
    },
    created() {
      this.checkUser();
      this.getPayMode();
      this.domain = document.domain;
    },
    mounted() {
      this.browserObj = this.getBrowserInfo();
      this.passBrowserInfo();
      document.title = "Package purchase";
    },
    watch: {},
    filters: {
      keepTwoNum: function (value) {
        return parseFloat(value).toFixed(2);
      }
    },
    filters: {
      oneDecimal(num) {
        return num.toFixed(1);
      }
    },
    methods: {
      // 获取支付模式
      getPayMode() {
        let data = {
          appId: null,
          userId: null
        };
        this.$http
          .post(api.getPaymentMode(), data)
          .then(res => {
            if (res.data.returnCode == "0") {
              this.payMode = res.data.data;
              if (res.data.data != "sandbox") {
                this.payMode = "production";
              }
            }
          })
          .catch(() => {});
      },
      //验证用户是否合法
      checkUser() {
        let urlParams = this.common.getUrlParams(window.location.href);

        for (let i in urlParams) {
          if (
            [
              "portalCode",
              "userName",
              "userType",
              "lang",
              "remainingDays",
              "jumpType"
            ].indexOf(i) === -1
          ) {
            this.message(this.$t("信息错误请重新扫码"));
            return;
          }
        }

        //调用后台，把数据传给后台
        let data = {
          portalCode: sessionStorage.getItem("portalCode") ?
            sessionStorage.getItem("portalCode") : "",
          userName: sessionStorage.getItem("userName") ?
            sessionStorage.getItem("userName") : "",
          userType: sessionStorage.getItem("userType") ?
            sessionStorage.getItem("userType") : "",
          lang: sessionStorage.getItem("lang") ?
            sessionStorage.getItem("lang") : "",
          remainingDays: sessionStorage.getItem("remainingDays") ?
            sessionStorage.getItem("remainingDays") : "",
          jumpType: sessionStorage.getItem("jumpType") ?
            sessionStorage.getItem("jumpType") : ""
        };
        this.$http
          .get(api.checkUser(), {
            params: data
          })
          .then(res => {
            let resData = res.data.data;
            if (res.data.returnCode == "400") {
              this.message(this.$t("信息错误请重新扫码"));
              return;
            } else if (res.data.returnCode == "-1") {
              this.message(this.$t("网络异常"));
              return;
            } else if (res.data.returnCode == "error_002") {
              this.message(this.$t("系统繁忙"));
              return;
            } else if (res.data.returnCode == "0") {} else {
              this.message(this.$t("信息错误请重新扫码"));
              return;
            }
            if (resData) {
              this.userName = resData.userName;
              this.remainingDays = resData.remainingDays;
              sessionStorage.setItem("userName", resData.userName);
              sessionStorage.setItem("userType", resData.userType);
              sessionStorage.setItem("lang", resData.lang);
              sessionStorage.setItem("remainingDays", resData.remainingDays);
              sessionStorage.setItem("jumpType", resData.jumpType);
              this.packageList = _.chain(resData.packageInfoList)
                .map(item => item)
                .sortBy(item => {
                  return (item.currentPrice / item.authDays).toFixed(2);
                })
                .value();
              this.packageSelected = this.packageList[0] ?
                this.packageList[0] :
                "";
              this.packageId = this.packageSelected.id;
              this.pay();
            }
          })
          .catch(() => {});
      },
      // 选择套餐
      slectedPackage(index, item) {
        this.packageSelected = item;
        this.packageId = item.id;
        this.packageSelectedIndex = index;
      },
      // 显示反馈页面
      showFeedback() {
        this.feedback = !this.feedback;
      },
      // 选择反馈问题
      chooseProblem(item, index) {
        this.selectedProblemIndex = index;
        this.selectedProblemType = item.type;
        if (this.selectedProblemType == 1) {
          this.feedbackString = this.$t("价格贵了");
        } else if (this.selectedProblemType == 2) {
          this.feedbackString = this.$t("更多了解");
        } else if (this.selectedProblemType == 3) {
          this.feedbackString = this.$t("点击立即购买按钮后网页加载失败");
        } else if (this.selectedProblemType == 4) {
          this.feedbackString = this.$t("希望用其他支付方式");
        }
      },
      // 提交
      submitForm(formName) {
        this.feedbackDetail = `其他: ${this.ruleForm.message};  邮箱:${this.ruleForm.email}`; //上报友盟反馈的信息和邮箱
        //_czc.push()是友盟js自带的方法，_czc在index.html的时候已经定义
        //    czc.push(["_trackEvent",category,action,label,value,nodeid]); 本代码仅为语法范例，请勿直接粘贴使用。部署时需要您替换参数值。
        //    各参数含义如下：
        //    category：事件类别，必填项，表示事件发生在谁身上，如“视频”、“小说”、“轮显层”等等。
        //    action：事件操作，必填项，表示访客跟元素交互的行为动作，如"播放"、"收藏"、"翻层"等等。
        //    label：事件标签，选填项，用于更详细的描述事件，从各个方面都可以，比如具体是哪个视频，哪部小说，翻到了第几层等等。
        //    value：事件值，选填项，整数型，用于填写打分型事件的分值，加载时间型事件的时长，订单型事件的价格等等。
        //    nodeid：div元素id，选填项，填写网页中的div元素id值，用于在“用户视点”功能上重绘元素的事件发生情况。
        _czc.push([
          "_trackEvent",
          "反馈",
          this.feedbackString,
          this.feedbackDetail,
          "",
          "feedback"
        ]);
        this.$refs[formName].validate(valid => {
          if (valid) {
            //调用后台，把数据传给后台
            let params = {
              sn: this.userName,
              packageCode: this.packageSelected.packageCode,
              type: this.selectedProblemType,
              message: this.ruleForm.message ? this.ruleForm.message : "",
              email: this.ruleForm.email ? this.ruleForm.email : ""
            };
            this.$http
              .post(api.feedBack(), params)
              .then(res => {
                if (res.data.returnCode == "0") {
                  //成功，跳转到成功页面
                  this.$router.push({
                    path: "/success-old"
                  });
                } else if (res.data.returnCode == "-1") {
                  //失败，网络异常
                  this.message(this.$t("网络异常"));
                } else if (res.data.returnCode == "error_001") {
                  //失败，验证码失效
                  this.message(this.$t("验证码失效"));
                  this.codeErrorShow = true;
                } else if (res.data.returnCode == "error_004") {
                  //失败，邮件重复
                  this.message(this.$t("邮件重复"));
                } else {
                  //失败，系统繁忙
                  this.message(this.$t("系统繁忙"));
                }
              })
              .catch(() => {
                this.loading = false;
                this.message(this.$t("网络异常"));
              });
          } else {
            return false;
          }
        });
      },

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
      },
      // 显示错误信息
      showTips() {
        this.failTips = !this.showTips;
      },

      //获取IE浏览器的版本号的兼容写法
      IEVersion() {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isIE =
          userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
        var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
        var isIE11 =
          userAgent.indexOf("Trident") > -1 && userAgent.indexOf("rv:11.0") > -1;
        if (isIE) {
          var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
          reIE.test(userAgent);
          var fIEVersion = parseFloat(RegExp["$1"]);
          if (fIEVersion == 7) {
            return 7;
          } else if (fIEVersion == 8) {
            return 8;
          } else if (fIEVersion == 9) {
            return 9;
          } else if (fIEVersion == 10) {
            return 10;
          } else {
            return 6; //IE版本<=7
          }
        } else if (isEdge) {
          return "edge"; //edge
        } else if (isIE11) {
          return 11; //IE11
        } else {
          return -1; //不是ie浏览器
        }
      },

      //切割版本号浏览器名称字符串
      splitString(str) {
        var arr = [null, null];
        var browserInfo = {
          name: "null",
          version: "null",
          language: (
              navigator.language || navigator.browserLanguage
            ).toLowerCase() ?
            (navigator.language || navigator.browserLanguage).toLowerCase() : "null"
        };
        arr = str.toString().split("/");
        browserInfo.name = arr[0];
        browserInfo.version = arr[1];
        return browserInfo;
      },

      //不同浏览器获取对navitator.userAgent的不同处理
      getBrowserInfo() {
        var agent = navigator.userAgent.toLowerCase();
        var sUserAgent = navigator.userAgent;
        var regStr_ff = /firefox\/[\d.]+/gi;
        var regStr_chrome = /chrome\/[\d.]+/gi;
        var regStr_saf = /safari\/[\d.]+/gi;
        var regStr_opera = /opr\/[\d.]+/gi;
        //firefox
        if (agent.indexOf("firefox") > 0) {
          return this.splitString(agent.match(regStr_ff));
        }
        //Chrome（因为oprera中打印出来的agent中也有chrome，所有多一个判断加以区分chrome和opera）
        if (agent.indexOf("chrome") > 0) {
          //Opera
          if (agent.indexOf("opr") > 0) {
            return this.splitString(agent.match(regStr_opera)); //opera
          } else {
            return this.splitString(agent.match(regStr_chrome)); //chrome
          }
        }
        //Safari
        if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
          return this.splitString(agent.match(regStr_saf));
        }
        //Opera
        if (agent.indexOf("opr") > 0) {
          return this.splitString(agent.match(regStr_opera));
        }
        //IE (ActiveXObject是IE特有的)
        if (window.ActiveXObject != "undefined") {
          return this.splitString("IE/" + this.IEVersion());
        }
      },

      //向后台传递浏览器信息
      passBrowserInfo() {
        let parame = {
          domainName: this.domain,
          browserName: this.browserObj.name,
          browserVersion: this.browserObj.version
        };
        this.$http
          .post(api.passBrowserInfo(), parame)
          .then(res => {
            console.log("成功");
          })
          .catch(() => {
            console.log("失败");
          });
      },
      //支付
      pay() {
        let that = this;
        paypal.Button.render({
            env: that.payMode, // Or 'production or sandbox'
            style: {
              label: "checkout",
              size: "responsive", // small | medium | large | responsive
              shape: "rect", // pill | rect
              color: "gold", // gold | blue | silver | black
              tagline: false
            },
            // Set up the payment:
            // 1. Add a payment callback
            payment: function (data, actions) {
              // 2. Make a request to your server
              //return actions.request.post('http://192.168.10.145:8089/api/pay/createPayment/', {
              return that.$http
                .post("/api/pay/createPayment/", {
                  packageId: that.packageId,
                  userName: that.userName,
                  userType: that.userType,
                  lang: that.lang
                })
                .then(function (res) {
                  // 3. Return res.id from the response
                  //保存订单ID
                  sessionStorage.setItem("payId", res.data.id);
                  return res.data.id;
                });
            },
            // Execute the payment:
            // 1. Add an onAuthorize callback
            onAuthorize: function (data, actions) {
              // 2. Make a request to your server
              // return actions.request.post('http://192.168.10.145:8089/api/pay/executePayment/', {
              return that.$http
                .post("/api/pay/executePayment/", {
                  paymentID: data.paymentID,
                  payerID: data.payerID
                })
                .then(function (res) {
                  // 3. Show the buyer a confirmation message.
                  if (res.data.returnCode == "0") {
                    sessionStorage.setItem("invalidTime", res.data.data.invalidTime);
                    that.$router.push({
                      path: "/success-old"
                    });
                  } else if (res.data.returnCode == "error_017") {
                    that.$router.push({
                      path: "/success-old"
                    });
                  } else {
                    that.$router.push({
                      path: "/fail-old"
                    });
                  }
                });
            }
          },
          "#paypal-button"
        );
      }
    }
  };

</script>
<style lang="less" scoped>
  .index-page {
    padding: 1.2rem 0 1.7rem 0;
    background-color: #efeff4;
    font-size: 1.2rem;
    position: relative;
    min-height: calc(100vh - 2.9rem);

    .index-section {
      background-color: #ffffff;
      border-top: 1px solid #e5e5e5;
      border-bottom: 1px solid #e5e5e5;

      p {
        height: 3rem;
        line-height: 3rem;
        margin-left: 3%;
        padding-right: 3%;
      }
    }

    .top {
      p:first-child {
        border-bottom: 1px solid #e5e5e5;
      }
    }

    .middle {
      margin-top: 1.2rem;
      padding-top: 1.2rem;

      >p {
        height: unset;
        line-height: unset;
      }

      .package-section {
        overflow-x: auto;

        >div {
          display: -webkit-box;
          white-space: nowrap;
          -webkit-overflow-scrolling: touch;
          text-align: justify;
          overflow-x: initial;
          width: 49.8rem;
          padding-bottom: 1.6rem;
        }

        ul {
          padding-left: 2%;
          margin-top: 1.5rem;

          li {
            width: 11.4rem;
            text-align: center;
            border: 1px solid #e5e5e5;
            padding: 0.5rem 0rem 1rem;
            margin-right: 0.5rem;
            border-radius: 0.3rem;
            display: inline-block;
            position: relative;
            height: 6rem;
            vertical-align: middle;

            .time {
              color: #333333;
            }

            .price {
              font-size: 1.8rem;
              font-weight: bold;
              color: #d72940;
            }

            .price-day {
              color: #999999;
              margin-left: 0.9rem;
            }

            >p {
              margin-top: 0.2rem;
              margin-bottom: 0.2rem;
            }

            .lisheng {
              font-size: 1rem;
            }

            .huiyuan {
              top: -0.6rem;
              right: -0.5rem;
              width: 1.8rem;
              height: 1.8rem;
              line-height: 1.8rem;
              text-align: center;
              display: inline-block;
              border-radius: 50%;
              background-color: #f5c607;
              position: absolute;

              i {
                font-size: 1.6rem;
                color: #ffffff;
              }
            }
          }

          .selected {
            border: 2px solid #1bd67b;
            background-color: #e8fbf2;
          }
        }
      }
    }

    .bottom {
      margin-top: 1.2rem;

      >p:first-child {
        bottom: none;
      }

      .price {
        font-size: 1.6rem;
        color: #d72940;
      }

      .paypal {
        width: 6rem;
        height: auto;

        img {
          width: 98%;
          vertical-align: middle;
        }
      }
    }

    .pay-section {
      text-align: center;
      position: relative;

      #paypal-button {
        position: absolute;
        width: 94%;
        left: auto !important;
        opacity: 0.01;
      }

      .pay-button {
        color: #ffffff;
        text-align: center;
        height: 2.6em;
        line-height: 2.6rem;
        max-height: 2.6rem;
        margin: 2rem 0;
        border-radius: 0.2rem;
        background-color: #1bd67b;
      }

      >p>span {
        text-align: center;
        color: #999999;
        display: inline-block;
        border-bottom: 1px solid #999999;
      }

      .service {
        margin-bottom: 2.4rem;
      }
    }

    footer {
      position: absolute;
      width: 100%;
      bottom: 0.2rem;
      margin-top: 1.4rem;
      text-align: center;

      p:last-child {
        margin-bottom: 0.5rem;
      }
    }

    .modal {
      .shadow {
        opacity: 0.7;
        z-index: 3;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        position: absolute;
        background-color: #000000;
      }

      .content {
        z-index: 5;
        top: 0;
        left: 0;
        position: absolute;
        border-radius: 0.5rem;
      }
    }

    .feedback-section {
      .content {
        width: 84%;
        height: 88%;
        margin: 8%;
        background-color: #efeff4;

        >i {
          float: right;
          font-size: 2rem;
          margin-right: 3%;
          margin-top: 3%;
        }

        .feedback-form {
          margin-top: 2.4rem;

          >p {
            text-align: center;
          }

          form {
            padding: 0 7%;

            textarea {
              height: 4rem;
              color: #606266;
              border-radius: 0.4rem;
              padding: 2% 6%;
              width: 88%;
              font-size: 1.2rem;
              font-family: Arial;
            }

            .formsection {
              >p {
                color: #626263;
                font-weight: bold;
                margin-bottom: 1rem;
                margin-top: 1.2rem;
              }
            }

            ul {
              li {
                position: relative;
                padding-left: 2.2rem;
                margin-bottom: 0.5rem;

                i {
                  top: 0;
                  left: 0.2rem;
                  font-size: 1.6rem;
                  position: absolute;
                  line-height: 1;
                }

                .checkIcon {
                  color: #007aff;
                }
              }
            }

            .email-section {
              input {
                border: none;
                margin: 0;
                font-size: 1.2rem;
                border-radius: 0.4rem;
              }
            }

            .submit-section {
              text-align: center;
              margin-top: 3rem;

              span {
                padding: 0.6rem 0;
                display: inline-block;
                border: 1px solid #d2d1d1;
                border-radius: 0.2rem;
                width: 8rem;
              }

              .confirm-button {
                color: #ffffff;
                border: 1px solid #1bd67b;
                background-color: #1bd67b;
              }
            }
          }
        }
      }
    }

    .tips-section {
      text-align: center;

      .content {
        width: 87%;
        top: 25%;
        margin: 6%;
        background-color: #ffffff;

        .closeIcon {
          float: right;
          font-size: 1.8rem;
          padding-top: 0.8rem;
          padding-right: 1.6rem;
        }

        .shopIcon {
          color: #ffc600;
          font-size: 5rem;
          display: block;
          margin: 3rem 0 1.4rem 0;
        }

        .tips {
          line-height: 1.6rem;
          padding: 0rem 1rem;
          margin-bottom: 1.6rem;
        }

        .email {
          color: #007aff;
          margin: 0.3rem 0 3.6rem 0;
        }
      }
    }
  }

</style>
