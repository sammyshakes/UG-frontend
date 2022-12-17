import {useState, useEffect} from 'react';
import MergeFighterList from '../components/merge/MergeFighterList'
import {Container, Button, Stack, Typography, Box} from '@mui/material'
import { getMerge, getEthers, getUGFYakuza, getBlood } from '../utils';
import ErrorModal from '../components/ui/ErrorModal';

const Merge = () => {      
    const[ownedFYs, setOwnedFYs] = useState([]);
    const[selectedKeeper, setSelectedKeeper] = useState(undefined);  
    const[selectedBurner, setSelectedBurner] = useState(undefined);   
    const[numMerges, setNumMerges] = useState(0);  
    
    const [error, setError] = useState();
    const ugFyakuzaContract = getUGFYakuza();
    
    const bloodContract = getBlood();
    const mergeContract = getMerge(); 
    const provider = getEthers(); 
    const baseUrl = 'https://the-u.club/reveal/fighteryakuza/fighter/';
    
    const keeperHandler = (fy) => {
        console.log(fy);
        if(selectedBurner !== undefined && fy?.id === selectedBurner?.id){
            setError({
              title: 'Cannot choose same Fighter',
              message: 'Cancel and choose another..',
            });
            
            return;
        }
        setSelectedKeeper(fy);
    }

    const burnerHandler = (fy) => {
        if(selectedKeeper !== undefined && fy?.id === selectedKeeper?.id){
            setError({
              title: 'Cannot choose same Fighter',
              message: 'Cancel and choose another..',
            });
            
            return;
        }
        setSelectedBurner(fy);
    }

    const mergeHandler = async() => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const balance = await bloodContract?.balanceOf(accounts[0]);
      const mergePrice = await mergeContract?.mergePrice();
      if(balance/(10**18) < Number(mergePrice) ){
        setError({
          title: 'Not enough Blood',
          message: 'You must acquire some..',
        });
        
        return;
    }
        const array = [selectedKeeper.id, selectedBurner.id];
        const signedContract =  mergeContract.connect(provider.getSigner());
        await signedContract.mergeFighters(array);

        setSelectedBurner(undefined);
        setSelectedKeeper(undefined);
        setError({
            title: 'Fighters merging...',
            message: 'Screen will update momentarily..',
          });
    }

    const getUpdates = async() => {
        //get owned fighter ids
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });       
        const _ownedIds = await ugFyakuzaContract.walletOfOwner(accounts[0]);
        const ownedIds = _ownedIds?.map(id => { return Number(id.toString()); });
        const _ownedFYs = await ugFyakuzaContract.getFighters(ownedIds); 
        const ownedFys = ownedIds?.map((id, i) => {        
          const imageUrl = baseUrl.concat(_ownedFYs[i]?.imageId).concat('.png');
          let fy = {id, imageUrl, ..._ownedFYs[i]};
          return fy;
        })

        const filteredList = ownedFys?.filter(fy => (fy.isFighter === true));
        //console.log(filteredList?.length);           
        setOwnedFYs([...filteredList]);

        const numMerges = await mergeContract.getGraveyardLength();
        setNumMerges(Number(numMerges));
        
    } 

    const errorHandler = () => {
        setError(null);
    }


    useEffect(() => {     
       
        const init = async() => {     
          getUpdates(); 

          const timer = setInterval(() => {
            getUpdates();
            
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
    <Container className="forge-bordr h1" align="center" sx={{color: 'red',  fontSize: '4rem' }} >
      <Stack direction="row"  sx={{justifyContent: 'space-evenly'}}>
        UG Fighter Merge
        
        <Typography variant='body2'  sx={{p: 1.5,fontFamily: 'Alegreya Sans SC', color: 'cyan',  fontSize: '1.5rem'}}>Total Merges: {numMerges}</Typography>
      </Stack>
    </Container>
    {ownedFYs?.length > 0 && <Stack direction="row" pt={2} spacing={4} sx={{justifyContent: 'space-evenly' }}>
        <MergeFighterList fys={ownedFYs} isKeeper={true} onSet={keeperHandler}/>
        <MergeFighterList fys={ownedFYs} isKeeper={false} onSet={burnerHandler}/>
        {selectedKeeper && selectedBurner && <Box sx={{p:2, pt:20, alignContents: 'center', maxWidth: 1/3}}>
            
            <Typography variant='body2' align="center"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'red'}}>Merge Price: $250,000 BLOOD</Typography>
            <Typography variant='body2' align="center"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'peachpuff'}}>NEW FIGHTER WILL HAVE:</Typography>
            
            <Typography variant='body2' align="center" sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.1rem', color: 'chartreuse'}}>Brutality: {selectedKeeper.brutality > selectedBurner.brutality ? selectedKeeper.brutality : selectedBurner.brutality} </Typography>
            <Typography variant='body2' align="center"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.1rem', color: 'chartreuse'}}>Courage: {selectedKeeper.courage > selectedBurner.courage ? selectedKeeper.courage : selectedBurner.courage} </Typography>
            <Typography variant='body2' align="center"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.1rem', color: 'chartreuse'}}>Cunning: {selectedKeeper.cunning > selectedBurner.cunning ? selectedKeeper.cunning : selectedBurner.cunning} </Typography>
            <Typography variant='body2' align="center"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.1rem', color: 'chartreuse'}}>Scars: {selectedKeeper.scars} </Typography>
            <Typography variant='body2' align="center"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.1rem', color: 'chartreuse'}}>Level: {selectedKeeper.level} </Typography>
            <Stack direction='row' sx={{ justifyContent: 'center' }}>
          <Button  variant="text" size="large" sx={{borderColor: 'cyan' , border: 3, fontFamily: 'Alegreya Sans SC', width: 5/5, backgroundColor: 'black', color: 'cyan', fontSize: '1.5rem'}} onClick={mergeHandler} >Merge </Button>
            
        </Stack>
        <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1rem', color: 'red'}}>NOTE: Remember to unequip weapons from Burner Fighter or they will be lost.. </Typography>
          
        </Box>}
    </Stack>}
    
    </div>
  )
}

export default Merge