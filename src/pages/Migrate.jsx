import React from 'react'
import StakedV1FighterList from '../components/StakedV1FighterList'
import OwnedV1FighterList from '../components/OwnedV1FighterList'
import V1RingWidget from '../components/V1RingWidget'
import V1AmuletWidget from '../components/V1AmuletWidget'
import MigrateButtons from '../components/MigrateButtons'
import {Stack, Container} from '@mui/material/';


const Migrate = () => {
  return (
    <React.Fragment>
      <Stack direction="row"  >
        <StakedV1FighterList/>
        <OwnedV1FighterList/>
      </Stack>
      <Stack direction={{sm: "column", md: "row"}}  >
        <Stack direction="row" justifyContent={'flex-start'}>
          <Container >
            <V1RingWidget/>
          </Container>
          <Container maxWidth={1/8}>
          <V1AmuletWidget/>
          </Container>
        </Stack>
        <MigrateButtons/>
      </Stack>
    </React.Fragment>
  )
}

export default Migrate

