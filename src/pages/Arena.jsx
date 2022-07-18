import {React} from 'react';
import StakedFighterList from '../components/StakedFighterList';
import ArenaWidget from '../components/ArenaWidget';
import {Stack} from '@mui/material/';
//{ownedFYs.length>0 && <OwnedFighterList/>}

const Arena = () => {
  return (
    <Stack className="arena-main" padding={3} direction={{xs: "column", md: "row"}} spacing={5} >      
      <StakedFighterList className="arena-left"/>
      <ArenaWidget className="arena-right"/>
    </Stack>     
  )
}


export default Arena