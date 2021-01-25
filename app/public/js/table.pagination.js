var columns = {
    name: 'Название',
    recclass: 'Класс',
    mass: 'Масса',
	year: 'Год падения',
};

var elemNum = 0;
var table = $('#table-sortable').tableSortable({
    data: [],
	columns : columns,
    rowsPerPage: 20,
    pagination: true,
	formatCell: function(row, key) {
        if (key == 'name') {
			elemNum = elemNum + 1
            return $('<span></span>').attr('id', (elemNum-1)%20).attr('name', 'clickable-cell').text(row[key]);
        }
        return row[key];
    },
});

var map;
var layerGroup;
var meteorIcon;
var meteorArr = [];
map = new L.map('map').setView([55.752577, 37.616684], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var url = new URL(window.location.origin + "/service/query");
url.searchParams.append('object', 'meteorite');
$.get(url, function(data) {
    table.setData(data, columns);
	document.getElementById("spinner").style.display = "none";
	document.getElementById("table-sortable").style.display = "block";
	
	meteorIcon = L.icon({
		iconUrl: './images/meteorite.png',
		iconSize:     [32, 32],
		iconAnchor:   [16, 16],
	});
	layerGroup = L.layerGroup().addTo(map);
	for (let i = 0; i < Math.min(data.length, 3000); i++){
		L.marker([data[i].reclat, data[i].reclong], {icon: meteorIcon}).addTo(layerGroup)
		.bindPopup(data[i].name + '<br />Класс: ' + data[i].recclass + '<br />Год: ' + data[i].year)
	}
	
	// всплывающее окно при отсутствии геоданных
	document.getElementsByName("clickable-cell").forEach(item => {
		item.addEventListener('click', event => {
			if (!data[rowNum].reclat){
				var modal = document.getElementById("myModal");
				var span = document.getElementsByClassName("close")[0];
				modal.style.display = "block";
				span.onclick = function() {
				  modal.style.display = "none";
				}
				window.onclick = function(event) {
				  if (event.target == modal) {
					modal.style.display = "none";
				  }
				}
			}else{
				window.scrollTo(0, 0);
				var rowNum = parseInt(item.getAttribute('id')) + (20 * parseInt(document.getElementsByClassName("btn btn-primary active")[0].getAttribute("data-page")))
				map.setView([data[rowNum].reclat, data[rowNum].reclong], 8);
			}
		})
	})
	

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
	url.searchParams.append('object', 'meteorite');
	$.get(url, function(data) {
		table.setData(data, columns);
		layerGroup.clearLayers();
		for (let i = 0; i < Math.min(data.length, 3000); i++){
			L.marker([data[i].reclat, data[i].reclong], {icon: meteorIcon}).addTo(layerGroup)
			.bindPopup(data[i].name + '<br />Класс: ' + data[i].recclass + '<br />Год: ' + data[i].year)
		}
	});
};	

document.getElementById("filter-button").onclick = tableUpdate;



// всплывающее окно при отсутствии геоданных
const targetNode = document.getElementsByClassName("gs-table-body")[0];
const config = { attributes: true, childList: true, subtree: true };
const callback = function(mutationsList, observer) {
	document.getElementsByName("clickable-cell").forEach(item => {
		item.addEventListener('click', event => {
			var rowNumOnPage = parseInt(item.getAttribute('id'))
			if (!table.getCurrentPageData()[rowNumOnPage].reclat){
				var modal = document.getElementById("myModal");
				var span = document.getElementsByClassName("close")[0];
				modal.style.display = "block";
				span.onclick = function() {
				  modal.style.display = "none";
				}
				window.onclick = function(event) {
				  if (event.target == modal) {
					modal.style.display = "none";
				  }
				}
			}else{
				window.scrollTo(0, 0);
				map.setView([table.getCurrentPageData()[rowNumOnPage].reclat, table.getCurrentPageData()[rowNumOnPage].reclong], 8);
			}
		})
	})
};
const observer = new MutationObserver(callback);
observer.observe(targetNode, config);

