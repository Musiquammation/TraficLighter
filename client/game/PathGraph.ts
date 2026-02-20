import { ChunkMap } from "./ChunkMap";
import { roadtypes } from "./roadtypes";
import { Direction, getDirectionDelta, rotateDirectionToLeft, rotateDirectionToRight } from "./Direction";

interface Node {
	x: number;
	y: number;
	road: roadtypes.road_t;

	right: Node | null;
	up: Node | null;
	left: Node | null;
	down: Node | null;
}


const produceKey = (x: number, y: number) => (x << 16) ^ y;

export class PathGraph {
	nodes = new Map<number, Node>();
	cmap;

	constructor(cmap: ChunkMap) {
		this.cmap = cmap;
	}


	append(x: number, y: number, dir: Direction) {
		// Check if this node is already in graph
		const key = produceKey(x, y);
		const givenNode = this.nodes.get(key);
		if (givenNode) {
			return givenNode;
		}


		const road = this.cmap.getRoad(x, y);
		const moves: Direction[] = [];

		switch (road & 0x7) {
		case roadtypes.types.VOID:
			break;

		case roadtypes.types.ROAD:
		case roadtypes.types.PRIORITY:
		case roadtypes.types.SPAWNER:
		{
			moves.push(dir);
			break;
		}

		case roadtypes.types.TURN:
		{
			if (((road>>3) & 0x3) != dir)
				break;

			switch ((road >> 5) as roadtypes.TurnDirection) {
			case roadtypes.TurnDirection.FRONT:
				moves.push(dir);
				break;

			case roadtypes.TurnDirection.RIGHT:
				moves.push(rotateDirectionToRight(dir));
				break;

			case roadtypes.TurnDirection.LEFT:
				moves.push(rotateDirectionToLeft(dir));
				break;

			case roadtypes.TurnDirection.FRONT_RIGHT:
				moves.push(dir);
				moves.push(rotateDirectionToRight(dir));
				break;

			case roadtypes.TurnDirection.FRONT_LEFT:
				moves.push(dir);
				moves.push(rotateDirectionToRight(dir));
				break;

			case roadtypes.TurnDirection.LEFT_AND_RIGHT:
				moves.push(rotateDirectionToRight(dir));
				moves.push(rotateDirectionToLeft(dir));
				break;

			case roadtypes.TurnDirection.ALL:
				moves.push(rotateDirectionToRight(dir));
				moves.push(rotateDirectionToLeft(dir));
				moves.push(dir);
				break;

			case roadtypes.TurnDirection.BACK:
				break;

			case roadtypes.TurnDirection.LENGTH:
				break;

			}
		}
		}


		const node: Node = {
			x,
			y,
			road,
			right: null,
			up: null,
			left: null,
			down: null
		};

		this.nodes.set(key, node);


		for (let dir of moves) {
			switch (dir) {
			case Direction.RIGHT:
				node.right = this.append(x+1, y, Direction.RIGHT);
				break;
				
			case Direction.UP:
				node.up = this.append(x, y-1, Direction.UP);
				break;

			case Direction.LEFT:
				node.left = this.append(x-1, y, Direction.LEFT);
				break;
				
			case Direction.DOWN:
				node.down = this.append(x, y+1, Direction.DOWN);
				break;
			}
		}

		return node;
	}

	getNeighboors(x: number, y: number) {
		const arr = [];
		const node = this.nodes.get(produceKey(x, y));
		if (!node) {
			return [];
		}

		if (node.right) {
			arr.push({x: node.right.x, y: node.right.y, dir: Direction.RIGHT});
		}

		if (node.up) {
			arr.push({x: node.up.x, y: node.up.y, dir: Direction.UP});
		}

		if (node.left) {
			arr.push({x: node.left.x, y: node.left.y, dir: Direction.LEFT});
		}

		if (node.down) {
			arr.push({x: node.down.x, y: node.down.y, dir: Direction.DOWN});
		}

		return arr;
	}
}