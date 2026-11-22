/**
 * utils/assets.js holds one small helper that fixes image paths.
 *
 * The problem it solves: posts.json stores image paths as plain strings, for
 * example "res/images/profile.png". Vite cannot look inside a string, so it cannot
 * rewrite that path at build time like it does for paths written directly in a
 * template or imported in a script.
 *
 * The images live in public/, which is copied as-is into the build and served from
 * the site root. That root is not "/" on GitHub Pages though, it is
 * "/wad-ba-project/". BASE_URL is exactly that prefix and it always ends with "/".
 *
 * So asset("res/images/x.png") gives "/wad-ba-project/res/images/x.png".
 *
 * @param {string} path - a path starting from the site root, e.g. "res/images/x.png"
 * @returns {string} the same path with the deployment prefix in front of it
 */
export function asset(path) {
  return import.meta.env.BASE_URL + path
}
