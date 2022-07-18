import {useContext, useState} from 'react';
import ProviderContext from '../context/provider-context';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import StakedFighterCard from './StakedFighterCard';
import Box from '@mui/material/Box';
import {Button, Stack, ButtonGroup} from '@mui/material';
import Typography from '@mui/material/Typography';
import './stakedFighterList.css';
import {getUGGame, getUGArena} from '../utils.js';

export default function StakedFighterList() {
    const prv = useContext(ProviderContext);    
    const stakedFYs = prv.stakedFYs;
    const[selectedFYs, setSelectedFYs] = useState([]);
    const ugGameContract = getUGGame();
    const ugArenaContract = getUGArena();

    const levelHandler = async() => {
      const amountArray = selectedFYs.map(i => { return 1;});
      const signedContract =  ugGameContract.connect(prv.provider.getSigner());
      await signedContract.functions.levelUpFighters(selectedFYs, amountArray, true) ;
      //reset selected FYs array
      setSelectedFYs([]);
    }

    const claimHandler = async() => {
      const signedContract =  ugArenaContract.connect(prv.provider.getSigner());
      await signedContract.functions.claimManyFromArena(selectedFYs,  false) ;
      //reset selected FYs array
      setSelectedFYs([]);      
    }

    const unstakeHandler = async() => {
      const signedContract =  ugArenaContract.connect(prv.provider.getSigner());
      console.log(signedContract);
      console.log(selectedFYs);
      const receipt = await signedContract.functions.claimManyFromArena(selectedFYs,  true) ;
      console.log(receipt);
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
    
  return (
    <Box className="staked-bordr" maxWidth={{sm: 650, md: 700}} maxHeight={{sm: 700, md: 700}}>
        <Typography variant="h4" align="center" sx={{fontFamily: 'Alegreya Sans SC',  p:0, color: 'red' }}>
            Staked Fighters
        </Typography>
    <ImageList sx={{p:1, maxWidth: 700, maxHeight: 600}} cols={4} rowHeight={240} children="props" >
      {stakedFYs.map((fy) => (
        <ImageListItem key={fy.id}  >
            <StakedFighterCard key={fy.id} 
             id={fy.id}
             brutality= {fy.brutality}
             courage={fy.courage}
             cunning={fy.cunning}
             level={fy.level}
             rank={fy.rank}
             isFighter={fy.isFighter}
             imageUrl={fy.imageUrl}
             lastLevelTime={fy.lastLevelUpgradeTime}
             lastRaidTime={fy.lastRaidTime}
             onSelected={selectedFYHandler}
             emptyArray={selectedFYs.length > 0 ? false : true} />
         
        </ImageListItem>
      ))}
     
      </ImageList>
      <Stack direction="row"  maxwidth={'md'} sx={{ justifyContent: 'center' }}>
        <ButtonGroup variant="contained" color="error" sx={{ borderColor: 'red', border: 3  }}>
          <Button  variant="contained"  sx={{backgroundColor: 'black', color: 'red'}} onClick={claimHandler} >Claim </Button>
          <Button  variant="contained"  sx={{backgroundColor: 'black', color: 'red'}} onClick={unstakeHandler} >Unstake </Button>
          <Button  variant="contained"  sx={{backgroundColor: 'black', color: 'red'}} onClick={levelHandler} >Level UP </Button>
          <Button  variant="contained"  sx={{backgroundColor: 'black', color: 'red'}} onClick={UnselectHandler} >Unselect </Button>
        </ButtonGroup>
      </Stack>
   
    </Box>

  );
}

