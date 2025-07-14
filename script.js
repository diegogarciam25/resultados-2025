// Función para cargar resultados desde el JSON
function cargarResultados(tipo) {
    fetch('../data/resultados.json')
        .then(response => response.json())
        .then(data => {
            const resultados = data[tipo];
            const escrutinio = data.escrutinio[tipo];
            
            // Llenar tabla
            const tbody = document.querySelector('#result-table tbody');
            tbody.innerHTML = '';
            
            resultados.candidatos.forEach(candidato => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${candidato.nombre}</td>
                    <td>${candidato.partido}</td>
                    <td>${candidato.votos.toLocaleString()}</td>
                    <td>${candidato.porcentaje}%</td>
                `;
                tbody.appendChild(row);
            });
            
            // Actualizar porcentaje de escrutinio
            document.getElementById('porcentaje-escrutinio').textContent = 
                ${escrutinio}% actas escrutadas;
            
            // Crear gráfica
            crearGrafica(resultados);
            
            // Mostrar escaños si existe
            if (resultados.escannos) {
                const escanosInfo = document.createElement('div');
                escanosInfo.className = 'escanos-info';
                escanosInfo.innerHTML = `
                    <p>El partido <strong>${resultados.escannos.partido}</strong> obtuvo 
                    <strong>${resultados.escannos.cantidad}</strong> escaños</p>
                `;
                document.querySelector('.result-container').appendChild(escanosInfo);
            }
        })
        .catch(error => console.error('Error al cargar los datos:', error));
}

function crearGrafica(data) {
    const ctx = document.getElementById('results-chart').getContext('2d');
    
    // Destruir gráfica anterior si existe
    if (window.resultChart) {
        window.resultChart.destroy();
    }
    
    const labels = data.candidatos.map(c => ${c.nombre} (${c.partido}));
    const votos = data.candidatos.map(c => c.votos);
    const colores = ['#003366', '#4CAF50', '#FFC107', '#9C27B0', '#F44336'];
    
    window.resultChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Votos',
                data: votos,
                backgroundColor: colores,
                borderColor: colores.map(c => c.replace('0.6', '1')),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Función para la página de concejo con 3 botones
function crearMenuConcejo() {
    const main = document.querySelector('main');
    main.innerHTML = '';
    
    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.textContent = '← Volver';
    backButton.onclick = () => window.history.back();
    main.appendChild(backButton);
    
    const title = document.createElement('h3');
    title.textContent = 'Concejo Municipal';
    title.style.textAlign = 'center';
    main.appendChild(title);
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'tres-botones';
    
    const button1 = document.createElement('button');
    button1.textContent = 'Voto Lista';
    button1.onclick = () => window.location.href = 'concejo/lista.html';
    
    const button2 = document.createElement('button');
    button2.textContent = 'Voto Nominal Paq. Los Taques';
    button2.onclick = () => window.location.href = 'concejo/nominal-taques.html';
    
    const button3 = document.createElement('button');
    button3.textContent = 'Voto Nominal Paq. Judibana';
    button3.onclick = () => window.location.href = 'concejo/nominal-judibana.html';
    
    buttonContainer.appendChild(button1);
    buttonContainer.appendChild(button2);
    buttonContainer.appendChild(button3);
    main.appendChild(buttonContainer);
}

// Si estamos en la página de concejo principal, crear los 3 botones
if (window.location.pathname.includes('concejo.html')) {
    document.addEventListener('DOMContentLoaded', crearMenuConcejo);
}
