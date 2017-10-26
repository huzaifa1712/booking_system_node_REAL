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

//populates the spaces table with names of spaces, and assigns the space ID as data.
function populateSpacesTable(){
  var tBody = $('tbody');
  var spaces = getSpaces();

  for(var i = 0; i < spaces.length; i++){
    var tr = $("<tr>");

    var tdSpace = $("<td>" + spaces[i].name + "</td>");
    tdSpace.data("spaceId", spaces[i]._id);
    tdSpace.appendTo(tr);

    tr.appendTo(tBody);
  }
}

//goes through the table cells and assigns them a click event that opens the modal.
function openModal(){
  $("#spaces-table td").each(function(){
    $(this).attr("data-toggle","modal");
    $(this).attr("data-target","#edit-space-modal");

    $(this).click(function(){
      $("#spaceName").text($(this).text());
    });
  });
}

$(document).ready(function(){
  populateSpacesTable();
  openModal();
});
