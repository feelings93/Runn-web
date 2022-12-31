import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { BigNumber, Contract, ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils.js';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useAccount, useContractRead } from 'wagmi';
import Filters from '../components/Inventory/Filters/Filters';
import SneakerCard from '../components/UI/SneakerCard/SneakerCard';
import {
  RunnMarketplaceAddress,
  RunnSneakerAddress,
} from '../constants/contractAddress';
import { RunnMarketplaceABI } from '../constants/RunnMarketplaceABI';
import { RunnSneakerABI } from '../constants/RunnSneakerABI';
import { mapTokenDataToSneaker } from '../utils/formatTokenData';

const defaultFilter = {
  rarities: [],
  types: [],
  level: {
    from: '',
    to: '',
  },
  mint: {
    from: '0',
    to: '7',
  },
  performance: {
    from: '',
    to: '',
  },
  joy: {
    from: '',
    to: '',
  },
  durability: {
    from: '',
    to: '',
  },
};

const Inventory = (props) => {
  const { address } = useAccount();
  const [sneakers, setSneakers] = useState([]);
  const [filter, setFilter] = useState(defaultFilter);
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [isMining, setIsMining] = useState(false);
  const [price, setPrice] = useState('');
  const [showSellForm, setShowSellForm] = useState(false);
  const [selectSneaker, setSelectedSneaker] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (address) fetchAllSneakers();
  }, [address]);

  const handleClickSneaker = (id) => {
    router.push(`sneaker/${id}?from=inventory`);
  };

  const handleClickSell = async (sneaker) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new Contract(
          RunnSneakerAddress,
          RunnSneakerABI,
          signer
        );
        const res = await nftContract.functions.getApproved(sneaker.id);
        if (res?.includes(RunnMarketplaceAddress)) handleShowSellForm(sneaker);
        else handleShowApprovalForm(sneaker);
      }
    } catch (err) {
      toast(err);
    }
  };
  const handleShowApprovalForm = (sneaker) => {
    setShowApprovalForm(true);
    setSelectedSneaker(sneaker);
  };

  const handleHideApprovalForm = () => {
    setShowApprovalForm(false);
    setSelectedSneaker(null);
  };

  const handleShowSellForm = (sneaker) => {
    setShowSellForm(true);
    setSelectedSneaker(sneaker);
  };

  const handleHideSellForm = () => {
    setShowSellForm(false);
    setSelectedSneaker(null);
    setPrice('');
  };

  const handleChangePrice = (e) => {
    const { value } = e.target;
    if (!isNaN(Number(value)) || Number(value) >= 0) {
      setPrice(value);
    }
  };

  const handleApprove = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new Contract(
          RunnSneakerAddress,
          RunnSneakerABI,
          signer
        );
        const tx = await nftContract.approve(
          RunnMarketplaceAddress,
          selectSneaker.id
        );
        setIsMining(true);

        await tx.wait();
        setIsMining(false);
        toast('You have approved NFT for this marketplace successfully');
        handleHideApprovalForm();
        handleShowSellForm({ ...selectSneaker });
      }
    } catch (err) {
      alert(err);
      toast(err);
      setIsMining(false);
    }
  };

  const handleSell = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const marketplaceContract = new Contract(
          RunnMarketplaceAddress,
          RunnMarketplaceABI,
          signer
        );
        const tx = await marketplaceContract.sell(
          RunnSneakerAddress,
          selectSneaker.id,
          parseUnits(price)
        );
        setIsMining(true);

        await tx.wait();

        toast('Your NFT has been upload on marketplace successfully!');
        handleHideSellForm();
        setIsMining(false);

        router.push('/marketplace');
      }
    } catch (err) {
      toast(err);
      setIsMining(false);
    }
  };

  const fetchAllSneakers = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new Contract(
          RunnSneakerAddress,
          RunnSneakerABI,
          signer
        );
        const res = await nftContract.functions.tokenInfosByOwner(address);
        console.log(res);
        const allTokensData = res[0];
        const formattedSneakers = allTokensData?.map((tokenData) => {
          return mapTokenDataToSneaker(tokenData);
        });
        console.log(formattedSneakers);
        setSneakers(formattedSneakers);
        console.log(res);
      }
    } catch (err) {
      toast(err);
    }
  };

  const handleResetFilter = () => {
    setFilter({ ...defaultFilter });
  };

  const filteredSneakers = useMemo(() => {
    return sneakers.filter((sneaker) => {
      const typeCondition =
        filter.types.length === 0 || filter.types.includes(sneaker.type);
      const rarityCondition =
        filter.rarities.length === 0 ||
        filter.rarities.includes(sneaker.rarity);
      const mintCondition =
        (!filter.mint.from && !filter.mint.to) ||
        (filter.mint.from &&
          !filter.mint.to &&
          sneaker.mint >= filter.mint.from) ||
        (!filter.mint.from &&
          filter.mint.to &&
          sneaker.mint <= filter.mint.to) ||
        (filter.mint.from <= sneaker.mint && filter.mint.to >= sneaker.mint);
      const joyCondition =
        (!filter.joy.from && !filter.joy.to) ||
        (filter.joy.from && !filter.joy.to && sneaker.joy >= filter.joy.from) ||
        (!filter.joy.from && filter.joy.to && sneaker.joy <= filter.joy.to) ||
        (filter.joy.from <= sneaker.joy && filter.joy.to >= sneaker.joy);
      const durabilityCondition =
        (!filter.durability.from && !filter.durability.to) ||
        (filter.durability.from &&
          !filter.durability.to &&
          sneaker.durability >= filter.durability.from) ||
        (!filter.durability.from &&
          filter.durability.to &&
          sneaker.durability <= filter.durability.to) ||
        (filter.durability.from <= sneaker.durability &&
          filter.durability.to >= sneaker.durability);
      const levelCondition =
        (!filter.level.from && !filter.level.to) ||
        (filter.level.from &&
          !filter.level.to &&
          sneaker.level >= filter.level.from) ||
        (!filter.level.from &&
          filter.level.to &&
          sneaker.level <= filter.level.to) ||
        (filter.level.from <= sneaker.level &&
          filter.level.to >= sneaker.level);
      const performanceCondition =
        (!filter.performance.from && !filter.performance.to) ||
        (filter.performance.from &&
          !filter.performance.to &&
          sneaker.performance >= filter.performance.from) ||
        (!filter.performance.from &&
          filter.performance.to &&
          sneaker.performance <= filter.performance.to) ||
        (filter.performance.from <= sneaker.performance &&
          filter.performance.to >= sneaker.performance);
      console.log({
        typeCondition,
        rarityCondition,
        mintCondition,
        levelCondition,
        performanceCondition,
        joyCondition,
        durabilityCondition,
      });
      return (
        typeCondition &&
        rarityCondition &&
        mintCondition &&
        performanceCondition &&
        levelCondition &&
        joyCondition &&
        durabilityCondition
      );
    });
  }, [filter, sneakers]);

  return (
    <>
      <Stack gap={1}>
        <Typography variant='h4' fontWeight={700} mb={2}>
          Inventory
        </Typography>
        <Grid container spacing={3} alignItems='flex-start'>
          <Grid item sm={12} md={3}>
            <Filters
              filter={filter}
              onChangeFilter={setFilter}
              onResetFilter={handleResetFilter}
            />
          </Grid>
          <Grid item sm={12} md={9} spacing={2} container wrap='wrap'>
            {filteredSneakers?.map((sneaker) => (
              <Grid key={sneaker.id} item sm={6} md={4} lg={4}>
                <SneakerCard
                  sneaker={sneaker}
                  sellable
                  onClick={() => {
                    handleClickSneaker(sneaker.id);
                  }}
                  onClickSell={() => {
                    handleClickSell(sneaker);
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Stack>
      <Dialog open={showApprovalForm}>
        <DialogTitle>Approve for marketplace</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure for approving this sneaker for marketplace?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleHideApprovalForm}>Disagree</Button>
          <Button onClick={handleApprove}>Agree</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={showSellForm} onClose={handleHideSellForm}>
        <DialogTitle>Enter your price</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your price for this sneaker
          </DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            id='price'
            label='Price'
            type='number'
            fullWidth
            variant='standard'
            onChange={handleChangePrice}
            value={price}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleHideSellForm}>Cancel</Button>
          <Button disabled={!(price > 0)} onClick={handleSell}>
            Sell
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isMining}>
        <DialogContent>
          <Stack alignItems='center' spacing={2}>
            <Typography variant='h6'>Transaction is mining</Typography>
            <CircularProgress />
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Inventory;
