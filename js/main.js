var map = L.map('map').setView([-22.75, -43.45], 11);

// Base map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// Função para popup genérico
function popupContent(feature) {
  let content = "<b>Informações:</b><br>";
  for (let prop in feature.properties) {
    content += "<b>" + prop + ":</b> " + feature.properties[prop] + "<br>";
  }
  return content;
}

// Cores por camada
function styleLayer(color) {
  return {
    color: color,
    weight: 2,
    fillOpacity: 0.3
  };
}

// Camadas
var camadas = {};

// PNMNI (limite)
fetch('data/pnmni_delimitacao.geojson')
.then(res => res.json())
.then(data => {
  camadas["PNMNI"] = L.geoJSON(data, {
    style: styleLayer("green"),
    onEachFeature: (f, l) => l.bindPopup(popupContent(f))
  }).addTo(map);
});

// Hidrografia
fetch('data/aguas.geojson')
.then(res => res.json())
.then(data => {
  camadas["Hidrografia"] = L.geoJSON(data, {
    style: styleLayer("blue"),
    onEachFeature: (f, l) => l.bindPopup(popupContent(f))
  }).addTo(map);
});

// APA
fetch('data/apa.geojson')
.then(res => res.json())
.then(data => {
  camadas["APA"] = L.geoJSON(data, {
    style: styleLayer("orange"),
    onEachFeature: (f, l) => l.bindPopup(popupContent(f))
  }).addTo(map);
});

// Contenda
fetch('data/contenda.geojson')
.then(res => res.json())
.then(data => {
  camadas["Contenda"] = L.geoJSON(data, {
    style: styleLayer("purple"),
    onEachFeature: (f, l) => l.bindPopup(popupContent(f))
  }).addTo(map);
});

// Pontos (geossítios, interesse, etc.)
fetch('data/pontos.geojson')
.then(res => res.json())
.then(data => {
  camadas["Pontos"] = L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: 6,
        fillColor: "red",
        color: "#000",
        weight: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: (f, l) => l.bindPopup(popupContent(f))
  }).addTo(map);
});

// Controle de camadas
setTimeout(() => {
  L.control.layers(null, camadas).addTo(map);
}, 1000);