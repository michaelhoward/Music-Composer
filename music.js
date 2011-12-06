//----------------
// The Music Composition Tool.js
// Michael Howard
//----------------
//November 2011




// Global Music Object
var music = new Object();
 music.ctx ='';
music.parts = [];


//Global Variables used in screen writing
var noteWidth = 6;
var barLength = 25;
var staveWidth = 500;
var staveSpace = 8;
var staveHeight = 32;

var staveDistanceBetweenParts = 50;
var staveDistanceBetweenRows = 150;

var staveLeftBorder = 50;
var staveRightBorder = 50;

var staveTopBorder = 50;

var clefSpace = 35;
var keySpace = 30;
var timeSpace = 20;
var noteSpace = 15;

var divisions = 32;

// durations
var n_d_whole = divisions*6;
var n_whole = divisions*4;

var n_d_minum = divisions*3;
var n_minum = divisions*2;

//quarter
var n_d_crotchet = divisions*1.5;
var n_crotchet = 32;
//8th
var n_d_quaver = 24;
var n_quaver = 16;
//16th
var n_d_squaver = 12;
var n_squaver = 8;
//32nd
var n_d_dsquaver =6;
var n_dsquaver = 4;
//64th
var n_d_hdsquaver = 3;
var n_hdsquaver =2;
//128th
var n_shdsquaver = 1;


//beat types -> duration conversions
var beat_types = [];
beat_types[1] = 'whole';
beat_types[2] = 'minum';
beat_types[4] = 'crotchet';
beat_types[8] = 'quaver';
beat_types[16] = 'squaver';
beat_types[32] = 'dsquaver';
beat_types[64] = 'hdsquaver';
beat_types[128] = 'shdsquaver';


var types = [];
types['d_whole'] = divisions*6;
types['whole'] = divisions*4;
types['d_minum'] = divisions*3;
types['minum'] = divisions*2;
types['d_crotchet'] = divisions*1.5;
types['crotchet'] = 32;
types['d_quaver'] = 24;
types['quaver'] = 16;
types['d_squaver'] = 12;
types['squaver'] = 8;
types['d_dsquaver'] =6;
types['dsquaver'] = 4;
types['d_hdsquaver'] = 3;
types['hdsquaver'] =2;
types['shdsquaver'] = 1;

var durations = [];
durations[1] = 'shdsquaver';
durations[2] = 'hdsquaver';
durations[3] =  'd_hdsquaver';
durations[4] = 'dsquaver';
durations[6] = 'd_dsquaver';
durations[8] =  'squaver';
durations[12] = 'd_squaver';
durations[16] = 'quaver';
durations[24] = 'd_quaver';
durations[32] =  'crotchet';
durations[48] = 'd_crotchet';
durations[64] = 'minum';
durations[96] = 'd_minum';
durations[128] = 'whole';
durations[192] = 'd_whole';


function Setup(canvas)
{
//Assign the canvas
music.ctx = document.getElementById(canvas).getContext('2d');
}





function AddPart(id, name, abbreviation)
{
var newID = music.parts.length;
music.parts[newID] = new Object();
music.parts[newID].id = id;
music.parts[newID].name = name;
music.parts[newID].abbreviation = abbreviation;
music.parts[newID].bars = [];
music.parts[newID].divisions = 24;
return true;
}

function AddNewBar(key, beats, beatType, clef)
{
	for (var i=0; i<music.parts.length; i++)
	{
		var newID = music.parts[i].bars.length;
		music.parts[i].bars[newID] = new Object();
		music.parts[i].bars[newID].notes = [];
		music.parts[i].bars[newID].key = key;
		music.parts[i].bars[newID].beats = beats;
		music.parts[i].bars[newID].beatType = beatType;
		music.parts[i].bars[newID].clef = clef;
		
		for (var j=0; j<music.parts[i].bars[newID].beats; j++)
		{
		
		AddNote(i, newID, j, true, 60, beat_types[beatType], false);
		}		
	}
}

function AddNote(part, bar, note, isRest, pitch, noteType, isChord)
{
// Just add a note - only for setting up bars
	music.parts[part].bars[bar].notes[note] = new Object();
	music.parts[part].bars[bar].notes[note].isRest = isRest;
	music.parts[part].bars[bar].notes[note].pitch = pitch;
	music.parts[part].bars[bar].notes[note].noteType = noteType;
	music.parts[part].bars[bar].notes[note].duration = types[noteType];
	music.parts[part].bars[bar].notes[note].isChord = isChord;
}





