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

function createTable(isWhite)
{
	var mainTable = document.createElement('table');
	mainTable.setAttribute('id', 'chess');
	var tr = mainTable.insertRow();
	var td = tr.insertCell();
	for (var i = 0; i < 8; i++)
	{
		td = tr.insertCell();
		td.innerHTML = '<p align="center">' + letters[isWhite?i:8-i-1] + '</p>';
	}
	for (var i = 0; i < 8; i++)
	{	
		tr = mainTable.insertRow();
		td = tr.insertCell();
		td.innerHTML = isWhite?8-i:i+1;
		for (var j = 0; j < 8; j++)
		{
			td = tr.insertCell();
			td.setAttribute('id', 'chess');
			td.setAttribute('bgcolor', takeColor());
			td.setAttribute('position', letters.charAt(isWhite?j:8-j-1)+(isWhite?8-i:i+1));
		}
		td = tr.insertCell();
		td.innerHTML = isWhite?8-i:i+1;
		takeColor();
	}
	tr = mainTable.insertRow();
	td = tr.insertCell();
	for (var i = 0; i < 8; i++)
	{
		td = tr.insertCell();
		td.innerHTML = '<p align="center">' + letters[isWhite?i:8-i-1] + '</p>';
	}
	document.body.appendChild(mainTable);
}

// создать фигуры и поставить их в стартовые позиции
function setChessmen()
{
	var id = 0;
	var piece;
	for (var i = 0; i < 8; i++)
	{
		piece = document.createElement('img');
		piece.setAttribute('pieceId', id++);
		piece.setAttribute('src', 'pictures\\white_pawn.png')
		piece.setAttribute('side', SideEnum.White)
		piece.setAttribute('type', ChessmanEnum.Pawn)
		$('td[position="'+letters.charAt(i)+'2"]').append(piece)
		piece = document.createElement('img')
		piece.setAttribute('pieceId', id++);
		piece.setAttribute('src', 'pictures\\black_pawn.png')
		piece.setAttribute('side', SideEnum.Black)
		piece.setAttribute('type', ChessmanEnum.Pawn)		
		$('td[position="'+letters.charAt(i)+'7"]').append(piece)
	}
	for (var i = 0; i < 2; i++)
	{
		piece = document.createElement('img')
		piece.setAttribute('pieceId', id++);
		piece.setAttribute('src', 'pictures\\white_rook.png')
		piece.setAttribute('side', SideEnum.White)
		piece.setAttribute('type', ChessmanEnum.Rook)
		$('td[position="'+letters.charAt(i==0?0:7)+'1"]').append(piece)
		piece = document.createElement('img')
		piece.setAttribute('pieceId', id++);
		piece.setAttribute('src', 'pictures\\black_rook.png')
		piece.setAttribute('side', SideEnum.Black)
		piece.setAttribute('type', ChessmanEnum.Rook)
		$('td[position="'+letters.charAt(i==0?0:7)+'8"]').append(piece)
	}
	for (var i = 0; i < 2; i++)
	{
		piece = document.createElement('img')
		piece.setAttribute('pieceId', id++);
		piece.setAttribute('src', 'pictures\\white_knight.png')
		piece.setAttribute('side', SideEnum.White)
		piece.setAttribute('type', ChessmanEnum.Knight)
		$('td[position="'+letters.charAt(i==0?1:6)+'1"]').append(piece)
		piece = document.createElement('img')
		piece.setAttribute('pieceId', id++);
		piece.setAttribute('src', 'pictures\\black_knight.png')
		piece.setAttribute('side', SideEnum.Black)
		piece.setAttribute('type', ChessmanEnum.Knight)
		$('td[position="'+letters.charAt(i==0?1:6)+'8"]').append(piece)
	}
	for (var i = 0; i < 2; i++)
	{
		piece = document.createElement('img')
		piece.setAttribute('pieceId', id++);
		piece.setAttribute('src', 'pictures\\white_bishop.png')
		piece.setAttribute('side', SideEnum.White)
		piece.setAttribute('type', ChessmanEnum.Bishop)
		$('td[position="'+letters.charAt(i==0?2:5)+'1"]').append(piece)
		piece = document.createElement('img')
		piece.setAttribute('pieceId', id++);
		piece.setAttribute('src', 'pictures\\black_bishop.png')
		piece.setAttribute('side', SideEnum.Black)
		piece.setAttribute('type', ChessmanEnum.Bishop)
		$('td[position="'+letters.charAt(i==0?2:5)+'8"]').append(piece)
	}
	
	piece = document.createElement('img')
	piece.setAttribute('pieceId', id++);
	piece.setAttribute('src', 'pictures\\white_queen.png')
	piece.setAttribute('side', SideEnum.White)
	piece.setAttribute('type', ChessmanEnum.Queen)
	$('td[position="'+letters.charAt(3)+'1"]').append(piece)
	piece = document.createElement('img')
	piece.setAttribute('pieceId', id++);
	piece.setAttribute('src', 'pictures\\black_queen.png')
	piece.setAttribute('side', SideEnum.Black)
	piece.setAttribute('type', ChessmanEnum.Queen)
	$('td[position="'+letters.charAt(3)+'8"]').append(piece)
	piece = document.createElement('img')
	piece.setAttribute('pieceId', id++);
	piece.setAttribute('src', 'pictures\\white_king.png')
	piece.setAttribute('side', SideEnum.White)
	piece.setAttribute('type', ChessmanEnum.King)
	$('td[position="'+letters.charAt(4)+'1"]').append(piece)
	piece = document.createElement('img')
	piece.setAttribute('pieceId', id++);
	piece.setAttribute('src', 'pictures\\black_king.png')
	piece.setAttribute('side', SideEnum.Black)
	piece.setAttribute('type', ChessmanEnum.King)
	$('td[position="'+letters.charAt(4)+'8"]').append(piece)
	
	Model = BuildInnerModel();
	CalculateSideMoves(CurrentTurn);
}

// function testSet()
// {
	// var piece = document.createElement('img')
	// piece.setAttribute('src', 'pictures\\black_rook.png')
	// piece.setAttribute('side', SideEnum.Black)
	// piece.setAttribute('type', ChessmanEnum.Rook)
	// $('td[position="e8"]').append(piece)
	
	// piece = document.createElement('img')
	// piece.setAttribute('src', 'pictures\\black_rook.png')
	// piece.setAttribute('side', SideEnum.Black)
	// piece.setAttribute('type', ChessmanEnum.Rook)
	// $('td[position="'+letters.charAt(7)+'8"]').append(piece)
	
	// piece = document.createElement('img')
	// piece.setAttribute('src', 'pictures\\white_queen.png')
	// piece.setAttribute('side', SideEnum.White)
	// piece.setAttribute('type', ChessmanEnum.Queen)
	// $('td[position="e2"]').append(piece)
	
	// piece = document.createElement('img')
	// piece.setAttribute('src', 'pictures\\white_king.png')
	// piece.setAttribute('side', SideEnum.White)
	// piece.setAttribute('type', ChessmanEnum.King)
	// $('td[position="'+letters.charAt(4)+'1"]').append(piece)

	// piece = document.createElement('img')
	// piece.setAttribute('src', 'pictures\\black_king.png')
	// piece.setAttribute('side', SideEnum.Black)
	// piece.setAttribute('type', ChessmanEnum.King)
	// $('td[position="f8"]').append(piece)
// }
