$(document).ready(function(){

 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBX4CGl8ckr5vPXNErTj-hFS_trEj3lqxI",
    authDomain: "trainschedule-89b93.firebaseapp.com",
    databaseURL: "https://trainschedule-89b93.firebaseio.com",
    projectId: "trainschedule-89b93",
    storageBucket: "trainschedule-89b93.appspot.com",
    messagingSenderId: "546002657994"
  };

  firebase.initializeApp(config);

  var database = firebase.database();
  var firstTrain = "";
  var trainName = "";
  var trainDest = "";
  var trainFreq = "";
  var nextTrain ="";
  var minsAway = "";

  //adds a new train to the db on click
  $("#addTrain").on("click", function(){
  	trainName = $("#name").val().trim();
  	trainDest = $("#destination").val().trim();
  	firstTrain = $("#freqTrain").val().trim();
  	trainFreq = $("#frequency").val().trim();

  	 //pushes the gathered data from the form and builds it to push to firebase
     database.ref().push({
        trainName: trainName,
        trainDest: trainDest,
        firstTrain: firstTrain,
        trainFreq: trainFreq,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
    $("#name").val("");
  	$("#destination").val("");
  	$("#freqTrain").val("");
  	$("#frequency").val("");
  })

    //when a child is added, a bunch of math stuff happens
    database.ref().on("child_added", function(snapshot){

    var db = snapshot.val();
    //tomfoolery one of my peers suggested to make sure it comes from before now. seems like a hack, but it works
    var firstTrainConverted = moment(db.firstTrain, "HH:mm").subtract(1, "years");
    //polls moment to figure out what time it is right now then does the math to figure out the difference in time
    var currentTime = moment();
    var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
    //finds the remainder with modulo then finds how many minutes away the train is.
    var tRemainder = diffTime % db.trainFreq;
    var minsAway = db.trainFreq - tRemainder;
    //sets var to reflect the mins away the next train is
    var nextTrain = moment().add(minsAway, "minutes");
      //data for the table, prepending!
      $("#table").prepend(`
	      <tr>
	        <td class="tName">${[db.trainName]}</td>
	        <td class="tDestination">${[db.trainDest]}</td>
	        <td class="tFreq">${[db.trainFreq]}</td>
	        <td class="tNext">${[moment(nextTrain).format("LT")]}</td>
	        <td class="tMinAway">${[minsAway]}</td>
	      </tr>
      	`)
    })
})