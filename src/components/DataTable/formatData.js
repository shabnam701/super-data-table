export default function formatData(rows) {
  return rows && rows.length > 0
    ? rows.map((item) => {
      return item;
    })
    : [];
}
