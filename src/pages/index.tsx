import { GetStaticProps } from 'next';
import Head from 'next/head'

import { getPrismicClient } from '../services/prismic';

import * as prismic from '@prismicio/client'

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Link from 'next/link'
import { useEffect, useState } from 'react';

import { FiUser, FiCalendar } from 'react-icons/fi'
import { format } from 'date-fns';
import { pt, ptBR } from 'date-fns/locale';

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
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState([])
  const [nextPage, setNextPage] = useState(postsPagination.next_page)

  useEffect(() => {
    postsPagination.results.map(post => {
      setPosts([...posts, post])
    })
  }, [])


  function addPosts() {
    fetch(nextPage)
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
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
                      <FiCalendar />
                      <p>{format(new Date(post.first_publication_date), "dd MMM uuuu", { locale: ptBR })}</p>
                    </div>
                    <div>
                      <FiUser />
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

  const response = await client.getByType('posts', { pageSize: 1, });

  const postsPagination = {
    next_page: response.next_page,
    results: response.results.map(result => {
      return {
        uid: result.uid,
        first_publication_date: result.first_publication_date,
        data: {
          title: result.data.title,
          subtitle: result.data.subtitle,
          author: result.data.author
        }
      }
    })
  }

  return {
    props: {
      postsPagination
    }
  }

};
