import { CarColor } from "../game/CarColor";
import { Direction } from "../game/Direction";
import { Game } from "../game/Game";
import { MapConstructor } from "../game/MapConstructor";
import { roadtypes } from "../game/roadtypes";
import { GameHandler } from "../handler/GameHandler";
import { InputHandler } from "../handler/InputHandler";
import { DrawStateData, GameState } from "../handler/states";
import { Vector3 } from "../handler/Vector3";


declare global {
	interface Window {
		DEBUG: boolean;
	}
}

export class LevelsState extends GameState {
	constructor() {
		super();
	}

	enter(data: any, input: InputHandler): void {
		
	}

	frame(game: GameHandler): GameState | null {
		return new Game();
	}

	draw(args: DrawStateData): void {
		
	}

	exit() {
		if (window.DEBUG) {
			return LEVELS[1];
			
		} else {
			const v = prompt("Level? [0, 1, 2 or 3]");
			if (v !== null)
				return LEVELS[+v];

		}

	}

	getCamera(): Vector3 | null {
		return null;
	}
}



const LEVELS: MapConstructor[] = [
	// Level 0
	new MapConstructor({
		time: 100*60,
		width: 31,
		height: 31,
		spawners: [
			{
				x: 1,
				y: 5,
				color: CarColor.RED,
				rythm: 	45,
				couldown: 1,
				direction: Direction.RIGHT,
				count: Infinity,
				score: 1
			},

			{
				x: 1,
				y: 10,
				color: CarColor.BLUE,
				rythm: 	45,
				couldown: 1,
				direction: Direction.RIGHT,
				count: Infinity,
				score: 1
			},

			{
				x: 20,
				y: 30,
				color: CarColor.GREEN,
				rythm: 	135,
				couldown: 1,
				direction: Direction.UP,
				count: Infinity,
				score: 10
			}
		],
		roads: [
			{
				x: 30,
				y: 5,
				data: roadtypes.types.CONSUMER | (CarColor.RED << 3)
			},

			{
				x: 20,
				y: 1,
				data: roadtypes.types.CONSUMER | (CarColor.GREEN << 3)
			},

			{
				x: 30,
				y: 10,
				data: roadtypes.types.CONSUMER | (CarColor.BLUE << 3)
			}
		]
	}),

	// Level 1
	new MapConstructor({
		time: 100*60,
		width: 31,
		height: 31,
		spawners: [
			{
				x: 1,
				y: 5,
				color: CarColor.RED,
				rythm: 	45,
				couldown: 1,
				direction: Direction.RIGHT,
				count: Infinity,
				score: 1
			},

			{
				x: 1,
				y: 10,
				color: CarColor.BLUE,
				rythm: 	45,
				couldown: 1,
				direction: Direction.RIGHT,
				count: Infinity,
				score: 1
			},

			{
				x: 20,
				y: 30,
				color: CarColor.GREEN,
				rythm: 	135,
				couldown: 1,
				direction: Direction.UP,
				count: Infinity,
				score: 10
			},
		],
		roads: [
			{
				x: 30,
				y: 5,
				data: roadtypes.types.CONSUMER | (CarColor.BLUE << 3)
			},

			{
				x: 20,
				y: 1,
				data: roadtypes.types.CONSUMER | (CarColor.GREEN << 3)
			},

			{
				x: 30,
				y: 10,
				data: roadtypes.types.CONSUMER | (CarColor.RED << 3)
			}
		]
	}),

	// Level 2
	new MapConstructor({
		time: 100*60,
		width: 31,
		height: 31,
		spawners: [
			{
				x: 1,
				y: 5,
				color: CarColor.RED,
				rythm: 	45,
				couldown: 1,
				direction: Direction.RIGHT,
				count: Infinity,
				score: 1
			},

			{
				x: 1,
				y: 7,
				color: CarColor.RED,
				rythm: 	45,
				couldown: 1,
				direction: Direction.RIGHT,
				count: Infinity,
				score: 1
			},

			{
				x: 1,
				y: 9,
				color: CarColor.RED,
				rythm: 	45,
				couldown: 1,
				direction: Direction.RIGHT,
				count: Infinity,
				score: 1
			},

			{
				x: 5,
				y: 1,
				color: CarColor.RED,
				rythm: 	45,
				couldown: 1,
				direction: Direction.DOWN,
				count: Infinity,
				score: 1
			},

			{
				x: 7,
				y: 1,
				color: CarColor.RED,
				rythm: 	45,
				couldown: 1,
				direction: Direction.DOWN,
				count: Infinity,
				score: 1
			},

			{
				x: 9,
				y: 1,
				color: CarColor.RED,
				rythm: 	45,
				couldown: 1,
				direction: Direction.DOWN,
				count: Infinity,
				score: 1
			},

			{
				x: 20,
				y: 1,
				color: CarColor.BLUE,
				rythm: 	120,
				couldown: 1,
				direction: Direction.DOWN,
				count: Infinity,
				score: 15
			},

			{
				x: 1,
				y: 20,
				color: CarColor.GREEN,
				rythm: 	120,
				couldown: 1,
				direction: Direction.RIGHT,
				count: Infinity,
				score: 15
			},

			
		],

			
		roads: [
			{
				x: 30,
				y: 20,
				data: roadtypes.types.CONSUMER | (CarColor.GREEN << 3)
			},

			{
				x: 20,
				y: 30,
				data: roadtypes.types.CONSUMER | (CarColor.BLUE << 3)
			},

			{
				x: 27,
				y: 27,
				data: roadtypes.types.CONSUMER | (CarColor.RED << 3)
			}
		]
	}),

	// Level 3
	new MapConstructor({
		time: 100*60,
		width: 32,
		height: 32,
		spawners: [
			
			{
				x: 1,
				y: 5,
				color: CarColor.RED,
				rythm: 	60,
				couldown: 1,
				direction: Direction.RIGHT,
				count: Infinity,
				score: 1
			},

			{
				x: 1,
				y: 7,
				color: CarColor.YELLOW,
				rythm: 	60,
				couldown: 1,
				direction: Direction.RIGHT,
				count: Infinity,
				score: 1
			},

			{
				x: 1,
				y: 9,
				color: CarColor.BLUE,
				rythm: 	60,
				couldown: 1,
				direction: Direction.RIGHT,
				count: Infinity,
				score: 1
			},

			{
				x: 1,
				y: 11,
				color: CarColor.CYAN,
				rythm: 	60,
				couldown: 1,
				direction: Direction.RIGHT,
				count: Infinity,
				score: 1
			},

			{
				x: 1,
				y: 21,
				color: CarColor.RED,
				rythm: 	60,
				couldown: 1,
				direction: Direction.RIGHT,
				count: Infinity,
				score: 1
			},

			{
				x: 1,
				y: 23,
				color: CarColor.YELLOW,
				rythm: 	60,
				couldown: 1,
				direction: Direction.RIGHT,
				count: Infinity,
				score: 1
			},

			{
				x: 1,
				y: 25,
				color: CarColor.BLUE,
				rythm: 	60,
				couldown: 1,
				direction: Direction.RIGHT,
				count: Infinity,
				score: 1
			},

			{
				x: 1,
				y: 27,
				color: CarColor.CYAN,
				rythm: 	60,
				couldown: 1,
				direction: Direction.RIGHT,
				count: Infinity,
				score: 1
			},

			{
				x: 31,
				y: 16,
				color: CarColor.PURPLE,
				rythm: 	360,
				couldown: 1,
				direction: Direction.LEFT,
				count: Infinity,
				score: 5
			},

			{
				x: 31,
				y: 15,
				color: CarColor.PURPLE,
				rythm: 	360,
				couldown: 180,
				direction: Direction.LEFT,
				count: Infinity,
				score: 5
			},
			
		],

			
		roads: [
			{x: 16, y: 0, data: 8},{x: 16, y: 1, data: 8},{x: 16, y: 2, data: 8},{x: 16, y: 3, data: 8},
			{x: 16, y: 4, data: 8},{x: 16, y: 5, data: 8},{x: 16, y: 6, data: 8},{x: 16, y: 7, data: 8},
			{x: 16, y: 8, data: 8},{x: 16, y: 9, data: 8},{x: 16, y: 10, data: 8},{x: 16, y: 11, data: 8},
			{x: 16, y: 12, data: 8},{x: 16, y: 13, data: 8},{x: 16, y: 14, data: 8},
			{x: 16, y: 19, data: 8},{x: 16, y: 20, data: 8},{x: 16, y: 21, data: 8},
			{x: 16, y: 22, data: 8},{x: 16, y: 23, data: 8},{x: 16, y: 24, data: 8},{x: 16, y: 25, data: 8},
			{x: 16, y: 26, data: 8},{x: 16, y: 27, data: 8},{x: 16, y: 28, data: 8},{x: 16, y: 29, data: 8},
			{x: 16, y: 30, data: 8},{x: 16, y: 31, data: 8},
			
			{x: 17, y: 0, data: 8},{x: 17, y: 1, data: 8},{x: 17, y: 2, data: 8},{x: 17, y: 3, data: 8},
			{x: 17, y: 4, data: 8},{x: 17, y: 5, data: 8},{x: 17, y: 6, data: 8},{x: 17, y: 7, data: 8},
			{x: 17, y: 8, data: 8},{x: 17, y: 9, data: 8},{x: 17, y: 10, data: 8},{x: 17, y: 11, data: 8},
			{x: 17, y: 12, data: 8},{x: 17, y: 13, data: 8},{x: 17, y: 14, data: 8},
			{x: 17, y: 19, data: 8},{x: 17, y: 20, data: 8},{x: 17, y: 21, data: 8},
			{x: 17, y: 22, data: 8},{x: 17, y: 23, data: 8},{x: 17, y: 24, data: 8},{x: 17, y: 25, data: 8},
			{x: 17, y: 26, data: 8},{x: 17, y: 27, data: 8},{x: 17, y: 28, data: 8},{x: 17, y: 29, data: 8},
			{x: 17, y: 30, data: 8},{x: 17, y: 31, data: 8},


			{x: 28, y: 2, data: roadtypes.types.CONSUMER | (CarColor.RED << 3)},
			{x: 28, y: 9, data: roadtypes.types.CONSUMER | (CarColor.YELLOW << 3)},
			{x: 28, y: 23, data: roadtypes.types.CONSUMER | (CarColor.BLUE << 3)},
			{x: 28, y: 30, data: roadtypes.types.CONSUMER | (CarColor.CYAN << 3)},
			{x: 1, y: 17, data: roadtypes.types.CONSUMER | (CarColor.PURPLE << 3)},
		]
	}),
];