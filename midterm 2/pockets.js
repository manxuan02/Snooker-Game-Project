function createPocket(pocketX, pocketY, width, height, optionsPocket, holeX, holeY, size)
{
    const pocket = Bodies.rectangle(pocketX, pocketY, width, height, optionsPocket);

    const hole = Bodies.circle(holeX, holeY, size);

    // To add them to the world
    World.add(engine.world, [pocket, hole]);

    return pocket;
}

function setupPocket()
{
    // const pocketOptions1 = {
    //     isStatic: true,
    //     restitution: 0.5,
    //     friction: 0.1,
    //     chamfer: {radius: [10, 0, 10, 0]}
    // }
    const pocketOptions2 = {
        isStatic: true,
        restitution: 0.5,
        friction: 0.1,
    }
    // const pocketOptions3 = {
    //     isStatic: true,
    //     restitution: 0.5,
    //     friction: 0.1,
    //     chamfer: {radius: [0, 10, 0, 10]}
    // }

    // // Pocket
    // // Top-Left pocket
    // pocketTL = Bodies.rectangle(pocketLeftX, pocketTopY, 35, 35, pocketOptions1);
    // console.log("pocketTL: ", pocketTL);
    // // Top-Middle
    // pocketTM = Bodies.rectangle(pocketMiddleX, pocketTopY - 5, 35, 25, pocketOptions2);
    // // Top-Right
    // pocketTR = Bodies.rectangle(pocketRightX, pocketTopY, 35, 35, pocketOptions3);
    // // Bottom-Right
    // pocketBR = Bodies.rectangle(pocketRightX, pocketBottomY, 35, 35, pocketOptions1);
    // // Bottom-Middle
    // pocketBM = Bodies.rectangle(pocketMiddleX, pocketBottomY + 5, 35, 25, pocketOptions2);
    // // Bottom-Left
    // pocketBL = Bodies.rectangle(pocketLeftX, pocketBottomY, 35, 35, pocketOptions3);

    const pocketPositions = 
    [
        {x: pocketLeftX, y: pocketTopY, width: 35, height: 35, pocketOptions2 },
    ]

    // Black-hole
    // Top-Left
    holeTL = Bodies.circle(pocketLeftX + 16, pocketTopY + 16, 20, pocketOptions2);
    console.log("holeTL: ", holeTL);
    // Top-Middle
    holeTM = Bodies.circle(pocketMiddleX, pocketTopY + 10, 20, pocketOptions2);
    console.log("holeTM: ", holeTM);
    // Top-Right
    holeTR = Bodies.circle(pocketRightX - 16, pocketTopY + 16, 20, pocketOptions2);
    console.log("holeTR: ", holeTR);
    // Bottom-Right
    holeBR = Bodies.circle(pocketRightX - 16, pocketBottomY - 16, 20, pocketOptions2);
    console.log("holeBR: ", holeBR);
    // Bottom-Middle
    holeBM = Bodies.circle(pocketMiddleX, pocketBottomY - 10, 20, pocketOptions2);
    console.log("holeBM: ", holeBM);
    // Bottom-Left
    holeBL = Bodies.circle(pocketLeftX + 16, pocketBottomY - 13, 20, pocketOptions2);
    console.log("holeBL: ", holeBL);

    console.log("pocketLeftX: ", pocketLeftX);
    console.log("pocketTopY: ", pocketTopY);

    // // To add them to the world
    // World.add(engine.world, 
    //     [pocketTL, pocketTM, pocketTR, pocketBR, pocketBM, pocketBL,
    //     holeTL, holeTM]);

    World.add(engine.world, 
            [holeTL, holeTM, holeTR, holeBR, holeBM, holeBL]);
    
}

function drawPocket()
{
    // // Draw the black-hole part
    // fill(0);
    // // Top-Left
    // ellipse(pocketLeftX + 25, pocketTopY + 25, pocketDmt);
    // Top-Middle
    // ellipse(pocketMiddleX + 17.5, pocketTopY + 20, pocketDmt);
    // // Top-Right
    // ellipse(pocketRightX + 18, pocketTopY + 25, pocketDmt);
    // // Bottom-Right
    // ellipse(pocketRightX + 18, pocketBottomY + 11, pocketDmt);
    // // Bottom-Middle
    // ellipse(pocketMiddleX + 17.5, pocketBottomY + 15, pocketDmt);
    // // Bottom-Left
    // ellipse(pocketLeftX + 25, pocketBottomY + 11, pocketDmt);

    fill(222, 202, 63);
    // Top-Left pocket
    pocketTL = rect(pocketLeftX - 17, pocketTopY - 17, 35, 35, 5, 0, 5, 0);
    console.log("pocketTL: ", pocketTL);
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
    // fill(222, 202, 63);
    // drawVertices(pocketTL.vertices); // Top-Left pocket
    // drawVertices(pocketTM.vertices); // Top-Middle pocket
    // drawVertices(pocketTR.vertices); // Top-Right pocket
    // drawVertices(pocketBR.vertices); // Bottom-Right pocket
    // drawVertices(pocketBM.vertices); // Bottom-Middle pocket
    // drawVertices(pocketBL.vertices); // Bottom-Left pocket

    fill(0);
    drawVertices(holeTL.vertices); // Top-Left hole
    drawVertices(holeTM.vertices); // Top-Middle hole
    drawVertices(holeTR.vertices); // Top-Middle hole
    drawVertices(holeBR.vertices); // Top-Left hole
    drawVertices(holeBM.vertices); // Top-Middle hole
    drawVertices(holeBL.vertices); // Top-Middle hole
    pop();
}