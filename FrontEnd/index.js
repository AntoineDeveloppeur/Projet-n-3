/* global document */

/****** Page index *****/

/**
 * Envoie une requête à l'API pour récupérer les travaux
 * @returns {Array} les catégories
 */
async function getCategories() {
  const reponse = await fetch("http://localhost:5678/api/categories");
  const categories = await reponse.json();
  return categories;
}

/**
 * Envoie une requête à l'API pour récupérer les travaux
 * @returns {Array} les travaux
 */
async function getWorks() {
  const reponse = await fetch("http://localhost:5678/api/works");
  const work = await reponse.json();
  return work;
}

/**
 * Rempli la gallerie est fonction du choix du filtre sélectionné
 *
 * @param {Array} work désigne les projets filtrés ou pas
 */
function FillGallery(work) {
  let galery = document.querySelector(".galery");
  galery.innerHTML = "";

  for (let i = 0; i < work.length; i++) {
    let figure = document.createElement("figure");
    galery.appendChild(figure);

    let img = document.createElement("img");
    img.src = work[i].imageUrl;
    img.alt = work[i].title;
    figure.appendChild(img);

    let figcaption = document.createElement("figcaption");
    figcaption.innerHTML = work[i].title;
    figure.appendChild(figcaption);
  }
}

/**
 * Active le fonctionnement des filtres et les colores
 *
 * @param {HTMLButtonElement} event le boutton filtre cliqué par l'utilisateur
 */
async function filterWorks(event) {
  const work = await getWorks();
  const filterButtons = document.querySelectorAll(".filters");
  filterButtons.forEach((boutton) => {
    boutton.classList.remove("filters-active");
  });
  if (event.target.id == "tous-filter") {
    FillGallery(work);
    const tousFilter = document.getElementById("tous-filter");
    tousFilter.classList.add("filters-active");
  } else {
    event.target.classList.add("filters-active");
    let worksFilters = work.filter(
      (works) => works.categoryId == event.target.id
    );
    FillGallery(worksFilters);
  }
}

/**
 * Insert les filtres pour la gallerie à partir de l'API
 *
 * @param {number} categories identifiant de la categorie
 */
async function putFiltersIntoHTML(categories) {
  let divFilters = document.createElement("div");
  divFilters.id = "divFilters";
  const portfolio = document.querySelector("#portfolio");
  const galery = document.querySelector(".galery");
  portfolio.insertBefore(divFilters, galery);

  const tous = document.createElement("button");
  tous.id = "tous-filter";
  tous.innerText = "Tous";
  tous.classList.add("filters", "filters-active");
  divFilters.appendChild(tous);

  for (let i = 0; i < categories.length; i++) {
    let boutton = document.createElement("button");
    boutton.innerText = categories[i].name;
    boutton.id = `${categories[i].id}`;
    boutton.classList.add("filters");
    divFilters.appendChild(boutton);
  }

  let filterButtons = document.querySelectorAll(".filters");
  filterButtons.forEach((boutton) => {
    boutton.addEventListener("click", (event) => {
      filterWorks(event);
    });
  });
}

/**
 * Déconnecte l'utilisateur en retirant le token
 */
function logOut() {
  const login = document.getElementById("login");
  login.addEventListener("click", () => {
    window.localStorage.removeItem("token");
    login.innerText = "login";
  });
}

/**
 * S'il y a un token dans le local storage, la fonction affiche le
 * bandeau en haut de la page et le boutton modifier la gallery
 **/
async function loadAdminMode() {
  const headband = document.getElementById("headband");
  headband.classList.remove("not-visible");

  const login = document.getElementById("login");
  login.innerText = "logout";
  login.href = "index.html";
  logOut();

  const modifierGalerie = document.getElementById("modify-gallery");
  modifierGalerie.classList.remove("not-visible");
  modifierGalerie.addEventListener("click", async () => {
    await FillGalleryModal(await getWorks());
    showGaleryModal();
    ActivateModalsButtons();
  });
}

/**
 * Lance les fonctions nécessaire à la page Index si l'utilisateur est sur la page index
 */
async function loadIndex() {
  if (document.getElementById("portfolio")) {
    const categories = await getCategories();
    putFiltersIntoHTML(categories);
    const work = await getWorks();
    FillGallery(work);
    if (window.localStorage.getItem("token") !== null) {
      loadAdminMode();
    }
  }
}

if (document.getElementById("introduction")) {
  loadIndex();
}

/****** Partie Modales ******/

