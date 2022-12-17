import {useContext, useState,useEffect} from 'react';
import * as React from 'react';
import ProviderContext from '../context/provider-context';
import {Box, Button, Stack, Typography} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import FighterModal from './FighterModal';
import RefereeModal from './RefereeModal';
import CircularProgressWithLabel from './CircularProgressWithLabel';
import ErrorModal from './ui/ErrorModal';
import {  getUGRaid2, getUGRaid3, getUGWeapons2, getUGArena2, getUGFYakuza, getRaidEntry3 } from '../utils.js';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import bloodIcon from '../assets/images/bloodicon.png'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import './fighterTable.css';



const columns = [
    { 
    field: 'mug', 
    headerClassName: 'MUG', 
    width: 70, 
    sortable: false , 
    filterable: false,
    headerAlign: 'center',
    renderCell:(params) =>{
        return(
          <Box >
            <img height={80} alt="raider" src={params.row.imageUrl}></img>
          </Box>
        )
    }
    },
    { field: 'level', headerClassName: 'Level', align: 'center', type: 'number', width:65,headerAlign: 'center',},
    { field: 'brutality', headerClassName: 'Brutality', align: 'center',type: 'number', width: 65,headerAlign: 'center',},
    { field: 'courage', headerClassName: 'Courage',align: 'center', type: 'number', width: 65,headerAlign: 'center',},
    { field: 'cunning', headerClassName: 'Cunning', align: 'center',type: 'number', width: 65,headerAlign: 'center',},
    { 
      field: 'TimeLeft', 
      headerClassName: 'TimeLeft', 
      sortable: false, 
      filterable: false, 
      width: 70 ,
      headerAlign: 'center',
      type: 'number',
      renderCell:(params) =>{
          return(
            <Box className="progress-box" pt={1} px={1}>
              <CircularProgressWithLabel value={getRaidProgress(params.row.lastRaidTime)} time={getRaidTimeLeft(params.row.lastRaidTime)} style={{color: Math.round(getRaidProgress(params.row.lastRaidTime), 2) < 20 ? "red" : "chartreuse"}}/>
          
            </Box>
          )
      }
      },
      { 
        field: 'InRaid', 
        headerClassName: 'InRaid', 
        width: 70 , 
        sortable: false, 
        filterable: false,
        headerAlign: 'center',
        renderCell:(params) =>{
            return(
              <Box pt={0} px={0}>
                <IsInRaid fighterId={params.row.id}/>
            
              </Box>
            )
        }
        },
    { field: 'scars', headerClassName: 'Scars',align: 'center', type: 'number', width: 60,headerAlign: 'center',},
    { field: 'knuckles', headerClassName: 'Knuckles',align: 'center', type: 'number', width: 60,headerAlign: 'center',},
    { field: 'chains', headerClassName: 'Chains', align: 'center',type: 'number', width: 60,headerAlign: 'center',},
    { field: 'butterfly', headerClassName: 'ButterFly', align: 'center',type: 'number', width: 60,headerAlign: 'center',},
    { field: 'machete', headerClassName: 'Machete',align: 'center',type: 'number', width: 60,headerAlign: 'center',},
    { field: 'katana', headerClassName: 'Katana', align: 'center',type: 'number', width: 60,headerAlign: 'center',},
    
  
];

const IsInRaid = (props) => {
  const [isRaiding, setIsRaiding] = useState(false);
  const ugRaidContract = getUGRaid3();

  const getRaidStatus =async() => {
    const israiding =  await ugRaidContract.viewIfRaiderIsInQueue(props.fighterId);
      setIsRaiding(israiding);

  }
  useEffect(() => {   
    const init = async() => {     
      getRaidStatus();

      const timer = setInterval(() => {
        getRaidStatus();
      }, 5000);

      return () => {
        clearInterval(timer);
      };
    }
    init();
    // eslint-disable-next-line
  }, []);
  return (
    <Box>
     {isRaiding && <Box className="inraid-box"><img src={bloodIcon} alt="bloodIcon" height={40}/></Box>}
     {!isRaiding && <Box  style={{borderColor: 'black'}}></Box>}
     </Box>
  )
}

