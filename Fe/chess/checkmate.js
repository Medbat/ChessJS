 function GetKingUnderAttack()
{
	var whiteKingIsUnderAttack = false;
	var blackKingIsUnderAttack = false;
	var $kingsCells = $('td:has(img[type="'+ChessmanEnum.King+'"])');
	for (var i = 0; i < 2; i++)
	{
		var kingSide = $kingsCells.eq(i).children().first().attr('side');
		var $enemyPositions = $('td:has(img[side='+(kingSide==SideEnum.White?SideEnum.Black:SideEnum.White)+'])');
		var kingPosition = GetPositionComponents($kingsCells.eq(i).attr('position'));
		for (var j = 0; j < $enemyPositions.length; j++)
		{
			var danger = GetPossibleMoves(
				$enemyPositions.eq(j).children().first().attr('type'), 
				GetPositionComponents($enemyPositions.eq(j).attr('position')),
				InterestEnum.Hit);
			var check = false;
			danger.forEach(function(item, index, danger) 
			{
				if (item[0] == kingPosition[0] && item[1] == kingPosition[1])
				{
					check = true;
					return;
				}
			});
			if (check)
			{
				if (kingSide == 0)
					whiteKingIsUnderAttack = true;
				else 
					blackKingIsUnderAttack = true;
				if (whiteKingIsUnderAttack == true && blackKingIsUnderAttack == true)
					return [true, true];
			}
		}
	}
	return [whiteKingIsUnderAttack, blackKingIsUnderAttack];
}


function ExcludeCheckMoves(piece, moves)
{
	var startPos = piece.parentElement;
	var i = 0;
	while (i < moves.length)
	{
		var killed = null;
		var $newPos = $('td[position="' + GetPositionFromComponents(moves[i]) + '"]');
		if ($newPos.children().length > 0)
		{
			killed = $newPos.children()[0];
			$newPos.children().first().remove();
		}
		$newPos.append(piece);
		var check = GetKingUnderAttack();
		if (check[parseInt(piece.getAttribute('side'))] == true)
		{
			moves.splice(i, 1);
			i--;
		}
		if (killed != null)
			$newPos.append(killed);
		i++;
	}
	startPos.appendChild(piece);
	return moves;
}