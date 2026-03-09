import { CarColor } from "./CarColor";

/**
 * 0: front, 1: left, 2: right
 */
export const COLOR_TURNS = [
	[0,0,1,1,2,2,0,0],
	[0,1,0,2,1,2,0,0],
	[1,1,2,2,0,0,0,0],
	[1,2,1,0,2,0,0,0],
	[2,2,0,0,1,1,0,0],
	[2,0,2,1,0,1,0,0],
];