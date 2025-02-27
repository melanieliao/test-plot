// Load data from stock_data.js (already available as `stockData` and `stockList`)

// Populate Dropdowns
let stockSelect = document.getElementById("stockSelect");
let yearSelect = document.getElementById("yearSelect");
let chartSelect = document.getElementById("chartSelect");

stockList.stocks.forEach(stock => {
    let option = document.createElement("option");
    option.value = stock;
    option.text = stock;
    stockSelect.appendChild(option);
});

stockList.years.forEach(year => {
    let option = document.createElement("option");
    option.value = year;
    option.text = year;
    yearSelect.appendChild(option);
});

// Event Listener for "Show Graph" Button
document.getElementById("showGraphButton").addEventListener("click", updateGraph);

function updateGraph() {
    let stock = stockSelect.value;
    let year = parseInt(yearSelect.value, 10);
    let chartType = chartSelect.value;

    if (!stock || !year) {
        alert("Please select a stock and year!");
        return;
    }

    let dataPoints = stockData[stock]?.[year];
    if (!dataPoints || dataPoints.length === 0) {
        alert(`No data available for ${stock} in ${year}`);
        return;
    }

    switch (chartType) {
        case "regression":
            plotRegressionChart(dataPoints);
            break;
        case "candlestick":
            plotCandlestickChart(dataPoints);
            break;
        case "pie":
            plotPieChart();
            break;
        case "heatmap":
            plotHeatmapChart(dataPoints);
            break;
        default:
            alert("Invalid chart type selected.");
    }
}

function plotRegressionChart(data) {
    let dates = data.map(d => new Date(d.Date));
    let prices = data.map(d => d.Close);
    let xValues = Array.from({length: prices.length}, (_, i) => i);

    let trace = {
        x: dates,
        y: prices,
        mode: 'lines+markers',
        name: 'Regression Trend'
    };
    
    Plotly.newPlot("plot", [trace], { title: "Regression Chart" });
}

function plotCandlestickChart(data) {
    let trace = {
        x: data.map(d => d.Date),
        open: data.map(d => d.Open),
        high: data.map(d => d.High),
        low: data.map(d => d.Low),
        close: data.map(d => d.Close),
        type: 'candlestick'
    };
    Plotly.newPlot("plot", [trace], { title: "Candlestick Chart" });
}

function plotPieChart() {
    const script = document.createElement('script');
    script.src = 'plot_piechart.js';
    document.body.appendChild(script);
}

function plotHeatmapChart(data) {
    let trace = {
        z: data.map(d => d.Close),
        x: data.map(d => d.Date),
        y: data.map(d => d.Volume),
        type: 'heatmap'
    };
    Plotly.newPlot("plot", [trace], { title: "Stock Price Heat Map" });
}
