import { createChart, getAllStockOnList, getStockSummaries, getChartsData } from "./allFunc.js";
export { listSecEl, stockProfitSum, stockSummaryEl, stockSummaryURL, stockChartURL, stockListURL };
let activeStock;
let stockChart;

const stockOnChart = document.getElementById("stockOnChart");
const listSecEl = document.getElementById("listSec");
const stockNameSum = document.getElementById("stock_name");
const stockBookValueSum = document.getElementById("stock_bookValue");
const stockProfitSum = document.getElementById("stock_profit");
const stockSummaryEl = document.getElementById("stockSummary");
const stockSummaryURL = "https://stocks3.onrender.com/api/stocks/getstocksprofiledata";
const stockChartURL = "https://stocks3.onrender.com/api/stocks/getstocksdata";
const stockListURL = "https://stocks3.onrender.com/api/stocks/getstockstatsdata";
const minValOfStock = document.getElementById("minVal");
const maxValOfStock = document.getElementById("maxVal");

async function getStockAnalysis() {
  const myStocksListObj = await getAllStockOnList();
  const myStocksSummariesObj = await getStockSummaries();
  const myStocksChartsObj = await getChartsData();
  const stockListBtnEl = document.querySelectorAll(".stockName");
  const firstStock = Object.keys(myStocksListObj)[0];

  (() => {
    // displaying my first stock on summary section onload.
    stockNameSum.textContent = firstStock;
    activeStock = firstStock;
    stockBookValueSum.textContent = `$${myStocksListObj[firstStock].bookValue.toFixed(3)}`;
    stockProfitSum.textContent = `${myStocksListObj[firstStock].profit.toFixed(2)}%`;
    stockProfitSum.textContent.replace("%", "") <= 0
      ? (stockProfitSum.style.color = "red")
      : (stockProfitSum.style.color = "rgb(10, 168, 10)");
    stockSummaryEl.textContent = myStocksSummariesObj[firstStock].summary;
  })();

  (() => {
    const firstStock = Object.keys(myStocksChartsObj)[1];
    const firstStock1monTimeStamp = myStocksChartsObj[firstStock]["1mo"].timeStamp.map((curr) =>
      new Date(curr * 1000).toLocaleString().slice(0, 10)
    );
    const firstStock1monValue = myStocksChartsObj[firstStock]["1mo"].value.map((curr) => curr.toFixed(2));
    stockOnChart.textContent = activeStock;
    createChart(firstStock1monTimeStamp, firstStock1monValue, stockChart);
    minValOfStock.textContent = `Minimum: ${Math.min(...firstStock1monValue.map((curr) => Number(curr)))}`;
    maxValOfStock.textContent = `Maximum: ${Math.max(...firstStock1monValue.map((curr) => Number(curr)))}`;
  })();

  // adding click event to stock button
  stockListBtnEl.forEach((btn) => {
    btn.addEventListener("click", () => {
      const btnTxtContent = btn.textContent;

      // updating summary
      activeStock = btnTxtContent;
      stockNameSum.textContent = btnTxtContent;
      stockBookValueSum.textContent = `$${myStocksListObj[btnTxtContent].bookValue.toFixed(3)}`;
      stockProfitSum.textContent = `${myStocksListObj[btnTxtContent].profit.toFixed(2)}%`;
      stockProfitSum.textContent.replace("%", "") <= 0
        ? (stockProfitSum.style.color = "red")
        : (stockProfitSum.style.color = "rgb(10, 168, 10)");
      stockSummaryEl.textContent = myStocksSummariesObj[btnTxtContent].summary;

      // updating one month chart to be shown by default on stock button click
      stockOnChart.textContent = activeStock;
      const stock1monTimeStamp = myStocksChartsObj[btnTxtContent]["1mo"].timeStamp.map((curr) =>
        new Date(curr * 1000).toLocaleString().slice(0, 10)
      );
      const stock1monValue = myStocksChartsObj[btnTxtContent]["1mo"].value.map((curr) => curr.toFixed(2));
      stockChart.destroy();
      createChart(stock1monTimeStamp, stock1monValue, stockChart);
      minValOfStock.textContent = `Minimum: ${Math.min(...stock1monValue.map((curr) => Number(curr)))}`;
      maxValOfStock.textContent = `Maximum: ${Math.max(...stock1monValue.map((curr) => Number(curr)))}`;
    });
  });
  const timeBtnEl = document.querySelectorAll(".timeBtn");
  timeBtnEl.forEach((btn) => {
    btn.addEventListener("click", () => {
      const btnTxtContent = btn.textContent
        .replace(" Years", "y")
        .replace(" Year", "y")
        .replace(" Months", "mo")
        .replace(" Month", "mo")
        .toLowerCase()
        .trim();
      const stockTimeArr = myStocksChartsObj[`${activeStock}`][btnTxtContent].timeStamp.map((curr) =>
        new Date(curr * 1000).toLocaleString().slice(0, 10)
      );
      const stockValueArr = myStocksChartsObj[`${activeStock}`][btnTxtContent].value.map((curr) => curr.toFixed(2));
      minValOfStock.textContent = `Minimum: ${Math.min(...stockValueArr.map((curr) => Number(curr)))}`;
      maxValOfStock.textContent = `Maximum: ${Math.max(...stockValueArr.map((curr) => Number(curr)))}`;
      stockChart.destroy();
      createChart(stockTimeArr, stockValueArr, stockChart);
    });
  });
}
getStockAnalysis();
