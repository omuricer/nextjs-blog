import fs from "fs";
import path from "path";
import matter, { GrayMatterFile } from "gray-matter";

const postsDirectory = path.join(process.cwd(), "posts");

export async function getAllPostsIds() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  return new Promise<
    {
      params: {
        id: String;
      };
    }[]
  >((resolve) => {
    resolve(
      fileNames.map((fileName): {
        params: {
          id: String;
        };
      } => {
        return {
          params: {
            id: fileName.replace(/\.md$/, ""),
          },
        };
      })
    );
  });
}

export async function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName): {
    id: String;
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
      id: String;
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
}

export function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Combine the data with the id
  return {
    id,
    ...matterResult.data,
  };
}
