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
    }, {
      path: "/user",
      component: "modules/user",
      name: "user",
    }, {
      path: "/allRanks",
      component: "modules/allRanks",
      name: "allRanks",
    }, {
      path: "/orgRanks",
      component: "modules/orgRanks",
      name: "orgRanks",
    }, {
      path: "/forcast",
      component: "modules/forcast",
      name: "forcast",
    }, {
      path: "/forcastPic",
      component: "modules/forcastPic",
      name: "forcastPic",
    }]
  }, {
    path: "/transition",
    component: "frameworks/transition",
    name: "transition",
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