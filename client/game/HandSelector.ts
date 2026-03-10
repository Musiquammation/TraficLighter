export enum HandSelection {
	NONE,
	ROAD,
	ERASE,
	ROTATE,

	TURN,
	PRIORITY,
	LIGHT,
	ALTERN
};


export const HAND_SELECTION_ICONS = [
	'icon_none',
	'icon_road',
	'icon_erase',
	'icon_rotate',

	'turn',
	'yield',
	'light_green',
	'filter_front'
];

class HandSelector {
	private panelDiv: HTMLElement;
	private currentMode = HandSelection.NONE;

	constructor(panelDiv: HTMLElement) {
		this.panelDiv = panelDiv;
	}



	getDiv(idx: HandSelection) {
		return this.panelDiv.children[idx];
	}

	private setMode(idx: HandSelection) {
		this.currentMode = idx;
	}

	getMode() {
		return this.currentMode;
	}

	appendDivList() {
		const length = Object.values(HandSelection).length/2;
		for (let i = 0; i < length; i++) {
			const div = document.createElement("div");
			this.panelDiv.appendChild(div);

			const idx = i;
			div.addEventListener('click', () => this.setMode(idx));
			div.addEventListener('touchstart', () => this.setMode(idx));
		}
	}


}


export const handSelector = new HandSelector(document.getElementById("handPanel")!);
handSelector.appendDivList();
