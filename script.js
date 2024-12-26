let boxes = document.querySelectorAll(".box");

let turn = "X";
let isGameOver = false;
let isDraw = false;

// single player/multiplayer
let singleplayer = null
document.querySelector('.multiplayer').addEventListener('click', () => {
    singleplayer = false
    document.querySelector('.landingview').style.display = 'none'
    document.querySelector('.game').style.display = 'block'
    document.querySelector(".time").textContent = "Start!!";

    startCountdown(10, time)
})

document.querySelector('.singleplayer').addEventListener('click', () => {
    singleplayer = true
    document.querySelector('.landingview').style.display = 'none'
    document.querySelector('.game').style.display = 'block'
    document.querySelector(".time").textContent = "Start!!";

    startCountdown(10, time)
})

// mekanik game
boxes.forEach(e => {
    e.innerHTML = ""

    e.addEventListener("click", () => {
        if (!isGameOver && e.innerHTML === "") {
            e.innerHTML = turn;
            cheakWin();
            cheakDraw();
            changeTurn();
            
            if (singleplayer) {
                if (!isGameOver) {
                    setTimeout(botMove, 1000); // Bot delay
                }
            }
        }
    })
})

function changeTurn() {
    if (turn === "X") {
        turn = "O";
        document.querySelector(".bg").style.left = "85px";
    }
    else {
        turn = "X";
        document.querySelector(".bg").style.left = "0";
    }
}

function cheakWin() {
    let winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ]
    for (let i = 0; i < winConditions.length; i++) {
        let v0 = boxes[winConditions[i][0]].innerHTML;
        let v1 = boxes[winConditions[i][1]].innerHTML;
        let v2 = boxes[winConditions[i][2]].innerHTML;

        if (v0 != "" && v0 === v1 && v0 === v2) {
            isGameOver = true;
            document.querySelector("h3").innerHTML = turn + " win";
            document.querySelector("#play-again").style.display = "inline"
            clearInterval(countdownInterval)

            for (j = 0; j < 3; j++) {
                boxes[winConditions[i][j]].style.backgroundColor = "#ff891226"
                // boxes[winConditions[i][j]].style.color = "#ff8812"
            }
        }
    }
}

function cheakDraw() {
    if (!isGameOver) {
        isDraw = true;
        boxes.forEach(e => {
            if (e.innerHTML === "") isDraw = false;
        })

        if (isDraw) {
            isGameOver = true;
            document.querySelector("h3").innerHTML = "Draw";
            document.querySelector("#play-again").style.display = "inline"

            clearInterval(countdownInterval);
        }
    }
}

document.querySelector("#play-again").addEventListener("click", () => {
    isGameOver = false;
    turn = "X";
    document.querySelector(".bg").style.left = "0";
    document.querySelector(".time").textContent = "Start!!";
    document.querySelector("#play-again").style.display = "none";

    boxes.forEach(e => {
        e.innerHTML = "";
        e.style.removeProperty("background-color");
        e.style.color = "#ffa953"
    })

    pause = false
    document.querySelector('h3').textContent = 'Turn for'
    startCountdown(10, time)
})


// Bot
function botMove() {
    if (turn === "O" && !isGameOver) {
        // Step 1: Check for a winning move
        let move = findBestMove("O");
        if (move === null) {
            // Step 2: Block opponent's winning move
            move = findBestMove("X");
        }
        if (move === null) {
            // Step 3: Pick a random empty cell
            let emptyCells = [];
            boxes.forEach((box, index) => {
                if (box.innerHTML === "") emptyCells.push(index);
            });
            move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }

        // Perform the bot's move
        if (move !== null) {
            boxes[move].innerHTML = turn;
            cheakWin();
            cheakDraw();
            changeTurn();
        }
    }
}

function findBestMove(psingleplayer) {
    let winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let i = 0; i < winConditions.length; i++) {
        let [a, b, c] = winConditions[i];
        let values = [boxes[a].innerHTML, boxes[b].innerHTML, boxes[c].innerHTML];

        if (values.filter(v => v === psingleplayer).length === 2 && values.includes("")) {
            return [a, b, c].find(index => boxes[index].innerHTML === "");
        }
    }

    return null; // No winning or blocking move found
}


// music button
document.querySelector(".soundbutton").addEventListener("click", () => {
    const sound = document.querySelector(".sound")
    const music = document.querySelector("audio")

    if (sound.src.includes("img/speaker-filled-audio-tool.png") && music.played) {
        sound.src = "img/mute.png"
        music.pause()

    } else {
        sound.src = "img/speaker-filled-audio-tool.png"
        music.play()
    }
})


// pause
let pause = false

document.querySelector('.pause').addEventListener('click', () => {
    pause = !pause

    document.querySelector('.pausemenu').style.display = 'flex'
})


// time
const time = document.querySelector('.time');
let countdownInterval; // Variable for storing the interval reference

function startCountdown(duration, display) {
    clearInterval(countdownInterval); // Clear previous interval if any

    let totalTime = duration;

    countdownInterval = setInterval(() => {
        if (!pause) {
            const minutes = Math.floor(totalTime / 60);
            const seconds = totalTime % 60;

            if (turn)
                display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            totalTime--;

            if (totalTime < 0) {
                clearInterval(countdownInterval);
                display.textContent = "Time's up!";
                document.querySelector('h3').innerHTML = turn + " lose time"
                document.querySelector("#play-again").style.display = "inline"
                isGameOver = true
            }
        }
    }, 1000);
}

startCountdown(10, time)


// close 
document.querySelector('.close').addEventListener('click', () => {
    pause = !pause

    document.querySelector('.pausemenu').style.display = 'none'
})


// restart 
document.querySelector('.restart').addEventListener('click', () => {
    pause = false

    isGameOver = false;
    turn = "X";
    document.querySelector(".bg").style.left = "0";
    document.querySelector("#play-again").style.display = "none";

    boxes.forEach(e => {
        e.innerHTML = "";
        e.style.removeProperty("background-color");
        e.style.color = "#ffa953"
    })

    document.querySelector('h3').textContent = 'Turn for'
    
    document.querySelector(".time").textContent = "Start!!";
    document.querySelector('.pausemenu').style.display = 'none'
    startCountdown(10, time)
})


// exit
document.querySelector('.exit').addEventListener('click', () => {
    document.querySelector('.landingview').style.display = 'flex'

    document.querySelector('.pausemenu').style.display = 'none'
    document.querySelector('.game').style.display = 'none'
    
    isGameOver = false;
    turn = "X";
    document.querySelector(".bg").style.left = "0";
    document.querySelector("#play-again").style.display = "none";

    boxes.forEach(e => {
        e.innerHTML = "";
        e.style.removeProperty("background-color");
        e.style.color = "#ffa953"
    })

    clearInterval(countdownInterval)
    singleplayer = null
    pause = false
    document.querySelector('h3').textContent = 'Turn for'
})