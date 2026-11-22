# PostIt - Homework 3 (Vue + Vuex)

This is the **Homework 3** version of our project. Homework 1 and 2 were plain HTML/CSS/JavaScript
pages. Homework 3 needed to be built with **Vue + Vuex**, so we rebuiltthe frontend as a
single-page application (SPA) in this `vue-app/` folder.

## 1. What this app is, in one paragraph

The app is a **single page** (`index.html`) that contains **one** Vue application. What the
homework calls "pages" are implemented as **views**: `HomeView` and `SignupView`. A router
(`vue-router`) decides which view is shown based on the URL. The **header and the footer are
outside the router**, so they are mounted once and stay on screen while only the middle part
changes. The posts and their like counts live in a **global store** (`Vuex`), so any component can
read them without passing data through many layers.

The homework  stated that a "page" *"might mean a view or a single page component (SPC); you
should know which one is better to use."* 

We chose **views**, because the header and footer must appear on both pages. If we had made two independent single page components, we would have
copy-pasted the header twice and they would have been two separate applications. With one app shell and a router, the header and footer are defined once and never re-rendered when we navigate. We felt that this was cleaner, neater and also would be conserving load times aswell as resource usage.

---

## 2. How to run it

Requirements: **Node.js** (LTS) and npm.

```bash
cd vue-app
npm install      # only needed the first time, or after package.json changes
npm run dev
```

Then open the URL that the terminal prints. It is **not** `http://localhost:5173/`, it is:

```
http://localhost:5173/wad-ba-project/
```

The `/wad-ba-project/` part is not a typo. It comes from `base` in `vite.config.js` (explained in
section 7).

Other commands:

| Command | What it does |
|---|---|
| `npm run dev` | Starts the development server with hot reload. Use this while coding. |
| `npm run build` | Builds the production version into `dist/`. |
| `npm run preview` | Serves the built `dist/` locally, to check the production build. |

Useful URLs while developing:

- `http://localhost:5173/wad-ba-project/` is the home page (the feed)
- `http://localhost:5173/wad-ba-project/#/signup` is the signup page

---

## 3. Where everything is


```
vue-app/
|-- index.html                  The ONLY html file. Holds <div id="app">.
|-- vite.config.js              Build config. Contains `base: '/wad-ba-project/'`.
|-- package.json                Dependencies and the npm scripts.
|-- README.md                   This file. How the app fits together.
|
|-- public/                     Files copied as-is into the build. Served from the site root.
|   `-- res/images/             All the pictures (avatars and post photos).
|
`-- src/
    |-- main.js                 Entry point. Creates the app, installs store + router, mounts.
    |-- App.vue                 The shell: <AppHeader /> + <RouterView /> + <AppFooter />.
    |
    |-- assets/
    |   `-- main.css            ALL the styling. Ported from Homework 2's res/css/index.css.
    |
    |-- data/
    |   `-- posts.json          The 10 posts. This is the data the feed is built from.
    |
    |-- utils/
    |   `-- assets.js           asset() helper. Fixes image paths for GitHub Pages.
    |
    |-- router/
    |   `-- index.js            URL to view mapping. The two routes are "/" and "/signup".
    |
    |-- store/
    |   `-- index.js            The Vuex global store. Holds the posts.
    |
    |-- components/             Reusable pieces, used by more than one view.
    |   |-- app_header.vue      Header + navigation links (Task 2).
    |   |-- app_footer.vue      Page footer with copyright (Task 3).
    |   `-- post_item.vue       One post card (Task 4.1).
    |
    `-- views/                  Route-level components, one per "page".
        |-- home_view.vue       The main page / feed (Tasks 1.1, 4.3).
        `-- signup_view.vue     The signup page (Tasks 1.2, 5, 6).
```

### Which file to open for what

| I want to... | Open |
|---|---|
| change what a post looks like | `src/components/post_item.vue` |
| change the post data | `src/data/posts.json` |
| add or change a page | `src/router/index.js` plus a new file in `src/views/` |
| change the header or the nav links | `src/components/app_header.vue` |
| change the footer | `src/components/app_footer.vue` |
| change any styling | `src/assets/main.css` |
| change what the store holds | `src/store/index.js` |

### The difference between `components/` and `views/`

- A **view** is a component that the **router** shows. It owns a whole page. `home_view` and
  `signup_view` are views.
- A **component** is a reusable piece that a view (or another component) puts on screen.
  `app_header`, `app_footer` and `post_item` are components.

This naming is a convention from the official Vue style guide. It lets anyone open the folder and
immediately see which files are pages and which are building blocks.

---

## 4. How a page is put together

