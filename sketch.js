
var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Composites = Matter.Composites;
var Composite = Matter.Composite;
var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;

var engine;

var gameStarted = false;

// Table
var table;
var tableX = 150;
var tableY = 150;
var tableLength = 1200;
var tableWidth = tableLength/2;
var tableCorner = 12;

// Cushions
var cushion;
var cushionHeight = 20;
var cushionLength_fromCentre = 420; //CHANGE THIS CAN ALREADY
// Top
var cushionTopY = 165;
// Length-Left
var cushionLengthLeftX = 456;
// Length-Right
var cushionLengthRightX = 1040;
// Right
var cushionRightX = 1355 - cushionHeight;
var cushionSideY = tableWidth/4 * 3;
// Bottom
var cushionBottomY = 155 + tableWidth - cushionHeight;
// Left
var cushionLeftX = 145 + cushionHeight;

// D line
var dLineX = tableLength/3 + 50;
var dLineY = tableWidth/2 + 150;

// Pocket
var pockets = []; //array to store 'pocket' bodies
// Top
var pocketTopY = tableY + 12;
// Bottom
var pocketBottomY = tableY + tableWidth - 12;
// Left
var pocketLeftX = tableX + 12;
var pocketLeftX_fromCentre ;
// Middle
var pocketMiddleX = tableX + tableLength/2 - 3;
// Right
var pocketRightX = tableX + tableLength - 12;
var pocketDmt = tableWidth/36 * 1.8;

var pocketBallFading = []; //array to store 'balls being FADED'
var pocketFadeSpeed = 0.02;

// Cue Stick
var isCueActive = false;
var cueLength = 200;
var cueWidth = 8;
var cueStart;
var cueEnd;

var cuePower = 1;
var cuePowerMax = 10;
var cuePowerMin = 1;
var cuePowerStep = 0.2;
var cueRotation = 0;

var isSpacebarPressed = false;
var isCuePowered = false;

var powerBarX = 80;
var powerBarY = 825;
var powerBarWidth = 400;
var powerBarHeight = 50;

var lastPowerTime = 0; //stores the Last-Update of power
var powerDirection = 1; //determines if the power is Increasing(+1) or Decreasing(-1)

// White Cue Ball
var cueBall;
var isCueBallPlaced = true;
var cueCollision = {
    active: false,
    x: 0,
    y: 0,
    radius: 0,
    maxRadius: 30,
    opacity: 255
}

// Red Balls
var rBall;
var rBallX = tableLength/4 * 3;
var rBallY = tableWidth/4 * 3;
var rBallDia = tableWidth/36;
var ballRad = rBallDia/2;

// Ball Trail
var ballTrail = []; //to store the selected ball's trail points
var maxTrailLength = 30;
var fadeLevel = 0;
var fadeStep = 0.01;

// Translucent Ball
var translucentBall;

// Menu
var menuX = 1400;
var menuY = 540;
var menuDiff = 30;

// For Extension Mode: Magnetic mode
var magneticMode = false; //to NOT run the Magnetic mode
var ballCharge = new Map(); //to store the charge(+1, -1, 0) of Each ball
var magneticStrength = 0.001; //the balls' Attraction/Repulsion strength
var attractionDist = 100; //distance threshold for balls to attract one-another
var unattachForce = 6; //minimum force required for Attracted-balls to Unattach
var attractedBalls = []; //to store Attracted-balls

var modeSelected = false;

function setup() {
    createCanvas(2000, 900); //original was(900,600)

    // create an engine
    engine = Engine.create();

    // NO gravity, so the ball will NOT fall down the screen
    engine.gravity.y = 0;

    // // for debugging THE BLACK PART AT THE BOTTOM
    // var render = Matter.Render.create({
    //     element: document.body,
    //     engine: engine,
    //     options: {
    //         width: 1500,
    //         height: 900,
    //         wireframes: true
    //     }
    // });
    // Matter.Render.run(render);

    setupCushion();
    setupPocket();
    setupGameMode();

    setupRedBall();
    setupColorBalls();

    setupCueBall();
    setupCueImpact();
}

function draw()
{
    background(128);
    
    drawMenu();
    Engine.update(engine); //telling the 'physics engine' to update the loop
    drawTable(); //draw the Table
    drawDLine(); //draw the D Line
    drawCushion(); //draw the cushion
    drawPocket(); //draw the Pockets
    drawPocketFade(); //draw the PockeTED ball Fading
    drawBallTrails(); //draw the Ball Trails
    drawRedBall(); //draw the Red balls
    drawColorBalls(); //draw the colored balls
    drawCue(); //draw the Cue
    powerAdjustment(); //to update powerBar accordingly w SPACEBAR held-timing(currentTime)
    drawCueBall(); //draw the Cue ball
    drawCueImpact(); //draw the Cue Impact
    drawTranslucentBall(); //draw the Translucent ball for MODE 3

    checkBallInPocket(); //check for any Pocketed ball
    checkForBallMovements(); //check for any Ball Moving, to remove the Translucent ball

    updateBallTrails(); //to update any Moving balls, so to draw their Trails
    updatePocketFade(); //to update any PockeTED ball fading

    if (magneticMode)
    {
        drawMagneticWave(); //(Extension) draw the Magnetic wave
        updateMagneticForce(); //to update attractedBalls[] w the NEW Attracted-balls
    }

    ballConstrain();
}

