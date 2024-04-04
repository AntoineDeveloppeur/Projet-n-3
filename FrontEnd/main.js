
/***** Page index ******/
if (document.getElementById("portfolio")) {
    const filtres = await recupererFiltres()
    insertionDesFiltres(filtres)
    const travaux = await recupererTravaux()
    remplirLaGallerieEnDynamique(travaux)
    if(window.localStorage.getItem("token")!== null) {
        console.log("mode admin")
        chargerModeAdmin()
    } else {
        console.log("mode user")
    }
}

async function chargerModeAdmin() {
    const headband = document.getElementById("headband")
    headband.classList.remove("not-visible")

    const login = document.getElementById("login")
    login.innerText= "logout"
    login.href= "index.html"
    logOut()

    const modifierGalerie = document.getElementById("modify-galery")
    modifierGalerie.classList.remove("not-visible")
    modifierGalerie.addEventListener("click", async () => {
        await remplirLaModaleEnDynamique(await recupererTravaux())
        montrermodalGalery()
    })
    // Chargement dynamique de la modale pour améliorer l'expérience Utilisateur
    
}

function logOut() {
    const login = document.getElementById("login")
    login.addEventListener("click", () => {
        window.localStorage.removeItem("token")
        login.innerText= "login"
        // login.href= "connexion.html"
    })
}


