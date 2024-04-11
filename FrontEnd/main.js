
/*
 * Page index 
 */
if (document.getElementById("portfolio")) {
    const categories = await getCategories()
    putFiltersIntoHTML(categories)
    const travaux = await getWorks()
    FillGallery(travaux)
    if(window.localStorage.getItem("token")!== null) {
        LoadAdminMode()
    } else {
        console.log("mode user")
    }
}

async function LoadAdminMode() {
    const headband = document.getElementById("headband")
    headband.classList.remove("not-visible")

    const login = document.getElementById("login")
    login.innerText= "logout"
    login.href= "index.html"
    logOut()

    const modifierGalerie = document.getElementById("modify-gallery")
    modifierGalerie.classList.remove("not-visible")
    modifierGalerie.addEventListener("click", async () => {
        await FillGalleryModal(await getWorks())
        await deleteProject()
        showGaleryModal()
    })
    ActivateModalsButtons ()
}

function logOut() {
    const login = document.getElementById("login")
    login.addEventListener("click", () => {
        window.localStorage.removeItem("token")
        login.innerText= "login"
    })
}

async function putFiltersIntoHTML(categories) {
    let divFilters = document.createElement("div")
    divFilters.id = "divFilters"
    const portfolio = document.querySelector("#portfolio")
    const galery= document.querySelector(".galery")
    portfolio.insertBefore(divFilters, galery)

    const tous = document.createElement("button")
    tous.id = "tous-filter"
    tous.innerText = "Tous"
    tous.classList.add("filters","filters-active")
    divFilters.appendChild(tous)

    for (let i = 0; i < categories.length; i++) {
        let boutton = document.createElement("button")
        boutton.innerText = categories[i].name
        boutton.id = `${categories[i].id}`
        boutton.classList.add("filters")
        divFilters.appendChild(boutton)
    }

    let filterButtons=document.querySelectorAll(".filters")
    filterButtons.forEach(boutton => {
        boutton.addEventListener("click", (event) => {
            filterWorks(event)
    })})
}

async function filterWorks(event) {
    const travaux = await getWorks()
    const filterButtons = document.querySelectorAll(".filters")
    console.log(filterButtons)
    filterButtons.forEach(boutton => {
        boutton.classList.remove("filters-active")
    })
    if (event.target.id=="tous-filter") {
        console.log("event target vide")
        FillGallery(travaux)
        const tousFilter = document.getElementById("tous-filter")
        tousFilter.classList.add("filters-active")
    } else {
        console.log(event.target.id)
        console.log("else pour le boutton pour les bouttons ")
        event.target.classList.add("filters-active")

        let worksFilters = travaux.filter(works => works.categoryId == event.target.id)
        FillGallery(worksFilters) 
    }
}

function FillGallery(travaux) {
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

/*
 * Partie Modale Galerie 
 */
function FillGalleryModal(travaux) {
    /****** Vider la modale ******/
    let modalContent = document.getElementById("modal-content")
    modalContent.innerHTML=""

    for (let i = 0; i < travaux.length; i++) {
        let picDiv = document.createElement("div")
        picDiv.classList.add("picture-container")
        modalContent.appendChild(picDiv)

        let projectPicture = document.createElement("img")
        projectPicture.classList.add("project-picture")
        projectPicture.src=travaux[i].imageUrl
        projectPicture.alt=travaux[i].title
        picDiv.appendChild(projectPicture)

        let trashDiv = document.createElement("div")
        trashDiv.classList.add("trash-container")
        trashDiv.id = travaux[i].id
        picDiv.appendChild(trashDiv)

        let trashIcon = document.createElement("img")
        trashIcon.classList.add="trash-icon"
        trashIcon.src = "assets/icons/poubelle.svg"
        trashIcon.id = travaux[i].id
        trashDiv.appendChild(trashIcon)
    }

}

function ActivateModalsButtons () {
    // rendre cliquable ajout photo, la croix et rendre visible et non visible les éléments correspondants
    let backgroundOpacity = document.getElementById("background-opacity")
    backgroundOpacity.addEventListener("click", (event) => {
        backgroundOpacity.classList.add("not-visible")
        hidePicAddingModal()
        hideGaleryModal()
    })
    
    let closingIcon = document.querySelectorAll(".closing-icon")
    closingIcon.forEach(boutton => {
        boutton.addEventListener("click", () => {
            hidePicAddingModal()
            hideGaleryModal() 
        })
    })

    const arrowLeft = document.getElementById("arrow-left")
    arrowLeft.addEventListener("click", () => {
        hidePicAddingModal()
        showGaleryModal()
    })

    let addPic = document.getElementById("pic-adding")
    addPic.addEventListener("click", () => {
        hideGaleryModal()
        // vider les champs de saisies
        emptyPicAddingModalInputs()
        showPicAddingModal()
        picPreview()
        highlightAddWorkButton()
        putCategoriesIntoHtml()
    })
}

/*
 * Partie Modale Ajout de projet 
 */
if (document.getElementById("pic-adding-validation")) {
    const picAddingValidation = document.getElementById("pic-adding-validation")
    picAddingValidation.addEventListener("click", (event) => {
        event.preventDefault()
        if(checkHighlightConditions()) {
            addwork()
        } else {
            alert("Veuillez remplir l'ensemble des champs et ajouter une photo")
        }
        
    })
}

async function putCategoriesIntoHtml() {
    const categories = await getCategories()
    const selectCategory = document.getElementById("category")
    selectCategory.innerHTML = ""
    const valueEmpty = document.createElement("option")
    valueEmpty.setAttribute("selected", "selected")
    selectCategory.appendChild(valueEmpty)
    for (let i = 0; i < categories.length; i++) {
        const value = document.createElement("option")
        value.value = categories[i].id
        value.innerText = categories[i].name
        selectCategory.appendChild(value)
    }
}

function emptyPicAddingModalInputs() {
    document.getElementById("title").value = ""
    document.getElementById("category").value = ""
    const preview = document.getElementById("uploaded-pic")
    preview.classList.add("not-visible")
    const labelToHide = document.getElementById("label-to-hide")
    labelToHide.classList.remove("not-visible")
    // const oldFileInput = document.getElementById("file");
    // // Créer un nouvel élément input de type file
    // const newFileInput = document.createElement("input");
    // newFileInput.type = "file";
    // newFileInput.id = "file";
    // newFileInput.name = "file";
    // newFileInput.accept = ".jpg,.png"
    
    // // Remplacer l'ancien input par le nouvel input
    // oldFileInput.parentNode.replaceChild(newFileInput, oldFileInput);
}

async function addwork () {
    const title = document.getElementById("title").value
    const category = document.getElementById("category").value
    const picture = document.getElementById("file").files[0]
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
        await FillGalleryModal(await getWorks())
        await FillGallery(await getWorks())
    } else {
        console.log(response)
    }
    
    } catch {
        console.log(error)
    }
}
// TODO : arrêter pic préview après avoir cliquer sur le label sans rien sélectionner
function picPreview () {
    document.getElementById("file").addEventListener("change", function() {
        const file = this.files[0]
        if (file) {
            // methode js
            const reader = new FileReader()
            reader.onload = function(e) {
                const preview = document.getElementById("uploaded-pic")
                preview.src = e.target.result
                preview.style.height = "180px"
                preview.classList.remove("not-visible")
                const labelToHide = document.getElementById("label-to-hide")
                labelToHide.classList.add("not-visible")
            }
        reader.readAsDataURL(file);
        }
    })
}