function drawMenu()
{
    fill(0);
    textSize(25);
    textAlign(LEFT);

    // menu array
    var menu = [
        {text: "Game Modes:", style: "bold"},
        {text: "Press the number to select the mode.", style: "normal"},
        {text: "1: Standard Mode", style: "normal"},
        {text: "2: Random clustered Red Balls", style: "normal"},
        {text: "3: Practice mode", style: "normal"},
        {text: "4: Magnetic Mode (Extension)", style: "normal"},
        {text: "", style: "normal"}, //to create a space
        {text: "How to play?", style: "bold"},
        {text: "• Place cue ball inside D zone by clicking the mouse", style: "normal"},
        {text: "• Mouse click to drag cue to aim", style: "normal"},
        {text: "• Hold Spacebar to adjust power", style: "normal"},
        {text: "• Release Spacebar to shoot", style: "normal"}
    ];

    // print the menu
    menu.forEach((menuItem, index) => {
        if (menuItem.style === "bold")
        {
            textStyle(BOLD);
        }
        else
        {
            textStyle(NORMAL);
        }
        text(menuItem.text, menuX, menuY + (index * menuDiff));
    });
}

function drawVertices(vertices)
{
    beginShape();
    for (var i = 0; i < vertices.length; i++)
    {
        vertex(vertices[i].x, vertices[i].y);
    }
    endShape(CLOSE);
}


/////////////////////////////////////////////////////////////////////////
// COMMENTARY
/*
App design
This snooker game application was created using the p5.js library for rendering and the Matter.js library for physics simulation. The game is designed to provide an authentic snooker experience with realistic physics and intuitive controls.

Game controls
The cue control system combines both keyboard and mouse interaction, allowing for a more precise gameplay, as compared to just using mouse controls.
• To start: Place the cue ball into the 'D zone' and click the mouse at the desired position. The pocketed cue ball requires players to do this again to continue playing.
• To aim: Drag the mouse to position the cue, pointing it to the desired direction.
• To shoot: Press spacebar to get the desired shooting strength. Release to shoot.

Visual effects
This snooker application game comes with a few key animations as described below:
• Ball Trail: Balls that are moving leave a colour-fading trail, indicating their speed and direction. A faster-moving ball produces longer trails.
• Cue Impact: Colliding balls produce a white flash, which is proportional to the collision force.
• Ball on Pocket Entry: Potted balls fade out and shrink as it disappears from the table and the physics world.

Game modes
This snooker application game features 4 gameplay modes:
• Standard: A traditional snooker setup, with balls positioned in their standard positions.
• Random clusters: Red balls are grouped into random clusters around the table.
• Practice mode: Red balls are arranged in a 'cross formation'.
• Magnetic mode: Creates magnetic charges on the balls, introducing attractions between balls.
Each of the modes offers distinct challenges while maintaining the core snooker game's mechanics.

Extension
For my extension, I implemented a ‘Magnetic mode’. After thorough research on existing snooker games, there does not seem to be a 'magnetic mode' available.
This extension is unique as it adds magnetic physics to the game, making it more challenging for players to consider both the strength of the cue ball to be used and the need to separate the attached balls, which requires a certain amount of ball collision.
Red balls, colored balls, and cue ball are assigned positive, negative and neutral charges, respectively. Magnetic waves will be drawn at a specific distance between the coloured and red balls, signifying their attraction to one another, pulling them together, forming clusters.



Resources used:
1. Daniel Shiffman, 2016. 9.7: Drawing Object Trails - p5.js Tutorial. [Online]. The Coding Train. Available at: <https://editor.p5js.org/codingtrain/sketches/9DnjxCNB-> [Accessed 10 December 2025]
2. The Coding Train, 2016. 9.7: Drawing Object Trails - p5.js Tutorial. [Online]. The Coding Train. Available at: <https://www.youtube.com/watch?v=vqE8DMfOajk&t=551s> [Accessed 10 December 2025]
3. W3School, 2025. JavaScript Math.pow(). [Online]. W3School. Available at: <https://www.w3schools.com/jsref/jsref_pow.asp> [Accessed 10 Deecember 2025]
4. W3School, 2025. JavaScript Array filter(). [Online]. W3School. Available at: <https://www.w3schools.com/jsref/jsref_filter.asp#gsc.tab=0&gsc.q=math.pow()> [Accessed 11 December 2025]
5. spriggan, 2025. Capsule Collision Detection Tutorial. [Online]. gamedev.net. Available at: <https://www.gamedev.net/tutorials/programming/math-and-physics/capsule-collision-detection-tutorial-r6155/> [Accessed 11 December 2025]
6. Nilson Souto, 2023. Video Game Physics Tutorial - Part I: An Introduction to Rigid Body Dynamics. [Online]. Toptal Developers. Available at: <https://www.toptal.com/developers/game/video-game-physics-part-i-an-introduction-to-rigid-body-dynamics> [Accessed 12 December 2025]
7. MDN contributors, 2025. 2D collision detection. [Online]. MDN. Available at: <https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection> [Accessed 11 Decemeber 2025]
8. dipikabh, 2025. 2D collision detection. [Online]. GitHub. Available at: <https://github.com/mdn/content/blob/main/files/en-us/games/techniques/2d_collision_detection/index.md?plain=1> [Accessed 11 Decemeber 2025]
9. real-world-physics-problems, 2025. The Physics of Billiards. [Online]. Real World Physics Problems. Available at: <https://www.real-world-physics-problems.com/physics-of-billiards.html> [Accessed 13 Decemeber 2025]
10. The Coding Train, 2017. Coding Challenge #78: Simple Particle System
. [Online]. The Coding Train. Available at: <https://www.youtube.com/watch?v=UcdigVaIYAk> [Accessed 10 December 2025]
11. the Physics Classroom, 2025. Coulomb's Law. [Online]. The Physics Classroom. Available at: <https://www.physicsclassroom.com/class/estatics/Lesson-3/Coulomb-s-Law> [Accessed 13 December 2025]
*/