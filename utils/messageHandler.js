export default (io, socket) => {
  const createdMessage = (msg) => {
    socket.broadcast.emit('newIncomingMessage', msg)
  }
  const typing = (typingData) => {
    socket.broadcast.emit('userTyping', typingData)
  }
  socket.on('createdMessage', createdMessage)
  socket.on('typing', typing)
}
