function ChangeTurn()
{
	if (CurrentTurn == SideEnum.White)
		CurrentTurn = SideEnum.Black;
	else
		CurrentTurn = SideEnum.White;
	var $passants = $('td#chess[enpassant="' + CurrentTurn + '"]');
	$passants.removeAttr('enpassant');
}

function EndTurn(itWasMe)
{
	SelectedMan = null;
	ChangeTurn();
	// возвращаемся в фазу выбора фигуры
	CurrentState = StateEnum.SelectMan;
	Model = BuildInnerModel();
	CalculateSideMoves(CurrentTurn, itWasMe);
}
