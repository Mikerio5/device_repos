var el = x => document.getElementById(x);

function showPicker() {
  el("file-input").click();
}

function showPicked(input) {
  el("upload-label").innerHTML = input.files[0].name;
  var reader = new FileReader();
  reader.onload = function (e) {
    el("image-picked").src = e.target.result;
    el("image-picked").className = "";
  };
  reader.readAsDataURL(input.files[0]);
}

function analyze() {
  var uploadFiles = el("file-input").files;
  if (uploadFiles.length !== 1) alert("Wähle ein Bild aus!");
  var xhr = new XMLHttpRequest();
  var loc = window.location;
  xhr.open("POST", `${loc.protocol}//${loc.hostname}:${loc.port}/analyze`,
    true);
  xhr.onerror = function () {
    alert(xhr.responseText);
  };
  xhr.onload = function (e) {
    if (this.readyState === 4) {
      var response = JSON.parse(e.target.responseText);
      el("results").style = "display: visible;";
      if (myChart) {
        myChart.destroy();
      }
      var ctx = document.getElementById('myChartBar');
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: [`${response["results"][0][0]}`, `${response["results"][1][0]}`, `${response["results"][2][0]}`, `${response["results"][3][0]}`],
          datasets: [{
            label: 'Wahrscheinlichkeit für diesen Typ',
            data: [Number(response["results"][0][1]), Number(response["results"][1][1]), Number(response["results"][2][1]), Number(response["results"][3][1])],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });

    };
  }
  var fileData = new FormData();
  fileData.append("file", uploadFiles[0]);
  xhr.send(fileData);
}