function GetKingUnderAttack()
{
	var whiteKingIsUnderAttack = false;
	var blackKingIsUnderAttack = false;
	var kings = [];
	for (var i = 0; i < 8; i++)
	{
		for (var j = 0; j < 8; j++)
		{
			if (Model[i][j] !== null && Model[i][j].type == ChessmanEnum.King)
				kings.push({
					position : [i, j],
					side : Model[i][j].side
				});
		}
	}
	
	for (var kingIndex = 0; kingIndex < 2; kingIndex++)
	{
		for (var i = 0; i < 8; i++)
		{
			for (var j = 0; j < 8; j++)
			{
				if (Model[i][j] === null || Model[i][j].side == kings[kingIndex].side)
					continue;
				var danger = GetPossibleMoves(Model[i][j].type, [i, j], InterestEnum.Hit);
				var check = false;
				danger.forEach(function(item, index, danger) 
				{
					if (item[0] == kings[kingIndex].position[0] && item[1] == kings[kingIndex].position[1])
					{
						check = true;
						return;
					}
				});
				if (check)
				{
					if (kings[kingIndex].side == 0)
						whiteKingIsUnderAttack = true;
					else 
						blackKingIsUnderAttack = true;
					if (whiteKingIsUnderAttack == true && blackKingIsUnderAttack == true)
						return [true, true];
				}
			}
		}
	}
	return [whiteKingIsUnderAttack, blackKingIsUnderAttack];
}


function ExcludeCheckMoves(position, moves)
{
	var side = Model[position[0]][position[1]].side;
	// var $startPos = $piece.parent();
	var i = 0;
	while (i < moves.length)
	{
		var killed = null;
		// var $newPos = $('td[position="' + GetPositionFromComponents(moves[i]) + '"]').first();
		var newPos = moves[i];
		if (Model[newPos[0]][newPos[1]] !== null)
		{
			killed = Model[newPos[0]][newPos[1]];
			Model[newPos[0]][newPos[1]] = null;
		}
		// $newPos.append($piece);
		// передвигаем
		Model[newPos[0]][newPos[1]] = Model[position[0]][position[1]];
		Model[position[0]][position[1]] = null;
		
		var check = GetKingUnderAttack();
		if (check[+side] == true)
		{
			moves.splice(i, 1);
			i--;
		}
		Model[position[0]][position[1]] = Model[newPos[0]][newPos[1]];
		Model[newPos[0]][newPos[1]] = null;
		if (killed !== null)
		{
			Model[newPos[0]][newPos[1]] = killed;
			killed = null;
		}
		// $newPos.append($killed);
		i++;
	}
	// $startPos.append($piece);
	return moves;
}
