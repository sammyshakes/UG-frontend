import {useContext, useState,useEffect, React} from 'react';
import ProviderContext from '../context/provider-context';
import {Box, Button, Stack, Typography} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import './fighterTable.css';
import FighterModal from './FighterModal';
import CircularProgressWithLabel from './CircularProgressWithLabel';
import { getUGGame, getUGRaid } from '../utils.js';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import bloodIcon from '../assets/images/bloodicon.png'
let raiders = [];
/* global BigInt */

const columns = [
    { 
    field: 'mug', 
    headerClassName: 'MUG', 
    width: 70 ,
    headerAlign: 'center',
    renderCell:(params) =>{
        return(
          <Box >
            <img height={80} src={params.row.imageUrl}></img>
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
      width: 70 ,
      headerAlign: 'center',
      renderCell:(params) =>{
          return(
            <Box className="progress-box" pt={1} px={1}>
              <CircularProgressWithLabel value={getRaidProgress(params.row.lastRaidTime)} sx={{}} style={{color: Math.round(getRaidProgress(params.row.lastRaidTime), 2) < 20 ? "red" : "chartreuse"}}/>
          
            </Box>
          )
      }
      },
      { 
        field: 'InRaid', 
        headerClassName: 'InRaid', 
        width: 70 ,
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
    { field: 'switchblade', headerClassName: 'ButterFly', align: 'center',type: 'number', width: 60,headerAlign: 'center',},
    { field: 'machete', headerClassName: 'Machete',align: 'center',type: 'number', width: 60,headerAlign: 'center',},
    { field: 'katana', headerClassName: 'Katana', align: 'center',type: 'number', width: 60,headerAlign: 'center',},
    
  
];

const IsInRaid = (props) => {
  const [isRaiding, setIsRaiding] = useState(false);
  const ugRaidContract = getUGRaid();
  useEffect(() => {   
    const init = async() => {     
      const israiding =  await ugRaidContract.functions.viewIfRaiderIsInQueue(props.fighterId);
      setIsRaiding(israiding[0]);

      const timer = setInterval(() => {
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
  let timeLeftToRaid = lastRaidTime + 7 * 86400 - (Date.now()/1000);
  let progressRaid = timeLeftToRaid > 0 ? timeLeftToRaid * 100 /  (7 * 86400) : 0;
  return progressRaid;
}


export default function FighterTable() {
    const prv = useContext(ProviderContext);
    const [pageSize, setPageSize] = useState(10);
    const [fighterIsShown, setFighterIsShown] = useState(false);
    const [selectedRaider, setSelectedRaider] = useState([]);
    const [selectionModel, setSelectionModel] = useState([]);
    const [raidTickets, setRaidTickets] = useState([]);
    //const [raidingFighters, setRaidingFighters] = useState([]);
    const [ttlBloodFee, setTtlBloodFee] = useState(0);

    const ugRaidContract = getUGRaid();

    const cancelRaiderHandler = (raiderId) => {
      setRaidTickets((prevState) => {
        return prevState.filter(ticket => ticket.id !== raiderId)
      });
    }

    const filteredList = prv.stakedFYs.filter(fy => (fy.level !== 0 && fy.isFighter === true));

    const raidTicketCollector = (newticket) => {
      hideFighterHandler();

      setRaidTickets((prevState) => {
        return prevState.filter(ticket => ticket.id !== newticket.id)
      });

      setRaidTickets((prevState) => {
        if (newticket.id >0){
          const newTicket = {
            id: newticket.id,
            size: newticket.size,
            yakFamily: newticket.yakFamily,
            sweat: newticket.sweat,
            imageUrl: newticket.imageUrl
          }
        return [...prevState, newTicket];
        }
      })      
    }

    const enterRaidHandler = async() => {
      const ids = raidTickets?.map(ticket => ticket.id);
      const tickets =raidTickets?.map(ticket => {
        return (          
          {
            size: Number(ticket.size), 
            yakFamily: ticket.yakFamily, 
            sweat: ticket.sweat
          }
        );
      })
      const entries = tickets?.map(ticket => Object.values(ticket));      

      const signedContract =  ugRaidContract.connect(prv.provider.getSigner());
      const cost = await ugRaidContract.functions.getRaidCost(3,2) ;
      console.log('cost',cost.toString());
      await signedContract.functions.enterRaid(ids,entries) ;
      
      setRaidTickets([]);
      setSelectionModel([]);
    }
    
    const selectRaiderHandler = (raider) => {      
      setSelectedRaider(raider[0]);
      setFighterIsShown(true);
      console.log(selectedRaider);
    }

    const hideFighterHandler = () => {
      setFighterIsShown(false);
    }

    // const handleUpdateAllRows = () => {
    //   setRows(prv.stakedFYs.map((row) => ({ ...prv.stakedFYs, actionColumn: getRaidProgress(row.lastRaidTime) })));
      
    // };

    
  useEffect(() => {   
    const init = async() => {     
     // const resultArray = await Promise.all(inputArray.map(async (i) => someAsyncFunction(i)));
      // const raidFighters = await Promise.all(prv.stakedFYs.map(async (fighter) => ugRaidContract.functions.viewIfRaiderIsInQueue(fighter.id)));
      
      // setRaidingFighters(raidFighters);
      // raiders = raidingFighters;

      //console.log(raiders[0][0]);
      // const raidingFighters = prv.stakedFYs.map(fighter => (
      //    const inqueue =  await ugRaidContract.functions.viewIfRaiderIsInQueue(fighter.id);
      
      // ));
      //handleUpdateAllRows();

      const timer = setInterval(() => {
      //  handleUpdateAllRows();
      }, 30000);

      return () => {
        clearInterval(timer);
      };
    }
    init();
    // eslint-disable-next-line
  }, []);
   
  return (
    <div>
      
      {fighterIsShown && <FighterModal 
        raider={selectedRaider} 
        collectTicket={raidTicketCollector} 
        cancelRaider={cancelRaiderHandler}
        hideModal={hideFighterHandler}
        />}

      <Stack direction="row" spacing={2}>
      <Box sx={{
        height: 650,
        '& .TimeLeft': {
          color: 'darkmagenta',
        }, 
        '& .MUG': {
          color: 'darkmagenta',
        }, 
        '& .Level': {
          color: 'darkmagenta',
        }, 
        '& .Brutality': {
          color: 'darkmagenta',
        }, 
        '& .Courage': {
          color: 'darkmagenta',
        }, 
        '& .Cunning': {
          color: 'darkmagenta',
        }, 
        '& .Scars': {
          color: 'darkmagenta',
        }, 
        '& .Knuckles': {
          color: 'darkmagenta',
        }, 
        '& .Chains': {
          color: 'darkmagenta',
        },
        '& .ButterFly': {
          color: 'darkmagenta',
        },
        '& .Machete': {
          color: 'darkmagenta',
        },
        '& .Katana': {
          color: 'darkmagenta',
        },
        '& .MuiCheckbox-root svg': {
          border: 2,
          borderRadius: 1,
          color: 'aqua'
        },
        '& .InRaid': {
          color: 'darkmagenta',
        },
        
      }} 
        style={{ maxheight: 600, width: '65%', display: 'flex'}}>
        <DataGrid sx={{color: 'aqua', fontSize: '.9rem'}}
          rowHeight={60}
          pagination
          pageSize={pageSize}
          onPageSizeChange = {pageSize => setPageSize(pageSize)}
          rowsPerPageOptions={[10, 20, 50, 100]}
          checkboxSelection
          disableSelectionOnClick
          onSelectionModelChange={(ids) => {
            const selectedIDs = new Set(ids);
            const selectRaider = filteredList.filter((row) =>
              selectedIDs.has(row.id),
            );
            selectRaiderHandler(selectRaider);
          }}
          rows={filteredList}
          columns={columns}
          selectionModel={selectionModel} 
        />
       
      </Box>
      <Stack>
        <Stack direction="row" sx={{justifyContent: 'space-between'}}>
          <Stack>
            
            <Typography variant='body2' pl={1}  sx={{fontFamily: 'Alegreya Sans SC', color: 'orange',  fontSize:'1rem'}}>Total Raid Fee</Typography>                                    
            <Typography variant='body2' pl={1}  sx={{fontFamily: 'Alegreya Sans SC', color: 'orange',  fontSize:'1rem'}}>
              {(Math.floor(Number(prv.balance)/(10**18))).toString()}
            </Typography>                                    
          </Stack>
          <Button variant="outlined" justify='center' className="raidButton" sx={{align: 'center', m:1, borderColor: 'red', color: 'red', backgroundColor: 'black', fontFamily: 'Alegreya Sans SC',  fontSize:'1.2rem'}}  onClick={enterRaidHandler}>Send Fighters</Button>
        </Stack>
          
        <Box className="box20-bordr">
       {raidTickets.length > 0 && <ImageList sx={{ width: 290, maxHeight: 450}} cols={3} rowHeight={150}>
        { raidTickets?.map((item) => (
          <ImageListItem key={item.id} p={1}>
            <img
              src={item.imageUrl}
              alt={item.id}
              loading="lazy"
            />
          </ImageListItem>
        ))}
    </ImageList>}
        </Box>
        <Box className="box10-bordr">
          </Box>
          
      </Stack>
      </Stack>
      
    </div>
  );
}

