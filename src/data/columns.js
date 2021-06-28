const columns = [{
    id: "albumId", //Unique Id
    label: "Album ID", //Use in Header
    numeric: true, //Right Align if true
    width: "10px" // Column width
}, {
    id: "id",
    label: "ID",
    numeric: true,
    width: "10px"
}, {
    id: "title",
    label: "Title",
    numeric: false,
    width: undefined
}, {
    id: "url",
    label: "URL",
    numeric: false,
    width: "10%"
}, {
    id: "thumbnailUrl",
    label: "Thumbnail",
}]

export default columns;