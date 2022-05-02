import { GetStaticProps } from 'next';
import Head from 'next/head'

import { getPrismicClient } from '../services/prismic';

import * as prismic from '@prismicio/client'

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Link from 'next/link'

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsResponse: PostPagination;
}

export default function Home({ postsResponse }: HomeProps) {
  console.log(postsResponse)
  return (
    <>
      <Head>
        <title>Home Spacetraveling</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {
            postsResponse.results.map(post => (
              <Link href={`/posts/${post.uid}`} key={post.uid}>
                <a>
                  <strong>{post.data.title}</strong>
                  <p>{post.data.subtitle}</p>
                  <div className={styles.info}>
                    <div>
                      <p>{post.first_publication_date}</p>
                    </div>
                    <div>
                      <p>{post.data.author}</p>
                    </div>
                  </div>
                </a>
              </Link>
            ))
          }
        </div>
      </main>
    </>
  )
}

export const getStaticProps = async () => {
  const endpoint = process.env.PRISMIC_ENDPOINT;

  const client = prismic.createClient(endpoint)

  const postsResponse = await client.getByType('posts');

  console.log(postsResponse)

  return {
    props: {
      postsResponse
    }
  }

};
