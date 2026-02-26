import { Vector2 } from "../handler/Vector2";
import { CarColor } from "./CarColor";
import { ChunkMap } from "./ChunkMap";
import { Direction, getAttach, rotateDirectionToLeft, rotateDirectionToRight } from "./Direction";
import { Game } from "./Game";
import { roadtypes } from "./roadtypes";
import { CAR_LINE, CAR_SIZE } from "./CAR_SIZE";
import { modulo } from "./modulo";
import { getDanger } from "./getDanger";


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

export class Car {
	direction: Direction;
	acceleration = .001;
	deceleration = .003;
	speedLimit = .2;
	speed = this.speedLimit;
	nextSpeed = this.speedLimit;
	rotationStep = -1;
	rotatingToRight = false;
	color: CarColor;
	frameLastPositionUpdate = -1;
	alive = true;
	id = nextCarId++;

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

		

		ctx.fillStyle = colors[modulo(this.id, colors.length)];
		

		let x: number;
		let y: number;
		let angle: number;

		switch (road & 0x7) {
		case roadtypes.types.VOID:
		case roadtypes.types.ROAD:
			x = this.x;
			y = this.y;
			angle = Math.PI/2 * this.direction;
			break;
	
		case roadtypes.types.TURN:
		{
			if (this.rotationStep >= 0) {
				const m = getAttach(this.direction, this.rotatingToRight, this.rotationStep);
				x = Math.floor(this.x) + m.x;
				y = Math.floor(this.y) + m.y;
				angle = m.angle - Math.PI/2; 

			} else {
				x = this.x;
				y = this.y;
				angle = Math.PI/2 * this.direction;
			}
			break;
		}

		default:
			x = this.x;
			y = this.y;
			angle = Math.PI/2 * this.direction;
		}


		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(angle);

		ctx.fillRect(-CAR_SIZE / 2, -CAR_LINE / 2, CAR_SIZE, CAR_LINE);

		ctx.fillStyle = "black";
		ctx.font = "1px consolas";
		ctx.fillText(
			modulo(this.id, 10).toString(),
			-CAR_SIZE / 2,
			CAR_SIZE / 2
		);

		ctx.restore();
	}

	behave(road: roadtypes.road_t, game: Game) {
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
			const speed = getDanger(this, RENDER_DISTANCE, game.chunkMap);
			if (speed.lim < speedTarget) {
				speedTarget = speed.lim;
			}

			if ((speed.fast > speedTarget || speed.acceleration > this.acceleration)
				&& speed.slow < speedTarget
			) {
				speedTarget = speed.slow;
			}

			if (speedTarget < 0)
				speedTarget = 0;


			break;
		}

		case roadtypes.types.TURN:
		{

			break;
		}

		case roadtypes.types.LIGHT:
		{

			break;
		}
		
		}
		


		// Adapt speed to speedTarget
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


		return kill;
	}
	
	move(road: roadtypes.road_t) {
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

		switch (road & 0x7) {
		case roadtypes.types.VOID:
			return;

		case roadtypes.types.ROAD:
		case roadtypes.types.PRIORITY:
		case roadtypes.types.SPAWNER:
		case roadtypes.types.CONSUMER:
		case roadtypes.types.LIGHT:
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