const main = {
  template: '#viewMain',

  data () {
    return {
      start: false,
      isAdmin: null,
      auth: firebase.auth()
    }
  },

  created () {
    this.auth.onAuthStateChanged((user) => {
      this.start = true
      this.isAdmin = Admins.indexOf(user.email) >= 0
      this.$forceUpdate()
    })
  }
}
