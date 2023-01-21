import { useState} from 'react';
import { useQuery, gql } from '@apollo/client';
import {Container, Box, Stack, Typography, ImageList, ImageListItem} from '@mui/material';
import SimpleDateTime  from 'react-simple-timestamp-to-date';
import { flexbox } from '@mui/system';

const GET_RAIDS = gql`
  query GetRaids {
    raids(first: 200, orderBy: timestamp, orderDirection: desc) {
        id
        raidId
        fightclubId
        levelTier
        sizeTier
        yakShareStolen
        timestamp
        tickets (orderBy:place, orderDirection: asc) {
          id
          raider
          score
          sweat
          level
          brutality
          courage
          cunning
          knuckles
          chains
          butterfly
          machete
          katana
          scars
          raidWinnings
          place
          entryFee
        }
      }
  }
`;

const GET_RAIDS_FIGHTCLUB = gql`
  query GetRaids($fightclub: BigInt!) {
    raids(first: 200, where: { fightclubId: $fightclub}, orderBy: timestamp, orderDirection: desc) {
        id
        raidId
        fightclubId
        levelTier
        sizeTier
        yakShareStolen
        timestamp
        tickets (orderBy:place, orderDirection: asc) {
          id
          raider
          score
          sweat
          level
          brutality
          courage
          cunning
          knuckles
          chains
          butterfly
          machete
          katana
          scars
          raidWinnings
          place
          entryFee
        }
      }
  }
`;

const GET_RAIDS_FIGHTER = gql`
  query GetRaids($fighter: BigInt!) {
    raids(first: 200, where: { tickets_: { raider: $fighter } },orderBy:  timestamp, orderDirection: desc) {
      id
      raidId
      fightclubId
      levelTier
      sizeTier
      yakShareStolen
      timestamp
      tickets(orderBy: place, orderDirection: asc) {
        id
        raider
        score
        sweat
        level
        brutality
        courage
        cunning
        knuckles
        chains
        butterfly
        machete
        katana
        scars
        raidWinnings
        place
        entryFee
      }
    }
  }
`;



const RaidStats = () => {
  const[enteredFightClub, setEnteredFightClub] = useState('');
  const[enteredFighter, setEnteredFighter] = useState('');
  const[queryState, setQueryState] = useState('RECENT');

  const enteredFightclubChangeHandler = (event) => {
   setEnteredFightClub(event.target.value);
  }

  const submitFightclubHandler = async (event) => {
      event.preventDefault();
      setQueryState('FIGHTCLUB');
  }

  const enteredFighterChangeHandler = (event) => {
    console.log("1",event.target.value);
   setEnteredFighter(event.target.value);
  }

  const submitFighterHandler = async (event) => {
      event.preventDefault();      
      setQueryState('FIGHTER');
      //setEnteredFighter('');
  }

  if(queryState === 'RECENT') return (
    <Box >
      <Stack direction="row" spacing={2} sx={{p: 2,  justifyContent: 'space-evenly'}}>
        <div className="col-4 mt-2">
          <form onSubmit={submitFighterHandler}>
            <div className="input-group">
              <input type="number" className="form-control" placeholder="Fighter Id" aria-describedby="button-addon2" value={enteredFighter}  onChange={enteredFighterChangeHandler}/>
              <button className="btn btn-outline-info" type="submit" id="button-addon2"  >Get Fighter's Raids</button>
            </div>
          </form>
        </div>
        <div className="col-4 mt-2">
          <form onSubmit={submitFightclubHandler}>
            <div className="input-group">
              <input type="number" className="form-control" placeholder="FightClub Id" aria-describedby="button-addon2" value={enteredFightClub}  onChange={enteredFightclubChangeHandler}/>
              <button className="btn btn-outline-info" type="submit" id="button-addon2"  >Get Fight Club Raids</button>
            </div>
          </form>
        </div>
      </Stack>
      <RaidStatsRecent/>
    </Box>
  )

  if(queryState === 'FIGHTER') return (
    <Box >
      <Stack direction="row" spacing={2} sx={{p: 2,  justifyContent: 'space-evenly'}}>
        <div className="col-4 mt-2">
          <form onSubmit={submitFighterHandler}>
            <div className="input-group">
              <input type="number" className="form-control" placeholder="Fighter Id" aria-describedby="button-addon2" value={enteredFighter}  onChange={enteredFighterChangeHandler}/>
              <button className="btn btn-outline-info" type="submit" id="button-addon2"  >Get Fighter's Raids</button>
            </div>
          </form>
        </div>
        <div className="col-4 mt-2">
          <form onSubmit={submitFightclubHandler}>
            <div className="input-group">
              <input type="number" className="form-control" placeholder="FightClub Id" aria-describedby="button-addon2" value={enteredFightClub}  onChange={enteredFightclubChangeHandler}/>
              <button className="btn btn-outline-info" type="submit" id="button-addon2"  >Get Fight Club Raids</button>
            </div>
          </form>
        </div>
      </Stack>
      <RaidFighters id={enteredFighter}/>
    </Box>
  )

  if(queryState === 'FIGHTCLUB') return (
    <Box >
      <Stack direction="row" spacing={2} sx={{p: 2,  justifyContent: 'space-evenly'}}>
        <div className="col-4 mt-2">
          <form onSubmit={submitFighterHandler}>
            <div className="input-group">
              <input type="number" className="form-control" placeholder="Fighter Id" aria-describedby="button-addon2" value={enteredFighter}  onChange={enteredFighterChangeHandler}/>
              <button className="btn btn-outline-info" type="submit" id="button-addon2"  >Get Fighter's Raids</button>
            </div>
          </form>
        </div>
        <div className="col-4 mt-2">
          <form onSubmit={submitFightclubHandler}>
            <div className="input-group">
              <input type="number" className="form-control" placeholder="FightClub Id" aria-describedby="button-addon2" value={enteredFightClub}  onChange={enteredFightclubChangeHandler}/>
              <button className="btn btn-outline-info" type="submit" id="button-addon2"  >Get Fight Club Raids</button>
            </div>
          </form>
        </div>
      </Stack>
    <RaidFightclubs id={enteredFightClub}/>
    </Box>
  )
  
}

