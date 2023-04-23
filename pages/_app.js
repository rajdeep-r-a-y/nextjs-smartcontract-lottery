import '../styles/globals.css'
import { MoralisProvider } from 'react-moralis';
import { NotificationProvider } from 'web3uikit';

export default function App({ Component, pageProps }) {
  return (
    // in order for us to use moralis, our application needs to be wrapped around a MoralisProvider which is going to be a context provider for us
    // initializeOnMount is the optionality to hook into a server to add some more features to our website
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
    </MoralisProvider>)
}
