import {useEffect, useState} from 'react';
import {  getUGMarket, getEthers} from '../utils.js';
import FighterListingCard from './WeaponListingCard';
import './fighterModal.css'
import Modal from './Modal'
import {Box, Card , Container, Stack, ImageList, ImageListItem, Typography, Button} from '@mui/material';
/* global BigInt */
const WeaponListingModal = (props) => {
    const [fighterListings, setFighterListings] = useState([]);
    
    const ugMarketContract = getUGMarket();

    const [error, setError] = useState();  
    const provider = getEthers(); 
    
    
    const cancelListingHandler = () => {
    
        props.hideModal();   
    }

    const listHandler = async() => {
     
        const amounts = fighterListings.map(listing => {return  listing.amount});
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
              amount: newFighter.amount
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
         <ImageList  cols={1} rowHeight={130}  >
      {props.weaponIds?.map((id, i) => (
        <ImageListItem key= {i}>
            <FighterListingCard  
                id={id}
                onSetListing={fighterListingCollector}
                onCancelListing={cancelFighterListing}
            />
         
        </ImageListItem>
      ))}
    </ImageList>
    <Stack direction='row' sx={{justifyContent: 'space-between'}}>
    <Button align="right" variant = "text" size="large" sx={{fontFamily: 'Alegreya Sans SC', backgroundColor: 'red', color: 'black'}} onClick={cancelListingHandler}>Back</Button>
    {fighterListings.length > 0 && <Button align="right" size="large" variant = "text" sx={{fontFamily: 'Alegreya Sans SC', backgroundColor: 'aqua', color: 'black'}} onClick={listHandler}>List Weapons</Button>}
        </Stack>
    </Modal>
  )
}

export default WeaponListingModal