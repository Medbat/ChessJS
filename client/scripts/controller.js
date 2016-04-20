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
	// игра онлайн и сейчас не наш ход
	if (GameMode == GameTypeEnum.Multiplayer && MySide != CurrentTurn)
		return;
	// в выбранной клетке нету фигур
	if ($this.children().length == 0)
		return;
	// выбрали не свою фигуру 
	if ($this.children().first().attr('side') != CurrentTurn)
		return;
	
	
	// получаем текущие координаты фигуры
	var position = GetPositionComponents($this.attr('position'))
	// в зависимости от типа фигуры, показываем клетки, возможные для хода
	
	var pieceId = parseInt($this.children().first().attr('pieceId'))
	// var movement = GetFullyPossibleMoves(chessman, position, InterestEnum.Move);
	// var attack = GetFullyPossibleMoves(chessman, position, InterestEnum.Hit);
	var movement = Enumerable.From(PossibleMoves).
		Where(function (x) { return x.id == pieceId }).
		Select(function (x) { return x.moves });
	if (movement.Any())
		movement = movement.First();
	else
		movement = [];
	var attack = Enumerable.From(PossibleMoves).
		Where(function (x) { return x.id == pieceId }).
		Select(function (x) { return x.attacks });
	if (attack.Any())
		attack = attack.First();
	else
		attack = [];
		
	
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

$(document).on('click', "td#chess",
	function()
	{
		// обработка клика
		switch (CurrentState)
		{
			case StateEnum.SelectMan:
				SelectMan($(this));
				break;
			case StateEnum.SelectTurn:
				if ($(this).children().length > 0 && $(this).children().first().attr('side') == CurrentTurn)
				{
					ClearPossibleMoves();
					SelectMan($(this).children().first().parent());
					break;
				}
				
				if ($(this).attr('canMove') != 'true')
					break;
				
				
				PerformMove($(this));
				
				
				break;
			default:
				break;
		}
		
})

$(document).on('click', 'img#upgradeSelection',
	function()
	{
		PerformPromotion($(this)[0]);
	}
)

function PerformPromotion($this, send)
{
	var cell = SelectedMan.parentNode;
	var id = SelectedMan.getAttribute('pieceId');
	var to = cell.getAttribute('position');
	var from = $this.getAttribute('from');
	SelectedMan.remove();
	$this.removeAttribute('id');
	$this.removeAttribute('from');
	$this.getAttribute('pieceId', id);
	cell.appendChild($this);
	$('div#upgradingDiv').remove();
	if (GameMode == GameTypeEnum.Multiplayer && send === undefined)
	{
		var pieceName;
		switch (+$this.getAttribute('type'))
		{
			case ChessmanEnum.Rook:
				pieceName = 'rook';
				break;
			case ChessmanEnum.Knight:
				pieceName = 'knight';
				break;
			case ChessmanEnum.Bishop:
				pieceName = 'bishop';
				break;
			case ChessmanEnum.Queen:
				pieceName = 'queen';
				break;
		}
		socket.emit(
			'turn_promotion', 
			{
				playerColor : MySide == SideEnum.White?"white":"black",
				from : { x : from[0].toUpperCase(), y : +from[1] },
				to : { x : to[0].toUpperCase(), y : +to[1] },
				newPiece : pieceName
			});
	}
	EndTurn();
}

