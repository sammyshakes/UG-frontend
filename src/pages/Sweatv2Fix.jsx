import {useContext, useState,useEffect, React} from 'react';
import ProviderContext from '../context/provider-context';
import {Box, Button, Stack, Typography} from '@mui/material'
import ErrorModal from '../components/ui/ErrorModal';

import sweatToken from '../assets/images/sweat.png';
import bloodToken from '../assets/images/coin_transp_500.png';
import { getUGForgeSmith } from '../utils';
import "./sweat.css";
/* global BigInt */

const Sweatv2Fix = () => {
    const prv = useContext(ProviderContext);
    const [enteredBlood, setEnteredBlood] = useState('') ;
    const [stakedBlood, setStakedBlood] = useState('') ;
    const [error, setError] = useState();    
    const ugForgeSmithContract = getUGForgeSmith();
    const signedContract =  ugForgeSmithContract.connect(prv.provider.getSigner());

    const BloodChangeHandler = (event) => {
        event.preventDefault();        
        setEnteredBlood(event.target.value);
        console.log(event.target.value);
    }

    const UnstakeHandler = async(event) => {
        event.preventDefault();     
        if (Number(stakedBlood) > enteredBlood) {
            setError({
            title: 'Not Enough Blood ',
            message: 'Double check your Holdings and try again.',
            });
            return;
        }      

        if (enteredBlood < 1) {
            setError({
            title: 'You Must Enter at Least 1 Blood. ',
            message: 'Maybe you would like to rethink your strategy.',
            });
            return;
        }      
        console.log(enteredBlood);
        await signedContract.functions.unstakeBloodForSweat(enteredBlood);
        setEnteredBlood('') ;   
    }


    const updateSweatRewards = async() => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });    
        const stakedBlood = await ugForgeSmithContract.getOwnerStakedBlood(accounts[0]);  
        setStakedBlood(stakedBlood); 
    }

    const errorHandler = () => {
        setError(null);
    } 

    useEffect(() => {     
        const init = async() => {    
            updateSweatRewards();
        }
        init();

        const timer = setInterval(() => {
            updateSweatRewards();
          }, 60000);
    
          return () => {
            clearInterval(timer);
          };
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
    <Box className="sweat-box" >
        <Stack direction ="row" sx={{justifyContent: 'space-between'}}>
            
            <Stack className="swet2" sx={{ p: 1}} spacing={1}>   
                
                <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.8rem', color: 'gold'}}>unStake Blood For v2 fix </Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1rem', color: 'deepskyblue'}}>-</Typography>

                <Box className="swet-box" sx={{color:'deepskyblue', fontSize:'1.5rem', p: 1}}>
                   send your tx receipt in a suport ticket in discord for refund of staking fee
                </Box>
                <Stack direction="row" pr={10} sx={{ justifyContent: 'space-around'}}>
                    <Box width={50} sx={{ borderRadius: 2, backgroundColor: 'none'}}><img src={bloodToken} alt="bloodToken" height='150/100' />  </Box>
                    <Box width={50} sx={{ borderRadius: 2, backgroundColor: 'none'}}><img src={sweatToken} alt="sweatToken" height='150/100' />  </Box>
                    
                </Stack>
                <Box >
                    <Stack direction="row"  sx={{ justifyContent: 'space-between'}}>                           
                        <div  className="input-group m-1 swet1-bordr" >
                            <input type="number" min='1000' step='1000' onChange={BloodChangeHandler} value={enteredBlood} className="form-control"  placeholder="How Much Blood?" aria-label="Qty" aria-describedby="basic-addon2" />
                           
                            <Button variant="contained" sx={{ bgcolor:'black', color:'crimson'}} onClick={UnstakeHandler}>UnStake</Button>
                        </div>  
                        
                    </Stack>
                    
                            
                   
                </Box>
                <Box className="swet-box">
                    <Stack direction="row" sx={{justifyContent: 'space-between'}}>                     
                        <Stack  align="left" p={1}   spacing={1} sx={{}}>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'red'}}>Your Blood Staked: </Typography>
                        </Stack>          
                        <Stack align="right" p={1} spacing={1} sx={{}}>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'red'}}>{Number(stakedBlood)}</Typography>
                        </Stack>
                    </Stack>
                </Box>  
                    </Stack>
            
        </Stack>
                            
    </Box>
    </div>
  )
}

export default Sweatv2Fix