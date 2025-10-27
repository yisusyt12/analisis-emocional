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

    // Generar gráfico con Chart.js
    const ctx = document.getElementById('graficoEstados').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Alto', 'Moderado', 'Bajo'],
            datasets: [{
                data: [datos.distribucion.alto, datos.distribucion.moderado, datos.distribucion.bajo],
                backgroundColor: ['#6EE7B7', '#FCD34D', '#FCA5A5']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: false
                }
            }
        }
    });
});
