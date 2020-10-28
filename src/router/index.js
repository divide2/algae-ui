import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layout'
/* Router Modules */

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },

  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

  /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,
  {
    path: '/basic',
    name: 'basic',
    component: Layout,
    redirect: '/product',
    meta: { title: 'basic', icon: 'table', roles: ['admin'] },
    children: [
      {
        path: 'product/:productId/group/:groupId/formula',
        name: 'formula',
        hidden: true,
        component: () => import('@/views/product/FormulaView'),
        meta: { title: 'formula' }
      },
      {
        // path: 'product/:productId/group/:groupId/formula-view',
        path: 'formula-view',
        name: 'formula-view',
        hidden: true,
        component: () => import('@/views/product/FormulaView'),
        meta: { title: 'formula-view' }
      },
      {
        path: '/product',
        name: 'product',
        component: () => import('@/views/product/List'),
        meta: { title: 'product' }
      },
      {
        path: '/product/add',
        name: 'productAdd',
        hidden: true,
        component: () => import('@/views/product/add'),
        meta: { title: 'productAdd' }
      },
      {
        path: '/product/:id/formula/group',
        name: 'formulaGroup',
        hidden: true,
        component: () => import('@/views/product/FormulaGroup'),
        meta: { title: 'formulaGroup' }
      },
      {
        path: '/product/:id/rate/definition',
        name: 'rateDefinition',
        hidden: true,
        component: () => import('@/views/product/ProductRateDefinition'),
        meta: { title: 'rateDefinition' }
      },
      {
        path: '/product/:id/rule',
        name: 'rule',
        hidden: true,
        component: () => import('@/views/product/Rule'),
        meta: { title: 'rule' }
      },
      {
        path: '/product/:id/validate',
        name: 'productValidate',
        hidden: true,
        component: () => import('@/views/product/Validate'),
        meta: { title: 'product-validate' }
      }
    ]
  },
  {
    path: '/lang',
    name: 'lang',
    component: Layout,
    redirect: '/langs',
    meta: { title: 'lang', icon: 'table' },
    children: [
      {
        path: 'langs',
        name: 'langs',
        component: () => import('@/views/lang/List'),
        meta: { title: 'lang' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
