import AppliedJobDataTable from '@/components/AppliedJobDataTable'
import NavBar from '@/components/NavBar'
import SavedJobDataTable from '@/components/SavedJobDataTable'
import { get_my_applied_job } from '@/Services/job'
import { get_book_mark_job } from '@/Services/job/bookmark'
import { setAppliedJob, setBookMark } from '@/Utils/AppliedJobSlice'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { BsFillBookmarkStarFill } from 'react-icons/bs'
import { GiSuitcase } from 'react-icons/gi'
import { RevolvingDot } from 'react-loader-spinner'
import { useDispatch, useSelector } from 'react-redux'

export default function Dashboard() {
  const [showTable, setShowTable] = useState('appliedJobs')
  const [loading, setLoading] = useState(true)
  const router = useRouter();
  const dispatch = useDispatch();
  const activeUser = useUser();
  const user = activeUser?.user;

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    }
  }, [user])

  const userEmail = user?.email;

  useEffect(() => {
    fetchAppliedJobs()
  }, [])

  const fetchAppliedJobs = async () => {
    const res = await get_my_applied_job(userEmail)
    const get_bookmarks = await get_book_mark_job(userEmail)
    if (res.success || get_bookmarks.success) {
      dispatch(setAppliedJob(res?.data))
      dispatch(setBookMark(get_bookmarks?.data))
      setLoading(false)
    }
    else {
      router.push('/auth/login')
    }
  }

  return (
    <>
      {
        loading ? (
          <div className='bg-gray w-full h-screen flex items-center flex-col justify-center'>
            <RevolvingDot width='200' color="#808080" />
            <p className='text-xs uppercase'>Loading ...</p>
          </div>
        ) : (
          <>
            <NavBar />
            <div className='w-full h-screen pt-20 flex items-center justify-start flex-col'>
              <div className='flex bg-gray-100 flex-wrap items-center justify-center w-full py-2 px-2'>
                {/* applied Jobs */}
                <div onClick={() => setShowTable('appliedJobs')} className='py-2 cursor-pointer border-black border-b-2 px-2 w-60 h-32 rounded mx-2 my-2 bg-white flex items-center justify-center hover:bg-gray-200'>
                  <GiSuitcase className='bg-gray-50 text-black rounded-full w-10 h-10' />
                  <div className='flex  flex-col mx-2 items-start justify-start px-2 '>
                    <p className='text-xl font-semibold'>Applied Jobs</p>
                  </div>
                </div>

                {/* Saved Jobs */}
                <div onClick={() => setShowTable('savedJobs')} className='py-2 cursor-pointer border-b-teal-600 border-b-2 px-2 w-60 h-32 rounded mx-2 my-2 bg-white flex items-center justify-center hover:bg-gray-200'>
                  <BsFillBookmarkStarFill className='bg-gray-50 text-black rounded-full w-10 h-10' />
                  <div className='flex  flex-col items-start mx-2 justify-start px-2 '>
                    <p className='text-xl font-semibold'>Save Jobs</p>
                  </div>
                </div>

                {/* applied Jobs */}
              </div>
              <div className='w-full h-full px-4 '>
                {
                  showTable === 'savedJobs' ? <SavedJobDataTable /> : <AppliedJobDataTable />
                }
              </div>
            </div>
          </>
        )
      }
    </>
  )
}
