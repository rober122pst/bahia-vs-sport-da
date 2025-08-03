document.addEventListener('DOMContentLoaded', () => {
    // Team colors for the chart
    const SPORT_COLOR = 'rgba(216, 33, 40, 0.5)';
    const SPORT_BORDER_COLOR = 'rgba(216, 33, 40, 1)';
    const SPORT_LOGO = 'https://upload.wikimedia.org/wikipedia/pt/1/17/Sport_Club_do_Recife.png'
    const BAHIA_COLOR = 'rgba(0, 116, 217, 0.5)';
    const BAHIA_BORDER_COLOR = 'rgba(0, 116, 217, 1)';
    const BAHIA_LOGO = 'https://upload.wikimedia.org/wikipedia/pt/9/90/ECBahia.png';
    
    let chart;
    let chartProgression;
    let rawData = {};
    // List of all possible competitions found in the data
    const allCompetitions = new Set();
    let allFiltersSelected = true;

    const weights = {
            Estadual: 1,
            Regional: 2,
            Copa_Campeões: 3,
            Brasileirão_C: 1,
            Brasileirão_B: 2,
            Brasileirão: 5,
            Copa_Brasil: 4,
            Sul_Americana: 4,
            Libertadores: 7
        }

    // DOM element references
    const filtersContainer = document.getElementById('competition-filters');
    const chartCanvas = document.getElementById('performance-chart').getContext('2d');
    const chartProgressionCanvas = document.getElementById('progression-chart').getContext('2d');
    const yearlyTableBody = document.querySelector('#yearly-performance-table tbody');
    const decadeTableBody = document.querySelector('#decade-performance-table tbody');
    const summaryContainer = document.getElementById('summary');
    const logoWinnerElement = document.getElementById('winner-image');
    const nameWinnerText = document.getElementById('winner-name');
    const summaryWinnerContainer = document.getElementById('summary-winner');
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
    function weightedData() {
        const weightedData = {};
        for (const year in rawData) {
            weightedData[year] = {};
            for (const team in rawData[year]) {
                weightedData[year][team] = {};
                for (const comp in rawData[year][team]) {
                    const value = rawData[year][team][comp];
                    const weight = weights[comp] || 1;

                    if (value === null) {
                        weightedData[year][team][comp] = null;
                    }else if (value < 0) {
                        weightedData[year][team][comp] = Math.round(value / weight);
                    }else {
                        weightedData[year][team][comp] = value * weight;
                    }
                }
            }
        }
        return weightedData
    }

    function getFilteredData() {
        const selectedCompetitions = Array.from(document.querySelectorAll('#competition-filters input:checked')).map(cb => cb.value);
        const averageSelected = document.getElementById('average-filter').checked;
        document.getElementById('average-filter').addEventListener('change', updateDashboard);

        const data = weightedData();

        const yearlyScores = {};
        // const averageScores = {};
        
        for (const year in data) {
            yearlyScores[year] = { Sport: 0, Bahia: 0 };
            let sportWeightSum = 0; let bahiaWeightSum = 0;
            for (const comp of selectedCompetitions) {
                if (data[year].Sport && typeof data[year].Sport[comp] === 'number') {
                    sportWeightSum += weights[comp];
                    yearlyScores[year].Sport += data[year].Sport[comp];
                }
                if (data[year].Bahia && typeof data[year].Bahia[comp] === 'number') {
                    bahiaWeightSum += weights[comp];
                    yearlyScores[year].Bahia += data[year].Bahia[comp];
                }
            }
            if (averageSelected) {
                yearlyScores[year].Sport = sportWeightSum ? Math.round(yearlyScores[year].Sport / sportWeightSum) : 0;
                yearlyScores[year].Bahia = bahiaWeightSum ? Math.round(yearlyScores[year].Bahia / bahiaWeightSum) : 0;
            }
        }
        console.log('Filtered Data:', yearlyScores);
        return yearlyScores;
    }

    // --- Dashboard Update ---
    function updateDashboard() {
        const yearlyData = getFilteredData();
        updateChart(yearlyData);
        updateProgessionChart(yearlyData);
        updateTablesAndSummary(yearlyData);
        updateWinnerChard(yearlyData);
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
                    }, 
                    {
                        label: 'Bahia',
                        data: bahiaScores,
                        borderColor: BAHIA_BORDER_COLOR,
                        backgroundColor: BAHIA_COLOR,
                        fill: false,
                        tension: 0.2,
                        pointBackgroundColor: BAHIA_BORDER_COLOR,
                        pointRadius: 4,
                    }
                ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(107, 114, 128, 0.2)' } },
                        y: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(107, 114, 128, 0.2)' } },
                    },
                    plugins: {
                        legend: { labels: { color: '#9CA3AF', font: { size: 14 } } },
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

    function updateProgessionChart(data) {
        const labels = Object.keys(data).sort();
        const sportScores = labels.map(year => data[year].Sport/10);
        const bahiaScores = labels.map(year => data[year].Bahia/10);
        let sportTotal = 0, bahiaTotal = 0;
        const sportTotalScores = sportScores.map(score => sportTotal += score);
        const bahiaTotalScores = bahiaScores.map(score => bahiaTotal += score);
        let sportLeaders = 0, bahiaLeaders = 0;
        sportTotalScores.forEach((score, index) => {
            if (score > bahiaTotalScores[index]) {
                sportLeaders++;
            }
        })
        bahiaTotalScores.forEach((score, index) => {
            if (score > sportTotalScores[index]) {
                bahiaLeaders++;
            }
        })
        document.getElementById('sport-progression').querySelector('p').textContent = `${sportLeaders} ano(s) na liderança`;
        document.getElementById('bahia-progression').querySelector('p').textContent = `${bahiaLeaders} ano(s) na liderança`;
        
        if (chartProgression) {
            chartProgression.data.labels = labels;
            chartProgression.data.datasets[0].data = sportTotalScores;
            chartProgression.data.datasets[1].data = bahiaTotalScores;
            chartProgression.update();
        } else {
            chartProgression = new Chart(chartProgressionCanvas, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Sport',
                        data: sportTotalScores,
                        borderColor: SPORT_BORDER_COLOR,
                        backgroundColor: SPORT_COLOR,
                        fill: true,
                        tension: 0,
                        pointBackgroundColor: SPORT_BORDER_COLOR,
                        pointRadius: 4,
                    }, 
                    {
                        label: 'Bahia',
                        data: bahiaTotalScores,
                        borderColor: BAHIA_BORDER_COLOR,
                        backgroundColor: BAHIA_COLOR,
                        fill: true,
                        tension: 0,
                        pointBackgroundColor: BAHIA_BORDER_COLOR,
                        pointRadius: 4,
                    },
                ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(107, 114, 128, 0.2)' } },
                        y: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(107, 114, 128, 0.2)' } },
                    },
                    plugins: {
                        legend: { labels: { color: '#9CA3AF', font: { size: 14 } } },
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

    function updateWinnerChard(yearlyData) {
        let sportWins = 0, bahiaWins = 0;
        let sportTotalPoints = 0, bahiaTotalPoints = 0;
        let yearsTotal = 0;
        let sportBestYearPoints = 0, bahiaBestYearPoints = 0;
        let sportBestYear = '', bahiaBestYear = '';

        let winner = 'empate';

        Object.keys(yearlyData).sort().forEach(year => {
            const scores = yearlyData[year];
            yearsTotal++;
            sportTotalPoints += scores.Sport;
            bahiaTotalPoints += scores.Bahia;
            
            if (scores.Sport > scores.Bahia) {
                sportWins++;
            }else if (scores.Bahia > scores.Sport) {
                bahiaWins++;
            }
            
            if (sportBestYearPoints <= scores.Sport) {
                sportBestYear = year;
                sportBestYearPoints = scores.Sport;
            }
            if (bahiaBestYearPoints <= scores.Bahia) {
                bahiaBestYear = year;
                bahiaBestYearPoints = scores.Bahia;
            }

        });

        if (sportTotalPoints > bahiaTotalPoints) {
            winner = 'sport';
        }else if (bahiaTotalPoints > sportTotalPoints) {
            winner = 'bahia';
        } else {
            if (sportWins > bahiaWins) {
                winner = 'sport';
            }else if (bahiaWins > sportWins) {
                winner = 'bahia';
            }
        }

        if (winner === 'sport') {
            logoWinnerElement.src = SPORT_LOGO;
            nameWinnerText.textContent = 'Sport Recife';
            nameWinnerText.className = 'tracking-widest text-2xl text-red-700'
            summaryWinnerContainer.innerHTML = `
                <div>
                    <h3>Vitórias Anuais</h3>
                    <p class="score">${sportWins}</p>
                    <h3>Total de Pontos</h3>
                    <p class="score">${sportTotalPoints}</p>
                </div>
                <div>
                    <h3>Média de pontos/ano</h3>
                    <p class="score">${Math.round(sportTotalPoints/yearsTotal)}</p>
                    <h3>Melhor ano</h3>
                    <p class="score">${sportBestYear} (${sportBestYearPoints})</p>
                </div>`;
        }else if (winner === 'bahia') {
            logoWinnerElement.src = BAHIA_LOGO;
            nameWinnerText.textContent = 'EC Bahia';
            nameWinnerText.className = 'tracking-widest text-2xl text-sky-700';
            summaryWinnerContainer.innerHTML = `
                <div>
                    <h3>Vitórias Anuais</h3>
                    <p class="score">${bahiaWins}</p>
                    <h3>Total de Pontos</h3>
                    <p class="score">${bahiaTotalPoints}</p>
                </div>
                <div>
                    <h3>Média de pontos/ano</h3>
                    <p class="score">${Math.round(bahiaTotalPoints/yearsTotal)}</p>
                    <h3>Melhor ano</h3>
                    <p class="score">${bahiaBestYear} (${bahiaBestYearPoints})</p>
                </div>`;
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
            const row = document.createElement('tr');
            row.className = 'h-10 text-center';

            let winner = 'Empate';
            let winnerImage = 'https://upload.wikimedia.org/wikipedia/commons/2/24/Transparent_Square_Tiles_Texture.png';
            if (scores.Sport > scores.Bahia) {
                sportWins++;
                winner = 'Sport';
                winnerImage = SPORT_LOGO;
                row.className = 'winner-sport h-10 text-center';
            } else if (scores.Bahia > scores.Sport) {
                bahiaWins++;
                winner = 'Bahia';
                winnerImage = BAHIA_LOGO;
                row.className = 'winner-bahia h-10 text-center';
            }

            row.innerHTML = `
                <td class="font-bold relative overflow-hidden tracking-widest"><img src="${winnerImage}" alt="${winner}-logo">${winner}</td>
                 <td class="${scores.Sport > scores.Bahia ? 'font-bold text-red-600' : ''}">${scores.Sport}</td>
                <td class="${scores.Bahia > scores.Sport ? 'font-bold text-sky-600' : ''}">${scores.Bahia}</td>
                <td class="font-bold">${year}</td>
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
            let winnerImage = 'https://upload.wikimedia.org/wikipedia/commons/2/24/Transparent_Square_Tiles_Texture.png';
            const row = document.createElement('tr');
            row.className = 'h-10 text-center';

            if (scores.Sport > scores.Bahia) {
                winner = 'Sport';
                winnerImage = SPORT_LOGO;
                row.className = 'winner-sport h-10 text-center';
            } else if (scores.Bahia > scores.Sport) {
                winner = 'Bahia';
                winnerImage = BAHIA_LOGO;
                row.className = 'winner-bahia h-10 text-center';
            }

            row.innerHTML = `
                <td class="font-bold relative overflow-hidden tracking-widest"><img class="absolute top-[-30px] left-[-35px] w-20" src="${winnerImage}" alt="${winner}-logo"></td>
                <td class="${scores.Sport > scores.Bahia ? 'font-bold text-red-600' : ''}">${scores.Sport}</td>
                <td class="${scores.Bahia > scores.Sport ? 'font-bold text-sky-600' : ''}">${scores.Bahia}</td>
                <td class="font-bold">${decade}</td>
            `;
            decadeTableBody.appendChild(row);
        });
    }

    init();
});