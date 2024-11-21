const showImg = () => {
  const now = new Date();
  const hour = now.getHours();
  let active_img;
  let disabled_img;
  if(6 <= hour && hour < 18) {
    active_img = document.querySelector("#night");
    disabled_img = document.querySelector("#day");
  } else {
    active_img = document.querySelector("#day");
    disabled_img = document.querySelector("#night");
  }
  disabled_img.classList.remove("active");
  active_img.classList.add("active");
}
const images = document.querySelectorAll("#slideshow img");

setInterval(showImg, 3000);
showImg();
