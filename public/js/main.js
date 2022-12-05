const { email } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
console.log("this is for formsubmit route");
console.log(email);
function displayTime() {
  let clock = moment().format("hh:mm:ss A");
  const getClock = document.getElementById("clock");
  getClock.innerHTML = clock;
}
const submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", formHandler);
function formHandler(e) {
  e.preventDefault();

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
  //   axios
  //     .post("/api/formsubmit", {
  //       userData: JSON.stringify(userData),
  //     })
  //     .then(function (response) {
  //       console.log(response);
  //     })
  //     .catch(function (error) {
  //       console.error(error);
  //     });

  //   const options = {
  //       method: "POST",
  //       url: "/api/formsubmit",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       data: {
  //         userData: JSON.stringify(userData),
  //       },
  //     };
  //     const response = await axios.reques(options);
  //     console.log(response.data);

  // window.location.reload();
}

function timeValidation() {
  let form = document.getElementById("myForm");
  let elements = form.elements;
  const formMsg = document.getElementById("form-msg");
  const submitEmail = document.getElementById("submit-email");
  //getting time for validation
  let time = moment().format("hh mm ss a");

  // let time = "05 40 00 pm";
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
      elements[i].readOnly = true;
      elements[0].value = email;
      elements[i].classList.add("bg-gray-200");
    }
    submitBtn.disabled = true;
  }
}

const fetchDataBtn = document.getElementById("fetchdata-btn");

fetchDataBtn.addEventListener("click", () => {
  const url = `http://localhost:8000/fetchdata.html?email=${email}`;

  window.location.href = url;
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
