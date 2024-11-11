class Man {
  constructor(x, y) {
    this.leftFoot = { x: x - 30, y: y + 170, fixed: true };
    this.rightFoot = { x: x + 30, y: y + 170, fixed: true };
    this.head = { x: x, y: y, fixed: true };

    this.controlPoint = { x: x, y: y + 50, fixed: false };

    this.leftKnee = { x: x - 20, y: y + 50 };
    this.rightKnee = { x: x + 20, y: y + 50 };

    this.legSegmentLength = 40;
    this.maxStretch = 2.5;
    this.minDistance = 20;
  }

  calculateJointPosition(fixed1, fixed2, baseLength, t = 0.5) {
    let dx = fixed2.x - fixed1.x;
    let dy = fixed2.y - fixed1.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.minDistance) {
      distance = this.minDistance;
    }

    let h = Math.sqrt(Math.pow(baseLength, 2) - Math.pow(distance / 2, 2));

    if (isNaN(h)) {
      h = 0;
    }

    let mx = fixed1.x + dx * t;
    let my = fixed1.y + dy * t;

    let nx = -dy / distance;
    let ny = dx / distance;

    return {
      x: mx + nx * h,
      y: my + ny * h,
    };
  }

  constrainPoint(px, py, anchorX, anchorY, maxDist) {
    let dx = px - anchorX;
    let dy = py - anchorY;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > maxDist) {
      let angle = Math.atan2(dy, dx);
      return {
        x: anchorX + Math.cos(angle) * maxDist,
        y: anchorY + Math.sin(angle) * maxDist,
      };
    }

    return { x: px, y: py };
  }
  update(mouseX, mouseY) {
    let maxDistance = this.legSegmentLength * 2 * this.maxStretch;

    let constrainedFromHead = this.constrainPoint(
      mouseX,
      mouseY,
      this.head.x,
      this.head.y,
      maxDistance
    );
    let constrainedFromLeftFoot = this.constrainPoint(
      constrainedFromHead.x,
      constrainedFromHead.y,
      this.leftFoot.x,
      this.leftFoot.y,
      maxDistance
    );
    let constrainedFromRightFoot = this.constrainPoint(
      constrainedFromLeftFoot.x,
      constrainedFromLeftFoot.y,
      this.rightFoot.x,
      this.rightFoot.y,
      maxDistance
    );

    this.controlPoint.x = constrainedFromRightFoot.x;
    this.controlPoint.y = constrainedFromRightFoot.y;

    let leftKneePos = this.calculateJointPosition(
      this.leftFoot,
      this.controlPoint,
      this.legSegmentLength * 1.2,
      0.5
    );

    let rightKneePos = this.calculateJointPosition(
      this.rightFoot,
      this.controlPoint,
      this.legSegmentLength * 1.2,
      0.5
    );

    if (!isNaN(leftKneePos.x) && !isNaN(leftKneePos.y)) {
      this.leftKnee = leftKneePos;
    }
    if (!isNaN(rightKneePos.x) && !isNaN(rightKneePos.y)) {
      this.rightKnee = rightKneePos;
    }
  }

  draw() {
    stroke(0);
    strokeWeight(5);

    line(this.leftFoot.x, this.leftFoot.y, this.leftKnee.x, this.leftKnee.y);
    line(
      this.leftKnee.x,
      this.leftKnee.y,
      this.controlPoint.x,
      this.controlPoint.y
    );

    line(
      this.rightFoot.x,
      this.rightFoot.y,
      this.rightKnee.x,
      this.rightKnee.y
    );
    line(
      this.rightKnee.x,
      this.rightKnee.y,
      this.controlPoint.x,
      this.controlPoint.y
    );

    line(this.head.x, this.head.y, this.controlPoint.x, this.controlPoint.y);

    line(this.head.x, this.head.y, this.head.x + 70, this.head.y + 40);
    line(this.head.x + 70, this.head.y + 40, this.head.x + 50, this.head.y);

    line(this.head.x, this.head.y, this.head.x - 70, this.head.y + 40);
    line(this.head.x - 70, this.head.y + 40, this.head.x - 50, this.head.y);

    // strokeWeight(8);

    // stroke(0, 255, 0);
    // point(this.leftFoot.x, this.leftFoot.y);
    // point(this.rightFoot.x, this.rightFoot.y);
    // point(this.head.x, this.head.y);

    noStroke();
    fill(0);
    circle(this.head.x, this.head.y - 25, 50);

    // stroke(255, 0, 0);
    // point(this.controlPoint.x, this.controlPoint.y);

    // stroke(255, 255, 0);
    // point(this.leftKnee.x, this.leftKnee.y);
    // point(this.rightKnee.x, this.rightKnee.y);
  }
}

let man;

function setup() {
  createCanvas(600, 400);
  man = new Man(width / 2, height / 2 - 50);
}

function draw() {
  background(220);
  man.update(mouseX, mouseY);
  man.draw();
}
