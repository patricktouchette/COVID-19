export const subtitle = ({ g, text1, text2, x, y, fontSize = '24px' }) => {
  const group = g.selectAll('.subtitleGroup').data([null]);
  group.exit().remove();

  const groupEnter = group
    .enter()
    .append('g')
    .attr('class', 'subtitleGroup');

  groupEnter
    .merge(g.selectAll('.subtitleGroup'))
    .attr('x', x)
    .attr('y', y);

  group.exit().remove();

  groupEnter
    .append('text')
    .attr('class', 'totalText')
    .merge(group.select('.totalText'))
    .attr('x', x - 10)
    .attr('y', y)
    .attr('text-anchor', 'end')
    .attr('font-size', fontSize)
    .attr('fill', 'black')
    .text(text1);

  groupEnter
    .append('text')
    .attr('class', 'newText')
    .merge(group.select('.newText'))
    .attr('x', x + 10)
    .attr('y', y)
    .attr('text-anchor', 'begin')
    .attr('font-size', 20)
    .attr('fill', 'grey')
    .text(text2);
};
