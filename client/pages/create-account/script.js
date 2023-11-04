const form = document.getElementById("registration-form");

form.addEventListener("submit", function (event) {
  let valid = true;

  const username = document.getElementById("username");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");

  const usernameRegex =
    /(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
  //   Only contains alphanumeric characters, underscore and dot.
  //   Underscore and dot can't be at the end or start of a username (e.g _username / username_ / .username / username.).
  //   Underscore and dot can't be next to each other (e.g user_.name).
  //   Underscore or dot can't be used multiple times in a row (e.g user__name / user..name).
  //   Number of characters must be between 4 to 20

  const emailRegex = /^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  // At least one upper case English letter, (?=.*?[A-Z])
  // At least one lower case English letter, (?=.*?[a-z])
  // At least one digit, (?=.*?[0-9])
  // At least one special character, (?=.*?[#?!@$%^&*-])
  // Minimum eight in length .{8,} (with the anchors)

  if (username.value == "") {
    valid = false;
    document.querySelector(".username.error-message").textContent =
      "*Required field";
  } else if (!usernameRegex.test(username.value)) {
    valid = false;
    document.querySelector(".username.error-message").textContent =
      "Invalid username";
  } else {
    document.querySelector(".username.error-message").textContent = "";
  }

  if (email.value == "") {
    valid = false;
    document.querySelector(".email.error-message").textContent =
      "*Required field";
  } else if (!emailRegex.test(email.value)) {
    valid = false;
    document.querySelector(".email.error-message").textContent =
      "Invalid email address";
  } else {
    document.querySelector(".email.error-message").textContent = "";
  }

  if (password.value == "") {
    valid = false;
    document.querySelector(".password.error-message").textContent =
      "*Required field";
  } else if (!passwordRegex.test(password.value)) {
    valid = false;
    document.querySelector(".password.error-message").textContent =
      "Invalid password";
  } else {
    document.querySelector(".password.error-message").textContent = "";
    if (password.value !== confirmPassword.value) {
      valid = false;
      document.querySelector(
        ".confirmation-password.error-message"
      ).textContent = "Passwords do not match";
    } else {
      document.querySelector(
        ".confirmation-password.error-message"
      ).textContent = "";
    }
  }
  event.preventDefault();

  if (valid) {
    newUsername = username.value;
    fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: {
        "CONTENT-TYPE": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          Toastify({
            text: `Account created successfully! Welcome, ${newUsername}!`,
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
              background: "linear-gradient(to right, #009900, #229933)",
            },
          }).showToast();
          username.value = "";
          email.value = "";
          password.value = "";
          confirmPassword.value = "";
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