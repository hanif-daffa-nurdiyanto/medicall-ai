
import React from 'react'
import HistoryList from './_components/HistoryList'
import DoctorAgentList from './_components/DoctorAgentList'

function Dashboard() {
  return (
    <>
      <HistoryList
        limit={5}
        subtitle="Here are your five most recent consultations. Access the full history for everything else."
        showMoreHref="/history"
      />
      <DoctorAgentList />
    </>
  );
}

export default Dashboard
