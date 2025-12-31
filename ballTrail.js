function updateBallTrails()
{

    var allBalls = getAllBalls(); //calling the function, which contains an array to store ALL balls

    allBalls.forEach(ball => {
        // Checks for any moving ball
        if(!ball.velocity) return;
        
        // To find the actual speed
        var speed = Math.sqrt(ball.velocity.x*ball.velocity.x + ball.velocity.y*ball.velocity.y);

        // To remove translucent ball if other ball movement is detected
        if (speed > 0.2)
        {
            setupBallTrails(ball);
        }
    });

    // Create the fading trails + Remove old trail points
    trailFade();
}

function setupBallTrails(ball)
{
    // Find / Create trail for the selected ball
    var trail = ballTrail.find(t => t.ballId === ball.id);

    // Create a new trail for it, if the selected ball's trail does not exists
    if (!trail)
    {
        trail = {
            ballId: ball.id,
            points: [],
            color: getBallTrailColor(ball)
        };
        ballTrail.push(trail); //add the new trail into the ballTrail->empty array
    }

    // Adding trailPoints to existing trails[]
    trail.points.push({
        x: ball.position.x,
        y: ball.position.y,
        radius: ballRad,
        opacity: 0.5
    });

    // Length of the trail
    if (trail.points.length > maxTrailLength)
    {
        trail.points.shift();
    }
}

function drawBallTrails()
{
    push();
    noStroke();

    ballTrail.forEach(trail => {
        var points = trail.points;

        // Draw the trail
        for (var i = points.length-1; i >= 0; i--) {
            var point = points[i];

            // calculate size of the trail based on the position of the trail,, newer position = larger size
            var size = i/points.length;

            var rad = point.radius*size; //radius of the trail
            
            fill(trail.color.r, trail.color.g, trail.color.b, point.opacity*50);

            ellipse(point.x, point.y, rad*2);

            // connecting length for the trail
            if (i > 0)
            {
                var prevPoint = points[i-1];
                strokeWeight(rad/2);
                stroke(trail.color.r, trail.color.g, trail.color.b, point.opacity*150);
                line(prevPoint.x, prevPoint.y, point.x, point.y); //prevPoint - currentPoint
                noStroke();                
            }
        }
    });

    pop();
}

function trailFade()
{
    for (var i = ballTrail.length-1; i >= 0; i--) {
        var trail = ballTrail[i];

        // To fade all the points
        for (var j = 0; j < trail.points.length; j++) {
            trail.points[j].opacity -= fadeStep;
        }

        // remove the faded points
        trail.points = trail.points.filter(point => point.opacity > 0);
        //filters out points that are faded already

        // Remove empty trails
        if (trail.points.length === 0)
        { 
            ballTrail.splice(i, 1); //remove the time at index[1] from the ballTrail-array
        }   
    }
}

function getBallTrailColor(ball)
{
    if (ball.label === "cueBall")
    {
        return {r: 255, g: 255, b: 255};
    }
    else if (ball.label === "redBall")
    {
        return {r: 255, g: 0, b: 0};
    }
    else
    {
        switch (ball.label)
        {
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
}