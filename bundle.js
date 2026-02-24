const GAME_WIDTH = 1600;
const GAME_HEIGHT = 900;
class Keydown {
  constructor() {
    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;
    this.debug = false;
    this.enter = false;
  }
}
class KeyboardCollector {
  constructor() {
    this.left = 0;
    this.right = 0;
    this.up = 0;
    this.down = 0;
    this.debug = 0;
    this.enter = 0;
  }
}
const _InputHandler = class _InputHandler {
  constructor(mode) {
    this.keyboardUsed = false;
    this.collectedKeys = new KeyboardCollector();
    this.keysDown = new Keydown();
    this.firstPress = new Keydown();
    this.killedPress = new Keydown();
    this.firstPressCapture = new Keydown();
    this.killedPressCapture = new Keydown();
    this.gameRecords = null;
    this.frameCount = 0;
    this.recordCompletion = -1;
    this.firstRecordLine = 0;
    this.firstRecordLineCount = 0;
    this.onMouseUp = (e) => {
    };
    this.onMouseDown = (e) => {
    };
    this.onMouseMove = (e) => {
    };
    this.onScroll = (e) => {
    };
    this.onKeydown = (event) => {
      const e = event;
      const control = this.keyMap[e.code];
      if (control) {
        this.applyKeydown(control);
      }
    };
    this.onKeyup = (event) => {
      const e = event;
      const control = this.keyMap[e.code];
      if (control) {
        this.applyKeyup(control);
      }
    };
    this.onButtonTouchStart = (control, element) => {
      element.classList.add("high");
      if (control === "special") {
        return;
      }
      switch (this.collectedKeys[control]) {
        case 0:
          this.collectedKeys[control] = 1;
          break;
        case 1:
          break;
        case 2:
          this.collectedKeys[control] = 4;
          break;
        case 3:
          this.collectedKeys[control] = 4;
          break;
        case 4:
          this.collectedKeys[control] = 4;
          break;
      }
    };
    this.onButtonTouchEnd = (control, element) => {
      element.classList.remove("high");
      if (control === "special") {
        return;
      }
      switch (this.collectedKeys[control]) {
        case 0:
          this.collectedKeys[control] = 2;
          break;
        case 1:
          this.collectedKeys[control] = 3;
          break;
        case 2:
          break;
        case 3:
          this.collectedKeys[control] = 3;
          break;
        case 4:
          this.collectedKeys[control] = 3;
          break;
      }
    };
    this.keyMap = _InputHandler.KEYBOARDS[mode];
  }
  applyKeydown(control) {
    switch (this.collectedKeys[control]) {
      case 0:
        this.collectedKeys[control] = 1;
        break;
      case 1:
        break;
      case 2:
        this.collectedKeys[control] = 4;
        break;
      case 3:
        this.collectedKeys[control] = 4;
        break;
      case 4:
        this.collectedKeys[control] = 4;
        break;
    }
  }
  applyKeyup(control) {
    switch (this.collectedKeys[control]) {
      case 0:
        this.collectedKeys[control] = 2;
        break;
      case 1:
        this.collectedKeys[control] = 3;
        break;
      case 2:
        break;
      case 3:
        this.collectedKeys[control] = 3;
        break;
      case 4:
        this.collectedKeys[control] = 3;
        break;
    }
  }
  startListeners(target) {
    target.addEventListener("keydown", this.onKeydown);
    target.addEventListener("keyup", this.onKeyup);
    this.keyboardUsed = true;
    target.addEventListener("mouseup", (e) => {
      this.onMouseUp(e);
    });
    target.addEventListener("mousedown", (e) => {
      this.onMouseDown(e);
    });
    target.addEventListener("mousemove", (e) => {
      this.onMouseMove(e);
    });
    target.addEventListener("wheel", (e) => {
      const we = e;
      if (we.ctrlKey) {
        we.preventDefault();
      }
      this.onScroll(we);
    }, { passive: false });
  }
  removeListeners(target) {
    if (this.keyboardUsed) {
      target.removeEventListener("keydown", this.onKeydown);
      target.removeEventListener("keyup", this.onKeyup);
    }
  }
  update() {
    for (const control of _InputHandler.CONTROLS) {
      this.play(control, this.collectedKeys[control]);
      this.collectedKeys[control] = 0;
    }
  }
  play(control, action) {
    switch (action) {
      case 0:
        this.firstPress[control] = false;
        this.killedPress[control] = false;
        break;
      case 1:
        if (this.keysDown[control]) {
          this.firstPress[control] = false;
        } else {
          this.firstPress[control] = true;
          this.keysDown[control] = true;
        }
        this.killedPress[control] = false;
        break;
      case 2:
        if (this.keysDown[control]) {
          this.firstPress[control] = false;
          this.keysDown[control] = false;
          this.killedPress[control] = true;
        } else {
          this.firstPress[control] = false;
          this.killedPress[control] = false;
        }
        break;
      case 3:
        if (this.keysDown[control]) {
          this.firstPress[control] = false;
          this.keysDown[control] = false;
        } else {
          this.firstPress[control] = true;
        }
        this.killedPress[control] = true;
        break;
      case 4:
        if (this.keysDown[control]) {
          this.firstPress[control] = false;
          this.keysDown[control] = false;
          this.killedPress[control] = true;
        } else {
          this.firstPress[control] = false;
          this.killedPress[control] = false;
        }
        if (this.keysDown[control]) {
          this.firstPress[control] = false;
        } else {
          this.firstPress[control] = true;
          this.keysDown[control] = true;
        }
        this.killedPress[control] = false;
        break;
    }
  }
  press(control) {
    return this.firstPress[control] || this.keysDown[control];
  }
  first(control) {
    return this.firstPress[control];
  }
  killed(control) {
    return this.killedPress[control];
  }
  kill(control, removeFirstPress = false) {
    this.keysDown[control] = false;
    if (removeFirstPress) {
      this.firstPress[control] = false;
    }
  }
};
_InputHandler.CONTROLS = ["left", "right", "up", "down", "debug", "enter"];
_InputHandler.CONTROL_STACK_SIZE = 256;
_InputHandler.KEYBOARDS = {
  zqsd: {
    KeyZ: "up",
    KeyQ: "left",
    KeyS: "down",
    KeyD: "right",
    KeyP: "debug",
    Space: "up",
    ArrowUp: "up",
    ArrowLeft: "left",
    ArrowDown: "down",
    ArrowRight: "right",
    Enter: "enter"
  },
  wasd: {
    KeyW: "up",
    KeyA: "left",
    KeyS: "down",
    KeyD: "right",
    KeyP: "debug",
    Space: "up",
    ArrowUp: "up",
    ArrowLeft: "left",
    ArrowDown: "down",
    ArrowRight: "right",
    Enter: "enter"
  }
};
let InputHandler = _InputHandler;
class GameState {
}
var states;
((states2) => {
  class Home extends GameState {
    enter(data, input) {
      input.onMouseUp = (e) => {
      };
      input.onMouseDown = (e) => {
      };
      input.onMouseMove = (e) => {
      };
      input.onScroll = (e) => {
      };
    }
    frame(game) {
      return null;
    }
    draw(args) {
    }
    exit() {
    }
    getCamera() {
      return null;
    }
  }
  states2.Home = Home;
})(states || (states = {}));
function modulo(a, n) {
  return (a % n + n) % n;
}
var Direction = /* @__PURE__ */ ((Direction2) => {
  Direction2[Direction2["RIGHT"] = 0] = "RIGHT";
  Direction2[Direction2["UP"] = 1] = "UP";
  Direction2[Direction2["LEFT"] = 2] = "LEFT";
  Direction2[Direction2["DOWN"] = 3] = "DOWN";
  return Direction2;
})(Direction || {});
function rotateDirectionToLeft(dir) {
  switch (dir) {
    case 0:
      return 1;
    case 1:
      return 2;
    case 2:
      return 3;
    case 3:
      return 0;
  }
}
function rotateDirectionToRight(dir) {
  switch (dir) {
    case 0:
      return 3;
    case 3:
      return 2;
    case 2:
      return 1;
    case 1:
      return 0;
  }
}
function opposeDirection(dir) {
  switch (dir) {
    case 0:
      return 2;
    case 1:
      return 3;
    case 2:
      return 0;
    case 3:
      return 1;
  }
}
function getAttach(direction, rotatingToRight, step) {
  step = Math.max(0, Math.min(1, step));
  let cx = 0, cy = 0;
  let startAngle = 0;
  let endAngle = 0;
  const radius = 0.5;
  switch (direction) {
    case 1:
      if (rotatingToRight) {
        cx = 1;
        cy = 1;
        startAngle = Math.PI;
        endAngle = 3 * Math.PI / 2;
      } else {
        cx = 0;
        cy = 1;
        startAngle = 0;
        endAngle = -Math.PI / 2;
      }
      break;
    case 0:
      if (rotatingToRight) {
        cx = 0;
        cy = 1;
        startAngle = -Math.PI / 2;
        endAngle = 0;
      } else {
        cx = 0;
        cy = 0;
        startAngle = Math.PI / 2;
        endAngle = 0;
      }
      break;
    case 3:
      if (rotatingToRight) {
        cx = 0;
        cy = 0;
        startAngle = 0;
        endAngle = Math.PI / 2;
      } else {
        cx = 1;
        cy = 0;
        startAngle = Math.PI;
        endAngle = Math.PI / 2;
      }
      break;
    case 2:
      if (rotatingToRight) {
        cx = 1;
        cy = 0;
        startAngle = Math.PI / 2;
        endAngle = Math.PI;
      } else {
        cx = 1;
        cy = 1;
        startAngle = 3 * Math.PI / 2;
        endAngle = Math.PI;
      }
      break;
  }
  const angle = startAngle + (endAngle - startAngle) * step;
  console.log(cy, angle);
  const x = cx + radius * Math.cos(angle);
  const y = cy + radius * Math.sin(angle);
  return { x, y };
}
function getDirectionDelta(direction) {
  let x = 0;
  let y = 0;
  switch (direction) {
    case 0:
      x = 1;
      break;
    case 1:
      y = -1;
      break;
    case 2:
      x = -1;
      break;
    case 3:
      y = 1;
      break;
  }
  return { x, y };
}
function getCellDist(direction, x, y) {
  let realMove;
  switch (direction) {
    case 0:
      realMove = modulo(x, 1);
      break;
    case 1:
      realMove = 1 - modulo(y, 1);
      break;
    case 2:
      realMove = 1 - modulo(x, 1);
      break;
    case 3:
      realMove = modulo(y, 1);
      break;
  }
  return realMove;
}
var roadtypes;
((roadtypes2) => {
  ((types2) => {
    types2[types2["VOID"] = 0] = "VOID";
    types2[types2["ROAD"] = 1] = "ROAD";
    types2[types2["TURN"] = 2] = "TURN";
    types2[types2["PRIORITY"] = 3] = "PRIORITY";
    types2[types2["SPAWNER"] = 4] = "SPAWNER";
    types2[types2["CONSUMER"] = 5] = "CONSUMER";
    types2[types2["FINAL"] = 6] = "FINAL";
  })(roadtypes2.types || (roadtypes2.types = {}));
  ((TurnDirection2) => {
    TurnDirection2[TurnDirection2["FRONT"] = 0] = "FRONT";
    TurnDirection2[TurnDirection2["RIGHT"] = 1] = "RIGHT";
    TurnDirection2[TurnDirection2["LEFT"] = 2] = "LEFT";
    TurnDirection2[TurnDirection2["FRONT_RIGHT"] = 3] = "FRONT_RIGHT";
    TurnDirection2[TurnDirection2["FRONT_LEFT"] = 4] = "FRONT_LEFT";
    TurnDirection2[TurnDirection2["LEFT_AND_RIGHT"] = 5] = "LEFT_AND_RIGHT";
    TurnDirection2[TurnDirection2["ALL"] = 6] = "ALL";
    TurnDirection2[TurnDirection2["BACK"] = 7] = "BACK";
    TurnDirection2[TurnDirection2["LENGTH"] = 8] = "LENGTH";
  })(roadtypes2.TurnDirection || (roadtypes2.TurnDirection = {}));
  function generateExtraData(road) {
    switch (road & 7) {
      case 0:
        return null;
      case 1:
        return null;
      case 2:
        return null;
      default:
        throw new Error("Invalid road type");
    }
  }
  roadtypes2.generateExtraData = generateExtraData;
  function draw(ctx, iloader, road) {
    function drawImage(name, angle, flip = { x: false, y: false }) {
      ctx.save();
      ctx.translate(0.5, 0.5);
      ctx.rotate(-angle);
      ctx.scale(flip.x ? -1 : 1, flip.y ? -1 : 1);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(iloader.get(name), -0.5, -0.5, 1, 1);
      ctx.restore();
    }
    switch (road & 7) {
      case 0:
        return;
      case 1: {
        ctx.fillStyle = "#877";
        ctx.fillRect(0, 0, 1, 1);
        return;
      }
      case 2: {
        const type = road >> 3 & 7;
        const direction = Math.PI / 2 * (road >> 6 & 3);
        switch (type) {
          case 0:
            drawImage("turn_front", direction);
            break;
          case 1:
            drawImage("turn_turn", direction);
            break;
          case 2:
            drawImage("turn_turn", direction, { x: false, y: true });
            break;
          case 3:
            drawImage("turn_select", direction);
            break;
          case 4:
            drawImage("turn_select", direction, { x: false, y: true });
            break;
          case 5:
            drawImage("turn_full", direction);
            break;
          case 6:
            drawImage("turn_all", direction);
            break;
          case 7:
            drawImage("", direction);
            break;
        }
        return;
      }
      case 3: {
        const direction = Math.PI / 2 * (road >> 6 & 3);
        drawImage("yield", direction);
        break;
      }
      case 4: {
        drawImage("", 0);
        break;
      }
      case 5: {
        drawImage("", 0);
        break;
      }
      default:
        throw new Error("Invalid road type");
    }
  }
  roadtypes2.draw = draw;
  function onRightClick(road) {
    switch (road & 7) {
      case 0:
      case 1:
        return road;
      case 2:
      case 3: {
        let dir = road >> 6 & 3;
        dir++;
        dir &= 3;
        road = road & -193 | dir << 6;
        return road;
      }
      default:
        return road;
    }
  }
  roadtypes2.onRightClick = onRightClick;
  function onScroll(road, delta) {
    switch (road & 7) {
      case 0:
      case 1:
        return null;
      case 2: {
        let type = road >> 3 & 7;
        if (delta > 0) {
          type--;
          if (type < 0) {
            type = 8 - 1;
          }
        } else {
          type++;
          if (type >= 8) {
            type = 0;
          }
        }
        road = road & -57 | type << 3;
        return road;
      }
      default:
        return 0;
    }
  }
  roadtypes2.onScroll = onScroll;
})(roadtypes || (roadtypes = {}));
const CAR_SIZE = 0.76;
const RENDER_DISTANCE = 16;
let nextCarId = 0;
const colors = [
  "red",
  "yellow",
  "green",
  "blue"
];
class Car {
  constructor(x, y, direction, color) {
    this.acceleration = 2e-3;
    this.deceleration = 5e-3;
    this.speedLimit = 0.1;
    this.speed = this.speedLimit;
    this.nextSpeed = this.speedLimit;
    this.rotationStep = -1;
    this.rotatingToRight = false;
    this.frameLastPositionUpdate = -1;
    this.alive = true;
    this.id = nextCarId++;
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.color = color;
    this.lastBlockX = Math.floor(x);
    this.lastBlockY = Math.floor(y);
  }
  draw(ctx, road) {
    ctx.save();
    ctx.fillStyle = colors[modulo(this.id, colors.length)];
    let x;
    let y;
    switch (road & 7) {
      case roadtypes.types.VOID:
      case roadtypes.types.ROAD:
        x = this.x;
        y = this.y;
        break;
      case roadtypes.types.TURN: {
        if (this.rotationStep >= 0) {
          const m = getAttach(this.direction, this.rotatingToRight, this.rotationStep);
          x = Math.floor(this.x) + m.x;
          y = Math.floor(this.y) + m.y;
        } else {
          x = this.x;
          y = this.y;
        }
        break;
      }
      default:
        x = this.x;
        y = this.y;
    }
    ctx.fillRect(x - CAR_SIZE / 2, y - CAR_SIZE / 2, CAR_SIZE, CAR_SIZE);
    ctx.restore();
  }
  behave(road, game) {
    let speedTarget = this.speedLimit;
    let kill = false;
    const px = Math.floor(this.x);
    const py = Math.floor(this.y);
    if (px != this.lastBlockX || py != this.lastBlockY) {
      this.rotationStep = -1;
      switch (road & 7) {
        case roadtypes.types.VOID:
        case roadtypes.types.ROAD:
        case roadtypes.types.PRIORITY:
        case roadtypes.types.SPAWNER:
          break;
        case roadtypes.types.TURN: {
          const direction = road >> 6 & 3;
          if (this.direction !== direction)
            break;
          const type = road >> 3 & 7;
          switch (type) {
            case roadtypes.TurnDirection.FRONT:
              break;
            case roadtypes.TurnDirection.RIGHT:
              this.rotatingToRight = true;
              this.rotationStep = 0;
              break;
            case roadtypes.TurnDirection.LEFT:
              this.rotatingToRight = false;
              this.rotationStep = 0;
              break;
            case roadtypes.TurnDirection.FRONT_RIGHT:
              if (game.frameCount % 2) {
                this.rotatingToRight = true;
                this.rotationStep = 0;
              }
              break;
            case roadtypes.TurnDirection.FRONT_LEFT:
              if (game.frameCount % 2) {
                this.rotatingToRight = false;
                this.rotationStep = 0;
              }
              break;
            case roadtypes.TurnDirection.LEFT_AND_RIGHT:
              if (game.frameCount % 2) {
                this.rotatingToRight = true;
                this.rotationStep = 0;
              } else {
                this.rotatingToRight = false;
                this.rotationStep = 0;
              }
              break;
            case roadtypes.TurnDirection.ALL:
              switch (game.frameCount % 3) {
                case 0:
                  this.rotatingToRight = true;
                  this.rotationStep = 0;
                  break;
                case 1:
                  this.rotatingToRight = false;
                  this.rotationStep = 0;
                  break;
              }
              break;
            case roadtypes.TurnDirection.BACK:
              break;
            case roadtypes.TurnDirection.LENGTH:
              break;
          }
          break;
        }
        case roadtypes.types.CONSUMER: {
          const color = road >> 3;
          if (this.color === color) {
            kill = true;
          }
          break;
        }
      }
      this.lastBlockX = px;
      this.lastBlockY = py;
    }
    switch (road & 7) {
      case roadtypes.types.VOID: {
        speedTarget = 0;
        break;
      }
      case roadtypes.types.ROAD:
      case roadtypes.types.PRIORITY:
      case roadtypes.types.SPAWNER:
      case roadtypes.types.CONSUMER: {
        const speed2 = game.chunkMap.getDanger(this, RENDER_DISTANCE);
        if (speed2.lim < speedTarget)
          speedTarget = speed2.lim;
        if (speed2.fast > speedTarget && speed2.slow < speedTarget) {
          speedTarget = speed2.slow;
        }
        break;
      }
      case roadtypes.types.TURN: {
        break;
      }
    }
    let speed = this.speed;
    if (speed < speedTarget) {
      speed += this.acceleration;
      if (speed > speedTarget) {
        speed = speedTarget;
      }
    } else if (speed > speedTarget) {
      speed = speedTarget;
    }
    this.nextSpeed = speed;
    return kill;
  }
  move(road) {
    this.speed = this.nextSpeed;
    const basicMove = () => {
      switch (this.direction) {
        case Direction.RIGHT:
          this.x += this.speed;
          break;
        case Direction.UP:
          this.y -= this.speed;
          break;
        case Direction.LEFT:
          this.x -= this.speed;
          break;
        case Direction.DOWN:
          this.y += this.speed;
          break;
      }
    };
    switch (road & 7) {
      case roadtypes.types.VOID:
        return;
      case roadtypes.types.ROAD:
      case roadtypes.types.PRIORITY:
      case roadtypes.types.SPAWNER:
      case roadtypes.types.CONSUMER:
        basicMove();
        return;
      case roadtypes.types.TURN: {
        if (this.rotationStep < 0) {
          basicMove();
          return;
        }
        this.rotationStep += this.speed;
        if (this.rotationStep >= 1) {
          const nextDir = this.rotatingToRight ? rotateDirectionToRight(this.direction) : rotateDirectionToLeft(this.direction);
          let dx;
          let dy;
          switch (nextDir) {
            case Direction.RIGHT:
              dx = 1.01;
              dy = 0.5;
              break;
            case Direction.UP:
              dx = 0.5;
              dy = -0.01;
              break;
            case Direction.LEFT:
              dx = -0.01;
              dy = 0.5;
              break;
            case Direction.DOWN:
              dx = 0.5;
              dy = 1.01;
              break;
          }
          this.x = Math.floor(this.x) + dx;
          this.y = Math.floor(this.y) + dy;
          this.direction = nextDir;
        }
        return;
      }
    }
  }
}
class HoleArray {
  constructor() {
    this.items = Array(32).fill(null);
  }
  get(idx) {
    if (idx < 0 || idx >= this.items.length) {
      throw new Error("Index out of bounds");
    }
    return this.items[idx];
  }
  append(obj) {
    const idx = this.items.findIndex((item) => item === null);
    if (idx === -1) {
      throw new Error("Array is full");
    }
    this.items[idx] = obj;
    return idx;
  }
  pop(obj) {
    const idx = this.items.findIndex((item) => item === obj);
    if (idx === -1) return -1;
    this.items[idx] = null;
    return idx;
  }
  remove(idx) {
    this.items[idx] = null;
  }
  *[Symbol.iterator]() {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (item !== null) yield [i, item];
    }
  }
}
const _Chunk = class _Chunk {
  constructor(x, y) {
    this.nextCarSlot = 0;
    this.cars = Array(254).fill(null).map(() => []);
    this.grid = new Uint8Array(_Chunk.SIZE * _Chunk.SIZE);
    this.carGrid = new Uint8Array(_Chunk.SIZE * _Chunk.SIZE).fill(255);
    this.carSpawners = new HoleArray();
    this.x = x;
    this.y = y;
  }
  static getIdx(x, y) {
    return y * _Chunk.SIZE + x;
  }
  getRoad(x, y) {
    const road = this.grid[_Chunk.getIdx(x, y)];
    return road;
  }
  setRoad(x, y, road) {
    const idx = _Chunk.getIdx(x, y);
    this.grid[idx] = road;
  }
  drawGrid(ctx, iloader) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, _Chunk.SIZE, _Chunk.SIZE);
    this.x * _Chunk.SIZE;
    this.y * _Chunk.SIZE;
    for (let y = 0; y < _Chunk.SIZE; y++) {
      for (let x = 0; x < _Chunk.SIZE; x++) {
        ctx.save();
        ctx.translate(x, y);
        const obj = this.getRoad(x, y);
        roadtypes.draw(ctx, iloader, obj);
        ctx.restore();
      }
    }
  }
  drawCars(ctx) {
    for (const car of this.iterateCars()) {
      const x = modulo(Math.floor(car.x), _Chunk.SIZE);
      const y = modulo(Math.floor(car.y), _Chunk.SIZE);
      const road = this.getRoad(x, y);
      car.draw(ctx, road);
    }
  }
  runEvents() {
    for (const [idx, spawner] of this.carSpawners) {
      spawner.couldown--;
      if (spawner.couldown <= 0) {
        const car = new Car(
          this.x * _Chunk.SIZE + spawner.x + 0.5,
          this.y * _Chunk.SIZE + spawner.y + 0.5,
          spawner.direction,
          spawner.color
        );
        if (this.appendCar(car, spawner.x, spawner.y)) {
          spawner.count--;
          if (spawner.count <= 0) {
            this.carSpawners.remove(idx);
          }
        }
        spawner.couldown += spawner.rythm;
      }
    }
  }
  appendCarSpawner(spawner) {
    const idx = this.carSpawners.append(spawner);
    const road = roadtypes.types.SPAWNER | idx << 3;
    this.setRoad(spawner.x, spawner.y, road);
  }
  *iterateCars() {
    for (const car of this.cars) {
      yield* car;
    }
  }
  appendCar(car, x, y) {
    const idx = y * _Chunk.SIZE + x;
    if (this.carGrid[idx] !== 255) {
      console.warn("Failed to push car");
      return false;
    }
    this.carGrid[idx] = this.nextCarSlot;
    this.cars[this.nextCarSlot].push(car);
    this.nextCarSlot++;
    if (this.nextCarSlot >= 254)
      this.nextCarSlot = 0;
    return true;
  }
  updateCarGrid(carsToMove, frameCount) {
    this.carGrid.fill(255);
    for (let id = 0; id < 254; id++) {
      const cars = this.cars[id];
      for (let i = cars.length - 1; i >= 0; i--) {
        const car = cars[i];
        if (car.frameLastPositionUpdate === frameCount)
          continue;
        if (!car.alive) {
          cars.splice(i, 1);
        }
        const cx = Math.floor(car.x / _Chunk.SIZE);
        const cy = Math.floor(car.y / _Chunk.SIZE);
        if (cx !== this.x || cy !== this.y) {
          cars.splice(i, 1);
          carsToMove.push(car);
          continue;
        }
        const x = modulo(Math.floor(car.x), _Chunk.SIZE);
        const y = modulo(Math.floor(car.y), _Chunk.SIZE);
        const idx = y * _Chunk.SIZE + x;
        if (this.carGrid[idx] !== 255) {
          this.carGrid[idx] = 254;
        } else {
          this.carGrid[idx] = id;
        }
        car.frameLastPositionUpdate = frameCount;
      }
    }
  }
  getCar(x, y) {
    const idx = this.carGrid[y * _Chunk.SIZE + x];
    if (idx === 255)
      return "empty";
    if (idx === 254)
      return "full";
    for (const car of this.cars[idx]) {
      const carX = modulo(Math.floor(car.x), _Chunk.SIZE);
      const carY = modulo(Math.floor(car.y), _Chunk.SIZE);
      if (carX === x && carY === y)
        return car;
    }
    return "empty";
  }
};
_Chunk.SIZE = 64;
let Chunk = _Chunk;
function produceChunkKey(x, y) {
  return x << 16 ^ y;
}
class ChunkMap {
  constructor() {
    this.chunks = /* @__PURE__ */ new Map();
  }
  static getPoint(x, y) {
    const cx = Math.floor(x / Chunk.SIZE);
    const cy = Math.floor(x / Chunk.SIZE);
    const rx = modulo(Math.floor(x), Chunk.SIZE);
    const ry = modulo(Math.floor(y), Chunk.SIZE);
    return { cx, cy, rx, ry };
  }
  getChunk(x, y) {
    const key = produceChunkKey(x, y);
    const chunk = this.chunks.get(key);
    if (chunk)
      return chunk;
    const newChunk = new Chunk(x, y);
    this.chunks.set(key, newChunk);
    return newChunk;
  }
  tryGetChunk(x, y) {
    return this.chunks.get(produceChunkKey(x, y));
  }
  [Symbol.iterator]() {
    return this.chunks[Symbol.iterator]();
  }
  *iterateCars() {
    for (const [_, chunk] of this.chunks)
      for (const car of chunk.iterateCars())
        yield { car, chunk };
  }
  getRoad(x, y) {
    const p = ChunkMap.getPoint(x, y);
    const c = this.getChunk(p.cx, p.cy);
    return c.getRoad(p.rx, p.ry);
  }
  setRoad(x, y, road) {
    const p = ChunkMap.getPoint(x, y);
    const c = this.getChunk(p.cx, p.cy);
    c.setRoad(p.rx, p.ry, road);
  }
  getPathLength(ox, oy, dir, lim) {
    const d = getDirectionDelta(dir);
    const oppositeDir = opposeDirection(dir);
    let stop = false;
    for (let length = 1; length < lim; length++) {
      const road = this.getRoad(ox + d.x * length, oy + d.y * length);
      switch (road & 7) {
        case roadtypes.types.VOID:
          stop = true;
          break;
        case roadtypes.types.PRIORITY:
          if (road >> 6 !== oppositeDir) {
            stop = true;
          }
          break;
      }
      if (stop) {
        return length - 1;
      }
    }
    return lim;
  }
  movePosition(p, d) {
    p.x += d.x;
    p.y += d.y;
    if (p.x >= Chunk.SIZE) {
      p.x -= Chunk.SIZE;
      p.cx++;
      p.chunk = this.getChunk(p.cx, p.cy);
    }
    if (p.y >= Chunk.SIZE) {
      p.y -= Chunk.SIZE;
      p.cy++;
      p.chunk = this.getChunk(p.cx, p.cy);
    }
    if (p.x < 0) {
      p.x += Chunk.SIZE;
      p.cx--;
      p.chunk = this.getChunk(p.cx, p.cy);
    }
    if (p.y < 0) {
      p.y += Chunk.SIZE;
      p.cy--;
      p.chunk = this.getChunk(p.cx, p.cy);
    }
  }
  getDanger(car, range) {
    let finalSpeed = Infinity;
    const CAR_PASSAGE_LENGTH = 1 + CAR_SIZE / 2;
    1 / car.speed;
    function limSpeed(lim) {
      if (lim < finalSpeed)
        finalSpeed = lim;
    }
    function limDist(dist) {
      let d2 = car.deceleration * dist;
      if (d2 >= 0)
        d2 = Math.sqrt(d2);
      limSpeed(d2);
    }
    const realMove = getCellDist(car.direction, car.x, car.y);
    const d = getDirectionDelta(car.direction);
    const rdir = rotateDirectionToRight(car.direction);
    const ldir = rotateDirectionToLeft(car.direction);
    const rd = getDirectionDelta(rdir);
    const ld = getDirectionDelta(ldir);
    const rop = opposeDirection(rdir);
    const lop = opposeDirection(ldir);
    const initX = Math.floor(car.x / Chunk.SIZE);
    const initY = Math.floor(car.y / Chunk.SIZE);
    const pos = {
      x: modulo(Math.floor(car.x), Chunk.SIZE),
      y: modulo(Math.floor(car.y), Chunk.SIZE),
      cx: initX,
      cy: initY,
      chunk: this.getChunk(initX, initY)
    };
    let fastPrioritySpeed = 0;
    let slowPrioritySpeed = Infinity;
    for (let dist = 1; dist < range; dist++) {
      this.movePosition(pos, d);
      const road = pos.chunk.getRoad(Math.floor(pos.x), Math.floor(pos.y));
      if ((road & 7) === 0) {
        limDist(dist - CAR_SIZE / 2 - realMove);
        break;
      }
      let checkRight = false;
      switch (road & 7) {
        case roadtypes.types.VOID:
          break;
        case roadtypes.types.ROAD:
          checkRight = true;
          break;
        case roadtypes.types.TURN:
          break;
        case roadtypes.types.PRIORITY:
          if (road >> 6 !== car.direction)
            break;
          checkRight = true;
          break;
        case roadtypes.types.SPAWNER:
          checkRight = true;
          break;
        case roadtypes.types.CONSUMER:
          checkRight = true;
          break;
        case roadtypes.types.FINAL:
          break;
      }
      const over = pos.chunk.getCar(Math.floor(pos.x), Math.floor(pos.y));
      if (over === "full") {
        limSpeed(0);
        break;
      }
      if (over !== "empty") {
        const carsDist = Math.max(Math.abs(over.x - car.x) + Math.abs(over.y - car.y));
        limDist(carsDist - 1);
      }
      const entryDist = Math.max(dist - realMove - CAR_SIZE / 2, 0);
      const exitDist = entryDist + CAR_PASSAGE_LENGTH;
      const runCheck = (turnDir, opDir, dir) => {
        const check = {
          x: pos.x,
          y: pos.y,
          cx: pos.cx,
          cy: pos.cy,
          chunk: pos.chunk
        };
        for (let checkDist = 1; checkDist < range; checkDist++) {
          this.movePosition(check, turnDir);
          const road2 = check.chunk.getRoad(Math.floor(check.x), Math.floor(check.y));
          let shouldBreak = false;
          switch (road2 & 7) {
            case roadtypes.types.VOID:
              shouldBreak = true;
              break;
            case roadtypes.types.ROAD:
            case roadtypes.types.TURN:
            case roadtypes.types.SPAWNER:
            case roadtypes.types.CONSUMER:
              break;
            case roadtypes.types.PRIORITY:
              if (road2 >> 6 == dir)
                shouldBreak = true;
              break;
          }
          if (shouldBreak)
            break;
          const over2 = check.chunk.getCar(Math.floor(check.x), Math.floor(check.y));
          if (over2 === "full" || over2 === "empty")
            continue;
          if (over2.direction !== opDir)
            continue;
          const over_realMove = getCellDist(over2.direction, over2.x, over2.y);
          const over_entryDist = Math.max(checkDist - over_realMove - CAR_SIZE / 2, 0);
          const over_exitDist = over_entryDist + CAR_PASSAGE_LENGTH;
          const fastSpeed = exitDist * over2.speed / over_entryDist;
          if (fastSpeed > fastPrioritySpeed)
            fastPrioritySpeed = fastSpeed;
          const slowSpeed = entryDist * over2.speed / over_exitDist;
          if (slowSpeed < slowPrioritySpeed)
            slowPrioritySpeed = slowSpeed;
          break;
        }
      };
      if (checkRight) {
        runCheck(rd, rop, rdir);
      }
      if (checkRight) {
        runCheck(ld, lop, ldir);
      }
    }
    if (fastPrioritySpeed > finalSpeed) {
      limSpeed(slowPrioritySpeed);
    }
    return {
      lim: finalSpeed,
      fast: fastPrioritySpeed,
      slow: slowPrioritySpeed
    };
  }
  updateCarGrid(frameCount) {
    const carsChangingChunk = [];
    for (let [_, chunk] of this.chunks) {
      chunk.updateCarGrid(carsChangingChunk, frameCount);
    }
    for (let car of carsChangingChunk) {
      const cx = Math.floor(car.x / Chunk.SIZE);
      const cy = Math.floor(car.y / Chunk.SIZE);
      const x = modulo(Math.floor(car.x), Chunk.SIZE);
      const y = modulo(Math.floor(car.y), Chunk.SIZE);
      const chunk = this.getChunk(cx, cy);
      chunk.appendCar(car, x, y);
    }
  }
}
var CarColor = /* @__PURE__ */ ((CarColor2) => {
  CarColor2[CarColor2["RED"] = 0] = "RED";
  CarColor2[CarColor2["BLUE"] = 1] = "BLUE";
  CarColor2[CarColor2["GREEN"] = 2] = "GREEN";
  CarColor2[CarColor2["YELLOW"] = 3] = "YELLOW";
  CarColor2[CarColor2["PURPLE"] = 4] = "PURPLE";
  CarColor2[CarColor2["CYAN"] = 5] = "CYAN";
  return CarColor2;
})(CarColor || {});
const produceKey = (x, y) => x << 16 ^ y;
class PathGraph {
  constructor(cmap) {
    this.nodes = /* @__PURE__ */ new Map();
    this.cmap = cmap;
  }
  append(x, y, dir) {
    const key = produceKey(x, y);
    const givenNode = this.nodes.get(key);
    if (givenNode) {
      return givenNode;
    }
    const road = this.cmap.getRoad(x, y);
    const moves = [];
    switch (road & 7) {
      case roadtypes.types.VOID:
        break;
      case roadtypes.types.ROAD:
      case roadtypes.types.PRIORITY:
      case roadtypes.types.SPAWNER: {
        moves.push(dir);
        break;
      }
      case roadtypes.types.TURN: {
        if ((road >> 3 & 3) != dir)
          break;
        switch (road >> 5) {
          case roadtypes.TurnDirection.FRONT:
            moves.push(dir);
            break;
          case roadtypes.TurnDirection.RIGHT:
            moves.push(rotateDirectionToRight(dir));
            break;
          case roadtypes.TurnDirection.LEFT:
            moves.push(rotateDirectionToLeft(dir));
            break;
          case roadtypes.TurnDirection.FRONT_RIGHT:
            moves.push(dir);
            moves.push(rotateDirectionToRight(dir));
            break;
          case roadtypes.TurnDirection.FRONT_LEFT:
            moves.push(dir);
            moves.push(rotateDirectionToRight(dir));
            break;
          case roadtypes.TurnDirection.LEFT_AND_RIGHT:
            moves.push(rotateDirectionToRight(dir));
            moves.push(rotateDirectionToLeft(dir));
            break;
          case roadtypes.TurnDirection.ALL:
            moves.push(rotateDirectionToRight(dir));
            moves.push(rotateDirectionToLeft(dir));
            moves.push(dir);
            break;
          case roadtypes.TurnDirection.BACK:
            break;
          case roadtypes.TurnDirection.LENGTH:
            break;
        }
      }
    }
    const node = {
      x,
      y,
      road,
      right: null,
      up: null,
      left: null,
      down: null
    };
    this.nodes.set(key, node);
    for (let dir2 of moves) {
      switch (dir2) {
        case Direction.RIGHT:
          node.right = this.append(x + 1, y, Direction.RIGHT);
          break;
        case Direction.UP:
          node.up = this.append(x, y - 1, Direction.UP);
          break;
        case Direction.LEFT:
          node.left = this.append(x - 1, y, Direction.LEFT);
          break;
        case Direction.DOWN:
          node.down = this.append(x, y + 1, Direction.DOWN);
          break;
      }
    }
    return node;
  }
  getNeighboors(x, y) {
    const arr = [];
    const node = this.nodes.get(produceKey(x, y));
    if (!node) {
      return [];
    }
    if (node.right) {
      arr.push({ x: node.right.x, y: node.right.y, dir: Direction.RIGHT });
    }
    if (node.up) {
      arr.push({ x: node.up.x, y: node.up.y, dir: Direction.UP });
    }
    if (node.left) {
      arr.push({ x: node.left.x, y: node.left.y, dir: Direction.LEFT });
    }
    if (node.down) {
      arr.push({ x: node.down.x, y: node.down.y, dir: Direction.DOWN });
    }
    return arr;
  }
}
class Game extends GameState {
  constructor() {
    super(...arguments);
    this.camera = { x: 8, y: 38, z: 80 };
    this.chunkMap = new ChunkMap();
    this.graph = new PathGraph(this.chunkMap);
    this.frameCount = 0;
  }
  test() {
    const y = 33;
    for (let i = 0; i < 50; i++) {
      this.chunkMap.setRoad(i, y + 3, roadtypes.types.ROAD);
      for (let j = 0; j < 7; j++) {
        this.chunkMap.setRoad(5 + 3 * j, y + i, roadtypes.types.ROAD);
      }
    }
    this.chunkMap.setRoad(50, y + 3, roadtypes.types.CONSUMER);
    this.chunkMap.setRoad(14, y, roadtypes.types.CONSUMER);
    const chunk = this.chunkMap.getChunk(0, 0);
    chunk.appendCarSpawner({
      x: 1,
      y: y + 3,
      color: CarColor.RED,
      rythm: 41,
      couldown: 1e6,
      direction: Direction.RIGHT,
      count: Infinity
    });
    chunk.appendCarSpawner({
      x: 14,
      y: y + 8,
      color: CarColor.RED,
      rythm: 41,
      couldown: 0,
      direction: Direction.UP,
      count: Infinity
    });
  }
  getMousePosition(mouseX, mouseY) {
    const scaleX = innerWidth / GAME_WIDTH;
    const scaleY = innerHeight / GAME_HEIGHT;
    const scale = Math.min(scaleX, scaleY);
    const offsetX = (innerWidth - GAME_WIDTH * scale) / 2;
    const offsetY = (innerHeight - GAME_HEIGHT * scale) / 2;
    let x = mouseX - offsetX;
    let y = mouseY - offsetY;
    x /= scale;
    y /= scale;
    x -= GAME_WIDTH / 2;
    y -= GAME_HEIGHT / 2;
    x /= this.camera.z;
    y /= this.camera.z;
    x += this.camera.x;
    y += this.camera.y;
    return { x, y };
  }
  enter(data, input) {
    this.test();
    let lastX = 0;
    let lastY = 0;
    input.onMouseUp = (e) => {
      const { x, y } = this.getMousePosition(e.clientX, e.clientY);
      lastX = x;
      lastY = y;
    };
    input.onMouseDown = (e) => {
      const { x, y } = this.getMousePosition(e.clientX, e.clientY);
      lastX = x;
      lastY = y;
      const leftDown = (e.buttons & 1) !== 0;
      const rightDown = (e.buttons & 2) !== 0;
      (e.buttons & 4) !== 0;
      if (leftDown) {
        if (e.shiftKey) {
          this.chunkMap.setRoad(x, y, roadtypes.types.VOID);
        } else {
          this.chunkMap.setRoad(x, y, roadtypes.types.ROAD);
        }
      }
      if (rightDown) {
        this.chunkMap.setRoad(
          x,
          y,
          roadtypes.onRightClick(this.chunkMap.getRoad(x, y))
        );
      }
    };
    input.onMouseMove = (e) => {
      let { x, y } = this.getMousePosition(e.clientX, e.clientY);
      const leftDown = (e.buttons & 1) !== 0;
      (e.buttons & 2) !== 0;
      const middleDown = (e.buttons & 4) !== 0;
      if (middleDown) {
        this.camera.x += lastX - x;
        this.camera.y += lastY - y;
        const c = this.getMousePosition(e.clientX, e.clientY);
        x = c.x;
        y = c.y;
      }
      if (leftDown) {
        if (e.shiftKey) {
          this.chunkMap.setRoad(x, y, roadtypes.types.VOID);
        } else {
          this.chunkMap.setRoad(x, y, roadtypes.types.ROAD);
        }
      }
      lastX = x;
      lastY = y;
    };
    input.onScroll = (e) => {
      let { x, y } = this.getMousePosition(e.clientX, e.clientY);
      const leftDown = (e.buttons & 1) !== 0;
      const rightDown = (e.buttons & 2) !== 0;
      (e.buttons & 4) !== 0;
      const road = this.chunkMap.getRoad(x, y);
      if (rightDown) {
        let type = (road & 7) + 1;
        if (type >= roadtypes.types.FINAL) {
          type = 1;
        }
        const nextRoad = road & -8 | type;
        this.chunkMap.setRoad(x, y, nextRoad);
        return;
      }
      const roadScroll = roadtypes.onScroll(road, e.deltaY);
      if (roadScroll) {
        this.chunkMap.setRoad(x, y, roadScroll);
      } else if (!leftDown && !rightDown) {
        this.camera.z -= this.camera.z * e.deltaY / 1e3;
      }
    };
  }
  frame(game) {
    for (let [_, chunk] of this.chunkMap) {
      chunk.runEvents();
    }
    for (let { car, chunk } of this.chunkMap.iterateCars()) {
      const x = modulo(Math.floor(car.x), Chunk.SIZE);
      const y = modulo(Math.floor(car.y), Chunk.SIZE);
      const road = chunk.getRoad(x, y);
      if (car.behave(road, this)) {
        car.alive = false;
      }
    }
    for (let { car, chunk } of this.chunkMap.iterateCars()) {
      const x = modulo(Math.floor(car.x), Chunk.SIZE);
      const y = modulo(Math.floor(car.y), Chunk.SIZE);
      const road = chunk.getRoad(x, y);
      car.move(road);
    }
    this.chunkMap.updateCarGrid(this.frameCount);
    this.frameCount++;
    return null;
  }
  drawGrid(ctx, iloader) {
    for (let [_, chunk] of this.chunkMap) {
      ctx.save();
      ctx.translate(chunk.x * Chunk.SIZE, chunk.y * Chunk.SIZE);
      chunk.drawGrid(ctx, iloader);
      ctx.restore();
    }
  }
  drawCars(ctx) {
    for (let [_, chunk] of this.chunkMap) {
      chunk.drawCars(ctx);
    }
  }
  draw(args) {
    args.followCamera();
    this.drawGrid(args.ctx, args.imageLoader);
    this.drawCars(args.ctx);
    args.unfollowCamera();
  }
  exit() {
  }
  getCamera() {
    return this.camera;
  }
}
class ImageLoader {
  constructor(pathRoot) {
    this.folders = {};
    this.loadedCount = 0;
    this.totalCount = 0;
    this.pathRoot = pathRoot;
    const size = 2;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "violet";
    ctx.fillRect(0, 0, size / 2, size / 2);
    ctx.fillRect(size / 2, size / 2, size / 2, size / 2);
    ctx.fillStyle = "white";
    ctx.fillRect(size / 2, 0, size / 2, size / 2);
    ctx.fillRect(0, size / 2, size / 2, size / 2);
    this.placeholder = canvas;
  }
  async load(foldersToLoad) {
    this.totalCount = Object.keys(foldersToLoad).length;
    this.loadedCount = 0;
    const promises = [];
    for (const [name, path] of Object.entries(foldersToLoad)) {
      const p = (async () => {
        try {
          const res = await fetch(this.pathRoot + path);
          if (!res.ok) throw new Error("Failed to fetch " + path);
          const blob = await res.blob();
          const img = await new Promise((resolve, reject) => {
            const i = new Image();
            i.onload = () => resolve(i);
            i.onerror = (e) => reject(e);
            i.src = URL.createObjectURL(blob);
          });
          if (!this.folders["default"])
            this.folders["default"] = {};
          if (!this.folders["default"][name])
            this.folders["default"][name] = [];
          this.folders["default"][name].push(img);
          this.loadedCount++;
        } catch (err) {
          console.warn("Error with:", path);
          console.error(err);
          this.loadedCount++;
        }
      })();
      promises.push(p);
    }
    await Promise.all(promises);
  }
  isLoaded() {
    return this.loadedCount === this.totalCount;
  }
  get(name) {
    const folder = this.folders["default"];
    if (folder && folder[name] && folder[name][0])
      return folder[name][0];
    return this.placeholder;
  }
  getFolders() {
    return this.folders;
  }
}
class GameHandler {
  constructor(keyboardMode, eventTarget) {
    this.imgLoader = new ImageLoader("");
    this.inputHandler = new InputHandler(keyboardMode);
    this.inputHandler.startListeners(eventTarget);
    this.state = new Game();
    this.state.enter(void 0, this.inputHandler);
    this.imgLoader.load({
      turn_all: "assets/turn/all.png",
      turn_turn: "assets/turn/turn.png",
      turn_front: "assets/turn/front.png",
      turn_select: "assets/turn/select.png",
      turn_full: "assets/turn/full.png",
      yield: "assets/yield.png"
    });
  }
  gameLogic() {
    const next = this.state.frame(this);
    if (next) {
      const data = this.state.exit();
      this.state = next;
      next.enter(data, this.inputHandler);
    }
  }
  gameDraw(ctx, canvasWidth, canvasHeight, drawMethod) {
    const scaleX = canvasWidth / GAME_WIDTH;
    const scaleY = canvasHeight / GAME_HEIGHT;
    const scale = Math.min(scaleX, scaleY);
    const offsetX = (canvasWidth - GAME_WIDTH * scale) / 2;
    const offsetY = (canvasHeight - GAME_HEIGHT * scale) / 2;
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);
    const camera = this.state.getCamera();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    const followCamera = () => {
      ctx.save();
      if (camera) {
        ctx.translate(GAME_WIDTH / 2, GAME_HEIGHT / 2);
        ctx.scale(camera.z, camera.z);
        ctx.translate(-camera.x, -camera.y);
      }
    };
    const unfollowCamera = () => {
      ctx.restore();
    };
    drawMethod(ctx, followCamera, unfollowCamera);
    ctx.restore();
    ctx.fillStyle = "black";
    if (offsetY > 0) ctx.fillRect(0, 0, canvasWidth, offsetY);
    if (offsetY > 0) ctx.fillRect(0, canvasHeight - offsetY, canvasWidth, offsetY);
    if (offsetX > 0) ctx.fillRect(0, 0, offsetX, canvasHeight);
    if (offsetX > 0) ctx.fillRect(canvasWidth - offsetX, 0, offsetX, canvasHeight);
  }
  drawMethod(ctx, followCamera, unfollowCamera) {
    this.state.draw({ ctx, imageLoader: this.imgLoader, followCamera, unfollowCamera });
  }
}
window.game = null;
window.running = false;
window.useRequestAnimationFrame = true;
window.startGame = startGame;
function startGame() {
  const FPS_FREQUENCY = 4;
  const EXCESS_COUNT = 70;
  const EXCESS_LIM = 4 * FPS_FREQUENCY;
  let countedFps = 0;
  let excessCount = 0;
  setInterval(() => {
    const e = document.getElementById("fps");
    const count = countedFps * FPS_FREQUENCY;
    if (excessCount >= 0) {
      if (count > EXCESS_COUNT) {
        excessCount++;
        if (excessCount >= EXCESS_LIM) {
          window.useRequestAnimationFrame = false;
          excessCount = -1;
        }
      } else {
        excessCount = 0;
      }
    }
    if (e) {
      let text = count + "fps";
      if (!window.useRequestAnimationFrame) {
        text += " (async)";
      }
      e.textContent = text;
    }
    countedFps = 0;
  }, 1e3 / FPS_FREQUENCY);
  const canvas = document.getElementById("gameCanvas");
  canvas.oncontextmenu = (e) => {
    e.preventDefault();
  };
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  const keyboardMode = localStorage.getItem("keyboardMode");
  let realKeyboardMode;
  if (keyboardMode !== "zqsd" && keyboardMode !== "wasd") {
    realKeyboardMode = "wasd";
  } else {
    realKeyboardMode = keyboardMode;
  }
  const canvasContext = canvas.getContext("2d");
  const game = new GameHandler(
    realKeyboardMode,
    document
  );
  function runGameLoop() {
    game.gameLogic();
    game.gameDraw(
      canvasContext,
      canvas.width,
      canvas.height,
      (ctx, followCamera, unfollowCamera) => {
        game.drawMethod(ctx, followCamera, unfollowCamera);
      }
    );
    if (window.running) {
      if (window.useRequestAnimationFrame) {
        requestAnimationFrame(runGameLoop);
      } else {
        setTimeout(runGameLoop, 1e3 / 60);
      }
    }
    countedFps++;
  }
  window.game = game;
  window.running = true;
  runGameLoop();
}
