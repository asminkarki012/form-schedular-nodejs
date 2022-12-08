const email = localStorage.getItem("email");
let refreshToken = localStorage.getItem("refreshToken");
const admin = localStorage.getItem("admin");

console.log(typeof admin);
const submitBtn = document.getElementById("submit-btn");
const clearBtn = document.getElementById("clear-btn");
const fetchDataBtn = document.getElementById("fetchdata-btn");
const loaderContainer = document.querySelector(".loader-container");

window.addEventListener("load", () => {
  loaderContainer.style.display = "none";
});

console.log("this is for formsubmit route");
console.log(email);

function displayTime() {
  let clock = moment().format("hh:mm:ss A");
  const getClock = document.getElementById("clock");
  getClock.innerHTML = clock;
}

submitBtn.addEventListener("click", formHandler);

function routeHandler() {
  console.log("Routehandler for every 50 second");
  const url = `http://localhost:8000/`;

  if (admin === "true") {
    console.log("Admin panel testing");
    const adminHeader = document.getElementById("adminpanel-header");
    adminHeader.innerHTML = "Admin Panel";
  }

  let accessToken = localStorage.getItem("accessToken");

  //protecting route if no accesstoken is available
  if (!accessToken || !refreshToken) {
    window.location.href = url;
    return;
  }
  //call formhandler using initial accesstoken
  const userData = { email: email, refreshToken: refreshToken };

  getRefreshToken(userData);

  //get refresh token function to get new accesstoken
  // fetch("/api/auth/token", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(userData),
  // })
  //   .then((response) => {
  //     return response.json();
  //   })
  //   .then((data) => {
  //     console.log("success", data.response.accessToken);
  //     accessToken = data.response.accessToken;

  //     //set new accesstoken
  //     localStorage.setItem("accessToken", accessToken);

  //   })
  //   .catch((err) => {
  //     console.error(err.message);
  //   });

  //delete refresh token
  // localStorage.removeItem("accessToken");
}
routeHandler();

function formHandler(e) {
  e.preventDefault();

  let accessToken = localStorage.getItem("accessToken");
  const responseMsg = document.getElementById("msg");
  const submitTitle = document.getElementById("submit-title");
  const submitDesc = document.getElementById("submit-desc");
  const userData = {
    email: email,
    content: [{ title: submitTitle.value, desc: submitDesc.value }],
  };
  console.log(userData);
  fetch("/api/formsubmit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      //   const successMsg = document.getElementById("success-msg");
      //   successMsg.innerHTML = "data inserted successfully";
      return response.json();
    })
    .then((data) => {
      console.log("success", data);
      responseMsg.innerHTML = `${data.message}`;
      // responseMsg.innerHTML = data.message
    })
    .catch((err) => {
      console.error(err);
    });

  submitTitle.value = "";
  submitDesc.value = "";
  responseMsg.innerHTML = "";
}

function timeValidation() {
  let form = document.getElementById("myForm");
  let elements = form.elements;
  const formMsg = document.getElementById("form-msg");
  const submitEmail = document.getElementById("submit-email");
  //getting time for validation
  // let time = moment().format("hh mm ss a");

  let time = "05 40 00 pm";
  time = time.split(" ");
  hh = parseInt(time[0]);
  mm = parseInt(time[1]);
  ss = parseInt(time[2]);
  day = time[3];
  if (hh >= 05 && hh < 06) {
    if (mm >= 30 && mm <= 59) {
      if ((ss >= 00 && ss <= 59) || ss === 00) {
        if (day === "pm") {
          formMsg.innerHTML = "You can Fill Form Now";
          submitEmail.readOnly = true;
          submitEmail.value = email;
          submitEmail.classList.add("bg-gray-200");
        }
      }
    }
  } else {
    formMsg.innerHTML = "You can only Fill this Form Between 5.30pm and 6pm";
    for (let i = 0; i < elements.length; i++) {
      elements[i].disabled = true;
      elements[0].value = email;
      elements[i].classList.add("bg-gray-200");
    }
  }
}

fetchDataBtn.addEventListener("click", () => {
  const userUrl = `http://localhost:8000/fetchdata.html`;
  const adminUrl = `http://localhost:8000/adminfetchdata.html`;

  if (admin === "true") {
    window.location.href = adminUrl;
  } else {
    window.location.href = userUrl;
  }
});

//time validation check running every 5 minutes
setInterval(() => {
  timeValidation();
}, 300000);

//running displayTime function every 1 second
setInterval(() => {
  displayTime();
}, 1000);

timeValidation();

//updating access token every 50 second as access token expires in 50s
setInterval(() => {
  routeHandler();
}, 50000);

const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  routeHandler();
});
