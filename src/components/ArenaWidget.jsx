import {Stack, Container, Button, Box} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import './ArenaWidget.css';
import {useContext, useEffect, useState} from 'react';
import ProviderContext from '../context/provider-context.js';
import ringImage from '../assets/images/ring_500.png';
import amuletImage from '../assets/images/amulet_500.png';
import CircularProgressWithLabel from './CircularProgressWithLabel';
import { getUGGame, getUGArena, getEthers } from '../utils.js';
/* global BigInt */

const ArenaWidget = (props) => {
  const [progressForAmulet, setProgressForAmulet] = useState(0);
  const [progressForRing, setProgressForRing] = useState(0);
  const [amuletId, setAmuletId] = useState(undefined);
  const [ringId, setRingId] = useState(undefined);

  const prv = useContext(ProviderContext);
  const provider = getEthers();
  const ugGameContract = getUGGame();
  const ugArenaContract = getUGArena();
  const ring = prv.stakedRing;
  const amulet = prv.stakedAmulet;
  

  const levelRingHandler = async() => {
    const stakedRingId = await ugArenaContract.getStakedRingIDForUser(prv.accounts[0]);
    const signedContract =  ugGameContract.connect(provider.getSigner());
    //const ids = selectedFYs.map(id => { return Number(id.toString()); })
    await signedContract.functions.levelUpRing(Number(stakedRingId.toString()), 1) ;
  }

  const levelAmuletHandler = async() => {
    const stakedAmuletId = await ugArenaContract.getStakedAmuletIDForUser(prv.accounts[0]);
    const signedContract =  ugGameContract.connect(provider.getSigner());
    //const ids = selectedFYs.map(id => { return Number(id.toString()); })
    await signedContract.functions.levelUpAmulet(Number(stakedAmuletId.toString()), 1) ;
  }
    
  useEffect(() => {     
    const init = async() => {  
      if(amulet){
      const amuletExpireTime = amulet &&  amulet.lastLevelUpgradeTime + 7 * 86400 ;
     // console.log('amuletExpireTime', amuletExpireTime);
      const timeLeftAmulet = amulet && amuletExpireTime - (Date.now()/1000);
      const progressAmulet = amulet &&  timeLeftAmulet > 0 ? timeLeftAmulet * 100 /  (7 *86400) : 0;
     // console.log('progressAmulet',progressAmulet);
       setProgressForAmulet(progressAmulet);
      }
      if(ring){
      //now for Ring progress bar
      let ringExpireTime = ring &&  ring.lastLevelUpgradeTime + 7 * 86400 ;
      let timeLeftRing = ring && ringExpireTime - (Date.now()/1000);
      let progressRing = ring && timeLeftRing > 0 ? timeLeftRing * 100 /  (7 *86400) : 0;
     // console.log('progressRing',progressRing);
      ring && setProgressForRing(progressRing);
      }
      
      const timer = setInterval(() => {
        if(amulet){
        // amulet progress bar
        let amuletExpireTime =amulet &&   amulet.lastLevelUpgradeTime + 7 * 86400 ;
        let timeLeftAmulet = amulet && amuletExpireTime - (Date.now()/1000);
        let progressAmulet =  timeLeftAmulet > 0 ? timeLeftAmulet * 100 /  (7 *86400) : 0;
        // console.log('progressAmulet timer', progressAmulet);
        setProgressForAmulet(progressAmulet);
        }
        if(ring){
        //now for Ring progress bar
        let ringExpireTime =ring && ring.lastLevelUpgradeTime + 7 * 86400 ;
        let timeLeftRing =  ring && ringExpireTime - (Date.now()/1000);
        let progressRing = ring && timeLeftRing > 0 ? timeLeftRing * 100 /  (7 *86400) : 0;
       //  console.log('progressRing timer', progressRing);
        setProgressForRing(progressRing);
        }
      }, 5000);

      return () => {
        clearInterval(timer);
      };

    }
    init();
    // eslint-disable-next-line
  }, []);


  return (
   <Box className="ring-bordr" maxWidth={{sm: 550, md: 180}} maxHeight={{sm: 240, md: 650}}  sx={{ p:3}} >
    <Box  className="inner-bordr" maxWidth={{sm: 500, md: 160}} maxHeight={{sm: 200, md: 600}} pb={2}  sx={{backgroundColor:'rgb(0,0,0,.3)'}}>
      <Stack className="stack-back" justifyContent={"space-between"}  direction={{sm: "row", md: "column"}} maxWidth={{sm: 400, md: 180}} maxHeight={{sm: 200, md: 600}}  justifyContent={"space-evenly"} alignContent={"space-between"} height={650} sx={{p:1,backgroundColor:'rgb(0,0,0,0)'}}  >
       
        <Stack direction="column" pb={2}>
        <Box sx={{pl:1.5}}>
          <img className="ring"  src={ringImage} alt="Ring" />
          </Box>
          <Box    sx={{backgroundColor:'rgb(0,0,0,0)', color: 'red'}} >
            {ring && <Typography variant="button"  component="div" align="center" sx={{ fontFamily: 'Alegreya Sans SC', fontSize: '1rem'}}>
                {`LEVEL   ${ring.level}`}
            </Typography>}
          </Box> 
          <Box sx={{pl: 2.5}}>
            <CircularProgressWithLabel  value={progressForRing} size='2.5rem' thickness={4} sx={{}} style={{color: Math.round(progressForRing, 2) < 20 ? "red" : "chartreuse"}}></CircularProgressWithLabel>
          </Box>  
        
          <Box >
            <Button variant="text" onClick={levelRingHandler} sx={{ maxHeight: 30, backgroundColor:'black', color: 'aqua', borderColor: 'red'}}  >LEVEL UP</Button>
          </Box>
                   
        </Stack>

        <Stack direction= "column"   pb={2}>   
        <Box sx={{pl:1.5, }}>
          <img  className="ring"  src={amuletImage} alt="Amulet"  />
          </Box>  
          <Box    sx={{backgroundColor:'rgb(0,0,0,0)',  color: 'red'}} >
            {amulet && <Typography variant="button" align="center" component="div" sx={{fontFamily: 'Alegreya Sans SC', fontSize: '1rem'}}>
                          {`LEVEL   ${amulet.level}`}
                        </Typography>}
          </Box>
          <Box sx={{ pl: 2.5}}>
            <CircularProgressWithLabel value={progressForAmulet} size='2.5rem' thickness={4} sx={{}} style={{color: Math.round(progressForAmulet, 2) < 20 ? "red" : "chartreuse"}}></CircularProgressWithLabel>
          </Box>  
          
            <Box sx={{}}>
              <Button variant="text" onClick={levelAmuletHandler} sx={{ maxHeight: 30, backgroundColor:'black', color: 'aqua', borderColor: 'aqua'}} >Level Up</Button>
            </Box>
                   
        </Stack>          
      </Stack>
    
  </Box>
  </Box>
   
  )
}

export default ArenaWidget