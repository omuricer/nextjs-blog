// import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import {
  GetStaticProps,
  GetStaticPaths,
  GetServerSideProps,
  InferGetStaticPropsType,
} from "next";

import Layout from "../../components/layout";
import { getAllPostsIds, getPostData } from "../../lib/posts";
import Head from "next/head";
import Date from "../../components/date";
import utilStyles from "../../styles/utils.module.css";

export const getStaticPaths: GetStaticPaths = async () => {
  const ids = await getAllPostsIds();
  const paths = ids.map((id) => ({ params: { id: id } }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params.id);
  return {
    props: {
      ...postData,
    },
  };
};

const Post: React.FC<{
  title: string;
  date: string;
  contentHtml: string;
}> = (props) => {
  return (
    <Layout>
      <Head>
        <title>{props.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{props.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={props.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: props.contentHtml }} />
      </article>
    </Layout>
  );
};
export default Post;
