import React from 'react';

const ProviderContext = React.createContext({
    provider: undefined,
    accounts: [],
    balance: 0,
    totalUserUnclaimedArena: undefined,
    stakedFYIds: [],
    ownedFYIds: [],
    stakedFYs: [],
    ownedFYs: [],
    stakedV1FYIds: [],
    ownedV1FYIds: [],
    v1RingIds: [],
    v1AmuletIds: [],
    stakedRing: undefined,
    stakedAmulet: undefined,
    ownedForgeIds: []
});

export default ProviderContext;