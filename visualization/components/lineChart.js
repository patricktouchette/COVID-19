import { title } from './title.js';
import { subtitle } from './subtitle.js';

export const lineChart = ({
  g,
  data,
  width,
  height,
  margin,
  titleText,
  total,
  xValue,
  yValue,
  lineColor,
  tooltip,
  hidepoints,
}) => {
  // Title
  title({ g, text: titleText, x: width / 2, y: -margin.top / 2 });
  subtitle({ g, text: total, x: width / 2, y: -margin.top / 6 });

  // Transition
  const t = d3.transition().duration(500);
  const tDelay = d3
    .transition()
    .duration(0)
    .delay(500);

  // Scales
  const x = d3
    .scaleTime()
    .domain(d3.extent(data, xValue))
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, yValue)])
    .range([height, 0]);

  // Axes
  const xAxisCall = d3.axisBottom(x).tickSize(-height);
  const xAxis = g.selectAll('.x-axis').data([null]);
  xAxis.exit().remove();
  xAxis
    .enter()
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${height})`)
    .merge(g.selectAll('.x-axis'))
    .transition(t)
    .call(xAxisCall)
    .selectAll('text')
    .attr('y', '10')
    .attr('x', '-5')
    .attr('text-anchor', 'end')
    .attr('transform', 'rotate(-40)');

  const yAxisCall = d3.axisLeft(y).tickSize(-width);
  const yAxis = g.selectAll('.y-axis').data([null]);
  yAxis.exit().remove();

  yAxis
    .enter()
    .append('g')
    .attr('class', 'y-axis')
    .merge(g.selectAll('.y-axis'))
    .transition(t)
    .call(yAxisCall);

  // Line Generator
  const lineGen = d3
    .line()
    .curve(d3.curveMonotoneX)
    .x(d => x(xValue(d)))
    .y(d => y(yValue(d)));

  // Line Path
  const path = g.selectAll('.line').data([data], xValue);
  path.exit().remove();

  path
    .enter()
    .append('path')
    .attr('class', 'line')
    .attr('fill', 'none')
    .attr('stroke-width', 3)
    .merge(g.selectAll('.line'))
    .attr('stroke', 'none')
    .attr('d', d => lineGen(d))
    .transition(tDelay)
    .attr('stroke', lineColor);

  // Data Points
  if (hidepoints) return;
  const points = g.selectAll('.dataPoint').data(data);
  points.exit().remove();

  points
    .enter()
    .append('circle')
    .attr('class', 'dataPoint')
    .attr('fill', 'rgba(0,0,0,0.5)')
    .attr('stroke', 'white')
    .attr('stroke-width', '0.5px')
    .on('mouseenter', () => tooltip.show())
    .on('mousemove', d => {
      tooltip.move(d, { xValue, yValue, x, y }, tooltipTemplate);
    })
    .on('mouseleave', () => tooltip.hide())
    .merge(g.selectAll('.dataPoint'))
    .transition(t)
    .attr('r', 3)
    .attr('cx', d => x(xValue(d)))
    .attr('cy', d => y(yValue(d)));
};

function tooltipTemplate(d, { xValue, yValue }) {
  return `
    <div>
      <p><strong>${yValue(d).toLocaleString()}</strong> New Cases</p>
      <p>on ${xValue(d).toLocaleDateString()}</p>
    </div>
  `;
}
