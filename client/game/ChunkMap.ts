import { Car } from "./Car";
import { Chunk } from "./Chunk";
import { roadtypes } from "./roadtypes";
import { Direction, getDirectionDelta, opposeDirection, rotateDirectionToLeft, rotateDirectionToRight } from "./Direction";


function produceChunkKey(x: number, y: number) {
	return (x << 16) ^ y;
}






export class ChunkMap {
	static getPoint(x: number, y: number) {
		const cx = Math.floor(x / Chunk.SIZE);
		const cy = Math.floor(x / Chunk.SIZE);
		const rx = Math.floor(x) % Chunk.SIZE;
		const ry = Math.floor(y) % Chunk.SIZE;

		return {cx, cy, rx, ry};
	}

	private map = new Map<number, Chunk>();

	getChunk(x: number, y: number) {
		const key = produceChunkKey(x, y);
		const chunk = this.map.get(key);
		if (chunk)
			return chunk;

		const newChunk = new Chunk(x, y);
		this.map.set(key, newChunk);
		return newChunk;
	}

	tryGetChunk(x: number, y: number) {
		return this.map.get(produceChunkKey(x, y));
	}

	[Symbol.iterator]() {
		return this.map[Symbol.iterator]();
	}

	*iterateCars() {
		for (const [_, chunk] of this.map) {
			for (let i = 0; i < chunk.cars.length; i++) {
				yield { car: chunk.cars[i], chunk, index: i };
			}
		}

	}



	getRoad(x: number, y: number) {
		const p = ChunkMap.getPoint(x, y);
		const c = this.getChunk(p.cx, p.cy);
		return c.getRoad(p.rx, p.ry);
	}

	setRoad(x: number, y: number, road: roadtypes.road_t) {
		const p = ChunkMap.getPoint(x, y);
		const c = this.getChunk(p.cx, p.cy);
		c.setRoad(p.rx, p.ry, road);
	}



	private getPathLength(ox: number, oy: number, dir: Direction, lim: number) {
		const d = getDirectionDelta(dir);
		const oppositeDir = opposeDirection(dir);

		let stop = false;
		for (let length = 1; length < lim; length++) {
			const road = this.getRoad(ox + d.x*length, oy + d.y*length);

			switch (road & 0x7) {
			case roadtypes.types.VOID:
				stop = true;
				break;

			case roadtypes.types.PRIORITY:
				if ((road >> 6) !== oppositeDir) {
					stop = true;
				}
				break;
			}


			if (stop) {
				return length-1;
			}
		}

		return lim;
	}

	getDanger(
		ox: number, oy: number,
		direction: Direction, distance: number,
		deceleration: number, skippedCar: Car | null
	) {
		let finalSpeedLimit = Infinity;

		const cox = Math.floor(ox);
		const coy = Math.floor(oy);

		const checkLine = (mx: number, my: number, dist: number, dir: Direction, forcedDir: Direction | null) => {
			const cmx = Math.floor(mx / Chunk.SIZE);
			const cmy = Math.floor(my / Chunk.SIZE);
			const chunks: Chunk[] = [
				this.getChunk(cmx, cmy)
			];

			const d = getDirectionDelta(dir)
			const ix = Math.floor(mx);
			const iy = Math.floor(my);
			const r = this.getPathLength(ix, iy, dir, dist);

			{
				const nmx = Math.floor((mx + d.x * r) / Chunk.SIZE);
				const nmy = Math.floor((my + d.y * r) / Chunk.SIZE);
				if (nmx !== cmx || nmy !== cmy) {
					chunks.push(this.getChunk(nmx, nmy));
				}
			}



			let nearest: Car | null = null;
			let nearDist = Infinity;
			for (let chunk of chunks) {
				for (let car of chunk.cars) {
					if (car === skippedCar || (forcedDir && car.direction !== forcedDir))
						continue;

					// Check car coords
					let valid;

					switch (dir) {
					case Direction.RIGHT:
						valid = (ix <= car.x && car.x <= ix+dist) && (iy <= car.y && car.y <= iy+1);
						break;

					case Direction.UP:
						valid = (iy-dist <= car.y && car.y <= iy) && (ix <= car.x && car.x <= ix+1);
						break;
						
					case Direction.LEFT:
						valid = (ix-dist <= car.x && car.x <= ix) && (iy <= car.y && car.y <= iy+1);
						break;

					case Direction.DOWN:
						valid = (iy <= car.y && car.y <= iy+dist) && (ix <= car.x && car.x <= ix+1);
						break;
					}

					if (!valid)
						continue;

					let subDist;
					if (d.x === 0) {
						subDist = Math.abs(my - car.y);
					} else {
						subDist = Math.abs(mx - car.x);
					}
					if (subDist < nearDist) {
						nearDist = subDist;
						nearest = car;
					}
				}
			}

			return {car: nearest, dist: nearDist};
		}



		let suppDist;
		switch (direction) {
			case Direction.RIGHT:
				suppDist = ox%1;
				break;

			case Direction.UP:
				suppDist = 1 - oy%1;
				break;

			case Direction.LEFT:
				suppDist = 1 - ox%1;
				break;

			case Direction.DOWN:
				suppDist = oy%1;
				break;
		}

		const d = getDirectionDelta(direction);

		// Check our line
		{
			const res = checkLine(ox, oy, distance, direction, null);
			if (res.car) {
				const lim = Math.sqrt(Math.max(res.dist - 1, 0) * deceleration);
				if (lim < finalSpeedLimit)
					finalSpeedLimit = lim;
			}
		}

		const leftDir = rotateDirectionToLeft(direction);
		const rightDir = rotateDirectionToRight(direction);


		// Get block limits and rectangles to check
		for (let dist = 0; dist < distance; dist++) {
			let x = cox + d.x*dist;
			let y = coy + d.y*dist;

			const road = this.getRoad(x, y);
			
			// Define speed and priority
			let speed = Infinity;
			let checkLeft = false;
			let checkRight = false;

			switch (road & 0x7) {
			case roadtypes.types.VOID:
				speed = 0;
				break;
			
			case roadtypes.types.ROAD:
				checkRight = true;
				break;

			case roadtypes.types.PRIORITY:
				if ((road >> 6) === direction) {
					checkRight = true;
					checkLeft = true;
				}
				break;


			case roadtypes.types.FINAL:
				break;
		
			}

			if (speed !== Infinity) {
				const lim = Math.sqrt((dist - suppDist) * deceleration) + speed;
				if (lim < finalSpeedLimit)
					finalSpeedLimit = lim;
			}

			if (dist === 0)
				continue;

			const apply = (d: number) => {
				const lim = Math.sqrt(Math.max((dist - suppDist + d - 1), 0) * deceleration);
				if (lim <= finalSpeedLimit)
					finalSpeedLimit = lim;
				
			}
			
			if (checkRight) {
				const rd = getDirectionDelta(rightDir);
				const res = checkLine(x + rd.x, y + rd.y, distance, rightDir, leftDir);
				if (res.car) {
					apply(res.dist);
				}
			}
			
			if (checkLeft) {
				const ld = getDirectionDelta(leftDir);
				const res = checkLine(x + ld.x, y + ld.y, distance, leftDir, rightDir);
				if (res.car) {
					apply(res.dist);
				}
			}

		}


		return finalSpeedLimit;
	}
	
}




