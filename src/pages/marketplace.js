import { Button, Grid, Stack, Typography } from '@mui/material';
import { Contract, ethers } from 'ethers';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import Filters from '../components/Marketplace/Filters/Filters';
import SneakerCard from '../components/UI/SneakerCard/SneakerCard';
import { RunnMarketplaceABI } from '../constants/RunnMarketplaceABI';
import { RunnSneakerABI } from '../constants/RunnSneakerABI';
import { mapTokenDataToSneakerInDetail } from '../utils/formatTokenData';

const defaultFilter = {
  rarities: [],
  types: [],
  level: {
    from: '',
    to: '',
  },
  price: {
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

const Marketplace = (props) => {
  const router = useRouter();
  const [sneakers, setSneakers] = useState([]);
  const [showMine, setShowMine] = useState(false);
  const { address } = useAccount();
  const [filter, setFilter] = useState(defaultFilter);

  useEffect(() => {
    fetchAllSneakers();
  }, []);

  const fetchAllSneakers = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const marketplaceContract = new Contract(
          '0xb8f25b2ed468d2144B2Dcf75D5db7400728AE4e2',
          RunnMarketplaceABI,
          signer
        );
        const nftContract = new Contract(
          '0x4a30Cf2843f8075e6aa92e867c38E8308bA7b998',
          RunnSneakerABI,
          signer
        );
        const res =
          await marketplaceContract.functions.sellInfoActiveByContract(
            '0x4a30Cf2843f8075e6aa92e867c38E8308bA7b998'
          );
        const allSellInfos = res[0];

        const formattedSneakers = allSellInfos.map(async (sellInfo) => {
          const { price, tokenId, saleId, seller } = sellInfo;

          const tokenData = await nftContract.tokenData(tokenId);
          return {
            ...mapTokenDataToSneakerInDetail(tokenData),
            id: tokenId,
            saleId,
            seller,
            price,
          };
        });
        const resultSneakers = await Promise.all(formattedSneakers);
        setSneakers(resultSneakers);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickSneaker = (id) => {
    router.push(`sneaker/${id}?from=marketplace`);
  };

  const handleCancelSell = async (id) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const marketplaceContract = new Contract(
          '0xb8f25b2ed468d2144B2Dcf75D5db7400728AE4e2',
          RunnMarketplaceABI,
          signer
        );
        const tx = await marketplaceContract.cancel(id);
        await tx.wait();
        alert('huy thanh cong');
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleShowMine = () => {
    setShowMine(true);
  };

  const handleHideMine = () => {
    setShowMine(false);
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
      const priceCondition =
        (!filter.price.from && !filter.price.to) ||
        (filter.price.from &&
          !filter.price.to &&
          sneaker.price >= filter.price.from) ||
        (!filter.price.from &&
          filter.price.to &&
          sneaker.price <= filter.price.to) ||
        (filter.price.from <= sneaker.price &&
          filter.price.to >= sneaker.price);
      return (
        typeCondition &&
        rarityCondition &&
        mintCondition &&
        performanceCondition &&
        levelCondition &&
        joyCondition &&
        durabilityCondition &&
        priceCondition &&
        (!showMine || sneaker.seller === address)
      );
    });
  }, [filter, sneakers, address, showMine]);

  return (
    <Stack gap={1}>
      <Stack
        direction='row'
        justifyContent='space-between'
        width='100%'
        alignItems='center'
      >
        <Typography variant='h4' fontWeight={700} mb={2}>
          Marketplace
        </Typography>
        <Stack direction='row' spacing={2}>
          <Button
            variant={!showMine ? 'contained' : 'outlined'}
            color={!showMine ? 'darkButton' : 'text'}
            onClick={handleHideMine}
            sx={{ minWidth: 100 }}
          >
            Buy
          </Button>
          <Button
            variant={showMine ? 'contained' : 'outlined'}
            color={showMine ? 'darkButton' : 'text'}
            onClick={handleShowMine}
            sx={{ minWidth: 100 }}
          >
            My List
          </Button>
        </Stack>
      </Stack>
      <Grid container spacing={4} alignItems='flex-start'>
        <Grid item xs={12} md={3}>
          <Filters
            filter={filter}
            onChangeFilter={setFilter}
            onResetFilter={handleResetFilter}
          />
        </Grid>
        <Grid item xs={12} md={9} spacing={4} container wrap='wrap'>
          {filteredSneakers.length > 0 ? (
            filteredSneakers.map((sneaker) => (
              <Grid key={sneaker.id} item xs={12} md={6} lg={4}>
                <SneakerCard
                  buyable={!showMine}
                  cancellable={showMine}
                  sneaker={sneaker}
                  onClick={() => handleClickSneaker(sneaker.id)}
                  onClickCancel={() => handleCancelSell(sneaker.saleId)}
                />
              </Grid>
            ))
          ) : (
            <Typography
              width='100%'
              color='text.secondary'
              textAlign='center'
              fontSize={32}
            >
              No Data Found
            </Typography>
          )}
        </Grid>
      </Grid>
    </Stack>
  );
};

export default Marketplace;
