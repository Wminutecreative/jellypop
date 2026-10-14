import blogPosts from "../data/blog-posts.json";
import blogAuthors from "../data/blog-authors.json";
import blogCategories from "../data/blog-categories.json";

// Newest first. Add "draft": true to a post to hide it from the site.
export function getBlogPosts() {
    return blogPosts
        .filter((post) => !post.draft)
        .sort((a, b) => new Date(b["published-date"]) - new Date(a["published-date"]));
}

export function getBlogPostBySlug(slug) {
    return blogPosts.find((post) => post.slug === slug) ?? null;
}

export function getAuthors() {
    return blogAuthors;
}

export function getAuthorBySlug(slug) {
    return blogAuthors.find((a) => a.slug === slug) ?? null;
}

export function getCategories() {
    return blogCategories;
}

export function getCategoryBySlug(slug) {
    return blogCategories.find((c) => c.slug === slug) ?? null;
}
