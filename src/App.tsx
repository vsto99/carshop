import './App.css'
import CarList from './CarList'
import Container from "@mui/material/Container"
import AppBar from "@mui/material/AppBar"
import { Toolbar, Typography } from '@mui/material'

function App() {

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">Car Shop</Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container maxWidth="xl">
        <CarList />
      </Container>

    </>
  )
}

export default App
