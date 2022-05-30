import type { NextPage } from 'next';
import { useEffect } from 'react';
import { getFromStorage } from '../helpers/localstorage';
import { useRouter } from 'next/router';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileNav from './MobileNav';

const BodyWrap: NextPage = (props: any) => {
  const router = useRouter();

  useEffect(() => {
    const token = getFromStorage('token');
    if (!token) {
      router.push('/login');
    }
  }, [router])


  return (
    <>
      <Sidebar />
      <Topbar />
      <MobileNav />

      <div className='bodywrap'>
        {props.children}
      </div>
    </>
  )
}

export default BodyWrap;