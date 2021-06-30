import { Component } from "react";
import { connect } from "react-redux";
import { fetchProductList } from './actions'
import DataTable from './components/DataTable'
import columns from './data/columns'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRows: [],
      lastRowClickedData: null,
      lastRowClickedIndex: null,
    }
    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
  }

  componentDidMount() {
    //On component mount call fetch request to load data
    this.props.fetchProductList();
  }

  onSelectionChange = (selectedRows = []) => {
    console.log("selectedRows", selectedRows)
    this.setState({ selectedRows: selectedRows })
  }

  onRowClick = (rowData = null, rowIndex = null) => {
    console.log("onRowClick", rowData)
    this.setState({ lastRowClickedData: rowData, lastRowClickedIndex: rowIndex })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h4 className="App-logo">ACME <i>Inc.</i></h4>
        </header>
        <div className="alerts">
          {this.state.selectedRows && this.state.selectedRows.length > 0 &&
            <div clasName="alert alert-info">
              <h5 className="alert-title">Selected Rows: <span className="alert-title-data">{JSON.stringify(this.state.selectedRows)}</span></h5>
            </div>}
          {this.state.lastRowClickedData &&
            <div clasName="alert alert-info">
              <h5 className="alert-title">Last clicked Row: <span className="alert-title-data">{this.state.lastRowClickedIndex} </span></h5>
              <p className="alert-note"><i>NOTE: Indexing of rows starts from 0</i></p>
              <pre className="clickedObject">
                <code>
                  {JSON.stringify(this.state.lastRowClickedData, null, 2)}
                </code>
              </pre>
            </div>}
        </div>
        {this.props.isLoadingData ? (
          <div>Loading . . .</div>
        ) : this.props.error ? (
          <div>Failed {this.props.error && this.props.error.message}</div>
        ) : this.props.data && this.props.data.length > 0 ? (
          <DataTable
            columns={columns}
            rows={this.props.data}
            defaultColumnWidth={300}
            onSelectionChange={this.onSelectionChange}
            onRowClick={this.onRowClick} />
        ) : <div />}

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
