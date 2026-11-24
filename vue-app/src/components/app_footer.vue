<script setup>
/**
 * app_footer.vue is the page footer. This is Task 3.
 *
 * It is used once, in App.vue, outside the router, so it appears on both pages and
 * is never re-created when we navigate. main.css styles it with the .app-footer
 * class, and it keeps the Homework 2 look with the dark green bar at the bottom.
 */

// Getting the year
const year = new Date().getFullYear()
</script>

<template>
  <!-- Our footer that includes the traditional copyright and also has our names and team name.-->
  <footer class="app-footer">
    <p>&copy; {{ year }} PostIt - Web Application Development</p>
    <p>University of Tartu, Team BA, Sandra, Arnold and Hanna Liisa</p>
  </footer>
</template>
