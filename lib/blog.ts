import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Blog {
  title: string;
  summary?: string;
  date: string;
  author: string;
  authorImage: string;
  thumbnail: string;
  category?: string;
  tags?: string[];
  content: string;
}

export interface BlogWithSlug extends Blog {
  slug: string;
}

const blogDirectory = path.join(process.cwd(), "content/blog");

/**
 * Get all blog post slugs
 */
export function getAllBlogSlugs(): string[] {
  try {
    const files = fs.readdirSync(blogDirectory);
    return files
      .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
      .map((file) => file.replace(/\.mdx?$/, ""));
  } catch (error) {
    console.error("Error reading blog directory:", error);
    return [];
  }
}

/**
 * Get blog post by slug
 */
export function getBlogBySlug(slug: string): BlogWithSlug | null {
  try {
    const fullPath = path.join(blogDirectory, `${slug}.mdx`);

    // Try .mdx first, then .md
    let fileContents: string;
    try {
      fileContents = fs.readFileSync(fullPath, "utf8");
    } catch {
      const mdPath = path.join(blogDirectory, `${slug}.md`);
      fileContents = fs.readFileSync(mdPath, "utf8");
    }

    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title,
      summary: data.summary,
      date: data.date,
      author: data.author,
      authorImage: data.authorImage,
      thumbnail: data.thumbnail,
      category: data.category,
      tags: data.tags,
      content,
    };
  } catch (error) {
    console.error(`Error reading blog post: ${slug}`, error);
    return null;
  }
}

/**
 * Get all blog posts sorted by date (newest first)
 */
export function getAllBlogs(): BlogWithSlug[] {
  const slugs = getAllBlogSlugs();
  const blogs = slugs
    .map((slug) => getBlogBySlug(slug))
    .filter((blog): blog is BlogWithSlug => blog !== null)
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return blogs;
}

/**
 * Get featured blog posts (limit to n posts)
 */
export function getFeaturedBlogs(limit: number = 3): BlogWithSlug[] {
  const allBlogs = getAllBlogs();
  return allBlogs.slice(0, limit);
}
