import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Job } from '../../interfaces/job'

const mockGetJobsList = vi.fn()

vi.mock('../../services/api', () => ({
  getJobsList: () => mockGetJobsList(),
}))

import { useJobs } from '../../hooks/use-jobs'

describe('useJobs', () => {
  it('loads jobs successfully', async () => {
    const jobs: Job[] = [{ id: '1', title: 'Job' }]
    mockGetJobsList.mockResolvedValue(jobs)

    const { result } = renderHook(() => useJobs())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe(null)
    expect(result.current.jobs).toEqual(jobs)
  })

  it('sets error when service throws', async () => {
    mockGetJobsList.mockRejectedValue('fail')

    const { result } = renderHook(() => useJobs())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('fail')
  })
})