function InsertNote(part, bar, note, isRest, pitch, noteType, isChord)
{

// Carefully add a note, replacing an existing note or rest
	
	var newDuration = types[noteType];
	
	
		//is there enough duration left in the bar?
		// TODO	
	
	// if the note's duration I want to insert is greater length than the note currently that Im replacing, we'll have to gather other notes together
	
	if (newDuration > music.parts[part].bars[bar].notes[note].duration)
	{
	
	
	
	
	
	}
	else
	{
		// else, just replace the existing note and any leftover convert to a new note
	
		var existingNote = music.parts[part].bars[bar].notes[note];


		// update the existing note
		music.parts[part].bars[bar].notes[note].isRest = isRest;
		music.parts[part].bars[bar].notes[note].pitch = pitch;
		music.parts[part].bars[bar].notes[note].noteType = noteType;
		music.parts[part].bars[bar].notes[note].duration = types[noteType];
	
		// Create a new note at the appropriate spot and update any previously held notes
	
		var newNote = new Object();
		newNote.pitch = existingNote.pitch;
		newNote.duration = existingNote.duration - newDuration;
		newNote.type = durations[newNote.duration];
	
		music.parts[part].bars[bar].notes.splice(note+1,0,newNote);
	
	}
}

// Draw Functions


function drawNote(x,y, pitch, type, isRest)
{
// shift the note up and down based on the pitch
// draw a flat or sharp if required
// draw note
_drawNoteAt(x, y, y+calcPitchHeight(65,pitch), true, type, isRest);
}

function _drawDotAt(x,y)
{
		music.ctx.fillStyle = "#000000";
		music.ctx.beginPath();
		music.ctx.arc(x+noteWidth,y,2,0, Math.PI*2, false);
		music.ctx.stroke();
		music.ctx.fill();
}

function calcPitchHeight(pitchBaseline, pitchHeight)
{
 var result = 0;
 
if (pitchBaseline >= pitchHeight)
{
	for (var i=pitchBaseline; i > pitchHeight; i--)
	{
		if (((i % 12) == 0) || ((i % 12) == 2) || ((i % 12) == 4) || ((i % 12) == 5) || ((i % 12) == 7) || ((i % 12) == 9) || ((i % 12) == 11))
		{
			result++;
		}
	}
}
else
{
		for (var i=pitchBaseline; i < pitchHeight; i++)
	{
		if (((i % 12) == 1) || ((i % 12) == 3) || ((i % 12) == 4) || ((i % 12) == 6) || ((i % 12) == 8) || ((i % 12) == 10) || ((i % 12) == 11))
		{
			result--;
		}
	}
}

return result * staveSpace;
}

function calcBarMinimum(bar)
{
	var minimum = 0;
	 // New clef?
	minimum += clefSpace;

	 // new key sig?
	minimum += keySpace; 
	 // new time sig?
	minimum += timeSpace;

	for (var i=0; i<bar.notes.length; i++)
	{
		minimum += noteSpace;
	}

	return minimum;
}
/*
function calcBarAndRowPositions()
{
	//for each bar, work out whats the minimum width
	for (var barNum=0; barNum<music.parts[0].bars.length; barNum++)
	{
	// for each bar
	var currentMinimum = 0;
	var tempMin = 0;
	
		for (var i=0; i<music.parts.length; i++)
		{
			//across all parts
			tempMin = calcBarMinimum(music.parts[i].bars[barNum]);
			
			if (tempMin > currentMinimum)
			{
			currentMinimum = tempMin;
			}
			
		}
		
		music.parts[0].bars[barNum].barWidth = currentMinimum;
		
	}

	
}
*/


