<template>
  <div class="index-new-page scanpaycore-page">
    <!-- <p class="head-title">
      <i class="shopIcon shop-jiantou-copy" @click="goBack()"></i>{{$t('奖励详情')}}
    </p> -->

    <div class="tab">
      <span :class="[{'active': selectedIndex==index}, 'item']" v-for="(item,index) in tabList" :key="index"
        @click="tabClick(index)">{{item}}</span>
    </div>

    <div class="page-container">

      <div v-if="selectedIndex == 0 && inviteRewardList.length > 0">
        <p class="free-reward">
          <span class="text1">{{$t('您已免费获得')}}</span>
          <span class="text2">{{totalDay}}</span>
          <span class="text3">{{$t('天VIP服务')}}</span>
          <span class="text4">{{$t('（累计最高可获得360天）')}}</span>
        </p>

        <ul class="render-list">
          <li v-for="(item,index) in inviteRewardList" :key="index">
            <span>{{$t('奖励')}} {{item.authDay}} {{$t('天vip时长')}}</span>
            <span>{{item.createTime}}</span>
          </li>
        </ul>
      </div>
      <div v-if="selectedIndex == 1 && inviteRecordList.length > 0">
        <p class="free-reward">
          <span class="text1">{{$t('您已免费获得')}}</span>
          <span class="text2">{{totalDay}}</span>
          <span class="text3">{{$t('天VIP服务')}}</span>
          <span class="text4">{{$t('（累计最高可获得360天）')}}</span>
        </p>

        <ul class="render-list">
          <li v-for="(item,index) in inviteRecordList" :key="index">
            <span class="invitee-user">
              {{item.inviteeUserId}}
              <i class="invitee-info" v-if="item.inviteeInfo">{{item.inviteeInfo}}</i>
            </span>
            <span>{{item.createTime}}</span>
          </li>
        </ul>
      </div>

      <div class="no-record"
        v-if="(selectedIndex == 0 && inviteRewardList.length == 0) || (selectedIndex == 1 && inviteRecordList.length == 0)">
        <img src="../../assets/images/friend-recommend/no-record.png" alt="">
        <p>{{$t('您暂时还没有获得奖励，快去邀请好友吧')}}</p>
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
        appId: sessionStorage.getItem("appId") ?
          sessionStorage.getItem("appId") : "",
        tk: sessionStorage.getItem("tk") ?
          sessionStorage.getItem("tk") : "",
        loginType: sessionStorage.getItem("loginType") ?
          sessionStorage.getItem("loginType") : "",
        userId: sessionStorage.getItem("userId") ?
          sessionStorage.getItem("userId") : "",
        inviteRewardList: [],
        inviteRecordList: [],
        totalDay: 0, // 总共奖励天数
        selectedIndex: 0,
        tabList: [this.$t('奖励记录'), this.$t("邀请记录")]
      };
    },
    mounted() {
      document.title = this.$t("奖励详情");
      this.tabClick(this.selectedIndex);
    },
    watch: {},
    directives: {},
    filters: {},
    methods: {
      tabClick(index) {
        this.selectedIndex = index;

        if (index == 0) {
          this.queryInviteReward();
        } else {
          this.queryInviteRecord();
        }
      },
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
              _.forEach(_.get(res.data.data, 'inviteRecordList'), (item) => {
                let offSet = this.moment().utcOffset(); //时差
                let formatArrProperty = ["createTime"];

                _.forEach(formatArrProperty, (property) => {
                  if (item[property]) {
                    item[property] = this.moment(item[property]).add(offSet, 'm').format('DD-MM-YYYY HH:mm');
                  }
                });
              });

              _self.inviteRecordList = _.get(res.data.data, 'inviteRecordList');

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
              _.forEach(_.get(res.data.data, 'inviteRewardList'), (item) => {
                let offSet = this.moment().utcOffset(); //时差
                let formatArrProperty = ["createTime"];

                _.forEach(formatArrProperty, (property) => {
                  if (item[property]) {
                    item[property] = this.moment(item[property]).add(offSet, 'm').format('DD-MM-YYYY HH:mm');
                  }
                });
              });

              _self.inviteRewardList = _.get(res.data.data, 'inviteRewardList');
              _self.totalDay = _.get(res.data.data, 'totalDay');

            } else {
              _self.message(this.$t("系统异常，请稍后重试！"));
            }
          })
          .catch(() => {});
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
  .index-new-page {
    padding: 0;
    font-size: 1.25rem;
    position: relative;
    max-width: 800px;
    height: 100vh;
    margin: 0 auto;
    background: #fff;
    display: flex;
    flex-direction: column;

    .head-title {
      text-align: center;
      background: #1d2837;
      color: #fff;
      height: 2.75rem;
      line-height: 2.75rem;
      padding: 0.5rem 0rem;
      font-size: 1.75rem;

      i {
        position: absolute;
        left: 0rem;
        color: #fff;
        width: 3rem;
        font-size: 1.75rem;
      }
    }

    .tab {
      display: flex;
      font-size: 1.4rem;
      min-height: 2.75rem;
      line-height: 2.75rem;
      padding: 0.5rem 0rem;
      background: #1d2837;
      color: #fff;

      .item {
        flex: 1;
        text-align: center;
      }

      .active {
        color: #ffae14;
      }
    }

    .page-container {
      position: relative;
      overflow: auto;
      background: #1f202a;
      height: calc(100vh - 3.75rem);
      padding: 0rem 1rem;

      .free-reward {
        color: #fff;
        font-size: 1rem;
        margin: .5rem 0rem;

        .text2 {
          color: #eb4026;
        }

        .text4 {
          color: #999;
        }
      }

      .render-list {
        font-size: 1.1rem;

        li {
          display: flex;
          justify-content: space-between;
          background: #2c2d39;
          border-radius: 0.25rem;
          margin-bottom: 1rem;
          padding: 1rem;

          .invitee-user {
            font-size: 1.3rem;

            .invitee-info {
              font-size: 1rem;
              color: #ccc;
              background: #393b4a;
              border-radius: 0.75rem;
              padding: 0.1rem .5rem;
              margin-left: .2rem;
            }
          }

          span:first-child {
            color: #fff;
            flex: 1;
            text-align: left;
          }

          span:last-child {
            flex-basis: 10rem;
            text-align: right;
            color: #999;
          }
        }
      }

      .no-record {
        img {
          width: 80%;
          margin: 0 auto;
          display: block;
          margin-top: 5rem;
        }

        p {
          text-align: center;
          margin-top: 2rem;
          color: #fff;
        }
      }
    }
  }

</style>
