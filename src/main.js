import Vue from 'vue';
import { Button, Radio, Container, Main, Header, Aside, Menu, Submenu, MenuItem, MenuItemGroup, Dropdown, DropdownMenu, DropdownItem, Row, Col, Card, Table, TableColumn, Form, FormItem, Input, Select, Option, Switch, DatePicker, Dialog, Pagination, Upload, Tag, Message, RadioGroup, MessageBox } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';

import router from '../router';
import store from '../store'
import axios from 'axios'
// import '../api/mock.js'
///import VueAxios from 'vue-axios'



Vue.config.productionTip = false

Vue.use(Button);
Vue.use(Radio);
Vue.use(Container);
Vue.use(Main);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Row);
Vue.use(Col);
Vue.use(Card);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Switch);
Vue.use(DatePicker);
Vue.use(Dialog);
Vue.use(Pagination);
Vue.use(Upload)
Vue.use(Tag);
Vue.use(Radio);
Vue.use(RadioGroup)
//Vue.use(MessageBox);
//Vue.use(VueAxios,axios);
Vue.prototype.$http = axios
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
import { logout } from "../api/data.js";

router.beforeEach((to, from, next) => {
  store.commit('getToken')
  store.commit('getUser')
  store.commit('getUsername')
  const token = store.state.user.token
  const username = store.state.user.username
  if (!token && to.name !== 'Login' && to.name !== 'Register') {
    console.log(username)
    if (username !== undefined) {
      let param = new URLSearchParams();
      param.append("username", username);
      logout(param).then((res) => {
        var ret = res.data["ret"];
        var msg = res.data["msg"];
        if (ret === 0) {
          store.commit("clearToken");
          store.commit("clearMenu");
          store.commit("clearUser");
        }
      });
    }
    next({ name: 'Login' })
    Message.error("权限过期，请登录账号");
  } else if (token && to.name === 'Login') {
    next({ name: 'Home' })
  } else {
    next()
  }
})
new Vue({
  store,
  router,
  render: h => h(App),
  created() {
    store.commit('addMenu', router)
    setInterval(() => {
      location.reload(false)
    }, 60000 * 2); //每隔120秒检测一下，权限是否过期
  }
}).$mount('#app')
