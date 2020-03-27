import { initVis } from '../components/initVis.js';
import { Tooltip } from '../components/Tooltip.js';
import { lineChart } from './lineChart.js';
import CountryList from '../components/countryList.js';

const tooltip = new Tooltip('body');

// Initialize the g which will hold the vis
const vis = initVis('body', {
  maxWidth: 600,
  maxHeight: 400,
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
    xValue: d => d.date,
    yValue: d => d.newCases,
    lineColor: 'lightblue',
    tooltip,
  });

  index = i;
}

let index = 0;
d3.csv(
  '../../csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'
).then(loadedData => {
  console.log('loadedData', loadedData);

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
  data = data.map(d => ({
    ...d,
    totalCases: d.dataset.slice(-1)[0].totalCases,
    newCases: d.dataset.slice(-1)[0].newCases,
  }));

  data.sort((a, b) => b.totalCases - a.totalCases);
  console.log('data', data);

  render(data, index);

  // Create List
  document.body.insertAdjacentHTML('beforeend', CountryList({ data, render }));
  const countryList = document.getElementById('countryList');
  countryList.addEventListener('click', () => {
    console.log('click');
    render(data, 33);
  });

  // Add Events to Buttons
  document.getElementById('previousDataset').addEventListener('click', () => {
    index -= 1;
    render(data, index);
  });

  document.getElementById('nextDataset').addEventListener('click', () => {
    index += 1;
    render(data, index);
  });
});

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
