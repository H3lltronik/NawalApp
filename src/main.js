// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import { store } from './store'
import * as firebase from 'firebase'
import DetailsDialog from './components/detailsDialog.vue'
import EditCitaDialog from './components/editCita.vue'
import SharedRegisterDatesForm from './components/sharedRegisterDatesForm.vue'
import DeleteCitaDialog from './components/deleteCitaDialog.vue'

Vue.component('details-dialog', DetailsDialog)
Vue.component('edit-cita-dialog', EditCitaDialog)
Vue.component('shared-register-dates-form', SharedRegisterDatesForm)
Vue.component('delete-cita-dialog', DeleteCitaDialog)

Vue.use(Vuetify, { theme: {
  primary: '#ee44aa',
  secondary: '#424242',
  accent: '#82B1FF',
  error: '#FF5252',
  info: '#2196F3',
  success: '#4CAF50',
  warning: '#FFC107'
}})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyCwLrOjgfX0ZnBgYJ2-1GZSq_hHzGiPzKg",
      authDomain: "nawal01-dad69.firebaseapp.com",
      databaseURL: "https://nawal01-dad69.firebaseio.com",
      projectId: "nawal01-dad69",
      storageBucket: "nawal01-dad69.appspot.com",
      messagingSenderId: "725688625774"
    };
    firebase.initializeApp(config);

    firebase.auth().onAuthStateChanged (user => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
        this.$store.dispatch('loadCitas')
      }
    })
  }
})
