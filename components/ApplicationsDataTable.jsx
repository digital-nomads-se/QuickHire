import { change_application_status } from '@/Services/job';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { toast } from 'react-toastify';

// The ApplicationsDataTable component
export default function ApplicationsDataTable({ application }) {

    // Use the Next.js router
    const router = useRouter();

    // State for the data
    const [Data, setData] = useState([]);

    // Effect to update the data when the application prop changes
    useEffect(() => {
        setData(application)
    }, [application])

    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        setFilteredData(Data);
    }, [Data])

    const handleAcceptStatus = async (id) => {
        const data = { id, status: "approved" }
        const res = await change_application_status(data);
        if (res.success) {
            router.push('/frontend/postedJob')
        } else {
            toast.error(res.message)
        }

    }

    const handleRejectStatus = async (id) => {
        const data = { id, status: "rejected" }
        const res = await change_application_status(data);
        if (res.success) {
            router.push('/frontend/postedJob')
        } else {
            toast.error(res.message)
        }
    }

    const handleDownloadCV = async (name) => {
        const fileUrl = `/uploads/${name}`;
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = 'cv.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const columns = [
        {
            name: 'Name',
            selector: row => row?.user?.name,
        },
        {
            name: 'Email',
            selector: row => row?.user?.email,
        },
        {
            name: 'Status',
            selector: row => <p className={`uppercase font-semibold ${row?.status === "approved" ? "text-green-500" : ""}  ${row?.status === "rejected" ? "text-red-600" : ""}`}>{row?.status}</p>,
        },
        {
            name: 'CV',
            selector: row => <button onClick={() => handleDownloadCV(row?.cv)} className=' w-20 py-2 text-xs text-black hover:text-white my-2 hover:bg-black border border-black rounded transition-all duration-700'>Download CV</button>
        },
        {
            name: 'Status',
            selector: row => <p className={`uppercase font-semibold ${row?.status === "approved" ? "text-green-500" : ""}  ${row?.status === "rejected" ? "text-red-600" : ""}`}>{row?.status}</p>,
        },
        {
            name: 'Action',
            cell: row => (
                <div className='flex items-center justify-start w-72 h-20'>
                    <button onClick={() => router.push(`/frontend/applicationDetail/${row?._id}`)} className=' w-20 py-2 mx-2 text-xs text-black hover:text-white my-2 hover:bg-black border border-black rounded transition-all duration-700'>Details</button>
                    <button onClick={() => handleAcceptStatus(row?._id)} className=' w-20 py-2 mx-2 text-xs text-green-600 hover:text-white my-2 hover:bg-green-600 border border-green-600 rounded transition-all duration-700'>Approved</button>
                    <button onClick={() => handleRejectStatus(row?._id)} className=' w-20 py-2 mx-2 text-xs text-red-600 hover:text-white my-2 hover:bg-red-600 border border-red-600 rounded transition-all duration-700'>Reject</button>
                </div>
            )
        },

    ];

    // Effect to update the filtered data when the search term or Data state changes
    useEffect(() => {
        if (search === '') {
            setFilteredData(Data);
        } else {
            setFilteredData(Data?.filter((item) => {
                const itemData = item?.user?.name.toUpperCase();
                const textData = search.toUpperCase();
                return itemData.indexOf(textData) > -1;
            }))
        }
    }, [search, Data])

    // Render the component
    return (
        <>
            <DataTable
                subHeaderAlign={"right"}
                columns={columns}
                data={filteredData}
                keyField="id"
                pagination
                title={`Total Applications : ${Data?.length}`}
                fixedHeader
                fixedHeaderScrollHeight='79%'
                selectableRows
                selectableRowsHighlight
                subHeader
                persistTableHead
                subHeaderComponent={
                    <input className='w-60  py-2 px-2  outline-none  border-b-2 border-black' type={"search"}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={"Search with Applicant  name..."} />
                }
                className="h-screen bg-white"
            />
        </>
    )
}
