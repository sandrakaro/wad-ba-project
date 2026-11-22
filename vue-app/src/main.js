/**
 * main.js is the entry point of the whole app.
 *
 * index.html only contains an empty <div id="app">. This file creates the Vue
 * application out of App.vue, installs the two plugins we use and mounts the
 * result into that div. Nothing else happens here, so if the app renders nothing
 * at all, this is the first file to check.
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/main.css'

// createApp builds an independent app instance out of the root component.
const app = createApp(App)

/**
 * ### Installing the plugins ###
 * Vuex and vue-router are plugins, not plain imports, so they have to be
 * installed with .use() BEFORE mount().
 *
 * .use(store) is what provides the store to every component, which is how
 * useStore() finds it later. Forget this line and useStore() throws
 * "injection 'store' not found" and the whole feed breaks.
 *
 * .use(router) is what registers <RouterLink> and <RouterView> globally, so we
 * can use them in any template without importing them.
 */
app.use(store)
app.use(router)

/**
 * Mount into the <div id="app"> from index.html.
 *
 * Vue 3 keeps that div and replaces its children, so #app stays in the dom and is
 * the real parent of the header, the view and the footer. That is why the page
 * layout in main.css is on #app and not on <body> like in Homework 2.
 */
app.mount('#app')
