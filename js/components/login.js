const appLogin = {
  template: '#viewLogin',

  data () {
    return {
      user: {
        email: '',
        password: ''
      },
      auth: {},
      message: ''
    }
  },

  methods: {
    checkAuth () {
      if(this.auth.currentUser) {
        this.$router.push('/bonds')
      }
    },
    signIn () {
      this.auth.signInWithEmailAndPassword(this.user.email, this.user.password)
        .then(() => { this.message = '' })
        .catch(e => {
          this.message = e.message
        })
    }
  },

  created () {
    this.auth = firebase.auth()
    this.auth.onAuthStateChanged((user) => {
      this.$forceUpdate()
      this.checkAuth()
    })
  }
}

const appLogout = {
  template: '<p>Logout</p>',

  created () {
    firebase.auth().signOut()
    this.$router.push('/')
  }
}
