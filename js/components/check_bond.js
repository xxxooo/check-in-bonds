//
// Read a Bond
//
ResponseJS = {
  template: '#checkBond',

  firebase () {
    return {
      bond: {
        source: BondsRef.child(this.$route.params.id),
        asObject: true,
        cancelCallback: () => { this.loaded = true },
        readyCallback: () => { this.loaded = true }
      }
    }
  },

  data () {
    return {
      auth: {},
      ready: false,
      isAuthed: false,
      loaded: false,
      isClicked: false,
      message: ''
    }
  },

  methods: {
    checkAuthUser (user) {
      if (user && user.email) {
        this.isAuthed = true
      } else {
        this.isAuthed = false
      }
    },
    commit () {
      let msg = '是否更新為已付款？'
      if (confirm(msg)) {
        BondsRef.child(this.bond['.key']).update({checked: true}, (error) => {
          if (error) this.message = error
        })
      }
    },
    checkIn () {
      let updates = {
        checkIn: true,
        checkInTime: new Date().toLocaleString()
      }

      this.isClicked = true
      BondsRef.child(this.bond['.key']).update(updates, (error) => {
        if (error) this.message = error
      })
    }
  },

  beforeCreate () {
    BondsRef = dbGetBondsRef(this.$route.query.mode)
  },

  created () {
    this.auth = firebase.auth()
    this.auth.onAuthStateChanged((user) => {
      this.checkAuthUser(user)
      this.ready = true
      this.$forceUpdate()
    })
  }
}
