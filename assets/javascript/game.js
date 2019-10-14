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
var playerRecord = "/record";

var PlayerOneAttackVal = "";
var PlayerTwoAttackVal = "";

var p1Wins = 0;
var p2Wins = 0;

var p1Losses = 0;
var p2Losses = 0;

var playerOne = "";
var playerTwo = "";

$(document).ready(function () {
    setPlayerNames();

    //Hides and shows correct btns
    var isPlayerOne = localStorage.getItem("isPlayerOne");
    var isPlayerTwo = localStorage.getItem("isPlayerTwo");

    console.log("isp1: " + isPlayerOne + " isp2: " + isPlayerTwo);

    if (isPlayerOne === 'true') {
        $("#p1-buttons").show();
        $("#p2-buttons").hide();

        //quit buttons
        $("#player1QuitBtn").show();
        $("#player2QuitBtn").hide();

        console.log("show p1 btns and hide p2 btns");
    }
    if (isPlayerTwo === 'true') {
        $("#p1-buttons").hide();
        $("#p2-buttons").show();

        //quit buttons
        $("#player1QuitBtn").hide();
        $("#player2QuitBtn").show();


        console.log("show p2 btns and hide p1 btns");
    }
})

database.ref(playerAttackRef).on('value', function (data) {
    PlayerOneAttackVal = data.val().PlayerOneAttack;
    PlayerTwoAttackVal = data.val().PlayerTwoAttack;

    if (PlayerOneAttackVal !== "") {
        $("#player1Chose").show();
    }
    if (PlayerTwoAttackVal !== "") {
        $("#player2Chose").show();
    }

    $("#p1Wins").text(p1Wins);
    $("#p2Wins").text(p2Wins);

    $("#p1Losses").text(p1Losses);
    $("#p2Losses").text(p2Losses);

    //if both players have selected, start countdown
    if (PlayerOneAttackVal !== "" && PlayerTwoAttackVal !== "") {
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
        if (playerOne !== "" && playerTwo !== "") {
            $("#waitingForPlayerDiv").hide();
            $("#waitingForSelection").show();

            console.log("there are 2 players");
        }
        else {
            $("#waitingForPlayerDiv").show();
            $("#waitingForSelection").hide();

            console.log("there is NOT 2 players");
        }

    });
}

$(".p1-btn").on("click", function () {
    console.log("p1: " + this.value);

    database.ref(playerAttackRef).set({
        PlayerOneAttack: this.value,
        PlayerTwoAttack: PlayerTwoAttackVal,
    })

    console.log("p1Chose.show()");
})

$(".p2-btn").on("click", function () {
    console.log("p2: " + this.value);

    $("#player2Chose").show();

    database.ref(playerAttackRef).set({
        PlayerOneAttack: PlayerOneAttackVal,
        PlayerTwoAttack: this.value,
    })

    console.log("p2Chose.show");
})

function startCountdown() {
    $("#waitingForSelection").hide();
    $("#countdownSection").show();

    var startTime = 3;

    var timer = setInterval(function () {
        var newTime = startTime--;
        console.log(newTime);

        $("#timer").text(newTime);

        if (newTime === 0) {
            clearInterval(timer);
            roundResults();
        }
    }, 1000)
}

function roundResults() {
    var p1Selection = PlayerOneAttackVal.toLowerCase();
    var p2Selection = PlayerTwoAttackVal.toLowerCase();

    var p1Class = "far fa-hand-" + p1Selection;
    var p2Class = "far fa-hand-" + p2Selection;

    $("#countdownSection").hide();
    $("#roundResults").show();

    //add img to results
    $("#player1Selection").attr("class", p1Class);
    $("#player2Selection").attr("class", p2Class);

    if (p1Selection === "rock" && p2Selection === "scissors" ||
        p1Selection === "paper" && p2Selection === "rock" ||
        p1Selection === "scissors" && p2Selection === "paper") {
        console.log("p1 wins!");
        $("#whoWonText").text("Player 1 Wins");

        p1Wins++;
        p2Losses++;

        var startTime = 2;

        var timer = setInterval(function () {
            var newTime = startTime--;
            console.log("resultTimer:" + newTime);

            if (newTime === 0) {
                clearInterval(timer);
                console.log("Results timer is 0");

                database.ref(playerRecord).set({
                    PlayerOneWins: p1Wins,
                    PlayerOneLosses: p1Losses,
                    PlayerTwoWins: p2Wins,
                    PlayerTwoLosses: p2Losses
                })
            }
        }, 1000)
    }
    else if (p2Selection === "rock" && p1Selection === "scissors" ||
        p2Selection === "paper" && p1Selection === "rock" ||
        p2Selection === "scissors" && p1Selection === "paper") {
        console.log("p2 wins!");
        $("#whoWonText").text("Player 2 Wins");
        var startTime = 2;

        var timer = setInterval(function () {
            var newTime = startTime--;
            console.log("resultTimer:" + newTime);

            if (newTime === 0) {
                clearInterval(timer);
                console.log("Results timer is 0");

                p2Wins++;
                p1Losses++;

                database.ref(playerRecord).set({
                    PlayerOneWins: p1Wins,
                    PlayerOneLosses: p1Losses,
                    PlayerTwoWins: p2Wins,
                    PlayerTwoLosses: p2Losses
                })
            }
        }, 1000)

    }
}

database.ref(playerRecord).on('value', function (data) {
    console.log("Player record updated");

    var player1Wins = data.val().PlayerOneWins;
    var player2Wins = data.val().PlayerTwoWins;
    var player1Losses = data.val().PlayerOneLosses;
    var player2Losses = data.val().PlayerTwoLosses;

    $("#p1Wins").text(player1Wins);
    $("#p2Wins").text(player2Wins);
    $("#p1Losses").text(player1Losses);
    $("#p2Losses").text(player2Losses);

    database.ref(playerAttackRef).set({
        PlayerOneAttack: "",
        PlayerTwoAttack: ""
    })

    $("#roundResults").hide();


    $("#player1Chose").hide();
    $("#player2Chose").hide();
    $("#waitingForSelection").show();

})

function playerOneQuit(){
    database.ref(playerRef).set({
        PlayerOne: "",
        PlayerTwo: playerTwo
    })

    database.ref(playerAttackRef).set({
        PlayerOneAttack: "",
        PlayerTwoAttack: PlayerTwoAttackVal
    })

    database.ref(playerRecord).set({
        PlayerOneWins: 0,
        PlayerOneLosses: 0,

        PlayerTwoWins: p2Wins,
        PlayerTwoLosses: p2Losses
    })

    setPlayerNames();
}

function playerTwoQuit(){
    database.ref(playerRef).set({
        PlayerOne: playerOne,
        PlayerTwo: ""
    })

    database.ref(playerAttackRef).set({
        PlayerOneAttack: PlayerOneAttackVal,
        PlayerTwoAttack: ""
    })

    database.ref(playerRecord).set({
        PlayerOneWins: p1Wins,
        PlayerOneLosses: p2Wins,

        PlayerTwoWins: 0,
        PlayerTwoLosses: 0
    })

    setPlayerNames();
}

