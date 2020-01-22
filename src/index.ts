import { config, setConfig } from './conf/index';
import { clearPrivate, usePrivate, usePublic } from './middleware';
import { _window } from './redux';
import {
  _handleAjaxError,
  _handleConsoleError,
  _handleConsoleWarnning,
  _handleFetchError,
  _handleRejectPromise,
  _handleResourceError,
  _handleVueError,
  _handleVueWarn,
  _handleWindowError,
  _ThrowError,
  _ThrowInfo,
  _ThrowWarn
} from './sdk/index';

function start(options, extend) {
  if (options) {
    if (extend) {
      options.extends = extend;
    }
    setConfig(options);
  }

  //  跨域js错误上报
  if (!config.scriptError) {
    config.filters.push(function() {
      return /^Script error\.?$/.test(arguments[0]);
    });
  }

  // 录制上报
  if (config.record) {
    // console.log('=====开始录制轨迹======');
    import('./record').then(result => {
      result.default(_window);
    });
  }

  // js错误上报
  if (config.jsError) {
    _handleWindowError(_window, config);
    _handleRejectPromise(_window, config);
  }

  // vue错误上报
  if (config.Vue || config.vue) {
    _handleVueError(_window, config);
    if (!config.closeWarn) {
      _handleVueWarn(_window, config);
    }
  }

  // 资源错误上报
  if (config.resourceError && addEventListener) {
    _handleResourceError(_window, config);
  }

  // 接口错误上报
  if (config.ajaxError) {
    _handleFetchError(_window, config);
    _handleAjaxError(_window, config);
  }

  // 自定义错误上报
  if (config.custom) {
    _window.fireLog = {
      error: _ThrowError(config),
      warn: _ThrowWarn(config),
      info: _ThrowInfo(config)
    };
  }

  // 控制台错误上报
  if (config.consoleError) {
    _handleConsoleError(_window, config);
    if (!config.closeWarn) {
      _handleConsoleWarnning(_window, config);
    }
  }

  // 停止监听Warn上报
  if (!config.closeWarn) {
    _window.addEventListener('beforeunload', function() {
      config.sendWarn({}, true);
    });
  }
}

export { start, usePrivate, usePublic, clearPrivate };
