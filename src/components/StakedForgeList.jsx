import React, {useContext, useState, useEffect} from 'react';
import ProviderContext from '../context/provider-context';
import StakedForgeCard from './StakedForgeCard';
import {Box, Container, Button, Stack, ButtonGroup, Typography, ImageList, ImageListItem} from '@mui/material';
import './stakedForgeList.css';
import ErrorModal from './ui/ErrorModal';
import {getUGNft2, getUGForgeSmith3, getUGGame4} from '../utils.js';

export default function StakedForgeList() {
    const prv = useContext(ProviderContext);    
    const[fclubs, setFclubs] = useState([]);
    const [unclaimedBloodRewards, setUnclaimedBloodRewards] = useState(undefined);
    const [selectedForges, setSelectedForges] = useState([]);
    const [stakedForgeIds, setStakedForgeIds] = useState([]);
    const [stakedForges, setStakedForges] = useState([]);    
    const [error, setError] = useState();
    const [unclaimed, setUnclaimed] = useState(0);
    const ugForgeSmithContract = getUGForgeSmith3();
    const ugNftContract = getUGNft2();
    const ugGameContract = getUGGame4();

    const levelHandler = async() => {
      if(selectedForges.length < 1){
        setError({
          title: 'Must SELECT at least 1 Forge',
          message: 'Have another go..',
        });
        return;
      } 
      const levelUpArray = selectedForges.map(i => { return 1;});
      const signedContract =  ugGameContract.connect(prv.provider.getSigner());
      await signedContract.functions.levelUpForges(selectedForges, levelUpArray) ;
      //reset selected FYs array
      setSelectedForges([]);
    }

    const sizeHandler = async() => {
      if(selectedForges.length < 1){
        setError({
          title: 'Must SELECT at least 1 Forge',
          message: 'Have another go..',
        });
        return;
      } 
      const signedContract =  ugGameContract.connect(prv.provider.getSigner());
      await signedContract.functions.sizeUpForges(selectedForges) ;
      //reset selected FYs array
      setSelectedForges([]);
    }

    const maintainHandler = async() => {
      if(selectedForges.length < 1){
        setError({
          title: 'Must SELECT at least 1 Forge',
          message: 'Have another go..',
        });
        return;
      } 
      const levelUpArray = selectedForges.map(i => { return 0;});
      const signedContract =  ugGameContract.connect(prv.provider.getSigner());
      await signedContract.functions.levelUpForges(selectedForges, levelUpArray) ;
      //reset selected FYs array
      setSelectedForges([]);
    }

    const claimHandler = async() => {
      const signedContract =  ugForgeSmithContract.connect(prv.provider.getSigner());
      //await signedContract.functions.claimAllStakingRewards() ;
      setUnclaimed(0);
        
    }

    const unstakeHandler = async() => {
      if(selectedForges.length < 1){
        setError({
          title: 'Must SELECT at least 1 Forge',
          message: 'Have another go..',
        });
        return;
      } 
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

    const errorHandler = () => {
      setError(null);
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
    <div>
    {error && (
                <ErrorModal 
                    title={error.title} 
                    message={error.message} 
                    onConfirm={errorHandler}
                />
    )}
    <Stack >      
      <Box className="staked-bordr"  width={580}>
        <Typography variant="h4" align="center" sx={{fontFamily: 'Alegreya Sans SC',  p:0, color: 'red' }}>
            Staked Forges
        </Typography>
        <Container className="fc-bordr"  >
          <Stack direction="row" sx={{justifyContent: 'space-between'}}>                        
              <Typography variant='body2'  sx={{p: 1,fontFamily: 'Alegreya Sans SC',  fontSize:'1.25rem', color: 'palegreen'}}>Forge Revenue</Typography> 
              <Typography variant='body2'  sx={{p: 1, fontFamily: 'Alegreya Sans SC',  fontSize:'1.25rem', color: 'red'}}>{Number(unclaimedBloodRewards)} blood</Typography>  
              </Stack>
      </Container>
        <ImageList sx={{p:1, maxWidth: 800, maxHeight: '75vh'}} cols={1} rowHeight={400}  >
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
      <Stack >
      <Typography variant="button" align="center" sx={{fontFamily: 'Alegreya Sans SC',  p:0, color: 'red',  fontSize:'.8rem' }}>
        <span>
        <Typography variant="button" align="center" sx={{fontFamily: 'Alegreya Sans SC',  p:0, color: 'gold',  fontSize:'.8rem' }}>
          Attention:
          </Typography>
        </span>
         Claiming, Sizing and Leveling Resets Weapon Drop Countdown
      </Typography>
      <Stack direction="row"  maxwidth={'md'} sx={{ justifyContent: 'center' }}>
        <ButtonGroup  color="error" sx={{ borderColor: 'red', border: 3  }}>
        <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'aqua'}} onClick={claimWeaponAllHandler} >Claim All </Button>

          <Stack>
            <Stack direction="row">
              <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'aqua'}} onClick={sizeHandler} >Size Up </Button>
              <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'aqua'}} onClick={levelHandler} >Level UP </Button>
            </Stack>
            <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'aqua'}} onClick={maintainHandler} >maintain</Button>
          </Stack>
          <Stack>
          <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'aqua'}} onClick={unstakeHandler} >Unstake </Button>
          <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'aqua'}} onClick={unstakeAllHandler} >Unstake All </Button>
          </Stack>
          <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'aqua'}} onClick={UnselectHandler} >Unselect </Button>
        </ButtonGroup>
      </Stack>
      </Stack>
   
    </Box>
  </Stack>
  </div>
  );
}

