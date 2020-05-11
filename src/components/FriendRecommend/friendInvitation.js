import api from "../../api/api";

'use strict';
export default {
  data() {
    return {
      lang: sessionStorage.getItem("lang") ?
        sessionStorage.getItem("lang") : "",
      appId: sessionStorage.getItem("appId") ?
        sessionStorage.getItem("appId") : "",
      tk: sessionStorage.getItem("tk") ?
        sessionStorage.getItem("tk") : "",
      loginType: sessionStorage.getItem("loginType") ?
        sessionStorage.getItem("loginType") : "",
      userId: sessionStorage.getItem("userId") ?
        sessionStorage.getItem("userId") : "",
      userIdentify: sessionStorage.getItem("userIdentify") ?
        sessionStorage.getItem("userIdentify") : "",
      setting: setting,
      inviteRewardList: [],
      inviteRecordList: [],
      commonModalFlag: false, // 通用弹框
      copyModalFlag: false,
      giftModalFlag: false,
      sendCouponModalFlag: false,
      totalDay: 0, // 总共奖励天数
      hasInvite: 0, // 是否领取过
      descriptionText: '',
      inputInviteCode: '', // 输入框 - 邀请码
      selfInviteCode: '', // 自己的邀请码
      invitedReward: {
        currency: 'brl',
        price: 0
      }, // 输入邀请码点击领取后获得的数据
      getRewardCount: 0
    };
  },
  computed: {
    ...Vuex.mapState([
      "currencyDic",
      "couponCurrencyDic"
    ])
  },
  created() {
    this.queryInviteRecord();
    // 获取自己的邀请码
    this.getInviteCode();
  },
  mounted() {
    document.title = this.$t("好友邀请");
    // this.message("width: " + document.body.clientWidth + " , height: " + document.body.clientHeight);
  },
  watch: {},
  directives: {},
  filters: {},
  methods: {
    // 好友推荐 - 邀请记录
    queryInviteRecord() {
      let _self = this;
      let data = {
        appId: this.appId,
        uid: this.userId,
        tk: this.tk,
        loginType: this.loginType
      };

      this.$http
        .post(api.queryInviteRecord(), data)
        .then(res => {
          if (res.data.returnCode == "0") {
            _self.inviteRecordList = _.get(res.data.data, 'inviteRecordList');
            _self.queryInviteReward();
          } else {
            _self.message(this.$t("系统异常，请稍后重试！"));
          }
        })
        .catch(() => {});
    },
    // 好友推荐 - 奖励记录
    queryInviteReward() {
      let _self = this;
      let data = {
        appId: this.appId,
        uid: this.userId,
        tk: this.tk,
        loginType: this.loginType
      };

      this.$http
        .post(api.queryInviteReward(), data)
        .then(res => {
          if (res.data.returnCode == "0") {
            _self.inviteRewardList = _.get(res.data.data, 'inviteRewardList');
            _self.totalDay = _.get(res.data.data, 'totalDay');
            _self.hasInvite = _.get(res.data.data, 'hasInvite');
            _self.getRewardCount = Math.floor((_self.inviteRecordList.length - _self.inviteRewardList.length * 3) / 3);
            console.log(_self.getRewardCount);
          } else {
            _self.message(this.$t("系统异常，请稍后重试！"));
          }
        })
        .catch(() => {});
    },
    getRewardInfo: _.debounce(function () {
      let _self = this;
      let data = {
        appId: this.appId,
        uid: this.userId,
        tk: this.tk,
        loginType: this.loginType
      };

      this.$http
        .post(api.getInviteReward(), data)
        .then(res => {
          if (res.data.returnCode == "0") {
            _self.giftModalFlag = true;
            _self.queryInviteRecord();
          } else {
            _self.message(this.$t("系统异常，请稍后重试！"));
          }
        })
        .catch(() => {});
    }, 1000),
    // 满3人，点击礼盒进行领取
    getInviteReward() {
      if (this.getRewardCount == 0) {
        return;
      }
      this.getRewardInfo();
    },
    // 回到安卓原生页面 - 邮箱绑定页面
    goAndroidBindPage() {
      if (Controller) { // 调用安卓方法
        Controller.startBindAty();
      }
    },
    // 点击“立即邀请好友”
    toInviteFriend() {
      if (this.userIdentify == '1') { // 游客
        this.descriptionText = this.$t("只需绑定账号，马上就可以邀请好友获取优惠哦");
        this.commonModalFlag = true;
      } else { // 非游客
        this.copyModalFlag = true;
      }
    },
    copyText() {
      if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
        //区分iPhone设备
        window.getSelection().removeAllRanges(); //这段代码必须放在前面否则无效
        let Url2 = document.getElementById('text'); //要复制文字的节点
        let range = document.createRange();
        // 选中需要复制的节点
        range.selectNode(Url2);
        // 执行选中元素
        window.getSelection().addRange(range);
        // 执行 copy 操作
        document.execCommand("copy");

        // 移除选中的元素
        window.getSelection().removeAllRanges();
      } else {
        let text = document.getElementById('text').innerText;
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
      this.close('copyModalFlag');
    },
    // 获取邀请码
    getInviteCode() {
      let _self = this;
      let data = {
        appId: this.appId,
        uid: this.userId,
        tk: this.tk,
        loginType: this.loginType
      };

      this.$http
        .post(api.getInviteCode(), data)
        .then(res => {
          if (res.data.returnCode == "0") {
            _self.selfInviteCode = _.get(res.data.data, 'inviteCode');
          } else if (res.data.returnCode == "aaa200008") {
            _self.userIdentify = '1'; // 游客
          } else {
            _self.message(this.$t("系统异常，请稍后重试！"));
          }
        })
        .catch(() => {});
    },
    // 立即使用
    useNow() {
      this.close('sendCouponModalFlag');
      if (this.userIdentify == '1') { // 游客
        this.descriptionText = this.$t("请您绑定账号即可使用优惠券");
        this.commonModalFlag = true;
      } else { // 非游客，进入套餐购买页面
        sessionStorage.setItem('routerFrom', 'friend-invitation');

        this.$router.push({
          path: "/index"
        });
      }
    },
    // 输入邀请码 - 领取奖励
    getInvitedReward() {
      let _self = this;
      let reg = /^[0-9A-Z]{6}$/;

      let inviteCode = this.inputInviteCode.toUpperCase().trim();

      if (inviteCode == "") {
        return;
      }

      if (!reg.test(inviteCode)) {
        this.message(
          this.$t("邀请码无效！")
        );
        return;
      }

      if (inviteCode == this.selfInviteCode) {
        this.message(
          this.$t("您无法使用自己的邀请码，请输入其他的邀请码！")
        );
        return;
      }

      let data = {
        appId: this.appId,
        uid: this.userId,
        tk: this.tk,
        inviteCode: inviteCode,
        loginType: this.loginType
      };

      this.$http
        .post(api.getInvitedReward(), data)
        .then(res => {
          if (res.data.returnCode == 0) {
            _self.sendCouponModalFlag = true;

            _.forEach(_.get(res.data.data, 'invitedRewardList'), (item) => {
              _self.invitedReward.currency = item.currency;
              _self.invitedReward.price += item[item.currency];
            });
            _self.invitedReward.price = _self.invitedReward.price.toFixed(1);

          } else if (res.data.returnCode == "aaa200004") {
            this.message(this.$t("邀请码无效！"));
          } else if (res.data.returnCode == "aaa200005") {
            this.message(this.$t("你已经填写过好友邀请码！"));
          } else if (res.data.returnCode == "aaa200006") {
            this.message(this.$t("您无法使用自己的邀请码，请输入其他的邀请码！"));
          } else if (res.data.returnCode == "aaa200007") {
            this.message(this.$t("邀请码使用异常，请联系客服"));
          } else if (res.data.returnCode == "aaa100003") {
            this.message(this.$t("你的账号异常，无法使用邀请码！"));
          } else {
            this.message(this.$t("系统异常，请稍后重试！"));
          }
        })
        .catch(() => {
          this.message(this.$t("网络超时，请重试！"));
        });
    },
    // 关闭弹框
    close(prop) {
      this[prop] = false;

      if (prop == 'sendCouponModalFlag') {
        this.descriptionText = this.$t("优惠券将在") + _.get(setting, 'couponExpiredDay') + this.$t("天内过期， 仅可领取1次， 建议您立即使用");
        this.commonModalFlag = true;
      }
    },
    toRule() {
      this.$router.push({
        path: "/rule"
      });
    },
    toInviteRecord() {
      this.$router.push({
        path: "/invite-record"
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
