import { get_all_applications } from '@/Services/job';
import ApplicationsDataTable from '@/components/ApplicationsDataTable'
import NavBar from '@/components/NavBar'
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { RevolvingDot } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import useSWR from 'swr'

export default function PostedJobsDetails() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { id } = router.query;
    const user = useUser();

    const [application, setApplication] = useState([]);


    useEffect(() => {
        if (!user) {
            router.push('/api/auth/login')
        }
    }, [user])

    const userEmail = user?.user?.email;
    const { data, error, isLoading } = useSWR(`/get-all-Application`, () => get_all_applications(id));

    useEffect(() => {
        if (data) setApplication(data?.data)
    }, [data])

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
                                <h1 className='text-3xl'>Detail List of  Jobs Application</h1>
                            </div>
                            <div className='w-full h-full px-4 py-4 flex  overflow-y-auto  items-start justify-center flex-wrap'>
                                <ApplicationsDataTable application={application} />
                            </div>
                        </div>
                    </>
                )

            }

        </>
    )
}
