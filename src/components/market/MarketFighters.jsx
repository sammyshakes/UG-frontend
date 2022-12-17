import {useState, useEffect} from 'react'
import {useQuery, gql} from '@apollo/client';
import {Box, Stack,ImageList, ImageListItem} from '@mui/material';
import {MarketFighterCard } from './MarketFighterCard';
import FighterCart from './FighterCart';
import CancelFighterCart from './CancelFighterCart';
import { getUGFYakuza, getUGMarket, getEthers } from '../../utils.js';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';



const GET_MARKET = gql`
  query GetMarket {
    listings(first: 1000, where: { enabled: true, sold: false, tokenAddress: "0xB1d066a7CeAF92ff15B39668a44dEf03C17fAc9e" },  orderBy: timestamp, orderDirection: desc)  {
        id
        listingId
        tokenId
        price
        amount
        owner
        tokenAddress
        timestamp
        enabled
        sold
      }
      marketStats {
        id
        totalVolume
        totalSales
        highestSalePrice
      }
  }
`;


const GET_RECENTLY_SOLD_FIGHTER = gql`
query GetMarket($sold: Boolean, $enabled: Boolean)  {
  listings(first: 1000, where: {enabled: $enabled, sold: $sold, tokenAddress: "0xB1d066a7CeAF92ff15B39668a44dEf03C17fAc9e" },  orderBy: timestamp, orderDirection: desc)  {
      id
      listingId
      tokenId
      price
      amount
      owner
      tokenAddress
      timestamp
      enabled
      sold
    }
    marketStats {
      id
      totalVolume
      totalSales
      highestSalePrice
    }
}
`;


