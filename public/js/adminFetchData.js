const email = localStorage.getItem("email");
const admin = localStorage.getItem("admin");
console.log("This is for admin fetchdata route");
const refreshToken = localStorage.getItem("refreshToken");

function routeHandler() {
  const url = `http://localhost:8000/`;
  let accessToken = localStorage.getItem("accessToken");
  const userData = { email: email, refreshToken: refreshToken };
  console.log("Routehandler for every 50 second");

  if (!accessToken || !refreshToken || !admin) {
    window.location.href = url;
    return;
  }

  getRefreshToken(userData);
  //delete refresh token
  // localStorage.removeItem("accessToken");
}

//fetch the data
function fetchData() {
  const fetchDataList = document.getElementById("fetchdata-list");
  let accessToken = localStorage.getItem("accessToken");
  fetch(`/api/fetchdata/admin/getalldata`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      // setup if response is OK then load fetch data page
      console.log(response);
      return response.json();
    })
    .then((data) => {
      console.log(data.data[0].email);
      console.log(data.data[0].content[0]);
      console.log("success", data);

      //start of dom manipulation to get all data
      for (let eachdata in data.data) {
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

        newDataEmail.innerHTML = `${data.data[eachdata].email}`;
        const newDatatitle = document.createElement("td");
        newDatatitle.classList.add("py-4", "px-6", "font-medium");

        const newDataDesc = document.createElement("td");
        newDataDesc.classList.add("py-4", "px-6", "font-medium");

        let joinTitle = "";
        let joinDesc = "";
        let count = 1;
        for (let i in data.data[eachdata].content) {
          joinTitle += `${count}. ${data.data[eachdata].content[i].title}<hr><br><br>`;
          joinDesc += `${count}. ${data.data[eachdata].content[i].desc}<hr><br><br>`;
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
      }
    });
}

const exportCsvBtn = document.getElementById("exportcsv-btn");

exportCsvBtn.addEventListener("click", () => {
  const responseMessage = document.getElementById("response-message");
  fetch(`/api/fetchdata/admin/exportcsv`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      // setup if response is OK then load fetch data page
      console.log(response);
      return response.json();
    })
    .then((data) => {
      console.log("success", data.message);
      responseMessage.innerHTML = data.message;
    });
  responseMessage.innerHTML = "";
});

fetchData();

routeHandler();

//checking access token every 50 second
setInterval(() => {
  routeHandler();
}, 50000);

const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  routeHandler();
});
