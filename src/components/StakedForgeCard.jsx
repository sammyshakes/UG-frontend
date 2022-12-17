import {useContext, useState, useEffect} from 'react';
import ProviderContext from '../context/provider-context';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Container,CardActionArea, Box, Stack } from '@mui/material';
import { getUGForgeSmith3, getUGNft2, getUGGame4} from '../utils.js';
import CircularProgressWithLabel from './CircularProgressWithLabel';
import knucklesImage from '../assets/images/forgeWeaponImages/1.png';
import chainsImage from '../assets/images/forgeWeaponImages/2.png';
import butterflyImage from '../assets/images/forgeWeaponImages/3.png';
import macheteImage from '../assets/images/forgeWeaponImages/4.png';
import katanaImage from '../assets/images/forgeWeaponImages/5.png';
import './stakedforgecard.css';
/* global BigInt */

const StakedForgeCard = (props) => {
  
    const [clicked, setClicked] = useState(false);
    const [progressForLevel, setProgressForLevel] = useState(0);
    const [nextWeaponDrop, setNextWeaponDrop] = useState(0);    
    const [weaponString, setWeaponString] = useState('');
    const [weaponImage, setWeaponImage] = useState(knucklesImage);
    const [levelsLeft, setLevelsLeft] = useState(knucklesImage);
    const [levelUpCost, setLevelUpCost] = useState(undefined);
    const [timeLeftForLevel, setTimeLeftForLevel] = useState(undefined);
    const [sizeUpCost, setSizeUpCost] = useState(undefined);
    const [maintainCost, setMaintainCost] = useState(undefined);
    const [unclaimedWeapon, setUnclaimedWeapon] = useState(undefined);    
    const [unclaimedWeaponAmount, setUnclaimedWeaponAmount] = useState(undefined);
    const [stakedForge, setStakedForge] = useState({});
    
    const prv = useContext(ProviderContext);
    const ugForgeSmithContract = getUGForgeSmith3();    
    const ugGameContract = getUGGame4();
    const ugNftContract = getUGNft2();

    const baseUrl = 'https://the-u.club/reveal/forge/';
    const random = Math.floor(Math.random() * (500 - 1 + 1)) + 1 + 20000;
    const forgeUrl = baseUrl.concat(props.size).concat('.png');  

    const getWeapon = () => {
      if(props.size === 1) {
        setWeaponImage(knucklesImage)
        return "Steel Knuckles";
      }
      if(props.size === 2 && props.level > 7) {
        setWeaponImage(chainsImage)
        return "Steel Chains";
      }
      if(props.size === 3 && props.level > 14) {
        setWeaponImage(butterflyImage)
        return "Steel Butterfly Knives";
      }
      if(props.size === 4 && props.level > 21) {
        setWeaponImage(macheteImage)
        return "Steel Machetes";
      }
      if(props.size === 5 && props.level > 28) {
        setWeaponImage(katanaImage)
        return "Steel Katanas";
      }

    }

    const getUpdates = async() => {
      setWeaponString(getWeapon());

        const stakedForge = await ugForgeSmithContract.stakedForges(props?.id);
        
        const timeLeftToLevelUp = props?.lastLevelTime + 7 *86400 - Date.now()/1000;
        const progressLevel = timeLeftToLevelUp > 0 ? timeLeftToLevelUp * 100 /  (7 *86400) : 0;
        setProgressForLevel(progressLevel);
        setTimeLeftForLevel(timeLeftToLevelUp);

        const levelDivisor = props?.level % 7 === 0 ? 7 : props?.level % 7;

        const minutesDropFreq = 86400 / levelDivisor / 60 ;
        const dropFreqHours = Math.floor(minutesDropFreq / 60);
        const dropFreqMinutes = minutesDropFreq % 60;
        const timeLeftForNextWeaponDrop = Math.floor(minutesDropFreq - ((Date.now()/1000 - stakedForge?.stakeTimestamp) % (86400 / levelDivisor)) / 60)  ;
        setNextWeaponDrop(timeLeftForNextWeaponDrop);

        const levelsLeftForSizeUp = props?.level % 7 === 0 ? props?.level % 7 : 7 - props?.level % 7;
        setLevelsLeft(levelsLeftForSizeUp);

        const [unclaimedWeapon, unclaimedAmount ] = await ugForgeSmithContract.calculateStakingRewards(props.id);
        setUnclaimedWeapon(Number(unclaimedWeapon));
        setUnclaimedWeaponAmount(Number(unclaimedAmount));

        const levelUpCost = await ugGameContract.getForgeLevelUpBloodCost(props.level, props.size, 1);
        const maintainCost = await ugGameContract.getForgeLevelUpBloodCost(props.level, props.size, 0);
        const sizeUpCost = await ugGameContract.getForgeSizeUpBloodCost( props.size);
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

        getUpdates();
        
      
      const timer = setInterval(() => {
       
        getUpdates();
        
      }, 5000);

      
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
      borderRadius: 5, 
      maxHeight: 400,
      maxWidth: 520, 
      borderColor: clicked ? 'aqua' : 'red' ,
      borderWidth:  2
    }}>
      <CardActionArea onClick={clickHandler} >
       <Stack direction="row">
        <CardMedia
          component="img"
          height="330"
          image={forgeUrl}
          alt="FYakuza"
          loading="lazy"
          border="1"
        />
        <CardContent  align="center" sx={{p: 2,color: 'red'}}>
          <Stack sx={{ display: 'inline-flex',justifyContent: 'space-between' }}>
            <Box  sx={{ display: 'inline-flex',justifyContent: 'space-between' }}>
              <Stack direction="row" minWidth={200} spacing={4} sx={{ display: 'inline-flex',justifyContent: 'space-between' }}>
                <Typography gutterBottom variant="h2" component="div" sx={{fontFamily: 'Alegreya Sans SC', fontSize:'1rem'}}>
                  {`Forge #${props.id} `}
                </Typography>
                <Typography gutterBottom variant="h2" component="div" sx={{fontFamily: 'Alegreya Sans SC', fontSize:'1rem'}}>
                  {`${ weaponString} `}
                </Typography>
                
              </Stack>
              
            </Box>  
            <Box  sx={{ display: 'inline-flex',justifyContent: 'space-between' }}>
              <Stack direction="row" minWidth={230} spacing={4} sx={{ display: 'inline-flex',justifyContent: 'space-between' }}>
                <Typography sx={{fontFamily: 'Alegreya Sans SC', fontSize: '1.25rem',color: 'deepskyblue'}}>SIZE {props.size}</Typography> 
                  
                <Typography sx={{ fontFamily: 'Alegreya Sans SC',fontSize: '1.25rem',color: 'deepskyblue'}}>LEVEL {props.level}</Typography>
              </Stack>  
          </Box> 
          <Box  sx={{ display: 'inline-flex',justifyContent: 'space-between' }}>
            <Stack direction="row" minWidth={230} spacing={4} sx={{ display: 'inline-flex',justifyContent: 'space-between' }}>
            
              <Box sx={{p:.25, border: 2, borderColor:'red', borderRadius: 2}}>
              <Stack sx={{px:.5, display: 'inline-flex',justifyContent: 'flex-start' }}>
              {(levelsLeft > 0 &&  props.size !== 5) &&  <Typography align="left" sx={{ fontFamily: 'Alegreya Sans SC',fontSize: '.8rem', color: 'deepskyblue'}}>Size Up in:</Typography>}
              {(levelsLeft > 0 && props.size !== 5) &&  <Typography align="center"sx={{ fontFamily: 'Alegreya Sans SC',fontSize: '1.1rem', color: 'deepskyblue'}}>{levelsLeft} Levels</Typography>}
              {(levelsLeft === 0 && props.size !== 5) &&  <Typography align="center" sx={{ fontFamily: 'Alegreya Sans SC',fontSize: '.9rem', color: 'yellow'}}> Size Up </Typography>}
              {(levelsLeft === 0 && props.size !== 5) &&  <Typography align="center"sx={{ fontFamily: 'Alegreya Sans SC',fontSize: '.8rem', color: 'yellow'}}>to Level Up</Typography>}
              {props.size === 5 && <Typography align="left" sx={{ fontFamily: 'Alegreya Sans SC',fontSize: '.8rem', color: 'palegreen'}}>reached</Typography>}
              {props.size === 5 && <Typography align="center"sx={{ fontFamily: 'Alegreya Sans SC',fontSize: '.9rem', color: 'palegreen'}}>MAX Size</Typography>}
              </Stack>
               </Box>  
               <Box sx={{width: 20}}></Box>
              <Box sx={{pr:2}}>
                <CircularProgressWithLabel time={timeLeftForLevel} value={Math.ceil(progressForLevel)} size='3rem' thickness={4}  sx={{  }} style={{color: Math.ceil(progressForLevel) < 20 ? "red" : "chartreuse"}}/>
              </Box> 
            </Stack>  
          </Box> 
          <Box sx={{height: 25}}>
                 </Box> 
          <Box   sx={{ display: 'inline-flex',justifyContent: 'space-between' }}>
            <Stack direction="row" spacing={4} sx={{ display: 'inline-flex',justifyContent: 'space-between' }}>
              <Stack>
                <Typography component="div" sx={{fontFamily: 'Alegreya Sans SC', fontSize: '1rem'}}>Unclaimed:</Typography> 
                <Box  sx={{ justifyContent: 'center' }}>
                  <Box height={60} sx={{border: 2, borderColor: 'red', borderRadius: 2,  justifyContent: 'center' }}>
                  <Typography sx={{ fontFamily: 'Alegreya Sans SC',fontSize: '2rem', color: 'gold'}}>{unclaimedWeaponAmount}</Typography>
                  </Box>
                  <Typography sx={{ fontFamily: 'Alegreya Sans SC',fontSize: '.8rem', color: 'aqua'}}>Next Weapon:</Typography>
                  <Typography sx={{ fontFamily: 'Alegreya Sans SC',fontSize: '1.5rem', color: 'aqua'}}>{Math.floor(nextWeaponDrop/60)} : {Math.floor(nextWeaponDrop%60)}</Typography>
                  
                </Box>
              </Stack>
              <Box ></Box>
              <Box >
                <img
                className="imag-bordr" 
                height={100}
                src={weaponImage}
                alt={props.id}
                />      
              </Box> 
              <Box sx={{height: 5}}></Box>    
                          
            </Stack>  

          </Box>   
          <Box  sx={{ display: 'inline-flex',justifyContent: 'space-between' }}>
              <Stack direction="row" minWidth={230} spacing={4} sx={{ display: 'inline-flex',justifyContent: 'space-between' }}>
                {(props.level%7 !== 0 || props.size*7 > props.level) && <Typography sx={{fontFamily: 'Alegreya Sans SC', fontSize: '.8rem',color: 'gold'}}>Level:  {Number(levelUpCost)}</Typography> }
                {props.level%7 === 0 && props.size*7 <= props.level && <Typography sx={{fontFamily: 'Alegreya Sans SC', fontSize: '.8rem',color: 'gold'}}>Size Up:  {Number(sizeUpCost)}</Typography> }
                 
                <Typography sx={{ fontFamily: 'Alegreya Sans SC',fontSize: '.8rem',color: 'gold'}}>Maintain: {Number(maintainCost)}</Typography>
              </Stack>  
          </Box>                  
        </Stack>             
      </CardContent>
      </Stack>
      </CardActionArea>
    </Card>
  );
  
};

export default StakedForgeCard