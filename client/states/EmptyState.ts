import { Game } from "../game/Game";
import { GameHandler } from "../handler/GameHandler";
import { InputHandler } from "../handler/InputHandler";
import { DrawStateData, GameState } from "../handler/states";
import { Vector3 } from "../handler/Vector3";

export class EmptyState extends GameState {
	constructor() {
		super();
	}

	enter(data: any, input: InputHandler): void {
		
	}

	frame(game: GameHandler): GameState | null {
		return null;
	}

	draw(args: DrawStateData): void {
		
	}

	exit() {
		
	}

	getCamera(): Vector3 | null {
		return null;
	}
}