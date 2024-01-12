export class RoleManager {
  strapi: any;
  roleId: number;
  role: any;
  roleName: any;

  constructor(strapi: any) {
    this.strapi = strapi;
  }

  async FindRole(name: string) {
    const allRoles = await this.strapi
      .service("plugin::users-permissions.role")
      .find();

    this.roleId = allRoles.filter(
      (role: { name: string }) => role.name === name
    )[0]?.id;

    if (!this.roleId) {
      this.strapi.log.error(`No se encontro el Role ID del Role ${name}`);
      return false;
    } else {
      return true;
    }
  }

  async SetRole(name: string) {
    if (!(await this.FindRole(name))) return;

    const selectedRoleData = await this.strapi
      .service("plugin::users-permissions.role")
      .findOne(this.roleId);

    this.role = selectedRoleData;
    this.roleName = selectedRoleData.name;

    return selectedRoleData !== null;
  }

  async FindOrCreateRole(name: string, description: string) {
    if (!(await this.FindRole(name))) {
      await this.strapi.service("plugin::users-permissions.role").createRole({
        name,
        description,
      });
    } else {
      this.SetRole(name);
    }
  }

  async SetPermissionState(
    controller,
    permission,
    state,
    type = "api",
    service = null
  ) {
    const setPerm = (perm) => {
      const serviceType = `${type}::${service ? service : controller}`;

      if (!this.role) this.strapi.log.error("🔒 No hay role configurado");
      else if (!this.role.permissions)
        this.strapi.log.error("🔒 El role no tiene permisos");
      else if (!this.role.permissions[serviceType])
        this.strapi.log.error(
          `🔒 El tipo de servicio ${serviceType} no se encontró`
        );
      else if (!this.role.permissions[serviceType].controllers)
        this.strapi.log.error(
          `🔒 El tipo de servicio ${serviceType} no tiene controllers definidos`
        );
      else if (!this.role.permissions[serviceType].controllers[controller])
        this.strapi.log.error(
          `🔒 El controller ${controller} en el servicio ${serviceType} no se encontró`
        );
      else if (
        !this.role.permissions[serviceType].controllers[controller][perm]
      )
        this.strapi.log.error(
          `🔒 El permiso ${perm} del controller ${controller} no se encontró`
        );
      else {
        this.role.permissions[serviceType].controllers[controller][
          perm
        ].enabled = state;
      }
    };

    if (Array.isArray(permission)) {
      permission.map((permission) => {
        setPerm(permission);
      });
    } else {
      setPerm(permission);
    }
  }

  // Allow permission for everything
  async SetSuperUser() {
    if (!this.role) {
      this.strapi.log.error("🔒 No hay role configurado");
      return;
    }
    Object.values(this.role.permissions).map((permission: any) => {
      Object.values(permission.controllers).map((controller: any) => {
        Object.values(controller).map((perm: any) => {
          perm.enabled = true;
        });
      });
    });
  }

  async Save() {
    await this.strapi
      .service("plugin::users-permissions.role")
      .updateRole(this.roleId, this.role)
      .then((res) => {
        // console.log(this.role);
        this.strapi.log.info(
          `🔒 Permisos para role ${this.roleName} actualizados!`
        );
      })
      .catch((e) => {
        // console.error(e);
      });
  }
}
