import api from "../../api/api";

'use strict';
export default {
  data() {
    return {
      userId: sessionStorage.getItem("userId") ?
        sessionStorage.getItem("userId") : "",
      lang: sessionStorage.getItem("lang") ?
        sessionStorage.getItem("lang") : "",
      packageId: sessionStorage.getItem("packageId") ?
        sessionStorage.getItem("packageId") : "",
      appId: sessionStorage.getItem("appId") ?
        sessionStorage.getItem("appId") : "",
      appVersion: sessionStorage.getItem("appVersion") ?
        sessionStorage.getItem("appVersion") : "",
      tk: sessionStorage.getItem("tk") ?
        sessionStorage.getItem("tk") : "",
      loginType: sessionStorage.getItem("loginType") ?
        sessionStorage.getItem("loginType") : "",
      packageCode: sessionStorage.getItem("packageCode") ?
        sessionStorage.getItem("packageCode") : "",
      couponId: sessionStorage.getItem("couponId") ?
        sessionStorage.getItem("couponId") : "",
      failTips: false,
      statementFlag: false,
      promptFlag: false,
      statementObj: {},
      email: sessionStorage.getItem("email") ?
        sessionStorage.getItem("email") : "",
      payWayList: [],
      payMode: "sandbox",
      payWayRenderTextDic: {
        "Boleto": this.$t("巴西Boleto"),
        "PayPal": this.$t("Paypal"),
        "Payment by Card": this.$t("巴西信用卡"),
        "Bank deposits": this.$t("现金转账"),
        "Payment in lotteries": this.$t("彩票店"),
      },
      errorCode: "", // 1: 页面已失效请重新操作，2：信息错误请重新操作，3：系统繁忙
      loading: false,
      pagsmileForm: {
        merchant_no: "",
        app_id: "",
        method: "",
        out_order_no: "",
        cpf_no: "",
        username: "",
        out_uid: "",
        subject: "",
        content: "",
        order_amount: "",
        currency: "",
        timestamp: "",
        version: "",
        email: "",
        timeout_express: "",
        passback_params: "",
        notify_url: "",
        return_url: "",
        sign_type: "",
        sign: ""
      },
      currentSelectedCoupon: sessionStorage.getItem("currentSelectedCoupon") ? JSON.parse(sessionStorage.getItem("currentSelectedCoupon")) : '',
      packageList: [],
      orderTimes: 0
    }
  },
  mounted() {
    this.getPayMode();
    this.getPayWayList();
    this.initPayBtnPosition();
  },
  watch: {},
  computed: {
    ...Vuex.mapState([
      "currencyDic",
      "couponCurrencyDic",
      "payWay",
      "packageSelected",
      "addressInfo"
    ])
  },
  methods: {
    ...Vuex.mapMutations([
      'setPayWay',
    ]),
    // 是否勾选服务协议
    initPayBtnPosition() {
      if (this.payWay === "PayPal") {
        $("#paypal-button").css("left", "0");
      } else {
        $("#paypal-button").css("left", "-9999px");
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    // 获取支付方式
    getPayWayList() {
      let data = {
        packageId: this.packageId,
        appLanguage: this.lang,
        appVersion: Number(this.appVersion),
        appId: this.appId,
        userId: this.userId
      };

      this.$http
        .post(api.getPaymentInfo(), data)
        .then(res => {
          if (res.data.returnCode == "0") {
            this.payWayList = res.data.data;
          }
        })
        .catch(() => {});
    },
    // 获取支付模式
    getPayMode() {
      let that = this;
      let data = {
        appId: this.appId,
        userId: this.userId
      };
      this.loading = true;
      this.$http
        .post(api.getPaymentMode(), data)
        .then(res => {
          if (res.data.returnCode == "0") {
            let s = document.createElement("script");
            s.type = "text/javascript";

            if (res.data.data != "sandbox") {
              that.payMode = "production";
              s.src = "./static/utils/pagsmile_live.js";
              document.body.appendChild(s);
            } else {
              s.src = "./static/utils/pagsmile_sandbox.js";
              document.body.appendChild(s);
            }

            setTimeout(() => {
              that.pay();
            }, 10);
            setTimeout(() => {
              that.loading = false;
            }, 2500);
          }
        })
        .catch(() => {});
    },
    toGuide(item) {
      this.$router.push({
        path: "/guidance",
        query: {
          payWay: item,
          title: this.payWayRenderTextDic[item]
        }
      });
    },
    // 关闭弹框
    close(prop) {
      this[prop] = false;
    },
    // 选择支付方式
    choosePayWay(item) {
      this.setPayWay(item);
      this.initPayBtnPosition();

      this.statementFlag = true;
      this.statementObj.title = this.payWayRenderTextDic[item];

      let promptDic = {
        "Boleto": this.$t("您所购买的服务将在付款成功后3个工作日内生效（银行审核需求），想要更快完成购买，请选择其他方式。"),
        "PayPal": this.$t("您所购买的服务将在付款成功后10分钟内生效。"),
        "Payment by Card": this.$t("您所购买的服务将在付款成功后10分钟内生效。"),
        "Bank deposits": this.$t("您所购买的服务将在付款成功后4小时内生效，想要更快完成购买，请选择其他方式。"),
        "Payment in lotteries": this.$t("您所购买的服务将在付款成功后1小时内生效，想要更快完成购买，请选择其他方式。"),
      }

      this.statementObj.note = promptDic[item];

      if (item === 'Boleto' && this.packageSelected.currency == 'BRL') {
        this.statementObj.note = this.$t("您所购买的服务将在付款成功后15分钟内生效。");
      }
    },
    // 更多支付方式
    morePayWay() {
      this.$router.push({
        path: "/feedback"
      });
    },

    // 跳转到帮助中心页面
    toAppHelp() {
      sessionStorage.setItem('routerFrom', 'next-index');
      sessionStorage.setItem('isClickDetail', 0);

      this.$router.push({
        path: "/app-help"
      });
    },

    // 巴西本土支付
    boletoClick(payway) {
      let _self = this;

      if (payway == "") {
        this.message(this.$t("请选择支付方式"));
        return;
      }

      if (payway == "PayPal") {
        return;
      }

      /* 选择巴西信用卡支付方式，点击【立即购买】需判断当前用户是否在24小时内已创建过巴西信用卡订单，再弹出友好提示语 */
      if (payway == "Payment by Card") {
        let data = {
          appId: this.appId,
          userId: this.userId,
          appLanguage: this.lang,
          appVersion: Number(this.appVersion),
        };

        this.$http
          .post(api.getCardOrderCounts(), data)
          .then(res => {
            if (res.data.returnCode == "0") {
              if (res.data.data > 0) {
                _self.promptFlag = true;
                _self.orderTimes = res.data.data;
              } else {
                _self.boletoPay();
              }
            }
          })
          .catch(() => {});
      } else {
        this.boletoPay();
      }

    },

    boletoPay() {
      let buyLink = '';
      if (!this.tk && !this.loginType) {
        buyLink = `${location.origin}/#/index?lang=${this.lang}&userId=${this.userId}&packageId=${this.packageId}&appId=${this.appId}&appVersion=${this.appVersion}`
      } else {
        buyLink = `${location.origin}/#/index?lang=${this.lang}&userId=${this.userId}&packageId=${this.packageId}&appId=${this.appId}&appVersion=${this.appVersion}&tk=${this.tk}&loginType=${this.loginType}&packageCode=${this.packageCode}&couponId=${this.couponId}`
      }

      let data = {
        packageId: this.packageId,
        appId: this.appId,
        userId: this.userId,
        appLanguage: this.lang,
        paymentType: this.payWay,
        appVersion: Number(this.appVersion),
        buyLink: buyLink
      };

      if (this.currentSelectedCoupon) {
        data.couponInfo = {
          couponId: _.get(this.currentSelectedCoupon, 'id'),
          couponCode: _.get(this.currentSelectedCoupon, 'couponCode'),
          packageCode: _.get(this.currentSelectedCoupon, 'packageCode'),
          currencyType: _.get(this.packageSelected, 'currency'),
          amount: _.get(this.currentSelectedCoupon, [this.couponCurrencyDic[this.packageSelected.currency]])
        };
      }

      this.loading = true;

      this.$http
        .post(api.createOrder(), data)
        .then(res => {
          this.loading = false;
          let resData = res.data.data;
          if (resData && res.data.returnCode == "0") {
            sessionStorage.setItem("payId", resData.paymentId);

            if (resData.paymentType == "Boleto" && resData.paymentPlatform == "Payssion") {
              sessionStorage.setItem("payId", resData.paymentId);
              location.href = resData.redirectUrl;
            } else if (
              [
                "Payment by Card",
                "Payment in lotteries",
                "Bank deposits"
              ].indexOf(resData.paymentType) > -1 || (resData.paymentType == "Boleto" && resData.paymentPlatform == "Pagsmile")
            ) {
              let pagsmileFormObj = document.getElementById("pagsmile_pay");

              if (this.payMode != "sandbox") {
                pagsmileFormObj.action =
                  "https://pserver.pagsmile.com/gateway.json";
              }

              if (resData.paymentInfo) {
                this.pagsmileForm = _.assign(
                  this.pagsmileForm,
                  resData.paymentInfo
                );

                setTimeout(() => {
                  pagsmileFormObj.submit();
                }, 0);
              }
            }
          } else {
            let errorCodeObj = {
              "1": 2,
              "500": 3
            };

            this.failTips = true;
            this.errorCode = errorCodeObj[res.data.returnCode] ?
              errorCodeObj[res.data.returnCode] :
              1;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },

    // 跳转到服务协议页面
    toService() {
      this.$router.push({
        path: "/service"
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

    // 关闭弹框
    close(prop) {
      this[prop] = false;
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
              .post(api.createOrder(), {
                packageId: that.packageId,
                appId: that.appId,
                appVersion: Number(that.appVersion),
                appLanguage: that.lang,
                userId: that.userId,
                couponInfo: {
                  couponId: _.get(that.currentSelectedCoupon, 'id'),
                  couponCode: _.get(that.currentSelectedCoupon, 'couponCode'),
                  packageCode: _.get(that.currentSelectedCoupon, 'packageCode'),
                  currencyType: _.get(that.packageSelected, 'currency'),
                  amount: _.get(that.currentSelectedCoupon, [that.couponCurrencyDic[that.packageSelected.currency]])
                },
                paymentType: that.payWay
              })
              .then(res => {
                if (res.data.returnCode == "1") {
                  that.failTips = true;
                  that.errorCode = 2;
                  return;
                } else if (res.data.returnCode == "500") {
                  that.failTips = true;
                  that.errorCode = 3;
                  return;
                } else if (res.data.returnCode == "0") {} else {
                  that.failTips = true;
                  that.errorCode = 1;
                  return;
                }
                let resData = res.data.data;

                if (resData) {
                  // 3. Return res.id from the response
                  //保存订单ID
                  console.log(123123, res);
                  sessionStorage.setItem("payId", resData.paymentId);
                  return resData.paymentId;
                }
              })
              .catch(() => {});
          },
          // Execute the payment:
          // 1. Add an onAuthorize callback
          onAuthorize: function (data, actions) {
            // 2. Make a request to your server
            // return actions.request.post('http://192.168.10.145:8089/api/pay/executePayment/', {

            return that.$http
              .post(api.executePayment(), {
                paymentID: data.paymentID,
                payerID: data.payerID,
                userId: that.userId,
                paymentType: that.payWay
              })
              .then(res => {
                if (res.data.returnCode == "0") {
                  sessionStorage.setItem(
                    "authorizedDays",
                    res.data.data.authorizedDays
                  );
                  that.$router.push({
                    path: "/success"
                  });
                } else if (res.data.returnCode == "error_017") {
                  that.$router.push({
                    path: "/success"
                  });
                } else {
                  that.$router.push({
                    path: "/fail"
                  });
                }
              })
              .catch(() => {});
          }
        },
        "#paypal-button"
      );
    }
  }
};
