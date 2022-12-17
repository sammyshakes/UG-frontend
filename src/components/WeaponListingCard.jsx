import React from 'react'
import {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import {Box, Stack, Typography, Button} from '@mui/material';
const baseUrl = 'https://the-u.club/reveal/weapons/';

const FighterListingCard = (props) => {
    const [enteredPrice, setEnteredPrice] = useState(undefined);
    const [enteredAmount, setEnteredAmount] = useState(undefined);
    const [listingSet, setListingSet] = useState(false);
    const [listPrice, setListPrice] = useState(false);
    const [listAmount, setListAmount] = useState(false);
    const imageUrl = baseUrl.concat(props.id).concat('.png');

    const enteredPriceHandler = (event) => {
        event.preventDefault();        
        setEnteredPrice(event.target.value);
    }

    const enteredAmountHandler = (event) => {
        event.preventDefault();        
        setEnteredAmount(event.target.value);
    }


    const getWeapon = () => {
        let string = "";
        //const id = props.id;
        if(Math.floor((props?.id - 1)/5) === 0) {
          string = "Steel";
        }
        if(Math.floor((props?.id - 1)/5) === 1) {
          string = "Bronze";
        }
        if(Math.floor((props?.id - 1)/5) === 2) {
          string = "Gold";
        }
        if(Math.floor((props?.id - 1)/5) === 3) {
          string = "Platinum";
        }
        if(Math.floor((props?.id - 1)/5) === 4) {
          string = "Titanium";
        }
        if(Math.floor((props?.id - 1)/5) === 5) {
          string = "Diamond";
        }
        if(props?.id%5 === 1) {
          return string?.concat(" ").concat( "Knuckles");
        }
        if(props?.id%5 === 2) {
          return string?.concat(" ").concat( "Chains");
        }
        if(props?.id%5 === 3) {
          return string?.concat(" ").concat( "Butterfly");
        }
        if(props?.id%5 === 4) {
          return string?.concat(" ").concat( "Machetes");
        }
        if(props?.id%5 === 0) {
          return string?.concat(" ").concat( "Katanas");
        }
  
      }

    const setListingHandler = (price) => {
        console.log(price);
        setListingSet(true);
        setListPrice(enteredPrice);
        setListAmount(enteredAmount);
        props.onSetListing({
            id: props.id,
            price: enteredPrice,
            amount: enteredAmount
        })

    }

    const cancelListingHandler = () => {
        setListingSet(false);
        setListPrice(undefined);
        setListAmount(undefined);
        props.onCancelListing({
            id: props.id
        })

    }

  return (
    <Box sx={{backgroundColor:'black', borderRadius: 10}}>
        <Stack direction='row' sx={{justifyContent: 'space-between'}}>
            <Box>             
                <img src={imageUrl} alt = "fighter" height={100} />
            </Box>
            <Stack>
                <Typography variant='body2' sx={{fontFamily: 'Alegreya Sans SC',  color: 'aqua', fontSize: '1.5rem'}}> {getWeapon()}</Typography>           
                <Stack direction="row" spacing={1} sx={{justifyContent: 'space-between'}}>                        
                    {!listingSet && <Stack direction="row" spacing={2} sx={{}}>
                        <TextField id="outlined-basic" label="Quantity" variant="filled" onChange={enteredAmountHandler} sx={{maxHeight: 50, backgroundColor: 'white', borderRadius: 1}}/>                          
                        <TextField id="outlined-basic" label="Listing Price" variant="filled" onChange={enteredPriceHandler} sx={{maxHeight: 50, backgroundColor: 'white', borderRadius: 1}}/>                        
                        <Button variant="text" value={enteredPrice} onClick={setListingHandler} sx={{ fontFamily: 'Alegreya Sans SC', color: 'red', fontSize: '1.2rem'}}> Set Listing</Button>
                    </Stack>}
                    {listingSet && <Stack  direction="row" spacing={2} sx={{justifyContent: 'space-between', alignItems: 'center'}}>
                        <Typography sx={{pl: 3, fontFamily: 'Alegreya Sans SC', fontSize: '2rem',  color: 'chartreuse'}}>Listing Set: </Typography>                            
                        <Typography sx={{pl:3, fontFamily: 'Alegreya Sans SC', fontSize: '1.8rem',   color: 'red'}}> {Number(listPrice).toLocaleString()} Blood</Typography>                            
                        <Typography sx={{pl:3, fontFamily: 'Alegreya Sans SC', fontSize: '1.5rem',   color: 'gold'}}>Qty: {Number(listAmount).toLocaleString()} </Typography>                            
                        <Button variant='text'  onClick={cancelListingHandler} sx={{fontFamily: 'Alegreya Sans SC', fontSize: '1.2rem',   color: 'red', justifyContent: 'flex-end'}}> x cancel</Button>
                        
                    </Stack>}
                </Stack>
            </Stack> 
        </Stack>             
    </Box>
  )
}

export default FighterListingCard
