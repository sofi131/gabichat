// Modal de lista de usuarios
var userListModal = document.getElementById("userListModal");
var userListBtn = document.querySelector(".circular-button");

// Cuando el usuario haga clic en el botón, muestra la modal
userListBtn.onclick = function() {
    userListModal.style.display = "block";
}

// Cuando el usuario haga clic en el botón de cierre (x), cierra la modal
var userListCloseBtn = document.querySelector("#userListModal .close");
userListCloseBtn.onclick = function() {
    userListModal.style.display = "none";
}

// Cuando el usuario haga clic fuera de la modal, también ciérrala
window.onclick = function(event) {
    if (event.target == userListModal) {
        userListModal.style.display = "none";
    }
}

// Obtener la lista de usuarios
var userList = document.querySelectorAll("#userListModal ul li");

// Agregar evento de clic a cada usuario en la lista
userList.forEach(function(user) {
    user.addEventListener("click", function() {
        // Remover la flecha de cualquier otro usuario seleccionado previamente
        var previouslyClicked = document.querySelector("#userListModal ul li.clicked");
        if (previouslyClicked) {
            previouslyClicked.classList.remove("clicked");
        }
        // Agregar la flecha al usuario seleccionado
        user.classList.add("clicked");
        
        // Cerrar la modal
        userListModal.style.display = "none";
        
        // Mostrar el alert después de cerrar la modal
        setTimeout(function() {
            alert("Usuario seleccionado: " + user.textContent);
        }, 300);
        
        // Aquí puedes agregar cualquier otra lógica que desees ejecutar después de seleccionar un usuario
        // Por ejemplo, abrir un chat con ese usuario, etc.
    });
});

// Modal del perfil de usuario
document.addEventListener("DOMContentLoaded", function() {
    // Obtener la modal y el botón que abre la modal
    var profileModal = document.getElementById("profileModal");
    var profileBtn = document.getElementById("openProfileModal");
    var profileCloseBtn = document.querySelector("#profileModal .close");
    var changeProfilePicBtn = document.getElementById("changeProfilePicBtn");
    var profilePicInput = document.getElementById("profilePicInput");
    var profileImage = document.getElementById("profileImage");
    var saveProfileBtn = document.getElementById("saveProfileBtn");

    // Cuando el usuario haga clic en el botón, muestra la modal
    profileBtn.onclick = function() {
        profileModal.style.display = "block";
    }

    // Cuando el usuario haga clic en el botón de cierre (x), cierra la modal
    profileCloseBtn.onclick = function() {
        profileModal.style.display = "none";
    }

    // Cuando el usuario haga clic fuera de la modal, también ciérrala
    window.onclick = function(event) {
        if (event.target == profileModal) {
            profileModal.style.display = "none";
        }
    }

    // Cambiar foto de perfil
    changeProfilePicBtn.onclick = function() {
        profilePicInput.click();
    }

    let image;

    profilePicInput.onchange = function(event) {
        var reader = new FileReader();
        reader.onload = function() {
            profileImage.src = reader.result;
        }
        reader.readAsDataURL(event.target.files[0]);
        image = event.target.files[0];
    }

    // Guardar cambios del perfil
    saveProfileBtn.onclick = function() {        

        alert("Perfil actualizado correctamente");

        profileModal.style.display = "none";
    }
});

// modal de grupos
// Obtener la modal y el botón de cierre
var btnCreateGroupModal = document.getElementById("btnCreateGroupModal");
var createGroupModal = document.getElementById("createGroupModal");
var closeCreateGroupBtn = document.querySelector("#createGroupModal .close2");

// Función para abrir la modal
function openCreateGroupModal() {
    createGroupModal.style.display = "block";
}

// Función para cerrar la modal
function closeCreateGroupModal() {
    createGroupModal.style.display = "none";
}

btnCreateGroupModal.onclick= function(){
    openCreateGroupModal();
}

// Evento de clic en el botón de cierre
closeCreateGroupBtn.onclick = function() {
    closeCreateGroupModal();
}

// Evento de clic fuera de la modal para cerrarla
window.onclick = function(event) {
    if (event.target == createGroupModal) {
        closeCreateGroupModal();
    }
}

// Obtener los botones de añadir usuario
var addUserBtns = document.querySelectorAll(".add-user-btn");

// Agregar evento de clic a cada botón de añadir usuario
addUserBtns.forEach(function(btn) {
    btn.addEventListener("click", function() {
        // Aquí puedes agregar la lógica para añadir un usuario al grupo
        console.log("Añadir usuario al grupo");
    });
});

// Obtener el botón de enviar (crear grupo)
var sendBtn = document.querySelector(".send-btn");

// Agregar evento de clic al botón de enviar
sendBtn.addEventListener("click", function() {
    // Aquí puedes agregar la lógica para enviar el grupo
    console.log("Enviar (Crear grupo)");
});

// Obtener el botón de más grupos
var addGroupBtn = document.querySelector(".add-group");

// Agregar evento de clic al botón de más grupos
addGroupBtn.addEventListener("click", function() {
    openCreateGroupModal();
});