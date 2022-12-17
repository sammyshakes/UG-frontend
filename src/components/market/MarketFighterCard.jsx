import React from 'react'
import { useEffect, useState} from 'react';
import {Container, Box, Stack, Typography, CardMedia, Button} from '@mui/material';
import CircularProgressWithLabel from '../CircularProgressWithLabel';
import bloodToken from '../../assets/images/coin_transp_500.png';
import './market.css';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';

import SimpleDateTime  from 'react-simple-timestamp-to-date';

const baseUrl = 'https://the-u.club/reveal/fighteryakuza/fighter/';

export const MarketFighterCard = (props) => {
  const [progressForLevel, setProgressForLevel] = useState();
  const [progressForRaid, setProgressForRaid] = useState();
  const [timeLeftForRaid, setTimeLeftForRaid] = useState();
  const [timeLeftForLevel, setTimeLeftForLevel] = useState();
  const [isInCart, setIsInCart] = useState(false);

  const imageUrl = baseUrl.concat(props.imageId).concat('.png');

  const sendToCartHandler = () => {
    setIsInCart(true);
    props.onAddToCart({
      listingId: props.id,
      id: props.tokenId,
      level: props.level,
      imageUrl: imageUrl,
      price: props.price
    })
  }

  const cancelHandler = () => {
    props.onCancelListing({
      listingId: props.id,
      id: props.tokenId,
      level: props.level,
      imageUrl: imageUrl,
      price: props.price
    })
  }

  const updateHandler = () => {
    props.onAddToCart({
      listingId: props.id,
      id: props.tokenId,
      level: props.level,
      imageUrl: imageUrl,
      price: props.price
    })
  }

  const getUpdates = async() => {                
    const timeLeftToLevelUp = props.lastLevelUpgradeTime + 7*86400 - Date.now()/1000;
    const progressLevel = timeLeftToLevelUp > 0 ? timeLeftToLevelUp * 100 /  (7 *86400) : 0;  
    const timeLeftToRaid = props.lastRaidTime + 7 * 86400 - Date.now()/1000;
    const progressRaid = timeLeftToRaid > 0 ? timeLeftToRaid * 100 /  (7 * 86400) : 0;
    setProgressForLevel(progressLevel);
    setProgressForRaid(progressRaid);
    setTimeLeftForLevel(timeLeftToLevelUp);
    setTimeLeftForRaid(timeLeftToRaid);   
  }

  useEffect(() => {     
    const init = async() => {            
        getUpdates();
    }
    init();

    const timer = setInterval(() => {
      getUpdates();
    }, 60000);

    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line
  }, []);   


  return (
    <Box className="mkt-box">
    <Container>        
      <Stack direction="row" sx={{justifyContent: 'space-between'}}>   
     
        <Stack  align="left" spacing={1} sx={{}}>
        <Typography variant='h1'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1rem', color: 'red'}}>FIGHTER: {props.tokenId}</Typography>
            
        <CardMedia
          component="img"
          height="180"
          image={imageUrl}
          alt="FYakuza"
          loading="lazy"
          className="img-box"
        /> 
            <Stack   >
                <Box >
                  <Stack direction="row"  spacing={2}  sx={{ justifyContent: 'space-around' }} >                              
                    <CircularProgressWithLabel value={Math.ceil(progressForLevel)} time={timeLeftForLevel  } style={{color: Math.ceil(progressForLevel) < 20 ? "red" : "chartreuse"}}/>
                    <CircularProgressWithLabel value={Math.ceil(progressForRaid)} time={ timeLeftForRaid} style={{color: Math.ceil(progressForRaid) < 20 ? "red" : "chartreuse"}}/>                                
                  </Stack>
                </Box>
                <Box  sx={{ display: 'inline-flex',justifyContent: 'space-around' }}>
                  <Typography sx={{ fontSize: '.6rem', color: 'aqua'}}>LEVEL</Typography>
                  <Typography sx={{ fontSize: '.6rem', color: 'aqua'}}>RAID</Typography>                              
                </Box>
              </Stack>
             
        </Stack>                    
          <Stack  align="right" spacing={1} sx={{}}>               
              <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1rem', color: 'red'}}>Level: {props.level}</Typography>    
              <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.75rem', color: 'orange'}}>Brutality: {props.brutality} </Typography>
              <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.75rem', color: 'orange'}}>Courage: {props.courage}</Typography>
              <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.75rem', color: 'orange'}}>Cunning: {props.cunning}</Typography>
                
              <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'.75rem', color: 'orchid'}}> Scars: {props.scars}</Typography>     
              {<Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.75rem', color: 'deepskyblue'}}>Knuckles: {props.knuckles}</Typography>}
              { <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.75rem', color: 'deepskyblue'}}>Chains: {props.chains}</Typography>}
              { <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.75rem', color: 'deepskyblue'}}>Butterfly: {props.butterfly}</Typography>}
              { <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.75rem', color: 'deepskyblue'}}>Machete: {props.machete}</Typography>}
              { <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.75rem', color: 'deepskyblue'}}>Katana: {props.katana}</Typography>}
          </Stack>         
          
      </Stack>
      <Stack direction="row"  spacing={2} py={1}  sx={{ justifyContent: 'space-between' }} >  
     
      {props.sold && !isInCart && <Box>            
        <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'.85rem', color: 'chartreuse'}}>SOLD: <SimpleDateTime dateSeparator="/" timeSeparator=":">{Number(props.timestamp)}</SimpleDateTime></Typography>
        
        <Typography noWrap={true} width={150} variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'.75rem', color: 'cyan'}}>Seller:{props.owner}</Typography>     
      </Box>}
      {props.account !== props.owner && !isInCart && !props.sold && <Button 
        variant="contained" 
        size="small" 
        sx={{fontFamily: 'Alegreya Sans SC', fontSize: '.7rem'}}
        onClick={sendToCartHandler}
        style={{borderColor: 'black', color: 'black', borderRadius: 10, backgroundColor: 'aqua', width: '45%'}}>
          add to cart
      </Button> }
      {props.account !== props.owner && isInCart && <Button 
      disabled
        variant="contained" 
        size="small" 
        sx={{fontFamily: 'Alegreya Sans SC', fontSize: '.7rem'}}
        onClick={sendToCartHandler}
        style={{borderColor: 'black', color: 'black', borderRadius: 10, backgroundColor: 'aqua', width: '45%'}}>
          in cart<DoneOutlineIcon/>
      </Button> }
      {props.account === props.owner && <Button 
        variant="contained" 
        size="small" 
        sx={{fontFamily: 'Alegreya Sans SC', fontSize: '.7rem'}}
        onClick={cancelHandler}
        style={{borderColor: 'black', color: 'crimson', borderRadius: 10, backgroundColor: 'aqua', width: '45%'}}>
          cancel
      </Button> }
      {false && <Button 
        variant="contained" 
        size="small" 
        sx={{fontFamily: 'Alegreya Sans SC', fontSize: '.7rem'}}
        onClick={updateHandler}
        style={{borderColor: 'black', color: 'black', borderRadius: 10, backgroundColor: 'aqua', width: '45%'}}>
          update
      </Button> }
      <Box p={.5} style={{border: '2px solid darkred', borderRadius: 10, backgroundColor: 'cyan'}}>
        <Stack direction="row"  spacing={1}   > 
          <img src={bloodToken} alt="bloodToken" height={24}/>
            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'darkred'}} >
              {Number(props.price).toLocaleString()} 
            </Typography>                 
        </Stack>
      </Box>  
    </Stack> 
    </Container>
    </Box>
  
  )
}
