import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { CardActionArea, Box, Stack, ButtonGroup, Button } from '@mui/material';
import {getUGNft, getUGMigration2} from '../utils.js';
import { useState, useEffect, useContext } from 'react';
import ProviderContext from '../context/provider-context';
import ErrorModal from './ui/ErrorModal';
import './forgeCard.css';
/* global BigInt */

export default function ForgeCard(props) {
  const prv = useContext(ProviderContext);
  const [ownedForgeIds, setOwnedForgeIds] = useState([]);
  const [isApproved, setIsApproved] = useState();
  const [error, setError] = useState();
  const ugNftContract = getUGNft();
  const ugMigration2Contract = getUGMigration2();

  const getForges = async() => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });   
    const forges = await ugNftContract.getNftIDsForUser(accounts[0], 4);
    setOwnedForgeIds(forges);
    const approved = await ugNftContract.isApprovedForAll(accounts[0], ugMigration2Contract.address);
    setIsApproved(approved);
  }

  const approveHandler = async() => {       
    const signedContract =  ugNftContract.connect(prv.provider.getSigner());
    await signedContract.functions.setApprovalForAll(ugMigration2Contract.address, true) ;      
    return;      
  }

  const v2FixAllHandler = async() => {    
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }); 
    const forgeIds = await ugNftContract.getNftIDsForUser(accounts[0], 4);
    if(forgeIds.length < 1){
      setError({
        title: 'No Forges to Fix',
        message: '',
      });
      return;
    }
    console.log(forgeIds);
    const signedContract =  ugMigration2Contract.connect(prv.provider.getSigner());
    const receipt = await signedContract.functions.migrateV2ForgeFightClubs(forgeIds, false) ;
    
    return;
    
  }

  const errorHandler = () => {
    setError(null);
  }

  useEffect(() => {     
    const init = async() => {  
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });   
      const forges = await ugNftContract.getNftIDsForUser(accounts[0], 4);
      setOwnedForgeIds(forges);
    
      const timer = setInterval(() => {
       getForges();
        
      }, 5000);

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
    {ownedForgeIds && <Box className="forge-bordr"  sx={{ p:1, maxHeight: 450, maxWidth: 300}}>
        <Typography var="h2" align="center" sx={{fontFamily: 'Alegreya Sans SC',  p:0, color: 'gold', fontSize:'1rem' }}>Your v2 Forges to fix</Typography>
        { ownedForgeIds.length < 1 &&<Typography var="h2" align="center" sx={{fontFamily: 'Alegreya Sans SC',  p:0, color: 'palegreen', fontSize:'1rem' }}>No Forges to Fix</Typography>}
        <ImageList sx={{ p:1,width: 290, maxHeight: 400}} cols={2} rowHeight={150} children="props">
        { ownedForgeIds.map((id) => (
          <ImageListItem key={id} p={1}>
            <Card raised= {true} className="forge-bordr" sx={{ maxWidth: 345 }}>
              <CardActionArea >
              
                <CardMedia
                    component="img"
                    image="https://the-u.club/reveal/forge/1.png"
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
    { ownedForgeIds.length > 0 && <ButtonGroup variant="contained" color="error" sx={{ borderColor: 'red', border: 3  }}>
          {isApproved &&<Button  variant="contained"  sx={{backgroundColor: 'black', color: 'red'}} onClick={v2FixAllHandler} >V2 Fix All</Button>}
          {!isApproved &&<Button  variant="contained"  sx={{backgroundColor: 'black', color: 'red'}} onClick={approveHandler} >Approve </Button>}
        </ButtonGroup>}
      </Stack>
    
        </Box>}
        </div>

    
  );
}
