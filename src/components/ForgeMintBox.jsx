import {React, useContext, useState} from 'react';
import ProviderContext from '../context/provider-context';
import './forgeMintBox.css'
import {Box, Stack, Avatar, Typography, Button, Card, CardMedia, CardActions } from '@mui/material/';
import bloodToken from '../assets/images/coin_transp_500.png';
import {getUGGame3, getBlood, getUGNft2} from '../utils.js';
import ErrorModal from './ui/ErrorModal';
import ForgeCard from './ForgeCard'
import { useEffect } from 'react';
/* global BigInt */

export default function ForgeMintBox() {
    const [enteredQty, setEnteredQty] = useState() ;
    const [error, setError] = useState();
    const [balance, setBalance] = useState();
    const [numMinted, setNumMinted] = useState();
    const prv = useContext(ProviderContext);
    const ugGameContract = getUGGame3();
    const bloodContract = getBlood();
    const ugNftContract = getUGNft2();    

    const QtyChangeHandler = (event) => {
        event.preventDefault();
        setEnteredQty(event.target.value);
    }

    const mintHandler = async (event) => {
        event.preventDefault();
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const bloodBalance = await bloodContract.balanceOf(accounts[0]);
        //check for forge mint to be active, check blood balance
        if(bloodBalance/(10**18) < enteredQty * 2000000){
            setError({
                title: 'Not Enough $BLOOD!',
                message: 'You must acquire more $BLOOD to Mint a FORGE.',
            });
            return;
        }
        const isActive = await ugGameContract.FORGE_MINT_ACTIVE();
        if(!isActive){
            setError({
                title: 'FORGE MINT NOT YET ACTIVE!',
                message: 'Prepare not just Body... But Also Mind and Spirit',
            });
            return;
        }

        const signedContract =  ugGameContract.connect(prv.provider.getSigner());
        const receipt = await signedContract.functions.mintForges(enteredQty) ;
        
        if(receipt.hash)  setError({
            title: `Minting ${enteredQty} Forges!`,
            message: 'With FORGED Weapons, you are a force of nature...  Tx will complete momentarily..',
        });
        
        
    }

    const getUpdates = async() => {
        const forgesMinted = await ugNftContract.ttlForges();
        setNumMinted(forgesMinted?.toString());
    }

    const errorHandler = () => {
        setError(null);
    }

    useEffect(() => {
        getUpdates();

        const init = async() => {   
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const bloodBalance = await bloodContract.balanceOf(accounts[0]);
            setBalance(Number(bloodBalance));
            getUpdates();          
        }
        init();

        const interval = setInterval(() => {
            getUpdates();
        }, 60000);
        return () => clearInterval(interval);       
        // eslint-disable-next-line
      }, []);

  return (
    <ProviderContext.Provider value={{       
        balance: balance
    }}>
    <div>
        {error && (
                    <ErrorModal 
                        title={error.title} 
                        message={error.message} 
                        onConfirm={errorHandler}
                    />
        )}
       
    <Stack direction = "row" spacing = {5}>
        <Box className='forge-bordr'  sx={{ maxWidth: 400, maxHeight: 750 }}>
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
                            <input type="number" min='1' step='1' onChange={QtyChangeHandler}  className="form-control" placeholder="How Many?" aria-label="Qty" aria-describedby="basic-addon2" />
                            <Box className="input-group-append " >
                                <Button sx={{ color: 'red' }} onClick={mintHandler}>MINT</Button>
                            </Box>
                        </div>                
                </Stack>              
            </CardActions>
        </Card>
        </Box>
           
        </Stack>  
        
    </div>
    </ProviderContext.Provider>
  );
}