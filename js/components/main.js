const main = {
  template: '#viewMain',

  data () {
    return {
      auth: firebase.auth()
    }
  },

  created () {
    this.auth.onAuthStateChanged((user) => {
      this.$forceUpdate()
    })
  }
}
