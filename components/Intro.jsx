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
      <div class="dream-job-section text-center bg-light py-5">
        <div class="container">
          <h1 class="display-4">Your Dream Job. Now.</h1>
          <p class="lead">Showcase yourself to a curated list of top companies</p>
        </div>
      </div>


      <div class="my-5">
        <div class="container">
          <div class="row">
            <img src="company-logo.png" class="img-fluid" alt="Company logo" />
          </div>
        </div>
      </div>

        <div class="benefits-section py-5">
          <div class="container">
            <div class="row justify-content-center mb-4">
              <div class="col-md-8">
                <h3>5X higher response from companies</h3>
                <p>Tired of having your applications ignored by companies? Instahyre only matches you with the right jobs, leading to 5X response rates from companies compared to other job sites!</p>
              </div>
              <div class="col-md-4 d-flex justify-content-center">
                <img src="response.png" alt="Higher Response" class="img-fluid" />
              </div>
            </div>

            <div class="row justify-content-center mb-4">
              <div class="col-md-8">
                <h3>Your perfect job, delivered to you</h3>
                <p>Do you really want to look at thousands of irrelevant job postings or get spammed by job sites? At Instahyre, we do the work of finding the best jobs for you, so you can sit back and relax.</p>
              </div>
              <div class="col-md-4 d-flex justify-content-center">
                <img src="target.png" alt="Perfect Job" class="img-fluid" />
              </div>
            </div>

            <div class="row justify-content-center">
              <div class="col-md-8">
                <h3>Privacy guaranteed</h3>
                <p>We value your privacy very highly. You can block specific companies from viewing your profile. Or you can block all companies and just apply to specific ones yourself.</p>
              </div>
              <div class="col-md-4 d-flex justify-content-center">
                <img src="privacy.png" alt="Privacy Guaranteed" class="img-fluid" />
              </div>
            </div>

          </div>
        </div>

      <footer class="bg-light py-4">
        <div class="container text-center">
            <p>&copy; 2023 Instahyre - Your Dream Job Awaits</p>
        </div>
      </footer>
              
          </>
  )
}


