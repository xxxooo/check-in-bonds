
function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

const initBond = {
  name: '',
  info: '',
  email: '',
  phone: '',
  number: '',
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

  created () {
    if(!firebase.auth().currentUser) {
      this.$router.push('/login')
    }
  }
}

//
// Create a Bond
//
const newBond = {
  template: '#addBond',

  data () {
    return {
      newBond: initBond
    }
  },

  methods: {
    checkAuth: function () {
      if(!firebase.auth().currentUser) {
        this.$router.push('/login')
      }
    },
    addBond: function () {
      if (this.newBond.name.length > 0) {
        BondsRef.push(this.newBond)
        this.newBond = initBond
      }
    },
  },

  created () {
    this.checkAuth()
  }
}

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
    checkAuth: function () {
      if(!firebase.auth().currentUser) {
        this.$router.push('/login')
      }
    },
  },

  created () {
    this.checkAuth()
  }
}

//
// Update a Bond
//
const editBond = {
  template: '#editBond',

  firebase () {
    return {
      bond: {
        source: BondsRef.child(this.$route.params.id),
        asObject: true
      }
    }
  },

  methods: {
    checkAuth: function () {
      if(!firebase.auth().currentUser) {
        this.$router.push('/login')
      }
    },
  },

  created () {
    this.checkAuth()
  }
}

//
// Delete a Bond
//
const deleteBond = {
  template: '<p>delete</p>',

  methods: {
    checkAuth: function () {
      if(!firebase.auth().currentUser) {
        this.$router.push('/login')
      }
    },
  },

  created () {
    this.checkAuth()
    BondsRef.child(this.$route.params.id).remove()
      .then(() => {
        console.log("Remove succeeded.")
      })
      .catch((error) => {
        console.log("Remove failed: " + error.message)
      });
    this.$router.push('/bonds')
  }
}
