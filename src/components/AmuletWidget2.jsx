import { Stack} from '@mui/material';
import './v1RingWidget.css'
import AmuletCard from './AmuletCard'
import React, { useEffect, useState} from 'react';
import {getUGNft2} from '../utils.js';
import ErrorModal from './ui/ErrorModal';

const AmuletWidgetv2 = () => {
    const [amuletIds, setAmuletIds] = useState(undefined);
    const [error, setError] = useState();
    const ugNftContract = getUGNft2();


    const getUpdates = async() => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });       
      const ownedAmuletIds = await ugNftContract.getNftIDsForUser(accounts[0], 3);
      setAmuletIds(ownedAmuletIds);     
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
    
    {amuletIds?.map(id => 
      <AmuletCard 
        key={id} 
        id={id} 
      />)}
       
    
    </Stack>
    </div>
   
  )
}

export default AmuletWidgetv2