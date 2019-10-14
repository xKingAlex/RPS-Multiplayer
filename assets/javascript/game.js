var firebaseConfig = {
    apiKey: "AIzaSyAp8PPt40DJLxjfauQBOVywQVsCKh2MsNA",
    authDomain: "rps-multiplayer-a0222.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-a0222.firebaseio.com",
    projectId: "rps-multiplayer-a0222",
    storageBucket: "rps-multiplayer-a0222.appspot.com",
    messagingSenderId: "177285542759",
    appId: "1:177285542759:web:489809be93603db5d075c2",
    measurementId: "G-GL8199XZRS"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var database = firebase.database();

var playerRef = "/players";
var playerAttackRef = "/attack";

var PlayerOneAttackVal = "";
var PlayerTwoAttackVal = "";

$(document).ready(function () {
    setPlayerNames();    

    //Hides and shows correct btns
    var isPlayerOne = localStorage.getItem("isPlayerOne");
    var isPlayerTwo = localStorage.getItem("isPlayerTwo");

    console.log("isp1: " + isPlayerOne + " isp2: " + isPlayerTwo);

    if (isPlayerOne === 'true') {
        $("#p1-buttons").show();
        $("#p2-buttons").hide();

        console.log("show p1 btns and hide p2 btns");
    }
    if(isPlayerTwo === 'true'){
        $("#p1-buttons").hide();
        $("#p2-buttons").show();

        console.log("show p2 btns and hide p1 btns");
    }
})

database.ref(playerAttackRef).on('value', function(data){
    PlayerOneAttackVal = data.val().PlayerOneAttack;
    PlayerTwoAttackVal = data.val().PlayerTwoAttack;

    if(PlayerOneAttackVal !== ""){
        $("#player1Chose").show();
    }
    if(PlayerTwoAttackVal !== ""){
        $("#player2Chose").show();
    }

    //if both players have selected, start countdown
    if(PlayerOneAttackVal !== "" && PlayerTwoAttackVal !== ""){
        startCountdown();
    }

})

function setPlayerNames() {
    database.ref(playerRef).on('value', function (data) {
        playerOne = data.val().PlayerOne;
        playerTwo = data.val().PlayerTwo;

        console.log("p1: " + playerOne);

        if (playerOne !== "") {
            $("#player1Name").text(playerOne);
        }
        else {
            $("#player1Name").text("Empty");
        }

        if (playerTwo !== "") {
            $("#player2Name").text(playerTwo);
        }
        else {
            $("#player2Name").text("Empty");
        }

        //checks to see if there are 2 players in game
        if(playerOne !== "" && playerTwo !== ""){
            $("#waitingForPlayerDiv").hide();
            $("#waitingForSelection").show();

            console.log("there are 2 players");
        } 
        else{
            $("#waitingForPlayerDiv").show();
            $("#waitingForSelection").hide();

            console.log("there is NOT 2 players");
        }
        
    });
}

$(".p1-btn").on("click", function(){
    console.log("p1: " + this.value);

    database.ref(playerAttackRef).set({
        PlayerOneAttack: this.value,
        PlayerTwoAttack: PlayerTwoAttackVal
    })

    console.log("p1Chose.show()");
})

$(".p2-btn").on("click", function(){
    console.log("p2: " + this.value);

    $("#player2Chose").show();

    database.ref(playerAttackRef).set({
        PlayerOneAttack:PlayerOneAttackVal,
        PlayerTwoAttack: this.value
    })

    console.log("p2Chose.show");
})

function startCountdown(){
    $("#waitingForSelection").hide();
    $("#countdownSection").show();

    var startTime = 3;

    var timer = setInterval(function(){
        var newTime = startTime--;
        console.log(newTime);

        $("#timer").text(newTime);

        if(newTime === 0){
            clearInterval(timer);
            roundResults();
        }
    }, 1000)
}

function roundResults(){
    var p1Selection = PlayerOneAttackVal.toLowerCase();
    var p2Selection = PlayerTwoAttackVal.toLowerCase();

    var p1Class = "far fa-hand-" + p1Selection;
    var p2Class = "far fa-hand-" + p2Selection;

    $("#countdownSection").hide();
    $("#roundResults").show();

    //add img to results
    $("#player1Selection").attr("class", p1Class);
    $("#player2Selection").attr("class", p2Class);
}