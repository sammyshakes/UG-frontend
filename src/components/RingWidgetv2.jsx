import { Stack} from '@mui/material';
import './v1RingWidget.css'
import RingCard from './RingCard'
import React, { useEffect, useState} from 'react';
import {getUGNft2} from '../utils.js';
import ErrorModal from './ui/ErrorModal';

const RingWidgetv2 = () => {
    const [ringIds, setRingIds] = useState(undefined);
    const [error, setError] = useState();
    const ugNftContract = getUGNft2();


    const getUpdates = async() => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });       
      const ownedRingIds = await ugNftContract.getNftIDsForUser(accounts[0], 2);
      setRingIds(ownedRingIds);      
    }

    const errorHandler = () => {
      setError(null);
    }

    useEffect(() => {   
      
      const init = async() => {   
        getUpdates();
       
          const timer = setInterval(() => {
            getUpdates();
            
          }, 15000);
          return () => {
            clearInterval(timer);
          };
          
      }
      init();  
        
        // eslint-disable-next-line
      }, []);

  return (
    <div>
        {error && (
                    <ErrorModal 
                        title={error.title} 
                        message={error.message} 
                        onConfirm={errorHandler}
                    />
        )}
   <Stack direction = "row" spacing={1}  sx={{}}>
    
    {ringIds?.map(id => 
      <RingCard 
        key={id} 
        id={id} 
      />)}
       
    
    </Stack>
    </div>
   
  )
}

export default RingWidgetv2