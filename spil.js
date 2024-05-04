var game; // Globale variabel til at holde Phaser spilinstansen

function startGame() {
    if (game) return; // Hvis spillet allerede er startet, gør intet

    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'flex';  // Ændre til flex for at centrere spillet

    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'gameContainer', // Sæt Phaser spillet inde i denne div
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    game = new Phaser.Game(config);
}


var game; var player;
var beers;
var mintuus;
var cursors;
var score = 0;
var scoreText;

function preload() {
    this.load.image('background', 'egmont.jpeg');
    this.load.image('beer', 'beer.png');
    this.load.image('crate', 'crate.png');
    this.load.image('mintuu', 'Mintuu.png');
    this.load.image('slots', 'slots.png'); 
    this.load.image('victoryGif', 'path/to/your/victory.gif'); // Indlæs din sejrs GIF


}

function create() {
    var background = this.add.image(400, 300, 'background');
    background.setDisplaySize(800, 600); 

    player = this.physics.add.sprite(400, 550, 'crate').setCollideWorldBounds(true);
    player.setScale(0.25);

    // Opretter og initialiserer en gruppe for øl med færre objekter og højere hastighed
    beers = this.physics.add.group({
        key: 'beer',
        repeat: 4, // Reduceret fra 12 til 7 for færre øl
        setXY: { x: 12, y: 0, stepX: 140 } // Øget stepX for mere spredning
    });
    beers.children.iterate(function(beer) {
        beer.setVelocityY(Phaser.Math.Between(100, 150)); // Øget hastighed
        beer.setScale(0.1);
    });

     // Tilpasning af slots
     slots = this.physics.add.group({
        key: 'slots',
        repeat: 3, // Reduceret antal for at have færre slots
        setXY: { x: 12, y: 0, stepX: 280 } // Øget stepX for mere spredning
    });
    slots.children.iterate(function(slot) {
        slot.setVelocityY(Phaser.Math.Between(100, 150));
        slot.setScale(0.20); // Større størrelse af slots
    });

    // Opretter og initialiserer en gruppe for mintuus med færre objekter og højere hastighed
    mintuus = this.physics.add.group({
        key: 'mintuu',
        repeat: 3, // Reduceret fra 6 til 4 for færre mintuus
        setXY: { x: 12, y: 0, stepX: 280 } // Øget stepX for mere spredning
    });
    mintuus.children.iterate(function(mintuu) {
        mintuu.setVelocityY(Phaser.Math.Between(100, 150)); // Øget hastighed
        mintuu.setScale(0.05);
    });

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    cursors = this.input.keyboard.createCursorKeys();
}


function showVictory() {
    game.scene.pause(); // Stopper spillet
    scoreText.setText('Tillykke med at vinde spillet. Skål og hav en god aften!');

    var victoryImage = this.add.image(400, 300, 'victoryGif'); // Antager, at du har loadet en GIF kaldet 'victoryGif'
    victoryImage.setScale(0.5); // Juster størrelsen efter behov
}



function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-400);
    } else if (cursors.right.isDown) {
        player.setVelocityX(400);
    } else {
        player.setVelocityX(0);
    }


    // Tjek for kollision med slots
    this.physics.overlap(player, slots, collectSlot, null, this);

    beers.children.iterate(function(beer) {
        if (beer.y > 600) {
            resetItem(beer); // Genplacer øllen ved at kalde resetItem
        }
    });

    mintuus.children.iterate(function(mintuu) {
        if (mintuu.y > 800) {
            resetItem(mintuu); // Genplacer mintuuen ved at kalde resetItem
        }
    });

    this.physics.overlap(player, beers, collectBeer, null, this);
    this.physics.overlap(player, mintuus, collectMintuu, null, this);
}

function resetItem(item) {
    item.y = -10; // Start lidt over toppen af skærmen for at undgå 'glimt'
    item.x = Phaser.Math.Between(0, 800); // Tilfældig x-position
}

function collectBeer(player, beer) {
    resetItem(beer);
    score += Number(1);  // Forsikre at det er en numerisk værdi
    console.log("New score after adding:", score);
    scoreText.setText('Score: ' + score);
}

function collectMintuu(player, mintuu) {
    resetItem(mintuu);
    score += Number(2);  // Forsikre at det er en numerisk værdi
    scoreText.setText('Score: ' + score);
}

 // Tjek for game over
 if (score < 0) { // Når scoren går under 0, spillet slutter
    game.scene.pause(); // Stopper spillets opdateringer
    scoreText.setText('Game Over');
}

// Tjek for vinderscenarie
if (score >= 50) {
    showVictory(); // Kalder en ny funktion for at håndtere sejren
}

// Tjek for vinderscenarie
if (score >= 50) {
    game.scene.pause(); // Stopper spillets opdateringer
    scoreText.setText('Tillykke med at vinde spillet. Skål og hav en god aften!');
}


function collectSlot(player, slot) {
resetItem(slot);
score -= 5; // Straf spilleren ved at trække point fra
if (score < 0) score = 0; // Forhindre scoren i at gå negativ
scoreText.setText('Score: ' + score);
}

