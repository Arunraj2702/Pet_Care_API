/*==================================================
        PAW HAVEN
        Pet Care Management System
        Main Application Script
        (localStorage-based CRUD — no backend)
==================================================*/

"use strict";

/*==================================================
                LOCAL STORAGE KEYS
==================================================*/

const STORAGE_KEYS = {
    pets: "pawhaven_pets",
    adoptions: "pawhaven_adoptions",
    contacts: "pawhaven_contacts"
};

/*==================================================
                APPLICATION STATE
==================================================*/

let pets = [];
let adoptions = [];
let contacts = [];

let deletePetIdPending = null;
let currentAdoptionDetailId = null;

/*==================================================
                DEFAULT PET IMAGE
==================================================*/

const DEFAULT_PET_IMAGE = "https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&h=500&fit=crop";

/*==================================================
                SAMPLE PET DATA
                (Loaded only once on first run)
==================================================*/

const samplePets = [
    {
        id: 1001,
        name: "Buddy",
        species: "Dog",
        breed: "Golden Retriever",
        age: 2,
        gender: "Male",
        color: "Golden",
        vaccinated: "Yes",
        health: "Healthy",
        adoptionStatus: "Available",
        owner: "Rahul Sharma",
        image: DEFAULT_PET_IMAGE
    },
    {
        id: 1002,
        name: "Luna",
        species: "Cat",
        breed: "Persian",
        age: 1,
        gender: "Female",
        color: "White",
        vaccinated: "Yes",
        health: "Healthy",
        adoptionStatus: "Available",
        owner: "Priya Menon",
        image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=500&h=500&fit=crop"
    },
    {
        id: 1003,
        name: "Snow",
        species: "Rabbit",
        breed: "Dutch Rabbit",
        age: 1,
        gender: "Female",
        color: "White",
        vaccinated: "Yes",
        health: "Healthy",
        adoptionStatus: "Available",
        owner: "Arun Kumar",
        image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=500&h=500&fit=crop"
    },
    {
        id: 1004,
        name: "Charlie",
        species: "Parrot",
        breed: "African Grey",
        age: 3,
        gender: "Male",
        color: "Grey",
        vaccinated: "Yes",
        health: "Healthy",
        adoptionStatus: "Available",
        owner: "Karthik Raj",
        image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=500&h=500&fit=crop"
    },
    {
        id: 1005,
        name: "Rio",
        species: "Bird",
        breed: "Cockatiel",
        age: 2,
        gender: "Male",
        color: "Yellow",
        vaccinated: "Yes",
        health: "Healthy",
        adoptionStatus: "Available",
        owner: "Divya Iyer",
        image: "https://images.unsplash.com/photo-1552308995-2baac1ad5490?w=500&h=500&fit=crop"
    },
    {
        id: 1006,
        name: "Coco",
        species: "Hamster",
        breed: "Syrian",
        age: 1,
        gender: "Female",
        color: "Brown",
        vaccinated: "No",
        health: "Healthy",
        adoptionStatus: "Available",
        owner: "Suresh Babu",
        image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=500&h=500&fit=crop"
    }
];

/*==================================================
            INITIALIZE LOCAL STORAGE
==================================================*/

function initializeStorage() {

    if (!localStorage.getItem(STORAGE_KEYS.pets)) {
        localStorage.setItem(STORAGE_KEYS.pets, JSON.stringify(samplePets));
    }

    if (!localStorage.getItem(STORAGE_KEYS.adoptions)) {
        localStorage.setItem(STORAGE_KEYS.adoptions, JSON.stringify([]));
    }

    if (!localStorage.getItem(STORAGE_KEYS.contacts)) {
        localStorage.setItem(STORAGE_KEYS.contacts, JSON.stringify([]));
    }

}

/*==================================================
                LOAD / SAVE DATA
==================================================*/

