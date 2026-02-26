import { Direction } from "./Direction";
import { CarColor } from "./CarColor";
import { ChunkMap } from "./ChunkMap";
import { Chunk } from "./Chunk";
import { roadtypes } from "./roadtypes";

interface CarSpawner {
	x: number;
	y: number;
	color: CarColor;
	rythm: number;
	couldown: number;
	direction: Direction;
	count: number;
	score: number;
}

interface Road {
	x: number;
	y: number;
	data: roadtypes.road_t;
}

export class MapConstructor {
	constructor() {}

	carSpawners: CarSpawner[] = [];
	roads: Road[] = [];
	time = 0;

	create(cmap: ChunkMap) {
		cmap.time = this.time;

		for (const spawner of this.carSpawners) {
			const chunk = cmap.getChunk(
				Math.floor(spawner.x/Chunk.SIZE),
				Math.floor(spawner.y/Chunk.SIZE)
			);

			chunk.appendCarSpawner({
				x: spawner.x,
				y: spawner.y,
				color: spawner.color,
				rythm: spawner.rythm,
				couldown: spawner.couldown,
				direction: spawner.direction,
				count: spawner.couldown,
				score: spawner.score,
				currentId: 0
			});
		}

		for (const road of this.roads) {
			cmap.setRoad(road.x, road.y, road.data);
		}
	}

	appendJSON(data: any) {
		const time: number | undefined = data.time;
		if (time !== undefined)
			this.time = time;

		const spawners: CarSpawner[] | undefined = data.spawners;
		if (spawners !== undefined)
			this.carSpawners.push(...spawners);

		const roads: Road[] | undefined = data.roads;
		if (roads !== undefined)
			this.roads.push(...roads);

	}
}