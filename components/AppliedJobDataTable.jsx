import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { useSelector } from 'react-redux';

// The AppliedJobDataTable component
export default function AppliedJobDataTable() {
    const router = useRouter();

    // State for the data
    const appliedJobData = useSelector(state => state.AppliedJob.appliedJob)

    // State for the data
    const [Data, setData] = useState([]);

    // Effect to update the data when the appliedJobData prop changes
    useEffect(() => {
        setData(appliedJobData)
    }, [])

    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        setFilteredData(Data);
    }, [Data])

    // Define the columns for the data table
    const columns = [
        {
            name: 'Apply Date',
            selector: row => new Date(`${row?.job?.createdAt}`).toLocaleDateString('en-GB'),
        },
        {
            name: 'Company',
            selector: row => row?.job?.company,
        },
        {
            name: 'Job title',
            selector: row => row?.job?.title,
        },
        {
            name: 'Job Salary ',
            selector: row => '$' + row?.job?.salary,
        },
        {
            name: 'Status',
            selector: row => <p className={`uppercase font-semibold ${row?.status === "approved" ? "text-green-500" : ""}  ${row?.status === "rejected" ? "text-red-600" : ""}`}>{row?.status}</p>,
        },
        {
            name: 'Action',
            cell: row => <button onClick={() => router.push(`/frontend/jobDetails/${row?.job?._id}`)} className='md:px-2 md:py-2 px-1 py-1 text-xs text-black hover:text-white my-2 hover:bg-black border border-black   rounded transition-all duration-700  '>view Detail</button>
        },
    ];

    // Effect to update the filtered data when the Data state changes
    useEffect(() => {
        if (search === '') {
            setFilteredData(Data);
        } else {
            setFilteredData(Data?.filter((item) => {
                const itemData = item?.job?.company.toUpperCase();
                const textData = search.toUpperCase();
                return itemData.indexOf(textData) > -1;
            }))
        }
    }, [search, Data])

    return (
        <>
            <DataTable
                subHeaderAlign={"right"}
                columns={columns}
                data={filteredData}
                keyField="id"
                pagination
                title={`Total Applied Jobs: ${Data?.length}`}
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
