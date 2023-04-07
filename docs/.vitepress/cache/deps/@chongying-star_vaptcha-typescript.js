import {
  __publicField
} from "./chunk-T2T6Q22Z.js";

// node_modules/@chongying-star/vaptcha-typescript/dist/vaptcha.js
var vaptcha_default = (...args) => window.vaptcha(...args);

// node_modules/@chongying-star/vaptcha-typescript/dist/config.js
var cyVaptchaDefaultConfig = {
  "immediateRender": true
};
var cyVaptchaConfig = { ...cyVaptchaDefaultConfig };
var config = new Proxy(cyVaptchaConfig, {
  set() {
    return false;
  }
});
function defineCyVaptchaConfig(config2) {
  Object.assign(cyVaptchaConfig, config2);
  return cyVaptchaConfig;
}

// node_modules/@chongying-star/vaptcha-typescript/dist/CyVaptcha.js
var CyVaptcha = class {
  constructor(vaptcha, config2) {
    __publicField(this, "config");
    __publicField(this, "vaptcha");
    this.config = { ...config2 };
    this.vaptcha = vaptcha;
  }
  /** @deprecated 官方文档未提供 */
  get token() {
    return this.vaptcha.token;
  }
  /** @deprecated 官方文档未提供 */
  get server() {
    return this.vaptcha.server;
  }
  render() {
    return this.vaptcha.render();
  }
  listen(eventName, callback) {
    return this.vaptcha.listen(eventName, callback);
  }
  validate() {
    return this.vaptcha.validate();
  }
  getServerToken() {
    return this.vaptcha.getServerToken();
  }
  renderTokenInput(container) {
    return this.vaptcha.renderTokenInput(container);
  }
  reset() {
    return this.vaptcha.reset();
  }
};

// node_modules/@chongying-star/vaptcha-typescript/dist/cy-vaptcha.js
async function createVaptcha(option, CyVaptchaType, overwriteConfig) {
  const obj = await window.vaptcha(option);
  const config2 = {};
  Object.assign(config2, config, overwriteConfig);
  const vaptcha = new (CyVaptchaType ?? CyVaptcha)(obj, config2);
  if (config2.immediateRender && (option.mode === "click" || option.mode === "embedded")) {
    vaptcha.render();
  }
  return vaptcha;
}
export {
  CyVaptcha,
  createVaptcha,
  vaptcha_default as default,
  defineCyVaptchaConfig
};
//# sourceMappingURL=@chongying-star_vaptcha-typescript.js.map
