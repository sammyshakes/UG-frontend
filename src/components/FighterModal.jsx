import {useEffect, useState} from 'react';
import { getUGRaid3, getUGWeapons2} from '../utils.js';
import './fighterModal.css'
import Modal from './Modal'
import YakFamily from './yakuzaFamily/YakFamily';
import sweatToken from '../assets/images/sweat.png';
import yamaguchi from '../assets/images/yakuza_families/Yamaguchi.png';
import sumiyoshi from '../assets/images/yakuza_families/Sumiyoshi1.png';
import inagawa from '../assets/images/yakuza_families/Inagawa.png';
import {Box, Card , Stack, CardMedia, CardContent, Typography, Button} from '@mui/material';

const FighterModal = (props) => {
    const [sizeQueues, setSizeQueues] = useState({size1: 0, size2: 0, size3: 0, size4: 0});
    const [isQueued, setIsQueued] = useState(false);
    const [sweatBalance, setSweatBalance] = useState(0);
    const ugRaidContract = getUGRaid3();
    const ugWeaponsContract = getUGWeapons2();
    const levelTier = Math.floor((props.raider.level - 1)/3 +1);
    // const baseUrl = 'https://the-u.club/reveal/fightclub/';
    // const random = Math.floor(Math.random() * (500 - 1 + 1)) + 1 + 20000;
    // const fclubUrl = baseUrl.concat(random.toString()).concat('.jpg');  
    const [enteredSweat, setEnteredSweat] = useState() ;
    const [weaponString, setWeaponString] = useState('') ;
    const [weaponEligible, setWeaponEligible] = useState(undefined) ;
    const [yakFamily, setYakFamily] = useState(undefined);
    //const [error, setError] = useState();
    const remainingSweat = Number(sweatBalance) - Number(props.sweatBurn);

    const eligibleForWeapons = () => {
        if((props.raider.level >= 10 && (props.raider.knuckles === 0 || props.raider.knuckles%5 === 1)) ||
            (props.raider.level >= 19 && (props.raider.chains === 0 || props.raider.chains%5 === 1)) ||
            (props.raider.level >= 28 && (props.raider.butterfly === 0 || props.raider.butterfly%5 === 1)) ||
            (props.raider.level >= 40 && (props.raider.machete === 0 || props.raider.machete%5 === 1)) ||
            (props.raider.level >= 52 && (props.raider.katana === 0 || props.raider.katana%5 === 1)) 
          ){
            setWeaponEligible(false);
            getWeaponString();
          }
          else{
            setWeaponEligible(true);
          }
          
      }

    const getWeaponString = () => {
        let _weaponString = '';
        if (levelTier >= 18) {
            setWeaponString('Knuckles, Chains, Butterfly, Machete and Katana');
           return;
        }
        if (levelTier >= 14) {
            setWeaponString('Knuckles, Chains, Butterfly and Machete');
            return;
        }
        if (levelTier >= 10) {
            setWeaponString('Knuckles, Chains and Butterfly');
        }
        if (levelTier >= 7) {
            setWeaponString('Knuckles and Chains');
            return;
        }
        if (levelTier >= 4) {
            setWeaponString('Knuckles');
            return;
        }       
        
    }

    const yakFamilyHandler = (yakFam) => {
        setYakFamily(yakFam);
        console.log('yf',yakFam);
    }
    

    const SweatChangeHandler = (event) => {
        event.preventDefault();        
        setEnteredSweat(event.target.value);
    }
    
    const sendRaiderHandler = (event) => {
        event.preventDefault();
        props.collectTicket({
            id: props.raider.id, 
            size: event.target.value,
            yakFamily: yakFamily === undefined ? props.raider.id % 3 : yakFamily,
            sweat: enteredSweat,
            imageUrl: props.raider.imageUrl,
            bloodEntryFee: 3* levelTier * 100 * (Number(event.target.value) +1)
        });
        setEnteredSweat(0);
        setYakFamily(undefined);
        
        props.hideModal();       
    }
    const cancelRaiderHandler = () => {
        props.hideModal(); 
        props.cancelRaider(props.raider.id);     
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
    

    useEffect(() => {     
        const init = async() => {    
            eligibleForWeapons();
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });  
            const sweatBalance = await ugWeaponsContract.balanceOf(accounts[0], 56);         
            const size1Queue = await ugRaidContract.getRaiderQueueLength(levelTier,1);
            const size2Queue = await ugRaidContract.getRaiderQueueLength(levelTier,2);
            const size3Queue = await ugRaidContract.getRaiderQueueLength(levelTier,3);
            const size4Queue = await ugRaidContract.getRaiderQueueLength(levelTier,4);
            const isQueued = await ugRaidContract.viewIfRaiderIsInQueue(props.raider.id);
            setSizeQueues({size1: size1Queue, size2: size2Queue, size3: size3Queue, size4: size4Queue});
            setIsQueued(isQueued);
            setSweatBalance(sweatBalance);
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
                    height="500"
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
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1rem'}}>Brutality: { props.raider.brutality}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'orange'}}>Knucks: {getWeapon(props.raider.knuckles)}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'orange'}}>ButterFly: { getWeapon(props.raider.butterfly)}</Typography>
                        </Stack>
                        <Stack align="center" spacing={1} sx={{}}>
                            <Typography variant='body2'  sx={{p: 0, fontFamily: 'Alegreya Sans SC',  fontSize:'1.25rem', color: 'aqua'}}>Fighter</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1rem'}}>Courage: {props.raider.courage}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem'}}>Scars: {props.raider.scars}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'orange'}}>Machete: {getWeapon(props.raider.machete)}</Typography>
                        </Stack>
                        <Stack align="right" spacing={1} sx={{}}>
                            <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.25rem', color: 'aqua'}}>Id: {props.raider.id}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1rem'}}>Cunning: {props.raider.cunning}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'orange'}}>Chains: {getWeapon(props.raider.chains)}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'orange'}}>Katana: {getWeapon(props.raider.katana)}</Typography>
                        </Stack>
                        
                    </Stack>
                    <Typography variant='body2'  sx={{pt:1,fontFamily: 'Alegreya Sans SC',  fontSize:'1rem',color: 'deepskyblue'}}>Last Raid Time: { Math.floor((Date.now()/1000 - props.raider.lastRaidTime) / 86400)} Days Ago </Typography>
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
                    <Typography variant='body2' align='center' sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>Available Raids</Typography>
                    <Stack direction="row" sx={{justifyContent: 'space-between'}}>                    
                        <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'red'}}>Size</Typography>
                        <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'red'}}>Entry Fee</Typography>
                        <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'red'}}>Winner</Typography>
                        <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'red'}}>Full Raids</Typography>
                        <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'red'}}>Spots</Typography>
                        <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'black'}}>____</Typography>
                        <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'black'}}>Enter</Typography>
                    </Stack>
                    <Stack direction="row" sx={{justifyContent: 'space-between'}}>
                        <Stack  sx={{}}>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>{1}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>{2}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>{3}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>{4}</Typography>
                        </Stack>
                        <Stack  sx={{}}>
                            <Typography variant='body2' pl={1}  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>{3* levelTier * 200}</Typography>
                            <Typography variant='body2' pl={1}  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>{3* levelTier * 300}</Typography>
                            <Typography variant='body2' pl={1} sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>{3* levelTier * 400}</Typography>
                            <Typography variant='body2' pl={1} sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>{3* levelTier * 500}</Typography>
                        </Stack>
                        <Stack  sx={{}}>
                            <Typography variant='body2' pl={1}  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>{3* levelTier * 200 * 1.25}</Typography>
                            <Typography variant='body2' pl={1}  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>{3* levelTier * 300 * 2.5}</Typography>
                            <Typography variant='body2' pl={1} sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>{3* levelTier * 400 * 3.75}</Typography>
                            <Typography variant='body2' pl={1} sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>{3* levelTier * 500 * 5}</Typography>
                        </Stack>
                        <Stack  sx={{}}>
                            <Typography variant='body2' pl={3} sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>{Math.floor(sizeQueues.size1/5)}</Typography>
                            <Typography variant='body2' pl={3} sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>{Math.floor(sizeQueues.size2/10)}</Typography>
                            <Typography variant='body2' pl={3} sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>{Math.floor(sizeQueues.size3/15)}</Typography>
                            <Typography variant='body2' pl={3} sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>{Math.floor(sizeQueues.size4/20)}</Typography>
                        </Stack>
                        <Stack  sx={{}}>
                            <Typography variant='body2' pl={4} sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.4rem'}}>{5 - sizeQueues.size1%5}</Typography>
                            <Typography variant='body2' pl={4} sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.4rem'}}>{10 - sizeQueues.size2%10}</Typography>
                            <Typography variant='body2' pl={4} pt={.3} sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.4rem'}}>{15 - sizeQueues.size3%15}</Typography>
                            <Typography variant='body2' pl={4} pt={.3} sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.4rem'}}>{20 - sizeQueues.size4%20}</Typography>
                        </Stack>
                       
                        <Stack  spacing={.4} sx={{}}>
                            {!isQueued && weaponEligible &&  <Typography variant='body2' py={0.5} sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.1rem', color: 'red'}}>bulk only</Typography>}
                            {!isQueued && weaponEligible &&  <Button variant='contained' size="small"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'black', backgroundColor:'aqua'}} value={2} onClick={sendRaiderHandler}>Enter</Button>}
                            {!isQueued && weaponEligible &&  <Button variant='contained' size="small"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'black', backgroundColor:'aqua'}} value={3} onClick={sendRaiderHandler}>Enter</Button>}
                            {!isQueued && weaponEligible &&  <Button variant='contained' size="small"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'black', backgroundColor:'aqua'}} value={4} onClick={sendRaiderHandler}>Enter</Button>}
                            {isQueued &&  <Button variant='contained' disabled size="small"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'black', backgroundColor:'aqua'}} value={1} onClick={sendRaiderHandler}>Enter</Button>}
                            {isQueued && <Button variant='contained' disabled size="small"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'black', backgroundColor:'aqua'}} value={2} onClick={sendRaiderHandler}>Enter</Button>}
                            {isQueued &&  <Button variant='contained' disabled size="small"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'black', backgroundColor:'aqua'}} value={3} onClick={sendRaiderHandler}>Enter</Button>}
                            {isQueued &&  <Button variant='contained' disabled size="small"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'black', backgroundColor:'aqua'}} value={4} onClick={sendRaiderHandler}>Enter</Button>}
                        </Stack>
                       
                    </Stack>
                    
                    <Stack direction="row" sx={{pt: 2, justifyContent: 'space-between'}}>
                        <Button variant='contained' size="small"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'black', backgroundColor:'crimson'}} value={4} onClick={props.hideModal}>Back</Button>
                        
                        {!isQueued && !weaponEligible && <Typography variant='body2' pl={1}  sx={{fontFamily: 'Alegreya Sans SC', color: 'yellow',  fontSize:'1.1rem'}}>You Need {weaponString} To Raid</Typography>}    
                        {isQueued && <Typography variant='body2' pl={1}  sx={{fontFamily: 'Alegreya Sans SC', color: 'orange',  fontSize:'1.5rem'}}>Currently Raiding</Typography>}     
                                             
                        {!isQueued && weaponEligible && <Button variant='contained' size="small"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'black', backgroundColor:'crimson'}} value={4} onClick={cancelRaiderHandler}>Cancel Raid</Button>}
                    </Stack>
                    <Box className="sweat-box">
                        <Stack direction="row"  sx={{ justifyContent: 'space-between'}}>                           
                            <Typography variant='body2' sx={{pt:1.5, pl: 1.5, fontFamily: 'Alegreya Sans SC', color: 'orange',  fontSize:'1.25rem'}}>Burn Sweat</Typography>  
                            <Box width={50} sx={{pl: .5, ml: 2.1, borderRadius: 2, backgroundColor: 'orange'}}><img src={sweatToken} alt="sweatToken" height='50/100' />  </Box>
                            <Box width={130}  className="input-group m-1 sweat1-bordr" >
                                <input type="number" min='100' step='100' onChange={SweatChangeHandler} className="form-control"  placeholder={remainingSweat < 0 ? "Available: " + sweatBalance.toString() : "sweat: " + remainingSweat.toString()} aria-label="Qty" aria-describedby="basic-addon2" />
                           
                            </Box>  
                       </Stack>
                       </Box>
                       <YakFamily onYakFamily={yakFamilyHandler}/>
                    <Box  className="box1-bordr">
                    </Box>
                </Stack>                
            </Box>
        </Stack>
    </Modal>
  )
}

export default FighterModal