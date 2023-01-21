import {React, useContext, useState, useEffect} from 'react';
import ProviderContext from '../context/provider-context';
import './fightClubMintBox.css'
import {Box, Stack, Avatar, Typography, Button, Card, CardMedia, CardActions } from '@mui/material/';
import bloodToken from '../assets/images/coin_transp_500.png';
import {getUGGame5, getBlood, getUGNft2} from '../utils.js';
import ErrorModal from './ui/ErrorModal';
/* global BigInt */

export default function FightClubMintBox() {
    const [enteredQty, setEnteredQty] = useState() ;
    const [error, setError] = useState();
    const [balance, setBalance] = useState();
    const prv = useContext(ProviderContext);
    const ugGameContract = getUGGame5();
    const bloodContract = getBlood();
    const ugNftContract = getUGNft2();
    const baseUrl = 'https://the-u.club/reveal/fightclub/';
    const random = Math.floor(Math.random() * (500 - 1 + 1)) + 1 + 20000;
    const fclubUrl = baseUrl.concat(random.toString()).concat('.jpg');
    const [imageUrl, setImageUrl] = useState(fclubUrl);

    

    const QtyChangeHandler = (event) => {
        event.preventDefault();
        setEnteredQty(event.target.value);
    }

    const mintHandler = async (event) => {
        event.preventDefault();
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const bloodBalance = await bloodContract.balanceOf(accounts[0]);
        const walletFightClubs = await ugNftContract.getNftIDsForUser(accounts[0], 5);
        //check for forge mint to be active, check blood balance 
       
            
        const isActive = await ugGameContract.FIGHTCLUB_MINT_ACTIVE();
        console.log(isActive); 
        if(!isActive){
            setError({
                title: 'FIGHT CLUB MINT NOT YET ACTIVE!',
                message: 'Patience will be greatly rewarded... ',
            });
            return;
        }
        console.log('enteredQty', enteredQty);  
        console.log('walletFightClubs', Number(walletFightClubs.length) + Number(enteredQty));  
        if(Number(walletFightClubs.length) + Number(enteredQty) > 5){
            setError({
                title: 'Slow Down Friend.. Only 5 Allowed',
                message: 'There are other ways to gain wealth and prestige in the Underground',
            });
            return;
        }

        if(enteredQty > 5){
            setError({
                title: 'Slow Down Friend.. Only 5 Allowed',
                message: 'There are other ways to gain wealth and prestige in the Underground',
            });
            return;
        }

        if(bloodBalance/(10**18) < enteredQty * 5000000){
            setError({
                title: 'Not Enough $BLOOD!',
                message: 'You must acquire more $BLOOD to Mint a FIGHT CLUB.',
            });
            return;
        }
        const signedContract =  ugGameContract.connect(prv.provider.getSigner());
        const receipt = await signedContract.functions.mintFightClubs(enteredQty) ;
        
        if(receipt.hash)  setError({
            title: `Minting ${enteredQty} Fight Clubs!`,
            message: 'Manage your Business Wisely...  Tx will complete momentarily..',
        });
        
        
    }

    const getUpdates = async() => {
        const baseUrl = 'https://the-u.club/reveal/fightclub/';
        const random = Math.floor(Math.random() * (500 - 1 + 1)) + 1 + 20000;
        const fclubUrl = baseUrl.concat(random.toString()).concat('.jpg');
        setImageUrl(fclubUrl);
        
    }

    const errorHandler = () => {
        setError(null);
    }

    useEffect(() => {
        getUpdates();       
        const init = async() => {   
            const interval = setInterval(() => {
                getUpdates();
              }, 60000);
              return () => {
                clearInterval(interval);
              }
        }
        init();

        
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
    <Stack spacing = {5}>
        
        <Box  className='fclub-bordr' sx={{mb:4, maxWidth: 500, maxHeight: 800 }}>
        <Card   >
      
            <CardMedia
            component="img"
            image={imageUrl}
            alt="Fight Club"
            />
            <Typography variant="h6" align='center' sx={{fontFamily: 'Alegreya Sans SC', backgroundColor: 'black', color: 'aqua' }} >MINT FIGHT CLUBS (5 Max per Wallet)</Typography>
            <CardActions sx={{ backgroundColor: 'black'}}>
                <Stack  direction='row' sx={{justifyContent: 'space-around'}} >   
                <Box ml={4}>  
                    <Avatar className="fclub2-bordr" sx={{ height: 50, width: 50 }} alt="Blood Token" src={bloodToken} />
                </Box>
                    <Typography variant="button" align='center' sx={{fontFamily: 'Alegreya Sans SC', mx:2, color: 'aqua', fontSize: '1rem' }} > 8M Blood/ Fight Club</Typography>
                                
                        <Box  className="input-group my-2 fclub1-bordr" >
                            {/* <input type="number" min='1' max='5' step='1' onChange={QtyChangeHandler}  className="form-control" placeholder="How Many?" aria-label="Qty" aria-describedby="basic-addon2" /> */}
                            <input type="number" min='1' max='5' step='1' onChange={QtyChangeHandler}  className="form-control" placeholder="Mint Paused" aria-label="Qty" aria-describedby="basic-addon2" />
                            <Box className="input-group-append " >
                                <Button disabled sx={{ color: 'red' }} onClick={mintHandler}>MINT</Button>
                            </Box>
                        </Box>                
                </Stack>              
            </CardActions>
        </Card>
        </Box>
           
        </Stack>  
        
    </div>
    </ProviderContext.Provider>
  );
}