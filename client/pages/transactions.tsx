import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import BodyWrap from '../components/BodyWrap';
import { getWithToken } from '../helpers/axios';
import { btcToSats } from '../helpers';
import { getFromStorage } from '../helpers/localstorage';
import { TransactionLogs } from '../types';
import Loader from '../components/Loader';

const Transactions: NextPage = () => {
    const [transactions, setTransactions] = useState<TransactionLogs[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const getTransactions = async () => {
            setIsLoading(true);

            const token = await getFromStorage('token');
            const transactionReq = await getWithToken('wallet/transactions', token);

            const data = transactionReq.data.data.transactions;
            setTransactions(data);

            setIsLoading(false);
        };

        getTransactions();
    }, []);
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
                <div className='transactions-wrap'>
                    <h2 className='header'>Transactions</h2>
                    {isLoading ? (<Loader />) : (
                        <table className="w-full text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-lg text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th>Network</th>
                                    <th>Amount in btc</th>
                                    <th>Amount in sats</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    transactions.map((trans, i) => (
                                        <tr key={i}>
                                            <td>{trans.network}</td>
                                            <td>{trans.amount}</td>
                                            <td>{btcToSats(trans.amount)}</td>
                                            <td>{trans.type}</td>
                                            <td>{trans.status ? 'settled': 'pending'}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>



                        </table>
                    )}
                </div>
            </BodyWrap >
        </div >
    )
}

export default Transactions;