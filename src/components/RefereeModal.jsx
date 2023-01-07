import {useContext, useState,useEffect, React} from 'react';
import ProviderContext from '../context/provider-context';
import { getUGRaid3, getUGRaid4, getUGWeapons2 } from '../utils.js';
import './refereeModal.css'
import RefModal from './RefModal'
import ErrorModal from './ui/ErrorModal';
import CircularProgress from '@mui/material/CircularProgress';
import fightClubGif from '../assets/fclubs/fightclub_gif.gif';

import {Box, Card , Container, Stack, CardMedia, CardContent, Typography, Button} from '@mui/material';
/* global BigInt */
//34 level Tiers in this array but dont need to do all 34 since current max level Tier is much lower
const array = [...Array(20).keys()];
    //    console.log('array',array);

const RefereeModal = (props) => {
    const prv = useContext(ProviderContext);
    const ugRaidContract = getUGRaid4();
    const signedContract =  ugRaidContract.connect(prv.provider.getSigner());
    const [error, setError] = useState();
    const [size1FullRaids, setSize1FullRaids] = useState(undefined);
    const [size2FullRaids, setSize2FullRaids] = useState(undefined);
    const [size3FullRaids, setSize3FullRaids] = useState(undefined);
    const [size4FullRaids, setSize4FullRaids] = useState(undefined);
    
    const refHandler1 = async() => {   
        if (size1FullRaids + size2FullRaids + size3FullRaids + size4FullRaids === 0) {
            setError({
                title: 'Currently No Raids to Referee ',
                message: 'Try again later.',
            });
            return;
        }      

        if (size1FullRaids  === undefined) {
            setError({
                title: 'Currently Loading Raids... ',
                message: 'Try again in a moment.',
            });
            return;
        }     
        console.log('h');     
        let gas = await signedContract.estimateGas.referee(10);
        console.log('g',gas.toString());
        //error
        if (gas > 8000000) {
            setError({
            title: 'This Tx will Most Likely Fail.. ',
            message: 'Try choosing smaller referee size.',
            });
            return;
        }       
        gas = Number(gas) + Number(gas) * .25;      
        if (gas > 7000000) gas = 8000000;
        //await signedContract.functions.referee({gasLimit: 8000000 }) ;    
        const result = await signedContract.functions.referee(10, {gasLimit: Math.floor(gas) }) ; 
        setError({
            title: 'Nice Job! ',
            message: 'You Have Been Dropped Some Blood and Weapons..',
        });
        return;              
    }

    const refHandler2 = async() => {    
        if (size1FullRaids + size2FullRaids + size3FullRaids + size4FullRaids === 0) {
            setError({
                title: 'Currently No Raids to Referee ',
                message: 'Try again later.',
            });
            return;
        }      

        if (size1FullRaids  === undefined) {
            setError({
                title: 'Currently Loading Raids... ',
                message: 'Try again in a moment.',
            });
            return;
        }            
        let gas = await signedContract.estimateGas.referee(25);
        console.log('g',gas.toString());
        //error
        if (gas > 8000000) {
            setError({
                title: 'This Tx will Most Likely Fail.. ',
                message: 'Try choosing smaller referee size.',
            });
            return;
        }       
        gas = Number(gas) + Number(gas) * .25;      
        if (gas > 7000000) gas = 8000000;
        //await signedContract.functions.referee(15,{gasLimit: 8000000 }) ;    
        const result = await signedContract.functions.referee(25, {gasLimit: Math.floor(gas) }) ; 
        setError({
            title: 'Nice Job! ',
            message: 'You Have Been Dropped Some Blood and Weapons..',
        });
        return; 
    }

    const refHandler3 = async() => {    
        if (size1FullRaids + size2FullRaids + size3FullRaids + size4FullRaids === 0) {
            setError({
                title: 'Currently No Raids to Referee ',
                message: 'Try again later.',
            });
            return;
        }      

        if (size1FullRaids  === undefined) {
            setError({
                title: 'Currently Loading Raids... ',
                message: 'Try again in a moment.',
            });
            return;
        }   
        let gas = await signedContract.estimateGas.referee(60);
        console.log('g',gas.toString());
        //error
        if (gas > 8000000) {
            setError({
                title: 'This Tx will Most Likely Fail.. ',
                message: 'Try choosing smaller referee size.',
            });
            return;
        }       
        gas = Number(gas) + Number(gas) * .25;      
        if (gas > 7000000) gas = 8000000;
        //await signedContract.functions.referee({gasLimit: 8000000 }) ;    
        const result = await signedContract.functions.referee(60, {gasLimit: Math.floor(gas) }) ; 
        setError({
            title: 'Nice Job! ',
            message: 'You Have Been Dropped Some Blood and Weapons..',
        });
        return; 
    }

    const refHandler4 = async() => {     
        if (size1FullRaids + size2FullRaids + size3FullRaids + size4FullRaids === 0) {
            setError({
                title: 'Currently No Raids to Referee ',
                message: 'Try again later.',
            });
            return;
        }      

        if (size1FullRaids  === undefined) {
            setError({
                title: 'Currently Loading Raids... ',
                message: 'Try again in a moment.',
            });
            return;
        }         
        
        // console.log(signedContract); 
        let gas = await signedContract.estimateGas.referee(100);
        console.log('g',gas.toString());
        //error
        if (gas > 8000000) {
            setError({
            title: 'This Tx will Most Likely Fail.. ',
            message: 'Try choosing smaller referee size.',
            });
            return;
        }       
        gas = Number(gas) + Number(gas) * .25;      
        if (gas > 7000000) gas = 8000000;
        //await signedContract.functions.referee({gasLimit: 8000000 }) ;    
        const result = await signedContract.functions.referee(100, {gasLimit: Math.floor(gas) }) ; 
        setError({
            title: 'Nice Job! ',
            message: 'You Have Been Dropped Some Blood and Weapons..',
        });
        return;
    }
     

    const getFullRaids = async() => {
        // const _array = [...Array(34).keys()].map(key => {
        //     return await  ugRaidContract.getRaiderQueueLength(key,1);
        // });


        // for(const levelTier of array) {         
        //     const _size1Queue = await ugRaidContract.getRaiderQueueLength(levelTier + 1,1);
        //     const _size2Queue = await ugRaidContract.getRaiderQueueLength(levelTier + 1,2);
        //     const _size3Queue = await ugRaidContract.getRaiderQueueLength(levelTier + 1,3);
        //     const _size4Queue = await ugRaidContract.getRaiderQueueLength(levelTier + 1,4);
        //     size1Queue.push(Math.floor(_size1Queue/5));
        //     size2Queue.push(Math.floor(_size2Queue/10));
        //     size3Queue.push(Math.floor(_size3Queue/15));
        //     size4Queue.push(Math.floor(_size4Queue/20));
        // }
        // setSize1FullRaids(size1Queue.reduce((a,v) =>  a = a + v , 0 ));
        // setSize2FullRaids(size2Queue.reduce((a,v) =>  a = a + v , 0 ));
        // setSize3FullRaids(size3Queue.reduce((a,v) =>  a = a + v , 0 ));
        // setSize4FullRaids(size4Queue.reduce((a,v) =>  a = a + v , 0 ));


        setSize1FullRaids(await ugRaidContract.getRaiderQueueLengths(1));
        setSize2FullRaids(await ugRaidContract.getRaiderQueueLengths(2));
        setSize3FullRaids(await ugRaidContract.getRaiderQueueLengths(3));
        setSize4FullRaids(await ugRaidContract.getRaiderQueueLengths(4));
    }

    const errorHandler = () => {
        setError(null);
        props.hideModal(); 
    }     
    
    useEffect(() => {   
        getFullRaids();   
          const init = async() => {      
                 
              const timer = setInterval(() => {
                getFullRaids(); 
                
              }, 60000);
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
    <Box className="box-bordr" sx={{maxWidth: 400}} >
        <RefModal >       
            
            <Box className="box-bordr" >
                <Stack >
                    <Typography variant='body2' align='center' sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>Raid Referee</Typography>
                    <Stack direction="row" sx={{justifyContent: 'space-between'}}>                    
                        <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'red'}}>Less Raids/Gas</Typography>
                        <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'red'}}>More Raids/Gas</Typography>
                    </Stack>
                    
                    
                    <Stack direction="row" sx={{pt: 2, justifyContent: 'space-between'}}>
                        <Button variant='contained' size="small"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'black', backgroundColor:'gold'}} value={4} onClick={props.hideModal}>Back</Button>
                        <Button variant='contained' size="small"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'black', backgroundColor:'crimson'}} value={4} onClick={refHandler1}>XSmall</Button>
                       <Button variant='contained' size="small"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'black', backgroundColor:'crimson'}} value={4} onClick={refHandler2}>Small</Button>
                       <Button variant='contained' size="small"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'black', backgroundColor:'crimson'}} value={4} onClick={refHandler3}>Medium</Button>
                       <Button variant='contained' size="small"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'black', backgroundColor:'crimson'}} value={4} onClick={refHandler4}>Large</Button>
                    </Stack>
                    <Box className="sweat-box">
                        <Stack direction="row"  sx={{ justifyContent: 'center'}}>                           
                            <Typography variant='body2' sx={{ fontFamily: 'Alegreya Sans SC', color: 'orange',  fontSize:'1.25rem'}}>Referee and Earn Blood and Weapons!</Typography>  
                        </Stack>
                       </Box>
                    <Box className="sweat-box">
                        <Stack direction="row"  sx={{ justifyContent: 'space-between'}}>                           
                            <Typography variant='body2' sx={{ fontFamily: 'Alegreya Sans SC', color: 'red',  fontSize:'1rem'}}>Full Raids:</Typography>  
                            <Typography variant='body2' sx={{ fontFamily: 'Alegreya Sans SC', color: 'orange',  fontSize:'.8rem'}}>Size 1:</Typography> 
                            {size1FullRaids !== undefined && <Typography variant='body2' sx={{ fontFamily: 'Alegreya Sans SC', color: 'red',  fontSize:'1.25rem'}}>{size1FullRaids}</Typography> }
                            {size1FullRaids === undefined && <CircularProgress color="error" size="1rem" /> }
                            <Typography variant='body2' sx={{ fontFamily: 'Alegreya Sans SC', color: 'orange',  fontSize:'.8rem'}}>Size 2:</Typography> 
                            {size2FullRaids !== undefined && <Typography variant='body2' sx={{ fontFamily: 'Alegreya Sans SC', color: 'red',  fontSize:'1.25rem'}}>{size2FullRaids}</Typography>} 
                            {size2FullRaids === undefined && <CircularProgress color="error" size="1rem" /> }
                            <Typography variant='body2' sx={{ fontFamily: 'Alegreya Sans SC', color: 'orange',  fontSize:'.8rem'}}>Size 3:</Typography> 
                            {size3FullRaids !== undefined && <Typography variant='body2' sx={{ fontFamily: 'Alegreya Sans SC', color: 'red',  fontSize:'1.25rem'}}>{size3FullRaids}</Typography>} 
                            {size3FullRaids === undefined && <CircularProgress color="error" size="1rem" /> }
                            <Typography variant='body2' sx={{ fontFamily: 'Alegreya Sans SC', color: 'orange',  fontSize:'.8rem'}}>Size 4:</Typography> 
                            {size4FullRaids !== undefined && <Typography variant='body2' sx={{ fontFamily: 'Alegreya Sans SC', color: 'red',  fontSize:'1.25rem'}}>{size4FullRaids}</Typography>}
                            {size4FullRaids === undefined && <CircularProgress color="error" size="1rem" /> }
                        </Stack>
                       </Box>
                       
                    <Stack  direction="row" className="box1-bordr" height={250} sx={{justifyContent: 'center'}} >
                        <img src={fightClubGif} alt="fightclub" height={220}  />
                    </Stack>
                </Stack>                
            </Box>
      
    </RefModal>
    </Box>
    </div>
  )
}

export default RefereeModal