import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import naive from 'naive-ui'

import App from './App.vue'
import router from './router'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(naive)
app.use(router)





// app.mount('#app')
router.isReady().then(() => {
  app.mount('#app');
});


