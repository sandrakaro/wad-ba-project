<script setup>
/**
 * app_header.vue is the header with the navigation links. This is Task 2.
 *
 * Like the footer it is used once, in App.vue, outside the router, so it appears
 * on both pages and never unmounts when we navigate. That is why the header is not
 * repeated inside HomeView and SignupView.
 */

import { ref } from 'vue'
import { asset } from '../utils/assets'

/**
 * ### The dropdown menu ###
 * In Homework 2 this was a classList.toggle plus a window click listener that
 * closed the menu again. Here a single boolean is the state and Vue does the dom
 * work: the template adds or removes the "show" class whenever this changes.
 *
 * ref() wraps the value so Vue can watch it. That is why it is read and written as
 * isMenuOpen.value and not just isMenuOpen. In the template the .value is not
 * needed, Vue unwraps it for us there.
 */
const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

/**
 * The avatar lives in public/res/images/, so it is served from the site root.
 * asset() puts the deployment prefix in front of it, which is what makes the path
 * work on GitHub Pages where the app is served from a subpath instead of "/".
 */
const profileIcon = asset('res/images/profile.png')
</script>

<template>
  <header>
    <nav class="nav-bar">
      <div class="nav-links">

        <!-- RouterLink and NOT <a href>. A plain <a href> would make the browser
             request a new document, which reloads the whole app. RouterLink
             intercepts the click and asks the router to swap the view instead, so
             the page never reloads and state like the like counts survives.

             It also adds the classes router-link-active and
             router-link-exact-active by itself, which we can style to show which
             page we are on. No javascript needed for that. -->
        <RouterLink to="/" class="nav-link">Home</RouterLink>

        <!-- Just a vertical line to separate the two links. -->
        <span class="divider">|</span>
        <RouterLink to="/signup" class="nav-link">Sign up</RouterLink>

      </div>

      <div class="user-profile">

        <!-- .prevent is a modifier, it calls event.preventDefault() for us. It
             stops the href="#" from jumping to the top of the page. -->
        <a href="#" id="profileBtn" title="User Profile" @click.prevent="toggleMenu">

          <img :src="profileIcon" alt="User Profile Icon" class="profile-icon" />
        
        </a>
        
        <!-- :class="{ show: isMenuOpen }" uses the object syntax: the key is the
             class name, the value decides whether it is added. This is the whole
             replacement for the classList.toggle() from Homework 2. -->
        <div class="dropdown-content" :class="{ show: isMenuOpen }">

          <a href="#">John Doe</a>

          <a href="#">john.doe@ut.ee</a>

          <RouterLink to="/signup">logout</RouterLink>

        </div>
      </div>
    </nav>
  </header>
</template>
