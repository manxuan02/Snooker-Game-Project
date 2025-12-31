// To draw the cue-stick
function drawCue()
{
    if(isCueActive && cueBall && !isCueBallPlaced)
    {
        push();

        // To calculate the cue's Direction n Position
        var angle = atan2(cueStart.y-cueEnd.y, cueStart.x-cueEnd.x);
        var guideAngle = atan2(cueEnd.y-cueStart.y, cueEnd.x-cueStart.x);
        cueRotation = angle;

        // power line
        stroke(255, 0, 0, 150);
        strokeWeight(2);

        //sets the power bar accordingly
        var powerLength = map(cuePower, cuePowerMin, cuePowerMax, 50, 100);

        //creates a powerLine accordingly with the Power
        line(cueStart.x, cueStart.y, cueStart.x-cos(angle)*powerLength, cueStart.y-sin(angle)*powerLength,);

        // Cue
        translate(cueStart.x, cueStart.y);
        rotate(angle); //to enable the cue to rotate
        // cue body
        fill(139, 69, 19);
        noStroke();
        rect(-cueLength-15, -cueWidth/2, cueLength, cueWidth);
        // cue handle
        fill(101, 67, 33);
        rect(-cueLength-20, -cueWidth/2, 20, cueWidth);
        // cue target point
        fill(255, 255, 0);
        ellipse(-15, 0, 8, 8);

        pop();

        // guide line
        drawGuideLine(guideAngle);

        // power bar
        drawPowerBar();
    }
}

// To draw the guide-line
function drawGuideLine(angle)
{
    push();
    stroke(255, 255, 0, 100);
    strokeWeight(2);
    
    var guideLength = 300;
    line(cueStart.x, cueStart.y,
        cueStart.x - cos(angle)*guideLength, cueStart.y - sin(angle)*guideLength);
    pop();
}


// To draw the cue-ball
function setupCueBall()
{
    var ballOptions = { restitution: 0.8, friction: 0.005, isStatic: false };

    // Place cue ball in the center of the "D" zone
    cueBall = Bodies.circle(dLineX, dLineY, ballRad, { ...ballOptions, label: "cueBall" });
    World.add(engine.world, cueBall);

    // To start the game in 'placing mode'
    isCueBallPlaced = true;
}

function drawCueBall()
{
    push();
    fill(255);
    stroke(150, 82, 36);
    drawVertices(cueBall.vertices);
    pop();

    // To place cue ball Interactively
    if(isCueBallPlaced)
    {
        // To allow player to Postion the cueBall
        Matter.Body.setPosition(cueBall, { x: mouseX, y: mouseY });
        if(mouseIsPressed && isCueBallinDZone(mouseX, mouseY))
        {
            // To finalize the placement of cueBall when clicked in D zone
            isCueBallPlaced = false;
        }
    }
}


// To check if the cueBall is in the "D" zone of the table
function isCueBallinDZone(x, y)
{
    // radius of the "D" zone
    var dRadius = tableLength / 4 / 2;
    return dist(x, y, dLineX, dLineY) <= dRadius;
}


// To draw the power-bar
function drawPowerBar()
{
    push();
    // power fill
    fill(50);
    rect(powerBarX, powerBarY, powerBarWidth, powerBarHeight, 5);

    // power's level
    var powerWidth = map(cuePower, cuePowerMin, cuePowerMax, 0, powerBarWidth); //map(value, startX, startY, stopX, stopY)

    // power bar
    // color change of the power bar
    var powerColor;
    if(cuePower <= 3)
    {
        powerColor = color(0, 255, 0); // Green
    }
    else if(cuePower <= 7)
    {
        powerColor = color(255, 255, 0); // Yellow
    }
    else
    {
        powerColor = color(255, 0, 0); // Red
    }
    // power color change
    fill(powerColor);
    noStroke();
    rect(powerBarX, powerBarY, powerWidth, powerBarHeight, 5);
    // power bar outline
    noFill();
    stroke(255);
    strokeWeight(2);
    rect(powerBarX, powerBarY, powerBarWidth, powerBarHeight, 5);
    // power bar's labelling
    fill(255);
    noStroke();
    textSize(20);
    textAlign(LEFT, CENTER);
    text("Power: " + cuePower.toFixed(1), powerBarX + powerBarWidth + 10, powerBarY + powerBarHeight/2); //to state the current power's level

    // When cue + cueball is drawn
    if (isCueActive && !isCueBallPlaced) {
        text("To adjust power: Hold SPACEBAR to charge power.", powerBarX, powerBarY - 35);
        text("Release to shoot.", powerBarX, powerBarY - 15);
    }
    // When spacebar is pressed + powerDirection(+ve)
    if (isSpacebarPressed && powerDirection > 0)
    {
        fill(255, 255, 0, 150);
        text("↑ Increasing", powerBarX + powerBarWidth - 80, powerBarY - 15);
    }
    // When spacebar is pressed + powerDirection(-ve)
    else if (isSpacebarPressed && powerDirection > 0)
    {
        fill(255, 100, 100, 150);
        text("↓ Decreasing", powerBarX + powerBarWidth - 80, powerBarY - 15);
    }
    pop();
}

function shootCueBall()
{
    // If the cue is NOT moving  ||  the cue ball is NOT placed, dont shoot
    if(!isCueActive || isCueBallPlaced) return;

    // Apply force to the cue ball BASED on the power
    var angle = atan2(cueStart.y-cueEnd.y, cueStart.x-cueEnd.x);
    var distance = dist(cueStart.x, cueStart.y, cueEnd.x, cueEnd.y);

    // Combine mouse PULL distance w Power settings
    var forceMagnitude = distance*0.00005*cuePower;
    var forceDirection = {
        x: cos(angle)*forceMagnitude,
        y: sin(angle)*forceMagnitude
    }

    Matter.Body.applyForce(cueBall, cueBall.position, {
        x: forceDirection.x,
        y: forceDirection.y,
    });

    // To deactivate the cue
    isCueActive = false;

    console.log("cue ball's current shooting power: "+ cuePower.toFixed(1));
}

// To handle the power adjustment
function powerAdjustment()
{
    // 
    if (isSpacebarPressed && isCueActive && !isCueBallPlaced)
    {
        // keep track of currentTime for Holding SPACEBAR, in milliseconds=0.001s
        var currentTime = millis();

        // To adjust the power every 100ms
        if (currentTime-lastPowerTime > 100)
        {
            // updates cuePower to the Current-time
            cuePower += cuePowerStep*powerDirection;

            // To check if cuePower has crossed the min/max of cuePower
            if (cuePower >= cuePowerMax)
            {
                cuePower = cuePowerMax;
                powerDirection = -1; //starts Decreasing cuePower by cuePowerStep
            }
            else if (cuePower <= cuePowerMin)
            {
                cuePower = cuePowerMin;
                powerDirection = 1; //starts Increasing cuePower by cuePowerStep
            }

            // To keep updating lastPowerTime w the currentTime
            lastPowerTime = currentTime;
        }
    }
}