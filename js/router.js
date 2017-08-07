
function getComponent (resolve, jsPath, tmplPath) {
  let isLoaded = !tmplPath

  function checkLoaded () {
    if (isLoaded) {
      resolve(ResponseJS)
    } else {
      isLoaded = true
    }
  }

  if (tmplPath) {
    Vue.http.get(tmplPath).then(response => {
      let dom = document.createElement("div")
      dom.innerHTML = response.body
      document.getElementsByTagName('body')[0].appendChild(dom)
      checkLoaded()
    }, response => {
      console.log("ERROR: failed to load template")
    });
  }

  let script = document.createElement('script')
  script.src = jsPath
  document.getElementsByTagName('head')[0].appendChild(script)
  script.onload = () => { checkLoaded() }
}


function main (resolve) { getComponent(resolve , 'js/components/main.js', 'templates/main.html') }
function login (resolve) { getComponent(resolve , 'js/components/login.js', 'templates/login.html') }
function logout (resolve) { getComponent(resolve , 'js/components/logout.js') }
function bondsIndex (resolve) { getComponent(resolve , 'js/components/bonds.js', 'templates/bonds') }
function checkBond (resolve) { getComponent(resolve , 'js/components/check_bond.js', 'templates/bonds/check_bond.html') }
function pageNotFound (resolve) { getComponent(resolve , 'js/components/404.js', 'templates/404.html') }


const router = new VueRouter({
  routes: [
    { path: '/', component: main },
    { name: 'login', path: '/login', component: login },
    { name: 'logout', path: '/logout', component: logout },
    { name: 'bonds', path: '/bonds', component: bondsIndex },
    { name: 'check-bond', path: '/bond/:id', component: checkBond },
    { path: '*', component: pageNotFound }
  ]
})
