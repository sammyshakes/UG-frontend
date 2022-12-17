import React from 'react'
import {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import {Box, Stack, Typography, Button} from '@mui/material';
const baseUrl = 'https://the-u.club/reveal/fighteryakuza/';

const FighterListingCard = (props) => {
    const [enteredPrice, setEnteredPrice] = useState(undefined);
    const [listingSet, setListingSet] = useState(false);
    const [listPrice, setListPrice] = useState(false);
    const fighterString = props.isFighter ? "fighter/" : "yakuza/";
    const imageUrl = baseUrl.concat(fighterString).concat(props.imageId).concat('.png');

    const enteredPriceHandler = (event) => {
        event.preventDefault();        
        setEnteredPrice(event.target.value);
    }


    const getWeapon = (score) => {
        console.log(props.knuckles);
        if(score === 0) {
            return "None";
        }
        if(score%5 === 1) {
            return "Broken";
        }
        if(score === 10) {
            return "Steel";
        }
        if(score === 20) {
            return "Bronze";
        }
        if(score === 40) {
            return "Gold";
        }
        if(score === 60) {
            return "Platinum";
        }
        if(score === 80) {
            return "Titanium";
        }
        if(score === 100) {
            return "Diamond";
        }
    }

    const setListingHandler = () => {
        setListingSet(true);
        setListPrice(enteredPrice);
        props.onSetListing({
            id: props.id,
            price: enteredPrice
        })

    }

    const cancelListingHandler = () => {
        setListingSet(false);
        setListPrice(undefined);
        props.onCancelListing({
            id: props.id
        })

    }

  return (
    <Box sx={{backgroundColor:'black', borderRadius: 10}}>
        <Stack direction='row'>
            <Box>
                <img src={imageUrl} alt = "fighter" height={100} />
            </Box>
                <Stack direction="row" spacing={1} sx={{justifyContent: 'space-between'}}>                     
                        <Stack p={1} align="left" spacing={1} sx={{}}>
                            {props.isFighter && <Typography variant='body2'  sx={{ fontFamily: 'Alegreya Sans SC',  color: 'red'}}>Fighter</Typography>}
                            {!props.isFighter && <Typography variant='body2'  sx={{ fontFamily: 'Alegreya Sans SC',  color: 'yellow'}}>Yakuza</Typography>}
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  color: 'red'}}>Id: {props.id}</Typography>
                            {props.isFighter && <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  color: 'aqua'}}>Level: {props.level}</Typography>}
                            {!props.isFighter && <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  color: 'aqua'}}>Rank: {props.rank}</Typography>}
                        </Stack>
                        {props.isFighter && <Stack p={1} align="left" spacing={1} sx={{}}>
                            
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  color: 'orange'}}>Brutality: { props.brutality}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  color: 'orange'}}>Courage: {props.courage}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  color: 'orange'}}>Cunning: {props.cunning}</Typography>
                            
                        </Stack>}
                        {!props.isFighter && <Stack p={1} align="left" spacing={1} sx={{}}>
                            
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  color: 'black'}}>Brutality: 100</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  color: 'black'}}>Courage: 100</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  color: 'black'}}>Cunning: 100</Typography>
                            
                        </Stack>}
                        {props.isFighter && <Stack p={1} align="left" spacing={1} sx={{}}>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  color: 'red'}}>Scars: {props.scars}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  color: 'deepskyblue'}}>Knucks: {getWeapon(props.knuckles)}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  color: 'deepskyblue'}}>Chains: {getWeapon(props.chains)}</Typography>
                           </Stack>}
                        {!props.isFighter && <Stack p={1} align="left" spacing={1} sx={{}}>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  color: 'black'}}>Scars: {props.scars}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  color: 'black'}}>Knucks: Broken</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  color: 'black'}}>Chains: Broken</Typography>
                           </Stack>}
                        {props.isFighter && <Stack p={1} align="left" spacing={1} sx={{}}>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  color: 'deepskyblue'}}>ButterFly: { getWeapon(props.butterfly)}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  color: 'deepskyblue'}}>Machete: {getWeapon(props.machete)}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  color: 'deepskyblue'}}>Katana: {getWeapon(props.katana)}</Typography>
                        </Stack>}
                        {!props.isFighter && <Stack p={1} align="left" spacing={1} sx={{}}>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  color: 'black'}}>ButterFly: Broken</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  color: 'black'}}>Machete: Broken</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  color: 'black'}}>Katana: Broken</Typography>
                        </Stack>}
                       {!listingSet && <Stack sx={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                            <TextField id="outlined-basic" label="Listing Price" variant="filled" onChange={enteredPriceHandler} sx={{maxHeight: 50, backgroundColor: 'white', borderRadius: 1}}/> 
                            <Button variant="text" value={enteredPrice} onClick={setListingHandler} sx={{fontFamily: 'Alegreya Sans SC',  color: 'red'}}> Set Listing</Button>
                        </Stack>}
                        {listingSet && <Stack   >
                            <Typography sx={{pl: 3, fontFamily: 'Alegreya Sans SC', fontSize: '1rem',  color: 'chartreuse'}}>Listing Set: </Typography>
                            <Stack  direction='row' align='right' >
                                <Typography sx={{pl:3, fontFamily: 'Alegreya Sans SC', fontSize: '1.2rem',   color: 'red'}}> {Number(listPrice).toLocaleString()} Blood</Typography>
                                
                                <Button variant='text' size='small' onClick={cancelListingHandler} sx={{fontFamily: 'Alegreya Sans SC', fontSize: '.8rem',   color: 'red', justifyContent: 'flex-end'}}> x cancel</Button>
                            </Stack>
                        </Stack>}
                    </Stack>
                     
        </Stack>
             
    </Box>
  )
}

export default FighterListingCard
