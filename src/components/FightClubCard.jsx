import {useContext, useState, useEffect} from 'react';
import ProviderContext from '../context/provider-context';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Box, Stack } from '@mui/material';
import CircularProgressWithLabel from './CircularProgressWithLabel';

import { getUGGame4} from '../utils.js';
import './fightclubcard.css';
/* global BigInt */

const FightClubCard = (props) => {
  
    const [clicked, setClicked] = useState(false);
    const [progressForLevel, setProgressForLevel] = useState(0);
    const [timeLeftForLevel, setTimeLeftForLevel] = useState(0);
    const [timeLeftForCooldown, setTimeLeftForCooldown] = useState(0);
    const [coolDownTime, setCoolDownTime] = useState(0);
    const [progressForSize, setProgressForSize] = useState(0);
    const [levelUpCost, setLevelUpCost] = useState(undefined);
    const [sizeUpCost, setSizeUpCost] = useState(undefined);
    const [maintainCost, setMaintainCost] = useState(undefined);
    const prv = useContext(ProviderContext);
    const ugGameContract = getUGGame4();
    

    const baseUrl = 'https://the-u.club/reveal/fightclub/';
    const random = Math.floor(Math.random() * (500 - 1 + 1)) + 1 + 20000;
    const fclubUrl = baseUrl.concat(props.id.toString()).concat('.jpg');  

    const updateProgress = async() => {
        const blockNumber = await prv.provider.getBlockNumber();
        const block = await prv.provider.getBlock(blockNumber);
        
        const timeLeftToLevelUp = props.lastLevelTime + 7 *86400 - block.timestamp;
        const progressLevel = timeLeftToLevelUp > 0 ? timeLeftToLevelUp * 100 /  (7 *86400) : 0;
        setTimeLeftForLevel(timeLeftToLevelUp);
        setProgressForLevel(progressLevel);

        const levelsLeftForSizeUp = 7 - props.level % 7;
        const progressSize = levelsLeftForSizeUp > 0 ? levelsLeftForSizeUp * 100 /  (7 *86400) : 0;        
        setProgressForSize(progressSize);

        if(props.lastUnstakeTime > 0 && props.lastUnstakeTime + 2 *86400 > block.timestamp){
          const timeLeftForCoolDown = props.lastUnstakeTime + 2 *86400 - block.timestamp;
          const progressCooldown = timeLeftForCoolDown > 0 ? timeLeftForCoolDown * 100 /  (2 *86400) : 0; 
          setTimeLeftForCooldown(timeLeftForCoolDown);
          setCoolDownTime(progressCooldown );
        } else {
          setCoolDownTime(0);
          setTimeLeftForCooldown(0);
        }

        const levelUpCost = await ugGameContract.getFightClubLevelUpBloodCost(props.level, props.size, 1, 0);
        const maintainCost = await ugGameContract.getFightClubLevelUpBloodCost(props.level, props.size, 0, 0);
        const sizeUpCost = await ugGameContract.getFightClubLevelUpBloodCost( props.level, props.size,0,1);
        setLevelUpCost(levelUpCost);
        setSizeUpCost(sizeUpCost);
        setMaintainCost(maintainCost);
       
    }
    

  const clickHandler = () => {
    setClicked((current) => {
        console.log(props.id);
      props.onSelected(props.id, !current);
      return !current;
    });
  }

  if(clicked && props.emptyArray) setClicked(false);

  useEffect(() => {   
    const init = async() => {    

        updateProgress();
        
      
      const timer = setInterval(() => {
       
        updateProgress();
        
      }, 60000);

      
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
      maxHeight: 420,
      maxWidth: 350, 
      borderColor: clicked ? 'aqua' : 'red' ,
      borderWidth: 2
    }}>
      <CardActionArea onClick={clickHandler} >
        <CardContent  align="center" sx={{p: 0,color: 'red'}}>
         
        </CardContent>
        <CardMedia
          component="img"
          height="300"
          image={fclubUrl}
          alt="FYakuza"
          loading="lazy"
        />
        <CardContent  align="center" sx={{p: 1,color: 'cyan'}}>
          <Stack   >
            <Box  sx={{ display: 'inline-flex',justifyContent: 'space-around' }}>
              <Stack direction="row"  spacing={5} sx={{ display: 'inline-flex',justifyContent: 'space-between' }}>
                <Typography gutterBottom variant="h2" component="div" sx={{fontFamily: 'Alegreya Sans SC',color: 'yellow', fontSize:'1rem'}}>
                  {`#${props.id} `}
                </Typography>
                <Typography sx={{fontFamily: 'Alegreya Sans SC', fontSize: '1rem'}}>SIZE {props.size}</Typography> 
                <Typography sx={{ fontFamily: 'Alegreya Sans SC',fontSize: '1rem'}}>LEVEL {props.level}</Typography>
                <Box sx={{pr:.5}}>
                  <CircularProgressWithLabel value={progressForLevel} time={timeLeftForLevel  } sx={{  }} style={{color: Math.round(progressForLevel, 2) < 20 ? "red" : "chartreuse"}}/>
                </Box>
               
              </Stack>
             
            </Box>  
            <Box  sx={{ display: 'inline-flex',justifyContent: 'space-between' }}>
              <Stack direction="row" minWidth={230} spacing={4} sx={{ display: 'inline-flex',justifyContent: 'space-between' }}>
                {props.level < 34 && <Typography sx={{fontFamily: 'Alegreya Sans SC', fontSize: '.8rem',color: 'gold'}}>Level:  {Number(levelUpCost)}</Typography> }
                {props.size < 4 && <Typography sx={{fontFamily: 'Alegreya Sans SC', fontSize: '.8rem',color: 'gold'}}>Size Up:  {Number(sizeUpCost)}</Typography> }
                 
                <Typography sx={{ fontFamily: 'Alegreya Sans SC',fontSize: '.8rem',color: 'gold'}}>Maintain: {Number(maintainCost)}</Typography>
              </Stack>  
          </Box>     
                
                {coolDownTime > 0 && <Stack direction="row"  sx={{ display: 'inline-flex',justifyContent: 'space-around' }}>
                <Typography sx={{fontFamily: 'Alegreya Sans SC', fontSize: '1rem', color: 'red'}}>CoolDown Timer (restake at 0): </Typography>
                  <CircularProgressWithLabel value={coolDownTime} time={timeLeftForCooldown  }style={{color: Math.round(coolDownTime, 2) < 20 ? "chartreuse" : "red"}}/>
                </Stack>   }       
          </Stack>            
        </CardContent>
      </CardActionArea>
    </Card>
  );
  
};

export default FightClubCard