<template>
  <div v-loading="loading" class="password-page padding-lr3 scanpaycore-page">
    <p>
      <span class="title">{{$t('重置密码')}}</span>
    </p>
    <div class="form-area">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <div>
          <!-- 新密码 -->
          <el-form-item class="form-input" prop="password">
            <el-input type="password" v-model="ruleForm.password" :placeholder="$t('密码规则')"></el-input>
            <i class="shopIcon shop-suoding"></i>
          </el-form-item>

          <!-- 确认新密码 -->
          <el-form-item class="form-input" prop="checkpassword">
            <el-input type="password" v-model="ruleForm.checkpassword" :placeholder="$t('再次输入')"></el-input>
            <i class="shopIcon shop-mimaqueren"></i>
          </el-form-item>
          <!-- 验证码 -->
          <el-form-item class="code-area" prop="identifyCode">
            <el-input @focus="codeErrorShow = false" v-model="ruleForm.identifyCode"></el-input>
            <span class="code-content">{{randomCode}}</span>
            <el-button type="text" icon="el-icon-refresh" class="code-refresh" @click="getCode(4)"></el-button>
          </el-form-item>
        </div>
        <!-- 下一步按钮 -->
        <el-form-item class="chekout-button">
          <el-button class="button" @click="submitForm('ruleForm')">{{$t('确认')}}</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
  import api from '../../api/api'
  export default {
    data() {
      let validatePass = (rule, value, callback) => {
        let reg = /^[0-9a-zA-Z]*$/;
        if (value.length < 8 || value.length > 12 || !reg.test(value)) {
          callback(new Error(this.$t('密码规则')));
        }
        if (value === '') {
          callback(new Error(this.$t('请输入密码')));
        } else {
          if (this.ruleForm.checkpassword !== '') {
            this.$refs.ruleForm.validateField('checkpassword');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        let reg = /^[0-9a-zA-Z]*$/;
        if (value.length < 8 || value.length > 12 || !reg.test(value)) {
          callback(new Error(this.$t('密码规则')));
        }
        if (value === '') {
          callback(new Error(this.$t('请输入密码')));
        } else if (value !== this.ruleForm.password) {
          callback(new Error(this.$t('两次密码不一致')));
        } else {
          callback();
        }
      };
      let validateCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('请输入验证码')));
        } else if (value !== this.randomCode) {
          callback(new Error(this.$t('验证码不正确')));
        } else {
          callback();
        }
      };
      return {
        codeErrorShow: false,
        timeTip: '',
        imgcode: '',
        randomCode: '',
        ruleForm: {
          password: '',
          checkpassword: '',
          identifyCode: ''
          // identifyCode: sessionStorage.getItem('identifyCode')?sessionStorage.getItem('identifyCode'):''
        },
        rules: {
          password: [{
            validator: validatePass,
            trigger: 'blur'
          }],
          checkpassword: [{
            validator: validatePass2,
            trigger: 'blur'
          }],
          identifyCode: [{
            validator: validateCode,
            trigger: 'blur'
          }]
        },
      }
    },
    created() {
      this.getCode(4);
    },
    mounted() {
      let that = this;
    },
    watch: {

    },
    methods: {
      // 提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //调用后台，把数据传给后台
            let params = {
              token: sessionStorage.getItem('access') ? sessionStorage.getItem('access') : '',
              password: this.$md5(this.ruleForm.password + 'cloudstream'),
            }
            this.$http.post(api.resetPwd(), params).then(res => {
              if (res.data.returnCode == '0') { //成功，跳转到成功页面
                this.$router.push({
                  path: '/resetPwdSuccess'
                });
              } else {
                this.message(this.$t("系统繁忙"));
              }
            }).catch(() => {
              this.message(this.$t("网络异常"));
            });
          } else {
            return false;
          }
        });
      },

      // 消息提示
      message(parame) {
        this.$message.closeAll();

        this.$message({
          duration: 4000,
          showClose: true,
          message: `${parame}`,
          type: '',
          iconClass: '',
        });
      },

      // 获得验证码
      getCode(num) {
        //随机生成数字
        let result = ''
        for (let i = 0; i < num; i++) {
          result += Math.floor(Math.random() * 10)
        }
        this.randomCode = result
      },


    },
  }

</script>
<style lang="less">
  .password-page {
    .el-form-item__error {
      padding-top: 0;
    }

    .pad-lr-zero5 {
      padding: 0 0.5rem;
    }

    >p {
      padding: 1.6rem 0;
      font-size: 1.3rem;
      font-weight: bold;
      text-align: center;
    }

    .form-area {
      .demo-ruleForm {
        .el-form-item {
          margin-bottom: 2rem;
        }

        .el-input {
          font-size: 1.2rem;
        }

        .form-input {
          .el-form-item__content {
            position: relative;
          }

          .el-input__inner {
            padding: 0 9%;
          }

          i {
            top: 50%;
            left: 2%;
            font-size: 1.6rem;
            position: absolute;
            color: #999999;
            transform: translate(0, -50%)
          }

          .shop-mimaqueren {
            font-size: 1.8rem;
          }
        }

        .code-area {
          position: relative;

          .code-error {
            color: #f56c6c;
            font-size: 1rem;
            display: inline-block;
            position: absolute;
            top: -1.8rem;
            line-height: 23px;
          }

          .el-input {
            width: 38%;
          }

          .code-content {
            height: 2.8rem;
            width: 5rem;
            vertical-align: middle;
            display: inline-block;
            border: 1px solid #e5e5e5;
            text-align: center;
            line-height: 2.8rem;
            margin: 0.8rem 2% 0.8rem 4%;
          }

          .code-refresh {
            font-size: 2.4rem;
            vertical-align: middle;
            color: #E3E4E6;
            padding: 0;
            background-color: unset;
          }
        }

        .chekout-button {
          position: relative;
          margin-top: 14%;

          .el-form-item__content {
            font-size: 1.4rem;
          }
        }
      }
    }
  }

</style>
