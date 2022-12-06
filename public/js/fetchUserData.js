// const { email } = Qs.parse(location.search, {
//   ignoreQueryPrefix: true,
// });
const email = localStorage.getItem("email");
console.log("This is for fetchdata route");
const refreshToken = localStorage.getItem("refreshToken")

function routeHandler() {
  
  const url = `http://localhost:8000/`;
  let accessToken = localStorage.getItem("accessToken");
  const userData = { email: email, refreshToken: refreshToken };
  console.log("Routehandler for every 50 second");

  if (!accessToken) {
    window.location.href = url;
    return;
  }

  //get refresh token function to get new accesstoken
  fetch("/api/auth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log("success", data.response.accessToken);
      accessToken = data.response.accessToken;

      //set new accesstoken
      localStorage.setItem("accessToken", accessToken);
    })
    .catch((err) => {
      console.error(err.message);
    });

  //delete refresh token
  // localStorage.removeItem("accessToken");
}
//fetch the data
function fetchData() {
  const fetchDataList = document.getElementById("fetchdata-list");
  let accessToken = localStorage.getItem("accessToken");
  fetch(`/api/fetchdata/${email}`,{
    method:'GET',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      // setup if response is OK then load fetch data page
      return response.json();
    })
    .then((data) => {
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

routeHandler();

//checking access token every 50 second
setInterval(() => {
  routeHandler();
}, 50000);

const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click",() => {
  localStorage.clear();
  routeHandler();
})