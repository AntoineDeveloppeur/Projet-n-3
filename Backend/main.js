
/***** Conditions de chargement du portefolio par la présence de la section portfolio dans la page ******/
if (document.getElementById("portfolio")) {
    const filtres = await recupererFiltres()
    creationDesFiltres(filtres)
    const travaux = await recupererTravaux()
    remplirLaGallerieEnDynamique(travaux)
    }
    if(window.localStorage.getItem("token")!== null) {
        console.log("mode admin")
        chargerModeAdmin()
    } else {
        console.log("mode user")
    }



/****** Récupérer les travaux *****/
async function recupererTravaux () {
    if (window.localStorage.getItem("travauxLocalStorage") === null) {
        return recupererTravauxDepuisLAPI()
    } else {
        const reponse = window.localStorage.getItem("travauxLocalStorage")
        const travaux = JSON.parse(reponse)
        console.log(travaux)
        return travaux
    }
}

async function recupererTravauxDepuisLAPI () {
    const reponse = await fetch("http://localhost:5678/api/works")
    const travaux = await reponse.json()
    // Stockage des informations dans le localStorage
    const travauxLocalStorage = JSON.stringify(travaux);
    window.localStorage.setItem("travauxLocalStorage", travauxLocalStorage);
    return travaux
}

async function remplirLaGallerieEnDynamique(travaux) {
    /****** Vider la gallerie ******/
    let gallery = document.querySelector(".gallery")
    gallery.innerHTML=""

    for (let i = 0; i < travaux.length; i++) {
        let figure = document.createElement("figure")
        gallery.appendChild(figure)

        let img = document.createElement("img")
        img.src=travaux[i].imageUrl
        img.alt=travaux[i].title
        figure.appendChild(img)

        let figcaption = document.createElement("figcaption")
        figcaption.innerHTML=travaux[i].title
        figure.appendChild(figcaption)
    }
}

/****** Récupérer les filtres *****/
async function recupererFiltres () {
    if (window.localStorage.getItem("filtresLocalStorage") === null) {
        const reponse = await fetch("http://localhost:5678/api/categories")
        const filtres = await reponse.json()
        // Stockage des informations dans le localStorage
        const filtresLocalStorage = JSON.stringify(filtres);
        window.localStorage.setItem("filtresLocalStorage", filtresLocalStorage);
        console.log(filtres)
        return filtres
    } else {
        const reponse = window.localStorage.getItem("filtresLocalStorage")
        const filtres = JSON.parse(reponse)
        return filtres
    }
}

async function creationDesFiltres(filtres) {

    // Création est insertion dans l'HTML de la divisionFiltres
    let divisionFiltres = document.createElement("div")
    divisionFiltres.id = "divisionFiltres"
    const portfolio = document.querySelector("#portfolio")
    const gallery = document.querySelector(".gallery")
    portfolio.insertBefore(divisionFiltres, gallery)

    //  Création du filtre tous
    const tous = document.createElement("button")
    tous.innerText = "Tous"
    tous.classList.add("filtres","filtres-actif")
    divisionFiltres.appendChild(tous)

    // Création des autres filtres
    for (let i = 0; i < filtres.length; i++) {
        let boutton = document.createElement("button")
        boutton.innerText = filtres[i].name
        boutton.id = `${filtres[i].id}`
        boutton.classList.add("filtres")
        divisionFiltres.appendChild(boutton)
    }
    // Rendre cliquable les filtres
    let lesBouttonsFiltres=document.querySelectorAll(".filtres")
    lesBouttonsFiltres.forEach(boutton => {
    boutton.addEventListener("click", () => {
        filtrerTravaux(event)
    })})
}


function filtrerTravaux(event) {
    if (event.target.id=="") {
        const travauxFiltres = travaux
        remplirLaGallerieEnDynamique(travauxFiltres)
    } else {
        console.log("else pour le boutton pour les bouttons ")
        const travauxFiltres = travaux.filter(function (projets) {
            return projets.categoryId == event.target.id
        })
        remplirLaGallerieEnDynamique(travauxFiltres)
    }
}

/***** Conditions de chargement du portefolio par la présence de la section portfolio dans la page ******/
if (document.getElementById("connexion")) {
    let connexion = document.getElementById("envoi-formulaire-connexion")
    connexion.addEventListener("click", async () => {
        event.preventDefault()
        const email = document.getElementById("email").value
        const motDePasse = document.getElementById("mot-de-passe").value
        console.log(email)
        console.log(motDePasse)

        const data = {
            "email": email,
            "password": motDePasse
        }
        // TODO: Récupérer l'erreur et l'intégré à l'HTML pour améliorer l'expérience utilisateur
        const reponseLogin = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then((response) => response.json())
        .then((data) => {
        console.log(data);
        console.log(data.token)
        window.localStorage.setItem("token",data.token)
        if (data.error) {
            alert("Email ou mot de passe incorrect")
        } else {
            window.location.href = "index.html"
        }
        })
        .catch((err) => {
        console.log(err);
        });
    })
}

async function chargerModeAdmin() {
    let elementsAdmin = document.querySelectorAll("notvisible")
    elementsAdmin.forEach(function(element) {
        element.classList.remove("notvisible")
    })
    remplirLaModaleEnDynamique(await recupererTravaux())
}

function remplirLaModaleEnDynamique(travaux) {
    /****** Vider la modale ******/
    let contenuModale = document.getElementById("contenu-modale")
    contenuModale.innerHTML=""

    for (let i = 0; i < travaux.length; i++) {
        let contenantPhoto = document.createElement("div")
        contenantPhoto.classList.add("contenant-photo")
        contenuModale.appendChild(contenantPhoto)

        let photoProjet = document.createElement("img")
        photoProjet.classList.add("photo-projet")
        photoProjet.src=travaux[i].imageUrl
        photoProjet.alt=travaux[i].title
        contenantPhoto.appendChild(photoProjet)

        let contenantPoubelle = document.createElement("div")
        contenantPoubelle.classList.add("contenant-poubelle")
        contenantPoubelle.id = travaux[i].id
        contenantPhoto.appendChild(contenantPoubelle)

        let iconePoubelle = document.createElement("img")
        iconePoubelle.classList.add="icone-poubelle"
        iconePoubelle.src = "assets/icons/poubelle.png"
        iconePoubelle.id = travaux[i].id
        contenantPoubelle.appendChild(iconePoubelle)
    }
    await supprimerUnProjet()
}

async function supprimerUnProjet () {
    let contenantPoubelle = document.querySelectorAll(".contenant-poubelle")
    console.log(contenantPoubelle)
    contenantPoubelle.forEach(boutton => {
    boutton.addEventListener("click", (event) => {
        console.log(event.target.id)
        // supprimer un élément de la base de données
        await fetch ("http://localhost:5678/api/works/1", {
            method : "delete",
            headers : {
                "Content-Type": "application/json"
                },
            body : ""
        })
        .then((response) => response.json())
        .then((data) => {
        console.log(data);
        if (data.error) {
            alert("error")
        } 
        })
        .catch((error) => {
        console.log(error);
        });
        // Charger les travaux depuis l'API
        remplirLaModaleEnDynamique(recupererTravauxDepuisLAPI())
    })
    })
}
