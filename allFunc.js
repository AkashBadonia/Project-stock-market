import { listSecEl, stockSummaryURL, stockChartURL, stockListURL } from "./script.js";
// create chart from the data
function createChart(timeArr, valueArr, stockChartRef) {
  const ctx = document.getElementById("stockChart").getContext("2d");
  stockChartRef = new Chart(ctx, {
    type: "line",
    data: {
      labels: [...timeArr],
      datasets: [
        {
          label: "Stock Price",
          data: [...valueArr],
          backgroundColor: "#27005D",
          color: "#27005D",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          ticks: {
            color: "#E4F1FF",
          },
        },
        y: {
          ticks: {
            color: "#E4F1FF",
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "#E4F1FF",
          },
        },
      },
    },
  });
}

// takes data from getAllStockOnlist function and adds all stocks to list in dom
function createStockList(name, bookValue, profit) {
  const stockCont = document.createElement("div");
  const stockName = document.createElement("div");
  const stockBookValue = document.createElement("div");
  const stockProfit = document.createElement("div");

  stockCont.classList.add("stockCont");
  stockName.classList.add("stockName");
  stockName.textContent = name;
  stockBookValue.classList.add("stockBookValue");
  stockBookValue.textContent = `$${bookValue}`;
  stockProfit.classList.add("stockProfit");
  stockProfit.textContent = `${profit}%`;
  stockProfit.textContent.replace("%", "") <= 0
    ? (stockProfit.style.color = "red")
    : (stockProfit.style.color = "rgb(10, 168, 10)");
  stockCont.append(stockName, stockBookValue, stockProfit);
  listSecEl.appendChild(stockCont);
}

// create api request and return promise that resolves to stockListObj containing stock name, book value and profit.
// also generates stocks list using createStockList func.
async function getAllStockOnList() {
  const response = await fetch(stockListURL);
  const responseJson = await response.json();
  const myStockListObj = responseJson.stocksStatsData[0];

  for (let i = 0; i < Object.keys(myStockListObj).length - 1; i++) {
    const stock = Object.keys(myStockListObj)[i];
    createStockList(
      `${stock}`,
      `${myStockListObj[stock].bookValue.toFixed(3)}`,
      `${myStockListObj[stock].profit.toFixed(2)}`
    );
  }

  return myStockListObj;
}

// create api request and returns promise that resolves to allSummaryList object
async function getStockSummaries() {
  const response = await fetch(stockSummaryURL);
  const responseJson = await response.json();
  const stocksSummaryListObj = responseJson.stocksProfileData[0];
  return stocksSummaryListObj;
}

// create api request and returns promise that resolves to object containing array of values and array of timestamps over 1 month, 3 months, 1 year and 5 years.
async function getChartsData() {
  const response = await fetch(stockChartURL);
  const responseJson = await response.json();
  const myStocksChartsListObj = responseJson.stocksData[0];
  console.log(myStocksChartsListObj);
  return myStocksChartsListObj;
}

export { createChart, createStockList, getAllStockOnList, getStockSummaries, getChartsData };
