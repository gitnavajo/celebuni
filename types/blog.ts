export type BlogFrontmatter = {
  title: string;
  date: string;
  excerpt?: string;
};

export type BlogPostSummary = BlogFrontmatter & {
  slug: string;
};

export type BlogPost = BlogPostSummary & {
  contentHtml: string;
};

