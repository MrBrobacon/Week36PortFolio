import { ANSI } from "./ansi.mjs"
const statistics = {
    roundsPlayed: 0,
    roundsWon: 0,
    timeStarted: 0,
    whenGameStarts() {
        this.roundsPlayed++
        if (this.timeStarted === 0) {
            this.timeStarted = Date.now()
        }
    },
    printStats() {
        let secondsPlayed = (Date.now() - this.timeStarted ) / 1000 
        let minutesPlayed = secondsPlayed / 60
        secondsPlayed = Math.round(secondsPlayed)
        minutesPlayed = Math.round(minutesPlayed)
        let timePlayed;
        if(minutesPlayed > 0) {
            timePlayed = minutesPlayed+'min'
        } else {
            timePlayed = secondsPlayed+'s'
        }

        console.log(ANSI.COLOR.BLUE+'========================');
        console.log(ANSI.COLOR.YELLOW+'Rounds won: '+ANSI.COLOR.GREEN+this.roundsWon+ "/" + this.roundsPlayed);
        console.log(ANSI.COLOR.YELLOW+'Time Played: '+ANSI.COLOR.BLUE +timePlayed)
        console.log(ANSI.COLOR.BLUE+'========================');
    }
}

export {statistics}