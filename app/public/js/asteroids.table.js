var columns = {
    full_name: 'Название',
    diameter: 'Диаметр (км)',
    pha: 'Риск столкновения',
	q: 'Перигейное расстояние (ае)',
	ad: 'Апогейное расстояние (ае)',
	first_obs: 'Дата первого наблюдения',
	last_obs: 'Дата последнего наблюдения'
};


var table = $('#table-sortable').tableSortable({
    data: [],
	columns : columns,
    rowsPerPage: 40,
    pagination: true,
    formatHeader: function(columnValue, columnKey, index) {
        if (columnKey === 'ad') {
            return $('<div></div>').attr('data-toggle', "tooltip").attr('title', "Апогейное расстояние равно расстоянию между дальнейшей точкой орбиты и Землёй, измеряется в астрономических единицах (ае)").text(columnValue);
        }
        if (columnKey === 'q') {
            return $('<div></div>').attr('data-toggle', "tooltip").attr('title', "Перигейное расстояние равно расстоянию между ближайшей точкой орбиты и Землёй, измеряется в астрономических единицах (ае)").text(columnValue);
        }
        return $('<div></div>').text(columnValue);
    },
	formatCell: function(row, key) {
        if (key == 'first_obs' || key == 'last_obs') {
			return row[key].substring(0, 10);
        }
		if (key == 'pha') {
			if (row[key] == 'N'){return 'Нет'}
			if (row[key] == 'Y'){return 'Да'}
        }
		if (key == 'diameter') {
			if (row[key] == 0){return 'Нет данных'}
        }
        return row[key];
    },
});


var url = new URL(window.location.origin + "/service/query");
url.searchParams.append('object', 'asteroid');
$.get(url, function(data) {
    table.setData(data, columns);
	document.getElementById("spinner").style.display = "none";
	document.getElementById("table-sortable").style.display = "block";
});