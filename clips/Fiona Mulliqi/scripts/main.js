
let BPM = 108;
let audioPath = "assets/audio/tired eyes.mp3";
let sequencer;

let Illusion ;
let nextImg = 1;


function setup (){
 createCanvas(windowWidth, windowHeight);
 sequencer = new Sequencer (audioPath, BPM, false);

	Illusion = new Animator(0, 131, "assets/oui/_imgNum_.png")
 imageMode(CENTER);
 Illusion.setPosition(width/2, height/2);
 Illusion.setSize(650,490);
 let counter = 0;


 sequencer.registerSequence({
 	name : "Illusion", 
		start : 1, 
		stop : 235, 
		steps : [1, 1+1/3 + 1+2/3, 1+3/3, 1+4/3, 1+5/3],
 	onStart : function (event){
 		Illusion.show();
 	},
 	onStep : function(event){
 		Illusion.pointer+=nextImg;
		if(Illusion.pointer >= Illusion.imgs.length-1){
			nextImg = -1;
		}

		if(Illusion.pointer < 0){
			Illusion.pointer = 0;
		}
 	}

 }); 
}

function draw (){
	sequencer.update();
	background (0);
	if (Illusion.visible) {
		Illusion.display();
	}
}