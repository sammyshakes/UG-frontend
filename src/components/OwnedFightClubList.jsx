import {useContext, useState, useEffect} from 'react';
import ProviderContext from '../context/provider-context';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import TransferUGNft from './TransferUGNfts'
import FightClubCard from './FightClubCard';
import Box from '@mui/material/Box';
import {Button, Stack, ButtonGroup} from '@mui/material';
import Typography from '@mui/material/Typography';
import './ownedFightClubList.css';
import {getUGRaid2, getUGRaid3, getUGNft2, getUGGame4, getUGMarket} from '../utils.js';
import ErrorModal from './ui/ErrorModal';
import ListSingleModal from './ListSingleFclubModal';
/* global BigInt */

export default function OwnedFightClubList() {
    const prv = useContext(ProviderContext);    
    const[fclubs, setFclubs] = useState([]);
    const [selectedFClubs, setSelectedFClubs] = useState([]);
    const [isApproved, setIsApproved] = useState();
    const [isApprovedMarket, setIsApprovedMarket] = useState(false);
    const [error, setError] = useState();
    const ugRaidContract = getUGRaid3();
    const ugRaid2Contract = getUGRaid2();
    const ugGameContract = getUGGame4();
    const ugNftContract = getUGNft2();
    const ugMarketContract = getUGMarket();
    const signedContract =  ugRaidContract.connect(prv.provider.getSigner());

    const getUpdates = async() => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });       
      const fclubIds = await ugNftContract.getNftIDsForUser(accounts[0],5);
      const fclubs = await ugNftContract.getForgeFightClubs(fclubIds); 
      const approved = await ugNftContract.isApprovedForAll(accounts[0], ugRaidContract.address);
      const approvedMarket = await ugNftContract.isApprovedForAll(accounts[0], ugMarketContract.address);
      setIsApprovedMarket(approvedMarket);
      setIsApproved(approved);
      setFclubs(fclubs);   
    }

    const levelHandler = async() => {
      if(selectedFClubs.length < 1){
        setError({
          title: 'Please Select a Fight Club',
          message: 'Unless your scared..',
        });
        return;
      }
      const levelUpArray = selectedFClubs.map(i => { return 1;});
      const sizeUpArray  = selectedFClubs.map(i => { return 0;});
      const signedContract =  ugGameContract.connect(prv.provider.getSigner());
      await signedContract.functions.levelUpFightClubs(selectedFClubs, levelUpArray, sizeUpArray) ;
      //reset selected FYs array
      setSelectedFClubs([]);
    }

    const sizeHandler = async() => {
      if(selectedFClubs.length < 1){
        setError({
          title: 'Please Select a Fight Club',
          message: 'Unless your scared..',
        });
        return;
      }
      const levelUpArray = selectedFClubs.map(i => { return 0;});
      const sizeUpArray  = selectedFClubs.map(i => { return 1;});
      const signedContract =  ugGameContract.connect(prv.provider.getSigner());
      await signedContract.functions.levelUpFightClubs(selectedFClubs, levelUpArray, sizeUpArray) ;
      //reset selected FYs array
      setSelectedFClubs([]);
    }

    const maintainHandler = async() => {
      if(selectedFClubs.length < 1){
        setError({
          title: 'Please Select a Fight Club',
          message: 'Unless your scared..',
        });
        return;
      }
      const levelUpArray = selectedFClubs.map(i => { return 0;});
      const sizeUpArray  = selectedFClubs.map(i => { return 0;});
      const signedContract =  ugGameContract.connect(prv.provider.getSigner());
      await signedContract.functions.levelUpFightClubs(selectedFClubs, levelUpArray, sizeUpArray) ;
      //reset selected FYs array
      setSelectedFClubs([]);
    }

    const stakeHandler = async() => {    
      if(selectedFClubs.length < 1){
      setError({
        title: 'Please Select a Fight Club',
        message: 'Unless your scared..',
      });
      return;
      }
      const Clubs = selectedFClubs?.map(fClub => {
        return fclubs?.filter(fclub => fclub.id == fClub);
      })
      const expiredClubs = Clubs?.filter(club =>   Number(club[0]?.lastLevelUpgradeTime) + 86400 * 7 < Date.now() / 1000 );
      if(expiredClubs.length > 0){
        setError({
          title: 'Expired Fight Club!',
          message: 'can only stake a maintained fight club..',
        });
        return;
        }  
        const coolDownClubs = Clubs?.filter(club =>  (Number(club[0]?.lastUnstakeTime) > 0 && Number(club[0]?.lastUnstakeTime) + 86400 * 2 > Date.now() / 1000 ));
        
        if(coolDownClubs?.length > 0){
          setError({
            title: 'Fight Club in Cool Down!',
            message: 'wait til Cool Down timer reaches 0..',
          });
          return;
          }  
      await signedContract.functions.stakeFightclubs(selectedFClubs) ;
      //reset selected FYs array
      setSelectedFClubs([]);
      return;
      
    }

    const stakeAllHandler = async() => {    
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });   
      const fclubIds = await ugNftContract.getNftIDsForUser(accounts[0],5);
      if(fclubIds.length < 1){
      setError({
        title: 'No Fight Clubs to Stake',
        message: '',
      });
      return;
    }
    const Clubs = fclubIds?.map(fClub => {
      return fclubs?.filter(fclub => fclub.id == fClub);
    })
    const expiredClubs = Clubs?.filter(club =>   Number(club[0]?.lastLevelUpgradeTime) + 86400 * 7 > Date.now() / 1000 );
    if(expiredClubs.length > 0){
      setError({
        title: 'Expired Fight Club!',
        message: 'can only stake a maintained fight club..',
      });
      return;
      }  
      const coolDownClubs = Clubs?.filter(club =>  (Number(club[0]?.lastUnstakeTime) > 0 && Number(club[0]?.lastUnstakeTime) + 86400 * 2 < Date.now() / 1000 ));
      if(coolDownClubs.length > 0){
        setError({
          title: 'Fight Club in Cool Down!',
          message: 'wait til Cool Down timer reaches 0..',
        });
        return;
        }  
      //gonna return here until staking is active      
      await signedContract.functions.stakeFightclubs(fclubIds) ;
      //reset selected FYs array
      setSelectedFClubs([]);
      return;
      
    }

    const listHandler = async(price) => {
      if(selectedFClubs.length > 1){
        setError({
          title: 'Please Select only one',
          message: '',
        });
        return;
        }
      if(Number(price) < 1){
        setError({
            title: 'must enter Listing Price',
            message: '',
        });
        return;
    }
      const signedContract =  ugMarketContract.connect(prv.provider.getSigner());
      await signedContract.functions.addListings(ugNftContract.address, selectedFClubs, [1], [price] );
    }

    const approveHandler = async() => {       
      const signedContract =  ugNftContract.connect(prv.provider.getSigner());
      await signedContract.functions.setApprovalForAll(ugRaidContract.address, true) ;      
      return;      
    }

    const approveMarketHandler = async() => {
      const signedContract =  ugNftContract.connect(prv.provider.getSigner());
      await signedContract.functions.setApprovalForAll(ugMarketContract.address, true) ;      
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
              
            }, 10000);
            return () => {
              clearInterval(timer);
            };
           
        }
        init();  
        
        // eslint-disable-next-line
      }, []);
    
  return (
    
       
    <Box >
    {error && (
                    <ErrorModal 
                        title={error.title} 
                        message={error.message} 
                        onConfirm={errorHandler}
                    />
        )}
  
    {fclubs.length > 0 && <Box className="forge-bordr" mb={5} p={1} maxWidth={{sm: 770, md: 770}} maxHeight={{sm: 700, md: 700}}>
    
        <Typography variant="h4" align="center" sx={{fontFamily: 'Alegreya Sans SC',  p:0, color: 'red' }}>
            Wallet Fight Clubs
        </Typography>
      <ImageList sx={{p:1, maxWidth: 750, maxHeight: 500, minWidth: 360}} cols={2} rowHeight={400} >
        {fclubs?.map((fclub) => (
          <ImageListItem key={fclub.id}  >
            <FightClubCard 
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
      <Stack direction="row"  maxwidth={'large'} sx={{ justifyContent: 'center' }}>
        <ButtonGroup variant="contained" color="error" sx={{ borderColor: 'red', border: 3  }}>
         
         
          <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={sizeHandler} >size up </Button>
          <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={levelHandler} >level up </Button>    
             
          <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={maintainHandler} >maintain </Button>
         
         
          {isApproved &&<Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={stakeHandler} >stake </Button>}
          {isApproved &&<Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={stakeAllHandler} >stake all</Button>}
         
          {!isApproved &&<Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={approveHandler} >approve staking </Button>}
          {!isApprovedMarket &&<Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={approveMarketHandler} >approve market </Button>}
          {isApprovedMarket &&  <ListSingleModal tokenAddress={ugNftContract.address} id={selectedFClubs[0]} onList={listHandler}/>}
        
          <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={UnselectHandler} >unselect </Button>
        </ButtonGroup>
      </Stack>
      <TransferUGNft ids={selectedFClubs}/>
    </Box>}
    </Box>
        
  );
}
