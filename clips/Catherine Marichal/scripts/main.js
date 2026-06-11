/*----------------------------------------*\
  25_26_AN1_clipWeb - main.js
  @author Catherine Marichal (catmarichal@gmail.com)
  @Date:   2026
\*----------------------------------------*/

const BPM      = 115;
const ANIM_FPS = 12;
let audioPath  = "assets/audio/VERTIGO.mp3";
let sequencer;
let framesPt1 = {};
let framesPt2 = {};

let totalImages   = 0;
let imagesChargees = 0;
let toutCharge    = false;

function cheminPt1(fi) {
  if (fi < 0 || fi >= 721) return null;
  let dossier, local;
  if (fi < 300)      { dossier = "pt1/0_25_pt1";  local = fi + 1; }
  else if (fi < 600) { dossier = "pt1/25_50_pt1"; local = fi - 299; }
  else               { dossier = "pt1/50_60_pt1"; local = fi - 599; }
  return `assets/images/${dossier}/ezgif-frame-${String(local).padStart(3,'0')}.jpg`;
}

function cheminPt2(fi) {
  if (fi < 0 || fi >= 902) return null;
  let dossier, local;
  if (fi < 300)      { dossier = "pt2/0_25_pt2";  local = fi + 1; }
  else if (fi < 600) { dossier = "pt2/25_50_pt2"; local = fi - 299; }
  else if (fi < 722) { dossier = "pt2/50_60_pt2"; local = fi - 599; }
  else               { dossier = "pt2/60_75_pt2"; local = fi - 721; }
  return `assets/images/${dossier}/ezgif-frame-${String(local).padStart(3,'0')}.jpg`;
}


function chargerBloc(stock, cheminFn, debutFi, finFi, onUn) {
  return new Promise(resolve => {
    let restant = finFi - debutFi + 1;
    for (let fi = debutFi; fi <= finFi; fi++) {
      let path = cheminFn(fi);
      if (!path) { restant--; if (restant === 0) resolve(); continue; }
      let idx = fi;
      loadImage(
        path,
        img => { stock[idx] = img; onUn(); if (--restant === 0) resolve(); },
        ()  => { stock[idx] = null;  onUn(); if (--restant === 0) resolve(); }
      );
    }
  });
}


function majLoader() {
  imagesChargees++;
  let pct = min(100, round(imagesChargees / totalImages * 100));
  let el  = document.querySelector("#loader #percent");
  if (el) el.innerText = pct + "%";
}


async function chargerTout() {
  document.querySelector("#loader").classList.remove("hide");


  let btnPlay = document.querySelector("button");
  if (btnPlay) btnPlay.style.display = "none";

  // 0_25s : pt1 (0-299) / pt2 (0-299)
  await Promise.all([
    chargerBloc(framesPt1, cheminPt1, 0,   299, majLoader),
    chargerBloc(framesPt2, cheminPt2, 0,   299, majLoader),
  ]);
  // 25_50s
  await Promise.all([
    chargerBloc(framesPt1, cheminPt1, 300, 599, majLoader),
    chargerBloc(framesPt2, cheminPt2, 300, 599, majLoader),
  ]);
  // 50_75s
  await Promise.all([
    chargerBloc(framesPt1, cheminPt1, 600, 720, majLoader),
    chargerBloc(framesPt2, cheminPt2, 600, 901, majLoader),
  ]);

  document.querySelector("#loader").classList.add("hide");
  toutCharge = true;

 
  if (btnPlay) btnPlay.style.display = "";
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  sequencer = new Sequencer(audioPath, BPM, false);

  // total images pt1 + pt2
  totalImages = 721 + 902;
  chargerTout();
}

function draw() {
  sequencer.update();   
  if (!toutCharge) return;
  background(0);

  // audio secondes 
  let fi = floor(sequencer.player.audio.currentTime * ANIM_FPS);

  // pt1 : frames 0_720 (0_60s) pt2 : frames 721_1622 (60_135s)
  if (fi < 721) {
    let img = framesPt1[fi];
    if (img && img.width > 0) image(img, 0, 0, width, height);
  } else {
    let img = framesPt2[fi - 721];
    if (img && img.width > 0) image(img, 0, 0, width, height);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
