import express from "express";
import axios from "axios";
import bodyParser from 'body-parser'

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }))

async function buscarDados(endereco) {
  const apiKey = 'AIzaSyAwhV8rNoZds2zabYJAin4oCSVfRfYo0k4'; //Adicione sua chave
  const URL = (`https://maps.googleapis.com/maps/api/geocode/json?address=${endereco}&key=${apiKey}`
  );

  const requisicao = await axios.get(URL);
  const requisicaoDados = await requisicao.data;
  return requisicaoDados;
}

function retirarLatLng(dados) {
  console.log(dados)
  const nomeend = dados.results[0].formatted_address;
  const lat = dados.results[0].geometry.location.lat;
  const lng = dados.results[0].geometry.location.lng; // buscar de cada endereco
  return { nomeend, lat, lng };
}


app.post("/enviarenderecos", async (req, res) => {
  const enderecos = req.body.enderecos;
  const enderecosDivididos = enderecos.split(";");
  let resultadoBuscas = [];

  for (let i = 0; i < enderecosDivididos.length; i++) {
    const dados = await buscarDados(enderecosDivididos[i]);
    console.log(dados);
    const dadosDetalhados = retirarLatLng(dados);
    res.send(dadosDetalhados);
  }

});

// Calculando a Distancia entre dois pontos Latitude e Longitude
function calcularDistancia(end1, end2) {
  const distancia = Math.sqrt(
    (end1.lng - end1.lat) * (end1.lng - end1.lat) + (end2.lng - end2.lat) * (end2.lng - end2.lat)
  );
  return distancia;
}
app.get("/", (req, res) => {
  res.sendFile("C:/Users/Hugo/Downloads/Desafio Backend/Desafio Backend/src/index.html");
}); // retorno da pg home

app.listen(3000);
