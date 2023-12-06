import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

// The Intro component
export default function Intro() {
  const [search, setSearch] = useState('');
  const jobData = useSelector(state => state.Job.JobData);
  const [filterJobs, setFilteredJobs] = useState([])
  const [doneSearch, setDoneSearch] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault();
    const filteredJobs = jobData?.filter((job) => {
      let x = job?.job_category;
      return x?.toUpperCase() === search?.toUpperCase().trim();
    });
    setFilteredJobs(filteredJobs);
    setDoneSearch(true)
  }

  return (
    <>
      <br /><br /><br />
      <section class="dream-job-section text-center py-5">
        <div class="container">
          <h1 class="display-4">Your Dream Job. Now.</h1>
          <p class="lead">Showcase yourself to a curated list of top companies</p>
        </div>
      </section>
      <hr />

      <div>
        <div className="container-fluid">
          <div className="row">
            <img src="company-logo.png" className="img-fluid" alt="Company logo" />
          </div>
        </div>
      </div>
      <hr />

      <div>
        <div className="container-fluid">
          <div className="row">
            <img src="image.png" className="img-fluid" alt="Company logo" />
          </div>
        </div>
      </div>

      <footer className="bg-light py-4">
        <div className="container text-center">
          <p>&copy; 2023 Instahyre - Your Dream Job Awaits</p>
        </div>
      </footer>

    </>
  )
}