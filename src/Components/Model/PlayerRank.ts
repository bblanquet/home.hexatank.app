export class PlayerRank {
	public name: string;
	public score: number;
	public rank: number;

	public static Create(name: string, score: number, rank: number): PlayerRank {
		const player = new PlayerRank();
		player.name = name;
		player.score = score;
		player.rank = rank;
		return player;
	}
}
