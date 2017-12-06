import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { connect } from 'react-redux';
import { getList } from './ducks/reducer';

class App extends Component {
  constructor() {
    super()
  }
  componentDidMount() {
    this.props.getList()
  }
  render() {
    console.log(this.props)
    return (
      <div className="App">
        {
          this.props.list.map(item => {
            return (
              <div>{item.section}</div>
            )
          })
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    list: state.list
  }
}

const outActions = {
  getList
}

export default connect(mapStateToProps, outActions)(App);
