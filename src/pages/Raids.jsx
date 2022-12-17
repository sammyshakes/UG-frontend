import React from 'react'
import FighterTable from '../components/FighterTable'
import {Container} from '@mui/material/';
import './raids.css';

const Raids = () => {
  return (
    <Container className="raid-bordr" sx={{width:{lg: '100%' }}} >
      <FighterTable/>
    </Container>
  )
}

export default Raids