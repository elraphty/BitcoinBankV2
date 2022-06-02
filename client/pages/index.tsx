import type { NextPage } from 'next';
import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import BodyWrap from '../components/BodyWrap';
import { useEffect, useState } from 'react';
import { getWithToken } from '../helpers/axios';
import { getFromStorage } from '../helpers/localstorage';

const Home: NextPage = () => {
  const [balance, setBalance] = useState<number>(0.000000);
  const [satsBalance, setSatsBalance] = useState<number>(0);
  const [transactionCount, setTransactionCount] = useState<number>(0);

  useEffect(() => {
    const getBalance = async () => {
      const token = await getFromStorage('token');
      const balanceReq = await getWithToken('user/balance', token);

      const btcBalance = Number(balanceReq.data.data);
      setBalance(btcBalance);

      const balanceInSats = btcBalance * 100000000;
      setSatsBalance(balanceInSats);
    };

    const getCount = async () => {
      const token = await getFromStorage('token');
      const countReq = await getWithToken('user/transactions/count', token);

      setTransactionCount(countReq.data.data.count);
    };

    getBalance();
    getCount();
  }, []);

  return (
    <>
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
            <h2>{balance}</h2>
          </section>
          <section className='sats'>
            <h4>Balance in sats</h4>
            <h2>{satsBalance}</h2>
          </section>
          <section className='sats'>
            <h4>Total transactions</h4>
            <h2>{transactionCount}</h2>
          </section>
        </div>
      </BodyWrap>
    </>
  )
}

export default Home;
