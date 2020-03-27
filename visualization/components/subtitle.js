export const subtitle = ({ g, text, x, y, fontSize = '24px' }) => {
  const subtitleText = g.selectAll('.subtitleText').data([null]);
  subtitleText.exit().remove();
  subtitleText
    .enter()
    .append('text')
    .attr('class', 'subtitleText')
    .merge(g.selectAll('.subtitleText'))
    .attr('x', x)
    .attr('y', y)
    .attr('text-anchor', 'middle')
    .attr('font-size', fontSize)
    .attr('fill', 'black')
    .text(text);
};
