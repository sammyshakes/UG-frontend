import { useEffect, useState} from 'react';
import {Container, Box, Stack, Typography, CardMedia, Button} from '@mui/material';
import bloodToken from '../../assets/images/coin_transp_500.png';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import SimpleDateTime  from 'react-simple-timestamp-to-date';
import './market.css';

const baseUrl = 'https://the-u.club/reveal/fighteryakuza/yakuza/';

export const MarketYakuzaCard = (props) => {
  const [isInCart, setIsInCart] = useState(false);
  const imageUrl = baseUrl.concat(props.imageId).concat('.png');

  const sendToCartHandler = () => {
    setIsInCart(true);
    props.onAddToCart({
      listingId: props.id,
      id: props.tokenId,
      rank: props.rank,
      imageUrl: imageUrl,
      price: props.price
    })
  }

  const cancelHandler = () => {
    props.onCancelListing({
      listingId: props.id,
      id: props.tokenId,
      rank: props.rank,
      imageUrl: imageUrl,
      price: props.price
    })
  } 

  return (
    <Box className="mkt-box">
    <Container> 
      <Stack>       
        <Stack direction="row" sx={{justifyContent: 'space-between'}}>   
          <Typography variant='h1'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'gold'}}>Yakuza: {props.tokenId}</Typography>
          <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'red'}}>Rank: {props.rank}</Typography>    
        </Stack>              
        <CardMedia
          className="img-box"
          component="img"
          height="240"
          image={imageUrl}
          alt="FYakuza"
          loading="lazy"
        />         
      </Stack>
      <Stack direction="row"  spacing={2} py={1}  sx={{ justifyContent: 'space-between' }} >  
      {props.sold && !isInCart && <Box>            
        <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'.85rem', color: 'chartreuse'}}>SOLD: <SimpleDateTime dateSeparator="/" timeSeparator=":">{Number(props.timestamp)}</SimpleDateTime></Typography>
        
        <Typography noWrap={true} width={150} variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'.75rem', color: 'cyan'}}>Seller:{props.owner}</Typography>     
      </Box>}
      {props.account !== props.owner &&  !isInCart && !props.sold && <Button 
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
