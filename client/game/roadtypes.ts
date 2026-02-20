import { ImageLoader } from "../handler/ImageLoader";
import {Direction} from "./Direction"

export namespace roadtypes {
	export type road_t = number;

	/**
	 * [+0,+1,+2]: type
	 * [+3,+4,+5,+6,+7]: data
	 */
	export enum types {
		/**
		 * No data
		 */
		VOID = 0,

		/**
		 * No data
		 */
		ROAD,

		/**
		 * [+3,+4,+5]: type
		 * [+6, +7]: origin direction
		*/
		TURN,
		
		
		/**
		 * [+6, +7]: origin direction
		 */
		PRIORITY,

		SPAWNER,

		/**
		 * [+3,+4,+5,+6,+7]: color
		 */
		CONSUMER,

		FINAL
	}

	export enum TurnDirection {
		FRONT,
		RIGHT,
		LEFT,
		FRONT_RIGHT,
		FRONT_LEFT,
		LEFT_AND_RIGHT,
		ALL,
		BACK,
		LENGTH
	}



	export function generateExtraData(road: road_t): any {
		switch (road & 0x7) {
		case types.VOID:
			return null;
		
		case types.ROAD:
			return null;

		case types.TURN:
			return null;

		default:
			throw new Error("Invalid road type");
		}
	}

	
	export function draw(ctx: CanvasRenderingContext2D, iloader: ImageLoader, road: road_t) {
		function drawImage(name: string, angle: number, flip = {x: false, y: false}) {
			ctx.save();
			ctx.translate(0.5, 0.5);
			ctx.scale(flip.x ? -1 : 1, flip.y ? -1 : 1);
			ctx.rotate(angle);

			ctx.imageSmoothingEnabled = false;
			ctx.drawImage(iloader.get(name), -0.5, -0.5, 1, 1);
			ctx.restore();
		}


		switch (road & 0x7) {
		case types.VOID:
			return;

		case types.ROAD:
		{
			ctx.fillStyle = "#877";
			ctx.fillRect(0, 0, 1, 1);
			return;
		}

		case types.TURN:
		{
			const type: TurnDirection = (road >> 3) & 0x7;
			const direction = Math.PI/2 * ((road >> 6) & 0x3);

			switch (type) {
			case TurnDirection.FRONT:
				drawImage('turn_front', direction);
				break;

			case TurnDirection.RIGHT:
				drawImage('turn_turn', direction);
				break;

			case TurnDirection.LEFT:
				drawImage('turn_turn', direction, {x: false, y: true});
				break;
				
			case TurnDirection.FRONT_RIGHT:
				drawImage('turn_select', direction);
				break;

			case TurnDirection.FRONT_LEFT:
				drawImage('turn_select', direction, {x: false, y: true});
				break;				
				
			case TurnDirection.LEFT_AND_RIGHT:
				drawImage('turn_full', direction);
				break;
				
			case TurnDirection.ALL:
				drawImage('turn_all', direction);
				break;

			case TurnDirection.BACK:
				drawImage('', direction);
				break;

			}

			return;
		}

		case types.PRIORITY:
		{
			const direction = Math.PI/2 * ((road >> 6) & 0x3);
			drawImage('yeild', direction);
			break;
		}

		case types.SPAWNER:
		{
			drawImage('', 0);
			break;
		}

		case types.CONSUMER:
		{
			drawImage('', 0);
			break;
		}

		default:
			throw new Error("Invalid road type");
		}
	}


	export function onRightClick(road: road_t): road_t {
		switch (road & 0x7) {
		case types.VOID:
		case types.ROAD:
			return road;

		case types.TURN:
		case types.PRIORITY:
		{
			let dir = (road >> 6) & 0x3;
			dir++;
			dir &= 0x3;

			road = (road & ~(0x3 << 6)) | (dir << 6);
			return road;
		}


		default:
			return road;
		}
	}

	export function onScroll(road: road_t, delta: number): road_t | null {
		switch (road & 0x7) {
		case types.VOID:
		case types.ROAD:
			return null;

		case types.TURN:
		{
			let type = (road >> 3) & 0x7;
			if (delta > 0) {
				type--;
				if (type < 0) {
					type = TurnDirection.LENGTH-1;
				}
			} else {
				type++;
				if (type >= TurnDirection.LENGTH) {
					type = 0;
				}
			}

			road = (road & ~(0x7 << 3)) | ((type << 3));
			return road;
		}

		default:
			return types.VOID;
		}
	}
}