```
index.html
`-- <div id="app">                     <- the mount point, from index.html
    `-- App.vue                        <- the shell
        |-- <AppHeader />              <- always visible (Task 2)
        |-- <RouterView />             <- ONLY this part changes with the URL
        |   |-- HomeView   when URL is #/         (Task 1.1)
        |   `-- SignupView when URL is #/signup   (Task 1.2)
        `-- <AppFooter />              <- always visible (Task 3)
```

`HomeView` then renders ten `<PostItem>` components inside `<main class="feed">`.

**Why the header and footer are in `App.vue` and not in the views:** `App.vue` is mounted once. The
router only replaces what is inside `<RouterView />`. So navigating between the two pages destroys and
recreates only the middle, and the header/footer never unmount. That is the entire answer to Tasks 2
and 3 ("the header should be a component that appears on both pages").

---

## 5. The data flow

The posts are **not** hard-coded in the templates. They live in the Vuex store.

```
src/data/posts.json
        |  imported once at startup
        v
src/store/index.js          state.posts = [ ...10 posts ]
        |
        |  read through a getter
        v
HomeView                    posts = store.getters.allPosts
        |  v-for, passing only an id
        v
PostItem (prop: postId)     post = store.getters.postById(postId)
        |
        v
the template                {{ post.text }}, {{ post.likes }}, ...
```

Why `PostItem` receives only an **id** and not the whole post object: the task says a post "has to be
a component that relies on the Vuex global store to acquire/fetch its content information". Passing an
id and looking the post up in the store makes that literal. The component genuinely fetches its own
content from the global store instead of being handed it by its parent.

### The four layers of Vuex

| Layer | Lives in | Purpose | Rule |
|---|---|---|---|
| **state** | `state: () => ({ ... })` | The actual data. | Must be a **function**, so each store instance gets its own object. |
| **getters** | `getters: { ... }` | Read-only, cached access to state. | Use a getter that returns a function for lookups by id. |
| **mutations** | `mutations: { ... }` | The **only** place state may be changed. | Must be **synchronous**. |
| **actions** | `actions: { ... }` | The layer components call. May be async. | Commits mutations; never changes state directly. |

Components should always go **component -> action -> mutation -> state**. The extra action layer is what
lets us later replace the local JSON with a real API call without touching any component.

---

## 6. Conventions used in this code

- **Comments are in English** and explain *why* a line exists, not just what it does.

- **`snake_case` filenames** for components and views (`app_header.vue`, `home_view.vue`). The import path
  must match the filename **character for character**, because Linux is case-sensitive, so `AppHeader.vue` and
  `app_header.vue` are different files. If you add a file, keep this convention.

- **`<script setup>` only**, no Options API. Everything a template needs is declared at the top level of
  `<script setup>`.

- **One `<script>` block per file.** A plain `<script>` block's top-level variables are **not** visible to the
  template, which is a common source of "undefined" bugs. If you need something in the template, it goes in
  `<script setup>`.

- **All styling in one file** (`src/assets/main.css`), not `<style scoped>` blocks. This keeps the Homework 1
  CSS selectors (descendant, child, adjacent sibling, general sibling) working across components.

---

## 7. Adding a new post

Edit `src/data/posts.json`. The array order is the display order, so put the newest post first.

```json
{
    "id": 11,
    "author": {
        "name": "Hannaliisa",
        "avatar": "res/images/profile.png"
    },
    "createdAt": "2026-11-22T10:00:00Z",
    "text": "The post body goes here.",
    "image": "res/images/delta.png",
    "imageAlt": "What the picture shows",
    "likes": 0
}
```

Rules:

- `id` must be **unique** and is a number. It is what the like button uses to find the right post.
- `createdAt` is ISO 8601 **in UTC** with a `Z`. The renderer formats it for display.
- `image` and `imageAlt` are either both a path and a description, or both `null` for a text-only post.
- Never put an **empty string** in `image`. The browser treats `src=""` as a request for the page itself.
- JSON has no comments and no trailing commas. Validate the file at <https://jsonlint.com> after editing.

The images themselves go in `public/res/images/`, and the path in the JSON starts with `res/images/`.

---

## 8. Deployment (GitHub Pages)

```bash
npm run build          # produces dist/
npm install -D gh-pages
npx gh-pages -d dist   # publishes dist/ to the gh-pages branch
```

Then in GitHub: **Settings > Pages > Source > `gh-pages` branch**.

The site is served from `https://<user>.github.io/wad-ba-project/`, which is exactly what
`base: '/wad-ba-project/'` in `vite.config.js` matches. If the repository is ever renamed, `base` must be
updated to match, or the deployed site will be blank.

Note that the old Homework 1/2 static pages at the repository root are **not** deployed any more. A GitHub
Pages site serves exactly one thing, so the Vue build replaces the old site at that URL.
