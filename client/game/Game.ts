import { GAME_HEIGHT, GAME_WIDTH } from "../handler/dimensions";
import { GameHandler } from "../handler/GameHandler";
import { DrawStateData, GameState } from "../handler/states";
import { Vector2 } from "../handler/Vector2";
import { Vector3 } from "../handler/Vector3";
import { Car } from "./Car";
import { Chunk } from "./Chunk";
import { ChunkMap } from "./ChunkMap";
import { roadtypes } from "./roadtypes";
import { Direction } from "./Direction";
import { InputHandler } from "../handler/InputHandler";
import { ImageLoader } from "../handler/ImageLoader";
import { CarColor } from "./CarColor";
import { PathGraph } from "./PathGraph";
import { modulo } from "./modulo";
import { lightSizeEditor } from "./LightSizeEditor";
import { TransitionState } from "../states/TransitionState";


const timeLeftDiv = document.getElementById("timeLeft")!;
const scoreDiv = document.getElementById("score")!;

export class Game extends GameState {
	private camera: Vector3 = {x: 8, y: 38, z: 80};

	chunkMap = new ChunkMap();
	private graph = new PathGraph(this.chunkMap);
	private carFrame = 0;
	private runningCars = false;
	private score = 0;
	
	private test() {
		const y = 33;
		
		for (let i = 0; i < 50; i++) {
			this.chunkMap.setRoad(i, y+3, roadtypes.types.ROAD);

			for (let j = 0; j < 7; j++) {
				this.chunkMap.setRoad(5 + 3*j, y+i, roadtypes.types.ROAD);
			}
		}

		this.chunkMap.setRoad(50, y+3, roadtypes.types.CONSUMER);
		this.chunkMap.setRoad(14, y, roadtypes.types.CONSUMER);
		// this.chunkMap.setRoad(11, y+3, roadtypes.types.TURN | (2<<3));

		const chunk = this.chunkMap.getChunk(0, 0);
		chunk.appendCarSpawner({
			x: 1,
			y: y+3,
			color: CarColor.RED,
			rythm: 	50,
			couldown: 1,
			direction: Direction.RIGHT,
			count: Infinity,
			currentId: 0,
			score: 1
		});

		chunk.appendCarSpawner({
			x: 14,
			y: y+8,
			color: CarColor.RED,
			rythm: 70,
			couldown: 0,
			direction: Direction.UP,
			count: Infinity,
			currentId: 0,
			score: 3
		});

		// this.chunkMap.time = 80*60;
		this.chunkMap.time = 3*60;
	}



