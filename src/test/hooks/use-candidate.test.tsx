import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Candidate } from '../../interfaces/candidate'

const mockGetCandidateByEmail = vi.fn()

vi.mock('../../services/api', () => ({
  getCandidateByEmail: (...args: unknown[]) => mockGetCandidateByEmail(...args),
}))

import { useCandidate } from '../../hooks/use-candidate'

describe('useCandidate', () => {
  it('loads candidate successfully using env email', async () => {
    const candidate: Candidate = {
      uuid: 'uuid-1',
      candidateId: 'cand-1',
      applicationId: 'app-1',
      firstName: 'Elvis',
      lastName: 'Medina',
      email: 'elvis@example.com',
    }

    // @ts-ignore - for test
    import.meta.env.VITE_CANDIDATE_EMAIL = 'elvis@example.com'
    mockGetCandidateByEmail.mockResolvedValue(candidate)

    const { result } = renderHook(() => useCandidate())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockGetCandidateByEmail).toHaveBeenCalledWith('elvis@example.com')
    expect(result.current.error).toBe(null)
    expect(result.current.candidate).toEqual(candidate)
  })

  it('sets error when service throws', async () => {
    // @ts-ignore - for test
    import.meta.env.VITE_CANDIDATE_EMAIL = 'x@example.com'
    mockGetCandidateByEmail.mockRejectedValue('fail')

    const { result } = renderHook(() => useCandidate())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('fail')
  })
})
