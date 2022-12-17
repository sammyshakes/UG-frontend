import {useContext, useState, useEffect} from 'react';
import ProviderContext from '../context/provider-context';
import FighterCard from './FighterCard'
import './stakedFighterList.css';
import {Button, Stack, ButtonGroup, Typography, Box, ImageList, ImageListItem} from '@mui/material';
import { getUGNft, getUGMigration2} from '../utils.js';
import ErrorModal from './ui/ErrorModal';


export default function OwnedFighterListFix() {
    const prv = useContext(ProviderContext);
    const ownedFYs = prv.ownedFYs;
    const ownedIds = prv.ownedFYIds;
    const[selectedFYs, setSelectedFYs] = useState([]);
    const[isApproved, setIsApproved] = useState(false);
    const [error, setError] = useState();
    const ugNftContract = getUGNft();
    const ugMigration2Contract = getUGMigration2();

    const getUpdates = async() => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });       
      const approved = await ugNftContract.isApprovedForAll(accounts[0], ugMigration2Contract.address);
      
      setIsApproved(approved);
    } 

    const approveHandler = async() => {
      const signedContract =  ugNftContract.connect(prv.provider.getSigner());
      await signedContract.functions.setApprovalForAll(ugMigration2Contract.address, true) ;      
      return;  
    }    

    const migrateBatchFighterHandler = async() => {      
      const signedContract =  ugMigration2Contract.connect(prv.provider.getSigner());
      const filteredArray = ownedFYs.filter(fy => (fy.imageId > 0));
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
        await signedContract.functions.migrateV2Fighters(slicedArray, false);
        if(ids.length > 100) {
          const slicedArray = ids.slice(50, 100);
          await signedContract.functions.migrateV2Fighters(slicedArray, false);
          } else {
            const slicedArray = ids.slice(50, ids.length);
            await signedContract.functions.migrateV2Fighters(slicedArray, false);
          }
          if(ids.length > 150) {
            const slicedArray = ids.slice(100, 150);
          await signedContract.functions.migrateV2Fighters(slicedArray, false);
          }
          if(ids.length <= 150 && ids.length > 100){
            const slicedArray = ids.slice(100, ids.length);
            await signedContract.functions.migrateV2Fighters(slicedArray, false);
          }
          if(ids.length > 200) {
            const slicedArray = ids.slice(150, 200);
          await signedContract.functions.migrateV2Fighters(slicedArray, false);
          }
          if(ids.length > 150 && ids.length <= 200){
            const slicedArray = ids.slice(150, ids.length);
            await signedContract.functions.migrateV2Fighters(slicedArray, false);
          }
          if(ids.length > 250) {
            const slicedArray = ids.slice(150, 200);
          await signedContract.functions.migrateV2Fighters(slicedArray, false);
          }
          if(ids.length > 200 && ids.length <= 250){
            const slicedArray = ids.slice(200, ids.length);
            await signedContract.functions.migrateV2Fighters(slicedArray, false);
          }
          if(ids.length > 300) {
            const slicedArray = ids.slice(250, 300);
          await signedContract.functions.migrateV2Fighters(slicedArray, false);
          }
          if(ids.length > 250 && ids.length <= 300){
            const slicedArray = ids.slice(250, ids.length);
            await signedContract.functions.migrateV2Fighters(slicedArray, false);
          }
          if(ids.length > 350) {
            const slicedArray = ids.slice(300, 350);
          await signedContract.functions.migrateV2Fighters(slicedArray, false);
          }
          if(ids.length > 300 && ids.length <= 350){
            const slicedArray = ids.slice(300, ids.length);
            await signedContract.functions.migrateV2Fighters(slicedArray, false);
          }
          if(ids.length > 400) {
            const slicedArray = ids.slice(350, 400);
          await signedContract.functions.migrateV2Fighters(slicedArray, false);
          }
          if(ids.length > 350 && ids.length <= 400){
            const slicedArray = ids.slice(350, ids.length);
            await signedContract.functions.migrateV2Fighters(slicedArray, false);
          }
          if(ids.length > 450) {
            const slicedArray = ids.slice(400, 450);
          await signedContract.functions.migrateV2Fighters(slicedArray, false);
          }
          if(ids.length > 400 && ids.length <= 450){
            const slicedArray = ids.slice(4000, ids.length);
            await signedContract.functions.migrateV2Fighters(slicedArray, false);
          }
          
        return;
      }
      await signedContract.functions.migrateV2Fighters(ids, false) ;
      //reset selected FYs array
      setSelectedFYs([]);      
    
  }

    const v2FixAllHandler = async() => {     
      if(Number(ownedIds.length) < 1){
        setError({
            title: 'No V2 Fighters To Fix',
            message: 'Either already fixed or still need to unstake..',
        });
        return;
      }
      const signedContract =  ugMigration2Contract.connect(prv.provider.getSigner());
      await signedContract.functions.migrateV2Fighters(ownedIds, false);
      //reset selected FYs array
      setSelectedFYs([]);      
    }

    const v2FixHandler = async() => {
      const signedContract =  ugMigration2Contract.connect(prv.provider.getSigner());
      const receipt = await signedContract.functions.migrateV2Fighters(selectedFYs, false) ;
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
      getUpdates();  
        const init = async() => {      
               
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
    <Box className="staked-bordr" maxWidth={{sm: 650, md: 700}} maxHeight={{sm: 700, md: 700}}>
        <Typography variant="h4" align="center" sx={{fontFamily: 'Alegreya Sans SC', p:1, color: 'gold' }}>
            Fighters ready for V2 fix
        </Typography>
    <ImageList sx={{ width: 650, height: 500 }} cols={5} rowHeight={250}  >
      {ownedFYs.map((fy) => (
        <ImageListItem key={fy.id}>
            <FighterCard  
            id={fy.id}
            brutality= {fy.brutality}
            courage={fy.courage}
            cunning={fy.cunning}
            level={fy.level}
            rank={fy.rank}
            isFighter={fy.isFighter}
            imageUrl={fy.imageUrl}
            onSelected={selectedFYHandler}
            emptyArray={selectedFYs.length > 0 ? false : true}
            />
         
        </ImageListItem>
      ))}
    </ImageList>
    <Stack direction="row"  maxwidth={'lg'} sx={{ justifyContent: 'center' }}>
        <ButtonGroup variant="contained" color="error" sx={{ borderColor: 'red', border: 3  }}>
          {isApproved && <Button  variant="contained" sx={{backgroundColor: 'black', color: 'red'}} onClick={v2FixHandler} >v2 fix </Button>}
          {isApproved && <Button  variant="contained"  sx={{backgroundColor: 'black', color: 'red'}} onClick={v2FixAllHandler} >v2 Fix All </Button>}
          
          {isApproved && <Button  variant="contained" sx={{backgroundColor: 'black', color: 'red'}} onClick={migrateBatchFighterHandler} >batches 50 </Button>}
          {!isApproved && <Button  variant="contained"  sx={{backgroundColor: 'black', color: 'red'}} onClick={approveHandler} >Approve </Button>}
          <Button  variant="contained"  sx={{backgroundColor: 'black', color: 'red'}} onClick={UnselectHandler} >Unselect </Button>
        </ButtonGroup>
      </Stack>
    </Box>
    </div>
  );
}

