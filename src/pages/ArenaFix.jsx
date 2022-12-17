import {useContext, useState,useEffect, React} from 'react';
import ProviderContext from '../context/provider-context';
import StakedFighterListFix from '../components/StakedFighterListFix';
import StakedYakuzaListFix from '../components/StakedYakuzaListFix';
import OwnedFighterListFix from '../components/OwnedFighterListFix'
import RingWidgetv2Fix from '../components/RingWidgetv2Fix'
import AmuletWidget2Fix from '../components/AmuletWidget2Fix'
import ArenaWidgetFix from '../components/ArenaWidgetFix';
import OwnedFightClubList from '../components/OwnedFightClubListFix';
import StakedFightClubList from '../components/StakedFightClubListFix';
import StakedForge2List from '../components/StakedForge2List';
import ForgeCard from '../components/ForgeCardFix';
import { getUGForgeSmith, getUGForgeSmith2 } from '../utils';
import {Stack, Box, Typography, Button} from '@mui/material/';
import ErrorModal from '../components/ui/ErrorModal';
import SweatFix from './SweatFix'
import Sweatv2Fix from './Sweatv2Fix'
import './arena.css';
//{ownedFYs.length>0 && <OwnedFighterList/>}

const ArenaFix = () => {
  const prv = useContext(ProviderContext);
  const [error, setError] = useState(); 
  const [stakedForge2Ids, setStakedForge2Ids] = useState([]);
  const [stakedBlood, setStakedBlood] = useState(); 
  const [stakedBlood2, setStakedBlood2] = useState('') ;
  const ugForgeSmithContract = getUGForgeSmith();
  const ugForgeSmith2Contract = getUGForgeSmith2();
  

  const getStakedBlood = async() => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });    
    const stakedBlood = await ugForgeSmithContract.getOwnerStakedBlood(accounts[0]);
    setStakedBlood(Number(stakedBlood)); 
    
  }

  const getForges = async() => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });     
      const forgeIds = await ugForgeSmith2Contract.getStakedForgeIDsForUser(accounts[0]);
      setStakedForge2Ids(forgeIds);
      const stakedBlood = await ugForgeSmith2Contract.getOwnerStakedBlood(accounts[0]);
      setStakedBlood2(Number(stakedBlood)); 

    
  }


  const UnstakeHandler = async(event) => {
    event.preventDefault();     
      console.log('s',stakedBlood);

    if (Number(stakedBlood) < 1) {
        setError({
        title: 'You Have no Blood to Unstake ',
        message: 'You may restake at New v2 Sweat Staking Page',
        });
        return;
    }     
    if (Number(stakedBlood) > 1) {
      setError({
      title: 'Save your TX Receipt',
      message: 'Start a support ticket in discord with your TX for refund of 10% exit fee',
      });
  }    
  const signedContract =  ugForgeSmithContract.connect(prv.provider.getSigner());
    await signedContract.functions.unstakeBloodForSweat(Number(stakedBlood));
}


  const errorHandler = () => {
      setError(null);
  } 

  useEffect(() => {     
    const init = async() => {    
      getStakedBlood();
      getForges();
    }
    init();

    const timer = setInterval(() => {
      getStakedBlood();
      getForges();
      }, 15000);

      return () => {
        clearInterval(timer);
      };
    // eslint-disable-next-line
  }, []);   

  return (
    <div>
    {error && (
                <ErrorModal 
                    title={error.title} 
                    message={error.message} 
                    onConfirm={errorHandler}
                />
    )}
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
      <Stack direction="row" spacing={3} >
      <ForgeCard/>
      <Stack>
      {stakedBlood > 0 &&<Sweatv2Fix/>}
            
      </Stack>  
      {stakedForge2Ids.length > 0 && <StakedForge2List/>} 
    </Stack>  
  </Stack>  
  
  {stakedBlood2 > 0 &&<SweatFix/>}
  </div>   
  )
}


export default ArenaFix