const getRaidProgress = (lastRaidTime) => {
  //now for Raid progress bar
  let timeLeftToRaid = getRaidTimeLeft(lastRaidTime);
  let progressRaid = timeLeftToRaid > 0 ? timeLeftToRaid * 100 /  (7 * 86400) : 0;
  return progressRaid;
}

const getRaidTimeLeft = (lastRaidTime) => {
  //now for Raid progress bar
  return lastRaidTime + 7 * 86400 - (Date.now()/1000);
 
}


export default function FighterTable() {
    const prv = useContext(ProviderContext);
    const [error, setError] = useState();
    const [fighterIsShown, setFighterIsShown] = useState(false);
    const [refereeIsShown, setRefereeIsShown] = useState(false);
    const [stakedFYs, setStakedFYs] = useState([]);
    const [open, setOpen] = useState(false);
    
    const [selectedRaider, setSelectedRaider] = useState([]);    
    const [raidTickets, setRaidTickets] = useState([]);
    const [selectionModel, setSelectionModel] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [userRaidWinnings, setUserRaidWinnings] = useState(0);
    const [userWeaponsWinnings, setUserWeaponsWinnings] = useState(0);
    const [userRaid2Winnings, setUserRaid2Winnings] = useState(0);
    const [ttlBloodFee, setTtlBloodFee] = useState(0);
    const [ttlSweatBurn, setTtlSweatBurn] = useState(0);
    const [numRaids, setNumRaids] = useState(0);
    const [enteredBulkRaiders, setEnteredBulkRaiders] = useState(0);

    const baseUrl = 'https://the-u.club/reveal/fighteryakuza/';
    const random = Math.floor(Math.random() * (500 - 1 + 1)) + 1 + 20000;
    //const fclubUrl = baseUrl.concat(random.toString()).concat('.jpg'); 

    const ugRaid2Contract = getUGRaid2();
    const ugRaidContract = getUGRaid3();
    const ugWeaponsContract = getUGWeapons2();
    const ugArenaContract = getUGArena2();
    const ugFYakuzaContract = getUGFYakuza();    
    const raidEntryContract = getRaidEntry3();

    const filteredList = stakedFYs?.filter(fy => (fy.isFighter === true));
    const sortedRaidTimeList = filteredList?.sort((a, b) => a.lastRaidTime - b.lastRaidTime);

    const Alert = React.forwardRef(function Alert(props, ref) {
      return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const enteredBulkRaidersChangeHandler = (event) => {
      event.preventDefault();        
      setEnteredBulkRaiders(event.target.value);
  }

    const handleSnackBar = () => {
      setOpen(true);
    };
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };

    const cancelRaiderHandler = (raiderId) => {
      
      setRaidTickets((prevState) => {
        const cancelledTicket = prevState.filter(ticket => ticket.id === raiderId);
        //if cancelled raider was not in raidticket queue
        if(cancelledTicket.length === 0) return prevState;
        if(cancelledTicket[0]?.sweat > 0) {
          setTtlSweatBurn((prevBurn) => {
            return Number(prevBurn) - Number(cancelledTicket[0]?.sweat);
          })
        }
        const tick = raidTickets.filter(ticket => ticket.id === raiderId);
        setTtlBloodFee((prevFee) => {
          return Number(prevFee) - Number(tick[0]?.bloodEntryFee);
        });
        return prevState.filter(ticket => ticket.id !== raiderId)
      });
    }   

    const raidTicketCollector = (newticket) => {      
      hideFighterHandler();

      setRaidTickets((prev) => {
        return prev.filter(ticket => ticket.id !== newticket.id)
      });

      setRaidTickets((prevState) => {
        if (newticket.id >0){
          const newTicket = {
            id: newticket.id,
            size: newticket.size,
            yakFamily: newticket.yakFamily,
            sweat: newticket.sweat,
            imageUrl: newticket.imageUrl,
            bloodEntryFee: newticket.bloodEntryFee
          }
          setTtlBloodFee((prevFee) => {            
            return (Number(prevFee) + Number(newticket.bloodEntryFee));
          })

          if(Number(newticket.sweat) > 0){
            setTtlSweatBurn((prevBurn) => {            
              return (Number(prevBurn) + Number(newticket.sweat));
            })
          }
          
        return [...prevState, newTicket];
        }
      })      
    }

    const enterRaidHandler = async() => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const sweatBalance = await ugWeaponsContract.balanceOf(accounts[0], 56);
      let ttlSweatFee = Number(0);
      let sweatBarrier;
      //error
      if (raidTickets.length === 0) {
        setError({
        title: 'You must select fighters first ',
        message: 'Choose wisely...',
        });
        return;
      }       

      const ids = raidTickets?.map(ticket => ticket.id);
      const tickets =raidTickets?.map(ticket => {
        ttlSweatFee += Number(ticket.sweat); 
        //error
        if (ticket.sweat > Number(sweatBalance)) {
          setError({
          title: 'Do not enter more sweat than you have earned. ',
          message: 'Go get some first...',
          });
          sweatBarrier = 99;
          return;
        }     
         
        return (          
          {
            size: Number(ticket.size), 
            yakFamily: Number(ticket.yakFamily), 
            sweat: Number(ticket.sweat) >0 ? Number(ticket.sweat) : 0,
          }
        );
      })      

      if (ttlSweatFee > Number(sweatBalance)) {
        setError({
        title: 'Do not enter more sweat than you have earned. ',
        message: 'Go get some first...',
        });
        sweatBarrier = Number(99);
        return;
      }     

      if(sweatBarrier === 99) return;
      const entries = tickets?.map(ticket => Object.values(ticket));   
      console.log(tickets);  
      console.log(entries);
      const signedContract =  raidEntryContract.connect(prv.provider.getSigner());
      const receipt = await signedContract.functions.enterRaid(ids,entries) ;
      setTtlBloodFee(0);
      setTtlSweatBurn(0);
      setRaidTickets([]);
      setSelectionModel([]);
    }

    const eligibleForWeapons = (fighter) => {
      if((fighter.level >= 10 && (fighter.knuckles === 0 || fighter.knuckles%5 === 1)) ||
          (fighter.level >= 19 && (fighter.chains === 0 || fighter.chains%5 === 1)) ||
          (fighter.level >= 28 && (fighter.butterfly === 0 || fighter.butterfly%5 === 1)) ||
          (fighter.level >= 40 && (fighter.machete === 0 || fighter.machete%5 === 1)) ||
          (fighter.level >= 52 && (fighter.katana === 0 || fighter.katana%5 === 1)) 
        ){
          return false;
        }
        return true;
    }

    const bulkEnterRaidHandler = async() => {
      handleSnackBar();
      const size = 1;
      const yakFamily = 0;
      const mandatorySweat = 500;
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const sweatBalance = await ugWeaponsContract.balanceOf(accounts[0], 56);

      let filteredList = stakedFYs?.filter(fy => (fy.isFighter === true));
      filteredList = filteredList?.filter(eligibleForWeapons);

      //check if any in raid yet
      let sortedRaidTimeList = filteredList?.sort((a, b) => a.lastRaidTime - b.lastRaidTime);
      if(sortedRaidTimeList.length > enteredBulkRaiders) {
        sortedRaidTimeList = sortedRaidTimeList.slice(0, enteredBulkRaiders);      
      }

      const finalArray = [];
      for(const fighter of sortedRaidTimeList) {   
         await ugRaidContract.viewIfRaiderIsInQueue(fighter.id).then(result => {
          if (!result) {finalArray.push(fighter); } 
      });               
      }      
      //error
      if (finalArray.length === 0) {
        setError({
        title: 'No Fighters to Raid ',
        message: 'Acquire some...',
        });
        return;
      }       

      if (finalArray.length * mandatorySweat > Number(sweatBalance)) {
        setError({
        title: 'Not enough Sweat',
        message: 'Acquire some...',
        });
        return;
      }   
      const ids = finalArray?.map(fighter => fighter.id);      
      const tickets =finalArray?.map(fighter => {       
         
        return (          
          {
            size: Number(size), 
            yakFamily: Number(yakFamily), 
            sweat: Number(mandatorySweat),
          }
        );
      })      
      const entries = tickets?.map(ticket => Object.values(ticket));    
      const signedContract =  raidEntryContract.connect(prv.provider.getSigner());
      //let gas = await signedContract.estimateGas.enterRaid(ids,entries);
      const receipt = await signedContract.functions.enterRaid(ids,entries) ;
      setEnteredBulkRaiders(0);
    }

    const refereeHandler = async() => {    
      setRefereeIsShown(true);      
    }
    
    const selectRaiderHandler = (raider) => {      
      setSelectedRaider(raider[0]);
      setFighterIsShown(true);
    }

    const claimHandler = async() => {
      const signedContract =  ugRaidContract.connect(prv.provider.getSigner());
        const receipt = await signedContract.functions.claimRaiderBloodRewards();
        setUserRaidWinnings(0)
    }

    const claimWeaponsHandler = async() => {
      const signedContract =  ugRaidContract.connect(prv.provider.getSigner());
        const receipt = await signedContract.functions.claimWeapons();
        setUserWeaponsWinnings(0)
    }

    const claim2Handler = async() => {
      const signedContract =  ugRaid2Contract.connect(prv.provider.getSigner());
        const receipt = await signedContract.functions.claimRaiderBloodRewards();
        setUserRaid2Winnings(0)
    }

    const hideFighterHandler = () => {
      setFighterIsShown(false);
    }
    const hideRefereeHandler = () => {
      setRefereeIsShown(false);
    }

    const updateRaidRewards = async() => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const userRaidRewards = await ugRaidContract.raiderOwnerBloodRewards(accounts[0]);
      const userRaid2Rewards = await ugRaid2Contract.raiderOwnerBloodRewards(accounts[0]);
      setUserRaidWinnings(userRaidRewards);
      setUserRaid2Winnings(userRaid2Rewards);

     
    }

  const errorHandler = () => {
    setError(null);
  }

  const getUpdates = async() => {      
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });      
    const _stakedIds = await ugArenaContract.getStakedFighterIDsForUser(accounts[0]);        
    const stakedIds = _stakedIds.map(id => { return Number(id); })       
    if(stakedIds.length > 0){
    const _stakedFYs = await ugFYakuzaContract.getFighters(stakedIds); 
        
    const stakedFYs = stakedIds.map((id, i) => {        
      let imageUrl =  "fighter/" ;
      
      imageUrl = baseUrl.concat(imageUrl.concat(_stakedFYs[i].imageId).concat('.png'));
      let fy = {id, imageUrl, ..._stakedFYs[i]};
      //console.log('fy',fy);
      return fy;
    })   
    //const filteredList = stakedFYs?.filter(fy => (fy.isFighter === true));
    setStakedFYs(stakedFYs);
    const numRaids = await ugRaidContract.ttlRaids();
    setNumRaids(numRaids);

    const userWeaponsRewards = await ugRaidContract.getUnclaimedWeaponsCount(accounts[0]);
    setUserWeaponsWinnings(userWeaponsRewards);
  }
    
  }
  

    
  useEffect(() => {   
    const init = async() => {     
      updateRaidRewards();
      getUpdates();
      
    
      const timer = setInterval(() => {
        updateRaidRewards();
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
    <div>
        {error && (
                    <ErrorModal 
                        title={error.title} 
                        message={error.message} 
                        onConfirm={errorHandler}
                    />
        )}
         {refereeIsShown && <RefereeModal 
            hideModal={hideRefereeHandler}
          />}
      
        {fighterIsShown && <FighterModal 
          raider={selectedRaider} 
          collectTicket={raidTicketCollector} 
          cancelRaider={cancelRaiderHandler}
          hideModal={hideFighterHandler}
          sweatBurn={ttlSweatBurn}
          />}

      <Stack direction="row" spacing={2} sx={{width:{md: '100%', lg: '100%' }}}>
      <Snackbar open={open} autoHideDuration={10000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal:  'center' }}>
        
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Patience.. this tx could take a while...
          Unequipped Fighters will be sent home...
        </Alert>
      </Snackbar>
      <Box pt={1} sx={{
        height: '80vh',
        minHeight: 850,
        '& .TimeLeft': {
          color: 'darkorchid',
        }, 
        '& .MUG': {
          color: 'darkorchid',
        }, 
        '& .Level': {
          color: 'darkorchid',
        }, 
        '& .Brutality': {
          color: 'darkorchid',
        }, 
        '& .Courage': {
          color: 'darkorchid',
        }, 
        '& .Cunning': {
          color: 'darkorchid',
        }, 
        '& .Scars': {
          color: 'darkorchid',
        }, 
        '& .Knuckles': {
          color: 'darkorchid',
        }, 
        '& .Chains': {
          color: 'darkorchid',
        },
        '& .ButterFly': {
          color: 'darkorchid',
        },
        '& .Machete': {
          color: 'darkorchid',
        },
        '& .Katana': {
          color: 'darkorchid',
        },
        '& .MuiCheckbox-root svg': {
          border: 2,
          borderRadius: 1,
          color: 'aqua'
        },
        '& .InRaid': {
          color: 'darkorchid',
        },
        '& .MuiDataGrid-cellContent' :{
          color: 'aqua',
        },
        '& .MuiDataGrid-columnHeaders' :{
          backgroundColor: 'aqua',
        },
        '& .MuiDataGrid-footerContainer' :{
          backgroundColor: 'aqua',
        },
        
      }} 
        style={{height: '80vh', width: '100%', display: 'flex'}}>
        <DataGrid sx={{minHeight: 800, color: 'aqua', fontSize: '.9rem', width:{lg: '100%' }}}
          rowHeight={65}
          pagination
          pageSize={pageSize}
          onPageSizeChange = {pageSize => setPageSize(pageSize)}
          rowsPerPageOptions={[10, 20, 50, 100]}
          checkboxSelection
          onSelectionModelChange={(ids) => {
            const selectedIDs = new Set(ids);
            const selectRaider = filteredList.filter((row) =>
              selectedIDs.has(row.id),
            );
            selectRaiderHandler(selectRaider);
          }}
          rows={sortedRaidTimeList}
          columns={columns}
          selectionModel={selectionModel} 
        />
       
      </Box>
      <Stack height='80vh'>
      <Stack direction="row" sx={{justifyContent: 'space-between'}}>
          <Typography variant='body2' pl={1}  sx={{fontFamily: 'Alegreya Sans SC', color: 'chartreuse',  fontSize:'1.2rem'}}>Total Raids</Typography>                                    
          <Typography variant='body2' pl={1}  sx={{fontFamily: 'Alegreya Sans SC', color: 'chartreuse',  fontSize:'1.25rem'}}>
            {(Math.floor(Number(numRaids))).toString()}                                    
          
          </Typography>  
          
        </Stack>  
        <Stack className ="box10-bordr" direction="row" sx={{justifyContent: 'space-around'}}>        
          <Button variant="text" justify='center' size='medium' className="refButton" sx={{ m:1, borderRadius: 5,  border: 2, color: 'aqua', backgroundColor: 'crimson', fontFamily: 'Alegreya Sans SC',  fontSize:'1rem', width: 100}}  onClick={refereeHandler}>Referee</Button>
          <Button variant="text" justify='center' size='medium' className="raidButton" sx={{ m:1, borderRadius: 5, border: 2, color: 'black', backgroundColor: 'aqua', fontFamily: 'Alegreya Sans SC',  fontSize:'1rem'}}  onClick={enterRaidHandler}>Send Fighters</Button>
        </Stack>
        
        <Stack direction="row" sx={{justifyContent: 'space-between'}}>
          <Typography variant='body2' pl={1}  sx={{fontFamily: 'Alegreya Sans SC', color: 'gold',  fontSize:'1.2rem'}}>Total Raid Fee</Typography>                                    
          <Typography variant='body2' pl={1}  sx={{fontFamily: 'Alegreya Sans SC', color: 'gold',  fontSize:'1.25rem'}}>
            {(Math.floor(Number(ttlBloodFee))).toString()} 
            <Typography component="span" variant='body2' pl={1}  sx={{ fontFamily: 'Alegreya Sans SC', color: 'crimson',  fontSize:'1rem'}}>BLOOD</Typography>                                    
          
          </Typography>  
          
        </Stack>  
        <Stack direction="row" sx={{justifyContent: 'space-between'}}>
          <Typography variant='body2' pl={1}  sx={{fontFamily: 'Alegreya Sans SC', color: 'gold',  fontSize:'1.2rem'}}>Total Sweat Burn</Typography>                                    
          <Typography variant='body2' pl={1}  sx={{fontFamily: 'Alegreya Sans SC', color: 'gold',  fontSize:'1.25rem'}}>
            {(Math.floor(Number(ttlSweatBurn))).toString()} 
            <Typography component="span" variant='body2' pl={1}  sx={{ fontFamily: 'Alegreya Sans SC', color: 'deepskyblue',  fontSize:'1rem'}}>Sweat</Typography>                                    
          
          </Typography>  
          
        </Stack>  
        <Box className="box20-bordr" height={'80vh'}>
       {raidTickets?.length > 0 && <ImageList sx={{maxHeight:9/10,  width: 290}} cols={3} rowHeight={150} >
        { raidTickets?.map((item) => (
          <ImageListItem key={item.id} p={1}>
            <img
              src={item.imageUrl}
              alt={item.id}
            />
          </ImageListItem>
        ))}
    </ImageList>}
        </Box>
        <Stack className ="box10-bordr" direction="row" sx={{justifyContent: 'space-between'}}>        
        <Typography variant='body2' p={1}  sx={{fontFamily: 'Alegreya Sans SC', color: 'gold',  fontSize:'1.1rem'}}>
            {(Math.floor(Number(userRaidWinnings))).toString()} 
            <Typography component="span" variant='body2' pl={1}  sx={{ fontFamily: 'Alegreya Sans SC', color: 'crimson',  fontSize:'1rem'}}>Blood</Typography>                                    
          
          </Typography>  
          <Button variant="text" justify='center' size='medium' className="raidButton" sx={{ m:1, borderRadius: 5, border: 1, color: 'black', backgroundColor: 'aqua', fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem'}}  onClick={claimHandler}>Claim Winnings</Button>
        </Stack>
        <Stack className ="box10-bordr" direction="row" sx={{justifyContent: 'space-between'}}>        
        <Typography variant='body2' p={1}  sx={{fontFamily: 'Alegreya Sans SC', color: 'gold',  fontSize:'1.1rem'}}>
            {Number(userWeaponsWinnings[0])} 
            <Typography component="span" variant='body2' pl={1}  sx={{ fontFamily: 'Alegreya Sans SC', color: 'deepskyblue',  fontSize:'1rem'}}>Weapons</Typography>                                    
          
          </Typography>  
          <Button variant="text" justify='center' size='medium' className="raidButton" sx={{ m:1, borderRadius: 5, border: 1, color: 'black', backgroundColor: 'aqua', fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem'}}  onClick={claimWeaponsHandler}>Claim Weapons</Button>
        </Stack>
        <Box >
        <Stack> 
          <Stack className ="box10-bordr" direction="row" sx={{justifyContent: 'space-between'}}>  
              
            <Box width={130}  className="input-group m-1 " >
              <input type="number" min='10' step='10' onChange={enteredBulkRaidersChangeHandler}  className="form-control"  placeholder="How Many? "  aria-label="Qty" aria-describedby="basic-addon2" />                              
            </Box>  
           
             
              <Button variant="text" justify='center' size='medium' className="raidButton" sx={{ m:1, borderRadius: 5, border: 1, color: 'black', backgroundColor: 'red', fontFamily: 'Alegreya Sans SC', minWidth: 1/2.5}}  onClick={bulkEnterRaidHandler}>Bulk Raid</Button>
             
          </Stack>
         </Stack> 
        </Box>
        <Typography  pl={1} align='center' sx={{fontFamily: 'Alegreya Sans SC', color: 'deepskyblue'}}>500 Sweat per Raider to bulk raid</Typography>                                    
            

     { Number(userRaid2Winnings) > 0 &&  <Stack className ="box10-bordr" direction="row" sx={{justifyContent: 'space-around'}}>        
        <Typography variant='body2' p={1}  sx={{fontFamily: 'Alegreya Sans SC', color: 'gold',  fontSize:'1rem'}}>
            {(Math.floor(Number(userRaid2Winnings))).toString()} 
            <Typography component="span" variant='body2' pl={1}  sx={{ fontFamily: 'Alegreya Sans SC', color: 'crimson',  fontSize:'1rem'}}>Blood</Typography>                                    
          
          </Typography>  
          <Button variant="text" justify='center' size='medium' className="raidButton" sx={{ m:1, borderRadius: 5, border: 1, color: 'black', backgroundColor: 'aqua', fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem'}}  onClick={claim2Handler}>Claim Fix Winnings</Button>
        </Stack>}
      </Stack>
      
      </Stack>
      
    </div>
  );
}

