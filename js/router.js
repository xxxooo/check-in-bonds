
const getComponent = (resolve, tmplPath, jsPath) => {
  $.get(tmplPath).done((template) => {
    $('body').append(template)
    $.get(jsPath).done((script) => {
      resolve(ResponseJS)
    })
  })
}

function Temp (resolve) { getComponent(resolve , 'temp/temp.html', 'js/temp.js') }
function Temp2 (resolve) { getComponent(resolve , 'temp/temp2.html', 'js/temp2.js') }

const router = new VueRouter({
  routes: [
    { path: '/', component: main },
    { name: 'login', path: '/login', component: appLogin },
    { name: 'logout', path: '/logout', component: appLogout },
    { name: 'bonds', path: '/bonds', component: bondsIndex },
    { name: 'check-bond', path: '/bond/:id', component: checkBond },
    { name: 'temp', path: '/temp', component: Temp },
    { name: 'temp2', path: '/temp2', component: Temp2 },
    { path: '*', component: pageNotFound }
  ]
})
