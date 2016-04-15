function BuildInnerModel()
{
	var model = [];
	for (var i = 0; i < 8; i++)
	{
		model.push([]);
		for (var j = 0; j < 8; j++)
		{
			model[i].push(null);
		}
	}
	
	$('td[id="chess"]').each(function (index, element)
	{
		if ($(this).children().length > 0)
		{
			var $piece = $(this).children().first();
			var pieceModel = 
			{
				side : $piece.attr('side'),
				type : $piece.attr('type'),
				id : $piece.attr('pieceId')
			};
			var position = GetPositionComponents($(this).attr('position'));
			model[position[0]][position[1]] = pieceModel;
		}
	});
	return model;
}