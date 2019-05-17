import * as React from 'react';
import { withRouter } from 'react-router-dom';
import Footer from './Footer';
import { generatePassword } from '../lib/random-password';
import { storeCipher, createUrl, encrypt } from '../lib/temporal-pw';

export default withRouter(function CreateUrl({ history }) {
  const [password, setPassword] = React.useState('');
  const [expireDays, setExpireDays] = React.useState(3);
  const [useIpFilter, setUseIpFilter] = React.useState(false);

  function generateRandomPassword() {
    setPassword(generatePassword());
  }

  async function onCreateUrl() {
    const [cipher, cipherKey] = encrypt(password);

    const cipherId = await storeCipher(cipher, expireDays, useIpFilter);

    const url = createUrl(cipherId, cipherKey);

    console.log(url);
  }

  return (
    <div>
      <h1>E-Mail passwords securely with <a href="/">Temporal.PW</a></h1>

      <label>
        Enter a password to create a temporary secure URL for:
        <input type="text" placeholder="Enter a password" value={password} onChange={event => setPassword(event.target.value)} />
      </label>

      or: <button onClick={generateRandomPassword}>Generate a random password</button>

      <p>
        Make this URL expire in
        <select defaultValue={`${expireDays}`} onChange={event => setExpireDays(+event.target.value)}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
        days.
      </p>

      <label>
        <input type="checkbox" checked={useIpFilter} onChange={event => setUseIpFilter(event.target.checked)} />
        Only allow it to be viewed from my current IP address
        <small>(useful for sending a password to someone in the same office / network)</small>
      </label>

      <button onClick={onCreateUrl}>Get temporary URL for this password</button>

      <p>(Do not include any information that identifies what the password is for)</p>

      <Footer />
    </div>
  );
});
