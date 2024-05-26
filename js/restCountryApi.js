document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://restcountries.com/v3.1/all';
    const countriesTableBody = document.querySelector('#countriesTable tbody');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const pageNumberSpan = document.getElementById('pageNumber');
    const modal = document.getElementById('myModal');
    const modalCountryName = document.getElementById('modalCountryName');
    const modalCountryDetails = document.getElementById('modalCountryDetails');
    const closeModal = document.getElementsByClassName('close')[0];
    const clearButton = document.getElementById('clearSearch');

    let countries = [];
    let currentPage = 1;
    const rowsPerPage = 25;

    // Fetch data from API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            countries = data;
            renderTable();
        })
        .catch(error => console.error('Error fetching data:', error));
    
    // Render table
    function renderTable() {
        countriesTableBody.innerHTML = '';
        const sortedCountries = getSortedCountries();            
        const filteredCountries = getFilteredCountries(sortedCountries);        
        const paginatedCountries = getPaginatedCountries(filteredCountries);

        paginatedCountries.forEach(country => {
            const row = document.createElement('tr');
            const flagCell = document.createElement('td');
            const nameCell = document.createElement('td');
            const nativeNameCell = document.createElement('td');            
            const flagImg = document.createElement('img');
            const cca2Cell = document.createElement('td'); 
            const cca3Cell = document.createElement('td'); 
            const iddCell = document.createElement('td'); 

            for(key in country.altSpellings) {         
                altCountryName = country.altSpellings[key];                               
            }

            for(key in country.name.nativeName) {                   
                nativeName = country.name.nativeName[key].common;
                break;                        
            }

            nameCell.textContent = country.name.official;
            nameCell.classList.add('country-name');
            nameCell.dataset.country = country.name.official;
            cca2Cell.textContent = country.cca2;
            cca3Cell.textContent = country.cca3;            
            iddCell.textContent = country.idd.root;            
            nativeNameCell.textContent = nativeName;
            flagImg.alt = `Flag of ${altCountryName}`;
            flagCell.appendChild(flagImg);
            flagImg.src = country.flags.png;

            row.appendChild(flagCell);  
            row.appendChild(nameCell);      
            row.appendChild(cca2Cell);      
            row.appendChild(cca3Cell);                      
            row.appendChild(nativeNameCell);
            row.appendChild(iddCell);
            countriesTableBody.appendChild(row);
        });

        updatePageNumber(filteredCountries.length);
    }

    // Get sorted countries
    function getSortedCountries() {
        const sortOrder = sortSelect.value;
        return [...countries].sort((a, b) => {           
            if (sortOrder === 'asc') {                
                return a.name.official.localeCompare(b.name.official)
            } else {              
                ;                      
                return b.name.official.localeCompare(a.name.official);
            }               
        });        
    }

    // Get filtered countries
    function getFilteredCountries(sortedCountries) {
        const searchQuery = searchInput.value.toLowerCase();
        return sortedCountries.filter(country => country.name.official.toLowerCase().includes(searchQuery));
    }

    // Get paginated countries
    function getPaginatedCountries(filteredCountries) {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return filteredCountries.slice(startIndex, startIndex + rowsPerPage);
    }

    // Update page number display
    function updatePageNumber(totalRows) {
        const totalPages = Math.ceil(totalRows / rowsPerPage);
        pageNumberSpan.textContent = `Page ${currentPage} of ${totalPages}`;
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === totalPages;
    }
    clearButton.addEventListener('click', () => {        
        searchInput.value = '';
        currentPage = 1;        
        renderTable();
    });
    
    // Event listeners
    searchInput.addEventListener('input', () => {
        currentPage = 1;        
        renderTable();
    });

    sortSelect.addEventListener('change', () => {        
        renderTable();
    });

    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    nextPageButton.addEventListener('click', () => {        
        const totalRows = getFilteredCountries(getSortedCountries()).length;                
        if (currentPage < Math.ceil(totalRows / rowsPerPage)) {
            currentPage++;
            renderTable();
        }
    });

    countriesTableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('country-name')) {
            const countryName = event.target.dataset.country;
            const country = countries.find(c => c.name.official === countryName);
            showCountryDetails(country);
        }
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Show country details in modal
    function showCountryDetails(country) {    
        modalCountryName.textContent = country.name.official.toLocaleString();
        modalCountryDetails.innerHTML = `
            
                    <div class="desc_popup"> 
                        <img src="${country.flags.svg}" alt="${country.name.official}">
                    </div>
                    <div class="desc_popup">
                        <p><label>Common Name: </label>${country.name.common}</p>
                        <p><label>Population: </label>${country.population.toLocaleString()}</p>
                        <p><label>Region: </label>${country.region}</p>
                        <p><label>Subregion: </label>${country.subregion}</p>
                        <p><label>Capital:</label> ${country.capital ? country.capital.join(', ') : 'N/A'}</p>
                        <p><label>Languages:</label> ${country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</p>
                    </div>
                
            
        `;
        modal.style.display = 'block';
    }
});

