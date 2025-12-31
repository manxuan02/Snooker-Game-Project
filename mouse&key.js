function keyPressed()
{
    // For changing of Game Mode
    if(key === "1") setupGameMode(1);
    if(key === "2") setupGameMode(2);
    if(key === "3") setupGameMode(3);
    if(key === "4") setupGameMode(4);

    // For adjusting the Cue's Power
    if (keyCode === 32 && isCueActive && !isCueBallPlaced && !isSpacebarPressed)
    {
        isSpacebarPressed = true;
        powerDirection = 1 //to start Increasing cuePower
        lastPowerTime = millis(); //to start recording/storing cuePower

        console.log("SPACEBAR pressed - Starting power adjustment");
    }
}

function keyReleased()
{
    // For shooting the Cue ball
    if (keyCode === 32 && isCueActive && !isCueBallPlaced)
    {
        isSpacebarPressed = false;
        powerDirection = 0; //to stop the user from adjusting the powerBar

        // To shoot the cueBall with the Current power
        shootCueBall();

        // To RESET cuePower
        setTimeout(() => {
            cuePower = cuePowerMin;
        }, 2);
        
        console.log("Spacebar released - shooting with power: " + cuePower.toFixed(1));
    }
}

// To control the Cue ball's Direction
function mousePressed()
{
    // To NOT activate the cuestick, when placing the cueBall
    if(isCueBallPlaced) return;

    isCueActive = true;

    // To RESET spacebar's state
    isSpacebarPressed = false;

    // To reset the power level
    cuePower = cuePowerMin;

    // To save the mouse position, to allow the cue to move around
    cueStart = {x: cueBall.position.x, y: cueBall.position.y};
    cueEnd = {x: mouseX, y: mouseY};
}

function mouseDragged()
{
    // For adjusting the Cue ball's INITIAL position
    if(isCueActive && !isCueBallPlaced)
    {
        cueEnd = { x: mouseX, y: mouseY };
    }
}