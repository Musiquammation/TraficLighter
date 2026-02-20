import { ImageLoader } from "../handler/ImageLoader";
import { Car } from "./Car";
import { CarColor } from "./CarColor";
import { ChunkMap } from "./ChunkMap";
import { roadtypes } from "./roadtypes";
import { HoleArray } from "./HoleArray";
import { Direction } from "./Direction";

interface CarSpawner {
	x: number;
	y: number;
	color: CarColor;
	rythm: number;
	couldown: number;
	direction: Direction;
}




export class Chunk {
	static SIZE = 64;

	static getIdx(x: number, y: number) {
		return y * Chunk.SIZE + x;
	}

	x: number;
	y: number;

	cars: Car[] = [];
	grid = new Uint8Array(Chunk.SIZE * Chunk.SIZE);
	carSpawners = new HoleArray<CarSpawner>();

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
		for (let car of this.cars) {
			const x = Math.floor(car.x) % Chunk.SIZE;
			const y = Math.floor(car.y) % Chunk.SIZE;

			const road = this.getRoad(x, y);
			car.draw(ctx, road);
		}
	}


	runEvents() {
		for (const [_, spawner] of this.carSpawners) {
			spawner.couldown--;
			if (spawner.couldown <= 0) {
				spawner.couldown += spawner.rythm;

				const car = new Car(
					this.x * Chunk.SIZE + spawner.x + .5,
					this.y * Chunk.SIZE + spawner.y + .5,
					spawner.direction,
					spawner.color
				);
				this.cars.push(car);
			}
		}
	}

	appendCarSpawner(spawner: CarSpawner) {
		const idx = this.carSpawners.append(spawner);
		const road = roadtypes.types.SPAWNER | (idx << 3);
		this.setRoad(spawner.x, spawner.y, road);
	}

}
