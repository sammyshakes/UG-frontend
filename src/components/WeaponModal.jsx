import {useEffect, useState} from 'react';
import { getUGRaid4, getUGWeapons2} from '../utils.js';
import './weaponModal.css'
import Modal from './Modal';
import {Box, Card , Stack, CardMedia, CardContent, Typography, Button} from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
/* global BigInt */
const WeaponModal = (props) => {
    const [weaponBals, setWeaponBals] = useState([]);
    const [weaponIds, setWeaponIds] = useState([]);
    const ugWeaponsContract = getUGWeapons2();
    const ugRaidContract = getUGRaid4();
    const [error, setError] = useState();
    const [alreadyInQueue, setAlreadyInQueue] = useState(undefined);

    const getUpdates = async() => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        //get all ids   
        const weaponIds = [...Array(30).keys()].map( x => ++x);
  
        const addyArray = weaponIds.map((id, i ) => {
          return accounts[0];
        })
  
        const _balances = await ugWeaponsContract.balanceOfBatch(addyArray, weaponIds);
        const balances = _balances?.map(id => { return Number(id); })
       
        setWeaponBals(balances);
        setWeaponIds(weaponIds);     
      }
    
    
    const preEquipHandler = (event) => {
        event.preventDefault();
        props.collectTicket({
            id: props.raider.id, 
            weaponId: event.target.value,
            imageUrl: props.raider.imageUrl,
        });
        
        props.hideModal();       
    }

    const preUnEquipKnucksHandler = (event) => {
        event.preventDefault();
        props.collectTicket({
            id: props.raider.id, 
            weaponId: 1,
            imageUrl: props.raider.imageUrl,
        });
        
        props.hideModal();       
    }

    const preUnEquipChainsHandler = (event) => {
      event.preventDefault();
      props.collectTicket({
          id: props.raider.id, 
          weaponId: 2,
          imageUrl: props.raider.imageUrl,
      });
      
      props.hideModal();       
  }

  const preUnEquipButterflyHandler = (event) => {
    event.preventDefault();
    props.collectTicket({
        id: props.raider.id, 
        weaponId: 3,
        imageUrl: props.raider.imageUrl,
    });
    
    props.hideModal();       
}

const preUnEquipMacheteHandler = (event) => {
  event.preventDefault();
  props.collectTicket({
      id: props.raider.id, 
      weaponId: 4,
      imageUrl: props.raider.imageUrl,
  });
  
  props.hideModal();       
}

