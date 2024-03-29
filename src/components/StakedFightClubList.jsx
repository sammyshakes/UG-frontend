import React, { useContext, useState, useEffect } from "react";
import ProviderContext from "../context/provider-context";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import StakedFightClubCard from "./StakedFightClubCard";
import { Box, Container, Button, Stack, ButtonGroup } from "@mui/material";
import Typography from "@mui/material/Typography";
import "./stakedFightClubList.css";
import { getUGRaid3, getUGNft2, getUGGame5, getFclubAlley } from "../utils.js";
import ErrorModal from "./ui/ErrorModal";

export default function StakedFightClubList() {
  const prv = useContext(ProviderContext);
  const [error, setError] = useState();
  const [fclubs, setFclubs] = useState([]);
  const [fclubIds, setFclubIds] = useState([]);
  const [fclubs2, setFclubs2] = useState([]);
  const [selectedFClubs, setSelectedFClubs] = useState([]);
  const [unclaimed, setUnclaimed] = useState(0);
  const [unclaimed2, setUnclaimed2] = useState(0);
  const ugRaid2Contract = getUGRaid3();
  const ugNftContract = getUGNft2();
  const ugGameContract = getUGGame5();
  const ugFclubAlleyContract = getFclubAlley();

  const levelHandler = async () => {
    if (selectedFClubs.length < 1) {
      setError({
        title: "Please Select a Fight Club",
        message: "Unless your scared..",
      });
      return;
    }
    const levelUpArray = selectedFClubs.map((i) => {
      return 1;
    });
    const sizeUpArray = selectedFClubs.map((i) => {
      return 0;
    });
    const signedContract = ugGameContract.connect(prv.provider.getSigner());
    await signedContract.functions.levelUpFightClubs(
      selectedFClubs,
      levelUpArray,
      sizeUpArray,
      true
    );
    //reset selected FYs array
    setSelectedFClubs([]);
  };

  const sizeHandler = async () => {
    if (selectedFClubs.length < 1) {
      setError({
        title: "Please Select a Fight Club",
        message: "Unless your scared..",
      });
      return;
    }
    const levelUpArray = selectedFClubs.map((i) => {
      return 0;
    });
    const sizeUpArray = selectedFClubs.map((i) => {
      return 1;
    });
    const signedContract = ugGameContract.connect(prv.provider.getSigner());
    await signedContract.functions.levelUpFightClubs(
      selectedFClubs,
      levelUpArray,
      sizeUpArray,
      true
    );
    //reset selected FYs array
    setSelectedFClubs([]);
  };

  const sizelevelHandler = async () => {
    const levelUpArray = selectedFClubs.map((i) => {
      return 1;
    });
    const sizeUpArray = selectedFClubs.map((i) => {
      return 1;
    });
    const signedContract = ugGameContract.connect(prv.provider.getSigner());
    await signedContract.functions.levelUpFightClubs(
      selectedFClubs,
      levelUpArray,
      sizeUpArray,
      true
    );
    //reset selected FYs array
    setSelectedFClubs([]);
  };

  const claimHandler = async () => {
    if (selectedFClubs.length < 1) {
      setError({
        title: "Please Select a Fight Club",
        message: "Unless your scared..",
      });
      return;
    }
    const signedContract = ugFclubAlleyContract.connect(
      prv.provider.getSigner()
    );
    await signedContract.functions.claimFightClubs(selectedFClubs, false);
  };

  const claimAllHandler = async () => {
    if (fclubs.length < 1) {
      setError({
        title: "You dont have any Staked Fight Clubs",
        message: "Might be a wise move to do so..",
      });
      return;
    }
    const signedContract = ugFclubAlleyContract.connect(
      prv.provider.getSigner()
    );
    await signedContract.functions.claimFightClubs(fclubIds, false);
  };

  const claim2Handler = async () => {
    const signedContract = ugRaid2Contract.connect(prv.provider.getSigner());
    await signedContract.functions.claimFightClubBloodRewards();
    setUnclaimed2(0);
  };

  const unstakeHandler = async () => {
    if (selectedFClubs.length < 1) {
      setError({
        title: "Please Select a Fight Club",
        message: "Unless your scared..",
      });
      return;
    }
    const signedContract = ugFclubAlleyContract.connect(
      prv.provider.getSigner()
    );
    await signedContract.functions.claimFightClubs(selectedFClubs, true);
    //reset selected FYs array
    setSelectedFClubs([]);
  };

  const unstakeAllHandler = async () => {
    // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    // const fclubIds = await ugFclubAlleyContract.getStakedFightClubIDsForUser(accounts[0]);
    if (fclubIds.length < 1) {
      setError({
        title: "You dont have any Staked Fight Clubs",
        message: "Might be a wise move to do so..",
      });
      return;
    }
    console.log("f", fclubIds);
    console.log("f", ugFclubAlleyContract.address);
    const signedContract = ugFclubAlleyContract.connect(
      prv.provider.getSigner()
    );
    await signedContract.functions.claimFightClubs(
      fclubIds,
      true
    );
    //reset selected FYs array
    setSelectedFClubs([]);
  };

  const unstakeAll2Handler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const fclubIds = await ugRaid2Contract.getStakedFightClubIDsForUser(
      accounts[0]
    );
    const signedContract = ugRaid2Contract.connect(prv.provider.getSigner());
    const receipt = await signedContract.functions.unstakeFightclubs(fclubIds);
  };

  const UnselectHandler = () => {
    //reset selected FYs array
    setSelectedFClubs([]);
  };

  const selectedFClubHandler = (selectedId, clicked) => {
    //first recreate list without them, then add if we need to
    setSelectedFClubs((prevState) => {
      return prevState.filter((id) => id !== selectedId);
    });

    if (clicked) {
      setSelectedFClubs((prevState) => {
        return [...prevState, selectedId];
      });
    }
  };

  const getUpdates = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const fclubIds = await ugFclubAlleyContract.getStakedFightClubIDsForUser(
      accounts[0]
    );
    const fclubs = await ugNftContract.getForgeFightClubs(fclubIds);
    const ids = fclubs.map((fy) => {
      return fy.id;
    });
    const fightClubUnclaimed =
      await ugFclubAlleyContract.calculateAllStakingRewards(fclubIds);

    const fclubIds2 = await ugRaid2Contract.getStakedFightClubIDsForUser(
      accounts[0]
    );
    const fclubs2 = await ugNftContract.getForgeFightClubs(fclubIds2);
    const fightClubUnclaimed2 =
      await ugRaid2Contract.fightClubOwnerBloodRewards(accounts[0]);

    setUnclaimed(fightClubUnclaimed);
    setFclubIds(ids);
    setFclubs(fclubs);
    setUnclaimed2(fightClubUnclaimed2);
    setFclubs2(fclubs2);
  };

  const errorHandler = () => {
    setError(null);
  };

  useEffect(() => {
    const init = async () => {
      getUpdates();

      const timer = setInterval(() => {
        getUpdates();
      }, 5000);

      return () => {
        clearInterval(timer);
      };
    };
    init();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      {error && (
        <ErrorModal
          title={error.title}
          message={error.message}
          onConfirm={errorHandler}
        />
      )}
      <Stack>
        {Number(unclaimed2) === 0 && fclubs2.length === 0 && (
          <Box className="staked-bordr">
            <Typography
              variant="h4"
              align="center"
              sx={{ fontFamily: "Alegreya Sans SC", p: 0, color: "red" }}
            >
              Staked Fight Clubs
            </Typography>
            <Container className="fc-bordr" sx={{ bgcolor: "black" }}>
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography
                  variant="body2"
                  sx={{
                    p: 1,
                    fontFamily: "Alegreya Sans SC",
                    fontSize: "1.25rem",
                    color: "palegreen",
                  }}
                >
                  Fight Club Profits
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    p: 1,
                    fontFamily: "Alegreya Sans SC",
                    fontSize: "1.25rem",
                    color: "red",
                  }}
                >
                  {unclaimed.toString()}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    m: 1,
                    borderRadius: "10px",
                    borderColor: "palegreen",
                    backgroundColor: "black",
                    color: "palegreen",
                  }}
                  onClick={claimAllHandler}
                >
                  Claim All
                </Button>
              </Stack>
            </Container>
            <ImageList
              sx={{ p: 1, maxWidth: 850, maxHeight: 600 }}
              cols={2}
              rowHeight={400}
            >
              {fclubs?.map((fclub) => (
                <ImageListItem key={fclub.id}>
                  <StakedFightClubCard
                    key={fclub.id}
                    id={fclub.id}
                    level={fclub.level}
                    size={fclub.size}
                    onSelected={selectedFClubHandler}
                    emptyArray={selectedFClubs.length > 0 ? false : true}
                  />
                </ImageListItem>
              ))}
            </ImageList>
            <Stack
              direction="row"
              maxwidth={"md"}
              sx={{ justifyContent: "center" }}
            >
              <ButtonGroup
                variant="contained"
                color="error"
                sx={{ borderColor: "red", border: 3 }}
              >
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "black", color: "red" }}
                  onClick={sizeHandler}
                >
                  Size Up{" "}
                </Button>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "black", color: "red" }}
                  onClick={levelHandler}
                >
                  Level UP{" "}
                </Button>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "black", color: "red" }}
                  onClick={claimHandler}
                >
                  Claim
                </Button>

                <Button
                  variant="contained"
                  sx={{ backgroundColor: "black", color: "red" }}
                  onClick={unstakeHandler}
                >
                  Unstake{" "}
                </Button>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "black", color: "red" }}
                  onClick={unstakeAllHandler}
                >
                  Unstake All{" "}
                </Button>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "black", color: "red" }}
                  onClick={UnselectHandler}
                >
                  Unselect{" "}
                </Button>
              </ButtonGroup>
            </Stack>
          </Box>
        )}

        {(Number(unclaimed2) > 0 || fclubs2.length > 0) && (
          <Box className="staked-bordr">
            <Typography
              variant="h4"
              align="center"
              sx={{ fontFamily: "Alegreya Sans SC", p: 0, color: "gold" }}
            >
              Unstake these Fight Clubs (Raid Fix)
            </Typography>
            <Container className="fc-bordr" sx={{ bgcolor: "black" }}>
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography
                  variant="body2"
                  sx={{
                    p: 1,
                    fontFamily: "Alegreya Sans SC",
                    fontSize: "1.25rem",
                    color: "gold",
                  }}
                >
                  Claim Raid Fix Profit
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    p: 1,
                    fontFamily: "Alegreya Sans SC",
                    fontSize: "1.25rem",
                    color: "red",
                  }}
                >
                  {unclaimed2.toString()}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    m: 1,
                    borderRadius: "10px",
                    borderColor: "gold",
                    backgroundColor: "black",
                    color: "gold",
                  }}
                  onClick={claim2Handler}
                >
                  Claim
                </Button>
              </Stack>
            </Container>
            <ImageList
              sx={{ p: 1, maxWidth: 850, maxHeight: 600 }}
              cols={2}
              rowHeight={400}
            >
              {fclubs2?.map((fclub) => (
                <ImageListItem key={fclub.id}>
                  <StakedFightClubCard
                    key={fclub.id}
                    id={fclub.id}
                    level={fclub.level}
                    size={fclub.size}
                    onSelected={selectedFClubHandler}
                    emptyArray={selectedFClubs.length > 0 ? false : true}
                  />
                </ImageListItem>
              ))}
            </ImageList>
            <Stack
              direction="row"
              maxwidth={"md"}
              sx={{ justifyContent: "center" }}
            >
              <ButtonGroup
                variant="contained"
                color="error"
                sx={{ borderColor: "red", border: 3 }}
              >
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "black", color: "red" }}
                  onClick={unstakeAll2Handler}
                >
                  Unstake All{" "}
                </Button>
              </ButtonGroup>
            </Stack>
          </Box>
        )}
      </Stack>
    </div>
  );
}
