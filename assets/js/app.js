// considerar captura data y envio formulario
const heroForm = $('#heroform');
// console.log(heroForm.val);
const heroSelected = $('#idheroselected');
// console.log(heroSelected)
const heroDetailSection = $('#hero-detail');

heroForm.submit(function (event) {
  event.preventDefault();
  // console.log(heroSelected.val());
  const urlApi = `https://www.superheroapi.com/api.php/109116261447218/${heroSelected.val()}`
  // console.log(urlApi);
  $.ajax({
    type: "GET",
    dataType: "json",
    url: urlApi
  }).done(function (data) {
    // console.log('data', data);
    console.log('respuesta Ok');

    // data.response == "success" ? $('#msg-finded').text('SuperHero encontrado:') : $('#msg-finded').text('SuperHero no encontrado.');
    // data.response == "success" ? window.onload = drawGraphHero(data) : $('#chartContainer').text("Oops!, no data available... can't draw graph.");

    if(data.response == "success"){
      $('#msg-finded').text('SuperHero encontrado:')
      $('#showcard').addClass('card');
      $('hr').removeClass('d-none');
      $('hr').addClass('display');
      drawDataHero(data);
      window.onload = drawGraphHero(data);
    } else {
      $('#msg-finded').text('SuperHero no encontrado.')
      $('#chartContainer').text("Oops!, no data available... can't draw graph.")
    }
  }).fail(function (jqXHR, textStatus, errorThrown) {
    if (jqXHR.status === 0) {
      alert('Not connect: Verify Network.');
    } else if (jqXHR.status == 404) {
      alert('Requested page not found [404]');
    } else if (jqXHR.status == 500) {
      alert('Internal Server Error [500].');
    } else if (textStatus === 'parsererror') {
      alert('Requested JSON parse failed.');
    } else if (textStatus === 'timeout') {
      alert('Time out error.');
    } else if (textStatus === 'abort') {
      alert('Ajax request aborted.');
    } else {
      alert('Uncaught Error: ' + jqXHR.responseText);
    }
  });
});

const drawDataHero = (heroData) => {
  if (heroData.response == 'success') {
    const heroImage = heroData.image['url'];
    $('#hero-image').attr('src', heroImage);
    $('#hero-name').text(`Nombre: ${heroData.name}`);
    $('#hero-connections').text(`Conexiones: ${heroData.connections['group-affiliation']}`);
    $('#hero-publishedby').text(`Publicado por: ${heroData.biography['publisher']}`);
    $('#hero-ocupation').text(`Ocupacion: ${heroData.work['occupation']}`);
    $('#hero-firstappearance').text(`Primera aparición: ${heroData.biography['first-appearance']}`);
    $('#hero-height').text(`Altura: ${heroData.appearance['height'][0]} - ${heroData.appearance['height'][1]}`);
    $('#hero-weight').text(`Peso: ${heroData.appearance['weight'][0]} - ${heroData.appearance['weight'][1]}`);

    const aliases = heroData.biography['aliases'];
    let aliasesstring = "";
    $.each(aliases, function (index, value) {
      aliasesstring += ` ${value}`;
      $('#hero-aliases').text(`Alias: ${aliasesstring}`);
    });
  } else {
    console.log('error: ', heroData.error)
  }
}

const drawGraphHero = (heroData) => {
  $('#chartContainer').css({ "height": "400px", "width": "100%" });
  console.log('grafico Ok');
  console.log(heroData);
  const options = {
    title: {
      text: `Estadisticas de poder de "${heroData.name}"`
    },
    data: [{
      type: "pie",
      startAngle: 45,
      showInLegend: "true",
      legendText: "{label}",
      indexLabel: "{label} ({y})",
      yValueFormatString: "#,##0.#" % "",
      dataPoints: [
        { label: "Combate", y: Number.parseInt(heroData.powerstats.combat) },
        { label: "Durabilidad", y: Number.parseInt(heroData.powerstats.durability) },
        { label: "Inteligencia", y: Number.parseInt(heroData.powerstats.intelligence) },
        { label: "Poder", y: Number.parseInt(heroData.powerstats.power) },
        { label: "Velocidad", y: Number.parseInt(heroData.powerstats.speed) },
        { label: "Fuerza", y: Number.parseInt(heroData.powerstats.strength) }
      ]
    }]
  };
  $("#chartContainer").CanvasJSChart(options);
}

