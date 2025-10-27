document.addEventListener('DOMContentLoaded', () => {
    // --- PROTECCIÓN DE PÁGINA ---
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../login/login.html';
        return;
    }

    // --- USUARIO ---
    let userName = 'Bienvenido';
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            userName = user.nombre || user.name || 'Bienvenido';
        } catch (e) {
            console.error('Error parseando usuario en localStorage', e);
        }
    }
    const userNameDiv = document.getElementById('userName');
    if (userNameDiv) userNameDiv.textContent = `Bienvenido, ${userName}`;

    // --- LISTA DE PSICÓLOGOS ---
    const psicologos = [
        {nombre: "Dra. Yelitza Polo", especialidad: "Psicología clínica", pagina: "https://www.doctoralia.co/yelitza-polo/psicologo/barranquilla"},
        {nombre: "Prof. Luisa Fernanda Torres Villadiego", especialidad: "Terapia familiar y de pareja", pagina: "https://www.doctoralia.co/luisa-fernanda-torres-villadiego/psicologo/barranquilla"},
        {nombre: "Dr. Yorgin Eduardo Campos Pérez", especialidad: "Terapias de tercera generación", pagina: "https://www.doctoralia.co/yorgin-eduardo-campos-perez/psicologo/barranquilla"},
        {nombre: "Psic. José Manuel González Rodríguez", especialidad: "Terapia de pareja y adicciones", pagina: "https://www.topdoctors.com.co/barranquilla-ciudad/psicologia/"},
        {nombre: "Psic. Gustavo Adolfo Camelo Salazar", especialidad: "Psicoterapia individual y adicciones", pagina: "https://www.topdoctors.com.co/barranquilla-ciudad/psicologia/"},
        {nombre: "Psic. E. Eduardo Escorcia Ordóñez", especialidad: "Depresión y terapia de pareja", pagina: "https://www.topdoctors.com.co/barranquilla-ciudad/psicologia/"},
        {nombre: "Psic. María de Jesús Gutiérrez Téllez", especialidad: "Sexología y terapia de pareja", pagina: "https://www.topdoctors.com.co/barranquilla-ciudad/psicologia/"},
        {nombre: "Dra. Paola Andrea Zabala Restrepo", especialidad: "Neuropsicología infantil", pagina: "https://www.doctoralia.co/paola-andrea-zabala-restrepo/psicologo/barranquilla"},
        {nombre: "Dra. Betsy Rocío Campo Ruiz", especialidad: "Psicología clínica", pagina: "https://www.doctoralia.co/betsy-rocio-campo-ruiz/psicologo/barranquilla"},
        {nombre: "Dra. Johanna Moreno Villanueva", especialidad: "Terapia familiar y sexología", pagina: "https://www.doctoralia.co/johanna-moreno-villanueva/psicologo/barranquilla"}
    ];

    // --- CERRAR SESIÓN ---
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '../login/login.html';
        });
    }

    // --- VER ESTADÍSTICAS ---
    const viewStatsBtn = document.getElementById('viewStats');
    if (viewStatsBtn) {
        viewStatsBtn.addEventListener('click', () => {
            window.location.href = '../estadistica/estadistica.html';
        });
    }

    // --- FORMULARIO ---
    const formulario = document.getElementById('checklistForm');
    const resultados = document.getElementById('resultados');

    formulario.addEventListener('submit', function(e) {
        e.preventDefault();

        // Tomar valores de q1…q5
        const valores = [];
        for (let i = 1; i <= 5; i++) {
            valores.push(Number(formulario[`q${i}`].value));
        }

        const suma = valores.reduce((a, b) => a + b, 0);
        const promedio = suma / valores.length;

        const ciudad = document.getElementById('ciudad').value.trim() || "no especificada";

        // Estado
        let estadoFinal = "";
        let clase = "";
        if (promedio >= 4) {
            estadoFinal = "Alto, ¡estás en buen estado! 😊";
            clase = "success";
        } else if (promedio <= 2) {
            estadoFinal = "Bajo, se recomienda buscar ayuda profesional 😟";
            clase = "error";
        } else {
            estadoFinal = "Moderado, cuida tu bienestar ⚠️";
            clase = "warning";
        }

        // Resultado principal
        let html = `<div class="result ${clase}">
                        Hola, tu estado general es: <strong>${estadoFinal}</strong>`;
        if (clase !== "success") {
            html += ` en  <strong>${ciudad}</strong>`;
        }
        html += `.</div>`;

        // Dependiendo del estado, mostrar psicólogos o mensaje motivacional
        if (clase === "error" || clase === "warning") {
            // Mostrar psicólogos
            html += `<div class="psicologos"><h3>Psicólogos recomendados:</h3>`;
            psicologos.forEach(psico => {
                html += `<div class="psicologo">
                            <strong>${psico.nombre}</strong><br>
                            Especialidad: ${psico.especialidad}<br>
                            <a href="${psico.pagina}" target="_blank">Ver página</a>
                         </div>`;
            });
            html += `</div>`;
        } else if (clase === "success") {
            // Mensaje motivacional
            html += `<div class="buenEstado"><p>
- Mantén tus hábitos positivos.<br>
- Realiza actividades que disfrutes.<br>
- Dedica tiempo a planificar tus metas.<br>
- Comparte momentos positivos con otros.<br>
- Practica la gratitud diariamente.<br>
💡 Tip extra: Lleva un pequeño “diario de bienestar” para seguir mejorando.
            </p></div>`;
        }

        resultados.innerHTML = html;
        resultados.scrollIntoView({behavior:"smooth"});

        // Guardar en localStorage
        const submission = {
            timestamp: new Date().toISOString(),
            promedio,
            estado: clase,
            ciudad
        };

        const stored = JSON.parse(localStorage.getItem('submissions') || '[]');
        stored.push(submission);
        localStorage.setItem('submissions', JSON.stringify(stored));
    });
});
