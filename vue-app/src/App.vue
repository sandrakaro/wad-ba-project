<script setup>
/**
 * App.vue is the shell of the application.
 *
 * It only holds the two components that have to be on both pages (the header and
 * the footer) and a <RouterView /> in between. The router puts HomeView or
 * SignupView into that hole depending on the url.
 *
 * This one file is the answer to Tasks 2 and 3: the header and the footer are
 * written once and appear on both "pages", because they sit outside the router and
 * are never destroyed when we navigate.
 */
import AppHeader from './components/app_header.vue'
import AppFooter from './components/app_footer.vue'
</script>

<template>
  <!-- Header and footer are OUTSIDE <RouterView>, so they are mounted once
       and never re-created when the route changes. -->
  <AppHeader />

  <!-- The router swaps only this element's content between views. -->
  <RouterView />

  <AppFooter />
</template>
