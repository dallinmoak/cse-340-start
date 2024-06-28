document.querySelector("#category").addEventListener("change", async (e) => {
  const classificationId = e.target.value;
  const target = document.querySelector("#categoryList");
  target.innerText = `loading data for category ${classificationId}...`;
  const url = `/api/inventory/type/${classificationId}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.length === 0) {
    target.innerText = "no data found for this category";
  } else {
    target.innerText = "";
    const tableHeaders = ["Vehicle Name", " ", " "];
    const tableColumns = (row) => [
      document.createTextNode(
        `'${row.inv_year.substring(1, 3)} ${row.inv_make} ${row.inv_model}`
      ),
      (() => {
        const editLink = document.createElement("a");
        editLink.href = `/inv/edit/${row.inv_id}`;
        editLink.title = "Edit this vehicle";
        editLink.innerText = "Edit";
        return editLink;
      })(),
      (() => {
        const delLink = document.createElement("a");
        delLink.href = `/inv/delete/${row.inv_id}`;
        delLink.title = "Delete this vehicle";
        delLink.innerText = "Delete";
        return delLink;
      })(),
    ];
    target.appendChild(buildTable(data, tableHeaders, tableColumns));
  }
});

const buildTable = (data, headers, columns) => {
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  const headerRow = document.createElement("tr");
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.innerText = header;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);
  data.forEach((row) => {
    const rowElement = document.createElement("tr");
    const buildCell = (content) => {
      const cell = document.createElement("td");
      cell.appendChild(content);
      rowElement.appendChild(cell);
    };
    columns(row).forEach(buildCell);
    tbody.appendChild(rowElement);
  });
  table.appendChild(tbody);
  return table;
};
