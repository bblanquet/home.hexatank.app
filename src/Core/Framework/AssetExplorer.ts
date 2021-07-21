import { SvgArchive } from './SvgArchiver';

export class AssetExplorer {
	public GetAssets(): string[] {
		const keys = new Array<string>();
		this.GetPaths(SvgArchive, keys);
		return [ ...new Set(keys) ];
	}

	private GetPaths(value: any, keys: string[]) {
		if (typeof value === 'string') {
			keys.push(this.GetPath(value.slice(1)));
		} else if (value instanceof Array) {
			const filenames = value as Array<string>;
			filenames.forEach((filename) => {
				keys.push(this.GetPath(filename.slice(1)));
			});
		} else {
			for (let key in value) {
				this.GetPaths(value[key], keys);
			}
		}
	}

	private GetPath(asset: string): string {
		let path = asset;
		path = path.slice(1); //remove dot
		path = `{{asset_path}}${path}`;
		path = path.replace('//', '/');
		return path;
	}
}
