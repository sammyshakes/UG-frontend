import {React} from 'react';
import StakedFighterListFix from '../components/StakedFighterListFix';
import StakedYakuzaListFix from '../components/StakedYakuzaListFix';
import OwnedFighterListFix from '../components/OwnedFighterListFix'
import RingWidgetv2Fix from '../components/RingWidgetv2Fix'
import AmuletWidget2Fix from '../components/AmuletWidget2Fix'
import ArenaWidgetFix from '../components/ArenaWidgetFix';
import OwnedFightClubList from '../components/OwnedFightClubListFix';
import StakedFightClubList from '../components/StakedFightClubListFix';
import ForgeCard from '../components/ForgeCardFix';
import {Stack} from '@mui/material/';
import './arena.css';
//{ownedFYs.length>0 && <OwnedFighterList/>}

const ArenaFix = () => {
  return (
    <Stack className="arena-main" padding={0} spacing={2} >   
      <ArenaWidgetFix className="arena-right"/>   
      <Stack className="arena-main" direction="row" padding={1} spacing={5} > 
        <StakedFighterListFix className="arena-left"/>
        <StakedYakuzaListFix className="arena-left"/>
      </Stack>
      <Stack direction="row">
      <OwnedFighterListFix/>
      <Stack align="right" > 
        <RingWidgetv2Fix/>
        <AmuletWidget2Fix/>
      </Stack>  
      
      </Stack>
      <Stack direction="row" spacing={3}>
      <StakedFightClubList/>
      <OwnedFightClubList/>
      </Stack>
      <ForgeCard/>
      
    </Stack>     
  )
}


export default ArenaFix