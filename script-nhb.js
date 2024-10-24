// URL del Google Apps Script desplegado que devuelve el JSON con los datos
const sheetUrl = 'https://script.google.com/macros/s/AKfycbz-V9xb0Umy1HvO9ImYl360le32ACDV_6oxjFg6g_Tun-hEP4-G6G2uLg8Nmj27sN3uxQ/exec';


// Función para formatear el valor de duration (ejemplo: P20D => 20 días)
function formatDuration(duration) {
    return duration.replace('P', '').replace('D', ' días');
}

// Función para formatear la fecha a formato dd/mm/yyyy
function formatDate(isoDate) {
    const date = new Date(isoDate);  // Convertimos la fecha ISO a objeto Date
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}


// Función para crear una tarjeta HTML
function createCard(vehicleFormat, amount, threshold, duration, endDate) {
    return `
        <div class="section">
            <h2>Si repartís en <span class="highlight">${vehicleFormat}</span></h2>
            <div class="amount">
                <span class="currency">$</span>
                <span class="value">${amount}</span>
                <span class="extra">Extras</span>
            </div>
            <p>Para recibir el extra tenés que completar al menos <span class="bold">${threshold} pedidos</span> en tus primeros <span class="bold">${formatDuration(duration)}</span>.</p>
            <p class="disclaimer">Este extra es válido hasta ${formatDate(endDate)}</p>
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
        const cardHTML = createCard(item.vehicle_format, item.amount, item.threshold, item.duration, item.end_date);
        container.innerHTML += cardHTML; // Añadimos cada tarjeta al contenedor
    });
}

// Función para popular la lista de ciudades en el dropdown
function populateCityDropdown(data) {
    const citySelect = document.getElementById('city-select');
    
    // Extraemos las ciudades sin duplicados
    const uniqueCities = [...new Set(data.map(item => item.city))];
    
    // Añadimos cada ciudad como opción en el dropdown
    uniqueCities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
}

// Función para obtener los datos del Apps Script
async function fetchData() {
    try {
        const response = await fetch(sheetUrl);
        const data = await response.json();

        // Populamos el dropdown con las ciudades
        populateCityDropdown(data);

        // Agregamos un event listener al dropdown para que, cuando se seleccione una ciudad, se actualicen las tarjetas
        document.getElementById('city-select').addEventListener('change', function() {
            const selectedCity = this.value;
            if (selectedCity) {
                updateCards(data, selectedCity);
            } else {
                document.getElementById('flyer-container').innerHTML = ''; // Limpiamos si no hay selección
            }
        });
    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }
}

// Llamada inicial para obtener los datos
fetchData();