import { getCookies, setCookies, removeCookies} from "../api/cookie.js"

export default {
    state: {
        isCollapse: false,
        menu: []
    },
    mutations: {
        collapseMenu(state) {
            state.isCollapse = !state.isCollapse
        },
        setMenu(state, val) {
            state.menu = val
            setCookies('menu', JSON.stringify(val), 60*30)
        },
        clearMenu(state) {
            state.menu = []
            removeCookies('menu')
        },
        addMenu(state, router) {
            if (!getCookies('menu')) {
                return
            }
            const menu = JSON.parse(getCookies('menu'))
            state.menu = menu
            const menuArray = []
            menu.forEach(item => {
                if (item.children) {
                    item.children = item.children.map(item => {
                        item.component = () => import(`../views/${item.url}`)
                        return item
                    })
                    menuArray.push(...item.children)
                } else {
                    console.log(item.url)
                    item.component = () => import(`../views/${item.url}`)
                    menuArray.push(item)
                }
            });
            //路由的动态添加
            menuArray.forEach(item => {
                router.addRoute('Main', item)
            })
        }
    }
}