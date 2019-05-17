import * as React from 'react';
import Footer from './Footer';

interface Props {
  password: string;
}

export default function ViewPassword ({ password }: Props) {
  return (
    <div>
      <p>This password doesn't exist</p>

      <h1>Your password is:</h1>
      <p>{password}</p>
      <p>WARNING: This is the ONLY time this password will be visible via this URL.</p>
      
      <Footer />
    </div>
  );
}
