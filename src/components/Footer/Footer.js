import { Facebook, Google, Instagram, Telegram } from '@mui/icons-material';
import { Box, Button, Container, Link, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

const StyledSocialButton = styled(Button)({
  height: 40,
  width: 40,
  minWidth: 'unset',
  minHeight: 'unset',

  '& .MuiButton-startIcon': {
    margin: 0,
  },
});

const Footer = () => {
  return (
    <Box width='100%' bgcolor='#202020'>
      <Container fixed>
        <Box px={0} py={8}>
          <Stack spacing={{ sm: 10, md: 20 }} width='100%'>
            <Stack
              direction={{ sm: 'column', md: 'row' }}
              width='100%'
              justifyContent='space-between'
              spacing={2}
            >
              <Stack spacing={1}>
                <Typography fontSize={24} fontWeight={700}>
                  RUNN
                </Typography>
                <Typography fontSize={18}>19521298@gm.uit.edu.vn</Typography>
              </Stack>
              <Stack direction='row' spacing={1}>
                <StyledSocialButton
                  href='#'
                  variant='contained'
                  startIcon={<Facebook />}
                ></StyledSocialButton>
                <StyledSocialButton
                  href='#'
                  variant='contained'
                  startIcon={<Instagram />}
                ></StyledSocialButton>
                <StyledSocialButton
                  href='#'
                  variant='contained'
                  startIcon={<Google />}
                ></StyledSocialButton>
                <StyledSocialButton
                  href='#'
                  variant='contained'
                  size='small'
                  startIcon={<Telegram />}
                ></StyledSocialButton>
              </Stack>
            </Stack>
            <Stack
              direction={{ sm: 'column', md: 'row' }}
              width='100%'
              justifyContent='space-between'
              spacing={2}
            >
              <Typography>© 2022 - all rights reserved </Typography>
              <Typography color='text.secondary'>
                By using our website, you agree to our
                <Link color='#fff'> Privacy Policy </Link>
                and our <Link color='#fff'> Cookies Policy</Link>
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
