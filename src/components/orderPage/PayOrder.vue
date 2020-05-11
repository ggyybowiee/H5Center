<template>
  <div class="index-page scanpaycore-page">
    <p class="head-text">{{$t("支付订单")}}</p>
    <div class="index-tab">
      <div class="tab">
        <div v-if="orderInfo.state != 'invalid'" class="order-infomation">
          <div v-if="orderInfo.state == 'completed'">
            <img src="../../assets/images/order-completed.png" alt />
            <p class="status-description">{{$t("该笔订单已成功支付！")}}</p>
            <p class="status-amount">
              <span>R$</span>
              <span>{{orderInfo.paymentAmount}}</span>
            </p>
          </div>
          <div v-if="orderInfo.state == 'failed'">
            <img src="../../assets/images/order-failed.png" alt />
            <p class="status-description">{{$t("该笔订单支付失败！")}}</p>
            <p class="status-amount">
              <span>R$</span>
              <span>{{orderInfo.paymentAmount}}</span>
            </p>
          </div>
          <div v-if="orderInfo.state == 'processing'">
            <img src="../../assets/images/order-processing.png" alt />
            <p class="status-description">{{$t("该笔订单正在处理！")}}</p>
            <p class="status-amount">
              <span>R$</span>
              <span>{{orderInfo.paymentAmount}}</span>
            </p>
          </div>
          <div v-if="orderInfo.state == 'overtime'">
            <img src="../../assets/images/order-overtime.png" alt />
            <p class="status-description">{{$t("订单已过期！请联系业务员")}}</p>
            <p class="status-amount">
              <span>R$</span>
              <span>{{orderInfo.paymentAmount}}</span>
            </p>
          </div>

          <p v-if="orderInfo.state == 'pending'">
            <span>{{$t("订单金额")}}：</span>
            <span style="color: #f62b35;">R$ {{orderInfo.paymentAmount}}</span>
          </p>
          <p>
            <span>{{$t("订单支付方式")}}：</span>
            <span>{{payWayList[orderInfo.paymentType]}}</span>
          </p>
          <p style="display: grid; text-align: left;">
            <span>{{$t("订单号")}}：</span>
            <span>{{orderInfo.orderId}}</span>
          </p>
          <p>
            <span>{{$t("订单生成时间")}}：</span>
            <span>{{orderInfo.createTime}}</span>
          </p>
          <p v-if="orderInfo.state != 'pending' && orderInfo.state != 'overtime'">
            <span>{{$t("支付时间")}}：</span>
            <span>{{orderInfo.updateTime}}</span>
          </p>

          <el-button type="primary" @click="toPay()" v-if="orderInfo.state == 'pending'">{{$t("前往支付")}}</el-button>
        </div>

        <p class="invalid" v-if="orderInfo.state == 'invalid'">{{$t("订单无效，请联系业务员")}}</p>
      </div>
    </div>

    <!-- 巴西信用卡支付表单信息 -->
    <form id="pagsmile_pay" method="post" name="pagsmile_pay"
      action="https://testenv.pagsmile.com/pserver/gateway.json">
      <!-- Pagsmile Configuration -->
      <input type="hidden" name="merchant_no" v-model="pagsmileForm.merchant_no" />
      <input type="hidden" name="app_id" v-model="pagsmileForm.app_id" />
      <input type="hidden" name="method" v-model="pagsmileForm.method" />
      <input type="hidden" name="out_order_no" v-model="pagsmileForm.out_order_no" />
      <input type="hidden" name="cpf_no" v-model="pagsmileForm.cpf_no" />
      <input type="hidden" name="username" v-model="pagsmileForm.username" />
      <input type="hidden" name="out_uid" v-model="pagsmileForm.out_uid" />
      <input type="hidden" name="subject" v-model="pagsmileForm.subject" />
      <input type="hidden" name="content" v-model="pagsmileForm.content" />
      <input type="hidden" name="order_amount" v-model="pagsmileForm.order_amount" />
      <input type="hidden" name="currency" v-model="pagsmileForm.currency" />
      <input type="hidden" name="charset" v-model="pagsmileForm.charset" />
      <input type="hidden" name="timestamp" v-model="pagsmileForm.timestamp" />
      <input type="hidden" name="version" v-model="pagsmileForm.version" />
      <input type="hidden" name="email" v-model="pagsmileForm.email" />
      <input type="hidden" name="timeout_express" v-model="pagsmileForm.timeout_express" />
      <input type="hidden" name="passback_params" v-model="pagsmileForm.passback_params" />
      <input type="hidden" name="notify_url" v-model="pagsmileForm.notify_url" />
      <input type="hidden" name="return_url" v-model="pagsmileForm.return_url" />
      <input type="hidden" name="sign_type" v-model="pagsmileForm.sign_type" />
      <input type="hidden" name="sign" v-model="pagsmileForm.sign" />
    </form>
  </div>
