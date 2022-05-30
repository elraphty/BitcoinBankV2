import type { NextPage } from 'next';
import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import BodyWrap from '../components/BodyWrap';

const Home: NextPage = () => {
  return (
    <div className={''}>
      <Head>
        <title>Bitcoin Bank Version 2</title>
        <meta name="description" content="BitcoinbankV2 client" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />
      <Topbar />
      <BodyWrap>
        <h1 className="greeting">Hello Bitcoineer! Welcome to my Bitcoin bank</h1>
      </BodyWrap>
    </div>
  )
}

export default Home
