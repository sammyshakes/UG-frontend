import {useState, useEffect} from 'react'
import bloodToken from '../../assets/images/coin_transp_500.png';
import yakuza1 from '../../assets/images/yakuza_1_transp_500.png';
import yakuza3 from '../../assets/images/yakuza3_transp_500.png';
import keyImage from '../../assets/images/key.png';
import keyFlippedImage from '../../assets/images/keyflipped.png';
import SimpleDateTime  from 'react-simple-timestamp-to-date';
import ErrorModal from '../ui/ErrorModal';
import {Box, Container, Button, Stack, Typography} from '@mui/material';
import {getBloodFomo, getBlood, getEthers} from '../../utils.js';

const BloodFomo = () => { 
    const [enteredQty, setEnteredQty] = useState() ;
    const [error, setError] = useState();
    const [period, setPeriod] = useState(0);
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
    const [winnerPct, setWinnerPct] = useState(undefined);
    const [splitPoolPct, setSplitPoolPct] = useState(undefined);
    const [burnRate, setBurnRate] = useState(undefined);
    const [nextPotPct, setNextPotPct] = useState(undefined);
    const [myKeys, setMyKeys] = useState();
    const ugBloodFomoContract = getBloodFomo();
    const bloodContract = getBlood();
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

        const signedContract =  ugBloodFomoContract.connect(provider.getSigner());
        const receipt = await signedContract.functions.buyKey(enteredQty) ;
        
        if(receipt.hash)  setError({
            title: `Bought ${enteredQty} Keys!`,
            message: `  Tx will complete momentarily..`,
            //message: `Total cost: ${enteredQty * currentTicketPrice}  Tx will complete momentarily..`,
        });
        
    }

    const getUpdates = async() => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const myKeys = await ugBloodFomoContract.keys(accounts[0]);
        const fomoStart = await ugBloodFomoContract.start();
        
        const totalTickets = await ugBloodFomoContract.totalKeys();
        const gamePot = await ugBloodFomoContract.pot();
        const fomoEnd = await ugBloodFomoContract.end();
        const gameEnd = await ugBloodFomoContract.gameEnd();
        const ticketPrice = await ugBloodFomoContract.getKeyPrice();
        const king = await ugBloodFomoContract.king();        
        const gameNum = await ugBloodFomoContract.gameNumber();

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
        const gamePot = await ugBloodFomoContract.pot();
        const fomoTime = await ugBloodFomoContract.fomoTime();
        const fomoStart = await ugBloodFomoContract.start();
        const fomoEnd = await ugBloodFomoContract.end();
        const gameNum = await ugBloodFomoContract.gameNumber();
        const king = await ugBloodFomoContract.king(); 
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
            const initialKeyPrice = await ugBloodFomoContract.baseTicket();
            const keyPriceIncrement = await ugBloodFomoContract.ticketIncrement();
            const winPct = await ugBloodFomoContract.winnerPct();
            const splitPct = await ugBloodFomoContract.splitPoolPct();
            const nextPotpct = await ugBloodFomoContract.nextPot();
            const fomoTime = await ugBloodFomoContract.fomoTime();
            setWinnerPct(Number(winPct));
            setSplitPoolPct(Number(splitPct));
            setBurnRate(Number(80));
            setNextPotPct(Number(nextPotpct));
            setFomoDuration(Number(fomoTime));
            setInitialKeyPrice(Number(initialKeyPrice));
            setKeyPriceIncrement(Number(keyPriceIncrement));

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
            <Typography variant='body2' align='center'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'3rem', color: 'red'}}>Blood Fomo Game</Typography>
            <Stack direction="row" spacing={2} sx={{justifyContent: 'space-between'}}> 
            <Box>
                <img src={bloodToken} alt='bloodToken' height={200} />
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
                <img src={bloodToken} alt='bloodToken' height={200} />
            </Box>   
            </Stack>
            <Stack direction="row" spacing={2} sx={{pt:2,justifyContent: 'space-between'}}> 
                        <Typography variant='body2'  align='right' sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'red'}}>Break Down:</Typography>
                        <Typography variant='body2'  align='right' sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'deepskyblue'}}>Winner: {winnerPct }%</Typography>
                        <Typography variant='body2'  align='right' sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'deepskyblue'}}>Split Pool: { splitPoolPct }%</Typography>
                        <Typography variant='body2'  align='right' sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'red'}}>Blood Burn: {burnRate}%</Typography>
                    </Stack>
        </Container>
        <Box className="forge-bordr" sx={{mt: 1, p:1}}>
            <Stack direction="row"  sx={{ justifyContent: 'space-between'}}>                           
                <img src={keyImage} alt='bloodToken' height={50} />
                    <Stack>
                        {Number(currentKing) > 0 && initialKeyPrice === currentTicketPrice && fomoTimeLeft < 1 && <Typography noWrap={true} align='center' variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.8rem', color: 'red'}}>Winner: {currentKing}</Typography>}
                        {Number(currentKing) > 0 && initialKeyPrice === currentTicketPrice && fomoTimeLeft < 1 && <Typography noWrap={true} align='center' variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1rem', color: 'peachpuff'}}>Payouts made at start of new round</Typography>}
                    </Stack>
                    {Number(currentKing) > 0 && (initialKeyPrice !== currentTicketPrice  || fomoTimeLeft > 0) && <Typography noWrap={true} align='center' variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.8rem', color: 'palegreen'}}>Current King: {currentKing}</Typography>}
                    {Number(currentKing) === 0 && initialKeyPrice === currentTicketPrice && <Typography noWrap={true} align='center' variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'2.5rem', color: 'lemonchiffon'}}>Buy Keys to Start a New Game</Typography>}
                
                <img src={keyFlippedImage} alt='bloodToken' height={50} />
                
            </Stack>
        </Box>
       
        
    <Container className="forge-bordr" sx={{mt:1}}>
        <Stack direction="row" sx={{justifyContent: 'space-between'}}>                     
            <Stack  align="left" spacing={0} sx={{}}>
                <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'2rem', color: 'peachpuff'}}>Blood Fomo Game # {gameNumber}</Typography>
                <Box>
                    <img src={yakuza1} alt='bloodToken' height={200} />
                </Box>   
                <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'aqua'}}>Your Keys: {Number(myKeys)}</Typography>
            </Stack>
            <Stack align="center" spacing={1} sx={{}}>                
                {(initialKeyPrice !== currentTicketPrice || fomoTimeLeft > 0) && <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'2rem', color: 'red'}}>Pot Size: {Number(gamePot).toLocaleString()} Blood</Typography>}
                {(initialKeyPrice === currentTicketPrice && fomoTimeLeft < 1 ) && <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.7rem', color: 'palegreen'}}>Next Pot Starts with: {Math.floor(gamePot * nextPotPct / 100)} Blood</Typography>}
                
                <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'peachpuff'}}>Current Key Price: { currentTicketPrice}</Typography>
                
                {fomoTimeLeft > 0 && <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'aqua'}}>Key Price increases in {Math.floor(ticketIncTime)} seconds</Typography>}
                <Container className="sidebar-bordr shadw" sx={{mb: 1,pt:1, backgroundColor:'black'}}>
                    {fomoTimeLeft < 1 && (initialKeyPrice === currentTicketPrice) && <Typography variant='body2' align='center'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'2rem', color: 'peachpuff'}}>Game Over.. Buy a Key to Start!</Typography>}
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
                <Box>
                    <img src={yakuza3} alt='bloodToken' height={200} />
                </Box>
                <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1.5rem', color: 'aqua'}}>Total Keys Bought: { totalTickets}</Typography>
            </Stack>
            
        </Stack>
       
    </Container>
    </div>
  )
}

export default BloodFomo