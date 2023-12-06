import { get_my_posted_job } from '@/Services/job';
import { setMyJobs } from '@/Utils/JobSlice';
import JobsCard from '@/components/JobsCard';
import NavBar from '@/components/NavBar'
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { RevolvingDot } from 'react-loader-spinner';
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import useSWR from 'swr'

export default function PostedJobs() {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useUser();
    const myJobs = useSelector(state => state?.Job?.myJobs);

    useEffect(() => {
        if (!user) {
            router.push('/api/auth/login')
        }
    }, [user])

    const userEmail = user?.user?.email;

    const { data, error, isLoading } = useSWR('/getMyPostedJobs', () => get_my_posted_job(userEmail))
    useEffect(() => {
        if (data) dispatch(setMyJobs(data?.data))
    }, [data, dispatch])

    if (error) toast.error(error)

    return (
        <>
            {
                isLoading ? (

                    <div className='bg-gray w-full h-screen flex items-center flex-col justify-center'>
                        <RevolvingDot width='200' color="#808080" />
                        <p className='text-xs uppercase'>Loading ...</p>
                    </div>
                ) : (
                    <>
                        <NavBar />
                        <div className='w-full  pt-20'>
                            <div className='w-full h-20 bg-gray-50 text-black font-bold flex items-center justify-center flex-col'>
                                <h1 className='text-3xl'>Posted Jobs</h1>
                            </div>
                            <div className='w-full h-full px-4 py-4 flex  overflow-y-auto  items-start justify-center flex-wrap'>
                                {
                                    myJobs?.map((job, index) => (
                                        <JobsCard key={index} job={job} posted={true} />
                                    ))
                                }
                            </div>
                        </div>
                    </>
                )
            }
        </>
    )
}
