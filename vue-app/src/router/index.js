/**
 * router/index.js maps urls to views.
 *
 * We only need two routes, because Homework 3 asks for two "pages":
 *   "/"        -> HomeView    the feed with the posts
 *   "/signup"  -> SignupView  the signup form
 *
 * The note at the end of the homework pdf says the word "page" might mean a view
 * or a single page component and that we should know which one is better. We went
 * with views, because the header and the footer have to appear on both pages. With
 * one app shell and a router they are defined once and never re-rendered. With two
 * separate single page components we would have copy-pasted the header twice.
 */

import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/home_view.vue'
import SignupView from '../views/signup_view.vue'

const router = createRouter({
  /**
   * ### Why hash mode and not history mode ###
   * Hash mode gives us urls like /#/ and /#/signup. Everything after the # is
   * never sent to the server, so refreshing /#/signup still returns index.html.
   *
   * GitHub Pages is a static host and cannot rewrite unknown paths back to
   * index.html. With createWebHistory() a refresh on /signup would be a plain 404,
   * which is exactly why hash mode is the safe choice for us.
   *
   * import.meta.env.BASE_URL is the same "/wad-ba-project/" prefix that is in
   * vite.config.js, so the routes keep working when the app is served from a
   * subpath instead of the domain root.
   */
  
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/signup', name: 'signup', component: SignupView }
  ]
})

export default router
