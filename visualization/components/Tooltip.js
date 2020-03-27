export class Tooltip {
  constructor(selection) {
    this.div = d3
      .select(selection)
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('padding', '10px')
      .style('border-radius', '5px')
      .style('z-index', '10')
      .style('color', 'white')
      .style('background', 'rgba(0,0,0, 0.8)')
      .style('border', '1px solid black')
      .html('<h3>Tooltip</h3>');
  }

  show() {
    this.div.style('visibility', 'visible');
  }

  hide() {
    this.div.style('visibility', 'hidden');
  }

  move(d, props, template) {
    this.div
      .style('top', `${d3.event.pageY + -25}px`)
      .style('left', `${d3.event.pageX + 25}px`)
      .html(template(d, props));
  }
}

// Usage

// Create a tooltip
// const tooltip = new Tooltip('body');

// Add this to the elements
// .on('mouseover', () => tooltip.show() )
// .on('mousemove', (d, i) => tooltip.move(d, props, tooltipTemplate) )
// .on('mouseout', () => tooltip.hide() );

// Disable pointer events on text, etc...
// .attr('pointer-events', 'none');
