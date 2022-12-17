import {Box, Stack, ImageList, ImageListItem, CardMedia, Typography, Button} from '@mui/material';

const FightClubCart = (props) => {

  return (
    <Box className="mkt-box" sx={{p:1, m:2, minHeight: 250}}>
        <ImageList sx={{p:1, maxWidth: '100%', maxHeight: 200}} cols={5} rowHeight={200}  >
          {props.fighters?.map((fighter) => (
            <ImageListItem key={fighter?.id}  >
              <CardMedia
                component="img"
                height="180"
                image={fighter?.imageUrl}
                alt="FYakuza"
                loading="lazy"
                />
                <Stack direction="row" sx={{justifyContent: 'space-around'}}>
                    <Typography sx={{fontFamily: 'Alegreya Sans SC', fontSize: '.7rem', color: 'aqua'}}>Level: {fighter?.level}</Typography>
                    <Typography sx={{fontFamily: 'Alegreya Sans SC', fontSize: '.7rem', color: 'aqua'}}>Size: {fighter?.size}</Typography>
                    <Typography sx={{fontFamily: 'Alegreya Sans SC', fontSize: '.7rem', color: 'red'}}>{Number(fighter?.price).toLocaleString()} Blood</Typography>
                </Stack>         
            </ImageListItem>
          ))}
     
      </ImageList>
        <Stack direction="row" sx={{justifyContent: 'space-between'}}>
            
        <Typography sx={{fontFamily: 'Alegreya Sans SC', fontSize: '1.5rem', color: 'red'}}>Fight Club Cart</Typography>
            <Button 
                variant="contained" 
                size="small" 
                onClick={props.onBuy}
                style={{borderColor: 'black', color: 'black', borderRadius: 10, backgroundColor: 'aqua', width: '40%'}}>
                BUY
            </Button> 
            <Typography sx={{fontFamily: 'Alegreya Sans SC', fontSize: '1.5rem', color: 'red'}}>{Number(props.totalBloodFee).toLocaleString()} Blood Total</Typography>
        </Stack>           
    </Box>
  )
}

export default FightClubCart