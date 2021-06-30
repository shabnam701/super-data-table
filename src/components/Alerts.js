import React from 'react';

// Display alert box when action is triggered from table
export default function Alerts({ selectedRows, lastRowClickedData, lastRowClickedIndex }) {
  return (
    <div className="alerts">
      {selectedRows && selectedRows.length > 0 && (
        <div clasName="alert alert-info">
          <h5 className="alert-title">
            Selected Rows: <span className="alert-title-data">{JSON.stringify(selectedRows)}</span>
          </h5>
        </div>
      )}
      {lastRowClickedData && (
        <div clasName="alert alert-info">
          <h5 className="alert-title">
            Last clicked Row: <span className="alert-title-data">{lastRowClickedIndex} </span>
          </h5>
          <p className="alert-note">
            <i>NOTE: Indexing of rows starts from 0</i>
          </p>
          <pre className="clickedObject">
            <code>{JSON.stringify(lastRowClickedData, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
