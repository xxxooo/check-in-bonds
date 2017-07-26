
const initBond = {
  name: '',
  info: '',
  email: '',
  phone: '',
  code: '',
  commitTime: '',
  memo: '',
  checked: false,
  checkIn: false
}

//
// Index of Bonds
//
const bondsIndex = {
  template: '#indexBonds',

  firebase: {
    bonds: BondsRef
  },

  data () {
    return {
      newBond: initBond,
      pickedBond: {}
    }
  },

  methods: {
    checkAuth () {
      if(!firebase.auth().currentUser) {
        this.$router.push('/login')
      }
    },
    adding () {
      this.pickedBond = this.newBond
      this.$refs['edit-bond-modal'].isOpen = true
    },
    editing (bond) {
      this.pickedBond = bond
      this.$refs['edit-bond-modal'].isOpen = true
    },
    deleting (bond) {
      this.pickedBond = bond
      this.$refs['delete-bond-modal'].isOpen = true
    },
    producing (bond) {
      this.pickedBond = bond
      this.$refs['qr-view-modal'].isOpen = true
    }
  },

  created () {
    this.checkAuth()
  }
}

//
// 編輯 Bond 表單 modal
//
Vue.component('edit-bond-modal', {
  template: '#editBondModal',

  props: ['bond'],

  data () {
    return {
      isOpen: false,
      bondData: {},
      message: ''
    }
  },

  computed: {
    isNew () {
      return !this.bond['.key']
    }
  },

  watch: {
    isOpen (val) {
      this.bondData = val ? JSON.parse(JSON.stringify(this.bond)) : {}
      delete this.bondData['.key']
    }
  },

  methods: {
    autosize (e) {
      setTimeout(() => {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
      }, 0);
    },
    create () {
      if (this.bondData.name.length > 0) {
        BondsRef.push(this.bondData, (error) => {
          if (error) {
            console.log(error)
            this.message = error
          } else {
            this.isOpen = false
          }
        })
        this.isOpen = false
      } else {
        this.message = '請輸入姓名'
      }
    },
    update () {
      if (this.bondData.name.length > 0) {
        BondsRef.child(this.bond['.key']).update(this.bondData, (error) => {
          if (error) {
            console.log(error)
            this.message = error
          } else {
            this.isOpen = false
          }
        })
      } else {
        this.message = '請輸入姓名'
      }
    }
  },
})

//
// 產生 Bond QRcode 視窗
//
Vue.component('qr-view-modal', {
  template: '#qrViewModal',

  props: ['bond'],

  data () {
    return { isOpen: false }
  },

  methods: {
    //
  },
})

//
// 刪除 Bond 確認視窗
//
Vue.component('delete-bond-modal', {
  template: '#deleteBondModal',

  props: ['bond'],

  data () {
    return { isOpen: false }
  },

  methods: {
    destroy () {
      BondsRef.child(this.bond['.key']).remove()
      this.isOpen = false
    }
  },
})

//
// Read a Bond
//
const checkBond = {
  template: '#checkBond',

  firebase () {
    return {
      bond: {
        source: BondsRef.child(this.$route.params.id),
        asObject: true
      }
    }
  },

  data () {
    return {
      auth: {},
      isAuthed: false,
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

  created () {
    this.auth = firebase.auth()
    this.auth.onAuthStateChanged((user) => {
      this.checkAuthUser(user)
      this.$forceUpdate()
    })
  }
}
