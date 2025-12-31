function setupPocket()
{
    var pocketOptions = {
        isStatic: true,
        restitution: 0.5,
        friction: 0.1,
        label: 'pocket'
    }

    // Black-hole
    // Top-Left
    holeTL = Bodies.circle(pocketLeftX + 16, pocketTopY + 16, 20, {...pocketOptions});
    // console.log("holeTL: ", holeTL);
    pockets.push(holeTL); // To put into the 'pockets' array
    // Top-Middle
    holeTM = Bodies.circle(pocketMiddleX, pocketTopY + 10, 20, {...pocketOptions});
    // console.log("holeTM: ", holeTM);
    pockets.push(holeTM); // To put into the 'pockets' array
    // Top-Right
    holeTR = Bodies.circle(pocketRightX - 16, pocketTopY + 16, 20, {...pocketOptions});
    // console.log("holeTR: ", holeTR);
    pockets.push(holeTR); // To put into the 'pockets' array
    // Bottom-Right
    holeBR = Bodies.circle(pocketRightX - 16, pocketBottomY - 16, 20, {...pocketOptions});
    // console.log("holeBR: ", holeBR);
    pockets.push(holeBR); // To put into the 'pockets' array
    // Bottom-Middle
    holeBM = Bodies.circle(pocketMiddleX, pocketBottomY - 10, 20, {...pocketOptions});
    // console.log("holeBM: ", holeBM);
    pockets.push(holeBM); // To put into the 'pockets' array
    // Bottom-Left
    holeBL = Bodies.circle(pocketLeftX + 16, pocketBottomY - 13, 20, {...pocketOptions});
    // console.log("holeBL: ", holeBL);
    pockets.push(holeBL); // To put into the 'pockets' array

    World.add(engine.world, pockets);
}

function drawPocket()
{
    fill(222, 202, 63);
    // Top-Left pocket
    pocketTL = rect(pocketLeftX - 17, pocketTopY - 17, 35, 35, 5, 0, 5, 0);
    // console.log("pocketTL: ", pocketTL);
    // Top-Middle
    pocketTM = rect(pocketMiddleX - 17, pocketTopY - 17, 35, 25);
    // Top-Right
    pocketTR = rect(pocketRightX - 17, pocketTopY - 17, 35, 35, 0, 5, 0, 5);
    // Bottom-Right
    pocketBR = rect(pocketRightX - 17, pocketBottomY - 18, 35, 35, 5, 0, 5, 0);
    // Bottom-Middle
    pocketBM = rect(pocketMiddleX - 17, pocketBottomY - 8, 35, 25);
    // Bottom-Left
    pocketBL = rect(pocketLeftX - 17, pocketBottomY - 18, 35, 35, 0, 5, 0, 5);

    push();

    fill(0);
    drawVertices(holeTL.vertices); // Top-Left hole
    drawVertices(holeTM.vertices); // Top-Middle hole
    drawVertices(holeTR.vertices); // Top-Middle hole
    drawVertices(holeBR.vertices); // Top-Left hole
    drawVertices(holeBM.vertices); // Top-Middle hole
    drawVertices(holeBL.vertices); // Top-Middle hole
    pop();
}


// Pocketed ball Fading
function pocketFade(ball, label)
{
    // To get the ball that has been Pocketed
    var color = getPocketedBallColor(label);

    // Add the ball to pocketBallFading[]
    pocketBallFading.push({
        x: ball.position.x,
        y: ball.position.y,
        radius: ballRad,
        opacity: 1,
        color: color,
        label: label
    });
}

function getPocketedBallColor(label)
{
    switch(label)
    {
        case "cueBall":
            return {r: 255, g: 255, b: 255}; // White
        case "redBall":
            return {r: 255, g: 0, b: 0}; // Red
        case "yellowBall":
            return {r: 255, g: 255, b: 0}; // Yellow
        case "greenBall":
            return {r: 0, g: 255, b: 0}; // Green
        case "brownBall":
            return {r: 139, g: 69, b: 19}; // Brown
        case "blueBall":
            return {r: 0, g: 0, b: 255}; // Blue
        case "pinkBall":
            return {r: 255, g: 105, b: 180}; // Pink
        case "blackBall":
            return {r: 0, g: 0, b: 0}; // Black
        default:
            return {r: 255, g: 255, b: 255}; // default
    } 
}

function updatePocketFade()
{
    for (var i = pocketBallFading.length-1; i >= 0; i--) {
        var fadingBall = pocketBallFading[i];

        // Fade the ball n Shrink it
        fadingBall.opacity -= pocketFadeSpeed;
        fadingBall.radius *= 1;

        // Remove the Pocketed ball, from the World, when fully faded
        if (fadingBall.opacity <= 0)
        { 
            pocketBallFading.splice(i, 1); //remove the time at index[1] from the ballTrail-array
        }   
    }
}

function drawPocketFade()
{
    // To check for pocketed ball stored in the pocketBallFading[], if not do NOT draw pocketFade
    if(pocketBallFading.length === 0) return;  
    
    push();
    noStroke();

    // To draw the respective animation for a pocketed_ball
    pocketBallFading.forEach(fadingBall => {
        var color = fadingBall.color;

        // To draw the fadingBall
        fill(color.r, color.g, color.b, fadingBall.opacity*255);
        ellipse(fadingBall.x, fadingBall.y, fadingBall.radius*2);

        // To draw a sParKLe effect
        if (fadingBall.opacity > 0.3)
        {
            fill(255, 255, 255, fadingBall.opacity*100);
            ellipse(fadingBall.x, fadingBall.y, fadingBall.radius*0.5);
        }
    });

    pop();
}