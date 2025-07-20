function drawTable()
{
    stroke(63,37,12);
    strokeWeight(10);
    fill(81,136,39);
    rect(tableX, tableY, tableLength, tableWidth, tableCorner);
    noStroke();
}

function drawDLine()
{
    strokeWeight(1);
    stroke(255);
    // To draw the D Line
    arc(dLineX, dLineY, tableLength / 4, tableWidth / 2, HALF_PI, -HALF_PI);
    // Draw a line at the specified coordinates
    line(dLineX, tableY + 10, dLineX, tableY + tableWidth - 10);
    noStroke();
}