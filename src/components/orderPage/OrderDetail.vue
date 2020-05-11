<template>
  <div class="index-page scanpaycore-page">
    <p class="head-text">
      <i class="shopIcon shop-jiantou-copy" @click="goBack()"></i>
      Order information
    </p>
    <div class="index-tab">
      <div class="tab">
        <div class="order-infomation">
          <h6 class="tab-title">Order information</h6>
          <p>
            <span>Order amount：</span>
            <span style="color: #f62b35;">R$ {{orderDetailInfo.paymentAmount}}</span>
          </p>
          <p>
            <span>Payment method：</span>
            <span>{{payWayList[orderDetailInfo.paymentType]}}</span>
          </p>
          <p style="display: grid; text-align: left;">
            <span>Order number：</span>
            <span>{{orderDetailInfo.orderId}}</span>
          </p>
          <p>
            <span>Order generation time：</span>
            <span>{{orderDetailInfo.createTime}}</span>
          </p>
        </div>

        <hr class="hr">

        <div class="order-link">
          <h6 class="tab-title">The order link</h6>
          <p id="text">{{orderDetailInfo.paymentUrl}}</p>

          <el-button type="primary" @click="copyOrderId()">Copy</el-button>
          <p class="tip">Tip: please take a screenshot and keep the page.</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import api from "../../api/api";
  import util from "../../common";
  export default {
    data() {
      return {
        orderDetailInfo: sessionStorage.getItem("orderDetailInfo") ?
          JSON.parse(sessionStorage.getItem("orderDetailInfo")) : "",
        payWayList: {
          "Payment by Card": "National credit card",
          "Bank deposits": "Cash transfers",
          "Boleto": "Boleto"
        },
      };
    },
    mounted() {
      document.title = "Order information";
    },
    watch: {},
    directives: {},
    filters: {},
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      // 复制
      copyOrderId() {
        if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
          //区分iPhone设备
          window.getSelection().removeAllRanges(); //这段代码必须放在前面否则无效
          var Url2 = document.getElementById("text"); //要复制文字的节点
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
          var text = document.getElementById("text").innerText;
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
        this.message("The link has been copied successfully, please go paste!");
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
    background: #f5f5f5;
    color: #1a1a1a;

    .head-text {
      text-align: center;
      background: #fff;
      color: #1a1a1a;
      height: 2.75rem;
      line-height: 2.75rem;
      padding: 0.5rem;
      font-size: 1.75rem;

      i {
        position: absolute;
        left: 0rem;
        color: #1a1a1a;
        width: 3rem;
        font-size: 1.75rem;
        height: 3.75rem;
        top: 0;
        line-height: 3.75rem;
        bottom: 0;
      }
    }

    .sub-title {
      font-size: 1.3rem;
      color: #fff;
      padding: 0rem 1rem;
      text-align: left;
    }

    .index-tab {
      margin-top: 1rem;
      background: #fff;
      height: calc(100vh - 4.75rem);
      display: flex;
      flex-direction: column;

      .tab {
        flex: 1;
        border-radius: 0.5rem;
        text-align: center;
        position: relative;
        color: #949494;

        .order-infomation {
          padding: 1rem 1.5rem;
        }

        .hr {
          height: 0.5rem;
          background: #f5f5f5;
          border: none;
          margin: 0;
        }

        .order-link {
          padding: 1rem 1.5rem;
        }

        .tab-title {
          text-align: left;
          height: 2.4rem;
          font-size: 1.5rem;
          text-indent: 0;
          font-weight: 400;
          color: #1a1a1a;
        }

        p {
          line-height: 2.4rem;
          word-break: break-all;
          display: flex;
          justify-content: space-between;
        }

        #text {
          background: #2ac665;
          background: #e3f2fa;
          border-radius: 4px;
          line-height: 1.8rem;
          padding: 1.2rem;
          color: #1a1a1a;
          margin-top: 0.5rem;
        }

        .el-button {
          margin: 3rem 0rem .8rem 0rem;
          background: #2b88be;
          width: 100%;
          font-size: 1.5rem;
          padding: 1.2rem 3rem;
        }

        .tip {
          text-align: left;
          color: #666;
          font-size: 1.25rem;
          word-break: break-all;
        }
      }
    }
  }

</style>
