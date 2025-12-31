// const Matter = require("matter-js");

function setupGameMode(mode)
{
    if(!modeSelected)
    {
        if(mode === 1)
        {
            // To RESET balls to initial positions
            if (!stack || stack.bodies.length === 0) {
                setupRedBall(); 
            }
            if (coloredBalls.length === 0) {
                setupColorBalls();
            }
            resetBallsToStartPositions();
            console.log("mode 1");
        }
        else if(mode === 2)
        {
            setupColorBalls();
            randomBallCluster("red");
            console.log("mode 2");
        }
        else if(mode === 3)
        {
            setupColorBalls();
            practiceMode("red");
            console.log("mode 3");
        }
        else if(mode === 4)
        {
            // To RESET balls to initial positions
            if (!stack || stack.bodies.length === 0) {
                setupRedBall(); 
            }
            if (coloredBalls.length === 0) {
                setupColorBalls();
            }
            resetBallsToStartPositions();
            setupMagneticMode(); // Extension
            console.log("mode 5");
        }
    }
}


function resetBallsToStartPositions()
{
    // Reset RED balls to triangle positions
    if (stack && stack.bodies.length > 0)
    {
        for(var row = 0; row < 5; row++) {   
            for(var col = 0; col <= row; col++) {
                var index = row * (row + 1) / 2 + col;
                if (index < stack.bodies.length)
                {
                    var startX = rBallX + row * (rBallDia * Math.sqrt(3) / 2);
                    var startY = rBallY - row * (rBallDia / 2) + col * rBallDia;
                    Matter.Body.setPosition(stack.bodies[index], { x: startX, y: startY });
                    Matter.Body.setVelocity(stack.bodies[index], { x: 0, y: 0 });
                }
            }
        }
    }

    // Reset colored balls
    var positions = [
        { x: dLineX, y: dLineY - tableWidth / 4 },
        { x: dLineX, y: dLineY },
        { x: dLineX, y: dLineY + tableWidth / 4 },
        { x: pocketMiddleX, y: dLineY },
        { x: pocketMiddleX + 100, y: dLineY },
        { x: pocketRightX - 50, y: dLineY },
    ];

    coloredBalls.forEach((ball, index) => {
        if (index < positions.length)
        {
            Matter.Body.setPosition(ball, { x: positions[index].x, y: positions[index].y });
            Matter.Body.setVelocity(ball, { x: 0, y: 0 });
        }
    });
}


// Mode 2: Random Clusters
function randomBallCluster(type)
{
    // determines if 'ballArray' refers to redballs or coloredballs
    var ballArray = type === "red" ? stack.bodies : coloredBalls;

    // Amount of clusters to create
    var clusterAmount = floor(random(2,4));

    // Divide the balls among the clusters
    var ballsPerCluster = ceil(ballArray.length / clusterAmount);

    // Drawing the cluster
    for (var cluster = 0; cluster < clusterAmount; cluster++) {
        // Cluster's center point
        var clusterCenterX = random(tableX + 100, tableX + tableLength - 100);
        var clusterCenterY = random(tableY + 100, tableY + tableWidth - 100);

        console.log('clusterCenterX', clusterCenterX + ' clusterCenterY', clusterCenterY);

        // Indexing the balls
        var startBallIndex = cluster * ballsPerCluster;
        var endBallIndex = min((cluster + 1) * ballsPerCluster, ballArray.length);

        // Creating the cluster, by looping through the ballArray 
        for (var i = startBallIndex; i < endBallIndex; i++) {
            // To select the current ball in the array to 'look at'
            var ball = ballArray[i];
            
            var maxOffset = rBallDia * 1.5; //Distance AROUND the cluster's centre

            var randomX, randomY;
            var checkAttempts = 0;
            var checkAttemptsMax = 10;

            // Use a do-while loop, so to prevent overlaps
            do {
                // To generate random position
                var angle = random(TWO_PI); //randomly AROUND the cluster's centre
                var distance = random(rBallDia, maxOffset);

                console.log('angle', angle + ' distance', distance);

                randomX = clusterCenterX + cos(angle) * distance;
                randomY = clusterCenterY + sin(angle) * distance;
                checkAttempts++;

                // To ensure that cluster is within the table
                if(randomX < tableX+ballRad) randomX = tableX+ballRad;
                if(randomX > tableX+ballRad+tableLength) randomX = tableX+ballRad+tableLength;
                if(randomY < tableY+ballRad) randomY = tableY+ballRad;
                if(randomY > tableY+ballRad+tableWidth) randomY = tableY+ballRad+tableWidth;

            } while (checkAttempts < checkAttemptsMax && isBallsOverlapped(randomX, randomY, ballArray, i, ballRad*2));

            Matter.Body.setPosition(ball, {x: randomX, y:randomY});
            Matter.Body.setVelocity(ball, {x: 0, y:0});
        }
    }
}


function isBallsOverlapped(x, y, balls, currentIndex, minDist)
{
    // Loops through 'balls' to check if they overlapped
    for (var i = 0; i < balls.length; i++) {
        // current ball
        if(i === currentIndex) continue;

        var ball2 = balls[i];
        var distance = dist(x, y, ball2.position.x, ball2.position.y);

        // if they overlap, isBallsOverLapped = true
        if(distance < minDist) return true;
    }

    return false;
}

// Mode 3: Practice Mode
function practiceMode(type)
{
    if(type !== "red") return; //handles the red ball ONLY
    
    var ballArray = stack.bodies; //the red ball ARRAY

    // Balls per line
    var verticalStack = 11;
    var horizontalStack = 5;

    // Dimensions
    var centerX = tableX + tableLength/5*4;
    var centerY = tableY + tableWidth/2;
    var spacing = rBallDia*1.5;
    var startX = centerX;
    var startY = centerY - ((verticalStack-1)*spacing)/2;

    // for indexing during forloop
    var checkBalls = 0;

    // Drawing the - horizontal row
    for (var i = 0; i < horizontalStack && checkBalls < ballArray.length; i++) {
        var ball = ballArray[checkBalls]; //the CURRENT selected ball

        Matter.Body.setPosition(ball, {
                                    x: startX + (i+1) * spacing,
                                    y: centerY
                                });
        Matter.Body.setVelocity(ball, {x: 0, y:0});

        checkBalls++; //to move on to the next ball in the array
    }

    // Drawing the | vertical row
    for (var j = 0; j < verticalStack && checkBalls < ballArray.length; j++) {
        // Skip the middle position
        if(j === Math.floor(verticalStack/2)) continue;

        var ball = ballArray[checkBalls]; //the CURRENT selected ball

        Matter.Body.setPosition(ball, {
                                    x: centerX,
                                    y: startY + j * spacing
        });
        Matter.Body.setVelocity(ball, {x: 0, y:0});
        
        checkBalls++; //to move on to the next ball in the array
    }  

    setupTranslucentBall(centerX, centerY);
}

// for translucent ball to disappear
function checkForBallMovements()
{
    // if translucent ball DONT exists, DONT run this code
    if(!translucentBall) return;

    var allBalls = getAllBalls(); //calling the function, which contains an array to store ALL balls

    // Loop through allBalls[] to check for movements of balls
    for (var ball of allBalls) {
        // checks for any moving ball
        if(!ball.velocity) continue;
        
        // To find the actual speed
        var speed = Math.sqrt(ball.velocity.x*ball.velocity.x + ball.velocity.y*ball.velocity.y)

        // To remove translucent ball if other ball movement is detected
        if (speed > 0.1)
        {
            World.remove(engine.world, translucentBall);
            translucentBall = null;
            break;
        }
    }
}