const preUnEquipKatanaHandler = (event) => {
  event.preventDefault();
  props.collectTicket({
      id: props.raider.id, 
      weaponId: 5,
      imageUrl: props.raider.imageUrl,
  });
  
  props.hideModal();       
}

    const cancelRaiderHandler = () => {
        props.hideModal(); 
        props.cancelRaider(props.raider.id);     
    }

    const getDurability = (score) => {
        if(score%5 != 0) {
            return "Broken";
        }
        if(score === 10) {
          return 75;
        }
        if(score === 20) {
          return 80;
        }
        if(score === 40) {
          return 85;
        }
        if(score === 60) {
          return 90;
        }
        if(score === 80) {
          return 95;
        }
        if(score === 100) {
          return 100;
        }
  
      }

    const getWeapon = (score) => {
        if(score%5 !== 0) {
            return "Broken";
        }
        if(score === 10) {
          return "Steel";
        }
        if(score === 20) {
          return "Bronze";
        }
        if(score === 40) {
          return "Gold";
        }
        if(score === 60) {
          return "Platinum";
        }
        if(score === 80) {
          return "Titanium";
        }
        if(score === 100) {
          return "Diamond";
        }
  
      }

      const getWeaponName = (id) => {
        if(id === 0 ) return;
        
        if(id%5 === 1) {
          return "Knuckles";
        }
        if(id%5 === 2) {
            return "Chains";
        }
        if(id%5 === 3) {
            return "Butterfly";
        }
        if(id%5 === 4) {
            return "Machete";
        }
        if(id%5 === 0) {
            return "Katana";
        }
  
      }

    useEffect(() => {     
        getUpdates();
        const init = async() => {    
          const alreadyInQueue = await ugRaidContract.viewIfRaiderIsInQueue(props.raider.id); 
          setAlreadyInQueue(alreadyInQueue);
            const timer = setInterval(() => {
                getUpdates();
              }, 30000);
        
              return () => {
                clearInterval(timer);
              };
           
        }
        init();
        // eslint-disable-next-line
      }, []);   

  return (
    
    <Modal>
        <Stack direction="row" spacing={2}>
            <Card raised= {true} className="card-bordr" sx={{ maxWidth: 350 }}>      
                <CardMedia
                component="img"                
                height="550"
                image={props.raider.imageUrl}
                alt="FYakuza"
                loading="lazy"
                />
                <CardContent  align="center" sx={{p: 1.5, color: 'crimson'}}>
                {props.raider.isFighter &&   
                <Stack>        
                <Stack direction="row" sx={{justifyContent: 'space-between'}}>                     
                        <Stack  align="left" spacing={1} sx={{}}>
                            <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.25rem', color: 'aqua'}}>Level: {props.raider.level}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'orange'}}>Knucks: {getWeapon(props.raider.knuckles)}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'orange'}}>ButterFly: { getWeapon(props.raider.butterfly)}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem'}}>Brutality: { props.raider.brutality}</Typography>
                            
                        </Stack>
                        <Stack align="center" spacing={1} sx={{}}>
                            <Typography variant='body2'  sx={{p: 0, fontFamily: 'Alegreya Sans SC',  fontSize:'1.25rem', color: 'aqua'}}>Fighter</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'orange'}}>Machete: {getWeapon(props.raider.machete)}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem'}}>Scars: {props.raider.scars}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem'}}>Courage: {props.raider.courage}</Typography>
                        </Stack>
                        <Stack align="right" spacing={1} sx={{}}>
                            <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.25rem', color: 'aqua'}}>Id: {props.raider.id}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'orange'}}>Chains: {getWeapon(props.raider.chains)}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'orange'}}>Katana: {getWeapon(props.raider.katana)}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem'}}>Cunning: {props.raider.cunning}</Typography>
                            
                        </Stack>
                        
                    </Stack>
                     </Stack>   
                        
                }
                
                {!props.raider.isFighter && <Typography gutterBottom variant="body2" component="div" sx={{fontFamily: 'Alegreya Sans SC',color: 'yellow', fontSize:'.75rem'}}>
                {`#${props.raider.id} RANK:${props.raider.rank}`}
                </Typography>}
                {!props.raider.isFighter &&   <Typography variant="body2" sx={{fontFamily: 'Alegreya Sans SC', color: 'yellow', fontSize:'.75rem'}}>
                    {"YAKUZA"}
                </Typography>}
                </CardContent>
            </Card>
            <Box className="box-bordr">
                <Stack >
                    <Typography variant='body2' align='center' sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>Available Weapons</Typography>
                    <Stack direction="row" sx={{justifyContent: 'space-between'}}>                    
                        </Stack>
                    <Box className="box20-bordr" sx={{p:1, maxHeight: 500}}>
                    
                  <ImageList sx={{p:1, maxHeight: 480}} cols={1} rowHeight={120}>
                  { !alreadyInQueue && weaponBals?.map((bal, i) => (
                        (bal > 0 && weaponIds[i] < 31) &&
                         <ImageListItem key={weaponIds[i]} p={0}>
                            <Stack direction="row" sx={{p: 1,justifyContent: 'space-between', border: 2, borderRadius: 1.5}}>
                              <Stack>
                                  <WeaponImageDealer score={getWeaponScore(weaponIds[i])} baseId={weaponIds[i]%5 > 0 ? weaponIds[i]%5 : 5}/>   
                              </Stack>  
                        <Stack spacing={0}>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'gold'}}>{getWeapon(getWeaponScore(weaponIds[i]))}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'red'}}>Attack</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'red'}}>Durability</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'red'}}>Available</Typography>
                        
                        </Stack>  
                        <Stack spacing={0}>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'gold'}}>{getWeaponName(weaponIds[i])}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'aqua'}}>{getWeaponScore(weaponIds[i])}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'aqua'}}>{getDurability(getWeaponScore(weaponIds[i]))}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'aqua'}}>{bal}</Typography>
                        
                        </Stack>                 
                        <Button  size="large"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'black', backgroundColor:'aqua'}} value={weaponIds[i]} onClick={preEquipHandler}>Equip</Button>                      
                    </Stack>
                        </ImageListItem>
                       ))}  
                    </ImageList>
                   

                    { alreadyInQueue &&
                      <Typography variant='h5'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'red'}}>Cannot Equip while Raiding</Typography>
                            
                    }
                        </Box>
                        <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'red'}}>Unequip:</Typography>
                            
                        <Stack direction="row" spacing={2}>
                                  {props.raider.knuckles > 0 && <Box onClick={preUnEquipKnucksHandler}><WeaponImageDealer score={props.raider.knuckles} baseId={1} /></Box>}   
                                  {props.raider.chains > 0 &&  <Box onClick={preUnEquipChainsHandler}><WeaponImageDealer score={props.raider.chains} baseId={2}/></Box>}   
                                  {props.raider.butterfly > 0 &&  <Box onClick={preUnEquipButterflyHandler}><WeaponImageDealer score={props.raider.butterfly} baseId={3}/></Box>}   
                                  {props.raider.machete > 0 &&  <Box onClick={preUnEquipMacheteHandler}><WeaponImageDealer score={props.raider.machete} baseId={4}/></Box>}   
                                  {props.raider.katana > 0 &&  <Box onClick={preUnEquipKatanaHandler}><WeaponImageDealer score={props.raider.katana} baseId={5}/></Box>}   
                              </Stack>  
                    
                    <Stack direction="row" sx={{pt: .5, justifyContent: 'space-between'}}>
                        <Button variant='contained' size="small"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'black', backgroundColor:'crimson'}} value={4} onClick={props.hideModal}>Back</Button>
                       <Button variant='contained' size="small"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'black', backgroundColor:'crimson'}} value={4} onClick={cancelRaiderHandler}>Cancel </Button>
                    </Stack>
                    
                    
                </Stack>                
            </Box>
        </Stack>
    </Modal>
  )
}

