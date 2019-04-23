const modal = document.getElementById("myModal");
const btn = document.getElementById("btn");
const span = document.getElementsByClassName("close")[0];

function openModal() {
  modal.style.display = "block";
  video.src = "https://www.youtube.com/embed/4CbLXeGSDxg?enablejsapi=1&autoplay=1&mute=1";
};
function closeModal() {
  modal.style.display = "none";
  video.src = "https://www.youtube.com/embed/4CbLXeGSDxg";
};
btn.onclick = function() {
  openModal();
};
span.onclick = function() {
  closeModal();
};
window.onclick = function(event) {
  if (event.target == modal) {
    closeModal();
  };
};
