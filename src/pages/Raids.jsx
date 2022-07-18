import React from 'react'
import FighterTable from '../components/FighterTable'
import {Container} from '@mui/material/';
import './raids.css';

const Raids = () => {
  return (
    <Container className="raid-bordr" style={{ width: '100%'}} >
      <FighterTable/>
    </Container>
  )
}

export default Raids