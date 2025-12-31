function setupCushion()
{
    var cushionOptions = {
        isStatic: true,
        restitution: 0.5,
        friction: 0.1
    }

    // Top-Left cushion
    cushionTL = Bodies.fromVertices(cushionLengthLeftX, cushionTopY, 
        [{x: -cushionLength_fromCentre - 10, y: cushionHeight }, //left-bottom
        { x: 500 / 5 - 25, y: cushionHeight }, //right-bottom
        { x: 500 / 5 - 2.5, y: 0 }, //right-top
        { x: -cushionLength_fromCentre - 22.5 - 10, y: 0 }], //left-top
        cushionOptions);
    // Top-Right cushion
    cushionTR = Bodies.fromVertices(cushionLengthRightX, cushionTopY,
        [{x: -cushionLength_fromCentre - 10, y: cushionHeight }, //left-bottom
        { x: 500 / 5 - 25 + 5, y: cushionHeight }, //right-bottom
        { x: 500 / 5 - 2.5 + 5, y: 0 }, //right-top
        { x: -cushionLength_fromCentre - 22.5 - 10, y: 0 }], //left-top
        cushionOptions);
    // Right cushion
    cushionR = Bodies.fromVertices(cushionRightX, cushionSideY,
        [{x: cushionHeight, y: -cushionLength_fromCentre - 22.5 }, //left-bottom
        { x: cushionHeight, y: 500 / 5 - 2.5 }, //right-bottom
        { x: 0, y: 500 / 5 - 25 }, //right-top
        { x: 0, y: -cushionLength_fromCentre }], //left-top
        cushionOptions);
    // Bottom-Right cushion
    cushionBR = Bodies.fromVertices(cushionLengthRightX, cushionBottomY,
        [{x: -cushionLength_fromCentre - 22.5 - 10, y: cushionHeight }, //left-bottom
        { x: 500 / 5 - 2.5 + 5, y: cushionHeight }, //right-bottom
        { x: 500 / 5 - 25 + 5, y: 0 }, //right-top
        { x: -cushionLength_fromCentre - 10, y: 0 }], //left-top
        cushionOptions);
    // Bottom-Left cushion
    cushionBL = Bodies.fromVertices(cushionLengthLeftX, cushionBottomY,
        [{x: -cushionLength_fromCentre - 22.5, y: cushionHeight }, //left-bottom
        { x: 500 / 5 + 7, y: cushionHeight }, //right-bottom
        { x: 500 / 5 - 20, y: 0 }, //right-top
        { x: -cushionLength_fromCentre, y: 0 }], //left-top
        cushionOptions);
    // Left cushion
    cushionL = Bodies.fromVertices(cushionLeftX, cushionSideY,
        [{x: cushionHeight, y: -cushionLength_fromCentre }, //left-bottom
        { x: cushionHeight, y: 500 / 5 - 25 }, //right-bottom
        { x: 0, y: 500 / 5 - 2.5 }, //right-top
        { x: 0, y: -cushionLength_fromCentre - 22.5 }], //left-top
        cushionOptions);
    // To add them to the world
    World.add(engine.world, [cushionTL, cushionTR, cushionR, cushionBR, cushionBL, cushionL]);
}

function drawCushion()
{
    push();
    fill(56, 88, 11);
    drawVertices(cushionTL.vertices); // Top-Left cushion
    drawVertices(cushionTR.vertices); // Top-Right cushion
    drawVertices(cushionR.vertices); // Right cushion
    drawVertices(cushionBR.vertices); // Bottom-Right cushion
    drawVertices(cushionBL.vertices); // Bottom-Left cushion
    drawVertices(cushionL.vertices); // Left cushion
    pop();
}