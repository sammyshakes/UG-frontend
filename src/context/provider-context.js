import React from 'react';

const ProviderContext = React.createContext({
    provider: undefined,
    accounts: [],
    balance: undefined,
    totalUserUnclaimedArena: undefined,
    stakedRing: undefined,
    stakedAmulet: undefined,
    stakedFYIds: [],
    ownedFYIds: [],
    stakedFYs: [],
    ownedFYs: [],
    stakedV1FYIds: [],
    ownedV1FYIds: [],
    v1RingIds: [],
    v1AmuletIds: []
});

export default ProviderContext;