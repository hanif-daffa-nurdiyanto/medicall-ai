'use client'

import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useUser } from '@clerk/nextjs';
import { UserDetailContext } from '@mon/context/UserDetailContext';

export type UserDetail = {
  name: string,
  email: string,
  credits: number,
}

export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState<unknown>()

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    user && CreateNewUser()
  }, [user])

  const CreateNewUser = async () => {
    const result = await axios.post('/api/users');
    console.log(result.data);
    setUserDetail(result.data)
  }

  return (
    <div>
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
        {children}
      </UserDetailContext.Provider>
    </div>
  )
}
