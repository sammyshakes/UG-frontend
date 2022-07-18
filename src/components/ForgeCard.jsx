import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { CardActionArea, Box } from '@mui/material';
import {getUGNft} from '../utils.js';
import { useState, useEffect } from 'react';
import './forgeCard.css';
/* global BigInt */

export default function ForgeCard(props) {
  const [ownedForgeIds, setOwnedForgeIds] = useState([]);
  const ugNftContract = getUGNft();

  const getForges = async() => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });   
    const forges = await ugNftContract.getNftIDsForUser(accounts[0], 4);
    setOwnedForgeIds(forges);
  }

  useEffect(() => {     
    const init = async() => {  
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });   
      const forges = await ugNftContract.getNftIDsForUser(accounts[0], 4);
      setOwnedForgeIds(forges);
    
      const timer = setInterval(() => {
       getForges();
        
      }, 60000);

      return () => {
        clearInterval(timer);
      };

    }
    init();
    // eslint-disable-next-line
  }, []);


  return (
    <div>
    {ownedForgeIds && <Box className="forge-bordr"  sx={{ p:1, maxHeight: 600}}>
        <Typography var="h2" align="center" sx={{fontFamily: 'Alegreya Sans SC',  p:0, color: 'raquad' }}>Your Knuckles Level 1 Forges</Typography>
        <ImageList sx={{ p:1,width: 290, maxHeight: 500}} cols={2} rowHeight={150} children="props">
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
    
        </Box>}
        </div>

    
  );
}
