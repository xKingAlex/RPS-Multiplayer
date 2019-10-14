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

var playerOneExists;
var playerTwoExists;

var playerOne = "";
var playerTwo = "";

var playerRef = "/players";

$(document).ready(function () {
    localStorage.clear();

    database.ref(playerRef).on('value', function (data) {
        playerOne = data.val().PlayerOne;
        playerTwo = data.val().PlayerTwo;

        var numPlayers = 0;

        //checks to see if a player is open
        if (playerOne === "") {
            console.log("Player 1 is open");
            playerOneExists = false;

            $("#gameStatusText").text("OPEN");
            $("#gameStatusText").attr("class", "gameOpenText");
        }
        else if (playerTwo === "") {
            console.log("Player 2 is open");
            playerTwoExists = false;

            $("#gameStatusText").text("OPEN");
            $("#gameStatusText").attr("class", "gameOpenText");
        }
        else {
            console.log("game is full");

            $("#gameStatusText").text("FULL");
            $("#gameStatusText").attr("class", "gameFullText");
        }

        //Checks to see which player is taken
        if (playerOne !== "") {
            console.log("P1 exists");
            playerOneExists = true;
            numPlayers++;
        }
        if (playerTwo !== "") {
            console.log("P2 exists");
            playerTwoExists = true;
            numPlayers++;
        }


        $("#numPlayersInGame").text(numPlayers);
    });
});

function joinGame() {
    var nickname = $("#playerNickname").val().trim();

    if (nickname.includes(" ")) {
        alert("Sorry, No Spaces Allowed");
    }
    else {
        if (playerOneExists === false) {
            console.log("Joined as p1");

            localStorage.setItem("isPlayerOne", true);
            localStorage.setItem("isPlayerTwo", false);

            database.ref(playerRef).set({
                PlayerOne: nickname,
                PlayerTwo: playerTwo
            })

            switchPage();
        }
        else if (playerTwoExists === false) {
            console.log("Joined as p2");

            localStorage.setItem("isPlayerOne", false);
            localStorage.setItem("isPlayerTwo", true);

            database.ref(playerRef).set({
                PlayerOne: playerOne,
                PlayerTwo: nickname
            })

            switchPage();
        }
        else {
            localStorage.setItem("isPlayerOne", false);
            localStorage.setItem("isPlayerTwo", false);

            console.log("sorry game is full");
        }
    }
}

function switchPage(){

    //!!!! TESTING
    // document.location.href = "file:///C:/Users/Alexj/Documents/Code/KU-EDW-FSF-PT-08-2019-U-C/07-firebase/02-Homework/RPS-Multiplayer/main.html"

    document.location.href = "https://xkingalex.github.io/RPS-Multiplayer/main.html";
}