const getWeaponScore = (id) => {
    let metal;
    //compute metal from score
    if(id>30 ){
        return 0;
    }
    if(Math.floor((id-1)/5) === 0){
        return 10;
    }
    if(Math.floor((id-1)/5) === 1){
        return 20;
    }
    if(Math.floor((id-1)/5) === 2){
        return 40;
    }
    if(Math.floor((id-1)/5) === 3){
        return 60;
    }
    if(Math.floor((id-1)/5) === 4){
        return 80;
    }
    if(Math.floor((id-1)/5) === 5){
        return 100;
    }
    
}

const WeaponImageDealer = (props) => {  
    let baseUrl = 'https://the-u.club/reveal/weapons/';
    const brokenUrl = "broken/";
    //compute id from score and baseId
    //baseId + computed metal from score
    //baseId
    const baseId = props.baseId;
    let metal;
    //compute metal from score
    if(props.score === 10){
      metal = 0;
    }
    if(props.score === 20){
      metal = 5;
    }
    if(props.score === 40){
      metal = 10;
    }
    if(props.score === 60){
      metal = 15;
    }
    if(props.score === 80){
      metal = 20;
    }
    if(props.score === 100){
      metal = 25;
    }
    if(props.score === 11){
      baseUrl = baseUrl.concat(brokenUrl);
      metal = 30;
    }
    if(props.score === 21){
      baseUrl = baseUrl.concat(brokenUrl);
      metal = 35;
    }
    if(props.score === 41){
      baseUrl = baseUrl.concat(brokenUrl);
      metal = 40;
    }
    if(props.score === 61){
      baseUrl = baseUrl.concat(brokenUrl);
      metal = 45;
    }
    if(props.score === 81){
      baseUrl = baseUrl.concat(brokenUrl);
      metal = 50;
    }
    if(props.score === 0){
      metal = 100;
    }

    //compute weapon Id
    const weaponId = metal < 100 ? baseId + metal : 0;
    const weaponUrl = baseUrl.concat(weaponId).concat('.png');
    useEffect(() => {   
      const init = async() => {     
  
        const timer = setInterval(() => {
        }, 5000);
  
        return () => {
          clearInterval(timer);
        };
      }
      init();
      // eslint-disable-next-line
    }, []);
    if(metal < 100){
      return (
        <Box >
              <img height={80} src={weaponUrl}></img>
            </Box>
      )
    } else {
      return (
        <Box sx={{color: 'red'}}>
              None 
          </Box>
      )
    }
    
  }

export default WeaponModal