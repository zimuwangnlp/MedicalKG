//请求超时时间限制
var API_TIMEOUT = 60000;
// 登录服务地址
var loginService = 'http://10.208.63.251';
var projectHost = "http://" + location.host;
var appId = "358669cfb70cafc73a04cc825d7b04d1";
var client_secret = "db6452c5c89f7d40a3aaf2a3575a2586";
var prefix = "/authority_forecast/"

const InterfaceConfig = {
    delete: {
        url: prefix + "tec/delete?id={{id}}&type={{type}}",
        method: "delete",
        bodyType: "application/x-www-form-urlencoded;charset=UTF-8"
    },
    upload: {
        url: prefix + "tec/uploadReport",
        method: "post",
        bodyType: "multipart/form-data"
    },
    downloadReport: {
        url: prefix + "tec/downloadReport",
        method: "post",
        bodyType: 'application/json; charset=utf-8'
    },
    calculateHot: {
        url: prefix + "tec/calculateHot",
        method: "post",
        bodyType: "application/x-www-form-urlencoded;charset=UTF-8"
    },
    getForcastPic: {
        url: prefix + "tec/tecTradePic",
        method: "post",
        bodyType: "application/x-www-form-urlencoded;charset=UTF-8"
    },
    getReportWords: {
        url: prefix + "tec/hotTec",
        method: "post",
        bodyType: "application/x-www-form-urlencoded;charset=UTF-8"
    },
    getForcastReport: {
        url: prefix + "tec/forcastReports",
        method: "post",
        bodyType: "application/x-www-form-urlencoded;charset=UTF-8"
    },
    getForcastHot: {
        url: prefix + "tec/forcastHot",
        method: "post",
        bodyType: "application/x-www-form-urlencoded;charset=UTF-8"
    },
    getReportDetail: {
        url: prefix + "tec/reportDetail",
        method: "post",
        bodyType: "application/x-www-form-urlencoded;charset=UTF-8"
    },
    getUserToken: {
        url: "/login/cas/oauth2.0/accessToken",
        method: "post",
        bodyType: "application/x-www-form-urlencoded"
    },
    getUserInfo: {
        url: "/authority/golaxy/authorization/user/v2",
        method: "get"
    },
    getUserList: {
        url: "/authority/golaxy/authorization/appAdmin/users/v2/",
        method: "get"
    },
    getUserRole: {
        url: "/authority/golaxy/authorization/appAdmin/user/{{userId}}/roles/v2/",
        method: "get"
    },
    setUserRole: {
        url: "/authority/golaxy/authorization/appAdmin/user/{{userId}}/roles/v2/?access_token={{token}}&appId={{appId}}",
        method: "post",
        bodyType: 'application/json; charset=utf-8'
    },
    setUserApplication: {
        url: "/authority/golaxy/authorization/appAdmin/user/{{userId}}/applications/v2/?access_token={{token}}",
        method: "post",
        bodyType: 'application/json; charset=utf-8'
    },
    getAllRoles: {
        url: "/authority/golaxy/authorization/appAdmin/roles/v2/",
        method: "get"
    },
    addUserItem: {
        url: "/authority/golaxy/authorization/systemAdmin/user/v2/?access_token={{token}}",
        method: "post",
        bodyType: 'application/json; charset=utf-8',
    },
    updateUserItem: {
        url: "/authority/golaxy/authorization/systemAdmin/user/v2/?access_token={{token}}",
        method: "put",
        bodyType: 'application/json; charset=utf-8',
    },
    deleteUserItem: {
        url: "/authority/golaxy/authorization/systemAdmin/user/v1/?access_token={{token}}&appId={{appId}}",
        method: "delete",
        bodyType: 'application/json; charset=utf-8',
    },
    resetPassword: {
        url: "/authority/golaxy/authorization/systemAdmin/user/{{userId}}/password/v2/?access_token={{token}}&password={{password}}",
        method: "put",
        bodyType: 'application/json; charset=utf-8',
    },
}

// export default InterfaceConfig