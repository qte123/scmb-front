import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Main',
        redirect: '/home',
        component: () => import('../views/Main.vue'),
        children: [
            // {
            //     path: '/home',
            //     name: 'Home',
            //     component: () => import('../views/home')
            // }, {
            //     path: '/upload',
            //     name: 'Upload',
            //     component: () => import('../views/upload')

            // }, , {
            //     path: '/user',
            //     name: 'User',
            //     component: () => import('../views/user')
            // }, {
            //     path: '/images',
            //     name: 'Images',
            //     component: () => import('../views/images')
            // }, {
            //     path: '/search',
            //     name: 'Search',
            //     component: () => import('../views/search')
            // }
        ]
    }, {
        path: '/login',
        name: 'Login',
        component: () => import('../views/login')
    }, {
        path: '/register',
        name: 'Register',
        component: () => import('../views/register')
    },

]

const router = new VueRouter({
    mode: 'history',
    routes
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

export default router
