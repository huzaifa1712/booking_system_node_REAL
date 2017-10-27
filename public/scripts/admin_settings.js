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
  //days array
  var days = space.days;

  var daysDiv = $("#days");

  //unchecks all checkboxes before checking those necessary.
  $("#days input").each(function(){
    $(this).prop("checked",false);
  });

  //goes through the array of days, then inside is another loop that loops through
  //the checkboxes. If the day of the id corresponding to the box(#monday gives 'monday')
  //is equal to the day, check the box.
  days.forEach(function(day){
    var dayFromSpace = day;
    console.log("dayFromSpace: " + day);

    $("#days input").each(function(){
      var inputId = $(this).attr('id');
      console.log("Input id:" + inputId);

      if(inputId == day){
        $(this).prop("checked",true);
      }
    });
  });

  var modalBody = $("#modal-body");

  //removes all the time-group elements before populating with new ones.
  $(".time-group").each(function(){
    $(this).remove();
  });

  //populates the time elements. e.g 12:45 to 1:45, which is why the for loop
  //goes from 0 to length-1, and uses i and i+1th elements of the array.
  for(var i = 0; i < times.length - 1; i++){
    var div = $('<div class = "row time-group">');
    $('<input id = "start" type = "time" value = "' + times[i] + '">').appendTo(div);
    $('<span class = "middle"> to </span>').appendTo(div);
    $('<input id = "end" type = "time" value = "' + times[i + 1] + '">').appendTo(div);
    div.appendTo(modalBody);
  }
  /*
  for(var i = 0; i < times.length; i++){
    $('<input type = "time" value = "' + times[i] + '">').appendTo(modalBody);
  }*/
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
      populateModal(spaceId);
    });
  });
}

//Validate settings input.
//1. Check that at least one day is checked.
//2. Check that none of the time fields are blank.
//If none are blank:
//3. Check that the 2nd time in each time-group is a moment of time ahead of the first.
//4. Check that each consecutive time group's starting time is ahead or equal of/to the previous time-group's
//end time.
//Returns: Error message if any, boolean indicating if there is an error message or not.
function validateSettingsInput(){
  //Initialise error msg string and boolean indicating error or not.
  var errorMsg = "ERROR: Please make sure the following are done:\n\n";
  var isErr = false; //innocent until proven guilty

  //1. Check that at least one day is checked.
  if(!$("input[name='day']:checked").val()){
    isErr = true;
    errorMsg = errorMsg + "At least one day is selected.\n";
  }

  //2. Check that none of the time fields are blank. This gets triggered
  //when meridien isn't set for something as well.
  var fieldBlank = false;
  $("div.time-group input").each(function(){
    if(!$(this).val()){
      fieldBlank = true;
    }
  });

  //set error message for if fields are blank.
  if(fieldBlank == true){
    isErr = true;
    errorMsg = errorMsg + "No time fields are left blank.\n"
  }

  //if none are blank:
  else if(fieldBlank == false){
    //3. Check that the 2nd time in each time-group is a moment of time ahead of the first.
    var momentIsAfter = false; //variable that will be set to true if there is any incidence of ^.
    $("div.time-group").each(function(){
      //get the first time in that div, and convert to moment.
      var firstTime = $(this).find("#start").val();
      firstTime = moment(firstTime,"kk:mm");
      console.log("firstTime: " + firstTime.format());

      //get the second time in that div, and convert to moment.
      var secondTime = $(this).find("#end").val();
      secondTime = moment(secondTime, "kk:mm");
      console.log("secondTime: " + secondTime.format());

      console.log("isAfter: + " + secondTime.isAfter(firstTime,"minute"));
      //if secondTime is after firstTime, set the var to true.
      if(!secondTime.isAfter(firstTime,"minute")){
        momentIsAfter = true;
      }
    });

    //3. set the error message.
    if(momentIsAfter){
      isErr = true;
      errorMsg = errorMsg + "Within a duration, the first time set is before the second one.\n"
    }

    //using elif because if the above isn't set properly, it can affect this one too.
    //4. Check that each consecutive time group's starting time is ahead of the previous time-group's
    //end time.
    else if(!momentIsAfter){

    }
  }

  return{
    isErr:isErr,
    errorMsg:errorMsg
  }

}
//returns the selected settings for the space, as well as spaceId. Used for
//saving settings after save button is clicked.
function getSelectedSettings(){
  var selectedDays = [];
  //go through the inputs and push the days selected into an array.
  $("#days input:checked").each(function(){
    selectedDays.push($(this).attr('id'));
  });

  console.log(selectedDays);

  var selectedTimes = []; //24 HOUR TIME.
  //go through the divs with the times, and select the value of the time value in the
  //div. Includes duplicates. GETS THE 24 HOUR TIME VALUES.
  $("div.time-group input").each(function(){
    selectedTimes.push($(this).val());
  });

  //this method returns only the unique values in the array.
  selectedTimes = selectedTimes.filter(function(value,index,self){
    return self.indexOf(value) === index;
  });

  //this returns an array with the 12 hour time values + meridien(am/pm). This is the
  //final version we need to set the Space settings.
   selectedTimes = selectedTimes.map(function(time){
    return moment(time,"kk:mm").format("h:mma");
  });

  console.log(selectedTimes);
  //Get the id of the space being edited.
  var spaceId = $("#edit-space-modal").data("spaceId");
  console.log(spaceId);

  var spaceUpdate = {
    id:spaceId,
    days:selectedDays,
    times:selectedTimes
  };

  return spaceUpdate;
}

$(document).ready(function(){
  populateSpacesTable();
  openModal();
  $("#saveBtn").click(function(){

    var validateSettings = validateSettingsInput();

    if(validateSettings.isErr){
      alert(validateSettings.errorMsg);
    }

    else{
      var selectedSpaceSettings = getSelectedSettings();

      $.ajax({
        type:'POST',
        url:'/update_space',
        data:selectedSpaceSettings,
        async:false,
        success:function(response){

        }
      });

      alert('Space setting saved!');
      window.location.reload();


    }

/*
    var selectedDays = [];
    //go through the inputs and push the days selected into an array.
    $("#days input:checked").each(function(){
      selectedDays.push($(this).attr('id'));
    });

    console.log(selectedDays);

    var selectedTimes = []; //24 HOUR TIME.
    //go through the divs with the times, and select the value of the time value in the
    //div. Includes duplicates. GETS THE 24 HOUR TIME VALUES.
    $("div.time-group input").each(function(){
      selectedTimes.push($(this).val());
    });

    //this method returns only the unique values in the array.
    selectedTimes = selectedTimes.filter(function(value,index,self){
      return self.indexOf(value) === index;
    });

    //this returns an array with the 12 hour time values + meridien(am/pm). This is the
    //final version we need to set the Space settings.
     selectedTimes = selectedTimes.map(function(time){
      return moment(time,"kk:mm").format("h:mma");
    });

    console.log(selectedTimes);
    //Get the id of the space being edited.
    var spaceId = $("#edit-space-modal").data("spaceId");
    console.log(spaceId);

    var spaceUpdate = {
      id:spaceId,
      days:selectedDays,
      times:selectedTimes
    };
    */


    //console.log(moment(document.getElementById("time").valueAsDate).zone("+00:00").format("hh:mma"));
    //var date = moment(document.getElementById("time").valueAsDate).zone("+00:00");
    //console.log(document.getElementById("time").valueAsDate);
    //console.log(date.format("hh:mma"));

  });
});