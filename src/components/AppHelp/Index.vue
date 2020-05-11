<template>
  <div class="index-page">
    <p class="head-title">
      <i class="shopIcon shop-jiantou-copy" @click="goBack()"
        v-if="routerFrom == 'app-vip' || routerFrom == 'next-index'"></i>
      {{$t('帮助反馈')}}
    </p>
    <div class="index-tab">
      <div>
        <ul>
          <li v-for="(item,index) in navList" :key="index" :class="[{'active': faqSelectedIndex==index}]"
            @click="tabClick(index)">{{$t(item.navName)}}</li>
        </ul>
      </div>
    </div>
    <div class="tab">
      <ul>
        <li v-for="(item,index) in _.get(navList[faqSelectedIndex], 'navContentList')" :key="index"
          @click="questionClick(index)">
          {{$t(item.question)}}</li>
      </ul>
    </div>

    <a @click="toFeedback()" class="foot">
      <i class="shopIcon shop-bianji"></i>
      {{$t('意见反馈')}}
    </a>
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
        appId: sessionStorage.getItem("appId") ?
          sessionStorage.getItem("appId") : "",
        routerFrom: sessionStorage.getItem("routerFrom") ?
          sessionStorage.getItem("routerFrom") : "",
        faqSelectedIndex: sessionStorage.getItem("faqSelectedIndex") ?
          sessionStorage.getItem("faqSelectedIndex") : 0,
        isClickDetail: sessionStorage.getItem("isClickDetail") ?
          sessionStorage.getItem("isClickDetail") : 0,
        email: sessionStorage.getItem("email") ?
          sessionStorage.getItem("email") : "",
        navList: []
      };
    },
    created() {
      document.title = this.$t("帮助反馈");
      this.getHelpDoc();
    },
    mounted() {
      let _self = this;
      if (_self.routerFrom == 'next-index') {
        if (_self.isClickDetail == 0) {
          let findIndex = _.findIndex(_self.navList, item => {
            return item.type == 1;
          });

          _self.faqSelectedIndex = findIndex > -1 ? findIndex : 0;
        }
      }
    },
    watch: {},
    directives: {},
    filters: {},
    methods: {
      getHelpDoc() {
        let _self = this;
        let params = {
          appId: this.appId,
          lang: this.lang
        };

        this.$http
          .get(api.getHelpDoc(), {
            params
          })
          .then(res => {
            if (res.data.returnCode == 0) {
              // 问题类型 1支付 2会员 3账号 4其他
              _self.navList = res.data.data;
            } else {
              _self.message(this.$t("系统异常，请稍后重试！"));
            }
          })
          .catch(() => {});
      },
      toFeedback() {
        this.$router.push({
          path: "/feedback"
        });
      },
      tabClick(index) {
        this.faqSelectedIndex = index;
      },
      questionClick(index) {
        sessionStorage.setItem(
          "detailObj",
          JSON.stringify(this.navList[this.faqSelectedIndex].navContentList[index])
        );
        sessionStorage.setItem("faqSelectedIndex", this.faqSelectedIndex);
        sessionStorage.setItem('isClickDetail', 1);

        this.$router.push({
          path: "/app-help-detail"
        });
      },
      goBack() {
        this.$router.go(-1);
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

      i {
        position: absolute;
        left: 0rem;
        color: #fff;
        font-size: 1.75rem;
        width: 3rem;
      }
    }

    .index-tab {
      overflow-x: auto;

      >div {
        display: -webkit-box;
        white-space: nowrap;
        -webkit-backface-visibility: hidden;
        -webkit-perspective: 1000;
        -webkit-overflow-scrolling: touch;
        text-align: justify;
        overflow-x: initial;
        padding-bottom: 0.7rem;
      }

      ul {
        width: calc(100% - 2rem);
        margin: 1.5rem auto;
        margin-bottom: 0;
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;

        li {
          text-align: center;
          margin: 0.7rem 0;
          width: 43%;
          word-break: break-word;
          white-space: initial;
          position: relative;
          vertical-align: middle;
          font-size: 1.5rem;
          padding: 0.7rem;
          background: #555;
          border-radius: 5px;
        }

        .active {
          color: #333;
          background-color: rgb(255, 170, 0);
        }
      }
    }

    .tab {
      width: calc(100% - 2rem);
      margin: 0 auto;
      background: #2d2d39;
      border-radius: 0.5rem;

      li {
        padding: 1rem;
        border-bottom: 1px solid #20202a;
        font-size: 1.4rem;
      }
    }

    .foot {
      position: absolute;
      width: max-content;
      bottom: 0;
      left: 0;
      right: 0;
      color: rgb(255, 170, 0);
      background: rgb(26, 26, 36);
      font-size: 1.6rem;
      border: 1px solid rgb(255, 170, 0);
      padding: 0.5rem 1.5rem;
      border-radius: 0.5rem;
      margin: 3rem auto;
      text-align: center;
    }

    .shop-bianji:before {
      font-size: 2rem;
    }
  }

</style>
