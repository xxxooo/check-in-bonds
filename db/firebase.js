
const config = {
  apiKey: 'AIzaSyAYorRrVZ5wpOX69Vyz30UoY-KL8IdQ-Hw',
  authDomain: 'monkey-dd.firebaseapp.com',
  databaseURL: 'https://monkey-dd.firebaseio.com',
  projectId: 'monkey-dd',
  storageBucket: 'monkey-dd.appspot.com',
  messagingSenderId: '622032691689'
}
firebase.initializeApp(config)

const BondsRef = firebase.database().ref('bonds')

//
// Need auth to do something
//
// const authRequired = function () {
//   if(!firebase.auth().currentUser) {
//     this.$router.push('/login')
//   }
// }
//
// const authRedirect = function (path) {
//   if(this.auth.currentUser) {
//     this.$router.push(path)
//   }
// }
