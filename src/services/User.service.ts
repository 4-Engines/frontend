async function loginUser(username: string, password: string): Promise<void> { }

async function createUser(username: string, password: string, email: string, name: string, lastname: string): Promise<void> { }

async function logoutUser(): Promise<void> { }

export {
    loginUser,
    createUser,
    logoutUser
}