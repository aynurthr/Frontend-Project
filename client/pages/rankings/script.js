//For tab buttons:
const todayBtn = document.getElementById("today-button");
const thisWeekBtn = document.getElementById("this-week-button");
const thisMonthBtn = document.getElementById("this-month-button");
const allTimeBtn = document.getElementById("all-time-button");

function btnClick(button) {
  todayBtn.classList.remove("clicked-on");
  thisWeekBtn.classList.remove("clicked-on");
  thisMonthBtn.classList.remove("clicked-on");
  allTimeBtn.classList.remove("clicked-on");
  button.classList.add("clicked-on");
}

todayBtn.addEventListener("click", () => {
  btnClick(todayBtn);
});
thisWeekBtn.addEventListener("click", () => {
  btnClick(thisWeekBtn);
});
thisMonthBtn.addEventListener("click", () => {
  btnClick(thisMonthBtn);
});
allTimeBtn.addEventListener("click", () => {
  btnClick(allTimeBtn);
});

btnClick(todayBtn);
