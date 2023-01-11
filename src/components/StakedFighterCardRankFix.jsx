import {useContext, useState, useEffect} from 'react';
import ProviderContext from '../context/provider-context';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Box, Stack } from '@mui/material';
import {getUGArena2, getUGGame5, getUGNft2, getUGYakDen} from '../utils.js';
import './stakedFighterCard.css';
import CircularProgressWithLabel from './CircularProgressWithLabel';
/* global BigInt */

const StakedFighterCardRankFix = (props) => {
  const [unclaimed, setUnclaimed] = useState(undefined);
  const [yakUnclaimed, setYakUnclaimed] = useState(undefined);
  const [clicked, setClicked] = useState(false);
  const [bloodCostToLevel, setBloodCostToLevel] = useState();
  const [progressForLevel, setProgressForLevel] = useState();
  const [progressForRaid, setProgressForRaid] = useState();
  const [timeLeftForRaid, setTimeLeftForRaid] = useState();
  const [timeLeftForLevel, setTimeLeftForLevel] = useState();
  const prv = useContext(ProviderContext);
  const ugArenaContract = getUGArena2();
  const ugGameContract = getUGGame5();  
  const ugNftContract = getUGNft2(); 
  const ugYakDenContract = getUGYakDen(); 


  const clickHandler = () => {
    setClicked((current) => {
      props.onSelected(props.id, !current);
      return !current;
    });
  }

  if(clicked && props.emptyArray) setClicked(false);

  const getUpdates = async() => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const stakedAmuletId = await ugArenaContract.getStakedAmuletIDForUser(accounts[0]);
    const amulet = await ugNftContract.getRingAmulet(Number(stakedAmuletId));
    const fighterUnclaimed = await ugArenaContract.calculateStakingRewards(props.id);  
    const yakuzaUnclaimed = await ugYakDenContract.calculateStakingRewards(props.id); 
    const bloodCostToLevelUp = await ugGameContract.getFighterLevelUpBloodCost(props.level, 1);  
    setUnclaimed(fighterUnclaimed);
    setYakUnclaimed(yakuzaUnclaimed);
    setBloodCostToLevel(bloodCostToLevelUp);
 
    //need to make sure amulet isnt expired so we can give accurate display
    const amuletDays = amulet?.lastLevelUpgradeTime + 7 * 86400 > Date.now()/1000 ? amulet?.level : 0;
    const timeLeftToLevelUp = props.lastLevelTime + (7 + amuletDays)*86400 - Date.now()/1000;
    const progressLevel = timeLeftToLevelUp > 0 ? timeLeftToLevelUp * 100 /  ((7 + amuletDays)*86400) : 0;
    setProgressForLevel(progressLevel);

    //now for Raid progress bar
    const timeLeftToRaid = props.lastRaidTime + 7 * 86400 - Date.now()/1000;
    const progressRaid = timeLeftToRaid > 0 ? timeLeftToRaid * 100 /  (7 * 86400) : 0;
    setProgressForRaid(progressRaid);
    setTimeLeftForLevel(timeLeftToLevelUp);
    setTimeLeftForRaid(timeLeftToRaid);    
  }
  

  useEffect(() => {   
    getUpdates(); 

    const init = async() => {          
      const fighterUnclaimed = await ugArenaContract.calculateStakingRewards(props.id);
      setUnclaimed(fighterUnclaimed);       
      
      const timer = setInterval(() => {
        getUpdates();     
       
      }, 15000);
      
      return () => {
        clearInterval(timer);
      };
    }
    init();
    // eslint-disable-next-line
  }, []);

  return (
    <Card raised= {true}  
    className={clicked ? "card-bordr clicked": "card-bordr"}
    sx={{
      borderRadius: 6, 
      maxWidth: 450, 
      minWidth: 110,
      borderColor: clicked ? 'aqua' : 'red' ,
      borderWidth: 2
    }}>
      <CardActionArea onClick={clickHandler} >
        <CardContent  align="center" sx={{p: 0,color: 'red'}}>
        {props.isFighter &&   <Typography gutterBottom variant="body2" component="div" sx={{fontFamily: 'Roboto', fontSize:'.6rem'}}>
          {`#${props.id} `}
                                </Typography>}
          {props.isFighter &&   <Typography gutterBottom variant="body2" component="div" sx={{fontFamily: 'Roboto', fontSize:'.6rem', color: 'aqua'}}>
          {`  LEVEL: ${props.level}`}
                                </Typography>}
          {props.isFighter &&  <Typography sx={{ fontSize: '.6rem', color: 'orange'}}>{`BR: ${props.brutality} Co: ${props.courage} Cu: ${props.cunning}`}</Typography>}
         
          {props.isFighter &&   <Typography variant="body2" sx={{fontFamily: 'Alegreya Sans SC', fontSize:'.8rem'}}>
                                  {` ${unclaimed} BLOOD `}
                                </Typography>}
          {!props.isFighter &&  <Typography gutterBottom variant="body2" component="div" sx={{fontFamily: 'Roboto',color: 'cyan', fontSize:'.75rem'}}>
                                  {` RANK ${props.rank}`}
                                </Typography>}
          {!props.isFighter &&  <Typography variant="body2" sx={{fontFamily: 'Alegreya Sans SC', color: 'yellow', fontSize:'.75rem'}}>
                                  {` ${yakUnclaimed} BLOOD `}
                                </Typography>}
                             
        </CardContent>
        <CardMedia
          component="img"
          height="180"
          image={props.imageUrl}
          alt="FYakuza"
          loading="lazy"
        />
        <CardContent  align="center" sx={{p: 0,color: 'cyan'}}>
        {props.isFighter && <Stack   >
                              <Typography sx={{ fontSize: '.6rem', color: 'gold'}}>{`Level Up Cost: ${bloodCostToLevel}`}</Typography>
                              <Box  sx={{ display: 'inline-flex',justifyContent: 'space-evenly' }}>
                                <Stack direction="row"  spacing={2} >                              
                                  <CircularProgressWithLabel value={Math.ceil(progressForLevel)} time={timeLeftForLevel  } style={{color: Math.ceil(progressForLevel) < 20 ? "red" : "chartreuse"}}/>
                                  <CircularProgressWithLabel value={Math.ceil(progressForRaid)} time={ timeLeftForRaid} style={{color: Math.ceil(progressForRaid) < 20 ? "red" : "chartreuse"}}/>                                
                                </Stack>
                              </Box>
                              <Box  sx={{ display: 'inline-flex',justifyContent: 'space-evenly' }}>
                                <Typography sx={{ fontSize: '.6rem'}}>LEVEL</Typography>
                                <Typography sx={{ fontSize: '.6rem'}}>RAID</Typography>                              
                              </Box>
                            </Stack>
                            }
        {!props.isFighter && <Typography gutterBottom variant="body2" component="div" sx={{fontFamily: 'Roboto',color: 'yellow', fontSize:'.75rem'}}>
                              {`#${props.id} `}
                            </Typography>}
          {!props.isFighter &&   <Typography variant="body2" sx={{fontFamily: 'Alegreya Sans SC', fontSize:'.75rem'}}>
                                    {"YAKUZA"}
                                  </Typography>}
        </CardContent>
      </CardActionArea>
    </Card>
  );
  
};
export default StakedFighterCardRankFix;

