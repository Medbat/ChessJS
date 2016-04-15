var MySide;

console.log('connecting to server');
socket = io.connect('http://127.0.0.1:9898');

socket.on("connect", function () 
{
	console.log('connected. looking for games...');
	socket.emit("game_find");
	socket.on("game_found", function(obj)
	{
		console.log('Game found, room id = ' + obj.roomID);
		console.log('your colour is ' + (obj.isWhite?'white':'black'));		
		createTable(obj.isWhite);
		setChessmen();
		MySide = obj.isWhite?SideEnum.White:SideEnum.Black;
	});
	socket.on('turn_move', function (data)
	{
		/*возникает, когда игрок делает обычный ход фигурой
			from - координаты до хода
			to - координаты после хода
		*/
		
		// если два хода подряд
		if (CurrentTurn == MySide)
		{
			console.log('Opponent tried to move twice');
			socket.emit('turnValidation_invalid');
		}
		// если пришла пустая/невозможная инфа
		if (isBad(data) || 
			isBad(data.from) ||
			isBad(data.to) ||
			letters.indexOf(data.from.x.toLowerCase()) == -1 ||
			(data.from.y < 1 && data.from.y > 8) ||
			letters.indexOf(data.to.x.toLowerCase()) == -1 ||
			(data.to.y < 1 && data.to.y > 8))
		{
			console.log('Bad info was found');
			socket.emit('turnValidation_invalid');
		}
		var fromPosition = data.from.x.toLowerCase() + data.from.y;
		var fromPositionComponents = GetPositionComponents(fromPosition);
		var toPosition = data.to.x.toLowerCase() + data.to.y;
		var toPositionComponents = GetPositionComponents(toPosition);
		// если фигуры на этом месте нет / она наша
		if (Model[fromPositionComponents[0]][fromPositionComponents[1]] == null || 
			Model[fromPositionComponents[0]][fromPositionComponents[1]].side == MySide)
		{
			console.log('No piece found at ' + fromPosition + ' or it is yours');
			socket.emit('turnValidation_invalid');
		}
		// если фигура не может пойти туда, куда хочет
		if (Enumerable.From(PossibleMoves).
			Where(function (x) { x.id == Model[fromPositionComponents[0]][fromPositionComponents[1]]}).
			Any(function (x) 
			{
				return Enumerable.From(x.moves).
					Any(function (y) {y[0] == toPositionComponents[0] && y[1] == toPositionComponents[1]; }) ||
					Enumerable.From(x.attacks).
					Any(function (y) {y[0] == toPositionComponents[0] && y[1] == toPositionComponents[1]; })
			}))
		{
			console.log('Opponents turn cannot be performed (game rules)');
			socket.emit('turnValidation_invalid');
		}
		SelectedMan = $('td[position="'+fromPosition+'"]').children()[0];
		PerformMove($('td[position="'+toPosition+'"]').first());
		//$('td[position="'+toPosition+'"]').;
		
	});
	socket.on('game_end', function (data)
	{
		console.log('Game ended. Reason: ' + data.msg, '. Winner: ' + data.winnerColor);
		CurrentState = StateEnum.GameEnd;
	});
});

function isBad(obj)
{
	return obj === false || obj === undefined;
}
