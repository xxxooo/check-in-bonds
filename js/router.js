
const router = new VueRouter({
  routes: [
    { path: '/', component: main },
    { path: '/login', component: appLogin },
    { path: '/logout', component: appLogout },
    { path: '/bonds', component: bondsIndex },
    { name: 'new-bond', path: '/bond/new', component: newBond },
    { name: 'view-bond', path: '/bond/:id', component: viewBond },
    { name: 'edit-bond', path: '/bond/:id/edit', component: editBond },
    { name: 'delete-bond', path: '/bond/:id/delete', component: deleteBond }
  ]
})
