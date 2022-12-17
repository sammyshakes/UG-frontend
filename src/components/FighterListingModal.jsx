import {useEffect, useState} from 'react';
import {  getUGMarket, getEthers} from '../utils.js';
import FighterListingCard from './FighterListingCard';
import './fighterModal.css'
import Modal from './Modal'
import {Box, Card , Container, Stack, ImageList, ImageListItem, Typography, Button} from '@mui/material';
/* global BigInt */
const FighterListingModal = (props) => {
    const [fighterListings, setFighterListings] = useState([]);
    
    const ugMarketContract = getUGMarket();

    const [error, setError] = useState();  
    const provider = getEthers(); 
    
    
    const cancelListingHandler = () => {
    
        props.hideModal();   
    }

    const listHandler = async() => {
        const amounts = fighterListings.map(listing => {return 1});
        const ids = fighterListings.map(listing => {return  listing.id});
        const prices = fighterListings.map(listing => {return  listing.price});

        const signedContract =  ugMarketContract.connect(provider.getSigner());
        const receipt = await signedContract.functions.addListings(props.tokenAddress, ids, amounts, prices) ;
        
        props.hideModal();   
    }

    const fighterListingCollector = (newFighter) => {  

        setFighterListings((prev) => {
          return prev.filter(fighter => fighter.id !== newFighter.id)
        });
    
        setFighterListings((prevState) => {
          if (newFighter.id >0){
            const _newFighter = {
              id: newFighter.id,
              price: newFighter.price,
            }          
          return [...prevState, _newFighter];
          }
        })      
    
      }

      const cancelFighterListing = (newFighter) => {  

        setFighterListings((prev) => {
          return prev.filter(fighter => fighter.id !== newFighter.id)
        });

    
      }

    
    useEffect(() => {     
        const init = async() => {    
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });  
           
        }
        init();
        // eslint-disable-next-line
      }, []);   

  return (
    
    <Modal>
         <ImageList  cols={1} rowHeight={110}  >
      {props.fighters?.map((fy, i) => (
        <ImageListItem key={fy.imageId}>
            <FighterListingCard  
                id={props.fighterIds[i]}
                brutality= {fy.brutality}
                courage={fy.courage}
                cunning={fy.cunning}
                scars={fy.scars}
                level={fy.level}
                rank={fy.rank}
                knuckles={fy.knuckles}
                chains={fy.chains}
                butterfly={fy.butterfly}
                machete={fy.machete}
                katana={fy.katana}
                isFighter={fy.isFighter}
                imageId={fy.imageId}
                lastRaidTime={fy.lastRaidTime}
                onSetListing={fighterListingCollector}
                onCancelListing={cancelFighterListing}
            />
         
        </ImageListItem>
      ))}
    </ImageList>
    <Stack direction='row' sx={{justifyContent: 'space-between'}}>
    <Button align="right" size="large" variant = "text" sx={{fontFamily: 'Alegreya Sans SC',backgroundColor: 'red', color: 'black'}} onClick={cancelListingHandler}>Back</Button>
    <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1rem', color: 'red'}}>NOTE: 1% Listing Fee in Blood Required</Typography>
    {fighterListings.length === 0 && <Button disabled align="right" size="large" variant = "text" sx={{fontFamily: 'Alegreya Sans SC',backgroundColor: 'aqua', color: 'black'}} onClick={listHandler}>List Fighters</Button>}
                           
    {fighterListings.length > 0 && <Button align="right" size="large" variant = "text" sx={{fontFamily: 'Alegreya Sans SC',backgroundColor: 'aqua', color: 'black'}} onClick={listHandler}>List Fighters</Button>}
    </Stack>
        
    </Modal>
  )
}

export default FighterListingModal