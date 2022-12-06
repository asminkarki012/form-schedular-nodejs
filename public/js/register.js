console.log("auth handler");
const authEmail = document.getElementById("auth-email");
const authPassword = document.getElementById("auth-password");

const signUpBtn = document.getElementById("signup-btn");
signUpBtn.addEventListener("click", signUpHandler);

const signInBtn = document.getElementById("signin-btn");
signInBtn.addEventListener("click", signInHandler);

const responseMsg = document.getElementById("response-message");

const loaderContainer = document.querySelector(".loader-container");
window.addEventListener("load",()=>{
  loaderContainer.style.display = "none";
})
//display loading spinner on page load
// window.addEventListener("load", () => {
//   document.body.style.display = "none";
// window.addEventListener("transitionend"),()=>{
//   document.body.style.display ="block";
// }

// });


function signUpHandler(event) {
  event.preventDefault();
  // for signup
  userData = {
    email: authEmail.value,
    password: authPassword.value,
  };
  fetch("/api/auth/signup", {
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
      console.log("success", data.message);
      responseMsg.innerHTML = `${data.message}`;
      // responseMsg.innerHTML = data.message
    })
    .catch((err) => {
      console.log(err);
      responseMsg.innerHTML = `${JSON.stringify(err.message)}`;
    });

  authEmail.value = "";
  authPassword.value = "";
}

function signInHandler(event) {
  event.preventDefault();

  const userData = {
    email: authEmail.value,
    password: authPassword.value,
  };
  const url = `http://localhost:8000/index.html?email=${userData.email}`;
  let checkResponseStatus = 0;
  // for signin
  fetch("/api/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      //   const successMsg = document.getElementById("success-msg");
      //   successMsg.innerHTML = "data inserted successfully";
      checkResponseStatus = response.status;
      // if (response.status === 200) {
      //   console.log("SIGN IN SUCCESSFULL");
      // }
      return response.json();
    })
    .then((data) => {
      console.log("success", data);
      console.log("success", data.accessToken);
      const accessToken = data.accessToken;

      if (checkResponseStatus === 200 && accessToken) {
        window.location.href = url;
        localStorage.setItem("accessToken", data.accessToken);

        responseMsg.innerHTML = `<p class="text-blue-500">${data.message}</p>`;
      }
      // responseMsg.innerHTML = data.message
    })
    .catch((err) => {
      console.error(err);
      responseMsg.innerHTML = `<p class="text-red-500">${JSON.stringify(
        err.message
      )}</p>`;
    });

  authEmail.value = "";
  authPassword.value = "";
}
