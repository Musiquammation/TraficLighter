export enum Direction {
	RIGHT,
	UP,
	LEFT,
	DOWN,
};

export function rotateDirectionToLeft(dir: Direction): Direction {
	switch (dir) {
		case Direction.RIGHT: return Direction.UP;
		case Direction.UP: return Direction.LEFT;
		case Direction.LEFT: return Direction.DOWN;
		case Direction.DOWN: return Direction.RIGHT;
	}
}

export function rotateDirectionToRight(dir: Direction): Direction {
	switch (dir) {
		case Direction.RIGHT: return Direction.DOWN;
		case Direction.DOWN: return Direction.LEFT;
		case Direction.LEFT: return Direction.UP;
		case Direction.UP: return Direction.RIGHT;
	}
}

export function opposeDirection(dir: Direction): Direction {
	switch (dir) {
		case Direction.RIGHT: return Direction.LEFT;
		case Direction.UP: return Direction.DOWN;
		case Direction.LEFT: return Direction.RIGHT;
		case Direction.DOWN: return Direction.UP;
	}
}


export function getAttach(direction: Direction, rotatingToRight: boolean, step: number) {
	// Limite step pour sécurité
	step = Math.max(0, Math.min(1, step));

	let cx = 0, cy = 0; // centre du cercle
	let startAngle = 0;  // angle de départ en radians
	let endAngle = 0;    // angle d'arrivée en radians
	let radius = 0.5;    // rayon du quart de cercle

	switch (direction) {
		case Direction.RIGHT:
			cx = 0;
			cy = 1;
			if (rotatingToRight) {
				startAngle = -Math.PI / 2; // départ (0,1/2)
				endAngle = 0;              // fin (1/2,1)
			} else {
				startAngle = -Math.PI / 2;
				endAngle = -Math.PI;       // vers le haut-gauche
			}
			break;
		case Direction.UP:
			cx = 0;
			cy = 0;
			if (rotatingToRight) {
				startAngle = 0;             // départ (1/2,0)
				endAngle = Math.PI / 2;     // fin (0,1/2)
			} else {
				startAngle = 0;
				endAngle = -Math.PI / 2;    // vers droite-bas
			}
			break;
		case Direction.LEFT:
			cx = 1;
			cy = 0;
			if (rotatingToRight) {
				startAngle = Math.PI / 2;   // départ (1,1/2)
				endAngle = Math.PI;         // fin (1/2,0)
			} else {
				startAngle = Math.PI / 2;
				endAngle = 0;               // vers bas-droite
			}
			break;
		case Direction.DOWN:
			cx = 1;
			cy = 1;
			if (rotatingToRight) {
				startAngle = Math.PI;       // départ (1/2,1)
				endAngle = 3 * Math.PI / 2; // fin (1,1/2)
			} else {
				startAngle = Math.PI;
				endAngle = Math.PI / 2;     // vers gauche-haut
			}
			break;
	}

	// interpolation linéaire de l'angle
	const angle = startAngle + (endAngle - startAngle) * step;

	const x = cx + radius * Math.cos(angle);
	const y = cy + radius * Math.sin(angle);

	return {x, y};
}


export function getDirectionDelta(direction: Direction) {
	let x = 0;
	let y = 0;
	switch (direction) {
	case Direction.RIGHT:
		x = +1;
		break;

	case Direction.UP:
		y = -1;
		break;

	case Direction.LEFT:
		x = -1;
		break;

	case Direction.DOWN:
		y = +1;
		break;
	}

	return {x, y};
}

