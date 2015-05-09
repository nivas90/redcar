$(document).ready(function(){
  $.get( "https://www.google.co.in/", function( data ) {
    $( "#content" ).html( data );
  });
});
