import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/app.css' // Here
// import store from './store'
import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
library.add(fab);
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { dom } from "@fortawesome/fontawesome-svg-core";
dom.watch();

library.add(faUserSecret)

// createApp(App).use(store).use(router).mount('#app')
createApp(App).use(router).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
