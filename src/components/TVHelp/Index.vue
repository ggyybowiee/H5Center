<template>
  <div class="index-page">
    <div class="index-tab">
      <div>
        <ul>
          <li v-for="(item,index) in navList" :key="index" :tabindex="-1" hidefocus="false"
            :class="[{'active': selectedIndex==index}, 'focus-item']" :id="'nav' + index"
            :nextUpFocusId="getUpDirectionId('nav', index, navList)"
            :nextDownFocusId="getDownDirectionId('nav', index, navList)" nextRightFocusId="detail"
            @click="tabClick(index)" @focus="tabClick(index)">{{$t(item.navName)}}</li>
        </ul>
      </div>
    </div>
    <div class="tab" :tabindex="-1" hidefocus="true" id="detail" :nextLeftFocusId="'nav' + selectedIndex"
      :nextRightFocusId="'open' + indexArr[0]">
      <ul>
        <li v-for="(item,index) in _.get(navList[selectedIndex], 'navContentList')" :key="index">
          <p class="text question">
            <span>Q:</span>
            <span>{{$t(item.question)}}</span>
          </p>
          <p class="text answer" :class="{'retract': item.status}" :style="{'max-height':item.status ? textHeight: ''}"
            ref="textContainer">
            <span>A:</span>
            <span v-html="item.answer" class="ql-editor"></span>
          </p>
          <div class="btn">
            <p v-if="item.status" @click="updateStatus(item, false, 'open' + index)"
              @keyup.enter="updateStatus(item, false, 'open' + index)" :tabindex="index" hidefocus="true"
              :id="'open' + index" nextLeftFocusId="detail" nextRightFocusId="detail"
              :nextUpFocusId="getUpDirectionId('open', index, _.get(navList[selectedIndex], 'navContentList'))"
              :nextDownFocusId="getDownDirectionId('open', index, _.get(navList[selectedIndex], 'navContentList'))">
              {{$t('更多')}}
            </p>
            <p v-if="item.status == false" @click="updateStatus(item, true, 'open' + index)"
              @keyup.enter="updateStatus(item, true, 'open' + index)" :tabindex="index" :id="'open' + index"
              :nextUpFocusId="getUpDirectionId('open', index, _.get(navList[selectedIndex], 'navContentList'))"
              :nextDownFocusId="getDownDirectionId('open', index, _.get(navList[selectedIndex], 'navContentList'))"
              hidefocus="true" nextLeftFocusId="detail" nextRightFocusId="detail">{{$t('收起')}}</p>
          </div>
        </li>
      </ul>
    </div>

    <div class="text more" ref="more" style="position: absolute;">占位</div>
  </div>
</template>

