import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Candidate } from '../../interfaces/candidate'
import type { Job } from '../../interfaces/job'

const mockUseJobs = vi.fn()
const mockUseCandidate = vi.fn()
const mockApplyToJob = vi.fn()

vi.mock('../../hooks/use-jobs', () => ({
  useJobs: () => mockUseJobs(),
}))

vi.mock('../../hooks/use-candidate', () => ({
  useCandidate: () => mockUseCandidate(),
}))

vi.mock('../../services/api', () => ({
  applyToJob: (...args: unknown[]) => mockApplyToJob(...args),
}))

import JobList from '../../components/job-list'

describe('JobList', () => {
  const candidate: Candidate = {
    uuid: 'uuid-1',
    candidateId: 'cand-1',
    applicationId: 'app-1',
    firstName: 'Elvis',
    lastName: 'Medina',
    email: 'elvis@example.com',
  }

  const jobs: Job[] = [
    { id: 'job-1', title: 'Job One' },
    { id: 'job-2', title: 'Job Two' },
  ]

  beforeEach(() => {
    mockUseCandidate.mockReturnValue({ candidate, loading: false, error: null })
    mockUseJobs.mockReturnValue({ jobs, loading: false, error: null })
    mockApplyToJob.mockResolvedValue({ ok: true })
  })

  it('shows loading when candidate or jobs are loading', () => {
    mockUseCandidate.mockReturnValue({ candidate: null, loading: true, error: null })
    mockUseJobs.mockReturnValue({ jobs: [], loading: false, error: null })

    render(<JobList />)

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('shows error when hooks return error', () => {
    mockUseCandidate.mockReturnValue({ candidate: null, loading: false, error: 'boom' })
    mockUseJobs.mockReturnValue({ jobs: [], loading: false, error: null })

    render(<JobList />)

    expect(screen.getByText(/Error:/i)).toBeInTheDocument()
    expect(screen.getByText(/boom/i)).toBeInTheDocument()
  })

  it('renders job cards', () => {
    render(<JobList />)

    expect(screen.getByText('Job One')).toBeInTheDocument()
    expect(screen.getByText('Job Two')).toBeInTheDocument()
  })

  it('submits application and alerts success', async () => {
    const user = userEvent.setup()

    render(<JobList />)

    const jobOneTitle = screen.getByText('Job One')
    const card = jobOneTitle.closest('[class*="MuiCard-root"]') ?? jobOneTitle.parentElement
    expect(card).toBeTruthy()

    const githubInputs = screen.getAllByLabelText(/github url/i)
    await user.type(githubInputs[0], 'https://github.com/u/r')

    const submitButtons = screen.getAllByRole('button', { name: /submit/i })
    await user.click(submitButtons[0])

    expect(mockApplyToJob).toHaveBeenCalledTimes(1)
    expect(mockApplyToJob).toHaveBeenCalledWith({
      uuid: candidate.uuid,
      jobId: 'job-1',
      candidateId: candidate.candidateId,
      repoUrl: 'https://github.com/u/r',
      applicationId: candidate.applicationId,
    })
    expect(window.alert).toHaveBeenCalledWith('Aplicacion exitosa')
  })

  it('alerts error when applyToJob returns ok=false', async () => {
    const user = userEvent.setup()
    mockApplyToJob.mockResolvedValue({ ok: false })

    render(<JobList />)

    const githubInputs = screen.getAllByLabelText(/github url/i)
    await user.type(githubInputs[0], 'https://github.com/u/r')

    const submitButtons = screen.getAllByRole('button', { name: /submit/i })
    await user.click(submitButtons[0])

    expect(window.alert).toHaveBeenCalled()
  })
})
