/**
 * vite.config.js configures the build tool.
 *
 * Almost nothing to do here, but the base option is important and easy to get
 * wrong, so it has its own explanation.
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // Without this plugin Vite does not understand .vue files at all.
  plugins: [vue()],

  /**
   * ### base ###
   * GitHub Pages serves our repository from a SUBPATH, not from the domain root:
   * https://<user>.github.io/wad-ba-project/
   *
   * Vite puts this prefix in front of every asset url it generates during the
   * build. Without it the built index.html would ask for /assets/index-xxxx.js,
   * which is the domain root and not our repository, and the page would be blank
   * with a 404 in the console.
   *
   * It also affects development: the app runs at localhost:5173/wad-ba-project/
   * and not at localhost:5173/.
   *
   * If the repository is ever renamed, this value has to change with it.
   */
  base: '/wad-ba-project/'
})
