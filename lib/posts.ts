import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

export const getAllPostsIds = async (): Promise<string[]> => {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  return new Promise<string[]>((resolve) => {
    resolve(fileNames.map((fileName) => fileName.replace(/\.md$/, "")));
  });
};

export const getSortedPostsData = async (): Promise<
  {
    [key: string]: any;
    id: string;
  }[]
> => {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName): {
    id: string;
    [key: string]: any;
  } => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    };
  });

  return new Promise<
    {
      [key: string]: any;
      id: string;
    }[]
  >((resolve) => {
    resolve(
      // Sort posts by date
      allPostsData.sort((a, b) => {
        if (a.date < b.date) {
          return 1;
        } else {
          return -1;
        }
      })
    );
  });
};

export const getPostData = async (
  id: string
): Promise<{
  id: string;
  title: string;
  date: string;
  contentHtml: string;
}> => {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id
  return {
    id: id,
    title: matterResult.data.title,
    date: matterResult.data.date,
    contentHtml: contentHtml,
  };
};
