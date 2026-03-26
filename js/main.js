// =======================
// INICIALIZAÇÃO DO MAPA
// =======================
var map = L.map('map').setView([-22.75, -43.45], 11);

// Basemap clean
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap & Carto'
}).addTo(map);

// =======================
// POPUP COM IMAGEM LOCAL AUTOMÁTICA
// =======================
function popupContent(feature) {
  let props = feature.properties;

  // Gera nome da imagem automaticamente
  let nomeImagem = "";

  if (props.nome) {
    nomeImagem = props.nome
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove acentos
      .replace(/\s+/g, "_"); // espaço → _
  }

  let caminhoImagem = `images/${nomeImagem}.jpg`;

  return `
    <div style="width:220px">
      <h4 style="margin:0">${props.nome || "Ponto"}</h4>

      <img src="${caminhoImagem}" 
           style="width:100%; border-radius:6px; margin:5px 0;"
           onerror="this.style.display='none'">

      <p style="font-size:13px">${props.descricao || ""}</p>
    </div>
  `;
}

// =======================
// CAMADAS
// =======================
var camadas = {};

// -----------------------
// PNMNI (Parque - destaque)
// -----------------------
fetch('data/pnmni_delimitacao.geojson')
.then(res => res.json())
.then(data => {
  camadas["Parque (PNMNI)"] = L.geoJSON(data, {
    style: {
      color: "#2e7d32",
      weight: 2,
      fillColor: "#66bb6a",
      fillOpacity: 0.3
    },
    onEachFeature: (f, l) => l.bindPopup(popupContent(f))
  }).addTo(map);

  map.fitBounds(camadas["Parque (PNMNI)"].getBounds());
});

// -----------------------
// APA (quase invisível)
// -----------------------
fetch('data/apa.geojson')
.then(res => res.json())
.then(data => {
  camadas["APA"] = L.geoJSON(data, {
    style: {
      color: "#fbc02d",
      weight: 1,
      fillOpacity: 0.02
    },
    onEachFeature: (f, l) => l.bindPopup(popupContent(f))
  }).addTo(map);
});

// -----------------------
// Trilha das Águas (roxa)
// -----------------------
fetch('data/aguas.geojson')
.then(res => res.json())
.then(data => {
  camadas["Trilha das Águas"] = L.geoJSON(data, {
    style: {
      color: "#7b1fa2",
      weight: 5,
      dashArray: "10,6",
      opacity: 0.9
    },
    onEachFeature: (f, l) => l.bindPopup(popupContent(f))
  }).addTo(map);
});

// -----------------------
// Trilha Contenda (amarela)
// -----------------------
fetch('data/contenda.geojson')
.then(res => res.json())
.then(data => {
  camadas["Trilha Contenda"] = L.geoJSON(data, {
    style: {
      color: "#fdd835",
      weight: 5,
      dashArray: "10,6",
      opacity: 0.9
    },
    onEachFeature: (f, l) => l.bindPopup(popupContent(f))
  }).addTo(map);
});

// -----------------------
// Pontos de Interesse
// -----------------------
fetch('data/pontos.geojson')
.then(res => res.json())
.then(data => {
  camadas["Pontos de Interesse"] = L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: 7,
        fillColor: "#d32f2f",
        color: "#000",
        weight: 1,
        fillOpacity: 0.9
      });
    },
    onEachFeature: (f, l) => l.bindPopup(popupContent(f))
  }).addTo(map);
});

// =======================
// CONTROLE DE CAMADAS NA SIDEBAR
// =======================
setTimeout(() => {
  var control = L.control.layers(null, camadas, {
    collapsed: false
  }).addTo(map);

  document.getElementById("layerControl")
    .appendChild(control.getContainer());
}, 1000);