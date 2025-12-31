// Cue Impact
function setupCueImpact()
{
    Matter.Events.on(engine, 'collisionStart', (event) => {
        var pairs = event.pairs; //array to store all the collided ball pairs

        for (var i = 0; i < pairs.length; i++) {
            var collidedPair = pairs[i];
            var bodyA = collidedPair.bodyA; //bodyA
            var bodyB = collidedPair.bodyB; //bodyB

            // Only show the flash when CUE has collided
            if (isCueCollided(bodyA, bodyB))
            {
                cueImpact(collidedPair);

                // To show 1 impact per frame
                break;
            }
        }
    });
}

function isCueCollided(bodyA, bodyB)
{
    // Check if the CUE ball has collided
    var isCueInvolved = (bodyA === cueBall || bodyB === cueBall); //cue INVOLVED
    if(!isCueInvolved) return false; //cue NOT involved

    // Find the other object(!=cueball)
    var otherBody = (bodyA === cueBall) ? bodyB : bodyA;

    // Shows flash for CUE n ball collision only
    var isCueCollision = otherBody.label && (otherBody.label.includes('Ball') || otherBody.label.includes('redBall'));

    // Check for the speed of cue ball
    var cueSpeed = Math.sqrt(cueBall.velocity.x*cueBall.velocity.x + cueBall.velocity.y*cueBall.velocity.y);

    return isCueCollision && cueSpeed > 0.5;
}

function cueImpact(collidedPair)
{
    var bodyA = collidedPair.bodyA; //bodyA
    var bodyB = collidedPair.bodyB; //bodyB

    // Getting the collision position,, so to draw the impact ltr on
    var collisionX = (bodyA.position.x + bodyB.position.x)/2;
    var collisionY = (bodyA.position.y + bodyB.position.y)/2;

    var collisionSpeed = Math.sqrt(
        Math.pow(bodyA.velocity.x - bodyB.velocity.x, 2) + 
        Math.pow(bodyA.velocity.y - bodyB.velocity.y, 2)
    );

    // Draw the cue impact
    showCollision(collisionX, collisionY, collisionSpeed);
}

function showCollision(x, y, force=1)
{
    cueCollision.active = true;
    cueCollision.x = x;
    cueCollision.y = y;
    cueCollision.radius = 5*force; //Harder hit = Bigger flash
    cueCollision.opacity = 255;
    cueCollision.force = force; //stores the 'force' of balls collision
}

function drawCueImpact()
{
    // To check for cueCollision, if not do NOT draw cueCollision
    if(!cueCollision.active) return;

    // Draw the Flash
    push();
    noFill();
    strokeWeight(3 + cueCollision.force);
    stroke(255, 255, 255, cueCollision.opacity);
    ellipse(cueCollision.x, cueCollision.y, cueCollision.radius*1.5);

    // Draw the flash
    cueCollision.radius += cueCollision.force;
    cueCollision.opacity -= 10*cueCollision.force;

    // End of the flash
    if (cueCollision.opacity <= 0)
    {
        cueCollision.active = false;
    }

    pop();
}