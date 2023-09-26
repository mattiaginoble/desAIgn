var S = Object.defineProperty, E = (t, e, n) => e in t ? S(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, L = (t, e, n) => (E(t, typeof e != "symbol" ? e + "" : e, n), n), R = (t, e, n) => new Promise((a, r) => {
  var c = (g) => {
    try {
      o(n.next(g));
    } catch (u) {
      r(u);
    }
  }, f = (g) => {
    try {
      o(n.throw(g));
    } catch (u) {
      r(u);
    }
  }, o = (g) => g.done ? a(g.value) : Promise.resolve(g.value).then(c, f);
  o((n = n.apply(t, e)).next());
}), w;
((t) => {
  const e = /* @__PURE__ */ new Map();
  function n(r, c) {
    var f;
    return (f = e.get(r)) == null ? void 0 : f.get(c);
  }
  t.getDelegate = n;
  function a(r, c, f) {
    e.has(r) || e.set(r, /* @__PURE__ */ new Map());
    const o = e.get(r);
    o.has(c) || o.set(c, f);
  }
  t.register = a;
})(w || (w = {}));
const h = class {
  constructor(t, e) {
    this.name = t, this.definitions = e;
  }
  static get current() {
    return h.currentSide;
  }
  static set current(t) {
    if (h.currentSide != null)
      throw new Error("Logical side can be declared only once.");
    h.currentSide = t;
  }
  static register(t) {
    return this.sides.set(t.getName(), t), t;
  }
  static byName(t) {
    return this.sides.get(t);
  }
  getName() {
    return this.name;
  }
  beginListening(t, e) {
    const n = (a) => {
      var r, c, f;
      if (this.definitions.shouldHandle != null && !this.definitions.shouldHandle(a))
        return;
      const o = (f = (c = (r = this.definitions).messageGetter) == null ? void 0 : c.call(r, a)) != null ? f : a;
      if (o.type !== "response") {
        const g = t == null ? void 0 : t.byName(
          o.type
        );
        if (g == null)
          t != null && console.warn("Unknown message received ->", o.type);
        else {
          const u = h.byName(o.from), i = g.handle(o.payload, u);
          if (i !== void 0) {
            const l = (s) => {
              const p = h.current, y = w.getDelegate(p, u);
              y == null || y({
                from: h.current.getName(),
                type: "response",
                requestId: o.requestId,
                payload: s
              });
            };
            typeof (i == null ? void 0 : i.then) == "function" ? i.then(l) : l(i);
          }
        }
      }
      e != null && e(o) && this.definitions.detachListener(n);
    };
    this.definitions.attachListener(n);
  }
};
let d = h;
L(d, "currentSide"), /* ------------------------ */
L(d, "sides", /* @__PURE__ */ new Map());
function z() {
  const t = new Array(36);
  for (let e = 0; e < 36; e++)
    t[e] = Math.floor(Math.random() * 16);
  return t[14] = 4, t[19] = t[19] &= ~(1 << 2), t[19] = t[19] |= 1 << 3, t[8] = t[13] = t[18] = t[23] = "-", t.map((e) => e.toString(16)).join("");
}
class P {
  constructor(e) {
    this.name = e;
  }
  getName() {
    return this.name;
  }
  createTransportMessage(e) {
    const n = d.current;
    return {
      requestId: z(),
      type: this.getName(),
      from: n.getName(),
      payload: e
    };
  }
  sendTransportMessage(e) {
    const n = d.current, a = this.receivingSide(), r = w.getDelegate(n, a);
    if (!r)
      throw new Error(
        `Transportation from ${n.getName()} to ${a.getName()} is not supported.`
      );
    return r(e), e;
  }
  send(e) {
    const n = this.createTransportMessage(e);
    return this.sendTransportMessage(n);
  }
  request(e) {
    return R(this, null, function* () {
      const n = this.createTransportMessage(e), a = new Promise((r) => {
        d.current.beginListening(null, (c) => c.requestId === n.requestId ? (r(c.payload), !0) : !1);
      });
      return this.sendTransportMessage(n), a;
    });
  }
}
class x {
  constructor() {
    L(this, "registry", /* @__PURE__ */ new Map());
  }
  byName(e) {
    return this.registry.get(e);
  }
  register(e) {
    return this.registry.set(e.getName(), e), e;
  }
}
function U(t) {
  return (e) => {
    d.current = e, e.beginListening(t.messagesRegistry), t.initTransports(w.register);
  };
}
var m;
((t) => {
  t.PLUGIN = d.register(
    new d("Plugin", {
      attachListener: (e) => figma.ui.on("message", e),
      detachListener: (e) => figma.ui.off("message", e)
    })
  ), t.UI = d.register(
    new d("UI", {
      shouldHandle: (e) => {
        var n;
        return ((n = e.data) == null ? void 0 : n.pluginId) != null;
      },
      messageGetter: (e) => e.data.pluginMessage,
      attachListener: (e) => window.addEventListener("message", e),
      detachListener: (e) => window.removeEventListener("message", e)
    })
  );
})(m || (m = {}));
const C = (t) => !!(t && t.children);
async function A(t, e, n = null) {
  if (t && await e(t, n), C(t))
    for (const a of t.children)
      await A(a, e, t);
}
const G = { family: "Roboto", style: "Regular" }, I = {};
function N(t, e) {
  for (const n in e) {
    const a = e[n];
    if (n === "data" && a && typeof a == "object") {
      const r = JSON.parse(t.getSharedPluginData("builder", "data") || "{}") || {}, f = Object.assign({}, r, a);
      t.setSharedPluginData("builder", "data", JSON.stringify(f));
    } else if (typeof a < "u" && ["width", "height", "type", "ref", "children", "svg"].indexOf(n) === -1)
      try {
        t[n] = e[n];
      } catch (r) {
        console.warn(`Assign error for property "${n}"`, t, e, r);
      }
  }
}
function T(t) {
  return Array.isArray(t.fills) && t.fills.filter((n) => n.type === "IMAGE");
}
async function D(t) {
  const e = T(t);
  return e && Promise.all(
    e.map(async (n) => {
      n != null && n.intArr && (n.imageHash = await figma.createImage(n.intArr).hash, delete n.intArr);
    })
  );
}
const M = (t) => t.toLowerCase().replace(/[^a-z]/gi, "");
async function _(t, e) {
  const n = t.split(/\s*,\s*/);
  for (const a of n) {
    const r = M(a);
    for (const c of e) {
      const f = M(c.fontName.family);
      if (f === r) {
        const o = I[f];
        return o || (await figma.loadFontAsync(c.fontName), I[t] = c.fontName, I[f] = c.fontName, c.fontName);
      }
    }
  }
}
class H extends P {
  receivingSide() {
    return m.PLUGIN;
  }
  handle(e, n) {
    (async () => {
      if (figma.editorType === "figma") {
        const r = (await figma.listAvailableFontsAsync()).filter(
          (u) => u.fontName.style === "Regular"
        );
        await figma.loadFontAsync(G);
        const c = e.layers;
        console.log(c);
        const f = [];
        let o = figma.currentPage, g = o;
        for (const u of c)
          await A(u, async (i, l) => {
            try {
              if (i.type === "FRAME" || i.type === "GROUP") {
                const s = figma.createFrame();
                s.x = i.x, s.y = i.y, s.resize(i.width || 1, i.height || 1), N(s, i), f.push(s), (l && l.ref || o).appendChild(
                  s
                ), i.ref = s, l || (g = s, o = s);
              } else if (i.type === "SVG") {
                const s = figma.createNodeFromSvg(i.svg);
                s.x = i.x, s.y = i.y, s.resize(i.width || 1, i.height || 1), i.ref = s, f.push(s), N(s, i), (l && l.ref || o).appendChild(
                  s
                );
              } else if (i.type === "RECTANGLE") {
                const s = figma.createRectangle(), p = T(i);
                p && (await D(i), p.length), N(s, i), s.resize(i.width || 1, i.height || 1), f.push(s), i.ref = s, (l && l.ref || o).appendChild(
                  s
                );
              } else if (i.type == "TEXT") {
                const s = figma.createText();
                if (i.fontFamily) {
                  const v = I[i.fontFamily];
                  if (v)
                    s.fontName = v;
                  else {
                    const F = await _(
                      i.fontFamily || "",
                      r
                    );
                    s.fontName = F;
                  }
                  delete i.fontFamily;
                }
                N(s, i), i.ref = s, s.resize(i.width || 1, i.height || 1), s.textAutoResize = "HEIGHT";
                const p = i.lineHeight && i.lineHeight.value || i.height;
                let y = 0;
                for (; typeof s.fontSize == "number" && typeof i.fontSize == "number" && (s.height > Math.max(i.height, p) * 1.2 || s.width > i.width * 1.2); ) {
                  if (y++ > i.fontSize * 0.3) {
                    console.warn("Too many font adjustments", s, i);
                    break;
                  }
                  try {
                    s.fontSize = s.fontSize - 1;
                  } catch (v) {
                    console.warn("Error on resize text:", i, s, v);
                  }
                }
                f.push(s), (l && l.ref || o).appendChild(
                  s
                );
              }
            } catch (s) {
              console.warn("Error on layer:", i, s);
            }
          });
        g.type === "FRAME" && (figma.currentPage.selection = [g]), figma.ui.postMessage({
          type: "doneLoading",
          rootId: g.id
        }), figma.viewport.scrollAndZoomIntoView([g]);
      }
    })();
  }
}
var b;
((t) => {
  t.registry = new x(), t.CREATE_RECT = t.registry.register(
    new H("create-rect")
  );
})(b || (b = {}));
const j = U({
  messagesRegistry: b.registry,
  initTransports: function(t) {
    t(m.PLUGIN, m.UI, (e) => {
      figma.ui.postMessage(e);
    }), t(m.UI, m.PLUGIN, (e) => {
      parent.postMessage({ pluginMessage: e }, "*");
    });
  }
});
async function q() {
  j(m.PLUGIN), figma.editorType === "figma" ? figma.showUI(__html__, {
    width: 800,
    height: 800,
    title: "desAIgn"
  }) : figma.editorType === "figjam" && figma.showUI(__html__, {
    width: 800,
    height: 800,
    title: "desAIgn"
  }), console.log("Bootstrapped @", d.current.getName());
}
q();
