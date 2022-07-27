"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _elementPlus = require("element-plus");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var qs = require('qs');

var service1 = _axios["default"].create({
  baseURL: '',
  timeout: 600000 * 30 // request timeout  半小时超时

});

service1.interceptors.request.use(function _callee(config) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!config.isNotLoading) {
            store.commit('showLoading');
          }

          return _context.abrupt("return", config);

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
}, function (error) {
  // do something with request error
  console.log(error); // for debug

  return Promise.reject(error);
}); // response interceptor

service1.interceptors.response.use(function (response) {
  var res = response.data;
  var code = res.code || res.status;

  if (code !== 20000 && code !== 200) {
    var type = 'error';
    if (code === 20005) type = 'warning';
    (0, _elementPlus.ElMessage)({
      message: "".concat(res.message || res.msg || JSON.stringify(res)),
      type: type,
      duration: 1000
    });
  } else if (code == 401 || code == 40001) {
    Promise.reject('token失效，请重新登录');
    (0, _elementPlus.ElMessage)({
      message: "token\u5931\u6548\uFF0C\u8BF7\u91CD\u65B0\u767B\u5F55",
      type: 'error'
    });
    setTimeout(function () {
      sessionStorage.clear();
      localStorage.clear();
      location.href = '/login/cas/logout?service=' + location.protocol + "//" + location.host + "/";
    }, 1000);
  }

  store.commit('hideLoading');
  return response;
}, function (error) {
  //  allowRequest(requests, response.config.url); //过滤掉已结束的请求
  console.log('err' + error); // for debug

  if (error.message.includes('timeout')) {
    // 判断请求异常信息中是否含有超时timeout字符串
    (0, _elementPlus.ElMessage)({
      message: '请求超时',
      type: 'error',
      duration: 1000
    });
    store.commit('hideLoading');
    return Promise.reject(error); // reject这个错误信息
  }

  (0, _elementPlus.ElMessage)({
    message: error.message,
    type: 'error',
    duration: 1000
  });
  store.commit('hideLoading');
  return Promise.reject(error);
});

var AxiosRequest = function AxiosRequest(url, method, bodyType) {
  this.url = url;
  this.method = method;
  this.bodyType = bodyType;

  var _self = this;

  return function (query, callback, param) {
    var method = _self.method;
    var url = _self.url;
    var token = sessionStorage.getItem('token'); // var userInfo = JSON.parse(sessionStorage.getItem('userInfo')) || {};
    // var userId = userInfo.id || '1234567qwerty';

    var userId = sessionStorage.getItem("userId"); // debugger;

    var cTypeHeader = {
      'Content-Type': bodyType || 'application/x-www-form-urlencoded; charset=utf-8',
      token: token,
      userId: userId
    };
    var options = {
      headers: cTypeHeader
    };

    if (query && query._path) {
      url += '/' + query._path;
      delete query._path;
    }

    if (param) {
      url = url.bindData(param);
    }

    if (method === 'get' && query && !query._path) {
      var t = qs.stringify(query);

      if (url.search(/\?/) === -1) {
        url += '?' + t;
      } else {
        url += '&' + t;
      }

      query = {
        headers: cTypeHeader
      };
      options = null;
    } else if (method === 'delete' && query) {
      // let t = qs.stringify(query);
      // if (url.search(/\?/) === -1) {
      //     url += '?' + t;
      // } else {
      //     url += '&' + t;
      // }
      query = {
        data: query,
        headers: cTypeHeader
      };
      options = null;
    } else {
      if (cTypeHeader['Content-Type'].search('application/x-www-form-urlencoded') !== -1) {
        query = qs.stringify(query);
      }
    }

    service1[method](url, query, options).then(function (data) {
      if (data.data.status < 0) {
        location.href = '#/';
      }

      if (typeof callback === 'function') {
        try {
          if (typeof data.data === 'string') {
            data.data = eval('(' + data.data + ')');
          }
        } catch (e) {
          console.log(e);
        }

        callback(data);
      }
    });
  };
};

String.prototype.bindData = function (obj, filter) {
  var ret = this;

  if (obj && _typeof(obj) === 'object') {
    var re = /{{([^}}]+)?}}/g; // this.filter = filter;

    var _self = this;

    var ret = this.replace(re, function (m, t) {
      var temp = obj;

      var ret = function () {
        var o = temp;
        var keys = t.split('.');

        for (var i = 0; i < keys.length; i++) {
          o = o[keys[i]];

          if (o === undefined || o === null) {
            o = '{{' + keys[i] + '}}';
          }
        }

        var m = !(_self.filter && typeof _self.filter[keys[i - 1]] === 'function') ? o : _self.filter[keys[i - 1]](o);
        return m;
      }();

      return ret;
    });
  }

  return ret;
};

var Adapter = function Adapter(config) {
  this.config = config;

  for (var k in config) {
    var item = config[k];

    if (item.url && item.method) {
      this[k] = new AxiosRequest(item.url, item.method, item.bodyType);
    }
  }
};

var _default = Adapter;
exports["default"] = _default;