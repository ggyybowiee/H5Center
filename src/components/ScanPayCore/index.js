import api from "../../api/api";
import IndexOld from './IndexOld'

'use strict';
export default {
  data() {
    return {
      userId: sessionStorage.getItem("userId") ?
        sessionStorage.getItem("userId") : "",
      lang: sessionStorage.getItem("lang") ?
        sessionStorage.getItem("lang") : "",
      userType: sessionStorage.getItem("userType") ?
        sessionStorage.getItem("userType") : "",
      packageId: sessionStorage.getItem("packageId") ?
        sessionStorage.getItem("packageId") : "",
      appId: sessionStorage.getItem("appId") ?
        sessionStorage.getItem("appId") : "",
      appVersion: sessionStorage.getItem("appVersion") ?
        sessionStorage.getItem("appVersion") : "",
      routerFrom: sessionStorage.getItem("routerFrom") ?
        sessionStorage.getItem("routerFrom") : "",
      email: sessionStorage.getItem("email") ?
        sessionStorage.getItem("email") : "",
      tk: sessionStorage.getItem("tk") ?
        sessionStorage.getItem("tk") : "",
      loginType: sessionStorage.getItem("loginType") ?
        sessionStorage.getItem("loginType") : "",
      packageCode: sessionStorage.getItem("packageCode") ?
        sessionStorage.getItem("packageCode") : "",
      couponId: sessionStorage.getItem("couponId") ?
        sessionStorage.getItem("couponId") : "",
      showOldPage: false,
      errorCode: "", // 1: 页面已失效请重新操作，2：信息错误请重新操作，3：系统繁忙
      failTips: false,
      statementFlag: false,
      promptFlag: false,
      couponList: [],
      currentSelectedCoupon: '',
      domain: document.domain,
      browserObj: "",
      packageList: []
    };
  },
  created() {
    if (window.location.href.indexOf("remainingDays") > -1) {
      this.showOldPage = true;
      return;
    }

    let s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "./static/utils/paypal-checkout.min.js";
    document.body.appendChild(s);

    this.showOldPage = false;
    this.getIPInfoAndEmail();

    // 先获取优惠券信息，然后再获取套餐信息，之后在选择套餐时，对优惠券信息进行排序
    if (!this.tk && !this.loginType) {
      this.getPackageCustomization();
    } else {
      this.queryCoupon();
    }

    if (this.routerFrom != 'app-vip' && this.routerFrom != 'friend-invitation') {
      if (!this.tk && !this.loginType) {
        window.location.href =
          `${location.origin}/#/index?lang=${this.lang}&userId=${this.userId}&packageId=${this.packageId}&appId=${this.appId}&appVersion=${this.appVersion}`
      } else {
        window.location.href =
          `${location.origin}/#/index?lang=${this.lang}&userId=${this.userId}&packageId=${this.packageId}&appId=${this.appId}&appVersion=${this.appVersion}&tk=${this.tk}&loginType=${this.loginType}&packageCode=${this.packageCode}&couponId=${this.couponId}`
      }
    }
  },
  mounted() {
    this.browserObj = this.getBrowserInfo();
    this.passBrowserInfo(this.browserObj);
    document.title = this.$t("开通会员");
  },
  watch: {},
  computed: {
    ...Vuex.mapState([
      "currencyDic",
      "couponCurrencyDic",
      "packageSelected",
      "packageSelectedIndex",
      "currentPackageLinkConpon",
      "addressInfo",
    ])
  },
  methods: {
    ...Vuex.mapMutations([
      'setPackageSelected',
      'setPackageSelectedIndex',
      'setCurrentPackageLinkConpon',
      'setPayWay',
      'setAddressInfo',
    ]),
    queryCoupon() {
      let _self = this;
      let data = {
        appId: this.appId,
        uid: this.userId,
        lang: this.lang,
        tk: this.tk,
        loginType: this.loginType
      };

      this.$http
        .post(api.queryCoupon(), data)
        .then(res => {
          if (res.data.returnCode == "0") {
            _self.couponList = _.get(res.data.data, 'couponCodeList');
            // 先对获取的优惠券进行排序，排序后再获取套餐列表
            _self.getPackageCustomization();
          }
        })
        .catch(() => {});
    },
    sortCouponList(couponList, currentSelectPackage) {
      /**
        TODO: 对获取的所有优惠券进行排序
        1， 可用的优惠卷， 排前面， 按照金额大小排
        2， 有效的优惠卷， 排第二， 按照金额大小排
        3, 已过期和已使用的放一起， 按照过期时间排
        优惠券状态status枚举值，0：未使用，1：已使用，2：已过期
      */
      let _self = this;

      let arrStatus1 = _.chain(couponList)
        .filter((item) => {
          return item.status == 0 && currentSelectPackage.packageCode == item.packageCode
        })
        .sortBy((item) => {
          return -item[_self.couponCurrencyDic[currentSelectPackage.currency]]
        })
        .value();

      let arrStatus2 = _.chain(couponList)
        .filter((item) => {
          return item.status == 0 && currentSelectPackage.packageCode != item.packageCode
        })
        .sortBy((item) => {
          return -item[_self.couponCurrencyDic[currentSelectPackage.currency]]
        })
        .value();

      let arrStatus3 = _.chain(couponList)
        .filter((item) => {
          return item.status != 0
        })
        .sortBy((item) => {
          return -_self.moment(item.invalidTime);
        })
        .value();

      this.couponList = _.concat(arrStatus1, arrStatus2, arrStatus3);

      _.forEach(this.couponList, item => {
        _.forEach(this.packageList, subItem => {
          if (item.packageCode === subItem.packageCode) {
            item.packagePlanName = subItem.packagePlanName;
          }
        });
      });

      this.setCurrentPackageLinkConpon(this.couponList);
    },
    toSelectCoupon() {
      this.$router.push({
        path: "/coupon"
      });
    },
    toNext() {
      sessionStorage.setItem(
        "packageId",
        this.packageId
      );

      this.$router.push({
        path: "/next-index"
      });
    },
    confirm() {
      if ((_.get(this.packageSelected, 'packageCode')) && this.packageList.length > 0) {
        if (this.currentSelectedCoupon) {
          this.promptFlag = true;
        } else {
          this.toNext()
        }
      }
    },
    // 获取地址信息
    getIPInfoAndEmail() {
      let data = {
        appId: this.appId,
        userId: this.userId,
        appVersion: Number(this.appVersion),
        appLanguage: this.lang
      };
      this.$http
        .post(api.getIPInfoAndEmail(), data)
        .then(res => {
          if (res.data.returnCode == "0") {
            this.setAddressInfo(res.data.data ? res.data.data : {});
          }
        })
        .catch(() => {});
    },
    // 选择套餐
    selectedPackage(index, item) {
      let _self = this;
      this.currentSelectedCoupon = '';

      if (item.isOutOfLimit) {
        return;
      }

      this.setPayWay('');
      this.setPackageSelected(item);
      this.setPackageSelectedIndex(index);
      this.packageId = item.id;

      // 进行排序
      this.sortCouponList(this.couponList, item);

      let currentSelectedCoupon = sessionStorage.getItem("currentSelectedCoupon") ? JSON.parse(sessionStorage.getItem("currentSelectedCoupon")) : '';

      if (currentSelectedCoupon && (_.get(currentSelectedCoupon, 'packageCode') == item.packageCode)) {
        this.currentSelectedCoupon = currentSelectedCoupon;
        return;
      }

      let couponId = sessionStorage.getItem("couponId") ? JSON.parse(sessionStorage.getItem("couponId")) : '';
      sessionStorage.setItem("currentSelectedCoupon", '');

      if (couponId) {
        this.currentSelectedCoupon = _.find(this.couponList, (coupon) => {
          return coupon.id == couponId && coupon.packageCode == item.packageCode;
        });

        sessionStorage.setItem("couponId", "");
        sessionStorage.setItem("currentSelectedCoupon", JSON.stringify(this.currentSelectedCoupon));

      } else {
        _.forEach(this.couponList, obj => {
          if (obj.status == 0 && obj.packageCode == item.packageCode) {
            this.currentSelectedCoupon = obj;
            sessionStorage.setItem("currentSelectedCoupon", JSON.stringify(obj));
            return false;
          }
        });
      }
    },
    getPackageCustomization() {
      this.packageList = [];
      let flag = _.every([this.userId, this.appId], function (item) {
        return item !== "";
      });

      if (!flag) {
        this.message(this.$t("信息错误请重新操作"));
        return;
      }

      let data = {
        appId: this.appId,
        userId: this.userId,
        appVersion: Number(this.appVersion),
        appLanguage: this.lang
      };

      let that = this;

      this.$http
        .post(api.getPackageCustomization(), data)
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
            let packageList = resData;
            let limitSpecialPackageList = [];

            // 排序，不可购买的套餐排上面
            packageList = _.sortBy(packageList, function (o) {
              return !o.isOutOfLimit;
            });

            // 计算除了特殊套餐的数量
            _.forEach(packageList, item => {
              that.packageList.push(item);
              if (item.isOutOfLimit) {
                limitSpecialPackageList.push(item);
              }
            });

            // 记忆用户购买完套餐跳回当前地址的已选套餐(该套餐如果是被限制了的，则自动选择能选中的第一个套餐)
            let findIndex = _.findIndex(packageList, item => {
              return (
                (item.id == sessionStorage.getItem("packageId") &&
                  !item.isOutOfLimit) || (item.packageCode == sessionStorage.getItem("packageCode") &&
                  !item.isOutOfLimit)
              );
            });

            if (findIndex == -1) {
              if (limitSpecialPackageList.length > 0) {
                findIndex = limitSpecialPackageList.length;
              } else {
                findIndex = 0;
              }
            }

            if (JSON.stringify(that.packageSelected) == "{}" || !that.packageList[that.packageSelectedIndex]) {
              that.selectedPackage(findIndex, packageList[findIndex]);
            } else {
              that.selectedPackage(that.packageSelectedIndex, that.packageSelected);
            }

          }
        })
        .catch(() => {});
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

    showStatement(item) {
      if (item.isOutOfLimit) {
        return;
      }

      this.statementFlag = true;
      this.languageDescribe = item.languageDescribe;
    },

    // 关闭弹框
    close(prop) {
      this[prop] = false;

      if (prop === 'failTips') {
        this.getPackageCustomization();
      }
    },

    goBack() {
      this.$router.go(-1);
    },

    //获取IE浏览器的版本号的兼容写法
    IEVersion() {
      let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
      let isIE =
        userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
      let isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
      let isIE11 =
        userAgent.indexOf("Trident") > -1 && userAgent.indexOf("rv:11.0") > -1;
      if (isIE) {
        let reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        let fIEVersion = parseFloat(RegExp["$1"]);
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
      let arr = [null, null];
      let browserInfo = {
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
      let agent = navigator.userAgent.toLowerCase();
      let sUserAgent = navigator.userAgent;
      let regStr_ff = /firefox\/[\d.]+/gi;
      let regStr_chrome = /chrome\/[\d.]+/gi;
      let regStr_saf = /safari\/[\d.]+/gi;
      let regStr_opera = /opr\/[\d.]+/gi;
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
    passBrowserInfo(browserObj) {
      let parame = {
        domainName: this.domain,
        browserName: browserObj.name,
        browserVersion: browserObj.version
      };
      this.$http
        .post(api.passBrowserInfo(), parame)
        .then(res => {
          console.log("成功");
        })
        .catch(() => {
          console.log("失败");
        });
    }
  },
  components: {
    IndexOld
  }
};
