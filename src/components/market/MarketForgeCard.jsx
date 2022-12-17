import React from 'react'
import { useEffect, useState} from 'react';
import {Container, Box, Stack, Typography, CardMedia, Button} from '@mui/material';
import CircularProgressWithLabel from '../CircularProgressWithLabel';
import bloodToken from '../../assets/images/coin_transp_500.png';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import SimpleDateTime  from 'react-simple-timestamp-to-date';
import './market.css';

const baseUrl = 'https://the-u.club/reveal/forge/';

export const MarketForgeCard = (props) => {
  const [progressForLevel, setProgressForLevel] = useState();
  const [timeLeftForLevel, setTimeLeftForLevel] = useState();
  const [isInCart, setIsInCart] = useState(false);

  const imageUrl = baseUrl.concat(props.size).concat('.png');

  const sendToCartHandler = () => {
    setIsInCart(true);
    props.onAddToCart({
      listingId: props.id,
      id: props.tokenId,
      level: props.level,
      size: props.size,
      imageUrl: imageUrl,
      price: props.price
    })
  }

  const cancelHandler = () => {
    props.onCancelListing({
      listingId: props.id,
      id: props.tokenId,
      level: props.level,
      size: props.size,
      imageUrl: imageUrl,
      price: props.price
    })
  }

  const getUpdates = async() => {        
    const timeLeftToLevelUp = props.lastLevelUpgradeTime + 7*86400 - Date.now()/1000;
    const progressLevel = timeLeftToLevelUp > 0 ? timeLeftToLevelUp * 100 /  (7 *86400) : 0;  
   
    setProgressForLevel(progressLevel);   
    setTimeLeftForLevel(timeLeftToLevelUp);
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
    <Container className="mkt-box" >             
        <Stack  align="left" spacing={1} sx={{}}>
          <Stack direction="row"  spacing={2}  sx={{ justifyContent: 'space-between' }} > 
            <Typography variant='h1'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1rem', color: 'red'}}>FORGE: {props.tokenId}</Typography>
           
          </Stack>
          <Stack direction="row"  spacing={2}  sx={{ justifyContent: 'space-around' }} >  
            <CardMedia
              style={{width: '90%', border: '2px solid red', borderRadius: 15}}
              component="img"
              height="250"
              image={imageUrl}
              alt="FYakuza"
              loading="lazy"
            /> 
                         
          </Stack>          
      </Stack>
      <Stack direction="row"  spacing={2}  sx={{ justifyContent: 'space-around', alignItems:'baseline' }} >  
         <Typography sx={{ fontSize: '.6rem', color: 'aqua'}}>LEVEL TIME</Typography>    
                 
           <CircularProgressWithLabel  value={Math.ceil(progressForLevel)} time={timeLeftForLevel  } style={{ color: Math.ceil(progressForLevel) < 20 ? "red" : "chartreuse"}}/>             
           
            <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1rem', color: 'gold'}}>Level: {props.level}</Typography>    
            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1rem', color: 'gold'}}>Size: {props.size} </Typography>
            
            </Stack>
      <Stack direction="row"  spacing={2} py={1}  sx={{ justifyContent: 'space-between' }} >  
      {props.sold && !isInCart && <Box>            
        <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'.85rem', color: 'chartreuse'}}>SOLD: <SimpleDateTime dateSeparator="/" timeSeparator=":">{Number(props.timestamp)}</SimpleDateTime></Typography>
        
        <Typography noWrap={true} width={150} variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'.75rem', color: 'cyan'}}>Seller:{props.owner}</Typography>     
      </Box>}
      {!props.sold && props.account !== props.owner && !isInCart && <Button 
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
          in cart <DoneOutlineIcon/>
      </Button> }  
      {!props.sold && props.account === props.owner && <Button 
        variant="contained" 
        size="small" 
        sx={{fontFamily: 'Alegreya Sans SC', fontSize: '.7rem'}}
        onClick={cancelHandler}
        style={{borderColor: 'black', color: 'crimson', borderRadius: 10, backgroundColor: 'aqua', width: '45%'}}>
         cancel
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
  
  )
}
