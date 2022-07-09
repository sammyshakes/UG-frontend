import {React, useContext, useState} from 'react';
import ProviderContext from '../context/provider-context';
import './forgeMintBox.css'
import {Box, Stack, Avatar, Typography, Button, Card, CardMedia, CardActions } from '@mui/material/';
import bloodToken from '../assets/images/coin_transp_500.png';
import {getUGGame, getEthers} from '../utils.js';

export default function ForgeMintBox() {
    const [enteredQty, setEnteredQty] = useState(undefined) ;
    const prv = useContext(ProviderContext);
    const provider = getEthers();
    const ugGameContract = getUGGame();

    const QtyChangeHandler = (event) => {
        setEnteredQty(event.target.value);
    }

    const mintHandler = async (event) => {
        event.preventDefault();
        const signedContract =  ugGameContract.connect(provider.getSigner());
        console.log(signedContract);
        await signedContract.functions.mintForges(enteredQty) ;
    }

  return (
    
        <Box className='forge-bordr'  sx={{ maxWidth: 400, width: 3/4, maxHeight: 750 }}>
        <Card  className='forge-bordr' >
      
            <CardMedia
            component="img"
            image="https://the-u.club/reveal/forge/1.png"
            alt="Steel Forge"
            />
            <Typography variant="h6" align='center' sx={{fontFamily: 'Alegreya Sans SC', backgroundColor: 'black', color: 'red' }} >MINT STEEL FORGES</Typography>
            <CardActions sx={{ backgroundColor: 'black', maxHeight: 100 }}>
                <Stack align="right" direction='row' >     
                    <Avatar className="forge2-bordr" sx={{ height: 50, width: 50 }} alt="Blood Token" src={bloodToken} />
                    
                    <Typography variant="button" align='center' sx={{fontFamily: 'Alegreya Sans SC', mx:2, color: 'aqua', fontSize: '1rem' }} > 2M Blood BURN/Forge</Typography>
                                
                        <div  className="input-group mb-3 forge1-bordr" >
                            <input type="number" min='1' step='1' onChange={QtyChangeHandler} className="form-control" placeholder="How Many?" aria-label="Qty" aria-describedby="basic-addon2" />
                            <Box className="input-group-append " >
                                <Button sx={{ color: 'red' }} onClick={mintHandler}>MINT</Button>
                            </Box>
                        </div>                
                </Stack>              
            </CardActions>
        </Card>
        </Box>
    
  );
}