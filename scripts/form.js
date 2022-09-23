const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  validateName();
});

function validateName() {
  var nameTxt = document.getElementById("fname").value;
  var regex = /^.{6,}$/;
  var result = regex.test(nameTxt);
  console.log(result);
  if (result) {
    Swal.fire(
      "Sorry!",
      "Your message was not sent because we dont have a backend developer.",
      "info"
    );
  } else {
    Swal.fire(
      "Regex validation error!",
      "name must be more than 5 characters! " + result,
      "error"
    );
  }
}
