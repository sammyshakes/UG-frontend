import React from 'react'
import WeaponTable from '../components/WeaponTable'
import {Container} from '@mui/material/';
import './weapons.css';

const Weapons = () => {
  return (
    <Container className="raid-bordr" style={{ width: '100%'}} >
      <WeaponTable/>
    </Container>
  )
}

export default Weapons