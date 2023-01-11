import {useContext, useState,useEffect, React} from 'react';
import ProviderContext from '../context/provider-context';
import {Box, Button, Stack, Typography} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import WeaponModal from './WeaponModal';
import ErrorModal from './ui/ErrorModal';
import {getUGArena3, getUGFYakuza, getUGForgeSmith3 } from '../utils.js';
import CircularProgressWithLabel from './CircularProgressWithLabel';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import './weaponTable.css';

const columns = [
    { 
    field: 'mug', 
    headerClassName: 'MUG', 
    width: 75 ,
    sortable: false ,
    filterable: false,
    headerAlign: 'center',
    renderCell:(params) =>{
        return(
          <Box sx={{border: 2, borderColor: 'crimson', borderRadius: 1}}>
            <img height={80} src={params.row.imageUrl}></img>
          </Box>
        )
    }
    },
    { field: 'level', headerClassName: 'Level', align: 'center', type: 'number', width:60,headerAlign: 'center',},
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
            <Box className="raid-progress-box" pt={1} px={1}>
              <CircularProgressWithLabel value={getRaidProgress(params.row.lastRaidTime)} time={getRaidTimeLeft(params.row.lastRaidTime)} style={{color: Math.round(getRaidProgress(params.row.lastRaidTime), 2) < 20 ? "red" : "chartreuse"}}/>
          
            </Box>
          )
      }
      },
    { field: 'knuckles', headerClassName: 'Knuckles',align: 'center', type: 'number', width: 80,headerAlign: 'center',
    renderCell:(params) =>{
      return(
        <Box pt={0} px={0}>
                <WeaponImageDealer score={params.row.knuckles} baseId={1}/>
            
              </Box>
      )
  }},
    { field: 'chains', headerClassName: 'Chains', align: 'center',type: 'number', width: 70,headerAlign: 'center',
    renderCell:(params) =>{
      return(
        <Box pt={0} px={0}>
                <WeaponImageDealer score={params.row.chains} baseId={2}/>
            
              </Box>
      )
  }},
    { field: 'butterfly', headerClassName: 'ButterFly', align: 'center',type: 'number', width: 70,headerAlign: 'center',
    renderCell:(params) =>{
      return(
        <Box pt={0} px={0}>
          <WeaponImageDealer score={params.row.butterfly} baseId={3}/>            
        </Box>
      )
  }},
    { field: 'machete', headerClassName: 'Machete',align: 'center',type: 'number', width: 70,headerAlign: 'center',
    renderCell:(params) =>{
      return(
        <Box pt={0} px={0}>
                <WeaponImageDealer score={params.row.machete} baseId={4}/>
            
              </Box>
      )
  }},
    { field: 'katana', headerClassName: 'Katana', align: 'center',type: 'number', width: 70,headerAlign: 'center',
    renderCell:(params) =>{
      return(
        <Box pt={0} px={0}>
                <WeaponImageDealer score={params.row.katana} baseId={5}/>
            
              </Box>
      )
  }},
    
    { field: 'brutality', headerClassName: 'Brutality', align: 'center',type: 'number', width: 70,headerAlign: 'center',},
    { field: 'courage', headerClassName: 'Courage',align: 'center', type: 'number', width: 70,headerAlign: 'center',},
    { field: 'cunning', headerClassName: 'Cunning', align: 'center',type: 'number', width: 70,headerAlign: 'center',},
    
     
    { field: 'scars', headerClassName: 'Scars',align: 'center', type: 'number', width: 60,headerAlign: 'center',}
    
  
];

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


