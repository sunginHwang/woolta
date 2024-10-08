import axios from 'axios';
import { ICategory } from '../../types/post/ICategory';
import { IPost } from '../../types/post/IPost';

const API = 'https://blog.woolta.com';
const BLOG_API = 'https://api-blog.woolta.com';

const NOW = new Date();
const CATEGORY_PRIORITY = 0.5;
const POSTS_PRIORITY = 1;

export async function makeCategoriesSiteMap() {
  const categories = await axios.get(`${BLOG_API}/post/categories`);
  const categoriesSiteMap = await (categories.data.data as ICategory[]).map((category) =>
    makeSiteMapItemXml(`${API}/categories/${category.value}`, CATEGORY_PRIORITY),
  );

  return wrapSiteMap(categoriesSiteMap as any);
}

export async function makePostsSiteMap() {
  const posts = await axios.get(`${BLOG_API}/post/categories/posts/all`);

  const newPostsSiteMap = await (posts.data.data as IPost[]).map((post) =>
    makeSiteMapItemXml(` ${API}/categories/${post.categoryNo}/posts/${post.postNo}`, POSTS_PRIORITY),
  );

  return wrapSiteMap(newPostsSiteMap as any);
}

function makeSiteMapItemXml(url: string, priority: number) {
  return `<url>
        <loc>${url}</loc>
        <lastmod>${NOW.toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${priority}</priority>
    </url>`;
}

function wrapSiteMap(body: string) {
  return `<?xml version="1.0" encoding="utf-8"?>
    <!--Generated by Screaming Frog SEO Spider 9.4-->
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${body}
    </urlset>`;
}
