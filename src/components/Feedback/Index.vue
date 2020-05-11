<template>
  <div class="index-page">
    <p class="head-title">
      <i class="shopIcon shop-jiantou-copy" @click="goBack()" v-if="showArrow"></i>
      {{$t('意见反馈')}}
    </p>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="ruleForm">
      <p class="email">
        <span>{{$t('客服邮箱')}}</span>
        <span>{{email}}</span>
      </p>
      <el-form-item :label="$t('反馈类型')" prop="issueType" class="issueType">
        <ul>
          <li v-for="(value, key) in feedbackTypeList" :key="key" :class="[{'active': selectedKey==key}]"
            @click="typeClick(key)">{{value}}</li>
        </ul>
      </el-form-item>

      <el-form-item :label="$t('请输入您的反馈内容')" prop="userSug" class="suggestion" v-if="selectedKey == 1">
        <el-input type="textarea" v-model="ruleForm.userSug" :autosize="{ minRows: 6 }" :placeholder="$t('建议提示')">
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('请输入您的反馈内容')" prop="userSug" class="suggestion" v-if="selectedKey == 4">
        <el-input type="textarea" v-model="ruleForm.userSug" :autosize="{ minRows: 6 }" :placeholder="$t('内容提示')">
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('请输入您的反馈内容')" prop="userSug" class="suggestion" v-if="selectedKey == 2">
        <el-input type="textarea" v-model="ruleForm.userSug" :autosize="{ minRows: 6 }" :placeholder="$t('问题提示')">
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('请输入您的反馈内容')" prop="userSug" class="suggestion" v-if="selectedKey == 5">
        <el-input type="textarea" v-model="ruleForm.userSug" :autosize="{ minRows: 6 }" :placeholder="$t('支付提示')">
        </el-input>
      </el-form-item>

      <div class="upload-wrap">
        <ul class="upload-ul clearfix">
          <li class="upload-pick">
            <div class="webuploader-container clearfix" id="uploadPic"></div>
          </li>
        </ul>
      </div>

      <el-form-item prop="email" class="contact-way">
        <label>
          {{$t('联系方式')}}
          <span>({{$t('选填')}})</span>
        </label>
        <el-input v-model="ruleForm.email" :placeholder="$t('请输入您的联系方式')"></el-input>
      </el-form-item>

      <el-form-item class="submit-button">
        <el-button type="primary" @click="submitForm('ruleForm')" v-loading="loading">{{$t('提交')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import api from "../../api/api";
  import util from "../../common";
  import '../../../static/utils/diyUpload.js';
  let params = {};
  let setTimer = null;
  export default {
    data() {
      return {
        lang: sessionStorage.getItem("lang") ?
          sessionStorage.getItem("lang") : "",
        appId: sessionStorage.getItem("appId") ?
          sessionStorage.getItem("appId") : "",
        email: sessionStorage.getItem("email") ?
          sessionStorage.getItem("email") : "",
        appVersion: sessionStorage.getItem("appVersion") ?
          sessionStorage.getItem("appVersion") : "",
        userId: sessionStorage.getItem("userId") ?
          sessionStorage.getItem("userId") : "",
        showArrow: false,
        loading: false,
        uploadPicNum: 0,
        fileNumLimit: 5,
        ruleForm: {
          issueType: "1",
          userSug: "",
          email: ""
        },
        selectedKey: "1",
        feedbackTypeList: {
          '1': this.$t('建议'),
          '5': this.$t('支付'),
          '4': this.$t('内容'),
          '2': this.$t('问题')
        },
        tagUpload: null,
        ftpSwitch: true,
        pictureUrlArr: [],
        rules: {
          userSug: [{
            required: true,
            message: this.$t("吐槽两句再提交吧"),
            trigger: "blur"
          }],
          email: [{
            type: "email",
            message: this.$t("邮箱格式不正确"),
            trigger: ["blur", "change"]
          }]
        }
      };
    },
    mounted() {
      document.title = this.$t("意见反馈");
      this.importDiyUploadPlugin();
    },
    beforeRouteEnter(to, from, next) {
      if (from.path == "/app-help" || from.path == "/next-index") {
        // 这里的vm指的就是vue实例，可以用来当做this使用
        next(vm => {
          vm.showArrow = true;
        });
      } else {
        next(vm => {
          vm.showArrow = false;
        });
      }
    },
    watch: {
      uploadPicNum: function (newValue, oldValue) {
        let ulWidth = $(".upload-ul").width();
        let oneRowCount = Math.floor(ulWidth / 93);

        if (newValue >= this.fileNumLimit) {
          $(".upload-pick").css("display", "none");
        } else {
          $(".upload-pick").css("display", "block");
        }
      },
      pictureUrlArr: function (newValue, oldValue) {
        if (
          this.pictureUrlArr.length > 0 &&
          this.pictureUrlArr.length >= this.uploadPicNum
        ) {
          params.pictureUrl = this.pictureUrlArr.join(",");
          this.$http
            .post(api.userFeedBack(), params)
            .then(res => {
              this.loading = false;
              sessionStorage.setItem("feedBackReturnCode", res.data.returnCode);
              this.$router.push({
                path: "/feedback-result"
              });
            })
            .catch(err => {
              this.loading = false;
              this.message(this.$t("提交失败，请检查您的网络"));
              console.log(err);
            });
        }
      }
    },
    directives: {},
    filters: {},
    methods: {
      submitForm(formName) {
        let that = this;
        this.$refs[formName].validate(valid => {
          if (valid) {

            //调用后台，把数据传给后台
            params = {
              type: that.ruleForm.issueType,
              userSug: that.ruleForm.userSug,
              userOperateSys: "web",
              email: that.ruleForm.email,
              pkg: that.appId,
              userId: that.userId,
              appVersion: that.appVersion,
              pictureUrl: ""
            };

            that.tagUpload.upload();
            if (!that.ftpSwitch) {
              that.message(that.$t("系统异常，请稍后重试！"));
              return;
            }

            that.loading = true;

            setTimeout(() => {
              if (that.uploadPicNum === 0) {
                that.$http
                  .post(api.userFeedBack(), params)
                  .then(res => {
                    that.loading = false;
                    sessionStorage.setItem(
                      "feedBackReturnCode",
                      res.data.returnCode
                    );
                    that.$router.push({
                      path: "/feedback-result"
                    });
                  })
                  .catch(err => {
                    that.loading = false;
                    that.message(that.$t("提交失败，请检查您的网络"));
                    console.log(err);
                  });
              }
            }, 500);
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },

      importDiyUploadPlugin() {
        let s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "./static/utils/diyUpload.js";
        document.body.appendChild(s);

        let that = this;

        setTimer = setTimeout(() => {
          that.tagUpload = $("#uploadPic").diyUpload({
              url: "/api/dc/fileUpload",
              success: function (len) {
                if (Number(len) >= 0) {
                  that.uploadPicNum = len;
                }
              },
              error: function (err) {
                that.message(that.$t(err));
                that.loading = false;
              },
              buttonText: "",
              accept: {
                title: "Images",
                extensions: "gif,jpg,jpeg,bmp,png"
              },
              thumb: {
                width: 83,
                height: 83,
                quality: 100,
                fileNumLimit: that.fileNumLimit,
                type: "image/jpeg"
              }
            },
            function (res) {
              if (res._raw) {
                let index = res._raw.indexOf("error.jpg");

                if (index > -1) {
                  that.loading = false;
                  that.ftpSwitch = false;
                  that.message(that.$t("系统异常，请稍后重试！"));
                  return;
                }

                that.pictureUrlArr.push(res._raw);
              }
            }
          );
        }, 1000);
      },

      typeClick(issueType) {
        let that = this;
        this.selectedKey = issueType;
        this.ruleForm.issueType = issueType;
        this.pictureUrlArr = [];
        this.tagUpload.destroy();
        $(".upload-ul .diyUploadHover").remove();
        this.tagUpload = $("#uploadPic").diyUpload({
            url: "/api/dc/fileUpload",
            success: function (len) {
              if (Number(len) >= 0) {
                that.uploadPicNum = len;
              }
            },
            error: function (err) {
              that.message(that.$t(err));
              that.loading = false;
            },
            buttonText: "",
            accept: {
              title: "Images",
              extensions: "gif,jpg,jpeg,bmp,png"
            },
            thumb: {
              width: 83,
              height: 83,
              quality: 100,
              fileNumLimit: that.fileNumLimit,
              type: "image/jpeg"
            }
          },
          function (res) {
            if (res._raw) {
              let index = res._raw.indexOf("error.jpg");

              if (index > -1) {
                that.loading = false;
                that.ftpSwitch = false;
                that.message(that.$t("系统异常，请稍后重试！"));
                return;
              }

              that.pictureUrlArr.push(res._raw);
            }
          }
        );
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
      },

      goBack() {
        clearTimeout(setTimer);
        this.$router.go(-1);
      }
    }
  };

</script>
<style lang="less" scoped>
  .index-page {
    padding: 0;
    font-size: 1.5rem;
    position: relative;
    height: 100vh;
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
        width: 3rem;
        font-size: 1.75rem;
      }
    }

    .ruleForm {
      overflow: auto;

      .email {
        color: #fff;
        height: 2.5rem;
        line-height: 2.5rem;
        text-align: center;
        height: 3.75rem;
        line-height: 3.75rem;
        margin-top: 1rem;
        border: 1px solid #2d2d39;
        background: #2d2d39;
        padding: 0 1rem;
        display: flex;
        justify-content: space-between;
      }

      .issueType {
        .el-form-item__label {
          float: none;
        }

        .el-form-item__content {
          margin-left: 50px;
        }

        ul {
          width: calc(100% - 2rem);
          margin: 0 auto;
          margin-bottom: 0;
          display: flex;
          flex-flow: row wrap;

          li {
            text-align: center;
            margin: 0.3rem 0;
            margin-right: 0.8rem;
            line-height: 2rem;
            width: max-content;
            position: relative;
            vertical-align: middle;
            padding: 0 1rem;
            background: #555;
            border-radius: 1rem;
          }

          .active {
            color: #333;
            background-color: rgb(255, 170, 0);
          }
        }
      }

      .submit-button {
        text-align: center;
        margin: 3rem 0rem 1rem 0rem;

        .el-form-item__content {
          .el-button {
            background: rgb(255, 170, 0);
            color: #333;
            width: calc(100% - 2rem);
            font-size: 1.6rem;
          }
        }
      }
    }
  }

</style>
