import React, { Component } from 'react';
import { NICE, SUPER_NICE } from './colors';

const Counter = React.createClass({
  componentWillMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  },
  getInitialState() {
    return { counter: 0 };
  },
  tick() {
    this.setState({
      counter: this.state.counter + this.props.increment
    });
  },

  componentWillUnmount() {
    clearInterval(this.interval);
  },

  render() {
    return (
      <h1 style={{ color: this.props.color }}>
        Counter ({this.props.increment}): {this.state.counter}
      </h1>
    );
  }
});

export const App = React.createClass({
  render() {
    return (
      <div>
        <Counter increment={1} color={NICE} />
        <Counter increment={5} color={SUPER_NICE} />
      </div>
    );
  }
});

