

var lastnoteplayed = null;
const wholenotes = [2,1,2,2,1,2,2]; //A-B-C-D-E-F-G
var gamelength = 0;
var playedchords = 0;
var prevchord = "";
var currentChordnotes = [];
var modality;
var currentScale;
var showchordnotes = false;
var canplaynextnote = false;

class Scale{
    //notes : char list
    //chords : Chord list
    //scale length : int
    //scale formula : int list

    scaleNotes = [];

    constructor(startingNote, formula, scaleNotes = [])
    {
        let chromaticScale = [];
        this.scaleNotes = scaleNotes;
        //Decide if its a "flat scale" or a "sharp scale"
        if(startingNote.includes("b") || startingNote == "F")
        {
            let chromaticScale = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
            let startIndex = chromaticScale.indexOf(startingNote);
            let sum = startIndex;
            this.scaleNotes.push(chromaticScale[startIndex]);
            formula.forEach(interval => {
                sum+=interval;
                scaleNotes.push(chromaticScale[sum%12]);
            });
            
        }else{
            let chromaticScale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
            let startIndex = chromaticScale.indexOf(startingNote);
            let sum = startIndex;
            scaleNotes.push(chromaticScale[startIndex]);
            formula.forEach(interval => {
                sum+=interval;
                scaleNotes.push(chromaticScale[sum%12]);
            });
            
        }
        scaleNotes.pop();
}
}

function newNotePlayed(note)
{
    if(canplaynextnote)
    {
        //Check if its correct based on the current chord in game
        if(note == currentChordnotes[1]){
            playedchords++;
            var audio = new Audio('res/correctsfx.mp3');
            audio.play();
        if(playedchords < gamelength)
        {
            document.getElementById("chord-counter").innerHTML = playedchords + " / " + gamelength;
            document.getElementById("chord-to-play").style="color: green;";
            document.getElementById("chord-to-play").innerHTML = currentChordnotes;
            setTimeout(playGame, 2000);
            canplaynextnote = false;
        }else{
            //evaluate
            document.getElementById("chord-to-play").innerHTML = "Congratulations, you finished!";
            document.getElementById("congrats-img").src = "res/evangelion_congratulations.gif";
            document.getElementById("chord-notes").innerHTML = "";
            document.getElementById("chord-counter").innerHTML = playedchords + " / " + gamelength;
            canplaynextnote = false;
        }
        

        
        }
    }
}
function setKeyNotes(){
    let selected_note = document.getElementById("musical-keys").value;
    modality = document.getElementById("major").checked;
    //Major key
    if(modality){

       currentScale = new Scale(selected_note, [2,2,1,2,2,2,1]);

    }else{
    currentScale = new Scale(selected_note, [2,1,2,2,1,2,2]);


    }
}
function getChordNotes(chordIndex)
{
    let notes = [];
    notes.push(currentScale.scaleNotes[chordIndex]);
    notes.push(currentScale.scaleNotes[(chordIndex+2)%7]);
    notes.push(currentScale.scaleNotes[(chordIndex+4)%7]);
    return notes;

}
function generateNextChord(){
    let generatedChord = prevchord;
    while(generatedChord == prevchord)
    {
        modality = document.getElementById("major").checked;
        let chordIndex = Math.floor(Math.random()*7);
        currentChordnotes = getChordNotes(chordIndex);
        let modifier = ""; //this is the minor major or diminished modifier
        if(modality){
            if(chordIndex == 1 || chordIndex == 2 || chordIndex == 5){
                modifier = "m";
            }else if(chordIndex == 6){
                modifier = "dim";
            }else{
                modifier = "";
            }
        }else{
            if(chordIndex == 0 || chordIndex == 2 ||chordIndex == 3)
                {
                    modifier = "m";
                }else if(chordIndex == 1){
                    modifier = "dim";
                }else{
                    modifier = "";
                }
        }
        generatedChord = currentScale.scaleNotes[chordIndex]+modifier;
    }
    return generatedChord;
}
function startGame(){
    
    setKeyNotes();
    canplaynextnote = true;
    gamelength = document.getElementById("length").value;
    showchordnotes = document.getElementById("show-chord-notes").checked;
    document.getElementById("congrats-img").src = "";
    playedchords = 0;
    document.getElementById("chord-counter").innerHTML = "0 / " + gamelength;
    playGame();
}
function playGame(){
    let nextchord = generateNextChord();
    document.getElementById("chord-to-play").innerHTML = nextchord;
    prevchord = nextchord;
    document.getElementById("chord-to-play").style = "color: black;"
    if(showchordnotes)
    {
        document.getElementById("chord-notes").innerHTML = currentChordnotes;
    }
    canplaynextnote = true;
}
function changeKey(){
    setKeyNotes();
    modality = document.getElementById("major").checked;
    let chords = "";
    if(modality)
    {
        chords+=currentScale.scaleNotes[0]+" ";
        chords+=currentScale.scaleNotes[1]+"m ";
        chords+=currentScale.scaleNotes[2]+"m ";
        chords+=currentScale.scaleNotes[3]+" ";
        chords+=currentScale.scaleNotes[4]+" ";
        chords+=currentScale.scaleNotes[5]+"m ";
        chords+=currentScale.scaleNotes[6]+"dim ";


    }else{
        chords+=currentScale.scaleNotes[0]+"m ";
        chords+=currentScale.scaleNotes[1]+"dim ";
        chords+=currentScale.scaleNotes[2]+" ";
        chords+=currentScale.scaleNotes[3]+"m ";
        chords+=currentScale.scaleNotes[4]+"m ";
        chords+=currentScale.scaleNotes[5]+" ";
        chords+=currentScale.scaleNotes[6]+" ";
    }

    document.getElementById("chords").innerHTML = "Chords in key: "+chords;
}