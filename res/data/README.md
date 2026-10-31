# `posts.json`

Data source for the post feed on `index.html`.

Instead of hard-coding every post into the HTML, the feed is described here as data and turned into DOM elements at runtime by `res/js/index.js`. Editing the feed no longer means editing markup. From now on we are editing this file.

## Top-level structure

The file is a **single JSON array** of post objects:

```json
[
    {
        "id": 1,
        "author": {
            "name": "<Name of the user here>",
            "avatar": "res/images/<profile picture>"
        },
        "createdAt": "<ISO 8601 format date and time>",
        "text": "<The_body_of_the_post>",
        "image": "res/images/<image_name>",
        "imageAlt": "Displayed if the image fails to load>",
        "likes": 12
    }
]
```

The array currently holds 10 objects, which hopefully satisfies at the moment the homework 2 requirements. They are stored
**newest first**. The renderer preserves array order, so the **order in this file is the order on the page!**

### Warning!
Order of posts in this file is the order on the page!

## Post object

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | number | yes | Unique, stable identifier for the post. |
| `author` | object | yes | Who wrote the post. |
| `createdAt` | string | yes | ISO 8601 timestamp in UTC, e.g. `2026-10-03T14:32:00Z`. |
| `text` | string | yes | The post body. Always present, even for image posts. |
| `image` | string \| null | yes | Path to the image, or `null` for a text-only post. |
| `imageAlt` | string \| null | yes | Alternative text for the image, or `null` if there is no image. |
| `likes` | number | yes | Number of likes. Not rendered yet. Reserved for the like button. |

### `id`

The primary key. Nothing depends on it yet, but it is what the like button and any future delete/edit feature will use to identify which post was acted on. It is added now so that the schema does not have to change later hopefully.

### `author`

A nested object rather than a flat `authorName` / `authorAvatar` fields, because the two values describe one thing and should travel together in my (Arnold) opinion:

```json
"author": {
    "name": "Sandra Karo",
    "avatar": "res/images/profile.png"
}
```

`author.avatar` is rendered into the `<img class="author-avatar">` in the post header and `author.name` is used as that image's `alt` text.

### `createdAt`

Stored as an **ISO 8601 string with an explicit UTC offset** (`Z`), not as a display string like `"Oct 3, 2026"`.

Two reasons for this:

1. JSON has no `date` type. The six JSON value types are `string`, `number`, `boolean`, `null`, `object` and `array`, so a date can only be a string (or a number such as a Unix timestamp).

2. Formatting is a presentation concern, not data. Storing the raw timestamp keeps the time of day and lets the renderer format it for any locale with `toLocaleDateString()`. It also allows maybe in the future to sort our posts by date e.g. newest to oldest or oldest to newest.

The renderer formats it like this:

```javascript
new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
});
// "2026-10-03T14:32:00Z" -> "Oct 3, 2026"
```

`timeZone`: "UTC"` is deliberate. Without it, a post created late in the UTC day would be displayed as the next day for a viewer in a timezone ahead of UTC (Estonia is UTC+2/+3).

### `image` and `imageAlt`

JSON is a text-only format. It has no binary type, so an image cannot be stored in it directly. This project stores a **path string** pointing at a file in `res/images/`, and the renderer assigns it to `img.src`.

For posts without an image, both `image` and `imageAlt` are **`null`**, not `""` and not a missing key. `null` states explicitly "this post has no image", where as an empty string is ambiguous and a missing key would look like an oversight in my opinion. The renderer tests `if (post.image)` and simply does not create an `<img>` element for text-only posts.

`imageAlt` is a separate field rather than being derived from `text`, because the two are not always the same string see post 3, where the text is `"Enjoying the beautiful autumn colors in the park!"` but the image describes `"Autumn in Estonia"`.

**Why a path and not base64.** The alternative is to inline the image as a `data:image/png;base64,...` URI, which makes the photo genuinely part of the JSON. It was rejected because base64 inflates the payload by roughly a third (138 KB becomes ~184 KB of unreadable characters), makes the file impossible to edit by hand, and defeats browser caching. A path string keeps the file small and readable, lets the browser cache and lazy-load the images, and allows an image to be replaced without touching this file.

**Path resolution.** These paths are relative to the **HTML document** (`index.html`), not to this JSON file, because the browser resolves `img src` against the document's base URL. That is why the same file works both when fetched from a remote endpoint (Task 4) and when fetched locally from `res/data/posts.json` (Task 5), with no changes.

### `likes`

A number, ready for the like button to become stateful. It is not rendered yet.

## Conventions

- **UTF-8**, no byte-order mark.
- **Double quotes only**, single quotes are not valid JSON.
- **No comments.** JSON has no comment syntax, which is why every field is named to be self-explanatory and this README carries the explanation instead.
- **No trailing commas** after the last member of an object or the last element of an array.
- **Two-space / four-space indentation** for readability; whitespace is insignificant to the parser.

## Adding or editing a post

1. Copy an existing object and change the values.
2. Give it a new, unused `id`.
3. Keep `createdAt` in ISO 8601 with a `Z` or an explicit offset.
4. Set `image` and `imageAlt` to a path and a description, or to `null` for both.
5. Insert it at the correct position. The array order is the display order.
6. Validate the file (see below) before committing.

## Validating

The file is validated with [JSONLint](https://jsonlint.com). A passing result means the file parses under the same strict grammar the browser's `JSON.parse()` uses, so `response.json()` in the renderer will not throw a `SyntaxError`.

The usual causes of failure are a trailing comma, a single-quoted string, a `//` comment, an unescaped `"` inside a string, or an unquoted key.

A second check is to load the page over HTTP and read the object in the DevTools console:

```javascript
const response = await fetch("res/data/posts.json");
const posts = await response.json();
console.log(posts.length, posts[0]);
```

`fetch` cannot be used from a `file://` page. The origin is treated as opaque and the request is blocked by CORS. So the project must be served over HTTP, e.g. `python3 -m http.server 8000`.

## Consumed by

`res/js/index.js` fetches this file, parses it, and builds one `<article class="post">` per object using `document.createElement`. The generated markup mirrors the structure that `res/css/index.css` targets: `article.post > header` for the header bar, `.post-content` wrapping the optional image and the text, and a sibling `<footer>` for the like button.
