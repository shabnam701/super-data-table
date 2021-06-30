# Super Data Table

A Data table component to handle large json data(>50k) converted to Table with infinite scroll

Check [Demo Here](https://shabnam701.github.io/super-data-table/)


DataTable component API
```
<DataTable
  columns={[{ // column headers for table
   'id': 'id', // Uniq ID to identify column
   'label': 'ID',
   'numeric':  true, // Right Align
   'sortable': true, // sort action on column
   'width': ('10px' | '10%' | '' | undefined),// Column width
  }, {
    'id': 'thumbnailUrl',
    'label': 'Thumbnail',
    'isImage': true, // Indicates if a column is of type image
  }, {
   'id': 'title',
   'label': 'Title',
   'width': '500px',
   'numeric': false
  },{
    'id': 'albumId', //Unique Id
    'label': 'Album ID', //Use in Header
    'numeric': true,
    'width': '100px',
    'isHidden': true, // Column visibility
  },
  {
    'id': 'url',
    'label': 'URL',
    'numeric': false,
    'width': '25%',
    'isLink': true, // Indicates if a column is of type link
  },]}
  rows={[{ // data rows for table
   'id': some_id1,
   'title': (React.ReactNode | string | number), // Key is column id and value is
   'url': "https://xomwimage.com",
   'albumId': 2,
   'thumbnailUrl': "https://xomwimage.com"
  }]}
  defaultColumnWidth={300} // set default column width if width not specified
  onRowClick={(rowData: Object, rowIndex: number) => void} // trigger when row selection changed using left chckboxes
  onSelectionChange={(string[] | 'All') => void} /> // trigger when a row is clicked, return row data and index
  globalSearch={true} // enable search on the entire data


```

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!