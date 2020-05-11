const AppHelp = () => import('@/components/AppHelp/Index')
const AppHelpDetail = () => import('@/components/AppHelp/Detail')
const TVHelp = () => import('@/components/TVHelp/Index')
const Feedback = () => import('@/components/Feedback/Index')
const AppVip = () => import('@/components/AppVip/Index')
const Download = () => import('@/components/Download/Index')
const FeedbackResult = () => import('@/components/FeedbackResult/Index')
const RewardDetail = () => import('@/components/RewardDetail/Index')
const CodeInput = () => import('@/components/RewardDetail/CodeInput')
const TvRewardDetail = () => import('@/components/RewardDetail/TvIndex')
const RulesDetail = () => import('@/components/RulesDetail/Index')
const TvRulesDetail = () => import('@/components/RulesDetail/TvIndex')
const PrivacyPolicy = () => import('@/components/PrivacyPolicy/Index')
const TvPrivacyPolicy = () => import('@/components/PrivacyPolicy/TvIndex')
const ActivityCenter = () => import('@/components/ActivityCenter/Index')
const BrasilTvActivity = () => import('@/components/TvActivity/BrasilTvActivity') // 该页面取消设配英语，只需要设配葡语
const FriendRecommend = () => import('@/components/TvActivity/FriendRecommend') // 该页面取消设配英语，只需要设配葡语

// ScanPayCoreWeb 合并页面
const Index = () => import('@/components/ScanPayCore/Index.vue') // 套餐分级
const NextIndex = () => import('@/components/ScanPayCore/NextIndex.vue')
const Coupon = () => import('@/components/ScanPayCore/Coupon.vue')
const Guidance = () => import('@/components/ScanPayCore/Guidance.vue')
const Success = () => import('@/components/ScanPayCore/Success.vue')
const SuccessOld = () => import('@/components/ScanPayCore/SuccessOld.vue')
const Checking = () => import('@/components/ScanPayCore/Checking.vue')
const Service = () => import('@/components/ScanPayCore/Service.vue')
const Fail = () => import('@/components/ScanPayCore/Fail.vue')
const FailOld = () => import('@/components/ScanPayCore/FailOld.vue')
const FindPwd = () => import('@/components/ScanPayCore/FindPwd.vue')
const ResetPwdSuccess = () => import('@/components/ScanPayCore/ResetPwdSuccess.vue')
const BindEmail = () => import('@/components/ScanPayCore/BindEmail.vue')
const BindEmailSuccess = () => import('@/components/ScanPayCore/BindEmailSuccess.vue')
const ChangeBindEmail = () => import('@/components/ScanPayCore/ChangeBindEmail.vue')
const FillOrder = () => import('@/components/orderPage/FillOrder.vue') // 只适配英语
const OrderDetail = () => import('@/components/orderPage/OrderDetail.vue') // 只适配英语
const PayOrder = () => import('@/components/orderPage/PayOrder.vue') // 适配英语、葡语

// V3.1 FriendRecommend 好友推荐需求页面
const ShareLink = () => import('@/components/FriendRecommend/ShareLink.vue') // 只支持葡语
const FriendInvitation = () => import('@/components/FriendRecommend/FriendInvitation.vue')
const Rule = () => import('@/components/FriendRecommend/Rule.vue')
const InviteRecord = () => import('@/components/FriendRecommend/InviteRecord.vue')

export default new VueRouter({
  routes: [{
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/index',
      name: 'Index',
      component: Index
    },
    {
      path: '/next-index',
      name: 'NextIndex',
      component: NextIndex
    },
    {
      path: '/coupon',
      name: 'Coupon',
      component: Coupon
    },
    {
      path: '/guidance',
      name: 'Guidance',
      component: Guidance,
    },
    {
      path: '/share-link',
      name: 'ShareLink',
      component: ShareLink,
    },
    {
      path: '/friend-invitation',
      name: 'FriendInvitation',
      component: FriendInvitation,
    },
    {
      path: '/rule',
      name: 'Rule',
      component: Rule,
    },
    {
      path: '/invite-record',
      name: 'InviteRecord',
      component: InviteRecord,
    },
    {
      path: '/success',
      name: 'Success',
      component: Success
    },
    {
      path: '/success-old',
      name: 'SuccessOld',
      component: SuccessOld
    },
    {
      path: '/service',
      name: 'Service',
      component: Service
    },
    {
      path: '/checking',
      name: 'Checking',
      component: Checking
    },
    {
      path: '/fail',
      name: 'Fail',
      component: Fail
    },
    {
      path: '/fail-old',
      name: 'FailOld',
      component: FailOld
    },
    {
      path: '/findPwd',
      name: 'FindPwd',
      component: FindPwd
    },
    {
      path: '/resetPwdSuccess',
      name: 'ResetPwdSuccess',
      component: ResetPwdSuccess
    },
    {
      path: '/bindEmailSuccess',
      name: 'BindEmailSuccess',
      component: BindEmailSuccess
    },
    {
      path: '/bindEmail',
      name: 'BindEmail',
      component: BindEmail
    },
    {
      path: '/changeBindEmail',
      name: 'ChangeBindEmail',
      component: ChangeBindEmail
    },
    {
      path: '/fillOrder',
      name: 'FillOrder',
      component: FillOrder
    },
    {
      path: '/orderDetail',
      name: 'OrderDetail',
      component: OrderDetail
    },
    {
      path: '/payOrder',
      name: 'PayOrder',
      component: PayOrder
    }, {
      path: '/tv-help',
      name: 'TVHelp',
      component: TVHelp
    }, {
      path: '/app-help',
      name: 'AppHelp',
      component: AppHelp
    }, {
      path: '/app-help-detail',
      name: 'AppHelpDetail',
      component: AppHelpDetail
    }, {
      path: '/feedback',
      name: 'Feedback',
      component: Feedback
    }, {
      path: '/feedback-result',
      name: 'FeedbackResult',
      component: FeedbackResult
    }, {
      path: '/download',
      name: 'Download',
      component: Download
    }, {
      path: '/reward-detail',
      name: 'RewardDetail',
      component: RewardDetail
    }, {
      path: '/code-input',
      name: 'CodeInput',
      component: CodeInput
    }, {
      path: '/tv-reward-detail',
      name: 'TvRewardDetail',
      component: TvRewardDetail
    }, {
      path: '/rules-detail',
      name: 'RulesDetail',
      component: RulesDetail
    }, {
      path: '/tv-rules-detail',
      name: 'TvRulesDetail',
      component: TvRulesDetail
    }, {
      path: '/privacy-policy',
      name: 'PrivacyPolicy',
      component: PrivacyPolicy
    }, {
      path: '/tv-privacy-policy',
      name: 'TvPrivacyPolicy',
      component: TvPrivacyPolicy
    }, {
      path: '/brasiltv-activity',
      name: 'BrasilTvActivity',
      component: BrasilTvActivity
    }, {
      path: '/friend-recommend',
      name: 'FriendRecommend',
      component: FriendRecommend
    }, {
      path: '/activity-center',
      name: 'ActivityCenter',
      component: ActivityCenter
    }, {
      path: '/app-vip',
      name: 'AppVip',
      component: AppVip
    }
  ]
})
