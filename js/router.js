
const router = new VueRouter({
  routes: [
    { path: '/', component: main },
    { path: '/login', component: appLogin },
    { path: '/logout', component: appLogout },
    { path: '/bonds', component: bondsIndex },
    { name: 'check-bond', path: '/bond/:id', component: checkBond },
  ]
})
