
export interface ILoginRequest {
    email: string
    password: string
}

export module LoginRequest {
    export const loginRequestMembers = ["email", "password"]
}
