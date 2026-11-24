/**
 * store/index.js is the Vuex global store.
 *
 * This is where the posts actually live now. No template contains post text or a
 * like count. HomeView asks the store for the list of posts, and every PostItem
 * asks the store for its own post by id. That is Task 4.1.
 *
 * Vuex is a global store because main.js installs it with app.use(store), which
 * provides it to every component in the tree. So any component can call useStore()
 * and get the same instance with the same data. That is why pressing like in one
 * post will update the count that another component reads.
 *
 * The four parts of a store and the rule for each:
 *   state     the data itself
 *   getters   read-only, cached access to the data
 *   mutations the ONLY place the data may be changed, and they must be synchronous
 *   actions   the layer components call, may be async, they commit mutations
 *
 * The flow is always component -> action -> mutation -> state. The extra action
 * layer looks pointless today because nothing is async, but it is what lets us
 * swap the local json for a real api call later without touching a component.
*/
import { createStore } from 'vuex'
import seedPosts from '../data/posts.json'

export default createStore({

  /**
   * ### state ###
   * state has to be a FUNCTION, not a plain object.
   *
   * Vuex calls this function once per store instance, so each instance gets its
   * own fresh object. A plain object literal would be shared module state, which
   * causes bugs in tests and in server side rendering where two apps would end up
   * editing the same array.
   */
  state: () => ({

    /**
     * The posts come from src/data/posts.json, which is imported at the top of
     * this file. Because it is a real import, Vite reads the json at build time,
     * inlines it into the bundle and validates it. No fetch, no loading state and
     * no network error to handle, which is why we went this way instead of
     * fetching the file at runtime like in Homework 2.
     *
     * We map over the array and spread each post into a new object. This is a
     * shallow copy on purpose. Pressing like changes post.likes, which is a
     * top-level field, so a shallow copy is enough to keep the store's copy
     * separate from the imported module object. If we ever changed something
     * nested like post.author.name we would need a deep copy instead.
    */
    posts: seedPosts.map(post => ({ ...post }))
  }),

  /**
   * ### getters ###
   * Getters are like computed properties for the store. They are cached and only
   * recomputed when their dependency changes, so templates can use them freely
   * without worrying about performance.
   */
  getters: {

    // Plain getter: returns the whole array. Cached, so reading it from ten
    // PostItem components is cheap.
    allPosts: state => state.posts,

    /**
     * This getter RETURNS A FUNCTION, which is a different thing from the one
     * above. A normal getter cannot take an argument, so to look something up by a
     * value we only know at runtime (the id of the post we want) the getter has to
     * return a function that takes that id.
     *
     * The catch: a getter that returns a function is NOT cached, because Vuex
     * cannot know which argument it will be called with next. That is fine here,
     * find() over ten objects is nothing.
     *
     * It is basically "SELECT * FROM posts WHERE id = ?".
    */
    postById: state => id => state.posts.find(post => post.id === id)
  },

  /**
   * ### mutations ###
   * Mutations are the only place state may be changed. They MUST be synchronous.
   * That is a hard Vuex rule, not a style preference: the devtools take a snapshot
   * after every mutation, and it can only do that reliably if the mutation has
   * finished by the time it returns.
   */
  mutations: {

    /**
     * (Task 4.2 - like button): The mutation
     * that increases one post's like count.
     * 
    */
    toggleLike(state, postId) {
      const post = state.posts.find(p => p.id === postId);
      if (post) {
        // If the post isn't yet liked, let's set it to true and add a like 
        if (!post.isLiked) {
          post.likes++;
          post.isLiked = true;
        } else {
          // If it was already liked, let's take the like away and set it to false
          post.likes--;
          post.isLiked = false;
        }
      }
    },

    /**
     * (Task 4.3 - reset likes button): the mutation that sets every post's
     * like count back to zero goes here.
    */
    resetAllLikes(state) {
      state.posts.forEach(post => {
        post.likes = 0;
        post.isLiked = false;
      });
    }
  },

  /**
   * ### actions ###
   * Actions are the layer a component actually calls. They cannot change state
   * themselves, they commit a mutation. That sounds like a pointless extra step,
   * but it is where an api call would go: the action awaits the response and then
   * commits the result. The component never has to know the difference.
   */
  actions: {

    /**
     * (Task 4.2 / 4.3): each action only needs to commit its mutation.
     * 
    */
    likePost({ commit }, postId) {
      commit('toggleLike', postId);
    },
    resetLikes({ commit }) {
      commit('resetAllLikes');
    }
  }
})
