import React, {useContext, useState, useEffect} from 'react';
import ProviderContext from '../context/provider-context';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import FightClubCard from './FightClubCardFix';
import {Box, Container, Button, Stack, ButtonGroup} from '@mui/material';
import Typography from '@mui/material/Typography';
import './stakedFightClubList.css';
import {getUGRaid, getUGNft} from '../utils.js';

export default function StakedFightClubList() {
    const prv = useContext(ProviderContext);    
    const[fclubs, setFclubs] = useState([]);
    const [selectedFClubs, setSelectedFClubs] = useState([]);
    const [stakedIds, setStakedIds] = useState([]);
    const [unclaimed, setUnclaimed] = useState(0);
    const ugRaidContract = getUGRaid();
    const ugNftContract = getUGNft();

    const claimHandler = async() => {
      const signedContract =  ugRaidContract.connect(prv.provider.getSigner());
      await signedContract.functions.claimFightClubBloodRewards() ;
      setUnclaimed(0);
        
    }

    const unstakeHandler = async() => {
      const signedContract =  ugRaidContract.connect(prv.provider.getSigner());
      const receipt = await signedContract.functions.unstakeFightclubs(selectedFClubs) ;
      //reset selected FYs array
      setSelectedFClubs([]);      
    }

    const unstakeAllHandler = async() => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }); 
      const signedContract =  ugRaidContract.connect(prv.provider.getSigner());
      const stakedFclubs = await signedContract.getStakedFightClubIDsForUser(accounts[0]);
      const receipt = await signedContract.functions.unstakeFightclubs(stakedFclubs) ;
      //reset selected FYs array
      setSelectedFClubs([]);      
    }

    const UnselectHandler = () => {
     //reset selected FYs array
     setSelectedFClubs([]);
    }


    const selectedFClubHandler = (selectedId, clicked) => {
      //first recreate list without them, then add if we need to
      setSelectedFClubs((prevState) => {
        return prevState.filter(id => id !== selectedId)
      });

      if(clicked){
        setSelectedFClubs((prevState) => {
          return [...prevState, selectedId];
        });
      }
    }

    const getUpdates = async() => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }); 
      const fclubIds = await ugRaidContract.getStakedFightClubIDsForUser(accounts[0]);
      const fclubs = await ugNftContract.getForgeFightClubs(fclubIds);
      const fightClubUnclaimed = await ugRaidContract.fightClubOwnerBloodRewards(accounts[0]);
      setUnclaimed(fightClubUnclaimed);
      setFclubs(fclubs);
      setStakedIds(fclubIds);

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
       <Box p={2} m={1} className="fclub-bordr" sx={{zIndex: 100}}>
            <Stack direction="row" spacing={2} justifyContent='space-around'>
                <Typography sx={{zIndex: 100,p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.25rem', color: 'gold'}}>unstake Fight Clubs for v2 Fix </Typography>
            </Stack>
        </Box>
      <Box className="staked-bordr" sx={{p:1,  maxHeight: 500, minHeight: 400}}>
        <Typography variant="h4" align="center" sx={{fontFamily: 'Alegreya Sans SC',  p:0, color: 'gold' }}>
            unstake Fight Clubs
        </Typography>
        {stakedIds.length > 0 &&<Container className="fc-bordr"  sx={{bgcolor: 'black' }}>
          <Stack direction="row" sx={{justifyContent: 'space-between'}}>                        
              <Typography variant='body2'  sx={{p: 1,fontFamily: 'Alegreya Sans SC',  fontSize:'1.25rem', color: 'palegreen'}}>Fight Club Profits</Typography> 
              <Typography variant='body2'  sx={{p: 1, fontFamily: 'Alegreya Sans SC',  fontSize:'1.25rem', color: 'red'}}>{unclaimed.toString()}</Typography>  
              <Button  variant="outlined" size="small" sx={{m: 1,borderRadius: '10px', borderColor: "palegreen", backgroundColor: 'black', color: 'palegreen'}} onClick={claimHandler} >Claim</Button>
              </Stack>
      </Container>}
      {stakedIds.length < 1 && <Typography variant='body2'  sx={{p: 1,fontFamily: 'Alegreya Sans SC',  fontSize:'1.25rem', color: 'palegreen'}}>No Fight Clubs To Unstake</Typography> 
              }
        <ImageList sx={{p:1, maxWidth: 850, maxHeight: 360}} cols={1} rowHeight={400}  >
          {fclubs?.map((fclub) => (
            <ImageListItem key={fclub.id}  >
              <FightClubCard key={fclub.id} 
                id={fclub.id}
                level={fclub.level}
                size={fclub.size}
                lastLevelTime={fclub.lastLevelUpgradeTime}
                lastUnstakeTime={fclub.lastUnstakeTime}
                onSelected={selectedFClubHandler}
              emptyArray={selectedFClubs.length > 0 ? false : true} 
              />
              
         
            </ImageListItem>
          ))}
     
      </ImageList>
      <Stack direction="row"  maxwidth={'md'} sx={{ justifyContent: 'center' }}>
      {stakedIds.length > 0 && <ButtonGroup variant="contained" color="error" sx={{ borderColor: 'red', border: 3  }}>
          <Button  variant="contained"  sx={{backgroundColor: 'black', color: 'red'}} onClick={unstakeHandler} >Unstake </Button>
          <Button  variant="contained"  sx={{backgroundColor: 'black', color: 'red'}} onClick={unstakeAllHandler} >Unstake All </Button>
          <Button  variant="contained"  sx={{backgroundColor: 'black', color: 'red'}} onClick={UnselectHandler} >Unselect </Button>
        </ButtonGroup>}
      </Stack>
   
    </Box>
  </Stack>
  );
}

