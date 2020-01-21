const _window =
  typeof window !== 'undefined'
    ? window
    : typeof global !== 'undefined'
    ? global
    : typeof this !== 'undefined'
    ? this
    : {};
const addEventListener = _window.addEventListener || _window.attachEvent;

let warnList = [];
const FailErrorList = [];

// 录制 事件 + 时间备份
_window.recordEvent = [];
_window.eventBackUp = [];

// 默认错误信息上报
const defaultInfo = {
  browser: _getBrowser(), // 浏览器
  os: _getDevices(), // 设备类型
  osVersion: _getSystemVersion(), // 操作系统版本
  memory: _window.navigator.deviceMemory, // 获取用户的最大内存 G
};

/**
 * 重置警告列表
 */
function resetWarnList() {
  warnList = [];
}

/**
 * 加入失败/错误列表
 */
function pushFailErrorList(info) {
  if (Array.isArray(info)) {
    FailErrorList.push(...info);
  } else {
    pushFailErrorList.push(info);
  }
}

/**
 * 获取浏览器类型
 */
function _getBrowser() {
  const userAgent = navigator.userAgent.toLowerCase(); // 取得浏览器的userAgent字符串
  const isOpera = userAgent.indexOf('opera') > -1;
  const isFirefox = userAgent.indexOf('firefox') > -1;
  const isChrome = userAgent.indexOf('chrome') > -1;
  const isSafari = userAgent.indexOf('safari') > -1;
  const isIE =
    userAgent.indexOf('compatible') > -1 &&
    userAgent.indexOf('MSIE') > -1 &&
    !isOpera;

  switch (true) {
    case isOpera:
      return 'Opera';
    case isFirefox:
      return 'FF';
    case isChrome:
      return 'Chrome';
    case isSafari:
      return 'Safari';
    case isIE:
      return 'IE';
    default:
      return 'unknow';
  }
}

/**
 * 获取设备是安卓、IOS 还是PC端
 */
function _getDevices() {
  const u = navigator.userAgent;
  const app = navigator.appVersion;

  if (
    /AppleWebKit.*Mobile/i.test(navigator.userAgent) ||
    /MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(
      navigator.userAgent,
    )
  ) {
    if (window.location.href.indexOf('?mobile') < 0) {
      try {
        if (/iPhone|mac|iPod|iPad/i.test(navigator.userAgent)) {
          return 'iPhone';
        } else {
          return 'Android';
        }
      } catch (e) {
        console.log('您的宿主不支持navigator.userAgent api');
      }
    }
  } else if (u.indexOf('iPad') > -1) {
    return 'iPhone';
  } else {
    return navigator.platform;
  }
}

/**
 * 获取操作系统版本
 */
function _getSystemVersion() {
  const ua = window.navigator.userAgent;
  if (ua.indexOf('CPU iPhone OS ') >= 0) {
    return ua.substring(
      ua.indexOf('CPU iPhone OS ') + 14,
      ua.indexOf(' like Mac OS X'),
    );
  } else if (ua.indexOf('Android ') >= 0) {
    return ua.substr(ua.indexOf('Android ') + 8, 3);
  } else {
    return 'other';
  }
}

export {
  _window,
  addEventListener,
  warnList,
  resetWarnList,
  FailErrorList,
  defaultInfo,
  pushFailErrorList,
};
