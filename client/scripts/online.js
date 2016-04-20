var MySide;
GameMode = GameTypeEnum.Multiplayer;

var addr = '127.0.0.1';
var port = '3056';

console.log('connecting to server ' + addr + ':' + port);

socket = io.connect('http://'+addr+':' + port);

var roomList = document.createElement('div');
document.body.appendChild(roomList);

var actionsDiv = document.createElement('div');

socket.on("connect", function ()
{
	document.body.innerHTML = '';
	roomList.innerHTML = '';
	actionsDiv.innerHTML = '';
	$('table').remove;
	console.log('connected to server');
	actionsDiv.innerHTML += 
		'<a onClick="socket.emit(\'game_find\'); document.body.removeChild(actionsDiv); ' +
		'console.log(\'searching for game ...\');">PLAY</a><br/>' + 
		'<a onClick="socket.emit(\'roomsList_subscribe\'); document.body.removeChild(actionsDiv);">WATCH</a>';
	document.body.appendChild(actionsDiv);
	
	socket.on('disconnect', function()
	{
		console.log('you was disconnected!');
		socket.disconnect();
	});

	socket.on("roomsList", function(data)
	{
		roomList.innerHTML = 'ROOM LIST (click to watch) <br/>';
		for (var i = 0; i < data.length; i++)
		{
			roomList.innerHTML += 
				'<a onClick="socket.emit(\'room_enter\', \'' + data[i].roomID + 
				'\'); document.body.removeChild(roomList); createTable(true); ' +
				'setChessmen(); MySide = SideEnum.No; Winner = null;">' + 
				data[i].roomID + ' (' + data[i].length + ')</a><br/>';
		}
		document.body.appendChild(roomList);
	});
	
	socket.on('game_logs', function(data)
	{
		console.log('got moves data, length = ' + data.length);
		socket.emit('roomsList_unsubscribe');
		
		for (var i = 0; i < data.length; i++)
		{
			switch (data[i].moveType)
			{
				case 'move':
					DoMove(data[i].moveData);
					break;
				case 'castling':
					DoCastling(data[i].moveData);
					break;
				case 'promotion':
					DoPromotion(data[i].moveData);
					break;
			}
		}
	});
	
	socket.on("game_found", function(obj)
	{
		console.log('Game found, room id = ' + obj.roomID);
		console.log('your colour is ' + (obj.color));		
		createTable(obj.color == 'white');
		setChessmen();
		MySide = obj.color == 'white'?SideEnum.White:SideEnum.Black;
		Winner = null;
	});
	
	socket.on('player_move', function (data)
	{
		// если два хода подряд
		if (CurrentTurn == MySide)
		{
			console.log('Opponent tried to move twice');
			socket.emit('turnValidation_invalid');
			return;
		}
		
		// если пришла пустая/невозможная инфа
		if (isBadObject(data) || 
			isBadObject(data.from) ||
			isBadObject(data.to) ||
			isBadCoord(data.from) ||
			isBadCoord(data.to))
		{
			console.log('Bad info was found');
			socket.emit('turnValidation_invalid');
			return;
		}
		
		if (!ValidateFromTo(data, true))
			return;
		
		DoMove(data);
	});
	
	socket.on('player_castling', function (data)
	{
		// если два хода подряд
		if (CurrentTurn == MySide)
		{
			console.log('Opponent tried to move twice');
			socket.emit('turnValidation_invalid');
			return;
		}
		// если пришла пустая/невозможная инфа
		if (isBadObject(data) || 
			isBadObject(data.from) ||
			isBadCoord(data.from))
		{
			console.log('Bad info was found');
			socket.emit('turnValidation_invalid');
			return;
		}
		
		if (!ValidateFromTo(data, false))
			return;
		
		// деланье
		DoCastling(data);
	});
	
	socket.on('player_promotion', function (data)
	{
		// если два хода подряд
		if (CurrentTurn == MySide)
		{
			console.log('Opponent tried to move twice');
			socket.emit('turnValidation_invalid');
			return;
		}
		// если пришла пустая/невозможная инфа
		if (isBadObject(data) || 
			isBadObject(data.from) ||
			isBadObject(data.to) ||
			isBadCoord(data.from) ||
			isBadCoord(data.to) ||
			(data.newPiece != 'knight' && data.newPiece != 'rook' && data.newPiece != 'bishop' && data.newPiece != 'queen'))
		{
			console.log('Bad info was found');
			socket.emit('turnValidation_invalid');
			return;
		}
		
		if (!ValidateFromTo(data, true))
			return;
		
		// деланье
		DoPromotion(data);
	});
	
	socket.on('player_mate', function ()
	{
		if (Winner == null || Winner != MySide)
		{
			console.log('Opponent didnt loose but tells so');
			socket.emit('turnValidation_invalid');
			return;
		}
		console.log('Loose accepted');
		socket.emit('turnValidation_mate');
	});
	
	socket.on('player_draw', function ()
	{
		if (Winner == null || Winner != SideEnum.No)
		{
			console.log('Game is not draw but your opponent tells so');
			socket.emit('turnValidation_invalid');
			return;
		}
		console.log('Draw accepted');
		socket.emit('turnValidation_draw');
	});
	
	socket.on('game_end', function (data)
	{
		console.log('Game ended. Reason: ' + data.msg + '. Winner: ' + data.winnerColor);
		CurrentState = StateEnum.GameEnd;
		socket.destroy();
		console.log('disconnected from server');
	});
});

