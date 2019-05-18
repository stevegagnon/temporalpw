import * as React from 'react';
import { LocationProvider, Router, navigate, createHistory } from "@reach/router";
import createHashSource from 'hash-source';
import About from './About';
import CreateUrl from './CreateUrl';
import ViewUrl from './ViewUrl';
import ViewPassword from './ViewPassword';
import { storeCipher, createUrl, encrypt } from '../lib/temporal-pw';

const source = createHashSource();
const history = createHistory(source);

export default function App() {
  const [url, setUrl] = React.useState('');

  async function onCreateUrl(password: string, expireDays: number, useIpFilter: boolean) {
    const [cipher, cipherKey] = encrypt(password);

    const cipherId = await storeCipher(cipher, expireDays, useIpFilter);

    const url = createUrl(cipherId, cipherKey);

    setUrl(url);

    history.navigate('/url');
  }
  return (
    <LocationProvider history={history}>
      <Router>
        <CreateUrl path="/" onCreateUrl={onCreateUrl} />
        <About path="/about" />
        <ViewUrl path="/url" url={url} />
        <ViewPassword path="/p/:id" />
      </Router>
    </LocationProvider>
  );
}
