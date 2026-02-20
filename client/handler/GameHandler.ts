import { GameState, states } from "./states";
import {GAME_WIDTH, GAME_HEIGHT} from "./dimensions";
import {InputHandler} from "./InputHandler";
import { Game } from "../game/Game";
import { ImageLoader } from "./ImageLoader";

export class GameHandler {
	private state: GameState;

	inputHandler: InputHandler;
	imgLoader = new ImageLoader("");

	constructor(
		keyboardMode: "zqsd" | "wasd",
		eventTarget: EventTarget
	) {
		this.inputHandler = new InputHandler(keyboardMode);
		this.inputHandler.startListeners(eventTarget);

		this.state = new Game();
		this.state.enter(undefined, this.inputHandler);

		this.imgLoader.load({
			turn_all: "assets/turn/all.png",
			turn_turn: "assets/turn/turn.png",
			turn_front: "assets/turn/front.png",
			turn_select: "assets/turn/select.png",
			turn_full: "assets/turn/full.png",
			yeild: "assets/yeild.png",
		});
	}

	gameLogic() {
		const next = this.state.frame(this);

		if (next) {
			const data = this.state.exit();
			this.state = next;
			next.enter(data, this.inputHandler);
		}
	}

	gameDraw(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, drawMethod: 
		(ctx: CanvasRenderingContext2D, followCamera: (()=>void), unfollowCamera: (()=>void)) => void
	) {
		const scaleX = canvasWidth / GAME_WIDTH;
		const scaleY = canvasHeight / GAME_HEIGHT;
		const scale = Math.min(scaleX, scaleY);
		const offsetX = (canvasWidth - GAME_WIDTH * scale) / 2;
		const offsetY = (canvasHeight - GAME_HEIGHT * scale) / 2;

		ctx.save();
		ctx.translate(offsetX, offsetY);
		ctx.scale(scale, scale);

		// Draw background
		const camera = this.state.getCamera();
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);


		const followCamera = () => {
			ctx.save();
			if (camera) {
				ctx.translate(GAME_WIDTH / 2, GAME_HEIGHT / 2);
				ctx.scale(camera.z, camera.z);
				ctx.translate(-camera.x, -camera.y);
			}
		}

		const unfollowCamera = () => {
			ctx.restore();
		}
		
		drawMethod(ctx, followCamera, unfollowCamera);
		
		
		ctx.restore();

		
		
		// Make borders dark
		ctx.fillStyle = "black";
		if (offsetY > 0) ctx.fillRect(0, 0, canvasWidth, offsetY);
		if (offsetY > 0) ctx.fillRect(0, canvasHeight - offsetY, canvasWidth, offsetY);
		if (offsetX > 0) ctx.fillRect(0, 0, offsetX, canvasHeight);
		if (offsetX > 0) ctx.fillRect(canvasWidth - offsetX, 0, offsetX, canvasHeight);
	}
	
	drawMethod(ctx: CanvasRenderingContext2D, followCamera: (()=>void), unfollowCamera: (()=>void)) {
		this.state.draw({ctx, imageLoader: this.imgLoader, followCamera, unfollowCamera});
	}
}