function ValidateFromTo(data, isTo)
{
	var fromPosition = data.from.x.toLowerCase() + data.from.y;
	var fromPositionComponents = GetPositionComponents(fromPosition);
	// если фигуры на этом месте нет / она наша
	if (Model[fromPositionComponents[0]][fromPositionComponents[1]] == null || 
		Model[fromPositionComponents[0]][fromPositionComponents[1]].side == MySide)
	{
		console.log('No piece found at ' + fromPosition + ' or it is yours');
		socket.emit('turnValidation_invalid');
		return false;
	}
	if (isTo)
	{
		var toPosition = data.to.x.toLowerCase() + data.to.y;
		var toPositionComponents = GetPositionComponents(toPosition);
		// если фигура не может пойти туда, куда хочет
		var a = Enumerable.From(PossibleMoves).
			Where(function (x) { x.id == Model[fromPositionComponents[0]][fromPositionComponents[1]].id; });
			
		if (Enumerable.From(a).Any(function (x) 
			{
				return Enumerable.From(x.moves).
					Any(function (y) {y[0] == toPositionComponents[0] && y[1] == toPositionComponents[1]; }) ||
					Enumerable.From(x.attacks).
					Any(function (y) {y[0] == toPositionComponents[0] && y[1] == toPositionComponents[1]; })
			}))
		{
			console.log('Opponents turn cannot be performed (game rules)');
			socket.emit('turnValidation_invalid');
			return false;
		}
	}
	return true;
}

function isBadObject(obj)
{
	return obj === null || obj === undefined || typeof(obj) !== "object";
}

function isBadCoord(coord)
{
	return 
		letters.indexOf(coord.x.toLowerCase()) == -1 ||
		coord.y < 1 || coord.y > 8;
}

function DoCastling(data)
{
	SelectedMan = $('td[position="'+(data.playerColor=='white'?'e1':'e8')+'"]').children()[0];
	var where;
	if (data.playerColor == 'white')
	{
		if (data.from.x == 'A')
			where = 'c1';
		else
			where = 'g1';
	}
	else
	{
		if (data.from.x == 'A')
			where = 'c8';
		else
			where = 'g8';
	}
	PerformMove($('td[position="'+ where +'"]').first(), false);
}

function DoPromotion(data)
{
	SelectedMan = $('td[position="'+data.from.x.toLowerCase()+data.from.y+'"]').children()[0];
	PerformMove($('td[position="'+ data.to.x.toLowerCase()+data.to.y +'"]').first(), false, true);
	SelectedMan = $('td[position="'+data.to.x.toLowerCase()+data.to.y+'"]').children()[0];
	var piece = document.createElement('img');
	piece.setAttribute('src', 
		data.playerColor=='white' ?
			('pictures\\white_'+data.newPiece+'.png') :
			('pictures\\black_'+data.newPiece+'.png'))
	piece.setAttribute('side', data.playerColor=='white'?SideEnum.White:StateEnum.Black);
	var type;
	switch (data.newPiece)
	{
		case 'rook':
			type = ChessmanEnum.Rook;
			break;
		case 'knight':
			type = ChessmanEnum.Knight;
			break;
		case 'bishop':
			type = ChessmanEnum.Bishop;
			break;
		case 'queen':
			type = ChessmanEnum.Queen;
			break;
	}
	piece.setAttribute('type', type);
	piece.setAttribute('id', 'upgradeSelection');
	piece.setAttribute('from', data.from);
	
	PerformPromotion(piece, false);
}

function DoMove(data)
{
	SelectedMan = $('td[position="' + 
		data.from.x.toLowerCase()+data.from.y+'"]').children()[0];
	PerformMove($('td[position="'+data.to.x.toLowerCase()+data.to.y+'"]').first(), false);
}

