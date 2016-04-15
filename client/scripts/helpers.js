
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


function RoqueAvailability(king, rook)
{
	// шах(TODO) ли сейчас, двигались ли фигуры
	if (king.hasAttribute('moved') || rook.hasAttribute('moved')/* || king.getAttribute('side') == Check*/)
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
	var startingPoint = king.parentElement;
	// TODO: будет ли король под шахом при рокировке
	// for (var i = 1; i <= 2; i++)
	// {
		// $('td[position="' + GetPositionFromComponents([(inc?i:-i) + kingPos[0], kingPos[1]]) + '"]').append(king);
		// if (king.getAttribute('side') == CheckCheckmate())
		// {
			// startingPoint.appendChild(king);
			// return false;
		// }
	// }
	startingPoint.appendChild(king);
	return [(inc?2:-2) + kingPos[0], kingPos[1]];
}