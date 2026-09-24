import blogPosts from "../data/blog-posts.json";
import blogAuthors from "../data/blog-authors.json";
import blogCategories from "../data/blog-categories.json";
import blogFaqs from "../data/blog-faqs.json";

export function getBlogPosts() {
    return blogPosts
        .filter((post) => !post.isDraft && !post.isArchived)
        .sort((a, b) => {
            const da = a.fieldData["published-date"] || a.createdOn;
            const db = b.fieldData["published-date"] || b.createdOn;
            return new Date(db) - new Date(da);
        });
}

export function getBlogPostBySlug(slug) {
    return blogPosts.find((post) => post.fieldData.slug === slug) ?? null;
}

export function getAuthors() {
    return blogAuthors;
}

export function getAuthorById(id) {
    return blogAuthors.find((a) => a.id === id) ?? null;
}

export function getCategories() {
    return blogCategories;
}

export function getFaqs() {
    return blogFaqs;
}

export function resolveRefs(refs, collection) {
    if (!refs) return [];
    const ids = Array.isArray(refs) ? refs : [refs];
    return ids
        .map((id) => collection.find((item) => item.id === id))
        .filter(Boolean);
}