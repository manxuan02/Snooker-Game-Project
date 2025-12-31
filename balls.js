function setupRedBall()
{
    // Create an empty composite to 'store' red balls
    stack = Composite.create();

    // To create an equilateral triangle of balls
    // rows
    for(var row = 0; row < 5; row++) {   
        // columns
        for(var col = 0; col <= row; col++) {
            const startX = rBallX + row * (rBallDia * Math.sqrt(3) / 2); // Use diameter and correct spacing
            const startY = rBallY - row * (rBallDia / 2) + col * rBallDia; // Space by diameter

            rBall = Bodies.circle(startX, startY, ballRad, {restitution: 0.3, friction: 0.01, isStatic: false, label: "redBall"});
            
            Composite.add(stack, rBall);
        }
    }

    World.add(engine.world, [stack]);
}

function drawRedBall()
{
    push();
    for(var i = 0; i < stack.bodies.length; i++) {
        stroke(150,82,36);
        strokeWeight(3);
        fill(255,0,0);
        drawVertices(stack.bodies[i].vertices);
    }
    pop();
}


// An array to store colored balls
var coloredBalls = [];

function setupColorBalls()
{
    console.log("setupColorBalls called - Current coloredBalls:", coloredBalls.length);
    
    // Clear existing colored balls before creating new ones
    if (coloredBalls.length > 0) {
        console.log("Clearing existing colored balls");
        coloredBalls.forEach(ball => World.remove(engine.world, ball));
        coloredBalls = [];
    }


    // Define properties for colored balls
    var ballOptions = { restitution: 0.8, friction: 0.005, isStatic: false };

    // Define positions for each colored ball
    var positions = [
        { x: dLineX, y: dLineY - tableWidth / 4, label: "yellowBall" },
        { x: dLineX, y: dLineY, label: "greenBall" },
        { x: dLineX, y: dLineY + tableWidth / 4, label: "brownBall" },
        { x: pocketMiddleX, y: dLineY, label: "blueBall" },
        { x: pocketMiddleX + 100, y: dLineY, label: "pinkBall" },
        { x: pocketRightX - 50, y: dLineY, label: "blackBall" },
    ];

    // Create and add each ball to the array and world
    positions.forEach(pos => {
        var ball = Bodies.circle(pos.x, pos.y, ballRad, { ...ballOptions, label: pos.label });
        coloredBalls.push(ball);
        World.add(engine.world, ball);
    });
}

function drawColorBalls()
{
    push();
    coloredBalls.forEach(ball => {
        var color;
        switch (ball.label)
        {
            case "yellowBall":
                color = [255, 255, 0]; // Yellow
                break;
            case "greenBall":
                color = [0, 255, 0]; // Green
                break;
            case "brownBall":
                color = [139, 69, 19]; // Brown
                break;
            case "blueBall":
                color = [0, 0, 255]; // Blue
                break;
            case "pinkBall":
                color = [255, 105, 180]; // Pink
                break;
            case "blackBall":
                color = [0, 0, 0]; // Black
                break;
        }
        
        fill(color);
        stroke(150, 82, 36);
        strokeWeight(2);
        drawVertices(ball.vertices);
    });
    pop();
}


// An array to store ALL balls(cueball + redball + coloredball)
function getAllBalls()
{
    var allBalls = []; //array to store ALL balls

    if(cueBall) allBalls.push(cueBall); //check for cue ball
    if(stack && stack.bodies) allBalls = allBalls.concat(stack.bodies); //join all red balls
    if(coloredBalls) allBalls = allBalls.concat(coloredBalls); //join all colored balls

    return allBalls;
}


function setupTranslucentBall(x, y)
{
    translucentBall = Bodies.circle(x, y, ballRad, {
        isStatic: true,
        collisionFilter: {category: 0x0002, mask:0x0000},
        render: {visible: true},
        label: 'translucentBall'
    });

    World.add(engine.world, translucentBall);
}

function drawTranslucentBall()
{
    if(!translucentBall) return;

    push();
    stroke(150, 150, 150, 0.5);
    strokeWeight(2);
    fill(255, 255, 255, 100);
    drawVertices(translucentBall.vertices);

    pop();

    console.log("drawing translucent ball: ", translucentBall);
}


