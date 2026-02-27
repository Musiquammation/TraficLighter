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
  hexToRgb(hex) {
    const clean = hex.replace("#", "");
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return [r, g, b];
  }
  recolorImage(img, checked, target) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0);
    const [cr, cg, cb] = this.hexToRgb(checked);
    const [tr, tg, tb] = this.hexToRgb(target);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] === cr && data[i + 1] === cg && data[i + 2] === cb) {
        data[i] = tr;
        data[i + 1] = tg;
        data[i + 2] = tb;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }
  async load(list) {
    this.totalCount = Object.keys(list).length;
    this.loadedCount = 0;
    const promises = [];
    for (const [name, path] of Object.entries(list)) {
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
  async loadWithColors(checked, colors2, list) {
    this.totalCount += Object.keys(list).length;
    const promises = [];
    for (const [name, path] of Object.entries(list)) {
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
          if (!this.folders["colored"])
            this.folders["colored"] = {};
          if (!this.folders["colored"][name])
            this.folders["colored"][name] = [];
          for (const color of colors2) {
            const recolored = this.recolorImage(img, checked, color);
            this.folders["colored"][name].push(recolored);
          }
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
  get(name, color = -1) {
    if (color >= 0) {
      const folder2 = this.folders["colored"];
      if (folder2 && folder2[name] && folder2[name][color] !== void 0)
        return folder2[name][color];
      return this.placeholder;
    }
    const folder = this.folders["default"];
    if (folder && folder[name] && folder[name][0])
      return folder[name][0];
    return this.placeholder;
  }
  getFolders() {
    return this.folders;
  }
}
var CarColor = /* @__PURE__ */ ((CarColor2) => {
  CarColor2[CarColor2["RED"] = 0] = "RED";
  CarColor2[CarColor2["YELLOW"] = 1] = "YELLOW";
  CarColor2[CarColor2["BLUE"] = 2] = "BLUE";
  CarColor2[CarColor2["CYAN"] = 3] = "CYAN";
  CarColor2[CarColor2["GREEN"] = 4] = "GREEN";
  CarColor2[CarColor2["PURPLE"] = 5] = "PURPLE";
  return CarColor2;
})(CarColor || {});
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
  const x = cx + radius * Math.cos(angle);
  const y = cy + radius * Math.sin(angle);
  return { x, y, angle };
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
var roadtypes;
((roadtypes2) => {
  ((types2) => {
    types2[types2["VOID"] = 0] = "VOID";
    types2[types2["ROAD"] = 1] = "ROAD";
    types2[types2["TURN"] = 2] = "TURN";
    types2[types2["PRIORITY"] = 3] = "PRIORITY";
    types2[types2["LIGHT"] = 4] = "LIGHT";
    types2[types2["SPAWNER"] = 5] = "SPAWNER";
    types2[types2["CONSUMER"] = 6] = "CONSUMER";
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
    function drawImage(name, angle, flip = { x: false, y: false, color: -1 }) {
      ctx.save();
      ctx.translate(0.5, 0.5);
      ctx.rotate(-angle);
      ctx.scale(flip.x ? -1 : 1, flip.y ? -1 : 1);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(iloader.get(name, flip.color), -0.5, -0.5, 1, 1);
      ctx.restore();
    }
    switch (road & 7) {
      case 0:
        if (road & 1 << 3) {
          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, 1, 1);
          return;
        }
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
            drawImage("turn_turn", direction, { x: false, y: true, color: -1 });
            break;
          case 3:
            drawImage("turn_select", direction);
            break;
          case 4:
            drawImage("turn_select", direction, { x: false, y: true, color: -1 });
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
        drawImage("yield", Math.PI / 2 * (road >> 6 & 3));
        break;
      }
      case 4: {
        drawImage(
          road & 1 << 3 ? "light_green" : "light_red",
          Math.PI / 2 * (road >> 6 & 3)
        );
        break;
      }
      case 5: {
        const color = road >> 3 & 7;
        const direction = road >> 6 & 3;
        drawImage("spawner", direction * Math.PI / 2, { x: false, y: false, color });
        break;
      }
      case 6: {
        const color = road >> 3 & 7;
        drawImage("consumer", 0, { x: false, y: false, color });
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
      case 3:
      case 4: {
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
      case 4:
        return "light";
      default:
        return 0;
    }
  }
  roadtypes2.onScroll = onScroll;
})(roadtypes || (roadtypes = {}));
const CAR_SIZE = 0.9;
const CAR_LINE = 0.6;
class GridExplorer {
  constructor(a, b, cmap) {
    if (a instanceof GridExplorer) {
      this.x = a.x;
      this.y = a.y;
      this.cx = a.cx;
      this.cy = a.cy;
      this.chunk = a.chunk;
      return;
    }
    if (typeof a === "number" && b !== void 0 && cmap) {
      const initX = Math.floor(a / Chunk.SIZE);
      const initY = Math.floor(b / Chunk.SIZE);
      this.x = modulo(Math.floor(a), Chunk.SIZE);
      this.y = modulo(Math.floor(b), Chunk.SIZE);
      this.cx = initX;
      this.cy = initY;
      this.chunk = cmap.getChunk(initX, initY);
      return;
    }
    throw new TypeError("Invalid constructor parameters");
  }
  move(d, cmap) {
    this.x += d.x;
    this.y += d.y;
    if (this.x >= Chunk.SIZE) {
      this.x -= Chunk.SIZE;
      this.cx++;
      this.chunk = cmap.getChunk(this.cx, this.cy);
    }
    if (this.y >= Chunk.SIZE) {
      this.y -= Chunk.SIZE;
      this.cy++;
      this.chunk = cmap.getChunk(this.cx, this.cy);
    }
    if (this.x < 0) {
      this.x += Chunk.SIZE;
      this.cx--;
      this.chunk = cmap.getChunk(this.cx, this.cy);
    }
    if (this.y < 0) {
      this.y += Chunk.SIZE;
      this.cy--;
      this.chunk = cmap.getChunk(this.cx, this.cy);
    }
  }
  getRoad() {
    return this.chunk.getRoad(this.x, this.y);
  }
  setRoad(road) {
    return this.chunk.setRoad(this.x, this.y, road);
  }
}
const SIZE_LIM = (3 - CAR_SIZE - CAR_LINE) / 2;
function getDanger(car, range, cmap) {
  let finalSpeed = Infinity;
  const CAR_PASSAGE_LENGTH = 1 + CAR_SIZE;
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
  let realMove = getCellDist(car.direction, car.x, car.y);
  let d = getDirectionDelta(car.direction);
  let rdir = rotateDirectionToRight(car.direction);
  let ldir = rotateDirectionToLeft(car.direction);
  let rd = getDirectionDelta(rdir);
  let ld = getDirectionDelta(ldir);
  let rop = opposeDirection(rdir);
  let lop = opposeDirection(ldir);
  const pos = new GridExplorer(car.x, car.y, cmap);
  let fastPrioritySpeed = 0;
  let fastPriorityAcceleration = Infinity;
  let slowPrioritySpeed = Infinity;
  for (let dist = 0; dist < range; dist++) {
    const road = pos.getRoad();
    let finish = false;
    let checkLeft = false;
    let checkRight = false;
    switch (road & 7) {
      case roadtypes.types.VOID:
        finish = true;
        break;
      case roadtypes.types.ROAD:
        if (dist > 0)
          checkRight = true;
        break;
      case roadtypes.types.TURN:
        break;
      case roadtypes.types.PRIORITY:
        if (road >> 6 !== car.direction)
          break;
        checkRight = true;
        checkLeft = true;
        break;
      case roadtypes.types.SPAWNER:
        checkRight = true;
        break;
      case roadtypes.types.CONSUMER:
        checkRight = true;
        break;
      case roadtypes.types.LIGHT:
        if (road >> 6 === car.direction && (road & 1 << 3) === 0)
          finish = true;
        checkRight = true;
        break;
    }
    if (finish) {
      limDist(dist - CAR_SIZE / 2 - realMove);
      break;
    }
    let willBreak = false;
    if (dist > 0) {
      const over = pos.chunk.getCar(pos.x, pos.y);
      if (over === "full") {
        limDist(dist - CAR_SIZE / 2 - realMove);
        break;
      }
      if (over !== "empty") {
        let carsDist;
        switch (car.direction) {
          case Direction.RIGHT:
            carsDist = Math.min(Math.floor(over.x), over.x - CAR_SIZE / 2) - car.x;
            break;
          case Direction.UP:
            carsDist = car.y - Math.max(Math.floor(over.y + 1), over.y + CAR_SIZE / 2);
            break;
          case Direction.LEFT:
            carsDist = car.x - Math.max(Math.floor(over.x + 1), over.x + CAR_SIZE / 2);
            break;
          case Direction.DOWN:
            carsDist = Math.min(Math.floor(over.y), over.y - CAR_SIZE / 2) - car.y;
            break;
        }
        carsDist -= CAR_SIZE / 2;
        limDist(carsDist);
        willBreak = true;
      }
      if (realMove < SIZE_LIM) {
        const leftPos = new GridExplorer(pos);
        leftPos.move(ld, cmap);
        const leftCar = pos.chunk.getCar(leftPos.x, leftPos.y);
        if (leftCar instanceof Car && leftCar.direction === rdir) {
          const subDist = getCellDist(leftCar.direction, leftCar.x, leftCar.y);
          if (subDist > SIZE_LIM) {
            limDist(dist - CAR_LINE / 2 - realMove);
          }
        }
        const rightPos = new GridExplorer(pos);
        rightPos.move(rd, cmap);
        const rightCar = pos.chunk.getCar(rightPos.x, rightPos.y);
        if (rightCar instanceof Car && rightCar.direction === ldir) {
          const subDist = getCellDist(rightCar.direction, rightCar.x, rightCar.y);
          if (subDist > SIZE_LIM) {
            limDist(dist - CAR_LINE / 2 - realMove);
          }
        }
      }
    }
    if (willBreak)
      break;
    if (realMove >= SIZE_LIM || !checkRight && !checkLeft) {
      pos.move(d, cmap);
      continue;
    }
    let entryDist = dist - realMove - CAR_SIZE / 2;
    let exitDist = entryDist + CAR_PASSAGE_LENGTH;
    if (entryDist < 0) {
      entryDist = 0;
      if (exitDist < 0) {
        exitDist = 0;
      }
    }
    const runCheck = (turnDir, opDir) => {
      const check = new GridExplorer(pos);
      for (let checkDist = 1; checkDist < range; checkDist++) {
        check.move(turnDir, cmap);
        const road2 = check.getRoad();
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
            if (road2 >> 6 == opDir) {
              shouldBreak = true;
            }
            break;
          case roadtypes.types.LIGHT:
            if (road2 >> 6 == opDir && (road2 & 1 << 3) === 0) {
              shouldBreak = true;
            }
            break;
        }
        if (shouldBreak)
          break;
        const over = check.chunk.getCar(check.x, check.y);
        if (over === "full" || over === "empty")
          continue;
        if (over.direction !== opDir)
          continue;
        const over_realMove = getCellDist(over.direction, over.x, over.y);
        let over_entryDist = checkDist - over_realMove - CAR_SIZE / 2;
        let over_exitDist = over_entryDist + CAR_PASSAGE_LENGTH;
        if (over_entryDist < 0) {
          over_entryDist = 0;
          if (over_exitDist < 0) {
            over_exitDist = 0;
          }
        }
        const fastSpeed = exitDist * over.speedLimit / over_entryDist;
        if (fastSpeed > fastPrioritySpeed) {
          fastPrioritySpeed = fastSpeed;
          fastPriorityAcceleration = 0.5 * (fastSpeed * fastSpeed - car.speed * car.speed) / exitDist;
        }
        const slowSpeed = entryDist * over.speed / over_exitDist;
        if (slowSpeed < slowPrioritySpeed)
          slowPrioritySpeed = slowSpeed;
        break;
      }
    };
    if (checkRight) {
      runCheck(rd, rop);
    }
    if (checkLeft) {
      runCheck(ld, lop);
    }
    pos.move(d, cmap);
  }
  return {
    lim: finalSpeed,
    fast: fastPrioritySpeed,
    acceleration: fastPriorityAcceleration,
    slow: slowPrioritySpeed
  };
}
const RENDER_DISTANCE = 16;
let nextCarId = 0;
const colors = [
  "#FF0000",
  "#FF3D00",
  "#FF6D00",
  "#FF9100",
  "#FFD600",
  "#AEEA00",
  "#00E676",
  "#00FF00",
  "#00F0FF",
  "#00B0FF",
  "#2979FF",
  "#3D5AFE",
  "#651FFF",
  "#D500F9",
  "#FF00FF",
  "#FF1744"
];
class Car {
  constructor(x, y, spawnerId, direction, color, score) {
    this.acceleration = 1e-3;
    this.deceleration = 3e-3;
    this.speedLimit = 0.2;
    this.speed = this.speedLimit;
    this.nextSpeed = this.speedLimit;
    this.rotationStep = -1;
    this.rotatingToRight = false;
    this.frameLastPositionUpdate = -1;
    this.alive = true;
    this.id = nextCarId++;
    this.x = x;
    this.y = y;
    this.lastBlockX = Math.floor(x);
    this.lastBlockY = Math.floor(y);
    this.direction = direction;
    this.color = color;
    this.score = score;
  }
  draw(ctx, road, iloader) {
    ctx.fillStyle = colors[modulo(this.id, colors.length)];
    let x;
    let y;
    let angle;
    switch (road & 7) {
      case roadtypes.types.VOID:
      case roadtypes.types.ROAD:
        x = this.x;
        y = this.y;
        angle = Math.PI / 2 * this.direction;
        break;
      case roadtypes.types.TURN: {
        if (this.rotationStep >= 0) {
          const m = getAttach(this.direction, this.rotatingToRight, this.rotationStep);
          x = Math.floor(this.x) + m.x;
          y = Math.floor(this.y) + m.y;
          angle = Math.PI / 2 * (this.direction + (this.rotatingToRight ? -1 : 1) * this.rotationStep);
        } else {
          x = this.x;
          y = this.y;
          angle = Math.PI / 2 * this.direction;
        }
        break;
      }
      default:
        x = this.x;
        y = this.y;
        angle = Math.PI / 2 * this.direction;
    }
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-angle);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      iloader.get("car", this.color),
      -CAR_SIZE / 2,
      -CAR_LINE / 2,
      CAR_SIZE,
      CAR_LINE
    );
    ctx.fillStyle = "black";
    ctx.font = "1px consolas";
    ctx.restore();
  }
  behave(road, game) {
    let speedTarget = this.speedLimit;
    let alive = "alive";
    const px = Math.floor(this.x);
    const py = Math.floor(this.y);
    if (px != this.lastBlockX || py != this.lastBlockY) {
      this.rotationStep = -1;
      switch (road & 7) {
        case roadtypes.types.VOID:
          alive = "killed";
          break;
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
              if (this.color % 2) {
                this.rotatingToRight = true;
                this.rotationStep = 0;
              }
              break;
            case roadtypes.TurnDirection.FRONT_LEFT:
              if (this.color % 2) {
                this.rotatingToRight = false;
                this.rotationStep = 0;
              }
              break;
            case roadtypes.TurnDirection.LEFT_AND_RIGHT:
              if (this.color % 2) {
                this.rotatingToRight = true;
                this.rotationStep = 0;
              } else {
                this.rotatingToRight = false;
                this.rotationStep = 0;
              }
              break;
            case roadtypes.TurnDirection.ALL:
              switch (this.color % 3) {
                case 0:
                  break;
                case 1:
                  this.rotatingToRight = true;
                  this.rotationStep = 0;
                  break;
                case 2:
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
            alive = "won";
          }
          break;
        }
      }
      this.lastBlockX = px;
      this.lastBlockY = py;
    }
    switch (road & 7) {
      case roadtypes.types.VOID: {
        alive = "killed";
        break;
      }
      case roadtypes.types.ROAD:
      case roadtypes.types.PRIORITY:
      case roadtypes.types.SPAWNER:
      case roadtypes.types.CONSUMER: {
        const speed2 = getDanger(this, RENDER_DISTANCE, game.chunkMap);
        if (speed2.lim < speedTarget) {
          speedTarget = speed2.lim;
        }
        if ((speed2.fast > speedTarget || speed2.acceleration > this.acceleration) && speed2.slow < speedTarget) {
          speedTarget = speed2.slow;
        }
        if (speedTarget < 0)
          speedTarget = 0;
        break;
      }
      case roadtypes.types.TURN: {
        break;
      }
      case roadtypes.types.LIGHT: {
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
    return alive;
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
      case roadtypes.types.LIGHT:
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
const _Chunk = class _Chunk {
  constructor(x, y) {
    this.nextCarSlot = 0;
    this.cars = Array(254).fill(null).map(() => []);
    this.grid = new Uint8Array(_Chunk.SIZE * _Chunk.SIZE);
    this.carGrid = new Uint8Array(_Chunk.SIZE * _Chunk.SIZE).fill(255);
    this.carSpawners = /* @__PURE__ */ new Map();
    this.lights = /* @__PURE__ */ new Map();
    this.x = x;
    this.y = y;
  }
  static getIdx(x, y) {
    return y * _Chunk.SIZE + x;
  }
  static getPos(idx) {
    return {
      x: idx % _Chunk.SIZE,
      y: Math.floor(idx / _Chunk.SIZE)
    };
  }
  getRoad(x, y) {
    const road = this.grid[_Chunk.getIdx(x, y)];
    return road;
  }
  setRoad(x, y, road) {
    const currentRoad = this.getRoad(x, y);
    const currentRoadType = currentRoad & 7;
    switch (currentRoadType) {
      case roadtypes.types.SPAWNER:
      case roadtypes.types.CONSUMER:
        return;
      case roadtypes.types.VOID:
        if (currentRoad & 1 << 3)
          return;
    }
    if (currentRoadType === roadtypes.types.LIGHT) {
      if ((road & 7) !== roadtypes.types.LIGHT) {
        this.removeLight(x, y);
      }
    } else if ((road & 7) === roadtypes.types.LIGHT) {
      this.appendLight({ flag: 0 }, x, y);
    }
    const idx = _Chunk.getIdx(x, y);
    this.grid[idx] = road;
  }
  drawGrid(ctx, iloader) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, _Chunk.SIZE, _Chunk.SIZE);
    for (let y = 0; y < _Chunk.SIZE; y++) {
      for (let x = 0; x < _Chunk.SIZE; x++) {
        const obj = this.getRoad(x, y);
        if (obj === 0)
          continue;
        ctx.save();
        ctx.translate(x, y);
        roadtypes.draw(ctx, iloader, obj);
        ctx.restore();
      }
    }
  }
  drawCars(ctx, iloader) {
    for (const car of this.iterateCars()) {
      const x = modulo(Math.floor(car.x), _Chunk.SIZE);
      const y = modulo(Math.floor(car.y), _Chunk.SIZE);
      const road = this.getRoad(x, y);
      car.draw(ctx, road, iloader);
    }
  }
  runEvents(frameCount) {
    for (const [idx, spawner] of this.carSpawners) {
      spawner.couldown--;
      if (spawner.couldown <= 0) {
        const car = new Car(
          this.x * _Chunk.SIZE + spawner.x + 0.5,
          this.y * _Chunk.SIZE + spawner.y + 0.5,
          spawner.currentId,
          spawner.direction,
          spawner.color,
          spawner.score
        );
        spawner.currentId++;
        if (this.appendCar(car, spawner.x, spawner.y)) {
          spawner.count--;
          if (spawner.count <= 0) {
            this.carSpawners.delete(idx);
          }
        }
        spawner.couldown += spawner.rythm;
      }
    }
    const frameCountMod = [
      Math.floor(frameCount / (8 * 30)) % 4,
      Math.floor(frameCount / (4 * 30)) % 8,
      Math.floor(frameCount / (2 * 30)) % 16,
      Math.floor(frameCount / (1 * 30)) % 32
    ];
    for (const [idx, light] of this.lights) {
      const flag = light.flag;
      const pos = _Chunk.getPos(idx);
      const road = this.getRoad(pos.x, pos.y);
      if ((road & 7) !== roadtypes.types.LIGHT) {
        this.lights.delete(idx);
        continue;
      }
      const sizeSlot = frameCountMod[road >> 4 & 3];
      const now = !!(flag & 1 << sizeSlot);
      this.setRoad(
        pos.x,
        pos.y,
        now ? road | 1 << 3 : road & -9
      );
    }
  }
  appendCarSpawner(spawner) {
    const x = modulo(spawner.x, _Chunk.SIZE);
    const y = modulo(spawner.y, _Chunk.SIZE);
    this.carSpawners.set(_Chunk.getIdx(x, y), spawner);
    const road = roadtypes.types.SPAWNER | (spawner.color & 7) << 3 | spawner.direction << 6;
    this.setRoad(x, y, road);
  }
  appendLight(light, x, y) {
    this.lights.set(_Chunk.getIdx(x, y), light);
  }
  removeLight(x, y) {
    this.lights.delete(_Chunk.getIdx(x, y));
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
  getLight(x, y) {
    return this.lights.get(_Chunk.getIdx(x, y));
  }
  reset() {
    this.nextCarSlot = 0;
    for (let i = 0; i < this.cars.length; i++) {
      this.cars[i].length = 0;
    }
    this.carGrid.fill(255);
    for (const spawner of this.carSpawners.values()) {
      spawner.couldown = spawner.startCouldown;
      spawner.count = spawner.startCount;
    }
  }
};
_Chunk.SIZE = 16;
let Chunk = _Chunk;
function produceChunkKey(x, y) {
  return x << 16 ^ y;
}
class ChunkMap {
  constructor() {
    this.chunks = /* @__PURE__ */ new Map();
    this.time = 0;
  }
  static getPoint(x, y) {
    const cx = Math.floor(x / Chunk.SIZE);
    const cy = Math.floor(y / Chunk.SIZE);
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
  getLight(x, y) {
    const p = ChunkMap.getPoint(x, y);
    const c = this.getChunk(p.cx, p.cy);
    return c.getLight(p.rx, p.ry);
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
  reset() {
    for (let [_, chunk] of this.chunks) {
      chunk.reset();
    }
  }
}
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
class LightSizeEditor {
  constructor(element) {
    this.flag = 0;
    this.cycleSize = 0;
    this._initialFlag = 0;
    this._initialCycleSize = 0;
    this._resolve = null;
    this.element = element;
    this.select = element.querySelector("#lightSizeEditor__select");
    this.bitsContainer = element.querySelector("#lightSizeEditor__bits");
    this.select.addEventListener("change", () => {
      const newCycleSize = parseInt(this.select.value);
      this.resizeBits(newCycleSize);
      this.renderBits();
    });
    element.querySelector("#lightSizeEditor__confirm").addEventListener("click", () => this.confirm());
    element.querySelector("#lightSizeEditor__cancel").addEventListener("click", () => this.cancel());
  }
  cycleSizeToLength(cycleSize) {
    return 4 << cycleSize;
  }
  resizeBits(newCycleSize) {
    const oldLength = this.cycleSizeToLength(this.cycleSize);
    const newLength = this.cycleSizeToLength(newCycleSize);
    if (newLength > oldLength) {
      const ratio = newLength / oldLength;
      let newFlag = 0;
      for (let i = 0; i < oldLength; i++) {
        const bit = this.flag >> i & 1;
        const block = (1 << ratio) - 1;
        if (bit) {
          newFlag |= block << i * ratio;
        }
      }
      this.flag = newFlag;
    } else if (newLength < oldLength) {
      const ratio = oldLength / newLength;
      let newFlag = 0;
      for (let i = 0; i < newLength; i++) {
        const bit = this.flag >> i * ratio & 1;
        if (bit) {
          newFlag |= 1 << i;
        }
      }
      this.flag = newFlag;
    }
    this.cycleSize = newCycleSize;
  }
  renderBits() {
    const length = this.cycleSizeToLength(this.cycleSize);
    this.bitsContainer.innerHTML = "";
    for (let i = 0; i < length; i++) {
      const bit = this.flag >> i & 1;
      const el = document.createElement("div");
      el.className = `lightSizeEditor__bit ${bit ? "lightSizeEditor__bit--on" : "lightSizeEditor__bit--off"}`;
      el.title = `Bit ${i} : ${bit}`;
      el.addEventListener("click", () => {
        this.flag ^= 1 << i;
        const newBit = this.flag >> i & 1;
        el.className = `lightSizeEditor__bit ${newBit ? "lightSizeEditor__bit--on" : "lightSizeEditor__bit--off"}`;
        el.title = `Bit ${i} : ${newBit}`;
      });
      this.bitsContainer.appendChild(el);
    }
  }
  confirm() {
    this.hide();
  }
  cancel() {
    this.flag = this._initialFlag;
    this.cycleSize = this._initialCycleSize;
    this.hide();
  }
  show(flag, cycleSize) {
    this.flag = flag;
    this.cycleSize = cycleSize;
    this._initialFlag = flag;
    this._initialCycleSize = cycleSize;
    this.select.value = String(cycleSize);
    this.renderBits();
    this.element.classList.remove("hidden");
  }
  hide() {
    this.element.classList.add("hidden");
    const result = { flag: this.flag, cycleSize: this.cycleSize };
    if (this._resolve) {
      this._resolve(result);
      this._resolve = null;
    }
    return result;
  }
  get(flag, cycleSize) {
    return new Promise((resolve) => {
      this.show(flag, cycleSize);
      this._resolve = resolve;
    });
  }
}
const lightSizeEditor = new LightSizeEditor(document.getElementById("lightSizeEditor"));
const BACKGROUND_APPEAR = 120;
const BACKGROUND_ALPHA = 0.85;
class TransitionState extends GameState {
  constructor(game) {
    super();
    this.timer = 0;
    this.score = 0;
    this.stop = false;
    this.game = game;
  }
  enter(data, input) {
    const score = data.score;
    this.score = score;
    input.onMouseUp = () => {
    };
    input.onMouseDown = () => {
      this.stop = true;
    };
    input.onMouseMove = () => {
    };
    input.onScroll = () => {
    };
  }
  frame(game) {
    this.game.frame(game);
    this.timer++;
    if (this.stop) {
      return new LevelsState();
    }
    return null;
  }
  draw(args) {
    this.game.draw(args);
    const ctx = args.ctx;
    const timer = Math.min(this.timer, BACKGROUND_APPEAR) / BACKGROUND_APPEAR;
    ctx.fillStyle = `rgba(0,0,0,${timer * BACKGROUND_ALPHA})`;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.fillStyle = "white";
    ctx.font = "100px arial";
    ctx.fillText("score: " + this.score, GAME_WIDTH / 2 - 200, GAME_HEIGHT / 2);
  }
  exit() {
  }
  getCamera() {
    return this.game.getCamera();
  }
}
const timeLeftDiv = document.getElementById("timeLeft");
const scoreDiv = document.getElementById("score");
class Game extends GameState {
  constructor() {
    super(...arguments);
    this.camera = { x: 0, y: 0, z: 20 };
    this.chunkMap = new ChunkMap();
    this.graph = new PathGraph(this.chunkMap);
    this.carFrame = 0;
    this.runningCars = false;
    this.score = 0;
  }
  placeRoad(x, y) {
    const cmap = this.chunkMap;
    const neighbors = [
      cmap.getRoad(x + 1, y),
      cmap.getRoad(x, y - 1),
      cmap.getRoad(x - 1, y),
      cmap.getRoad(x, y + 1)
    ];
    const alive = [];
    for (let i = 0; i < 4; i++)
      if (neighbors[i] & 7)
        alive.push(i);
    if (alive.length === 0) {
      cmap.setRoad(x, y, roadtypes.types.ROAD);
      return;
    }
    if (alive.length === 1) {
      const dir = alive[0];
      if ((neighbors[dir] & 7) != roadtypes.types.ROAD) {
        cmap.setRoad(x, y, roadtypes.types.ROAD);
        return;
      }
      let road = roadtypes.types.ROAD;
      const mdir = getDirectionDelta(dir);
      const pos = new GridExplorer(x, y, cmap);
      pos.move(mdir, cmap);
      let hasRight;
      let hasLeft;
      {
        const rpos = new GridExplorer(pos);
        rpos.move(getDirectionDelta(rotateDirectionToRight(dir)), cmap);
        hasRight = rpos.getRoad() & 7;
        const lpos = new GridExplorer(pos);
        lpos.move(getDirectionDelta(rotateDirectionToLeft(dir)), cmap);
        hasLeft = lpos.getRoad() & 7;
      }
      console.log(hasLeft, hasRight);
      if (hasRight && !hasLeft) {
        pos.setRoad(roadtypes.types.TURN | roadtypes.TurnDirection.LEFT << 3 | rotateDirectionToLeft(dir) << 6);
      } else if (!hasRight && hasLeft) {
        pos.setRoad(roadtypes.types.TURN | roadtypes.TurnDirection.RIGHT << 3 | rotateDirectionToRight(dir) << 6);
      }
      cmap.setRoad(x, y, road);
      return;
    }
    if (alive.length === 2) {
      cmap.setRoad(x, y, roadtypes.types.ROAD);
      return;
    }
    cmap.setRoad(x, y, roadtypes.types.ROAD);
  }
  test() {
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
  restart() {
    this.score = 0;
    this.carFrame = 0;
    this.runningCars = false;
    this.chunkMap.reset();
    document.getElementById("pause")?.togglePause(false);
  }
  handleHTML() {
    document.getElementById("gameView")?.classList.remove("hidden");
    const pause = document.getElementById("pause");
    if (pause) {
      pause.classList.add("inPause");
      pause.onclick = () => {
        this.runningCars = !this.runningCars;
        pause.togglePause(this.runningCars);
      };
    }
    const restart = document.getElementById("restart");
    if (restart) {
      restart.onclick = () => {
        this.restart();
      };
    }
  }
  enter(data, input) {
    const mapConstructor = data;
    mapConstructor.fill(this.chunkMap);
    mapConstructor.setCamera(this.camera);
    this.test();
    this.handleHTML();
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
          this.placeRoad(x, y);
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
          this.placeRoad(x, y);
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
        if (type >= roadtypes.types.SPAWNER) {
          type = 1;
        }
        const nextRoad = road & -8 | type;
        this.chunkMap.setRoad(x, y, nextRoad);
        return;
      }
      const roadScroll = roadtypes.onScroll(road, e.deltaY);
      if (roadScroll === "light") {
        const light = this.chunkMap.getLight(x, y);
        if (light) {
          lightSizeEditor.get(light.flag, road >> 4 & 3).then((o) => {
            light.flag = o.flag;
            let nextRoad = roadtypes.types.LIGHT;
            nextRoad |= road & 3 << 6;
            nextRoad |= o.cycleSize << 4;
            this.chunkMap.setRoad(x, y, nextRoad);
          });
        }
      } else if (roadScroll) {
        this.chunkMap.setRoad(x, y, roadScroll);
      } else if (!leftDown && !rightDown) {
        this.camera.z -= this.camera.z * e.deltaY / 1e3;
      }
    };
  }
  runCars() {
    for (let [_, chunk] of this.chunkMap) {
      chunk.runEvents(this.carFrame);
    }
    for (let { car, chunk } of this.chunkMap.iterateCars()) {
      if (!car.alive)
        continue;
      const x = modulo(Math.floor(car.x), Chunk.SIZE);
      const y = modulo(Math.floor(car.y), Chunk.SIZE);
      const road = chunk.getRoad(x, y);
      switch (car.behave(road, this)) {
        case "alive":
          break;
        case "won":
          this.score += car.score;
        case "killed":
          car.alive = false;
          break;
      }
    }
    for (let { car, chunk } of this.chunkMap.iterateCars()) {
      const x = modulo(Math.floor(car.x), Chunk.SIZE);
      const y = modulo(Math.floor(car.y), Chunk.SIZE);
      const road = chunk.getRoad(x, y);
      car.move(road);
    }
    this.chunkMap.updateCarGrid(this.carFrame);
    this.carFrame++;
  }
  frame(game) {
    if (this.runningCars)
      this.runCars();
    if (this.carFrame < this.chunkMap.time)
      return null;
    return new TransitionState(this);
  }
  drawGrid(ctx, iloader) {
    for (let [_, chunk] of this.chunkMap) {
      ctx.save();
      ctx.translate(chunk.x * Chunk.SIZE, chunk.y * Chunk.SIZE);
      chunk.drawGrid(ctx, iloader);
      ctx.restore();
    }
  }
  drawCars(ctx, iloader) {
    for (let [_, chunk] of this.chunkMap) {
      chunk.drawCars(ctx, iloader);
    }
  }
  drawStats(ctx) {
    let leftTime = (() => {
      const time = Math.max(this.chunkMap.time - this.carFrame, 0);
      const totalSeconds = Math.floor(time / 60);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const milliseconds = Math.floor(time % 60 / 6);
      return `${minutes.toString().padStart(1, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds}`;
    })();
    timeLeftDiv.innerText = leftTime;
    scoreDiv.innerText = this.score.toString().padStart(5, "0");
  }
  draw(args) {
    {
      args.ctx.fillStyle = "#261f19";
      args.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }
    args.followCamera();
    this.drawGrid(args.ctx, args.imageLoader);
    this.drawCars(args.ctx, args.imageLoader);
    args.unfollowCamera();
    this.drawStats(args.ctx);
  }
  exit() {
    document.getElementById("gameView")?.classList.add("hidden");
    return { score: this.score };
  }
  getCamera() {
    return this.camera;
  }
}
class MapConstructor {
  constructor(data) {
    this.carSpawners = [];
    this.roads = [];
    this.time = 0;
    this.width = 32;
    this.height = 32;
    if (data) {
      this.appendJSON(data);
    }
  }
  fill(cmap) {
    cmap.time = this.time;
    for (let i = 0; i < this.carSpawners.length; i++) {
      const spawner = this.carSpawners[i];
      const chunk = cmap.getChunk(
        Math.floor(spawner.x / Chunk.SIZE),
        Math.floor(spawner.y / Chunk.SIZE)
      );
      chunk.appendCarSpawner({
        x: spawner.x,
        y: spawner.y,
        color: spawner.color,
        rythm: spawner.rythm,
        startCouldown: spawner.couldown,
        couldown: spawner.couldown,
        direction: spawner.direction,
        startCount: spawner.count,
        count: spawner.count,
        score: spawner.score,
        currentId: i
      });
    }
    for (const road of this.roads) {
      cmap.setRoad(road.x, road.y, road.data);
    }
    const voidRoad = 1 << 3;
    for (let i = 0; i < this.width; i++) {
      cmap.setRoad(i, 0, voidRoad);
      cmap.setRoad(i, this.height, voidRoad);
    }
    for (let i = 0; i < this.height; i++) {
      cmap.setRoad(0, i, voidRoad);
      cmap.setRoad(this.width, i, voidRoad);
    }
    cmap.setRoad(this.width, this.height, voidRoad);
  }
  appendJSON(data) {
    const time = data.time;
    if (time !== void 0)
      this.time = time;
    const width = data.width;
    if (width !== void 0)
      this.width = width;
    const height = data.height;
    if (height !== void 0)
      this.height = height;
    const spawners = data.spawners;
    if (spawners !== void 0)
      this.carSpawners.push(...spawners);
    const roads = data.roads;
    if (roads !== void 0)
      this.roads.push(...roads);
  }
  setCamera(camera) {
    camera.x = this.width / 2;
    camera.y = this.height / 2;
    camera.z = Math.max(this.width, this.height) * 0.8;
  }
}
class LevelsState extends GameState {
  constructor() {
    super();
  }
  enter(data, input) {
  }
  frame(game) {
    return new Game();
  }
  draw(args) {
  }
  exit() {
    return LEVELS[3];
  }
  getCamera() {
    return null;
  }
}
const LEVELS = [
  // Level 0
  new MapConstructor({
    time: 100 * 60,
    width: 31,
    height: 31,
    spawners: [
      {
        x: 1,
        y: 5,
        color: CarColor.RED,
        rythm: 45,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 1
      },
      {
        x: 1,
        y: 10,
        color: CarColor.BLUE,
        rythm: 45,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 1
      },
      {
        x: 20,
        y: 30,
        color: CarColor.GREEN,
        rythm: 135,
        couldown: 1,
        direction: Direction.UP,
        count: Infinity,
        score: 10
      }
    ],
    roads: [
      {
        x: 30,
        y: 5,
        data: roadtypes.types.CONSUMER | CarColor.RED << 3
      },
      {
        x: 20,
        y: 1,
        data: roadtypes.types.CONSUMER | CarColor.GREEN << 3
      },
      {
        x: 30,
        y: 10,
        data: roadtypes.types.CONSUMER | CarColor.BLUE << 3
      }
    ]
  }),
  // Level 1
  new MapConstructor({
    time: 100 * 60,
    width: 31,
    height: 31,
    spawners: [
      {
        x: 1,
        y: 5,
        color: CarColor.RED,
        rythm: 45,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 1
      },
      {
        x: 1,
        y: 10,
        color: CarColor.BLUE,
        rythm: 45,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 1
      },
      {
        x: 20,
        y: 30,
        color: CarColor.GREEN,
        rythm: 135,
        couldown: 1,
        direction: Direction.UP,
        count: Infinity,
        score: 10
      }
    ],
    roads: [
      {
        x: 30,
        y: 5,
        data: roadtypes.types.CONSUMER | CarColor.BLUE << 3
      },
      {
        x: 20,
        y: 1,
        data: roadtypes.types.CONSUMER | CarColor.GREEN << 3
      },
      {
        x: 30,
        y: 10,
        data: roadtypes.types.CONSUMER | CarColor.RED << 3
      }
    ]
  }),
  // Level 2
  new MapConstructor({
    time: 100 * 60,
    width: 31,
    height: 31,
    spawners: [
      {
        x: 1,
        y: 5,
        color: CarColor.RED,
        rythm: 45,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 1
      },
      {
        x: 1,
        y: 7,
        color: CarColor.RED,
        rythm: 45,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 1
      },
      {
        x: 1,
        y: 9,
        color: CarColor.RED,
        rythm: 45,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 1
      },
      {
        x: 5,
        y: 1,
        color: CarColor.RED,
        rythm: 45,
        couldown: 1,
        direction: Direction.DOWN,
        count: Infinity,
        score: 1
      },
      {
        x: 7,
        y: 1,
        color: CarColor.RED,
        rythm: 45,
        couldown: 1,
        direction: Direction.DOWN,
        count: Infinity,
        score: 1
      },
      {
        x: 9,
        y: 1,
        color: CarColor.RED,
        rythm: 45,
        couldown: 1,
        direction: Direction.DOWN,
        count: Infinity,
        score: 1
      },
      {
        x: 20,
        y: 1,
        color: CarColor.BLUE,
        rythm: 120,
        couldown: 1,
        direction: Direction.DOWN,
        count: Infinity,
        score: 15
      },
      {
        x: 1,
        y: 20,
        color: CarColor.GREEN,
        rythm: 120,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 15
      }
    ],
    roads: [
      {
        x: 30,
        y: 20,
        data: roadtypes.types.CONSUMER | CarColor.GREEN << 3
      },
      {
        x: 20,
        y: 30,
        data: roadtypes.types.CONSUMER | CarColor.BLUE << 3
      },
      {
        x: 27,
        y: 27,
        data: roadtypes.types.CONSUMER | CarColor.RED << 3
      }
    ]
  }),
  // Level 3
  new MapConstructor({
    time: 100 * 60,
    width: 32,
    height: 32,
    spawners: [
      {
        x: 1,
        y: 5,
        color: CarColor.RED,
        rythm: 60,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 1
      },
      {
        x: 1,
        y: 7,
        color: CarColor.YELLOW,
        rythm: 60,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 1
      },
      {
        x: 1,
        y: 9,
        color: CarColor.BLUE,
        rythm: 60,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 1
      },
      {
        x: 1,
        y: 11,
        color: CarColor.CYAN,
        rythm: 60,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 1
      },
      {
        x: 1,
        y: 21,
        color: CarColor.RED,
        rythm: 60,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 1
      },
      {
        x: 1,
        y: 23,
        color: CarColor.YELLOW,
        rythm: 60,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 1
      },
      {
        x: 1,
        y: 25,
        color: CarColor.BLUE,
        rythm: 60,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 1
      },
      {
        x: 1,
        y: 27,
        color: CarColor.CYAN,
        rythm: 60,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 1
      },
      {
        x: 31,
        y: 16,
        color: CarColor.PURPLE,
        rythm: 360,
        couldown: 1,
        direction: Direction.LEFT,
        count: Infinity,
        score: 5
      },
      {
        x: 31,
        y: 15,
        color: CarColor.PURPLE,
        rythm: 360,
        couldown: 180,
        direction: Direction.LEFT,
        count: Infinity,
        score: 5
      }
    ],
    roads: [
      { x: 16, y: 0, data: 8 },
      { x: 16, y: 1, data: 8 },
      { x: 16, y: 2, data: 8 },
      { x: 16, y: 3, data: 8 },
      { x: 16, y: 4, data: 8 },
      { x: 16, y: 5, data: 8 },
      { x: 16, y: 6, data: 8 },
      { x: 16, y: 7, data: 8 },
      { x: 16, y: 8, data: 8 },
      { x: 16, y: 9, data: 8 },
      { x: 16, y: 10, data: 8 },
      { x: 16, y: 11, data: 8 },
      { x: 16, y: 12, data: 8 },
      { x: 16, y: 13, data: 8 },
      { x: 16, y: 14, data: 8 },
      { x: 16, y: 19, data: 8 },
      { x: 16, y: 20, data: 8 },
      { x: 16, y: 21, data: 8 },
      { x: 16, y: 22, data: 8 },
      { x: 16, y: 23, data: 8 },
      { x: 16, y: 24, data: 8 },
      { x: 16, y: 25, data: 8 },
      { x: 16, y: 26, data: 8 },
      { x: 16, y: 27, data: 8 },
      { x: 16, y: 28, data: 8 },
      { x: 16, y: 29, data: 8 },
      { x: 16, y: 30, data: 8 },
      { x: 16, y: 31, data: 8 },
      { x: 17, y: 0, data: 8 },
      { x: 17, y: 1, data: 8 },
      { x: 17, y: 2, data: 8 },
      { x: 17, y: 3, data: 8 },
      { x: 17, y: 4, data: 8 },
      { x: 17, y: 5, data: 8 },
      { x: 17, y: 6, data: 8 },
      { x: 17, y: 7, data: 8 },
      { x: 17, y: 8, data: 8 },
      { x: 17, y: 9, data: 8 },
      { x: 17, y: 10, data: 8 },
      { x: 17, y: 11, data: 8 },
      { x: 17, y: 12, data: 8 },
      { x: 17, y: 13, data: 8 },
      { x: 17, y: 14, data: 8 },
      { x: 17, y: 19, data: 8 },
      { x: 17, y: 20, data: 8 },
      { x: 17, y: 21, data: 8 },
      { x: 17, y: 22, data: 8 },
      { x: 17, y: 23, data: 8 },
      { x: 17, y: 24, data: 8 },
      { x: 17, y: 25, data: 8 },
      { x: 17, y: 26, data: 8 },
      { x: 17, y: 27, data: 8 },
      { x: 17, y: 28, data: 8 },
      { x: 17, y: 29, data: 8 },
      { x: 17, y: 30, data: 8 },
      { x: 17, y: 31, data: 8 },
      { x: 28, y: 2, data: roadtypes.types.CONSUMER | CarColor.RED << 3 },
      { x: 28, y: 9, data: roadtypes.types.CONSUMER | CarColor.YELLOW << 3 },
      { x: 28, y: 23, data: roadtypes.types.CONSUMER | CarColor.BLUE << 3 },
      { x: 28, y: 30, data: roadtypes.types.CONSUMER | CarColor.CYAN << 3 },
      { x: 1, y: 17, data: roadtypes.types.CONSUMER | CarColor.PURPLE << 3 }
    ]
  })
];
function setElementAsBackground(element, div) {
  if (element instanceof HTMLCanvasElement) {
    element.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      div.style.backgroundImage = `url(${url})`;
    });
  } else {
    div.style.backgroundImage = `url(${element.src})`;
  }
}
class GameHandler {
  constructor(keyboardMode, eventTarget) {
    this.imgLoader = new ImageLoader("");
    this.inputHandler = new InputHandler(keyboardMode);
    this.inputHandler.startListeners(eventTarget);
    this.state = new LevelsState();
    this.state.enter(void 0, this.inputHandler);
    this.imgLoader.load({
      resume: "assets/resume.png",
      pause: "assets/pause.png",
      restart: "assets/restart.png"
    }).then(() => {
      const pauseElement = document.getElementById("pause");
      setElementAsBackground(this.imgLoader.get("resume"), pauseElement);
      pauseElement.togglePause = (pause) => {
        if (pause) {
          pauseElement.classList.add("inPause");
          setElementAsBackground(this.imgLoader.get("pause"), pauseElement);
        } else {
          pauseElement.classList.remove("inPause");
          setElementAsBackground(this.imgLoader.get("resume"), pauseElement);
        }
      };
      setElementAsBackground(
        this.imgLoader.get("restart"),
        document.getElementById("restart")
      );
    });
    this.imgLoader.load({
      turn_all: "assets/turn/all.png",
      turn_turn: "assets/turn/turn.png",
      turn_front: "assets/turn/front.png",
      turn_select: "assets/turn/select.png",
      turn_full: "assets/turn/full.png",
      yield: "assets/yield.png",
      light_red: "assets/lights/red.png",
      light_orange: "assets/lights/orange.png",
      light_green: "assets/lights/green.png"
    });
    this.imgLoader.loadWithColors(
      "#ac3232",
      ["#ac3232", "#fbf236", "#5b6ee1", "#5fcde4", "#6abe30", "#d77bba"],
      {
        consumer: "assets/consumer.png",
        spawner: "assets/spawner.png",
        car: "assets/car.png"
      }
    );
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
    canvas
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
        setTimeout(runGameLoop, 1e3 / 3);
      }
    }
    countedFps++;
  }
  window.game = game;
  window.running = true;
  runGameLoop();
}
