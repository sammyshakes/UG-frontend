import {useContext, useState, useEffect} from 'react';
import ProviderContext from '../context/provider-context';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Box, Stack } from '@mui/material';
import { getUGForgeSmith3, getUGNft2, getUGGame4} from '../utils.js';
import CircularProgressWithLabel from './CircularProgressWithLabel';
import knucklesImage from '../assets/images/forgeWeaponImages/1.png';
import chainsImage from '../assets/images/forgeWeaponImages/2.png';
import butterflyImage from '../assets/images/forgeWeaponImages/3.png';
import macheteImage from '../assets/images/forgeWeaponImages/4.png';
import katanaImage from '../assets/images/forgeWeaponImages/5.png';
import './stakedforgecard.css';
/* global BigInt */

const OwnedForgeCard = (props) => {
  
    const [clicked, setClicked] = useState(false);
    const [progressForLevel, setProgressForLevel] = useState(0);
    const [weaponString, setWeaponString] = useState('');
    const [weaponImage, setWeaponImage] = useState(knucklesImage);
    
    const prv = useContext(ProviderContext);
    const ugNftContract = getUGNft2();

    const baseUrl = 'https://the-u.club/reveal/forge/';
    const forgeUrl = baseUrl.concat(props.size).concat('.png');  

    const getWeapon = () => {
      let text;
      if(props.size >= 1) {
        setWeaponImage(knucklesImage)
        text = "Steel Knuckles";
      }
      if(props.size >= 2 && props.level > 7) {
        setWeaponImage(chainsImage)
        text = "Steel Chains";
      }
      if(props.size >= 3 && props.level > 14) {
        setWeaponImage(butterflyImage)
        text = "Steel Butterfly Knives";
      }
      if(props.size >= 4 && props.level > 21) {
        setWeaponImage(macheteImage)
        text = "Steel Machetes";
      }
      if(props.size >= 5 && props.level > 28) {
        setWeaponImage(katanaImage)
        text = "Steel Katanas";
      }
      return text;

    }

    const getUpdates = async() => {
      setWeaponString(getWeapon());        
      const timeLeftToLevelUp = props?.lastLevelTime + 7 *86400 - Date.now()/1000;
      const progressLevel = timeLeftToLevelUp > 0 ? timeLeftToLevelUp * 100 /  (7 *86400) : 0;
      setProgressForLevel(progressLevel);      
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
        maxHeight: 200,
        maxWidth: 360, 
        borderColor: clicked ? 'aqua' : 'red' ,
        borderWidth:  2
      }}>
      <CardActionArea onClick={clickHandler} >
       <Stack direction="row">
        <img
          height="200"
          src={forgeUrl}
          alt="Forge"
          border="1"
        />
        <CardContent  align="center" sx={{p: 2,color: 'red'}}>
          <Stack direction="row" spacing={1}sx={{ display: 'inline-flex',justifyContent: 'space-between' }}>
           
              <Stack align="left" minWidth={100} spacing={1} >
                <Typography gutterBottom variant="h2" component="div" sx={{fontFamily: 'Alegreya Sans SC', fontSize:'1rem', color:'gold'}}>
                  {`Forge #${props.id} `}
                </Typography>
                <Typography sx={{fontFamily: 'Alegreya Sans SC', fontSize: '1rem',color: 'aqua'}}>
                  SIZE {props.size}
                </Typography>                   
                <Typography sx={{ fontFamily: 'Alegreya Sans SC',fontSize: '1rem',color: 'aqua'}}>
                  LEVEL {props.level}
                </Typography>               
              </Stack>

              <Stack align="right"  spacing={4} >
                <Typography variant="h2" component="div" sx={{fontFamily: 'Alegreya Sans SC', fontSize:'1rem', color: 'deepskyblue'}}>
                  {`${ weaponString} `}
                </Typography>  
                <Box >
                <img
                className="imag-bordr" 
                height={100}
                src={weaponImage}
                alt={props.id}
                />      
              </Box>               
              </Stack>
              
           
                 
             
              <Box sx={{pr:2}}>
                <CircularProgressWithLabel value={Math.ceil(progressForLevel)} size='3rem' thickness={4}  sx={{  }} style={{color: Math.ceil(progressForLevel) < 20 ? "red" : "chartreuse"}}/>
              </Box> 
         
         
          <Box   sx={{ display: 'inline-flex',justifyContent: 'space-between' }}>
            <Stack direction="row" spacing={4} sx={{ display: 'inline-flex',justifyContent: 'space-between' }}>
             
             
             
              <Box sx={{height: 5}}></Box>    
                          
            </Stack>  

          </Box>   
                  
        </Stack>             
      </CardContent>
      </Stack>
      </CardActionArea>
    </Card>
  );
  
};

export default OwnedForgeCard