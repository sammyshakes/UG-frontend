import {useContext, useState} from 'react';
import {Button, Stack, ButtonGroup, Box,ImageList,ImageListItem,Typography} from '@mui/material/';
import ProviderContext from '../context/provider-context';
import FighterV1Card from './FighterV1Card';
import './stakedV1FighterList.css';
import { getUGMigration2 } from '../utils';
import ErrorModal from './ui/ErrorModal';




export default function StakedV1FighterList() {
    const prv = useContext(ProviderContext);
    const[selectedFYs, setSelectedFYs] = useState([]);
    const [error, setError] = useState();
    const stakedV1Ids = prv.stakedV1FYIds;
    const ugMigrationContract = getUGMigration2();
    const signedContract =  ugMigrationContract.connect(prv.provider.getSigner());

    const unselectHandler = () => {
      //reset selected FYs array
      setSelectedFYs([]);
     }

    const errorHandler = () => {
      setError(null);
  }
    const migrateSelectedHandler = async() => {   
      const ids = selectedFYs?.map(id => { return Number(id); })
      if(ids.length === 0) { setError({
        title: `You must select eligible Fighters First`,
        message: 'Try again..',
      }); 
      return}
      if(ids.length > 30){setError({
        title: `Too Many.. `,
        message: 'Try to keep it at 30 or less',
      }); 
      return;}
      
      console.log('ids',ids);
      await signedContract.functions.migrateFighters(ids) ; 
      //reset selected FYs array
      setSelectedFYs([]);
    }


    const migrateAllHandler = async() => {      
      const ids = stakedV1Ids?.map(id => { return Number(id.toString()); })
      if(ids.length === 0) { setError({
        title: `Somethin aint right!!`,
        message: 'Try again or SELECT fighters and send',
      }); 
      return}
      if(ids.length > 40) setError({
        title: `Be Prepared for multiple Transactions, BUT.. `,
        message: 'if none appear, please click fighters individually',
      }); 
      
      if(ids.length > 30) {
        const slicedArray = ids.slice(0, 30);
        
        console.log('slicedArray',slicedArray);
        await signedContract.functions.migrateFighters(slicedArray) ;
        if(ids.length > 60) {
          const slicedArray = ids.slice(30, 60);
          await signedContract.functions.migrateFighters(slicedArray) ;
          } else {
            const slicedArray = ids.slice(30, ids.length);
            await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 90) {
            const slicedArray = ids.slice(60, 90);
          await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length <= 90 && ids.length > 60){
            const slicedArray = ids.slice(60, ids.length);
            await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 120) {
            const slicedArray = ids.slice(90, 120);
          await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 90 && ids.length <= 120){
            const slicedArray = ids.slice(90, ids.length);
            await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 150) {
            const slicedArray = ids.slice(120, 150);
          await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 120 && ids.length <= 150){
            const slicedArray = ids.slice(120, ids.length);
            await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 180) {
            const slicedArray = ids.slice(150, 180);
          await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 150 && ids.length <= 180){
            const slicedArray = ids.slice(150, ids.length);
            await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 210) {
            const slicedArray = ids.slice(180, 210);
          await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 180 && ids.length <= 210){
            const slicedArray = ids.slice(180, ids.length);
            await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 240) {
            const slicedArray = ids.slice(210, 240);
          await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 210 && ids.length <= 240){
            const slicedArray = ids.slice(210, ids.length);
            await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 270) {
            const slicedArray = ids.slice(240, 270);
          await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 240 && ids.length <= 270){
            const slicedArray = ids.slice(240, ids.length);
            await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 300) {
            const slicedArray = ids.slice(270, 300);
          await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 270 && ids.length <= 300){
            const slicedArray = ids.slice(270, ids.length);
            await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 330) {
            const slicedArray = ids.slice(300, 330);
          await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 300 && ids.length <= 330){
            const slicedArray = ids.slice(300, ids.length);
            await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 360) {
            const slicedArray = ids.slice(330, 360);
          await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 330 && ids.length <= 360){
            const slicedArray = ids.slice(330, ids.length);
            await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 390) {
            const slicedArray = ids.slice(360, 390);
          await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 360 && ids.length <= 390){
            const slicedArray = ids.slice(360, ids.length);
            await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 420) {
            const slicedArray = ids.slice(390, 420);
          await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 390 && ids.length <= 420){
            const slicedArray = ids.slice(390, ids.length);
            await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 450) {
            const slicedArray = ids.slice(420, 450);
          await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 420 && ids.length <= 450){
            const slicedArray = ids.slice(420, ids.length);
            await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 480) {
            const slicedArray = ids.slice(450, 480);
          await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 450 && ids.length <= 480){
            const slicedArray = ids.slice(450, ids.length);
            await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 510) {
            const slicedArray = ids.slice(480, 510);
          await signedContract.functions.migrateFighters(slicedArray) ;
          }
          if(ids.length > 480 && ids.length <= 510){
            const slicedArray = ids.slice(480, ids.length);
            await signedContract.functions.migrateFighters(slicedArray) ;
          }
        return;
      }
      await signedContract.functions.migrateFighters(ids) ; 
    }

    
 
 
     const selectedFYHandler = (selectedId, clicked) => {
      console.log('c',clicked);
      console.log('si',selectedId);
       //first recreate list without them, then add if we need to
       setSelectedFYs((prevState) => {
         return prevState.filter(id => id !== selectedId)
       });
       console.log('c',clicked);
       if(clicked ){
         setSelectedFYs((prevState) => {
           return [...prevState, selectedId];
         });
       }
     }



  return (
    <div>
        {error && (
                    <ErrorModal 
                        title={error.title} 
                        message={error.message} 
                        onConfirm={errorHandler}
                    />
        )}
    <Box className="staked-bordr"  sx={{p: 0,width: 440, height: 570 }}>
        <Typography variant="h4" align="center" sx={{fontFamily: 'Alegreya Sans SC',  p:0, color: 'red' }}>
            V1 Staked Fighters
        </Typography>
    <ImageList sx={{ width: 400, height: 500 }} cols={3} rowHeight={250} children="props">
      {stakedV1Ids?.map((id) => (
        <ImageListItem key={id}>
          <FighterV1Card 
            key={id} 
            id={id}
            onSelected={selectedFYHandler}
            emptyArray={selectedFYs.length > 0 ? false : true}
          />
         
        </ImageListItem>
      ))}
    </ImageList>
    <Stack direction="row"  maxwidth={'md'} sx={{ justifyContent: 'center' }}>
        <ButtonGroup variant="contained" color="error" sx={{ borderColor: 'red', border: 3  }}>
          <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={migrateAllHandler} >Migrate All</Button>
          <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={migrateSelectedHandler} >Migrate Selected </Button>
          <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={unselectHandler} >Unselect </Button>
        </ButtonGroup>
      </Stack>
    </Box>
    </div>
  );
}

