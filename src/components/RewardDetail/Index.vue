<template>
  <div class="index-page">
    <p class="head-title">{{$t('奖励详情1')}}</p>
    <p class="your-invite-code common-margin">{{$t('您的邀请码')}}</p>
    <p class="invite-code common-margin">
      <span id="text">{{selfInviteCode}}</span> <span class="copy" @click="copyInviteCode()">{{$t("复制")}}</span>
    </p>
    <p class="invite-people common-margin">{{hasInvitedPeople}} {{$t('人已被成功邀请')}}. {{$t('系统累积赠送应用服务时长')}} <span
        class="num-color">{{rewardDays}} {{$t('复数天')}}</span></p>
    <img src="../../assets/images/invite.png" alt="" class="invite-img">
    <p :class="[{'hide': hasFillInviteCode}, 'invite-code-input-div common-margin']">
      {{$t('您还未填写好友的邀请码')}},<br>
      <span @click="toCodeInput()">{{$t('点击这里可前往填写')}}</span>
    </p>
    <p class="bottom common-margin">
      <span @click="showRules()">{{$t('查看邀请有奖规则')}}</span>
    </p>
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
          sessionStorage.getItem("selfInviteCode") : "",
        rewardDays: sessionStorage.getItem("rewardDays") ?
          sessionStorage.getItem("rewardDays") : "",
        hasInvitedPeople: sessionStorage.getItem("hasInvitedPeople") ?
          sessionStorage.getItem("hasInvitedPeople") : ""
      };
    },
    mounted() {
      document.title = this.$t("邀请有奖");
    },
    watch: {},
    directives: {},
    filters: {},
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      showRules() {
        this.$router.push({
          path: "/rules-detail"
        });
      },
      toCodeInput() {
        this.$router.push({
          path: "/code-input"
        });
      },
      copyInviteCode() {
        if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
          //区分iPhone设备
          window.getSelection().removeAllRanges(); //这段代码必须放在前面否则无效
          var Url2 = document.getElementById(`text`); //要复制文字的节点
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
          var text = document.getElementById(`text`).innerText;
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
      message(msg) {
        this.$message.closeAll();

        this.$message({
          duration: 5000,
          showClose: true,
          message: `${msg}`,
          type: "",
          iconClass: ""
        });
      },
    }
  };

</script>
<style lang="less" scoped>
  .index-page {
    padding: 0;
    font-size: 1.3rem;
    position: relative;
    min-height: 100vh;
    background: #20202a;
    color: #fff;
    display: flex;
    flex-direction: column;
    text-align: center;

    .common-margin {
      margin-left: 3%;
      margin-right: 3%;
    }

    .head-title {
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
        width: 3rem;
        font-size: 1.75rem;
      }
    }

    .your-invite-code {
      margin-top: 1rem;
      text-align: left;
      margin-bottom: 0.7rem;
    }

    .invite-code {
      font-weight: bold;
      font-size: 1.75rem;
      border: 1px dashed #999;
      border-radius: 4px;
      padding: 0.7rem 0;
      margin-bottom: 1rem;

      .copy {
        color: #3bda76;
        border-bottom: 1px solid #3bda76;
        margin-left: 1rem;
      }
    }

    .invite-people {
      line-height: 2rem;

      .num-color {
        color: #3bda76;
        font-size: 1.85rem;
      }
    }

    .invite-img {
      width: 18rem;
      margin: 0 auto;
    }

    .invite-code-input-div {
      line-height: 2rem;

      span {
        cursor: pointer;
        color: #3bda76;
        border-bottom: 1px solid #3bda76;
      }

      .word-description {
        margin: 0.5rem 0rem 1rem 0rem;
      }

      .el-button {
        color: #ffffff;
        border: unset;
        background-color: #3bda76;
        padding: 1rem;
        font-size: 1.4rem;
        width: 50%;
      }

      .tips {
        color: #dcb442;
      }
    }

    .hide {
      visibility: hidden;
    }

    .bottom {
      position: absolute;
      bottom: 0;
      width: 100%;
      text-align: center;
      margin: 2rem 0;

      span {
        text-align: center;
        color: #999;
        display: inline-block;
        border-bottom: 1px solid #999;
      }
    }
  }

</style>
