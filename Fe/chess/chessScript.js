
// enums
var StateEnum =
{
	SelectMan : 1,
	SelectTurn : 2,
	UpgradePawn : 3
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

var CurrentState = StateEnum.SelectMan;
var SelectedMan = null;
var CurrentTurn = SideEnum.White;
var letters = "abcdefgh";
var Check = SideEnum.No;

function CheckCheckmate()
{
	var $kingsPositions = $('td:has(img[type="'+ChessmanEnum.King+'"])');
	for (var i = 0; i < 2; i++)
	{
		var kingSide = $kingsPositions.eq(i).children().first().attr('side');
		var $enemyPositions = $('td:has(img[side='+(kingSide==SideEnum.White?SideEnum.Black:SideEnum.White)+'])');
		var kingPos = GetPositionComponents($kingsPositions.eq(i).attr('position'));
		for (var j = 0; j < $enemyPositions.length; j++)
		{
			var danger = GetPossibleMoves(
				$enemyPositions.eq(j).children().first().attr('type'), 
				GetPositionComponents($enemyPositions.eq(j).attr('position')),
				InterestEnum.Hit);
			var check = false;
			danger.forEach(function(item, i, danger) 
			{
				if (item[0] == kingPos[0] && item[1] == kingPos[1])
				{
					console.log(kingSide + " is under attack by " + $enemyPositions.eq(j).children().first().attr('type'));
					check = true;
					return;
				}
			});
			if (check)
				return parseInt(kingSide);
		}
	}
	return SideEnum.No;
}

function RoqueAvailability(king, rook)
{
	// шах ли сейчас, двигались ли фигуры
	if (king.hasAttribute('moved') || rook.hasAttribute('moved') || king.getAttribute('side') == Check)
		return false;
	// есть ли фигуры между
	kingPos = GetPositionComponents(king.parentElement.getAttribute('position'));
	rookPos = GetPositionComponents(rook.parentElement.getAttribute('position'));
	var inc = kingPos[0] < rookPos[0];
	var i = kingPos[0];
	while (true)
	{
		i += inc?1:-1;
		if (i == rookPos[0])
			break;
		if ($('td[position="' + GetPositionFromComponents([i, kingPos[1]]) + '"]').first().children().length != 0)
			return false;
	}
	// будет ли король под шахом при рокировке
	var startingPoint = king.parentElement;
	for (var i = 1; i <= 2; i++)
	{
		$('td[position="' + GetPositionFromComponents([(inc?i:-i) + kingPos[0], kingPos[1]]) + '"]').append(king);
		if (king.getAttribute('side') == CheckCheckmate())
		{
			startingPoint.appendChild(king);
			return false;
		}
	}
	startingPoint.appendChild(king);
	return [(inc?2:-2) + kingPos[0], kingPos[1]];
}

function ChangeTurn()
{
	if (CurrentTurn == SideEnum.White)
		CurrentTurn = SideEnum.Black;
	else
		CurrentTurn = SideEnum.White;
	var $passants = $('td#chess[enpassant="' + CurrentTurn + '"]');
	$passants.removeAttr('enpassant');
}

function takeColor()
{	
	if (this.isBlack)
	{
		this.isBlack = false
		return "SaddleBrown"
	}
	else
	{
		this.isBlack = true
		return "NavajoWhite"
	}
}
takeColor.isBlack = false

function createTable()
{
	var mainTable = document.createElement('table')
	mainTable.setAttribute('id', 'chess')
	for (var i = 0; i < 8; i++)
	{	
		var tr = mainTable.insertRow()
		for (var j = 0; j < 8; j++)
		{
			var td = tr.insertCell()
			td.setAttribute('id', 'chess')
			td.setAttribute('bgcolor', takeColor())
			td.setAttribute('position', letters.charAt(j)+(8-i))
			var pos = document.createTextNode(letters.charAt(j)+(8-i))
			
			//document.write(letters.charAt(j)+(8-i))
		}
		takeColor()
	}
	document.body.appendChild(mainTable)
}

Chessmen = 
{
	white : 
	{
		pawns : [],
		queen : null,
		king : null,
		rooks : [],
		knights: [],
		bishops: []
	},
	black :
	{
		pawns : [],
		queen : null,
		king : null,
		rooks : [],
		knights: [],
		bishops: []
	}
}

// создать фигуры и поставить их в стартовые позиции
function setChessmen()
{
	for (var i = 0; i < 8; i++)
	{
		var whitePawn = document.createElement('img')
		whitePawn.setAttribute('src', '..\\..\\chessmen\\white_pawn.png')
		whitePawn.setAttribute('side', SideEnum.White)
		whitePawn.setAttribute('type', ChessmanEnum.Pawn)
		$('td[position="'+letters.charAt(i)+'2"]').append(whitePawn)
		var blackPawn = document.createElement('img')
		blackPawn.setAttribute('src', '..\\..\\chessmen\\black_pawn.png')
		blackPawn.setAttribute('side', SideEnum.Black)
		blackPawn.setAttribute('type', ChessmanEnum.Pawn)		
		$('td[position="'+letters.charAt(i)+'7"]').append(blackPawn)
	}
	for (var i = 0; i < 2; i++)
	{
		var whiteRook = document.createElement('img')
		whiteRook.setAttribute('src', '..\\..\\chessmen\\white_rook.png')
		whiteRook.setAttribute('side', SideEnum.White)
		whiteRook.setAttribute('type', ChessmanEnum.Rook)
		$('td[position="'+letters.charAt(i==0?0:7)+'1"]').append(whiteRook)
		var blackRook = document.createElement('img')
		blackRook.setAttribute('src', '..\\..\\chessmen\\black_rook.png')
		blackRook.setAttribute('side', SideEnum.Black)
		blackRook.setAttribute('type', ChessmanEnum.Rook)
		$('td[position="'+letters.charAt(i==0?0:7)+'8"]').append(blackRook)
	}
	for (var i = 0; i < 2; i++)
	{
		var whiteKnight = document.createElement('img')
		whiteKnight.setAttribute('src', '..\\..\\chessmen\\white_knight.png')
		whiteKnight.setAttribute('side', SideEnum.White)
		whiteKnight.setAttribute('type', ChessmanEnum.Knight)
		$('td[position="'+letters.charAt(i==0?1:6)+'1"]').append(whiteKnight)
		var blackKnight = document.createElement('img')
		blackKnight.setAttribute('src', '..\\..\\chessmen\\black_knight.png')
		blackKnight.setAttribute('side', SideEnum.Black)
		blackKnight.setAttribute('type', ChessmanEnum.Knight)
		$('td[position="'+letters.charAt(i==0?1:6)+'8"]').append(blackKnight)
	}
	for (var i = 0; i < 2; i++)
	{
		var whiteBishop = document.createElement('img')
		whiteBishop.setAttribute('src', '..\\..\\chessmen\\white_bishop.png')
		whiteBishop.setAttribute('side', SideEnum.White)
		whiteBishop.setAttribute('type', ChessmanEnum.Bishop)
		$('td[position="'+letters.charAt(i==0?2:5)+'1"]').append(whiteBishop)
		var blackBishop = document.createElement('img')
		blackBishop.setAttribute('src', '..\\..\\chessmen\\black_bishop.png')
		blackBishop.setAttribute('side', SideEnum.Black)
		blackBishop.setAttribute('type', ChessmanEnum.Bishop)
		$('td[position="'+letters.charAt(i==0?2:5)+'8"]').append(blackBishop)
	}
	
	var whiteQueen = document.createElement('img')
	whiteQueen.setAttribute('src', '..\\..\\chessmen\\white_queen.png')
	whiteQueen.setAttribute('side', SideEnum.White)
	whiteQueen.setAttribute('type', ChessmanEnum.Queen)
	$('td[position="'+letters.charAt(3)+'1"]').append(whiteQueen)
	var blackQueen = document.createElement('img')
	blackQueen.setAttribute('src', '..\\..\\chessmen\\black_queen.png')
	blackQueen.setAttribute('side', SideEnum.Black)
	blackQueen.setAttribute('type', ChessmanEnum.Queen)
	$('td[position="'+letters.charAt(3)+'8"]').append(blackQueen)
	
	var whiteKing = document.createElement('img')
	whiteKing.setAttribute('src', '..\\..\\chessmen\\white_king.png')
	whiteKing.setAttribute('side', SideEnum.White)
	whiteKing.setAttribute('type', ChessmanEnum.King)
	$('td[position="'+letters.charAt(4)+'1"]').append(whiteKing)
	var blackKing = document.createElement('img')
	blackKing.setAttribute('src', '..\\..\\chessmen\\black_king.png')
	blackKing.setAttribute('side', SideEnum.Black)
	blackKing.setAttribute('type', ChessmanEnum.King)
	$('td[position="'+letters.charAt(4)+'8"]').append(blackKing)
}

function testSet()
{
	var whiteRook = document.createElement('img')
	whiteRook.setAttribute('src', '..\\..\\chessmen\\black_rook.png')
	whiteRook.setAttribute('side', SideEnum.Black)
	whiteRook.setAttribute('type', ChessmanEnum.Rook)
	$('td[position="'+letters.charAt(0)+'8"]').append(whiteRook)
	var whiteRook = document.createElement('img')
	whiteRook.setAttribute('src', '..\\..\\chessmen\\black_rook.png')
	whiteRook.setAttribute('side', SideEnum.Black)
	whiteRook.setAttribute('type', ChessmanEnum.Rook)
	$('td[position="'+letters.charAt(7)+'8"]').append(whiteRook)
	
	
	var whiteQueen = document.createElement('img')
	whiteQueen.setAttribute('src', '..\\..\\chessmen\\white_queen.png')
	whiteQueen.setAttribute('side', SideEnum.White)
	whiteQueen.setAttribute('type', ChessmanEnum.Queen)
	$('td[position="'+letters.charAt(3)+'1"]').append(whiteQueen)
	
	var whiteKing = document.createElement('img')
	whiteKing.setAttribute('src', '..\\..\\chessmen\\white_king.png')
	whiteKing.setAttribute('side', SideEnum.White)
	whiteKing.setAttribute('type', ChessmanEnum.King)
	$('td[position="'+letters.charAt(4)+'1"]').append(whiteKing)

	var blackKing = document.createElement('img')
	blackKing.setAttribute('src', '..\\..\\chessmen\\black_king.png')
	blackKing.setAttribute('side', SideEnum.Black)
	blackKing.setAttribute('type', ChessmanEnum.King)
	$('td[position="'+letters.charAt(4)+'8"]').append(blackKing)
}


function IsPositionComponentsOutOfDesk(positionComponents)
{
	return (positionComponents[0] < 0 || positionComponents[0] > 7 || positionComponents[1] < 0 || positionComponents[1] > 7);
}

/*  Возвращает массив позиций, доступных для передвижения
		positionComponents - позиция фигуры в формате [x, y]
		side - цвет фигуры (StateEnum)
		intrest - задаёт поиск клеток для перемещения или поедания (InterestEnum)
		movement - [x, y], где координаты - смещение по соответствующим осям, букв/цифр
		range - необязательный параметр (по умолч. = infinity). задаёт максимальный размер возвращаемого массива
	Такие дела
*/
function NavigateContiniously(positionComponents, side, intrest, movement, range)
{
	range = typeof range !== 'undefined' ? range : 100500;
	var newPosition = positionComponents.clone();
	var positions = [];
	var $startingCell = $('td#chess[position='+GetPositionFromComponents(positionComponents)+']');
	var weArePawn = $startingCell.children().first().attr('type') == ChessmanEnum.Pawn;
	for (var i = 0; i < range; i++)
	{
		newPosition[0] += movement[0];
		newPosition[1] += movement[1];
		if (IsPositionComponentsOutOfDesk(newPosition))
			break;
		var $cell = $('td[position="'+GetPositionFromComponents(newPosition)+'"]');
		if (intrest == InterestEnum.Move)
		{
			if ($cell.children().length == 0 && !(weArePawn && $cell[0].hasAttribute('enpassant')))
			{
				positions.push(newPosition.clone());
			}
			else
				break;
		}
		else
		{
			if ($cell.children().length == 0 && !(weArePawn && $cell[0].hasAttribute('enpassant')))
				continue;
			if ($cell.children().first().attr('side') != side || (weArePawn && $cell[0].hasAttribute('enpassant')))
				positions.push(newPosition.clone());
			break;
		}
	}
	
	return positions
}
/*  помогает сократить код через одновременное указание возможных вариантов хода
	отличие от предыдущей функции: movement - массив смещений
*/
function NavigateContiniouslyMultiplePositions(positionComponents, side, intrest, movement, range)
{
	var result = [];
	movement.forEach(function(item, i, movement) 
	{
		result = result.concat(NavigateContiniously(positionComponents, side, intrest, item, range));
	});
	return result;
}

// 'b5' -> [1, 4]
function GetPositionComponents(position)
{
	var letterPosition = letters.indexOf(position.charAt(0))
	var digitPosition = parseInt(position.charAt(1)) - 1
	return [letterPosition, digitPosition]
}

// [0, 0] -> a1
function GetPositionFromComponents(positionComponents)
{
	return "" + letters.charAt(parseInt(positionComponents[0])) + (parseInt(positionComponents[1]) + 1)
}


// позволяет полностью клонировать массив
Array.prototype.clone = function() {
	return this.slice(0);
}

function EndTurn()
{
	SelectedMan = null;
	ChangeTurn();
	// возвращаемся в фазу выбора фигуры
	CurrentState = StateEnum.SelectMan;
}

function ExcludeCheckmateMoves(piece, moves)
{
	var startPos = piece.parentElement;
	for (var i = 0; i < moves.length; i++)
	{
		var killed = null;
		var $newPos = $('td[position="' + GetPositionFromComponents(moves[i]) + '"]');
		if ($newPos.children().length > 0)
		{
			killed = $newPos.children()[0];
			$newPos.children().first().remove();
		}
		$newPos.append(piece);
		var checkMate = CheckCheckmate();
		if (piece.getAttribute('side') == checkMate)
		{
			moves = moves.splice(i, 1);
			i--;
		}
		if (killed != null)
			$newPos.append(killed);
	}
	startPos.appendChild(piece);
}

// с учетом шаха
function GetFullyPossibleMoves(chessman, position, intrest)
{
	var result = GetPossibleMoves(chessman, position, intrest);
	var piece = $('td[position="' + GetPositionFromComponents(position) + '"]');
	ExcludeCheckmateMoves(piece.children()[0], result);
	return result;
}

// без учета шаха
function GetPossibleMoves(chessman, position, intrest)
{
	var movements;
	var range;
	chessman = +chessman;
	var side = parseInt( $('td[position="' + GetPositionFromComponents(position) + ']"').children().first().attr('side'));
	if (chessman == ChessmanEnum.Pawn)
	{
		if (intrest == InterestEnum.Move)
			range = side==SideEnum.White?(position[1]==1?2:1):(position[1]==6?2:1);
		else
			range = 1;
		switch (side)
		{
			case SideEnum.White:
				if (intrest == InterestEnum.Hit)
					movements = ChessmenParams[chessman][2];
				if (intrest == InterestEnum.Move)
					movements = ChessmenParams[chessman][0];
				break;
			case SideEnum.Black:
				if (intrest == InterestEnum.Hit)
					movements = ChessmenParams[chessman][3];
				if (intrest == InterestEnum.Move)
					movements = ChessmenParams[chessman][1];
				break;
		}
	}
	else
	{
		movements = ChessmenParams[chessman][0];
		range = ChessmenParams[chessman][1];
	}
	return NavigateContiniouslyMultiplePositions(position, side, intrest, movements, range);
}

$(document).on('click', "td#chess",
	function()
	{
		// вспомогательные функции
		function ClearPossibleMoves()
		{
			// убираем рамки со всех клеток
			$("td").css({'border':'0px'})
			// все клетки, доступные для движения, перестают быть таковыми
			$("td[canMove=true]").attr('canMove', 'false')
		}		
		function SelectMan($this)
		{
			// выбор не производится если:
			// в выбранной клетке нету фигур
			if ($this.children().length == 0)
				return;
			// выбрали не свою фигуру 
			if ($this.children().first().attr('side') != CurrentTurn)
				return;
			
			$('td').filter('[rouqe="true"]').removeAttr('rouqe');
			
			// получаем текущие координаты фигуры
			var position = GetPositionComponents($this.attr('position'))
			// в зависимости от типа фигуры, показываем клетки, возможные для хода
			var chessman = parseInt($this.children().first().attr('type'))
			var movement = GetFullyPossibleMoves(chessman, position, InterestEnum.Move);
			var attack = GetFullyPossibleMoves(chessman, position, InterestEnum.Hit);
			
			// рокировка
			if (chessman == ChessmanEnum.King)
			{
				var $availableRooks = $('img[type="'+ChessmanEnum.Rook+'"][side="'+CurrentTurn+'"]:not([moved])');
				for (var i = 0; i < $availableRooks.length; i++)
				{
					var rouqe = RoqueAvailability($this.first().children()[0], $availableRooks[i]);
					if (rouqe === false)
						continue;
					movement.push(rouqe);
					$('td[position="' + GetPositionFromComponents(rouqe) + '"]').attr('rouqe', 'true');
				}
			}
			
			// если нет вариантов хода, выбор не происходит
			if (movement.length == 0 && attack.length == 0)
				return;
			// подсвечиваем зеленым клетку с выбранной фигурой
			$this.css({'border':'5px solid green'});
			// помечаем доступные клетки
			for (var i = 0; i < movement.length; i++)
			{
				var t = GetPositionFromComponents(movement[i])
				var $cell = $('td[position="'+t+'"]')
				$cell.attr('canMove', 'true')
				$cell.css({'border':'5px solid yellow'})
			}
			for (var i = 0; i < attack.length; i++)
			{
				var t = GetPositionFromComponents(attack[i])
				var $cell = $('td[position="'+t+'"]')
				$cell.attr('canMove', 'true')
				$cell.css({'border':'5px solid red'})
			}
			CurrentState = StateEnum.SelectTurn
			SelectedMan = $this.children()[0]
		}
		
		// обработка клика
		switch (CurrentState)
		{
			case StateEnum.SelectMan:
				SelectMan($(this));
				break;
			case StateEnum.SelectTurn:
				//var reSelectMan = false;
				if ($(this).children().length > 0 && $(this).children().first().attr('side') == CurrentTurn)
				{
					ClearPossibleMoves();
					SelectMan($(this).children().first().parent());
					break;
				}
				
				if ($(this).attr('canMove') != 'true')
					break;
				if ($(this).children().length > 0)
				{
					$(this).empty();
				}
				
				//var savedField = document.getElementById("");
				
				// взятие на проходе
				// оставляем шлейф
				var digit = SelectedMan.parentElement.getAttribute('position').charAt(1);
				if (SelectedMan.getAttribute('type') == ChessmanEnum.Pawn &&
					((CurrentTurn == SideEnum.White && digit == 2 && $(this).attr('position').charAt(1) == 4) || 
					(CurrentTurn == SideEnum.Black && digit == 7 && $(this).attr('position').charAt(1) == 5)))
				{
					$('td#chess[position=' + $(this).attr('position').charAt(0) + (CurrentTurn == SideEnum.White ? '3' : '6' ) + ']').
						attr('enpassant', CurrentTurn);
				}
				// убиваем по шлейфу
				if (SelectedMan.getAttribute('type') == ChessmanEnum.Pawn && $(this)[0].hasAttribute('enpassant') &&
					$(this).attr('enpassant') != CurrentTurn)
				{
					var position = GetPositionComponents($(this).attr('position'));
					position[1] += (CurrentTurn == SideEnum.White?-1:1);
					$('td#chess[position=' + GetPositionFromComponents(position) + ']').children().first().remove();
				}
				
				// рокировка
				if (SelectedMan.getAttribute('type') == ChessmanEnum.King &&
					$(this).attr('rouqe') == "true")
				{
					var flag = ($(this).attr('position').charAt(0) == 'g');
					var test = 'td[position="' + (flag?'f':'d') + (CurrentTurn==SideEnum.White?1:8) + '"]';
					var test2 = 'td[position="' + (flag?'h':'a') + (CurrentTurn==SideEnum.White?1:8) + '"]';
					$(test).
						append($(test2).first().children().first());
				}
				
				// перемещаем фигуру
				$(this).append(SelectedMan);
				// запоминаем, что двигали короля/ладью
				if (SelectedMan.getAttribute('type') == ChessmanEnum.King || SelectedMan.getAttribute('type') == ChessmanEnum.Rook)
					SelectedMan.setAttribute('moved', 'true');
				digit = SelectedMan.parentElement.getAttribute('position').charAt(1);
				// апгрейд пешки
				if (SelectedMan.getAttribute('type') == ChessmanEnum.Pawn && 
					((CurrentTurn == SideEnum.White && digit == 8) || 
					(CurrentTurn == SideEnum.Black && digit == 1)))
				{
					CurrentState = StateEnum.UpgradePawn;
					
					var upgradingDiv = document.createElement('div');
					upgradingDiv.setAttribute('id', 'upgradingDiv');
					
					var rook = document.createElement('img');
					rook.setAttribute('src', 
						CurrentTurn==SideEnum.White?'..\\..\\chessmen\\white_rook.png':'..\\..\\chessmen\\black_rook.png')
					rook.setAttribute('side', CurrentTurn);
					rook.setAttribute('type', ChessmanEnum.Rook);
					rook.setAttribute('id', 'upgradeSelection');
					upgradingDiv.appendChild(rook);
					var knight = document.createElement('img')
					knight.setAttribute('src', 
						CurrentTurn==SideEnum.White?'..\\..\\chessmen\\white_knight.png':'..\\..\\chessmen\\black_knight.png');
					knight.setAttribute('side', CurrentTurn);
					knight.setAttribute('type', ChessmanEnum.Knight);
					knight.setAttribute('id', 'upgradeSelection');
					upgradingDiv.appendChild(knight);
						
					var bishop = document.createElement('img')
					bishop.setAttribute('src', 
						CurrentTurn==SideEnum.White?'..\\..\\chessmen\\white_bishop.png':'..\\..\\chessmen\\black_bishop.png');
					bishop.setAttribute('side', CurrentTurn);
					bishop.setAttribute('type', ChessmanEnum.Bishop);
					bishop.setAttribute('id', 'upgradeSelection');
					upgradingDiv.appendChild(bishop);
					
					var queen = document.createElement('img')
					queen.setAttribute('src', 
						CurrentTurn==SideEnum.White?'..\\..\\chessmen\\white_queen.png':'..\\..\\chessmen\\black_queen.png');
					queen.setAttribute('side', CurrentTurn);
					queen.setAttribute('type', ChessmanEnum.Queen);
					queen.setAttribute('id', 'upgradeSelection');
					upgradingDiv.appendChild(queen);
					
					document.body.appendChild(upgradingDiv);
				}
				else
				{
					EndTurn();
				}
				ClearPossibleMoves();
				Check = CheckCheckmate();
				break;
			default:
				break;
		}
		
	})


$(document).on('click', 'img#upgradeSelection',
	function()
	{
		var cell = SelectedMan.parentNode;
		SelectedMan.remove();
		$(this)[0].removeAttribute('id');
		cell.appendChild($(this)[0]);
		$('div#upgradingDiv').remove();
		EndTurn();
	}
)


createTable();
//setChessmen();
testSet();



