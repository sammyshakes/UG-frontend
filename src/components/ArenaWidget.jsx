import {Stack, Button, Box} from '@mui/material';
import Typography from '@mui/material/Typography';
import './ArenaWidget.css';
import {useContext, useEffect, useState} from 'react';
import ProviderContext from '../context/provider-context.js';
import ringImage from '../assets/images/ring_500.png';
import amuletImage from '../assets/images/amulet_500.png';
import CircularProgressWithLabel from './CircularProgressWithLabel';
import { getUGGame5, getUGArena2, getUGArena3, getEthers, getUGNft2, getUGYakDen } from '../utils.js';
import ErrorModal from './ui/ErrorModal';
import ArenaWidgetRankFix from './ArenaWidgetRankFix';
/* global BigInt */

const ArenaWidget = (props) => {
  const [error, setError] = useState();
  const [progressForAmulet, setProgressForAmulet] = useState(0);
  const [progressForRing, setProgressForRing] = useState(0);
  const [timeLeftForRing, setTimeLeftForRing] = useState(0);
  const [timeLeftForAmulet, setTimeLeftForAmulet] = useState(0);
  const [amulet, setAmulet] = useState(undefined);
  const [ring, setRing] = useState(undefined);
  const [numStakedFighters, setNumStakedFighters] = useState(0);
  const [numStakedYakuza, setNumStakedYakuza] = useState(0);
  const [unclaimedFighterBlood, setUnclaimedFighterBlood] = useState();
  const [unclaimedYakuzaBlood, setUnclaimedYakuzaBlood] = useState();
  const [ringLevelCost, setRingLevelCost] = useState();
  const [amuletLevelCost, setAmuletLevelCost] = useState();
  const [ringMaintainCost, setRingMaintainCost] = useState();
  const [amuletMaintainCost, setAmuletMaintainCost] = useState();  
  const [needsToUnstake, setNeedsToUnstake] = useState();

  const prv = useContext(ProviderContext);
  const provider = getEthers();
  const ugGameContract = getUGGame5();
  const ugArena2Contract = getUGArena2();
  const ugArenaContract = getUGArena3();
  const ugNftContract = getUGNft2();
  const ugYakDenContract = getUGYakDen();
  console.log('prv',prv);
  
  const refreshProgress = async() => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    let stakedRingId = await ugArena2Contract.getStakedRingIDForUser(accounts[0]);
    let stakedAmuletId = await ugArena2Contract.getStakedAmuletIDForUser(accounts[0]);
    // let stakedRingId = prv.stakedRing;
    // let stakedAmuletId = prv.stakedAmulet;
    console.log('sr',stakedRingId);
    //check if any need to be fixed from bloodRankFix
    if((stakedRingId || stakedAmuletId) &&  (Number(stakedRingId) > 0 || Number(stakedAmuletId) > 0)){
      setNeedsToUnstake(true);
    } else {      
      setNeedsToUnstake(false);
      stakedRingId = await ugArenaContract.getStakedRingIDForUser(accounts[0]);
      stakedAmuletId = await ugArenaContract.getStakedAmuletIDForUser(accounts[0]);
    }

    const ring = await ugNftContract.getRingAmulet(stakedRingId);    
    const amulet = await ugNftContract.getRingAmulet(stakedAmuletId);

    if(amulet){
      const amuletExpireTime =   amulet?.lastLevelUpgradeTime + 7 * 86400 ;
      const timeLeftAmulet =  amuletExpireTime - (Date.now()/1000);
      const progressAmulet =   timeLeftAmulet * 100 /  (7 *86400) ;
      setProgressForAmulet(progressAmulet);
      setTimeLeftForAmulet(timeLeftAmulet) ;
    } else setProgressForAmulet(0);
    
    //now for Ring progress bar
    if(ring){
      const ringExpireTime =  ring?.lastLevelUpgradeTime + 7 * 86400 ;
      const timeLeftRing =  ringExpireTime - (Date.now()/1000);
      const progressRing =  timeLeftRing * 100 /  (7 *86400) ;
      setProgressForRing(progressRing);
      setTimeLeftForRing(timeLeftRing)  

    } else setProgressForRing(0);  

    setRing(ring);
    setAmulet(amulet);  
    
    const _stakedFighterIds = await ugArenaContract.stakedByOwner(accounts[0])
    const stakedFighterIds = _stakedFighterIds?.map(id => { return Number(id.toString()); })

    if(stakedFighterIds.length > 0){
      const unclaimedFighterBlood = await ugArenaContract.calculateAllStakingRewards(stakedFighterIds);
      setUnclaimedFighterBlood(Number(unclaimedFighterBlood)); 
    } else setUnclaimedFighterBlood(0); 
    
    const _stakedYakuzaIds = await ugYakDenContract.stakedIdsByUser(accounts[0])
    const stakedYakuzaIds = _stakedYakuzaIds?.map(id => { return Number(id); })

    if(stakedYakuzaIds.length > 0){
      const unclaimedYakuzaBlood = await ugYakDenContract.calculateAllStakingRewards(stakedYakuzaIds);
      setUnclaimedYakuzaBlood(Number(unclaimedYakuzaBlood)); 
    } else setUnclaimedYakuzaBlood(0); 
    
    const numStakedFighters = stakedFighterIds.length;
    const numStakedYakuza = stakedYakuzaIds.length;
    
    setNumStakedFighters(numStakedFighters);   
    setNumStakedYakuza(numStakedYakuza); 

    const ringLevelCost = await ugGameContract.getRingLevelUpBloodCost(ring?.level, 1, numStakedFighters);
    const amuletLevelCost = await ugGameContract.getAmuletLevelUpBloodCost(amulet?.level, 1, numStakedFighters);
    const ringMaintainCost = await ugGameContract.getRingLevelUpBloodCost(ring?.level, 0, numStakedFighters);
    const amuletMaintainCost = await ugGameContract.getAmuletLevelUpBloodCost(amulet?.level, 0, numStakedFighters);
    setRingLevelCost(Number(ringLevelCost));
    setAmuletLevelCost(Number(amuletLevelCost));
    setRingMaintainCost(Number(ringMaintainCost));
    setAmuletMaintainCost(Number(amuletMaintainCost));
    // console.log('ringLevelCost',Number(ringLevelCost));
    // console.log('ringMaintainCost',Number(ringMaintainCost));
    // console.log('amuletLevelCost',Number(amuletLevelCost));
    // console.log('amuletMaintainCost',Number(amuletMaintainCost));
  }
    
  
  const levelRingHandler = async() => {
    //check for amulet if ring > 10
    if(ring?.level + 1 > 10 && amulet?.level < 1){
      setError({
          title: 'You need an Amulet..',
          message: '.. to advance your Ring past level 10.',
      });
      return;
    }
    //check for proper number of fighters
    if(numStakedFighters < (ring?.level + 1) * 3){
      setError({
          title: 'Your Army is too small!',
          message: 'You need at least 3 fighters per Ring Level.',
      });
      return;
    }
    //check for blood balance
    if(prv.balance/(10**18) < ringLevelCost){
      setError({
          title: 'Not Enough $BLOOD!',
          message: 'You must acquire more $BLOOD to level up your Ring.',
      });
      return;
  }
    //tbd
    
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const stakedRingId = await ugArenaContract.getStakedRingIDForUser(accounts[0]);
    const signedContract =  ugGameContract.connect(provider.getSigner());
    //const ids = selectedFYs.map(id => { return Number(id.toString()); })
    const receipt = await signedContract.functions.levelUpRing(stakedRingId, 1) ;
  }
  const maintainRingHandler = async() => {
    //check for amulet if ring > 10
    if(ring?.level > 10 && amulet?.level < 1){
      setError({
          title: 'You need an Amulet..',
          message: '.. to maintain a Ring past level 10.',
      });
      return;
    }
    //check for proper number of fighters
    if(numStakedFighters < ring?.level * 3){
      setError({
          title: 'Your Army is too small!',
          message: 'You need at least 3 fighters per Ring Level.',
      });
      return;
    }
    //check for blood balance
    if(prv.balance/(10**18) < ringMaintainCost){
      setError({
          title: 'Not Enough $BLOOD!',
          message: 'You must acquire more $BLOOD to maintain your Ring.',
      });
      return;
    }
    //tbd
    
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const stakedRingId = await ugArenaContract.getStakedRingIDForUser(accounts[0]);
    const signedContract =  ugGameContract.connect(provider.getSigner());
    //const ids = selectedFYs.map(id => { return Number(id.toString()); })
    const receipt = await signedContract.functions.levelUpRing(Number(stakedRingId?.toString()), 0) ;
  }

  const unstakeRingHandler = async() => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const stakedRingId = await ugArenaContract.getStakedRingIDForUser(accounts[0]);
    const signedContract =  ugArenaContract.connect(provider.getSigner());
    const receipt = await signedContract.functions.unstakeRing(Number(stakedRingId)) ;
  }

  const unstakeAmuletHandler = async() => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const stakedAmuletId = await ugArenaContract.getStakedAmuletIDForUser(accounts[0]);
    const signedContract =  ugArenaContract.connect(provider.getSigner());
    const receipt = await signedContract.functions.unstakeAmulet(Number(stakedAmuletId)) ;
  }


  const levelAmuletHandler = async() => {
    //check for proper number of fighters
    if(numStakedFighters < (amulet?.level + 1) * 3){
      setError({
          title: 'Your Army is too small!',
          message: 'You need at least 3 fighters per Amulet Level.',
      });
      return;
    }
    //check for blood balance
    if(prv.balance/(10**18) < amuletLevelCost){
      setError({
          title: 'Not Enough $BLOOD!',
          message: 'You must acquire more $BLOOD to level up your Amulet.',
      });
      return;
    }
    //tbd
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }); 
    const stakedAmuletId = await ugArenaContract.getStakedAmuletIDForUser(accounts[0]);
    const signedContract =  ugGameContract.connect(provider.getSigner());
    await signedContract.functions.levelUpAmulet(Number(stakedAmuletId), 1) ;
  }

  const maintainAmuletHandler = async() => {
    //check for proper number of fighters
    if(numStakedFighters < amulet?.level * 3){
      setError({
          title: 'Your Army is too small!',
          message: 'You need at least 3 fighters per Ring Level.',
      });
      return;
    }
    //check for blood balance
    if(prv.balance/(10**18) < amuletMaintainCost){
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

  const errorHandler = () => {
    setError(null);
  }
    
  useEffect(() => {     
    const init = async() => {  
     
      refreshProgress();
      
      const timer = setInterval(() => {
        refreshProgress();
          
      }, 15000);

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
    { needsToUnstake && <ArenaWidgetRankFix ring={ring} amulet={amulet} balance={prv.balance} amuletMaintainCost={amuletMaintainCost} ringMaintainCost={ringMaintainCost}/>}
    {!needsToUnstake && <Box className="ring-bordr" maxWidth={9/10} maxHeight={220}  sx={{display: 'flex',
          justifyContent: 'center',py:1}} >
    <Box  className="inner-bordr" maxWidth={9/10} maxHeight={180} p={1.5}  sx={{display: 'flex',
          justifyContent: 'space-between',backgroundColor:'rgb(0,0,0,.5)'}}>
      <Stack className="stack-back" spacing={5} direction="row" justifyContent="space-between"  sx={{p:.5,backgroundColor:'rgb(0,0,0,0)'}}  >
       
        <Box className="ring-bordr1" sx={{width: 220}}>
        <Stack direction="row" p={0.2} justifyContent="space-between" >
        
          <Stack >
            <Box sx={{pl:1 }}>
              <img className="ring"  src={ringImage} alt="Ring" />
            </Box>
            <Box   sx={{backgroundColor:'rgb(0,0,0,0)', color: 'gold'}} >
              {ring?.level > 0  && <Typography variant="button"  component="div" align="center" sx={{ fontFamily: 'Alegreya Sans SC', fontSize: '1rem'}}>
                                      {`LEVEL   ${ring?.level}`}
                                  </Typography>}
              {ring?.level < 1  && <Typography variant="button"  component="div" align="center" sx={{ fontFamily: 'Alegreya Sans SC', fontSize: '1rem'}}>
                                      No Staked Ring
                                  </Typography>}
            </Box>  
            <Box sx={{}}>
              {ring?.level > 0  && <Button variant="text" onClick={unstakeRingHandler} size="small" sx={{pl: 1.4, maxHeight: 30, backgroundColor:'none', color: 'red', borderColor: 'aqua', fontSize: '.7rem'}} >unstake</Button>}
            </Box>         
          </Stack>
      
          
            {ring?.level > 0  &&  <Stack >            
              <Box sx={{pl: 1.5, pt: 2}}>
              <CircularProgressWithLabel time={timeLeftForRing  } value={progressForRing>0 ? progressForRing : 0} size='3.3rem' thickness={4} sx={{}} style={{color: Math.round(progressForRing, 2) < 20 ? "red" : "chartreuse"}}></CircularProgressWithLabel>
              </Box>         
              <Box >
              <Button variant="text" onClick={levelRingHandler} size="small" sx={{ maxHeight: 30, backgroundColor:'none', color: 'red', borderColor: 'aqua',  fontSize: '.8rem'}}  >level up</Button>
              </Box>
              <Box >
              <Button variant="text" onClick={maintainRingHandler} size="small" sx={{ maxHeight: 30, backgroundColor:'none', color: 'red', borderColor: 'aqua',  fontSize: '.8rem'}}  >maintain</Button>
              </Box>                               
            </Stack>}
          <Stack >
            <Box height={80} sx={{pl: 1.5, pt: 2}}>
            </Box>
            <Typography variant="button" align="center" component="div" sx={{fontFamily: 'Alegreya Sans SC', fontSize: '.9rem', color: 'gold'}}>
                {ringLevelCost}
            </Typography>
            <Typography variant="button" align="center" component="div" sx={{fontFamily: 'Alegreya Sans SC', fontSize: '.9rem', color: 'gold'}}>
                {ringMaintainCost}
            </Typography>
          </Stack>
        
      </Stack>   
      </Box>
      <Box className="ring-bordr1" sx={{width: 220}}>
        <Stack  direction="row" p={.2} justifyContent="space-between">   
        
          <Stack>
            <Box sx={{pl:1 }}>
                <img  className="ring"  src={amuletImage} alt="Amulet"  />
            </Box>  
            <Box    sx={{backgroundColor:'rgb(0,0,0,0)',  color: 'gold'}} >
              {amulet?.level > 0  &&   <Typography variant="button" align="center" component="div" sx={{fontFamily: 'Alegreya Sans SC', fontSize: '1rem'}}>
                              {`LEVEL   ${amulet?.level}`}
                            </Typography>}
              {amulet?.level < 1  &&   <Typography variant="button" align="center" component="div" sx={{fontFamily: 'Alegreya Sans SC', fontSize: '1rem'}}>
                              No Staked Amulet
                            </Typography>}              
            </Box>
            <Box sx={{}}>
              {amulet?.level > 0  &&   <Button variant="text" onClick={unstakeAmuletHandler} size="small" sx={{pl: 1.4, maxHeight: 30, backgroundColor:'none', color: 'red', borderColor: 'aqua', fontSize: '.7rem'}} >unstake</Button>}
            </Box>
          </Stack>
          {amulet?.level > 0  &&  <Stack>
            <Box sx={{ pl: 1.5, pt: 2}}>
              <CircularProgressWithLabel time={timeLeftForAmulet } value={progressForAmulet > 0 ? progressForAmulet : 0} size='3.3rem' thickness={4} sx={{}} style={{color: Math.round(progressForAmulet, 2) < 20 ? "red" : "chartreuse"}}></CircularProgressWithLabel>
            </Box>          
            <Box sx={{}}>
              <Button variant="text" onClick={levelAmuletHandler} size="small" sx={{ maxHeight: 30, backgroundColor:'none', color: 'red', borderColor: 'aqua', fontSize: '.8rem'}} >Level Up</Button>
              
            </Box>
            <Box sx={{}}>
              <Button variant="text" onClick={maintainAmuletHandler} size="small" sx={{ maxHeight: 30, backgroundColor:'none', color: 'red', borderColor: 'aqua', fontSize: '.8rem'}} >maintain</Button>
            </Box>
            
          </Stack>  }   
          <Stack >
            <Box height={80} sx={{pl: 1.5, pt: 2}}>
            </Box>
            <Typography variant="button" align="center" component="div" sx={{fontFamily: 'Alegreya Sans SC', fontSize: '.9rem', color: 'gold'}}>
                {amuletLevelCost}
            </Typography>
            <Typography variant="button" align="center" component="div" sx={{fontFamily: 'Alegreya Sans SC', fontSize: '.9rem', color: 'gold'}}>
                {amuletMaintainCost}
            </Typography>
          </Stack>             
        </Stack>  
      </Box>  
      <Box className="ring-bordr1"sx={{width: 200}}>
      <Typography variant='body2' align='center'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.1rem', color: 'gold'}}>Fighter Arena </Typography>
              
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
  </Box>}
   </div>
  )
}

export default ArenaWidget