// Run with: node --env-file=.env scripts/export-webflow-cms.mjs
// (Node 20.6+ supports --env-file directly. On older Node, `npm i dotenv`
//  and add `import "dotenv/config";` as the first line instead.)
//
// Pulls every item from your Webflow CMS collections and writes them to
// src/data/*.json. Re-run this any time your Webflow content
// changes — it's a one-way export, not a live sync.

import { writeFile, mkdir } from "node:fs/promises";

const API_BASE = "https://api.webflow.com/v2";
const TOKEN = process.env.WEBFLOW_API_TOKEN;

const COLLECTIONS = {
    "blog-posts": process.env.WEBFLOW_BLOG_COLLECTION_ID,
    "blog-authors": process.env.WEBFLOW_AUTHORS_COLLECTION_ID,
    "blog-categories": process.env.WEBFLOW_CATEGORIES_COLLECTION_ID,
    "blog-faqs": process.env.WEBFLOW_FAQ_COLLECTION_ID,
};

async function webflowFetch(path) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Accept-Version": "2.0.0",
        },
    });
    if (!res.ok) {
        throw new Error(`Webflow API error ${res.status} on ${path}: ${await res.text()}`);
    }
    return res.json();
}

async function getAllItems(collectionId) {
    const items = [];
    let offset = 0;
    const limit = 100;
    while (true) {
        const data = await webflowFetch(
            `/collections/${collectionId}/items/live?limit=${limit}&offset=${offset}`
        );
        items.push(...data.items);
        if (items.length >= data.pagination.total) break;
        offset += limit;
    }
    return items;
}

async function main() {
    if (!TOKEN) {
        throw new Error("WEBFLOW_API_TOKEN is not set");
    }

    await mkdir("src/data", { recursive: true });

    for (const [name, collectionId] of Object.entries(COLLECTIONS)) {
        if (!collectionId) {
            console.warn(`Skipping "${name}" — no collection ID set in .env`);
            continue;
        }
        console.log(`Fetching ${name}...`);
        const items = await getAllItems(collectionId);
        const outPath = `src/data/${name}.json`;
        await writeFile(outPath, JSON.stringify(items, null, 2));
        console.log(`  -> wrote ${items.length} items to ${outPath}`);
    }

    console.log("\nDone. Commit the files in src/data/ to your repo.");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});