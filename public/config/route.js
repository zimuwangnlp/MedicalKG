const RouteConfig = {
  admin: [{
    component: "frameworks/breadcrumb",
    path: "/",
    name: "home",
    redirect: "/home",
    children: [{
      component: "modules/home",
      name: "home",
      path: "/home",
    }]
  }],
  temp: [{
      component: "frameworks/breadcrumb",
      path: "/",
      redirect: "/home",
      children: [{
        component: "modules/home",
        path: "/home",
      }]
    },
    {
      component: "frameworks/secondMenu",
      path: "/sys",
      redirect: "/sys/user",
      children: [{
        component: "modules/role",
        path: "/sys/role",
      }, {
        component: "modules/user",
        path: "/sys/user",
      }]
    },
    {
      path: "/transition",
      component: "frameworks/transition",
      name: "transition",
    }
  ]
}