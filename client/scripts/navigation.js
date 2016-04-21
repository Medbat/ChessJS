
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
	var weArePawn = Model[positionComponents[0]][positionComponents[1]].type == ChessmanEnum.Pawn;
	for (var i = 0; i < range; i++)
	{
		newPosition[0] += movement[0];
		newPosition[1] += movement[1];
		if (IsPositionComponentsOutOfDesk(newPosition))
			break;
		var $cell = $('td[position="'+GetPositionFromComponents(newPosition)+'"]');
		if (intrest == InterestEnum.Move)
		{
			if (Model[newPosition[0]][newPosition[1]] == null /*&&
				!(weArePawn && $cell[0].hasAttribute('enpassant'))*/)
			{
				positions.push(newPosition.clone());
			}
			else
				break;
		}
		else
		{
			if (Model[newPosition[0]][newPosition[1]] == null && 
				!(weArePawn && $cell[0].hasAttribute('enpassant')))
				continue;
			if ((Model[newPosition[0]][newPosition[1]] !== null && 
				Model[newPosition[0]][newPosition[1]].side != side) || 
				(weArePawn && $cell[0].hasAttribute('enpassant')))
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

// с учетом шаха
function GetFullyPossibleMoves(chessman, position, intrest)
{
	var result = GetPossibleMoves(chessman, position, intrest);
	//var $piece = $('td[position="' + GetPositionFromComponents(position) + '"]').children().eq(0);
	result = ExcludeCheckMoves(position, result);
	return result;
}

// без учета шаха
function GetPossibleMoves(chessman, position, intrest)
{
	var movements;
	var range;
	chessman = +chessman;
	var side = +Model[position[0]][position[1]].side;
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
	var result = NavigateContiniouslyMultiplePositions(position, side, intrest, movements, range);
	if (chessman == ChessmanEnum.King && intrest == InterestEnum.Move)
	{
		var $availableRooks = $('img[type="'+ChessmanEnum.Rook+'"][side="'+CurrentTurn+'"]:not([moved])');
		for (var i = 0; i < $availableRooks.length; i++)
		{
			var rouqe = RoqueAvailability(
				$('td[position="'+GetPositionFromComponents(position)+'"]').first().children()[0], 
				$availableRooks[i]);
			if (rouqe === false)
				continue;
			result.push(rouqe);
			$('td[position="' + GetPositionFromComponents(rouqe) + '"]').attr('rouqe', 'true');
		}
	}
	return result;
}

function CalculateSideMoves(side, itWasMe)
{
	PossibleMoves = [];
	side = parseInt(side);
	var $pieces = $('img[side="' + side + '"]');
	var any = false;
	var check = GetKingUnderAttack();
	for (var i = 0; i < $pieces.length; i++)
	{
		var info = {};
		info.id = $pieces.eq(i).attr('pieceId');
		info.moves = GetFullyPossibleMoves($pieces.eq(i).attr('type'), GetPositionComponents($pieces.eq(i).parent().attr('position')), InterestEnum.Move);
		info.attacks = GetFullyPossibleMoves($pieces.eq(i).attr('type'), GetPositionComponents($pieces.eq(i).parent().attr('position')), InterestEnum.Hit);
		if (Enumerable.From(info.moves).Any() || Enumerable.From(info.attacks).Any())
			any = true;
		PossibleMoves.push(info);
	}
	if (!any)
	{
		CurrentState = StateEnum.GameEnd;
		if (check[0] == false && check[1] == false)
		{
			console.log("Draw");
			Winner = SideEnum.No;
			if (GameMode == GameTypeEnum.Multiplayer && !itWasMe)
			{
				socket.emit('turn_draw');
			}
		}
		else
		{
			if (check[0] == true)
			{
				console.log("Black wins");
				Winner = SideEnum.Black;
				if (GameMode == GameTypeEnum.Multiplayer && !itWasMe && MySide == SideEnum.White)
				{
					socket.emit('turn_mate');
				}
			}
			else
			{
				console.log("White wins");
				Winner = SideEnum.White;
				if (GameMode == GameTypeEnum.Multiplayer && !itWasMe && MySide == SideEnum.Black)
				{
					socket.emit('turn_mate');
				}
			}
		}
	}
	return any;
}

