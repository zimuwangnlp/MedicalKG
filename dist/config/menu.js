const MenuConfig = {
  admin: [{
      icon: "HomeFilled",
      path: "/home",
      label: "主页",
    },
    {
      icon: "",
      label: "用户管理",
      path: "/user",
    },
  ],
  other: [{
    icon: "HomeFilled",
    path: "/home",
    label: "主页",
  }],
  temp: [{
      icon: "",
      path: "/home",
      label: "主页",
    },
    {
      icon: "",
      label: "系统管理",
      children: [{
          icon: "",
          label: "用户管理",
          path: "/sys/user",
        },
        {
          icon: "",
          label: "角色管理",
          path: "/sys/role",
        }
      ],
    },
  ]
}

// export default RouteConfig