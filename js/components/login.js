ResponseJS = {
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

  computed: {
    modeQuery () {
      return this.$route.query.mode ? '?mode=' + this.$route.query.mode : ''
    }
  },

  methods: {
    checkAuth () {
      if(this.auth.currentUser) {
        this.$router.push('/bonds' + this.modeQuery)
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