/**
 * Remplie la modale gallerie avec les projets extraits avec l'API
 *
 * @param {Array} allWork les projets de la base de donnés
 */
function FillGalleryModal(allWork) {
  let modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = "";

  for (let i = 0; i < allWork.length; i++) {
    let picDiv = document.createElement("div");
    picDiv.classList.add("picture-container");
    modalContent.appendChild(picDiv);

    let projectPicture = document.createElement("img");
    projectPicture.classList.add("project-picture");
    projectPicture.src = allWork[i].imageUrl;
    projectPicture.alt = allWork[i].title;
    picDiv.appendChild(projectPicture);

    let trashDiv = document.createElement("div");
    trashDiv.classList.add("trash-container");
    trashDiv.id = allWork[i].id;
    picDiv.appendChild(trashDiv);

    let trashIcon = document.createElement("img");
    trashIcon.classList.add = "trash-icon";
    trashIcon.src = "assets/icons/poubelle.svg";
    trashIcon.id = allWork[i].id;
    trashDiv.appendChild(trashIcon);
  }
  deleteProject()
}

/**
 * Les 4 prochaines fonctions affichent et cachent les Modales
 */
function hideGaleryModal() {
  const modalGalery = document.getElementById("modal-galery");
  modalGalery.classList.add("not-visible");
  const backgroundOpacity = document.getElementById("background-opacity");
  backgroundOpacity.classList.add("not-visible");
}

function hidePicAddingModal() {
  let PicAddingModal = document.getElementById("pic-adding-modal");
  PicAddingModal.classList.add("not-visible");
  const backgroundOpacity = document.getElementById("background-opacity");
  backgroundOpacity.classList.add("not-visible");
}

function showGaleryModal() {
  const modalGalery = document.getElementById("modal-galery");
  modalGalery.classList.remove("not-visible");
  const backgroundOpacity = document.getElementById("background-opacity");
  backgroundOpacity.classList.remove("not-visible");
}

function showPicAddingModal() {
  const PicAddingModal = document.getElementById("pic-adding-modal");
  PicAddingModal.classList.remove("not-visible");
  const backgroundOpacity = document.getElementById("background-opacity");
  backgroundOpacity.classList.remove("not-visible");
}

/**
 * Va chercher les catégories via l'API pour les mettre dans la balise select du formulaire d'ajout de photo
 */
async function putCategoriesIntoSelectForm() {
  const categories = await getCategories();
  const selectCategory = document.getElementById("category");
  selectCategory.innerHTML = "";
  const valueEmpty = document.createElement("option");
  valueEmpty.setAttribute("selected", "selected");
  valueEmpty.value = "";
  valueEmpty.innerText = "Sélectionnez une catégorie";
  selectCategory.appendChild(valueEmpty);
  for (let i = 0; i < categories.length; i++) {
    const value = document.createElement("option");
    value.value = categories[i].id;
    value.innerText = categories[i].name;
    selectCategory.appendChild(value);
  }
}

function showPreview() {
  const preview = document.getElementById("uploaded-pic");
  preview.classList.remove("not-visible");
  const labelToHide = document.getElementById("label-to-hide");
  labelToHide.classList.add("not-visible");
}

function hidePreview() {
  const preview = document.getElementById("uploaded-pic");
  preview.classList.add("not-visible");
  const labelToHide = document.getElementById("label-to-hide");
  labelToHide.classList.remove("not-visible");
}

/**
 * Réinitialise le formulaire d'ajout de photo
 * La preview de la photo ne pas pas être remise à 0 car en lecture seule.
 * Par soucis de simplicité, il a été choisi de caché la preview
 */
function emptyPicAddingModalInputs() {
  document.getElementById("title").value = "";
  document.getElementById("category").value = "";
  hidePreview();
}

/**
 * Envoie le formulaire d'ajout de photo à l'API
 */
async function addwork() {
  // Vérifier la taille du fichier
  const picture = document.getElementById("file").files[0];
  const maxFileSizeInBytes = 4 * 1024 * 1024; // 4 MB 
  if (picture.size > maxFileSizeInBytes) {
    alert("La taille de l'image dépasse la limite autorisée de 4 MB. Veuillez choisir une autre image");
    return; // arrêt de la fonction
  }
  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const formdata = new FormData();
  formdata.append("image", picture);
  formdata.append("title", title);
  formdata.append("category", category);
  const token = window.localStorage.getItem("token");
  const response = await fetch("http://localhost:5678/api/works/", {
    method: "POST",
    headers: {
      authorization: "Bearer " + token,
    },
    body: formdata,
  });

  try {
    if (response.ok) {
      alert("Nouveau travail enregistré");
      await FillGalleryModal(await getWorks());
      await FillGallery(await getWorks());
    } else {
      alert("travail non enregistré - Contactez l'administrateur");
    }
  } catch {
    alert("Erreur lors de la requête d'ajout de travail");
  }
}

