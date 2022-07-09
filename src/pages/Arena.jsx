import {React, useContext} from 'react';
import ProviderContext from '../context/provider-context';
import OwnedFighterList from '../components/OwnedFighterList';
import StakedFighterList from '../components/StakedFighterList';
import {Stack} from '@mui/material/';
//{ownedFYs.length>0 && <OwnedFighterList/>}

const Arena = () => {
  const prv = useContext(ProviderContext);
  const ownedFYs = prv.ownedFYs;
  console.log('tester',ownedFYs);
  return (
    <Stack align="left" direction="row" >      
      <StakedFighterList/>
    </Stack>     
  )
}


export default Arena