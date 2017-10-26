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

//get just one space and return it. Used to populate modal.
function getSpace(id){
  var space = {};
  $.ajax({
    url:'/get_space/' + id,
    type:'GET',
    async:false,
    success:function(response){
      space = response;
    }
  });
  //possible because async is false.
  return space;
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

//populates the modal with times and days selections.
function populateModal(id){
  var space = getSpace(id);
  //make a new array with the result of the 24 hour time version of the
  //times in the space object.
  var times = space.times.map(function(time){
    return moment(time,"hh:mma").format("kk:mm");
  });

  var modalBody = $("#modal-body");

  for(var i = 0; i < times.length; i++){
    $('<input type = "time" value = "' + times[i] + '">').appendTo(modalBody);
  }
}
//goes through the table cells and assigns them a click event that opens the modal.
function openModal(){
  $("#spaces-table td").each(function(){
    $(this).attr("data-toggle","modal");
    $(this).attr("data-target","#edit-space-modal");

    $(this).click(function(){
      $("#spaceName").text($(this).text());
      //setting the modal data to the spaceId
      var spaceId = $(this).data("spaceId");

      $("#edit-space-modal").data("spaceId", spaceId);
      //populateModal(spaceId);
    });
  });
}

$(document).ready(function(){
  populateSpacesTable();
  openModal();
  $("#saveBtn").click(function(){
    //console.log(moment(document.getElementById("time").valueAsDate).zone("+00:00").format("hh:mma"));
    //var date = moment(document.getElementById("time").valueAsDate).zone("+00:00");
    //console.log(document.getElementById("time").valueAsDate);
    //console.log(date.format("hh:mma"));

  });
});
