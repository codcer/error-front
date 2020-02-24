/*监听Console 错误*/
function _handleConsoleError(_window, config) {
  if (!_window.console || !_window.console.error) {
    return;
  }
  const _oldConsoleError = _window.console.error;
  _window.console.error = function() {
    config.sendError({
      title: _window.location.href,
      msg: Array.prototype.join.call(arguments, ','),
      category: 'js',
      level: 'error',
      extends: {},
    });
    _oldConsoleError && _oldConsoleError.apply(_window, arguments);
  };
}

// 处理console warning
function _handleConsoleWarnning(_window, config) {
  if (!_window.console || !_window.console.warn) {
    return;
  }
  const _oldConsoleWarn = _window.console.warn;
  _window.console.warn = function() {
    config.sendWarn({
      title: _window.location.href,
      msg: JSON.stringify(Array.prototype.join.call(arguments, ',')),
      category: 'js',
      level: 'warning',
      extends: {},
    });
    _oldConsoleWarn && _oldConsoleWarn.apply(_window, arguments);
  };
}

// 自定义抛出错误
function _ThrowError(config) {
  return function(errInfo, addition) {
    const error = {
      level: 'error',
      msg: JSON.stringify(errInfo),
      extends: {},
    };
    if (addition) {
      const ex = this._getExtend(addition);
      for (const key in ex) {
        error.extends[key] = ex[key];
      }
    }
    config.sendLog(error);
  };
}
// 自定义抛出警告
function _ThrowWarn(config) {
  return function(warnInfo, addition) {
    const warn = {
      level: 'warning',
      msg: JSON.stringify(warnInfo),
      extends: {},
    };
    if (addition) {
      const ex = this._getExtend(addition);
      for (const key in ex) {
        warn.extends[key] = ex[key];
      }
    }
    config.sendLog(warn);
  };
}
// 自定义抛出普通日志信息
function _ThrowInfo(config) {
  return function(info, addition) {
    const information = {
      level: 'info',
      msg: JSON.stringify(info),
      extends: {},
    };
    if (addition) {
      const ex = this._getExtend(addition);
      for (const key in ex) {
        information.extends[key] = ex[key];
      }
    }
    config.sendLog(information);
  };
}

export {
  _handleConsoleError,
  _handleConsoleWarnning,
  _ThrowError,
  _ThrowWarn,
  _ThrowInfo,
};
