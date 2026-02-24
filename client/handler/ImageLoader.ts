export class ImageLoader {
	private folders: { [folderName: string]: { [imageName: string]: HTMLImageElement[] } } = {};
	private loadedCount = 0;
	private totalCount = 0;
	private placeholder: HTMLCanvasElement;
	private pathRoot: string;

	constructor(pathRoot: string) {
		this.pathRoot = pathRoot;

		const size = 2;
		const canvas = document.createElement('canvas');
		canvas.width = size;
		canvas.height = size;
		const ctx = canvas.getContext('2d')!;
		ctx.imageSmoothingEnabled = false;

		ctx.fillStyle = 'violet';
		ctx.fillRect(0, 0, size / 2, size / 2);
		ctx.fillRect(size / 2, size / 2, size / 2, size / 2);
		ctx.fillStyle = 'white';
		ctx.fillRect(size / 2, 0, size / 2, size / 2);
		ctx.fillRect(0, size / 2, size / 2, size / 2);
		this.placeholder = canvas;
	}

	async load(foldersToLoad: { [key: string]: string }): Promise<void> {
		this.totalCount = Object.keys(foldersToLoad).length;
		this.loadedCount = 0;

		const promises: Promise<void>[] = [];

		for (const [name, path] of Object.entries(foldersToLoad)) {
			const p = (async () => {
				try {
					const res = await fetch(this.pathRoot + path);
					if (!res.ok) throw new Error('Failed to fetch ' + path);
					const blob = await res.blob();

					const img = await new Promise<HTMLImageElement>((resolve, reject) => {
						const i = new Image();
						i.onload = () => resolve(i);
						i.onerror = e => reject(e);
						i.src = URL.createObjectURL(blob);
					});

					if (!this.folders['default'])
						this.folders['default'] = {};

					if (!this.folders['default'][name])
						this.folders['default'][name] = [];

					this.folders['default'][name].push(img);
					this.loadedCount++;

				} catch (err) {
					console.warn("Error with:", path);
					console.error(err);
					this.loadedCount++;
				}
			})()

			promises.push(p)
		}


		await Promise.all(promises);
	}

	isLoaded(): boolean {
		return this.loadedCount === this.totalCount;
	}

	get(name: string): HTMLCanvasElement | HTMLImageElement {
		const folder = this.folders['default'];
		if (folder && folder[name] && folder[name][0])
			return folder[name][0];
		return this.placeholder;
	}

	getFolders() {
		return this.folders;
	}
}
