import glob from "fast-glob";

interface Blog {
  title: string;
  description: string;
  author: {
    name: string;
    src: string;
  };
  date: string;
  image?: string;
}

export interface BlogWithSlug extends Blog {
  slug: string;
}

async function importBlog(blogFilename: string): Promise<BlogWithSlug> {
  let { blog } = (await import(`../app/(marketing)/blog/${blogFilename}`)) as {
    default: React.ComponentType;
    blog: Blog;
  };

  return {
    slug: blogFilename.replace(/(\/page)?\.mdx$/, ""),
    ...blog,
  };
}

// This file is kept as a placeholder in case blog functionality is needed in the future
export async function getAllBlogs() {
  return [];
}