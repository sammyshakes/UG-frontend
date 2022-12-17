import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { CardActionArea, Box, Stack, ButtonGroup, Button } from '@mui/material';
import {getUGNft2, getUGForgeSmith3, getEthers } from '../utils.js';
import { useState, useEffect, useContext} from 'react';
import ProviderContext from '../context/provider-context';
import ErrorModal from './ui/ErrorModal';
import './forgeCard.css';
const baseUrl ="https://the-u.club/reveal/forge/";

/* global BigInt */

export default function ForgeCard() {
  const prv = useContext(ProviderContext);
  const [ownedForgeIds, setOwnedForgeIds] = useState([]);
  const [ownedForges, setOwnedForges] = useState([]);
  const [isApproved, setIsApproved] = useState([]);
  const [error, setError] = useState();
  const ugNftContract = getUGNft2();
  const ugForgeSmithContract = getUGForgeSmith3();
  const provider = getEthers();
  

  const getUpdates = async() => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });   
    const forgeIds = await ugNftContract.getNftIDsForUser(accounts[0], 4);
    setOwnedForgeIds(forgeIds);

    const forges = await ugNftContract.getForgeFightClubs(forgeIds);
    setOwnedForges(forges);

    const approved = await ugNftContract.isApprovedForAll(accounts[0], ugForgeSmithContract.address);
    setIsApproved(approved);
  }

  const approveHandler = async() => {   
    const signedContract =  ugNftContract.connect(provider.getSigner());
    await signedContract.functions.setApprovalForAll(ugForgeSmithContract.address, true) ;      
    return;      
  }

  const stakeAllHandler = async() => {    
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });   
    const forgeIds = await ugNftContract.getNftIDsForUser(accounts[0],4);
    if(forgeIds.length < 1){
    setError({
      title: 'No Forges to Stake',
      message: '',
    });
    return;
    } 
    console.log(ugForgeSmithContract);
    const signedContract =  ugForgeSmithContract.connect(provider.getSigner());
    await signedContract.functions.stakeForges(forgeIds) ;
    
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
    {ownedForgeIds.length > 0 && <Box className="forge-bordr"  sx={{ p:1, maxHeight: 600}}>
        <Typography var="h2" align="center" sx={{fontFamily: 'Alegreya Sans SC',  p:0, color: 'raquad' }}>Your Forges</Typography>
        <ImageList sx={{ p:1,width: 290, maxHeight: 450}} cols={2} rowHeight={150} children="props">
        { ownedForges?.map((forge) => (
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
          {isApproved &&<Button  variant="contained"  sx={{backgroundColor: 'black', color: 'red'}} onClick={stakeAllHandler} >Stake All</Button>}
          {!isApproved &&<Button  variant="contained"  sx={{backgroundColor: 'black', color: 'red'}} onClick={approveHandler} >Approve </Button>}
        </ButtonGroup>
      </Stack>
    
        </Box>}
        </div>

    
  );
}
