import axios from 'axios';

let qs = require('qs');

import {
    ElMessage
} from 'element-plus';
const service1 = axios.create({
    baseURL: '',
    timeout: 600000 * 30, // request timeout  半小时超时
});

service1.interceptors.request.use(
    async config => {
        if (!config.isNotLoading) {
            store.commit('showLoading');
        }
        return config;
    },
    error => {
        // do something with request error
        console.log(error); // for debug
        return Promise.reject(error);
    }
);

// response interceptor
service1.interceptors.response.use(
    response => {
        var res = response.data
        let code = res.code || res.status;
        if (code !== 20000 && code !== 200) {
            let type = 'error';
            if (code == 401 || code == 40001) {
                Promise.reject('token失效，请重新登录');
                ElMessage({
                    message: `token失效，请重新登录`,
                    type: 'error'
                });
                setTimeout(function() {
                    util.loginOut();
                }, 1000);
            } else if (code === 20005) {
                type = 'warning';
                ElMessage({
                    message: `${res.message || res.msg || JSON.stringify(res)}`,
                    type: type,
                    duration: 1000,
                });
            }
        }
        store.commit('hideLoading');
        return response;
    },
    error => {
        //  allowRequest(requests, response.config.url); //过滤掉已结束的请求
        console.log('err' + error); // for debug
        if (error.message.includes('timeout')) {
            // 判断请求异常信息中是否含有超时timeout字符串
            ElMessage({
                message: '请求超时',
                type: 'error',
                duration: 1000,
            });
            store.commit('hideLoading');
            return Promise.reject(error); // reject这个错误信息
        }
        ElMessage({
            message: error.message,
            type: 'error',
            duration: 1000,
        });
        store.commit('hideLoading');
        // util.loginOut();

        return Promise.reject(error);
    }
);

let AxiosRequest = function(url, method, bodyType, isNotLoading) {
    this.url = url;
    this.method = method;
    this.bodyType = bodyType;
    var _self = this;
    return function(query, callback, param) {
        var method = _self.method;
        var url = _self.url;
        var token = sessionStorage.getItem('token');
        // var userInfo = JSON.parse(sessionStorage.getItem('userInfo')) || {};
        // var userId = userInfo.id || '1234567qwerty';
        var userId = sessionStorage.getItem("userId");
        // debugger;
        var cTypeHeader = {
            'Content-Type': bodyType || 'application/x-www-form-urlencoded; charset=utf-8',
            token: token,
            userId: userId,
            service: location.host
        };

        var options = {
            headers: cTypeHeader,
            isNotLoading: isNotLoading
        };

        if (query && query._path) {
            url += '/' + query._path;
            delete query._path;
        }

        if (param) {
            url = url.bindData(param);
        }

        if (method === 'get' && query && !query._path) {
            let t = qs.stringify(query);
            if (url.search(/\?/) === -1) {
                url += '?' + t;
            } else {
                url += '&' + t;
            }
            query = {
                headers: cTypeHeader,
                isNotLoading: isNotLoading
            };
            options = null;
        } else if (method === 'delete' && query) {
            query = {
                data: query,
                headers: cTypeHeader,
                isNotLoading: isNotLoading
            };
            options = null;
        } else {
            if (
                cTypeHeader['Content-Type'].search(
                    'application/x-www-form-urlencoded'
                ) !== -1
            ) {
                query = qs.stringify(query);
            }
        }

        service1[method](url, query, options).then(function(data) {
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

String.prototype.bindData = function(obj, filter) {
    var ret = this;
    if (obj && typeof obj === 'object') {
        var re = /{{([^}}]+)?}}/g;
        // this.filter = filter;
        var _self = this;
        var ret = this.replace(re, function(m, t) {
            var temp = obj;
            var ret = (function() {
                var o = temp;
                var keys = t.split('.');
                for (var i = 0; i < keys.length; i++) {
                    o = o[keys[i]];
                    if (o === undefined || o === null) {
                        o = '{{' + keys[i] + '}}';
                    }
                }
                var m = !(
                        _self.filter && typeof _self.filter[keys[i - 1]] === 'function'
                    ) ?
                    o :
                    _self.filter[keys[i - 1]](o);
                return m;
            })();
            return ret;
        });
    }
    return ret;
};

var Adapter = function(config) {
    this.config = config;
    for (let k in config) {
        var item = config[k];
        if (item.url && item.method) {
            this[k] = new AxiosRequest(item.url, item.method, item.bodyType, item.isNotLoading);
        }
    }
};

export default Adapter;