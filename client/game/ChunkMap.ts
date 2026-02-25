import { Car } from "./Car";
import { Chunk } from "./Chunk";
import { roadtypes } from "./roadtypes";
import { Direction, getCellDist, getDirectionDelta, opposeDirection, rotateDirectionToLeft, rotateDirectionToRight } from "./Direction";
import { modulo } from "./modulo";
import { CAR_SIZE, CAR_SPACING } from "./CAR_SIZE";


function produceChunkKey(x: number, y: number) {
	return (x << 16) ^ y;
}



class Position {
	x: number;
	y: number;
	cx: number;
	cy: number;
	chunk: Chunk;

	constructor(x: number, y: number, cmap: ChunkMap);
	constructor(other: Position);

	constructor(
		a: number | Position,
		b?: number,
		cmap?: ChunkMap
	) {
		if (a instanceof Position) {
			this.x = a.x;
			this.y = a.y;
			this.cx = a.cx;
			this.cy = a.cy;
			this.chunk = a.chunk;
			return;
		}

		if (typeof a === "number" && b !== undefined && cmap) {
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



	move(d: {x: number, y: number}, cmap: ChunkMap) {
		this.x += d.x;
		this.y += d.y;

		// Update chunk
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
}



export class ChunkMap {
	static getPoint(x: number, y: number) {
		const cx = Math.floor(x / Chunk.SIZE);
		const cy = Math.floor(x / Chunk.SIZE);
		const rx = modulo(Math.floor(x), Chunk.SIZE);
		const ry = modulo(Math.floor(y), Chunk.SIZE);

		return {cx, cy, rx, ry};
	}

	private chunks = new Map<number, Chunk>();

	getChunk(x: number, y: number) {
		const key = produceChunkKey(x, y);
		const chunk = this.chunks.get(key);
		if (chunk)
			return chunk;

		const newChunk = new Chunk(x, y);
		this.chunks.set(key, newChunk);
		return newChunk;
	}

	tryGetChunk(x: number, y: number) {
		return this.chunks.get(produceChunkKey(x, y));
	}

	[Symbol.iterator]() {
		return this.chunks[Symbol.iterator]();
	}

	*iterateCars() {
		for (const [_, chunk] of this.chunks)
			for (const car of chunk.iterateCars())
				yield { car, chunk};
			
		
	}



	getRoad(x: number, y: number) {
		const p = ChunkMap.getPoint(x, y);
		const c = this.getChunk(p.cx, p.cy);
		return c.getRoad(p.rx, p.ry);
	}

	setRoad(x: number, y: number, road: roadtypes.road_t) {
		const p = ChunkMap.getPoint(x, y);
		const c = this.getChunk(p.cx, p.cy);

		const currentRoadType = c.getRoad(p.rx, p.ry) & 0x7;
		if (currentRoadType === roadtypes.types.SPAWNER || currentRoadType === roadtypes.types.CONSUMER)
			return;

		c.setRoad(p.rx, p.ry, road);
	}

	getLight(x: number, y: number) {
		const p = ChunkMap.getPoint(x, y);
		const c = this.getChunk(p.cx, p.cy);
		return c.getLight(p.rx, p.ry);
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




	

	getDanger(car: Car, range: number) {
		let finalSpeed = Infinity;
		const CAR_PASSAGE_LENGTH = 1 + CAR_SIZE;
		const invSpeed = 1 / car.speed;

		function limSpeed(lim: number) {
			if (lim < finalSpeed)
				finalSpeed = lim;

		}

		function limDist(dist: number) {
			let d = car.deceleration * dist;
			if (d >= 0)
				d = Math.sqrt(d);

			limSpeed(d);
		}


		const realMove = getCellDist(car.direction, car.x, car.y);
		const d = getDirectionDelta(car.direction);

		const rdir = rotateDirectionToRight(car.direction);
		const ldir = rotateDirectionToLeft(car.direction);
		const rd = getDirectionDelta(rdir);
		const ld = getDirectionDelta(ldir);
		const rop = opposeDirection(rdir);
		const lop = opposeDirection(ldir);


		
		const pos = new Position(car.x, car.y, this);

		let fastPrioritySpeed = 0;
		let fastPriorityAcceleration = Infinity;
		let slowPrioritySpeed = Infinity;


		// Check cars in front
		for (let dist = 0; dist < range; dist++) {
			const road = pos.chunk.getRoad(Math.floor(pos.x), Math.floor(pos.y));

			let finish = false;
			let checkLeft = false;
			let checkRight = false;
			switch ((road & 0x7) as roadtypes.types) {
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
				if ((road >> 6) !== car.direction)
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
				if ((road >> 6) === car.direction && (road & (1<<3)) === 0)
					finish = true;
				
				checkRight = true;
				break;

			}


			if (finish) {
				limDist(dist - CAR_SIZE/2 - realMove);
				break; // no more road to check
			}

			if (dist > 0) {
				const over = pos.chunk.getCar(Math.floor(pos.x), Math.floor(pos.y));
				if (over === 'full') {
					limSpeed(0);
					break;
				}
	
				if (over !== 'empty') {
					const carsDist = Math.abs(over.x - car.x) + Math.abs(over.y - car.y);
					limDist(carsDist - 1);
				}				
			}


			pos.move(d, this);
			if (!checkRight && !checkLeft) {
				continue;
			}
			

			let entryDist = (dist+1) - realMove - CAR_SIZE/2;
			let exitDist = entryDist + CAR_PASSAGE_LENGTH;
			if (entryDist < 0) {
				entryDist = 0;
				if (exitDist < 0) {
					exitDist = 0;
				}
			}

			const runCheck = (
				turnDir: {x: number, y: number},
				frontDir: {x: number, y: number},
				opDir: Direction,
			) => {
				const check = new Position(pos);

				for (let checkDist = 1; checkDist < range; checkDist++) {
					check.move(turnDir, this);

					const road = check.chunk.getRoad(Math.floor(check.x), Math.floor(check.y));

					let shouldBreak = false;
					switch ((road & 0x7) as roadtypes.types) {
					case roadtypes.types.VOID:
						shouldBreak = true;
						break;

					case roadtypes.types.ROAD:
					case roadtypes.types.TURN:
					case roadtypes.types.SPAWNER:
					case roadtypes.types.CONSUMER:
						break;

					case roadtypes.types.PRIORITY:
						if ((road >> 6) == opDir) {
							shouldBreak = true;
						}
						break;

					case roadtypes.types.LIGHT:
						if ((road >> 6) == opDir && (road & (1<<3)) === 0) {
							shouldBreak = true;
						}
						break;
					}

					if (shouldBreak)
						break;

					const over = check.chunk.getCar(Math.floor(check.x), Math.floor(check.y));
					if (over === 'full' || over === 'empty')
						continue;

					if (over.direction !== opDir)
						continue;

					const over_realMove = getCellDist(over.direction, over.x, over.y);
					let over_entryDist = checkDist - over_realMove - CAR_SIZE/2;
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
						fastPriorityAcceleration = .5 * (fastSpeed*fastSpeed -
							car.speed*car.speed) / exitDist;
					}


					const slowSpeed = entryDist * over.speed / over_exitDist;

					if (slowSpeed < slowPrioritySpeed)
						slowPrioritySpeed = slowSpeed;

					break;
				}
			}



			if (checkRight) {
				runCheck(rd, d, rop);
			}

			if (checkLeft) {
				runCheck(ld, d, lop);
			}
		}




		return {
			lim: finalSpeed,
			fast: fastPrioritySpeed,
			acceleration: fastPriorityAcceleration,
			slow: slowPrioritySpeed
		};
	}


	updateCarGrid(frameCount: number) {
		const carsChangingChunk: Car[] = [];

		// Reset grid and move cars in the same chunk
		for (let [_, chunk] of this.chunks) {
			chunk.updateCarGrid(carsChangingChunk, frameCount);
		}

		// Add missing cars
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




