//get ARRAY of spaces through AJAX request.
function getSpaces(){
  var spaces = [];
  $.ajax({
    url:'/get_spaces',
    type:'GET',
    async:false,
    success:function(response){
      spaces = response;
    }
  });
  //possible because async is false.
  return spaces;
}

$(document).ready(function(){
  
});
