import {
    createApp
} from 'vue'
import App from './App.vue'
import {
    createStore
} from 'vuex'
import * as Router from 'vue-router';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/css/common.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import store from './store.js';
import zhCn from 'element-plus/es/locale/lang/zh-cn';




//公共方法
import util from "./assets/js/util.js";
window.util = util;

const app = createApp(App);

app.use(ElementPlus, {
    locale: zhCn,
});
// import DeleteButton from "./components/opConfirmButton";
// app.component("DeleteButton", DeleteButton);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

window.store = createStore(store);

import $ from 'jquery';
window.$ = $;

import Adapter from "./assets/js/adapter";
window.adapter = new Adapter(InterfaceConfig);

//路由
var routeData = util.transRouteComponent(RouteConfig.admin);
var router = new Router.createRouter({
    mode: 'hash',
    history: Router.createWebHashHistory(),
    routes: routeData
});

app.use(router);

app.mount('#app');