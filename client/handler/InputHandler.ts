import type { Control } from "./Control";

type Mode = "zqsd" | "wasd";

class Keydown {
	left = false;
	right = false;
	up = false;
	down = false;
	debug = false;
	enter = false;
}

enum Action {
	NONE,
	DOWN,
	UP,
	DOWN_THEN_UP,
	UP_THEN_DOWN,
};

class KeyboardCollector {
	left = Action.NONE;
	right = Action.NONE;
	up = Action.NONE;
	down = Action.NONE;
	debug = Action.NONE;
	enter = Action.NONE;
}



export class InputHandler {
	static CONTROLS: Control[] = ["left", "right", "up", "down", "debug", "enter"];
	static CONTROL_STACK_SIZE = 256;

	private keyboardUsed = false;

	private collectedKeys: Record<Control, Action> = new KeyboardCollector();

	private keysDown: Record<Control, boolean> = new Keydown();

	private firstPress: Record<Control, boolean> = new Keydown();

	private killedPress: Record<Control, boolean> = new Keydown();

	firstPressCapture: Record<Control, boolean> = new Keydown();
	killedPressCapture: Record<Control, boolean> = new Keydown();

	private keyMap: Record<string, Control>;


	gameRecords: Uint32Array[] | null = null;
	frameCount = 0;
	recordCompletion = -1;
	firstRecordLine = 0;
	firstRecordLineCount = 0;

	onMouseUp = (e: MouseEvent) => {};
	onMouseDown = (e: MouseEvent) => {};
	onMouseMove = (e: MouseEvent) => {};
	onScroll = (e: WheelEvent) => {};

	static KEYBOARDS: Record<Mode, Record<string, Control>> = {
		zqsd: {
			KeyZ: 'up',
			KeyQ: 'left',
			KeyS: 'down',
			KeyD: 'right',
			KeyP: 'debug',
			Space: 'up',
			ArrowUp: 'up',
			ArrowLeft: 'left',
			ArrowDown: 'down',
			ArrowRight: 'right',
			Enter: 'enter'
		},

		wasd: {
			KeyW: 'up',
			KeyA: 'left',
			KeyS: 'down',
			KeyD: 'right',
			KeyP: 'debug',
			Space: 'up',
			ArrowUp: 'up',
			ArrowLeft: 'left',
			ArrowDown: 'down',
			ArrowRight: 'right',
			Enter: 'enter'
		},
	};


	constructor(mode: Mode) {
		this.keyMap = InputHandler.KEYBOARDS[mode];
	}

	applyKeydown(control: Control) {
		switch (this.collectedKeys[control]) {
			case Action.NONE:
			this.collectedKeys[control] = Action.DOWN;
			break;
			
		case Action.DOWN:
			break;
			
		case Action.UP:
			this.collectedKeys[control] = Action.UP_THEN_DOWN;
			break;

		case Action.DOWN_THEN_UP:
			this.collectedKeys[control] = Action.UP_THEN_DOWN;
			break;

		case Action.UP_THEN_DOWN:
			this.collectedKeys[control] = Action.UP_THEN_DOWN;
			break;

		}
	}

	applyKeyup(control: Control) {
		switch (this.collectedKeys[control]) {
		case Action.NONE:
			this.collectedKeys[control] = Action.UP;
			break;
			
		case Action.DOWN:
			this.collectedKeys[control] = Action.DOWN_THEN_UP;
			break;
			
		case Action.UP:
			break;

		case Action.DOWN_THEN_UP:
			this.collectedKeys[control] = Action.DOWN_THEN_UP;
			break;

		case Action.UP_THEN_DOWN:
			this.collectedKeys[control] = Action.DOWN_THEN_UP;
			break;
			
		}
	}

	private onKeydown = (event: Event) => {
		const e = event as KeyboardEvent;
		const control = this.keyMap[e.code];
		if (control) {
			this.applyKeydown(control);
		}
	}

	private onKeyup = (event: Event) => {
		const e = event as KeyboardEvent;
		const control = this.keyMap[e.code];
		if (control) {
			this.applyKeyup(control);
			
		}
	}



