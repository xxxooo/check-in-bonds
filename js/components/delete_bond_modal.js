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
