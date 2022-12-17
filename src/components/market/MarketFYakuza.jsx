import {useState, useEffect} from 'react'
import {useQuery, gql} from '@apollo/client';
import {Box, Stack, ImageList, ImageListItem, Typography} from '@mui/material';
import {MarketYakuzaCard } from './MarketYakuzaCard';
import YakuzaCart from './YakuzaCart';
import CancelYakuzaCart from './CancelYakuzaCart';
import { getUGFYakuza, getUGMarket, getEthers } from '../../utils.js';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';



// const GET_MARKET = gql`
//   query GetMarket {
//     listings(first: 1000, where: { enabled: true, sold: false, tokenAddress: "0xB1d066a7CeAF92ff15B39668a44dEf03C17fAc9e" },  orderBy: price, orderDirection: asc)  {
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
  
  const { loading, error, data } = useQuery(GET_MARKET, {
    variables: { sold: sold, enabled: !sold},
  });

  if (loading ) return <p>Loading...</p>;
  if (error ) {
    
    return <p>Error :(</p>;
  }
    
    
  else return (
    <DisplayMarket data={data} sold={sold} account={props.account} onRecentlySoldChange={recentlySoldHandler}/>
  )
    
}  
  

export default MarketFighters;

function DisplayMarket(props) {  
  const [sortValue, setSortValue] = useState('priceUp');
 
  const [checkedRank5, setCheckedRank5] = useState(false);
  const [checkedRank6, setCheckedRank6] = useState(false);
  const [checkedRank7, setCheckedRank7] = useState(false);
  const [checkedRank8, setCheckedRank8] = useState(false);
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

 
  const handleChange5 = (event) => {
    setCheckedRank5(event.target.checked);
  };
  const handleChange6 = (event) => {
    setCheckedRank6(event.target.checked);
  };
  const handleChange7 = (event) => {
    setCheckedRank7(event.target.checked);
  };
  const handleChange8 = (event) => {
    setCheckedRank8(event.target.checked);
  };
  const handleMyListings = (event) => {
    setCheckedMyListings(event.target.checked);
  };
  const handleRecentlySold = (event) => {
    props.onRecentlySoldChange(event.target.checked)
  };
  
 

  const getUpdates = async() => {  
    const fyakuzaIds = props.data?.listings?.map(listing => listing?.tokenId);       
    const fyakuzas = await ugFYakuzaContract.getFighters(fyakuzaIds);   

    const fighters = fyakuzas?.map((fyakuza, i, arr) => {
      
     if( !fyakuza?.isFighter){
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
          rank: newFighter.rank
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
          rank: cancelledListing.rank
        }          
      return [...prevState, _cancelledListing];
      }
    })  
  }   

  let filteredFighters = [];
  //first filter, then sort
 
  if(checkedRank5){
    filteredFighters = filteredFighters.concat(queriedFighters?.filter(fighter => (fighter.rank === 5)));
  }
  if(checkedRank6){
    filteredFighters = filteredFighters.concat(queriedFighters?.filter(fighter => (fighter.rank === 6)));
  }
  if(checkedRank7){
    filteredFighters = filteredFighters.concat(queriedFighters?.filter(fighter => (fighter.rank === 7)));
  }
  if(checkedRank8){
    filteredFighters = filteredFighters.concat(queriedFighters?.filter(fighter => (fighter.rank === 8)));
  }
 

  if(    
    !checkedRank5 &&
    !checkedRank6 &&
    !checkedRank7 &&
    !checkedRank8 
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
  if(sortValue === "rankUp"){
    filteredFighters = filteredFighters?.sort((a, b) => a.rank - b.rank);
  }
  if(sortValue === "rankDown"){
    filteredFighters = filteredFighters?.sort((a, b) => b.rank - a.rank);
  }

  const fulfillListings = async() => {    
    const fighterIds = fighterCart?.map(fighter => {return Number(fighter.listingId)});
    const signedContract = ugMarketContract.connect(provider.getSigner());
    await signedContract.functions.fulfillListings(fighterIds, ugFYakuzaContract.address);
    setFighterCart([]);
  }    
  
  const cancelListings = async() => {    
    const fighterIds = cancelFighterCart?.map(fighter => {return Number(fighter.listingId)});
    const signedContract = ugMarketContract.connect(provider.getSigner());
    await signedContract.functions.cancelListings(fighterIds, ugFYakuzaContract.address);
    setCancelFighterCart([]);
  } 
   
  
    return ( 
      <Box>
         {cancelFighterCart?.length > 0 && <CancelYakuzaCart fighters={cancelFighterCart} totalBloodFee={totalBloodFee} onCancel={cancelListings}/>}
    
      {fighterCart.length > 0 && <YakuzaCart fighters={fighterCart} totalBloodFee={totalBloodFee} onBuy={fulfillListings}/>}
        <Box className="mkt-box" m={1}>
          
       
          <Stack direction="row" sx={{justifyContent: 'space-evenly'}}>
          

          <FormControl>
          <FormLabel style={{color: 'red'}} id="demo-controlled-radio-buttons-group">Sort By:</FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={sortValue}
            onChange={handleRadioChange}
            defaultValue="priceUp"
           
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
              label={<Typography variant="body2" sx={{fontSize: '.8rem'}} >Recent</Typography>}
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
              label={<Typography variant="body2" sx={{fontSize: '.8rem'}} >Price Low</Typography>}
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
                />}  
                label={<Typography variant="body2" sx={{fontSize: '.8rem'}}>Price High</Typography>} 
                labelPlacement="bottom"/>
            <FormControlLabel value="rankUp" style={{color: 'aqua'}} control={
                <Radio
                size="xsmall"
                  sx={{
                    color: 'aqua',
                    '&.Mui-checked': {
                      color: 'red',
                    },
                  }} 
                />} 
                label={<Typography variant="body2" sx={{fontSize: '.8rem'}} >Rank Low</Typography>}
                labelPlacement="bottom"/>
            <FormControlLabel value="rankDown" style={{color: 'aqua'}} control={
                <Radio
                size="xsmall"
                  sx={{
                    color: 'aqua',
                    '&.Mui-checked': {
                      color: 'red',
                    },
                  }} 
                />} 
                label={<Typography variant="body2" sx={{fontSize: '.8rem'}} >Rank High</Typography>}
                labelPlacement="bottom"/>
            
          </RadioGroup>
        </FormControl>
        <Stack>
        <FormLabel style={{paddingLeft: 2, color: 'red'}} id="demo-controlled-radio-buttons-group">Rank Filter:</FormLabel>
          <FormGroup row style={{paddingLeft: 5, align: 'center', color: 'aqua'}} >     
            <FormControlLabel control={<Checkbox size="xsmall" style={{color: 'aqua'}}/>} label={<Typography variant="body2" >Rank 5</Typography>} 
              checked={checkedRank5}
              onChange={handleChange5}
              labelPlacement="bottom"/>
            <FormControlLabel control={<Checkbox size="xsmall" style={{color: 'aqua'}}/>} label={<Typography variant="body2" >Rank 6</Typography>}
              checked={checkedRank6}
              onChange={handleChange6}
              labelPlacement="bottom"/>
            <FormControlLabel control={<Checkbox size="xsmall" style={{color: 'aqua'}}/>} label={<Typography variant="body2" >Rank 7</Typography>} 
              checked={checkedRank7}
              onChange={handleChange7}
              labelPlacement="bottom"/>
            <FormControlLabel control={<Checkbox size="xsmall" style={{color: 'aqua'}}/>} label={<Typography variant="body2" >Rank 8</Typography>}
              checked={checkedRank8}
              onChange={handleChange8}
              labelPlacement="bottom"/>  
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
        <ImageList sx={{p:1,  maxHeight: '100vh'}} cols={3} rowHeight={360}  >
        {filteredFighters?.map(({ 
            id, 
            listingId,
            tokenId, 
            price, 
            amount, 
            rank,
            owner, 
            timestamp, 
            tokenAddress, 
            imageId,
            enabled, 
            sold 
        }) => (
            <ImageListItem key={id}  >
              <MarketYakuzaCard
                id = {id}
                tokenId = {tokenId}
                price = {price}
                amount = {amount}
                rank={rank}
                owner = {owner}
                timestamp = {timestamp}
                tokenAddress = {tokenAddress}
                imageId={imageId}
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