	getMousePosition(mouseX: number, mouseY: number) {
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


	private handleHTML() {
		document.getElementById("gameView")?.classList.remove("hidden");

		const pause = document.getElementById("pause");
		if (pause) {
			pause.classList.add("inPause");
			pause.onclick = () => {
				pause.classList.toggle("inPause");
				this.runningCars = !this.runningCars;
			}
		}
	}

	enter(data: any, input: InputHandler): void {
		this.test();

		this.handleHTML();

		let lastX = 0;
		let lastY = 0;

		input.onMouseUp = e => {
			const {x,y} = this.getMousePosition(e.clientX, e.clientY);
			lastX = x;
			lastY = y;
		};
		
		input.onMouseDown = e => {
			const {x,y} = this.getMousePosition(e.clientX, e.clientY);
			lastX = x;
			lastY = y;

			const leftDown   = (e.buttons & 1) !== 0;
			const rightDown  = (e.buttons & 2) !== 0;
			const middleDown = (e.buttons & 4) !== 0;

			if (leftDown) {
				if (e.shiftKey) {
					this.chunkMap.setRoad(x, y, roadtypes.types.VOID);
				} else {
					this.chunkMap.setRoad(x, y, roadtypes.types.ROAD);
				}
			}

			if (rightDown) {
				this.chunkMap.setRoad(x, y,
					roadtypes.onRightClick(this.chunkMap.getRoad(x, y)));
			}
		};
		
		input.onMouseMove = e => {
			let {x,y} = this.getMousePosition(e.clientX, e.clientY);
			
			const leftDown   = (e.buttons & 1) !== 0;
			const rightDown  = (e.buttons & 2) !== 0;
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

		input.onScroll = e => {
			let {x,y} = this.getMousePosition(e.clientX, e.clientY);
						
			const leftDown   = (e.buttons & 1) !== 0;
			const rightDown  = (e.buttons & 2) !== 0;
			const middleDown = (e.buttons & 4) !== 0;

			const road = this.chunkMap.getRoad(x, y);
			if (rightDown) {
				let type = ((road & 0x7) + 1);
				if (type >= roadtypes.types.SPAWNER) {
					type = 1;
				}

				const nextRoad = (road & ~0x7) | type;
				this.chunkMap.setRoad(x, y, nextRoad);
				return;
			}

			const roadScroll = roadtypes.onScroll(road, e.deltaY);
			if (roadScroll === 'light') {
				const light = this.chunkMap.getLight(x, y);
				if (light) {
					lightSizeEditor.get(light.flag, (road >> 4) & 0x3).then(o => {
						light.flag = o.flag;

						let nextRoad = roadtypes.types.LIGHT;
						nextRoad |= road & (3<<6); // direction
						nextRoad |= o.cycleSize << 4;
						this.chunkMap.setRoad(x, y, nextRoad);
					});
					
				}

			} else if (roadScroll) {
				this.chunkMap.setRoad(x, y, roadScroll);
			} else if (!leftDown && !rightDown) {
				this.camera.z -= this.camera.z * e.deltaY / 1000;
			}
		}

	}

	runCars() {
		for (let [_, chunk] of this.chunkMap) {
			chunk.runEvents(this.carFrame);
		}

		// Behave cars
		for (let {car, chunk} of this.chunkMap.iterateCars()) {
			if (!car.alive)
				continue;

			const x = modulo(Math.floor(car.x), Chunk.SIZE);
			const y = modulo(Math.floor(car.y), Chunk.SIZE);
			const road = chunk.getRoad(x, y);
			if (car.behave(road, this)) {
				car.alive = false;
				this.score += car.score;
			}
		}


		// Move cars
		for (let {car, chunk} of this.chunkMap.iterateCars()) {
			const x = modulo(Math.floor(car.x), Chunk.SIZE);
			const y = modulo(Math.floor(car.y), Chunk.SIZE);
			const road = chunk.getRoad(x, y);
			car.move(road);
		}


		this.chunkMap.updateCarGrid(this.carFrame);

		this.carFrame++;
	}

	frame(game: GameHandler) {
		if (this.runningCars)
			this.runCars();

		if (this.carFrame < this.chunkMap.time)
			return null;

		return new TransitionState(this);
		
	}



	private drawGrid(ctx: CanvasRenderingContext2D, iloader: ImageLoader) {
		for (let [_, chunk] of this.chunkMap) {
			ctx.save();
			ctx.translate(chunk.x * Chunk.SIZE, chunk.y * Chunk.SIZE);
			chunk.drawGrid(ctx, iloader);
			ctx.restore();
		}
	}

	private drawCars(ctx: CanvasRenderingContext2D) {
		for (let [_, chunk] of this.chunkMap) {
			chunk.drawCars(ctx);
		}
	}

	private drawStats(ctx: CanvasRenderingContext2D) {
		// time at format mm:ss.u
		let leftTime: string = (() => {
			const time = Math.max(this.chunkMap.time - this.carFrame, 0);
			const totalSeconds = Math.floor(time / 60);
			const minutes = Math.floor(totalSeconds / 60);
			const seconds = totalSeconds % 60;
			const milliseconds = Math.floor((time % 60) / 6);
			return `${minutes.toString().padStart(1, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds}`;
		})();

		timeLeftDiv.innerText = leftTime;
		scoreDiv.innerText = this.score.toString().padStart(5, "0");
	}

	draw(args: DrawStateData): void {
		// Draw game
		args.followCamera();
		this.drawGrid(args.ctx, args.imageLoader);
		this.drawCars(args.ctx);
		args.unfollowCamera();


		// Draw stats
		this.drawStats(args.ctx);
	}

	exit() {
		document.getElementById("gameView")?.classList.add("hidden");
		return {score: this.score};	
	}

	getCamera() {
		return this.camera;
	}
}