function loadData() {
    pets = JSON.parse(localStorage.getItem(STORAGE_KEYS.pets)) || [];
    adoptions = JSON.parse(localStorage.getItem(STORAGE_KEYS.adoptions)) || [];
    contacts = JSON.parse(localStorage.getItem(STORAGE_KEYS.contacts)) || [];
}

function savePets() {
    localStorage.setItem(STORAGE_KEYS.pets, JSON.stringify(pets));
}

function saveAdoptions() {
    localStorage.setItem(STORAGE_KEYS.adoptions, JSON.stringify(adoptions));
}

function saveContacts() {
    localStorage.setItem(STORAGE_KEYS.contacts, JSON.stringify(contacts));
}

/*==================================================
                UTILITIES
==================================================*/

function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

function getPetById(id) {
    return pets.find(pet => pet.id === id);
}

function el(id) {
    return document.getElementById(id);
}

function escapeHtml(str) {
    if (str === undefined || str === null) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

/*==================================================
                TOAST NOTIFICATIONS
==================================================*/

function showToast(message) {

    const toastMessage = el("toastMessage");
    const toastElement = el("liveToast");

    if (!toastMessage || !toastElement) return;

    toastMessage.textContent = message;

    const toast = bootstrap.Toast.getOrCreateInstance(toastElement);
    toast.show();

}

/*==================================================
                LOADER
==================================================*/

window.addEventListener("load", () => {
    const loader = el("loader");
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = "0";
            setTimeout(() => (loader.style.display = "none"), 300);
        }, 500);
    }
});

/*==================================================
                PAGE DETECTION
==================================================*/

function getCurrentPage() {
    let page = window.location.pathname.split("/").pop();
    if (!page) page = "index.html";
    return page;
}

/*==================================================
            APPLICATION STARTUP / ROUTER
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeStorage();
    loadData();

    const currentPage = getCurrentPage();

    switch (currentPage) {
        case "index.html":
        case "":
            safeInit(initHomePage);
            break;

        case "pets.html":
            safeInit(initPetsPage);
            break;

        case "adoptions.html":
            safeInit(initAdoptionsPage);
            break;

        case "contact.html":
            safeInit(initContactPage);
            break;

        default:
            console.warn("Unknown page:", currentPage);
    }

});

function safeInit(pageFunction) {
    try {
        pageFunction();
    } catch (err) {
        console.error("Init Error:", err);
    }
}

/*==================================================================
    ============================================
                    HOME PAGE (index.html)
    ============================================
==================================================================*/

function initHomePage() {
    animateStat("totalPets", pets.length);
    animateStat("availablePets", pets.filter(p => p.adoptionStatus === "Available").length);
    animateStat("adoptedPets", adoptions.length);
    animateStat("users", getRegisteredUsersCount());
}

function getRegisteredUsersCount() {
    const owners = new Set();
    pets.forEach(p => { if (p.owner) owners.add(p.owner.trim().toLowerCase()); });
    adoptions.forEach(a => { if (a.adopterName) owners.add(a.adopterName.trim().toLowerCase()); });
    return owners.size;
}

function animateStat(id, targetValue) {

    const node = el(id);
    if (!node) return;

    const target = Number(targetValue) || 0;

    if (target === 0) {
        node.textContent = "0";
        return;
    }

    let current = 0;
    const duration = 900;
    const stepTime = Math.max(Math.floor(duration / target), 20);
    const increment = Math.max(1, Math.ceil(target / (duration / stepTime)));

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            node.textContent = target;
            clearInterval(timer);
        } else {
            node.textContent = current;
        }
    }, stepTime);

}

/*==================================================================
    ============================================
                    PETS PAGE (pets.html)
    ============================================
==================================================================*/