// To check if the balls are in the pocket
function checkBallInPocket()
{
    // To Check if the CUE ball is in the pocket
    for (var p of pockets) {
        // Compare the CUEball dist. w Pocket dist.
        var distance = dist(
            cueBall.position.x,
            cueBall.position.y,
            p.position.x,
            p.position.y
        );

        if (distance < 20 + ballRad)
        {
            console.log("Cue ball potted!");

            // Start to show pocket_Fading
            pocketFade(cueBall, "cueBall");

            // Remove the potted_cueball from World
            World.remove(engine.world, cueBall); 
            console.log(`CUE ball potted and removed!`);

            // RESPAWN the cueball AFTER pocket_Fading
            setTimeout(() => {
                setupCueBall();
                console.log(`CUE ball redraw! Please place it back in the 'D' zone.`);
            }, 1); //to draw Cue ball ONCE + wait for pocket_Fading to finish
            
            break;
        }
    }

    // To Check if any RED ball is in the pocket
    if (stack && stack.bodies)
    {
        for (var i = stack.bodies.length-1; i >= 0; i--) {//so REDballs will keep decreasing, as it is being potted
            var ball = stack.bodies[i];

            for (var p of pockets) {
                // Compare the REDball dist. w Pocket dist.
                var distance = dist(
                    ball.position.x,
                    ball.position.y,
                    p.position.x,
                    p.position.y
                );
        
                if (distance < 20 + ballRad)
                {
                    console.log("Red ball potted!");

                    // Start to show pocket_Fading
                    pocketFade(ball, "redBall");

                    // Remove the potted_redball
                    World.remove(engine.world, ball); //remove from physics World
                    Composite.remove(stack, ball); //remove from Composite
                    console.log(`RED ball potted and removed!`);
                    break;
                }
            }
        }
    }

    // To Check if any COLOURED ball is in the pocket
    for (var i = coloredBalls.length-1; i >= 0 ; i--) {
        var ball = coloredBalls[i];

        for (var p of pockets) {
            // Compare the CUEball dist. w Pocket dist.
            var distance = dist(
                ball.position.x,
                ball.position.y,
                p.position.x,
                p.position.y
            );
    
            if (distance < 20 + ballRad)
            {
                console.log(`${ball.label} potted!`);

                // Start to show pocket_Fading
                pocketFade(ball, ball.label);
    
                // Remove the potted_coloredeball from World
                World.remove(engine.world, ball); //remove from physics World
                coloredBalls.splice(i, 1); //remove from colourBalls array
                console.log(`${ball.label} potted and removed!`);
                break;
            }
        }
    }
}


// To ensure the balls STAYS WITHIN the table
function ballConstrain()
{
    // The table sizing
    var minX = tableX + 30;
    var maxX = tableX + tableLength - 30;
    var minY = tableY + 30;
    var maxY = tableY + tableWidth - 30;

    // constrain CUE ball
    if (cueBall.position.x < minX ||
        cueBall.position.x > maxX ||
        cueBall.position.y < minY ||
        cueBall.position.y > maxY)
    {
        Matter.Body.setPosition(cueBall,
            { 
                x: constrain(cueBall.position.x, minX, maxX), 
                y: constrain(cueBall.position.y, minY, maxY) 
            });
        Matter.Body.setVelocity(cueBall, { x: 0, y: 0 });
    }

    // constrain RED ball
    if (stack && stack.bodies)
    {
        stack.bodies.forEach(ball => {
            if (ball.position.x < minX ||
                ball.position.x > maxX ||
                ball.position.y < minY ||
                ball.position.y > maxY)
            {
                Matter.Body.setPosition(ball,
                    { 
                        x: constrain(ball.position.x, minX, maxX), 
                        y: constrain(ball.position.y, minY, maxY) 
                    });
                Matter.Body.setVelocity(ball, { x: 0, y: 0 });
            }
        });
    }
    
    // constrain COLOURED ball
    coloredBalls.forEach(ball => {
        if (ball.position.x < minX ||
            ball.position.x > maxX ||
            ball.position.y < minY ||
            ball.position.y > maxY)
        {
            Matter.Body.setPosition(ball,
                { 
                    x: constrain(ball.position.x, minX, maxX), 
                    y: constrain(ball.position.y, minY, maxY) 
                });
            Matter.Body.setVelocity(ball, { x: 0, y: 0 });
        }
    });
}