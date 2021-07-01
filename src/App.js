import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchProductList } from './actions';
import DataTable from './components/DataTable';
import Alerts from './components/Alerts';
import AppErrorBoundary from './components/AppErrorBoundary'
import columns from './data/columns';
import './App.css';

function AppContent({ isLoadingData, error, data, onSelectionChange, onRowClick }) {
  if (isLoadingData) {
    return <div>Loading . . .</div>
  } else if (error && error.message) {
    return <div>Failed {error && error.message}</div>
  } else if (data && data.length > 0) {
    return <DataTable
      columns={columns} // column headers for table
      rows={data} // data rows for table
      defaultColumnWidth={300} // set default column width if width not specified
      onSelectionChange={onSelectionChange} // trigger when row selection changed using left chckboxes
      onRowClick={onRowClick} // trigger when a row is clicked, return row data and index
      globalSearch={true} // enable search on the entire data
    />
  } else {
    return <div />
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      lastRowClickedData: null,
      lastRowClickedIndex: null,
    };
    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
  }

  componentDidMount() {
    // On component mount call fetch request to load data
    const { fetchProductList } = this.props;
    fetchProductList();
  }

  onSelectionChange = (selectedRows = []) => {
    console.log('selectedRows', selectedRows);
    this.setState({ selectedRows: selectedRows });
  };

  onRowClick = (rowData = null, rowIndex = null) => {
    console.log('onRowClick', rowData);
    this.setState({ lastRowClickedData: rowData, lastRowClickedIndex: rowIndex });
  };

  render() {
    const { selectedRows, lastRowClickedData, lastRowClickedIndex } = this.state
    const { isLoadingData, error, data } = this.props


    return (
      <div className="App">
        <header className="App-header">
          <h4 className="App-logo">
            ACME <i>Inc.</i>
          </h4>
        </header>
        <AppErrorBoundary>
          <Alerts
            selectedRows={selectedRows}
            lastRowClickedData={lastRowClickedData}
            lastRowClickedIndex={lastRowClickedIndex}
          />
          <AppContent
            isLoadingData={isLoadingData}
            error={error}
            data={data}
            onSelectionChange={this.onSelectionChange}
            onRowClick={this.onRowClick}
          />
        </AppErrorBoundary>
      </div>
    );
  }
}

const mapStateToProps = ({ productList: { data = [], isLoadingData = false, error = null } }) => ({
  data,
  isLoadingData,
  error,
});

export default connect(mapStateToProps, {
  fetchProductList,
})(App);