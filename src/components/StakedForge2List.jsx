import React, {useContext, useState, useEffect} from 'react';
import ProviderContext from '../context/provider-context';
import StakedForgeCard from './StakedForgeCard';
import {Box, Container, Button, Stack, ButtonGroup, Typography, ImageList, ImageListItem} from '@mui/material';
import './stakedForgeList.css';
import ErrorModal from './ui/ErrorModal';
import {getUGNft2, getUGForgeSmith2, getUGGame2} from '../utils.js';

export default function StakedForge2List() {
    const prv = useContext(ProviderContext);    
    const[fclubs, setFclubs] = useState([]);
    const [unclaimedBloodRewards, setUnclaimedBloodRewards] = useState(undefined);
    const [selectedForges, setSelectedForges] = useState([]);
    const [stakedForgeIds, setStakedForgeIds] = useState([]);
    const [stakedForges, setStakedForges] = useState([]);    
    const [error, setError] = useState();
    const [unclaimed, setUnclaimed] = useState(0);
    const ugForgeSmithContract = getUGForgeSmith2();
    const ugNftContract = getUGNft2();
    const ugGameContract = getUGGame2();

    const levelHandler = async() => {
      const levelUpArray = selectedForges.map(i => { return 1;});
      const signedContract =  ugGameContract.connect(prv.provider.getSigner());
      await signedContract.functions.levelUpForges(selectedForges, levelUpArray) ;
      //reset selected FYs array
      setSelectedForges([]);
    }

    const sizeHandler = async() => {
      const signedContract =  ugGameContract.connect(prv.provider.getSigner());
      await signedContract.functions.sizeUpForges(selectedForges) ;
      //reset selected FYs array
      setSelectedForges([]);
    }

    const claimHandler = async() => {
      const signedContract =  ugForgeSmithContract.connect(prv.provider.getSigner());
      //await signedContract.functions.claimAllStakingRewards() ;
      setUnclaimed(0);
        
    }

    const unstakeHandler = async() => {
      const signedContract =  ugForgeSmithContract.connect(prv.provider.getSigner());
      const receipt = await signedContract.functions.unstakeForges(selectedForges) ;
      //reset selected FYs array
      setSelectedForges([]);      
    }

    const UnselectHandler = () => {
     //reset selected FYs array
     setSelectedForges([]);
    }


    const selectedForgeHandler = (selectedId, clicked) => {
      //first recreate list without them, then add if we need to
      setSelectedForges((prevState) => {
        return prevState.filter(id => id !== selectedId)
      });

      if(clicked){
        setSelectedForges((prevState) => {
          return [...prevState, selectedId];
        });
      }
    }

    const getUpdates = async() => {

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });   
      const forgeIds = await ugForgeSmithContract.getStakedForgeIDsForUser(accounts[0]);
      setStakedForgeIds(forgeIds);
  
      const forges = await ugNftContract.getForgeFightClubs(forgeIds);
      setStakedForges(forges);

      
      const unclaimedBloodRewards = await ugForgeSmithContract.calculateAllForgeBloodRewards(forgeIds);
      setUnclaimedBloodRewards(unclaimedBloodRewards);
  

      // const fightClubUnclaimed = await ugRaidContract.fightClubOwnerBloodRewards(accounts[0]);
      // setUnclaimed(fightClubUnclaimed);
  
    }

    const claimWeaponAllHandler = async() => {    
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });   
      const _forgeIds = await ugForgeSmithContract.getStakedForgeIDsForUser(accounts[0]);
      if(_forgeIds.length < 1){
        setError({
          title: 'No Forges to claim',
          message: 'Stake a Forge to mint Weapons.',
        });
        return;
      } 
      const forgeIds = _forgeIds?.map(id => { return Number(id.toString()); })
      const signedContract =  ugForgeSmithContract.connect(prv.provider.getSigner());
      await signedContract.functions.claimAllStakingRewards(accounts[0]) ;
      setSelectedForges([]);      
    }
  
   
  
    const unstakeAllHandler = async() => {    
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });   
      const forgeIds = await ugForgeSmithContract.getStakedForgeIDsForUser(accounts[0]);
      if(forgeIds.length < 1){
        setError({
          title: 'No Forges to unstake',
          message: '',
        });
        return;
      } 
      const signedContract =  ugForgeSmithContract.connect(prv.provider.getSigner());
      await signedContract.functions.unstakeForges(forgeIds) ;
      setSelectedForges([]);      
    }

    useEffect(() => {   
        const init = async() => {   
          getUpdates();
          
          const timer = setInterval(() => {
            getUpdates();
            
          }, 5000);
     
          return () => {
            clearInterval(timer);
          };
        }
        init();
        // eslint-disable-next-line
      }, []);
    
  return (
    <Stack >      
      <Box className="staked-bordr"  width={550}>
        <Typography variant="h4" align="center" sx={{fontFamily: 'Alegreya Sans SC',  p:0, color: 'gold' }}>
            Unstake these Forges
        </Typography>
        <Container className="fc-bordr"  >
          <Stack direction="row" sx={{justifyContent: 'space-between'}}>                        
              <Typography variant='body2'  sx={{p: 1,fontFamily: 'Alegreya Sans SC',  fontSize:'1.25rem', color: 'palegreen'}}>Forge Revenue</Typography> 
              <Typography variant='body2'  sx={{p: 1, fontFamily: 'Alegreya Sans SC',  fontSize:'1.25rem', color: 'red'}}>{Number(unclaimedBloodRewards)} blood</Typography>  
              </Stack>
      </Container>
        <ImageList sx={{p:1, maxWidth: 800, maxHeight: 600}} cols={1} rowHeight={400}  >
          {stakedForges?.map((forge) => (
            <ImageListItem key={forge.id}  >
              <StakedForgeCard key={forge.id} 
                id={forge.id}
                level={forge.level}
                size={forge.size}
                lastLevelTime={forge.lastLevelUpgradeTime}
                lastUnstakeTime={forge.lastUnstakeTime}
                onSelected={selectedForgeHandler}
              emptyArray={selectedForges.length > 0 ? false : true} 
              />
         
            </ImageListItem>
          ))}
     
      </ImageList>
      <Stack direction="row"  maxwidth={'md'} sx={{ justifyContent: 'center' }}>
        <ButtonGroup variant="contained" color="error" sx={{ borderColor: 'red', border: 3  }}>
          <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={unstakeHandler} >Unstake </Button>
          <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={unstakeAllHandler} >Unstake All </Button>
          <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={UnselectHandler} >Unselect </Button>
        </ButtonGroup>
      </Stack>
   
    </Box>
  </Stack>
  );
}

