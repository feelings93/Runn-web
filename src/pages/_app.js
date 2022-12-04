import { ThemeProvider } from '@mui/material/styles';
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import Moralis from 'moralis';
import { useEffect } from 'react';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import Layout from '../components/Layout/Layout';
import { WALLET_CONNECT_PROJECT_ID } from '../constants/config';
import '../styles/globals.css';
import { theme } from '../utils/theme';

const chains = [chain.sepolia];

// Wagmi client
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: 'e4515fa5dc280a79de7fdaa165d8bdaf' }),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: 'Runn', chains }),
  provider,
});

const startMoralis = async () => {
  await Moralis.start({
    apiKey: '8fEhw0URh6B6PYMj0aJRZHqjk7vYY9pOkz5vXB1wcUOBAjMXOVEjq9oDyw2tJMSr',
  });
};
startMoralis();

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);

function MyApp({ Component, pageProps }) {
  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <ThemeProvider theme={theme}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </WagmiConfig>

      <Web3Modal
        projectId='e4515fa5dc280a79de7fdaa165d8bdaf'
        ethereumClient={ethereumClient}
      />
    </>
  );
}

export default MyApp;
