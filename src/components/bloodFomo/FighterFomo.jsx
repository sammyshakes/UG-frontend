import {useState, useEffect} from 'react'
import yakuza1 from '../../assets/images/yakuza_1_transp_500.png';
import yakuza3 from '../../assets/images/yakuza3_transp_500.png';
import keyImage from '../../assets/images/key.png';
import keyFlippedImage from '../../assets/images/keyflipped.png';
import SimpleDateTime  from 'react-simple-timestamp-to-date';
import ErrorModal from '../ui/ErrorModal';
import {Box, Container, Button, Stack, Typography} from '@mui/material';
import {getFighterFomo, getBlood, getUGFYakuza, getEthers} from '../../utils.js';

const baseUrl = 'https://the-u.club/reveal/fighteryakuza/';

const FighterFomo = () => { 
    const [enteredQty, setEnteredQty] = useState() ;
    const [error, setError] = useState();
    const [period, setPeriod] = useState(0);
    const [imageUrl, setImageUrl] = useState('');
    const [prizeFighter, setPrizeFighter] = useState(undefined);
    
    const [prizeFighterId, setPrizeFighterId] = useState(undefined);
    const [initialKeyPrice, setInitialKeyPrice] = useState(undefined);
    const [totalTickets, setTotalTickets] = useState(undefined);
    const [ticketIncTime, setTicketIncTime] = useState();
    const [keyPriceIncrement, setKeyPriceIncrement] = useState(1000);
    const [gameNumber, setGameNumber] = useState(undefined);
    const [gamePot, setGamePot] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [fomoStartTime, setFomoStartTime] = useState(undefined);
    const [fomoEndTime, setFomoEndTime] = useState(undefined);
    const [fomoTimeLeft, setFomoTimeLeft] = useState();
    const [gameEnd, setGameEnd] = useState(undefined);
    const [fomoDuration, setFomoDuration] = useState(undefined);
    const [currentTicketPrice, setCurrentTicketPrice] = useState(undefined);
    const [currentKing, setCurrentKing] = useState(undefined);
    const [splitPoolPct, setSplitPoolPct] = useState(undefined);
    const [burnRate, setBurnRate] = useState(undefined);
    const [myKeys, setMyKeys] = useState();
    const ugFighterFomoContract = getFighterFomo();
    const bloodContract = getBlood();
    const ugFYakuzaContract = getUGFYakuza();
    const provider = getEthers();

    const QtyChangeHandler = (event) => {
        event.preventDefault();
        setEnteredQty(event.target.value);
    }

    const errorHandler = () => {
        setError(null);
    }

    const mintKeyHandler = async (event) => {
        event.preventDefault();
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const bloodBalance = await bloodContract.balanceOf(accounts[0]);
        if(bloodBalance/(10**18) < enteredQty * currentTicketPrice){
            setError({
                title: 'Not Enough $BLOOD!',
                message: 'You must acquire more $BLOOD to Buy a Key.',
            });
            return;
        }

        const signedContract =  ugFighterFomoContract.connect(provider.getSigner());
        const receipt = await signedContract.functions.buyKey(enteredQty) ;
        
        if(receipt.hash)  setError({
            title: `Bought ${enteredQty} Keys!`,
            message: `  Tx will complete momentarily..`,
            //message: `Total cost: ${enteredQty * currentTicketPrice}  Tx will complete momentarily..`,
        });
        
    }

    const getUpdates = async() => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const myKeys = await ugFighterFomoContract.keys(accounts[0]);
        const fomoStart = await ugFighterFomoContract.start();
        
        const totalTickets = await ugFighterFomoContract.totalKeys();
        const gamePot = await ugFighterFomoContract.pot();
        const fomoEnd = await ugFighterFomoContract.end();
        const gameEnd = await ugFighterFomoContract.gameEnd();
        const ticketPrice = await ugFighterFomoContract.getKeyPrice();
        const king = await ugFighterFomoContract.king();        
        const gameNum = await ugFighterFomoContract.gameNumber();

        setFomoStartTime(Number(fomoStart));
        setFomoEndTime(Number(fomoEnd));
        setGameEnd(Number(gameEnd));
        setCurrentTicketPrice(Number(ticketPrice));
        setCurrentKing(king);
        setMyKeys(myKeys);
        setGameNumber(Number(gameNum));
        setGamePot(Number(gamePot));
        setTotalTickets(Number(totalTickets));
    }

    const getTimeRemaining = async() => {   
        const gamePot = await ugFighterFomoContract.pot();
        const fomoTime = await ugFighterFomoContract.fomoTime();
        const fomoStart = await ugFighterFomoContract.start();
        const fomoEnd = await ugFighterFomoContract.end();
        const gameNum = await ugFighterFomoContract.gameNumber();
        const king = await ugFighterFomoContract.king(); 
        const timeLeft = Number(fomoEnd) - Date.now()/1000 > 0 ? Math.floor(Number(fomoEnd) - Date.now()/1000) : 0;

        if(timeLeft > 0){
            const period =  Math.floor((Date.now()/1000  - Number(fomoStart)) / Number(fomoTime));
            const timeLeftTicketIncrease = Number(fomoTime) - (Date.now()/1000  - Number(fomoStart)) % Number(fomoTime) ;
            
            setTicketIncTime(timeLeftTicketIncrease);
            setPeriod(period);
            
        } else {
            setGameOver(true);
        }

        if(gameOver === true && timeLeft > 0) setGameOver(false);
        setFomoTimeLeft(Number(timeLeft));
        setGameNumber(Number(gameNum));
        setFomoEndTime(Number(fomoEnd));
        setGamePot(Number(gamePot));       
        setCurrentKing(king);
    }

    useEffect(() => {   
        setCurrentTicketPrice((prev) => {
            if(period === 0) return initialKeyPrice;
            else return prev + keyPriceIncrement;
        })
        // eslint-disable-next-line
      }, [ period]);

      useEffect(() => {   
        const init = async() => {   
          getUpdates();
        }
        init();
        // eslint-disable-next-line
      }, [fomoEndTime, gameNumber, gameOver]);

    useEffect(() => {   
        const init = async() => {   
            const prizeFighterId = await ugFighterFomoContract.prizeFighterId();
           
            let imageUrl;
            let prizeFighter = undefined;
            if(Number(prizeFighterId) > 0){
                prizeFighter = await ugFYakuzaContract.getFighter(prizeFighterId);
                imageUrl = await ugFYakuzaContract.uri(prizeFighterId);
            }
            
            const initialKeyPrice = await ugFighterFomoContract.baseTicket();
            const keyPriceIncrement = await ugFighterFomoContract.ticketIncrement();
            const splitPct = await ugFighterFomoContract.splitPoolPct();
            const fomoTime = await ugFighterFomoContract.fomoTime();
            setPrizeFighterId(prizeFighterId);
            setPrizeFighter(prizeFighter);
            setSplitPoolPct(Number(splitPct));
            setBurnRate(Number(50));
            setFomoDuration(Number(fomoTime));
            setInitialKeyPrice(Number(initialKeyPrice));
            setKeyPriceIncrement(Number(keyPriceIncrement));
            setImageUrl(imageUrl);

            getUpdates();
            getTimeRemaining();
            const timer = setInterval(() => {
                getTimeRemaining();
                
            }, 1000);
        
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
        <Container className="forge-bordr" sx={{p:2}}>
            <Typography variant='body2' align='center'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'3rem', color: 'red'}}>Fighter Fomo Game</Typography>
            <Stack direction="row" spacing={2} sx={{justifyContent: 'space-between'}}> 
            <Box>
                    <img src={yakuza1} alt='bloodToken' height={200} />
                </Box>   
                <Container className="sidebar-bordr shadw" sx={{pt:1, backgroundColor:'black'}}>
                    <Typography variant='body2' align='center'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.8rem', color: 'peachpuff'}}>Buy Keys To Become King</Typography>
                    <Typography variant='body2' align='center'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.8rem', color: 'peachpuff'}}>
                        If You Are King When                         
                        <Typography component="span" variant='body2' px={1}  sx={{ fontFamily: 'Alegreya Sans SC', color: 'crimson',  fontSize:'1.8rem'}}>   
                            Blood Timer 
                        </Typography>
                        Expires You Win!    
                    </Typography>      
                    <Typography variant='body2' align='center'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.8rem', color: 'peachpuff'}}>
                        Each Key adds 
                        <Typography component="span" variant='body2' px={1}  sx={{ fontFamily: 'Alegreya Sans SC', color: 'crimson',  fontSize:'1.8rem'}}>   
                        {fomoDuration} seconds  To Blood Timer
                        </Typography>
                       </Typography>
                    <Typography variant='body2' align='center'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.8rem', color: 'peachpuff'}}>Keys Get More Expensive With Time</Typography>         
                    <Typography variant='body2' align='center'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.1rem', color: 'crimson'}}>King is Winnner, non-winners share SPLIT POOL [1 Key = 1 Share]</Typography>      
                    
                </Container>
                <Box>
                    <img src={yakuza3} alt='bloodToken' height={200} />
                </Box>   
            </Stack>
            <Stack direction="row" spacing={2} sx={{pt:2,justifyContent: 'space-between'}}> 
                        <Typography variant='body2'  align='right' sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'red'}}>Break Down:</Typography>
                        <Typography variant='body2'  align='right' sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'deepskyblue'}}>Winner: Prize Fighter</Typography>
                        <Typography variant='body2'  align='right' sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'deepskyblue'}}>Split Pool: { splitPoolPct }%</Typography>
                        <Typography variant='body2'  align='right' sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'red'}}>Blood Burn: {burnRate}%</Typography>
                    </Stack>
        </Container>
        <Box className="forge-bordr" sx={{mt: 1, p:1}}>
            <Stack direction="row"  sx={{ justifyContent: 'space-between'}}>                           
                <img src={keyImage} alt='bloodToken' height={50} />
                    <Stack>
                        { Number(currentKing) > 0 && initialKeyPrice === currentTicketPrice && fomoTimeLeft < 1 && <Typography noWrap={true} align='center' variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.8rem', color: 'red'}}>Winner: {currentKing}</Typography>}
                        {Number(currentKing) > 0 && initialKeyPrice === currentTicketPrice && fomoTimeLeft < 1 && <Typography noWrap={true} align='center' variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1rem', color: 'peachpuff'}}>Payouts made at start of new round</Typography>}
                    </Stack>
                    {Number(currentKing) > 0 && (initialKeyPrice !== currentTicketPrice || fomoTimeLeft > 0) && <Typography noWrap={true} align='center' variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.8rem', color: 'palegreen'}}>Current King: {currentKing}</Typography>}
                    {Number(currentKing) === 0 && initialKeyPrice === currentTicketPrice && <Typography noWrap={true} align='center' variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'2.5rem', color: 'lemonchiffon'}}>New Game Will Begin Soon!</Typography>}
                
                <img src={keyFlippedImage} alt='bloodToken' height={50} />
                
            </Stack>
        </Box>
        {prizeFighter !== undefined && <Container className="forge-bordr" sx={{mt:1,mb: 1, p:1, width: 1/2}} >
        <Stack direction="row"  sx={{ justifyContent: 'space-around'}} >  
            <Stack  align="left" spacing={0} sx={{}}>
                <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'red'}}> {!prizeFighter?.isFighter ?  "Yakuza " : "Fighter "}# {Number(prizeFighterId)}</Typography>
                
                {prizeFighter?.isFighter === false && <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'aqua'}}>Rank: {Number(prizeFighter?.rank)}</Typography>}
                
                {prizeFighter?.isFighter === true && <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'aqua'}}>Level: {Number(prizeFighter?.level)}</Typography>}
            </Stack>
            <Box>
                <img src={imageUrl} alt='bloodToken' height={250} style={{border: '2px solid aqua', borderRadius: 10}} />
            </Box>   
            <Stack  align="right" spacing={0} sx={{}}>
                {prizeFighter?.isFighter === true && <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'aqua'}}>Brutality: {Number(prizeFighter?.brutality)}</Typography>}
                {prizeFighter?.isFighter === true && <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'aqua'}}>Courage: {Number(prizeFighter?.courage)}</Typography>}
                {prizeFighter?.isFighter === true && <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'aqua'}}>Cunning: {Number(prizeFighter?.cunning)}</Typography>}
                {prizeFighter?.isFighter === true && <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'aqua'}}>Scars: {Number(prizeFighter?.scars)}</Typography>}
            </Stack>
                </Stack>
                </Container>}
    <Container className="forge-bordr" sx={{mt:1}}>
        <Stack direction="row" sx={{justifyContent: 'space-between'}}>                     
            <Stack  align="left" spacing={0} sx={{}}>
                <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'peachpuff'}}>Fighter Fomo Game # {gameNumber}</Typography>
                
                <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'aqua'}}>Your Keys: {Number(myKeys)}</Typography>
            </Stack>
            <Stack align="center" spacing={1} sx={{}}>                
                {(initialKeyPrice !== currentTicketPrice || fomoTimeLeft > 0) && <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'2rem', color: 'red'}}>Pot Size: {Number(gamePot).toLocaleString()} Blood</Typography>}
                {(initialKeyPrice === currentTicketPrice && fomoTimeLeft < 1 ) && <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.7rem', color: 'palegreen'}}>Waiting for next game...</Typography>}
                
                <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'peachpuff'}}>Current Key Price: { currentTicketPrice}</Typography>
                
                {fomoTimeLeft > 0 && <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'aqua'}}>Key Price increases in {Math.floor(ticketIncTime)} seconds</Typography>}
                <Container className="sidebar-bordr shadw" sx={{mb: 1,pt:1, backgroundColor:'black'}}>
                    {fomoTimeLeft < 1 && (initialKeyPrice === currentTicketPrice) && <Typography variant='body2' align='center'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'2rem', color: 'peachpuff'}}>Game Over..</Typography>}
                    {fomoTimeLeft > 0 && <Typography variant='body2' align='center'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.8rem', color: 'red'}}>Blood Timer: {fomoTimeLeft} seconds left</Typography>}
                </Container>
                <div  className="input-group mb-3 forge1-bordr" >
                            <input type="number" min='1' step='1' onChange={QtyChangeHandler}  className="form-control" placeholder="How Many?" aria-label="Qty" aria-describedby="basic-addon2" />
                            <Box className="input-group-append " >
                                <Button sx={{ color: 'red', backgroundColor: 'black', borderRadius: 2 }} onClick={mintKeyHandler}>Buy Keys</Button>
                            </Box>
                        </div>  
            </Stack>
            <Stack align="right" spacing={1} sx={{}}>
                <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.4rem', color: 'peachpuff'}}>Game Start: <SimpleDateTime dateSeparator="/" timeSeparator=":">{ fomoStartTime}</SimpleDateTime> </Typography>
               
                <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'aqua'}}>Total Keys Bought: { totalTickets}</Typography>
            </Stack>
            
        </Stack>
       
    </Container>
    </div>
  )
}

export default FighterFomo