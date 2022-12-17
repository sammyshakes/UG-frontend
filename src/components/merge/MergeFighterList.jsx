import {useState, useEffect} from 'react';
import FighterCard from './FighterMergeCard'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import '../stakedFighterList.css';
import {Button, Stack, ButtonGroup, Typography, Box, ImageList, ImageListItem, ToggleButton, ToggleButtonGroup} from '@mui/material';


export default function MergeFighterList(props) {  
    const[selectedFY, setSelectedFY] = useState(undefined);      
    const[fighterIsSet, setIsFighterSet] = useState(false);  
    const [alignment, setAlignment] = useState('levelUp');
    const[ownedFYs, setOwnedFYs] = useState([]);


    const UnselectHandler = () => {
     //reset selected FYs array
     setSelectedFY(undefined);     
     setIsFighterSet(false);
     props.onSet(undefined);
    }

    const selectedFYHandler = (selectedId, clicked) => {  
      if(fighterIsSet === true) return;
      const selectedFy = ownedFYs?.filter(fy => (fy.id === selectedId));
      if(clicked){
        setSelectedFY(selectedFy[0]);
      }
      else  setSelectedFY(undefined);      
      setIsFighterSet(clicked);
      props.onSet(selectedFy[0]);
    }


    useEffect(() => {    
      setIsFighterSet(false);
      console.log('effect');
      setOwnedFYs([...props.fys]);
      
      // eslint-disable-next-line
    }, [props.fys.length]);

    const handleAlignment = (event, newAlignment) => {
      console.log(newAlignment);
      if (newAlignment !== null) {
        setAlignment(newAlignment);
      }
    };

    let sortedLevelList ;

    if(alignment === 'levelUp') sortedLevelList = ownedFYs?.sort((a, b) => a.id - b.id);
    if(alignment === 'levelDown') sortedLevelList = ownedFYs?.sort((a, b) => b.id - a.id);
    if(alignment === 'brutUp') sortedLevelList = ownedFYs?.sort((a, b) => a.brutality - b.brutality);
    if(alignment === 'brutDown') sortedLevelList = ownedFYs?.sort((a, b) => b.brutality - a.brutality);
    if(alignment === 'courUp') sortedLevelList = ownedFYs?.sort((a, b) => a.courage - b.courage);
    if(alignment === 'courDown') sortedLevelList = ownedFYs?.sort((a, b) => b.courage - a.courage);
    if(alignment === 'cunnUp') sortedLevelList = ownedFYs?.sort((a, b) => a.cunning - b.cunning);
    if(alignment === 'cunnDown') sortedLevelList = ownedFYs?.sort((a, b) => b.cunning - a.cunning);


  return (
    <div>
       
    {fighterIsSet === false && <Box className="staked-bordr" mb={5} maxWidth={480} maxHeight={{sm: 850, md: 850}}>
        {props.isKeeper === true && <Typography variant="h4" align="center" sx={{fontFamily: 'Alegreya Sans SC', p:1, color: 'red' }}>
            Select Keeper Fighter
        </Typography>}
        {props.isKeeper === false && <Typography variant="h4" align="center" sx={{fontFamily: 'Alegreya Sans SC', p:1, color: 'red' }}>
            Select Burner Fighter
        </Typography>}
        <Box  >
          <ToggleButtonGroup
            size="small"
            value={alignment}
            exclusive
            onChange={handleAlignment}
            aria-label="text alignment"
          >
          <ToggleButton value="levelUp" aria-label="levelUp">
            <Typography sx={{fontFamily: 'Alegreya Sans SC', p:1, color: 'cyan' }}>LEVEL</Typography>
            <ArrowUpwardIcon sx={{ color: 'aqua', fontSize: '1.4rem' }}/>
          </ToggleButton>
          <ToggleButton value="levelDown" aria-label="levelDown" >
            <ArrowDownwardIcon sx={{ color: 'aqua', fontSize: '1.4rem' }}/>
          </ToggleButton>
          <ToggleButton value="brutUp" aria-label="brutUp" >
            <Typography sx={{fontFamily: 'Alegreya Sans SC', p:1, color: 'cyan' }}>BR</Typography>
            <ArrowUpwardIcon sx={{ color: 'aqua', fontSize: '1.4rem' }}/>
          </ToggleButton>
          <ToggleButton value="brutDown" aria-label="brutDown">
            <ArrowDownwardIcon sx={{ color: 'aqua', fontSize: '1.4rem' }}/>
          </ToggleButton>   
          <ToggleButton value="courUp" aria-label="courUp" >
            <Typography sx={{fontFamily: 'Alegreya Sans SC', p:1, color: 'cyan' }}>CO</Typography>
            <ArrowUpwardIcon sx={{ color: 'aqua', fontSize: '1.4rem' }}/>
          </ToggleButton>
          <ToggleButton value="courDown" aria-label="courDown">
            <ArrowDownwardIcon sx={{ color: 'aqua', fontSize: '1.4rem' }}/>
          </ToggleButton>   
          <ToggleButton value="cunnUp" aria-label="cunnUp" >
            <Typography sx={{fontFamily: 'Alegreya Sans SC', p:1, color: 'cyan' }}>CU</Typography>
            <ArrowUpwardIcon sx={{ color: 'aqua', fontSize: '1.4rem' }}/>
          </ToggleButton>
          <ToggleButton value="cunnDown" aria-label="cunnDown">
            <ArrowDownwardIcon sx={{ color: 'aqua', fontSize: '1.4rem' }}/>
          </ToggleButton>          
        </ToggleButtonGroup>
      </Box>
    <ImageList sx={{p:1, width: 450, height: 700 }} cols={2} rowHeight={350}  >
      {sortedLevelList?.map((fy) => (
        <ImageListItem key={fy.id}>
            <FighterCard  
            fy={fy}
            id={fy.id}
            imageUrl={fy.imageUrl}
            onSelected={selectedFYHandler}
            emptyArray={selectedFY === undefined ? true : false}
            keeper={props.isKeeper}
            />
         
        </ImageListItem>
      ))}
    </ImageList>
    
    
   
    </Box>}
    {fighterIsSet === true &&
      <Box sx={{ p:1, width: 300, height: 500, color: 'aqua' }}>
       {props.isKeeper === true && <Typography align='center' sx={{fontFamily: 'Alegreya Sans SC', p:1, color: 'cyan', fontSize: '1.2rem' }}>KEEPER FIGHTER</Typography>}
       {props.isKeeper === false && <Typography align='center' sx={{fontFamily: 'Alegreya Sans SC', p:1, color: 'red', fontSize: '1.2rem' }}>BURNER FIGHTER</Typography>}
       <FighterCard  
        id={selectedFY?.id}
        fy={selectedFY}
        brutality= {selectedFY?.brutality}
        courage={selectedFY?.courage}
        cunning={selectedFY?.cunning}
        level={selectedFY?.level}
        rank={selectedFY?.rank}
        isFighter={selectedFY?.isFighter}
        imageUrl={selectedFY?.imageUrl}
        onSelected={selectedFYHandler}
        emptyArray={selectedFY === undefined ? true : false}
        keeper={props.isKeeper}
       />
         <Stack direction="row"   sx={{mt: 1, justifyContent: 'center' }}>
       <ButtonGroup  variant="contained" color="error" sx={{display: 'flex' , justifyContent: 'center', borderColor: 'red', border: 3  }}>
          <Button  variant="text" size="small" sx={{ backgroundColor: 'black', color: 'red'}} onClick={UnselectHandler} >Cancel </Button>
        </ButtonGroup>
        </Stack>
      </Box>
    }
    
    </div>
  );
}

