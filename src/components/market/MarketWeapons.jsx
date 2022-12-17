import {useState, useEffect} from 'react'
import {useQuery, gql} from '@apollo/client';
import {Box, Stack, ImageList, ImageListItem, Typography} from '@mui/material';
import {MarketWeaponCard } from './MarketWeaponCard';
import WeaponsCart from './WeaponsCart';
import CancelWeaponCart from './CancelWeaponCart';
import {  getUGWeapons2, getUGMarket, getEthers } from '../../utils.js';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';

// const GET_MARKET = gql`
//   query GetMarket {
//     listings(first: 1000, where: { enabled: true, sold: false, tokenAddress: "0x59b13E0905EC72F1C457b9b151836aEa7Ad00028", tokenId_lte: "55" },  orderBy: price, orderDirection: asc)  {
//         id
//         listingId
//         tokenId
//         price
//         amount
//         owner
//         tokenAddress
//         timestamp
//         enabled
//         sold
//       }
//       marketStats {
//         id
//         totalVolume
//         totalSales
//         highestSalePrice
//       }
//   }
// `;

const GET_MARKET = gql`
query GetMarket($sold: Boolean, $enabled: Boolean)  {
  listings(first: 1000, where: {enabled: $enabled, sold: $sold, tokenAddress: "0x59b13E0905EC72F1C457b9b151836aEa7Ad00028", tokenId_lte: "55" },  orderBy: timestamp, orderDirection: desc)  {
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

const MarketWeapons = (props) => {

  const [sold, setSold] = useState(false);
  const recentlySoldHandler = (sold) => {
    setSold(sold);
  };

  const { loading, error, data } = useQuery(GET_MARKET, {
    variables: { sold: sold, enabled: !sold},
  });
    
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  
  return (
    <DisplayMarket data={data} sold={sold} account={props.account} onRecentlySoldChange={recentlySoldHandler}/>
  )
  
}  
  

export default MarketWeapons;

function DisplayMarket(props) {  
  const [sortValue, setSortValue] = useState('priceUp');
  const [checkedWeapon1, setCheckedWeapon1] = useState(false);
  const [checkedWeapon2, setCheckedWeapon2] = useState(false);
  const [checkedWeapon3, setCheckedWeapon3] = useState(false);
  const [checkedWeapon4, setCheckedWeapon4] = useState(false);
  const [checkedWeapon5, setCheckedWeapon5] = useState(false);
 
  const [checkedSizeTier1, setCheckedSizeTier1] = useState(false);
  const [checkedSizeTier2, setCheckedSizeTier2] = useState(false);
  const [checkedSizeTier3, setCheckedSizeTier3] = useState(false);
  const [checkedSizeTier4, setCheckedSizeTier4] = useState(false);
  const [checkedSizeTier5, setCheckedSizeTier5] = useState(false);
  const [checkedSizeTier6, setCheckedSizeTier6] = useState(false);
  const [checkedSizeTier7, setCheckedSizeTier7] = useState(false);
  const [checkedMyListings, setCheckedMyListings] = useState(false);
  const [queriedListings, setQueriedListings] = useState([]);
  const [fighterCart, setFighterCart] = useState([]);  
  const [cancelFighterCart, setCancelFighterCart] = useState([]);  
  const [totalBloodFee, setTotalBloodFee] = useState(0);
  const ugWeaponsContract = getUGWeapons2();  
  const ugMarketContract = getUGMarket();
  const provider = getEthers();  

  const handleRadioChange = (event) => {
    setSortValue(event.target.value);
  };

  const handleChangeWeapon1 = (event) => {
    setCheckedWeapon1(event.target.checked);
  };
  const handleChangeWeapon2 = (event) => {
    setCheckedWeapon2(event.target.checked);
  };
  const handleChangeWeapon3 = (event) => {
    setCheckedWeapon3(event.target.checked);
  };
  const handleChangeWeapon4 = (event) => {
    setCheckedWeapon4(event.target.checked);
  };
  const handleChangeWeapon5 = (event) => {
    setCheckedWeapon5(event.target.checked);
  };
  

  const handleSizeChange1 = (event) => {
    setCheckedSizeTier1(event.target.checked);
  };
  const handleSizeChange2 = (event) => {
    setCheckedSizeTier2(event.target.checked);
  };
  const handleSizeChange3 = (event) => {
    setCheckedSizeTier3(event.target.checked);
  };
  const handleSizeChange4 = (event) => {
    setCheckedSizeTier4(event.target.checked);
  }; 
  const handleSizeChange5 = (event) => {
    setCheckedSizeTier5(event.target.checked);
  };
  const handleSizeChange6 = (event) => {
    setCheckedSizeTier6(event.target.checked);
  };
  const handleSizeChange7 = (event) => {
    setCheckedSizeTier7(event.target.checked);
  };
  const handleMyListings = (event) => {
    setCheckedMyListings(event.target.checked);
  };
  const handleRecentlySold = (event) => {
    props.onRecentlySoldChange(event.target.checked)
  };

  const getUpdates = async() => {    
    
    const listings = props.data?.listings?.map((listing, i, arr) => {     
      const listingObj = {
        ...listing,
        pricePer: listing.price / listing.amount,
      };
      return listingObj;     
    });      
    
    
    const queriedListings = listings;
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
      return prev.filter(fighter => fighter.listingId !== newFighter.listingId)
    });

    setFighterCart((prevState) => {
      if (newFighter.id >0){
        const _newFighter = {
          listingId: newFighter.listingId,
          id: newFighter.id,
          imageUrl: newFighter.imageUrl,
          price: newFighter.price,
          amount: newFighter.amount
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
      return prev.filter(listing => listing.listingId !== cancelledListing.listingId)
    });

    setCancelFighterCart((prevState) => {
      if (cancelledListing.id >0){
        const _cancelledListing = {
          listingId: cancelledListing.listingId,
          id: cancelledListing.id,
          price: cancelledListing.price,
          amount: cancelledListing.amount,
          imageUrl: cancelledListing.imageUrl
        }          
      return [...prevState, _cancelledListing];
      }
    })  
  }   

  let filteredListings = [];
  //first filter, then sort
  if(checkedWeapon1){
    filteredListings = filteredListings?.concat(queriedListings?.filter(listing => (listing.tokenId % 5 === 1)));
  }
  if(checkedWeapon2){
    filteredListings = filteredListings?.concat(queriedListings?.filter(listing => (listing.tokenId % 5 === 2 )));
  }
  if(checkedWeapon3){
    filteredListings = filteredListings?.concat(queriedListings?.filter(listing => (listing.tokenId % 5 === 3 )));
  }
  if(checkedWeapon4){
    filteredListings = filteredListings?.concat(queriedListings?.filter(listing => (listing.tokenId % 5 === 4 )));
  }
  if(checkedWeapon5){
    filteredListings = filteredListings?.concat(queriedListings?.filter(listing => (listing.tokenId % 5 === 0 )));
  }   
  

  if(
    !checkedWeapon1 &&
    !checkedWeapon2 &&
    !checkedWeapon3 &&
    !checkedWeapon4 &&
    !checkedWeapon5 
  ) filteredListings = queriedListings;

  //now filter for metal type
  let sizeFilteredListings = [];
    //steel to diamond, then broken
  if(checkedSizeTier1){
    sizeFilteredListings = sizeFilteredListings?.concat(filteredListings?.filter(listing => (Math.floor((listing.tokenId - 1) / 5) === 0 || Math.floor((listing.tokenId - 1) / 5) === 6)));                                                                                           
  }
  if(checkedSizeTier2){
    sizeFilteredListings = sizeFilteredListings?.concat(filteredListings?.filter(listing => (Math.floor((listing.tokenId - 1) / 5)  === 1 || Math.floor((listing.tokenId - 1) / 5) === 7)));
  }
  if(checkedSizeTier3){
    sizeFilteredListings = sizeFilteredListings?.concat(filteredListings?.filter(listing => (Math.floor((listing.tokenId - 1) / 5)  === 2 || Math.floor((listing.tokenId - 1) / 5) === 8)));
  }
  if(checkedSizeTier4){
    sizeFilteredListings = sizeFilteredListings?.concat(filteredListings?.filter(listing => (Math.floor((listing.tokenId - 1) / 5)  === 3 || Math.floor((listing.tokenId - 1) / 5) === 9)));
  }
  if(checkedSizeTier5){
    sizeFilteredListings = sizeFilteredListings?.concat(filteredListings?.filter(listing => (Math.floor((listing.tokenId - 1) / 5)  === 4 || Math.floor((listing.tokenId - 1) / 5) === 10)));
  }
  if(checkedSizeTier6){
    sizeFilteredListings = sizeFilteredListings?.concat(filteredListings?.filter(listing => (Math.floor((listing.tokenId - 1) / 5)  === 5)));
  }
  if(checkedSizeTier7){
    sizeFilteredListings = sizeFilteredListings?.concat(filteredListings?.filter(listing => (Math.floor((listing.tokenId - 1) / 5)  >= 6)));
  }
 

  if(
    !checkedSizeTier1 &&
    !checkedSizeTier2 &&
    !checkedSizeTier3 &&
    !checkedSizeTier4 &&
    !checkedSizeTier5 &&
    !checkedSizeTier6 &&
    !checkedSizeTier7
  ) sizeFilteredListings = filteredListings;

  if(checkedMyListings){
    sizeFilteredListings = sizeFilteredListings?.filter(listing => (listing.owner === props.account));
  }
  //now sort
  let sortArray = [...sizeFilteredListings];
  if(sortValue === "timestamp"){
    sortArray = sortArray?.sort((a, b) => b.timestamp - a.timestamp);
  }
  if(sortValue === "priceUp"){
    sortArray = sortArray?.sort((a, b) => a.price - b.price);
  }
  if(sortValue === "priceDown"){
    sortArray = sortArray?.sort((a, b) => b.price - a.price);
  }
  if(sortValue === "attackUp"){
    sortArray = sortArray?.sort((a, b) => a.tokenId - b.tokenId);
  }
  if(sortValue === "attackDown"){
    sortArray = sortArray?.sort((a, b) => b.tokenId - a.tokenId);
  }
  if(sortValue === "pricePerUp"){
    sortArray = sortArray?.sort((a, b) => a.pricePer - b.pricePer);
  }
  if(sortValue === "pricePerDown"){
    sortArray = sortArray?.sort((a, b) => b.pricePer - a.pricePer);
  }
  
  const fulfillListings = async() => {    
    const fighterIds = fighterCart?.map(fighter => {return Number(fighter.listingId)});
    const signedContract = ugMarketContract.connect(provider.getSigner());
    await signedContract.functions.fulfillListings(fighterIds, ugWeaponsContract.address);
    setFighterCart([]);
  }  
  
  const cancelListings = async() => {    
    const fighterIds = cancelFighterCart?.map(fighter => {return Number(fighter.listingId)});
    const signedContract = ugMarketContract.connect(provider.getSigner());
    await signedContract.functions.cancelListings(fighterIds, ugWeaponsContract.address);
    setCancelFighterCart([]);
  }   
  
  return ( 
      <Box>
         {cancelFighterCart?.length > 0 && <CancelWeaponCart fighters={cancelFighterCart} totalBloodFee={totalBloodFee} onCancel={cancelListings}/>}
    
      {fighterCart.length > 0 && <WeaponsCart fighters={fighterCart} totalBloodFee={totalBloodFee} onBuy={fulfillListings}/>}
      <Box className="mkt-box" >
        <Stack direction="row" sx={{justifyContent: 'space-between'}}>
          <Stack>
            <FormLabel style={{paddingLeft: 2, color: 'red', fontSize: '.8rem'}} id="demo-controlled-radio-buttons-group">Weapon Filters:</FormLabel>
            <FormGroup row style={{paddingLeft: 5,  color: 'aqua'}} sx={{justifyContent: 'space-evenly'}}>
              <FormControlLabel control={<Checkbox size="xsmall"  style={{color: 'aqua'}}/>} label={<Typography variant="body2" >Knuckles</Typography>} labelPlacement="bottom"
                checked={checkedWeapon1}
                onChange={handleChangeWeapon1}/>
              <FormControlLabel control={<Checkbox size="xsmall" style={{color: 'aqua'}}/>} label={<Typography variant="body2" >Chains</Typography>}  labelPlacement="bottom"
                checked={checkedWeapon2}
                onChange={handleChangeWeapon2}/>
              <FormControlLabel control={<Checkbox size="xsmall" style={{color: 'aqua'}}/>} label={<Typography variant="body2" >Butterfly</Typography>}  labelPlacement="bottom"
                checked={checkedWeapon3}
                onChange={handleChangeWeapon3}/>
              <FormControlLabel control={<Checkbox size="xsmall" style={{color: 'aqua'}}/>} label={<Typography variant="body2" >Machete</Typography>}  labelPlacement="bottom"
                checked={checkedWeapon4}
                onChange={handleChangeWeapon4}/>
              <FormControlLabel control={<Checkbox size="xsmall" style={{color: 'aqua'}}/>} label={<Typography variant="body2" >Katana</Typography>}  labelPlacement="bottom"
                checked={checkedWeapon5}
                onChange={handleChangeWeapon5}/>
            
            </FormGroup>
          </Stack>
        <Stack>
    <FormLabel style={{paddingLeft: 2, color: 'red', fontSize: '.8rem'}} id="demo-controlled-radio-buttons-group">Metal Filter:</FormLabel>
      <FormGroup row style={{paddingLeft: 5,  color: 'aqua'}} >
        <FormControlLabel control={<Checkbox size="xsmall"  style={{color: 'aqua'}}/>} label={<Typography variant="body2" >Steel</Typography>} labelPlacement="bottom"
          checked={checkedSizeTier1}
          onChange={handleSizeChange1}/>
        <FormControlLabel control={<Checkbox size="xsmall" style={{color: 'aqua'}}/>} label={<Typography variant="body2" >Bronze</Typography>} labelPlacement="bottom" 
          checked={checkedSizeTier2}
          onChange={handleSizeChange2}/>
        <FormControlLabel control={<Checkbox size="xsmall" style={{color: 'aqua'}}/>} label={<Typography variant="body2" >Gold</Typography>}  labelPlacement="bottom"
          checked={checkedSizeTier3}
          onChange={handleSizeChange3}/>
        <FormControlLabel control={<Checkbox size="xsmall" style={{color: 'aqua'}}/>} label={<Typography variant="body2" >Platinum</Typography>} labelPlacement="bottom" 
          checked={checkedSizeTier4}
          onChange={handleSizeChange4}/>
          <FormControlLabel control={<Checkbox size="xsmall" style={{color: 'aqua'}}/>} label={<Typography variant="body2" >Titanium</Typography>} labelPlacement="bottom" 
          checked={checkedSizeTier5}
          onChange={handleSizeChange5}/>
          <FormControlLabel control={<Checkbox size="xsmall" style={{color: 'aqua'}}/>} label={<Typography variant="body2" >Diamond</Typography>}  labelPlacement="bottom"
          checked={checkedSizeTier6}
          onChange={handleSizeChange6}/>
           <FormControlLabel control={<Checkbox size="xsmall" style={{color: 'aqua'}}/>} label={<Typography variant="body2" >Broken</Typography>}  labelPlacement="bottom" 
          checked={checkedSizeTier7}
          onChange={handleSizeChange7}/>        
      </FormGroup>
    </Stack>
    </Stack>
    <Stack direction="row" sx={{justifyContent: 'space-between'}}>
          <FormControl >
          <FormLabel style={{ color: 'red', fontSize: '.8rem'}} id="demo-controlled-radio-buttons-group">Sort By:</FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={sortValue}
            onChange={handleRadioChange}
            defaultValue="priceUp"
            size="small"
            sx={{gap: 1}}
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
              label={<Typography variant="body2" >Recent</Typography>}  
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
              label={<Typography variant="body2" >Price Low</Typography>}  
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
                />}  label={<Typography variant="body2" >Price High</Typography>} labelPlacement="bottom"/>
            <FormControlLabel value="attackUp" style={{color: 'aqua'}} control={
                <Radio
                size="xsmall"
                  sx={{
                    color: 'aqua',
                    '&.Mui-checked': {
                      color: 'red',
                    },
                  }} 
                />} label={<Typography variant="body2" >Attack Low</Typography>} labelPlacement="bottom"/>
            <FormControlLabel value="attackDown" style={{color: 'aqua'}} control={
                <Radio
                size="xsmall"
                  sx={{
                    color: 'aqua',
                    '&.Mui-checked': {
                      color: 'red',
                    },
                  }} 
                />} label={<Typography variant="body2" >Attack High</Typography>} labelPlacement="bottom"/>
             <FormControlLabel 
              value="pricePerUp" 
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
              label={<Typography variant="body2" >Price Per Low</Typography>} 
              labelPlacement="bottom"
            />
            <FormControlLabel value="pricePerDown" style={{color: 'aqua'}} control={
                <Radio
                size="xsmall"
                  sx={{
                    color: 'aqua',
                    '&.Mui-checked': {
                      color: 'red',
                    },
                  }} 
                />}  label={<Typography variant="body2" >Price Per High</Typography>}  labelPlacement="bottom"/>
           
          </RadioGroup>          
        </FormControl>
        <Stack>
        <FormLabel style={{paddingLeft: 2, color: 'black', fontSize: '.8rem'}} id="demo-controlled-radio-buttons-group">My Listings:</FormLabel>
           
        <FormGroup row style={{  color: 'aqua'}} >
        <FormControlLabel control={<Checkbox size="xsmall" style={{color: 'aqua'}}/>} label={<Typography variant="body2" >Recently Sold</Typography>} 
                      checked={props.sold}
                      onChange={handleRecentlySold}                  
                      labelPlacement="bottom"/>  
           <FormControlLabel control={<Checkbox size="xsmall" style={{color: 'aqua'}}/>} label={<Typography variant="body2" >My Listings</Typography>}   
          checked={checkedMyListings}
          onChange={handleMyListings}
          labelPlacement="bottom"/>
        
      </FormGroup>
      </Stack>
      </Stack>
      </Box>
        <ImageList sx={{p:1,  maxHeight: '100vh'}} cols={4} rowHeight={350}  >
        {sortArray?.map(({ 
            id, 
            listingId,
            tokenId, 
            price,  
            pricePer,          
            amount, 
            owner, 
            timestamp, 
            tokenAddress, 
            enabled, 
            sold 
        }) => (
            <ImageListItem key={id}  >
              <MarketWeaponCard
                id = {id}
                tokenId = {tokenId}
                price = {price}
                pricePer = {pricePer}
                amount = {amount}                
                owner = {owner}
                timestamp = {timestamp}
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
