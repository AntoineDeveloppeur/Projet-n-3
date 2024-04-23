/**
 * Envoie le formulaire de connexion à l'API
 */
 function sendConnexionForm() {
    const email = document.getElementById("email").value;
    const motDePasse = document.getElementById("password").value;
    const data = {
      email: email,
      password: motDePasse,
    };
  
    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((response) => {
        window.localStorage.setItem("token", response.token);
        if (response.error) {
          alert("Email ou mot de passe incorrect");
        } else {
          window.location.href = "index.html";
        }
      })
      .catch((error) => {
        alert("Une erreur de connection s'est produite");
      });
  }
  
  // Active le bouton d'envoi du formulaire si l'utilisateur est sur la page connexion
  if (document.getElementById("connexion")) {
    const connexion = document.getElementById("send-connexion-form-btn");
    connexion.addEventListener("click", (event) => {
      event.preventDefault();
      sendConnexionForm();
    });
  }
  