const main = {
  template: '#viewMain',

  data () {
    return {
      start: false,
      auth: firebase.auth()
    }
  },

  created () {
    this.auth.onAuthStateChanged((user) => {
      this.start = true;
      this.$forceUpdate()
    })
  }
}
