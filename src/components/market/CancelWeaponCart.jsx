import {Box, Stack, ImageList, ImageListItem, CardMedia, Typography, Button} from '@mui/material';

const CancelWeaponCart = (props) => {

  return (
    <Box className="mkt-box" sx={{p:1, mb:2, minHeight: 220}}>
        <ImageList  cols={6} rowHeight={180}  >
          {props.fighters?.map((fighter) => (
            <ImageListItem key={fighter?.id}  >
              <Box
                component="img"
                height={180}
                width={120}
                src={fighter?.imageUrl}
                alt="FYakuza"
                />
                <Stack direction="row" sx={{justifyContent: 'flex-start', gap: 1}}>
                    <Typography sx={{fontFamily: 'Alegreya Sans SC', fontSize: '.7rem', color: 'aqua'}}>qty: {fighter?.amount}</Typography>
                    
                    <Typography sx={{fontFamily: 'Alegreya Sans SC', fontSize: '.7rem', color: 'red'}}>{Number(fighter?.price).toLocaleString()} Blood</Typography>
                </Stack>         
            </ImageListItem>
          ))}
     
      </ImageList>
        <Stack direction="row" sx={{justifyContent: 'space-between'}}>
            
        <Typography sx={{fontFamily: 'Alegreya Sans SC', fontSize: '1.5rem', color: 'red'}}>Cancel Weapons Listings</Typography>
            <Button 
                variant="contained" 
                size="small" 
                onClick={props.onCancel}
                style={{borderColor: 'black', color: 'black', borderRadius: 10, backgroundColor: 'aqua', width: '40%'}}>
                Cancel Listings
            </Button> 
        </Stack>           
    </Box>
  )
}

export default CancelWeaponCart