/****** Récupérer les travaux *****/
async function recupererTravaux () {
    const reponse = await fetch("http://localhost:5678/api/works")
    const travaux = await reponse.json()
    return travaux
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

async function insertionDesFiltres(filtres) {

    // Création est insertion dans l'HTML de la divisionFiltres
    let divisionFiltres = document.createElement("div")
    divisionFiltres.id = "divisionFiltres"
    const portfolio = document.querySelector("#portfolio")
    const galery= document.querySelector(".galery")
    portfolio.insertBefore(divisionFiltres, galery)

    //  Création du filtre tous
    const tous = document.createElement("button")
    tous.id = "tous-filter"
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
    let filterButtons=document.querySelectorAll(".filtres")
    filterButtons.forEach(boutton => {
        boutton.addEventListener("click", () => {
            filtrerTravaux(event)
    })})
}

// TODO : rendre le background des filtres verts quand on clique dessus
async function filtrerTravaux(event) {
    const travaux = await recupererTravaux()
    const filterButtons = document.querySelectorAll(".filtres")
    console.log(filterButtons)
    filterButtons.forEach(boutton => {
        boutton.classList.remove("filtre-actif")
    })
    if (event.target.id=="") {
        remplirLaGallerieEnDynamique(travaux)
        const tousFilter = document.getElementById("tous-filter")
        tousFilter.classList.add("filtres-actif")
    } else {
        console.log(event.target.id)
        console.log("else pour le boutton pour les bouttons ")
        event.target.classList.add("filtres-actif")

        let travauxFiltres = travaux.filter(projets => projets.categoryId == event.target.id)
        remplirLaGallerieEnDynamique(travauxFiltres) 
    }
}

/***** 
 * 
 * Partie Modale Galerie 
 * 
 * *****/

async function remplirLaGallerieEnDynamique(travaux) {
    /****** Vider la gallerie ******/
    let galery= document.querySelector(".galery")
    galery.innerHTML=""

    for (let i = 0; i < travaux.length; i++) {
        let figure = document.createElement("figure")
        galery.appendChild(figure)

        let img = document.createElement("img")
        img.src=travaux[i].imageUrl
        img.alt=travaux[i].title
        figure.appendChild(img)

        let figcaption = document.createElement("figcaption")
        figcaption.innerHTML=travaux[i].title
        figure.appendChild(figcaption)
    }
}



async function remplirLaModaleEnDynamique(travaux) {
    /****** Vider la modale ******/
    let contenuModale = document.getElementById("modal-content")
    contenuModale.innerHTML=""

    for (let i = 0; i < travaux.length; i++) {
        let contenantPhoto = document.createElement("div")
        contenantPhoto.classList.add("picture-container")
        contenuModale.appendChild(contenantPhoto)

        let photoProjet = document.createElement("img")
        photoProjet.classList.add("project-picture")
        photoProjet.src=travaux[i].imageUrl
        photoProjet.alt=travaux[i].title
        contenantPhoto.appendChild(photoProjet)

        let contenantPoubelle = document.createElement("div")
        contenantPoubelle.classList.add("trash-container")
        contenantPoubelle.id = travaux[i].id
        contenantPhoto.appendChild(contenantPoubelle)

        let iconePoubelle = document.createElement("img")
        iconePoubelle.classList.add="trash-icon"
        iconePoubelle.src = "assets/icons/poubelle.svg"
        iconePoubelle.id = travaux[i].id
        contenantPoubelle.appendChild(iconePoubelle)
    }
    await supprimerUnProjet()
    activerBouttonsModales ()
}

// TODO : Enregistrer la base de donnée quelque part avant de la modifier
// A l'heure actuel l'identifiant utilisé est 20 pour ne pas supprmier de projet
// Le reste de la fonction fonctionne


function activerBouttonsModales () {
    // rendre cliquable ajout photo, la croix et rendre visible et non visible les éléments correspondants
    let backgroundOpacity = document.getElementById("background-opacity")
    backgroundOpacity.addEventListener("click", (event) => {
        backgroundOpacity.classList.add("not-visible")
        cacherModaleAjoutPhoto()
        cachermodalGalery()
    })
    
    let iconFermeture = document.querySelectorAll(".closing-icon")
    iconFermeture.forEach(boutton => {
        boutton.addEventListener("click", () => {
            cacherModaleAjoutPhoto()
            cachermodalGalery() 
        })
    })

    const arrowLeft = document.getElementById("arrow-left")
    arrowLeft.addEventListener("click", () => {
        cacherModaleAjoutPhoto()
        montrermodalGalery()
    })

    let ajouterPhoto = document.getElementById("pic-adding")
    ajouterPhoto.addEventListener("click", () => {
        cachermodalGalery()
        montrerModaleAjoutPhoto()
        
    })
}

function cachermodalGalery() {
    const modalGalery = document.getElementById("modal-galery")
    modalGalery.classList.add("not-visible")
    const backgroundOpacity = document.getElementById("background-opacity")
    backgroundOpacity.classList.add("not-visible")
}

function cacherModaleAjoutPhoto() {
    let modaleAjoutPhoto = document.getElementById("pic-adding-modal")
        modaleAjoutPhoto.classList.add("not-visible")
        const backgroundOpacity = document.getElementById("background-opacity")
        backgroundOpacity.classList.add("not-visible")
}

function montrermodalGalery() {
    const modalGalery = document.getElementById("modal-galery")
    modalGalery.classList.remove("not-visible")
    const backgroundOpacity = document.getElementById("background-opacity")
    backgroundOpacity.classList.remove("not-visible")
}

function montrerModaleAjoutPhoto() {
    const modaleAjoutPhoto = document.getElementById("pic-adding-modal")
    modaleAjoutPhoto.classList.remove("not-visible")
    const backgroundOpacity = document.getElementById("background-opacity")
    backgroundOpacity.classList.remove("not-visible")
}



/***** 
 * 
 * Page de connexion
 * 
 * *****/


function sendConnexionForm () {
    const email = document.getElementById("email").value
    const motDePasse = document.getElementById("mot-de-passe").value
    const data = {
        "email": email,
        "password": motDePasse
    }
    // TODO: Récupérer l'erreur et l'intégré à l'HTML pour améliorer l'expérience utilisateur
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    // .then((response) => response.json())
    .then((response) => response.json())
    .then((response) => {
        window.localStorage.setItem("token",response.token)
        if (response.error) {
            alert("Email ou mot de passe incorrect")
        } else {
            window.location.href = "index.html"
        }
    })
    .catch((error) => {
    console.log(error);
    });
}

if (document.getElementById("connexion")) {
    const connexion = document.getElementById("envoi-formulaire-connexion")
    connexion.addEventListener("click", (event) => {
        event.preventDefault()
        sendConnexionForm()
    })
}

if (document.getElementById("pic-adding-validation")) {
    const picAddingValidation = document.getElementById("pic-adding-validation")
    picAddingValidation.addEventListener("click", (event) => {
        event.preventDefault()
        addwork()
    })
}


async function addwork () {
    const title = document.getElementById("title").value
    const category = document.getElementById("category").value
    const picture = document.getElementById("picture").files[0]
    console.log(title, category, picture)
    const formdata = new FormData()
    formdata.append("image", picture)
    formdata.append("title", title)
    formdata.append("category", category)
    const token = window.localStorage.getItem("token")
    const response = await fetch("http://localhost:5678/api/works/",{
        method : "POST",
        headers : {
            authorization : "Bearer " +token
            },
        body : formdata
    })
   
    try {
        if(response.ok) {
        alert("nouveauTravailEnregistre")
        await remplirLaModaleEnDynamique(await recupererTravaux())
        await remplirLaGallerieEnDynamique(await recupererTravaux())
    } else {
        console.log(response)
    }
    
    } catch {
        console.log(error)
    }
}

function supprimerUnProjet () {
    let contenantPoubelle = document.querySelectorAll(".trash-container")
    contenantPoubelle.forEach(boutton => {
    boutton.addEventListener("click", async (event) => {
        console.log(event.target.id)
        const localHostAdress = "http://localhost:5678/api/works/"+event.target.id
        console.log(localHostAdress)
        const token = window.localStorage.getItem("token")
        // supprimer un élément de la base de données
        try {
            const response = await fetch ( localHostAdress, {
                method : "delete",
                headers : {
                    "authorization" : "Bearer " +token
                    // "Content-Type" : "application/json"
                    },
                body : ""
            })
            if (!response.ok) {
                throw new Error('Erreur lors de la requête DELETE.')
            } else {
                console.log(response)
                const travauxMAJ = await recupererTravaux()
                console.log(travauxMAJ)
                await remplirLaModaleEnDynamique(await recupererTravaux())
                await remplirLaGallerieEnDynamique(await recupererTravaux())
            }
        } catch(error) {
                console.error(error);
        }
        
    })
    })
}
