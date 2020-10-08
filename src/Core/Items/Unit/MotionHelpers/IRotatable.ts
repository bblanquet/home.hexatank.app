export interface IRotatable {
	CurrentRadius: number;
	GoalRadius: number;
	GetRotatingDuration(): number;
	SetRotatingDuration(rotation: number): void;
}
