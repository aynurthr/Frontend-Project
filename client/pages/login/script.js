const form = document.getElementById("login-form");

form.addEventListener("submit", function (event) {
  let valid = true;
  event.preventDefault();

  const username = document.getElementById("username");
  const password = document.getElementById("password");

  if (username.value.trim() == "") {
    valid = false;
    document.querySelector(".username.error-message").textContent =
      "*Required field";
  } else {
    document.querySelector(".username.error-message").textContent = "";
  }

  if (password.value == "") {
    valid = false;
    document.querySelector(".password.error-message").textContent =
      "*Required field";
  } else {
    document.querySelector(".password.error-message").textContent = "";
  }

  if (valid) {
    newUsername = username.value;
    fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "CONTENT-TYPE": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          Toastify({
            text: `Login successful! Welcome back, ${newUsername}!`,
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
              background: "linear-gradient(to right, #009900, #229933)",
            },
          }).showToast();
          username.value = "";
          password.value = "";
        } else if (response.status === 400) {
          return response.json();
        }
      })
      .then((data) => {
        //if status=200, then data=undefined.
        if (data) {
          Toastify({
            text: data.error,
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
              background: "linear-gradient(to right, #FF0000, #FF5733)",
            },
          }).showToast();
        }
      });
  }
});
