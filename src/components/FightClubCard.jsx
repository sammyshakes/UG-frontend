import {useContext, useState, useEffect} from 'react';
import ProviderContext from '../context/provider-context';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Box, Stack } from '@mui/material';
import CircularProgressWithLabel from './CircularProgressWithLabel';

import { getUGGame5, getFclubAlley} from '../utils.js';
import './fightclubcard.css';
/* global BigInt */

const FightClubCard = (props) => {
    const [unclaimedRewards, setUnclaimedRewards] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [levelUpCost, setLevelUpCost] = useState(undefined);
    const [sizeUpCost, setSizeUpCost] = useState(undefined);
    const prv = useContext(ProviderContext);
    const ugGameContract = getUGGame5();
    const ugFclubAlley = getFclubAlley();
    

    const baseUrl = 'https://the-u.club/reveal/fightclub/';
    const random = Math.floor(Math.random() * (500 - 1 + 1)) + 1 + 20000;
    const fclubUrl = baseUrl.concat(props.id.toString()).concat('.jpg');  

    const updateProgress = async() => {

        const levelUpCost = await ugGameContract.getFightClubLevelUpBloodCost(props.level, props.size, 1, 0);
        const sizeUpCost = await ugGameContract.getFightClubLevelUpBloodCost( props.level, props.size,0,1);
        setUnclaimedRewards(await ugFclubAlley.calculateStakingRewards(props.id));
        setLevelUpCost(levelUpCost);
        setSizeUpCost(sizeUpCost);
       
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
        <Typography sx={{display: 'inline-flex',justifyContent: 'flex-end', fontFamily: 'Alegreya Sans SC',fontSize: '1rem', color: 'red'}}>Earnings: {Number(unclaimedRewards).toLocaleString()}</Typography>
          
        </CardContent>
        <CardMedia
          component="img"
          height="300"
          image={fclubUrl}
          alt="FYakuza"
          loading="lazy"
        />
        <CardContent  align="center" sx={{p: 1,color: 'cyan'}}>
          <Stack>            
            <Stack direction="row"  spacing={5} sx={{ display: 'inline-flex',justifyContent: 'space-evenly' }}>
              <Typography gutterBottom variant="h2" component="div" sx={{fontFamily: 'Alegreya Sans SC',color: 'gold', fontSize:'1rem'}}>
                {`#${props.id} `}
              </Typography>
              <Typography sx={{fontFamily: 'Alegreya Sans SC', fontSize: '1rem'}}>SIZE {props.size}</Typography> 
              <Typography sx={{ fontFamily: 'Alegreya Sans SC',fontSize: '1rem'}}>LEVEL {props.level}</Typography>               
            </Stack>            
            <Stack direction="row" minWidth={230} spacing={4} sx={{ display: 'inline-flex',justifyContent: 'space-evenly' }}>
              <Typography sx={{fontFamily: 'Alegreya Sans SC', fontSize: '.8rem',color: 'red'}}>Level Up :  {Number(levelUpCost).toLocaleString()}</Typography>
              <Typography sx={{fontFamily: 'Alegreya Sans SC', fontSize: '.8rem',color: 'red'}}>Size Up :  {Number(sizeUpCost).toLocaleString()}</Typography>                
            </Stack>  
              
                
                     
          </Stack>            
        </CardContent>
      </CardActionArea>
    </Card>
  );
  
};

export default FightClubCard