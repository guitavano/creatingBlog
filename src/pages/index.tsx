import { GetStaticProps } from 'next';
import Head from 'next/head'

import { getPrismicClient } from '../services/prismic';

import * as prismic from '@prismicio/client'

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Link from 'next/link'
import { useEffect, useState } from 'react';

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
  const [posts, setPosts] = useState([])
  const [nextPage, setNextPage] = useState(postsResponse.next_page)

  useEffect(() => {
    postsResponse.results.map(post => {
      setPosts([...posts, post])
    })
  }, [])


  function addPosts() {
    fetch(nextPage)
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        console.log(result)
        setPosts([...posts, result.results[0]])
        setNextPage(result.next_page)
      })
  }

  return (
    <>
      <Head>
        <title>Home Spacetraveling</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {
            posts.map(post => (
              <Link href={`/post/${post.uid}`} key={post.uid}>
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
        {
          nextPage && <div onClick={() => { addPosts() }}><span>Carregar mais...</span></div>
        }
      </main>
    </>
  )
}

export const getStaticProps = async () => {
  const endpoint = process.env.PRISMIC_ENDPOINT;

  const client = prismic.createClient(endpoint)

  const postsResponse = await client.getByType('posts', { pageSize: 1, });

  console.log(postsResponse)

  return {
    props: {
      postsResponse
    }
  }

};
