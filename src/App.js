import { Component } from "react";
import { connect } from "react-redux";
import { fetchProductList } from './actions';
import DataTable from './components/DataTable';
import columns from './data/columns';
import Alerts from './components/Alerts'
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
        <Alerts
          selectedRows={this.state.selectedRows}
          lastRowClickedData={this.state.lastRowClickedData}
          lastRowClickedIndex={this.state.lastRowClickedIndex}
        />
        {this.props.isLoadingData ? (
          <div>Loading . . .</div>
        ) : this.props.error ? (
          <div>Failed {this.props.error && this.props.error.message}</div>
        ) : this.props.data && this.props.data.length > 0 ? (
          <DataTable
            columns={columns} // column headers for table
            rows={this.props.data} // data rows for table
            defaultColumnWidth={300} //set default column width if width not specified
            onSelectionChange={this.onSelectionChange} // trigger when row selection changed using left chckboxes
            onRowClick={this.onRowClick} //trigger when a row is clicked, return row data and index
            globalSearch={true} //enable search on the entire data
          />
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
