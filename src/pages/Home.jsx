import React from 'react'
import OwnedFighterList from '../components/OwnedFighterList'
import { Stack} from '@mui/material/';


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