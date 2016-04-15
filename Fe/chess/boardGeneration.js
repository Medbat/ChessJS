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

function createTable()
{
	var mainTable = document.createElement('table');
	mainTable.setAttribute('id', 'chess');
	var tr = mainTable.insertRow();
	var td = tr.insertCell();
	for (var i = 0; i < 8; i++)
	{
		td = tr.insertCell();
		td.innerHTML = '<p align="center">' + letters[i] + '</p>';
	}
	for (var i = 0; i < 8; i++)
	{	
		tr = mainTable.insertRow();
		td = tr.insertCell();
		td.innerHTML = (8-i);
		for (var j = 0; j < 8; j++)
		{
			td = tr.insertCell();
			td.setAttribute('id', 'chess');
			td.setAttribute('bgcolor', takeColor());
			td.setAttribute('position', letters.charAt(j)+(8-i));
			var pos = document.createTextNode(letters.charAt(j)+(8-i));
		}
		td = tr.insertCell();
		td.innerHTML = (8-i);
		takeColor();
	}
	tr = mainTable.insertRow();
	td = tr.insertCell();
	for (var i = 0; i < 8; i++)
	{
		td = tr.insertCell();
		td.innerHTML = '<p align="center">' + letters[i] + '</p>';
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
		piece.setAttribute('src', '..\\..\\chessmen\\white_pawn.png')
		piece.setAttribute('side', SideEnum.White)
		piece.setAttribute('type', ChessmanEnum.Pawn)
		$('td[position="'+letters.charAt(i)+'2"]').append(piece)
		piece = document.createElement('img')
		piece.setAttribute('pieceId', id++);
		piece.setAttribute('src', '..\\..\\chessmen\\black_pawn.png')
		piece.setAttribute('side', SideEnum.Black)
		piece.setAttribute('type', ChessmanEnum.Pawn)		
		$('td[position="'+letters.charAt(i)+'7"]').append(piece)
	}
	for (var i = 0; i < 2; i++)
	{
		piece = document.createElement('img')
		piece.setAttribute('pieceId', id++);
		piece.setAttribute('src', '..\\..\\chessmen\\white_rook.png')
		piece.setAttribute('side', SideEnum.White)
		piece.setAttribute('type', ChessmanEnum.Rook)
		$('td[position="'+letters.charAt(i==0?0:7)+'1"]').append(piece)
		piece = document.createElement('img')
		piece.setAttribute('pieceId', id++);
		piece.setAttribute('src', '..\\..\\chessmen\\black_rook.png')
		piece.setAttribute('side', SideEnum.Black)
		piece.setAttribute('type', ChessmanEnum.Rook)
		$('td[position="'+letters.charAt(i==0?0:7)+'8"]').append(piece)
	}
	for (var i = 0; i < 2; i++)
	{
		piece = document.createElement('img')
		piece.setAttribute('pieceId', id++);
		piece.setAttribute('src', '..\\..\\chessmen\\white_knight.png')
		piece.setAttribute('side', SideEnum.White)
		piece.setAttribute('type', ChessmanEnum.Knight)
		$('td[position="'+letters.charAt(i==0?1:6)+'1"]').append(piece)
		piece = document.createElement('img')
		piece.setAttribute('pieceId', id++);
		piece.setAttribute('src', '..\\..\\chessmen\\black_knight.png')
		piece.setAttribute('side', SideEnum.Black)
		piece.setAttribute('type', ChessmanEnum.Knight)
		$('td[position="'+letters.charAt(i==0?1:6)+'8"]').append(piece)
	}
	for (var i = 0; i < 2; i++)
	{
		piece = document.createElement('img')
		piece.setAttribute('pieceId', id++);
		piece.setAttribute('src', '..\\..\\chessmen\\white_bishop.png')
		piece.setAttribute('side', SideEnum.White)
		piece.setAttribute('type', ChessmanEnum.Bishop)
		$('td[position="'+letters.charAt(i==0?2:5)+'1"]').append(piece)
		piece = document.createElement('img')
		piece.setAttribute('pieceId', id++);
		piece.setAttribute('src', '..\\..\\chessmen\\black_bishop.png')
		piece.setAttribute('side', SideEnum.Black)
		piece.setAttribute('type', ChessmanEnum.Bishop)
		$('td[position="'+letters.charAt(i==0?2:5)+'8"]').append(piece)
	}
	
	piece = document.createElement('img')
	piece.setAttribute('pieceId', id++);
	piece.setAttribute('src', '..\\..\\chessmen\\white_queen.png')
	piece.setAttribute('side', SideEnum.White)
	piece.setAttribute('type', ChessmanEnum.Queen)
	$('td[position="'+letters.charAt(3)+'1"]').append(piece)
	piece = document.createElement('img')
	piece.setAttribute('pieceId', id++);
	piece.setAttribute('src', '..\\..\\chessmen\\black_queen.png')
	piece.setAttribute('side', SideEnum.Black)
	piece.setAttribute('type', ChessmanEnum.Queen)
	$('td[position="'+letters.charAt(3)+'8"]').append(piece)
	piece = document.createElement('img')
	piece.setAttribute('pieceId', id++);
	piece.setAttribute('src', '..\\..\\chessmen\\white_king.png')
	piece.setAttribute('side', SideEnum.White)
	piece.setAttribute('type', ChessmanEnum.King)
	$('td[position="'+letters.charAt(4)+'1"]').append(piece)
	piece = document.createElement('img')
	piece.setAttribute('pieceId', id++);
	piece.setAttribute('src', '..\\..\\chessmen\\black_king.png')
	piece.setAttribute('side', SideEnum.Black)
	piece.setAttribute('type', ChessmanEnum.King)
	$('td[position="'+letters.charAt(4)+'8"]').append(piece)
	
	// for (var i = 0; i < 100; i++)
	// {
		// $('td[position="'+letters.charAt(4)+'8"]').append(piece)
		// $('td[position="'+letters.charAt(4)+'1"]').append(piece)
		// $('td[position="'+letters.charAt(3)+'8"]').append(piece)
		
	// }
	
	CalculateSideMoves(CurrentTurn);
}

// function testSet()
// {
	// var piece = document.createElement('img')
	// piece.setAttribute('src', '..\\..\\chessmen\\black_rook.png')
	// piece.setAttribute('side', SideEnum.Black)
	// piece.setAttribute('type', ChessmanEnum.Rook)
	// $('td[position="e8"]').append(piece)
	
	// piece = document.createElement('img')
	// piece.setAttribute('src', '..\\..\\chessmen\\black_rook.png')
	// piece.setAttribute('side', SideEnum.Black)
	// piece.setAttribute('type', ChessmanEnum.Rook)
	// $('td[position="'+letters.charAt(7)+'8"]').append(piece)
	
	// piece = document.createElement('img')
	// piece.setAttribute('src', '..\\..\\chessmen\\white_queen.png')
	// piece.setAttribute('side', SideEnum.White)
	// piece.setAttribute('type', ChessmanEnum.Queen)
	// $('td[position="e2"]').append(piece)
	
	// piece = document.createElement('img')
	// piece.setAttribute('src', '..\\..\\chessmen\\white_king.png')
	// piece.setAttribute('side', SideEnum.White)
	// piece.setAttribute('type', ChessmanEnum.King)
	// $('td[position="'+letters.charAt(4)+'1"]').append(piece)

	// piece = document.createElement('img')
	// piece.setAttribute('src', '..\\..\\chessmen\\black_king.png')
	// piece.setAttribute('side', SideEnum.Black)
	// piece.setAttribute('type', ChessmanEnum.King)
	// $('td[position="f8"]').append(piece)
// }
