import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from 'react';
import liff from '@line/liff';

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });
        console.log('LIFF initialized!');
      } catch (error) {
        console.error('Failed to initialize LIFF', error);
      }
    };
    initializeLiff();
  }, []);
  return <Component {...pageProps} />;
};

export default MyApp;