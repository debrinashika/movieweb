import '../styles/globals.css';
import Header from '../components/Header';
import Head from 'next/head';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Header/>
        {children}
      </body>
    </html>
  );
}