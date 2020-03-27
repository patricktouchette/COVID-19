export const initVis = (
  selection,
  {
    maxWidth,
    maxHeight,
    margin = { top: 20, right: 20, bottom: 20, left: 20 },
    zoomable = true,
    resetButtonId = 'reset',
  }
) => {
  const width = maxWidth - margin.left - margin.right;
  const height = maxHeight - margin.top - margin.bottom;

  const svg = d3
    .select(selection)
    .append('svg')
    .attr('width', maxWidth)
    .attr('height', maxHeight);

  const topG = svg.append('g').attr('class', 'topG');

  const g = topG
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  if (zoomable) {
    const zoomed = () => topG.attr('transform', d3.event.transform);
    const zoomF = d3.zoom().on('zoom', zoomed);
    svg.call(d3.zoom().on('zoom', zoomed));
    svg.on('dblclick.zoom', null);

    document.getElementById(resetButtonId).addEventListener('click', () => {
      svg
        .transition()
        .duration(400)
        .call(zoomF.transform, d3.zoomIdentity);
    });
  }

  return { g, width, height, margin };
};
