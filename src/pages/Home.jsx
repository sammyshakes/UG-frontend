import React from 'react'
import {Stack} from '@mui/material/';
import StakedV1FighterList from '../components/StakedV1FighterList'
import OwnedV1FighterList from '../components/OwnedV1FighterList'


const Home = () => {
  return (
    <React.Fragment>
      <Stack align="left" direction="row" >      
      <StakedV1FighterList/>
        <OwnedV1FighterList/>
      </Stack>   
    </React.Fragment>
  )
}


export default Home