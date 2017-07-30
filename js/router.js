
const router = new VueRouter({
  routes: [
    { path: '/', component: main },
    { name: 'login', path: '/login', component: appLogin },
    { name: 'logout', path: '/logout', component: appLogout },
    { name: 'bonds', path: '/bonds', component: bondsIndex },
    { name: 'check-bond', path: '/bond/:id', component: checkBond },
  ]
})
