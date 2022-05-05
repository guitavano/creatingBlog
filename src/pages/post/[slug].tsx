import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';

import * as prismic from '@prismicio/client'
import { RichText } from "prismic-dom"

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

import Head from 'next/head'

import { FiUser, FiCalendar } from 'react-icons/fi'
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';


interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.data.title}</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <img src={post.data.banner.url} alt={post.data.title} />
          <h1>{post.data.title}</h1>
          <div>
            <div>
              <FiCalendar />
              <p>{format(new Date(post.first_publication_date), "dd MMM uuuu", { locale: ptBR })}</p>
            </div>
            <div>
              <FiUser />
              <p>{post.data.author}</p>
            </div>
            <div>
              <p>4 min</p>
            </div>
          </div>
          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: RichText.asHtml(post.data.content[0].body) }}
          />
        </article>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const endpoint = process.env.PRISMIC_ENDPOINT;

  const client = prismic.createClient(endpoint)

  const postsResponse = await client.getByType('posts');

  return {
    paths: [],
    fallback: 'blocking',
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params

  const endpoint = process.env.PRISMIC_ENDPOINT;
  const client = prismic.createClient(endpoint)

  const postResponse = await client.getByUID('posts', String(slug), {});

  const post = {
    first_publication_date: postResponse.first_publication_date,
    data: {
      title: postResponse.data.title,
      banner: {
        url: postResponse.data.banner.url
      },
      author: postResponse.data.author,
      content: postResponse.data.content
    }
  }

  return {
    props: {
      post
    }
  }
};
