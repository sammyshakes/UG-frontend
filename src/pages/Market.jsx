import {Route, Routes} from 'react-router-dom';
import {useQuery, gql} from '@apollo/client';
import { ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
import {Container, Stack, Typography} from '@mui/material';
import MarketMenuBar from '../components/market/MarketMenuBar';
import MarketFYakuza from '../components/market/MarketFYakuza';
import MarketWeapons from '../components/market/MarketWeapons';
import MarketFighters from '../components/market/MarketFighters';
import MarketFightClubs from '../components/market/MarketFightClubs';
import MarketForges from '../components/market/MarketForges';
import MarketRings from '../components/market/MarketRings';
import MarketAmulets from '../components/market/MarketAmulets';


const client1 = new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/samshakespeare/ugmarket',
    cache: new InMemoryCache(),
  });

const GET_MARKET = gql`
  query GetMarket {
      marketStats {
        id
        totalVolume
        totalSales
        highestSalePrice
      }
  }
`;  


export const Market = (props) => {
  
 return (
  <div>
    <ApolloProvider client={client1}>
  <DisplayMarket account={props.account} />
        </ApolloProvider>
  </div>
)
  
}   

function DisplayMarket(props) {  
  const { loading, error, data } = useQuery(GET_MARKET);


  if (loading ) return <p>Loading...</p>;
  if (error ) {
    
    return <p>Error :(</p>;
  }
 else  return (
    <div>
        
        <Stack  sx={{justifyContent: 'center'}}spacing={2} >     
        <Container className="raid-bordr h1" align="center" sx={{color: 'red',  fontSize: '3rem' }} >
          <Stack direction="row" sx={{justifyContent: 'space-between'}}>
            <Stack></Stack>
            UG Resurrection Market
            <Stack align="right">
            <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC', color: 'gold'}}>Total Sales: {Number(data.marketStats[0].totalSales).toLocaleString()}</Typography>
            <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',  color: 'gold'}}>Total Volume: {Number(data.marketStats[0].totalVolume).toLocaleString()} Blood</Typography>               
            <Typography variant='body2'  sx={{p: 0,fontFamily: 'Alegreya Sans SC',   color: 'gold'}}>Highest Sale Price: {Number(data.marketStats[0].highestSalePrice).toLocaleString()} Blood</Typography> 
            </Stack>
            </Stack>
        </Container>       
            <MarketMenuBar />            
            <Container >
              <Routes>
                <Route >
                  <Route index element={<MarketFighters account={props.account}/>}/>
                  <Route path="fighters" element={<MarketFighters account={props.account} />}/>
                  <Route path="yakuza" element={<MarketFYakuza account={props.account} />}/>
                  <Route path="clubs" element={<MarketFightClubs account={props.account}/>}/>
                  <Route path="forges" element={<MarketForges account={props.account}/>} />
                  <Route path="rings" element={<MarketRings account={props.account}/>} />
                  <Route path="amulets" element={<MarketAmulets account={props.account}/>}/>
                  <Route path="weapon" element={<MarketWeapons account={props.account} />}/>
                  
                </Route>               
              </Routes>
            </Container>
         
          </Stack>
    </div>
  )
}

export default Market;

