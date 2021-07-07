import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { ILoader } from './ILoader';

export class AssetLoader {
	private _isLoaded: boolean = false;

	constructor(private _loader: ILoader, private _threshold: number) {}

	public Loaded(): boolean {
		return this._isLoaded;
	}

	public LoadAll(assets: string[]): LiteEvent<number> {
		const event = new LiteEvent<number>();
		this.Load(assets, this._threshold, assets.length, 0, event);
		return event;
	}

	private Load(assets: string[], amount: number, total: number, loaded: number, event: LiteEvent<number>): void {
		const poppedAssets = this.Pop(assets, amount);
		const onLoaded = () => {
			loaded += 1;
			event.Invoke(this, loaded * 100 / total);

			if (this.IsFullyLoaded(assets)) {
				this._isLoaded = true;
			}

			if (this.IsLoaded(loaded, amount, assets)) {
				this.Load(assets, amount, total, loaded, event);
			}
		};
		poppedAssets.forEach((asset) => {
			this.LoadAsset(asset, onLoaded);
		});
	}

	private IsFullyLoaded(assets: string[]) {
		return assets.length === 0;
	}

	private IsLoaded(loaded: number, amount: number, assets: string[]) {
		return loaded % amount === 0 && 0 < assets.length;
	}

	private Pop(assets: Array<string>, threshold: number): string[] {
		const popCount = assets.length < threshold ? assets.length : threshold;
		return assets.splice(0, popCount);
	}

	private LoadAsset(path: string, onLoaded: () => void) {
		this._loader.Loading(path, onLoaded);
	}
}