function _drawNoteAt( x, baseline, y, barup, type, isRest)
{
console.log(x+' '+y+' '+barup+' '+type);
	switch (type)
	{
		case 'd_whole':
		// draw dot
		_drawDotAt(x,y);
		
		case 'whole':
			music.ctx.save();
			music.ctx.translate(x,y);
			music.ctx.rotate(-0.2);
			music.ctx.scale(1, 0.5);
			music.ctx.beginPath();
			music.ctx.arc(0,0,noteWidth,0, Math.PI*2, false);
			music.ctx.stroke();
			music.ctx.closePath();
			music.ctx.restore();
			music.ctx.translate(0,0);
		break;



		case 'd_minum':
		// draw dot
		_drawDotAt(x,y);
		case 'minum':
		break;
			music.ctx.save();
			music.ctx.translate(x,y);
			music.ctx.rotate(-0.2);
			music.ctx.scale(1, 0.5);
			music.ctx.beginPath();
			music.ctx.arc(0,0,noteWidth,0, Math.PI*2, false);
			music.ctx.stroke();
			music.ctx.closePath();
			music.ctx.restore();



			music.ctx.beginPath();
			if (barup == true)
			{
			
			music.ctx.moveTo(x+noteWidth,y);
			music.ctx.lineTo(x+noteWidth,y-barLength);
			}
			else
			{
			music.ctx.moveTo(x-noteWidth,y);
			music.ctx.lineTo(x-noteWidth,y+barLength);
			}
			music.ctx.stroke();
			//ctx.save();
			
			music.ctx.translate(0,0);
			music.ctx.closePath();
		
		
		case 'd_crotchet':
		case 'd_quaver':
		case 'd_squaver':
		case 'd_dsquaver':
		case 'd_hdsquaver':
		// draw dot
		_drawDotAt(x,y);
		case 'crotchet':
		case 'quaver':
		case 'squaver':
		case 'dsquaver':
		case 'hdsquaver':
		case 'shdsquaver':
		
		
		if (isRest == false)
		{
			music.ctx.save();
			music.ctx.translate(x,y);
			//Fill is for crotchets etc
			music.ctx.fillStyle = "#000000";
			music.ctx.rotate(-0.2);
			music.ctx.scale(1, 0.5);
			music.ctx.beginPath();
			music.ctx.arc(0,0,noteWidth,0, Math.PI*2, false);
			music.ctx.stroke();
			music.ctx.closePath();
			music.ctx.fill();
			music.ctx.restore();


			if (barup == true)
			{
			music.ctx.moveTo(x+noteWidth,y);
			music.ctx.lineTo(x+noteWidth,y-barLength);
			}
			else
			{
			music.ctx.moveTo(x-noteWidth,y);
			music.ctx.lineTo(x-noteWidth,y+barLength);
			}
			music.ctx.stroke();
			//ctx.save();

			music.ctx.translate(0,0);
			
			
		}
		else
		{ // this is a rest
			//music.ctx.beginPath();
			music.ctx.moveTo(x,4+baseline);
			
			music.ctx.lineTo(x-4,4+baseline+6);
			music.ctx.lineTo(x+4,4+baseline+12);
			music.ctx.lineTo(x,4+baseline+18);
			//music.ctx.closePath();
			music.ctx.stroke();
			
			music.ctx.arc(x,4+baseline+20,4,Math.PI*3/2,Math.PI/2,true);
			music.ctx.stroke();
			
		
		}
		break;
		

	}


}


function drawClef(x, y, clef)
{
	switch(clef)
	{
	case 'treble':
	
	break;
	case 'alto':
	break;
	case 'tenor':
	break;
	case 'bass':
	//music.ctx.moveTo(x,y);
	music.ctx.beginPath();
	music.ctx.arc(x+10,y+10,10,Math.PI, 0, false);
	music.ctx.stroke();
	music.ctx.moveTo(x+20,y+10);
	music.ctx.lineTo(x,y+32);
	music.ctx.stroke();
	
	music.ctx.beginPath();
	music.ctx.arc(x+3, y+10, 3, 0, Math.PI*2, false);
	music.ctx.stroke();
	music.ctx.closePath();
	music.ctx.fill();
	
	_drawDotAt(x+20, y+(staveSpace)/2);
	
	_drawDotAt(x+20, y+(staveSpace)/2 + staveSpace);
	//music.ctx.closePath();
	
	
	break;
	}
}


