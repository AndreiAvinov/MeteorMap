let url = 'http://api.open-notify.org/iss-now.json';

var facts = Array(
	'Международная космическая станция — самый дорогой объект, когда-либо построенный человечеством.',
	'На борту МКС есть тренажёры, чтобы космонавты могли поддерживать свою мускулатуру в тонусе.',
	'МКС состоит из четырнадцати состыкованных друг с другом модулей.',
	'Всю необходимую для работы энергию МКС получает от Солнца, собирая её с помощью солнечных панелей.',
	'Пять модулей МКС построено Россией, семь — США. По одному модулю построили Япония и Евросоюз.',
	'Вес Международной космической станции — более 417 тонн.',
	'Внутренний объём МКС — около тысячи кубических метров пространства.',
	'МКС — третий по яркости объект на ночном небе после Луны и Венеры.'
);


fetch(url)
.then(res => res.json())
.then((out) => {
	var ISSIcon = L.icon({
		iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/International_Space_Station.svg/320px-International_Space_Station.svg.png',
		iconSize:     [64, 64], // size of the icon
		iconAnchor:   [32, 32], // point of the icon which will correspond to marker's location
		popupAnchor:  [0, -32] // point from which the popup should open relative to the iconAnchor
	});
	var map = L.map('map').setView([out.iss_position.latitude, out.iss_position.longitude], 3);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	L.marker([out.iss_position.latitude, out.iss_position.longitude], {icon: ISSIcon}).addTo(map)
		.bindPopup(facts[Math.floor(Math.random() * facts.length)])
		.openPopup();
})
.catch(err => { throw err });
