export default {
  route: {
    dashboard: 'Dashboard',
    profile: 'Profile',
    instance: 'Test List',
    snapshot: 'Test Management',
    cases: 'Test Case Management',
    snapshotCaseCreate: 'Test Case Create ',
    snapshotCaseEdit: 'Test Case Edit',
    snapshotCaseDetail: 'Cases Detail',
    snapshotCompareList: 'Compare',
    snapshotCompareDetail: 'Compare Detail',
    snapshotInstanceExecDetail: 'Test Exec Detail',
    snapshotInstanceExecCaseDetail: 'Test Exec Detail',
    snapshotInstanceExecCmdDetail: 'Test Exec Case Detail',
    snapshotInstanceDetail: 'Test Detail',
    snapshotInstanceReport: 'Test Report',
    snapshotInstanceCreate: 'Test Create',
    snapshotInstanceEdit: 'Test Edit',
    basic: 'Basic Info Management',
    laboratory: 'Laboratory Management',
    laboratoryCreate: 'Laboratory Create',
    laboratoryEdit: 'Laboratory Edit',
    cmd: 'Command Management',
    cmdCreate: 'Command Create',
    cmdUpdate: 'Command Edit',
    device: 'Device Management',
    snapshotTestReport: 'Test Report',
    snapshotTestReportDetail: 'Test Report Detail',
    version: 'Version Management',
    versionCreate: 'Version Create',
    versionEdit: 'Version Edit',
    indexManage: 'Index management',
    indexMonitorCreate: 'Index Monitor Create',
    indexMonitorDetail: 'Index Monitor Detail',
    indexMonitorEdit: 'Index Monitor Edit',
    monitorManage: 'Monitor List',
    monitorCreate: 'Monitor Create',
    monitorEdit: 'Monitor Edit',
    monitorDetail: 'Monitor Detail',
    monitorResponseDetail: 'Monitor Failed Detail'
  },
  navbar: {
    dashboard: 'Dashboard',
    github: 'Github',
    logOut: 'Log Out',
    profile: 'Profile',
    theme: 'Theme',
    size: 'Global Size'
  },
  login: {
    title: 'Login Form',
    logIn: 'Login',
    username: 'Username',
    password: 'Password',
    any: 'Any',
    thirdparty: 'Or connect with',
    thirdpartyTips: 'Can not be simulated on local, so please combine you own business simulation! ! !'
  },
  dashboard: {
    visitCount: 'Total Visits',
    cmdRunCount: 'Total Command Run',
    caseCount: 'Total Test Case',
    instanceCount: 'Total Test',
    instanceExecCount: 'Total Test Execution',
    cmdRunPerCount: 'Everyday Command Execution Number',
    casePerCount: 'Everyday Test Case Execution Number',
    instancePerCount: 'Everyday Test Number',
    instanceExecPerCount: 'Everyday Test Execution Number'
  },
  documentation: {
    documentation: 'Documentation',
    github: 'Github Repository'
  },
  permission: {
    addRole: 'New Role',
    editPermission: 'Edit',
    roles: 'Your roles',
    switchRoles: 'Switch roles',
    tips: 'In some cases, using v-permission will have no effect. For example: Element-UI  el-tab or el-table-column and other scenes that dynamically render dom. You can only do this with v-if.',
    delete: 'Delete',
    confirm: 'Confirm',
    cancel: 'Cancel'
  },
  guide: {
    description: 'The guide page is useful for some people who entered the project for the first time. You can briefly introduce the features of the project. Demo is based on ',
    button: 'Show Guide'
  },
  table: {
    id: 'Id',
    action: 'Action'
  },
  button: {
    remove: 'Remove',
    create: 'Create',
    edit: 'Edit',
    search: 'Search',
    reset: 'Reset',
    close: 'Close',
    open: 'Open',
    submit: 'Submit',
    run: 'Run',
    addRow: 'Add Row',
    cancel: 'Cancel',
    confirm: 'Confirm',
    detail: 'Detail',
    analyze: 'Analyze',
    report: 'Report',
    upload: 'Upload',
    download: 'Download',
    check: 'Check',
    stop: 'Stop',
    copy: 'Copy',
    upgrade: 'Upgrade',
    update: 'Update',
    retry: 'Retry'
  },
  basic: {
    laboratory: {
      name: 'Name',
      ip: 'IP',
      location: 'Location',
      description: 'Description',
      createTime: 'Create Time',
      deviceName: 'Name',
      deviceType: 'Device Type',
      deviceAddress: 'IP Address',
      deviceDescription: 'Description'
    },
    acquisition: {
      name: 'Name',
      description: 'Description',
      createTime: 'Create Time',
      channel: 'Channel',
      value: 'Value',
      minValue: 'Min Value',
      maxValue: 'Max Value'
    },
    cmd: {
      name: 'Name',
      type: 'Type',
      cmd: 'Command',
      description: 'Description',
      createTime: 'Create Time',
      expectName: 'Name',
      waitTime: 'Wait Time',
      pattern: 'Pattern',
      header: 'Header',
      regularExpression: 'Regular Expression'
    },
    device: {
      serial: 'Serial',
      type: 'Type',
      address: 'Imei',
      createTime: 'Create Time'
    },
    version: {
      appVersion: 'App Master Version',
      vehicleType: 'Vehicle Type',
      apVersion: 'AP Version',
      bleVersion: 'BLE Version',
      libVersion: 'LIB Version',
      ecuVersion: 'ECU Version',
      ecuFactory: 'ECU Factory',
      bmsVersion: 'BMS Version',
      createTime: 'Create Time',
      branchAppVersion: 'App Branch Version'
    }
  },
  snapshot: {
    case: {
      vehicleTypes: 'Vehicle Types',
      duration: 'Duration',
      status: 'Status',
      count: 'Number of Commands',
      name: 'Name',
      description: 'Description',
      executionTime: 'Execution Time',
      cmdBase: 'Command',
      cmdType: 'Type',
      cmdAutoStop: 'Automatically Stop',
      acquisitionId: 'Acquisition',
      createTime: 'Create Time',
      debugMode: 'Debug Mode'
    },
    instance: {
      instanceId: 'Test Name',
      caseName: 'Case Name',
      caseResult: 'Case Result',
      status: 'Latest Execution Status',
      createTime: 'Create Time',
      description: 'Description',
      count: 'Times of Execution',
      instanceExecName: 'Test Execution Name',
      absoluteTime: 'Absolute Time',
      relativeTime: 'Relative Time',
      cmdName: 'Command Name',
      cmdExecutionTime: 'Setting Time',
      message: 'Message',
      appVersion: 'App Version',
      appVersionType: 'App Version Type',
      testLink: 'Test Order Link',
      testUser: 'Test User',
      executionTime: 'Execution Gap',
      caseCount: 'Number of Test Case',
      startTime: 'Start Time',
      endTime: 'End Time',
      result: 'Result',
      duration: 'Execution Time(h)',
      durationMin: 'Execution Time(Min)',
      passRate: 'Test Case passed rate',
      passScore: 'Test Case passed number / Test Case total number',
      analysis: 'Result Analysis'
    },
    testReport: {
      duration: 'Days of Test',
      deviceCount: 'Equipment Number',
      testCount: 'Number of Test',
      result: 'Result'
    }
  },
  status: {
    snapshot: {
      cases: {
        unused: 'Not Used',
        used: 'Used'
      },
      instance: {
        unexec: 'Not Executed',
        execing: 'Under Execution',
        execed: 'Execution Finished',
        stopping: 'Execution Stopping',
        stopped: 'Execution Stopped',
        success: 'Success',
        failed: 'Failure'
      },
      instanceExec: {
        unexec: 'Not Executed',
        execing: 'Under Execution',
        execed: 'Execution Finished',
        stopping: 'Execution Stopping',
        stopped: 'Execution Stopped',
        success: 'Success',
        failed: 'Failure',
        uploading: 'Uploading',
        uploaded: 'Uploaded',
        analyzing: 'Analyzing',
        analyzed: 'Analyzed'
      },
      instanceExecLine: {
        failed: 'Failure',
        analyzing: 'analyzing',
        success: 'Success',
        unexec: 'Not Executed',
        stopped: 'Execution Stopped',
        result_failed: 'Result Failed'
      },
      instanceExecCase: {
        unexec: 'Not Executed',
        execing: 'Under Execution',
        success: 'Success',
        failed: 'Failure',
        stopped: 'Execution Stopped'
      },
      compare: {
        comparing: 'COMPARING',
        compared: 'COMPARED'
      }
    }
  },
  message: {
    required: 'Required',
    success: 'Success',
    confirmRemove: 'Confirm remove?',
    removeSuccess: 'Remove success',
    alreadyExist: 'Already exist!',
    errorLogin: 'Wrong username and password!',
    runSuccess: 'Run Success',
    basicInformation: 'Basic Information',
    commandInformation: 'Command Information',
    caseInformation: 'Case Information',
    masterInformation: 'Master Information',
    branchInformation: 'Branch Information',
    versionInformation: 'Version Information',
    testExecutionHistory: 'Test Execution History',
    testExecutionInformation: 'Test Execution Information',
    caseExecutionList: 'Case Execution List',
    testResult: 'Test Result',
    commandExecutionList: 'Command Execution List',
    retrySuccess: 'Retry Success'
  },
  theme: {
    change: 'Change Theme',
    documentation: 'Theme documentation',
    tips: 'Tips: It is different from the theme-pick on the navbar is two different skinning methods, each with different application scenarios. Refer to the documentation for details.'
  },
  tagsView: {
    refresh: 'Refresh',
    close: 'Close',
    closeOthers: 'Close Others',
    closeAll: 'Close All'
  },
  settings: {
    title: 'Page style setting',
    theme: 'Theme Color',
    tagsView: 'Open Tags-View',
    fixedHeader: 'Fixed Header',
    sidebarLogo: 'Sidebar Logo'
  },
  indexMonitor: {
    indexManage: {
      indexName: 'Index Name',
      createTime: 'Create Time',
      ruleName: 'Rule Name',
      header: 'Header',
      matchRule: 'Match rules',
      condition: 'Condition',
      statisticalContent: 'Statistical Content',
      exceptionNum: 'Abnormal Number',
      countNum: 'Count',
      exceptionRate: 'Abnormal rate'
    },
    monitorExample: {
      appVersion: 'APP Version',
      versionType: 'Version Type',
      monitorTime: 'Monitoring Time',
      monitorDuration: 'Monitoring duration',
      runStatus: 'Run Status',
      selectVersion: 'Select Version',
      selectDevice: 'Select Device',
      setMonitor: 'Set Monitor',
      versionMaster: 'Master',
      versionBranch: 'Branch',
      selectCCU: 'Select CCU',
      selectIndexMonitor: 'Select indicators',
      monitorStartTime: 'Start Time',
      monitorEndTime: 'End Time',
      monitorAlert: 'Abnormal Alert',
      monitorFreq: 'Reminder Frequency',
      monitorEmail: 'Reminder Email',
      monitorFreqUnit: 'h/Second',
      baseInfo: 'Base Info',
      deviceNum: 'Device Number',
      monitorResult: 'Monitoring Results',
      monitorResultTime: 'Time Frame',
      monitorResultTimeDes: 'Start Time--Data Processing Time',
      ccuImei: 'CCU IMEI',
      responseTime: 'Report Time',
      responseContent: 'Report Content'
    }
  }
}
