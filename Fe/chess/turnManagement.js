function ChangeTurn()
{
	if (CurrentTurn == SideEnum.White)
		CurrentTurn = SideEnum.Black;
	else
		CurrentTurn = SideEnum.White;
	var $passants = $('td#chess[enpassant="' + CurrentTurn + '"]');
	$passants.removeAttr('enpassant');
}

function EndTurn()
{
	SelectedMan = null;
	ChangeTurn();
	// возвращаемся в фазу выбора фигуры
	CurrentState = StateEnum.SelectMan;
	CalculateSideMoves(CurrentTurn);
}
