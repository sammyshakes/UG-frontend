import {useContext, useState,useEffect, React} from 'react';
import ProviderContext from '../context/provider-context';
import {Box, Button, Stack, Typography} from '@mui/material'
import ErrorModal from '../components/ui/ErrorModal';

import fighterImage from '../assets/fighterfull_500.png';
import sweatToken from '../assets/images/sweat.png';
import bloodToken from '../assets/images/coin_transp_500.png';
import { getUGForgeSmith3 } from '../utils';
import "./sweat.css";
/* global BigInt */

const Sweat = () => {
    const prv = useContext(ProviderContext);
    const [enteredBlood, setEnteredBlood] = useState('') ;
    const [unclaimedSweat, setUnclaimedSweat] = useState('') ;
    const [stakedBlood, setStakedBlood] = useState('') ;
    const [error, setError] = useState();    
    const ugForgeSmithContract = getUGForgeSmith3();
    const signedContract =  ugForgeSmithContract.connect(prv.provider.getSigner());

    const BloodChangeHandler = (event) => {
        event.preventDefault();        
        setEnteredBlood(event.target.value);
    }

    const StakeHandler = async(event) => {        
        event.preventDefault();   
        if (Number(prv.balance)/1e18 < enteredBlood) {
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
        
        await signedContract.functions.stakeBloodForSweat(enteredBlood);
        setEnteredBlood('') ;

    }

    const UnstakeHandler = async(event) => {
        event.preventDefault();     
        if (Number(stakedBlood) < enteredBlood) {
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
        
        await signedContract.functions.unstakeBloodForSweat(enteredBlood);
        setEnteredBlood('') ;   
    }

    const claimHandler = async(event) => {
        event.preventDefault();     
        if (Number(unclaimedSweat) < 1) {
            setError({
            title: 'You Have No Sweat To Claim',
            message: 'Try Working Harder!',
            });
            return;
        }              
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });  
        await signedContract.functions.claimSweat(accounts[0]);
    }

    const updateSweatRewards = async() => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });    
        const unclaimedSweat = await ugForgeSmithContract.calculateSweatRewards(accounts[0]);
        const stakedBlood = await ugForgeSmithContract.getOwnerStakedBlood(accounts[0]);
        setUnclaimedSweat(unclaimedSweat);     
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
          }, 15000);
    
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
            
            <img src={fighterImage} alt="fighterimage"/>
            <Stack className="swet2" sx={{ p: 1}} spacing={1}>   
                
                <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.8rem', color: 'red'}}>Stake Blood For Sweat </Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1rem', color: 'deepskyblue'}}>1 Sweat/ 100 Blood Staked / Day</Typography>

                <Box className="swet-box" sx={{color:'gold', fontSize:'1.5rem', p: 1}}>
                    “From blood and Sweat comes perfection”
                </Box>
                <Stack direction="row" pr={10} sx={{ justifyContent: 'space-around'}}>
                    <Box width={50} sx={{ borderRadius: 2, backgroundColor: 'none'}}><img src={bloodToken} alt="bloodToken" height='150/100' />  </Box>
                    <Box width={50} sx={{ borderRadius: 2, backgroundColor: 'none'}}><img src={sweatToken} alt="sweatToken" height='150/100' />  </Box>
                    
                </Stack>
                <Box >
                    <Stack direction="row"  sx={{ justifyContent: 'space-between'}}>                           
                        <div  className="input-group m-1 swet1-bordr" >
                            <input type="number" min='1000' step='1000' onChange={BloodChangeHandler} value={enteredBlood} className="form-control"  placeholder="How Much Blood?" aria-label="Qty" aria-describedby="basic-addon2" />
                            <Button variant="contained" sx={{ bgcolor:'black', color:'crimson'}} onClick={StakeHandler}>Stake</Button>
                            <Button variant="contained" sx={{ bgcolor:'black', color:'crimson'}} onClick={UnstakeHandler}>UnStake</Button>
                        </div>  
                        
                    </Stack>
                    <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'gold'}}> 
                     Upon Unstaking Blood:                     
                    </Typography>
                    <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'deepskyblue'}}> 
                     10% of Blood unstaked isBurned - All UNCLAIMED SWEAT is Burned
                     
                    </Typography>
                    <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'deepskyblue'}}> 
                     PROPORTIONAL amount of WALLET SWEAT is Burned
                     
                    </Typography>
                            
                   
                </Box>
                <Box className="swet-box">
                    <Stack direction="row" sx={{justifyContent: 'space-between'}}>                     
                        <Stack  align="left" p={1}   spacing={1} sx={{}}>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'red'}}>Your Blood Staked: </Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'deepskyblue'}}>Unclaimed Sweat: </Typography>
                        </Stack>          
                        <Stack align="right" p={1} spacing={1} sx={{}}>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'red'}}>{Number(stakedBlood)}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'deepskyblue'}}> {Number(unclaimedSweat)}</Typography>
                        </Stack>
                    </Stack>
                </Box>  
                <Button variant="contained" sx={{ bgcolor:'black', color:'crimson'}} onClick={claimHandler}>Claim Sweat</Button>      
            </Stack>
            
        </Stack>
                            
    </Box>
    </div>
  )
}

export default Sweat