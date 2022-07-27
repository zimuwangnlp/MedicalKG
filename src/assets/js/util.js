import axios from 'axios';
import html2canvas from "./html2canvas.js";
import constant from './constant';
/**
 * 公共方法
 * @constructor
 */
var Utils;
Utils = {
    getCode(url) {
        const params = url || window.location.href;
        let code = "";
        var temp = params.split("code=")[1];
        code = temp && (temp.split('#/')[0]);
        return code;
    },
    login() {
        this.clear();
        var url = location.protocol + "//" + location.host + "/#/transition";
        location.href = window.loginService +
            "/cas/oauth2.0/authorize?response_type=code&client_id=" +
            constant.appId +
            "&bypass_approval_prompt=true&redirect_uri=" + encodeURIComponent(url);
    },
    loginOut() {
        this.clear();
        var url = location.protocol + "//" + location.host + "/#/transition";
        location.href =
            window.loginService + '/cas/logout?service=' + encodeURIComponent(url) + '/#/transition';
    },
    clear() {
        sessionStorage.clear();
        localStorage.clear();
    },
    downLoadByUrl(url, name, method, param, header) {
        var xhr = new XMLHttpRequest();
        //GET请求,请求路径url,async(是否异步)
        method = method || "GET";
        xhr.open(method, url, true);
        //设置请求头参数的方式,如果没有可忽略此行代码
        if (header) {
            for (var k in header) {
                xhr.setRequestHeader(k, header[k]);
            }
        }
        //设置响应类型为 blob
        xhr.responseType = 'blob';

        var _self = this;
        //关键部分
        xhr.onload = function(e) {
            //如果请求执行成功
            if (this.status == 200) {
                var blob = this.response;
                _self.downloadString(blob, name);
            }
        };
        //发送请求
        if (header['Content-Type'].search("application/json") !== -1) {
            param = JSON.stringify(param);
        }
        xhr.send(param);
    },
    downloadString(blob, name) {
        var filename = name || '匿名文件'; //如123.xls
        var a = document.createElement('a');

        // blob.type = "application/octet-stream";
        //创键临时url对象
        var url = URL.createObjectURL(blob);

        a.href = url;
        a.download = filename;
        a.click();
        //释放之前创建的URL对象
        window.URL.revokeObjectURL(url);
    },
    tranformImage: function(elem, name, type, color, callback) {
        html2canvas(
            elem, {
                allowTaint: true,
                useCORS: true,
                backgroundColor: color || "transparent"
            }
        ).then(htmlCanvas => {
            var dataurl = htmlCanvas.toDataURL(type || 'image/jpeg');
            var bin = atob(dataurl.split(',')[1]);
            //创建空的Uint8Array
            var buffer = new Uint8Array(bin.length);

            //将图像数据逐字节放入Uint8Array中
            for (var i = 0; i < bin.length; i++) {
                buffer[i] = bin.charCodeAt(i);
            }

            //利用Uint8Array创建Blob对象
            var blob = new Blob([buffer.buffer], {
                type: type
            });

            if (typeof(callback) === "function") {
                callback(dataurl, blob);
            } else {
                this.downloadString(blob, name)
            }

        });

    },
    formatNumber(n) {
        var ret = n + '';
        if (n < 10) {
            ret = '0' + n;
        }
        return ret;
    },
    transformPHPTime(time, flag) {
        var date = new Date(time);
        const Y = date.getFullYear() + '-';
        const M =
            (date.getMonth() + 1 < 10 ?
                '0' + (date.getMonth() + 1) :
                date.getMonth() + 1) + '-';
        const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        const space = ' ';
        const h = this.formatNumber(date.getHours()) + ':';
        const m = this.formatNumber(date.getMinutes()) + ':';
        const s = this.formatNumber(date.getSeconds());
        var ret = Y + M + D + space + h + m + s;
        if (flag) {
            ret = Y + M + D;
        }
        // console.log(Y + M + D + space + h + m + s);
        return ret;
    },
    transRouteComponent: function(arr) {
        arr = arr || [];
        for (var i = 0; i < arr.length; i++) {
            if (typeof(arr[i].component) === "string") {
                arr[i] = {
                    exact: true,
                    path: arr[i].path,
                    redirect: arr[i].redirect,
                    children: this.transRouteComponent(arr[i].children),
                    components: require(`@/${arr[i].component}.vue`)
                }
            }
        }
        return arr;
    },
    initSwaggerAdapter: function(url, callback) {
        axios.get(url, function(d) {
            console.log(d);
            var config = {};
            var tData = d.paths;
            for (var k in tData) {
                var key = k.replace(/\/|\\/g, "_");
                key = key.replace(/{|}/g, "");
                config[key] = {
                    url: k,
                    dataType: "json"
                };
                for (var m in tData[k]) {
                    config[key].method = m;
                }
            }
            var adapter = new Adapter(config);
            if (typeof callback === "function") {
                callback(adapter, config);
            }
        }, "json");
    },
    loadOptionData: function(url, key, myCallback) {
        var id = MurmurHash.rule(url);
        var aItem = {
            id: id,
            url: url,
            key: key,
            callback: myCallback
        };
        this.jsonpMap = this.jsonpMap || {};
        this.jsonpMap[key] = this.jsonpMap[key] || {};
        this.jsonpMap[key][id] = aItem;

        this.jsonpCallback = this.jsonpCallback || {};
        this.jsonpCallback[key] = this.jsonpCallback[key] || [];
        this.jsonpCallback[key].push(aItem);
        var _self = this;
        window[key] = function(d) {
            d.appUrl = url.split("?")[0];
            var item = _self.jsonpMap[key][id];
            if (item && item.id === id && _self.jsonpMap[key][id] && item.callback) {
                item.callback(d);
            }
            var index = _self.jsonpCallback[key].indexOf(item);
            _self.jsonpCallback[key].splice(index, 1);
            delete _self.jsonpMap[key][id];

            if (_self.jsonpCallback[key].length !== 0) {
                item = _self.jsonpCallback[key].pop();
                _self.loadOptionData(item.url, item.key, item.callback);
            }
        };

        var elem = document.getElementById(id);
        if (elem) {
            elem.parentNode.removeChild(elem);
        }
        var s = document.createElement("script");
        s.id = id;
        s.src = WebTool.attachParams(url, {
            callback: key
        });
        document.head.appendChild(s);
    },
}

export default Utils