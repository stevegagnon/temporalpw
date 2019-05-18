import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import Footer from './Footer';
import { fetchCipher } from '../lib/temporal-pw';
import { decrypt } from '../lib/temporal-pw';

interface Props extends RouteComponentProps {
  id: string;
}

export default function ViewPassword({ id }: Props) {
  const [cipherId, key] = id.split('-');
  const [password, setPassword] = React.useState('');
  const [waiting, setWaiting] = React.useState(true);

  React.useEffect(() => {
    setWaiting(true);
    (async () => {
      try {
        const cipher = await fetchCipher(cipherId);
        const password = decrypt(cipher, key);
        setPassword(password);
      } catch (e) {
        setPassword(null);
      }
      setWaiting(false);
    })();

  }, [id]);

  return (
    <div>
      { waiting ? (
          <h2>Waiting...</h2>
        ) : password === null ? (
          <p>This password doesn't exist</p>
        ) : (
              <>
                <h1>Your password is:</h1>
                <p>{password}</p>
                <p>WARNING: This is the ONLY time this password will be visible via this URL.</p>
              </>
            ) }
      <Footer />
    </div>
  );
}
