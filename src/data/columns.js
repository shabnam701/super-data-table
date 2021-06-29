const columns = [{
    id: "id",
    label: "ID",
    numeric: true,
    width: "100px"
}, {
    id: "thumbnailUrl",
    label: "Thumbnail",
    isImage: true // Indicates if a column is of type image
}, {
    id: "title",
    label: "Title",
    numeric: false,
    width: "100%"
}, {
    id: "albumId", //Unique Id
    label: "Album ID", //Use in Header
    numeric: true, //Right Align if true
    width: "100px", // Column width,
    isHidden: true // Column visibility
}, {
    id: "url",
    label: "URL",
    numeric: false,
    width: "25%",
    isLink: true // Indicates if a column is of type link
}]

export default columns;