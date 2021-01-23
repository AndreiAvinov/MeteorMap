var columns = {
    name: 'Название',
    recclass: 'Класс',
    "mass (g)": 'Масса',
	year: 'Год падения',
};

var table = $('#table-sortable').tableSortable({
    data: [],
	columns : columns,
    rowsPerPage: 20,
    pagination: true,
});


var url = new URL(window.location.origin + "/service/query");
$.get(url, function(data) {
    table.setData(data, columns);
});

function tableUpdate(){
	var url = new URL(window.location.origin + "/service/query?");
	var recclass = document.getElementById("recclass2").value.toString();
	console.log(recclass);
	url.searchParams.append('recclass', recclass);
	console.log(url.toString());
	$.get(url, function(data) {
		table.setData(data, columns);
	});
};	

document.getElementById("filter-button").onclick = tableUpdate;