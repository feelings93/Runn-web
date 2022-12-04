import { Box, Container } from '@mui/material';
import dynamic from 'next/dynamic';
import React from 'react';
import Footer from '../Footer/Footer';

const Header = dynamic(() => import('../Header/Header'), { ssr: false });

const Layout = ({ children }) => {
  return (
    <>
      <Container fixed>
        <Header />
        <Box pt={6} pb={18}>
          {children}
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default Layout;
