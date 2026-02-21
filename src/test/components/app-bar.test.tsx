import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import SingleAppBar from '../../components/app-bar'

describe('SingleAppBar', () => {
  it('renders title and candidate name', () => {
    render(<SingleAppBar />)

    expect(screen.getByText('Nimble Gravity Test')).toBeInTheDocument()
    expect(screen.getByText(/Candidato:/i)).toBeInTheDocument()
    expect(screen.getByText(/Elvis Medina/i)).toBeInTheDocument()
  })
})
