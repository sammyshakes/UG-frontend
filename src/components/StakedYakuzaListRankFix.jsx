import {useContext, useState, useEffect} from 'react';
import ProviderContext from '../context/provider-context';
import StakedFighterCard from './StakedFighterCard';
import {Button, Stack, ButtonGroup, Typography, Box, ImageList, ImageListItem} from '@mui/material';
import { getUGArena2, getUGFYakuza} from '../utils.js';
import './stakedFighterList.css';
const baseUrl = 'https://the-u.club/reveal/fighteryakuza/';

export default function StakedYakuzaListRankFix() {
    const prv = useContext(ProviderContext);    
    const[selectedFYs, setSelectedFYs] = useState([]);
    const[stakedYakuza, setStakedYakuza] = useState();
    const ugFYakuzaContract = getUGFYakuza();
    const ugArenaContract = getUGArena2();

    // const filteredList = prv.stakedFYs.filter(fy => ( fy.isFighter !== true));
    // console.log('f',filteredList);

    const claimHandler = async() => {
      const signedContract =  ugArenaContract.connect(prv.provider.getSigner());
      await signedContract.functions.claimManyFromArena(selectedFYs,  false) ;
      //reset selected FYs array
      setSelectedFYs([]);      
    }

    const claimAllHandler = async() => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });      
      const _stakedIds = await ugArenaContract.getStakedYakuzaIDsForUser(accounts[0]);        
      const stakedIds = _stakedIds.map(id => { return Number(id.toString()); })      
      const signedContract =  ugArenaContract.connect(prv.provider.getSigner());
      const receipt = await signedContract.functions.claimManyFromArena(stakedIds,  false) ;
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

    // const unstakeAllHandler = async() => {   
    //   const signedContract =  ugYakDen.connect(prv.provider.getSigner());    
    //   const filteredArray = filteredList.filter(fy => (fy.imageId > 0));
    //   if(filteredArray.length < 1){
    //     setError({
    //         title: 'No Fighters to Unstake!',
    //         message: '',
    //     });
    //     return;
    //   }
    //   const ids = filteredArray.map(fy => { return fy.id;});
    //   const txInterval = 30;   
    //   const intervals = Math.floor(ids.length / txInterval);
  
    //   if(ids.length === 0) {
    //     setError({
    //       title: `Somethin aint right!!`,
    //       message: 'Try again or SELECT fighters and send',
    //     }); 
    //     return;
    //   }

    //   if(intervals > 0) setError({
    //     title: `Be Prepared for multiple Transactions, BUT.. `,
    //     message: 'if none appear, please click fighters individually',
    //   }); 
      
    //   if(intervals > 0) {
    //     const slicedArray = ids.slice(0 * txInterval, 1 * txInterval);
        
    //     console.log('slicedArray',slicedArray);
    //     await signedContract.functions.claimManyFromArena(slicedArray, true) ;
  
    //     for(let i = 1; i < intervals; i++){
    //       if(ids.length > (i + 1) * txInterval) {
    //         const slicedArray = ids.slice(i * txInterval, (i + 1) * txInterval);
    //         await signedContract.functions.claimManyFromArena(slicedArray, true) ;
    //       } else {
    //         const slicedArray = ids.slice(i * txInterval, ids.length);
    //         await signedContract.functions.claimManyFromArena(slicedArray, true) ;
    //         return;
    //       }
    //     }
    //     return;
    //   }
    //   await signedContract.functions.claimManyFromArena(ids, true) ; 
    // }

    const UnselectHandler = () => {
     //reset selected FYs array
     setSelectedFYs([]);
    }


    const selectedFYHandler = (selectedId, clicked) => {
      if(clicked){
        setSelectedFYs((prevState) => {
          return [...prevState, selectedId];
        });
      } else {
        setSelectedFYs((prevState) => {
          return prevState.filter(id => id !== selectedId)
        });
      }
    }

    const getUpdates = async() => {   
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });      
        const _stakedIds = await ugArenaContract.getStakedYakuzaIDsForUser(accounts[0]);        
        const stakedIds = _stakedIds.map(id => { return Number(id.toString()); })       
        const _stakedFYs = await ugFYakuzaContract.getFighters(stakedIds);     
        const stakedFYs = stakedIds.map((id, i) => {        
          let imageUrl =  "yakuza/" ;
          
          imageUrl = baseUrl.concat(imageUrl.concat(_stakedFYs[i].imageId).concat('.png'));
          let fy = {id, imageUrl, ..._stakedFYs[i]};
          //console.log('fy',fy);
          return fy;
        })   
        setStakedYakuza(stakedFYs);
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
    <Box className="staked-bordr"  maxHeight={{sm: '80vh', md: '80vh'}}>
        <Typography variant="h4" align="center" sx={{fontFamily: 'Alegreya Sans SC',  p:0, color: 'red' }}>
            Staked Yakuza
        </Typography>
    <ImageList sx={{p:1, maxWidth: 10/10, maxHeight: '60vh'}} cols={3} rowHeight={260} >
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
        <ButtonGroup  color="error" sx={{ borderColor: 'aqua', border: 3  }}>
          <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'aqua', border: 2}} onClick={unstakeHandler} >Unstake </Button>
          <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'aqua', border: 2}} onClick={unstakeAllHandler} >Unstake All </Button>
          <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'aqua', border: 2}} onClick={UnselectHandler} >Unselect </Button>
        </ButtonGroup>
      </Stack>
   
    </Box>

  );
}

