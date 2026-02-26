import { Car } from "./Car";
import { CAR_LINE, CAR_SIZE } from "./CAR_SIZE";
import { Chunk } from "./Chunk";
import { ChunkMap } from "./ChunkMap";
import { Direction, getCellDist, getDirectionDelta, opposeDirection, rotateDirectionToLeft, rotateDirectionToRight } from "./Direction";
import { modulo } from "./modulo";
import { roadtypes } from "./roadtypes";

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



const SIZE_LIM = (3 - CAR_SIZE - CAR_LINE) / 2;

export function getDanger(car: Car, range: number, cmap: ChunkMap) {
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
	const odir = opposeDirection(car.direction);
	const rd = getDirectionDelta(rdir);
	const ld = getDirectionDelta(ldir);
	const rop = opposeDirection(rdir);
	const lop = opposeDirection(ldir);


	
	const pos = new Position(car.x, car.y, cmap);

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

		let willBreak = false;
		if (dist > 0) {
			const over = pos.chunk.getCar(pos.x, pos.y);
			if (over === 'full') {
				limDist(dist - CAR_SIZE/2 - realMove);
				break;
			}

			if (over !== 'empty') {
				let carsDist;
				switch (car.direction) {
				case Direction.RIGHT:
					carsDist = Math.min(Math.floor(over.x), over.x - CAR_SIZE/2) - car.x;
					break;
					
				case Direction.UP:
					carsDist = car.y - Math.max(Math.floor(over.y+1), over.y + CAR_SIZE/2);
					break;

				case Direction.LEFT:
					carsDist = car.x - Math.max(Math.floor(over.x+1), over.x + CAR_SIZE/2);
					break;

				case Direction.DOWN:
					carsDist = Math.min(Math.floor(over.y), over.y - CAR_SIZE/2) - car.y;
					break;
				}

				carsDist -= CAR_SIZE/2;
				
				limDist(carsDist);
				willBreak = true;
			}

			// Check left and right cars cutting the road
			if (realMove < SIZE_LIM) {
				const leftPos = new Position(pos);
				leftPos.move(ld, cmap);
				const leftCar = pos.chunk.getCar(leftPos.x, leftPos.y);
	
	
				if (leftCar instanceof Car && leftCar.direction === rdir) {
					const subDist = getCellDist(leftCar.direction, leftCar.x, leftCar.y);
					if (subDist > SIZE_LIM) {
						limDist(dist - CAR_LINE/2 - realMove);
					}
				}
	
				const rightPos = new Position(pos);
				rightPos.move(rd, cmap);
				const rightCar = pos.chunk.getCar(rightPos.x, rightPos.y);
	
				if (rightCar instanceof Car && rightCar.direction === ldir) {
					const subDist = getCellDist(rightCar.direction, rightCar.x, rightCar.y);
					if (subDist > SIZE_LIM) {
						limDist(dist - CAR_LINE/2 - realMove);
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
		

		let entryDist = dist - realMove - CAR_SIZE/2;
		let exitDist = entryDist + CAR_PASSAGE_LENGTH;
		if (entryDist < 0) {
			entryDist = 0;
			if (exitDist < 0) {
				exitDist = 0;
			}
		}

		const runCheck = (
			turnDir: {x: number, y: number},
			opDir: Direction,
		) => {
			const check = new Position(pos);

			for (let checkDist = 1; checkDist < range; checkDist++) {
				check.move(turnDir, cmap);

				const road = check.chunk.getRoad(check.x, check.y);

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

				const over = check.chunk.getCar(check.x, check.y);
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