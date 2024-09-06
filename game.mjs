//#region Dont look behind the curtain
// Do not worry about the next two lines, they just need to be there. 
import * as readlinePromises from 'node:readline/promises';
const rl = readlinePromises.createInterface({ input: process.stdin, output: process.stdout });

async function askQuestion(question) {
    return await rl.question(question);
}

//#endregion
import { statistics } from './statistics.mjs';
import { ANSI } from './ansi.mjs';
import { HANGMAN_UI } from './graphics.mjs';

const SPACER = '_'
const randomWords = ["suggestion", "hospital","coffee", "bonus", "farmer", "bedroom", "departure", "independence", "funeral", "boyfriend", "analyst", "orange", "science", "meat", 
"tooth", "platform", "paper", "analysis"];

const winner_screen = "you have won!";
let numberOfCharInWord = '';
let wordDisplay = "";
let guessedWord = ""; 
let correctWord = "";
let isGameOver = false;
let wasGuessCorrect = false;
let wrongGuesses = [];
let failedAmounts = 0;


startGame();

async function startGame() {
    prepareValues();   
    await gameLoop(); 
    gameEnding();
}


function ifPlayerGuessedLetter(answer) {
    return answer.length == 1
}

function drawWordDisplay() {

    wordDisplay = "";

    for (let i = 0; i < numberOfCharInWord; i++) {
        if (guessedWord[i] != SPACER) {
            wordDisplay += ANSI.COLOR.GREEN;
        }
        wordDisplay = wordDisplay + guessedWord[i] + " ";
        wordDisplay += ANSI.RESET;
    }

    return wordDisplay;
}

function drawList(list, color) {
    let output = color;
    for (let i = 0; i < list.length; i++) {
        output += list[i] + " ";
    }

    return output + ANSI.RESET;
}

function handleGuessedLetter(answer) {
    let org = guessedWord;
    guessedWord = "";

    let isCorrect = false;
    console.log();
    for (let i = 0; i < correctWord.length; i++) {
      if (correctWord[i] == answer) {
        guessedWord += answer;
        isCorrect = true;
        console.log();
        if (org.includes(answer)) {
          failedAmounts++;
        }
      } else {
        
        guessedWord += org[i];
      }
    }
    console.log();

    if (!isCorrect) {
        if (!wrongGuesses.includes(answer))
        {
            wrongGuesses.push(answer);
        }
        failedAmounts++
    } 
    else if (guessedWord == correctWord) {
        console.log();
        isGameOver = true;
        wasGuessCorrect = true;
    }
    
}

function prepareValues() {
    correctWord = randomWords[Math.floor(Math.random() * randomWords.length)].toLowerCase();
    isGameOver = false;
    wasGuessCorrect = false;
    wrongGuesses = [];
    failedAmounts = 0;
    
    guessedWord = "".padStart(correctWord.length, SPACER); 
    wordDisplay = "";
    numberOfCharInWord = correctWord.length
}

async function gameLoop() {
    statistics.whenGameStarts()
    while (isGameOver == false) {
        console.log(ANSI.CLEAR_SCREEN);
        console.log(drawWordDisplay());
        console.log(drawList(wrongGuesses, ANSI.COLOR.RED));
        console.log(HANGMAN_UI[failedAmounts]);

        const answer = (await askQuestion("Guess a char or the word: ")).toLowerCase();

        if (answer == correctWord) {
            isGameOver = true;
            wasGuessCorrect = true;
        }
        else if (ifPlayerGuessedLetter(answer)) {
            handleGuessedLetter(answer)
        }

         
        if (failedAmounts == HANGMAN_UI.length - 1) {
            console.log();
            isGameOver = true;
        }

    }
}

async function gameEnding() {
    console.log(ANSI.CLEAR_SCREEN);
    console.log(drawWordDisplay());
    console.log(drawList(wrongGuesses, ANSI.COLOR.RED));
    console.log(HANGMAN_UI[failedAmounts]);

    if (wasGuessCorrect) {
        statistics.roundsWon++
        console.log(ANSI.COLOR.YELLOW + "Congratulations, " + winner_screen);
    }
    console.log("Game Over");

    const playAgain = (await askQuestion("Want To Play Again? [yes/no]: ")).toLowerCase();
    if (playAgain === 'yes') {
        startGame();
    } else {
        rl.close();
        statistics.printStats()
        process.exit();  
    }
}  
