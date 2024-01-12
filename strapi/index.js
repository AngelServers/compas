(() => {
  // src/strapi/sanitizer.ts
  var parseServiceResult = (result) => {
    return { data: result.results, meta: { pagination: result.pagination } };
  };

  // src/strapi/role-manager.ts
  var RoleManager = class {
    strapi;
    roleId;
    role;
    roleName;
    constructor(strapi) {
      this.strapi = strapi;
    }
    async FindRole(name) {
      const allRoles = await this.strapi.service("plugin::users-permissions.role").find();
      this.roleId = allRoles.filter(
        (role) => role.name === name
      )[0]?.id;
      if (!this.roleId) {
        this.strapi.log.error(`No se encontro el Role ID del Role ${name}`);
        return false;
      } else {
        return true;
      }
    }
    async SetRole(name) {
      if (!await this.FindRole(name))
        return;
      const selectedRoleData = await this.strapi.service("plugin::users-permissions.role").findOne(this.roleId);
      this.role = selectedRoleData;
      this.roleName = selectedRoleData.name;
      return selectedRoleData !== null;
    }
    async FindOrCreateRole(name, description) {
      if (!await this.FindRole(name)) {
        await this.strapi.service("plugin::users-permissions.role").createRole({
          name,
          description
        });
      } else {
        this.SetRole(name);
      }
    }
    async SetPermissionState(controller, permission, state, type = "api", service = null) {
      const setPerm = (perm) => {
        const serviceType = `${type}::${service ? service : controller}`;
        if (!this.role)
          this.strapi.log.error("\u{1F512} No hay role configurado");
        else if (!this.role.permissions)
          this.strapi.log.error("\u{1F512} El role no tiene permisos");
        else if (!this.role.permissions[serviceType])
          this.strapi.log.error(
            `\u{1F512} El tipo de servicio ${serviceType} no se encontr\xF3`
          );
        else if (!this.role.permissions[serviceType].controllers)
          this.strapi.log.error(
            `\u{1F512} El tipo de servicio ${serviceType} no tiene controllers definidos`
          );
        else if (!this.role.permissions[serviceType].controllers[controller])
          this.strapi.log.error(
            `\u{1F512} El controller ${controller} en el servicio ${serviceType} no se encontr\xF3`
          );
        else if (!this.role.permissions[serviceType].controllers[controller][perm])
          this.strapi.log.error(
            `\u{1F512} El permiso ${perm} del controller ${controller} no se encontr\xF3`
          );
        else {
          this.role.permissions[serviceType].controllers[controller][perm].enabled = state;
        }
      };
      if (Array.isArray(permission)) {
        permission.map((permission2) => {
          setPerm(permission2);
        });
      } else {
        setPerm(permission);
      }
    }
    // Allow permission for everything
    async SetSuperUser() {
      if (!this.role) {
        this.strapi.log.error("\u{1F512} No hay role configurado");
        return;
      }
      Object.values(this.role.permissions).map((permission) => {
        Object.values(permission.controllers).map((controller) => {
          Object.values(controller).map((perm) => {
            perm.enabled = true;
          });
        });
      });
    }
    async Save() {
      await this.strapi.service("plugin::users-permissions.role").updateRole(this.roleId, this.role).then((res) => {
        this.strapi.log.info(
          `\u{1F512} Permisos para role ${this.roleName} actualizados!`
        );
      }).catch((e) => {
      });
    }
  };
})();
