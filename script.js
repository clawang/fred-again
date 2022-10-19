import {songNames} from './variables.js';

var canvas = document.getElementById('imageCanvas');
var ctx = canvas.getContext('2d');
let pxScale = window.devicePixelRatio;
var width = 414;
var height = 896;
var image;
var ratio = 1;
var used = [];

function getRandom(min, max) {
    if(used.length === max-1) used = [];
    let index = Math.floor(Math.random() * (max - min)) + min;
    while(used.findIndex(num => num === index) >= 0) {
        index = Math.floor(Math.random() * (max - min)) + min;
    }
    used.push(index);
    return index;
}

async function loadFonts() {
  const font1 = new FontFace("Circular Medium", "url(Circular-Medium.ttf)", {
    style: "normal",
    weight: "400",
  });

  const font2 = new FontFace("Circular", "url(Circular-Book.ttf)", {
    style: "normal",
    weight: "400",
  });
  // wait for font to be loaded
  await font1.load();
  await font2.load();
  // add font to document
  document.fonts.add(font1);
  document.fonts.add(font2);
}

function setup() {
  // set the CSS display size
    if(window.innerWidth < 414) {
        ratio = window.innerWidth/414;
        console.log(ratio);
        width = window.innerWidth;
        height = window.innerWidth*896/414;
    }

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    canvas.width = width * pxScale;
    canvas.height = height * pxScale;

    // normalize the coordinate system
    ctx.scale(pxScale, pxScale);
}

function handleImage(e){
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            image = img;
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
}

function validateForm(e) {
    e.preventDefault();
    if(!document.getElementById("name").value) {
        alert('You need to enter a name!');
    } else if(!image) {
        alert('You need to upload an image!');
    } else {
        document.getElementById('player').classList.remove('hide');
        drawCanvas();
    }
}

function resetCanvas() {
    ctx.resetTransform();
    ctx.scale(pxScale, pxScale);
}

function getLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function drawCanvas() {
    setup();
    const imgWidth = 360*ratio;
    let startingHeight = 180*ratio;
    let name = capitalize(document.getElementById("name").value);
    let song = songNames[getRandom(0, songNames.length)];
    const margin = (width-imgWidth)/2*ratio;

    // image = document.getElementById("pic");
    // name = 'Claire';
    ctx.fillStyle= 'rgb(29,30,32)';
    ctx.fillRect(0,0,width,height);
    ctx.drawImage(image,0,(image.height-image.width)/2,image.width, image.width,margin,startingHeight,imgWidth,imgWidth);
    ctx.fillStyle = 'rgba(9,0,232,0.7)';
    ctx.fillRect(margin,startingHeight,imgWidth,imgWidth);

    ctx.fillStyle = 'rgb(255,255,255)';
    let rewind = new Path2D('M3.3 1a.7.7 0 01.7.7v5.15l9.95-5.744a.7.7 0 011.05.606v12.575a.7.7 0 01-1.05.607L4 9.149V14.3a.7.7 0 01-.7.7H1.7a.7.7 0 01-.7-.7V1.7a.7.7 0 01.7-.7h1.6z');
    ctx.translate(width/2-110*ratio, startingHeight+537*ratio);
    ctx.scale(1.8*ratio,1.8*ratio);
    ctx.fill(rewind);
    resetCanvas();

    // Drawing song title
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.font = "22px Circular Medium";
    const songName = `${name} (${song})`;
    let textWidth = ctx.measureText(songName).width;
    if (textWidth > 360*ratio) {
        const lines = getLines(ctx, songName, 360*ratio);
        lines.forEach((line, i) => {
            ctx.fillText(line, margin, startingHeight+425*ratio+22*i);
        });
        startingHeight += 22*(lines.length-1);
    } else {
        ctx.fillText(`${name} (${song})`, margin, startingHeight + 425*ratio);
    }
    ctx.font = "14px Circular Medium";
    const albumName = 'Actual Life 3';
    ctx.fillText(albumName, width/2-ctx.measureText(albumName).width/2, 100*ratio);

    // Drawing artist name
    ctx.fillStyle = 'rgba(255,255,255, 0.7)';
    ctx.font = "16px 'Circular'";
    ctx.fillText('Fred again..', margin, startingHeight + 450*ratio);

    // Drawing player controls
    ctx.beginPath();
    ctx.roundRect(margin, startingHeight+480*ratio, imgWidth, 3, 1);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.ellipse(margin + 3, startingHeight+482*ratio, 6, 6, 0, 0, 360*ratio);
    ctx.fill();

    ctx.font = "10px 'Circular'";
    ctx.fillText('0:00', margin - 2, startingHeight+500*ratio);
    ctx.fillText('-4:10', width-margin-23, startingHeight+500*ratio);
    ctx.beginPath();
    ctx.ellipse(width/2, startingHeight+550*ratio, 30*ratio, 30*ratio, 0, 0, 360*ratio);
    ctx.fill();

    ctx.fillStyle= 'rgb(29,30,32)';
    let play = new Path2D('M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z');
    ctx.translate(width/2-12*ratio, startingHeight+539*ratio);
    ctx.scale(1.5*ratio,1.5*ratio);
    ctx.fill(play);
    resetCanvas();

    ctx.fillStyle = 'rgb(255,255,255)';
    rewind = new Path2D('M3.3 1a.7.7 0 01.7.7v5.15l9.95-5.744a.7.7 0 011.05.606v12.575a.7.7 0 01-1.05.607L4 9.149V14.3a.7.7 0 01-.7.7H1.7a.7.7 0 01-.7-.7V1.7a.7.7 0 01.7-.7h1.6z');
    ctx.translate(width/2-110*ratio, startingHeight+537*ratio);
    ctx.scale(1.8*ratio,1.8*ratio);
    ctx.fill(rewind);
    resetCanvas();

    ctx.fillStyle = 'rgb(255,255,255)';
    let forward = new Path2D('M12.7 1a.7.7 0 00-.7.7v5.15L2.05 1.107A.7.7 0 001 1.712v12.575a.7.7 0 001.05.607L12 9.149V14.3a.7.7 0 00.7.7h1.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7h-1.6z');
    ctx.translate(width/2+82*ratio, startingHeight+537*ratio);
    ctx.scale(1.8*ratio,1.8*ratio);
    ctx.fill(forward);
    resetCanvas();

    ctx.fillStyle = 'rgb(255,255,255)';
    let shuffle = new Path2D('M13.151.922a.75.75 0 10-1.06 1.06L13.109 3H11.16a3.75 3.75 0 00-2.873 1.34l-6.173 7.356A2.25 2.25 0 01.39 12.5H0V14h.391a3.75 3.75 0 002.873-1.34l6.173-7.356a2.25 2.25 0 011.724-.804h1.947l-1.017 1.018a.75.75 0 001.06 1.06L15.98 3.75 13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 00.39 3.5z');
    let shuffle2 = new Path2D('M7.5 10.723l.98-1.167.957 1.14a2.25 2.25 0 001.724.804h1.947l-1.017-1.018a.75.75 0 111.06-1.06l2.829 2.828-2.829 2.828a.75.75 0 11-1.06-1.06L13.109 13H11.16a3.75 3.75 0 01-2.873-1.34l-.787-.938z');
    shuffle.addPath(shuffle2);
    ctx.translate(margin, startingHeight+540*ratio);
    ctx.scale(1.5*ratio,1.5*ratio);
    ctx.fill(shuffle);
    resetCanvas();

    ctx.fillStyle = 'rgb(255,255,255)';
    let repeat = new Path2D('M0 4.75A3.75 3.75 0 013.75 1h8.5A3.75 3.75 0 0116 4.75v5a3.75 3.75 0 01-3.75 3.75H9.81l1.018 1.018a.75.75 0 11-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 111.06 1.06L9.811 12h2.439a2.25 2.25 0 002.25-2.25v-5a2.25 2.25 0 00-2.25-2.25h-8.5A2.25 2.25 0 001.5 4.75v5A2.25 2.25 0 003.75 12H5v1.5H3.75A3.75 3.75 0 010 9.75v-5z');
    ctx.translate(width-margin-25*ratio, startingHeight+540*ratio);
    ctx.scale(1.5*ratio,1.5*ratio);
    ctx.fill(repeat);
    resetCanvas();

    ctx.fillStyle = 'rgb(255,255,255)';
    let ellipses = new Path2D('M4.5 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm15 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-7.5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z');
    ctx.translate(width-50*ratio, 85*ratio);
    ctx.fill(ellipses);
    resetCanvas();

    ctx.fillStyle = 'rgb(255,255,255)';
    let arrow = new Path2D('M15.957 2.793a1 1 0 010 1.414L8.164 12l7.793 7.793a1 1 0 11-1.414 1.414L5.336 12l9.207-9.207a1 1 0 011.414 0z');
    ctx.translate(20*ratio, 105*ratio);
    ctx.rotate(-90 * Math.PI / 180);
    ctx.fill(arrow);
    resetCanvas();
}

function downloadImage() {
  var link = document.createElement('a');
  link.download = 'fredagain.png';
  link.href = document.getElementById('imageCanvas').toDataURL()
  link.click();
}

// wait for DOM to load before drawing to the canvas
window.addEventListener('load', async () => {
    await loadFonts();
    var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);
    var form = document.querySelector('form');
    form.addEventListener('submit', validateForm, false);
    var download = document.getElementById('download');
    download.addEventListener('click', downloadImage, false);
});