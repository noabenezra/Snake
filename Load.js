// load images
const ground = new Image();
ground.src = "img/yellow.jpg";
const foodImg = new Image();
foodImg.src = "img/bug.png";

var fruitImages = [
    'img/ciliegia.png',
    'img/orange.png',
    'img/banana.png',
    'img/apple.png',
    'img/fragola.png'
];
var fruitValues = [2, 4, 6, 8, 10];


for (var j = 0; j < fruitImages.length; j++) {
    const img = new Image();
    img.src = fruitImages[j];
    fruits.push({ img: img, value: fruitValues[j] });
}