<template>
  <div class="index-page scanpaycore-page">
    <p class="head-text">Fill in an order form</p>
    <div class="index-tab">
      <div class="tab">
        <el-form :model="orderRuleForm" :rules="rules" ref="orderRuleForm" class="orderRuleForm">
          <el-form-item prop="amount" label="The amount (R$)">
            <el-input v-model="orderRuleForm.amount" @blur="amountAddZero(orderRuleForm.amount)"></el-input>
          </el-form-item>

          <el-form-item label="Payment" prop="payWay" class="payWay">
            <div class="package-section">
              <div>
                <ul>
                  <li v-for="(item, index) in payWayList" :key="index" @click.prevent="choosePayWay(index)"
                    :class="{'selected': selectedIndex == index }">
                    <label>
                      <!-- 巴西信用卡 -->
                      <img v-if="item.payWay=='Payment by Card' && selectedIndex === 0"
                        src="../../assets/images/selected-credit-card.png" />
                      <img v-if="item.payWay == 'Payment by Card' && selectedIndex !== 0"
                        src="../../assets/images/credit-card.png" />

                      <!-- 现金转账 -->
                      <img v-if="item.payWay == 'Bank deposits' && selectedIndex !== 1"
                        src="../../assets/images/cash-transfers.png" />
                      <img v-if="item.payWay == 'Bank deposits' && selectedIndex === 1"
                        src="../../assets/images/selected-cash-transfers.png" />

                      <!-- Boleto -->
                      <img v-if="item.payWay == 'Boleto' && selectedIndex !== 2"
                        src="../../assets/images/boleto-icon.png" />
                      <img v-if="item.payWay == 'Boleto' && selectedIndex === 2"
                        src="../../assets/images/selected-boleto-icon.png" />

                      <span v-if="item.payWay == 'Payment by Card'">{{item.text}}</span>
                      <span v-if="item.payWay == 'Bank deposits'">{{item.text}}</span>
                      <span v-if="item.payWay == 'Boleto'">{{item.text}}</span>
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          </el-form-item>
          <p class="tip">{{tip}}</p>

          <el-form-item prop="remarks" label="Remarks">
            <el-input v-model="orderRuleForm.remarks" type="textarea"></el-input>
          </el-form-item>

          <el-form-item class="submit-button">
            <el-button type="primary" @click="submitForm('orderRuleForm')" v-loading="loading">Generate order link
            </el-button>
          </el-form-item>
        </el-form>
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
        orderRuleForm: {
          payWay: "Payment by Card",
          amount: "",
          remarks: ""
        },
        selectedIndex: 0,
        payWayList: [{
            payWay: "Payment by Card",
            tip: "Tip: this payment method is recommended.",
            text: "National credit card"
          },
          {
            payWay: "Bank deposits",
            tip: "Tip: This payment method needs to remind the customer to upload the correct payment voucher.",
            text: "Cash transfers"
          },
          {
            payWay: "Boleto",
            tip: "Tip: When using Boleto as payment method, it take up to 3 working days after the payment until we know that the payment was received.",
            text: "Boleto"
          }
        ],
        rules: {
          amount: [{
              required: true,
              trigger: "change"
            },
            {
              validator: (rule, value, callback) => {
                this.orderRuleForm.amount = util.NumberCheck(value);
                callback();
              },
              trigger: "change" //这里还有blur触发方法； 如果设为none，那么只有this.$refs[formName]['validate']时才会验证
            }
          ],
          remarks: {
            required: true,
            trigger: "blur"
          }
        },
        loading: false,
        tip: "Tip: this payment method is recommended"
      };
    },
    mounted() {
      document.title = "Fill in an order form";
    },
    watch: {},
    directives: {},
    filters: {},
    methods: {
      submitForm(formName) {
        let that = this;
        this.$refs[formName].validate(valid => {
          if (valid) {
            //调用后台，把数据传给后台
            let params = {
              paymentAmount: that.orderRuleForm.amount,
              paymentType: that.orderRuleForm.payWay,
              remarks: that.orderRuleForm.remarks,
              paymentCurrency: "BRL"
            };

            that.loading = true;

            that.$http
              .post(api.createDealerOrder(), params)
              .then(res => {
                that.loading = false;

                if (res.data.returnCode == "0" && res.data.data) {
                  let createTime =
                    _.get(res.data.data, "createTime").replace(" ", "T") + "Z";
                  res.data.data.createTime = that
                    .moment(createTime)
                    .format("MM-DD-YYYY HH:mm");
                  sessionStorage.setItem(
                    "orderDetailInfo",
                    JSON.stringify(res.data.data)
                  );
                  that.$router.push({
                    path: "/orderDetail"
                  });
                } else {
                  that.message(
                    "Order generation failed, please try again later!"
                  );
                }
              })
              .catch(err => {
                that.loading = false;
                that.message("Order generation failed, please try again later!");
                console.log(err);
              });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      choosePayWay(index) {
        this.selectedIndex = index;
        this.orderRuleForm.payWay = _.get(this.payWayList[index], "payWay");
        this.tip = _.get(this.payWayList[index], "tip");
      },
      // 自动补0
      amountAddZero(value) {
        let s = value.toString();
        let rs = s.indexOf(".");

        if (rs < 0) {
          rs = s.length;
          s += ".";
        }
        while (s.length <= rs + 2) {
          s += "0";
        }

        this.orderRuleForm.amount = s;
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
        padding: 1rem 1.5rem;
        text-align: center;

        .payWay {
          .el-radio-group {
            width: 100%;
            display: inline-flex;
          }

          .package-section {
            >div {
              padding-bottom: 1rem;
              margin-top: 2.5rem;
              width: 100%;
            }

            ul {
              width: 100%;
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;

              li {
                width: calc(100% / 2 - 1rem);
                text-align: center;
                border: 1px solid #e5e5e5;
                padding: 2rem 0rem 0.5rem;
                border-radius: 0.3rem;
                display: inline-block;
                position: relative;
                vertical-align: middle;
                margin: 0.75rem 0rem;

                label {
                  display: inline-block;
                  width: 100%;
                  text-align: center;

                  img {
                    display: block;
                    margin: 0 auto;
                    height: 3rem;
                  }

                  span {
                    display: inline-block;
                    color: #1a1a1a;
                    margin-top: 1rem;
                    font-size: 1.2rem;
                  }
                }
              }

              .selected {
                border: 1px solid #2b88be;
                background-color: #e3f2fa;

                span {
                  color: #2b88be;
                }
              }
            }
          }
        }

        .tip {
          text-align: left;
          color: #666666;
          margin-bottom: 1rem;
        }

        .submit-button {
          text-align: center;
          margin-top: 4rem;

          .el-form-item__content {
            .el-button {
              width: 100%;
              background: #2b88be;
              font-size: 1.5rem;
              padding: 1.2rem 3rem;
            }
          }
        }
      }
    }
  }

</style>
