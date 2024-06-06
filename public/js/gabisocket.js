const socket = io();

let groupList = [];

socket.on('userlist', (onlineUsers) => {
    const userList = document.getElementById('userList');
    const groupsContainer = document.getElementById('groupsContainer');
    userList.innerHTML = '';

    onlineUsers.forEach(user => {
        if (user.username != document.getElementById('profileBtn').innerText) {
            const li = document.createElement('li');
            li.textContent = user.username;
            li.addEventListener('click', () => createChat(user.id));
            userList.appendChild(li);

            if (document.getElementById(`groupDiv-${user.id}`) == null) {
                const groupDiv = document.createElement('div');
                groupDiv.className = 'group';
                groupDiv.id = 'groupDiv-' + user.id;

                const avatarDiv = document.createElement('div');
                avatarDiv.className = 'avatar';

                const img = document.createElement('img');
                img.src = 'uploads/' + user.profile_picture;
                img.alt = 'profile picture';
                img.style.height = '50px';
                img.style.width = 'auto';
                img.style.borderRadius = '30px';
                avatarDiv.appendChild(img);
                groupDiv.appendChild(avatarDiv);

                const groupInfo = document.createElement('div');
                groupInfo.className = 'group-info';

                const username = document.createElement('h3');
                username.innerText = user.username;
                groupInfo.appendChild(username);

                const status = document.createElement('p');
                status.innerText = user.status;
                groupInfo.appendChild(status);

                const addUserBtn = document.createElement('div');
                addUserBtn.className = 'add-user-btn';
                addUserBtn.innerText = '+';
                addUserBtn.addEventListener('click', () => addIdToGroup(user.id));

                groupDiv.appendChild(groupInfo);
                groupDiv.appendChild(addUserBtn);

                groupsContainer.insertBefore(groupDiv, document.getElementById('groupNameInput'));
            }
        }
    });
});

socket.on('existingChatError', (data) => {
    alert(data.text);
});

socket.on('refreshChatList', (data) => {
    // Obtener el ID de sesión desde el input oculto
    const sessionId = document.getElementById('sessionId').value;

    // Iterar a través de cada chat
    data.chats.forEach(chat => {
        // Verificar si el usuario en sesión es parte del chat
        if (chat.Users.some(user => user.id == sessionId)) {
            // Encontrar el otro usuario en el chat
            const otherUser = chat.Users.find(user => user.id != sessionId);

            // Verificar si ya se muestra en pantalla un chat con el mismo ID de chat
            const existingContactDiv = document.getElementById(`contact-${chat.id}`);

            if (existingContactDiv) {
                // Actualizar el último mensaje y la hora en el contenedor existente
                const contactMessage = existingContactDiv.querySelector('.contact-info p');
                const contactTimeDiv = existingContactDiv.querySelector('.contact-time');
                const lastMessage = chat.Messages[0];

                if (lastMessage) {
                    contactMessage.textContent = lastMessage.content;
                    const sentAt = new Date(lastMessage.sent_at);
                    contactTimeDiv.textContent = sentAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }
            } else {
                // Si no existe, crear un nuevo contenedor para el chat
                // Crear el contenedor principal
                const contactDiv = document.createElement('div');
                contactDiv.className = 'contact';
                contactDiv.id = `contact-${chat.id}`;
                contactDiv.addEventListener('click', () => openChat(chat.id));

                // Crear el contenedor del avatar
                const avatarDiv = document.createElement('div');
                avatarDiv.className = 'avatar';

                // Crear la imagen del avatar
                const avatarImg = document.createElement('img');
                avatarImg.src = 'uploads/' + otherUser.profile_picture;
                avatarImg.alt = 'profile';
                avatarImg.style.height = '50px';
                avatarImg.style.width = 'auto';
                avatarImg.style.borderRadius = '30px';

                // Añadir la imagen al contenedor del avatar
                avatarDiv.appendChild(avatarImg);

                // Crear el contenedor de la información del contacto
                const contactInfoDiv = document.createElement('div');
                contactInfoDiv.className = 'contact-info';

                // Crear el título (nombre del contacto)
                const contactName = document.createElement('h3');
                contactName.textContent = otherUser.username;

                // Crear el párrafo (mensaje del contacto)
                const contactMessage = document.createElement('p');
                const lastMessage = chat.Messages[0]; // Obtener el último mensaje
                contactMessage.textContent = lastMessage ? lastMessage.content : 'No hay mensajes';

                // Añadir el nombre y el mensaje al contenedor de información del contacto
                contactInfoDiv.appendChild(contactName);
                contactInfoDiv.appendChild(contactMessage);

                // Crear el contenedor de la hora del contacto
                const contactTimeDiv = document.createElement('div');
                contactTimeDiv.className = 'contact-time';
                if (lastMessage) {
                    const sentAt = new Date(lastMessage.sent_at);
                    contactTimeDiv.textContent = sentAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }

                // Añadir todos los elementos al contenedor principal
                contactDiv.appendChild(avatarDiv);
                contactDiv.appendChild(contactInfoDiv);
                contactDiv.appendChild(contactTimeDiv);

                // Añadir el contenedor principal al contenedor en el DOM
                document.getElementById('contacts-container').appendChild(contactDiv);
            }
        }
    });
});

