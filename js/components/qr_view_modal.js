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
