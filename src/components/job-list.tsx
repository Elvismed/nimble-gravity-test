import { useState } from 'react'
import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import type { Job } from '../interfaces/job'
import JobCard from './job-card'
import { useJobs } from '../hooks/use-jobs'
import { useCandidate } from '../hooks/use-candidate'
import { applyToJob } from '../services/api'


export default function JobList() {
  const { candidate ,loading:loadingCandidate, error:errorCandidate} = useCandidate();
    const { jobs, loading:loadingJobs, error:errorJobs } = useJobs();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const handleSubmit = async ({ job, repoUrl  }: { job: Job; repoUrl: string }) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const apply = await applyToJob( {uuid: candidate?.uuid ?? "", jobId: job.id, candidateId: candidate?.candidateId ?? "", repoUrl: repoUrl, applicationId: candidate?.applicationId ?? ""} );
      if(!apply.ok){
        throw new Error("Aplicacion fallida")
      }
      alert("Aplicacion exitosa")
    } catch (error) {
      alert(error);
    } finally {
      setIsSubmitting(false)
    }
    
  }

  return (
    <Box component="section">
      {(loadingCandidate || loadingJobs) && <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></Box>}
      {(errorCandidate || errorJobs) && <Typography>Error: {errorCandidate||errorJobs}</Typography>}
      <Stack spacing={2} alignItems="center"> 
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} onSubmit={handleSubmit} disabled={isSubmitting} />
        ))}
      </Stack>
    </Box>
  )
}
