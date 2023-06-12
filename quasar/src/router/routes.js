
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/HomePage.vue'), name: "Home" },
      { path: '/index', component: () => import('pages/IndexPage.vue'), name: "Index" },
      { path: '/forgot', component: () => import('pages/ForgotPage.vue'), name: "Forgot" },
      { path: '/setting', component: () => import('pages/SettingPage.vue'), name: "Setting" },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