function PerformMove($this, send, simple)
{
	var from = SelectedMan.parentElement.getAttribute('position');
	var to = $this.attr('position');
				
	if ($this.children().length > 0)
	{
		$this.empty();
	}
	
	// взятие на проходе
	// оставляем шлейф
	var digit = SelectedMan.parentElement.getAttribute('position').charAt(1);
	if (SelectedMan.getAttribute('type') == ChessmanEnum.Pawn &&
		((CurrentTurn == SideEnum.White && digit == 2 && $this.attr('position').charAt(1) == 4) || 
		(CurrentTurn == SideEnum.Black && digit == 7 && $this.attr('position').charAt(1) == 5)))
	{
		$('td#chess[position=' + $this.attr('position').charAt(0) + (CurrentTurn == SideEnum.White ? '3' : '6' ) + ']').
			attr('enpassant', CurrentTurn);
	}
	// убиваем по шлейфу
	if (SelectedMan.getAttribute('type') == ChessmanEnum.Pawn && $this[0].hasAttribute('enpassant') &&
		$this.attr('enpassant') != CurrentTurn)
	{
		var position = GetPositionComponents($this.attr('position'));
		position[1] += (CurrentTurn == SideEnum.White?-1:1);
		var temp = $('td#chess[position=' + GetPositionFromComponents(position) + ']');
		// $killed = temp.children().eq(0);
		// $killedPosition = temp;
		temp.children().first().remove();
	}
	
	var castling = false;
	// рокировка
	if (SelectedMan.getAttribute('type') == ChessmanEnum.King &&
		$this.attr('rouqe') == "true")
	{
		var flag = ($this.attr('position').charAt(0) == 'g');
		var test = 'td[position="' + (flag?'f':'d') + (CurrentTurn==SideEnum.White?1:8) + '"]';
		var test2 = 'td[position="' + (flag?'h':'a') + (CurrentTurn==SideEnum.White?1:8) + '"]';
		castling = $(test2).attr('position').toUpperCase();
		$(test).
			append($(test2).first().children().first());
	}
	$('td').filter('[rouqe="true"]').removeAttr('rouqe');
	
	// перемещаем фигуру
	var startingPosition = SelectedMan.parentElement;
	$this.append(SelectedMan);
	
	Model = BuildInnerModel();
	
	// запоминаем, что двигали короля/ладью
	if (SelectedMan.getAttribute('type') == ChessmanEnum.King || SelectedMan.getAttribute('type') == ChessmanEnum.Rook)
		SelectedMan.setAttribute('moved', 'true');
	digit = SelectedMan.parentElement.getAttribute('position').charAt(1);
	// апгрейд пешки
	if (send === undefined && SelectedMan.getAttribute('type') == ChessmanEnum.Pawn && 
		((CurrentTurn == SideEnum.White && digit == 8) || 
		(CurrentTurn == SideEnum.Black && digit == 1)))
	{
		CurrentState = StateEnum.UpgradePawn;
		
		var upgradingDiv = document.createElement('div');
		upgradingDiv.setAttribute('id', 'upgradingDiv');
		
		var rook = document.createElement('img');
		rook.setAttribute('src', 
			CurrentTurn==SideEnum.White?'pictures\\white_rook.png':'pictures\\black_rook.png')
		rook.setAttribute('side', CurrentTurn);
		rook.setAttribute('type', ChessmanEnum.Rook);
		rook.setAttribute('id', 'upgradeSelection');
		rook.setAttribute('from', from);
		upgradingDiv.appendChild(rook);
		var knight = document.createElement('img')
		knight.setAttribute('src', 
			CurrentTurn==SideEnum.White?'pictures\\white_knight.png':'pictures\\black_knight.png');
		knight.setAttribute('side', CurrentTurn);
		knight.setAttribute('type', ChessmanEnum.Knight);
		knight.setAttribute('id', 'upgradeSelection');
		knight.setAttribute('from', from);
		upgradingDiv.appendChild(knight);
			
		var bishop = document.createElement('img')
		bishop.setAttribute('src', 
			CurrentTurn==SideEnum.White?'pictures\\white_bishop.png':'pictures\\black_bishop.png');
		bishop.setAttribute('side', CurrentTurn);
		bishop.setAttribute('type', ChessmanEnum.Bishop);
		bishop.setAttribute('id', 'upgradeSelection');
		bishop.setAttribute('from', from);
		upgradingDiv.appendChild(bishop);
		
		var queen = document.createElement('img')
		queen.setAttribute('src', 
			CurrentTurn==SideEnum.White?'pictures\\white_queen.png':'pictures\\black_queen.png');
		queen.setAttribute('side', CurrentTurn);
		queen.setAttribute('type', ChessmanEnum.Queen);
		queen.setAttribute('id', 'upgradeSelection');
		queen.setAttribute('from', from);
		upgradingDiv.appendChild(queen);
		
		document.body.appendChild(upgradingDiv);
	}
	else
	{
		// если хотим НЕ просто подвинуть пешку перед тем как превратить её в нечто большее
		if (simple === undefined)
		{
			EndTurn(CurrentTurn == MySide);
			
			// если мы играем онлаен, сообщаем наш ход
			if (GameMode == GameTypeEnum.Multiplayer && send === undefined)
			{
				if (castling === false)
				{
					socket.emit(
						'turn_move', 
						{
							playerColor : MySide == SideEnum.White?"white":"black",
							from : { x : from[0].toUpperCase(), y : +from[1] },
							to : { x : to[0].toUpperCase(), y : +to[1] }
						});
				}
				else
				{
					socket.emit(
						'turn_castling', 
						{ 
							playerColor : MySide == SideEnum.White?"white":"black",
							from : { x : castling[0], y : +castling[1] }
						});
				}
			}
		}
	}
	ClearPossibleMoves();
}
