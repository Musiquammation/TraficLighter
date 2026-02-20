import { Vector2 } from "../handler/Vector2";
import { CarColor } from "./CarColor";
import { ChunkMap } from "./ChunkMap";
import { Direction, getAttach, rotateDirectionToLeft, rotateDirectionToRight } from "./Direction";
import { Game } from "./Game";
import { roadtypes } from "./roadtypes";


const RENDER_DISTANCE = 16;

export class Car {
	direction: Direction;
	acceleration = .002;
	deceleration = .005;
	speedLimit = .1;
	speed = this.speedLimit;
	rotationStep = -1;
	rotatingToRight = false;
	color: CarColor;

	x: number;
	y: number;
	lastBlockX: number;
	lastBlockY: number;

	constructor(x: number, y: number, direction: Direction, color: CarColor) {
		this.x = x;
		this.y = y;
		this.direction = direction;
		this.color = color;
		this.lastBlockX = Math.floor(x);
		this.lastBlockY = Math.floor(y);
	}



	draw(ctx: CanvasRenderingContext2D, road: roadtypes.road_t) {
		ctx.save();
		
		ctx.fillStyle = "#f04";
		

		let x: number;
		let y: number;

		switch (road & 0x7) {
		case roadtypes.types.VOID:
		case roadtypes.types.ROAD:
			x = this.x;
			y = this.y;
			break;
	
		case roadtypes.types.TURN:
		{
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

		const size = .76;
		ctx.fillRect(x - size/2, y - size/2, size, size);

		ctx.restore();

	}

	behave(road: roadtypes.road_t, game: Game) {
		let externalSpeedLimit = Infinity;

		let speedTarget = this.speedLimit;
		let kill = false;

		const px = Math.floor(this.x);
		const py = Math.floor(this.y);

		// Entry in a new block
		if (px != this.lastBlockX || py != this.lastBlockY) {
			this.rotationStep = -1;

			switch (road & 0x7) {
			case roadtypes.types.VOID:
			case roadtypes.types.ROAD:
			case roadtypes.types.PRIORITY:
			case roadtypes.types.SPAWNER:
				break;

			case roadtypes.types.TURN:
			{
				const direction: Direction = ((road >> 6) & 0x3);
				if (this.direction !== direction)
					break;
				
				const type: roadtypes.TurnDirection = (road >> 3) & 0x7;

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
					console.log(game.frameCount);
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

					case 2:
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


			case roadtypes.types.CONSUMER:
			{
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


		// Update speed limit
		switch (road & 0x7) {
		case roadtypes.types.VOID:
		{
			speedTarget = 0;
			break;
		}

		case roadtypes.types.ROAD:
		case roadtypes.types.PRIORITY:
		case roadtypes.types.SPAWNER:
		case roadtypes.types.CONSUMER:
		{
			externalSpeedLimit = game.chunkMap.getDanger(this.x, this.y,
				this.direction, RENDER_DISTANCE, this.deceleration, this);

			break;
		}

		case roadtypes.types.TURN:
		{

			break;
		}
		
		}
		

		if (externalSpeedLimit < speedTarget)
			speedTarget = externalSpeedLimit;

		// Adapt speed to speedTarget
		if (this.speed < speedTarget) {
			this.speed += this.acceleration;
			if (this.speed > speedTarget) {
				this.speed = speedTarget;
			}
			
		} else if (this.speed > speedTarget) {
			this.speed -= this.deceleration;
			if (this.speed < speedTarget) {
				this.speed = speedTarget;
			}
		}


		return kill;
	}
	
	move(road: roadtypes.road_t) {
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

		switch (road & 0x7) {
		case roadtypes.types.VOID:
			return;

		case roadtypes.types.ROAD:
		case roadtypes.types.PRIORITY:
		case roadtypes.types.SPAWNER:
		case roadtypes.types.CONSUMER:
			basicMove();
			return;

		case roadtypes.types.TURN:
		{
			if (this.rotationStep < 0) {
				basicMove();
				return;
			}

			this.rotationStep += this.speed;

			if (this.rotationStep >= 1) {
				const nextDir = this.rotatingToRight ?
					rotateDirectionToRight(this.direction) :
					rotateDirectionToLeft(this.direction);

				let dx;
				let dy;
				switch (nextDir) {
				case Direction.RIGHT:
					dx = 1.01;
					dy = .5;
					break;

				case Direction.UP:
					dx = .5;
					dy = -.01;
					break;

				case Direction.LEFT:
					dx = -.01;
					dy = .5;
					break;

				case Direction.DOWN:
					dx = .5
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