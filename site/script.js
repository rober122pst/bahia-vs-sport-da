document.addEventListener('DOMContentLoaded', () => {
    // Team colors for the chart
    const SPORT_COLOR = 'rgba(216, 33, 40, 0.8)';
    const SPORT_BORDER_COLOR = 'rgba(216, 33, 40, 1)';
    const BAHIA_COLOR = 'rgba(0, 116, 217, 0.8)';
    const BAHIA_BORDER_COLOR = 'rgba(0, 116, 217, 1)';
    
    let chart;
    let rawData = {};
    // List of all possible competitions found in the data
    const allCompetitions = new Set();
    let allFiltersSelected = true;

    // DOM element references
    const filtersContainer = document.getElementById('competition-filters');
    const chartCanvas = document.getElementById('performance-chart').getContext('2d');
    const yearlyTableBody = document.querySelector('#yearly-performance-table tbody');
    const decadeTableBody = document.querySelector('#decade-performance-table tbody');
    const summaryContainer = document.getElementById('summary');
    const toggleButton = document.getElementById('toggle-all');

    // --- Initialization ---
    async function init() {
        try {
            // How to import and parse the YAML file
            const response = await fetch('../utils/sportVSbahia.yaml');
            if (!response.ok) throw new Error('Network response was not ok');
            const yamlText = await response.text();
            rawData = jsyaml.load(yamlText);

            // Dynamically discover all competitions from the data
            Object.values(rawData).forEach(yearData => {
                Object.values(yearData).forEach(teamData => {
                    if (teamData) {
                        Object.keys(teamData).forEach(comp => allCompetitions.add(comp));
                    }
                });
            });
            
            setupFilters();
            updateDashboard();

        } catch (e) {
            console.error('Error loading or parsing YAML file:', e);
            document.body.innerHTML = '<h1>Erro ao carregar dados. Verifique o console.</h1>';
        }
    }

    // --- UI Setup ---
    function setupFilters() {
        // Create checkboxes for each discovered competition
        // [...allCompetitions].sort().forEach(comp => {
        //     const item = document.createElement('div');
        //     item.className = 'filter-item';
            
        //     const checkbox = document.createElement('input');
        //     checkbox.type = 'checkbox';
        //     checkbox.id = comp;
        //     checkbox.value = comp;
        //     checkbox.checked = true;
        //     checkbox.addEventListener('change', updateDashboard);
            
        //     const label = document.createElement('label');
        //     label.htmlFor = comp;
        //     label.textContent = comp.replace(/_/g, ' ');
            
        //     item.appendChild(checkbox);
        //     item.appendChild(label);
        //     filtersContainer.appendChild(item);
        // });

        document.querySelectorAll('#competition-filters input[type="checkbox"]').forEach(cb => {
            cb.checked = true;
            cb.addEventListener('change', updateDashboard)
        });
        // Adiciona evento no botão
        toggleButton.addEventListener('click', () => {
            allFiltersSelected = !allFiltersSelected;
            document.querySelectorAll('#competition-filters input[type="checkbox"]').forEach(cb => {
                cb.checked = allFiltersSelected;
            });
            updateDashboard();
        });
    }
    
    // --- Data Processing ---
    function getFilteredData() {
        const selectedCompetitions = Array.from(document.querySelectorAll('#competition-filters input:checked')).map(cb => cb.value);
        const yearlyScores = {};
        
        for (const year in rawData) {
            yearlyScores[year] = { Sport: 0, Bahia: 0 };
            for (const comp of selectedCompetitions) {
                if (rawData[year].Sport && typeof rawData[year].Sport[comp] === 'number') {
                    yearlyScores[year].Sport += rawData[year].Sport[comp];
                }
                if (rawData[year].Bahia && typeof rawData[year].Bahia[comp] === 'number') {
                    yearlyScores[year].Bahia += rawData[year].Bahia[comp];
                }
            }
        }
        return yearlyScores;
    }

    // --- Dashboard Update ---
    function updateDashboard() {
        const yearlyData = getFilteredData();
        updateChart(yearlyData);
        updateTablesAndSummary(yearlyData);
    }
    
    function updateChart(data) {
        const labels = Object.keys(data).sort();
        const sportScores = labels.map(year => data[year].Sport);
        const bahiaScores = labels.map(year => data[year].Bahia);

        if (chart) {
            chart.data.labels = labels;
            chart.data.datasets[0].data = sportScores;
            chart.data.datasets[1].data = bahiaScores;
            chart.update();
        } else {
            chart = new Chart(chartCanvas, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Sport',
                        data: sportScores,
                        borderColor: SPORT_BORDER_COLOR,
                        backgroundColor: SPORT_COLOR,
                        fill: false,
                        tension: 0.2,
                        pointBackgroundColor: SPORT_BORDER_COLOR,
                        pointRadius: 4,
                    }, {
                        label: 'Bahia',
                        data: bahiaScores,
                        borderColor: BAHIA_BORDER_COLOR,
                        backgroundColor: BAHIA_COLOR,
                        fill: false,
                        tension: 0.2,
                        pointBackgroundColor: BAHIA_BORDER_COLOR,
                        pointRadius: 4,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(107, 114, 128, 0.2)' } },
                        y: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(107, 114, 128, 0.2)' } }
                    },
                    plugins: {
                        legend: { labels: { color: 'var(--text-primary)', font: { size: 14 } } },
                        tooltip: {
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            titleFont: { size: 14 },
                            bodyFont: { size: 12 },
                        }
                    }
                }
            });
        }
    }

    function updateTablesAndSummary(yearlyData) {
        let sportWins = 0, bahiaWins = 0;
        let sportTotalPoints = 0, bahiaTotalPoints = 0;
        yearlyTableBody.innerHTML = '';

        Object.keys(yearlyData).sort().forEach(year => {
            const scores = yearlyData[year];
            sportTotalPoints += scores.Sport;
            bahiaTotalPoints += scores.Bahia;

            let winner = 'Empate';
            let winnerClass = 'winner-draw';
            if (scores.Sport > scores.Bahia) {
                sportWins++;
                winner = '🦁 Sport';
                winnerClass = 'winner-sport';
            } else if (scores.Bahia > scores.Sport) {
                bahiaWins++;
                winner = '🦸‍♂️ Bahia';
                winnerClass = 'winner-bahia';
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${year}</td>
                <td class="${scores.Sport > scores.Bahia ? 'winner-sport' : ''}">${scores.Sport}</td>
                <td class="${scores.Bahia > scores.Sport ? 'winner-bahia' : ''}">${scores.Bahia}</td>
                <td class="${winnerClass}">${winner}</td>
            `;
            yearlyTableBody.appendChild(row);
        });

        summaryContainer.innerHTML = `
            <div id="sport-summary">
                <h3>Vitórias Anuais (Sport)</h3>
                <p class="score">${sportWins}</p>
                <h3>Total de Pontos</h3>
                <p class="score">${sportTotalPoints}</p>
            </div>
            <div id="bahia-summary">
                <h3>Vitórias Anuais (Bahia)</h3>
                <p class="score">${bahiaWins}</p>
                <h3>Total de Pontos</h3>
                <p class="score">${bahiaTotalPoints}</p>
            </div>`;
        
        const decadeData = {};
        Object.entries(yearlyData).forEach(([year, scores]) => {
            const decade = `${Math.floor(parseInt(year) / 10)}0s`;
            if (!decadeData[decade]) {
                decadeData[decade] = { Sport: 0, Bahia: 0 };
            }
            decadeData[decade].Sport += scores.Sport;
            decadeData[decade].Bahia += scores.Bahia;
        });

        decadeTableBody.innerHTML = '';
        Object.keys(decadeData).sort().forEach(decade => {
            const scores = decadeData[decade];
            let winner = 'Empate';
            let winnerClass = 'winner-draw';
            if (scores.Sport > scores.Bahia) {
                winner = '🦁 Sport';
                winnerClass = 'winner-sport';
            } else if (scores.Bahia > scores.Sport) {
                winner = '🦸‍♂️ Bahia';
                winnerClass = 'winner-bahia';
            }
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${decade}</td>
                <td class="${scores.Sport > scores.Bahia ? 'winner-sport' : ''}">${scores.Sport}</td>
                <td class="${scores.Bahia > scores.Sport ? 'winner-bahia' : ''}">${scores.Bahia}</td>
                <td class="${winnerClass}">${winner}</td>
            `;
            decadeTableBody.appendChild(row);
        });
    }

    init();
});