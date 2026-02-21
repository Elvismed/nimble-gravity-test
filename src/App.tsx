import { CssBaseline } from '@mui/material'
import SingleAppBar from './components/app-bar'
import JobList from './components/job-list'
import { Box, Container } from '@mui/material'

function App() {
  return (
    <>
      <CssBaseline />
      <SingleAppBar />
      <Box sx={{ pt: 10, width: '100%', bgcolor: 'grey.100', minHeight: '100vh', pb: 4 }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <JobList />
        </Container>
      </Box>
    </>
  )
}

export default App
