<template>
  <div :class="['index-page', {'unitv-tab': tvType == 2}, {'brasiltv-tab': tvType == 1}]" :tabindex="1"
    hidefocus="true">
    <div class="invite-title">
      {{$t('详细规则')}}
    </div>
    <div class="tab" v-if="tvType == 1">
      <p class="head-title">{{$t('活动简介')}}</p>
      <p class="content">{{$t('活动内容')}}</p>

      <p class="head-title">{{$t('参与流程')}}</p>
      <img src="../../assets/images/brasiltv/rule-en.png" alt="" v-if="lang == 'zh' || lang == 'en'">
      <img src="../../assets/images/brasiltv/rule-pt.png" alt="" v-if="lang == 'pt'">
      <img src="../../assets/images/brasiltv/rule-es.png" alt="" v-if="lang == 'es'">

      <div class="note">
        <p class="head-title">{{$t('注意事项')}}</p>
        <p class="content">{{$t('事项1')}}</p><br>
        <p class="content">{{$t('事项2')}}</p><br>
        <p class="content">{{$t('事项3')}}</p>
        <p class="content" style="padding-left: 3.5rem;">{{$t('奖励1')}}</p>
        <p class="content" style="padding-left: 3.5rem;">{{$t('奖励2')}}</p><br>
        <p class="content">{{$t('事项4')}}</p><br>
        <p class="content">{{$t('事项5')}} <span>{{email}}</span></p><br>
      </div>

    </div>

    <div class="tab" v-if="tvType == 2">
      <p class="desp">{{$t('Unitv邀请有奖')}}</p>
      <p class="head-title">{{$t('1、参与用户：')}}</p>
      <p class="content">{{$t('a、UniTV新用户')}}</p>
      <p class="content">{{$t('b、UniTV老用户')}}</p>

      <p class="head-title">{{$t('2、参与方式：')}}</p>
      <p class="content">{{$t('参与方式1')}}</p>
      <p class="content">{{$t('参与方式2')}}</p>

      <p class="head-title">{{$t('3、奖励内容：')}}</p>
      <p class="content" style="text-indent: 0; padding-left: 0.7rem;">{{$t('奖励内容1')}}</p>

      <p class="head-title">{{$t('4、奖励查询：')}}</p>
      <p class="content">{{$t('奖励查询1')}}</p>
      <p class="content">{{$t('奖励查询2')}}</p>

      <p class="head-title">{{$t('5、活动限制：')}}</p>
      <p class="content" style="text-indent: 0; padding-left: 0.7rem;">{{$t('活动限制1')}}</p>

      <p class="content" style="text-indent: -1rem; padding-left: 0.75rem; margin-bottom: 2rem; margin-top: 2rem;">
        * {{$t('本次活动')}} <span style="color: #ffaa01;">{{email}}</span></p>
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
        tvType: sessionStorage.getItem("tvType") ?
          sessionStorage.getItem("tvType") : 1,
        email: sessionStorage.getItem("email") ?
          sessionStorage.getItem("email") : ""
      };
    },
    mounted() {
      document.title = this.$t("详细规则");
    },
    watch: {},
    directives: {},
    filters: {},
    methods: {
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
    max-height: 100vh;
    background: url('../../assets/images/brasiltv/bg.png') no-repeat;
    background-size: cover;
    color: #fff;
    overflow-y: auto;

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
      color: #bbc0c3;
      font-size: 2.4rem;
      border-bottom: 1px solid #b2b5b9;
      padding: 0.5rem 3rem 0rem;
    }

    .tab {
      border-radius: 0.5rem;
      text-align: center;
      padding: 0 3rem;

      .desp {
        color: #ffaa01;
        margin: 1rem 0rem;
        font-size: 1.5rem;
        margin-top: 1rem;
      }

      .head-title {
        color: #fff;
        margin: 1rem 0rem;
        font-size: 1.3rem;

        span {
          color: #3884fe;
        }
      }

      .content {
        color: #bbc0c3;
        padding-left: 2.2rem;
        line-height: 2rem;
        text-indent: -1.5rem;

        span {
          color: #3884fe;
        }
      }

      img {
        width: 100%;
      }

      p {
        text-align: left;
      }
    }
  }

  .unitv-tab {
    background: url('../../assets/images/unitv/bg.png') no-repeat;
    background-size: cover;
  }

  .brasiltv-tab {
    .tab {
      .content {
        padding-left: 0;
        text-indent: 0;
      }

      .note {
        .content {
          padding-left: 2.1rem;
          text-indent: -2.1rem;
        }
      }
    }
  }

</style>
