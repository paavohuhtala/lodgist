
import * as _ from "lodash"

export interface IAuthenticationResult {
    isValid: boolean
    reason?: string
}

export async function authenticate(request: lodgist.requests.LoginRequest) {
    
}