<script>
  import api from "../../api/api";
  import util from "../../common";
  let scrollTop = 0;
  export default {
    data() {
      return {
        lang: sessionStorage.getItem("lang") ?
          sessionStorage.getItem("lang") : "",
        appId: sessionStorage.getItem("appId") ?
          sessionStorage.getItem("appId") : "",
        list: [],
        indexArr: [],
        textHeight: null,
        selectedIndex: 1,
        navList: []
      };
    },
    mounted() {
      document.title = this.$t("帮助反馈");

      if (!this.appId) {
        if (sessionStorage.getItem("tvType") == 2) {
          this.navList = [{
              navName: "会员相关",
              navContentList: [{
                  question: "UniTV会员可以在哪些设备上使用？",
                  answer: `
                <p>
                  ${this.$t(
                  "您好，Uni TV会员支持在安卓4.X以上的TV BOX设备上使用。"
                  )}
                </p>
                `
                },
                {
                  question: "为什么已购买Uni TV会员，登录显示会员已过期？",
                  answer: `
                <p>
                  ${this.$t("您好，购买Uni TV会员后，需耐心等待5min后生效。")}
                </p>
                <p>
                  ${this.$t("如有疑问，请联系我们！")}
                </p>
                <p>
                  ${this.$t("邮箱：unitv4k@gmail.com")}
                </p>
                `
                },
                {
                  question: "为什么已购买Uni TV会员，无法观看视频内容？",
                  answer: `
                <p>
                  ${this.$t("您好，购买Uni TV会员后，需耐心等待5min后生效。")}
                </p>
                <p>
                  ${this.$t("如有疑问，请联系我们！")}
                </p>
                <p>
                  ${this.$t("邮箱：unitv4k@gmail.com")}
                </p>
                `
                }
              ]
            },
            {
              navName: "账号相关",
              navContentList: [{
                  question: "如何登录账号？",
                  answer: `
                  <p>
                    ${this.$t("方法：")}
                  </p>
                  <p>
                    ${this.$t(
                    "1.账号未登录时，请前往“个人中心”，点击立即登录按钮，显示账号登录 弹框页面；"
                    )}
                  </p>
                  <p>
                    ${this.$t(
                    "2.账号已登录时，请前往“个人中心”最下方，点击登录其他账号按钮，显示账号登录 弹框页面；"
                    )}
                  </p>
                  <p>
                    ${this.$t(
                    "3.在账号登录页面，输入账号(或者邮箱）、密码，点击登录按钮，即可完成账号登录。"
                    )}
                  </p>
                  `
                },
                {
                  question: "如何退出登录账号？",
                  answer: `
                <p>
                  ${this.$t("方法：")}
                </p>
                <p>
                  ${this.$t("1.请前往“个人中心”最下方；")}
                </p>
                <p>
                  ${this.$t("2.点击退出登录按钮，即可退出当前登录账号。")}
                </p>
                `
                },
                {
                  question: "忘记密码怎么办？",
                  answer: `
                  <p>
                    ${this.$t(
                    "您好，忘记密码后可通过邮箱获取重置密码链接进行密码重置。"
                    )}
                  </p>
                  <p>
                    ${this.$t("方法：")}
                  </p>
                  <p>
                    ${this.$t("1. 在账号登录界面，按[OK]键点击找回密码；")}
                  </p>
                  <p>
                    ${this.$t(
                    "2. 请前往“个人中心”-“账户安全”-“密码设置”，若已设置密码时，可点击找回按钮；若未设置密码时，只可设置无法找回；"
                    )}
                  </p>
                  <p>
                    ${this.$t(
                    "3. 请前往“个人中心”-“账户安全”-“限制级开关”，打开限制级时，可点击忘记密码。"
                    )}
                  </p>
                  `
                },
                {
                  question: "如何设置密码？有什么好处？",
                  answer: `
                <p>
                  ${this.$t("您好，可通过绑定邮箱设置账号密码。")}
                </p>
                <p>
                  ${this.$t("好处：")}
                </p>
                <p>
                  ${this.$t(
                  "设置密码后，可用账号(或邮箱)和密码在不同设备上进行登录。"
                  )}
                </p>
                `
                },
                {
                  question: "如何绑定邮箱？有什么好处？",
                  answer: `
                  <p>
                    ${this.$t("方法：")}
                  </p>
                  <p>
                    ${this.$t("1.请前往“个人中心”-“账户安全”-“邮箱绑定”；")}
                  </p>
                  <p>
                    ${this.$t("2.点击绑定按钮，显示绑定邮箱 弹框页面；")}
                  </p>
                  <p>
                    ${this.$t(
                    "3.输入邮箱号，点击确定按钮，可获取激活绑定链接的邮件；"
                    )}
                  </p>
                  <p>
                    ${this.$t("4.进入邮箱，打开激活链接，即可完成邮箱绑定。")}
                  </p>
                  <p>
                    ${this.$t("好处：")}
                  </p>
                  <p>
                    ${this.$t("1.可用邮箱号和密码在不同设备上登录Uni TV；")}
                  </p>
                  <p>
                    ${this.$t("2.可用于找回密码。")}
                  </p>
                  `
                },
                {
                  question: "如何更换已绑定的邮箱？何时生效？",
                  answer: `
                  <p>
                    ${this.$t("方法：")}
                  </p>
                  <p>
                    ${this.$t("1.请前往“个人中心”-“账户安全”-“邮箱绑定”；")}
                  </p>
                  <p>
                    ${this.$t("2.点击更换按钮，显示更换邮箱 弹框页面；")}
                  </p>
                  <p>
                    ${this.$t(
                    "3.输入登录密码和邮箱号，点击确定按钮，可获取激活绑定链接的邮件；"
                    )}
                  </p>
                  <p>
                    ${this.$t("4.进入邮箱，打开激活链接，即可完成邮箱绑定。")}
                  </p>
                  <p>
                    ${this.$t("提示：")}
                  </p>
                  <p>
                    ${this.$t("邮箱更换成功后，及时生效。")}
                  </p>
                  `
                },
                {
                  question: "如何打开限制级，观看成人内容？",
                  answer: `
                  <p>
                    ${this.$t(
                    "您好，限制级开关打开后，可分别进入直播和点播成人分类，进行观影体验。"
                    )}
                  </p>
                  <p>
                    ${this.$t("方法：")}
                  </p>
                  <p>
                    ${this.$t("1.请前往“个人中心”-“账户安全”-“限制级开关”；")}
                  </p>
                  <p>
                    ${this.$t("2.点击打开，显示打开限制级 弹框页面；")}
                  </p>
                  <p>
                    ${this.$t(
                    "3.输入登录密码，点击确定按钮，即可开启限制级开关。"
                    )}
                  </p>
                  `
                },
                {
                  question: "Uni TV账号支持多台设备同时使用吗？",
                  answer: `
                  <p>
                    ${this.$t("您好，不支持多台设备同时使用。")}
                  </p>
                  `
                }
              ]
            },
            {
              navName: "其他相关",
              navContentList: [{
                  question: "如何重置儿童锁密码？",
                  answer: `
                  <p>
                    ${this.$t("方法：")}
                  </p>
                  <p>
                    ${this.$t(
                    "1.请前往桌面“设置”-“其他设置”-“更多设置”-“设备/应用”或者“应用”；"
                    )}
                  </p>
                  <p>
                    ${this.$t(
                    "2.在应用列表中找到UniTV，点击[OK]键进入应用详情页；"
                    )}
                  </p>
                  <p>
                    ${this.$t(
                    "3.选择“清除缓存”，点击[OK]键清除数据成功，即可清除儿童锁密码。"
                    )}
                  </p>
                  <p>
                    ${this.$t("提示：")}
                  </p>
                  <p>
                    ${this.$t(
                    "清除缓存会自动清理该应用所有的缓存数据，包括图片、播放历史数据、儿童锁密码。"
                    )}
                  </p>
                  `
                },
                {
                  question: "如何清除TV端应用缓存？",
                  answer: `
                  <p>
                    ${this.$t("方法：")}
                  </p>
                  <p>
                    ${this.$t("1.请前往首页“设置”-“清除缓存”；")}
                  </p>
                  <p>
                    ${this.$t(
                    "2.在清除缓存页面，可分别清理图片缓存和历史播放记录，或者清除所有。"
                    )}
                  </p>
                  `
                }
              ]
            }
          ];
        } else if (sessionStorage.getItem("tvType") == 1) {
          this.navList = [{
              navName: "会员相关",
              navContentList: [{
                  question: "手机会员可以在TV端App上使用吗？",
                  answer: `
                    <p>
                      ${this.$t("您好，不可以！")}
                    </p>
                    <p>
                      ${this.$t("手机会员可在TV端登录，但无法进行播放体验。")}
                    </p>
                    `
                },
                {
                  question: "为什么手机会员登录TV端，无法观看视频内容？",
                  answer: `
                    <p>
                      ${this.$t(
                      "您好，手机会员登录TV端，只能浏览直播节目单、点播节目列表及详情页数据，但无法进行播放体验。"
                      )}
                    </p>
                    `
                }
              ]
            },
            {
              navName: "账号相关",
              navContentList: [{
                  question: "如何登录账号？",
                  answer: `
                    <p>
                      ${this.$t("方法：")}
                    </p>
                    <p>
                      ${this.$t("1.请前往“个人中心”最下方；")}
                    </p>
                    <p>
                      ${this.$t("2.点击其他登录账号按钮，显示账号登录 弹框页面；")}
                    </p>
                    <p>
                      ${this.$t(
                      "3.输入账号(或者邮箱）、密码，点击登录按钮，即可完成登录。"
                      )}
                    </p>
                    `
                },
                {
                  question: "如何退出登录账号？",
                  answer: `
                  <p>
                    ${this.$t("方法：")}
                  </p>
                  <p>
                    ${this.$t("1.请前往“个人中心”最下方；")}
                  </p>
                  <p>
                    ${this.$t("2.点击退出登录按钮，即可退出当前登录账号。")}
                  </p>
                  `
                },
                {
                  question: "忘记密码怎么办？",
                  answer: `
                    <p>
                      ${this.$t(
                      "您好，忘记密码后可通过邮箱获取重置密码链接进行密码重置。"
                      )}
                    </p>
                    <p>
                      ${this.$t("方法：")}
                    </p>
                    <p>
                      ${this.$t("1. 在账号登录界面，按[OK]键点击找回密码；")}
                    </p>
                    <p>
                      ${this.$t(
                      "2. 请前往“个人中心”-“账户安全”-“密码设置”，若已设置密码时，可点击找回按钮；若未设置密码时，只可设置无法找回；"
                      )}
                    </p>
                    <p>
                      ${this.$t(
                      "3. 请前往“个人中心”-“账户安全”-“限制级开关”，打开限制级时，可点击忘记密码。"
                      )}
                    </p>
                    `
                },
                {
                  question: "如何便捷登录手机端App？",
                  answer: `
                  <p>
                    ${this.$t("方法：")}
                  </p>
                  <p>
                    ${this.$t("1.请打开手机端的扫一扫功能；")}
                  </p>
                  <p>
                    ${this.$t(
                    "2.扫描TV端-个人中心界面的二维码，可快速登录手机端。"
                    )}
                  </p>
                  `
                },
                {
                  question: "如何设置密码？有什么好处？",
                  answer: `
                    <p>
                      ${this.$t("方法：")}
                    </p>
                    <p>
                      ${this.$t("1.请前往“个人中心”-“账户安全”-“密码设置”；")}
                    </p>
                    <p>
                      ${this.$t("2.点击设置按钮，显示设置登录密码 弹框页面；")}
                    </p>
                    <p>
                      ${this.$t(
                      "3.输入8-12位字母和数字组合密码，点击确定按钮，即可完成初始密码设置。"
                      )}
                    </p>
                    <p>
                      ${this.$t("好处：")}
                    </p>
                    <p>
                      ${this.$t(
                      "设置密码后，可用账号(或邮箱)和密码在不同设备上进行登录。"
                      )}
                    </p>
                    `
                },
                {
                  question: "如何绑定邮箱？有什么好处？",
                  answer: `
                    <p>
                      ${this.$t("方法：")}
                    </p>
                    <p>
                      ${this.$t("1.请前往“个人中心”-“账户安全”-“邮箱绑定”；")}
                    </p>
                    <p>
                      ${this.$t("2.点击绑定按钮，显示绑定邮箱 弹框页面；")}
                    </p>
                    <p>
                      ${this.$t(
                      "3.输入邮箱号，点击确定按钮，可获取激活绑定链接的邮件；"
                      )}
                    </p>
                    <p>
                      ${this.$t("4.进入邮箱，打开激活链接，即可完成邮箱绑定。")}
                    </p>
                    <p>
                      ${this.$t("好处：")}
                    </p>
                    <p>
                      ${this.$t("1.可用邮箱号和密码登录TV端和手机端；")}
                    </p>
                    <p>
                      ${this.$t("2.可用于找回密码。")}
                    </p>
                   `
                },
                {
                  question: "如何更换已绑定的邮箱？何时生效？",
                  answer: `
                  <p>
                    ${this.$t("方法：")}
                  </p>
                  <p>
                    ${this.$t("1.请前往“个人中心”-“账户安全”-“邮箱绑定”；")}
                  </p>
                  <p>
                    ${this.$t("2.点击更换按钮，显示更换邮箱 弹框页面；")}
                  </p>
                  <p>
                    ${this.$t(
                    "3.输入登录密码和邮箱号，点击确定按钮，可获取激活绑定链接的邮件；"
                    )}
                  </p>
                  <p>
                    ${this.$t("4.进入邮箱，打开激活链接，即可完成邮箱绑定。")}
                  </p>
                  <p>
                    ${this.$t("提示：")}
                  </p>
                  <p>
                    ${this.$t("邮箱更换成功后，及时生效。")}
                  </p>
                  `
                },
                {
                  question: "如何打开限制级，观看成人内容？",
                  answer: `
                    <p>
                      ${this.$t(
                      "您好，限制级开关打开后，可分别进入直播和点播成人分类，进行播放体验。"
                      )}
                    </p>
                    <p>
                      ${this.$t("方法：")}
                    </p>
                    <p>
                      ${this.$t("1.请前往“个人中心”-“账户安全”-“限制级开关”；")}
                    </p>
                    <p>
                      ${this.$t("2.点击打开，显示打开限制级 弹框页面；")}
                    </p>
                    <p>
                      ${this.$t(
                      "3.输入登录密码，点击确定按钮，即可开启限制级开关。"
                      )}
                    </p>
                    `
                },
                {
                  question: "同一账号可以在TV端App和手机端App同时使用？",
                  answer: `
                    <p>
                      ${this.$t("您好，可以！")}
                    </p>
                    `
                },
                {
                  question: "同一账号在TV端App和手机端App的使用限制？",
                  answer: `
                    <p>
                      ${this.$t(
                      "您好，同账号只允许同时登录一个TV端App和一个手机端App。"
                      )}
                    </p>
                    `
                }
              ]
            },
            {
              navName: "其他相关",
              navContentList: [{
                  question: "如何设置音量？",
                  answer: `
                        <p>
                          ${this.$t(
                          "请确保您可以将声音调到最大和最小。屏幕上方显示音量范围。"
                          )}
                        </p>
                        <p>
                          ${this.$t("方法：")}
                        </p>
                        <p>
                          ${this.$t(
                          "1.请前往桌面“设置”-“其他设置”-“更多设置”-“设备/声音”或者“声音”-“数字音频”；"
                          )}
                        </p>
                        <p>
                          ${this.$t(
                          "2.默认自动，可根据实际选择“PCM”、“HDMI”、“SPDIF”。"
                          )}
                        </p>
                        <p>
                          ${this.$t("（检查PCM或HDMI直通输出是否正常工作）")}
                        </p>
                        `
                },
                {
                  question: "如何重置儿童锁密码？",
                  answer: `
                    <p>
                      ${this.$t("方法：")}
                    </p>
                    <p>
                      ${this.$t(
                      "1.请前往桌面“设置”-“其他设置”-“更多设置”-“设备/应用”或者“应用”；"
                      )}
                    </p>
                    <p>
                      ${this.$t(
                      "2.在应用列表中找到Brasil TV，点击[OK]键进入应用详情页；"
                      )}
                    </p>
                    <p>
                      ${this.$t(
                      "3.选择“清除缓存”，点击[OK]键清除数据成功，即可清除儿童锁密码。"
                      )}
                    </p>
                    <p>
                      ${this.$t("提示：")}
                    </p>
                    <p>
                      ${this.$t(
                      "清除缓存会自动清理该应用所有的缓存数据，包括图片、播放历史数据、儿童锁密码。"
                      )}
                    </p>
                    `
                },
                {
                  question: "如何清除TV端应用缓存？",
                  answer: `
                      <p>
                        ${this.$t("方法：")}
                      </p>
                      <p>
                        ${this.$t("1.请前往首页“设置”-“清除缓存”；")}
                      </p>
                      <p>
                        ${this.$t(
                        "2.在清除缓存页面，可分别清理图片缓存和历史播放记录，或者清除所有。"
                        )}
                      </p>
                      `
                },
                {
                  question: "如何清理盒子缓存？",
                  answer: `
                    <p>
                      ${this.$t("方法：")}
                    </p>
                    <p>
                      ${this.$t(
                      "1.请前往桌面“更多”，选择APK Clean，按[OK]键除缓存。"
                      )}
                    </p>
                    `
                },
                {
                  question: "如何使用VPN？",
                  answer: `
                    <p>
                      ${this.$t("方法：")}
                    </p>
                    <p>
                      ${this.$t(
                      "1.请前往桌面“AppStore”-“Tool”分类，下载并安装Super VPN；"
                      )}
                    </p>
                    <p>
                      ${this.$t("2.返回桌面，打开Super VPN，点击Connect。")}
                    </p>
                    <p>
                      ${this.$t("（通过遥控器的鼠标操作可进行其他操作）")}
                    </p>
                    `
                }
              ]
            },
            {
              navName: "支付问题",
              navContentList: [{
                  question: "手机会员可以在TV端App上使用吗？",
                  answer: `
                    <p>
                      ${this.$t("您好，不可以！")}
                    </p>
                    <p>
                      ${this.$t("手机会员可在TV端登录，但无法进行播放体验。")}
                    </p>
                    `
                },
                {
                  question: "为什么手机会员登录TV端，无法观看视频内容？",
                  answer: `
                  <p>
                    ${this.$t(
                    "您好，手机会员登录TV端，只能浏览直播节目单、点播节目列表及详情页数据，但无法进行播放体验。"
                    )}
                  </p>
                  `
                }
              ]
            },
          ]
        }
        this.list = document.querySelectorAll("focus-item");
        document.getElementById("nav0").focus();
        this.initHeight();
      } else {
        this.getHelpDoc();
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

              _self.$nextTick(() => {
                _self.list = document.querySelectorAll("focus-item");
                document.getElementById("nav0").focus();
                _self.initHeight();
              });
            } else {
              _self.message(this.$t("系统异常，请稍后重试！"));
            }
          })
          .catch(() => {});
      },
      updateStatus(item, flag, id) {
        if (flag == true) {
          scrollTop = document.getElementById("detail").scrollTop;
        }

        item.status = flag;

        // DOM 加载完执行
        this.$nextTick(() => {
          document.getElementById(id).focus();

          if (flag == true) {
            document.getElementById("detail").scrollTop = scrollTop;
          }
        });
      },
      initHeight() {
        this.navList[this.selectedIndex].navContentList.forEach((ele, index) => {
          this.$set(
            this.navList[this.selectedIndex].navContentList,
            index,
            Object.assign({}, ele, {
              status: null
            })
          );
        });
        // DOM 加载完执行
        this.$nextTick(() => {
          this.calculateText();
        });

        window.onresize = () => {
          this.navList[this.selectedIndex].navContentList.forEach(
            (ele, index) => {
              this.$set(
                this.navList[this.selectedIndex].navContentList,
                index,
                Object.assign({}, ele, {
                  status: null
                })
              );
            }
          );
          setTimeout(() => {
            this.calculateText();
          }, 0);
        };
      },
      // 计算文字 显示展开 收起
      calculateText() {
        this.indexArr = [];
        // 获取一行文字的height 计算当前文字比较列表文字
        let oneHeight = this.$refs.more.scrollHeight;
        let twoHeight = oneHeight * 2 || 40;
        this.textHeight = `${twoHeight}px`;
        let txtDom = this.$refs.textContainer;
        for (let i = 0; i < txtDom.length; i++) {
          let curHeight = txtDom[i].offsetHeight;
          if (curHeight > twoHeight) {
            this.$set(
              this.navList[this.selectedIndex].navContentList,
              i,
              Object.assign({},
                this.navList[this.selectedIndex].navContentList[i], {
                  status: true
                }
              )
            );
          } else {
            this.$set(
              this.navList[this.selectedIndex].navContentList,
              i,
              Object.assign({},
                this.navList[this.selectedIndex].navContentList[i], {
                  status: null
                }
              )
            );
          }
        }

        _.forEach(
          this.navList[this.selectedIndex].navContentList,
          (item, index) => {
            if (item.status) {
              this.indexArr.push(index);
            }
          }
        );

        if (this.indexArr.length == 0) {
          this.indexArr[0] = "";
        }
      },
      tabClick(index) {
        this.selectedIndex = index;
        this.initHeight();
      },
      goBack() {
        this.$router.go(-1);
      },
      getUpDirectionId: function (id, index, list) {
        let findIndex = _.findIndex(this.indexArr, item => {
          return item === index;
        });

        if (id == "nav") {
          if (document.getElementById("detail")) {
            document.getElementById("detail").scrollTop = 0;
          }

          if (index == 0 || index == 1) {
            return id + "0";
          } else {
            return id + (index - 1);
          }
        } else {
          if (index == 0 || index == 1) {
            return id + "0";
          } else {
            return id + this.indexArr[findIndex - 1];
          }
        }
      },
      getDownDirectionId: function (id, index, list) {
        let findIndex = _.findIndex(this.indexArr, item => {
          return item === index;
        });

        if (id == "nav") {
          if (document.getElementById("detail")) {
            document.getElementById("detail").scrollTop = 0;
          }

          if (index == list.length - 1) {
            return id + "0";
          } else {
            return id + (index + 1);
          }
        } else {
          return id + this.indexArr[findIndex + 1];
        }
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
    background: #1f1f1f;
    color: #fff;
    display: flex;
    flex-direction: row;

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
      background: #3a3a3a;
    }

    .index-tab {
      overflow-y: auto;
      flex-basis: 15rem;
      border-right: 1px solid rgba(102, 102, 102, 0.4);
      max-height: 100vh;
      overflow-y: auto;

      >div {
        display: -webkit-box;
        white-space: nowrap;
        backface-visibility: hidden;
        perspective: 1000;
        -webkit-backface-visibility: hidden;
        -webkit-perspective: 1000;
        -webkit-overflow-scrolling: touch;
        text-align: justify;
        overflow-x: initial;
      }

      ul {
        margin: 0;
        padding: 0;
        width: 100%;

        li {
          width: calc(100% - 2rem);
          text-align: center;
          position: relative;
          vertical-align: middle;
          word-break: break-word;
          white-space: initial;
          font-size: 1.5rem;
          padding: 1rem;
          cursor: pointer;
          color: #a8a8a8;
        }

        .active {
          color: #333;
          background: #ffaa01;
        }
      }
    }

    .tab {
      flex: 1;
      border-radius: 0.5rem;
      max-height: 100vh;
      overflow-y: auto;

      li {
        padding: 1rem;
        margin: 0 2rem;
        border-bottom: 1px dashed #9a9a9a;
        font-size: 1.4rem;
        position: relative;

        .text {
          display: flex;
          color: #e4eaf2;

          span:first-child {
            flex-basis: 40px;
            letter-spacing: 6px;
          }

          span:last-child {
            flex: 1;
            padding-right: 6.25rem;
          }
        }

        .question {
          color: #ffaa00;
          margin-bottom: 0.5rem;
        }
      }

      li:last-child {
        border: none;
      }
    }
  }

  .text {
    position: relative;
    letter-spacing: 2px;
  }

  .retract {
    position: relative;
    overflow: hidden;
  }

  .btn {
    position: absolute;
    right: 0;
    bottom: 1rem;
    letter-spacing: 2px;
    cursor: pointer;
  }

  .btn p {
    color: #1f1f1f;
    border-radius: 3px;
    padding: 5px 10px;
    background-color: #777980;
    width: 5.625rem;
    text-align: center;
  }

  .more {
    font-size: 1.4rem;
    letter-spacing: 2px;
    color: #666666;
    visibility: hidden;
  }

</style>
