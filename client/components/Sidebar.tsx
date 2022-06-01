import type { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Sidebar: NextPage = () => {
  const [url, setUrl] = useState('');
  useEffect(() => {
    if(window) {
      const _url = window.location.pathname.replace('/','');
      setUrl(_url);
    }
  }, []);

  return (
    <div className='sidebar'>
      <ul>
        <li className={`${url === '' ? 'activeLink' : ''}`} ><Link href="/">Home</Link></li>
        <li className={`${url === 'transactions' ? 'activeLink' : ''}`}><Link href="/transactions">Transactions</Link></li>
        <li className={`${url === 'send' ? 'activeLink' : ''}`}><Link href="/send">Send</Link></li>
        <li className={`${url === 'receive' ? 'activeLink' : ''}`}><Link href="/receive">Receive</Link></li>
        <li className={`${url === 'settings' ? 'activeLink' : ''}`}><Link href="/settings">Settings</Link></li>
      </ul>
    </div>
  )
}

export default Sidebar;