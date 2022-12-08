  //get refresh token function to get new accesstoken
 function getRefreshToken(userData){
  console.log("getrefresh token running");
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
  }