function drawStave(x,y)
{


	
	music.ctx.moveTo(x,y);
	music.ctx.lineTo(x+staveWidth, y);
	music.ctx.stroke();
	music.ctx.moveTo(x,y+staveSpace);
	music.ctx.lineTo(x+staveWidth, y+staveSpace);
	music.ctx.stroke();
	music.ctx.moveTo(x,y+staveSpace*2);
	music.ctx.lineTo(x+staveWidth, y+staveSpace*2);
	music.ctx.stroke();
	music.ctx.moveTo(x,y+staveSpace*3);
	music.ctx.lineTo(x+staveWidth, y+staveSpace*3);
	music.ctx.stroke();
	music.ctx.moveTo(x,y+staveSpace*4);
	music.ctx.lineTo(x+staveWidth, y+staveSpace*4);
	music.ctx.stroke();
	music.ctx.closePath();

}


function drawTimeSignature(x,y, top, bottom)
{

music.ctx.font = '24px sans-serif';
music.ctx.fillText(top,x,y+ 16);
music.ctx.fillText(bottom,x,y+32);


}

function drawKeySignature(x,y,clef, keysig)
{
	_drawSharp(x,y);
}

function _drawFlat(x,y)
{
	music.ctx.beginPath();
	music.ctx.moveTo(x,y);
	music.ctx.lineTo(x,y+(staveSpace*2));
	music.ctx.stroke();
	music.ctx.lineTo(x+4,y+staveSpace);
	music.ctx.stroke();
	music.ctx.lineTo(x,y+staveSpace);
	music.ctx.stroke();
	music.ctx.closePath();
}

function _drawSharp(x,y)
{

	music.ctx.moveTo(x-2,y-6);
	music.ctx.lineTo(x-2,y+8);
	
	music.ctx.moveTo(x+2,y-8);
	music.ctx.lineTo(x+2, y+6);
	
	music.ctx.moveTo(x-6,y-2); 
	music.ctx.lineTo(x+6,y-4);

	music.ctx.moveTo(x-6, y+4);
	music.ctx.lineTo(x+6, y+2);
}

function _drawNatural(x,y)
{

}


function drawBar(x,y,x2,y2)
{

music.ctx.beginPath();
music.ctx.moveTo(x,y);
music.ctx.lineTo(x2,y2);
music.ctx.stroke();
music.ctx.closePath();
}


function drawMusic()
{
music.ctx.clearRect(0,0,music.ctx.canvas.width,music.ctx.canvas.height);

//calcBarAndRowPositions();

// draw title

// right.. first... 1 stave per part. Each music row is joined.
	for (var i=0; i<music.parts.length; i++)
	{
		drawStave(staveLeftBorder, staveTopBorder + i*(staveHeight+staveDistanceBetweenParts));
		
	}
	drawBar(staveLeftBorder,staveTopBorder, staveLeftBorder, staveTopBorder+(music.parts.length)*staveHeight+(music.parts.length-1)*staveDistanceBetweenParts);

	drawBar(staveLeftBorder+staveWidth,staveTopBorder, staveLeftBorder+staveWidth, staveTopBorder+(music.parts.length)*staveHeight+(music.parts.length-1)*staveDistanceBetweenParts);




	for (var i=0; i<music.parts.length; i++)
	{
	
		// Now draw the notes for each note in the bar
	var currenty = staveTopBorder + i*(staveHeight+staveDistanceBetweenParts);
	var currentx = staveLeftBorder;
	//var currentx = staveLeftBorder + clefSpace + keySpace + timeSpace;

	
	
		for (var j=0; j<music.parts[i].bars.length; j++)
		{	
		
		// draw clef
		
		// draw time signature
		
		// draw key signature
		
		
		drawClef(currentx,currenty,'bass');
		currentx = currentx + clefSpace;
		
		drawKeySignature(currentx,currenty, 'bass', 0);
		
		currentx = currentx + keySpace;
		drawTimeSignature(currentx ,currenty, '6','8');
		currentx = currentx + timeSpace;
		
		
		
			for (var k=0; k<music.parts[i].bars[j].notes.length; k++)
			{
			
			// draw the notes in the bar
				drawNote(currentx, currenty, music.parts[i].bars[j].notes[k].pitch, music.parts[i].bars[j].notes[k].noteType,
				music.parts[i].bars[j].notes[k].isRest);
				currentx = currentx+noteSpace;
				
			}
			
			
		// draw the bar line	
		drawBar(currentx,staveTopBorder,currentx, staveTopBorder+(music.parts.length)*staveHeight+(music.parts.length-1)*staveDistanceBetweenParts);
		
		}
	
	}
	
}








