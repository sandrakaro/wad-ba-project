<script setup>
/**
 * post_item.vue renders ONE post card.
 *
 * This is Task 4.1. The important detail is that the component receives only an
 * id, not the post object. It then asks the global store for the post with that
 * id. The task says a post "has to be a component that relies on the Vuex global
 * store to acquire/fetch its content information", and passing an id makes that
 * literally true: the component fetches its own content from the store instead of
 * being handed it by its parent.
 *
 * The markup below is the same structure Homework 2 generated with
 * document.createElement, because main.css still targets those exact elements and
 * relationships (article.post, article > header, .post-image + p, and
 * article > header ~ footer).
 */

import { computed } from 'vue'
import { useStore } from 'vuex'
import { asset } from '../utils/assets'

/**
 * defineProps declares what the parent is allowed to pass in. postId is required
 * and has to be a Number, so if HomeView forgets to pass it Vue warns us in the
 * console instead of quietly rendering a broken card.
 *
 * We keep the result in "props" so we can read props.postId later. Props are
 * read-only on purpose: a child must never change data that belongs to its
 * parent, or two components would end up disagreeing about the same value.
 */

const props = defineProps({

  postId: { type: Number, required: true }

})

// useStore() finds the store that main.js installed with app.use(store).
const store = useStore()

/**
 * ### Getting this post's data out of the store ###
 * computed, not a method, because computed caches its result and only recomputes
 * when a dependency changes. A method would re-run on every single render of the
 * component.
 *
 * The dependency here is state.posts, reached through the postById getter. So when
 * a like changes post.likes, this computed recalculates and the template updates.
 * No querySelector, no manual dom work.
 */

const post = computed(() => store.getters.postById(props.postId))

/**
 * The date is stored in posts.json as an ISO 8601 string, because json has no date
 * type. new Date() turns it back into a real Date object and toLocaleDateString()
 * formats it for display.
 *
 * timeZone: "UTC" is not optional. The timestamps are stored in UTC, so without it
 * a post created late in the UTC day would be shown as the NEXT day for a viewer
 * in Estonia, which is UTC+2 or UTC+3.
 *
 * Formatting stays in the component because it is a presentation concern. The
 * store keeps the raw timestamp, which is what lets us format it differently later
 * or sort by date.
 */

const formattedDate = computed(() =>
  new Date(post.value.createdAt).toLocaleDateString('en-US', {

    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'

  })
)

/**
 * (Task 4.2 - like button)
 *
 * The component must never do post.value.likes++ itself. State may only be changed
 * inside a mutation, so it goes through dispatch to the store.
 */
 const onLike = () => {
  store.dispatch('likePost', props.postId)
}
</script>

<template>

  <!-- article.post, and the header must be a DIRECT child of it. main.css uses
       the child combinator article > header, so wrapping it in another element
       would silently drop the green header bar. -->

  <article class="post">
    <header class="post-header">
        
      <!-- :src with the colon means "bind this to a javascript expression". The
           asset() helper puts the deployment prefix in front of the path from
           posts.json. Without the colon the browser would literally request a file
           called asset(post.author.avatar). -->
           
      <img
        :src="asset(post.author.avatar)"
        :alt="post.author.name + ' avatar'"
        class="author-avatar"
      />
      <span class="post-date">{{ formattedDate }}</span>
    </header>

    <div class="post-content">
      <!-- v-if replaces the if (post.image) check from Homework 2. For a text
           only post the <img> is never created at all, it is not just hidden.

           We must never render an <img> with an empty src: the browser treats
           src="" as a request for the page itself and fires a second page load.
           That is why posts without an image have null, not "". -->
      <img
        v-if="post.image"
        :src="asset(post.image)"
        :alt="post.imageAlt"
        class="post-image"
      />
      <!-- {{ }} escapes its content, so this is as safe as textContent was in
           Homework 2. The post text comes from an external file, so innerHTML
           would be a way to run whatever markup someone put in there. -->
      <p class="post-text">{{ post.text }}</p>
    </div>

    <!-- This footer has to stay AFTER the header as a sibling, because main.css
         styles it with the general sibling selector article > header ~ footer. -->
    <footer class="post-footer">
      <!-- (Task 4.2 - like button): -->
      <button type="button" class="like-btn" aria-label="Like post" @click="onLike">
        👍
      </button>
      <!-- The count comes straight from the store, so it updates by itself as
           soon as a mutation changes post.likes. -->
      <span class="like-count">{{ post.likes }} likes</span>
    </footer>
  </article>
</template>
