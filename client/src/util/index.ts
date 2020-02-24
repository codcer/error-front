import { config } from '../conf/index'; // redux util
import { pushFailErrorList, resetWarnList } from './env'; // redux util

/**
 * 自定义ts类型
 */
type func = () => any;
interface IObj {
  [name: string]: any;
}

/**
 * 检测参数是否为Object
 */
function isObject(what: object): boolean {
  return Object.prototype.toString.call(what) === '[object Object]';
}

/**
 * 检测参数是否为function
 */
function isFunction(what: func): boolean {
  return typeof what === 'function';
}

/**
 * 获取额外字段，并返回对象字面量
 */
function _getExtend(extend: IObj | func): object {
  const _fn = extend as func;
  if (isFunction(_fn)) {
    const result = _fn();
    if (isObject(result)) {
      return result;
    } else {
      return {};
    }
  } else if (isObject(extend)) {
    const _obj = extend as IObj;
    for (const key in _obj) {
      if (isFunction(_obj[key])) {
        _obj[key] = _obj[key]();
      }
    }
    return _obj;
  } else {
    return {};
  }
}

/**
 * 上报数据至api端
 */
function _sendToServer(info: object): void {
  try {
    const isArr = info instanceof Array;
    fetch(config.submitUrl, {
      body: JSON.stringify(info),
      headers: {
        'Content-Type': 'application/json',
        "appId": config.appId,
        "appScrect": config.appScrect,
      },
      method: 'POST',
    })
      .then((res) => {
        if (isArr) {
          resetWarnList();
        }
      })
      .catch((error) => {
        if (!isArr) {
          pushFailErrorList(info);
        }
      });
  } catch (e) {
    console.log('您的宿主不支持fetch api', e);
  }
}

export { _sendToServer, _getExtend, isObject, isFunction };
