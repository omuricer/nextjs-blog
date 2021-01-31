import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";
import firebase from "firebase";
import firestore from "firebase/firestore";
import admin from "firebase-admin";

const postsDirectory = path.join(process.cwd(), "posts");

export const getAllPostsIds = async (): Promise<string[]> => {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  return new Promise<string[]>((resolve) => {
    resolve(fileNames.map((fileName) => fileName.replace(/\.md$/, "")));
  });
};
export const getAllPostsIdsFromFireStore = async (): Promise<string[]> => {
  firebase.initializeApp({
    apiKey: process.env.FIRE_STORE_API_KEY,
    authDomain: process.env.FIRE_STORE_AUTH_DOMAIN,
    projectId: process.env.FIRE_STORE_PROJECT_ID,
    // storageBucket: process.env.FIRE_STORE_STORAGE_BUKET,
    // messagingSenderId: process.env.FIRE_STORE_MESSAGING_SENDER_ID,
    // appId: process.env.FIRE_STORE_APP_ID,
    // measurementId: process.env.FIRE_STORE_MEASUREMENT_ID,
  });
  let db = firebase.firestore();
  let docRef;
  try {
    docRef = await db.collection("users").add({
      first: "Ada",
      last: "Lovelace",
      born: 1815,
    });
  } catch (error) {
    console.error("Error adding document: ", error);
  }
  console.log("Document written with ID: ", docRef.id);

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
