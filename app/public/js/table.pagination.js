var columns = {
    name: 'Название',
    recclass: 'Класс',
    mass: 'Масса',
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
	var recclass = document.getElementById("recclass").value.toString();
	url.searchParams.append('recclass', recclass);
	var fromYear = document.getElementById("fromYear").value.toString();
	url.searchParams.append('fromYear', fromYear);
	var toYear = document.getElementById("toYear").value.toString();
	url.searchParams.append('toYear', toYear);
	var fromMass = document.getElementById("fromMass").value.toString();
	url.searchParams.append('fromMass', fromMass);
	var toMass = document.getElementById("toMass").value.toString();
	url.searchParams.append('toMass', toMass);
	$.get(url, function(data) {
		table.setData(data, columns);
	});
};	

document.getElementById("filter-button").onclick = tableUpdate;