socket.on('refreshGroupList', (data) => {
    const sessionId = document.getElementById('sessionId').value;
    const groups_container = document.getElementById('groups_container');

    data.groups.forEach(group => {
        if (group.Users.some(user => user.id == sessionId)) {

            // Verificar si ya se muestra en pantalla un chat con el mismo ID de chat
            const existingContactDiv = document.getElementById(`group-${group.id}`);

            if (existingContactDiv) {
                // Actualizar el último mensaje y la hora en el contenedor existente
                const contactMessage = existingContactDiv.querySelector('.group-info p');
                const contactTimeDiv = existingContactDiv.querySelector('.group-time');
                const lastMessage = group.Messages[0];

                if (lastMessage) {
                    contactMessage.textContent = lastMessage.content;
                    const sentAt = new Date(lastMessage.sent_at);
                    contactTimeDiv.textContent = sentAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }
            } else {

                // Create the main group div
                const groupDiv = document.createElement('div');
                groupDiv.className = 'group';
                groupDiv.id = `group-${group.id}`;
                groupDiv.addEventListener('click', () => openGroup(group.id));

                // Create the avatar div
                const avatarDiv = document.createElement('div');
                avatarDiv.className = 'avatar';
                avatarDiv.textContent = group.name.charAt(0);

                // Create the group-info div
                const groupInfoDiv = document.createElement('div');
                groupInfoDiv.className = 'group-info';

                // Create the h3 element for the group name
                const groupNameH3 = document.createElement('h3');
                groupNameH3.textContent = group.name;

                // Create the p element for the group message
                const groupMessageP = document.createElement('p');
                const lastMessage = group.Messages[0];
                groupMessageP.textContent = lastMessage ? lastMessage.content : 'No hay mensajes';

                // Append the h3 and p to the group-info div
                groupInfoDiv.appendChild(groupNameH3);
                groupInfoDiv.appendChild(groupMessageP);

                // Create the group-time div
                const groupTimeDiv = document.createElement('div');
                groupTimeDiv.className = 'group-time';
                if (lastMessage) {
                    const sentAt = new Date(lastMessage.sent_at);
                    groupTimeDiv.textContent = sentAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }

                // Append all child elements to the main group div
                groupDiv.appendChild(avatarDiv);
                groupDiv.appendChild(groupInfoDiv);
                groupDiv.appendChild(groupTimeDiv);

                // Append the group div to the document body or any other desired parent element
                groups_container.appendChild(groupDiv);
            }
        }
    })

})

socket.on('refreshChat', (data) => {
    if (data.messages[0].chat_id.toString() == document.getElementById('messageDiv').dataset.chatId) {
        const contactInfoDiv = document.getElementById(`contact-${data.messages[0].chat_id}`);
        const contactNameElement = contactInfoDiv.querySelector('h3');
        const contactNameText = contactNameElement.textContent;
        document.getElementById('userHeader').innerHTML = contactNameText;

        const messageDiv = document.getElementById('messageDiv');
        messageDiv.innerHTML = '';

        data.messages.forEach(message => {
            const message_container = document.createElement('div');
            if (message.sender_id == document.getElementById('sessionId').value) {
                message_container.className = 'message sent';
            } else {
                message_container.className = 'message received';
            }
            const messageContent = document.createElement('p');
            const sentAt = new Date(message.sent_at);
            messageContent.innerHTML = message.content + '<span class="time">' + sentAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + '</span>';
            message_container.appendChild(messageContent);
            messageDiv.appendChild(message_container);
        })
    }
});

socket.on('refreshGroup', (data) => {
    console.log(data)
    if (data.messages[0].group_id.toString() == document.getElementById('messageDiv').dataset.chatId) {
        const contactInfoDiv = document.getElementById(`group-${data.messages[0].group_id}`);
        const contactNameElement = contactInfoDiv.querySelector('h3');
        const contactNameText = contactNameElement.textContent;
        document.getElementById('userHeader').innerHTML = contactNameText;

        const messageDiv = document.getElementById('messageDiv');
        messageDiv.innerHTML = '';

        data.messages.forEach(message => {
            const message_container = document.createElement('div');
            if (message.sender_id == document.getElementById('sessionId').value) {
                message_container.className = 'message sent';
            } else {
                message_container.className = 'message received';
            }
            const messageContent = document.createElement('p');
            const sentAt = new Date(message.sent_at);
            messageContent.innerHTML = message.content + '<span class="time">' + sentAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + '</span>';
            message_container.appendChild(messageContent);
            messageDiv.appendChild(message_container);
        })
    }
});

function createChat(userId) {
    document.getElementById('userListModal').style.display = 'none';
    socket.emit('createChat', { userId });
}

function openChat(chatId) {
    document.getElementById('messageDiv').dataset.chatId = chatId;
    document.getElementById('messageDiv').dataset.type = "chat";
    socket.emit('openChat', { chatId });
}

function openGroup(groupId) {
    document.getElementById('messageDiv').dataset.chatId = groupId;
    document.getElementById('messageDiv').dataset.type = "group";
    socket.emit('openGroup', { groupId });
}

function sendMessage() {
    const messageText = document.getElementById('messageText').value;
    document.getElementById('messageText').value = '';
    const chatId = document.getElementById('messageDiv').dataset.chatId;
    const type = document.getElementById('messageDiv').dataset.type;
    socket.emit('newMessage', { messageText, chatId, type });
}

function addIdToGroup(id) {
    userDiv = document.getElementById(`groupDiv-${id}`);
    if (groupList.includes(id)) {
        const index = groupList.indexOf(id);
        groupList.splice(index, 1);
        userDiv.style.backgroundColor = 'black';
    } else {
        groupList.push(id);
        userDiv.style.backgroundColor = 'deepskyblue';
    }
}

function newGroup() {
    const groupName = document.getElementById('groupName').value;
    if (groupList.length == 0) {
        alert('Se necesita al menos una persona');
    } else {
        users = groupList;
        groupList = [];
        document.getElementById('createGroupModal').style.display = 'none';
        socket.emit('newGroup', { groupName, users });
    }

}
