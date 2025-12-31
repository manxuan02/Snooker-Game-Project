function setupMagneticMode()
{
    magneticMode = true; //to RUN the Magnetic mode

    // To assign balls w random magnetic charges
    assignCharges();

    Matter.Events.on(engine, 'collisionStart', (event) => {
        // If Magnetic mode is NOT called, DONT run the code
        if(!magneticMode) return;

        var pairs = event.pairs; //array to store all the Attracted-ball pairs

        pairs.forEach(collisions => {
            var bodyA = collisions.bodyA;
            var bodyB = collisions.bodyB;

            // Calculate collision force
            var force = calCollisionForce(bodyA, bodyB);
            
            // if Collision Force is strong enough, break the attractions involving collided balls
            if (force >= unattachForce) {
                unattachAttractedBalls(bodyA.id);
                unattachAttractedBalls(bodyB.id);
            }
        });
    });

    console.log("magnetic mode activated!!");
    console.log("attracted pairs " + attractedBalls.length);
}

// find balls
function findBallId(ballId)
{
    var allBalls = getAllBalls(); //calling the function, which contains an array to store ALL balls
    var foundBall = null;

    // finds the ball, by Looping through allBalls[]
    allBalls.forEach(ball => {
        if(ball.id === ballId ) foundBall = ball;
    });

    return foundBall;
}

function drawMagneticWave()
{
    // If Magnetic mode is NOT called or There are NO attracted-balls, DONT run the code
    if(!magneticMode || attractedBalls.length===0) return;

    push();
    noFill();

    // Magnetic Wave Line
    strokeWeight(3);

    // Loops through allBalls array n Draws the opposite charges
    for (var i = 0; i < attractedBalls.length; i++) {
        //Attracted-balls pair
        var pair = attractedBalls[i];

        // EACH of the Attracted-balls
        var ballA = findBallId(pair.ballA);
        var ballB = findBallId(pair.ballB);
        
        // if ballA n ballB are Not found, SKIP to the Next Iteration==DONT draw
        if (!ballA || !ballB) continue;

        var currentDistBetweenBalls = dist(ballA.position.x, ballA.position.y, ballB.position.x, ballB.position.y); //Current distance between ballA n ballB

        // Magnetic Wave's color drawn, based on Attraction-Strength
        var alpha = map(currentDistBetweenBalls, ballRad*2, attractionDist, 255, 50);

        // Magnetic Wave Line
        stroke(189, 36, 36, alpha);
        drawingContext.setLineDash([10, 10]);
        line(ballA.position.x, ballA.position.y, ballB.position.x, ballB.position.y);
        drawingContext.setLineDash([]);

        // small Force Indicator at midpoint
        var midX = (ballA.position.x + ballB.position.x) / 2;
        var midY = (ballA.position.y + ballB.position.y) / 2;
        
        // arrow for Attraction Direction
        drawForceArrow(ballA, ballB, midX, midY);
    }
    pop();
}

function drawForceArrow(ballA, ballB, x, y)
{
    // calculate the angle of ballA TO ballB
    var angle = atan2(ballB.position.y - ballA.position.y, ballB.position.x - ballA.position.x);
    
    // arrow for Attraction Direction
    push();
    translate(x, y);
    rotate(angle);
    stroke(255);
    strokeWeight(1);
    line(0, 0, 10, 0);
    line(10, 0, 7, -3);
    line(10, 0, 7, 3);
    pop();

    console.log("drawing arrow: ", ballA, ballB, x, y);
}

// assign balls w random magnetic charges
function assignCharges()
{
    // clear Existing charges
    ballCharge.clear();

    // cue ball's charge -> 0(neutral)
    if (cueBall)
    {
        ballCharge.set(cueBall.id, 0); //charge = 0
    }

    // red ball's charge -> +1(+ve)
    if (stack && stack.bodies)
    {
        stack.bodies.forEach(ball => {
            ballCharge.set(ball.id, 1); //charge = +1
        });
    }

    // colored ball's charge -> -1(-ve)
    if (coloredBalls)
    {
        coloredBalls.forEach(ball => {
            ballCharge.set(ball.id, -1); //charge = -1
        });
    }
}

