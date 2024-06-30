const classificationSelect = document.querySelector("#category");
const target = document.querySelector("#categoryList");

window.addEventListener("load", async () => {
  if (classificationSelect.value && target.children.length === 0) {
    fetchInventory(classificationSelect.value, target);
  }
});

const fetchInventory = async (classificationId, target) => {
  target.innerText = `loading data for category ${classificationId}...`;
  const url = `/api/inventory/type/${classificationId}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.length === 0) {
    target.innerText = "no data found for this category";
  } else {
    target.innerText = "";
    const tableHeaders = ["Vehicle Name", " ", " "];
    const editColumn = (row) => {
      const editLink = document.createElement("a");
      editLink.href = `/inv/edit/${row.inv_id}`;
      editLink.title = "Edit this vehicle";
      editLink.innerText = "Edit";
      return editLink;
    };
    const deleteColumn = (row) => {
      const delLink = document.createElement("a");
      delLink.href = `/inv/delete/${row.inv_id}`;
      delLink.title = "Delete this vehicle";
      delLink.innerText = "Delete";
      return delLink;
    };

    const tableColumns = (row) => [
      document.createTextNode(
        `'${row.inv_year.substring(1, 3)} ${row.inv_make} ${row.inv_model}`
      ),
      editColumn(row),
      deleteColumn(row),
    ];
    target.appendChild(buildTable(data, tableHeaders, tableColumns));
  }
};

classificationSelect.addEventListener("change", async (e) => {
  const classificationId = e.target.value;
  fetchInventory(classificationId, target);
});

/**
@param {Object[]} data - array of row objects to be displayed in the table
@param {String[]} headers - array of strings representing the table headers
@param {Function} columnsBuilder - function that takes a row object and returns an array of dom element objects to fill cells in a given row
@return {HTMLTableElement} - a table element with the given data
*/
const buildTable = (data, headers, columnsBuilder) => {
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
    columnsBuilder(row).forEach(buildCell);
    tbody.appendChild(rowElement);
  });
  table.appendChild(tbody);
  return table;
};
