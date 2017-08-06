ResponseJS = {
  template: '<p>Logout</p>',

  created () {
    firebase.auth().signOut()
    this.$router.push('/')
  }
}
