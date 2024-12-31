import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Dashsidebar from '../components/DashSidebar'
import DashProfile from '../components/DashProfile'
import DashPosts from '../components/DashPosts'
import DashUsers from '../components/DashUsers'
import DashComments from '../components/DashComments'
import DashboardComp from '../components/DashboardComp'

export default function Dashboard() {
  const location = useLocation()
  const [tab, setTab] = useState('')

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if(tabFromUrl){
      setTab(tabFromUrl)
    }
    // console.log(tabFromUrl)
  }, [location.search])

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      {/* sidebar */}
      <div className='md:w-56'>
        <Dashsidebar />

      </div>
      {/* profile */}

        {tab ==='profile' && <DashProfile />}

      {/* dash posts */}
      { tab === 'posts' && <DashPosts /> }
      
      {/* dash users */}
      { tab === 'users' && <DashUsers /> }
      
      {/* dash comments */}
      { tab === 'comments' && <DashComments/> }

      {/* dash components */}
      { tab === 'dash' && <DashboardComp/> }

      
      
    </div>
  )
}
