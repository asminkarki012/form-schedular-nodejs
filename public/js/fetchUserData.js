const { email } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

console.log("This is for fetchdata route");
//fetch the data
function fetchData() {
  const fetchDataList = document.getElementById("fetchdata-list");
  fetch(`/api/fetchdata/${email}`)
    .then((response) => {
      // setup if response is OK then load fetch data page
      return response.json();
    })
    .then((data) => {
      //   console.log(data);
      //   console.log(data.data.email);
      //   console.log(data.data.content[0].title);
      //start of dom manipulation
      const newRow = document.createElement("tr");
      newRow.classList.add(
        "bg-white",
        "border-b",
        "dark:bg-gray-800",
        "dark:border-gray-700"
      );

      const newDataEmail = document.createElement("th");
      newDataEmail.classList.add(
        "py-4",
        "px-6",
        "font-medium",
        "text-gray-900",
        "whitespace-nowrap",
        "dark:text-white"
      );
      newDataEmail.innerHTML = `${data.data.email}`;

      const newDatatitle = document.createElement("td");
      newDatatitle.classList.add("py-4", "px-6","font-medium");

      const newDataDesc = document.createElement("td");
      newDataDesc.classList.add("py-4", "px-6","font-medium");
      let joinTitle = "";
      let joinDesc = "";
      let count = 1;
      for (let i in data.data.content) {
        joinTitle += `${count}. ${data.data.content[i].title}<hr><br><br>`;
        joinDesc += `${count}. ${data.data.content[i].desc}<hr><br><br>`;
        count++;
      }

      newDatatitle.innerHTML = joinTitle;
      newDataDesc.innerHTML = joinDesc;

      newRow.appendChild(newDataEmail);
      newRow.appendChild(newDatatitle);
      newRow.appendChild(newDataDesc);
      // console.log(newRow);
      fetchDataList.appendChild(newRow);
      //   console.log(fetchDataList);
    });
}
fetchData();
