let data;
if (localStorage.getItem("items")) {
  data = JSON.parse(localStorage.getItem("items"));
} else {
  localStorage.setItem("items", JSON.stringify(items));
  data = JSON.parse(localStorage.getItem("items"));
}

function initArtistsPage() {
  let isAnyAuction = data.filter((item) => item.isAuctioning === true);
  const liveAuctionig = document.querySelector(".live-auctioning-wrapper");
  liveAuctionig.style.display = isAnyAuction.length >= 1 ? "flex" : "none";

  updateHeader();
}

function displayIncomes(selectedArtist) {
  const artistItemsArray = data.filter(
    (item) => item.artist === selectedArtist
  );

  const totalIncome = artistItemsArray.reduce(
    (total, item) => total + (item.priceSold || 0),
    0
  );
  const soldItems = artistItemsArray.filter(
    (item) => item.dateSold !== undefined
  );

  const currentBidElement = document.querySelector(
    ".live-auctioning .auction-amount"
  );
  const itemsOnAuction = artistItemsArray.filter((item) => item.isAuctioning);

  const allBiddings = JSON.parse(localStorage.getItem("allBiddings")) || [];
  const latestBid = allBiddings[allBiddings.length - 1] || 0;

  document.querySelector(".income-amount").innerText = `$${totalIncome}`;
  document.querySelector(
    ".total-sold"
  ).innerText = `${soldItems.length}/${artistItemsArray.length}`;
  currentBidElement.innerText =
    itemsOnAuction.length >= 1 ? `${latestBid}$` : "0$";
}
function currentArtistItems(selectedArtist) {
  return data.filter((item) => item.artist === selectedArtist);
}
// ..........................chart...................
let myChart;
function createChart() {
  var chartEl = document.getElementById("myChart");
  chartEl.height = 285;
  const labels = [];
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Amount",
        backgroundColor: "#a26a5e",
        hoverBackgroundColor: "#d44c2e",
        borderColor: "transparent",
        borderWidth: 0,
        data: [],
      },
    ],
  };

  const config = {
    type: "bar",
    data,
    options: {
      indexAxis: "y",
      barPercentage: 0.4,
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          grid: {
            display: false,
          },
        },
      },
    },
  };
  if (myChart) {
    myChart.destroy();
  }
  myChart = new Chart(document.getElementById("myChart"), config);

  function updateChartAndSetActive(period, days) {
    myChart.clear();
    myChart.data.labels = showLastDays(days).dateLabel;
    myChart.data.datasets[0].data = showLastDays(days).salesData;
    myChart.update();
    removeAllActiveClasses();
    document.querySelector(period).classList.add("active");
  }

  document.querySelector("#last-7-days").addEventListener("click", () => {
    updateChartAndSetActive("#last-7-days", 7);
  });

  document.querySelector("#last-14-days").addEventListener("click", () => {
    updateChartAndSetActive("#last-14-days", 14);
  });

  document.querySelector("#last-month").addEventListener("click", () => {
    updateChartAndSetActive("#last-month", 30);
  });

  document.querySelector("#last-year").addEventListener("click", () => {
    myChart.clear();
    myChart.data.labels = getDataForLastOneYear().dateLabel;
    myChart.data.datasets[0].data = getDataForLastOneYear().salesData;
    myChart.update();
    removeAllActiveClasses();
    document.querySelector("#last-year").classList.add("active");
  });

  function removeAllActiveClasses() {
    document.querySelector("#last-7-days").classList.remove("active");
    document.querySelector("#last-14-days").classList.remove("active");
    document.querySelector("#last-month").classList.remove("active");
    document.querySelector("#last-year").classList.remove("active");
  }

  getDataForLastOneYear;
}

function getDataForLastOneYear() {
  let monthName = new Array(
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  );
  const monthsLabel = [];
  const salesDataforEachDay = [];
  const currentDate = new Date();

  for (let i = 0; i < 12; i++) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const monthLabel = `${monthName[month]} ${year}`;

    const soldData = currentArtistItems(artistName).filter((item) =>
      checkMonths(item.dateSold, firstDayOfMonth)
    );
    const totalSales = soldData.reduce(
      (total, item) => total + item.priceSold,
      0
    );
    monthsLabel.push(monthLabel);
    salesDataforEachDay.push(totalSales);

    currentDate.setMonth(currentDate.getMonth() - 1);
  }

  const chartData = {
    dateLabel: monthsLabel,
    salesData: salesDataforEachDay,
  };

  return chartData;
}

function showLastDays(days) {
  const oneDay = 86400000;
  const today = new Date();
  const previousDays = [];
  const lastDays = [];
  const salesDataforEachDay = [];

  for (let i = 0; i < days; i++) {
    const previousDay = new Date(today - oneDay * i);
    previousDays.push(previousDay);
    lastDays.push(previousDay.toLocaleDateString("en-GB", { day: "numeric" }));
  }

  for (let i = 0; i < days; i++) {
    const day = previousDays[i];
    const soldData = currentArtistItems(artistName).filter((item) =>
      checkDays(item.dateSold, day)
    );

    let sales = 0;
    soldData.forEach((item) => {
      sales += item.priceSold;
    });

    salesDataforEachDay.push(sales);
  }

  const chartData = {
    dateLabel: lastDays,
    salesData: salesDataforEachDay,
  };

  return chartData;
}

function checkMonths(date1, date2) {
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);

  return (
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getFullYear() === secondDate.getFullYear()
  );
}

function checkDays(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
}
