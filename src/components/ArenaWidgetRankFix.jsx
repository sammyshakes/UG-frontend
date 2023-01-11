import {Stack, Button, Box} from '@mui/material';
import Typography from '@mui/material/Typography';
import './ArenaWidget.css';
import {useEffect, useState} from 'react';
import ringImage from '../assets/images/ring_500.png';
import amuletImage from '../assets/images/amulet_500.png';
import {getUGGame4, getUGArena2, getEthers } from '../utils.js';
import ErrorModal from './ui/ErrorModal';
/* global BigInt */

const ArenaWidgetRankFix = (props) => {
  const [error, setError] = useState();
  const [numStakedFighters, setNumStakedFighters] = useState(0);
  const [numStakedYakuza, setNumStakedYakuza] = useState(0);
  const [unclaimedFighterBlood, setUnclaimedFighterBlood] = useState();
  const [unclaimedYakuzaBlood, setUnclaimedYakuzaBlood] = useState();

  const provider = getEthers();
  const ugArenaContract = getUGArena2();
  const ugGameContract = getUGGame4();
  
  const refreshProgress = async() => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
    const _stakedFighterIds = await ugArenaContract.getStakedFighterIDsForUser(accounts[0])
    const stakedFighterIds = _stakedFighterIds?.map(id => { return Number(id.toString()); })

    if(stakedFighterIds.length > 0){
      const unclaimedFighterBlood = await ugArenaContract.calculateAllStakingRewards(stakedFighterIds);
      setUnclaimedFighterBlood(unclaimedFighterBlood); 
    } else setUnclaimedFighterBlood(0); 
    
    
    const _stakedYakuzaIds = await ugArenaContract.getStakedYakuzaIDsForUser(accounts[0])
    const stakedYakuzaIds = _stakedYakuzaIds?.map(id => { return Number(id.toString()); })
    
    const numStakedFighters = await ugArenaContract.numUserStakedFighters(accounts[0]);
    const numStakedYakuza = await ugArenaContract.numUserStakedYakuza(accounts[0]);

    if(stakedYakuzaIds.length > 0){
      const unclaimedYakuzaBlood = await ugArenaContract.calculateAllStakingRewards(stakedYakuzaIds);
      setUnclaimedYakuzaBlood(unclaimedYakuzaBlood); 
    } else setUnclaimedYakuzaBlood(0); 
    
    setNumStakedFighters(numStakedFighters);   
    setNumStakedYakuza(numStakedYakuza); 
    
  }

  const maintainRingHandler = async() => {
    //check for amulet if ring > 10
    if(props.ring?.level > 10 && props.amulet?.level < 1){
      setError({
          title: 'You need an Amulet..',
          message: '.. to maintain a Ring past level 10.',
      });
      return;
    }
    //check for proper number of fighters
    if(numStakedFighters < props.ring?.level * 3){
      setError({
          title: 'Your Army is too small!',
          message: 'You need at least 3 fighters per Ring Level.',
      });
      return;
    }
    //check for blood balance
    if(props.balance/(10**18) < props.ringMaintainCost){
      setError({
          title: 'Not Enough $BLOOD!',
          message: 'You must acquire more $BLOOD to maintain your Ring.',
      });
      return;
    }
    //tbd
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const stakedRingId = await ugArenaContract.getStakedRingIDForUser(accounts[0]);
    console.log(stakedRingId)
    const signedContract =  ugGameContract.connect(provider.getSigner());
    //const ids = selectedFYs.map(id => { return Number(id.toString()); })
    const receipt = await signedContract.functions.levelUpRing(Number(stakedRingId?.toString()), 0) ;
  }

  const maintainAmuletHandler = async() => {
    //check for proper number of fighters
    if(numStakedFighters < props.amulet?.level * 3){
      setError({
          title: 'Your Army is too small!',
          message: 'You need at least 3 fighters per Ring Level.',
      });
      return;
    }
    //check for blood balance
    if(props.balance/(10**18) < props.amuletMaintainCost){
      setError({
          title: 'Not Enough $BLOOD!',
          message: 'You must acquire more $BLOOD to maintain your Amulet.',
      });
      return;
    }
    //tbd
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }); 
    const stakedAmuletId = await ugArenaContract.getStakedAmuletIDForUser(accounts[0]);
    const signedContract =  ugGameContract.connect(provider.getSigner());
    await signedContract.functions.levelUpAmulet(Number(stakedAmuletId), 0) ;
  }
    
  
  const unstakeRingHandler = async() => {
    if(Number(props?.ring?.level) < 1){
      setError({
          title: 'No Rings To Unstake',
          message: 'Probably already unstaked..',
      });
      return;
  }
    //check for proper number of fighters
    //check for blood balance
    //tbd
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const stakedRingId = await ugArenaContract.getStakedRingIDForUser(accounts[0]);
    const signedContract =  ugArenaContract.connect(provider.getSigner());
     await signedContract.functions.unstakeRing(Number(stakedRingId)) ;
  }
 
  const unstakeAmuletHandler = async() => {
    if(Number(props.amulet?.level) < 1){
      setError({
          title: 'No Amulets to Unstake',
          message: 'Probably already unstaked..',
      });
      return;
  }
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const stakedAmuletId = await ugArenaContract.getStakedAmuletIDForUser(accounts[0]);
    const signedContract =  ugArenaContract.connect(provider.getSigner());
    await signedContract.functions.unstakeAmulet(Number(stakedAmuletId));    
  }

  const errorHandler = () => {
    setError(null);
  }
    
  useEffect(() => {     
    const init = async() => {  
     
      refreshProgress();
      
      const timer = setInterval(() => {
        refreshProgress();
          
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
   <Box className="ring-bordr" maxWidth={900} maxHeight={200}  sx={{p:1}} >
    <Box  className="inner-bordr" maxWidth={850} maxHeight={180} p={1.5}  sx={{backgroundColor:'rgb(0,0,0,.5)'}}>
      <Stack className="stack-back"   direction="row"  justifyContent="space-evenly"  sx={{p:0,backgroundColor:'rgb(0,0,0,0)'}}  >
       
        <Box className="ring-bordr1"sx={{width: 250}}>
        <Stack direction="row" justifyContent="center" p={1}>
        
          
            <Box sx={{pl:2 }}>
              <img className="ring"  src={ringImage} alt="Ring" />
            </Box>
            <Box    sx={{backgroundColor:'rgb(0,0,0,0)', color: 'gold'}} >
              {props?.ring?.level > 0 && <Typography variant="button"  component="div" align="center" sx={{ fontFamily: 'Alegreya Sans SC', fontSize: '1.1rem'}}>
                  {`LEVEL   ${props?.ring?.level}`}
              </Typography>}
            </Box> 
            <Stack>
            <Stack  direction="row" justifyContent="center">
              <Button variant="text" onClick={maintainRingHandler} size="small" sx={{ maxHeight: 30, backgroundColor:'none', color: 'red', borderColor: 'aqua',  fontSize: '.8rem'}}  >maintain</Button>
              </Stack> 
            <Box >
            {props?.ring?.level > 0 && <Button variant="outlined" onClick={unstakeRingHandler} size="large" sx={{ maxHeight: 30, backgroundColor:'none', color: 'red', borderColor: 'aqua', width:100}}  >unstake</Button>}
            </Box>             
          </Stack>
      
        
        
      </Stack>   
      </Box>
      <Box className="ring-bordr1" sx={{width: 250}}>
        <Stack  direction="row"justifyContent="center" p={1} >   
        
          
            <Box sx={{pl:1.5 }}>
                <img  className="ring"  src={amuletImage} alt="Amulet"  />
            </Box>  
            <Box    sx={{backgroundColor:'rgb(0,0,0,0)',  color: 'gold'}} >
                {props?.amulet?.level > 0 && <Typography variant="button" align="center" component="div" sx={{fontFamily: 'Alegreya Sans SC', fontSize: '1rem'}}>
                              {`LEVEL   ${props?.amulet?.level}`}
                            </Typography>}
            </Box>
            <Stack>
            <Stack  direction="row" justifyContent="center">
            {props?.amulet?.level > 0 && <Button variant="text"  onClick={maintainAmuletHandler} size="small" sx={{ maxHeight: 30, backgroundColor:'none', color: 'red', borderColor: 'aqua', fontSize: '.8rem'}} >maintain</Button>}
            </Stack>
            <Box sx={{}}>
            {props?.amulet?.level > 0 && <Button variant="outlined" onClick={unstakeAmuletHandler} size="large" sx={{ maxHeight: 30, backgroundColor:'none', color: 'red', borderColor: 'aqua'}} >unstake</Button>}
            </Box>
          </Stack>
                       
        </Stack>  
      </Box>  
      <Box className="ring-bordr1"sx={{width: 200}}>
        <Stack direction="row" sx={{justifyContent: 'space-between'}}>                     
          <Stack  align="left" p={1}   spacing={1} sx={{}}>
              <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'aqua'}}>Fighters Staked: </Typography>
              <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'crimson'}}>Unclaimed Blood: </Typography>
              <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'aqua'}}>Yakuza Staked: </Typography>
              <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'crimson'}}>Unclaimed Blood: </Typography>
          </Stack>
          
          <Stack align="right" p={1} spacing={1} sx={{}}>
              <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'orange'}}>{Number(numStakedFighters).toString()}</Typography>
              <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'orangered'}}> {Number(unclaimedFighterBlood).toString()}</Typography>
              <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'orange'}}> {Number(numStakedYakuza).toString()}</Typography>
              <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'orangered'}}> {Number(unclaimedYakuzaBlood).toString()}</Typography>
          </Stack>
        </Stack>
      </Box>     
    </Stack>
    
  </Box>
  </Box>
   </div>
  )
}

export default ArenaWidgetRankFix