function initPetsPage() {

    renderPets();

    const form = el("petForm");
    if (form) form.addEventListener("submit", handlePetSubmit);

    const searchInput = el("searchInput");
    if (searchInput) searchInput.addEventListener("input", applyPetFilters);

    const speciesFilter = el("speciesFilter");
    if (speciesFilter) speciesFilter.addEventListener("change", applyPetFilters);

    const statusFilter = el("statusFilter");
    if (statusFilter) statusFilter.addEventListener("change", applyPetFilters);

    const petImageInput = el("petImage");
    if (petImageInput) petImageInput.addEventListener("change", handleImagePreview);

    const petModal = el("petModal");
    if (petModal) {
        petModal.addEventListener("hidden.bs.modal", resetPetForm);
    }

    // IMPORTANT: In the markup, the "Save Pet" button lives in the
    // modal-footer, OUTSIDE the <form id="petForm">. A button outside
    // its form does not trigger the form's submit event on its own,
    // so we manually request submission (this still runs native
    // required-field validation exactly like a normal submit would).
    const saveBtn = el("saveBtn");
    if (saveBtn) {
        saveBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const form = el("petForm");
            if (!form) return;

            if (typeof form.requestSubmit === "function") {
                form.requestSubmit();
            } else {
                // Fallback for older browsers without requestSubmit()
                if (form.checkValidity()) {
                    handlePetSubmit({ preventDefault() {}, target: form });
                } else {
                    form.reportValidity();
                }
            }
        });
    }

    const confirmDeleteBtn = el("confirmDeleteBtn");
    if (confirmDeleteBtn) confirmDeleteBtn.addEventListener("click", confirmDeletePet);

    const confirmAdoptionBtn = el("confirmAdoptionBtn");
    if (confirmAdoptionBtn) confirmAdoptionBtn.addEventListener("click", confirmAdoption);

}

/*==================================================
                RENDER PETS
==================================================*/

