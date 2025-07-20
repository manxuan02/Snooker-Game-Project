
var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Composites = Matter.Composites;
var Composite = Matter.Composite;
var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;

var engine;

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

var holeTL;

// Cue Stick
var cueX;
var cueY;
var cueLength = 90;

// White Cue Ball
var cueBall;

// Colored Balls
var colBall;

// Red Balls
var rBall;
var rBallX = tableLength/4 * 3;
var rBallY = tableWidth/4 * 3;
var rBallDia = tableWidth/36;
var rBallRad = rBallDia/2;

function setup() {
    createCanvas(1500, 900); //original was(900,600)
    

    // create an engine
    engine = Engine.create();

    // NO gravity, so the ball will NOT fall down the screen
    engine.gravity.y = 0;

    // for debugging
    var render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 1500,
            height: 900,
            wireframes: true
        }
    });
    Matter.Render.run(render);
    

    setupCushion();

    setupPocket();

    setupRedBall();
}

function draw()
{
    background(128);

    Engine.update(engine); //telling the 'physics engine' to update the loop

    drawTable();

    drawDLine();

    drawCushion();

    drawPocket();

    drawRedBall();

    // To draw the pocket
    fill(255);
    // ellipse(,pocketDmt);

    stroke(255,255,0);
    strokeWeight(5);
    // point(cushionLengthLeftX, cushionTopY); // Top-Left cushion
    // point(cushionLengthRightX, cushionTopY); // Top-Right cushion
    // point(cushionRightX, cushionSideY); // Right cushion
    // point(cushionLengthRightX, cushionBottomY); // Bottom-Right cushion
    // point(cushionLengthLeftX, cushionBottomY); // Bottom-Left cushion
    // point(cushionLeftX, cushionSideY); // Left cushion

    point(tableLength / 3 + 50, tableWidth - tableLength + 50);
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
