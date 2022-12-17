import {useContext, useState, useEffect} from 'react';
import ProviderContext from '../context/provider-context';
import StakedFighterCard from './StakedFighterCardFix';
import {Button, Stack, ButtonGroup, Typography, Box, ImageList, ImageListItem} from '@mui/material';
import {getUGArena, getUGMigration2} from '../utils.js';
import ErrorModal from './ui/ErrorModal';
import './stakedFighterList.css';

export default function StakedFighterListFix() {
    const prv = useContext(ProviderContext);    
    const[selectedFYs, setSelectedFYs] = useState([]);
    const [error, setError] = useState();
    const ugArenaContract = getUGArena();
    const ugMigration2Contract = getUGMigration2();

    const claimHandler = async() => {
      if(selectedFYs.length < 1){
        setError({
            title: 'Select Some Fighters!',
            message: 'You got this.',
        });
        return;
      }
      setError({
        title: 'Claiming freezes unstaking for 24 hours!',
        message: 'You have been warned.',
    });
      const signedContract =  ugArenaContract.connect(prv.provider.getSigner());
      await signedContract.functions.claimManyFromArena(selectedFYs,  false) ;
      //reset selected FYs array
      setSelectedFYs([]);      
    }

    const claimAllHandler = async() => {
      const idArray = filteredList.filter(fy => fy.imageId !== 0);
      console.log(idArray);
      if(idArray.length < 1){
        setError({
            title: 'No Fighters to Claim',
            message: '',
        });
        return;
      }
      setError({
        title: 'Claiming freezes unstaking for 24 hours!',
        message: 'You have been warned.',
    });
      const signedContract =  ugArenaContract.connect(prv.provider.getSigner());
      await signedContract.functions.claimManyFromArena(idArray,  false) ;
       
    }

    const v2MigrateAllHandler = async() => {
      const filteredArray = filteredList.filter(fy => (fy.imageId > 0));
      const idArray = filteredArray.map(fy => { return fy.id;});
      const signedContract =  ugMigration2Contract.connect(prv.provider.getSigner());
      await signedContract.functions.migrateV2Fighters(idArray,  true) ;
       
    }

    const v2MigrateHandler = async() => {
      console.log('sfys',selectedFYs);
      const signedContract =  ugMigration2Contract.connect(prv.provider.getSigner());
      await signedContract.functions.migrateV2Fighters(selectedFYs,  true) ;
       
    }

    const unstakeHandler = async() => {
      console.log(selectedFYs);
      if(selectedFYs.length < 1){
        setError({
            title: 'Select Some Fighters!',
            message: 'You got this.',
        });
        return;
      }
      //const idArray = filteredList.filter(fy => fy.id === 0);
      if(selectedFYs.length < 1){
        setError({
            title: 'Select Some Fighters!',
            message: 'You got this.',
        });
        return;
      }
      const signedContract =  ugArenaContract.connect(prv.provider.getSigner());
      const receipt = await signedContract.functions.claimManyFromArena(selectedFYs,  true) ;
      //reset selected FYs array
      setSelectedFYs([]);      
    }

    const unstakeBatchFighterHandler = async() => {
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
  
        if(ids.length > 50) {
          const slicedArray = ids.slice(0, 50);      
          await signedContract.functions.claimManyFromArena(slicedArray,  true) ;
          if(ids.length > 100) {
            const slicedArray = ids.slice(50, 100);
            await signedContract.functions.claimManyFromArena(slicedArray,  true) ;
            } else {
              const slicedArray = ids.slice(50, ids.length);
              await signedContract.functions.claimManyFromArena(slicedArray,  true) ;
            }
            if(ids.length > 150) {
              const slicedArray = ids.slice(100, 150);
            await signedContract.functions.claimManyFromArena(slicedArray,  true) ;
            }
            if(ids.length <= 150 && ids.length > 100){
              const slicedArray = ids.slice(100, ids.length);
              await signedContract.functions.claimManyFromArena(slicedArray,  true) ;
            }
            if(ids.length > 200) {
              const slicedArray = ids.slice(150, 200);
            await signedContract.functions.claimManyFromArena(slicedArray,  true) ;
            }
            if(ids.length > 150 && ids.length <= 200){
              const slicedArray = ids.slice(150, ids.length);
              await signedContract.functions.claimManyFromArena(slicedArray,  true) ;
            }
            if(ids.length > 250) {
              const slicedArray = ids.slice(150, 200);
            await signedContract.functions.claimManyFromArena(slicedArray,  true) ;
            }
            if(ids.length > 200 && ids.length <= 250){
              const slicedArray = ids.slice(200, ids.length);
              await signedContract.functions.claimManyFromArena(slicedArray,  true) ;
            }
            if(ids.length > 300) {
              const slicedArray = ids.slice(250, 300);
            await signedContract.functions.claimManyFromArena(slicedArray,  true) ;
            }
            if(ids.length > 250 && ids.length <= 300){
              const slicedArray = ids.slice(250, ids.length);
              await signedContract.functions.claimManyFromArena(slicedArray,  true) ;
            }
            if(ids.length > 350) {
              const slicedArray = ids.slice(300, 350);
            await signedContract.functions.claimManyFromArena(slicedArray,  true) ;
            }
            if(ids.length > 300 && ids.length <= 350){
              const slicedArray = ids.slice(300, ids.length);
              await signedContract.functions.claimManyFromArena(slicedArray,  true) ;
            }
            if(ids.length > 400) {
              const slicedArray = ids.slice(350, 400);
            await signedContract.functions.claimManyFromArena(slicedArray,  true) ;
            }
            if(ids.length > 350 && ids.length <= 400){
              const slicedArray = ids.slice(350, ids.length);
              await signedContract.functions.claimManyFromArena(slicedArray,  true) ;
            }
            if(ids.length > 450) {
              const slicedArray = ids.slice(400, 450);
            await signedContract.functions.claimManyFromArena(slicedArray,  true) ;
            }
            if(ids.length > 400 && ids.length <= 450){
              const slicedArray = ids.slice(4000, ids.length);
              await signedContract.functions.claimManyFromArena(slicedArray,  true) ;
            }
            
          return;
        }
        await signedContract.functions.claimManyFromArena(ids, true) ;
        //reset selected FYs array
        setSelectedFYs([]);      
      
    }

    const unstakeAllHandler = async() => {
      const filteredArray = filteredList.filter(fy => (fy.imageId > 0));
      if(filteredArray.length < 1){
        setError({
            title: 'No Fighters to Unstake!',
            message: '',
        });
        return;
      }
      const idArray = filteredArray.map(fy => { return fy.id;});
      const signedContract =  ugArenaContract.connect(prv.provider.getSigner());
      let gas = await signedContract.estimateGas.claimManyFromArena(idArray,  true);
        console.log('g',gas.toString());
        //error
        if (gas > 8000000) {
            setError({
            title: 'This Tx will Most Likely Fail.. ',
            message: 'Try reducing Number of fighters.',
            });
            return;
        }       
        gas = Number(gas) + Number(gas) * .25;      
        if (gas > 7000000) gas = 8000000;
      console.log('aa',idArray);
      
      const receipt = await signedContract.functions.claimManyFromArena(idArray,  true) ;
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

    const errorHandler = () => {
      setError(null);
    }

    useEffect(() => {   
      //getUpdates();
      const init = async() => {      
        
        
        // const timer = setInterval(() => {
          
        //   getUpdates();
        // }, 15000);
  
        
        // return () => {
        //   clearInterval(timer);
        // };
      }
      init();
      // eslint-disable-next-line
    }, []);
  
    const filteredList = prv.stakedFYs?.filter(fy => (fy.isFighter === true));
  return (
    <div>
        {error && (
                    <ErrorModal 
                        title={error.title} 
                        message={error.message} 
                        onConfirm={errorHandler}
                    />
        )}
    <Box className="staked-bordr" maxWidth={{sm: 400, md: 500}} maxHeight={{sm: 500, md: 500}}>

        <Typography variant="h4" align="center" sx={{fontFamily: 'Alegreya Sans SC',  p:0, color: 'gold' }}>
        unstake Fighters V2 fix
        </Typography>

    <ImageList sx={{p:1, maxWidth: 520, maxHeight: 400}} cols={4} rowHeight={250} >
      {filteredList?.map((fy) => (
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
             emptyArray={selectedFYs.length > 0 ? false : true} 
             />
         
        </ImageListItem>
      ))}
     
      </ImageList>
      <Stack direction="row"  maxwidth={'md'} sx={{ justifyContent: 'center' }}>
        <ButtonGroup variant="contained" color="error" sx={{ borderColor: 'red', border: 3  }}>    
        <Button  variant="contained" size="small"  sx={{backgroundColor: 'black', color: 'red'}} onClick={unstakeBatchFighterHandler} >50 Batches</Button>
          <Button  variant="contained" size="small"  sx={{backgroundColor: 'black', color: 'red'}} onClick={unstakeAllHandler} >Unstake All</Button>
          <Button  variant="contained" size="small"  sx={{backgroundColor: 'black', color: 'red'}} onClick={unstakeHandler} >Unstake</Button>
          <Button  variant="contained" size="small"  sx={{backgroundColor: 'black', color: 'red'}} onClick={claimHandler} >Claim </Button>
          <Button  variant="contained" size="small"  sx={{backgroundColor: 'black', color: 'red'}} onClick={claimAllHandler} >Claim All</Button>
          <Button  variant="contained" size="small"  sx={{backgroundColor: 'black', color: 'red'}} onClick={UnselectHandler} >Unselect</Button>
        </ButtonGroup>
      </Stack>
   
    </Box>
    </div>

  );
}

