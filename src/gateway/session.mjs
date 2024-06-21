
const sessions = new Map();
const adminSocket = null;

export const getUserSocket = (id) => {
    return sessions.get(id);
}

export const addAdmin = (socket) => {
    adminSocket = socket;
}

export const setUserSocket = (userId, socket) => {
    sessions.set(userId, socket);
}

export const removeUserSocket = (userId) => {
    sessions.delete(userId);
}

export const getSockets = () => {
    return sessions;
}

export const getAdmin = () => {
    sessions.forEach((value) => {
        if(value.user.role === 'admin') {
            return value;
        }
        return null;
    })
}

