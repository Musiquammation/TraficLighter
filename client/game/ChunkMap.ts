import { Car } from "./Car";
import { Chunk } from "./Chunk";
import { roadtypes } from "./roadtypes";
import { Direction, getCellDist, getDirectionDelta, opposeDirection, rotateDirectionToLeft, rotateDirectionToRight } from "./Direction";
import { modulo } from "./modulo";
import { CAR_SIZE, CAR_SPACING } from "./CAR_SIZE";


function produceChunkKey(x: number, y: number) {
	return (x << 16) ^ y;
}



interface Position {
	x: number;
	y: number;
	cx: number;
	cy: number;
	chunk: Chunk;
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




	private movePosition(p: Position, d: {x: number, y: number}) {
		p.x += d.x;
		p.y += d.y;

		// Update chunk
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

	getDanger(car: Car, range: number) {
		let finalSpeed = Infinity;
		const CAR_PASSAGE_LENGTH = 1 + CAR_SIZE;
		const invSpeed = 1 / car.speed;

		function limSpeed(lim: number) {
			if (lim < finalSpeed)
				finalSpeed = lim;

		}

		function limDist(dist: number, speed = 0) {
			let d = car.deceleration * dist;
			if (d >= 0)
				d = Math.sqrt(d);

			limSpeed(d + speed);
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


		// Check cars in front
		for (let dist = 1; dist < range; dist++) {
			this.movePosition(pos, d);

			const road = pos.chunk.getRoad(Math.floor(pos.x), Math.floor(pos.y));
			if ((road & 0x7) === 0) {
				limDist(dist - CAR_SIZE/2 - realMove);
				break; // no more road to check
			}

			let checkLeft = false;
			let checkRight = false;
			switch ((road & 0x7) as roadtypes.types) {
			case roadtypes.types.VOID:
				break;

			case roadtypes.types.ROAD:
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

			case roadtypes.types.FINAL:
				break;

			}


			const over = pos.chunk.getCar(Math.floor(pos.x), Math.floor(pos.y));
			if (over === 'full') {
				limSpeed(0);
				break;
			}

			if (over !== 'empty') {
				const carsDist = Math.max(Math.abs(over.x - car.x) + Math.abs(over.y - car.y));
				limDist(carsDist - 1, over.speed);

			}	


			// if (!checkRight && !checkLeft)
				// continue;
			

			const entryDist = Math.max(dist - realMove - CAR_SIZE/2, 0);
			const exitDist = entryDist + CAR_PASSAGE_LENGTH;


			if (checkRight) {
				const check = {
					x: pos.x,
					y: pos.y,
					cx: pos.cx,
					cy: pos.cy,
					chunk: pos.chunk
				};

				// this.movePosition(check, d);
				for (let checkDist = 1; checkDist < range; checkDist++) {
					this.movePosition(check, rd);

					const road = check.chunk.getRoad(Math.floor(check.x), Math.floor(check.y));
					if ((road & 0x7) === 0)
						break;

					const over = check.chunk.getCar(Math.floor(check.x), Math.floor(check.y));
					if (over === 'full' || over === 'empty')
						continue;

					if (over.direction !== rop)
						continue;

					const over_realMove = getCellDist(over.direction, over.x, over.y);
					const over_entryDist = Math.max(checkDist - over_realMove - CAR_SIZE/2, 0);
					const over_exitDist = over_entryDist + CAR_PASSAGE_LENGTH;

					const fastSpeed = exitDist * over.speed / over_entryDist;
					if (fastSpeed > fastPrioritySpeed)
						fastPrioritySpeed = fastSpeed;


					const slowSpeed = entryDist * over.speed / over_exitDist;
					if (slowSpeed < slowPrioritySpeed)
						slowPrioritySpeed = slowSpeed;

					break;
				}
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




