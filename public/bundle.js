const GAME_WIDTH = 1600;
const GAME_HEIGHT = 900;
class Keydown {
  constructor() {
    this.turnLeft = false;
    this.turnRight = false;
    this.yieldIns = false;
    this.light = false;
    this.fastView = false;
    this.altern = false;
  }
}
class KeyboardCollector {
  constructor() {
    this.turnLeft = 0;
    this.turnRight = 0;
    this.yieldIns = 0;
    this.light = 0;
    this.fastView = 0;
    this.altern = 0;
  }
}
const _InputHandler = class _InputHandler {
  constructor(mode) {
    this.collectedKeys = new KeyboardCollector();
    this.keysDown = new Keydown();
    this.firstPress = new Keydown();
    this.killedPress = new Keydown();
    this.onMouseUp = (e) => {
    };
    this.onMouseDown = (e) => {
    };
    this.onMouseMove = (e) => {
    };
    this.onScroll = (e) => {
    };
    this.onTouchStart = (e) => {
    };
    this.onTouchEnd = (e) => {
    };
    this.onTouchMove = (e) => {
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
  startKeydownListeners(target) {
    target.addEventListener("keydown", this.onKeydown);
    target.addEventListener("keyup", this.onKeyup);
  }
  startMouseListeners(target) {
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
    target.addEventListener("touchstart", (e) => {
      this.onTouchStart(e);
    });
    target.addEventListener("touchend", (e) => {
      this.onTouchEnd(e);
    });
    target.addEventListener("touchmove", (e) => {
      this.onTouchMove(e);
    });
  }
  removeListeners(target) {
    target.removeEventListener("keydown", this.onKeydown);
    target.removeEventListener("keyup", this.onKeyup);
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
_InputHandler.CONTROLS = ["turnLeft", "turnRight", "yieldIns", "light", "fastView", "altern"];
_InputHandler.CONTROL_STACK_SIZE = 256;
_InputHandler.KEYBOARDS = {
  zqsd: {
    KeyE: "turnLeft",
    KeyR: "turnRight",
    KeyP: "yieldIns",
    KeyL: "light",
    KeyC: "fastView",
    KeyS: "altern"
  },
  wasd: {
    KeyE: "turnLeft",
    KeyR: "turnRight",
    KeyP: "yieldIns",
    KeyL: "light",
    KeyC: "fastView",
    KeyS: "altern"
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
    const b2 = parseInt(clean.substring(4, 6), 16);
    return [r, g, b2];
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
  async loadWithColors(checked, colors, list) {
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
          for (const color of colors) {
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
  CarColor2[CarColor2["GREEN"] = 3] = "GREEN";
  CarColor2[CarColor2["CYAN"] = 4] = "CYAN";
  CarColor2[CarColor2["PINK"] = 5] = "PINK";
  CarColor2[CarColor2["WHITE"] = 6] = "WHITE";
  CarColor2[CarColor2["GRAY"] = 7] = "GRAY";
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
function isTouchDevice() {
  return navigator.maxTouchPoints > 0;
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
      input.onTouchStart = (e) => {
      };
      input.onTouchEnd = (e) => {
      };
      input.onTouchMove = (e) => {
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
    types2[types2["ALTERN"] = 5] = "ALTERN";
    types2[types2["SPAWNER"] = 6] = "SPAWNER";
    types2[types2["CONSUMER"] = 7] = "CONSUMER";
  })(roadtypes2.types || (roadtypes2.types = {}));
  ((TurnDirection2) => {
    TurnDirection2[TurnDirection2["RIGHT"] = 0] = "RIGHT";
    TurnDirection2[TurnDirection2["LEFT"] = 1] = "LEFT";
    TurnDirection2[TurnDirection2["ALL_0"] = 2] = "ALL_0";
    TurnDirection2[TurnDirection2["ALL_1"] = 3] = "ALL_1";
    TurnDirection2[TurnDirection2["ALL_2"] = 4] = "ALL_2";
    TurnDirection2[TurnDirection2["ALL_3"] = 5] = "ALL_3";
    TurnDirection2[TurnDirection2["ALL_4"] = 6] = "ALL_4";
    TurnDirection2[TurnDirection2["ALL_5"] = 7] = "ALL_5";
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
            drawImage("turn", direction);
            break;
          case 1:
            drawImage("turn", direction, { x: false, y: true, color: -1 });
            break;
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
            drawImage("all" + (type - 2), direction);
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
        let path = road & 1 << 5 ? "filter_share_" : "filter_";
        let flip = false;
        switch (road >> 3 & 3) {
          case 0:
          case 2:
            path += "front";
            flip = false;
            break;
          case 1:
            path += "turn";
            flip = false;
            break;
          case 3:
            path += "turn";
            flip = true;
            break;
        }
        const direction = road >> 6 & 3;
        drawImage(path, direction * Math.PI / 2, { x: false, y: flip, color: -1 });
        break;
      }
      case 6: {
        const color = road >> 3 & 7;
        const direction = road >> 6 & 3;
        drawImage("spawner", direction * Math.PI / 2, { x: false, y: false, color });
        break;
      }
      case 7: {
        const color = road >> 3 & 7;
        drawImage("consumer", 0, { x: false, y: false, color });
        break;
      }
      default:
        throw new Error("Invalid road type");
    }
  }
  roadtypes2.draw = draw;
  function onRotation(road) {
    switch (road & 7) {
      case 2:
      case 3:
      case 4:
      case 5: {
        let dir = road >> 6 & 3;
        dir++;
        dir &= 3;
        road = road & -193 | dir << 6;
        return road;
      }
      default:
        return null;
    }
  }
  roadtypes2.onRotation = onRotation;
  function onScroll(road, delta) {
    switch (road & 7) {
      case 2: {
        let type = road >> 3 & 7;
        if (delta > 0) {
          type--;
          if (type < 0) {
            type = 7;
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
      case 5:
        return road ^ 1 << 5;
      // toggle share
      case 4:
        return "light";
      default:
        return null;
    }
  }
  roadtypes2.onScroll = onScroll;
})(roadtypes || (roadtypes = {}));
const CAR_SIZE = 0.9;
const CAR_LINE = 0.6;
class GridExplorer {
  constructor(a, b2, cmap) {
    if (a instanceof GridExplorer) {
      this.x = a.x;
      this.y = a.y;
      this.cx = a.cx;
      this.cy = a.cy;
      this.chunk = a.chunk;
      return;
    }
    if (typeof a === "number" && b2 !== void 0 && cmap) {
      const initX = Math.floor(a / Chunk.SIZE);
      const initY = Math.floor(b2 / Chunk.SIZE);
      this.x = modulo(Math.floor(a), Chunk.SIZE);
      this.y = modulo(Math.floor(b2), Chunk.SIZE);
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
const GAME_COLORS = [
  "#ac3232",
  "#fbf236",
  "#5b6ee1",
  "#6abe30",
  "#5fcde4",
  "#d77bba",
  "#f0f8ed",
  "#6e6e6e"
];
const COLOR_NAMES = ["red", "yellow", "blue", "green", "cyan", "pink", "white", "black"];
const DIRECTION_CYCLE = [0, 1, -1];
const DIRECTION_LABELS = { 0: "Front", 1: "Right", "-1": "Left" };
class TurnSideSelector {
  constructor(div) {
    this.activationDiv = div;
    this.activeConfigIndex = 0;
    this.buttons = [];
    this.configs = Array.from(
      { length: 6 },
      () => Array(8).fill(0)
    );
    const { panel, backdrop } = this.buildPanel();
    this.panel = panel;
    this.backdrop = backdrop;
    document.body.appendChild(backdrop);
    document.body.appendChild(panel);
  }
  show() {
    this.backdrop.classList.add("turn-selector-visible");
    this.panel.classList.add("turn-selector-visible");
  }
  hide() {
    this.backdrop.classList.remove("turn-selector-visible");
    this.panel.classList.remove("turn-selector-visible");
  }
  getHtmlDiv() {
    return this.activationDiv;
  }
  getConfig(idx) {
    return this.configs[idx];
  }
  // Build the full panel and backdrop, wire up all interactivity
  buildPanel() {
    const backdrop = document.createElement("div");
    backdrop.classList.add("turn-selector-backdrop");
    backdrop.addEventListener("click", () => this.hide());
    const panel = document.createElement("div");
    panel.classList.add("turn-selector-panel");
    panel.addEventListener("click", (e) => e.stopPropagation());
    const title = document.createElement("div");
    title.classList.add("turn-selector-title");
    title.textContent = "Turn Selector";
    panel.appendChild(title);
    const selectorRow = document.createElement("div");
    selectorRow.classList.add("turn-selector-row");
    const selectorLabel = document.createElement("label");
    selectorLabel.textContent = "Config:";
    selectorLabel.classList.add("turn-selector-label");
    const select = document.createElement("select");
    select.classList.add("turn-selector-select");
    for (let i = 1; i <= 6; i++) {
      const option = document.createElement("option");
      option.value = String(i - 1);
      option.textContent = String(i);
      select.appendChild(option);
    }
    select.addEventListener("change", () => {
      this.activeConfigIndex = parseInt(select.value);
      this.refreshButtons();
    });
    selectorRow.appendChild(selectorLabel);
    selectorRow.appendChild(select);
    panel.appendChild(selectorRow);
    const table = document.createElement("table");
    table.classList.add("turn-selector-table");
    this.buttons = [];
    for (let i = 0; i < 8; i++) {
      const row = document.createElement("tr");
      const colorCell = document.createElement("th");
      colorCell.classList.add("turn-selector-color-cell");
      colorCell.style.backgroundColor = GAME_COLORS[i];
      colorCell.style.color = this.isDark(GAME_COLORS[i]) ? "#fff" : "#111";
      colorCell.textContent = COLOR_NAMES[i].toUpperCase();
      row.appendChild(colorCell);
      const btnCell = document.createElement("td");
      btnCell.classList.add("turn-selector-btn-cell");
      const btn = document.createElement("button");
      btn.classList.add("turn-selector-dir-btn");
      btn.textContent = DIRECTION_LABELS[0];
      btn.dataset.colorIndex = String(i);
      btn.addEventListener("click", () => {
        const colorIdx = parseInt(btn.dataset.colorIndex);
        const current = this.configs[this.activeConfigIndex][colorIdx];
        const cycleIdx = DIRECTION_CYCLE.indexOf(current);
        const next = DIRECTION_CYCLE[(cycleIdx + 1) % DIRECTION_CYCLE.length];
        this.configs[this.activeConfigIndex][colorIdx] = next;
        btn.textContent = DIRECTION_LABELS[next];
        btn.dataset.direction = String(next);
        this.updateButtonStyle(btn, next);
      });
      this.buttons.push([btn]);
      btnCell.appendChild(btn);
      row.appendChild(btnCell);
      table.appendChild(row);
    }
    panel.appendChild(table);
    const doneBtn = document.createElement("button");
    doneBtn.classList.add("turn-selector-done-btn");
    doneBtn.textContent = "Done";
    doneBtn.addEventListener("click", () => this.hide());
    panel.appendChild(doneBtn);
    return { panel, backdrop };
  }
  // Refresh all button labels when the active config changes
  refreshButtons() {
    const config = this.configs[this.activeConfigIndex];
    for (let i = 0; i < 8; i++) {
      const btn = this.buttons[i][0];
      const dir = config[i];
      btn.textContent = DIRECTION_LABELS[dir];
      btn.dataset.direction = String(dir);
      this.updateButtonStyle(btn, dir);
    }
  }
  // Apply a CSS class to visually distinguish directions
  updateButtonStyle(btn, dir) {
    btn.classList.remove("dir-front", "dir-right", "dir-left");
    if (dir === 0) btn.classList.add("dir-front");
    if (dir === 1) btn.classList.add("dir-right");
    if (dir === -1) btn.classList.add("dir-left");
  }
  // Determine if a hex color is perceptually dark
  isDark(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b2 = parseInt(hex.slice(5, 7), 16);
    return 0.299 * r + 0.587 * g + 0.114 * b2 < 140;
  }
}
function generateSideSelectorDivOpener() {
  const main = document.createElement("div");
  main.classList.add("turn-selector-opener");
  main.textContent = "Turn Selector";
  return main;
}
const opener = generateSideSelectorDivOpener();
const turnSideSelector = new TurnSideSelector(opener);
opener.addEventListener("click", () => {
  turnSideSelector.show();
});
console.log(turnSideSelector);
function getCarsDist(dir, over) {
  if (over.rotationStep < 0) ;
  switch (dir) {
    case Direction.RIGHT:
      return Math.max(0, CAR_SIZE / 2 - modulo(over.x, 1));
    case Direction.UP:
      return Math.max(0, modulo(over.y, 1) + CAR_SIZE / 2 - 1);
    case Direction.LEFT:
      return Math.max(0, modulo(over.x, 1) + CAR_SIZE / 2 - 1);
    case Direction.DOWN:
      return Math.max(0, CAR_SIZE / 2 - modulo(over.y, 1));
  }
}
const SIZE_LIM = (3 - CAR_SIZE - CAR_LINE) / 2;
class DirHelper {
  constructor(a) {
    if (a instanceof Car) {
      this.dir = a.direction;
      this.realMove = a.getCellDist();
      this.d = getDirectionDelta(this.dir);
      this.rdir = rotateDirectionToRight(this.dir);
      this.ldir = rotateDirectionToLeft(this.dir);
      this.rd = getDirectionDelta(this.rdir);
      this.ld = getDirectionDelta(this.ldir);
      this.rop = opposeDirection(this.rdir);
      this.lop = opposeDirection(this.ldir);
    } else {
      this.realMove = a.realMove;
      this.dir = a.dir;
      this.d = a.d;
      this.rdir = a.rdir;
      this.ldir = a.ldir;
      this.rd = a.rd;
      this.ld = a.ld;
      this.rop = a.rop;
      this.lop = a.lop;
    }
  }
  turnRight() {
    this.dir = rotateDirectionToRight(this.dir);
    this.d = getDirectionDelta(this.dir);
    this.rdir = rotateDirectionToRight(this.dir);
    this.ldir = rotateDirectionToLeft(this.dir);
    this.rd = getDirectionDelta(this.rdir);
    this.ld = getDirectionDelta(this.ldir);
    this.rop = opposeDirection(this.rdir);
    this.lop = opposeDirection(this.ldir);
  }
  turnLeft() {
    this.dir = rotateDirectionToLeft(this.dir);
    this.d = getDirectionDelta(this.dir);
    this.rdir = rotateDirectionToRight(this.dir);
    this.ldir = rotateDirectionToLeft(this.dir);
    this.rd = getDirectionDelta(this.rdir);
    this.ld = getDirectionDelta(this.ldir);
    this.rop = opposeDirection(this.rdir);
    this.lop = opposeDirection(this.ldir);
  }
}
function getDanger(car, range, cmap) {
  let finalSpeed = Infinity;
  const CAR_PASSAGE_LENGTH = 1 + CAR_SIZE;
  1 / car.speed;
  function limSpeed(lim) {
    if (lim < finalSpeed)
      finalSpeed = lim;
  }
  function limDist(dist) {
    let d = car.deceleration * dist;
    if (d >= 0)
      d = Math.sqrt(d);
    limSpeed(d);
  }
  const dir = new DirHelper(car);
  const pos = new GridExplorer(car.x, car.y, cmap);
  let fastPrioritySpeed = 0;
  let fastPriorityAcceleration = Infinity;
  let slowPrioritySpeed = Infinity;
  let willCheckPriorities = false;
  for (let dist = 0; dist < range; dist++) {
    const road = pos.getRoad();
    const checkDir = new DirHelper(dir);
    let finish = "continue";
    let checkLeft = willCheckPriorities;
    let checkRight = willCheckPriorities;
    willCheckPriorities = false;
    switch (road & 7) {
      case roadtypes.types.VOID:
        finish = "stop";
        break;
      case roadtypes.types.ROAD:
        if (dist > 0) {
          checkRight = true;
        }
        break;
      case roadtypes.types.TURN: {
        if (dist > 0) {
          checkRight = true;
        }
        if ((road >> 6 & 3) !== dir.dir)
          break;
        const type = road >> 3 & 7;
        switch (type) {
          case roadtypes.TurnDirection.RIGHT:
            dir.turnRight();
            break;
          case roadtypes.TurnDirection.LEFT:
            dir.turnLeft();
            break;
          default:
            switch (turnSideSelector.getConfig(type - 2)[car.color]) {
              case 0:
                break;
              case -1:
                dir.turnLeft();
                break;
              case 1:
                dir.turnRight();
                break;
            }
            break;
        }
        break;
      }
      case roadtypes.types.PRIORITY:
        if (road >> 6 !== dir.dir)
          break;
        if (dist > 0) {
          checkRight = true;
          checkLeft = true;
        }
        willCheckPriorities = true;
        break;
      case roadtypes.types.SPAWNER:
        if (dist > 0) {
          checkRight = true;
        }
        break;
      case roadtypes.types.CONSUMER:
        if ((road >> 3 & 7) === car.color) {
          finish = "consume";
        }
        break;
      case roadtypes.types.LIGHT:
        if (dist <= 0)
          break;
        checkRight = true;
        if (road >> 6 === dir.dir && (road & 1 << 3) === 0 && (dist > 0 || dir.realMove >= 1 - CAR_SIZE / 2)) {
          finish = "stop";
        }
        break;
      case roadtypes.types.ALTERN:
        if (dist > 0) {
          checkRight = true;
        }
        if ((road >> 6 & 3) !== dir.dir)
          break;
        if (dist === 0) {
          if (car.rotationStep >= 0) {
            if (car.rotatingToRight) {
              dir.turnRight();
            } else {
              dir.turnLeft();
            }
          }
          break;
        }
        switch (road >> 3 & 3) {
          // front
          case 0:
          case 2:
            break;
          // right
          case 1:
            dir.turnRight();
            break;
          // left
          case 3:
            dir.turnLeft();
            break;
        }
        break;
    }
    if (finish === "stop") {
      limDist(dist - CAR_SIZE / 2 - dir.realMove);
      break;
    }
    if (finish === "consume")
      break;
    let willBreak = false;
    if (dist > 0) {
      const over = pos.chunk.getCar(pos.x, pos.y);
      if (over === "full") {
        limDist(dist - CAR_SIZE / 2 - dir.realMove);
        break;
      }
      if (over !== "empty") {
        const carsDist = getCarsDist(dir.dir, over);
        limDist(dist - carsDist - dir.realMove - CAR_SIZE / 2);
        willBreak = true;
      }
      if (dir.realMove < SIZE_LIM) {
        const leftPos = new GridExplorer(pos);
        leftPos.move(dir.ld, cmap);
        const leftCar = pos.chunk.getCar(leftPos.x, leftPos.y);
        if (leftCar instanceof Car && leftCar.direction === dir.rdir) {
          const subDist = getCellDist(leftCar.direction, leftCar.x, leftCar.y);
          if (subDist > SIZE_LIM) {
            limDist(dist - CAR_LINE / 2 - dir.realMove);
          }
        }
        const rightPos = new GridExplorer(pos);
        rightPos.move(dir.rd, cmap);
        const rightCar = pos.chunk.getCar(rightPos.x, rightPos.y);
        if (rightCar instanceof Car && rightCar.direction === dir.ldir) {
          const subDist = getCellDist(rightCar.direction, rightCar.x, rightCar.y);
          if (subDist > SIZE_LIM) {
            limDist(dist - CAR_LINE / 2 - dir.realMove);
          }
        }
      }
    }
    if (willBreak)
      break;
    if (dir.realMove >= SIZE_LIM || !checkRight && !checkLeft) {
      pos.move(dir.d, cmap);
      continue;
    }
    let entryDist = dist - dir.realMove - CAR_SIZE / 2;
    let exitDist = entryDist + CAR_PASSAGE_LENGTH;
    if (entryDist < 0) {
      entryDist = 0;
      if (exitDist < 0) {
        exitDist = 0;
      }
    }
    const runCheck = (dir2, explorer, checkDist, forbiddenCarsFlag) => {
      const turnDir = getDirectionDelta(dir2);
      const leftDir = rotateDirectionToLeft(dir2);
      const rightDir = rotateDirectionToRight(dir2);
      const opDir = opposeDirection(dir2);
      for (; checkDist < range; checkDist++) {
        if (window.fastView && car.id === 0 && (forbiddenCarsFlag & 1 << 5) === 0)
          console.log(">", explorer.x, explorer.y, forbiddenCarsFlag);
        explorer.move(turnDir, cmap);
        const road2 = explorer.getRoad();
        const checkToLeft = (flags) => {
          runCheck(
            leftDir,
            new GridExplorer(explorer),
            checkDist + 1,
            flags
          );
        };
        const checkToRight = (flags) => {
          runCheck(
            rightDir,
            new GridExplorer(explorer),
            checkDist + 1,
            flags
          );
        };
        let shouldBreak = false;
        switch (road2 & 7) {
          case roadtypes.types.VOID:
            shouldBreak = true;
            break;
          case roadtypes.types.ROAD:
            break;
          case roadtypes.types.TURN:
            const roadDir = road2 >> 6;
            if (roadDir === opDir) {
              shouldBreak = true;
              break;
            }
            const type = road2 >> 3 & 7;
            switch (type) {
              case roadtypes.TurnDirection.RIGHT:
                if (roadDir === rightDir)
                  checkToLeft(forbiddenCarsFlag);
                break;
              case roadtypes.TurnDirection.LEFT:
                if (roadDir === leftDir)
                  checkToRight(forbiddenCarsFlag);
                break;
              default: {
                let rightFlag = forbiddenCarsFlag;
                const arr = turnSideSelector.getConfig(type - 2);
                for (let i = 0; i < 8; i++) {
                  const flag = 1 << i;
                  switch (arr[i]) {
                    case 0:
                      rightFlag |= flag;
                      break;
                    case -1:
                      forbiddenCarsFlag |= flag;
                      rightFlag |= flag;
                      break;
                    case 1:
                      forbiddenCarsFlag |= flag;
                      break;
                  }
                }
                checkToRight(rightFlag);
                break;
              }
            }
            break;
          case roadtypes.types.SPAWNER:
            break;
          case roadtypes.types.CONSUMER:
            forbiddenCarsFlag |= 1 >> (road2 << 3 & 7);
            break;
          case roadtypes.types.PRIORITY:
            if (road2 >> 6 === opDir) {
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
        const over = explorer.chunk.getCar(explorer.x, explorer.y);
        if (over === "full" || over === "empty")
          continue;
        if (over.direction !== opDir || forbiddenCarsFlag & 1 << over.color)
          continue;
        const over_realMove = over.getCellDist();
        let over_entryDist = checkDist - over_realMove - CAR_SIZE / 2;
        let over_exitDist = over_entryDist + CAR_PASSAGE_LENGTH;
        if (over_entryDist < 0) {
          over_entryDist = 0;
          if (over_exitDist < 0) {
            over_exitDist = 0;
          }
        }
        const fastSpeed = exitDist * over.speed / over_entryDist;
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
    if (window.fastView && car.id === 0)
      console.log(pos.x, pos.y);
    if (checkRight) {
      runCheck(checkDir.rdir, new GridExplorer(pos), 1, 0);
    }
    if (checkLeft) {
      runCheck(checkDir.ldir, new GridExplorer(pos), 1, 0);
    }
    pos.move(dir.d, cmap);
  }
  if (car.color == CarColor.RED)
    console.log({
      lim: finalSpeed,
      fast: fastPrioritySpeed,
      acceleration: fastPriorityAcceleration,
      slow: slowPrioritySpeed
    });
  return {
    lim: finalSpeed,
    fast: fastPrioritySpeed,
    acceleration: fastPriorityAcceleration,
    slow: slowPrioritySpeed
  };
}
const RENDER_DISTANCE = 32;
let nextCarId = 0;
class Car {
  constructor(x, y, spawnerId, direction, color, score) {
    this.acceleration = 3e-3;
    this.deceleration = 8e-3;
    this.currentAcceleration = 0;
    this.currentSpeedTarget = 0;
    this.speedLimit = 0.2;
    this.speed = this.speedLimit;
    this.nextSpeed = this.speedLimit;
    this.nextSpeedTarget = this.speedLimit;
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
  getCellDist() {
    if (this.rotationStep >= 0)
      return Math.min(this.rotationStep, 1);
    return getCellDist(this.direction, this.x, this.y);
  }
  draw(ctx, road, iloader) {
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
      case roadtypes.types.TURN:
      case roadtypes.types.ALTERN: {
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
    let roadToReturn = null;
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
            case roadtypes.TurnDirection.RIGHT:
              this.rotatingToRight = true;
              this.rotationStep = 0;
              break;
            case roadtypes.TurnDirection.LEFT:
              this.rotatingToRight = false;
              this.rotationStep = 0;
              break;
            default:
              switch (turnSideSelector.getConfig(type - 2)[this.color]) {
                case 0:
                  break;
                case -1:
                  this.rotatingToRight = false;
                  this.rotationStep = 0;
                  break;
                case 1:
                  this.rotatingToRight = true;
                  this.rotationStep = 0;
                  break;
              }
              break;
          }
          break;
        }
        case roadtypes.types.ALTERN: {
          const direction = road >> 6 & 3;
          if (this.direction !== direction)
            break;
          let code = road >> 3 & 3;
          switch (code) {
            case 0:
              code = 1;
              break;
            case 1:
              this.rotatingToRight = true;
              this.rotationStep = 0;
              code = 2;
              break;
            case 2:
              code = 3;
              break;
            case 3:
              this.rotatingToRight = false;
              this.rotationStep = 0;
              code = road & 1 << 5 ? 1 : 0;
              break;
          }
          roadToReturn = road & -25 | (code & 3) << 3;
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
    if ((road & 7) === roadtypes.types.VOID) {
      alive = "killed";
    } else {
      const speed2 = getDanger(this, RENDER_DISTANCE, game.chunkMap);
      if (speed2.lim < speedTarget) {
        speedTarget = speed2.lim;
      }
      if ((speed2.fast > speedTarget || speed2.acceleration > this.acceleration) && speed2.slow < speedTarget) {
        speedTarget = speed2.slow;
      }
      if (speedTarget < 0)
        speedTarget = 0;
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
    this.nextSpeedTarget = speedTarget;
    if (alive === "alive" && roadToReturn !== null) {
      return roadToReturn;
    }
    return alive;
  }
  move() {
    this.currentAcceleration = this.nextSpeed - this.speed;
    this.currentSpeedTarget = this.nextSpeedTarget;
    this.speed = this.nextSpeed;
    if (this.rotationStep < 0) {
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
      this.rotationStep = -1;
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
  drawGrid(ctx, iloader, drawBackground) {
    if (drawBackground) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, _Chunk.SIZE, _Chunk.SIZE);
    }
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
  runEvents(lightTick) {
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
      Math.floor(lightTick) % 4,
      Math.floor(lightTick) % 8,
      Math.floor(lightTick) % 16,
      Math.floor(lightTick)
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
    const x = spawner.x;
    const y = spawner.y;
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
    this.gameArea = { x: 0, y: 0 };
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
    const c2 = this.getChunk(p.cx, p.cy);
    return c2.getRoad(p.rx, p.ry);
  }
  setRoad(x, y, road) {
    const p = ChunkMap.getPoint(x, y);
    const c2 = this.getChunk(p.cx, p.cy);
    c2.setRoad(p.rx, p.ry, road);
  }
  getLight(x, y) {
    const p = ChunkMap.getPoint(x, y);
    const c2 = this.getChunk(p.cx, p.cy);
    return c2.getLight(p.rx, p.ry);
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
    input.onMouseUp = (e) => {
    };
    input.onMouseDown = (e) => {
    };
    input.onMouseMove = (e) => {
    };
    input.onScroll = (e) => {
    };
    input.onTouchStart = (e) => {
    };
    input.onTouchEnd = (e) => {
    };
    input.onTouchMove = (e) => {
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
var HandSelection = /* @__PURE__ */ ((HandSelection2) => {
  HandSelection2[HandSelection2["NONE"] = 0] = "NONE";
  HandSelection2[HandSelection2["ROAD"] = 1] = "ROAD";
  HandSelection2[HandSelection2["ERASE"] = 2] = "ERASE";
  HandSelection2[HandSelection2["ROTATE"] = 3] = "ROTATE";
  HandSelection2[HandSelection2["MOVE"] = 4] = "MOVE";
  HandSelection2[HandSelection2["TURN"] = 5] = "TURN";
  HandSelection2[HandSelection2["PRIORITY"] = 6] = "PRIORITY";
  HandSelection2[HandSelection2["LIGHT"] = 7] = "LIGHT";
  HandSelection2[HandSelection2["ALTERN"] = 8] = "ALTERN";
  return HandSelection2;
})(HandSelection || {});
const zoomContainerHtml = document.getElementById("zoomContainer");
const HAND_SELECTION_ICONS = [
  "icon_none",
  "icon_road",
  "icon_erase",
  "icon_rotate",
  "icon_move",
  "turn",
  "yield",
  "light_green",
  "filter_front"
];
class HandSelector {
  constructor(panelDiv) {
    this.currentMode = 0;
    this.panelDiv = panelDiv;
  }
  getDiv(idx) {
    return this.panelDiv.children[idx].children[0];
  }
  setMode(idx) {
    this.panelDiv.children[this.currentMode].classList.remove("selected");
    this.panelDiv.children[idx].classList.add("selected");
    this.currentMode = idx;
    if (idx === 4) {
      zoomContainerHtml.classList.remove("hidden");
    } else {
      zoomContainerHtml.classList.add("hidden");
    }
  }
  getMode() {
    return this.currentMode;
  }
  appendDivList() {
    const length = Object.values(HandSelection).length / 2;
    for (let i = 0; i < length; i++) {
      const div = document.createElement("div");
      const subDiv = document.createElement("div");
      div.appendChild(subDiv);
      this.panelDiv.appendChild(div);
      const idx = i;
      div.addEventListener("click", () => this.setMode(idx));
      div.addEventListener("touchstart", () => this.setMode(idx));
    }
    this.panelDiv.children[0].classList.add("selected");
  }
  showPanel() {
    this.panelDiv.classList.remove("hidden");
  }
  hidePanel() {
    this.setMode(
      0
      /* NONE */
    );
  }
}
const handSelector = new HandSelector(document.getElementById("handPanel"));
handSelector.appendDivList();
function produceStatsPanel(map) {
  const panel = document.createElement("div");
  panel.classList.add("statsPanel");
  panel.classList.add("shown");
  const table = document.createElement("table");
  const head = document.createElement("thead");
  const headRow = document.createElement("tr");
  for (const headerText of ["(x,y)", "rythm", "score", "color"]) {
    const th = document.createElement("th");
    th.textContent = headerText;
    headRow.appendChild(th);
  }
  head.appendChild(headRow);
  table.appendChild(head);
  const body = document.createElement("tbody");
  const sortedSpawners = [...map.carSpawners].sort((a, b2) => {
    if (a.score !== b2.score) {
      return b2.score - a.score;
    }
    return a.color - b2.color;
  });
  for (const spawner of sortedSpawners) {
    const row = document.createElement("tr");
    row.dataset.color = spawner.color.toString();
    if (spawner.color === CarColor.WHITE) {
      row.style.color = "#000";
    }
    const xy = document.createElement("td");
    xy.textContent = `(${spawner.x},${spawner.y})`;
    row.appendChild(xy);
    const rhythm = document.createElement("td");
    rhythm.textContent = String(spawner.rythm);
    row.appendChild(rhythm);
    const score = document.createElement("td");
    score.textContent = `+${spawner.score}`;
    row.appendChild(score);
    const color = document.createElement("td");
    color.textContent = CarColor[spawner.color] || String(spawner.color);
    row.appendChild(color);
    body.appendChild(row);
  }
  table.appendChild(body);
  const button = document.createElement("button");
  button.addEventListener("click", () => {
    panel.classList.toggle("shown");
  });
  const container = document.createElement("div");
  container.appendChild(turnSideSelector.getHtmlDiv());
  container.appendChild(table);
  panel.appendChild(button);
  panel.appendChild(container);
  return panel;
}
const timeLeftDiv = document.getElementById("timeLeft");
const scoreDiv = document.getElementById("score");
const mousePosDiv = document.getElementById("mousePos");
const lightTurnDiv = document.getElementById("lightTurn");
const FAST_TIMES = 4;
const LIGHT_TICK = 45;
class Game extends GameState {
  constructor() {
    super(...arguments);
    this.camera = { x: 0, y: 0, z: 20 };
    this.chunkMap = new ChunkMap();
    this.carFrame = 0;
    this.runningCars = false;
    this.score = 0;
    this.lastMouseX = 0;
    this.lastScreenMouseX = NaN;
    this.lastScreenMouseY = NaN;
    this.lastMouseY = 0;
    this.lightTick = 0;
    this.lightTickCouldown = 0;
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
    if (!window.DEBUG)
      return;
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
    this.lightTick = 0;
    this.lightTickCouldown = 0;
    document.getElementById("pause")?.togglePause(false);
    lightTurnDiv.textContent = this.lightTick.toString().padStart(2, "0");
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
    const zoomInc = document.getElementById("zoomInc");
    if (zoomInc) {
      zoomInc.onclick = () => this.camera.z *= 1.3;
    }
    const zoomDec = document.getElementById("zoomDec");
    if (zoomDec) {
      zoomDec.onclick = () => this.camera.z /= 1.3;
    }
  }
  enter(data, input) {
    const mapConstructor = data;
    mapConstructor.fill(this.chunkMap);
    mapConstructor.setCamera(this.camera);
    const panel = produceStatsPanel(mapConstructor);
    document.body.appendChild(panel);
    this.statsPanel = panel;
    this.test();
    this.handleHTML();
    const updateMouse = (x, y) => {
      mousePosDiv.innerText = `(${x.toFixed(1)},${y.toFixed(1)})`;
      this.lastMouseX = x;
      this.lastMouseY = y;
    };
    const runMode = (smode, x, y, moving, mouseScreenX, mouseScreenY) => {
      let roadtype = null;
      if (moving && Math.floor(this.lastMouseX) === Math.floor(x) && Math.floor(this.lastMouseY) === Math.floor(y)) {
        return;
      }
      switch (smode) {
        case HandSelection.NONE:
          break;
        case HandSelection.ERASE:
          this.chunkMap.setRoad(x, y, roadtypes.types.VOID);
          break;
        case HandSelection.ROAD:
          this.placeRoad(x, y);
          break;
        case HandSelection.ROTATE: {
          const road = roadtypes.onRotation(
            this.chunkMap.getRoad(x, y)
          );
          if (road !== null) {
            this.chunkMap.setRoad(x, y, road);
          }
          break;
        }
        case HandSelection.MOVE: {
          if (isNaN(this.lastScreenMouseX) || isNaN(this.lastScreenMouseY))
            break;
          const dx = (this.lastScreenMouseX - mouseScreenX) * (4 / this.camera.z);
          const dy = (this.lastScreenMouseY - mouseScreenY) * (4 / this.camera.z);
          this.camera.x += dx;
          this.camera.y += dy;
          break;
        }
        case HandSelection.TURN:
          roadtype = roadtypes.types.TURN;
          break;
        case HandSelection.PRIORITY:
          roadtype = roadtypes.types.PRIORITY;
          break;
        case HandSelection.LIGHT:
          roadtype = roadtypes.types.LIGHT;
          break;
        case HandSelection.ALTERN:
          roadtype = roadtypes.types.ALTERN;
          break;
      }
      if (roadtype !== null) {
        const road = this.chunkMap.getRoad(x, y);
        if ((road & 7) === roadtype) {
          const next = roadtypes.onScroll(road, -1);
          if (next === null) {
            const rotated = roadtypes.onRotation(road);
            if (rotated !== null) {
              this.chunkMap.setRoad(x, y, rotated);
            }
          } else if (next === "light") {
            this.setLight(x, y, road);
          } else {
            this.chunkMap.setRoad(x, y, next);
          }
        } else {
          this.chunkMap.setRoad(x, y, roadtype);
        }
      }
      updateMouse(x, y);
    };
    const mouseUp = (clientX, clientY) => {
      this.lastScreenMouseX = NaN;
      this.lastScreenMouseY = NaN;
      const { x, y } = this.getMousePosition(clientX, clientY);
      updateMouse(x, y);
    };
    const mouseDown = (clientX, clientY, buttons, shiftKey) => {
      this.lastScreenMouseX = NaN;
      this.lastScreenMouseY = NaN;
      const { x, y } = this.getMousePosition(clientX, clientY);
      const smode = handSelector.getMode();
      if (smode) {
        runMode(smode, x, y, false, clientX, clientY);
        return;
      }
      const leftDown = (buttons & 1) !== 0;
      const rightDown = (buttons & 2) !== 0;
      if (leftDown) {
        if (shiftKey) {
          this.chunkMap.setRoad(x, y, roadtypes.types.VOID);
        } else {
          this.placeRoad(x, y);
        }
      }
      if (rightDown) {
        const newRoad = roadtypes.onRotation(
          this.chunkMap.getRoad(x, y)
        );
        if (newRoad !== null)
          this.chunkMap.setRoad(x, y, newRoad);
      }
      updateMouse(x, y);
    };
    const mouseMove = (clientX, clientY, buttons, shiftKey) => {
      let { x, y } = this.getMousePosition(clientX, clientY);
      const leftDown = (buttons & 1) !== 0;
      const middleDown = (buttons & 4) !== 0;
      if (middleDown) {
        this.camera.x += this.lastMouseX - x;
        this.camera.y += this.lastMouseY - y;
        const c2 = this.getMousePosition(clientX, clientY);
        x = c2.x;
        y = c2.y;
      }
      const smode = handSelector.getMode();
      if (smode && leftDown) {
        runMode(smode, x, y, true, clientX, clientY);
        this.lastScreenMouseX = clientX;
        this.lastScreenMouseY = clientY;
        return;
      }
      if (leftDown) {
        if (shiftKey) {
          this.chunkMap.setRoad(x, y, roadtypes.types.VOID);
        } else {
          this.placeRoad(x, y);
        }
      }
      updateMouse(x, y);
      this.lastScreenMouseX = clientX;
      this.lastScreenMouseY = clientY;
    };
    input.onMouseUp = (e) => mouseUp(e.clientX, e.clientY);
    input.onMouseDown = (e) => mouseDown(e.clientX, e.clientY, e.buttons, e.shiftKey);
    input.onMouseMove = (e) => mouseMove(e.clientX, e.clientY, e.buttons, e.shiftKey);
    input.onTouchStart = (e) => {
      this.lastScreenMouseX = NaN;
      this.lastScreenMouseY = NaN;
    };
    input.onTouchMove = (e) => mouseMove(e.touches[0].clientX, e.touches[0].clientY, 1, false);
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
        this.setLight(x, y, road);
      } else if (roadScroll) {
        this.chunkMap.setRoad(x, y, roadScroll);
      } else if (!leftDown && !rightDown) {
        this.camera.z -= this.camera.z * e.deltaY / 1e3;
      }
      updateMouse(x, y);
    };
    if (isTouchDevice()) {
      handSelector.showPanel();
    } else {
      handSelector.hidePanel();
    }
  }
  runCars() {
    for (let { car, chunk } of this.chunkMap.iterateCars()) {
      if (!car.alive)
        continue;
      const x = modulo(Math.floor(car.x), Chunk.SIZE);
      const y = modulo(Math.floor(car.y), Chunk.SIZE);
      const road = chunk.getRoad(x, y);
      const behave = car.behave(road, this);
      if (typeof behave === "number") {
        chunk.setRoad(x, y, behave);
      } else {
        switch (behave) {
          case "alive":
            break;
          case "won":
            this.score += car.score;
          case "killed":
            car.alive = false;
            break;
        }
      }
    }
    for (let { car } of this.chunkMap.iterateCars()) {
      car.move();
    }
    this.chunkMap.updateCarGrid(this.carFrame);
    this.carFrame++;
  }
  placeKeyboardRoads(input) {
    const x = Math.floor(this.lastMouseX);
    const y = Math.floor(this.lastMouseY);
    const current = this.chunkMap.getRoad(x, y);
    if (input.first("turnRight")) {
      const road = roadtypes.types.TURN | roadtypes.TurnDirection.RIGHT << 3 | current & 3 << 6;
      this.chunkMap.setRoad(x, y, road);
    } else if (input.first("turnLeft")) {
      const road = roadtypes.types.TURN | roadtypes.TurnDirection.LEFT << 3 | current & 3 << 6;
      this.chunkMap.setRoad(x, y, road);
    } else if (input.first("yieldIns")) {
      const road = roadtypes.types.PRIORITY | current & 3 << 6;
      this.chunkMap.setRoad(x, y, road);
    } else if (input.first("light")) {
      const road = roadtypes.types.LIGHT | current & 3 << 6;
      this.chunkMap.setRoad(x, y, road);
    } else if (input.first("altern")) {
      const road = roadtypes.types.ALTERN | current & 3 << 6;
      this.chunkMap.setRoad(x, y, road);
    }
  }
  runLightTicks() {
    this.lightTickCouldown++;
    if (this.lightTickCouldown >= LIGHT_TICK) {
      this.lightTickCouldown -= LIGHT_TICK;
      this.lightTick++;
      if (this.lightTick >= 32) {
        this.lightTick -= 32;
      }
      lightTurnDiv.textContent = this.lightTick.toString().padStart(2, "0");
    }
  }
  frame(game) {
    window.fastView = game.inputHandler.first("fastView");
    let times = game.inputHandler.press("fastView") ? FAST_TIMES : 1;
    this.placeKeyboardRoads(game.inputHandler);
    for (let i = 0; i < times; i++) {
      if (this.runningCars) {
        this.runLightTicks();
        for (let [_, chunk] of this.chunkMap) {
          chunk.runEvents(this.lightTick);
        }
        this.runCars();
        window.fastView = false;
      }
      if (this.carFrame >= this.chunkMap.time)
        return new TransitionState(this);
    }
    return null;
  }
  setLight(x, y, road) {
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
  }
  drawGrid(ctx, iloader) {
    for (let [_, chunk] of this.chunkMap) {
      ctx.save();
      ctx.translate(chunk.x * Chunk.SIZE, chunk.y * Chunk.SIZE);
      const drawBackground = chunk.x >= 0 && chunk.x < this.chunkMap.gameArea.x && chunk.y >= 0 && chunk.y < this.chunkMap.gameArea.y;
      chunk.drawGrid(ctx, iloader, drawBackground);
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
    if (this.statsPanel) {
      this.statsPanel.remove();
    }
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
    cmap.gameArea.x = Math.ceil(this.width / Chunk.SIZE);
    cmap.gameArea.y = Math.ceil(this.height / Chunk.SIZE);
    for (let i = 0; i < this.carSpawners.length; i++) {
      const spawner = this.carSpawners[i];
      const chunk = cmap.getChunk(
        Math.floor(spawner.x / Chunk.SIZE),
        Math.floor(spawner.y / Chunk.SIZE)
      );
      chunk.appendCarSpawner({
        x: modulo(spawner.x, Chunk.SIZE),
        y: modulo(spawner.y, Chunk.SIZE),
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
    input.onMouseUp = (e) => {
    };
    input.onMouseDown = (e) => {
    };
    input.onMouseMove = (e) => {
    };
    input.onScroll = (e) => {
    };
    input.onTouchStart = (e) => {
    };
    input.onTouchEnd = (e) => {
    };
    input.onTouchMove = (e) => {
    };
  }
  frame(game) {
    return new Game();
  }
  draw(args) {
  }
  exit() {
    if (window.DEBUG) {
      return LEVELS[0];
    } else {
      const v = prompt(`Level? [1 to ${LEVELS.length - 1}]`);
      if (v !== null)
        return LEVELS[+v];
    }
  }
  getCamera() {
    return null;
  }
}
function b(x, y, data = 8) {
  return { x, y, data };
}
function c(x, y, color) {
  return { x, y, data: roadtypes.types.CONSUMER | color << 3 };
}
function rect(x, y, w, h, data = 8) {
  const arr = [];
  for (let i = x; i < x + w; i++) {
    for (let j = y; j < y + h; j++) {
      arr.push(b(i, j, data));
    }
  }
  return arr;
}
const LEVELS = [
  new MapConstructor({
    time: 100 * 60,
    width: 31,
    height: 31,
    spawners: [
      {
        x: 13,
        y: 22,
        color: CarColor.RED,
        rythm: 90,
        couldown: 1,
        direction: Direction.UP,
        count: Infinity,
        score: 20
      },
      {
        x: 16,
        y: 8,
        color: CarColor.YELLOW,
        rythm: 30,
        couldown: 1,
        direction: Direction.DOWN,
        count: Infinity,
        score: 20
      },
      {
        x: 20,
        y: 15,
        color: CarColor.GREEN,
        rythm: 90,
        couldown: 1,
        direction: Direction.LEFT,
        count: Infinity,
        score: 20
      }
    ],
    roads: [
      c(13, 10, CarColor.RED),
      c(1, 7, CarColor.YELLOW),
      c(10, 15, CarColor.GREEN),
      ...rect(13, 10, 1, 12, 1),
      ...rect(16, 9, 1, 8, 1),
      ...rect(10, 15, 10, 1, 1)
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
        rythm: 22,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 1
      },
      {
        x: 1,
        y: 10,
        color: CarColor.BLUE,
        rythm: 22,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 1
      },
      {
        x: 20,
        y: 30,
        color: CarColor.CYAN,
        rythm: 120,
        couldown: 1,
        direction: Direction.UP,
        count: Infinity,
        score: 10
      }
    ],
    roads: [
      c(30, 5, CarColor.RED),
      c(20, 1, CarColor.CYAN),
      c(30, 10, CarColor.BLUE)
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
        rythm: 22,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 1
      },
      {
        x: 1,
        y: 10,
        color: CarColor.BLUE,
        rythm: 22,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 1
      },
      {
        x: 20,
        y: 30,
        color: CarColor.CYAN,
        rythm: 120,
        couldown: 1,
        direction: Direction.UP,
        count: Infinity,
        score: 10
      }
    ],
    roads: [
      c(30, 5, CarColor.BLUE),
      c(20, 1, CarColor.CYAN),
      c(30, 10, CarColor.RED)
    ]
  }),
  // Level 3
  new MapConstructor({
    time: 100 * 60,
    width: 31,
    height: 31,
    spawners: [
      {
        x: 1,
        y: 5,
        color: CarColor.RED,
        rythm: 25,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 1
      },
      {
        x: 1,
        y: 7,
        color: CarColor.RED,
        rythm: 25,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 1
      },
      {
        x: 1,
        y: 9,
        color: CarColor.RED,
        rythm: 25,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 1
      },
      {
        x: 5,
        y: 1,
        color: CarColor.RED,
        rythm: 25,
        couldown: 1,
        direction: Direction.DOWN,
        count: Infinity,
        score: 1
      },
      {
        x: 7,
        y: 1,
        color: CarColor.RED,
        rythm: 25,
        couldown: 1,
        direction: Direction.DOWN,
        count: Infinity,
        score: 1
      },
      {
        x: 9,
        y: 1,
        color: CarColor.RED,
        rythm: 25,
        couldown: 1,
        direction: Direction.DOWN,
        count: Infinity,
        score: 1
      },
      {
        x: 20,
        y: 1,
        color: CarColor.BLUE,
        rythm: 90,
        couldown: 1,
        direction: Direction.DOWN,
        count: Infinity,
        score: 15
      },
      {
        x: 1,
        y: 20,
        color: CarColor.CYAN,
        rythm: 90,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 15
      }
    ],
    roads: [
      c(30, 20, CarColor.CYAN),
      c(20, 30, CarColor.BLUE),
      c(26, 27, CarColor.RED),
      c(28, 27, CarColor.RED)
    ]
  }),
  // Level 4
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
        color: CarColor.PINK,
        rythm: 360,
        couldown: 1,
        direction: Direction.LEFT,
        count: Infinity,
        score: 5
      },
      {
        x: 31,
        y: 15,
        color: CarColor.PINK,
        rythm: 360,
        couldown: 180,
        direction: Direction.LEFT,
        count: Infinity,
        score: 5
      }
    ],
    roads: [
      b(16, 0),
      b(16, 1),
      b(16, 2),
      b(16, 3),
      b(16, 4),
      b(16, 5),
      b(16, 6),
      b(16, 7),
      b(16, 8),
      b(16, 9),
      b(16, 10),
      b(16, 11),
      b(16, 12),
      b(16, 13),
      b(16, 14),
      b(16, 19),
      b(16, 20),
      b(16, 21),
      b(16, 22),
      b(16, 23),
      b(16, 24),
      b(16, 25),
      b(16, 26),
      b(16, 27),
      b(16, 28),
      b(16, 29),
      b(16, 30),
      b(16, 31),
      b(17, 0),
      b(17, 1),
      b(17, 2),
      b(17, 3),
      b(17, 4),
      b(17, 5),
      b(17, 6),
      b(17, 7),
      b(17, 8),
      b(17, 9),
      b(17, 10),
      b(17, 11),
      b(17, 12),
      b(17, 13),
      b(17, 14),
      b(17, 19),
      b(17, 20),
      b(17, 21),
      b(17, 22),
      b(17, 23),
      b(17, 24),
      b(17, 25),
      b(17, 26),
      b(17, 27),
      b(17, 28),
      b(17, 29),
      b(17, 30),
      b(17, 31),
      c(28, 2, CarColor.RED),
      c(28, 9, CarColor.YELLOW),
      c(28, 23, CarColor.BLUE),
      c(28, 30, CarColor.CYAN),
      c(1, 17, CarColor.PINK)
    ]
  }),
  // Level 5
  new MapConstructor({
    time: 150 * 60,
    width: 31,
    height: 31,
    spawners: [
      // Red
      {
        x: 1,
        y: 16,
        color: CarColor.RED,
        rythm: 15,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 1
      },
      {
        x: 1,
        y: 17,
        color: CarColor.RED,
        rythm: 15,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 1
      },
      // Yellow
      {
        x: 30,
        y: 14,
        color: CarColor.YELLOW,
        rythm: 15,
        couldown: 1,
        direction: Direction.LEFT,
        count: Infinity,
        score: 1
      },
      {
        x: 30,
        y: 15,
        color: CarColor.YELLOW,
        rythm: 15,
        couldown: 1,
        direction: Direction.LEFT,
        count: Infinity,
        score: 1
      },
      // Blue
      {
        x: 14,
        y: 1,
        color: CarColor.BLUE,
        rythm: 15,
        couldown: 1,
        direction: Direction.DOWN,
        count: Infinity,
        score: 1
      },
      {
        x: 15,
        y: 1,
        color: CarColor.BLUE,
        rythm: 15,
        couldown: 1,
        direction: Direction.DOWN,
        count: Infinity,
        score: 1
      },
      // Cyan
      {
        x: 16,
        y: 30,
        color: CarColor.GREEN,
        rythm: 15,
        couldown: 1,
        direction: Direction.UP,
        count: Infinity,
        score: 1
      },
      {
        x: 17,
        y: 30,
        color: CarColor.GREEN,
        rythm: 15,
        couldown: 1,
        direction: Direction.UP,
        count: Infinity,
        score: 1
      },
      // Green
      {
        x: 3,
        y: 2,
        color: CarColor.CYAN,
        rythm: 60,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 20
      },
      // White
      {
        x: 2,
        y: 3,
        color: CarColor.WHITE,
        rythm: 60,
        couldown: 1,
        direction: Direction.DOWN,
        count: Infinity,
        score: 20
      },
      // Pink
      {
        x: 5,
        y: 5,
        color: CarColor.PINK,
        rythm: 60,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 30
      }
    ],
    roads: [
      c(30, 16, CarColor.RED),
      c(30, 17, CarColor.RED),
      c(1, 14, CarColor.YELLOW),
      c(1, 15, CarColor.YELLOW),
      c(14, 30, CarColor.BLUE),
      c(15, 30, CarColor.BLUE),
      c(16, 1, CarColor.GREEN),
      c(17, 1, CarColor.GREEN),
      c(29, 29, CarColor.PINK),
      c(29, 2, CarColor.CYAN),
      c(2, 29, CarColor.WHITE)
    ]
  }),
  // Level 6
  new MapConstructor({
    time: 200 * 60,
    width: 31,
    height: 31,
    spawners: [
      // Top left
      {
        x: 1,
        y: 3,
        color: CarColor.RED,
        rythm: 25,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 1
      },
      {
        x: 1,
        y: 5,
        color: CarColor.YELLOW,
        rythm: 25,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 1
      },
      // Bottom left
      {
        x: 5,
        y: 30,
        color: CarColor.BLUE,
        rythm: 25,
        couldown: 1,
        direction: Direction.UP,
        count: Infinity,
        score: 1
      },
      {
        x: 3,
        y: 30,
        color: CarColor.YELLOW,
        rythm: 25,
        couldown: 1,
        direction: Direction.UP,
        count: Infinity,
        score: 1
      },
      // Bottom right
      {
        x: 30,
        y: 28,
        color: CarColor.BLUE,
        rythm: 25,
        couldown: 1,
        direction: Direction.LEFT,
        count: Infinity,
        score: 1
      },
      {
        x: 30,
        y: 26,
        color: CarColor.GREEN,
        rythm: 25,
        couldown: 1,
        direction: Direction.LEFT,
        count: Infinity,
        score: 1
      },
      // Top right
      {
        x: 28,
        y: 1,
        color: CarColor.GREEN,
        rythm: 25,
        couldown: 1,
        direction: Direction.DOWN,
        count: Infinity,
        score: 1
      },
      {
        x: 26,
        y: 1,
        color: CarColor.RED,
        rythm: 25,
        couldown: 1,
        direction: Direction.DOWN,
        count: Infinity,
        score: 1
      }
    ],
    roads: [
      ...rect(15, 1, 2, 10),
      ...rect(15, 21, 2, 10),
      ...rect(1, 15, 10, 2),
      ...rect(21, 15, 10, 2),
      ...rect(13, 13, 6, 6),
      c(3, 1, CarColor.GREEN),
      c(5, 1, CarColor.BLUE),
      c(1, 26, CarColor.GREEN),
      c(1, 28, CarColor.RED),
      c(26, 30, CarColor.RED),
      c(28, 30, CarColor.YELLOW),
      c(30, 3, CarColor.BLUE),
      c(30, 5, CarColor.YELLOW)
    ]
  }),
  // Level 7
  new MapConstructor({
    time: 100 * 60,
    width: 31,
    height: 31,
    spawners: [
      // Bottom line
      {
        x: 21,
        y: 30,
        color: CarColor.RED,
        rythm: 20,
        couldown: 1,
        direction: Direction.UP,
        count: Infinity,
        score: 1
      },
      {
        x: 23,
        y: 30,
        color: CarColor.YELLOW,
        rythm: 60,
        couldown: 1,
        direction: Direction.UP,
        count: Infinity,
        score: 7
      },
      {
        x: 24,
        y: 30,
        color: CarColor.RED,
        rythm: 20,
        couldown: 1,
        direction: Direction.UP,
        count: Infinity,
        score: 1
      },
      {
        x: 22,
        y: 29,
        color: CarColor.WHITE,
        rythm: 40,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 3
      },
      {
        x: 30,
        y: 10,
        color: CarColor.PINK,
        rythm: 90,
        couldown: 1,
        direction: Direction.LEFT,
        count: Infinity,
        score: 20
      }
    ],
    roads: [
      c(23, 1, CarColor.RED),
      c(24, 1, CarColor.WHITE),
      c(25, 1, CarColor.RED),
      c(1, 10, CarColor.PINK),
      c(1, 9, CarColor.YELLOW)
    ]
  }),
  // Level 8
  new MapConstructor({
    time: 200 * 60,
    width: 31,
    height: 31,
    spawners: [
      // Right side
      {
        x: 7,
        y: 1,
        color: CarColor.BLUE,
        rythm: 20,
        couldown: 1,
        direction: Direction.DOWN,
        count: Infinity,
        score: 1
      },
      {
        x: 8,
        y: 1,
        color: CarColor.GREEN,
        rythm: 60,
        couldown: 1,
        direction: Direction.DOWN,
        count: Infinity,
        score: 7
      },
      {
        x: 10,
        y: 1,
        color: CarColor.BLUE,
        rythm: 20,
        couldown: 1,
        direction: Direction.DOWN,
        count: Infinity,
        score: 1
      },
      {
        x: 9,
        y: 2,
        color: CarColor.GRAY,
        rythm: 40,
        couldown: 1,
        direction: Direction.LEFT,
        count: Infinity,
        score: 3
      },
      {
        x: 1,
        y: 21,
        color: CarColor.CYAN,
        rythm: 90,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 20
      },
      // Right side
      {
        x: 21,
        y: 30,
        color: CarColor.RED,
        rythm: 20,
        couldown: 1,
        direction: Direction.UP,
        count: Infinity,
        score: 1
      },
      {
        x: 23,
        y: 30,
        color: CarColor.YELLOW,
        rythm: 60,
        couldown: 1,
        direction: Direction.UP,
        count: Infinity,
        score: 7
      },
      {
        x: 24,
        y: 30,
        color: CarColor.RED,
        rythm: 20,
        couldown: 1,
        direction: Direction.UP,
        count: Infinity,
        score: 1
      },
      {
        x: 22,
        y: 29,
        color: CarColor.WHITE,
        rythm: 40,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 3
      },
      {
        x: 30,
        y: 10,
        color: CarColor.PINK,
        rythm: 90,
        couldown: 1,
        direction: Direction.LEFT,
        count: Infinity,
        score: 20
      }
    ],
    roads: [
      // Left side
      c(6, 30, CarColor.BLUE),
      c(7, 30, CarColor.GRAY),
      c(8, 30, CarColor.BLUE),
      c(30, 21, CarColor.CYAN),
      c(30, 22, CarColor.GREEN),
      // Right side
      c(23, 1, CarColor.RED),
      c(24, 1, CarColor.WHITE),
      c(25, 1, CarColor.RED),
      c(1, 10, CarColor.PINK),
      c(1, 9, CarColor.YELLOW)
    ]
  }),
  // Level 9
  new MapConstructor({
    time: 100 * 60,
    width: 31,
    height: 31,
    spawners: [
      ...Array.from({ length: 7 }, (_, i) => ({
        x: 7 + 3 * i,
        y: 30,
        color: CarColor.RED,
        rythm: 15,
        couldown: 1,
        direction: Direction.UP,
        count: Infinity,
        score: 1
      })),
      {
        x: 1,
        y: 8,
        color: CarColor.YELLOW,
        rythm: 50,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 20
      }
    ],
    roads: [
      ...Array.from({ length: 7 }, (_, i) => c(
        7 + 3 * i,
        1,
        CarColor.RED
      )),
      ...Array.from({ length: 7 }).flatMap((_, i) => rect(
        7 + 3 * i,
        1,
        1,
        30,
        1
      )),
      c(30, 8, CarColor.YELLOW)
    ]
  }),
  // Level 10
  new MapConstructor({
    time: 100 * 60,
    width: 31,
    height: 31,
    spawners: [
      {
        x: 15,
        y: 30,
        color: CarColor.RED,
        rythm: 30,
        couldown: 1,
        direction: Direction.UP,
        count: Infinity,
        score: 1
      },
      {
        x: 16,
        y: 30,
        color: CarColor.RED,
        rythm: 30,
        couldown: 1,
        direction: Direction.UP,
        count: Infinity,
        score: 1
      },
      {
        x: 17,
        y: 30,
        color: CarColor.RED,
        rythm: 30,
        couldown: 1,
        direction: Direction.UP,
        count: Infinity,
        score: 1
      },
      {
        x: 13,
        y: 28,
        color: CarColor.GREEN,
        rythm: 90,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 7
      },
      {
        x: 19,
        y: 28,
        color: CarColor.YELLOW,
        rythm: 75,
        couldown: 1,
        direction: Direction.LEFT,
        count: Infinity,
        score: 7
      },
      {
        x: 30,
        y: 10,
        color: CarColor.PINK,
        rythm: 120,
        couldown: 1,
        direction: Direction.LEFT,
        count: Infinity,
        score: 30
      }
    ],
    roads: [
      ...rect(12, 28, 1, 4),
      ...rect(20, 28, 1, 4),
      ...rect(12, 27, 3, 1),
      ...rect(18, 27, 3, 1),
      c(1, 5, CarColor.YELLOW),
      c(30, 5, CarColor.GREEN),
      c(1, 10, CarColor.PINK),
      c(15, 1, CarColor.RED),
      c(16, 1, CarColor.RED),
      c(17, 1, CarColor.RED)
    ]
  }),
  // Level 11
  new MapConstructor({
    time: 100 * 60,
    width: 31,
    height: 31,
    spawners: [
      {
        x: 8,
        y: 15,
        color: CarColor.RED,
        rythm: 30,
        couldown: 1,
        direction: Direction.RIGHT,
        count: Infinity,
        score: 1
      },
      {
        x: 23,
        y: 15,
        color: CarColor.YELLOW,
        rythm: 30,
        couldown: 1,
        direction: Direction.LEFT,
        count: Infinity,
        score: 1
      }
    ],
    roads: [
      ...rect(15, 1, 2, 14),
      ...rect(15, 16, 2, 15),
      c(23, 14, CarColor.RED),
      c(8, 14, CarColor.YELLOW)
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
  constructor(keyboardMode, mouseEventTarget, keydownEventTarget) {
    this.imgLoader = new ImageLoader(window.IMG_ROOT_PATH);
    this.inputHandler = new InputHandler(keyboardMode);
    this.inputHandler.startKeydownListeners(keydownEventTarget);
    this.inputHandler.startMouseListeners(mouseEventTarget);
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
      turn: "assets/turn/turn.png",
      all0: "assets/turn/all0.png",
      all1: "assets/turn/all1.png",
      all2: "assets/turn/all2.png",
      all3: "assets/turn/all3.png",
      all4: "assets/turn/all4.png",
      all5: "assets/turn/all5.png",
      yield: "assets/yield.png",
      light_red: "assets/lights/red.png",
      light_orange: "assets/lights/orange.png",
      light_green: "assets/lights/green.png",
      filter_front: "assets/filter/front.png",
      filter_turn: "assets/filter/turn.png",
      filter_share_front: "assets/filter/share-front.png",
      filter_share_turn: "assets/filter/share-turn.png",
      icon_none: "assets/icons/none.png",
      icon_move: "assets/icons/move.png",
      icon_erase: "assets/icons/erase.png",
      icon_road: "assets/icons/road.png",
      icon_rotate: "assets/icons/rotate.png"
    }).then(() => {
      for (const i of Object.values(HandSelection)) {
        if (typeof i !== "number") {
          continue;
        }
        setElementAsBackground(
          this.imgLoader.get(HAND_SELECTION_ICONS[i]),
          handSelector.getDiv(i)
        );
      }
    });
    this.imgLoader.load({
      zoomInc: "assets/icons/zoomInc.png",
      zoomDec: "assets/icons/zoomDec.png"
    }).then(() => {
      setElementAsBackground(
        this.imgLoader.get("zoomInc"),
        document.getElementById("zoomInc")
      );
      setElementAsBackground(
        this.imgLoader.get("zoomDec"),
        document.getElementById("zoomDec")
      );
    });
    this.imgLoader.loadWithColors(
      "#ac3232",
      GAME_COLORS,
      {
        consumer: "assets/consumer.png",
        spawner: "assets/spawner.png",
        car: "assets/car.png"
      }
    );
  }
  gameLogic() {
    this.inputHandler.update();
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
    canvas,
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
      } else if (window.DEBUG) {
        setTimeout(runGameLoop, 1e3 / 3);
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
