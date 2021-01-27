import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from "../lib/posts";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import Date from "../components/date";
import Link from "next/link";

export const getStaticProps: GetStaticProps<Props> = async () => {
  const allPostsData = await getSortedPostsData();
  return {
    props: {
      posts: allPostsData.map((post) => {
        return {
          id: post.id,
          date: post.date as string,
          title: post.title as string,
        };
      }),
    },
  };
};

interface Props {
  posts: {
    id: string;
    date: string;
    title: string;
  }[];
}
const Home: React.FC<Props> = (props) => {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>[Your Self Introduction]</p>
        <p>Branch sample.</p>
        <p>
          (This is a sample website - you’ll be building a site like this on{" "}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>

      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {props.posts.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
};
export default Home;
