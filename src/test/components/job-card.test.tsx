import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import JobCard from '../../components/job-card'
import type { Job } from '../../interfaces/job'

describe('JobCard', () => {
  const job: Job = { id: '1', title: 'Frontend Engineer' }

  it('renders job title and input', () => {
    render(<JobCard job={job} />)

    expect(screen.getByText(job.title)).toBeInTheDocument()
    expect(screen.getByLabelText(/github url/i)).toBeInTheDocument()
  })

  it('does not throw when submit is clicked without onSubmit', async () => {
    const user = userEvent.setup()

    render(<JobCard job={job} />)

    await user.click(screen.getByRole('button', { name: /submit/i }))
    expect(true).toBe(true)
  })

  it('calls onSubmit with repoUrl and job', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<JobCard job={job} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/github url/i), 'https://github.com/user/repo')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith({ job, repoUrl: 'https://github.com/user/repo' })
  })

  it('disables input and button when disabled=true', async () => {
    const onSubmit = vi.fn()

    render(<JobCard job={job} onSubmit={onSubmit} disabled />)

    const input = screen.getByLabelText(/github url/i)
    const button = screen.getByRole('button', { name: /submit/i })

    expect(input).toBeDisabled()
    expect(button).toBeDisabled()

    fireEvent.click(button)
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
