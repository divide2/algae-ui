export default {
  route: {
    dashboard: '主页',
    profile: '个人中心',
    product: '产品',
    formulaGroup: '公式组',
    formula: '公式',
    masters: '公式Master',
    validate: '验证',
    validates: '验证',
    basic: '基础',
    productAdd: '产品新增'
  },
  navbar: {
    dashboard: '首页',
    github: '项目地址',
    logOut: '退出登录',
    profile: '个人中心',
    theme: '换肤',
    size: '布局大小'
  },
  product: {
    productCode: '产品编号',
    productName: '产品名称',
    tabName: '标签名称'
  },
  formulaGroup: {
    formulaGroupName: '组名',
    formulaGroupDisplayName: 'Json中显示名称',
    formulaGroupCategory: '种类',
    formulaGroupCalcType: '计算类型',
    formulaGroupDesc: '描述',
    iterationTerminalMaster: '结束迭代Master'
  },
  formula: {
    formulaName: '公式名',
    masterName: '公式Master名',
    formula: '公式内容',
    masterDesc: '公式描述',
    reference: '关联公式',
    formulaInitValue: '初始值',
    formulaValueType: '值类型',
    formulaVersion: '版本',
    formulaDesc: '公式描述'
  },
  rateDefinition: {
    dbColumnName: '列名',
    dbTableName: '表名',
    factors: '因子',
    rateName: '费率名',
    searchRateSqlTemplate: '模板'
  },
  validate: {
    field: '字段',
    version: '版本',
    valid: '验证规则',
    component: '验证位置'
  },
  dashboard: {
    productCount: '产品总数',
    formulaCount: '公式总数',
    masterCount: '公式Master总数',
    formulaGroupCount: '组总数',
    instanceExecCount: '测试执行总数',
    cmdRunPerCount: '每日指令运行数量',
    casePerCount: '每日用例运行数量',
    instancePerCount: '每日测试数量',
    instanceExecPerCount: '每日测试执行数量'
  },
  login: {
    title: '系统登录',
    logIn: '登录',
    username: '账号/邮箱',
    password: '密码',
    any: '随便填',
    thirdparty: '第三方登录',
    thirdpartyTips: '本地不能模拟，请结合自己业务进行模拟！！！'
  },
  documentation: {
    documentation: '文档',
    github: 'Github 地址'
  },
  permission: {
    addRole: '新增角色',
    editPermission: '编辑权限',
    roles: '你的权限',
    switchRoles: '切换权限',
    tips: '在某些情况下，不适合使用 v-permission。例如：Element-UI 的 el-tab 或 el-table-column 以及其它动态渲染 dom 的场景。你只能通过手动设置 v-if 来实现。',
    delete: '删除',
    confirm: '确定',
    cancel: '取消'
  },
  guide: {
    description: '引导页对于一些第一次进入项目的人很有用，你可以简单介绍下项目的功能。本 Demo 是基于',
    button: '打开引导'
  },
  table: {
    id: '序号',
    action: '操作'
  },
  button: {
    remove: '删除',
    relevance: '关联',
    create: '新增',
    edit: '编辑',
    search: '查询',
    reset: '重置',
    close: '关闭',
    open: '开启',
    submit: '提交',
    run: '运行',
    addRow: '增加一行',
    add: '增加',
    cancel: '取消',
    confirm: '确认',
    detail: '详情',
    analyze: '分析',
    report: '报告',
    upload: '上传',
    download: '下载',
    check: '检测环境',
    stop: '停止',
    copy: '复制',
    upgrade: '升级',
    update: '更新',
    retry: '重试',
    formulaGroup: '公式组',
    formula: '公式',
    toggle: '切换显示',
    rateDefinition: '费率定义',
    rule: '规则',
    addVersion: '添加版本',
    validate: '验证',
    relateValidate: '关联验证',
    viewRelatedProduct: '关联产品',
    viewRelatedFormula: '关联公式'
  },
  status: {
    basic: {
      deviceGroup: {
        unused: '未占用',
        used: '已占用'
      }
    }
  },
  runParam: {
    factors: 'Factor',
    runResult: '结果'
  },
  message: {
    required: '必填',
    success: '保存成功',
    confirmRemove: '确认删除么?',
    removeSuccess: '删除成功',
    alreadyExist: '已经存在',
    errorLogin: '用户名密码错误',
    runSuccess: '运行成功',
    basicInformation: '基本信息',
    commandInformation: '指令信息',
    caseInformation: '用例信息',
    masterInformation: 'Master 信息',
    branchInformation: 'Branch 信息',
    versionInformation: '版本信息',
    testExecutionHistory: '测试执行历史',
    testExecutionInformation: '测试执行信息',
    caseExecutionList: '用例执行列表',
    testResult: '测试结果',
    commandExecutionList: '指令执行列表',
    retrySuccess: '重试成功'
  },
  theme: {
    change: '换肤',
    documentation: '换肤文档',
    tips: 'Tips: 它区别于 navbar 上的 theme-pick, 是两种不同的换肤方法，各自有不同的应用场景，具体请参考文档。'
  },
  tagsView: {
    refresh: '刷新',
    close: '关闭',
    closeOthers: '关闭其它',
    closeAll: '关闭所有',
    step: '步骤{0}'
  },
  settings: {
    title: '系统布局配置',
    theme: '主题色',
    tagsView: '开启 Tags-View',
    fixedHeader: '固定 Header',
    sidebarLogo: '侧边栏 Logo'
  },
  indexMonitor: {
    indexManage: {
      indexName: '指标名称',
      createTime: '创建时间',
      ruleName: '统计规则名称',
      header: '报文头',
      matchRule: '匹配规则',
      condition: '条件',
      statisticalContent: '统计内容',
      exceptionNum: '异常数',
      countNum: '总数',
      exceptionRate: '异常率'
    },
    monitorExample: {
      appVersion: 'APP版本号',
      versionType: 'APP版本类型',
      monitorTime: '监控时间',
      monitorDuration: '监控时长',
      runStatus: '运行状态',
      selectVersion: '选择版本',
      selectDevice: '选择设备',
      setMonitor: '设置日常监控',
      versionMaster: '正式版本',
      versionBranch: '分支版本',
      selectCCU: '选择CCU',
      selectIndexMonitor: '选择监控指标',
      monitorStartTime: '监控开始时间',
      monitorEndTime: '监控结束时间',
      monitorAlert: '监控异常提醒',
      monitorFreq: '提醒频率',
      monitorEmail: '提醒邮箱',
      monitorFreqUnit: 'h/次',
      baseInfo: '基本信息',
      deviceNum: '设备数量',
      monitorResult: '日常监控结果',
      monitorResultTime: '监控时间范围',
      monitorResultTimeDes: '开始时间--处理完数据时间',
      ccuImei: 'CCU IMEI',
      responseTime: '报文时间',
      responseContent: '报文内容'
    }
  }

}
