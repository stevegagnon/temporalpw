<html>
<head>
 <title>Temporal.PW - Temporary secure storage for passwords</title>
 <meta name="viewport" content="width=device-width, initial-scale=1">
 <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.min.css">
 <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
 <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min.js"></script>
 <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/zeroclipboard/2.2.0/ZeroClipboard.min.js"></script>
 <script type="text/javascript" src="https://cdn.rawgit.com/swfobject/swfobject/master/swfobject/swfobject.js"></script>
 <script type="text/javascript" src="https://cdn.rawgit.com/ricmoo/aes-js/master/index.js"></script>
 <script type="text/javascript" src="https://cdn.rawgit.com/45678/base58/master/Base58.js"></script>
 <script type="text/javascript" src="https://cdn.rawgit.com/jprichardson/secure-random/master/lib/secure-random.js"></script>
</head>
<body>

<style type="text/css">
  body { background: #d3d3d3 !important; }
  h1 { font-family: 'Cooper Black', serif; }
</style>

<script language="javascript">
  var have_url = false;

  function simple_checksum(s) { // based on Schnaader's
    var i;
    var chk = 0x12345678;
    for (i = 0; i < s.length; i++) {
      chk += (s.charCodeAt(i) * (i + 1));
    }
    return (chk & 0xff).toString(16); // 2-char is sufficient
  };


function generate_url() {
  // generate random key byte array ..
  var key = secureRandom.randomUint8Array( 16 );  // random 128 bit AES key
  
  // encode key byte array ..
  var encoded_key = Base58.encode( key );
  
  // convert password string to byte array ..
  var password = document.myForm.secret.value;
  
  var password_bytes = aesjs.util.convertStringToBytes( password );
  
  // encrypt password ..
  var aesCtr = new aesjs.ModeOfOperation.ctr( key, new aesjs.Counter( 5 ) );
  var encrypted_bytes = aesCtr.encrypt( password_bytes );
  
  // encode encrypted password ..
  var encoded_encrypted_bytes = Base58.encode( encrypted_bytes );
  
  $.post( "/new", 
          { cipher: encoded_encrypted_bytes, // ONLY send encrypted password to server, NEVER send the key!
            days: document.myForm.days.value,
            myiponly: document.myForm.myiponly.value },
          function( data, status ) { got_id( data, status, encoded_key ) } ); // encryption key is never sent to server, only to ajax success callback for building URL in browser
  
  return false;
};


function got_id( data, status, encoded_key ) {
  // setup copying to clipboard ..
  ZeroClipboard.config( { swfPath: "/static/ZeroClipboard.swf" } );
  var clientPass = new ZeroClipboard( $( "#button" ) );
  var $bridge = $( "#global-zeroclipboard-html-bridge" );
  clientPass.on("copy", function(event, data) {
      var copiedValue = document.myForm.secret.value;
      var clipboard = event.clipboardData;
      clipboard.setData( "text/plain", copiedValue );
  });
  clientPass.on("aftercopy", function() {
    $bridge.data("placement", "right").tooltip("enable").attr("title", "Copied password!").tooltip("fixTitle").tooltip("show");
  });
  $('.mytooltip').mouseleave( function() {
    $bridge.tooltip("disable");
  });
  
  $("#docs").text( "This URL can be used ONCE to view the password:" );
  
  var token = data.pw_id + "-" + encoded_key;

  document.myForm.secret.value = "https://Temporal.PW/p#" + token + simple_checksum( token );
  $("#secret").attr( "readonly", true );
  
  var info = "(this URL will expire in " + document.myForm.days.value + " days";
  if ( document.myForm.myiponly.checked ) {
    info = info + ", and it is only viewable from this same IP address";
  }
  $("#settings").html( info + ")<br/>" );
  $("#warning").addClass("hidden");
  
  if ( swfobject.hasFlashPlayerVersion( "1" ) ) {
    $("#button").attr( "value", "Copy URL to clipboard" );
  } else {
    $("#button").addClass("hidden");
  }
  have_url = true;
  
  return false; // DEBUG
};



$(document).ready(function(){
  $("#button").prop( "disabled", true );

  $("#secret").on( "input", function() {
    if($(this).val().length)
        $("#button").prop( "disabled", false );
    else
        $("#button").prop( "disabled", true );
  });
  
  $("#button").click(function(){
    var secret = document.forms[ "myForm" ][ "secret" ].value;
    if ( secret == null || secret == "" ) {
      return false;
    }
    
    if ( ! have_url ) {
      generate_url();
    }
    
    return false; // don't actually submit
  });
  
});

$(document).on('click','input[type=text]',function(){ this.select(); });

</script>

<div class="container text-center">

<br/>
<br/>
<h1>E-Mail passwords securely with <a href="/">Temporal.PW</a></h1>
<br/>
<br/>

<!-- <form role="form" id="myForm" name="myForm" onsubmit="return buttonClick();"> -->
<form role="form" id="myForm" name="myForm" action="">
<div class="form-group">

<label for="inputlg"><h2><div id="docs">Enter a password to create a temporary secure URL for:</div></h2></label>
<div class="col-xs-8 col-xs-offset-2 text-center">
  <input type="text" id="secret" name="secret" placeholder="Enter a password" class="form-control input-lg text-center">
</div>

<br/>
<br/>
<br/>
<br/>

<h4>
<span id="settings">
<div>
Make this URL expire in <select name="days" id="days">
  <option value="1">1</option>
  <option value="2">2</option>
  <option value="3" selected>3</option>
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
</select> days.
</div>

<div class="checkbox">
 <label><input type="checkbox" name="myiponly" id="myiponly">Only allow it to be viewed from my current IP address<br/>
 <small>(useful for sending a password to someone in the same office / network)</small></label>
</div>

</span>

<br/>
</h4>

<input type="submit" id="button" class="btn btn-primary btn-lg mytooltip" value="Get temporary URL for this password">

</div>
</form>

<br/>
<span id="warning">
(Do not include any information that identifies what the password is for)<br/>
</span>
<br/>

<a href="/">Send another password</a> | <a href="/about">About</a> | <a href="https://github.com/tkooda/temporalpw">Source</a></br>

</div>

</body>
</html>
