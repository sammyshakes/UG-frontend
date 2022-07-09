import React from 'react'
import OwnedFighterList from '../components/OwnedFighterList'
import V1RingWidget from '../components/V1RingWidget'
import V1AmuletWidget from '../components/V1AmuletWidget'
import {Box, Stack} from '@mui/material/';


const Home = () => {
  return (
    <React.Fragment>
      <Stack align="left" direction="row" >      
        <OwnedFighterList/>
      </Stack>   
    </React.Fragment>
  )
}


export default Home