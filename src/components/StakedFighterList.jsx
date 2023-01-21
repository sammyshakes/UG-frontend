import {useContext, useState, useEffect} from 'react';
import ProviderContext from '../context/provider-context';
import StakedFighterCard from './StakedFighterCard';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import NumbersIcon from '@mui/icons-material/Numbers';
import {Button, Stack, ButtonGroup, Typography, Box, ImageList, ImageListItem, ToggleButton, ToggleButtonGroup} from '@mui/material';
import {getUGGame5, getUGArena3} from '../utils.js';
import ErrorModal from './ui/ErrorModal';
import './stakedFighterList.css';

export default function StakedFighterList(props) {
    const prv = useContext(ProviderContext);    
    const[selectedFYs, setSelectedFYs] = useState([]);
    const [error, setError] = useState();
    const ugGameContract = getUGGame5();
    const ugArenaContract = getUGArena3();
    const [alignment, setAlignment] = useState('levelUp');    
    

    const levelHandler = async() => {
      const amountArray = selectedFYs.map(i => { return 1;});      
      const signedContract =  ugGameContract.connect(prv.provider.getSigner());
      await signedContract.functions.levelUpFighters(selectedFYs, amountArray, true) ;     
    }

    const claimHandler = async() => {
      const signedContract =  ugArenaContract.connect(prv.provider.getSigner());
      await signedContract.functions.claimManyFromArena(selectedFYs,  false) ;
       
    }

    const claimAllHandler = async() => {
      const idArray = filteredList.map(fy => { return fy.id;});
      const signedContract =  ugArenaContract.connect(prv.provider.getSigner());
      await signedContract.functions.claimManyFromArena(idArray,  false) ;
       
    }

    const unstakeHandler = async() => {
      const signedContract =  ugArenaContract.connect(prv.provider.getSigner());
      const receipt = await signedContract.functions.claimManyFromArena(selectedFYs,  true) ;
      //reset selected FYs array
      setSelectedFYs([]);      
    }

    const unstakeAllHandler = async() => {   
      const signedContract =  ugArenaContract.connect(prv.provider.getSigner());    
      const filteredArray = filteredList.filter(fy => (fy.imageId > 0));
      if(filteredArray.length < 1){
        setError({
            title: 'No Fighters to Unstake!',
            message: '',
        });
        return;
      }
      const ids = filteredArray.map(fy => { return fy.id;});
      const txInterval = 30;   
      const intervals = Math.floor(ids.length / txInterval);
  
      if(ids.length === 0) {
        setError({
          title: `Somethin aint right!!`,
          message: 'Try again or SELECT fighters and send',
        }); 
        return;
      }

      if(intervals > 0) setError({
        title: `Be Prepared for multiple Transactions, BUT.. `,
        message: 'if none appear, please click fighters individually',
      }); 
      
      if(intervals > 0) {
        const slicedArray = ids.slice(0 * txInterval, 1 * txInterval);
        
        console.log('slicedArray',slicedArray);
        await signedContract.functions.claimManyFromArena(slicedArray, true) ;
  
        for(let i = 1; i < intervals; i++){
          if(ids.length > (i + 1) * txInterval) {
            const slicedArray = ids.slice(i * txInterval, (i + 1) * txInterval);
            await signedContract.functions.claimManyFromArena(slicedArray, true) ;
          } else {
            const slicedArray = ids.slice(i * txInterval, ids.length);
            await signedContract.functions.claimManyFromArena(slicedArray, true) ;
            return;
          }
        }
        return;
      }
      await signedContract.functions.claimManyFromArena(ids, true) ; 
    }

    const UnselectHandler = () => {
     //reset selected FYs array
     setSelectedFYs([]);
    }

    const errorHandler = () => {
      setError(null);
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

    const handleAlignment = (event, newAlignment) => {
      console.log(newAlignment);
      if (newAlignment !== null) {
        setAlignment(newAlignment);
      }
    };

    const filteredList = props?.stakedFYs?.filter(fy => (fy.isFighter === true));
    let sortedLevelList  = filteredList?.sort((a, b) => b.level - a.level);

    if(alignment === 'levelUp') sortedLevelList = filteredList?.sort((a, b) => a.level - b.level);
    if(alignment === 'levelDown') sortedLevelList = filteredList?.sort((a, b) => b.level - a.level);
    if(alignment === 'timeUp') sortedLevelList = filteredList?.sort((a, b) => a.lastLevelUpgradeTime - b.lastLevelUpgradeTime);
    if(alignment === 'timeDown') sortedLevelList = filteredList?.sort((a, b) => b.lastLevelUpgradeTime - a.lastLevelUpgradeTime);

    
    //const sortedLevelTimeList = filteredList?.sort((a, b) => a.lastLevelUpgradeTime - b.lastLevelUpgradeTime);  
    
  return (
    <div>
    {error && (
                <ErrorModal 
                    title={error.title} 
                    message={error.message} 
                    onConfirm={errorHandler}
                />
    )}
    <Box className="staked-bordr"  maxHeight={{sm: '80vh', md: '80vh'}}>
      <Stack direction="row" sx={{ justifyContent: 'space-between'}}>
        <Typography variant="h4" align="center" sx={{fontFamily: 'Alegreya Sans SC',  p:0, color: 'red' }}>
            Staked Fighters
        </Typography>
        <Box >
        <ToggleButtonGroup
        size="small"
        value={alignment}
        exclusive
        onChange={handleAlignment}
        aria-label="text alignment"
      >
        <ToggleButton value="levelUp" aria-label="levelUp">
          <NumbersIcon sx={{ color: 'aqua', fontSize: '1.4rem' }}/>
          <ArrowUpwardIcon sx={{ color: 'aqua', fontSize: '1.4rem' }}/>
        </ToggleButton>
        <ToggleButton value="levelDown" aria-label="levelDown" >
          <NumbersIcon sx={{ color: 'aqua', fontSize: '1.4rem' }}/>
          <ArrowDownwardIcon sx={{ color: 'aqua', fontSize: '1.4rem' }}/>
        </ToggleButton>
        <ToggleButton value="timeUp" aria-label="timeUp" >
          <AccessTimeFilledIcon sx={{ color: 'aqua', fontSize: '1.4rem' }}/>
          <ArrowUpwardIcon sx={{ color: 'aqua', fontSize: '1.4rem' }}/>
        </ToggleButton>
        <ToggleButton value="timeDown" aria-label="timeDown">
          <AccessTimeFilledIcon sx={{ color: 'aqua', fontSize: '1.4rem' }} />
          <ArrowDownwardIcon sx={{ color: 'aqua', fontSize: '1.4rem' }}/>
        </ToggleButton>
        
      </ToggleButtonGroup>
      </Box>
        </Stack>
    <ImageList sx={{p:1,  maxHeight: '60vh'}} cols={4} rowHeight={320} >
      {sortedLevelList?.map((fy) => (
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
             emptyArray={selectedFYs.length > 0 ? false : true} 
             />
         
        </ImageListItem>
      ))}
     
      </ImageList>
      <Stack direction="row"  maxwidth={'md'} sx={{ justifyContent: 'center' }}>
        <ButtonGroup color="error" sx={{  }}>
          
        <Button  variant="contained" size="small"  sx={{backgroundColor: 'black', color: 'aqua', border: 2}} onClick={levelHandler} >Level up</Button>
          <Stack >
            <Button  variant="contained" size="small"  sx={{backgroundColor: 'black', color: 'aqua', border: 2}} onClick={claimHandler} >Claim </Button>
            <Button  variant="contained" size="small"  sx={{backgroundColor: 'black',color: 'aqua', border: 2}} onClick={claimAllHandler} >Claim All</Button>
          </Stack>
          <Stack>
            <Button  variant="contained" size="small"  sx={{backgroundColor: 'black', color: 'aqua', border: 2}} onClick={unstakeHandler} >Unstake</Button>
            <Button  variant="contained" size="small"  sx={{backgroundColor: 'black', color: 'aqua', border: 2}} onClick={unstakeAllHandler} >Unstake All</Button>
          </Stack>
         
          <Button  variant="contained" size="small"  sx={{backgroundColor: 'black', color: 'aqua', border: 2}} onClick={UnselectHandler} >Unselect</Button>
        
        </ButtonGroup>
      </Stack>
   
    </Box>
        </div>
  );
}

