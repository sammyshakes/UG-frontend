import {useContext, useState, useEffect} from 'react';
import ProviderContext from '../context/provider-context';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Box, Stack } from '@mui/material';
import {getUGArena} from '../utils.js';
import './stakedFighterCard.css';
import CircularProgressWithLabel from './CircularProgressWithLabel';
/* global BigInt */

const StakedFighterCard = (props) => {
  const [unclaimed, setUnclaimed] = useState(undefined);
  const [clicked, setClicked] = useState(false);
  const [progressForLevel, setProgressForLevel] = useState(0);
  const [progressForRaid, setProgressForRaid] = useState(0);
  const prv = useContext(ProviderContext);
  const ugArenaContract = getUGArena();
  const amulet = prv.stakedAmulet;

  const clickHandler = () => {
    setClicked((current) => {
      props.onSelected(props.id, !current);
      return !current;
    });
  }

  if(clicked && props.emptyArray) setClicked(false);

  useEffect(() => {   
    const init = async() => {    
      const fighterUnclaimed = await ugArenaContract.functions.calculateStakingRewards(props.id);
      setUnclaimed(fighterUnclaimed);
      const blockNumber = await prv.provider.getBlockNumber();
      const block = await prv.provider.getBlock(blockNumber);
      
      //kinda need to make sure amulet isnt expired so we can give accurate display
      let amuletDays = amulet[0].lastLevelUpgradeTime + 7 * 86400 > block.timestamp ? amulet[0].level : 0;
      
      let timeLeftToLevelUp = props.lastLevelTime + (7 + amuletDays)*86400 - block.timestamp;
      let progressLevel = timeLeftToLevelUp > 0 ? timeLeftToLevelUp * 100 /  ((7 + amuletDays)*86400) : 0;
      setProgressForLevel(progressLevel);
      //now for Raid progress bar
      let timeLeftToRaid = props.lastRaidTime + 7 * 86400 - block.timestamp;
      let progressRaid = timeLeftToRaid > 0 ? timeLeftToRaid * 100 /  (7 * 86400) : 0;
      setProgressForRaid(progressRaid);

      
      const timer = setInterval(() => {
       
        amuletDays = amulet[0].lastLevelUpgradeTime + 7 * 86400 > block.timestamp ? amulet[0].level : 0;
        
        timeLeftToLevelUp = props.lastLevelTime + (7 + amuletDays)*86400 - block.timestamp;
        progressLevel = timeLeftToLevelUp > 0 ? timeLeftToLevelUp * 100 /  ((7 + amuletDays)*86400) : 0;
        setProgressForLevel(progressLevel);
        timeLeftToRaid = props.lastRaidTime + 7 * 86400 - block.timestamp;
        progressRaid = timeLeftToRaid > 0 ? timeLeftToRaid * 100 /  (7 * 86400) : 0;
        setProgressForRaid(progressRaid);
        
      }, 5000);

      
      return () => {
        clearInterval(timer);
      };
    }
    init();
    // eslint-disable-next-line
  }, []);

  return (
    <Modal>
    <Card raised= {true}  
    className={clicked ? "card-bordr clicked": "card-bordr"}
    sx={{
      borderRadius: 6, 
      maxWidth: 345, 
      borderColor: clicked ? 'aqua' : 'red' 
    }}>
      <CardActionArea onClick={clickHandler} >
        <CardContent  align="center" sx={{p: 0,color: 'red'}}>
          {props.isFighter && <Typography gutterBottom variant="body2" component="div" sx={{fontFamily: 'Roboto', fontSize:'.75rem'}}>
                                {`  LEVEL ${props.level}`}
                              </Typography>}
          {props.isFighter &&   <Typography variant="body2" sx={{fontFamily: 'Alegreya Sans SC', fontSize:'.8rem'}}>
                                  {` ${unclaimed} BLOOD `}
                                </Typography>}
            {!props.isFighter && <Typography gutterBottom variant="body2" component="div" sx={{fontFamily: 'Roboto',color: 'cyan', fontSize:'.75rem'}}>
                                  {` RANK ${props.rank}`}
                                </Typography>}
            {!props.isFighter &&   <Typography variant="body2" sx={{fontFamily: 'Alegreya Sans SC', color: 'yellow', fontSize:'.75rem'}}>
                                      {` ${unclaimed} BLOOD `}
                                    </Typography>}
        </CardContent>
        <CardMedia
          component="img"
          height="150"
          image={props.imageUrl}
          alt="FYakuza"
          loading="lazy"
        />
        <CardContent  align="center" sx={{p: 0,color: 'cyan'}}>
        {props.isFighter && <Stack   >
          <Box  sx={{ display: 'inline-flex',justifyContent: 'space-evenly' }}>
                              <Stack direction="row"  spacing={2} >
                             
                                <CircularProgressWithLabel value={progressForLevel} sx={{  }} style={{color: Math.round(progressForLevel, 2) < 20 ? "red" : "chartreuse"}}/>
                                <CircularProgressWithLabel value={progressForRaid} sx={{}} style={{color: Math.round(progressForRaid, 2) < 20 ? "red" : "chartreuse"}}/>
                              
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
    </Modal>
  );
  
};
export default StakedFighterCard;

