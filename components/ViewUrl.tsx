import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import Footer from './Footer';

interface Props extends RouteComponentProps {
  url: string;
}

export default function ViewUrl ({ url }: Props) {
  return (
    <div>
      <h1>E-Mail passwords securely with <a href="/">Temporal.PW</a></h1>

      <h2>This URL can be used ONCE to view the password:</h2>

      <input type="text" value={url} readOnly />

      <p>(this URL will expire in 3 days)</p>

      <Footer />
    </div>
  );
}
