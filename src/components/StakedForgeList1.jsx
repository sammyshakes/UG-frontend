import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { CardActionArea, Box, Stack, ButtonGroup, Button } from '@mui/material';
import {getUGNft2, getUGForgeSmith2, getEthers } from '../utils.js';
import { useState, useEffect, useContext} from 'react';
import ProviderContext from '../context/provider-context';
import ErrorModal from './ui/ErrorModal';
import './forgeCard.css';
const baseUrl ="https://the-u.club/reveal/forge/";

/* global BigInt */

export default function StakedForgeList() {
  const prv = useContext(ProviderContext);
  const [stakedForgeIds, setStakedForgeIds] = useState([]);
  const [stakedForges, setStakedForges] = useState([]);
  const [isApproved, setIsApproved] = useState([]);
  const [error, setError] = useState();
  const ugNftContract = getUGNft2();
  const ugForgeSmithContract = getUGForgeSmith2();
  const provider = getEthers();
  

  const getUpdates = async() => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });   
    const forgeIds = await ugForgeSmithContract.getStakedForgeIDsForUser(accounts[0]);
    setStakedForgeIds(forgeIds);

    const forges = await ugNftContract.getForgeFightClubs(forgeIds);
    setStakedForges(forges);

  }

 

  const unstakeAllHandler = async() => {    
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });   
    const forgeIds = await ugForgeSmithContract.getStakedForgeIDsForUser(accounts[0]);
    if(forgeIds.length < 1){
    setError({
      title: 'No Forges to unstake',
      message: '',
    });
    return;
    } 
    const signedContract =  ugForgeSmithContract.connect(provider.getSigner());
    await signedContract.functions.unstakeForges(forgeIds) ;
    
    return;
    
  }

  const errorHandler = () => {
    setError(null);
  }


  useEffect(() => {     
    getUpdates();      
    
    const timer = setInterval(() => {
      getUpdates();
      
    }, 15000);

    return () => {
      clearInterval(timer);
    };

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
    {stakedForgeIds && <Box className="forge-bordr"  sx={{ p:1, maxHeight: 600}}>
        <Typography var="h2" align="center" sx={{fontFamily: 'Alegreya Sans SC',  p:0, color: 'raquad' }}>Your Staked Forges</Typography>
        <ImageList sx={{ p:1,width: 290, maxHeight: 450}} cols={2} rowHeight={150} children="props">
        { stakedForges?.map((forge) => (
          <ImageListItem key={forge.id} p={1}>
            <Card raised= {true} className="forge-bordr" sx={{ maxWidth: 345 }}>
              <CardActionArea >
              
                <CardMedia
                    component="img"
                    image= {`${baseUrl + forge.size}.png`}
                    alt="Steel Forge"
                    />
                <CardContent  align="center" sx={{p: 0,color: 'red'}}>
             
                
                </CardContent>
              </CardActionArea>
            </Card>
          </ImageListItem>
        ))}
         
    </ImageList>
    <Stack direction="row"  maxwidth={'md'} sx={{ justifyContent: 'center' }}>
        <ButtonGroup variant="contained" color="error" sx={{ borderColor: 'red', border: 3  }}>
          {isApproved &&<Button  variant="contained"  sx={{backgroundColor: 'black', color: 'red'}} onClick={unstakeAllHandler} >Unstake All</Button>}
        </ButtonGroup>
      </Stack>
    
        </Box>}
        </div>

    
  );
}
