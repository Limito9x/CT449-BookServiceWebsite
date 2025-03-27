import './assets/main.css'
import './assets/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import App from './App.vue'
import router from './router'
import Toast from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSignOutAlt,faSignInAlt,faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSignOutAlt,faSignInAlt)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(Toast)
app.use(createPinia())
app.use(router)

app.mount('#app')
