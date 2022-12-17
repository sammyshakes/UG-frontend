import {React, useContext, useState, useEffect} from 'react';
import ProviderContext from '../context/provider-context';
import './forgeMintBox.css'
import {Box, Stack, Avatar, Typography, Button, Card, CardMedia, CardActions } from '@mui/material/';
import bloodToken from '../assets/images/coin_transp_500.png';
import {getUGGame3, getBlood, getUGNft2} from '../utils.js';
import ErrorModal from './ui/ErrorModal';

const baseUrl = 'https://the-u.club/reveal/amulet/amulet_v2.png';
/* global BigInt */

export default function AmuletMintBox() {
    const [error, setError] = useState();
    const [balance, setBalance] = useState();
    const [numMinted, setNumMinted] = useState();
    const prv = useContext(ProviderContext);
    const ugGameContract = getUGGame3();
    const bloodContract = getBlood();
    const ugNftContract = getUGNft2();    


    const mintHandler = async (event) => {
        event.preventDefault();
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const bloodBalance = await bloodContract.balanceOf(accounts[0]);
        //check for forge mint to be active, check blood balance
        if(bloodBalance/(10**18) < 2000000){
            setError({
                title: 'Not Enough $BLOOD!',
                message: 'You must acquire more $BLOOD to Mint an Amulet.',
            });
            return;
        }
        const isActive = await ugGameContract.AMULET_MINT_ACTIVE();
        if(!isActive){
            setError({
                title: 'AMULET MINT NOT ACTIVE!',
                message: 'Prepare not just Body... But Also Mind and Spirit',
            });
            return;
        }

        const signedContract =  ugGameContract.connect(prv.provider.getSigner());
        const receipt = await signedContract.functions.mintAmulet() ;
        
        if(receipt.hash)  setError({
            title: `Minting an Amulet!`,
            message: 'You are on your way to building a formidable army...  Tx will complete momentarily..',
        });
        
        
    }

    const getUpdates = async() => {
        const amuletsMinted = await ugNftContract.ttlAmulets();
        setNumMinted(amuletsMinted?.toString());
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
        }, 10000);
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
        <Stack direction="row" spacing={2} justifyContent='space-around'>
            <Typography sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.25rem', color: 'red'}}>Total Minted </Typography>
            <Typography sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.25rem', color: 'gold'}}>{numMinted} </Typography>
            
            </Stack>
       
    <Stack direction = "row" spacing = {5}>
        <Box   sx={{ maxWidth: 200}}>
        <Card  className='forge-bordr' sx={{ backgroundColor: 'black', borderRadius: 5}}>
      
            <CardMedia
            component="img"
            image={baseUrl}
            alt="Mint Amulet"
            />
            <Typography variant="h6" align='center' sx={{fontFamily: 'Alegreya Sans SC', backgroundColor: 'black', color: 'red' }} >Mint Amulet</Typography>
            <CardActions sx={{ backgroundColor: 'black', maxHeight: 100 }}>
                <Stack align="right" direction='row' >     
                    <Avatar className="forge2-bordr" sx={{ height: 50, width: 50 }} alt="Blood Token" src={bloodToken} />
                    
                    <Typography  align='center' sx={{fontFamily: 'Alegreya Sans SC', mx:2, color: 'aqua', fontSize: '1rem' }} > 2M Blood/Amulet</Typography>
                                
                        
                               
                            
                                    
                </Stack>    
                         
            </CardActions>
        </Card>
        </Box>
           
        
        </Stack>  
        <Stack direction="row" sx={{justifyContent: 'center'}}>
        <Button size="large" sx={{width: 50/100, backgroundColor: 'black', color: 'red', border: 2}} onClick={mintHandler}>MINT</Button> 
        </Stack>
    </div>
    </ProviderContext.Provider>
  );
}