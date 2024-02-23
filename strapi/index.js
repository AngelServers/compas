var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// strapi/main.ts
var main_exports = {};
__export(main_exports, {
  RoleManager: () => RoleManager,
  customRouter: () => customRouter,
  parseServiceResult: () => parseServiceResult,
  terminalBox: () => terminalBox
});
module.exports = __toCommonJS(main_exports);

// src/strapi/sanitizer.ts
var parseServiceResult = (result) => {
  return { data: result.results, meta: { pagination: result.pagination } };
};

// src/strapi/role-manager.ts
var RoleManager = class {
  constructor(strapi) {
    __publicField(this, "strapi");
    __publicField(this, "roleId");
    __publicField(this, "role");
    __publicField(this, "roleName");
    this.strapi = strapi;
  }
  async FindRole(name) {
    var _a;
    const allRoles = await this.strapi.service("plugin::users-permissions.role").find();
    this.roleId = (_a = allRoles.filter(
      (role) => role.name === name
    )[0]) == null ? void 0 : _a.id;
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

// src/strapi/helpers.ts
var customRouter = (defaultRouter, extraRoutes = []) => {
  let routes;
  return {
    get prefix() {
      return defaultRouter.prefix;
    },
    get routes() {
      if (!routes)
        routes = defaultRouter.routes.concat(extraRoutes);
      return routes;
    }
  };
};
var terminalBox = (text, length) => {
  if (!length)
    length = text.length;
  console.log("\u250C" + "\u2500".repeat(length + 1) + "\u2510");
  console.log("\u2502 " + text + " \u2502");
  console.log("\u2514" + "\u2500".repeat(length + 1) + "\u2518");
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RoleManager,
  customRouter,
  parseServiceResult,
  terminalBox
});
