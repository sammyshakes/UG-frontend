import {useContext, useState, useEffect} from 'react';
import ProviderContext from '../context/provider-context';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import OwnedFightClubCard from './OwnedFightClubCard';
import Box from '@mui/material/Box';
import {Button, Stack, ButtonGroup} from '@mui/material';
import Typography from '@mui/material/Typography';
import './ownedFightClubList.css';
import { getUGNft, getUGMigration2} from '../utils.js';
import ErrorModal from './ui/ErrorModal';
/* global BigInt */

export default function OwnedFightClubList() {
    const prv = useContext(ProviderContext);    
    const[fclubs, setFclubs] = useState([]);
    const [selectedFClubs, setSelectedFClubs] = useState([]);
    const [isApproved, setIsApproved] = useState();
    const [error, setError] = useState();
    const [numMinted, setNumMinted] = useState();
    const ugNftContract = getUGNft();
    const ugMigration2Contract = getUGMigration2();

    const getUpdates = async() => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });       
      const fclubIds = await ugNftContract.getNftIDsForUser(accounts[0],5);
      const fclubs = await ugNftContract.getForgeFightClubs(fclubIds);   
      const fightClubsMinted = await ugNftContract.ttlFightClubs(); 
      const approved = await ugNftContract.isApprovedForAll(accounts[0], ugMigration2Contract.address);
      setIsApproved(approved);
      setNumMinted(fightClubsMinted?.toString());
      setFclubs(fclubs);   
    }

    const v2FixHandler = async() => {    
      if(selectedFClubs.length < 1){
      setError({
        title: 'Please Select a Fight Club',
        message: '',
      });
      return;
    }
      const signedContract =  ugMigration2Contract.connect(prv.provider.getSigner());
      //gonna return here until staking is active   
      console.log('sf',selectedFClubs)   ;
      await signedContract.functions.migrateV2ForgeFightClubs(selectedFClubs, true) ;
      //reset selected FYs array
      setSelectedFClubs([]);
      return;
      
    }

    const v2FixAllHandler = async() => {    
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }); 
      const fclubIds = await ugNftContract.getNftIDsForUser(accounts[0], 5);
      if(fclubIds.length < 1){
        setError({
          title: 'No Fight Clubs to Fix',
          message: '',
        });
        return;
      }
      console.log(fclubIds);
      const signedContract =  ugMigration2Contract.connect(prv.provider.getSigner());
      const receipt = await signedContract.functions.migrateV2ForgeFightClubs(fclubIds, true) ;
      //reset selected FYs array
      setSelectedFClubs([]);      
     
      return;
      
    }

    const approveHandler = async() => {       
      const signedContract =  ugNftContract.connect(prv.provider.getSigner());
      await signedContract.functions.setApprovalForAll(ugMigration2Contract.address, true) ;      
      return;      
    }

    // const transferHandler = async() => {
    //   const signedContract =  ugNftContract.connect(prv.provider.getSigner());
    //   await signedContract.functions.safeTransfer() ;
    //   setUnclaimed(0);
        
    // }

    const errorHandler = () => {
      setError(null);
    }

    const UnselectHandler = () => {
     //reset selected FYs array
     setSelectedFClubs([]);
    }


    const selectedFClubHandler = (selectedId, clicked) => {
      //first recreate list without them, then add if we need to
      setSelectedFClubs((prevState) => {
        return prevState.filter(id => id !== selectedId)
      });

      if(clicked){
        setSelectedFClubs((prevState) => {
          return [...prevState, selectedId];
        });
      }
    }

    useEffect(() => {   
      getUpdates();  
        const init = async() => {      
               
            const timer = setInterval(() => {
              getUpdates();
              
            }, 60000);
            return () => {
              clearInterval(timer);
            };
           
        }
        init();  
        
        // eslint-disable-next-line
      }, []);
    
  return (
    
       
    <Box height={700}>
    {error && (
                    <ErrorModal 
                        title={error.title} 
                        message={error.message} 
                        onConfirm={errorHandler}
                    />
        )}
      <Box p={2} m={1} className="fclub-bordr">
            <Stack direction="row" spacing={2} justifyContent='space-around'>
                <Typography sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.25rem', color: 'gold'}}>Wallet FightClubs Ready For v2 Fix </Typography>
            </Stack>
        </Box>
    <Box className="forge-bordr" p={1} maxWidth={400} maxHeight={{sm: 500, md: 500}} minHeight={400}>
    
        <Typography variant="h4" align="center" sx={{fontFamily: 'Alegreya Sans SC',  p:0, color: 'gold' }}>
            Fight Clubs to fix
        </Typography>
        {fclubs.length < 1 && <Typography variant="h4" align="center" sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.25rem',  p:0, color: 'palegreen' }}>
            No Fight Clubs To Fix
        </Typography>}
        {fclubs.length < 1 && <Typography variant="h4" align="center" sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.25rem',  p:0, color: 'palegreen' }}>
         Scroll Down for Forges
     </Typography>
        }

      <ImageList sx={{p:1, maxWidth: 600, maxHeight: 400}} cols={1} rowHeight={400} >
        {fclubs?.map((fclub) => (
          <ImageListItem key={fclub.id}  >
            <OwnedFightClubCard 
             id={fclub.id}
             level={fclub.level}
             size={fclub.size}
             lastLevelTime={fclub.lastLevelUpgradeTime}
             lastUnstakeTime={fclub.lastUnstakeTime}
             onSelected={selectedFClubHandler}
             emptyArray={selectedFClubs.length > 0 ? false : true} />            
          
          </ImageListItem>
        ))}
     
      </ImageList>
      <Stack direction="row"  maxwidth={'md'} sx={{ justifyContent: 'center' }}>
      {fclubs.length > 0 && <ButtonGroup variant="contained" color="error" sx={{ borderColor: 'red', border: 3  }}>
          {isApproved &&<Button  variant="contained"  sx={{backgroundColor: 'black', color: 'red'}} onClick={v2FixHandler} >V2 Fix </Button>}
          {isApproved &&<Button  variant="contained"  sx={{backgroundColor: 'black', color: 'red'}} onClick={v2FixAllHandler} >V2 Fix All</Button>}
          {!isApproved &&<Button  variant="contained"  sx={{backgroundColor: 'black', color: 'red'}} onClick={approveHandler} >Approve </Button>}
          <Button  variant="contained"  sx={{backgroundColor: 'black', color: 'red'}} onClick={UnselectHandler} >Unselect </Button>
        </ButtonGroup>}
      </Stack>
   
    </Box>
    </Box>
        
  );
}

