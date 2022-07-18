import {useEffect, useState} from 'react';
import { getUGRaid } from '../utils.js';
import './fighterModal.css'
import Modal from './Modal'
import {Box, Card , Container, Stack, CardMedia, CardContent, Typography, Button} from '@mui/material';
/* global BigInt */
const FighterModal = (props) => {
    const [sizeQueues, setSizeQueues] = useState({size1: 0, size2: 0, size3: 0, size4: 0});
    const [isQueued, setIsQueued] = useState(false);
    const ugRaidContract = getUGRaid();
    const levelTier = Math.floor((props.raider.level - 1)/3 +1);
    const baseUrl = 'https://the-u.club/reveal/fightclub/';
    const random = Math.floor(Math.random() * (500 - 1 + 1)) + 1 + 20000;
    const fclubUrl = baseUrl.concat(random.toString()).concat('.jpg');  
    
    const sendRaiderHandler = (event) => {
        props.collectTicket({
            id: props.raider.id, 
            size: event.target.value,
            yakFamily: 0,
            sweat: 0,
            imageUrl: props.raider.imageUrl
        });
        props.hideModal();       
    }
    const cancelRaiderHandler = () => {
        props.hideModal(); 
        props.cancelRaider(props.raider.id);     
    }

    

    useEffect(() => {     
        const init = async() => {              
            const size1Queue = await ugRaidContract.functions.getRaiderQueueLength(levelTier,1);
            const size2Queue = await ugRaidContract.functions.getRaiderQueueLength(levelTier,2);
            const size3Queue = await ugRaidContract.functions.getRaiderQueueLength(levelTier,3);
            const size4Queue = await ugRaidContract.functions.getRaiderQueueLength(levelTier,4);
            const isQueued = await ugRaidContract.functions.viewIfRaiderIsInQueue(props.raider.id);
            setSizeQueues({size1: size1Queue[0], size2: size2Queue[0], size3: size3Queue[0], size4: size4Queue[0]});
            setIsQueued(isQueued[0]);
            console.log(isQueued);
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
                <Stack direction="row" sx={{justifyContent: 'space-between'}}>                     
                        <Stack  align="left" spacing={1} sx={{}}>
                            <Typography variant='body2'  sx={{p: 1,fontFamily: 'Alegreya Sans SC',  fontSize:'1.25rem', color: 'aqua'}}>Level: {props.raider.level}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1rem'}}>Brutality: { props.raider.brutality}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1rem'}}>Scars: {props.raider.chains}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1rem'}}>ButterFly: { props.raider.switchblade}</Typography>
                        </Stack>
                        <Stack align="center" spacing={1} sx={{}}>
                            <Typography variant='body2'  sx={{p: 1, fontFamily: 'Alegreya Sans SC',  fontSize:'1.25rem', color: 'aqua'}}>Fighter</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1rem'}}>Courage: {props.raider.courage}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1rem'}}>Knuckles: {props.raider.knuckles}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1rem'}}>Machete: {props.raider.machete}</Typography>
                        </Stack>
                        <Stack align="right" spacing={1} sx={{}}>
                            <Typography variant='body2'  sx={{p: 1,fontFamily: 'Alegreya Sans SC',  fontSize:'1.25rem', color: 'aqua'}}>Id: {props.raider.id}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1rem'}}>Cunning: {props.raider.cunning}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1rem'}}>Chains: {props.raider.chains}</Typography>
                            <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1rem'}}>Katana: {props.raider.katana}</Typography>
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
                <Stack>
                    <Typography variant='body2' align='center' sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>Available Raids</Typography>
                    <Stack direction="row" sx={{justifyContent: 'space-between'}}>                    
                        <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'red'}}>Size Tier</Typography>
                        <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'red'}}>Entry Fee</Typography>
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
                            <Typography variant='body2' pl={5}  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>{3* levelTier * 200}</Typography>
                            <Typography variant='body2' pl={5}  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>{3* levelTier * 300}</Typography>
                            <Typography variant='body2' pl={5} sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>{3* levelTier * 400}</Typography>
                            <Typography variant='body2' pl={5} sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>{3* levelTier * 500}</Typography>
                        </Stack>
                        <Stack  sx={{}}>
                            <Typography variant='body2' pl={2} sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>{Math.floor(sizeQueues.size1/5)}</Typography>
                            <Typography variant='body2' pl={2} sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>{Math.floor(sizeQueues.size2/10)}</Typography>
                            <Typography variant='body2' pl={2} sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>{Math.floor(sizeQueues.size3/15)}</Typography>
                            <Typography variant='body2' pl={2} sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>{Math.floor(sizeQueues.size4/20)}</Typography>
                        </Stack>
                        <Stack  sx={{}}>
                            <Typography variant='body2' pl={2} sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>{5 - sizeQueues.size1%5}</Typography>
                            <Typography variant='body2' pl={2} sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>{10 - sizeQueues.size2%10}</Typography>
                            <Typography variant='body2' pl={2} sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>{15 - sizeQueues.size3%15}</Typography>
                            <Typography variant='body2' pl={2} sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem'}}>{20 - sizeQueues.size4%20}</Typography>
                        </Stack>
                       
                        <Stack  spacing={.4} sx={{}}>
                            {!isQueued && <Button variant='contained' size="small"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'black', backgroundColor:'aqua'}} value={1} onClick={sendRaiderHandler}>Enter</Button>}
                            {!isQueued && <Button variant='contained' size="small"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'black', backgroundColor:'aqua'}} value={2} onClick={sendRaiderHandler}>Enter</Button>}
                            {!isQueued && <Button variant='contained' size="small"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'black', backgroundColor:'aqua'}} value={3} onClick={sendRaiderHandler}>Enter</Button>}
                            {!isQueued && <Button variant='contained' size="small"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'black', backgroundColor:'aqua'}} value={4} onClick={sendRaiderHandler}>Enter</Button>}
                            {isQueued && <Button variant='contained' disabled size="small"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'black', backgroundColor:'aqua'}} value={1} onClick={sendRaiderHandler}>Enter</Button>}
                            {isQueued && <Button variant='contained' disabled size="small"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'black', backgroundColor:'aqua'}} value={2} onClick={sendRaiderHandler}>Enter</Button>}
                            {isQueued && <Button variant='contained' disabled size="small"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'black', backgroundColor:'aqua'}} value={3} onClick={sendRaiderHandler}>Enter</Button>}
                            {isQueued && <Button variant='contained' disabled size="small"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'black', backgroundColor:'aqua'}} value={4} onClick={sendRaiderHandler}>Enter</Button>}
                        </Stack>
                       
                    </Stack>
                    
                    <Stack direction="row" sx={{pt: 2, justifyContent: 'space-between'}}>
                        <Button variant='contained' size="small"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'black', backgroundColor:'crimson'}} value={4} onClick={props.hideModal}>Back</Button>
                        {isQueued && <Typography variant='body2' pl={1}  sx={{fontFamily: 'Alegreya Sans SC', color: 'orange',  fontSize:'1.5rem'}}>Currently Raiding</Typography>}                          
                        {!isQueued && <Button variant='contained' size="small"  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'black', backgroundColor:'crimson'}} value={4} onClick={cancelRaiderHandler}>Cancel Raid</Button>}
                    </Stack>
                    <Box  className="box1-bordr">
                        <img src={fclubUrl} alt="fightclub"  height="310vh"/>
                    </Box>
                </Stack>                
            </Box>
        </Stack>
    </Modal>
  )
}

export default FighterModal