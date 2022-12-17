import {useContext, useState, useEffect} from 'react';
import ProviderContext from '../context/provider-context';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Container,CardActionArea, Box, Stack } from '@mui/material';
import {getUGRaid, getUGNft} from '../utils.js';
import CircularProgressWithLabel from './CircularProgressWithLabel';
import './fightclubcard.css';
/* global BigInt */

const FightClubCard = (props) => {
  
    const [clicked, setClicked] = useState(false);
    const [progressForLevel, setProgressForLevel] = useState(0);
    const [progressForSize, setProgressForSize] = useState(0);
    const prv = useContext(ProviderContext);
    const ugRaidContract = getUGRaid();
    const ugNftContract = getUGNft();

    const baseUrl = 'https://the-u.club/reveal/fightclub/';
    const random = Math.floor(Math.random() * (500 - 1 + 1)) + 1 + 20000;
    const fclubUrl = baseUrl.concat(props.id.toString()).concat('.jpg');  

    const updateProgress = async() => {
        const blockNumber = await prv.provider.getBlockNumber();
        const block = await prv.provider.getBlock(blockNumber);
        
        const timeLeftToLevelUp = props.lastLevelTime + 7 *86400 - block.timestamp;
        const progressLevel = timeLeftToLevelUp > 0 ? timeLeftToLevelUp * 100 /  (7 *86400) : 0;
        setProgressForLevel(progressLevel);

        const levelsLeftForSizeUp = 7 - props.level % 7;
        const progressSize = levelsLeftForSizeUp > 0 ? levelsLeftForSizeUp * 100 /  (7 *86400) : 0;        
        setProgressForSize(progressSize);
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
      borderRadius: 6, 
      maxHeight: 420,
      maxWidth: 350, 
      borderColor: clicked ? 'aqua' : 'red' 
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
                  <CircularProgressWithLabel value={progressForLevel} sx={{  }} style={{color: Math.round(progressForLevel, 2) < 20 ? "red" : "chartreuse"}}/>
                </Box>
              </Stack>
            </Box>              
          </Stack>            
        </CardContent>
      </CardActionArea>
    </Card>
  );
  
};

export default FightClubCard