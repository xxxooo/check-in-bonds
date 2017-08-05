// main page
//
const main = {
  template: '#viewMain',

  data () {
    return {
      ready: false,
      isAdmin: null,
      auth: firebase.auth()
    }
  },

  created () {
    this.auth.onAuthStateChanged((user) => {
      this.ready = true
      if (user) this.isAdmin = Admins.indexOf(user.email) >= 0
      this.$forceUpdate()
    })
  }
}

// 404 page
//
const pageNotFound = {
  template: '#pageNotFound'
}
