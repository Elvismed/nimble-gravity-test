import { useState } from 'react'
import { Button, Card, CardActions, CardContent, TextField, Typography } from '@mui/material'
import type { Job } from '../interfaces/job'

type JobCardProps = {
  job: Job
  onSubmit?: (args: { job: Job; repoUrl: string }) => void | Promise<void>
  disabled?: boolean
}

export default function JobCard({ job, onSubmit, disabled = false }: JobCardProps) {
  const [repoUrl, setRepoUrl] = useState('')

  const handleSubmit = async () => {
    if (!onSubmit) return
    await onSubmit({ job, repoUrl })
  }

  return (
    <Card variant="outlined" sx={{ width: '100%', maxWidth: 640 }}>
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          {job.title}
        </Typography>

        <TextField
          fullWidth
          label="GitHub URL"
          placeholder="https://github.com/usuario/repo"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          disabled={disabled}
        />
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
        <Button variant="contained" onClick={handleSubmit} disabled={disabled}>
          Submit
        </Button>
      </CardActions>
    </Card>
  )
}