function renderPets(list) {

    const container = el("petContainer");
    if (!container) return;

    const data = list || pets;

    if (data.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <h3>No Pets Found 🐾</h3>
                    <p class="text-muted">Try adjusting your search or filters, or add a new pet.</p>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = data.map(createPetCard).join("");

}

/*==================================================
                CREATE PET CARD
==================================================*/

function createPetCard(pet) {

    const statusClass = pet.adoptionStatus === "Adopted"
        ? "badge-adopted"
        : (pet.adoptionStatus === "Reserved" ? "badge-vaccinated" : "badge-available");

    const vaccinatedBadge = pet.vaccinated === "Yes" ? "badge-vaccinated" : "badge-adopted";

    const adoptDisabled = pet.adoptionStatus === "Adopted" ? "disabled" : "";

    return `
    <div class="col-lg-4 col-md-6 mb-4">
        <div class="pet-card">
            <img src="${escapeHtml(pet.image) || DEFAULT_PET_IMAGE}"
                 class="pet-image"
                 alt="${escapeHtml(pet.name)}"
                 onerror="this.src='${DEFAULT_PET_IMAGE}'">

            <div class="pet-body">
                <div class="d-flex justify-content-between align-items-start">
                    <h4>${escapeHtml(pet.name)}</h4>
                    <span class="${statusClass}">${escapeHtml(pet.adoptionStatus || "Available")}</span>
                </div>

                <p><b>Species:</b> ${escapeHtml(pet.species)}</p>
                <p><b>Breed:</b> ${escapeHtml(pet.breed)}</p>
                <p><b>Age:</b> ${escapeHtml(pet.age)} yr(s) &nbsp; <b>Gender:</b> ${escapeHtml(pet.gender)}</p>
                <p><b>Owner:</b> ${escapeHtml(pet.owner)}</p>

                <span class="${vaccinatedBadge}">
                    ${pet.vaccinated === "Yes" ? "💉 Vaccinated" : "⚠️ Not Vaccinated"}
                </span>

                <div class="pet-actions">
                    <button class="btn btn-view" onclick="viewPet(${pet.id})">
                        <i class="bi bi-eye"></i> View
                    </button>
                    <button class="btn btn-edit" onclick="editPet(${pet.id})">
                        <i class="bi bi-pencil"></i> Edit
                    </button>
                    <button class="btn btn-delete" onclick="requestDeletePet(${pet.id})">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                    <button class="btn btn-adopt" ${adoptDisabled} onclick="openAdoptionModal(${pet.id})">
                        <i class="bi bi-heart-fill"></i> Adopt
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;

}

/*==================================================
                SEARCH + FILTER
==================================================*/

function applyPetFilters() {

    const searchValue = (el("searchInput")?.value || "").toLowerCase().trim();
    const speciesValue = (el("speciesFilter")?.value || "All").trim();
    const statusValue = (el("statusFilter")?.value || "All").trim();

    let filtered = [...pets];

    if (searchValue) {
        filtered = filtered.filter(pet =>
            (pet.name || "").toLowerCase().includes(searchValue) ||
            (pet.breed || "").toLowerCase().includes(searchValue) ||
            (pet.species || "").toLowerCase().includes(searchValue)
        );
    }

    if (speciesValue && speciesValue.toLowerCase() !== "all") {
        filtered = filtered.filter(pet => (pet.species || "").toLowerCase() === speciesValue.toLowerCase());
    }

    if (statusValue && statusValue.toLowerCase() !== "all") {
        filtered = filtered.filter(pet => (pet.adoptionStatus || "").toLowerCase() === statusValue.toLowerCase());
    }

    renderPets(filtered);

}

/*==================================================
                IMAGE PREVIEW (ADD/EDIT)
==================================================*/

function handleImagePreview(e) {

    const file = e.target.files[0];
    const preview = el("imagePreview");

    if (!file || !preview) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
        preview.src = evt.target.result;
        preview.dataset.base64 = evt.target.result;
    };
    reader.readAsDataURL(file);

}

/*==================================================
                ADD / EDIT PET (SUBMIT)
==================================================*/

function handlePetSubmit(e) {

    e.preventDefault();

    const idValue = el("petId").value;
    const preview = el("imagePreview");
    const imageData = (preview && preview.dataset.base64) ? preview.dataset.base64 : (preview ? preview.src : DEFAULT_PET_IMAGE);

    const petData = {
        id: idValue ? Number(idValue) : generateId(),
        name: el("petName").value.trim(),
        species: el("species").value,
        breed: el("breed").value.trim(),
        age: el("age").value,
        gender: el("gender").value,
        color: el("color").value.trim(),
        vaccinated: el("vaccinated").value,
        health: el("healthStatus").value,
        adoptionStatus: el("adoptionStatus").value,
        owner: el("ownerName").value.trim(),
        image: imageData || DEFAULT_PET_IMAGE
    };

    if (idValue) {

        const index = pets.findIndex(p => p.id === Number(idValue));

        if (index !== -1) {
            pets[index] = petData;
            showToast(`${petData.name} updated successfully ✏️`);
        }

    } else {

        pets.push(petData);
        showToast(`${petData.name} added successfully 🐾`);

    }

    savePets();
    applyPetFilters();

    const modalEl = el("petModal");
    if (modalEl) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.hide();
    }

}

/*==================================================
                RESET FORM (ON MODAL CLOSE)
==================================================*/

function resetPetForm() {

    const form = el("petForm");
    if (form) form.reset();

    el("petId").value = "";

    const preview = el("imagePreview");
    if (preview) {
        preview.src = DEFAULT_PET_IMAGE;
        delete preview.dataset.base64;
    }

    const title = el("modalTitle");
    if (title) title.textContent = "🐾 Register New Pet";

}

/*==================================================
                EDIT PET
==================================================*/

function editPet(id) {

    const pet = getPetById(id);
    if (!pet) return;

    el("petId").value = pet.id;
    el("petName").value = pet.name || "";
    el("species").value = pet.species || "Dog";
    el("breed").value = pet.breed || "";
    el("age").value = pet.age || "";
    el("gender").value = pet.gender || "Male";
    el("color").value = pet.color || "";
    el("vaccinated").value = pet.vaccinated || "Yes";
    el("healthStatus").value = pet.health || "Healthy";
    el("adoptionStatus").value = pet.adoptionStatus || "Available";
    el("ownerName").value = pet.owner || "";

    const preview = el("imagePreview");
    if (preview) {
        preview.src = pet.image || DEFAULT_PET_IMAGE;
        preview.dataset.base64 = pet.image || "";
    }

    const title = el("modalTitle");
    if (title) title.textContent = "✏️ Edit Pet Details";

    const modalEl = el("petModal");
    if (modalEl) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
    }

}

/*==================================================
                VIEW PET DETAILS
==================================================*/

function viewPet(id) {

    const pet = getPetById(id);
    if (!pet) return;

    el("viewPetImage").src = pet.image || DEFAULT_PET_IMAGE;
    el("viewPetName").textContent = pet.name || "";
    el("viewSpecies").textContent = pet.species || "";
    el("viewBreed").textContent = pet.breed || "";
    el("viewAge").textContent = (pet.age || "") + " yr(s)";
    el("viewGender").textContent = pet.gender || "";
    el("viewColor").textContent = pet.color || "";
    el("viewVaccination").textContent = pet.vaccinated || "";
    el("viewHealth").textContent = pet.health || "";
    el("viewOwner").textContent = pet.owner || "";
    el("viewStatus").textContent = pet.adoptionStatus || "";

    const modalEl = el("viewPetModal");
    if (modalEl) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
    }

}

/*==================================================
                DELETE PET (with confirm modal)
==================================================*/

function requestDeletePet(id) {

    deletePetIdPending = id;

    const modalEl = el("deleteModal");
    if (modalEl) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
    }

}

function confirmDeletePet() {

    if (deletePetIdPending === null) return;

    const pet = getPetById(deletePetIdPending);

    pets = pets.filter(p => p.id !== deletePetIdPending);
    savePets();
    applyPetFilters();

    const modalEl = el("deleteModal");
    if (modalEl) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.hide();
    }

    showToast(pet ? `${pet.name} was removed 🗑️` : "Pet removed 🗑️");

    deletePetIdPending = null;

}

/*==================================================
                ADOPTION FLOW
==================================================*/

function openAdoptionModal(id) {

    const pet = getPetById(id);
    if (!pet) return;

    if (pet.adoptionStatus === "Adopted") {
        showToast("This pet has already been adopted ❤️");
        return;
    }

    el("adoptPetId").value = id;

    const fields = [
        "adopterName", "adopterPhone", "adopterEmail",
        "occupation", "adopterAddress", "adoptionReason"
    ];
    fields.forEach(fieldId => {
        const field = el(fieldId);
        if (field) field.value = "";
    });

    const modalEl = el("adoptionModal");
    if (modalEl) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
    }

}

function confirmAdoption() {

    const id = Number(el("adoptPetId").value);
    const pet = getPetById(id);

    if (!pet) return;

    const adopterName = el("adopterName").value.trim();
    const adopterPhone = el("adopterPhone").value.trim();
    const adopterEmail = el("adopterEmail").value.trim();
    const occupation = el("occupation").value.trim();
    const adopterAddress = el("adopterAddress").value.trim();
    const adoptionReason = el("adoptionReason").value.trim();

    if (!adopterName || !adopterPhone || !adopterEmail) {
        showToast("Please fill in your name, phone and email ⚠️");
        return;
    }

    pet.adoptionStatus = "Adopted";

    adoptions.push({
        id: pet.id,
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
        gender: pet.gender,
        image: pet.image,
        owner: pet.owner,
        adoptedDate: new Date().toLocaleDateString(),
        adopterName,
        adopterPhone,
        adopterEmail,
        occupation,
        adopterAddress,
        adoptionReason
    });

    pets = pets.filter(p => p.id !== id);

    savePets();
    saveAdoptions();
    applyPetFilters();

    const modalEl = el("adoptionModal");
    if (modalEl) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.hide();
    }

    showToast(`${pet.name} has been adopted! Congratulations ❤️`);

}

/*==================================================================
    ============================================
                ADOPTIONS PAGE (adoptions.html)
    ============================================
==================================================================*/

function initAdoptionsPage() {

    renderAdoptions();
    updateAdoptionStats();

    const searchInput = el("adoptionSearch");
    if (searchInput) searchInput.addEventListener("input", applyAdoptionFilters);

    const speciesFilter = el("speciesFilter");
    if (speciesFilter) speciesFilter.addEventListener("change", applyAdoptionFilters);

    const yearFilter = el("yearFilter");
    if (yearFilter) yearFilter.addEventListener("change", applyAdoptionFilters);

}

/*==================================================
                ADOPTION STATS
==================================================*/

function updateAdoptionStats() {

    const totalAdoptions = el("totalAdoptions");
    if (totalAdoptions) totalAdoptions.textContent = adoptions.length;

    const happyFamilies = el("happyFamilies");
    if (happyFamilies) {
        const families = new Set(adoptions.map(a => (a.adopterName || "").toLowerCase()));
        happyFamilies.textContent = families.size;
    }

    const healthyPets = el("healthyPets");
    if (healthyPets) healthyPets.textContent = "100%";

}

/*==================================================
                RENDER ADOPTIONS
==================================================*/

function renderAdoptions(list) {

    const container = el("adoptionContainer");
    const emptySection = el("noAdoptionsSection");

    if (!container) return;

    const data = list || adoptions;

    if (adoptions.length === 0) {
        container.innerHTML = "";
        if (emptySection) emptySection.classList.remove("d-none");
        renderAdoptionTimeline();
        return;
    }

    if (emptySection) emptySection.classList.add("d-none");

    if (data.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <h3>No Matching Records 🔍</h3>
                    <p class="text-muted">Try a different search or filter.</p>
                </div>
            </div>
        `;
        renderAdoptionTimeline();
        return;
    }

    container.innerHTML = data.map(createAdoptionCard).join("");

    renderAdoptionTimeline();

}

