/**
 * index.js builds the post feed on index.html from res/data/posts.json.
 *
 * The posts are no longer written into the HTML. They live in a JSON file,
 * this script fetches that file, parses it, and creates one <article> per post.
 * The generated markup mirrors the structure that res/css/index.css
 * expects, because the stylesheet targets specific elements and relationships
 * (article.post, article > header, .post-content img, header ~ footer).
 */

/**
 * Turns one post object from posts.json into a finished <article> element.
 *
 * @param {Object} post - a single element of the posts.json array.
 * @returns {HTMLElement} - the article, not yet attached to the document.
 */
function createPostElement(post) {
    /**
     * ### The outer container ###
     * It must be an <article> carrying the class "post": the stylesheet's
     * selector is `article.post`, which sets the card background, border,
     * rounding, padding and the vertical flex layout. A <div> would get none
     * of that and the post would render as unstyled text.
    */
    const article = document.createElement("article");
    article.className = "post";

    /**
     * Store the post's id on the element itself. Nothing uses it yet, but it
     * is how a future like/delete handler will find out which post was clicked,
     * without having to re-search the array.
    */
    article.dataset.id = post.id;

    /**
     * ### Header: author avatar + creation date ###
     * This must be a DIRECT child of <article>. The CSS uses the child
     * combinator `article > header` (not a descendant selector), so wrapping
     * it in another element would silently drop the green header bar.
    */
    const header = document.createElement("header");
    header.className = "post-header";

    const avatar = document.createElement("img");
    avatar.src = post.author.avatar;

    // The author's name is not displayed as text on the page, so it is used
    // as the alt text instead: screen readers announce who wrote the post.
    avatar.alt = post.author.name + " avatar";
    avatar.className = "author-avatar";

    const date = document.createElement("span");
    date.className = "post-date";
    
    /**
     * createdAt is stored as an ISO 8601 string, because JSON has no date type.
     * new Date() revives it into a real Date object, then toLocaleDateString()
     * formats it for display.
     * 
     * timeZone: "UTC" is not optional here: the timestamps are stored in UTC,
     * so without it a post created late in the UTC day would be displayed as
     * the NEXT day for a viewer in Estonia (UTC+2/+3).
    */
    date.textContent = new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC"
    });

    // append() accepts several nodes at once and keeps the given order.
    header.append(avatar, date);

    // ### Content: the optional image, then the text ###
    const content = document.createElement("div");
    content.className = "post-content";

    /**
     * This is the solution to "JSON can only store text": the image is not in
     * the JSON, only a path to it is. For text-only posts `image` is null,
     * which is falsy, so no <img> is created at all.
     * 
     * We must never create an <img> with an empty src: the browser treats
     * src="" as a request for the page itself and fires a second page load.
    */
    if (post.image) {
        const img = document.createElement("img");
        img.src = post.image;
        /**
         * imageAlt is its own field, not copied from text, because the two
         * describe different things (post 3: the text is a sentence, the alt
         * describes what the photo shows).
        */
        img.alt = post.imageAlt;
        img.className = "post-image";
        content.appendChild(img);
    }

    const text = document.createElement("p");
    text.className = "post-text";
    /**
     * textContent, not innerHTML. This data comes from an external file, so it
     * is untrusted input: innerHTML would parse any markup inside a post and
     * execute it. textContent treats it as literal characters.
    */
    text.textContent = post.text;
    content.appendChild(text);

    // ### Footer: the like button ###
    const footer = document.createElement("footer");
    footer.className = "post-footer";

    const likeButton = document.createElement("button");
    // type="button" is required. Inside a <form>, a <button> defaults to
    // type="submit" and would submit the form instead of just being clicked.
    likeButton.type = "button";
    likeButton.className = "like-btn";
    likeButton.setAttribute("aria-label", "Like post");
    likeButton.textContent = "\u{1F44D}"; // 👍

    footer.appendChild(likeButton);

    /**
     * ### Assemble ###
     * Order matters. The stylesheet rule `header ~ footer` is a general sibling
     * selector, so the <footer> must come AFTER the <header> as a sibling for
     * the like bar to be styled. The <img> must also stay directly before the
     * <p>, because `.post-image + p` adds the spacing between them.
    */
    article.append(header, content, footer);

    return article;
}


// Fetch the posts, build the feed, and put it on the page.
async function loadPosts() {
    const feed = document.querySelector(".feed");

    try {
        // Did some templating so that you can do your tasks here.

        // Task 5: the data now lives inside the project.

        /**
         * This line currently checks that our local objects work on the page.
         * This was my (Arnold's) test to make sure the obejcts truly worked that i created.
         */
        const response = await fetch("res/data/posts.json");

        // Task 4: (kept for reference, commented out as the task requires):
        //const response = await fetch("https://api.npoint.io/4305f0c6905e5f2bd24b");
        // NB!! if you are getting cert authority invalid error here, connect to UT eduVPN

        /**
         * fetch() only rejects when the request itself fails (DNS, offline,
         * blocked by CORS). A 404 or 500 still resolves successfully, with
         * response.ok === false, so the status has to be checked explicitly.
         */
        if (!response.ok) {
            throw new Error("HTTP " + response.status + " while loading posts.json");
        }

        /**
         * response.json() reads the body and runs JSON.parse() on it. If the
         * file is malformed this throws a SyntaxError, which is why the file
         * was validated with JSONLint beforehand.
        */
        const posts = await response.json();

        /**
         * One element per post, in the order they appear in the JSON file.
         * replaceChildren() swaps the whole feed in a single operation, and
         * unlike `innerHTML +=` it does not re-parse the existing posts on
         * every iteration.
         */
        feed.replaceChildren(...posts.map(createPostElement));

    } catch (error) {

        /**
         * If the fetch or the parse fails, the feed would otherwise stay
         * empty with no explanation. So instead of failing silently
         * I wanted us to inform of it.
        */
        console.error("Could not load the posts:", error);
        const message = document.createElement("p");
        message.className = "post-text";
        message.textContent = "Could not load posts. Please try again later.";
        feed.replaceChildren(message);
    }
}

loadPosts();