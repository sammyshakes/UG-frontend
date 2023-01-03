import {useContext, useState, useEffect} from 'react';
import ProviderContext from '../context/provider-context';
import StakedFighterList from '../components/StakedFighterList';
import StakedYakuzaList from '../components/StakedYakuzaList';
import ArenaWidget from '../components/ArenaWidget';
import {Stack} from '@mui/material/';
import { getUGArena2, getUGArena3, getUGYakDen, getUGFYakuza} from '../utils.js';
import './arena.css';
const baseUrl = 'https://the-u.club/reveal/fighteryakuza/'; 
//{ownedFYs.length>0 && <OwnedFighterList/>}



const Arena = () => {
  
  const[stakedFYs, setStakedFYs] = useState([]);
  const[stakedFighters, setStakedFighters] = useState([]);
  const[stakedYaks, setStakedYaks] = useState([]);

  const ugArenaContract = getUGArena2();
  const ugArena3Contract = getUGArena3();
  const ugFYakuzaContract = getUGFYakuza();
  const ugYakDenContract = getUGYakDen();

  const getUpdates = async() => {      
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });      
    const _stakedIds = await ugArenaContract.getStakedFighterIDsForUser(accounts[0]);        
    const stakedIds = _stakedIds.map(id => { return Number(id); }) 
    
    const _stkdFighterIds = await ugArena3Contract.stakedByOwner(accounts[0]);
    console.log('here', _stkdFighterIds)
    const stkdFighterIds = _stkdFighterIds.map(id => { return Number(id); }) ;

    const _stkdYakuzaIds = await ugYakDenContract.stakedIdsByUser(accounts[0]);
    const stkdYakuzaIds = _stkdYakuzaIds.map(id => { return Number(id); }) ;

    if(stakedIds.length > 0){
      const _stakedFYs = await ugFYakuzaContract.getFighters(stakedIds); 
          
      const stakedFYs = stakedIds.map((id, i) => {        
        let imageUrl =  "fighter/" ;
        
        imageUrl = baseUrl.concat(imageUrl.concat(_stakedFYs[i].imageId).concat('.png'));
        let fy = {id, imageUrl, ..._stakedFYs[i]};
        //console.log('fy',fy);
        return fy;
      })   
      setStakedFYs(stakedFYs);
    } else setStakedFYs([]);
     
    if(stkdFighterIds.length > 0){
      const _stakedFYs = await ugFYakuzaContract.getFighters(stkdFighterIds); 
          
      const stakedFYs = stkdFighterIds.map((id, i) => {        
        let imageUrl =  "fighter/" ;
        
        imageUrl = baseUrl.concat(imageUrl.concat(_stakedFYs[i].imageId).concat('.png'));
        let fy = {id, imageUrl, ..._stakedFYs[i]};
        //console.log('fy',fy);
        return fy;
      })   
      setStakedFighters(stakedFYs);
    } else setStakedFighters([]);

    if(stkdYakuzaIds.length > 0){
      const _stakedFYs = await ugFYakuzaContract.getFighters(stkdYakuzaIds); 
          
      const stakedFYs = stkdYakuzaIds.map((id, i) => {        
        let imageUrl =  "yakuza/" ;
        
        imageUrl = baseUrl.concat(imageUrl.concat(_stakedFYs[i].imageId).concat('.png'));
        let fy = {id, imageUrl, ..._stakedFYs[i]};
        //console.log('fy',fy);
        return fy;
      })   
      setStakedYaks(stakedFYs);
    } else setStakedYaks([]);    
  }

  useEffect(() => {   
    getUpdates();
    const init = async() => {          
      const timer = setInterval(() => {        
        getUpdates();
      }, 60000);       
      return () => {
        clearInterval(timer);
      };
    }
    init();
    // eslint-disable-next-line
  }, []);

  return (
    console.log(stakedFighters),
    <Stack justifyContent={'center'} padding={0} margin={0} spacing={2}  >   
      <ArenaWidget />   
      {stakedFYs.length > 0 && <Stack  direction="row" justifyContent={'flex-start'} padding={2} spacing={5} maxWidth={1/1}> 
       
        <StakedFighterList stakedFYs={stakedFYs} />
        <StakedYakuzaList stakedFYs={stakedFYs} />
      </Stack>}
      {stakedFYs.length === 0 && <Stack  direction="row" justifyContent={'flex-start'} padding={2} spacing={5} maxWidth={1/1}> 
        <StakedFighterList stakedFYs={stakedFighters} />
        <StakedYakuzaList stakedFYs={stakedYaks} />
      </Stack>}
    </Stack>     
  )
}

export default Arena