/*==================================================
                ADOPTION CARD UI
==================================================*/

function createAdoptionCard(pet) {

    return `
    <div class="col-lg-4 col-md-6 mb-4">
        <div class="adoption-card">
            <img src="${escapeHtml(pet.image) || DEFAULT_PET_IMAGE}"
                 alt="${escapeHtml(pet.name)}"
                 onerror="this.src='${DEFAULT_PET_IMAGE}'">

            <div class="adoption-body">
                <h4>${escapeHtml(pet.name)}</h4>

                <ul class="info-list">
                    <li><b>Species:</b> ${escapeHtml(pet.species)}</li>
                    <li><b>Breed:</b> ${escapeHtml(pet.breed)}</li>
                    <li><b>Adopted On:</b> ${escapeHtml(pet.adoptedDate)}</li>
                    <li><b>Previous Owner:</b> ${escapeHtml(pet.owner)}</li>
                    <li><b>New Family:</b> ${escapeHtml(pet.adopterName)}</li>
                </ul>

                <div class="pet-actions">
                    <button class="btn btn-view" onclick="viewAdoptionDetails(${pet.id})">
                        <i class="bi bi-eye"></i> View Details
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;

}

/*==================================================
                ADOPTION SEARCH + FILTER
==================================================*/

function applyAdoptionFilters() {

    const searchValue = (el("adoptionSearch")?.value || "").toLowerCase().trim();
    const speciesValue = (el("speciesFilter")?.value || "All Species").trim();
    const yearValue = (el("yearFilter")?.value || "All Years").trim();

    let filtered = [...adoptions];

    if (searchValue) {
        filtered = filtered.filter(a =>
            (a.name || "").toLowerCase().includes(searchValue) ||
            (a.adopterName || "").toLowerCase().includes(searchValue) ||
            (a.species || "").toLowerCase().includes(searchValue) ||
            (a.breed || "").toLowerCase().includes(searchValue)
        );
    }

    if (speciesValue && speciesValue.toLowerCase() !== "all species") {
        filtered = filtered.filter(a => (a.species || "").toLowerCase() === speciesValue.toLowerCase());
    }

    if (yearValue && yearValue.toLowerCase() !== "all years") {
        filtered = filtered.filter(a => (a.adoptedDate || "").includes(yearValue));
    }

    // Always re-render, even with an empty result set, so "no matches"
    // feedback is shown instead of the search/filter silently doing nothing.
    renderAdoptions(filtered);

}

/*==================================================
                ADOPTION TIMELINE
==================================================*/

function renderAdoptionTimeline() {

    const container = el("adoptionTimeline");
    if (!container) return;

    if (adoptions.length === 0) {
        container.innerHTML = `<p class="empty-state text-muted">No adoption history yet.</p>`;
        return;
    }

    const recent = [...adoptions].slice(-6).reverse();

    container.innerHTML = recent.map(pet => `
        <div class="d-flex align-items-center mb-4 gap-3">
            <img src="${escapeHtml(pet.image) || DEFAULT_PET_IMAGE}"
                 alt="${escapeHtml(pet.name)}"
                 style="width:60px;height:60px;border-radius:50%;object-fit:cover;"
                 onerror="this.src='${DEFAULT_PET_IMAGE}'">
            <div>
                <h6 class="mb-1 fw-bold">${escapeHtml(pet.name)} found a forever home 🏡</h6>
                <small class="text-muted">${escapeHtml(pet.species)} • ${escapeHtml(pet.breed)} • Adopted on ${escapeHtml(pet.adoptedDate)}</small>
            </div>
        </div>
    `).join("");

}

/*==================================================
                VIEW ADOPTION DETAILS
==================================================*/

function viewAdoptionDetails(id) {

    const pet = adoptions.find(p => p.id === id);
    if (!pet) return;

    currentAdoptionDetailId = id;

    el("detailPetImage").src = pet.image || DEFAULT_PET_IMAGE;
    el("detailPetName").textContent = pet.name || "";
    el("detailSpecies").textContent = pet.species || "";
    el("detailBreed").textContent = pet.breed || "";
    el("detailAge").textContent = (pet.age || "") + " yr(s)";
    el("detailOwner").textContent = pet.owner || "";
    el("detailDate").textContent = pet.adoptedDate || "";
    el("detailAdopter").textContent = pet.adopterName || "";
    el("detailPhone").textContent = pet.adopterPhone || "";
    el("detailEmail").textContent = pet.adopterEmail || "";
    el("detailAddress").textContent = pet.adopterAddress || "Not provided";

    const modalEl = el("adoptionDetailsModal");
    if (modalEl) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
    }

    prepareCertificate(pet);

}

/*==================================================
                CERTIFICATE OF ADOPTION
==================================================*/

function prepareCertificate(pet) {

    el("certificateAdopter").textContent = pet.adopterName || "";
    el("certificatePet").textContent = pet.name || "";
    el("certificateSpecies").textContent = pet.species || "";
    el("certificateBreed").textContent = pet.breed || "";
    el("certificateDate").textContent = pet.adoptedDate || "";

}

/*==================================================================
    ============================================
                CONTACT PAGE (contact.html)
    ============================================
==================================================================*/

function initContactPage() {

    const form = el("contactMessageForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const nameField = el("contactName");
        const emailField = el("contactEmail");
        const messageField = el("contactMessage");

        if (!nameField.value.trim() || !emailField.value.trim() || !messageField.value.trim()) {
            showToast("Please fill in all required fields ⚠️");
            return;
        }

        const message = {
            id: generateId(),
            name: nameField.value.trim(),
            email: emailField.value.trim(),
            phone: (el("contactPhone")?.value || "").trim(),
            subject: (el("contactSubject")?.value || "General Enquiry"),
            message: messageField.value.trim(),
            date: new Date().toLocaleString()
        };

        contacts.push(message);
        saveContacts();

        form.reset();

        showToast("Message sent successfully 📩 We'll get back to you soon!");

    });

}