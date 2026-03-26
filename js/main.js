// =======================
// MAPA
// =======================
var map = L.map('map').setView([-22.75, -43.45], 11);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap & Carto'
}).addTo(map);

// =======================
// PAINEL LATERAL
// =======================
function abrirPainel(feature, latlng) {
  let props = feature.properties;

  let nomeImagem = props.nome
    ? props.nome.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "_")
    : "";

  let caminhoImagem = `images/${nomeImagem}.jpg`;

  let coords = props.coordenadas
    ? props.coordenadas
    : `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;

  document.getElementById("panelContent").innerHTML = `
    <h2>${props.nome || "Ponto"}</h2>

    <img src="${caminhoImagem}" 
         onerror="this.style.display='none'">

    <p>${props.descricao || ""}</p>

    <hr>

    <p><b>📍 Coordenadas:</b><br>${coords}</p>
    <p><b>🪨 Geossítio:</b> ${props.geossit || "N/A"}</p>
    <p><b>📊 Valores:</b> ${props.valores || "N/A"}</p>
  `;

  document.getElementById("infoPanel").classList.remove("hidden");
}

// Fechar painel
document.getElementById("closePanel").onclick = function () {
  document.getElementById("infoPanel").classList.add("hidden");
};

// =======================
// CAMADAS
// =======================
var camadas = {};

// PNMNI
fetch('data/pnmni_delimitacao.geojson')
.then(r => r.json())
.then(data => {
  camadas["Parque"] = L.geoJSON(data, {
    style: {
      color: "#2e7d32",
      weight: 2,
      fillColor: "#66bb6a",
      fillOpacity: 0.3
    },
    interactive: false
  }).addTo(map);

  camadas["Parque"].bringToBack();
  map.fitBounds(camadas["Parque"].getBounds());
});

// APA
fetch('data/apa.geojson')
.then(r => r.json())
.then(data => {
  camadas["APA"] = L.geoJSON(data, {
    style: {
      color: "#fbc02d",
      weight: 1,
      fillOpacity: 0.02
    },
    interactive: false
  }).addTo(map);

  camadas["APA"].bringToBack();
});

// Trilhas
fetch('data/trilhas.geojson')
.then(r => r.json())
.then(data => {
  camadas["Caminho das Águas"] = L.geoJSON(data, {
    style: {
      color: "#7b1fa2",
      weight: 5,
      dashArray: "10,6"
    },
    onEachFeature: (f, l) => {
      l.bindPopup("<b>Trilha (Caminho das Águas)</b>");
    }
  }).addTo(map);
});

// Contenda
fetch('data/contenda.geojson')
.then(r => r.json())
.then(data => {
  camadas["Face Norte - Contenda"] = L.geoJSON(data, {
    style: {
      color: "#fdd835",
      weight: 5,
      dashArray: "10,6"
    },
    onEachFeature: (f, l) => {
      l.bindPopup("<b>Trilha (Face Norte - Contenda)</b>");
    }
  }).addTo(map);
});

// Pontos
fetch('data/pontos.geojson')
.then(r => r.json())
.then(data => {
  camadas["Pontos"] = L.geoJSON(data, {
    pointToLayer: (f, latlng) => L.circleMarker(latlng, {
      radius: 7,
      fillColor: "#d32f2f",
      color: "#000",
      weight: 1,
      fillOpacity: 0.9
    }),
    onEachFeature: (f, l) => {
      l.on('click', (e) => abrirPainel(f, e.latlng));
    }
  }).addTo(map);

  camadas["Pontos"].bringToFront();
});

// Controle
setTimeout(() => {
  let control = L.control.layers(null, camadas).addTo(map);
  document.getElementById("layerControl").appendChild(control.getContainer());
}, 1000);
