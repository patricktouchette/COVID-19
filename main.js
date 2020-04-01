import { initVis } from './visualization/components/initVis.js';
import { Tooltip } from './visualization/components/Tooltip.js';
import { lineChart } from './visualization/components/lineChart.js';
import CountryList from './visualization/components/countryList.js';

// Init Globals
let index = 0;
const url =
  './csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';

const tooltip = new Tooltip('#vis');

// Initialize the g which will hold the vis
const maxWidth = document.body.offsetWidth - 16 * 4;
const vis = initVis('#vis', {
  maxWidth: maxWidth > 600 ? 600 : maxWidth,
  maxHeight: maxWidth < 400 ? maxWidth : 400,
  zoomable: false,
  margin: { top: 80, right: 50, bottom: 50, left: 50 },
});

// Render the visualization
function render(data, i) {
  const { dataset, name } = data[i % data.length];
  lineChart({
    g: vis.g,
    data: dataset,
    width: vis.width,
    height: vis.height,
    margin: vis.margin,
    titleText: name,
    total: dataset.slice(-1)[0].totalCases.toLocaleString(),
    newCases: dataset.slice(-1)[0].newCases.toLocaleString(),
    xValue: d => d.date,
    yValue: d => d.newCases,
    lineColor: 'lightblue',
    tooltip,
    hidepoints: maxWidth < 600,
  });

  index = i;
}

function parseDataset(data) {
  const parseDate = d3.timeParse('%m/%d/%y');
  let prevKey;

  const dataset = Object.keys(data)
    .slice(4)
    .map(key => {
      const obj = {
        date: parseDate(key),
        totalCases: +data[key],
        newCases: prevKey ? +data[key] - +data[prevKey] : 0,
      };

      prevKey = key;
      return obj;
    });

  return dataset;
}

function processData(loadedData) {
  // Create datastructure for D3 vis
  let data = loadedData.map(countryData => {
    const country = countryData['Country/Region'];
    const province = countryData['Province/State'];

    return {
      country,
      province,
      name: `${country}${province ? ' - ' : ''}${province}`,
      dataset: parseDataset(countryData),
    };
  });

  // Add Total Cases and new cases to datastructure
  data = data.map(d => ({
    ...d,
    totalCases: d.dataset.slice(-1)[0].totalCases,
    newCases: d.dataset.slice(-1)[0].newCases,
  }));

  // Sort By country with the most cases to the least
  data.sort((a, b) => b.totalCases - a.totalCases);
  console.log('data', data);
  return data;
}

// Fetch the data then render the visualization
d3.csv(url).then(loadedData => {
  console.log('loadedData', loadedData);

  const data = processData(loadedData);

  // Update the date
  document.getElementById(
    'lastUpdate'
  ).textContent = `Last Update: ${data[0].dataset
    .slice(-1)[0]
    .date.toLocaleDateString()}`;

  // Render the Line chart
  render(data, index);

  // Create List of countries
  const countryList = document.getElementById('country-list-container');
  countryList.insertAdjacentHTML('beforeend', CountryList({ data, render }));

  // Add event to List of countries
  countryList.addEventListener('click', e => {
    const { tagName } = e.target;

    if (tagName === 'EM' || tagName === 'STRONG') {
      if (e.target.parentElement.tagName === 'LI') {
        render(data, +e.target.parentElement.dataset.index);
      }
    }

    if (tagName === 'LI') {
      render(data, +e.target.dataset.index);
    }

    document.getElementById('dashboard').scrollIntoView();
  });

  // Add Events to next and previous Buttons
  document.getElementById('previousDataset').addEventListener('click', () => {
    index -= 1;
    if (index < 0) index = 0;
    render(data, index);
  });

  document.getElementById('nextDataset').addEventListener('click', () => {
    index += 1;
    render(data, index);
  });
});
