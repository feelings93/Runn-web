import { ThemeProvider } from '@mui/material/styles';
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';

import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import Layout from '../components/Layout/Layout';
import { WALLET_CONNECT_PROJECT_ID } from '../constants/config';
import '../styles/globals.css';
import { theme } from '../utils/theme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const chains = [chain.goerli];

// Wagmi client
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: 'e4515fa5dc280a79de7fdaa165d8bdaf' }),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: 'Runn', chains }),
  provider,
});

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
      <ToastContainer />
    </>
  );
}

export default MyApp;
