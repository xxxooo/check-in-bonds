// js for index.pug

const app = new Vue({
  el: '#app',

  router: router,

  data: {
    auth: firebase.auth()
  },

  created () {
    this.auth.onAuthStateChanged((user) => {
      this.$forceUpdate()
    })
  }
})
