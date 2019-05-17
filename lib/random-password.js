
function getRandomByte( max = 256 ) {
  // http://caniuse.com/#feat=getrandomvalues
  var crypto = window.crypto || window.msCrypto;
  if ( crypto && crypto.getRandomValues ) {
      var a = new Uint8Array( 1 );
      while ( true ) {
          crypto.getRandomValues( a );
          if ( a[0] <= max ) return a[0];
      }
  } else {
      return Math.floor( Math.random() * max );
  }
};

export function generatePassword( minLength = 20, maxLength = 30, charset = "abcdefghijknopqrstuvwxyzACDEFGHJKLMNPQRSTUVWXYZ2345679" ) {
  if ( minLength > maxLength) maxLength = minLength;
  var randomLength = Math.floor( Math.random() * ( maxLength - minLength ) ) + minLength;
  var password = "";
  for ( var i = 0, maxIndex = charset.length; i < randomLength; i++ ) {
      password += charset.charAt( getRandomByte( maxIndex ) );
  }
  return password;
};
