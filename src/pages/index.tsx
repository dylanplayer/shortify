import Head from 'next/head'
import styles from './index.module.css';
import { signIn } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next/types';
import { getServerSession } from '@/server/getServerSession';

export async function getServerSideProps({req, res}: {req: NextApiRequest, res: NextApiResponse}) {
  const session = await getServerSession({ req, res });

  if (session) {
    res.writeHead(302, { Location: "/dashboard" });
    res.end();
  }

  return {
    props: {},
  };
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Shortify</title>
        <meta name="description" content="Make your links into short bois" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://dylanplayer.com/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Shortify</h1>
          <p className={styles.subtitle}>Make your links into short bois</p>
        </header>
        <button className={styles.button} onClick={() => signIn('auth0')}>Get Started</button>
      </main>
    </>
  )
}
