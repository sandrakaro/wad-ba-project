<script setup>
/**
 * home_view.vue is the main page, the feed with the posts. This is Task 1.1.
 *
 * It is a view, not a component, because the router shows it for the "/" route.
 * Its job is small on purpose: ask the store for the list of posts and render one
 * PostItem per post. All the post markup lives in post_item.vue and all the data
 * lives in the store, so there is nothing else to do here.
*/

import { computed } from 'vue'
import { useStore } from 'vuex'
import PostItem from '../components/post_item.vue'

const store = useStore()

/**
 * A reference to the array inside the store, not a copy of it.
 *
 * computed, so it is cached and only recalculates when state.posts changes. And we
 * only read it here: a view must never push into or edit this array, because that
 * would change state without going through a mutation. If we ever need to add or
 * remove posts from the page, it goes through an action.
*/
const posts = computed(() => store.getters.allPosts)

/**
 * TODO (Task 4.3 - reset likes button): whoever takes this task, add the handler
 * here.
 * 
 * The store side is NOT written yet either. src/store/index.js has a TODO marking
 * where the resetLikes action and the RESET_LIKES mutation go. Both halves are
 * needed before the button does anything.
*/
</script>

<template>
  <!-- The same three column layout as Homework 2: two empty sidebars and the feed
       in the middle. main.css gives the sidebars flex 1 and the feed flex 2, so the
       feed ends up twice as wide. -->
  <div class="container">
    <aside class="sidebar left-sidebar"></aside>

    <main class="feed">
      <!-- :key is required in a v-for. Vue reuses dom nodes by position, so
           without a stable key, adding or removing a post makes Vue patch the
           wrong card and the text ends up in the wrong place. post.id is unique
           and stable, which is exactly what a key has to be.

           :post-id is how a camelCase prop is written in a template. Vue converts
           post-id to postId for us. -->
      <PostItem
        v-for="post in posts"
        :key="post.id"
        :post-id="post.id"
      />

      <!-- TODO (Task 4.3 - reset likes button): the person who owns this task adds
           @click="onResetLikes" to this button and writes onResetLikes() in the
           script block above. The button is already styled and placed like in
           Figure 3, so only the click handler is missing. -->
      <button type="button" class="reset-likes-btn">
        Reset likes
      </button>
    </main>

    <aside class="sidebar right-sidebar"></aside>
  </div>
</template>
