import {useState, useEffect} from 'react'
import {useQuery, gql} from '@apollo/client';
import {Box, Stack, ImageList, ImageListItem, Typography} from '@mui/material';
import {MarketAmuletCard } from './MarketAmuletCard';
import RingCart from './AmuletCart';
import CancelRingCart from './CancelRingCart';
import {  getUGNft2, getUGMarket, getEthers } from '../../utils.js';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';

const GET_MARKET = gql`
query GetMarket($sold: Boolean, $enabled: Boolean)  {
  listings(first: 1000, where: {enabled: $enabled, sold: $sold, tokenAddress: "0xca20c0Aa60ce8877a39AB289620435b02a5b07a6", tokenId_gt: "10000", tokenId_lt: "15000" },  orderBy: timestamp, orderDirection: desc)  {
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
}
`;

const MarketAmulets = (props) => {
  const [sold, setSold] = useState(false);
  const recentlySoldHandler = (sold) => {
    setSold(sold);
  };
  
  const { loading, error, data } = useQuery(GET_MARKET, {
    variables: { sold: sold, enabled: !sold},
  });
     
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    
    else return (
      <DisplayMarket data={data} sold={sold} account={props?.account} onRecentlySoldChange={recentlySoldHandler}/>
    )
    
  }  
  

export default MarketAmulets;

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
  const [checkedTier10, setCheckedTier10] = useState(false);
  const [checkedTier11, setCheckedTier11] = useState(false);
  const [checkedTier12, setCheckedTier12] = useState(false);
  const [checkedTier13, setCheckedTier13] = useState(false);
  const [checkedTier14, setCheckedTier14] = useState(false);
  const [checkedTier15, setCheckedTier15] = useState(false);
  const [checkedMyListings, setCheckedMyListings] = useState(false);
 
 // const [filteredFighters, setFilteredFighters] = useState([]);
  const [queriedListings, setQueriedListings] = useState([]);
  const [fighterCart, setFighterCart] = useState([]);  
  const [cancelFighterCart, setCancelFighterCart] = useState([]);  
  const [totalBloodFee, setTotalBloodFee] = useState(0);
  const ugNftContract = getUGNft2();   
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
  const handleChange10 = (event) => {
    setCheckedTier10(event.target.checked);
  };
  const handleChange11 = (event) => {
    setCheckedTier11(event.target.checked);
  };
  const handleChange12 = (event) => {
    setCheckedTier12(event.target.checked);
  };
  const handleChange13 = (event) => {
    setCheckedTier13(event.target.checked);
  };
  const handleChange14 = (event) => {
    setCheckedTier14(event.target.checked);
  };
  const handleChange15 = (event) => {
    setCheckedTier15(event.target.checked);
  };
  const handleMyListings = (event) => {
    setCheckedMyListings(event.target.checked);
  };
  const handleRecentlySold = (event) => {
    props.onRecentlySoldChange(event.target.checked)
  };


  const getUpdates = async() => {        
    const ringIds = props.data?.listings?.map(listing => listing?.tokenId);    
    
    const fightClubs = ringIds?.map((fclub, i, arr) => {     
      const fightclubObj = {
        ...ringIds[i],
        ...props?.data?.listings[i]
      };
      return fightclubObj;     
    });
    const queriedListings = fightClubs?.filter(fighter => fighter !== undefined );
    setQueriedListings(queriedListings);    
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
          price: cancelledListing.price,
          level: cancelledListing.level
        }          
      return [...prevState, _cancelledListing];
      }
    })  
  }   

  let filteredListings = [];
  //first filter, then sort
  if(checkedTier1){
    filteredListings = filteredListings.concat(queriedListings?.filter(listing => (listing.level === 1)));
  }
  if(checkedTier2){
    filteredListings = filteredListings.concat(queriedListings?.filter(listing => (listing.level === 2 )));
  }
  if(checkedTier3){
    filteredListings = filteredListings.concat(queriedListings?.filter(listing => (listing.level === 3 )));
  }
  if(checkedTier4){
    filteredListings = filteredListings.concat(queriedListings?.filter(listing => (listing.level === 4 )));
  }
  if(checkedTier5){
    filteredListings = filteredListings.concat(queriedListings?.filter(listing => (listing.level === 5 )));
  }
  if(checkedTier6){
    filteredListings = filteredListings.concat(queriedListings?.filter(listing => (listing.level === 6 )));
  }
  if(checkedTier7){
    filteredListings = filteredListings.concat(queriedListings?.filter(listing => (listing.level === 7 )));
  }
  if(checkedTier8){
    filteredListings = filteredListings.concat(queriedListings?.filter(listing => (listing.level === 8 )));
  }
  if(checkedTier9){
    filteredListings = filteredListings.concat(queriedListings?.filter(listing => (listing.level === 9)));
  }  
  if(checkedTier10){
    filteredListings = filteredListings.concat(queriedListings?.filter(listing => (listing.level === 10 )));
  }
  if(checkedTier11){
    filteredListings = filteredListings.concat(queriedListings?.filter(listing => (listing.level === 11 )));
  }
  if(checkedTier12){
    filteredListings = filteredListings.concat(queriedListings?.filter(listing => (listing.level === 12 )));
  }
  if(checkedTier13){
    filteredListings = filteredListings.concat(queriedListings?.filter(listing => (listing.level === 13 )));
  }
  if(checkedTier14){
    filteredListings = filteredListings.concat(queriedListings?.filter(listing => (listing.level === 14 )));
  }
  if(checkedTier15){
    filteredListings = filteredListings.concat(queriedListings?.filter(listing => (listing.level > 14)));
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
    !checkedTier9 &&
    !checkedTier10 &&
    !checkedTier11 &&
    !checkedTier12 &&
    !checkedTier13 &&
    !checkedTier14 &&
    !checkedTier15 
  ) filteredListings = queriedListings;

  if(checkedMyListings){
    filteredListings = filteredListings?.filter(listing => (listing.owner === props.account));
  }

  //now sort
  if(sortValue === "timestamp"){
    filteredListings = filteredListings?.sort((a, b) => b.timestamp - a.timestamp);
  }
  if(sortValue === "priceUp"){
    filteredListings = filteredListings?.sort((a, b) => a.price - b.price);
  }
  if(sortValue === "priceDown"){
    filteredListings = filteredListings?.sort((a, b) => b.price - a.price);
  }
  if(sortValue === "levelUp"){
    filteredListings = filteredListings?.sort((a, b) => a.level - b.level);
  }
  if(sortValue === "levelDown"){
    filteredListings = filteredListings?.sort((a, b) => b.level - a.level);
  }
  
   const fulfillListings = async() => {    
    const fighterIds = fighterCart?.map(fighter => {return Number(fighter.listingId)});
    const signedContract = ugMarketContract.connect(provider.getSigner());
    await signedContract.functions.fulfillListings(fighterIds, ugNftContract.address);
    setFighterCart([]);
  }   

  const cancelListings = async() => {    
    const listingIds = cancelFighterCart?.map(listing => {return Number(listing.listingId)});
    const signedContract = ugMarketContract.connect(provider.getSigner());
    await signedContract.functions.cancelListings(listingIds, ugNftContract.address);
    setCancelFighterCart([]);
  }   
  
  return ( 
      <Box>
         {cancelFighterCart?.length > 0 && <CancelRingCart fighters={cancelFighterCart} totalBloodFee={totalBloodFee} onCancel={cancelListings}/>}
    
     
      {fighterCart.length > 0 && <RingCart fighters={fighterCart} totalBloodFee={totalBloodFee} onBuy={fulfillListings}/>}
      <Box className="mkt-box" m={1}>
       {false && <Stack direction="row" sx={{justifyContent: 'space-between'}}>
          <Stack>
          <FormLabel style={{paddingLeft: 2, color: 'red'}} id="demo-controlled-radio-buttons-group">Level Filter:</FormLabel>
          <FormGroup row style={{paddingLeft: 5, align: 'center', color: 'aqua'}} sx={{justifyContent: 'space-evenly'}}>
            <FormControlLabel control={<Checkbox size="small"  style={{color: 'aqua'}}/>} label="1" 
              checked={checkedTier1}
              onChange={handleChange1}/>
            <FormControlLabel control={<Checkbox size="small" style={{color: 'aqua'}}/>} label="2"  
              checked={checkedTier2}
              onChange={handleChange2}/>
            <FormControlLabel control={<Checkbox size="small" style={{color: 'aqua'}}/>} label="3"  
              checked={checkedTier3}
              onChange={handleChange3}/>
            <FormControlLabel control={<Checkbox size="small" style={{color: 'aqua'}}/>} label="4"  
              checked={checkedTier4}
              onChange={handleChange4}/>
            <FormControlLabel control={<Checkbox size="small" style={{color: 'aqua'}}/>} label="5"  
              checked={checkedTier5}
              onChange={handleChange5}/>
            <FormControlLabel control={<Checkbox size="small" style={{color: 'aqua'}}/>} label="6"  
              checked={checkedTier6}
              onChange={handleChange6}/>
            <FormControlLabel control={<Checkbox size="small" style={{color: 'aqua'}}/>} label="7"  
              checked={checkedTier7}
              onChange={handleChange7}/>
            <FormControlLabel control={<Checkbox size="small" style={{color: 'aqua'}}/>} label="8"  
              checked={checkedTier8}
              onChange={handleChange8}/>
            <FormControlLabel control={<Checkbox size="small" style={{color: 'aqua'}}/>} label="9"  
              checked={checkedTier9}
              onChange={handleChange9}/>
              <FormControlLabel control={<Checkbox size="small" style={{color: 'aqua'}}/>} label="10"  
              checked={checkedTier10}
              onChange={handleChange10}/>
            <FormControlLabel control={<Checkbox size="small" style={{color: 'aqua'}}/>} label="11"  
              checked={checkedTier11}
              onChange={handleChange11}/>
            <FormControlLabel control={<Checkbox size="small" style={{color: 'aqua'}}/>} label="12"  
              checked={checkedTier12}
              onChange={handleChange12}/>
            <FormControlLabel control={<Checkbox size="small" style={{color: 'aqua'}}/>} label="13"  
              checked={checkedTier13}
              onChange={handleChange13}/>
            <FormControlLabel control={<Checkbox size="small" style={{color: 'aqua'}}/>} label="14"  
              checked={checkedTier14}
              onChange={handleChange14}/>
            <FormControlLabel control={<Checkbox size="small" style={{color: 'aqua'}}/>} label="15 and Up"  
              checked={checkedTier15}
              onChange={handleChange15}/>
          </FormGroup>
          </Stack>
          
    </Stack>}
    <Stack direction="row" sx={{pl: 2, justifyContent: 'space-between'}}>
          <FormControl >
          <FormLabel style={{ color: 'red'}} id="demo-controlled-radio-buttons-group">Sort By:</FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={sortValue}
            onChange={handleRadioChange}
            defaultValue="priceUp"
            size="small"
            sx={{gap: 5}}
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
              label={<Typography variant="body2">Recent</Typography>}
              labelPlacement="end"
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
              label={<Typography variant="body2">Price Low</Typography>}
              labelPlacement="end"
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
                />}  label={<Typography variant="body2">Price High</Typography>} labelPlacement="end"/>
           {false &&  <FormControlLabel value="levelUp" style={{color: 'aqua'}} control={
                <Radio
                size="xsmall"
                  sx={{
                    color: 'aqua',
                    '&.Mui-checked': {
                      color: 'red',
                    },
                  }} 
                />} label="Level Low" labelPlacement="bottom"/>}
            {false &&  <FormControlLabel value="levelDown" style={{color: 'aqua'}} control={
                <Radio
                size="xsmall"
                  sx={{
                    color: 'aqua',
                    '&.Mui-checked': {
                      color: 'red',
                    },
                  }} 
                />} label="Level High" labelPlacement="bottom"/>}
           
           
          </RadioGroup>
        </FormControl>
        <Stack>
        <FormLabel style={{paddingLeft: 2, color: 'black', fontSize: '.8rem'}} id="demo-controlled-radio-buttons-group">My Listings:</FormLabel>
           
        <FormGroup row style={{  color: 'aqua'}} >
        <Stack>         
               
              <FormControlLabel control={<Checkbox size="xsmall" style={{color: 'aqua'}}/>} label={<Typography variant="body2" >Recently Sold</Typography>} 
                      checked={props.sold}
                      onChange={handleRecentlySold}                  
                      labelPlacement="end"
                  />  
            </Stack>
           <FormControlLabel control={<Checkbox size="xsmall" style={{color: 'aqua'}}/>} label="My Listings" 
          checked={checkedMyListings}
          onChange={handleMyListings}
          labelPlacement="end"/>
        
      </FormGroup>
      </Stack>
      </Stack>
      </Box>
        <ImageList sx={{p:1,  maxHeight: '100vh'}} cols={3} rowHeight={400}  >
        {filteredListings?.map(({ 
            id, 
            listingId,
            tokenId, 
            price, 
            level,
            amount, 
            owner, 
            lastLevelUpgradeTime,
            timestamp, 
            tokenAddress, 
            enabled, 
            sold 
        }) => (
            <ImageListItem key={id}  >
              <MarketAmuletCard
                id = {id}
                tokenId = {tokenId}
                price = {price}
                amount = {amount}
                level = {level}
                lastLevelUpgradeTime= {lastLevelUpgradeTime}
                owner = {owner}
                timestamp = {timestamp}
                tokenAddress = {tokenAddress}
                enabled = {enabled}
                sold = {sold}
                onAddToCart = {fighterCartCollector}
                onCancelListing= {cancelListingHandler}
                account = {props?.account}
                />
            </ImageListItem>
          ))}
          </ImageList>
          </Box>
          );
          
  }
