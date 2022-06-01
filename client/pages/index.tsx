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
        <div className='balance-wrap'>
          <section className='btc'>
            <h4>Balance in btc</h4>
            <h2>0.00005</h2>
          </section>
          <section className='sats'>
            <h4>Balance in sats</h4>
            <h2>700000</h2>
          </section>
        </div>
      </BodyWrap>
    </div>
  )
}

export default Home;
