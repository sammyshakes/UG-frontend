import React from 'react'
import StakedFightClubList from '../components/StakedFightClubList';
import {Stack, Container} from '@mui/material/';


const FightClubs = () => {
  return (
    <Stack  spacing={3} alignItems="center">
      <Container className="forge-bordr h1" align="center" sx={{color: 'red', width: 1/2 }} >
          Fight Clubs
      </Container>
      <Stack direction="row" spacing = {4}>
        <StakedFightClubList/>
      </Stack>
    </Stack>
    
  )
}

export default FightClubs