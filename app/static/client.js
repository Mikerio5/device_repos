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
      el("progressbar_1").innerHTML = `${response["results"][0][1]} %`;
      el("progressbar_2").innerHTML = `${response["results"][1][1]} %`;
      el("progressbar_3").innerHTML = `${response["results"][2][1]} %`;
      el("progressbar_4").innerHTML = `${response["results"][3][1]} %`;

      el("label_1").innerHTML = `${response["results"][0][0]}`;
      el("label_2").innerHTML = `${response["results"][1][0]}`;
      el("label_3").innerHTML = `${response["results"][2][0]}`;
      el("label_4").innerHTML = `${response["results"][3][0]}`;

      el("progressbar_1").setAttribute('style', 'width:' + Number(response["results"][0][1]) + '%')
      el("progressbar_1").setAttribute('aria-valuenow', response["results"][0][1]);
      el("progressbar_2").setAttribute('style', 'width:' + Number(response["results"][1][1]) + '%')
      el("progressbar_2").setAttribute('aria-valuenow', response["results"][1][1]);
      el("progressbar_3").setAttribute('style', 'width:' + Number(response["results"][2][1]) + '%')
      el("progressbar_3").setAttribute('aria-valuenow', response["results"][2][1]);
      el("progressbar_4").setAttribute('style', 'width:' + Number(response["results"][3][1]) + '%')
      el("progressbar_4").setAttribute('aria-valuenow', response["results"][3][1]);
    }
    el("analyze-button").innerHTML = "Analyze";

    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
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

  var fileData = new FormData();
  fileData.append("file", uploadFiles[0]);
  xhr.send(fileData);
}