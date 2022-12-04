import {
  ArrowForward,
  KeyboardBackspace,
  Security,
  Spa,
  Star,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Divider,
  Fab,
  Grid,
  List,
  ListItem,
  ListItemText,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useWeb3Modal } from '@web3modal/react';
import { Contract, ethers } from 'ethers';
import { formatUnits, parseEther } from 'ethers/lib/utils.js';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { RunnMarketplaceABI } from '../../constants/RunnMarketplaceABI';
import { RunnSneakerABI } from '../../constants/RunnSneakerABI';
import {
  mapTokenDataToSneaker,
  mapTokenDataToSneakerInDetail,
} from '../../utils/formatTokenData';
import {
  mapSneakerRarityToStar,
  mapSneakerTypeToAbout,
  mapSneakerTypeToSpeed,
} from '../../utils/sneaker';

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: 'white',
  },
  '& .MuiRating-iconEmpty': {
    color: 'rgba(255,255,255,0.3)',
  },
});

const DetailSneaker = (props) => {
  const router = useRouter();
  const { open: openConnectModal } = useWeb3Modal();
  const { isConnected, address } = useAccount();
  const [sneaker, setSneaker] = useState(null);
  const { id, from = 'marketplace' } = router.query;
  const buyable = from === 'marketplace' || from === '';

  useEffect(() => {
    if (id) fetchSneaker(id);
  }, [id]);

  const fetchSneaker = async (id) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new Contract(
          '0x4a30Cf2843f8075e6aa92e867c38E8308bA7b998',
          RunnSneakerABI,
          signer
        );
        const marketplaceContract = new Contract(
          '0xb8f25b2ed468d2144B2Dcf75D5db7400728AE4e2',
          RunnMarketplaceABI,
          signer
        );
        const tokenData = await nftContract.tokenData(id);
        const sellId = await marketplaceContract.sellIdByToken(
          '0x4a30Cf2843f8075e6aa92e867c38E8308bA7b998',
          id
        );
        const sellInfo = await marketplaceContract.sellInfo(sellId);
        const { seller, price, active } = sellInfo;
        const formattedSneaker = mapTokenDataToSneakerInDetail(tokenData);

        setSneaker({
          ...formattedSneaker,
          id,
          saleId: sellId,
          price,
          active,
          seller,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleBuySneaker = async () => {
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
        const tx = await marketplaceContract.buy(sneaker.saleId, {
          value: parseEther(formatUnits(sneaker.price)),
        });
        await tx.wait();

        alert('mua thanh cong');

        router.push('/inventory');
      }
    } catch (err) {
      alert(err);
    }
  };

  const handleBack = () => {
    router.push(`/${from}`);
  };

  const handleConnect = () => {
    openConnectModal();
  };

  if (!sneaker) return <Typography>Not found</Typography>;

  return (
    <Grid container spacing={8}>
      <Grid xs={12} item md={4} lg={5}>
        <Box width='100%'>
          <Button
            startIcon={<KeyboardBackspace />}
            variant='text'
            color='textSecondary'
            onClick={handleBack}
          >
            {`Back to ${from || 'marketplace'}`}
          </Button>
          <Box position='relative' width='100%' height={300}>
            <Image
              alt='sneaker'
              fill
              src='https://go.amazy.io/images/sneakers/common/hiker/00692.png'
              style={{
                objectFit: 'contain',
              }}
            />
          </Box>
          {buyable &&
            sneaker.seller !== address &&
            (isConnected ? (
              <Button
                sx={{
                  width: { xs: '100%', xl: 'unset' },
                }}
                size='large'
                variant='contained'
                onClick={handleBuySneaker}
              >{`Buy for ${formatUnits(sneaker.price)} ETH`}</Button>
            ) : (
              <Button
                sx={{
                  width: { xs: '100%', xl: 'unset' },
                }}
                size='large'
                variant='contained'
                onClick={handleConnect}
              >{`Connect to metamask wallet`}</Button>
            ))}
        </Box>
      </Grid>
      <Grid xs={12} item md={8} lg={7}>
        <Box
          display='flex'
          borderRadius={3.5}
          flexDirection='column'
          bgcolor='#202020'
          p='22px 20px 32px'
          alignItems='flex-start'
        >
          <Stack direction='row' justifyContent='space-between' width='100%'>
            <Stack direction='column' alignItems='flex-start'>
              <Typography fontWeight={700} fontSize={28} color='white'>
                {sneaker.rarity}
              </Typography>
              <Typography fontWeight={700} fontSize={28} color='white'>
                {sneaker.type}
              </Typography>
            </Stack>
            <StyledRating
              color='red'
              icon={<Star fontSize='small' />}
              emptyIcon={<Star fontSize='small' color='text.secondary' />}
              readOnly
              value={mapSneakerRarityToStar(sneaker.rarity)}
              max={5}
            />
          </Stack>
          <Typography>
            {`Lv.${sneaker.level}`}
            <Typography variant='span' color='text.secondary'>
              /30
            </Typography>
          </Typography>
          <Chip
            style={{ margin: '8px' }}
            color='darkCustom'
            label={`id#${sneaker.id}`}
          />
          <Stack spacing={0.5}>
            <Typography fontWeight={700} fontSize={20} color='white'>
              About Sneaker
            </Typography>
            <Typography color='text.secondary'>
              {mapSneakerTypeToAbout(sneaker.type)}
            </Typography>
          </Stack>
          <Typography mt={4} fontWeight={700} fontSize={20} color='white'>
            Characteristics
          </Typography>
          <Grid container rowSpacing={2} columnSpacing={6}>
            <Grid item md={6} xs={12}>
              <List disablePadding>
                <ListItem
                  disableGutters
                  secondaryAction={
                    <Typography color='text.secondary'>
                      {sneaker.performance}
                    </Typography>
                  }
                  disablePadding
                >
                  <ListItemText
                    primaryTypographyProps={{ color: 'text.secondary' }}
                    primary='Performance'
                  />
                </ListItem>
                <Divider color='rgba(255,255,255,0.5)' />
                <ListItem
                  disableGutters
                  secondaryAction={
                    <Typography color='text.secondary'>
                      {sneaker.joy}
                    </Typography>
                  }
                  disablePadding
                >
                  <ListItemText
                    primaryTypographyProps={{ color: 'text.secondary' }}
                    primary='Joy'
                  />
                </ListItem>
                <Divider color='rgba(255,255,255,0.5)' />

                <ListItem
                  disableGutters
                  secondaryAction={
                    <Typography color='text.secondary'>
                      {sneaker.durability}
                    </Typography>
                  }
                  disablePadding
                >
                  <ListItemText
                    primary='Durability'
                    primaryTypographyProps={{ color: 'text.secondary' }}
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item md={6} xs={12}>
              <Stack
                width='100%'
                justifyContent='space-between'
                height={{ md: '100%', xs: 'unset' }}
              >
                <Typography fontSize={18}>{`${mapSneakerTypeToSpeed(
                  sneaker.type
                )} (KM/H)`}</Typography>
                <Stack
                  width='100%'
                  flexDirection='row'
                  justifyContent='space-between'
                  alignItems='center'
                >
                  <Box>
                    <Stack flexDirection='row' alignItems='center' gap={1}>
                      <Security color='primary' fontSize='small' />
                      <Typography
                        fontWeight={700}
                      >{`${sneaker.condition}/100`}</Typography>
                    </Stack>
                    <Typography
                      color='text.secondary'
                      display={{
                        xs: 'none',
                        sm: 'unset',
                        md: 'none',
                        lg: 'unset',
                      }}
                    >
                      Condition
                    </Typography>
                  </Box>
                  <Box>
                    <Stack
                      width='100%'
                      flexDirection='row'
                      alignItems='center'
                      gap={0.5}
                    >
                      <Spa color='primary' fontSize='small' />
                      <Rating
                        sx={{
                          display: {
                            xs: 'none',
                            sm: 'flex',
                            md: 'none',
                            lg: 'flex',
                          },
                        }}
                        icon={
                          <div
                            style={{
                              height: 4,
                              width: 14,
                              marginRight: 1,
                              backgroundColor: '#3b6ded',
                              borderRadius: 12,
                            }}
                          />
                        }
                        emptyIcon={
                          <div
                            style={{
                              height: 4,
                              width: 14,
                              marginRight: 1,
                              backgroundColor: '#363636',
                              borderRadius: 12,
                            }}
                          />
                        }
                        readOnly
                        value={sneaker.mint}
                        max={7}
                      />
                      <Typography>
                        {sneaker.mint}
                        <Typography variant='span' color='text.secondary'>
                          /7
                        </Typography>
                      </Typography>
                    </Stack>
                    <Typography
                      display={{
                        xs: 'none',
                        sm: 'unset',
                        md: 'none',
                        lg: 'unset',
                      }}
                      color='text.secondary'
                      textAlign='left'
                    >
                      Shoe mints
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default DetailSneaker;
