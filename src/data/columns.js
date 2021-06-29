const columns = [{
    id: "albumId", //Unique Id
    label: "Album ID", //Use in Header
    numeric: true, //Right Align if true
    width: "100px" // Column width
}, {
    id: "id",
    label: "ID",
    numeric: true,
    width: "100px"
}, {
    id: "title",
    label: "Title",
    numeric: false,
    width: "100%"
}, {
    id: "url",
    label: "URL",
    numeric: false,
    width: "25%"
}, {
    id: "thumbnailUrl",
    label: "Thumbnail",
}]

export default columns;