const { Chat, Message, User, Group } = require('../models/Associations');
const sequelize = require("../config/database");

let onlineUsers = [];

module.exports = (io) => {
  io.on('connection', async (socket) => {
    const { id, username, profile_picture, status } = socket.request.session.user;

    const existingUser = onlineUsers.find(user => user.id === id);
    if (existingUser) {
      existingUser.socket = socket.id;
    } else {
      onlineUsers.push({ id, username, profile_picture, status });
    }

    io.emit('userlist', onlineUsers);

    const chats = await getAllChatsWithLastMessage();
    io.emit('refreshChatList', { chats });

    const groups = await getAllGroupsWithLastMessage();
    io.emit('refreshGroupList', { groups });

    socket.on('disconnect', () => {
      const index = onlineUsers.findIndex(user => user.id === id);
      if (index !== -1) {
        onlineUsers.splice(index, 1);
      }

      io.emit('userlist', onlineUsers);
    });

    socket.on('createChat', async (data) => {
      const sessionId = socket.request.session.user.id;
      const otherUserId = data.userId;

      // Verificar si ya existe un chat entre los usuarios
      const chatExists = await chatExistsBetweenUsers(sessionId, otherUserId);

      if (chatExists) {
        console.log('El chat ya existe');
        io.to(socket.id).emit('existingChatError', { text: 'El chat ya existe' })
        return;
      }

      // Crear un nuevo chat si no existe
      const chat = await Chat.create();
      await chat.addUser(sessionId);
      await chat.addUser(otherUserId);

      // Crear mensaje de inicio del chat
      const content = username + ' quiere hablar contigo!'
      await Message.create({ content, sender_id: id, chat_id: chat.id });

      // Emitir la lista de chats actualizada
      const chats = await getAllChatsWithLastMessage();
      io.emit('refreshChatList', { chats });
    });

    socket.on('openChat', async (data) => {
      const messages = await getAllMessagesInChat(data.chatId);
      io.to(socket.id).emit('refreshChat', { messages });
    });

    socket.on('openGroup', async (data) => {
      const messages = await getAllMessagesInGroup(data.groupId);
      io.to(socket.id).emit('refreshGroup', { messages });
    });

    socket.on('newMessage', async (data) => {
      if (data.type == "chat") {
        await Message.create({ content: data.messageText, sender_id: id, chat_id: data.chatId });
        const chats = await getAllChatsWithLastMessage();
        io.emit('refreshChatList', { chats });
        const messages = await getAllMessagesInChat(data.chatId);
        io.emit('refreshChat', { messages });
      } else {
        await Message.create({ content: data.messageText, sender_id: id, group_id: data.chatId });
        const groups = await getAllGroupsWithLastMessage();
        io.emit('refreshGroupList', { groups });
        const messages = await getAllMessagesInGroup(data.chatId);
        io.emit('refreshGroup', { messages });
      }
    })

    socket.on('newGroup', async (data) => {
      const group = await Group.create({ name: data.groupName, admin: id });
      await group.addUser(id);
      for (const user of data.users) {
        await group.addUser(user);
      }
      const content = username + ' a creado un nuevo grupo!'
      await Message.create({ content, sender_id: id, group_id: group.id });
      const groups = await getAllGroupsWithLastMessage();
      io.emit('refreshGroupList', { groups });
    })

  });
};

async function getAllChatsWithLastMessage() {
  const chats = await Chat.findAll({
    include: [
      {
        model: User,
        through: { attributes: [] },
      },
      {
        model: Message,
        attributes: ['content', 'sent_at', 'sender_id'],
        include: [{ model: User, attributes: ['username'] }],
        limit: 1,
        order: [['sent_at', 'DESC']],
      },
    ],
  });

  return chats;
}

async function getAllGroupsWithLastMessage() {
  const groups = await Group.findAll({
    include: [
      {
        model: User,
        through: { attributes: [] },
      },
      {
        model: Message,
        attributes: ['content', 'sent_at', 'sender_id'],
        include: [{ model: User, attributes: ['username'] }],
        limit: 1,
        order: [['sent_at', 'DESC']],
      },
    ],
  });

  return groups;
}

async function chatExistsBetweenUsers(userId1, userId2) {
  // Encontrar los chats en los que está involucrado el primer usuario
  const userChats = await Chat.findAll({
    include: {
      model: User,
      where: { id: userId1 },
      through: { attributes: [] }
    }
  });

  // Encontrar los chats en los que está involucrado el segundo usuario
  const otherUserChats = await Chat.findAll({
    include: {
      model: User,
      where: { id: userId2 },
      through: { attributes: [] }
    }
  });

  // Encontrar la intersección de los dos conjuntos de chats
  const userChatIds = userChats.map(chat => chat.id);
  const otherUserChatIds = otherUserChats.map(chat => chat.id);
  const commonChatIds = userChatIds.filter(chatId => otherUserChatIds.includes(chatId));

  // Si hay chats comunes, significa que ya existe un chat entre los usuarios
  return commonChatIds.length > 0;
}

async function getAllMessagesInChat(chatId) {
  const messages = await Message.findAll({
    where: { chat_id: chatId }
  });
  return messages;
}

async function getAllMessagesInGroup(groupId) {
  const messages = await Message.findAll({
    where: { group_id: groupId }
  });
  return messages;
}