const MarketFighters = (props) => {
  
  const [sold, setSold] = useState(false);
  const recentlySoldHandler = (sold) => {
    setSold(sold);
  };
  
  const { loading, error, data } = useQuery(GET_RECENTLY_SOLD_FIGHTER, {
    variables: { sold: sold, enabled: !sold},
  });

  if (loading ) return <p>Loading...</p>;
  if (error ) {
    
    return <p>Error :(</p>;
  }
    
    
  return (
    <DisplayMarket data={data} sold={sold} account={props.account} onRecentlySoldChange={recentlySoldHandler}/>
  )
    
  }   

export default MarketFighters;

function DisplayMarket(props) {        
   

  const [sortValue, setSortValue] = useState('priceUp');
  const [checkedTier1, setCheckedTier1] = useState(false);
  const [checkedTier2, setCheckedTier2] = useState(false);
  const [checkedTier3, setCheckedTier3] = useState(false);
  const [checkedTier4, setCheckedTier4] = useState(false);
  const [checkedTier5, setCheckedTier5] = useState(false);
  const [checkedTier6, setCheckedTier6] = useState(false);
  const [checkedTier7, setCheckedTier7] = useState(false);
  const [checkedTier8, setCheckedTier8] = useState(false);
  const [checkedTier9, setCheckedTier9] = useState(false);
  const [checkedMyListings, setCheckedMyListings] = useState(false);
 // const [filteredFighters, setFilteredFighters] = useState([]);
  const [queriedFighters, setQueriedFighters] = useState([]);
  const [fighterCart, setFighterCart] = useState([]);  
  
  const [cancelFighterCart, setCancelFighterCart] = useState([]);  
  const [totalBloodFee, setTotalBloodFee] = useState(0);
  const ugFYakuzaContract = getUGFYakuza();
  const ugMarketContract = getUGMarket();   
  const provider = getEthers(); 

  const handleRadioChange = (event) => {
    setSortValue(event.target.value);
  };

  const handleChange1 = (event) => {
    setCheckedTier1(event.target.checked);
  };
  const handleChange2 = (event) => {
    setCheckedTier2(event.target.checked);
  };
  const handleChange3 = (event) => {
    setCheckedTier3(event.target.checked);
  };
  const handleChange4 = (event) => {
    setCheckedTier4(event.target.checked);
  };
  const handleChange5 = (event) => {
    setCheckedTier5(event.target.checked);
  };
  const handleChange6 = (event) => {
    setCheckedTier6(event.target.checked);
  };
  const handleChange7 = (event) => {
    setCheckedTier7(event.target.checked);
  };
  const handleChange8 = (event) => {
    setCheckedTier8(event.target.checked);
  };
  const handleChange9 = (event) => {
    setCheckedTier9(event.target.checked);
  };
  const handleMyListings = (event) => {
    setCheckedMyListings(event.target.checked);
  };
  const handleRecentlySold = (event) => {
    props.onRecentlySoldChange(event.target.checked)
  };
 

  const getUpdates = async() => {      
    const fyakuzaIds = props?.data?.listings?.map(listing => listing?.tokenId);             
    const fyakuzas = await ugFYakuzaContract.getFighters(fyakuzaIds);     
    
    //filter out yakuza
    const fighters = fyakuzas?.map((fyakuza, i, arr) => {
      
     if( fyakuza?.isFighter){
      const fighterObj = {
        ...fyakuza,
        ...props?.data?.listings[i]
      };
      return fighterObj;
     }
    });
    
    const queriedFighters = fighters?.filter(fighter => fighter !== undefined );
    setQueriedFighters(queriedFighters);
    
  }

  useEffect(() => {     
    getUpdates();
    // eslint-disable-next-line
  }, [props.data]);   

  useEffect(() => {     
    const init = async() => {            
        getUpdates();
    }
    init();

    
    // eslint-disable-next-line
  }, []);   


  const fighterCartCollector = (newFighter) => {  

    setFighterCart((prev) => {
      return prev.filter(fighter => fighter.id !== newFighter.id)
    });

    setFighterCart((prevState) => {
      if (newFighter.id >0){
        const _newFighter = {
          listingId: newFighter.listingId,
          id: newFighter.id,
          imageUrl: newFighter.imageUrl,
          price: newFighter.price,
          level: newFighter.level
        }          
      return [...prevState, _newFighter];
      }
    })      

    setTotalBloodFee((prevFee) => {            
      return (Number(prevFee) + Number(newFighter.price));
    })
  }

  const cancelListingHandler = (cancelledListing) => {  

    setCancelFighterCart((prev) => {
      return prev.filter(listing => listing.id !== cancelledListing.id)
    });

    setCancelFighterCart((prevState) => {
      if (cancelledListing.id >0){
        const _cancelledListing = {
          listingId: cancelledListing.listingId,
          id: cancelledListing.id,
          imageUrl: cancelledListing.imageUrl,
          price: cancelledListing.price,
          level: cancelledListing.level
        }          
      return [...prevState, _cancelledListing];
      }
    })  
  }   



  let filteredFighters = [];
  //first filter, then sort
  if(checkedTier1){
    filteredFighters = filteredFighters.concat(queriedFighters?.filter(fighter => (fighter.level < 4)));
  }
  if(checkedTier2){
    filteredFighters = filteredFighters.concat(queriedFighters?.filter(fighter => (fighter.level > 3 && fighter.level < 7)));
  }
  if(checkedTier3){
    filteredFighters = filteredFighters.concat(queriedFighters?.filter(fighter => (fighter.level > 6 && fighter.level < 10)));
  }
  if(checkedTier4){
    filteredFighters = filteredFighters.concat(queriedFighters?.filter(fighter => (fighter.level > 9 && fighter.level < 13)));
  }
  if(checkedTier5){
    filteredFighters = filteredFighters.concat(queriedFighters?.filter(fighter => (fighter.level > 12 && fighter.level < 16)));
  }
  if(checkedTier6){
    filteredFighters = filteredFighters.concat(queriedFighters?.filter(fighter => (fighter.level > 15 && fighter.level < 19)));
  }
  if(checkedTier7){
    filteredFighters = filteredFighters.concat(queriedFighters?.filter(fighter => (fighter.level > 18 && fighter.level < 22)));
  }
  if(checkedTier8){
    filteredFighters = filteredFighters.concat(queriedFighters?.filter(fighter => (fighter.level >21 && fighter.level < 25)));
  }
  if(checkedTier9){
    filteredFighters = filteredFighters.concat(queriedFighters?.filter(fighter => (fighter.level > 24)));
  }
 

  if(
    !checkedTier1 &&
    !checkedTier2 &&
    !checkedTier3 &&
    !checkedTier4 &&
    !checkedTier5 &&
    !checkedTier6 &&
    !checkedTier7 &&
    !checkedTier8 &&
    !checkedTier9 
  ) filteredFighters = queriedFighters;

  if(checkedMyListings){
    filteredFighters = filteredFighters?.filter(listing => (listing.owner === props.account));
  }

  //now sort
  if(sortValue === "timestamp"){
    filteredFighters = filteredFighters?.sort((a, b) => b.timestamp - a.timestamp);
  }
  if(sortValue === "priceUp"){
    filteredFighters = filteredFighters?.sort((a, b) => a.price - b.price);
  }
  if(sortValue === "priceDown"){
    filteredFighters = filteredFighters?.sort((a, b) => b.price - a.price);
  }
  if(sortValue === "brutality"){
    filteredFighters = filteredFighters?.sort((a, b) => b.brutality - a.brutality);
  }
  if(sortValue === "courage"){
    filteredFighters = filteredFighters?.sort((a, b) => b.courage - a.courage);
  }
  if(sortValue === "cunning"){
    filteredFighters = filteredFighters?.sort((a, b) => b.cunning - a.cunning);
  }
  if(sortValue === "knuckles"){
    filteredFighters = filteredFighters?.sort((a, b) => b.knuckles - a.knuckles);
  }
  if(sortValue === "chains"){
    filteredFighters = filteredFighters?.sort((a, b) => b.chains - a.chains);
  }
  if(sortValue === "butterfly"){
    filteredFighters = filteredFighters?.sort((a, b) => b.butterfly - a.butterfly);
  }
  if(sortValue === "machete"){
    filteredFighters = filteredFighters?.sort((a, b) => b.machete - a.machete);
  }
  if(sortValue === "katana"){
    filteredFighters = filteredFighters?.sort((a, b) => b.katana - a.katana);
  }

  const fulfillListings = async() => {    
    const fighterIds = fighterCart?.map(fighter => {return Number(fighter.listingId)});
    const signedContract = ugMarketContract.connect(provider.getSigner());
    await signedContract.functions.fulfillListings(fighterIds, ugFYakuzaContract.address);
  }   

  const cancelListings = async() => {    
    const fighterIds = cancelFighterCart?.map(fighter => {return Number(fighter.listingId)});
    const signedContract = ugMarketContract.connect(provider.getSigner());
    await signedContract.functions.cancelListings(fighterIds, ugFYakuzaContract.address);
    setCancelFighterCart([]);
  }   
 

    return ( 
      <Box>
        {cancelFighterCart?.length > 0 && <CancelFighterCart fighters={cancelFighterCart} totalBloodFee={totalBloodFee} onCancel={cancelListings}/>}
      {fighterCart?.length > 0 && <FighterCart fighters={fighterCart} totalBloodFee={totalBloodFee} onBuy={fulfillListings}/>}
      <Box className="mkt-box" m={1}>
        <Stack direction="row" sx={{justifyContent: 'space-between'}}>
          <Stack>
      <FormLabel style={{paddingLeft: 2, color: 'red'}} id="demo-controlled-radio-buttons-group">Level Filter:</FormLabel>
      <FormGroup row style={{paddingLeft: 5, align: 'center', color: 'aqua'}} sx={{justifyContent: 'space-evenly'}}>
        <FormControlLabel control={<Checkbox size="xsmall"  style={{color: 'aqua'}}/>} label="0-3" 
          checked={checkedTier1}
          onChange={handleChange1}/>
        <FormControlLabel control={<Checkbox size="xsmall" style={{color: 'aqua'}}/>} label="4-6"  
          checked={checkedTier2}
          onChange={handleChange2}/>
        <FormControlLabel control={<Checkbox size="xsmall" style={{color: 'aqua'}}/>} label="7-9"  
          checked={checkedTier3}
          onChange={handleChange3}/>
        <FormControlLabel control={<Checkbox size="xsmall" style={{color: 'aqua'}}/>} label="10-12"  
          checked={checkedTier4}
          onChange={handleChange4}/>
        <FormControlLabel control={<Checkbox size="xsmall" style={{color: 'aqua'}}/>} label="13-15"  
          checked={checkedTier5}
          onChange={handleChange5}/>
        <FormControlLabel control={<Checkbox size="xsmall" style={{color: 'aqua'}}/>} label="16-18"  
          checked={checkedTier6}
          onChange={handleChange6}/>
        <FormControlLabel control={<Checkbox size="xsmall" style={{color: 'aqua'}}/>} label="19-21"  
          checked={checkedTier7}
          onChange={handleChange7}/>
        <FormControlLabel control={<Checkbox size="xsmall" style={{color: 'aqua'}}/>} label="22-24"  
          checked={checkedTier8}
          onChange={handleChange8}/>
        <FormControlLabel control={<Checkbox size="xsmall" style={{color: 'aqua'}}/>} label="25 and Up"  
          checked={checkedTier9}
          onChange={handleChange9}/>
      </FormGroup>
      </Stack>
      <FormGroup row style={{paddingLeft: 5, align: 'center', color: 'aqua'}} sx={{justifyContent: 'space-evenly'}}>
       
        <FormControlLabel control={<Checkbox size="xsmall" style={{color: 'aqua'}}/>} label="Recently Sold"  
          checked={props.sold}
          onChange={handleRecentlySold}
          
          labelPlacement="bottom"/>
      </FormGroup>
      <Stack>
            
        <FormGroup row style={{  color: 'aqua'}} >
        
           <FormControlLabel control={<Checkbox size="xsmall" style={{color: 'aqua'}}/>} label="My Listings"  
          checked={checkedMyListings}
          onChange={handleMyListings}
          labelPlacement="bottom"/>
        
      </FormGroup>
      </Stack>
      </Stack>
      <Stack direction="row" sx={{justifyContent: 'space-between'}}>
          <FormControl>
          <FormLabel style={{color: 'red', fontSize: '.8rem'}} id="demo-controlled-radio-buttons-group">Sort By:</FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={sortValue}
            onChange={handleRadioChange}
            defaultValue="timestamp"
          >
             <FormControlLabel 
              value="timestamp" 
              style={{color: 'aqua'}}
              control={
                <Radio
                  size="xsmall"
                  sx={{
                    color: 'aqua',
                    '&.Mui-checked': {
                      color: 'red',
                      
                    },
                  }} 
                />} 
              label="Recent" 
              labelPlacement="bottom"
            />
            <FormControlLabel 
              value="priceUp" 
              style={{color: 'aqua'}}
              control={
                <Radio
                  size="xsmall"
                  sx={{
                    color: 'aqua',
                    '&.Mui-checked': {
                      color: 'red',
                      
                    },
                  }} 
                />} 
              label="Price Low" 
              labelPlacement="bottom"
            />
            <FormControlLabel value="priceDown" style={{color: 'aqua'}} control={
                <Radio
                size="xsmall"
                  sx={{
                    color: 'aqua',
                    '&.Mui-checked': {
                      color: 'red',
                    },
                  }} 
                />}  label="Price High" labelPlacement="bottom"/>
            <FormControlLabel value="brutality" style={{color: 'aqua'}} control={
                <Radio
                size="xsmall"
                  sx={{
                    color: 'aqua',
                    '&.Mui-checked': {
                      color: 'red',
                    },
                  }} 
                />} label="Brutality" labelPlacement="bottom"/>
            <FormControlLabel value="courage" style={{color: 'aqua'}} control={
                <Radio
                size="xsmall"
                  sx={{
                    color: 'aqua',
                    '&.Mui-checked': {
                      color: 'red',
                    },
                  }} 
                />} label="Courage" labelPlacement="bottom"/>
            <FormControlLabel value="cunning" style={{color: 'aqua'}} control={
                <Radio
                size="xsmall"
                  sx={{
                    color: 'aqua',
                    '&.Mui-checked': {
                      color: 'red',
                    },
                  }} 
                />} label="Cunning" labelPlacement="bottom"/>
            <FormControlLabel value="knuckles" style={{color: 'aqua'}} control={
                <Radio
                size="xsmall"
                  sx={{
                    color: 'aqua',
                    '&.Mui-checked': {
                      color: 'red',
                    },
                  }} 
                />} label="Knuckles" labelPlacement="bottom"/>
            <FormControlLabel value="chains" style={{color: 'aqua'}} control={
                <Radio
                size="xsmall"
                  sx={{
                    color: 'aqua',
                    '&.Mui-checked': {
                      color: 'red',
                    },
                  }} 
                />} label="Chains" labelPlacement="bottom"/>
            <FormControlLabel value="butterfly" style={{color: 'aqua'}} control={
                <Radio
                size="xsmall"
                  sx={{
                    color: 'aqua',
                    '&.Mui-checked': {
                      color: 'red',
                    },
                  }} 
                />} label="Butterfly" labelPlacement="bottom"/>
            <FormControlLabel value="machete" style={{color: 'aqua'}} control={
                <Radio
                size="xsmall"
                  sx={{
                    color: 'aqua',
                    '&.Mui-checked': {
                      color: 'red',
                    },
                  }} 
                />} label="Machete" labelPlacement="bottom"/>
            <FormControlLabel value="katana" style={{color: 'aqua'}} control={
                <Radio
                size="xsmall"
                  sx={{
                    color: 'aqua',
                    '&.Mui-checked': {
                      color: 'red',
                    },
                  }} 
                />} label="Katana" labelPlacement="bottom"/>
          </RadioGroup>
        </FormControl>
        
      </Stack>
      </Box>
        <ImageList sx={{p:1,  maxHeight: '100vh'}} cols={3} rowHeight={360}  >
        {filteredFighters?.map(({ 
            id, 
            listingId,
            tokenId, 
            price, 
            amount, 
            owner, 
            timestamp, 
            tokenAddress, 
            lastLevelUpgradeTime,
            lastRaidTime,
            imageId,
            brutality,
            courage,
            cunning,
            scars,
            knuckles,
            chains,
            butterfly,
            machete,
            katana,
            level,
            enabled, 
            sold 
        }) => (
            <ImageListItem key={id}  >
              <MarketFighterCard
                id = {id}
                tokenId = {tokenId}
                price = {price}
                amount = {amount}
                owner = {owner}
                timestamp = {timestamp}
                imageId = {imageId}
                level = {level}
                brutality = {brutality}
                courage = { courage}
                cunning={cunning}
                scars={scars}
                knuckles={knuckles}
                chains={chains}
                butterfly={butterfly}
                machete={machete}
                katana={katana}
                lastLevelUpgradeTime = {lastLevelUpgradeTime}
                lastRaidTime = {lastRaidTime}
                tokenAddress = {tokenAddress}
                enabled = {enabled}
                sold = {sold}
                onAddToCart = {fighterCartCollector}
                onCancelListing= {cancelListingHandler}
                account = {props.account}
                />
            </ImageListItem>
          ))}
          </ImageList>
          </Box>
          );
          
  }
