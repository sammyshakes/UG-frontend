import React from 'react'
import StakedV1FighterList from '../components/StakedV1FighterList'
import OwnedV1FighterList from '../components/OwnedV1FighterList'
import V1RingWidget from '../components/V1RingWidget'
import V1AmuletWidget from '../components/V1AmuletWidget'
import MigrateButtons from '../components/MigrateButtons'
import {Stack} from '@mui/material/';


const Migrate = () => {
  return (
    <React.Fragment>
      <Stack direction={{sm: "column", md: "row"}}  >
        <StakedV1FighterList/>
        <OwnedV1FighterList/>
      </Stack>
      <Stack direction={{sm: "column", md: "row"}} xs={12} >
        <Stack direction="row">
        <V1RingWidget/>
        <V1AmuletWidget/>
        </Stack>
        <MigrateButtons/>
      </Stack>
    </React.Fragment>
  )
}

export default Migrate

