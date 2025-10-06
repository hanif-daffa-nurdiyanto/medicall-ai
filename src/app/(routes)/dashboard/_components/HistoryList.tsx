'use client'

import React, { useState } from 'react'
import AddNewSessionDialog from './AddNewSessionDialog';

function HistoryList() {
  const [historyList, setHistoryList] = useState([]);
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Hello there</h1>
          {historyList.length == 0 ?
            <p className="py-6">
              No Recent Consultation
            </p> : <div>List</div>
          }
          <AddNewSessionDialog />
        </div>
      </div>
    </div>
  )
}

export default HistoryList