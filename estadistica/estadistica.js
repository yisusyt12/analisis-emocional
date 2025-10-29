document.addEventListener('DOMContentLoaded', () => {
  // --- PROTECCIÓN DE PÁGINA ---
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '../login/login.html';
    return;
  }

  // --- DATOS SIMULADOS ---
  const datos = {
    usuarios: 30,
    evaluaciones: 20,
    promedio: 3.0,
    distribucion: {
      alto: 10,
      moderado: 5,
      bajo: 15
    }
  };

  // Mostrar datos numéricos
  document.getElementById('usuarios').textContent = datos.usuarios;
  document.getElementById('evaluaciones').textContent = datos.evaluaciones;
  document.getElementById('promedio').textContent = datos.promedio.toFixed(1);

  // --- GRÁFICO DE BARRAS ---
  const ctx = document.getElementById('graficoEstados').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Alto', 'Moderado', 'Bajo'],
      datasets: [{
        label: 'Cantidad de personas',
        data: [
          datos.distribucion.alto,
          datos.distribucion.moderado,
          datos.distribucion.bajo
        ],
        backgroundColor: ['#34D399', '#FCD34D', '#F87171'],
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Distribución del bienestar emocional',
          font: {
            size: 18
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Número de personas'
          },
          ticks: {
            stepSize: 5
          }
        },
        x: {
          title: {
            display: true,
            text: 'Estado emocional'
          }
        }
      }
    }
  });
});
