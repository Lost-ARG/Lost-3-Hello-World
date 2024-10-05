const myModal = new bootstrap.Modal(document.getElementById('alert'));
const modalBody = document.querySelector(".modal-body");
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const email = urlParams.get('email');
const hash = urlParams.get('hash');

const verifyEmail = () => {
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  fetch(`/api/signUp/verify-email/${email}/${hash}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      modalBody.innerHTML = `<span>${result["message"]}</span>`;
      myModal.show();
      if (result["status"] === 200) {
        document.querySelector("#alert").addEventListener('hide.bs.modal', () => {
          location.href = result["redirectUrl"]
        });
      }
    })
    .catch((error) => console.error(error));
}

verifyEmail();
