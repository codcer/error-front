interface IWin {
  [name: string]: any;
}
const _window: IWin =
  typeof window !== 'undefined'
    ? window : {};
const addEventListener = _window.addEventListener || _window.attachEvent;
const USERAGENT = navigator.userAgent.toLowerCase(); // 取得浏览器的userAgent字符串

// 列表名单
const WARN_LIST: any = [];
const FAIL_ERROR_LIST: any = [];

// 录制 事件 + 时间备份
_window.recordEvent = [];
_window.eventBackUp = [];

// 默认上报的信息
const DEFAULT_INFO = {
  browser: _getBrowser(), // 浏览器
  memory: _window.navigator.deviceMemory, // 获取用户的最大内存 G
  os: _getDevices(), // 设备类型
  osVersion: _getSystemVersion(), // 操作系统版本
};

/**
 * 重置警告列表
 */
function resetWarnList(): void {
  const {length} = WARN_LIST;
  WARN_LIST.splice(0, length);
}

/**
 * 加入失败/错误列表
 */
function pushFailErrorList(info: any): void {
  if (Array.isArray(info)) {
    FAIL_ERROR_LIST.push(...info);
  } else {
    FAIL_ERROR_LIST.push(info);
  }
}

/**
 * 获取浏览器类型
 */
function _getBrowser(): string {
  const isOpera = USERAGENT.indexOf('opera') > -1;
  const isFirefox = USERAGENT.indexOf('firefox') > -1;
  const isChrome = USERAGENT.indexOf('chrome') > -1;
  const isSafari = USERAGENT.indexOf('safari') > -1;
  const isIE =
    USERAGENT.indexOf('compatible') > -1 &&
    USERAGENT.indexOf('MSIE') > -1 &&
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
function _getDevices(): string {
  const u = USERAGENT;
  const app = navigator.appVersion;
  let platSTR = '';

  if (
    /AppleWebKit.*Mobile/i.test(u) ||
    /MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/i.test(
      u,
    )
  ) {
    if (window.location.href.indexOf('?mobile') < 0) {
      try {
        if (/iPhone|mac|iPod|iPad/i.test(u)) {
          platSTR = 'iPhone';
        } else {
          platSTR =  'Android';
        }
      } catch (e) {
        platSTR = '您的宿主不支持navigator.userAgent api';
      }
    }
  } else if (u.indexOf('ipad') > -1) {
    platSTR = 'iPhone';
  } else {
    platSTR = navigator.platform;
  }
  return platSTR;
}

/**
 * 获取操作系统版本
 */
function _getSystemVersion(): string {
  const ua = USERAGENT;
  if (ua.indexOf('cpu iphone os ') >= 0) {
    return ua.substring(
      ua.indexOf('cpu iphone os ') + 14,
      ua.indexOf(' like mac os x'),
    );
  } else if (ua.indexOf('android ') >= 0) {
    return ua.substr(ua.indexOf('android ') + 8, 3);
  } else {
    return 'other';
  }
}

export {
  _window,
  addEventListener,
  WARN_LIST,
  resetWarnList,
  FAIL_ERROR_LIST,
  pushFailErrorList,
  DEFAULT_INFO,
};
