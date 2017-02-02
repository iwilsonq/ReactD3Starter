import React, { Component } from 'react';
import * as d3 from 'd3';

class Histogram extends Component {
  constructor() {
    super();

    this.state = {
      data: d3.range(1000).map(d3.randomBates(10))
    };
  }

  componentDidMount() {
    this.margin = { top: 10, right: 30, bottom: 30, left: 30 },
    this.width = 960 - this.margin.left - this.margin.right,
    this.height = 500 - this.margin.top - this.margin.bottom;

    this.xScale = d3.scaleLinear()
      .rangeRound([0, this.width]);

    this.bins = d3.histogram()
      .domain(this.xScale.domain())
      .thresholds(this.xScale.ticks(20))
      (this.state.data);

    this.yScale = d3.scaleLinear()
      .domain([0, d3.max(this.bins, function(d) { return d.length })])
      .range([this.height, 0]);

    this.formatCount = d3.format(",.0f");

    this.updateD3();
  }

  componentWillReceiveProps(nextProps) {
    this.updateD3();
  }

  updateD3() {
    const svg = d3.select('svg');
    const g = svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    const bar = g.selectAll('.bar')
      .data(this.bins)
      .enter().append('g')
        .attr('class', 'bar')
        .attr('transform', function(d) { return 'translate(' + this.xScale(d.x0) + ',' + this.yScale(d.length) + ')'; }.bind(this));

    bar.append('rect')
      .attr('x', 1)
      .attr('width', this.xScale(this.bins[0].x1) - this.xScale(this.bins[0].x0) - 1)
      .attr('height', function(d) { return this.height - this.yScale(d.length); }.bind(this))
      .style('fill', 'steelblue');

    bar.append('text')
      .attr('dy', '.75em')
      .attr('y', 6)
      .attr('x', (this.xScale(this.bins[0].x1) - this.xScale(this.bins[0].x0)) / 2)
      .attr('text-anchor', 'middle')
      .text(function(d) { return this.formatCount(d.length); }.bind(this))
      .style('fill', '#fff')
      .style('font', '10px sans-serif');

    g.append('g')
      .attr('class', 'axis--x axis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(this.xScale));

  }

  render() {
    return <svg width='960' height='500'></svg>
  }
}

export default Histogram;
