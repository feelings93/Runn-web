import {
  ArrowForward,
  HorizontalRule,
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
  List,
  ListItem,
  ListItemText,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { formatUnits } from 'ethers/lib/utils.js';
import Image from 'next/image';
import React, { useState } from 'react';
import { formatDisplayingETH } from '../../../utils/formatNumber';
import {
  mapSneakerRarityToStar,
  mapSneakerTypeToSpeed,
} from '../../../utils/sneaker';

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: 'white',
  },
  '& .MuiRating-iconEmpty': {
    color: 'rgba(255,255,255,0.3)',
  },
});

const SneakerCard = (props) => {
  const {
    sneaker,
    onClick,
    buyable,
    cancellable,
    onClickCancel,
    sellable,
    onClickSell,
  } = props;

  const handleClick = () => {
    onClick();
  };

  const handleClickCancel = (e) => {
    e.stopPropagation();
    onClickCancel();
  };

  const handleClickSell = (e) => {
    e.stopPropagation();
    onClickSell();
  };

  return (
    <div onClick={handleClick}>
      <Box
        display='flex'
        borderRadius={3.5}
        flexDirection='column'
        textAlign='center'
        bgcolor='#202020'
        p='20px 12px 12px'
        alignItems='flex-start'
      >
        <Stack direction='row' justifyContent='space-between' width='100%'>
          <Stack direction='column' alignItems='flex-start'>
            <Typography fontWeight={700} fontSize={20} color='white'>
              {sneaker.rarity}
            </Typography>
            <Typography fontWeight={700} fontSize={20} color='white'>
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
        <Box position='relative' width='100%' height={100}>
          <Image
            alt='sneaker'
            fill
            src={sneaker.imgUrl}
            style={{
              objectFit: 'contain',
            }}
          />
        </Box>
        <Chip
          style={{ margin: '8px auto' }}
          color='darkCustom'
          label={`id#${sneaker.id}`}
        />
        <Box width='100%'>
          <Stack
            direction='row'
            alignItems='center'
            justifyContent='space-between'
          >
            <Typography
              fontWeight={700}
              fontSize={18}
            >{`${mapSneakerTypeToSpeed(sneaker.type)} (KM/H)`}</Typography>
          </Stack>
          <List>
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
                <Typography color='text.secondary'>{sneaker.joy}</Typography>
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
              <Typography color='text.secondary'>Condition</Typography>
            </Box>
            <Box>
              <Stack
                flexDirection='row'
                alignItems='center'
                gap={0.5}
                justifyContent='flex-end'
              >
                <Spa color='primary' fontSize='small' />
                <Rating
                  sx={{
                    display: {
                      md: 'flex',
                      lg: 'none',
                      xl: 'flex',
                      xs: 'none',
                      sm: 'flex',
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
              <Typography color='text.secondary' textAlign='left'>
                Shoe mints
              </Typography>
            </Box>
          </Stack>
          {buyable && (
            <Stack
              mt={2}
              width='100%'
              flexDirection='row'
              justifyContent='space-between'
            >
              <Stack flexDirection='row' gap={1} alignItems='center'>
                <Image
                  width={12}
                  height={12}
                  src={'https://go.amazy.io/images/icons/busd-primary.svg'}
                  alt='eth'
                />
                <Typography>{`${formatDisplayingETH(
                  formatUnits(sneaker.price)
                )} ETH`}</Typography>
              </Stack>
              <Fab
                size='small'
                color='primary'
                style={{ height: 32, width: 32, minHeight: 32 }}
              >
                <ArrowForward style={{ fontSize: 16 }} />
              </Fab>
            </Stack>
          )}
          {cancellable && (
            <Stack width='100%' mt={2} alignItems='flex-end'>
              <Button
                variant='contained'
                color='primary'
                onClick={handleClickCancel}
              >
                Cancel
              </Button>
            </Stack>
          )}
          {sellable && (
            <Stack width='100%' mt={2} alignItems='flex-end'>
              <Button
                variant='contained'
                color='primary'
                onClick={handleClickSell}
              >
                Sell
              </Button>
            </Stack>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default SneakerCard;