export default RaidStats


const RaidStatsRecent = () => {
  const { loading, error, data } = useQuery(GET_RAIDS);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <DisplayRaids data={data}/>
  )
}

const RaidFighters = (props) => {
  const { loading, error, data } = useQuery(GET_RAIDS_FIGHTER, {
    variables: { fighter: props.id},
  });
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <DisplayRaids data={data} fighter={true}/>
  )
}

const RaidFightclubs = (props) => {
  const { loading, error, data } = useQuery(GET_RAIDS_FIGHTCLUB, {
    variables: { fightclub: props.id},
  });
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <DisplayRaids data={data} />
  )
}

function DisplayRaids(props) {
   
  
    return ( 
        <ImageList sx={{p:1, maxWidth: 900, maxHeight: '100vh'}} cols={1} rowHeight={275}  >
        {props.data.raids.map(({ id, levelTier, sizeTier, fightclubId, yakShareStolen,timestamp, tickets }) => (
            <ImageListItem key={id}  >
        <Box className="sweat-box">
      <Container key={id}>        
        <Stack direction="row" sx={{justifyContent: 'space-between'}}>   
            <Stack  align="left" spacing={1} sx={{}}>
                <Typography variant='h1'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.25rem', color: 'aqua'}}>Raid: {id}</Typography>
                <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'aqua'}}><SimpleDateTime dateSeparator="/" timeSeparator=":">{Number(timestamp)}</SimpleDateTime></Typography>
                <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1rem', color: 'deepskyblue'}}>Level Tier: {levelTier}</Typography>   
                <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'1rem', color: 'deepskyblue'}}>Size Tier: {sizeTier}</Typography>      
                <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'aqua'}}>Yakuza Share Stolen: {yakShareStolen.toString()}</Typography>
                <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'red'}}>Raid Entry Fee: {tickets[0]?.entryFee}</Typography>
              </Stack>                  
            <Stack  align="left" spacing={1} sx={{}}>
                <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.25rem', color: 'aqua'}}>1st: #{tickets[0]?.raider}</Typography>                            
                <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1rem', color: 'lawngreen'}}>Score: {tickets[0]?.score}</Typography> 
                <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'red'}}>Level: {tickets[0]?.level}  </Typography>                 
                <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'red'}}> Scars: {tickets[0]?.scars}</Typography> 
                <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'deepskyblue'}}>Sweat: {tickets[0]?.sweat}</Typography>
                <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.85rem', color: 'gold'}}>Br: {tickets[0]?.brutality}  Co: {tickets[0]?.courage}  Cu: {tickets[0]?.cunning}</Typography>
                {Number(levelTier) > 3 && <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'orange'}}>Knuckles: {tickets[0]?.knuckles}</Typography>}
                {Number(levelTier) > 6 && <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'orange'}}>Chains: {tickets[0]?.chains}</Typography>}
                <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'red'}}>Blood Won: {tickets[0]?.raidWinnings}</Typography>
            </Stack>
            <Stack  align="left" spacing={1} sx={{}}>                          
                <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.25rem', color: 'aqua'}}>2nd: #{tickets[1]?.raider}</Typography>
                <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1rem', color: 'lawngreen'}}>Score: {tickets[1]?.score}</Typography> 
                <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'red'}}>Level: {tickets[1]?.level}</Typography>  
                <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'red'}}> Scars: {tickets[1]?.scars}</Typography> 
                <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'deepskyblue'}}>Sweat: {tickets[1]?.sweat}</Typography>
                <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.85rem', color: 'gold'}}>Br: {tickets[1]?.brutality}  Co: {tickets[1]?.courage}  Cu: {tickets[1]?.cunning}</Typography>
                {Number(levelTier) > 3 && <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'orange'}}>Knuckles: {tickets[1]?.knuckles}</Typography>}
                {Number(levelTier) > 6 && <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'orange'}}>Chains: {tickets[1]?.chains}</Typography>}
                <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'red'}}>Blood Won: {tickets[1]?.raidWinnings}</Typography>
            </Stack>
            <Stack  align="left" spacing={1} sx={{}}>               
                <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.25rem', color: 'aqua'}}>3rd: #{tickets[2]?.raider}</Typography>
                <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1rem', color: 'lawngreen'}}>Score: {tickets[2]?.score}</Typography> 
                <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'red'}}>Level: {tickets[2]?.level}</Typography>      
                <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'red'}}> Scars: {tickets[2]?.scars}</Typography>        
                <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'deepskyblue'}}>Sweat: {tickets[2]?.sweat}</Typography>
                <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.85rem', color: 'gold'}}>Br: {tickets[2]?.brutality}  Co: {tickets[2]?.courage}  Cu: {tickets[2]?.cunning}</Typography>
                {Number(levelTier) > 3 && <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'orange'}}>Knuckles: {tickets[2]?.knuckles}</Typography>}
                {Number(levelTier) > 6 && <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'orange'}}>Chains: {tickets[2]?.chains}</Typography>}
                <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'red'}}>Blood Won: {tickets[2]?.raidWinnings}</Typography>
            </Stack>        
            <Stack  align="left" spacing={1} sx={{}}>               
                <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1.25rem', color: 'aqua'}}>4th: #{tickets[3]?.raider}</Typography>
                <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'1rem', color: 'lawngreen'}}>Score: {tickets[3]?.score}</Typography> 
                <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'red'}}>Level: {tickets[3]?.level}</Typography>      
                <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'red'}}> Scars: {tickets[3]?.scars}</Typography>        
                <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'deepskyblue'}}>Sweat: {tickets[3]?.sweat}</Typography>
                <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.85rem', color: 'gold'}}>Br: {tickets[3]?.brutality}  Co: {tickets[3]?.courage}  Cu: {tickets[3]?.cunning}</Typography>
                {Number(levelTier) > 3 && <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'orange'}}>Knuckles: {tickets[3]?.knuckles}</Typography>}
                {Number(levelTier) > 6 && <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.8rem', color: 'orange'}}>Chains: {tickets[3]?.chains}</Typography>}
                <Typography variant='body2'  sx={{fontFamily: 'Alegreya Sans SC',  fontSize:'.9rem', color: 'red'}}>Blood Won: {tickets[3]?.raidWinnings}</Typography>
            </Stack>         
            
        </Stack>
      </Container>
      </Box>
      </ImageListItem>
    ))}
    </ImageList>
    );
  }
