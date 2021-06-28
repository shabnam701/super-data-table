import { Component } from "react";
import { connect } from "react-redux";
import { fetchProductList } from './actions'
import './App.css';

class App extends Component {

  componentDidMount() {
    //On component mount call fetch request to load data
    this.props.fetchProductList();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h4 className="App-logo">ACME <i>Inc.</i></h4>
        </header>
        {this.props.isLoadingData ? (
          <div>Loading . . .</div>
        ) : this.props.error ? (
          <div>Failed {this.props.error && this.props.error.message}</div>
        ) : <div>Success</div>}
      </div>
    );
  }
}

const mapStateToProps = ({ productList: { data = [], isLoadingData = false, error = null } }) => ({
  data,
  isLoadingData,
  error
});

export default connect(
  mapStateToProps,
  {
    fetchProductList
  }
)(App);
