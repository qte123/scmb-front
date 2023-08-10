import { getCookies, setCookies, removeCookies } from "../api/cookie.js"
export default {
    state: {
        token: '',
        user: '',
        username: ''
    },
    mutations: {
        setToken(state, val) {
            state.token = val
            setCookies('token', val, 60 * 30)
        },
        clearToken(state) {
            state.token = ''
            removeCookies('token')
        },
        getToken(state) {
            state.token = state.token || getCookies('token')
        },
        setUser(state, val) {
            state.user = val
            setCookies('user', val, 60 * 30)
        },
        clearUser(state) {
            state.user = {}
            removeCookies('user')
        },
        getUser(state) {
            state.user = state.user || getCookies('user')
        },
        setUsername(state, val) {
            state.username = val
            setCookies('username', val, 60*60)
        },
        clearUsername(state) {
            state.username = ''
            removeCookies('username')
        },
        getUsername(state) {
            state.username = state.username || getCookies('username')
        }
    }
}