/**
 * Affiche l'image choisi par l'utilisateur dans la division label
 */
function picPreview() {
  document.getElementById("file").addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      // constructeur js
      const reader = new FileReader();
      reader.onload = function (e) {
        const preview = document.getElementById("uploaded-pic");
        preview.src = e.target.result;
        preview.style.height = "180px";
      };
      reader.readAsDataURL(file);
      showPreview();
    } else {
      hidePreview();
    }
  });
}

/**
 * Vérifie si le formulaire de la modale Ajout de photo est bien rempli
 * @returns {boolean} true si le formulaire est bien rempli, false sinon
 */
function checkHighlightConditions() {
  const file = document.getElementById("file");
  const title = document.getElementById("title");
  const category = document.getElementById("category");
  if (file.value !== "" && title.value !== "" && category.value !== "") {
    return true;
  } else {
    return false;
  }
}

/**
 * Mets en évidence le boutton validation de la modale d'ajout de photo lorsuqe toutes les conditions sont remplies
 */
function handleInputChange() {
  const picAddingValidation = document.getElementById("pic-adding-validation");
  if (checkHighlightConditions()) {
    picAddingValidation.classList.add("btn-hover", "btn-green");
  } else {
    picAddingValidation.classList.remove("btn-hover", "btn-green");
  }
}

/**
 * Rends cliquable le bouton validation de la modale Ajout de photo
 */
function highlightAddWorkButton() {
  document.getElementById("file").addEventListener("change", handleInputChange);
  document
    .getElementById("title")
    .addEventListener("change", handleInputChange);
  document
    .getElementById("category")
    .addEventListener("change", handleInputChange);
}

/**
 * Efface de la base de donnée le projet cliqué dans la modale Galerie photo
 */
async function deleteProject() {
  let trashDiv = document.querySelectorAll(".trash-container");
  trashDiv.forEach((boutton) => {
    boutton.addEventListener("click", async (event) => {
      const confirmation = confirm(
        "Souhaitez-vous réellement supprimer ce projet ?"
      );
      if (confirmation) {
        const localHostAdress =
          "http://localhost:5678/api/works/" + event.target.id;
        const token = window.localStorage.getItem("token");
        // supprimer un élément de la base de données
        try {
          const response = await fetch(localHostAdress, {
            method: "delete",
            headers: {
              authorization: "Bearer " + token,
            },
            body: "",
          });
          if (!response.ok) {
            throw new Error("Erreur lors de la requête DELETE.");
          } else {
            await FillGalleryModal(await getWorks());
            await FillGallery(await getWorks());
          }
        } catch (error) {
          alert("Erreur lors de la requête de suppression d'un projet");
        }
      }
    });
  });
}

/**
 * Rends les bouttons des modales cliquables
 */
function ActivateModalsButtons() {
  let backgroundOpacity = document.getElementById("background-opacity");
  backgroundOpacity.addEventListener("click", () => {
    backgroundOpacity.classList.add("not-visible");
    hidePicAddingModal();
    hideGaleryModal();
  });

  let closingIcon = document.querySelectorAll(".closing-icon");
  closingIcon.forEach((boutton) => {
    boutton.addEventListener("click", () => {
      hidePicAddingModal();
      hideGaleryModal();
    });
  });

  const arrowLeft = document.getElementById("arrow-left");
  arrowLeft.addEventListener("click", () => {
    hidePicAddingModal();
    showGaleryModal();
  });

  const addPic = document.getElementById("pic-adding");
  addPic.addEventListener("click", () => {
    hideGaleryModal();
    emptyPicAddingModalInputs();
    showPicAddingModal();
    picPreview();
    highlightAddWorkButton();
    putCategoriesIntoSelectForm();
  });

  const picAddingValidation = document.getElementById("pic-adding-validation");
  picAddingValidation.addEventListener("click", (event) => {
    event.preventDefault();
    if (checkHighlightConditions()) {
      addwork();
    } else {
      alert("Veuillez remplir l'ensemble des champs et ajouter une photo");
    }
  });
}