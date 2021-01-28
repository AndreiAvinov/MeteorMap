var ACTIVEWINDOW = document.getElementById("map");

var chartIsLoaded = false;


var columns = {
    name: 'Название',
    recclass: 'Класс',
    mass: 'Масса (г)',
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

var chart = JSC.Chart('meteo-chart1', {
	type: 'line',
	xAxis: {
		scale: {range: { min: 800}}
	},
	series: [
		{}
	]
});
	
	

var map;
var layerGroup;
var meteorIcon;
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
	document.getElementsByName("clickable-cell").forEach(item => {
		item.addEventListener('click', event => {
			if (!data[rowNum].reclat){
				// всплывающее окно при отсутствии геоданных
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


$.get(window.location.origin + "/service/chart", function(chartData) {
	chart.series(0).options({ points: chartData.points});
	chart.axes("x").options({ scale: {range: { min: chartData.minX}}});
	chartIsLoaded = true;
	if ($(ACTIVEWINDOW).attr("id") == "meteo-chart1"){
		document.getElementById("chart-spinner").style.display = "none";
		document.getElementById("meteo-chart1").classList.remove('custom-hidden');
	}
});



function tableUpdate(){
	elemNum = 0;
	document.getElementById("spinner").style.display = "block";
	document.getElementById("table-sortable").style.display = "none";
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
	//наносим маркеры на карту
	$.get(url, function(data) {
		table.setData(data, columns);
		document.getElementById("spinner").style.display = "none";
		document.getElementById("table-sortable").style.display = "block";
		layerGroup.clearLayers();
		for (let i = 0; i < Math.min(data.length, 3000); i++){
			L.marker([data[i].reclat, data[i].reclong], {icon: meteorIcon}).addTo(layerGroup)
			.bindPopup(data[i].name + '<br />Класс: ' + data[i].recclass + '<br />Год: ' + data[i].year + '<br />Масса: ' + data[i].mass)
		}
	});
	var url = new URL(window.location.origin + "/service/chart?");
	url.searchParams.append('recclass', recclass);
	url.searchParams.append('fromYear', fromYear);
	url.searchParams.append('toYear', toYear);
	url.searchParams.append('fromMass', fromMass);
	url.searchParams.append('toMass', toMass); 
	$.get(url, function(chartData) {
		chart.series(0).options({ points: chartData.points});
		chart.axes("x").options({ scale: {range: { min: chartData.minX}}});
	});
};	
document.getElementById("filter-button").onclick = tableUpdate;



$('.btn-secondary').on('click', function(){
	if ($(this).find('input').attr('id') == 'select-map'){setActiveWindow(document.getElementById("map"))}
	if ($(this).find('input').attr('id') == 'select-chart'){setActiveWindow(document.getElementById("meteo-chart1"))}
}); 

function setActiveWindow(TBelement){
	prevACTIVEWINDOW = ACTIVEWINDOW;
	ACTIVEWINDOW = TBelement;
	if ($(prevACTIVEWINDOW).attr("id") == "meteo-chart1" && chartIsLoaded){
		document.getElementById("meteo-chart1").classList.add('custom-hidden');
	}else{
	prevACTIVEWINDOW.style.display = "none";
	}
	
	if ($(TBelement).attr("id") == "meteo-chart1" && chartIsLoaded){
		document.getElementById("meteo-chart1").classList.remove('custom-hidden');
	}else if ($(TBelement).attr("id") == "meteo-chart1" && !chartIsLoaded){
		document.getElementById("chart-spinner").style.display = "block";
	}else {
		TBelement.style.display = "block";
	}
}






const targetNode = document.getElementsByClassName("gs-table-body")[0];
const config = { attributes: true, childList: true, subtree: true };
const callback = function(mutationsList, observer) {
	document.getElementsByName("clickable-cell").forEach(item => {
		item.addEventListener('click', event => {
			var rowNumOnPage = parseInt(item.getAttribute('id'))
			// всплывающее окно при отсутствии геоданных
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