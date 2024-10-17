// URL del Google Apps Script desplegado que devuelve el JSON con los datos
const sheetUrl = 'https://script.google.com/macros/s/YOUR_DEPLOYED_URL/exec';

// Función para formatear el valor de duration (ejemplo: P20D => 20 días)
function formatDuration(duration) {
    return duration.replace('P', '').replace('D', ' días');
}

// Función para crear una tarjeta HTML
function createCard(vehicleType, amount, threshold, duration, endDate) {
    return `
        <div class="section">
            <h2>Si repartís en <span class="highlight">${vehicleType}</span></h2>
            <div class="amount">
                <span class="currency">$</span>
                <span class="value">${amount}</span>
                <span class="extra">Extras</span>
            </div>
            <p>Para recibir el extra tenés que completar al menos <span class="bold">${threshold} pedidos</span> en tus primeros <span class="bold">${formatDuration(duration)}</span>.</p>
            <p class="disclaimer">Este extra es válido hasta ${endDate}</p>
        </div>
    `;
}

// Función para actualizar las tarjetas dinámicamente
function updateCards(data, selectedCity) {
    const container = document.getElementById('flyer-container');
    container.innerHTML = ''; // Limpiamos el contenedor

    // Filtramos por ciudad
    const filteredData = data.filter(item => item.city === selectedCity);

    // Iteramos sobre los registros filtrados y generamos tarjetas dinámicas
    filteredData.forEach(item => {
        const cardHTML = createCard(item.vehicle_types, item.amount, item.threshold, item.duration, item.end_date);
        container.innerHTML += cardHTML; // Añadimos cada tarjeta al contenedor
    });
}

// Función para obtener los datos del Apps Script
async function fetchData(city) {
    try {
        const response = await fetch(sheetUrl);
        const data = await response.json();
        updateCards(data, city); // Actualizamos el HTML con los datos de la ciudad seleccionada
    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }
}

// Llamada inicial con la ciudad "Buenos Aires"
fetchData('Buenos Aires'); // Cambia a la ciudad que necesites
