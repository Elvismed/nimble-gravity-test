import { describe, expect, it, vi } from 'vitest'

const axiosMocks = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
}))

vi.mock('axios', () => {
  return {
    default: {
      create: () => ({
        get: axiosMocks.mockGet,
        post: axiosMocks.mockPost,
      }),
    },
  }
})

import { applyToJob, getCandidateByEmail, getJobsList } from '../../services/api'

describe('services/api', () => {
  it('getCandidateByEmail returns data and calls axios with params', async () => {
    axiosMocks.mockGet.mockResolvedValue({
      data: { uuid: 'u', candidateId: 'c', applicationId: 'a', firstName: 'f', lastName: 'l', email: 'e' },
    })

    const res = await getCandidateByEmail('e')

    expect(axiosMocks.mockGet).toHaveBeenCalledWith('/api/candidate/get-by-email', { params: { email: 'e' } })
    expect(res.email).toBe('e')
  })

  it('getCandidateByEmail throws friendly error when request fails', async () => {
    axiosMocks.mockGet.mockRejectedValueOnce(new Error('network'))

    await expect(getCandidateByEmail('e')).rejects.toThrow(/Error al obtener el candidato/i)
  })

  it('getJobsList returns data', async () => {
    axiosMocks.mockGet.mockResolvedValue({ data: [{ id: '1', title: 'Job' }] })

    const res = await getJobsList()

    expect(axiosMocks.mockGet).toHaveBeenCalledWith('/api/jobs/get-list')
    expect(res).toEqual([{ id: '1', title: 'Job' }])
  })

  it('applyToJob posts payload and returns data', async () => {
    axiosMocks.mockPost.mockResolvedValue({ data: { ok: true } })

    const res = await applyToJob({ uuid: 'u', jobId: 'j', candidateId: 'c', repoUrl: 'r', applicationId: 'a' })

    expect(axiosMocks.mockPost).toHaveBeenCalledWith('/api/candidate/apply-to-job', {
      uuid: 'u',
      jobId: 'j',
      candidateId: 'c',
      repoUrl: 'r',
      applicationId: 'a',
    })
    expect(res.ok).toBe(true)
  })

  it('applyToJob throws friendly error when request fails', async () => {
    axiosMocks.mockPost.mockRejectedValueOnce(new Error('network'))

    await expect(
      applyToJob({ uuid: 'u', jobId: 'j', candidateId: 'c', repoUrl: 'r', applicationId: 'a' }),
    ).rejects.toThrow(/Error al aplicar al trabajo/i)
  })

  it('throws friendly error when request fails', async () => {
    axiosMocks.mockGet.mockRejectedValueOnce(new Error('network'))

    await expect(getJobsList()).rejects.toThrow(/Error al obtener la lista de trabajos/i)
  })
})
