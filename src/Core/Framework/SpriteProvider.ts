import { ISpriteProvider } from './ISpriteProvider';
import * as PIXI from 'pixi.js';
import { Archive } from './ResourceArchiver';

export class SpriteProvider implements ISpriteProvider {
	constructor() {}

	public GetSprite(name: string, accuracy: number): PIXI.Sprite {
		if (this.IsSvg(name)) {
			const postension = `.{{}}`;
			name = name.slice(1);
			name = postension + name;
			name = name.replace('//', '/');
			return new PIXI.Sprite(PIXI.Texture.fromImage(name, undefined, undefined, accuracy));
		} else {
			throw Error('nothing');
		}
	}

	private IsSvg(name: string): boolean {
		return name.includes('.svg');
	}

	public static GetAssets(): string[] {
		const keys = new Array<string>();
		this.GetPaths(Archive, '.{{}}', keys);
		return keys;
	}

	private static GetPaths(value: any, postension: string, keys: string[]) {
		if (typeof value === 'string') {
			keys.push(postension + value.slice(1));
		} else if (value instanceof Array) {
			const filenames = value as Array<string>;
			filenames.forEach((filename) => {
				keys.push(postension + filename.slice(1));
			});
		} else {
			for (let key in value) {
				this.GetPaths(value[key], postension, keys);
			}
		}
	}
}
