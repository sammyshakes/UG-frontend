import {Stack, Button, Box} from '@mui/material';
import Typography from '@mui/material/Typography';
import './ArenaWidget.css';
import {useContext, useEffect, useState} from 'react';
import ProviderContext from '../context/provider-context.js';
import ringImage from '../assets/images/ring_500.png';
import amuletImage from '../assets/images/amulet_500.png';
import { getUGArena, getEthers, getUGNft, getUGMigration2 } from '../utils.js';
import ErrorModal from './ui/ErrorModal';
/* global BigInt */

const ArenaWidgetFix = (props) => {
  const [error, setError] = useState();
  const [amulet, setAmulet] = useState(undefined);
  const [ring, setRing] = useState(undefined);
  const [numStakedFighters, setNumStakedFighters] = useState(0);
  const [numStakedYakuza, setNumStakedYakuza] = useState(0);
  const [unclaimedFighterBlood, setUnclaimedFighterBlood] = useState();
  const [unclaimedYakuzaBlood, setUnclaimedYakuzaBlood] = useState();

  const prv = useContext(ProviderContext);
  const provider = getEthers();
  const ugArenaContract = getUGArena();
  const ugNftContract = getUGNft();
  const ugMigration2Contract = getUGMigration2();
  
  const refreshProgress = async() => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const ring = await ugNftContract.getRingAmulet(ugArenaContract.getStakedRingIDForUser(accounts[0]));
    const amulet = await ugNftContract.getRingAmulet(ugArenaContract.getStakedAmuletIDForUser(accounts[0]));
      
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
    
    setRing(ring);
    setAmulet(amulet);  
    setNumStakedFighters(numStakedFighters);   
    setNumStakedYakuza(numStakedYakuza); 
    
  }
    
  
  const migrateV2RingHandler = async() => {
    if(Number(ring?.level) < 1){
      setError({
          title: 'No V2 Rings To Fix',
          message: 'Either already fixed or still need to unstake..',
      });
      return;
  }
    //check for proper number of fighters
    //check for blood balance
    //tbd
    const stakedRingId = await ugArenaContract.getStakedRingIDForUser(prv.accounts[0]);
    const signedContract =  ugArenaContract.connect(provider.getSigner());
     await signedContract.functions.unstakeRing(Number(stakedRingId)) ;
  }
 
  const migrateV2AmuletHandler = async() => {
    if(Number(amulet?.level) < 1){
      setError({
          title: 'No Staked V2 Amulets to Fix',
          message: 'Probably already unstaked..',
      });
      return;
  }
    const stakedAmuletId = await ugArenaContract.getStakedAmuletIDForUser(prv.accounts[0]);
    const signedContract =  ugArenaContract.connect(provider.getSigner());
     await signedContract.functions.unstakeAmulet(Number(stakedAmuletId)) ;
    
    
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
   <Box className="ring-bordr" maxWidth={850} maxHeight={220}  sx={{p:1}} >
    <Box  className="inner-bordr" maxWidth={850} maxHeight={180} p={1.5}  sx={{backgroundColor:'rgb(0,0,0,.5)'}}>
      <Stack className="stack-back"   direction="row"  justifyContent="space-evenly"  sx={{p:0,backgroundColor:'rgb(0,0,0,0)'}}  >
       
        <Box className="ring-bordr1"sx={{width: 80}}>
        <Stack direction="row" justifyContent="center" p={1}>
        
          <Stack>
            <Box sx={{pl:2 }}>
              <img className="ring"  src={ringImage} alt="Ring" />
            </Box>
            <Box    sx={{backgroundColor:'rgb(0,0,0,0)', color: 'gold'}} >
              {ring?.level > 0 && <Typography variant="button"  component="div" align="center" sx={{ fontFamily: 'Alegreya Sans SC', fontSize: '1.1rem'}}>
                  {`LEVEL   ${ring?.level}`}
              </Typography>}
            </Box>  
            <Box >
            {ring?.level > 0 && <Button variant="outlined" onClick={migrateV2RingHandler} size="large" sx={{ maxHeight: 30, backgroundColor:'none', color: 'red', borderColor: 'aqua', width:100}}  >unstake</Button>}
            </Box>             
          </Stack>
      
        
        
      </Stack>   
      </Box>
      <Box className="ring-bordr1" sx={{width: 100}}>
        <Stack  direction="row"justifyContent="center" p={1} >   
        
          <Stack>
            <Box sx={{pl:1.5 }}>
                <img  className="ring"  src={amuletImage} alt="Amulet"  />
            </Box>  
            <Box    sx={{backgroundColor:'rgb(0,0,0,0)',  color: 'gold'}} >
                {amulet?.level > 0 && <Typography variant="button" align="center" component="div" sx={{fontFamily: 'Alegreya Sans SC', fontSize: '1rem'}}>
                              {`LEVEL   ${amulet?.level}`}
                            </Typography>}
            </Box>
            <Box sx={{}}>
            {amulet?.level > 0 && <Button variant="outlined" onClick={migrateV2AmuletHandler} size="large" sx={{ maxHeight: 30, backgroundColor:'none', color: 'red', borderColor: 'aqua'}} >unstake</Button>}
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

export default ArenaWidgetFix