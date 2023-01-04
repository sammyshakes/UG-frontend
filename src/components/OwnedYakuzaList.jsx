import {useContext, useState, useEffect} from 'react';
import ProviderContext from '../context/provider-context';
import FighterCard from './FighterCard'
import FighterListingModal from './FighterListingModal'
import './stakedFighterList.css';
import ErrorModal from './ui/ErrorModal';
import {Button, Stack, ButtonGroup, Typography, Box, ImageList, ImageListItem} from '@mui/material';
import {getUGGame5, getUGYakDen, getUGFYakuza, getUGMarket} from '../utils.js';
import TransferNft from './TransferNft'
const baseUrl = 'https://the-u.club/reveal/fighteryakuza/';


export default function OwnedYakuzaList() {
    const prv = useContext(ProviderContext);
    const[selectedFYs, setSelectedFYs] = useState([]);    
    const[listIds, setListIds] = useState([]);  
    const[selectedFYObjs, setSelectedFYObjs] = useState([]);
    const[ownedIds, setOwnedIds] = useState([]);    
    const[ownedFYs, setOwnedFYs] = useState([]);
    const[isApproved, setIsApproved] = useState(false);    
    const[isApprovedMarket, setIsApprovedMarket] = useState(false);
    const [fighterListingModalIsShown, setFighterListingModalIsShown] = useState(false);
    const [error, setError] = useState();
    const ugGameContract = getUGGame5();
    const ugYakDenContract = getUGYakDen();
    const ugFyakuzaContract = getUGFYakuza();
    const ugMarketContract = getUGMarket();

    const getUpdates = async() => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });       
      const approved = await ugFyakuzaContract.isApprovedForAll(accounts[0], ugYakDenContract.address);
      setIsApproved(approved);

      const approvedMarket = await ugFyakuzaContract.isApprovedForAll(accounts[0], ugMarketContract.address);
      setIsApprovedMarket(approvedMarket);
      
      const _ownedIds = await ugFyakuzaContract.walletOfOwner(accounts[0]);
      const ownedIds = _ownedIds?.map(id => { return Number(id.toString()); })
      setOwnedIds(ownedIds);
      const _ownedFYs = await ugFyakuzaContract.getFighters(ownedIds); 
    
      let ownedFYs = ownedIds?.map((id, i) => {        
        let imageUrl = !_ownedFYs[i]?.isFighter ?  "yakuza/" : "fighter/";
        imageUrl = baseUrl.concat(imageUrl.concat(_ownedFYs[i]?.imageId).concat('.png'));
        let fy = {id, imageUrl, ..._ownedFYs[i]};
        return fy;
      })
      ownedFYs = ownedFYs?.filter(fy => fy.isFighter === false);
      setOwnedFYs(ownedFYs);
    } 

    const approveHandler = async() => {
      const signedContract =  ugFyakuzaContract.connect(prv.provider.getSigner());
      await signedContract.functions.setApprovalForAll(ugYakDenContract.address, true) ;      
      return;  
    }

    const approveMarketHandler = async() => {
      const signedContract =  ugFyakuzaContract.connect(prv.provider.getSigner());
      await signedContract.functions.setApprovalForAll(ugMarketContract.address, true) ;      
      return;  
    }    

    const levelHandler = async() => {
      if(selectedFYs.length < 1){
        setError({
          title: 'Please Select a Yakuza',
          message: 'Unless your scared..',
        });
        return;
      }
      console.log('selectedFYs',selectedFYs);
      const amountArray = selectedFYs.map(i => { return 1;});
      const signedContract =  ugYakDenContract.connect(prv.provider.getSigner());
      await signedContract.functions.rankUpYakuzas(selectedFYs, amountArray, false) ;
      //reset selected FYs array
      setSelectedFYs([]);
    }

    const stakeAllHandler = async() => {      
      const signedContract =  ugYakDenContract.connect(prv.provider.getSigner());
      await signedContract.functions.stakeManyToArena(ownedIds) ;
      //reset selected FYs array
      setSelectedFYs([]);      
    }

    const stakeHandler = async() => {
      if(selectedFYs.length < 1){
        setError({
          title: 'Please Select a Yakuza',
          message: 'Unless your scared..',
        });
        return;
      }
      const signedContract =  ugYakDenContract.connect(prv.provider.getSigner());
      const receipt = await signedContract.functions.stakeManyToArena(selectedFYs) ;
      //reset selected FYs array
      setSelectedFYs([]);      
    }

    const listHandler = async() => {
      if(selectedFYs.length < 1){
        setError({
          title: 'Please Select a Yakuza',
          message: 'Unless your scared..',
        });
        return;
      }
      const _listFYs = await ugFyakuzaContract.getFighters(selectedFYs); 
      setSelectedFYObjs(_listFYs);
      setListIds(selectedFYs);
      setFighterListingModalIsShown(true);
      //reset selected FYs array
      setSelectedFYs([]);   

    }

    const UnselectHandler = () => {
     //reset selected FYs array
     setSelectedFYs([]);
    }

    const selectedFYHandler = (selectedId, clicked) => {
      //first recreate list without them, then add if we need to
      setSelectedFYs((prevState) => {
        return prevState.filter(id => id !== selectedId)
      });

      if(clicked){
        setSelectedFYs((prevState) => {
          return [...prevState, selectedId];
        });
      }
    }

    const hideFighterListingModalHandler = () => {
      setFighterListingModalIsShown(false);
    }

    const errorHandler = () => {
      setError(null);
    }

    useEffect(() => {   
      getUpdates();  
        const init = async() => {                
               
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
    {fighterListingModalIsShown && <FighterListingModal 
      fighters={selectedFYObjs} 
      fighterIds={listIds}
      hideModal={hideFighterListingModalHandler}
      tokenAddress={ugFyakuzaContract.address}
      />}
    <Box className="staked-bordr" mb={5} maxWidth={{sm: 800, md: 800}} maxHeight={{sm: 700, md: 700}}>
        <Typography variant="h4" align="center" sx={{fontFamily: 'Alegreya Sans SC', p:1, color: 'red' }}>
            Wallet Yakuza
        </Typography>
    <ImageList sx={{p:1, width: 750, height: 500 }} cols={5} rowHeight={250}  >
      {ownedFYs.map((fy) => (
        <ImageListItem key={fy.id}>
            <FighterCard  
            id={fy.id}
            brutality= {fy.brutality}
            courage={fy.courage}
            cunning={fy.cunning}
            level={fy.level}
            rank={fy.rank}
            isFighter={fy.isFighter}
            imageUrl={fy.imageUrl}
            onSelected={selectedFYHandler}
            emptyArray={selectedFYs.length > 0 ? false : true}
            />
         
        </ImageListItem>
      ))}
    </ImageList>
    
    
    <Stack direction="row"   sx={{ justifyContent: 'center' }}>
        <ButtonGroup variant="contained" color="error" sx={{ borderColor: 'red', border: 3  }}>
          {isApproved && <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={stakeHandler} >Stake </Button>}
          {isApproved && <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={stakeAllHandler} >Stake All </Button>}
          {!isApproved && <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={approveHandler} >Approve Staking </Button>}
          {isApprovedMarket && <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={listHandler} >List </Button>}
          {!isApprovedMarket && <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={approveMarketHandler} >Approve Market </Button>}
          <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={levelHandler} >Level UP </Button>
          <Button  variant="contained" size="small" sx={{backgroundColor: 'black', color: 'red'}} onClick={UnselectHandler} >Unselect </Button>
        </ButtonGroup>
      </Stack>
      <TransferNft ids={selectedFYs}/>
    </Box>
    </div>
  );
}

