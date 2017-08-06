
var initBond = {
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
ResponseJS = {
  template: '#indexBonds',

  firebase () {
    return {
      bonds: BondsRef
    }
  },

  data () {
    return {
      ready: false,
      slim: false,
      mode: null,
      newBond: initBond,
      pickedBond: {}
    }
  },

  computed: {
    modeQuery () {
      return this.$route.query.mode ? '?mode=' + this.$route.query.mode : ''
    }
  },

  methods: {
    checkAuth () {
      if(!firebase.auth().currentUser) {
        this.$router.push('/login' + this.modeQuery)
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
    },
    getMailTo (bond) {
      return 'mailto:' + bond.email + '?subject=大稻埕懷舊畢業趴 報名通知'
    },
    downloadQrCode (idx) {
      this.producing(this.bonds[idx])
      setTimeout(() => {
        this.$refs['qr-view-modal'].download()
        this.$refs['qr-view-modal'].isOpen = false

        if (idx + 1 < this.bonds.length) {
          setTimeout(() => {
            this.downloadQrCode(idx + 1)
          }, 0)
        }
      },0)
    },
    producingAll () {
      let msg = '是否要下載全部 ' + this.bonds.length + ' 張 QRcode 圖片？'
      if (confirm(msg)) {
        this.downloadQrCode(0)
      }
    }
  },

  beforeCreate () {
    BondsRef = dbGetBondsRef(this.$route.query.mode)
  },

  created () {
    firebase.auth().onAuthStateChanged((user) => {
      this.ready = true
      this.$forceUpdate()
    })
    this.checkAuth()

    this.mode = this.$route.params.mode
  }
}
