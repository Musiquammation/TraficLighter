import { ImageLoader } from "../handler/ImageLoader";
import { modulo } from "./modulo";
import { Car } from "./Car";
import { CarColor } from "./CarColor";
import { roadtypes } from "./roadtypes";
import { Direction } from "./Direction";

interface CarSpawner {
	x: number;
	y: number;
	color: CarColor;
	rythm: number;
	couldown: number;
	direction: Direction;
	count: number;
}


interface Light {
	flag: number;
};

export class Chunk {
	static SIZE = 64;

	static getIdx(x: number, y: number) {
		return y * Chunk.SIZE + x;
	}

	static getPos(idx: number) {
		return {
			x: idx % Chunk.SIZE,
			y: Math.floor(idx / Chunk.SIZE),
		}
	}

	x: number;
	y: number;
	
	private nextCarSlot = 0;
	private cars: Car[][] = Array(254).fill(null).map(() => []);
	private grid = new Uint8Array(Chunk.SIZE * Chunk.SIZE);
	private carGrid = new Uint8Array(Chunk.SIZE * Chunk.SIZE).fill(255);
	private carSpawners = new Map<number, CarSpawner>();
	private lights = new Map<number, Light>();

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}


	getRoad(x: number, y: number): roadtypes.road_t {
		const road = this.grid[Chunk.getIdx(x, y)];
 		return road;
	}

	setRoad(x: number, y: number, road: roadtypes.road_t) {
		const idx = Chunk.getIdx(x, y);
		this.grid[idx] = road;
	}


	drawGrid(ctx: CanvasRenderingContext2D, iloader: ImageLoader) {
		// Background
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, Chunk.SIZE, Chunk.SIZE);

		// Draw roads
		const paddingX = this.x * Chunk.SIZE;
		const paddingY = this.y * Chunk.SIZE;
		for (let y = 0; y < Chunk.SIZE; y++) {
			const realY = paddingY + y;
			
			for (let x = 0; x < Chunk.SIZE; x++) {
				const realX = paddingX + x;
				
				ctx.save();
				ctx.translate(x, y);

				const obj = this.getRoad(x, y);
				roadtypes.draw(ctx, iloader, obj);

				ctx.restore();
				
			}
		}
	}

	drawCars(ctx: CanvasRenderingContext2D) {
		for (const car of this.iterateCars()) {
			const x = modulo(Math.floor(car.x), Chunk.SIZE);
			const y = modulo(Math.floor(car.y), Chunk.SIZE);

			const road = this.getRoad(x, y);
			car.draw(ctx, road);
		}
	}


	runEvents(frameCount: number) {
		// Run car spawners
		for (const [idx, spawner] of this.carSpawners) {
			spawner.couldown--;
			if (spawner.couldown <= 0) {
				const car = new Car(
					this.x * Chunk.SIZE + spawner.x + .5,
					this.y * Chunk.SIZE + spawner.y + .5,
					spawner.direction,
					spawner.color
				);

				if (this.appendCar(car, spawner.x, spawner.y)) {
					spawner.count--;
					if (spawner.count <= 0) {
						this.carSpawners.delete(idx);
					}

				}
				
				spawner.couldown += spawner.rythm;
			}
		}

		// Run lights
		const frameCountMod = [
			Math.floor(frameCount/(8*30)) % 4,
			Math.floor(frameCount/(4*30)) % 8,
			Math.floor(frameCount/(2*30)) % 16,
			Math.floor(frameCount/(1*30)) % 32
		];

		console.log(frameCountMod[0]);

		for (const [idx, light] of this.lights) {
			const flag = light.flag;

			const pos = Chunk.getPos(idx);
			const road = this.getRoad(pos.x, pos.y);

			// Check type
			if ((road & 0x7) !== roadtypes.types.LIGHT) {
				this.lights.delete(idx);
				continue;
			}

			const sizeSlot = frameCountMod[(road >> 4) & 0x3];
			const now = !!(flag & (1 << sizeSlot));

			this.setRoad(pos.x, pos.y,
				now ? (road | (1<<3)) : (road & ~(1<<3)));

		}
	}



	appendCarSpawner(spawner: CarSpawner) {
		this.carSpawners.set(Chunk.getIdx(spawner.x, spawner.y), spawner);
		const road = roadtypes.types.SPAWNER;
		this.setRoad(spawner.x, spawner.y, road);
	}

	appendLight(light: Light, x: number, y: number) {
		this.lights.set(Chunk.getIdx(x, y), light);
		const road = roadtypes.types.LIGHT;
		this.setRoad(x, y, road);
	}


	*iterateCars() {
		for (const car of this.cars) {
			yield* car;
		}
	}


	appendCar(car: Car, x: number, y: number) {
		const idx = y * Chunk.SIZE + x;
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

	updateCarGrid(carsToMove: Car[], frameCount: number) {
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

				const cx = Math.floor(car.x / Chunk.SIZE);
				const cy = Math.floor(car.y / Chunk.SIZE);

				if (cx !== this.x || cy !== this.y) {
					cars.splice(i, 1);
					carsToMove.push(car);
					continue;
				}

				const x = modulo(Math.floor(car.x), Chunk.SIZE);
				const y = modulo(Math.floor(car.y), Chunk.SIZE);
				const idx = y * Chunk.SIZE + x;

				if (this.carGrid[idx] !== 255) {
					this.carGrid[idx] = 254;
				} else {
					this.carGrid[idx] = id;
				}
				
				car.frameLastPositionUpdate = frameCount; // frame already handled
			}
		}
	}

	getCar(x: number, y: number): Car | 'empty' | 'full' {
		const idx = this.carGrid[y * Chunk.SIZE + x];
		if (idx === 255)
			return 'empty';

		if (idx === 254)
			return 'full';

		for (const car of this.cars[idx]) {
			const carX = modulo(Math.floor(car.x), Chunk.SIZE);
			const carY = modulo(Math.floor(car.y), Chunk.SIZE);

			if (carX === x && carY === y)
				return car;
		}

		return 'empty';
	}

	getLight(x: number, y: number) {
		return this.lights.get(Chunk.getIdx(x, y));
	}
}
