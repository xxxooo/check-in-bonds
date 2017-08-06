
function getComponent (resolve, jsPath, tmplPath) {
  let isLoaded = false

  function checkLoaded () {
    if (isLoaded) {
      resolve(ResponseJS)
    } else {
      isLoaded = true
    }
  }

  if (tmplPath) {
    $.get(tmplPath).done((template) => {
      $('body').append(template)
      checkLoaded()
    })
  }
  $.getScript(jsPath).done(checkLoaded)
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
