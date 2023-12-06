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

    const [matchingPercentages, setMatchingPercentages] = useState({});

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
            console.log('Changes status to Approved');
            // router.push('/frontend/postedJob')
        } else {
            toast.error(res.message)
        }
    }

    const handleRejectStatus = async (id) => {
        const data = { id, status: "rejected" }
        const res = await change_application_status(data);
        if (res.success) {
            console.log('Changes status to Rejected');
            // router.push('/frontend/postedJob')
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

    const getMatchingPercentage = async (jobId, email, rowId) => {
        try {
            const response = await fetch(`/api/redis?jobId=${jobId}&email=${email}`);
            const data = await response.json();
            console.log('Received redisValue:', data.value);
    
            // Update the state with the new percentage
            setMatchingPercentages(prevPercentages => ({
                ...prevPercentages,
                [rowId]: data.value
            }));
    
            return data.value;
        } catch (error) {
            console.error('Error in getMatchingPercentage:', error);
            return 0;
        }
    };
    
    const columns = [
        {
            name: 'Name',
            selector: row => row?.name,
        },
        {
            name: 'Email',
            selector: row => row?.email,
        },
        {
            name: 'Matching Percentage',
            cell: row => (
                matchingPercentages[row._id] !== undefined
                ? <span>{matchingPercentages[row._id]}%</span>
                : <button onClick={() => getMatchingPercentage(row.job, row.email, row._id)}
                    className='py-2 mx-2 text-xs text-black hover:text-white my-2 mt-2 mb-2 hover:bg-black border border-black rounded transition-all duration-700'>
                    Calculate Percentage
                </button>
            )
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
                className="h-screen bg-white"
            />
        </>
    )
}
