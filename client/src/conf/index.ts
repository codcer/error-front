import { executePrivate, executePublic } from '../middleware/index';
import { _window, DEFAULT_INFO, FAIL_ERROR_LIST, WARN_LIST } from '../util/env';
import { _getExtend, _sendToServer } from '../util/index';

const config = {
  Vue: undefined,
  ajaxError: true,
  appId: '',
  appScrect: '',
  autoReport: true,
  category: ['js', 'resource', 'ajax', 'log'],
  closeWarn: false, // 是否停止监听Warn
  consoleError: false, // console.error默认不处理
  custom: true, // 自定义抛出
  filters: [], // 过滤器，命中的不上报
  jsError: true,
  levels: ['info', 'warning', 'error'],
  record: false, // 是否录制F
  resourceError: true,
  scriptError: true, // 跨域js错误，默认不处理，因为没有任何信息
  submitUrl: 'http://fireye.tdahai.com/api/errors',
  uploadWarnLength: 30, // 默认上传的最低长度
};

config.sendError = (error) => {
  /*如果需要录制功能*/
  if (error.category === 'js' && _window.recordEvent) {
    if (_window.recordEvent.lenght >= 30) {
      error.records = _window.recordEvent;
    } else {
      error.records = _window.eventBackUp.concat(_window.recordEvent);
    }
  }
  // 添加默认数据
  for (const i in DEFAULT_INFO) {
    error[i] = DEFAULT_INFO[i];
  }
  // 添加自定义数据
  if (config.extends) {
    if (!error.extends) {
      error.extends = {};
    }
    const result = _getExtend(config.extends);
    error.extends = Object.assign(error.extends, result);
  }
  executePublic(error);
  executePrivate(error);
  _sendToServer(error);
};

config.sendWarn = (warn, send) => {
  if (!send) {
    // 添加默认数据
    for (const i in DEFAULT_INFO) {
      warn[i] = DEFAULT_INFO[i];
    }

    // 添加自定义数据
    if (config.extends) {
      if (!warn.extends) {
        warn.extends = {};
      }
      const result = _getExtend(config.extends);
      warn.extends = Object.assign(warn.extends, result);
    }
    WARN_LIST.push(warn);

    // 判断是否到达上传的长度
    if (WARN_LIST.length < config.uploadWarnLength) {
      return;
    }
  }

  // 上报警告信息
  if (WARN_LIST.length + FAIL_ERROR_LIST.length > 0) {
    const arr = WARN_LIST.concat(FAIL_ERROR_LIST);
    _sendToServer(arr);
  }
};

config.sendLog = (info) => {
  info.title = _window.location.href;
  info.category = 'log';
  _sendToServer(info);
};

// change配置覆盖默认config配置
function setConfig(change) {
  for (const key in change) {
    config[key] = change[key];
  }
  console.log('log: ', config);
}

export { setConfig, config };
