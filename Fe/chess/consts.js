
// enums
var StateEnum =
{
	SelectMan : 1,
	SelectTurn : 2,
	UpgradePawn : 3,
	GameEnd : 4
}
var SideEnum =
{
	No: -1,
	White : 0,
	Black : 1
}
var ChessmanEnum =
{
	Pawn : 0,
	Knight : 1,
	Rook : 2,
	Bishop : 3,
	Queen : 4,
	King : 5
}
var InterestEnum =
{
	Move : 0,
	Hit : 1
}
// end enums

// ходы/атаки, радиус хода/атаки (undefined - inf) - Для всех кроме пешки
// ходы для белых, ходы для черных, атаки для белых, атаки для черных - для пешек
var ChessmenParams = 
[
	/*Pawn(0)*/    [ [ [0,1] ], [ [0,-1] ], [ [-1,1], [1,1] ], [ [-1,-1], [1,-1] ] ],
	/*Knight(1)*/  [ [ [2,1], [2,-1], [-2,1], [-2,-1], [1,2], [1,-2], [-1,2], [-1,-2] ], 1 ],
	/*Rook(2)*/    [ [ [0,1], [1,0], [-1,0], [0,-1] ], undefined],
	/*Bishop(3)*/  [ [ [1,1], [1,-1], [-1,1], [-1,-1] ], undefined ],
	/*Queen(4)*/   [ [ [1,1], [1,-1], [-1,1], [-1,-1], [0,1], [1,0], [-1,0], [0,-1] ], undefined ],
	/*King(5)*/    [ [ [1,1], [1,-1], [-1,1], [-1,-1], [0,1], [1,0], [-1,0], [0,-1] ], 1 ]
]

var letters = "abcdefgh";


// позволяет полностью клонировать массив
Array.prototype.clone = function() {
	return this.slice(0);
}