</template>

<script>
  import api from "../../api/api";
  import util from "../../common";
  export default {
    data() {
      return {
        orderId: sessionStorage.getItem("orderId") ?
          sessionStorage.getItem("orderId") : "",
        transactionId: sessionStorage.getItem("trade_no") ?
          sessionStorage.getItem("trade_no") : "",
        orderInfo: {},
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
        payWayList: {
          "Payment by Card": this.$t("Payment by Card"),
          "Bank deposits": this.$t("Bank deposits"),
          Boleto: this.$t("Boleto")
        }
      };
    },
    mounted() {
      document.title = this.$t("支付订单");
      this.getOrderInfo();
    },
    watch: {},
    directives: {},
    filters: {},
    methods: {
      // 查询订单状态
      getOrderInfo() {
        this.$http
          .post(api.getOrderInfo(), {
            orderId: this.orderId,
            transactionId: this.transactionId
          })
          .then(res => {
            if (res.data.returnCode == "0") {
              this.orderInfo = res.data.data;

              if (_.get(this.orderInfo, "state") != "invalid") {
                let createTime =
                  _.get(res.data.data, "createTime").replace(" ", "T") + "Z";
                let updateTime =
                  _.get(res.data.data, "updateTime").replace(" ", "T") + "Z";
                if (this.$i18n.locale === "en") {
                  this.orderInfo.createTime = this.moment(createTime).format(
                    "MM-DD-YYYY HH:mm"
                  );
                  this.orderInfo.updateTime = this.moment(updateTime).format(
                    "MM-DD-YYYY HH:mm"
                  );
                } else if (this.$i18n.locale === "pt") {
                  this.orderInfo.createTime = this.moment(createTime).format(
                    "DD-MM-YYYY HH:mm"
                  );
                  this.orderInfo.updateTime = this.moment(updateTime).format(
                    "DD-MM-YYYY HH:mm"
                  );
                }
              }
            } else {
              this.message(this.$t("系统繁忙"));
            }
          })
          .catch(err => {
            this.message(this.$t("系统繁忙"));
            console.log(err);
          });
      },
      // 前往支付
      toPay() {
        let pagsmileFormObj = document.getElementById("pagsmile_pay");

        if (this.orderInfo.paymentMode != "sandbox") {
          pagsmileFormObj.action = "https://pserver.pagsmile.com/gateway.json";
        }

        if (this.orderInfo.payInfo) {
          this.pagsmileForm = _.assign(this.pagsmileForm, this.orderInfo.payInfo);

          setTimeout(() => {
            pagsmileFormObj.submit();
          }, 0);
        }
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
        color: #ccc;
        width: 3rem;
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
        position: relative;
        text-align: center;
        color: #949494;

        .order-infomation {
          padding: 1rem 1.5rem;

          div {
            text-align: center;
            padding: 2rem 0;
            color: #1a1a1a;

            img {
              width: 6rem;
              display: block;
              margin: 0 auto;
            }

            p {
              text-align: center;
              display: block;
              height: 2.5rem;
              line-height: 2.5rem;
            }

            .status-description {
              line-height: 3rem;
              margin-top: 0.5rem;
            }

            .status-amount {
              span:last-child {
                font-size: 2rem;
              }
            }
          }

          .failed {
            color: #d72940;
          }

          .processing {
            color: #2ac665;
          }

          .overtime {
            color: #d72940;
          }
        }

        .invalid {
          color: #1a1a1a;
          font-weight: 400;
          position: absolute;
          left: 1.5rem;
          width: calc(100% - 3rem);
          line-height: 2.4rem;
          height: 2.4rem;
          font-size: 1.4rem;
          top: calc(50% - 1.2rem - 4.75rem);
          text-align: center;
          display: block;
        }

        p {
          line-height: 2.4rem;
          word-break: break-all;
          display: flex;
          justify-content: space-between;
        }

        .tip {
          text-align: left;
          text-indent: 0;
        }

        .el-button {
          margin: 4rem 0rem 1rem 0rem;
          background: #2b88be;
          width: 100%;
          font-size: 1.5rem;
          padding: 1.2rem 3rem;
        }
      }
    }
  }

</style>
