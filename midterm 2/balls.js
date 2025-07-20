function setupRedBall()
{
    // Create an empty composite to 'store' red balls
    stack = Composite.create();

    // var radius = rBallRad/2;

    // CAN CREATE AN ARRAY TO STORE THE RED BALLS
    // var balls = [];

    // To create an equilateral triangle of balls
    // rows
    for(var row = 0; row < 5; row++)
    {   
        // columns
        for(var col = 0; col <= row; col++)
        {
            startX = rBallX + row * (rBallDia * Math.sqrt(3) / 2); // Use diameter and correct spacing
            startY = rBallY - row * (rBallDia / 2) + col * rBallDia; // Space by diameter

            var rBall = Bodies.circle(startX, startY, rBallRad, {restitution: 0.8, friction: 0.005, isStatic:true});
            
            Composite.add(stack, rBall);
        }
    }

    World.add(engine.world, [stack]);
}

function drawRedBall()
{
    push();
    for(var i = 0; i < stack.bodies.length; i++)
    {
        stroke(150,82,36);
        strokeWeight(3);
        fill(255,0,0);
        drawVertices(stack.bodies[i].vertices);
    }
    pop();
}

function setupColorBalls()
{
    // yellow ball
    yball
    // green ball
    gball
    // brown ball
    brball
    // blue ball
    bluball
    // pink ball
    pball
    // black ball
    blaball

}