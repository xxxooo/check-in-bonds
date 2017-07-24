
const initBond = {
  name: '',
  info: '',
  email: '',
  phone: '',
  code: '',
  commitTime: '',
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
    },
    deleting () {
      let msg = '是否要刪除這張票卷？'
      if (confirm(msg)) {
        BondsRef.child(this.bond['.key']).remove()
      }
    }
  },
})

//
// Create a Bond
//
// const newBond = {
//   template: '#addBond',
//
//   data () {
//     return {
//       newBond: initBond
//     }
//   },
//
//   methods: {
//     checkAuth () {
//       if(!firebase.auth().currentUser) {
//         this.$router.push('/login')
//       }
//     },
//     addBond () {
//       if (this.newBond.name.length > 0) {
//         BondsRef.push(this.newBond)
//         this.newBond = initBond
//       }
//     },
//   },
//
//   created () {
//     this.checkAuth()
//   }
// }

//
// Read a Bond
//
const viewBond = {
  template: '#viewBond',

  firebase () {
    return {
      bond: {
        source: BondsRef.child(this.$route.params.id),
        asObject: true
      }
    }
  },

  methods: {
    checkAuth () {
      if(!firebase.auth().currentUser) {
        this.$router.push('/login')
      }
    },
  },

  created () {
    this.checkAuth()
  }
}

// //
// // Update a Bond
// //
// const editBond = {
//   template: '#editBond',
//
//   firebase () {
//     return {
//       bond: {
//         source: BondsRef.child(this.$route.params.id),
//         asObject: true
//       }
//     }
//   },
//
//   methods: {
//     checkAuth () {
//       if(!firebase.auth().currentUser) {
//         this.$router.push('/login')
//       }
//     },
//   },
//
//   created () {
//     this.checkAuth()
//   }
// }
//
// //
// // Delete a Bond
// //
// const deleteBond = {
//   template: '<p>delete</p>',
//
//   methods: {
//     checkAuth () {
//       if(!firebase.auth().currentUser) {
//         this.$router.push('/login')
//       }
//     },
//   },
//
//   created () {
//     this.checkAuth()
//     BondsRef.child(this.$route.params.id).remove()
//       .then(() => {
//         console.log("Remove succeeded.")
//       })
//       .catch((error) => {
//         console.log("Remove failed: " + error.message)
//       });
//     this.$router.push('/bonds')
//   }
// }
