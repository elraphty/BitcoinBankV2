import type { NextPage } from 'next';
import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import BodyWrap from '../components/BodyWrap';

const Transactions: NextPage = () => {
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
                    <table className="w-full text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-lg text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th>Song</th>
                                <th>Artist</th>
                                <th>Year</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
                                <td>Malcolm Lockyer</td>
                                <td>1961</td>
                            </tr>
                            <tr>
                                <td>Witchy Woman</td>
                                <td>The Eagles</td>
                                <td>1972</td>
                            </tr>
                            <tr>
                                <td>Shining Star</td>
                                <td>Earth, Wind, and Fire</td>
                                <td>1975</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </BodyWrap>
        </div>
    )
}

export default Transactions;