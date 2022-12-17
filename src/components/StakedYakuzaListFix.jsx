import {useContext, useState, useEffect} from 'react';
import ProviderContext from '../context/provider-context';
import StakedFighterCard from './StakedFighterCardFix';
import {Button, Stack, ButtonGroup, Typography, Box, ImageList, ImageListItem} from '@mui/material';
import {getUGGame, getUGArena, getUGNft} from '../utils.js';
import './stakedFighterList.css';
const baseUrl = 'https://the-u.club/reveal/fighteryakuza/';

export default function StakedYakuzaListFix() {
    const prv = useContext(ProviderContext);    
    const[selectedFYs, setSelectedFYs] = useState([]);
    const[stakedYakuza, setStakedYakuza] = useState();
    const ugNftContract = getUGNft();
    const ugArenaContract = getUGArena();

    // const filteredList = prv.stakedFYs.filter(fy => ( fy.isFighter !== true));
    // console.log('f',filteredList);

    const claimHandler = async() => {
      const signedContract =  ugArenaContract.connect(prv.provider.getSigner());
      await signedContract.functions.claimManyFromArena(selectedFYs,  false) ;
      //reset selected FYs array
      setSelectedFYs([]);      
    }

    const unstakeHandler = async() => {
      const signedContract =  ugArenaContract.connect(prv.provider.getSigner());
      const receipt = await signedContract.functions.claimManyFromArena(selectedFYs,  true) ;
      //reset selected FYs array
      setSelectedFYs([]);      
    }

    const unstakeAllHandler = async() => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });      
      const _stakedIds = await ugArenaContract.getStakedYakuzaIDsForUser(accounts[0]);        
      const stakedIds = _stakedIds.map(id => { return Number(id.toString()); })      
      const signedContract =  ugArenaContract.connect(prv.provider.getSigner());
      const receipt = await signedContract.functions.claimManyFromArena(stakedIds,  true) ;
      //reset selected FYs array
      setSelectedFYs([]);      
    }

    const UnselectHandler = () => {
     //reset selected FYs array
     setSelectedFYs([]);
    }


    const selectedFYHandler = (selectedId, clicked) => {
      //first recreate list without them, then add if we need to
      setSelectedFYs((prevState) => {
        return prevState.filter(id => id !== selectedId)
      });

      if(clicked){
        setSelectedFYs((prevState) => {
          return [...prevState, selectedId];
        });
      }
    }

    // const getUpdates = async() => {      
    //   setStakedFYs(prv.stakedFYs);
    // }

    useEffect(() => {   
     // getUpdates();
      const init = async() => {    
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });      
        const _stakedIds = await ugArenaContract.getStakedYakuzaIDsForUser(accounts[0]);        
        const stakedIds = _stakedIds.map(id => { return Number(id.toString()); })       
        const _stakedFYs = await ugNftContract.getFighters(stakedIds);     
        const stakedFYs = stakedIds.map((id, i) => {        
          let imageUrl =  "yakuza/" ;
          
          imageUrl = baseUrl.concat(imageUrl.concat(_stakedFYs[i].imageId).concat('.png'));
          let fy = {id, imageUrl, ..._stakedFYs[i]};
          //console.log('fy',fy);
          return fy;
        })   
        setStakedYakuza(stakedFYs);
        
    //     const timer = setInterval(() => {
          
    //      // getUpdates();
    //     }, 5000);
  
        
    //     return () => {
    //       clearInterval(timer);
    //     };
      }
      init();
      // eslint-disable-next-line
     }, []);
  
    
  return (
    <Box className="staked-bordr"  maxWidth={{sm: 400, md: 450}} maxHeight={{sm: 500, md: 500}}>
        <Typography variant="h4" align="center" sx={{fontFamily: 'Alegreya Sans SC',  p:0, color: 'gold' }}>
            Unstake Yakuza v2 fix
        </Typography>
    <ImageList sx={{p:1, maxWidth: 520, maxHeight: 400}} cols={2} rowHeight={250} >
      {stakedYakuza?.map((fy) => (
        <ImageListItem key={fy?.id}  >
            <StakedFighterCard key={fy?.id} 
             id={fy?.id}
             brutality= {fy?.brutality}
             courage={fy?.courage}
             cunning={fy?.cunning}
             level={fy?.level}
             rank={fy?.rank}
             isFighter={fy?.isFighter}
             imageUrl={fy?.imageUrl}
             lastLevelTime={fy?.lastLevelUpgradeTime}
             lastRaidTime={fy?.lastRaidTime}
             onSelected={selectedFYHandler}
             emptyArray={selectedFYs?.length > 0 ? false : true} />
         
        </ImageListItem>
      ))}
     
      </ImageList>
      <Stack direction="row"  maxwidth={'md'} sx={{ justifyContent: 'center' }}>
       {stakedYakuza?.length > 0 && <ButtonGroup variant="contained" color="error" sx={{ borderColor: 'red', border: 3  }}>
          <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={claimHandler} >Claim </Button>
          <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={unstakeHandler} >Unstake </Button>
          <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={unstakeAllHandler} >Unstake All </Button>
          <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={UnselectHandler} >Unselect </Button>
        </ButtonGroup>}
      </Stack>
   
    </Box>

  );
}