export default function WeaponTable() {
  const prv = useContext(ProviderContext);
  const [error, setError] = useState();
  const [fighterIsShown, setFighterIsShown] = useState(false);
  const [stakedFYs, setStakedFYs] = useState([]);
  
  const [selectedRaider, setSelectedRaider] = useState([]);    
  const [equipTickets, setEquipTickets] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [pageSize, setPageSize] = useState(10);

  const baseUrl = 'https://the-u.club/reveal/fighteryakuza/';
  const baseWeaponUrl = 'https://the-u.club/reveal/weapons/';

  const ugArenaContract = getUGArena3();
  const ugFYakuzaContract = getUGFYakuza();    
  const ugForgeSmithContract = getUGForgeSmith3();

  const cancelRaiderHandler = (raiderId) => {
    setEquipTickets((prevState) => {
      const cancelledTicket = prevState.filter(ticket => ticket.id === raiderId);
      //if cancelled raider was not in raidticket queue
      if(cancelledTicket.length === 0) return prevState;
      
      return prevState.filter(ticket => ticket.id !== raiderId)
    });
  }   

  let filteredList = stakedFYs?.filter(fy => (fy.isFighter === true));
  filteredList = filteredList?.sort((a, b) => a?.lastRaidTime - b?.lastRaidTime);

  const equipTicketCollector = (newticket) => {      
    hideFighterHandler();

    setEquipTickets((prev) => {
      return prev.filter(ticket => ticket.id !== newticket.id)
    });

    setEquipTickets((prevState) => {
      if (newticket.id >0){
        const newTicket = {
          id: newticket.id,
          imageUrl: newticket.imageUrl,
          weaponId: newticket.weaponId
        }          
      return [...prevState, newTicket];
      }
    })      
  }

  const equipHandler = async() => {      
    //error
    if (equipTickets.length === 0) {
      setError({
      title: 'You must equip fighters first ',
      message: 'Choose wisely...',
      });
      return;
    }       

    const ids = equipTickets?.map(ticket => ticket.id);
    const weaponIds =equipTickets?.map(ticket => ticket.weaponId)  ;    

    const signedContract =  ugForgeSmithContract.connect(prv.provider.getSigner());
    const receipt = await signedContract.functions.equipWeapons(ids,weaponIds) ;
    
    setEquipTickets([]);
    setSelectionModel([]);
  }

  const unequipHandler = async() => {    
    //error
    if (equipTickets.length === 0) {
      setError({
      title: 'You must select fighters first ',
      message: 'Choose wisely...',
      });
      return;
    }       

    const ids = equipTickets?.map(ticket => ticket.id);
    const weaponIds =equipTickets?.map(ticket => ticket.weaponId)  ;    

    const signedContract =  ugForgeSmithContract.connect(prv.provider.getSigner());
    const receipt = await signedContract.functions.unEquipWeapons(ids,weaponIds) ;
    
    setEquipTickets([]);
    setSelectionModel([]);
  }
  
  const selectRaiderHandler = (raider) => {      
      setSelectedRaider(raider[0]);
      setFighterIsShown(true);
    }

    const hideFighterHandler = () => {
      setFighterIsShown(false);
    }


  const errorHandler = () => {
    setError(null);
  }

  const getUpdates = async() => {      
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });      
    const _stakedIds = await ugArenaContract.stakedByOwner(accounts[0]);        
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
  }
    
  }
  

    
  useEffect(() => {   
    const init = async() => {    
      getUpdates();
      
    
      const timer = setInterval(() => {
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
        
      
        {fighterIsShown && <WeaponModal 
          raider={selectedRaider} 
          collectTicket={equipTicketCollector} 
          cancelRaider={cancelRaiderHandler}
          hideModal={hideFighterHandler}
          />}

      <Stack direction="row" spacing={2}>
      <Box pt={1} sx={{
        height: '80vh',
        minHeight: 850,
        '& .TimeLeft': {
          color: 'aqua',
        }, 
        '& .MUG': {
          color: 'aqua',
        }, 
        '& .Level': {
          color: 'aqua',
        }, 
        '& .Brutality': {
          color: 'aqua',
        }, 
        '& .Courage': {
          color: 'aqua',
        }, 
        '& .Cunning': {
          color: 'aqua',
        }, 
        '& .Scars': {
          color: 'aqua',
        }, 
        '& .Knuckles': {
          color: 'aqua',
        }, 
        '& .Chains': {
          color: 'aqua',
        },
        '& .ButterFly': {
          color: 'aqua',
        },
        '& .Machete': {
          color: 'aqua',
        },
        '& .Katana': {
          color: 'aqua',
        },
        '& .MuiCheckbox-root svg': {
          border: 2,
          borderRadius: 1,
          color: 'red'
        },
       
        
      }} 
        style={{height: '80vh',  width: '80%', display: 'flex'}}>
        <DataGrid sx={{height: '80vh', color: 'aqua', fontSize: '.9rem'}}
          rowHeight={100}
          pagination
          pageSize={pageSize}
          onPageSizeChange = {pageSize => setPageSize(pageSize)}
          rowsPerPageOptions={[10, 20, 50, 100]}
          checkboxSelection
          onSelectionModelChange={(ids) => {
            const selectedIDs = new Set(ids);
            const selectRaider = filteredList?.filter((row) =>
              selectedIDs.has(row.id),
            );
            selectRaiderHandler(selectRaider);
          }}
          rows={filteredList}
          columns={columns}
          selectionModel={selectionModel} 
        />
       
      </Box>
      <Stack spacing={3}>
        <Stack className ="box10-bordr" direction="row" sx={{justifyContent: 'space-around'}}>        
          <Button variant="text" justify='center' size='medium' className="equipButton" sx={{ m:1, borderRadius: 5,  border: 2, color: 'darkgreen', backgroundColor: 'aqua', fontFamily: 'Alegreya Sans SC',  fontSize:'1rem', width: 120}}  onClick={equipHandler}>Equip </Button>
          <Button variant="text" justify='center' size='medium' className="unequipButton" sx={{ m:1, borderRadius: 5,  border: 2, color: 'crimson', backgroundColor: 'aqua', fontFamily: 'Alegreya Sans SC',  fontSize:'1rem', width: 110}} onClick={unequipHandler}>unEquip </Button>
        </Stack>
       
       
        <Box className="box20-bordr">
       {equipTickets?.length > 0 && <ImageList sx={{p: 1, width: 250, maxHeight: '60vh'}} cols={1} rowHeight={160}>
        { equipTickets?.map((item) => (
          <ImageListItem key={item.id} p={1}>
             <Stack direction="row" sx={{p: 1,justifyContent: 'space-between', border: 2, borderRadius: 1.5}}>
             <img
              src={item.imageUrl}
              alt={item.id}
              height={120}
            />
            <img
              src={baseWeaponUrl.concat(item.weaponId).concat('.png')}
              alt={item.weaponId}
              height={120}
            />
                             
                        </Stack>
            
          </ImageListItem>
        ))}
    </ImageList>}
        </Box>
        <Stack className ="box10-bordr" direction="row" sx={{justifyContent: 'space-around'}}>        
        <Typography variant='body2' align='center' p={1} maxWidth={300} sx={{fontFamily: 'Alegreya Sans SC', color: 'gold',  fontSize:'1rem'}}>
            Note:
            <Typography component="span" variant='body2' pl={1}  sx={{ fontFamily: 'Alegreya Sans SC', color: 'crimson',  fontSize:'.9rem'}}>Equipping a weapon automatically unequips currently equipped weapon of same type</Typography>                                    
          
          </Typography>  
           </Stack>
        
      </Stack>
      
      </Stack>
      
    </div>
  );
}

