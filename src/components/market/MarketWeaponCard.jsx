import React from 'react'
import { useEffect, useState} from 'react';
import {Container, Box, Stack, Typography, CardMedia, Button} from '@mui/material';
import bloodToken from '../../assets/images/coin_transp_500.png';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import SimpleDateTime  from 'react-simple-timestamp-to-date';
import './market.css';

const baseUrl = 'https://the-u.club/reveal/weapons/';

export const MarketWeaponCard = (props) => {
  const [isInCart, setIsInCart] = useState(false);
  const [attackScore, setAttackScore] = useState(undefined);
  const [durability, setDurability] = useState(undefined);

  const imageUrl = baseUrl.concat(props.tokenId).concat('.png');

  const sendToCartHandler = () => {
    setIsInCart(true);
    props.onAddToCart({
      listingId: props.id,
      id: props.tokenId,
      amount: props.amount,
      imageUrl: imageUrl,
      price: props.price
    })
  }

  const cancelHandler = () => {
    props.onCancelListing({
      listingId: props.id,
      id: props.tokenId,
      amount: props.amount,
      imageUrl: imageUrl,
      price: props.price
    })
  }

  const getDurability = () => {
    //const id = props.id;
    if(Math.floor((props?.tokenId - 1)/5) === 0) {
      return(75);
    }
    if(Math.floor((props?.tokenId - 1)/5) === 1) {
      return(80);
    }
    if(Math.floor((props?.tokenId - 1)/5) === 2) {
      return(85);
    }
    if(Math.floor((props?.tokenId - 1)/5) === 3) {
      return(90);
    }
    if(Math.floor((props?.tokenId - 1)/5) === 4) {
      return(95);
    }
    if(Math.floor((props?.tokenId - 1)/5) === 5) {
      return(100);
    }
  }

  const getAttack = () => {
    //const id = props.id;
    if(Math.floor((props?.tokenId - 1)/5) === 0) {
      return(10);
    }
    if(Math.floor((props?.tokenId - 1)/5) === 1) {
      return(20);
    }
    if(Math.floor((props?.tokenId - 1)/5) === 2) {
      return(40);     
    }
    if(Math.floor((props?.tokenId - 1)/5) === 3) {
      return(60);
    }
    if(Math.floor((props?.tokenId - 1)/5) === 4) {
      return(80);
    }
    if(Math.floor((props?.tokenId - 1)/5) === 5) {
      return(100);
    }
  }

  const getWeapon = () => {
    let string = "";
    //const id = props.id;
    if(Math.floor((props?.tokenId - 1)/5) === 0) {
      string = "Steel";
    }
    if(Math.floor((props?.tokenId - 1)/5) === 1) {
      string = "Bronze";
    }
    if(Math.floor((props?.tokenId - 1)/5) === 2) {
      string = "Gold";
    }
    if(Math.floor((props?.tokenId - 1)/5) === 3) {
      string = "Platinum";
    }
    if(Math.floor((props?.tokenId - 1)/5) === 4) {
      string = "Titanium";
    }
    if(Math.floor((props?.tokenId - 1)/5) === 5) {
      string = "Diamond";
    }

    if(props?.tokenId%5 === 1) {
      return string?.concat(" ").concat( "Knuckles");
    }
    if(props?.tokenId%5 === 2) {
      return string?.concat(" ").concat( "Chains");
    }
    if(props?.tokenId%5 === 3) {
      return string?.concat(" ").concat( "Butterfly");
    }
    if(props?.tokenId%5 === 4) {
      return string?.concat(" ").concat( "Machete");
    }
    if(props?.tokenId%5 === 0) {
      return string?.concat(" ").concat( "Katana");
    }

  }

  const getUpdates = async() => {        
    
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
            <Typography variant='h1'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'gold'}}>
              Weapon:
              
            </Typography>
            <Typography variant='h1'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'gold'}}>
              Qty:
              
            </Typography>
            
           
          </Stack>
          <Stack direction="row"  spacing={2}  sx={{ justifyContent: 'space-between' }} >  
          <span>
                <Typography variant="button" align="center" sx={{fontFamily: 'Alegreya Sans SC',  p:1, color: 'deepskyblue' }}>
                  {getWeapon()}
                </Typography>
              </span> 
         
              <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1rem', color: 'red'}}> {props.amount}</Typography> 
           </Stack> 
          <Stack direction="row"  spacing={2}  sx={{ justifyContent: 'space-around' }} >  
            <img
              style={{ border: '2px solid red', borderRadius: 15}}
              height={200}
              width={150}
              src={imageUrl}
              alt="Weaopns"
            /> 
                         
          </Stack>   
          <Stack direction="row"  spacing={2}  sx={{ justifyContent: 'space-around', alignItems:'baseline' }} >           
              
              <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC', color: 'orange'}}>Attack: {getAttack()} </Typography>
              <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',   color: 'orange'}}>Durabilty: {getDurability()} </Typography>
              
              </Stack> 
                
      </Stack>
      
      <Stack direction="row"  spacing={0} py={.5}  sx={{ justifyContent: 'space-between' }} >  
      {props.sold && !isInCart && <Box>            
        <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'.75rem', color: 'chartreuse'}}>SOLD: <SimpleDateTime dateSeparator="/" timeSeparator=":">{Number(props.timestamp)}</SimpleDateTime></Typography>
        
        <Typography noWrap={true} width={130} variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'.7rem', color: 'cyan'}}>Seller:{props.owner}</Typography>     
      </Box>}
      {!props.sold && props.account !== props.owner && !isInCart && <Button 
        variant="contained" 
        size="small" 
        sx={{fontFamily: 'Alegreya Sans SC', fontSize: '.65rem'}}
        onClick={sendToCartHandler}
        style={{border: '1px solid green', color: 'black', borderRadius: 10, backgroundColor: 'aqua', width: '45%'}}>
          add cart
      </Button> }      
      {props.account !== props.owner && isInCart && <Button 
      disabled
        variant="contained" 
        size="small" 
        sx={{fontSize: '.65rem'}}
        onClick={sendToCartHandler}
        style={{borderColor: 'black', color: 'black', borderRadius: 10, backgroundColor: 'aqua', width: '45%'}}>
           cart <DoneOutlineIcon/>
      </Button> }  
      {!props.sold && props.account === props.owner && <Button 
        variant="contained" 
        size="small" 
        sx={{fontFamily: 'Alegreya Sans SC', fontSize: '.7rem'}}
        onClick={cancelHandler}
        style={{borderColor: 'black', color: 'crimson', borderRadius: 10, backgroundColor: 'aqua', width: '45%'}}>
         cancel
      </Button> } 
        <Box p={.5} style={{border: '1px solid black', borderRadius: 10, backgroundColor: 'cyan'}}>
          <Stack direction="row"  spacing={1}   > 
            <img src={bloodToken} alt="bloodToken" height={24}/>
            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'darkred'}} >
              {Number(props.price).toLocaleString()} 
            </Typography>             
          </Stack>
        </Box>  
      </Stack> 
      
      <Typography variant='body2' align="right"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.7rem', color: 'red'}}>Price Per Weapon: {Number(props.pricePer).toFixed(0)} </Typography>
    </Container>
  
  )
}