// To check if the balls SHOULD attract
function checkBallAttraction(ballA, ballB)
{
    // get the Selected balls' charges
    var chargeA = ballCharge.get(ballA.id) || 0;
    var chargeB = ballCharge.get(ballB.id) || 0;

    // check the Validity of Magnetic Attraction - FALSE === NO attraction
    if(chargeA===0 || chargeB===0) return false;
    if(chargeA===chargeB) return false;

    // check the Distance between balls, their Validity for Magnetic Attraction
    var distance = dist(ballA.position.x, ballA.position.y, ballB.position.x, ballB.position.y);

    // if balls are too Far Apart, NO attraction
    if (distance > attractionDist) return false;
    
    // if balls are already colliding/touching, NO attraction
    if (distance < ballRad * 2) return false;
    
    return true;
}

function applyMagneticForce(ballA, ballB)
{
    // To calculate the distance between ALL balls
    var distX = ballB.position.x - ballA.position.x; //the horizontal distance
    var distY = ballB.position.y - ballA.position.y; //the vertical distance
    var dist = Math.sqrt(distX*distX + distY*distY); //the Straight Line distance

    // if balls are overlapping=no distance apart, NO application of Magnetic Force
    if(dist===0) return;

    // get the direction FROM ballA TO ballB
    var directionX = distX/dist; //cos
    var directionY = distY/dist; //sin

    // To calculate the Magnetic Force
    var magForce = magneticStrength / (dist * dist); // Magnetic force: F = k * (chargeA * chargeB) / distance²

    // apply Magnetic Force to ballA
    Matter.Body.applyForce(ballA, ballA.position, {
        x: directionX * magForce,
        y: directionY * magForce
    });
    // apply Magnetic Force to ballB
    Matter.Body.applyForce(ballB, ballB.position, {
        x: -directionX * magForce,
        y: -directionY * magForce
    });
}

// update attractedBalls[] w the NEW Attracted-balls
function updateMagneticForce()
{
    // If Magnetic mode is NOT called, DONT run the code
    if(!magneticMode) return;

    var allBalls = getAllBalls(); //calling the function, which contains an array to store ALL balls

    // Reset the Attracted-balls tracking
    var attractedBallsNEW = [];

    // To apply Magnetic forces between ball pairs
    for (var i = 0; i < allBalls.length; i++) {
        for (var j = 0; j < allBalls.length; j++) {
            // the Attracted-balls
            var ballA = allBalls[i];
            var ballB = allBalls[j];

            // check Validity of ball's Attraction
            var shouldAttract = checkBallAttraction(ballA, ballB);

            // Valid Attraction
            if (shouldAttract)
            {
                applyMagneticForce(ballA, ballB);

                // To track the Attracted-balls
                attractedBallsNEW.push({
                    ballA: ballA.id,
                    ballB: ballB.id,
                    dist: dist(ballA.position.x, ballA.position.y, ballB.position.x, ballB.position.y),
                });
            }
        }
    }

    // update attractedBalls[] w the NEW Attracted-balls
    attractedBalls = attractedBallsNEW;
}

// calculate the Collision Force that Attracted-balls 'received'
function calCollisionForce(bodyA, bodyB)
{
    // calclulate the Speed/velocity of the Collision Force
    var relativeVelX = bodyA.velocity.x - bodyB.velocity.x;
    var relativeVelY = bodyA.velocity.y - bodyB.velocity.y;

    // calculate the Force's Magnitude, using Pythagoras Theorem
    var force = Math.sqrt(relativeVelX * relativeVelX + relativeVelY * relativeVelY);
    
    return force;
}

// Unattach the Attracted-balls
function unattachAttractedBalls(ballId)
{
    // filters out(unattaching) Attached-ball's 'ballId' from 'attractedBalls[]'
    attractedBalls = attractedBalls.filter(pair => {
        return pair.ballA !== ballId && pair.ballB !== ballId;
    });
}