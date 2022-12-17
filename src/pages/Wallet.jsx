import React, {useState} from 'react'
import OwnedFighterList from '../components/OwnedFighterList'
import RingWidgetv2 from '../components/RingWidgetv2'
import AmuletWidget2 from '../components/AmuletWidget2'
import OwnedFightClubList from '../components/OwnedFightClubList';
import OwnedForgeList from '../components/OwnedForgeList';

import {Stack} from '@mui/material/';

const Wallet = () => {
  const [fighterListCart, setFighterListCart] = useState([]); 

  const fighterListCartCollector = (newFighter) => {  

    setFighterListCart((prev) => {
      return prev.filter(fighter => fighter.id !== newFighter.id)
    });

    setFighterListCart((prevState) => {
      if (newFighter.id >0){
        const _newFighter = {
          id: newFighter.id,
          imageUrl: newFighter.imageUrl,
          price: newFighter.price
        }          
      return [...prevState, _newFighter];
      }
    })      
  }

  return (
    <React.Fragment>
      <Stack mb={5} direction="row" spacing = {2} sx={{justifyContent: 'flex-start'}} > 
          <RingWidgetv2/>
          <AmuletWidget2/>
        </Stack> 
      <Stack align="left" spacing={2} direction="row" > 
        <Stack>
          <OwnedFighterList onList={fighterListCartCollector}/>    
        </Stack>          
      </Stack>  
      <OwnedFightClubList/>
      <OwnedForgeList/>
    </React.Fragment>
  )
}

export default Wallet