	private onButtonTouchStart = (control: Control | 'special', element: HTMLElement) => {
		element.classList.add("high");

		if (control === 'special') {
			return;
		}

		switch (this.collectedKeys[control]) {
		case Action.NONE:
			this.collectedKeys[control] = Action.DOWN;
			break;
			
		case Action.DOWN:
			break;
			
		case Action.UP:
			this.collectedKeys[control] = Action.UP_THEN_DOWN;
			break;

		case Action.DOWN_THEN_UP:
			this.collectedKeys[control] = Action.UP_THEN_DOWN;
			break;

		case Action.UP_THEN_DOWN:
			this.collectedKeys[control] = Action.UP_THEN_DOWN;
			break;

		}
	}

	private onButtonTouchEnd = (control: Control | 'special', element: HTMLElement) => {
		element.classList.remove("high");

		if (control === 'special') {
			return;
		}

		switch (this.collectedKeys[control]) {
		case Action.NONE:
			this.collectedKeys[control] = Action.UP;
			break;
			
		case Action.DOWN:
			this.collectedKeys[control] = Action.DOWN_THEN_UP;
			break;
			
		case Action.UP:
			break;

		case Action.DOWN_THEN_UP:
			this.collectedKeys[control] = Action.DOWN_THEN_UP;
			break;

		case Action.UP_THEN_DOWN:
			this.collectedKeys[control] = Action.DOWN_THEN_UP;
			break;
			
		}
	}



	


	startListeners(target: EventTarget) {
		target.addEventListener("keydown", this.onKeydown);
		target.addEventListener("keyup", this.onKeyup);
		this.keyboardUsed = true;

		target.addEventListener('mouseup', (e) => {
			this.onMouseUp(e as MouseEvent);
		});

		target.addEventListener('mousedown', (e) => {
			this.onMouseDown(e as MouseEvent);
		});

		target.addEventListener('mousemove', (e) => {
			this.onMouseMove(e as MouseEvent);
		});

		target.addEventListener('wheel', (e) => {
			const we = e as WheelEvent;
			if (we.ctrlKey) {
				we.preventDefault();
			}

			this.onScroll(we);
		}, {passive: false});
	}

	removeListeners(target: EventTarget) {
		if (this.keyboardUsed) {
			target.removeEventListener("keydown", this.onKeydown);
			target.removeEventListener("keyup", this.onKeyup);
		}

	}
	
	
	update() {
		for (const control of InputHandler.CONTROLS) {
			this.play(control, this.collectedKeys[control]);
			this.collectedKeys[control] = Action.NONE;
		}
	}

	play(control: Control, action: Action) {
		switch (action) {
		case Action.NONE:
			this.firstPress[control] = false;
			this.killedPress[control] = false;
			break;

		case Action.DOWN:
			if (this.keysDown[control]) {
				this.firstPress[control] = false;
			} else {
				this.firstPress[control] = true;
				this.keysDown[control] = true;
			}
			this.killedPress[control] = false;
			break;

		case Action.UP:
			if (this.keysDown[control]) {
				this.firstPress[control] = false;
				this.keysDown[control] = false;
				this.killedPress[control] = true;
			} else {
				this.firstPress[control] = false;
				this.killedPress[control] = false;
			}
			break;

		case Action.DOWN_THEN_UP:
			if (this.keysDown[control]) {
				this.firstPress[control] = false;
				this.keysDown[control] = false;
			} else {
				this.firstPress[control] = true;
			}
			this.killedPress[control] = true;

			
			break;

		case Action.UP_THEN_DOWN:
			if (this.keysDown[control]) {
				this.firstPress[control] = false;
				this.keysDown[control] = false;
				this.killedPress[control] = true;
			} else {
				this.firstPress[control] = false;
				this.killedPress[control] = false;
			}

			if (this.keysDown[control]) {
				this.firstPress[control] = false;
			} else {
				this.firstPress[control] = true;
				this.keysDown[control] = true;
			}
			this.killedPress[control] = false;
			break;
		}
	}

	press(control: Control): boolean {
		return this.firstPress[control] || this.keysDown[control];
	}

	first(control: Control): boolean {
		return this.firstPress[control];
	}

	killed(control: Control): boolean {
		return this.killedPress[control];
	}


	kill(control: Control, removeFirstPress = false) {
		this.keysDown[control] = false;

		if (removeFirstPress) {
			this.firstPress[control] = false;
		}
	}



	
}
