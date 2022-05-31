import type { NextPage } from 'next';
import { FunctionComponent, ReactNode, useEffect } from 'react';
import { getFromStorage } from '../helpers/localstorage';
import { useRouter } from 'next/router';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileNav from './MobileNav';

type BodyProps = {
   children: ReactNode
}

const BodyWrap: NextPage<BodyProps> = (props: BodyProps) => {
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