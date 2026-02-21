import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function SingleAppBar() {
  return (
    <AppBar
      component="nav"
      position="fixed"
      sx={{ width: '100%', top: 0, left: 0 }}
    >
      <Toolbar sx={{ justifyContent: 'flex-start', gap: 2 }}>
        <Typography variant="h6" component="div">
          Nimble Gravity Test
        </Typography>
        <Typography variant="h6" component="div">
          Candidato: Elvis Medina
        </Typography>
      </Toolbar>
    </AppBar>
  );
}