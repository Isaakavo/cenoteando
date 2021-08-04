import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Store from '@/store';

import Home from '@/views/Home.vue';
import NotFound from '@/views/NotFound.vue';
import Map from '@/views/Map.vue';
import Cenote from '@/views/Cenote.vue';
import Login from '@/views/auth/Login.vue';
import Signup from '@/views/auth/Signup.vue';

Vue.use(VueRouter);

const APP_NAME = process.env.VUE_APP_NAME || 'Cenoteando';

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: { title: APP_NAME, requiredAuth: 'None' },
    },
    {
        path: '/oai-pmh',
        component: () => import('@/views/oai/OaiPmh.vue'),
        children: [
            {
                path: '',
                name: 'OaiPmh',
                component: () => import('@/views/oai/OaiIdentify.vue'),
                meta: {
                    title: APP_NAME + ' - OAI-PMH Identify',
                    requiredAuth: 'None',
                },
            },
            {
                path: 'identify',
                name: 'OaiIdentify',
                component: () => import('@/views/oai/OaiIdentify.vue'),
                meta: {
                    title: APP_NAME + ' - OAI-PMH Identify',
                    requiredAuth: 'None',
                },
            },
            {
                path: 'get-record',
                name: 'OaiGetRecord',
                component: () => import('@/views/oai/OaiGetRecord.vue'),
                meta: {
                    title: APP_NAME + ' - OAI-PMH Get Record',
                    requiredAuth: 'None',
                },
            },
            {
                path: 'list-records',
                name: 'OaiListRecords',
                component: () => import('@/views/oai/OaiListRecords.vue'),
                meta: {
                    title: APP_NAME + ' - OAI-PMH List Records',
                    requiredAuth: 'None',
                },
            },
        ],
    },
    {
        path: '/map',
        name: 'Map',
        component: Map,
        meta: { title: APP_NAME + ' - Map', requiredAuth: 'None' },
    },
    {
        path: '/cenote/:key',
        name: 'Cenote',
        component: Cenote,
        // TODO: Add cenote name to title
        meta: { title: APP_NAME + ' - Cenote', requiredAuth: 'None' },
    },
    {
        path: '/admin',
        // TODO: Create Admin Dashboard parent router view
        component: () => import('@/views/admin/Dashboard.vue'),
        children: [
            {
                path: '',
                name: 'Dashboard',
                // TODO: Create Statistics view
                component: () => import('@/views/admin/Statistics.vue'),
                meta: {
                    title: APP_NAME + ' - Dashboard',
                    requiredAuth: 'Admin',
                },
            },
            {
                path: '/variables',
                name: 'Variables',
                component: () => import('@/views/admin/Variables.vue'),
                meta: {
                    title: APP_NAME + ' - Manage Variables',
                    requiredAuth: 'Admin',
                },
            },
            // TODO: Create remaining views (users, cenotes, MoFs, etc.)
        ],
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { title: APP_NAME + ' - Login', requiredAuth: 'None' },
    },
    {
        path: '/signup',
        name: 'Signup',
        component: Signup,
        meta: { title: APP_NAME + ' - Signup', requiredAuth: 'None' },
    },
    {
        path: '**',
        name: 'NotFound',
        component: NotFound,
        meta: { title: 'Page Not Found', requiredAuth: 'None' },
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach(async (to, from, next) => {
    if (to.meta?.requiredAuth == 'None') {
        next();
    } else if (to.meta?.requiredAuth == 'Admin' && Store.getters.isAdmin) {
        next();
    } else {
        next('/');
    }
});

// Ignore 'from' is defined but never used
// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.afterEach(async (to, from) => {
    document.title = to.meta?.title;
    await Store.dispatch('clearLoading');
});

export default router;
