import Head from 'next/head';
import React from 'react';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import { isServer } from '../rendering/isServer';

const Beverly: React.FC = () => (
  <main className={styles.main}>
    <h1 className={styles.title}>
      Welcome to <Link href="/">Beverly Hills!</Link>
    </h1>
  </main>
);

export default function Homey() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!isServer() && <Beverly />}

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