function highlightAddWorkButton() {
    const picAddingValidation = document.getElementById("pic-adding-validation")
    document.getElementById("file").addEventListener("change", handleInputChange);
    document.getElementById("title").addEventListener("change", handleInputChange);
    document.getElementById("category").addEventListener("change", handleInputChange);

    function handleInputChange() {
        if (checkHighlightConditions()) {
            picAddingValidation.classList.add("btn-hover", "btn-green");
        } else {
            picAddingValidation.classList.remove("btn-hover", "btn-green");
        }
    }
}

function checkHighlightConditions() {
    const file = document.getElementById("file")
    const title = document.getElementById("title")
    const category = document.getElementById("category")
    const picAddingValidation = document.getElementById("pic-adding-validation")
    if (file.value !== "" & title.value !== "" & category.value !== "") {
        return true
    } else {
        return false
    }
}

async function deleteProject () {
    let trashDiv = document.querySelectorAll(".trash-container")
    trashDiv.forEach(boutton => {
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
                const travauxMAJ = await getWorks()
                console.log(travauxMAJ)
                await FillGalleryModal(await getWorks())
                await FillGallery(await getWorks())
            }
        } catch(error) {
                console.error(error);
        }
        
    })
    })
}

/*
 * Page de connexion
 */
if (document.getElementById("connexion")) {
    const connexion = document.getElementById("send-connexion-form-btn")
    connexion.addEventListener("click", (event) => {
        event.preventDefault()
        sendConnexionForm()
    })
}

function sendConnexionForm () {
    const email = document.getElementById("email").value
    const motDePasse = document.getElementById("password").value
    const data = {
        "email": email,
        "password": motDePasse
    }

    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
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

/*
* Fonctions support
*/
function hideGaleryModal() {
    const modalGalery = document.getElementById("modal-galery")
    modalGalery.classList.add("not-visible")
    const backgroundOpacity = document.getElementById("background-opacity")
    backgroundOpacity.classList.add("not-visible")
}

function hidePicAddingModal() {
    let PicAddingModal = document.getElementById("pic-adding-modal")
        PicAddingModal.classList.add("not-visible")
        const backgroundOpacity = document.getElementById("background-opacity")
        backgroundOpacity.classList.add("not-visible")
}

function showGaleryModal() {
    const modalGalery = document.getElementById("modal-galery")
    modalGalery.classList.remove("not-visible")
    const backgroundOpacity = document.getElementById("background-opacity")
    backgroundOpacity.classList.remove("not-visible")
}

function showPicAddingModal() {
    const PicAddingModal = document.getElementById("pic-adding-modal")
    PicAddingModal.classList.remove("not-visible")
    const backgroundOpacity = document.getElementById("background-opacity")
    backgroundOpacity.classList.remove("not-visible")
}

async function getWorks () {
    const reponse = await fetch("http://localhost:5678/api/works")
    const travaux = await reponse.json()
    return travaux
}

async function getCategories () {
        const reponse = await fetch("http://localhost:5678/api/categories")
        const categories = await reponse.json()
        // Stockage des informations dans le localStorage
        return categories
}