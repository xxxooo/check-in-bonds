
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
      this.message = ''
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
        this.bondData.updator = firebase.auth().currentUser.email
        BondsRef.push(this.bondData, (error) => {
          if (error) {
            this.message = error
          } else {
            this.isOpen = false
          }
        })
      } else {
        this.message = '請輸入姓名'
      }
    },
    update () {
      if (this.bondData.name.length > 0) {
        this.bondData.updator = firebase.auth().currentUser.email
        BondsRef.child(this.bond['.key']).update(this.bondData, (error) => {
          if (error) {
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
    return {
      isOpen: false,
      logoImg: null,
      logoScaling: 1.125,
      qrOptions: {
        level: 'H',
        size: 356,
        padding: 20,
        foreground: '#853c10',
        background: '#fff0a2'
      }
    }
  },

  computed: {
    modeQuery () {
      return this.$route.query.mode ? '?mode=' + this.$route.query.mode : ''
    },
    checkBondUrl () {
      //return 'https://xxxooo.github.io/monkey-pa/#/bond/'+ this.bond['.key'] + this.modeQuery
      return window.location.href.split('#')[0] + '#/bond/' + this.bond['.key'] + this.modeQuery
    }
  },

  watch: {
    isOpen (val) {
      if (val && this.bond['.key']) {
        this.qrCode()
      }
    }
  },

  methods: {
    getLogoSize (aspectRatio) {
      if (aspectRatio > 0) {
        var factor = 1 - 64 / (this.checkBondUrl.length + 128);
        return Math.sqrt(0.24 * factor * this.qrOptions.size * this.qrOptions.size / aspectRatio) * this.logoScaling;
      } else {
        return 0;
      }
    },
    qrCode () {
      this.qrOptions.element = document.getElementById("qrCode")
      this.qrOptions.value = this.checkBondUrl
      if (this.checkBondUrl.length > 64) {
        this.qrOptions.size = 384
      }
      let qr = new QRious(this.qrOptions),
        ctx = qr.element.getContext('2d')

      // draw name
      ctx.font = '10px Helvetica';
      ctx.textAlign = 'end';
      ctx.fillText(this.bond.name, this.qrOptions.size - 22, this.qrOptions.size - 9);

      // draw center logo
      if (this.logoImg) {
        let imgRatio = this.logoImg.width / this.logoImg.height,
          drawHeight = this.getLogoSize(imgRatio),
          drawWidth = imgRatio * drawHeight

        ctx.drawImage(this.logoImg, 0.5 * (this.qrOptions.size - drawWidth), 0.5 * (this.qrOptions.size - drawHeight), drawWidth, drawHeight)
      }
    },
    saveBlobAs (blob, fileName) {
      var a = document.createElement("a")
      a.download = fileName
      a.href = window.URL.createObjectURL(blob)
      a.style = "display: none"
      document.body.appendChild(a)
      a.click()
      a.parentNode.removeChild(a)
    },
    getFileName () {
      return Date.now().toString().slice(4,10) + '_' + this.bond.name + '.png'
    },
    download () {
      if (this.qrOptions.element.width > 0) {
        let fileName = this.getFileName()
        this.qrOptions.element.toBlob((blob) => {
          this.saveBlobAs(blob, fileName)
        });
      }
    }
  },

  mounted () {
    let img = new Image()
    img.src = './img/qr-logo.png'
    img.onload = () => { this.logoImg = img }
  }
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
