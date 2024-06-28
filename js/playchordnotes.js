

var lastnoteplayed = null;
const wholenotes = [2,1,2,2,1,2,2]; //A-B-C-D-E-F-G
var gamelength = 0;
var playedchords = 0;
var prevchord = "";
var currentChordnotes = [];
var modality;
var key_notes;
var showchordnotes = false;
var canplaynextnote = false;

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
//OPTIMIZE redo the system, so i dont have to hardcode everything
function getKeyNotes(){
    let selected_note = document.getElementById("musical-keys").value;
    modality = document.getElementById("major").checked;
    let notes = [];
    //Major key
    if(modality){
        let index = selected_note.charCodeAt(0)-65;
        let majorformula = [2,2,1,2,2,2,1]
        if(selected_note.length == 1)
        {
            notes.push(selected_note);
        for(let i = 0; i < 6; i++){
            if(wholenotes[index%7] == majorformula[i])
            {
                index++;
                notes.push(String.fromCharCode(65+(index%7)));
            }else{
                //flatten note
                if(wholenotes[index%7] > majorformula[i]){
                    index++;
                    notes.push(String.fromCharCode(65+(index%7)) + "b");
                    majorformula[i+1]=majorformula[i+1]-1;
                }else{
                    //Sharpen note
                    index++;
                    notes.push(String.fromCharCode(65+(index%7)) + "#");
                    majorformula[i+1]=majorformula[i+1]+1;
                }
            }
        }
        }else{
            //i know this is a bad solution but I don't care
            switch(selected_note){
                case 'F':
                    notes = ["F", "G", "A", "Bb", "C", "D", "E"];
                    break;
                case "Bb":
                    notes = ["Bb", "C", "D", "Eb", "F", "G", "A"];
                    break;
                case "Eb":
                    notes = ["Eb", "F", "G", "Ab", "Bb", "C", "D"];
                    break;
                case "Ab":
                    notes = ["Ab", "Bb", "C", "Db", "Eb", "F", "G"];
                    break;
                case "Db":
                    notes = ["Db", "Eb", "F", "Gb", "Ab", "Bb", "C"];
                    break;
                case "Gb":
                    notes = ["Gb", "Ab", "Bb", "Cb", "Db", "Eb", "F"];
                    break;
            }
        }
        

    }else{
    //Minor key
    let index = selected_note.charCodeAt(0)-65;
    let minorformula = [2,1,2,2,1,2,2]
    if(selected_note.length == 1)
    {
        notes.push(selected_note);
    for(let i = 0; i < 6; i++){
        if(wholenotes[index%7] == minorformula[i])
        {
            index++;
            notes.push(String.fromCharCode(65+(index%7)));
        }else{
            //flatten note
            if(wholenotes[index%7] > minorformula[i]){
                index++;
                notes.push(String.fromCharCode(65+(index%7)) + "b");
                minorformula[i+1]=minorformula[i+1]-1;
            }else{
                //Sharpen note
                index++;
                notes.push(String.fromCharCode(65+(index%7)) + "#");
                minorformula[i+1]=minorformula[i+1]+1;
            }
        }
    }
    }else{
        //i know this is a bad solution but I don't care
        switch(selected_note){
            case 'D':
                notes = ["F", "G", "A", "Bb", "C", "D", "E"];
                break;
            case "G":
                notes = ["Bb", "C", "D", "Eb", "F", "G", "A"];
                break;
            case "C":
                notes = ["Eb", "F", "G", "Ab", "Bb", "C", "D"];
                break;
            case "F":
                notes = ["Ab", "Bb", "C", "Db", "Eb", "F", "G"];
                break;
            case "Bb":
                notes = ["Db", "Eb", "F", "Gb", "Ab", "Bb", "C"];
                break;
            case "Eb":
                notes = ["Gb", "Ab", "Bb", "Cb", "Db", "Eb", "F"];
                break;
        }
    }
    

    }
    return notes;
}
function getChordNotes(chordIndex)
{
    let notes = [];
    notes.push(key_notes[chordIndex]);
    notes.push(key_notes[(chordIndex+2)%7]);
    notes.push(key_notes[(chordIndex+4)%7]);
    return notes;

}
//TODO make random note generation more real (it always generates the same notes every time)
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
        generatedChord = key_notes[chordIndex]+modifier;
    }
    return generatedChord;
}
function startGame(){
    key_notes = getKeyNotes();
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
    key_notes = getKeyNotes();
    modality = document.getElementById("major").checked;
    let chords = "";
    if(modality)
    {
        chords+=key_notes[0]+" ";
        chords+=key_notes[1]+"m ";
        chords+=key_notes[2]+"m ";
        chords+=key_notes[3]+" ";
        chords+=key_notes[4]+" ";
        chords+=key_notes[5]+"m ";
        chords+=key_notes[6]+"dim ";


    }else{
        chords+=key_notes[0]+"m ";
        chords+=key_notes[1]+"dim ";
        chords+=key_notes[2]+" ";
        chords+=key_notes[3]+"m ";
        chords+=key_notes[4]+"m ";
        chords+=key_notes[5]+" ";
        chords+=key_notes[6]+" ";
    }

    document.getElementById("chords").innerHTML = "Chords in key: "+chords;
}