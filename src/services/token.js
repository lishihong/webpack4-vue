
export function getToken() {
    return sessionStorage.getItem("analysis_token")
}

export function setToken(token) {
    return sessionStorage.setItem("analysis_token",token)
}

export function removeToken() {
    return sessionStorage.removeItem("analysis_token")
}
