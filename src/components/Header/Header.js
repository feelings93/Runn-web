import { EvmChain } from '@moralisweb3/evm-utils';
import { ContentCopy, ExitToApp, Folder, Store } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useWeb3Modal } from '@web3modal/react';
import Moralis from 'moralis';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { formatDisplayingETH } from '../../utils/formatNumber';
import { formatAddress } from '../../utils/formatString';

const StyledMenuItem = styled(MenuItem)({
  color: 'rgba(255,255,255,0.5)',
  '&:hover ': {
    color: '#fff',
  },
});

const Header = () => {
  const router = useRouter();
  const { open: openConnectModal } = useWeb3Modal();
  const { isConnected, address } = useAccount();
  const [balance, setBalance] = useState(0);
  const { disconnect } = useDisconnect();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const getBalance = async () => {
      const resp = await fetch(
        `https://api.tatum.io/v3/ethereum/account/balance/${address}`,
        {
          method: 'GET',
          headers: {
            'x-api-key': 'f2ba97db-714c-49c8-89a0-d4d3f2213c47',
          },
        }
      );
      const data = await resp.json();

      setBalance(data?.balance);
    };
    if (address) getBalance();
  }, [address]);

  useEffect(() => {
    const getNfts = async () => {
      const chain = EvmChain.SEPOLIA;

      const response = await Moralis.EvmApi.nft.getWalletNFTs({
        address: '0x71c738B1d24368DdcE9b1Ec14C8dA57F5E079175',
        chain,
        tokenAddresses: ['0xd62B0BeAd0c94F3139787829AE1829b5CaC0d6e5'],
      });

      console.log(response);
    };
    if (address) {
      getNfts();
    }
  }, [address]);

  // const data = {
  //   formatted: 2.5,
  //   symbol: 'ETH',
  // };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigateToInventory = () => {
    router.push('/inventory');
    handleClose();
  };

  const handleConnect = () => {
    openConnectModal();
  };

  const handleDisconnect = () => {
    disconnect();
    handleClose();
  };

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    alert('copy: ' + address);
  };

  // if (isLoading) return <Typography>Fetching balance…</Typography>;
  // if (isError) return <Typography>Error fetching balance</Typography>;

  return (
    <Stack
      py={4}
      direction='row'
      width='100%'
      justifyContent='space-between'
      alignItems='center'
    >
      <Link href='/marketplace'>
        <Stack direction='row' alignItems='center' spacing={1}>
          <Typography fontSize={24} fontWeight={700}>
            RUNN
          </Typography>
          <Store color='primary' />
        </Stack>
      </Link>
      {!isConnected ? (
        <Button variant='contained' onClick={handleConnect}>
          Login with MetaMask wallet
        </Button>
      ) : (
        <>
          <Button onClick={handleClick} color='darkButton' variant='contained'>
            <Stack sx={{ minWidth: 128 }} alignItems='flex-end'>
              <Stack direction='row' alignItems='center'>
                <Image
                  style={{ marginRight: 4 }}
                  width={12}
                  height={12}
                  src='/assets/images/busd.svg'
                  color='#fff'
                  alt='eth'
                />
                <Typography>{`${formatDisplayingETH(balance)} ETH`}</Typography>
              </Stack>
              <Stack direction='row' alignItems='center'>
                <Typography fontSize={12} color='text.secondary'>
                  {formatAddress(address)}
                </Typography>
                <div onClick={handleCopy}>
                  <ContentCopy sx={{ fontSize: '1rem', ml: 0.5 }} />
                </div>
              </Stack>
            </Stack>
          </Button>
          <Menu
            id='basic-menu'
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              sx: { background: '#202020', marginTop: 1, borderRadius: 2 },
            }}
            anchorOrigin={{
              horizontal: 'right',
              vertical: 'bottom',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <StyledMenuItem onClick={navigateToInventory}>
              <Folder fontSize='small' sx={{ mr: 1 }} />
              Inventory
            </StyledMenuItem>
            <StyledMenuItem onClick={handleDisconnect}>
              <ExitToApp fontSize='small' sx={{ mr: 1 }} /> Disconnect
            </StyledMenuItem>
          </Menu>
        </>
      )}
    </Stack>
  );
};

export default Header;
