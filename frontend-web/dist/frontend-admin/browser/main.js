import {
  Title,
  bootstrapApplication
} from "./chunk-ONKPIA4P.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  ReactiveFormsModule,
  Validators,
  ɵNgNoValidate
} from "./chunk-K27GQWIT.js";
import {
  APP_BOOTSTRAP_LISTENER,
  ApplicationRef,
  Attribute,
  BehaviorSubject,
  ChangeDetectorRef,
  CommonModule,
  Compiler,
  Component,
  Console,
  ContentChildren,
  DOCUMENT,
  DestroyRef,
  Directive,
  EMPTY,
  ENVIRONMENT_INITIALIZER,
  ElementRef,
  EmptyError,
  EnvironmentInjector,
  EventEmitter,
  HashLocationStrategy,
  HostAttributeToken,
  HostListener,
  INTERNAL_APPLICATION_ERROR_HANDLER,
  IS_ENABLED_BLOCKING_INITIAL_NAVIGATION,
  Injectable,
  InjectionToken,
  Injector,
  Input,
  LOCATION_INITIALIZED,
  Location,
  LocationStrategy,
  NgClass,
  NgForOf,
  NgIf,
  NgModule,
  NgModuleFactory$1,
  NgZone,
  Observable,
  Output,
  PRECOMMIT_HANDLER_SUPPORTED,
  PathLocationStrategy,
  PendingTasksInternal,
  PlatformLocation,
  PlatformNavigation,
  Renderer2,
  RuntimeError,
  Subject,
  Subscription,
  ViewContainerRef,
  ViewportScroller,
  __spreadProps,
  __spreadValues,
  afterNextRender,
  booleanAttribute,
  catchError,
  combineLatest,
  computed,
  concat,
  concatMap,
  createEnvironmentInjector,
  defer,
  delay,
  effect,
  filter,
  finalize,
  first,
  formatRuntimeError,
  from,
  inject,
  input,
  isInjectable,
  isNgModule,
  isObservable,
  isPromise,
  isStandalone,
  linkedSignal,
  makeEnvironmentProviders,
  map,
  mergeAll,
  mergeMap,
  of,
  performanceMarkFeature,
  pipe,
  promiseWithResolvers,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  publishExternalGlobalUtil,
  reflectComponentType,
  runInInjectionContext,
  setClassMetadata,
  signal,
  startWith,
  switchMap,
  take,
  takeLast,
  takeUntil,
  tap,
  throwError,
  untracked,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵinject,
  ɵɵinjectAttribute,
  ɵɵinvalidFactory,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrlOrResourceUrl,
  ɵɵstyleMap,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-CJ6OLCZO.js";

// node_modules/@angular/router/fesm2022/_router-chunk.mjs
var PRIMARY_OUTLET = "primary";
var RouteTitleKey = /* @__PURE__ */ Symbol("RouteTitle");
var ParamsAsMap = class {
  params;
  constructor(params) {
    this.params = params || {};
  }
  has(name) {
    return Object.prototype.hasOwnProperty.call(this.params, name);
  }
  get(name) {
    if (this.has(name)) {
      const v = this.params[name];
      return Array.isArray(v) ? v[0] : v;
    }
    return null;
  }
  getAll(name) {
    if (this.has(name)) {
      const v = this.params[name];
      return Array.isArray(v) ? v : [v];
    }
    return [];
  }
  get keys() {
    return Object.keys(this.params);
  }
};
function convertToParamMap(params) {
  return new ParamsAsMap(params);
}
function matchParts(routeParts, urlSegments, posParams) {
  for (let i = 0; i < routeParts.length; i++) {
    const part = routeParts[i];
    const segment = urlSegments[i];
    const isParameter = part[0] === ":";
    if (isParameter) {
      posParams[part.substring(1)] = segment;
    } else if (part !== segment.path) {
      return false;
    }
  }
  return true;
}
function defaultUrlMatcher(segments, segmentGroup, route) {
  const parts = route.path.split("/");
  const wildcardIndex = parts.indexOf("**");
  if (wildcardIndex === -1) {
    if (parts.length > segments.length) {
      return null;
    }
    if (route.pathMatch === "full" && (segmentGroup.hasChildren() || parts.length < segments.length)) {
      return null;
    }
    const posParams2 = {};
    const consumed = segments.slice(0, parts.length);
    if (!matchParts(parts, consumed, posParams2)) {
      return null;
    }
    return {
      consumed,
      posParams: posParams2
    };
  }
  if (wildcardIndex !== parts.lastIndexOf("**")) {
    return null;
  }
  const pre = parts.slice(0, wildcardIndex);
  const post = parts.slice(wildcardIndex + 1);
  if (pre.length + post.length > segments.length) {
    return null;
  }
  if (route.pathMatch === "full" && segmentGroup.hasChildren() && route.path !== "**") {
    return null;
  }
  const posParams = {};
  if (!matchParts(pre, segments.slice(0, pre.length), posParams)) {
    return null;
  }
  if (!matchParts(post, segments.slice(segments.length - post.length), posParams)) {
    return null;
  }
  return {
    consumed: segments,
    posParams
  };
}
function firstValueFrom(source) {
  return new Promise((resolve, reject) => {
    source.pipe(first()).subscribe({
      next: (value) => resolve(value),
      error: (err) => reject(err)
    });
  });
}
function shallowEqualArrays(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; ++i) {
    if (!shallowEqual(a[i], b[i])) return false;
  }
  return true;
}
function shallowEqual(a, b) {
  const k1 = a ? getDataKeys(a) : void 0;
  const k2 = b ? getDataKeys(b) : void 0;
  if (!k1 || !k2 || k1.length != k2.length) {
    return false;
  }
  let key;
  for (let i = 0; i < k1.length; i++) {
    key = k1[i];
    if (!equalArraysOrString(a[key], b[key])) {
      return false;
    }
  }
  return true;
}
function getDataKeys(obj) {
  return [...Object.keys(obj), ...Object.getOwnPropertySymbols(obj)];
}
function equalArraysOrString(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    const aSorted = [...a].sort();
    const bSorted = [...b].sort();
    return aSorted.every((val, index) => bSorted[index] === val);
  } else {
    return a === b;
  }
}
function last(a) {
  return a.length > 0 ? a[a.length - 1] : null;
}
function wrapIntoObservable(value) {
  if (isObservable(value)) {
    return value;
  }
  if (isPromise(value)) {
    return from(Promise.resolve(value));
  }
  return of(value);
}
function wrapIntoPromise(value) {
  if (isObservable(value)) {
    return firstValueFrom(value);
  }
  return Promise.resolve(value);
}
var pathCompareMap = {
  "exact": equalSegmentGroups,
  "subset": containsSegmentGroup
};
var paramCompareMap = {
  "exact": equalParams,
  "subset": containsParams,
  "ignored": () => true
};
var exactMatchOptions = {
  paths: "exact",
  fragment: "ignored",
  matrixParams: "ignored",
  queryParams: "exact"
};
var subsetMatchOptions = {
  paths: "subset",
  fragment: "ignored",
  matrixParams: "ignored",
  queryParams: "subset"
};
function isActive(url, router, matchOptions) {
  const urlTree = url instanceof UrlTree ? url : router.parseUrl(url);
  return computed(() => containsTree(router.lastSuccessfulNavigation()?.finalUrl ?? new UrlTree(), urlTree, __spreadValues(__spreadValues({}, subsetMatchOptions), matchOptions)));
}
function containsTree(container, containee, options) {
  return pathCompareMap[options.paths](container.root, containee.root, options.matrixParams) && paramCompareMap[options.queryParams](container.queryParams, containee.queryParams) && !(options.fragment === "exact" && container.fragment !== containee.fragment);
}
function equalParams(container, containee) {
  return shallowEqual(container, containee);
}
function equalSegmentGroups(container, containee, matrixParams) {
  if (!equalPath(container.segments, containee.segments)) return false;
  if (!matrixParamsMatch(container.segments, containee.segments, matrixParams)) {
    return false;
  }
  if (container.numberOfChildren !== containee.numberOfChildren) return false;
  for (const c in containee.children) {
    if (!container.children[c]) return false;
    if (!equalSegmentGroups(container.children[c], containee.children[c], matrixParams)) return false;
  }
  return true;
}
function containsParams(container, containee) {
  return Object.keys(containee).length <= Object.keys(container).length && Object.keys(containee).every((key) => equalArraysOrString(container[key], containee[key]));
}
function containsSegmentGroup(container, containee, matrixParams) {
  return containsSegmentGroupHelper(container, containee, containee.segments, matrixParams);
}
function containsSegmentGroupHelper(container, containee, containeePaths, matrixParams) {
  if (container.segments.length > containeePaths.length) {
    const current = container.segments.slice(0, containeePaths.length);
    if (!equalPath(current, containeePaths)) return false;
    if (containee.hasChildren()) return false;
    if (!matrixParamsMatch(current, containeePaths, matrixParams)) return false;
    return true;
  } else if (container.segments.length === containeePaths.length) {
    if (!equalPath(container.segments, containeePaths)) return false;
    if (!matrixParamsMatch(container.segments, containeePaths, matrixParams)) return false;
    for (const c in containee.children) {
      if (!container.children[c]) return false;
      if (!containsSegmentGroup(container.children[c], containee.children[c], matrixParams)) {
        return false;
      }
    }
    return true;
  } else {
    const current = containeePaths.slice(0, container.segments.length);
    const next = containeePaths.slice(container.segments.length);
    if (!equalPath(container.segments, current)) return false;
    if (!matrixParamsMatch(container.segments, current, matrixParams)) return false;
    if (!container.children[PRIMARY_OUTLET]) return false;
    return containsSegmentGroupHelper(container.children[PRIMARY_OUTLET], containee, next, matrixParams);
  }
}
function matrixParamsMatch(containerPaths, containeePaths, options) {
  return containeePaths.every((containeeSegment, i) => {
    return paramCompareMap[options](containerPaths[i].parameters, containeeSegment.parameters);
  });
}
var UrlTree = class {
  root;
  queryParams;
  fragment;
  _queryParamMap;
  constructor(root = new UrlSegmentGroup([], {}), queryParams = {}, fragment = null) {
    this.root = root;
    this.queryParams = queryParams;
    this.fragment = fragment;
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      if (root.segments.length > 0) {
        throw new RuntimeError(4015, "The root `UrlSegmentGroup` should not contain `segments`. Instead, these segments belong in the `children` so they can be associated with a named outlet.");
      }
    }
  }
  get queryParamMap() {
    this._queryParamMap ??= convertToParamMap(this.queryParams);
    return this._queryParamMap;
  }
  toString() {
    return DEFAULT_SERIALIZER.serialize(this);
  }
};
var UrlSegmentGroup = class {
  segments;
  children;
  parent = null;
  constructor(segments, children) {
    this.segments = segments;
    this.children = children;
    Object.values(children).forEach((v) => v.parent = this);
  }
  hasChildren() {
    return this.numberOfChildren > 0;
  }
  get numberOfChildren() {
    return Object.keys(this.children).length;
  }
  toString() {
    return serializePaths(this);
  }
};
var UrlSegment = class {
  path;
  parameters;
  _parameterMap;
  constructor(path, parameters) {
    this.path = path;
    this.parameters = parameters;
  }
  get parameterMap() {
    this._parameterMap ??= convertToParamMap(this.parameters);
    return this._parameterMap;
  }
  toString() {
    return serializePath(this);
  }
};
function equalSegments(as, bs) {
  return equalPath(as, bs) && as.every((a, i) => shallowEqual(a.parameters, bs[i].parameters));
}
function equalPath(as, bs) {
  if (as.length !== bs.length) return false;
  return as.every((a, i) => a.path === bs[i].path);
}
function mapChildrenIntoArray(segment, fn) {
  let res = [];
  Object.entries(segment.children).forEach(([childOutlet, child]) => {
    if (childOutlet === PRIMARY_OUTLET) {
      res = res.concat(fn(child, childOutlet));
    }
  });
  Object.entries(segment.children).forEach(([childOutlet, child]) => {
    if (childOutlet !== PRIMARY_OUTLET) {
      res = res.concat(fn(child, childOutlet));
    }
  });
  return res;
}
var UrlSerializer = class _UrlSerializer {
  static \u0275fac = function UrlSerializer_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UrlSerializer)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _UrlSerializer,
    factory: () => (() => new DefaultUrlSerializer())(),
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UrlSerializer, [{
    type: Injectable,
    args: [{
      providedIn: "root",
      useFactory: () => new DefaultUrlSerializer()
    }]
  }], null, null);
})();
var DefaultUrlSerializer = class {
  parse(url) {
    const p = new UrlParser(url);
    return new UrlTree(p.parseRootSegment(), p.parseQueryParams(), p.parseFragment());
  }
  serialize(tree2) {
    const segment = `/${serializeSegment(tree2.root, true)}`;
    const query = serializeQueryParams(tree2.queryParams);
    const fragment = typeof tree2.fragment === `string` ? `#${encodeUriFragment(tree2.fragment)}` : "";
    return `${segment}${query}${fragment}`;
  }
};
var DEFAULT_SERIALIZER = new DefaultUrlSerializer();
function serializePaths(segment) {
  return segment.segments.map((p) => serializePath(p)).join("/");
}
function serializeSegment(segment, root) {
  if (!segment.hasChildren()) {
    return serializePaths(segment);
  }
  if (root) {
    const primary = segment.children[PRIMARY_OUTLET] ? serializeSegment(segment.children[PRIMARY_OUTLET], false) : "";
    const children = [];
    Object.entries(segment.children).forEach(([k, v]) => {
      if (k !== PRIMARY_OUTLET) {
        children.push(`${k}:${serializeSegment(v, false)}`);
      }
    });
    return children.length > 0 ? `${primary}(${children.join("//")})` : primary;
  } else {
    const children = mapChildrenIntoArray(segment, (v, k) => {
      if (k === PRIMARY_OUTLET) {
        return [serializeSegment(segment.children[PRIMARY_OUTLET], false)];
      }
      return [`${k}:${serializeSegment(v, false)}`];
    });
    if (Object.keys(segment.children).length === 1 && segment.children[PRIMARY_OUTLET] != null) {
      return `${serializePaths(segment)}/${children[0]}`;
    }
    return `${serializePaths(segment)}/(${children.join("//")})`;
  }
}
function encodeUriString(s) {
  return encodeURIComponent(s).replace(/%40/g, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",");
}
function encodeUriQuery(s) {
  return encodeUriString(s).replace(/%3B/gi, ";");
}
function encodeUriFragment(s) {
  return encodeURI(s);
}
function encodeUriSegment(s) {
  return encodeUriString(s).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/%26/gi, "&");
}
function decode(s) {
  return decodeURIComponent(s);
}
function decodeQuery(s) {
  return decode(s.replace(/\+/g, "%20"));
}
function serializePath(path) {
  return `${encodeUriSegment(path.path)}${serializeMatrixParams(path.parameters)}`;
}
function serializeMatrixParams(params) {
  return Object.entries(params).map(([key, value]) => `;${encodeUriSegment(key)}=${encodeUriSegment(value)}`).join("");
}
function serializeQueryParams(params) {
  const strParams = Object.entries(params).map(([name, value]) => {
    return Array.isArray(value) ? value.map((v) => `${encodeUriQuery(name)}=${encodeUriQuery(v)}`).join("&") : `${encodeUriQuery(name)}=${encodeUriQuery(value)}`;
  }).filter((s) => s);
  return strParams.length ? `?${strParams.join("&")}` : "";
}
var SEGMENT_RE = /^[^\/()?;#]+/;
function matchSegments(str) {
  const match2 = str.match(SEGMENT_RE);
  return match2 ? match2[0] : "";
}
var MATRIX_PARAM_SEGMENT_RE = /^[^\/()?;=#]+/;
function matchMatrixKeySegments(str) {
  const match2 = str.match(MATRIX_PARAM_SEGMENT_RE);
  return match2 ? match2[0] : "";
}
var QUERY_PARAM_RE = /^[^=?&#]+/;
function matchQueryParams(str) {
  const match2 = str.match(QUERY_PARAM_RE);
  return match2 ? match2[0] : "";
}
var QUERY_PARAM_VALUE_RE = /^[^&#]+/;
function matchUrlQueryParamValue(str) {
  const match2 = str.match(QUERY_PARAM_VALUE_RE);
  return match2 ? match2[0] : "";
}
var UrlParser = class {
  url;
  remaining;
  constructor(url) {
    this.url = url;
    this.remaining = url;
  }
  parseRootSegment() {
    this.consumeOptional("/");
    if (this.remaining === "" || this.peekStartsWith("?") || this.peekStartsWith("#")) {
      return new UrlSegmentGroup([], {});
    }
    return new UrlSegmentGroup([], this.parseChildren());
  }
  parseQueryParams() {
    const params = {};
    if (this.consumeOptional("?")) {
      do {
        this.parseQueryParam(params);
      } while (this.consumeOptional("&"));
    }
    return params;
  }
  parseFragment() {
    return this.consumeOptional("#") ? decodeURIComponent(this.remaining) : null;
  }
  parseChildren(depth = 0) {
    if (depth > 50) {
      throw new RuntimeError(4010, (typeof ngDevMode === "undefined" || ngDevMode) && "URL is too deep");
    }
    if (this.remaining === "") {
      return {};
    }
    this.consumeOptional("/");
    const segments = [];
    if (!this.peekStartsWith("(")) {
      segments.push(this.parseSegment());
    }
    while (this.peekStartsWith("/") && !this.peekStartsWith("//") && !this.peekStartsWith("/(")) {
      this.capture("/");
      segments.push(this.parseSegment());
    }
    let children = {};
    if (this.peekStartsWith("/(")) {
      this.capture("/");
      children = this.parseParens(true, depth);
    }
    let res = {};
    if (this.peekStartsWith("(")) {
      res = this.parseParens(false, depth);
    }
    if (segments.length > 0 || Object.keys(children).length > 0) {
      res[PRIMARY_OUTLET] = new UrlSegmentGroup(segments, children);
    }
    return res;
  }
  parseSegment() {
    const path = matchSegments(this.remaining);
    if (path === "" && this.peekStartsWith(";")) {
      throw new RuntimeError(4009, (typeof ngDevMode === "undefined" || ngDevMode) && `Empty path url segment cannot have parameters: '${this.remaining}'.`);
    }
    this.capture(path);
    return new UrlSegment(decode(path), this.parseMatrixParams());
  }
  parseMatrixParams() {
    const params = {};
    while (this.consumeOptional(";")) {
      this.parseParam(params);
    }
    return params;
  }
  parseParam(params) {
    const key = matchMatrixKeySegments(this.remaining);
    if (!key) {
      return;
    }
    this.capture(key);
    let value = "";
    if (this.consumeOptional("=")) {
      const valueMatch = matchSegments(this.remaining);
      if (valueMatch) {
        value = valueMatch;
        this.capture(value);
      }
    }
    params[decode(key)] = decode(value);
  }
  parseQueryParam(params) {
    const key = matchQueryParams(this.remaining);
    if (!key) {
      return;
    }
    this.capture(key);
    let value = "";
    if (this.consumeOptional("=")) {
      const valueMatch = matchUrlQueryParamValue(this.remaining);
      if (valueMatch) {
        value = valueMatch;
        this.capture(value);
      }
    }
    const decodedKey = decodeQuery(key);
    const decodedVal = decodeQuery(value);
    if (params.hasOwnProperty(decodedKey)) {
      let currentVal = params[decodedKey];
      if (!Array.isArray(currentVal)) {
        currentVal = [currentVal];
        params[decodedKey] = currentVal;
      }
      currentVal.push(decodedVal);
    } else {
      params[decodedKey] = decodedVal;
    }
  }
  parseParens(allowPrimary, depth) {
    const segments = {};
    this.capture("(");
    while (!this.consumeOptional(")") && this.remaining.length > 0) {
      const path = matchSegments(this.remaining);
      const next = this.remaining[path.length];
      if (next !== "/" && next !== ")" && next !== ";") {
        throw new RuntimeError(4010, (typeof ngDevMode === "undefined" || ngDevMode) && `Cannot parse url '${this.url}'`);
      }
      let outletName;
      if (path.indexOf(":") > -1) {
        outletName = path.slice(0, path.indexOf(":"));
        this.capture(outletName);
        this.capture(":");
      } else if (allowPrimary) {
        outletName = PRIMARY_OUTLET;
      }
      const children = this.parseChildren(depth + 1);
      segments[outletName ?? PRIMARY_OUTLET] = Object.keys(children).length === 1 && children[PRIMARY_OUTLET] ? children[PRIMARY_OUTLET] : new UrlSegmentGroup([], children);
      this.consumeOptional("//");
    }
    return segments;
  }
  peekStartsWith(str) {
    return this.remaining.startsWith(str);
  }
  consumeOptional(str) {
    if (this.peekStartsWith(str)) {
      this.remaining = this.remaining.substring(str.length);
      return true;
    }
    return false;
  }
  capture(str) {
    if (!this.consumeOptional(str)) {
      throw new RuntimeError(4011, (typeof ngDevMode === "undefined" || ngDevMode) && `Expected "${str}".`);
    }
  }
};
function createRoot(rootCandidate) {
  return rootCandidate.segments.length > 0 ? new UrlSegmentGroup([], {
    [PRIMARY_OUTLET]: rootCandidate
  }) : rootCandidate;
}
function squashSegmentGroup(segmentGroup) {
  const newChildren = {};
  for (const [childOutlet, child] of Object.entries(segmentGroup.children)) {
    const childCandidate = squashSegmentGroup(child);
    if (childOutlet === PRIMARY_OUTLET && childCandidate.segments.length === 0 && childCandidate.hasChildren()) {
      for (const [grandChildOutlet, grandChild] of Object.entries(childCandidate.children)) {
        newChildren[grandChildOutlet] = grandChild;
      }
    } else if (childCandidate.segments.length > 0 || childCandidate.hasChildren()) {
      newChildren[childOutlet] = childCandidate;
    }
  }
  const s = new UrlSegmentGroup(segmentGroup.segments, newChildren);
  return mergeTrivialChildren(s);
}
function mergeTrivialChildren(s) {
  if (s.numberOfChildren === 1 && s.children[PRIMARY_OUTLET]) {
    const c = s.children[PRIMARY_OUTLET];
    return new UrlSegmentGroup(s.segments.concat(c.segments), c.children);
  }
  return s;
}
function isUrlTree(v) {
  return v instanceof UrlTree;
}
function createUrlTreeFromSnapshot(relativeTo, commands, queryParams = null, fragment = null, urlSerializer = new DefaultUrlSerializer()) {
  const relativeToUrlSegmentGroup = createSegmentGroupFromRoute(relativeTo);
  return createUrlTreeFromSegmentGroup(relativeToUrlSegmentGroup, commands, queryParams, fragment, urlSerializer);
}
function createSegmentGroupFromRoute(route) {
  let targetGroup;
  function createSegmentGroupFromRouteRecursive(currentRoute) {
    const childOutlets = {};
    for (const childSnapshot of currentRoute.children) {
      const root = createSegmentGroupFromRouteRecursive(childSnapshot);
      childOutlets[childSnapshot.outlet] = root;
    }
    const segmentGroup = new UrlSegmentGroup(currentRoute.url, childOutlets);
    if (currentRoute === route) {
      targetGroup = segmentGroup;
    }
    return segmentGroup;
  }
  const rootCandidate = createSegmentGroupFromRouteRecursive(route.root);
  const rootSegmentGroup = createRoot(rootCandidate);
  return targetGroup ?? rootSegmentGroup;
}
function createUrlTreeFromSegmentGroup(relativeTo, commands, queryParams, fragment, urlSerializer) {
  let root = relativeTo;
  while (root.parent) {
    root = root.parent;
  }
  if (commands.length === 0) {
    return tree(root, root, root, queryParams, fragment, urlSerializer);
  }
  const nav = computeNavigation(commands);
  if (nav.toRoot()) {
    return tree(root, root, new UrlSegmentGroup([], {}), queryParams, fragment, urlSerializer);
  }
  const position = findStartingPositionForTargetGroup(nav, root, relativeTo);
  const newSegmentGroup = position.processChildren ? updateSegmentGroupChildren(position.segmentGroup, position.index, nav.commands) : updateSegmentGroup(position.segmentGroup, position.index, nav.commands);
  return tree(root, position.segmentGroup, newSegmentGroup, queryParams, fragment, urlSerializer);
}
function isMatrixParams(command) {
  return typeof command === "object" && command != null && !command.outlets && !command.segmentPath;
}
function isCommandWithOutlets(command) {
  return typeof command === "object" && command != null && command.outlets;
}
function normalizeQueryParams(k, v, urlSerializer) {
  k ||= "\u0275";
  const tree2 = new UrlTree();
  tree2.queryParams = {
    [k]: v
  };
  return urlSerializer.parse(urlSerializer.serialize(tree2)).queryParams[k];
}
function tree(oldRoot, oldSegmentGroup, newSegmentGroup, queryParams, fragment, urlSerializer) {
  const qp = {};
  for (const [key, value] of Object.entries(queryParams ?? {})) {
    qp[key] = Array.isArray(value) ? value.map((v) => normalizeQueryParams(key, v, urlSerializer)) : normalizeQueryParams(key, value, urlSerializer);
  }
  let rootCandidate;
  if (oldRoot === oldSegmentGroup) {
    rootCandidate = newSegmentGroup;
  } else {
    rootCandidate = replaceSegment(oldRoot, oldSegmentGroup, newSegmentGroup);
  }
  const newRoot = createRoot(squashSegmentGroup(rootCandidate));
  return new UrlTree(newRoot, qp, fragment);
}
function replaceSegment(current, oldSegment, newSegment) {
  const children = {};
  Object.entries(current.children).forEach(([outletName, c]) => {
    if (c === oldSegment) {
      children[outletName] = newSegment;
    } else {
      children[outletName] = replaceSegment(c, oldSegment, newSegment);
    }
  });
  return new UrlSegmentGroup(current.segments, children);
}
var Navigation = class {
  isAbsolute;
  numberOfDoubleDots;
  commands;
  constructor(isAbsolute, numberOfDoubleDots, commands) {
    this.isAbsolute = isAbsolute;
    this.numberOfDoubleDots = numberOfDoubleDots;
    this.commands = commands;
    if (isAbsolute && commands.length > 0 && isMatrixParams(commands[0])) {
      throw new RuntimeError(4003, (typeof ngDevMode === "undefined" || ngDevMode) && "Root segment cannot have matrix parameters");
    }
    const cmdWithOutlet = commands.find(isCommandWithOutlets);
    if (cmdWithOutlet && cmdWithOutlet !== last(commands)) {
      throw new RuntimeError(4004, (typeof ngDevMode === "undefined" || ngDevMode) && "{outlets:{}} has to be the last command");
    }
  }
  toRoot() {
    return this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/";
  }
};
function computeNavigation(commands) {
  if (typeof commands[0] === "string" && commands.length === 1 && commands[0] === "/") {
    return new Navigation(true, 0, commands);
  }
  let numberOfDoubleDots = 0;
  let isAbsolute = false;
  const res = commands.reduce((res2, cmd, cmdIdx) => {
    if (typeof cmd === "object" && cmd != null) {
      if (cmd.outlets) {
        const outlets = {};
        Object.entries(cmd.outlets).forEach(([name, commands2]) => {
          outlets[name] = typeof commands2 === "string" ? commands2.split("/") : commands2;
        });
        return [...res2, {
          outlets
        }];
      }
      if (cmd.segmentPath) {
        return [...res2, cmd.segmentPath];
      }
    }
    if (!(typeof cmd === "string")) {
      return [...res2, cmd];
    }
    if (cmdIdx === 0) {
      cmd.split("/").forEach((urlPart, partIndex) => {
        if (partIndex == 0 && urlPart === ".") ;
        else if (partIndex == 0 && urlPart === "") {
          isAbsolute = true;
        } else if (urlPart === "..") {
          numberOfDoubleDots++;
        } else if (urlPart != "") {
          res2.push(urlPart);
        }
      });
      return res2;
    }
    return [...res2, cmd];
  }, []);
  return new Navigation(isAbsolute, numberOfDoubleDots, res);
}
var Position = class {
  segmentGroup;
  processChildren;
  index;
  constructor(segmentGroup, processChildren, index) {
    this.segmentGroup = segmentGroup;
    this.processChildren = processChildren;
    this.index = index;
  }
};
function findStartingPositionForTargetGroup(nav, root, target) {
  if (nav.isAbsolute) {
    return new Position(root, true, 0);
  }
  if (!target) {
    return new Position(root, false, NaN);
  }
  if (target.parent === null) {
    return new Position(target, true, 0);
  }
  const modifier = isMatrixParams(nav.commands[0]) ? 0 : 1;
  const index = target.segments.length - 1 + modifier;
  return createPositionApplyingDoubleDots(target, index, nav.numberOfDoubleDots);
}
function createPositionApplyingDoubleDots(group, index, numberOfDoubleDots) {
  let g = group;
  let ci = index;
  let dd = numberOfDoubleDots;
  while (dd > ci) {
    dd -= ci;
    g = g.parent;
    if (!g) {
      throw new RuntimeError(4005, (typeof ngDevMode === "undefined" || ngDevMode) && "Invalid number of '../'");
    }
    ci = g.segments.length;
  }
  return new Position(g, false, ci - dd);
}
function getOutlets(commands) {
  if (isCommandWithOutlets(commands[0])) {
    return commands[0].outlets;
  }
  return {
    [PRIMARY_OUTLET]: commands
  };
}
function updateSegmentGroup(segmentGroup, startIndex, commands) {
  segmentGroup ??= new UrlSegmentGroup([], {});
  if (segmentGroup.segments.length === 0 && segmentGroup.hasChildren()) {
    return updateSegmentGroupChildren(segmentGroup, startIndex, commands);
  }
  const m = prefixedWith(segmentGroup, startIndex, commands);
  const slicedCommands = commands.slice(m.commandIndex);
  if (m.match && m.pathIndex < segmentGroup.segments.length) {
    const g = new UrlSegmentGroup(segmentGroup.segments.slice(0, m.pathIndex), {});
    g.children[PRIMARY_OUTLET] = new UrlSegmentGroup(segmentGroup.segments.slice(m.pathIndex), segmentGroup.children);
    return updateSegmentGroupChildren(g, 0, slicedCommands);
  } else if (m.match && slicedCommands.length === 0) {
    return new UrlSegmentGroup(segmentGroup.segments, {});
  } else if (m.match && !segmentGroup.hasChildren()) {
    return createNewSegmentGroup(segmentGroup, startIndex, commands);
  } else if (m.match) {
    return updateSegmentGroupChildren(segmentGroup, 0, slicedCommands);
  } else {
    return createNewSegmentGroup(segmentGroup, startIndex, commands);
  }
}
function updateSegmentGroupChildren(segmentGroup, startIndex, commands) {
  if (commands.length === 0) {
    return new UrlSegmentGroup(segmentGroup.segments, {});
  } else {
    const outlets = getOutlets(commands);
    const children = {};
    if (Object.keys(outlets).some((o) => o !== PRIMARY_OUTLET) && segmentGroup.children[PRIMARY_OUTLET] && segmentGroup.numberOfChildren === 1 && segmentGroup.children[PRIMARY_OUTLET].segments.length === 0) {
      const childrenOfEmptyChild = updateSegmentGroupChildren(segmentGroup.children[PRIMARY_OUTLET], startIndex, commands);
      return new UrlSegmentGroup(segmentGroup.segments, childrenOfEmptyChild.children);
    }
    Object.entries(outlets).forEach(([outlet, commands2]) => {
      if (typeof commands2 === "string") {
        commands2 = [commands2];
      }
      if (commands2 !== null) {
        children[outlet] = updateSegmentGroup(segmentGroup.children[outlet], startIndex, commands2);
      }
    });
    Object.entries(segmentGroup.children).forEach(([childOutlet, child]) => {
      if (outlets[childOutlet] === void 0) {
        children[childOutlet] = child;
      }
    });
    return new UrlSegmentGroup(segmentGroup.segments, children);
  }
}
function prefixedWith(segmentGroup, startIndex, commands) {
  let currentCommandIndex = 0;
  let currentPathIndex = startIndex;
  const noMatch2 = {
    match: false,
    pathIndex: 0,
    commandIndex: 0
  };
  while (currentPathIndex < segmentGroup.segments.length) {
    if (currentCommandIndex >= commands.length) return noMatch2;
    const path = segmentGroup.segments[currentPathIndex];
    const command = commands[currentCommandIndex];
    if (isCommandWithOutlets(command)) {
      break;
    }
    const curr = `${command}`;
    const next = currentCommandIndex < commands.length - 1 ? commands[currentCommandIndex + 1] : null;
    if (currentPathIndex > 0 && curr === void 0) break;
    if (curr && next && typeof next === "object" && next.outlets === void 0) {
      if (!compare(curr, next, path)) return noMatch2;
      currentCommandIndex += 2;
    } else {
      if (!compare(curr, {}, path)) return noMatch2;
      currentCommandIndex++;
    }
    currentPathIndex++;
  }
  return {
    match: true,
    pathIndex: currentPathIndex,
    commandIndex: currentCommandIndex
  };
}
function createNewSegmentGroup(segmentGroup, startIndex, commands) {
  const paths = segmentGroup.segments.slice(0, startIndex);
  let i = 0;
  while (i < commands.length) {
    const command = commands[i];
    if (isCommandWithOutlets(command)) {
      const children = createNewSegmentChildren(command.outlets);
      return new UrlSegmentGroup(paths, children);
    }
    if (i === 0 && isMatrixParams(commands[0])) {
      const p = segmentGroup.segments[startIndex];
      paths.push(new UrlSegment(p.path, stringify(commands[0])));
      i++;
      continue;
    }
    const curr = isCommandWithOutlets(command) ? command.outlets[PRIMARY_OUTLET] : `${command}`;
    const next = i < commands.length - 1 ? commands[i + 1] : null;
    if (curr && next && isMatrixParams(next)) {
      paths.push(new UrlSegment(curr, stringify(next)));
      i += 2;
    } else {
      paths.push(new UrlSegment(curr, {}));
      i++;
    }
  }
  return new UrlSegmentGroup(paths, {});
}
function createNewSegmentChildren(outlets) {
  const children = {};
  Object.entries(outlets).forEach(([outlet, commands]) => {
    if (typeof commands === "string") {
      commands = [commands];
    }
    if (commands !== null) {
      children[outlet] = createNewSegmentGroup(new UrlSegmentGroup([], {}), 0, commands);
    }
  });
  return children;
}
function stringify(params) {
  const res = {};
  Object.entries(params).forEach(([k, v]) => res[k] = `${v}`);
  return res;
}
function compare(path, params, segment) {
  return path == segment.path && shallowEqual(params, segment.parameters);
}
var IMPERATIVE_NAVIGATION = "imperative";
var EventType;
(function(EventType2) {
  EventType2[EventType2["NavigationStart"] = 0] = "NavigationStart";
  EventType2[EventType2["NavigationEnd"] = 1] = "NavigationEnd";
  EventType2[EventType2["NavigationCancel"] = 2] = "NavigationCancel";
  EventType2[EventType2["NavigationError"] = 3] = "NavigationError";
  EventType2[EventType2["RoutesRecognized"] = 4] = "RoutesRecognized";
  EventType2[EventType2["ResolveStart"] = 5] = "ResolveStart";
  EventType2[EventType2["ResolveEnd"] = 6] = "ResolveEnd";
  EventType2[EventType2["GuardsCheckStart"] = 7] = "GuardsCheckStart";
  EventType2[EventType2["GuardsCheckEnd"] = 8] = "GuardsCheckEnd";
  EventType2[EventType2["RouteConfigLoadStart"] = 9] = "RouteConfigLoadStart";
  EventType2[EventType2["RouteConfigLoadEnd"] = 10] = "RouteConfigLoadEnd";
  EventType2[EventType2["ChildActivationStart"] = 11] = "ChildActivationStart";
  EventType2[EventType2["ChildActivationEnd"] = 12] = "ChildActivationEnd";
  EventType2[EventType2["ActivationStart"] = 13] = "ActivationStart";
  EventType2[EventType2["ActivationEnd"] = 14] = "ActivationEnd";
  EventType2[EventType2["Scroll"] = 15] = "Scroll";
  EventType2[EventType2["NavigationSkipped"] = 16] = "NavigationSkipped";
})(EventType || (EventType = {}));
var RouterEvent = class {
  id;
  url;
  constructor(id, url) {
    this.id = id;
    this.url = url;
  }
};
var NavigationStart = class extends RouterEvent {
  type = EventType.NavigationStart;
  navigationTrigger;
  restoredState;
  constructor(id, url, navigationTrigger = "imperative", restoredState = null) {
    super(id, url);
    this.navigationTrigger = navigationTrigger;
    this.restoredState = restoredState;
  }
  toString() {
    return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
  }
};
var NavigationEnd = class extends RouterEvent {
  urlAfterRedirects;
  type = EventType.NavigationEnd;
  constructor(id, url, urlAfterRedirects) {
    super(id, url);
    this.urlAfterRedirects = urlAfterRedirects;
  }
  toString() {
    return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
  }
};
var NavigationCancellationCode;
(function(NavigationCancellationCode2) {
  NavigationCancellationCode2[NavigationCancellationCode2["Redirect"] = 0] = "Redirect";
  NavigationCancellationCode2[NavigationCancellationCode2["SupersededByNewNavigation"] = 1] = "SupersededByNewNavigation";
  NavigationCancellationCode2[NavigationCancellationCode2["NoDataFromResolver"] = 2] = "NoDataFromResolver";
  NavigationCancellationCode2[NavigationCancellationCode2["GuardRejected"] = 3] = "GuardRejected";
  NavigationCancellationCode2[NavigationCancellationCode2["Aborted"] = 4] = "Aborted";
})(NavigationCancellationCode || (NavigationCancellationCode = {}));
var NavigationSkippedCode;
(function(NavigationSkippedCode2) {
  NavigationSkippedCode2[NavigationSkippedCode2["IgnoredSameUrlNavigation"] = 0] = "IgnoredSameUrlNavigation";
  NavigationSkippedCode2[NavigationSkippedCode2["IgnoredByUrlHandlingStrategy"] = 1] = "IgnoredByUrlHandlingStrategy";
})(NavigationSkippedCode || (NavigationSkippedCode = {}));
var NavigationCancel = class extends RouterEvent {
  reason;
  code;
  type = EventType.NavigationCancel;
  constructor(id, url, reason, code) {
    super(id, url);
    this.reason = reason;
    this.code = code;
  }
  toString() {
    return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
  }
};
function isRedirectingEvent(event) {
  return event instanceof NavigationCancel && (event.code === NavigationCancellationCode.Redirect || event.code === NavigationCancellationCode.SupersededByNewNavigation);
}
var NavigationSkipped = class extends RouterEvent {
  reason;
  code;
  type = EventType.NavigationSkipped;
  constructor(id, url, reason, code) {
    super(id, url);
    this.reason = reason;
    this.code = code;
  }
};
var NavigationError = class extends RouterEvent {
  error;
  target;
  type = EventType.NavigationError;
  constructor(id, url, error, target) {
    super(id, url);
    this.error = error;
    this.target = target;
  }
  toString() {
    return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
  }
};
var RoutesRecognized = class extends RouterEvent {
  urlAfterRedirects;
  state;
  type = EventType.RoutesRecognized;
  constructor(id, url, urlAfterRedirects, state) {
    super(id, url);
    this.urlAfterRedirects = urlAfterRedirects;
    this.state = state;
  }
  toString() {
    return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
  }
};
var GuardsCheckStart = class extends RouterEvent {
  urlAfterRedirects;
  state;
  type = EventType.GuardsCheckStart;
  constructor(id, url, urlAfterRedirects, state) {
    super(id, url);
    this.urlAfterRedirects = urlAfterRedirects;
    this.state = state;
  }
  toString() {
    return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
  }
};
var GuardsCheckEnd = class extends RouterEvent {
  urlAfterRedirects;
  state;
  shouldActivate;
  type = EventType.GuardsCheckEnd;
  constructor(id, url, urlAfterRedirects, state, shouldActivate) {
    super(id, url);
    this.urlAfterRedirects = urlAfterRedirects;
    this.state = state;
    this.shouldActivate = shouldActivate;
  }
  toString() {
    return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
  }
};
var ResolveStart = class extends RouterEvent {
  urlAfterRedirects;
  state;
  type = EventType.ResolveStart;
  constructor(id, url, urlAfterRedirects, state) {
    super(id, url);
    this.urlAfterRedirects = urlAfterRedirects;
    this.state = state;
  }
  toString() {
    return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
  }
};
var ResolveEnd = class extends RouterEvent {
  urlAfterRedirects;
  state;
  type = EventType.ResolveEnd;
  constructor(id, url, urlAfterRedirects, state) {
    super(id, url);
    this.urlAfterRedirects = urlAfterRedirects;
    this.state = state;
  }
  toString() {
    return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
  }
};
var RouteConfigLoadStart = class {
  route;
  type = EventType.RouteConfigLoadStart;
  constructor(route) {
    this.route = route;
  }
  toString() {
    return `RouteConfigLoadStart(path: ${this.route.path})`;
  }
};
var RouteConfigLoadEnd = class {
  route;
  type = EventType.RouteConfigLoadEnd;
  constructor(route) {
    this.route = route;
  }
  toString() {
    return `RouteConfigLoadEnd(path: ${this.route.path})`;
  }
};
var ChildActivationStart = class {
  snapshot;
  type = EventType.ChildActivationStart;
  constructor(snapshot) {
    this.snapshot = snapshot;
  }
  toString() {
    const path = this.snapshot.routeConfig && this.snapshot.routeConfig.path || "";
    return `ChildActivationStart(path: '${path}')`;
  }
};
var ChildActivationEnd = class {
  snapshot;
  type = EventType.ChildActivationEnd;
  constructor(snapshot) {
    this.snapshot = snapshot;
  }
  toString() {
    const path = this.snapshot.routeConfig && this.snapshot.routeConfig.path || "";
    return `ChildActivationEnd(path: '${path}')`;
  }
};
var ActivationStart = class {
  snapshot;
  type = EventType.ActivationStart;
  constructor(snapshot) {
    this.snapshot = snapshot;
  }
  toString() {
    const path = this.snapshot.routeConfig && this.snapshot.routeConfig.path || "";
    return `ActivationStart(path: '${path}')`;
  }
};
var ActivationEnd = class {
  snapshot;
  type = EventType.ActivationEnd;
  constructor(snapshot) {
    this.snapshot = snapshot;
  }
  toString() {
    const path = this.snapshot.routeConfig && this.snapshot.routeConfig.path || "";
    return `ActivationEnd(path: '${path}')`;
  }
};
var Scroll = class {
  routerEvent;
  position;
  anchor;
  scrollBehavior;
  type = EventType.Scroll;
  constructor(routerEvent, position, anchor, scrollBehavior) {
    this.routerEvent = routerEvent;
    this.position = position;
    this.anchor = anchor;
    this.scrollBehavior = scrollBehavior;
  }
  toString() {
    const pos = this.position ? `${this.position[0]}, ${this.position[1]}` : null;
    return `Scroll(anchor: '${this.anchor}', position: '${pos}')`;
  }
};
var BeforeActivateRoutes = class {
};
var BeforeRoutesRecognized = class {
};
var RedirectRequest = class {
  url;
  navigationBehaviorOptions;
  constructor(url, navigationBehaviorOptions) {
    this.url = url;
    this.navigationBehaviorOptions = navigationBehaviorOptions;
  }
};
function isPublicRouterEvent(e) {
  return !(e instanceof BeforeActivateRoutes) && !(e instanceof RedirectRequest) && !(e instanceof BeforeRoutesRecognized);
}
function stringifyEvent(routerEvent) {
  switch (routerEvent.type) {
    case EventType.ActivationEnd:
      return `ActivationEnd(path: '${routerEvent.snapshot.routeConfig?.path || ""}')`;
    case EventType.ActivationStart:
      return `ActivationStart(path: '${routerEvent.snapshot.routeConfig?.path || ""}')`;
    case EventType.ChildActivationEnd:
      return `ChildActivationEnd(path: '${routerEvent.snapshot.routeConfig?.path || ""}')`;
    case EventType.ChildActivationStart:
      return `ChildActivationStart(path: '${routerEvent.snapshot.routeConfig?.path || ""}')`;
    case EventType.GuardsCheckEnd:
      return `GuardsCheckEnd(id: ${routerEvent.id}, url: '${routerEvent.url}', urlAfterRedirects: '${routerEvent.urlAfterRedirects}', state: ${routerEvent.state}, shouldActivate: ${routerEvent.shouldActivate})`;
    case EventType.GuardsCheckStart:
      return `GuardsCheckStart(id: ${routerEvent.id}, url: '${routerEvent.url}', urlAfterRedirects: '${routerEvent.urlAfterRedirects}', state: ${routerEvent.state})`;
    case EventType.NavigationCancel:
      return `NavigationCancel(id: ${routerEvent.id}, url: '${routerEvent.url}')`;
    case EventType.NavigationSkipped:
      return `NavigationSkipped(id: ${routerEvent.id}, url: '${routerEvent.url}')`;
    case EventType.NavigationEnd:
      return `NavigationEnd(id: ${routerEvent.id}, url: '${routerEvent.url}', urlAfterRedirects: '${routerEvent.urlAfterRedirects}')`;
    case EventType.NavigationError:
      return `NavigationError(id: ${routerEvent.id}, url: '${routerEvent.url}', error: ${routerEvent.error})`;
    case EventType.NavigationStart:
      return `NavigationStart(id: ${routerEvent.id}, url: '${routerEvent.url}')`;
    case EventType.ResolveEnd:
      return `ResolveEnd(id: ${routerEvent.id}, url: '${routerEvent.url}', urlAfterRedirects: '${routerEvent.urlAfterRedirects}', state: ${routerEvent.state})`;
    case EventType.ResolveStart:
      return `ResolveStart(id: ${routerEvent.id}, url: '${routerEvent.url}', urlAfterRedirects: '${routerEvent.urlAfterRedirects}', state: ${routerEvent.state})`;
    case EventType.RouteConfigLoadEnd:
      return `RouteConfigLoadEnd(path: ${routerEvent.route.path})`;
    case EventType.RouteConfigLoadStart:
      return `RouteConfigLoadStart(path: ${routerEvent.route.path})`;
    case EventType.RoutesRecognized:
      return `RoutesRecognized(id: ${routerEvent.id}, url: '${routerEvent.url}', urlAfterRedirects: '${routerEvent.urlAfterRedirects}', state: ${routerEvent.state})`;
    case EventType.Scroll:
      const pos = routerEvent.position ? `${routerEvent.position[0]}, ${routerEvent.position[1]}` : null;
      return `Scroll(anchor: '${routerEvent.anchor}', position: '${pos}')`;
  }
}
var OutletContext = class {
  rootInjector;
  outlet = null;
  route = null;
  children;
  attachRef = null;
  get injector() {
    return this.route?.snapshot._environmentInjector ?? this.rootInjector;
  }
  constructor(rootInjector) {
    this.rootInjector = rootInjector;
    this.children = new ChildrenOutletContexts(this.rootInjector);
  }
};
var ChildrenOutletContexts = class _ChildrenOutletContexts {
  rootInjector;
  contexts = /* @__PURE__ */ new Map();
  constructor(rootInjector) {
    this.rootInjector = rootInjector;
  }
  onChildOutletCreated(childName, outlet) {
    const context = this.getOrCreateContext(childName);
    context.outlet = outlet;
    this.contexts.set(childName, context);
  }
  onChildOutletDestroyed(childName) {
    const context = this.getContext(childName);
    if (context) {
      context.outlet = null;
      context.attachRef = null;
    }
  }
  onOutletDeactivated() {
    const contexts = this.contexts;
    this.contexts = /* @__PURE__ */ new Map();
    return contexts;
  }
  onOutletReAttached(contexts) {
    this.contexts = contexts;
  }
  getOrCreateContext(childName) {
    let context = this.getContext(childName);
    if (!context) {
      context = new OutletContext(this.rootInjector);
      this.contexts.set(childName, context);
    }
    return context;
  }
  getContext(childName) {
    return this.contexts.get(childName) || null;
  }
  static \u0275fac = function ChildrenOutletContexts_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ChildrenOutletContexts)(\u0275\u0275inject(EnvironmentInjector));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _ChildrenOutletContexts,
    factory: _ChildrenOutletContexts.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ChildrenOutletContexts, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: EnvironmentInjector
  }], null);
})();
var Tree = class {
  _root;
  constructor(root) {
    this._root = root;
  }
  get root() {
    return this._root.value;
  }
  parent(t) {
    const p = this.pathFromRoot(t);
    return p.length > 1 ? p[p.length - 2] : null;
  }
  children(t) {
    const n = findNode(t, this._root);
    return n ? n.children.map((t2) => t2.value) : [];
  }
  firstChild(t) {
    const n = findNode(t, this._root);
    return n && n.children.length > 0 ? n.children[0].value : null;
  }
  siblings(t) {
    const p = findPath(t, this._root);
    if (p.length < 2) return [];
    const c = p[p.length - 2].children.map((c2) => c2.value);
    return c.filter((cc) => cc !== t);
  }
  pathFromRoot(t) {
    return findPath(t, this._root).map((s) => s.value);
  }
};
function findNode(value, node) {
  if (value === node.value) return node;
  for (const child of node.children) {
    const node2 = findNode(value, child);
    if (node2) return node2;
  }
  return null;
}
function findPath(value, node) {
  if (value === node.value) return [node];
  for (const child of node.children) {
    const path = findPath(value, child);
    if (path.length) {
      path.unshift(node);
      return path;
    }
  }
  return [];
}
var TreeNode = class {
  value;
  children;
  constructor(value, children) {
    this.value = value;
    this.children = children;
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function nodeChildrenAsMap(node) {
  const map2 = {};
  if (node) {
    node.children.forEach((child) => map2[child.value.outlet] = child);
  }
  return map2;
}
var RouterState = class extends Tree {
  snapshot;
  constructor(root, snapshot) {
    super(root);
    this.snapshot = snapshot;
    setRouterState(this, root);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function createEmptyState(rootComponent, injector) {
  const snapshot = createEmptyStateSnapshot(rootComponent, injector);
  const emptyUrl = new BehaviorSubject([new UrlSegment("", {})]);
  const emptyParams = new BehaviorSubject({});
  const emptyData = new BehaviorSubject({});
  const emptyQueryParams = new BehaviorSubject({});
  const fragment = new BehaviorSubject("");
  const activated = new ActivatedRoute(emptyUrl, emptyParams, emptyQueryParams, fragment, emptyData, PRIMARY_OUTLET, rootComponent, snapshot.root);
  activated.snapshot = snapshot.root;
  return new RouterState(new TreeNode(activated, []), snapshot);
}
function createEmptyStateSnapshot(rootComponent, injector) {
  const emptyParams = {};
  const emptyData = {};
  const emptyQueryParams = {};
  const fragment = "";
  const activated = new ActivatedRouteSnapshot([], emptyParams, emptyQueryParams, fragment, emptyData, PRIMARY_OUTLET, rootComponent, null, {}, injector);
  return new RouterStateSnapshot("", new TreeNode(activated, []));
}
var ActivatedRoute = class {
  urlSubject;
  paramsSubject;
  queryParamsSubject;
  fragmentSubject;
  dataSubject;
  outlet;
  component;
  snapshot;
  _futureSnapshot;
  _routerState;
  _paramMap;
  _queryParamMap;
  title;
  url;
  params;
  queryParams;
  fragment;
  data;
  constructor(urlSubject, paramsSubject, queryParamsSubject, fragmentSubject, dataSubject, outlet, component, futureSnapshot) {
    this.urlSubject = urlSubject;
    this.paramsSubject = paramsSubject;
    this.queryParamsSubject = queryParamsSubject;
    this.fragmentSubject = fragmentSubject;
    this.dataSubject = dataSubject;
    this.outlet = outlet;
    this.component = component;
    this._futureSnapshot = futureSnapshot;
    this.title = this.dataSubject?.pipe(map((d) => d[RouteTitleKey])) ?? of(void 0);
    this.url = urlSubject;
    this.params = paramsSubject;
    this.queryParams = queryParamsSubject;
    this.fragment = fragmentSubject;
    this.data = dataSubject;
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    this._paramMap ??= this.params.pipe(map((p) => convertToParamMap(p)));
    return this._paramMap;
  }
  get queryParamMap() {
    this._queryParamMap ??= this.queryParams.pipe(map((p) => convertToParamMap(p)));
    return this._queryParamMap;
  }
  toString() {
    return this.snapshot ? this.snapshot.toString() : `Future(${this._futureSnapshot})`;
  }
};
function getInherited(route, parent, paramsInheritanceStrategy = "emptyOnly") {
  let inherited;
  const {
    routeConfig
  } = route;
  if (parent !== null && (paramsInheritanceStrategy === "always" || routeConfig?.path === "" || !parent.component && !parent.routeConfig?.loadComponent)) {
    inherited = {
      params: __spreadValues(__spreadValues({}, parent.params), route.params),
      data: __spreadValues(__spreadValues({}, parent.data), route.data),
      resolve: __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, route.data), parent.data), routeConfig?.data), route._resolvedData)
    };
  } else {
    inherited = {
      params: __spreadValues({}, route.params),
      data: __spreadValues({}, route.data),
      resolve: __spreadValues(__spreadValues({}, route.data), route._resolvedData ?? {})
    };
  }
  if (routeConfig && hasStaticTitle(routeConfig)) {
    inherited.resolve[RouteTitleKey] = routeConfig.title;
  }
  return inherited;
}
var ActivatedRouteSnapshot = class {
  url;
  params;
  queryParams;
  fragment;
  data;
  outlet;
  component;
  routeConfig;
  _resolve;
  _resolvedData;
  _routerState;
  _paramMap;
  _queryParamMap;
  _environmentInjector;
  get title() {
    return this.data?.[RouteTitleKey];
  }
  constructor(url, params, queryParams, fragment, data, outlet, component, routeConfig, resolve, environmentInjector) {
    this.url = url;
    this.params = params;
    this.queryParams = queryParams;
    this.fragment = fragment;
    this.data = data;
    this.outlet = outlet;
    this.component = component;
    this.routeConfig = routeConfig;
    this._resolve = resolve;
    this._environmentInjector = environmentInjector;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    this._paramMap ??= convertToParamMap(this.params);
    return this._paramMap;
  }
  get queryParamMap() {
    this._queryParamMap ??= convertToParamMap(this.queryParams);
    return this._queryParamMap;
  }
  toString() {
    const url = this.url.map((segment) => segment.toString()).join("/");
    const matched = this.routeConfig ? this.routeConfig.path : "";
    return `Route(url:'${url}', path:'${matched}')`;
  }
};
var RouterStateSnapshot = class extends Tree {
  url;
  constructor(url, root) {
    super(root);
    this.url = url;
    setRouterState(this, root);
  }
  toString() {
    return serializeNode(this._root);
  }
};
function setRouterState(state, node) {
  node.value._routerState = state;
  node.children.forEach((c) => setRouterState(state, c));
}
function serializeNode(node) {
  const c = node.children.length > 0 ? ` { ${node.children.map(serializeNode).join(", ")} } ` : "";
  return `${node.value}${c}`;
}
function advanceActivatedRoute(route) {
  if (route.snapshot) {
    const currentSnapshot = route.snapshot;
    const nextSnapshot = route._futureSnapshot;
    route.snapshot = nextSnapshot;
    if (!shallowEqual(currentSnapshot.queryParams, nextSnapshot.queryParams)) {
      route.queryParamsSubject.next(nextSnapshot.queryParams);
    }
    if (currentSnapshot.fragment !== nextSnapshot.fragment) {
      route.fragmentSubject.next(nextSnapshot.fragment);
    }
    if (!shallowEqual(currentSnapshot.params, nextSnapshot.params)) {
      route.paramsSubject.next(nextSnapshot.params);
    }
    if (!shallowEqualArrays(currentSnapshot.url, nextSnapshot.url)) {
      route.urlSubject.next(nextSnapshot.url);
    }
    if (!shallowEqual(currentSnapshot.data, nextSnapshot.data)) {
      route.dataSubject.next(nextSnapshot.data);
    }
  } else {
    route.snapshot = route._futureSnapshot;
    route.dataSubject.next(route._futureSnapshot.data);
  }
}
function equalParamsAndUrlSegments(a, b) {
  const equalUrlParams = shallowEqual(a.params, b.params) && equalSegments(a.url, b.url);
  const parentsMismatch = !a.parent !== !b.parent;
  return equalUrlParams && !parentsMismatch && (!a.parent || equalParamsAndUrlSegments(a.parent, b.parent));
}
function hasStaticTitle(config) {
  return typeof config.title === "string" || config.title === null;
}
var ROUTER_OUTLET_DATA = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "RouterOutlet data" : "");
var RouterOutlet = class _RouterOutlet {
  activated = null;
  get activatedComponentRef() {
    return this.activated;
  }
  _activatedRoute = null;
  name = PRIMARY_OUTLET;
  activateEvents = new EventEmitter();
  deactivateEvents = new EventEmitter();
  attachEvents = new EventEmitter();
  detachEvents = new EventEmitter();
  routerOutletData = input(...ngDevMode ? [void 0, {
    debugName: "routerOutletData"
  }] : []);
  parentContexts = inject(ChildrenOutletContexts);
  location = inject(ViewContainerRef);
  changeDetector = inject(ChangeDetectorRef);
  inputBinder = inject(INPUT_BINDER, {
    optional: true
  });
  supportsBindingToComponentInputs = true;
  ngOnChanges(changes) {
    if (changes["name"]) {
      const {
        firstChange,
        previousValue
      } = changes["name"];
      if (firstChange) {
        return;
      }
      if (this.isTrackedInParentContexts(previousValue)) {
        this.deactivate();
        this.parentContexts.onChildOutletDestroyed(previousValue);
      }
      this.initializeOutletWithName();
    }
  }
  ngOnDestroy() {
    if (this.isTrackedInParentContexts(this.name)) {
      this.parentContexts.onChildOutletDestroyed(this.name);
    }
    this.inputBinder?.unsubscribeFromRouteData(this);
  }
  isTrackedInParentContexts(outletName) {
    return this.parentContexts.getContext(outletName)?.outlet === this;
  }
  ngOnInit() {
    this.initializeOutletWithName();
  }
  initializeOutletWithName() {
    this.parentContexts.onChildOutletCreated(this.name, this);
    if (this.activated) {
      return;
    }
    const context = this.parentContexts.getContext(this.name);
    if (context?.route) {
      if (context.attachRef) {
        this.attach(context.attachRef, context.route);
      } else {
        this.activateWith(context.route, context.injector);
      }
    }
  }
  get isActivated() {
    return !!this.activated;
  }
  get component() {
    if (!this.activated) throw new RuntimeError(4012, (typeof ngDevMode === "undefined" || ngDevMode) && "Outlet is not activated");
    return this.activated.instance;
  }
  get activatedRoute() {
    if (!this.activated) throw new RuntimeError(4012, (typeof ngDevMode === "undefined" || ngDevMode) && "Outlet is not activated");
    return this._activatedRoute;
  }
  get activatedRouteData() {
    if (this._activatedRoute) {
      return this._activatedRoute.snapshot.data;
    }
    return {};
  }
  detach() {
    if (!this.activated) throw new RuntimeError(4012, (typeof ngDevMode === "undefined" || ngDevMode) && "Outlet is not activated");
    this.location.detach();
    const cmp = this.activated;
    this.activated = null;
    this._activatedRoute = null;
    this.detachEvents.emit(cmp.instance);
    return cmp;
  }
  attach(ref, activatedRoute) {
    this.activated = ref;
    this._activatedRoute = activatedRoute;
    this.location.insert(ref.hostView);
    this.inputBinder?.bindActivatedRouteToOutletComponent(this);
    this.attachEvents.emit(ref.instance);
  }
  deactivate() {
    if (this.activated) {
      const c = this.component;
      this.activated.destroy();
      this.activated = null;
      this._activatedRoute = null;
      this.deactivateEvents.emit(c);
    }
  }
  activateWith(activatedRoute, environmentInjector) {
    if (this.isActivated) {
      throw new RuntimeError(4013, (typeof ngDevMode === "undefined" || ngDevMode) && "Cannot activate an already activated outlet");
    }
    this._activatedRoute = activatedRoute;
    const location = this.location;
    const snapshot = activatedRoute.snapshot;
    const component = snapshot.component;
    const childContexts = this.parentContexts.getOrCreateContext(this.name).children;
    const injector = new OutletInjector(activatedRoute, childContexts, location.injector, this.routerOutletData);
    this.activated = location.createComponent(component, {
      index: location.length,
      injector,
      environmentInjector
    });
    this.changeDetector.markForCheck();
    this.inputBinder?.bindActivatedRouteToOutletComponent(this);
    this.activateEvents.emit(this.activated.instance);
  }
  static \u0275fac = function RouterOutlet_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RouterOutlet)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _RouterOutlet,
    selectors: [["router-outlet"]],
    inputs: {
      name: "name",
      routerOutletData: [1, "routerOutletData"]
    },
    outputs: {
      activateEvents: "activate",
      deactivateEvents: "deactivate",
      attachEvents: "attach",
      detachEvents: "detach"
    },
    exportAs: ["outlet"],
    features: [\u0275\u0275NgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RouterOutlet, [{
    type: Directive,
    args: [{
      selector: "router-outlet",
      exportAs: "outlet"
    }]
  }], null, {
    name: [{
      type: Input
    }],
    activateEvents: [{
      type: Output,
      args: ["activate"]
    }],
    deactivateEvents: [{
      type: Output,
      args: ["deactivate"]
    }],
    attachEvents: [{
      type: Output,
      args: ["attach"]
    }],
    detachEvents: [{
      type: Output,
      args: ["detach"]
    }],
    routerOutletData: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "routerOutletData",
        required: false
      }]
    }]
  });
})();
var OutletInjector = class {
  route;
  childContexts;
  parent;
  outletData;
  constructor(route, childContexts, parent, outletData) {
    this.route = route;
    this.childContexts = childContexts;
    this.parent = parent;
    this.outletData = outletData;
  }
  get(token, notFoundValue) {
    if (token === ActivatedRoute) {
      return this.route;
    }
    if (token === ChildrenOutletContexts) {
      return this.childContexts;
    }
    if (token === ROUTER_OUTLET_DATA) {
      return this.outletData;
    }
    return this.parent.get(token, notFoundValue);
  }
};
var INPUT_BINDER = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "Router Input Binder" : "");
var RoutedComponentInputBinder = class _RoutedComponentInputBinder {
  outletDataSubscriptions = /* @__PURE__ */ new Map();
  bindActivatedRouteToOutletComponent(outlet) {
    this.unsubscribeFromRouteData(outlet);
    this.subscribeToRouteData(outlet);
  }
  unsubscribeFromRouteData(outlet) {
    this.outletDataSubscriptions.get(outlet)?.unsubscribe();
    this.outletDataSubscriptions.delete(outlet);
  }
  subscribeToRouteData(outlet) {
    const {
      activatedRoute
    } = outlet;
    const dataSubscription = combineLatest([activatedRoute.queryParams, activatedRoute.params, activatedRoute.data]).pipe(switchMap(([queryParams, params, data], index) => {
      data = __spreadValues(__spreadValues(__spreadValues({}, queryParams), params), data);
      if (index === 0) {
        return of(data);
      }
      return Promise.resolve(data);
    })).subscribe((data) => {
      if (!outlet.isActivated || !outlet.activatedComponentRef || outlet.activatedRoute !== activatedRoute || activatedRoute.component === null) {
        this.unsubscribeFromRouteData(outlet);
        return;
      }
      const mirror = reflectComponentType(activatedRoute.component);
      if (!mirror) {
        this.unsubscribeFromRouteData(outlet);
        return;
      }
      for (const {
        templateName
      } of mirror.inputs) {
        outlet.activatedComponentRef.setInput(templateName, data[templateName]);
      }
    });
    this.outletDataSubscriptions.set(outlet, dataSubscription);
  }
  static \u0275fac = function RoutedComponentInputBinder_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RoutedComponentInputBinder)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _RoutedComponentInputBinder,
    factory: _RoutedComponentInputBinder.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RoutedComponentInputBinder, [{
    type: Injectable
  }], null, null);
})();
var \u0275EmptyOutletComponent = class _\u0275EmptyOutletComponent {
  static \u0275fac = function \u0275EmptyOutletComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _\u0275EmptyOutletComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _\u0275EmptyOutletComponent,
    selectors: [["ng-component"]],
    exportAs: ["emptyRouterOutlet"],
    decls: 1,
    vars: 0,
    template: function _EmptyOutletComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275element(0, "router-outlet");
      }
    },
    dependencies: [RouterOutlet],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(\u0275EmptyOutletComponent, [{
    type: Component,
    args: [{
      template: `<router-outlet />`,
      imports: [RouterOutlet],
      exportAs: "emptyRouterOutlet"
    }]
  }], null, null);
})();
function standardizeConfig(r) {
  const children = r.children && r.children.map(standardizeConfig);
  const c = children ? __spreadProps(__spreadValues({}, r), {
    children
  }) : __spreadValues({}, r);
  if (!c.component && !c.loadComponent && (children || c.loadChildren) && c.outlet && c.outlet !== PRIMARY_OUTLET) {
    c.component = \u0275EmptyOutletComponent;
  }
  return c;
}
function createRouterState(routeReuseStrategy, curr, prevState) {
  const root = createNode(routeReuseStrategy, curr._root, prevState ? prevState._root : void 0);
  return new RouterState(root, curr);
}
function createNode(routeReuseStrategy, curr, prevState) {
  if (prevState && routeReuseStrategy.shouldReuseRoute(curr.value, prevState.value.snapshot)) {
    const value = prevState.value;
    value._futureSnapshot = curr.value;
    const children = createOrReuseChildren(routeReuseStrategy, curr, prevState);
    return new TreeNode(value, children);
  } else {
    if (routeReuseStrategy.shouldAttach(curr.value)) {
      const detachedRouteHandle = routeReuseStrategy.retrieve(curr.value);
      if (detachedRouteHandle !== null) {
        const tree2 = detachedRouteHandle.route;
        tree2.value._futureSnapshot = curr.value;
        tree2.children = curr.children.map((c) => createNode(routeReuseStrategy, c));
        return tree2;
      }
    }
    const value = createActivatedRoute(curr.value);
    const children = curr.children.map((c) => createNode(routeReuseStrategy, c));
    return new TreeNode(value, children);
  }
}
function createOrReuseChildren(routeReuseStrategy, curr, prevState) {
  return curr.children.map((child) => {
    for (const p of prevState.children) {
      if (routeReuseStrategy.shouldReuseRoute(child.value, p.value.snapshot)) {
        return createNode(routeReuseStrategy, child, p);
      }
    }
    return createNode(routeReuseStrategy, child);
  });
}
function createActivatedRoute(c) {
  return new ActivatedRoute(new BehaviorSubject(c.url), new BehaviorSubject(c.params), new BehaviorSubject(c.queryParams), new BehaviorSubject(c.fragment), new BehaviorSubject(c.data), c.outlet, c.component, c);
}
var RedirectCommand = class {
  redirectTo;
  navigationBehaviorOptions;
  constructor(redirectTo, navigationBehaviorOptions) {
    this.redirectTo = redirectTo;
    this.navigationBehaviorOptions = navigationBehaviorOptions;
  }
};
var NAVIGATION_CANCELING_ERROR = "ngNavigationCancelingError";
function redirectingNavigationError(urlSerializer, redirect) {
  const {
    redirectTo,
    navigationBehaviorOptions
  } = isUrlTree(redirect) ? {
    redirectTo: redirect,
    navigationBehaviorOptions: void 0
  } : redirect;
  const error = navigationCancelingError(ngDevMode && `Redirecting to "${urlSerializer.serialize(redirectTo)}"`, NavigationCancellationCode.Redirect);
  error.url = redirectTo;
  error.navigationBehaviorOptions = navigationBehaviorOptions;
  return error;
}
function navigationCancelingError(message, code) {
  const error = new Error(`NavigationCancelingError: ${message || ""}`);
  error[NAVIGATION_CANCELING_ERROR] = true;
  error.cancellationCode = code;
  return error;
}
function isRedirectingNavigationCancelingError(error) {
  return isNavigationCancelingError(error) && isUrlTree(error.url);
}
function isNavigationCancelingError(error) {
  return !!error && error[NAVIGATION_CANCELING_ERROR];
}
var warnedAboutUnsupportedInputBinding = false;
var ActivateRoutes = class {
  routeReuseStrategy;
  futureState;
  currState;
  forwardEvent;
  inputBindingEnabled;
  constructor(routeReuseStrategy, futureState, currState, forwardEvent, inputBindingEnabled) {
    this.routeReuseStrategy = routeReuseStrategy;
    this.futureState = futureState;
    this.currState = currState;
    this.forwardEvent = forwardEvent;
    this.inputBindingEnabled = inputBindingEnabled;
  }
  activate(parentContexts) {
    const futureRoot = this.futureState._root;
    const currRoot = this.currState ? this.currState._root : null;
    this.deactivateChildRoutes(futureRoot, currRoot, parentContexts);
    advanceActivatedRoute(this.futureState.root);
    this.activateChildRoutes(futureRoot, currRoot, parentContexts);
  }
  deactivateChildRoutes(futureNode, currNode, contexts) {
    const children = nodeChildrenAsMap(currNode);
    futureNode.children.forEach((futureChild) => {
      const childOutletName = futureChild.value.outlet;
      this.deactivateRoutes(futureChild, children[childOutletName], contexts);
      delete children[childOutletName];
    });
    Object.values(children).forEach((v) => {
      this.deactivateRouteAndItsChildren(v, contexts);
    });
  }
  deactivateRoutes(futureNode, currNode, parentContext) {
    const future = futureNode.value;
    const curr = currNode ? currNode.value : null;
    if (future === curr) {
      if (future.component) {
        const context = parentContext.getContext(future.outlet);
        if (context) {
          this.deactivateChildRoutes(futureNode, currNode, context.children);
        }
      } else {
        this.deactivateChildRoutes(futureNode, currNode, parentContext);
      }
    } else {
      if (curr) {
        this.deactivateRouteAndItsChildren(currNode, parentContext);
      }
    }
  }
  deactivateRouteAndItsChildren(route, parentContexts) {
    if (route.value.component && this.routeReuseStrategy.shouldDetach(route.value.snapshot)) {
      this.detachAndStoreRouteSubtree(route, parentContexts);
    } else {
      this.deactivateRouteAndOutlet(route, parentContexts);
    }
  }
  detachAndStoreRouteSubtree(route, parentContexts) {
    const context = parentContexts.getContext(route.value.outlet);
    const contexts = context && route.value.component ? context.children : parentContexts;
    const children = nodeChildrenAsMap(route);
    for (const treeNode of Object.values(children)) {
      this.deactivateRouteAndItsChildren(treeNode, contexts);
    }
    if (context && context.outlet) {
      const componentRef = context.outlet.detach();
      const contexts2 = context.children.onOutletDeactivated();
      this.routeReuseStrategy.store(route.value.snapshot, {
        componentRef,
        route,
        contexts: contexts2
      });
    }
  }
  deactivateRouteAndOutlet(route, parentContexts) {
    const context = parentContexts.getContext(route.value.outlet);
    const contexts = context && route.value.component ? context.children : parentContexts;
    const children = nodeChildrenAsMap(route);
    for (const treeNode of Object.values(children)) {
      this.deactivateRouteAndItsChildren(treeNode, contexts);
    }
    if (context) {
      if (context.outlet) {
        context.outlet.deactivate();
        context.children.onOutletDeactivated();
      }
      context.attachRef = null;
      context.route = null;
    }
  }
  activateChildRoutes(futureNode, currNode, contexts) {
    const children = nodeChildrenAsMap(currNode);
    futureNode.children.forEach((c) => {
      this.activateRoutes(c, children[c.value.outlet], contexts);
      this.forwardEvent(new ActivationEnd(c.value.snapshot));
    });
    if (futureNode.children.length) {
      this.forwardEvent(new ChildActivationEnd(futureNode.value.snapshot));
    }
  }
  activateRoutes(futureNode, currNode, parentContexts) {
    const future = futureNode.value;
    const curr = currNode ? currNode.value : null;
    advanceActivatedRoute(future);
    if (future === curr) {
      if (future.component) {
        const context = parentContexts.getOrCreateContext(future.outlet);
        this.activateChildRoutes(futureNode, currNode, context.children);
      } else {
        this.activateChildRoutes(futureNode, currNode, parentContexts);
      }
    } else {
      if (future.component) {
        const context = parentContexts.getOrCreateContext(future.outlet);
        if (this.routeReuseStrategy.shouldAttach(future.snapshot)) {
          const stored = this.routeReuseStrategy.retrieve(future.snapshot);
          this.routeReuseStrategy.store(future.snapshot, null);
          context.children.onOutletReAttached(stored.contexts);
          context.attachRef = stored.componentRef;
          context.route = stored.route.value;
          if (context.outlet) {
            context.outlet.attach(stored.componentRef, stored.route.value);
          }
          advanceActivatedRoute(stored.route.value);
          this.activateChildRoutes(futureNode, null, context.children);
        } else {
          context.attachRef = null;
          context.route = future;
          if (context.outlet) {
            context.outlet.activateWith(future, context.injector);
          }
          this.activateChildRoutes(futureNode, null, context.children);
        }
      } else {
        this.activateChildRoutes(futureNode, null, parentContexts);
      }
    }
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      const context = parentContexts.getOrCreateContext(future.outlet);
      const outlet = context.outlet;
      if (outlet && this.inputBindingEnabled && !outlet.supportsBindingToComponentInputs && !warnedAboutUnsupportedInputBinding) {
        console.warn(`'withComponentInputBinding' feature is enabled but this application is using an outlet that may not support binding to component inputs.`);
        warnedAboutUnsupportedInputBinding = true;
      }
    }
  }
};
var CanActivate = class {
  path;
  route;
  constructor(path) {
    this.path = path;
    this.route = this.path[this.path.length - 1];
  }
};
var CanDeactivate = class {
  component;
  route;
  constructor(component, route) {
    this.component = component;
    this.route = route;
  }
};
function getAllRouteGuards(future, curr, parentContexts) {
  const futureRoot = future._root;
  const currRoot = curr ? curr._root : null;
  return getChildRouteGuards(futureRoot, currRoot, parentContexts, [futureRoot.value]);
}
function getCanActivateChild(p) {
  const canActivateChild = p.routeConfig ? p.routeConfig.canActivateChild : null;
  if (!canActivateChild || canActivateChild.length === 0) return null;
  return {
    node: p,
    guards: canActivateChild
  };
}
function getTokenOrFunctionIdentity(tokenOrFunction, injector) {
  const NOT_FOUND = /* @__PURE__ */ Symbol();
  const result = injector.get(tokenOrFunction, NOT_FOUND);
  if (result === NOT_FOUND) {
    if (typeof tokenOrFunction === "function" && !isInjectable(tokenOrFunction)) {
      return tokenOrFunction;
    } else {
      return injector.get(tokenOrFunction);
    }
  }
  return result;
}
function getChildRouteGuards(futureNode, currNode, contexts, futurePath, checks = {
  canDeactivateChecks: [],
  canActivateChecks: []
}) {
  const prevChildren = nodeChildrenAsMap(currNode);
  futureNode.children.forEach((c) => {
    getRouteGuards(c, prevChildren[c.value.outlet], contexts, futurePath.concat([c.value]), checks);
    delete prevChildren[c.value.outlet];
  });
  Object.entries(prevChildren).forEach(([k, v]) => deactivateRouteAndItsChildren(v, contexts.getContext(k), checks));
  return checks;
}
function getRouteGuards(futureNode, currNode, parentContexts, futurePath, checks = {
  canDeactivateChecks: [],
  canActivateChecks: []
}) {
  const future = futureNode.value;
  const curr = currNode ? currNode.value : null;
  const context = parentContexts ? parentContexts.getContext(futureNode.value.outlet) : null;
  if (curr && future.routeConfig === curr.routeConfig) {
    const shouldRun = shouldRunGuardsAndResolvers(curr, future, future.routeConfig.runGuardsAndResolvers);
    if (shouldRun) {
      checks.canActivateChecks.push(new CanActivate(futurePath));
    } else {
      future.data = curr.data;
      future._resolvedData = curr._resolvedData;
    }
    if (future.component) {
      getChildRouteGuards(futureNode, currNode, context ? context.children : null, futurePath, checks);
    } else {
      getChildRouteGuards(futureNode, currNode, parentContexts, futurePath, checks);
    }
    if (shouldRun && context && context.outlet && context.outlet.isActivated) {
      checks.canDeactivateChecks.push(new CanDeactivate(context.outlet.component, curr));
    }
  } else {
    if (curr) {
      deactivateRouteAndItsChildren(currNode, context, checks);
    }
    checks.canActivateChecks.push(new CanActivate(futurePath));
    if (future.component) {
      getChildRouteGuards(futureNode, null, context ? context.children : null, futurePath, checks);
    } else {
      getChildRouteGuards(futureNode, null, parentContexts, futurePath, checks);
    }
  }
  return checks;
}
function shouldRunGuardsAndResolvers(curr, future, mode) {
  if (typeof mode === "function") {
    return runInInjectionContext(future._environmentInjector, () => mode(curr, future));
  }
  switch (mode) {
    case "pathParamsChange":
      return !equalPath(curr.url, future.url);
    case "pathParamsOrQueryParamsChange":
      return !equalPath(curr.url, future.url) || !shallowEqual(curr.queryParams, future.queryParams);
    case "always":
      return true;
    case "paramsOrQueryParamsChange":
      return !equalParamsAndUrlSegments(curr, future) || !shallowEqual(curr.queryParams, future.queryParams);
    case "paramsChange":
    default:
      return !equalParamsAndUrlSegments(curr, future);
  }
}
function deactivateRouteAndItsChildren(route, context, checks) {
  const children = nodeChildrenAsMap(route);
  const r = route.value;
  Object.entries(children).forEach(([childName, node]) => {
    if (!r.component) {
      deactivateRouteAndItsChildren(node, context, checks);
    } else if (context) {
      deactivateRouteAndItsChildren(node, context.children.getContext(childName), checks);
    } else {
      deactivateRouteAndItsChildren(node, null, checks);
    }
  });
  if (!r.component) {
    checks.canDeactivateChecks.push(new CanDeactivate(null, r));
  } else if (context && context.outlet && context.outlet.isActivated) {
    checks.canDeactivateChecks.push(new CanDeactivate(context.outlet.component, r));
  } else {
    checks.canDeactivateChecks.push(new CanDeactivate(null, r));
  }
}
function isFunction(v) {
  return typeof v === "function";
}
function isBoolean(v) {
  return typeof v === "boolean";
}
function isCanLoad(guard) {
  return guard && isFunction(guard.canLoad);
}
function isCanActivate(guard) {
  return guard && isFunction(guard.canActivate);
}
function isCanActivateChild(guard) {
  return guard && isFunction(guard.canActivateChild);
}
function isCanDeactivate(guard) {
  return guard && isFunction(guard.canDeactivate);
}
function isCanMatch(guard) {
  return guard && isFunction(guard.canMatch);
}
function isEmptyError(e) {
  return e instanceof EmptyError || e?.name === "EmptyError";
}
var INITIAL_VALUE = /* @__PURE__ */ Symbol("INITIAL_VALUE");
function prioritizedGuardValue() {
  return switchMap((obs) => {
    return combineLatest(obs.map((o) => o.pipe(take(1), startWith(INITIAL_VALUE)))).pipe(map((results) => {
      for (const result of results) {
        if (result === true) {
          continue;
        } else if (result === INITIAL_VALUE) {
          return INITIAL_VALUE;
        } else if (result === false || isRedirect(result)) {
          return result;
        }
      }
      return true;
    }), filter((item) => item !== INITIAL_VALUE), take(1));
  });
}
function isRedirect(val) {
  return isUrlTree(val) || val instanceof RedirectCommand;
}
function abortSignalToObservable(signal2) {
  if (signal2.aborted) {
    return of(void 0).pipe(take(1));
  }
  return new Observable((subscriber) => {
    const handler = () => {
      subscriber.next();
      subscriber.complete();
    };
    signal2.addEventListener("abort", handler);
    return () => signal2.removeEventListener("abort", handler);
  });
}
function takeUntilAbort(signal2) {
  return takeUntil(abortSignalToObservable(signal2));
}
function checkGuards(forwardEvent) {
  return mergeMap((t) => {
    const {
      targetSnapshot,
      currentSnapshot,
      guards: {
        canActivateChecks,
        canDeactivateChecks
      }
    } = t;
    if (canDeactivateChecks.length === 0 && canActivateChecks.length === 0) {
      return of(__spreadProps(__spreadValues({}, t), {
        guardsResult: true
      }));
    }
    return runCanDeactivateChecks(canDeactivateChecks, targetSnapshot, currentSnapshot).pipe(mergeMap((canDeactivate) => {
      return canDeactivate && isBoolean(canDeactivate) ? runCanActivateChecks(targetSnapshot, canActivateChecks, forwardEvent) : of(canDeactivate);
    }), map((guardsResult) => __spreadProps(__spreadValues({}, t), {
      guardsResult
    })));
  });
}
function runCanDeactivateChecks(checks, futureRSS, currRSS) {
  return from(checks).pipe(mergeMap((check) => runCanDeactivate(check.component, check.route, currRSS, futureRSS)), first((result) => {
    return result !== true;
  }, true));
}
function runCanActivateChecks(futureSnapshot, checks, forwardEvent) {
  return from(checks).pipe(concatMap((check) => {
    return concat(fireChildActivationStart(check.route.parent, forwardEvent), fireActivationStart(check.route, forwardEvent), runCanActivateChild(futureSnapshot, check.path), runCanActivate(futureSnapshot, check.route));
  }), first((result) => {
    return result !== true;
  }, true));
}
function fireActivationStart(snapshot, forwardEvent) {
  if (snapshot !== null && forwardEvent) {
    forwardEvent(new ActivationStart(snapshot));
  }
  return of(true);
}
function fireChildActivationStart(snapshot, forwardEvent) {
  if (snapshot !== null && forwardEvent) {
    forwardEvent(new ChildActivationStart(snapshot));
  }
  return of(true);
}
function runCanActivate(futureRSS, futureARS) {
  const canActivate = futureARS.routeConfig ? futureARS.routeConfig.canActivate : null;
  if (!canActivate || canActivate.length === 0) return of(true);
  const canActivateObservables = canActivate.map((canActivate2) => {
    return defer(() => {
      const closestInjector = futureARS._environmentInjector;
      const guard = getTokenOrFunctionIdentity(canActivate2, closestInjector);
      const guardVal = isCanActivate(guard) ? guard.canActivate(futureARS, futureRSS) : runInInjectionContext(closestInjector, () => guard(futureARS, futureRSS));
      return wrapIntoObservable(guardVal).pipe(first());
    });
  });
  return of(canActivateObservables).pipe(prioritizedGuardValue());
}
function runCanActivateChild(futureRSS, path) {
  const futureARS = path[path.length - 1];
  const canActivateChildGuards = path.slice(0, path.length - 1).reverse().map((p) => getCanActivateChild(p)).filter((_) => _ !== null);
  const canActivateChildGuardsMapped = canActivateChildGuards.map((d) => {
    return defer(() => {
      const guardsMapped = d.guards.map((canActivateChild) => {
        const closestInjector = d.node._environmentInjector;
        const guard = getTokenOrFunctionIdentity(canActivateChild, closestInjector);
        const guardVal = isCanActivateChild(guard) ? guard.canActivateChild(futureARS, futureRSS) : runInInjectionContext(closestInjector, () => guard(futureARS, futureRSS));
        return wrapIntoObservable(guardVal).pipe(first());
      });
      return of(guardsMapped).pipe(prioritizedGuardValue());
    });
  });
  return of(canActivateChildGuardsMapped).pipe(prioritizedGuardValue());
}
function runCanDeactivate(component, currARS, currRSS, futureRSS) {
  const canDeactivate = currARS && currARS.routeConfig ? currARS.routeConfig.canDeactivate : null;
  if (!canDeactivate || canDeactivate.length === 0) return of(true);
  const canDeactivateObservables = canDeactivate.map((c) => {
    const closestInjector = currARS._environmentInjector;
    const guard = getTokenOrFunctionIdentity(c, closestInjector);
    const guardVal = isCanDeactivate(guard) ? guard.canDeactivate(component, currARS, currRSS, futureRSS) : runInInjectionContext(closestInjector, () => guard(component, currARS, currRSS, futureRSS));
    return wrapIntoObservable(guardVal).pipe(first());
  });
  return of(canDeactivateObservables).pipe(prioritizedGuardValue());
}
function runCanLoadGuards(injector, route, segments, urlSerializer, abortSignal) {
  const canLoad = route.canLoad;
  if (canLoad === void 0 || canLoad.length === 0) {
    return of(true);
  }
  const canLoadObservables = canLoad.map((injectionToken) => {
    const guard = getTokenOrFunctionIdentity(injectionToken, injector);
    const guardVal = isCanLoad(guard) ? guard.canLoad(route, segments) : runInInjectionContext(injector, () => guard(route, segments));
    const obs$ = wrapIntoObservable(guardVal);
    return abortSignal ? obs$.pipe(takeUntilAbort(abortSignal)) : obs$;
  });
  return of(canLoadObservables).pipe(prioritizedGuardValue(), redirectIfUrlTree(urlSerializer));
}
function redirectIfUrlTree(urlSerializer) {
  return pipe(tap((result) => {
    if (typeof result === "boolean") return;
    throw redirectingNavigationError(urlSerializer, result);
  }), map((result) => result === true));
}
function runCanMatchGuards(injector, route, segments, urlSerializer, currentSnapshot, abortSignal) {
  const canMatch = route.canMatch;
  if (!canMatch || canMatch.length === 0) return of(true);
  const canMatchObservables = canMatch.map((injectionToken) => {
    const guard = getTokenOrFunctionIdentity(injectionToken, injector);
    const guardVal = isCanMatch(guard) ? guard.canMatch(route, segments, currentSnapshot) : runInInjectionContext(injector, () => guard(route, segments, currentSnapshot));
    return wrapIntoObservable(guardVal).pipe(takeUntilAbort(abortSignal));
  });
  return of(canMatchObservables).pipe(prioritizedGuardValue(), redirectIfUrlTree(urlSerializer));
}
var NoMatch = class _NoMatch extends Error {
  segmentGroup;
  constructor(segmentGroup) {
    super();
    this.segmentGroup = segmentGroup || null;
    Object.setPrototypeOf(this, _NoMatch.prototype);
  }
};
var AbsoluteRedirect = class _AbsoluteRedirect extends Error {
  urlTree;
  constructor(urlTree) {
    super();
    this.urlTree = urlTree;
    Object.setPrototypeOf(this, _AbsoluteRedirect.prototype);
  }
};
function namedOutletsRedirect(redirectTo) {
  throw new RuntimeError(4e3, (typeof ngDevMode === "undefined" || ngDevMode) && `Only absolute redirects can have named outlets. redirectTo: '${redirectTo}'`);
}
function canLoadFails(route) {
  throw navigationCancelingError((typeof ngDevMode === "undefined" || ngDevMode) && `Cannot load children because the guard of the route "path: '${route.path}'" returned false`, NavigationCancellationCode.GuardRejected);
}
var ApplyRedirects = class {
  urlSerializer;
  urlTree;
  constructor(urlSerializer, urlTree) {
    this.urlSerializer = urlSerializer;
    this.urlTree = urlTree;
  }
  async lineralizeSegments(route, urlTree) {
    let res = [];
    let c = urlTree.root;
    while (true) {
      res = res.concat(c.segments);
      if (c.numberOfChildren === 0) {
        return res;
      }
      if (c.numberOfChildren > 1 || !c.children[PRIMARY_OUTLET]) {
        throw namedOutletsRedirect(`${route.redirectTo}`);
      }
      c = c.children[PRIMARY_OUTLET];
    }
  }
  async applyRedirectCommands(segments, redirectTo, posParams, currentSnapshot, injector) {
    const redirect = await getRedirectResult(redirectTo, currentSnapshot, injector);
    if (redirect instanceof UrlTree) {
      throw new AbsoluteRedirect(redirect);
    }
    const newTree = this.applyRedirectCreateUrlTree(redirect, this.urlSerializer.parse(redirect), segments, posParams);
    if (redirect[0] === "/") {
      throw new AbsoluteRedirect(newTree);
    }
    return newTree;
  }
  applyRedirectCreateUrlTree(redirectTo, urlTree, segments, posParams) {
    const newRoot = this.createSegmentGroup(redirectTo, urlTree.root, segments, posParams);
    return new UrlTree(newRoot, this.createQueryParams(urlTree.queryParams, this.urlTree.queryParams), urlTree.fragment);
  }
  createQueryParams(redirectToParams, actualParams) {
    const res = {};
    Object.entries(redirectToParams).forEach(([k, v]) => {
      const copySourceValue = typeof v === "string" && v[0] === ":";
      if (copySourceValue) {
        const sourceName = v.substring(1);
        res[k] = actualParams[sourceName];
      } else {
        res[k] = v;
      }
    });
    return res;
  }
  createSegmentGroup(redirectTo, group, segments, posParams) {
    const updatedSegments = this.createSegments(redirectTo, group.segments, segments, posParams);
    let children = {};
    Object.entries(group.children).forEach(([name, child]) => {
      children[name] = this.createSegmentGroup(redirectTo, child, segments, posParams);
    });
    return new UrlSegmentGroup(updatedSegments, children);
  }
  createSegments(redirectTo, redirectToSegments, actualSegments, posParams) {
    return redirectToSegments.map((s) => s.path[0] === ":" ? this.findPosParam(redirectTo, s, posParams) : this.findOrReturn(s, actualSegments));
  }
  findPosParam(redirectTo, redirectToUrlSegment, posParams) {
    const pos = posParams[redirectToUrlSegment.path.substring(1)];
    if (!pos) throw new RuntimeError(4001, (typeof ngDevMode === "undefined" || ngDevMode) && `Cannot redirect to '${redirectTo}'. Cannot find '${redirectToUrlSegment.path}'.`);
    return pos;
  }
  findOrReturn(redirectToUrlSegment, actualSegments) {
    let idx = 0;
    for (const s of actualSegments) {
      if (s.path === redirectToUrlSegment.path) {
        actualSegments.splice(idx);
        return s;
      }
      idx++;
    }
    return redirectToUrlSegment;
  }
};
function getRedirectResult(redirectTo, currentSnapshot, injector) {
  if (typeof redirectTo === "string") {
    return Promise.resolve(redirectTo);
  }
  const redirectToFn = redirectTo;
  return firstValueFrom(wrapIntoObservable(runInInjectionContext(injector, () => redirectToFn(currentSnapshot))));
}
function getOrCreateRouteInjectorIfNeeded(route, currentInjector) {
  if (route.providers && !route._injector) {
    route._injector = createEnvironmentInjector(route.providers, currentInjector, `Route: ${route.path}`);
  }
  return route._injector ?? currentInjector;
}
function validateConfig(config, parentPath = "", requireStandaloneComponents = false) {
  for (let i = 0; i < config.length; i++) {
    const route = config[i];
    const fullPath = getFullPath(parentPath, route);
    validateNode(route, fullPath, requireStandaloneComponents);
  }
}
function assertStandalone(fullPath, component) {
  if (component && isNgModule(component)) {
    throw new RuntimeError(4014, `Invalid configuration of route '${fullPath}'. You are using 'loadComponent' with a module, but it must be used with standalone components. Use 'loadChildren' instead.`);
  } else if (component && !isStandalone(component)) {
    throw new RuntimeError(4014, `Invalid configuration of route '${fullPath}'. The component must be standalone.`);
  }
}
function validateNode(route, fullPath, requireStandaloneComponents) {
  if (typeof ngDevMode === "undefined" || ngDevMode) {
    if (!route) {
      throw new RuntimeError(4014, `
      Invalid configuration of route '${fullPath}': Encountered undefined route.
      The reason might be an extra comma.

      Example:
      const routes: Routes = [
        { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
        { path: 'dashboard',  component: DashboardComponent },, << two commas
        { path: 'detail/:id', component: HeroDetailComponent }
      ];
    `);
    }
    if (Array.isArray(route)) {
      throw new RuntimeError(4014, `Invalid configuration of route '${fullPath}': Array cannot be specified`);
    }
    if (!route.redirectTo && !route.component && !route.loadComponent && !route.children && !route.loadChildren && route.outlet && route.outlet !== PRIMARY_OUTLET) {
      throw new RuntimeError(4014, `Invalid configuration of route '${fullPath}': a componentless route without children or loadChildren cannot have a named outlet set`);
    }
    if (route.redirectTo && route.children) {
      throw new RuntimeError(4014, `Invalid configuration of route '${fullPath}': redirectTo and children cannot be used together`);
    }
    if (route.redirectTo && route.loadChildren) {
      throw new RuntimeError(4014, `Invalid configuration of route '${fullPath}': redirectTo and loadChildren cannot be used together`);
    }
    if (route.children && route.loadChildren) {
      throw new RuntimeError(4014, `Invalid configuration of route '${fullPath}': children and loadChildren cannot be used together`);
    }
    if (route.component && route.loadComponent) {
      throw new RuntimeError(4014, `Invalid configuration of route '${fullPath}': component and loadComponent cannot be used together`);
    }
    if (route.redirectTo) {
      if (route.component || route.loadComponent) {
        throw new RuntimeError(4014, `Invalid configuration of route '${fullPath}': redirectTo and component/loadComponent cannot be used together`);
      }
      if (route.canMatch || route.canActivate) {
        throw new RuntimeError(4014, `Invalid configuration of route '${fullPath}': redirectTo and ${route.canMatch ? "canMatch" : "canActivate"} cannot be used together.Redirects happen before guards are executed.`);
      }
    }
    if (route.path && route.matcher) {
      throw new RuntimeError(4014, `Invalid configuration of route '${fullPath}': path and matcher cannot be used together`);
    }
    if (route.redirectTo === void 0 && !route.component && !route.loadComponent && !route.children && !route.loadChildren) {
      throw new RuntimeError(4014, `Invalid configuration of route '${fullPath}'. One of the following must be provided: component, loadComponent, redirectTo, children or loadChildren`);
    }
    if (route.path === void 0 && route.matcher === void 0) {
      throw new RuntimeError(4014, `Invalid configuration of route '${fullPath}': routes must have either a path or a matcher specified`);
    }
    if (typeof route.path === "string" && route.path.charAt(0) === "/") {
      throw new RuntimeError(4014, `Invalid configuration of route '${fullPath}': path cannot start with a slash`);
    }
    if (route.path === "" && route.redirectTo !== void 0 && route.pathMatch === void 0) {
      const exp = `The default value of 'pathMatch' is 'prefix', but often the intent is to use 'full'.`;
      throw new RuntimeError(4014, `Invalid configuration of route '{path: "${fullPath}", redirectTo: "${route.redirectTo}"}': please provide 'pathMatch'. ${exp}`);
    }
    if (requireStandaloneComponents) {
      assertStandalone(fullPath, route.component);
    }
  }
  if (route.children) {
    validateConfig(route.children, fullPath, requireStandaloneComponents);
  }
}
function getFullPath(parentPath, currentRoute) {
  if (!currentRoute) {
    return parentPath;
  }
  if (!parentPath && !currentRoute.path) {
    return "";
  } else if (parentPath && !currentRoute.path) {
    return `${parentPath}/`;
  } else if (!parentPath && currentRoute.path) {
    return currentRoute.path;
  } else {
    return `${parentPath}/${currentRoute.path}`;
  }
}
function getOutlet(route) {
  return route.outlet || PRIMARY_OUTLET;
}
function sortByMatchingOutlets(routes2, outletName) {
  const sortedConfig = routes2.filter((r) => getOutlet(r) === outletName);
  sortedConfig.push(...routes2.filter((r) => getOutlet(r) !== outletName));
  return sortedConfig;
}
var noMatch = {
  matched: false,
  consumedSegments: [],
  remainingSegments: [],
  parameters: {},
  positionalParamSegments: {}
};
function createPreMatchRouteSnapshot(snapshot) {
  return {
    routeConfig: snapshot.routeConfig,
    url: snapshot.url,
    params: snapshot.params,
    queryParams: snapshot.queryParams,
    fragment: snapshot.fragment,
    data: snapshot.data,
    outlet: snapshot.outlet,
    title: snapshot.title,
    paramMap: snapshot.paramMap,
    queryParamMap: snapshot.queryParamMap
  };
}
function matchWithChecks(segmentGroup, route, segments, injector, urlSerializer, createSnapshot, abortSignal) {
  const result = match(segmentGroup, route, segments);
  if (!result.matched) {
    return of(result);
  }
  const currentSnapshot = createPreMatchRouteSnapshot(createSnapshot(result));
  injector = getOrCreateRouteInjectorIfNeeded(route, injector);
  return runCanMatchGuards(injector, route, segments, urlSerializer, currentSnapshot, abortSignal).pipe(map((v) => v === true ? result : __spreadValues({}, noMatch)));
}
function match(segmentGroup, route, segments) {
  if (route.path === "") {
    if (route.pathMatch === "full" && (segmentGroup.hasChildren() || segments.length > 0)) {
      return __spreadValues({}, noMatch);
    }
    return {
      matched: true,
      consumedSegments: [],
      remainingSegments: segments,
      parameters: {},
      positionalParamSegments: {}
    };
  }
  const matcher = route.matcher || defaultUrlMatcher;
  const res = matcher(segments, segmentGroup, route);
  if (!res) return __spreadValues({}, noMatch);
  const posParams = {};
  Object.entries(res.posParams ?? {}).forEach(([k, v]) => {
    posParams[k] = v.path;
  });
  const parameters = res.consumed.length > 0 ? __spreadValues(__spreadValues({}, posParams), res.consumed[res.consumed.length - 1].parameters) : posParams;
  return {
    matched: true,
    consumedSegments: res.consumed,
    remainingSegments: segments.slice(res.consumed.length),
    parameters,
    positionalParamSegments: res.posParams ?? {}
  };
}
function split(segmentGroup, consumedSegments, slicedSegments, config) {
  if (slicedSegments.length > 0 && containsEmptyPathMatchesWithNamedOutlets(segmentGroup, slicedSegments, config)) {
    const s2 = new UrlSegmentGroup(consumedSegments, createChildrenForEmptyPaths(config, new UrlSegmentGroup(slicedSegments, segmentGroup.children)));
    return {
      segmentGroup: s2,
      slicedSegments: []
    };
  }
  if (slicedSegments.length === 0 && containsEmptyPathMatches(segmentGroup, slicedSegments, config)) {
    const s2 = new UrlSegmentGroup(segmentGroup.segments, addEmptyPathsToChildrenIfNeeded(segmentGroup, slicedSegments, config, segmentGroup.children));
    return {
      segmentGroup: s2,
      slicedSegments
    };
  }
  const s = new UrlSegmentGroup(segmentGroup.segments, segmentGroup.children);
  return {
    segmentGroup: s,
    slicedSegments
  };
}
function addEmptyPathsToChildrenIfNeeded(segmentGroup, slicedSegments, routes2, children) {
  const res = {};
  for (const r of routes2) {
    if (emptyPathMatch(segmentGroup, slicedSegments, r) && !children[getOutlet(r)]) {
      const s = new UrlSegmentGroup([], {});
      res[getOutlet(r)] = s;
    }
  }
  return __spreadValues(__spreadValues({}, children), res);
}
function createChildrenForEmptyPaths(routes2, primarySegment) {
  const res = {};
  res[PRIMARY_OUTLET] = primarySegment;
  for (const r of routes2) {
    if (r.path === "" && getOutlet(r) !== PRIMARY_OUTLET) {
      const s = new UrlSegmentGroup([], {});
      res[getOutlet(r)] = s;
    }
  }
  return res;
}
function containsEmptyPathMatchesWithNamedOutlets(segmentGroup, slicedSegments, routes2) {
  return routes2.some((r) => emptyPathMatch(segmentGroup, slicedSegments, r) && getOutlet(r) !== PRIMARY_OUTLET);
}
function containsEmptyPathMatches(segmentGroup, slicedSegments, routes2) {
  return routes2.some((r) => emptyPathMatch(segmentGroup, slicedSegments, r));
}
function emptyPathMatch(segmentGroup, slicedSegments, r) {
  if ((segmentGroup.hasChildren() || slicedSegments.length > 0) && r.pathMatch === "full") {
    return false;
  }
  return r.path === "";
}
function noLeftoversInUrl(segmentGroup, segments, outlet) {
  return segments.length === 0 && !segmentGroup.children[outlet];
}
var NoLeftoversInUrl = class {
};
async function recognize$1(injector, configLoader, rootComponentType, config, urlTree, urlSerializer, paramsInheritanceStrategy = "emptyOnly", abortSignal) {
  return new Recognizer(injector, configLoader, rootComponentType, config, urlTree, paramsInheritanceStrategy, urlSerializer, abortSignal).recognize();
}
var MAX_ALLOWED_REDIRECTS = 31;
var Recognizer = class {
  injector;
  configLoader;
  rootComponentType;
  config;
  urlTree;
  paramsInheritanceStrategy;
  urlSerializer;
  abortSignal;
  applyRedirects;
  absoluteRedirectCount = 0;
  allowRedirects = true;
  constructor(injector, configLoader, rootComponentType, config, urlTree, paramsInheritanceStrategy, urlSerializer, abortSignal) {
    this.injector = injector;
    this.configLoader = configLoader;
    this.rootComponentType = rootComponentType;
    this.config = config;
    this.urlTree = urlTree;
    this.paramsInheritanceStrategy = paramsInheritanceStrategy;
    this.urlSerializer = urlSerializer;
    this.abortSignal = abortSignal;
    this.applyRedirects = new ApplyRedirects(this.urlSerializer, this.urlTree);
  }
  noMatchError(e) {
    return new RuntimeError(4002, typeof ngDevMode === "undefined" || ngDevMode ? `Cannot match any routes. URL Segment: '${e.segmentGroup}'` : `'${e.segmentGroup}'`);
  }
  async recognize() {
    const rootSegmentGroup = split(this.urlTree.root, [], [], this.config).segmentGroup;
    const {
      children,
      rootSnapshot
    } = await this.match(rootSegmentGroup);
    const rootNode = new TreeNode(rootSnapshot, children);
    const routeState = new RouterStateSnapshot("", rootNode);
    const tree2 = createUrlTreeFromSnapshot(rootSnapshot, [], this.urlTree.queryParams, this.urlTree.fragment);
    tree2.queryParams = this.urlTree.queryParams;
    routeState.url = this.urlSerializer.serialize(tree2);
    return {
      state: routeState,
      tree: tree2
    };
  }
  async match(rootSegmentGroup) {
    const rootSnapshot = new ActivatedRouteSnapshot([], Object.freeze({}), Object.freeze(__spreadValues({}, this.urlTree.queryParams)), this.urlTree.fragment, Object.freeze({}), PRIMARY_OUTLET, this.rootComponentType, null, {}, this.injector);
    try {
      const children = await this.processSegmentGroup(this.injector, this.config, rootSegmentGroup, PRIMARY_OUTLET, rootSnapshot);
      return {
        children,
        rootSnapshot
      };
    } catch (e) {
      if (e instanceof AbsoluteRedirect) {
        this.urlTree = e.urlTree;
        return this.match(e.urlTree.root);
      }
      if (e instanceof NoMatch) {
        throw this.noMatchError(e);
      }
      throw e;
    }
  }
  async processSegmentGroup(injector, config, segmentGroup, outlet, parentRoute) {
    if (segmentGroup.segments.length === 0 && segmentGroup.hasChildren()) {
      return this.processChildren(injector, config, segmentGroup, parentRoute);
    }
    const child = await this.processSegment(injector, config, segmentGroup, segmentGroup.segments, outlet, true, parentRoute);
    return child instanceof TreeNode ? [child] : [];
  }
  async processChildren(injector, config, segmentGroup, parentRoute) {
    const childOutlets = [];
    for (const child of Object.keys(segmentGroup.children)) {
      if (child === "primary") {
        childOutlets.unshift(child);
      } else {
        childOutlets.push(child);
      }
    }
    let children = [];
    for (const childOutlet of childOutlets) {
      const child = segmentGroup.children[childOutlet];
      const sortedConfig = sortByMatchingOutlets(config, childOutlet);
      const outletChildren = await this.processSegmentGroup(injector, sortedConfig, child, childOutlet, parentRoute);
      children.push(...outletChildren);
    }
    const mergedChildren = mergeEmptyPathMatches(children);
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      checkOutletNameUniqueness(mergedChildren);
    }
    sortActivatedRouteSnapshots(mergedChildren);
    return mergedChildren;
  }
  async processSegment(injector, routes2, segmentGroup, segments, outlet, allowRedirects, parentRoute) {
    for (const r of routes2) {
      try {
        return await this.processSegmentAgainstRoute(r._injector ?? injector, routes2, r, segmentGroup, segments, outlet, allowRedirects, parentRoute);
      } catch (e) {
        if (e instanceof NoMatch || isEmptyError(e)) {
          continue;
        }
        throw e;
      }
    }
    if (noLeftoversInUrl(segmentGroup, segments, outlet)) {
      return new NoLeftoversInUrl();
    }
    throw new NoMatch(segmentGroup);
  }
  async processSegmentAgainstRoute(injector, routes2, route, rawSegment, segments, outlet, allowRedirects, parentRoute) {
    if (getOutlet(route) !== outlet && (outlet === PRIMARY_OUTLET || !emptyPathMatch(rawSegment, segments, route))) {
      throw new NoMatch(rawSegment);
    }
    if (route.redirectTo === void 0) {
      return this.matchSegmentAgainstRoute(injector, rawSegment, route, segments, outlet, parentRoute);
    }
    if (this.allowRedirects && allowRedirects) {
      return this.expandSegmentAgainstRouteUsingRedirect(injector, rawSegment, routes2, route, segments, outlet, parentRoute);
    }
    throw new NoMatch(rawSegment);
  }
  async expandSegmentAgainstRouteUsingRedirect(injector, segmentGroup, routes2, route, segments, outlet, parentRoute) {
    const {
      matched,
      parameters,
      consumedSegments,
      positionalParamSegments,
      remainingSegments
    } = match(segmentGroup, route, segments);
    if (!matched) throw new NoMatch(segmentGroup);
    if (typeof route.redirectTo === "string" && route.redirectTo[0] === "/") {
      this.absoluteRedirectCount++;
      if (this.absoluteRedirectCount > MAX_ALLOWED_REDIRECTS) {
        if (ngDevMode) {
          throw new RuntimeError(4016, `Detected possible infinite redirect when redirecting from '${this.urlTree}' to '${route.redirectTo}'.
This is currently a dev mode only error but will become a call stack size exceeded error in production in a future major version.`);
        }
        this.allowRedirects = false;
      }
    }
    const currentSnapshot = this.createSnapshot(injector, route, segments, parameters, parentRoute);
    if (this.abortSignal.aborted) {
      throw new Error(this.abortSignal.reason);
    }
    const newTree = await this.applyRedirects.applyRedirectCommands(consumedSegments, route.redirectTo, positionalParamSegments, createPreMatchRouteSnapshot(currentSnapshot), injector);
    const newSegments = await this.applyRedirects.lineralizeSegments(route, newTree);
    return this.processSegment(injector, routes2, segmentGroup, newSegments.concat(remainingSegments), outlet, false, parentRoute);
  }
  createSnapshot(injector, route, segments, parameters, parentRoute) {
    const snapshot = new ActivatedRouteSnapshot(segments, parameters, Object.freeze(__spreadValues({}, this.urlTree.queryParams)), this.urlTree.fragment, getData(route), getOutlet(route), route.component ?? route._loadedComponent ?? null, route, getResolve(route), injector);
    const inherited = getInherited(snapshot, parentRoute, this.paramsInheritanceStrategy);
    snapshot.params = Object.freeze(inherited.params);
    snapshot.data = Object.freeze(inherited.data);
    return snapshot;
  }
  async matchSegmentAgainstRoute(injector, rawSegment, route, segments, outlet, parentRoute) {
    if (this.abortSignal.aborted) {
      throw new Error(this.abortSignal.reason);
    }
    const createSnapshot = (result2) => this.createSnapshot(injector, route, result2.consumedSegments, result2.parameters, parentRoute);
    const result = await firstValueFrom(matchWithChecks(rawSegment, route, segments, injector, this.urlSerializer, createSnapshot, this.abortSignal));
    if (route.path === "**") {
      rawSegment.children = {};
    }
    if (!result?.matched) {
      throw new NoMatch(rawSegment);
    }
    injector = route._injector ?? injector;
    const {
      routes: childConfig
    } = await this.getChildConfig(injector, route, segments);
    const childInjector = route._loadedInjector ?? injector;
    const {
      parameters,
      consumedSegments,
      remainingSegments
    } = result;
    const snapshot = this.createSnapshot(injector, route, consumedSegments, parameters, parentRoute);
    const {
      segmentGroup,
      slicedSegments
    } = split(rawSegment, consumedSegments, remainingSegments, childConfig);
    if (slicedSegments.length === 0 && segmentGroup.hasChildren()) {
      const children = await this.processChildren(childInjector, childConfig, segmentGroup, snapshot);
      return new TreeNode(snapshot, children);
    }
    if (childConfig.length === 0 && slicedSegments.length === 0) {
      return new TreeNode(snapshot, []);
    }
    const matchedOnOutlet = getOutlet(route) === outlet;
    const child = await this.processSegment(childInjector, childConfig, segmentGroup, slicedSegments, matchedOnOutlet ? PRIMARY_OUTLET : outlet, true, snapshot);
    return new TreeNode(snapshot, child instanceof TreeNode ? [child] : []);
  }
  async getChildConfig(injector, route, segments) {
    if (route.children) {
      return {
        routes: route.children,
        injector
      };
    }
    if (route.loadChildren) {
      if (route._loadedRoutes !== void 0) {
        const ngModuleFactory = route._loadedNgModuleFactory;
        if (ngModuleFactory && !route._loadedInjector) {
          route._loadedInjector = ngModuleFactory.create(injector).injector;
        }
        return {
          routes: route._loadedRoutes,
          injector: route._loadedInjector
        };
      }
      if (this.abortSignal.aborted) {
        throw new Error(this.abortSignal.reason);
      }
      const shouldLoadResult = await firstValueFrom(runCanLoadGuards(injector, route, segments, this.urlSerializer, this.abortSignal));
      if (shouldLoadResult) {
        const cfg = await this.configLoader.loadChildren(injector, route);
        route._loadedRoutes = cfg.routes;
        route._loadedInjector = cfg.injector;
        route._loadedNgModuleFactory = cfg.factory;
        return cfg;
      }
      throw canLoadFails(route);
    }
    return {
      routes: [],
      injector
    };
  }
};
function sortActivatedRouteSnapshots(nodes) {
  nodes.sort((a, b) => {
    if (a.value.outlet === PRIMARY_OUTLET) return -1;
    if (b.value.outlet === PRIMARY_OUTLET) return 1;
    return a.value.outlet.localeCompare(b.value.outlet);
  });
}
function hasEmptyPathConfig(node) {
  const config = node.value.routeConfig;
  return config && config.path === "";
}
function mergeEmptyPathMatches(nodes) {
  const result = [];
  const mergedNodes = /* @__PURE__ */ new Set();
  for (const node of nodes) {
    if (!hasEmptyPathConfig(node)) {
      result.push(node);
      continue;
    }
    const duplicateEmptyPathNode = result.find((resultNode) => node.value.routeConfig === resultNode.value.routeConfig);
    if (duplicateEmptyPathNode !== void 0) {
      duplicateEmptyPathNode.children.push(...node.children);
      mergedNodes.add(duplicateEmptyPathNode);
    } else {
      result.push(node);
    }
  }
  for (const mergedNode of mergedNodes) {
    const mergedChildren = mergeEmptyPathMatches(mergedNode.children);
    result.push(new TreeNode(mergedNode.value, mergedChildren));
  }
  return result.filter((n) => !mergedNodes.has(n));
}
function checkOutletNameUniqueness(nodes) {
  const names = {};
  nodes.forEach((n) => {
    const routeWithSameOutletName = names[n.value.outlet];
    if (routeWithSameOutletName) {
      const p = routeWithSameOutletName.url.map((s) => s.toString()).join("/");
      const c = n.value.url.map((s) => s.toString()).join("/");
      throw new RuntimeError(4006, (typeof ngDevMode === "undefined" || ngDevMode) && `Two segments cannot have the same outlet name: '${p}' and '${c}'.`);
    }
    names[n.value.outlet] = n.value;
  });
}
function getData(route) {
  return route.data || {};
}
function getResolve(route) {
  return route.resolve || {};
}
function recognize(injector, configLoader, rootComponentType, config, serializer, paramsInheritanceStrategy, abortSignal) {
  return mergeMap(async (t) => {
    const {
      state: targetSnapshot,
      tree: urlAfterRedirects
    } = await recognize$1(injector, configLoader, rootComponentType, config, t.extractedUrl, serializer, paramsInheritanceStrategy, abortSignal);
    return __spreadProps(__spreadValues({}, t), {
      targetSnapshot,
      urlAfterRedirects
    });
  });
}
function resolveData(paramsInheritanceStrategy) {
  return mergeMap((t) => {
    const {
      targetSnapshot,
      guards: {
        canActivateChecks
      }
    } = t;
    if (!canActivateChecks.length) {
      return of(t);
    }
    const routesWithResolversToRun = new Set(canActivateChecks.map((check) => check.route));
    const routesNeedingDataUpdates = /* @__PURE__ */ new Set();
    for (const route of routesWithResolversToRun) {
      if (routesNeedingDataUpdates.has(route)) {
        continue;
      }
      for (const newRoute of flattenRouteTree(route)) {
        routesNeedingDataUpdates.add(newRoute);
      }
    }
    let routesProcessed = 0;
    return from(routesNeedingDataUpdates).pipe(concatMap((route) => {
      if (routesWithResolversToRun.has(route)) {
        return runResolve(route, targetSnapshot, paramsInheritanceStrategy);
      } else {
        route.data = getInherited(route, route.parent, paramsInheritanceStrategy).resolve;
        return of(void 0);
      }
    }), tap(() => routesProcessed++), takeLast(1), mergeMap((_) => routesProcessed === routesNeedingDataUpdates.size ? of(t) : EMPTY));
  });
}
function flattenRouteTree(route) {
  const descendants = route.children.map((child) => flattenRouteTree(child)).flat();
  return [route, ...descendants];
}
function runResolve(futureARS, futureRSS, paramsInheritanceStrategy) {
  const config = futureARS.routeConfig;
  const resolve = futureARS._resolve;
  if (config?.title !== void 0 && !hasStaticTitle(config)) {
    resolve[RouteTitleKey] = config.title;
  }
  return defer(() => {
    futureARS.data = getInherited(futureARS, futureARS.parent, paramsInheritanceStrategy).resolve;
    return resolveNode(resolve, futureARS, futureRSS).pipe(map((resolvedData) => {
      futureARS._resolvedData = resolvedData;
      futureARS.data = __spreadValues(__spreadValues({}, futureARS.data), resolvedData);
      return null;
    }));
  });
}
function resolveNode(resolve, futureARS, futureRSS) {
  const keys = getDataKeys(resolve);
  if (keys.length === 0) {
    return of({});
  }
  const data = {};
  return from(keys).pipe(mergeMap((key) => getResolver(resolve[key], futureARS, futureRSS).pipe(first(), tap((value) => {
    if (value instanceof RedirectCommand) {
      throw redirectingNavigationError(new DefaultUrlSerializer(), value);
    }
    data[key] = value;
  }))), takeLast(1), map(() => data), catchError((e) => isEmptyError(e) ? EMPTY : throwError(e)));
}
function getResolver(injectionToken, futureARS, futureRSS) {
  const closestInjector = futureARS._environmentInjector;
  const resolver = getTokenOrFunctionIdentity(injectionToken, closestInjector);
  const resolverValue = resolver.resolve ? resolver.resolve(futureARS, futureRSS) : runInInjectionContext(closestInjector, () => resolver(futureARS, futureRSS));
  return wrapIntoObservable(resolverValue);
}
function switchTap(next) {
  return switchMap((v) => {
    const nextResult = next(v);
    if (nextResult) {
      return from(nextResult).pipe(map(() => v));
    }
    return of(v);
  });
}
var TitleStrategy = class _TitleStrategy {
  buildTitle(snapshot) {
    let pageTitle;
    let route = snapshot.root;
    while (route !== void 0) {
      pageTitle = this.getResolvedTitleForRoute(route) ?? pageTitle;
      route = route.children.find((child) => child.outlet === PRIMARY_OUTLET);
    }
    return pageTitle;
  }
  getResolvedTitleForRoute(snapshot) {
    return snapshot.data[RouteTitleKey];
  }
  static \u0275fac = function TitleStrategy_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TitleStrategy)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _TitleStrategy,
    factory: () => (() => inject(DefaultTitleStrategy))(),
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TitleStrategy, [{
    type: Injectable,
    args: [{
      providedIn: "root",
      useFactory: () => inject(DefaultTitleStrategy)
    }]
  }], null, null);
})();
var DefaultTitleStrategy = class _DefaultTitleStrategy extends TitleStrategy {
  title;
  constructor(title) {
    super();
    this.title = title;
  }
  updateTitle(snapshot) {
    const title = this.buildTitle(snapshot);
    if (title !== void 0) {
      this.title.setTitle(title);
    }
  }
  static \u0275fac = function DefaultTitleStrategy_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DefaultTitleStrategy)(\u0275\u0275inject(Title));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _DefaultTitleStrategy,
    factory: _DefaultTitleStrategy.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DefaultTitleStrategy, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: Title
  }], null);
})();
var ROUTER_CONFIGURATION = new InjectionToken(typeof ngDevMode === "undefined" || ngDevMode ? "router config" : "", {
  factory: () => ({})
});
var ROUTES = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "ROUTES" : "");
var RouterConfigLoader = class _RouterConfigLoader {
  componentLoaders = /* @__PURE__ */ new WeakMap();
  childrenLoaders = /* @__PURE__ */ new WeakMap();
  onLoadStartListener;
  onLoadEndListener;
  compiler = inject(Compiler);
  async loadComponent(injector, route) {
    if (this.componentLoaders.get(route)) {
      return this.componentLoaders.get(route);
    } else if (route._loadedComponent) {
      return Promise.resolve(route._loadedComponent);
    }
    if (this.onLoadStartListener) {
      this.onLoadStartListener(route);
    }
    const loader = (async () => {
      try {
        const loaded = await wrapIntoPromise(runInInjectionContext(injector, () => route.loadComponent()));
        const component = await maybeResolveResources(maybeUnwrapDefaultExport(loaded));
        if (this.onLoadEndListener) {
          this.onLoadEndListener(route);
        }
        (typeof ngDevMode === "undefined" || ngDevMode) && assertStandalone(route.path ?? "", component);
        route._loadedComponent = component;
        return component;
      } finally {
        this.componentLoaders.delete(route);
      }
    })();
    this.componentLoaders.set(route, loader);
    return loader;
  }
  loadChildren(parentInjector, route) {
    if (this.childrenLoaders.get(route)) {
      return this.childrenLoaders.get(route);
    } else if (route._loadedRoutes) {
      return Promise.resolve({
        routes: route._loadedRoutes,
        injector: route._loadedInjector
      });
    }
    if (this.onLoadStartListener) {
      this.onLoadStartListener(route);
    }
    const loader = (async () => {
      try {
        const result = await loadChildren(route, this.compiler, parentInjector, this.onLoadEndListener);
        route._loadedRoutes = result.routes;
        route._loadedInjector = result.injector;
        route._loadedNgModuleFactory = result.factory;
        return result;
      } finally {
        this.childrenLoaders.delete(route);
      }
    })();
    this.childrenLoaders.set(route, loader);
    return loader;
  }
  static \u0275fac = function RouterConfigLoader_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RouterConfigLoader)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _RouterConfigLoader,
    factory: _RouterConfigLoader.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RouterConfigLoader, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
async function loadChildren(route, compiler, parentInjector, onLoadEndListener) {
  const loaded = await wrapIntoPromise(runInInjectionContext(parentInjector, () => route.loadChildren()));
  const t = await maybeResolveResources(maybeUnwrapDefaultExport(loaded));
  let factoryOrRoutes;
  if (t instanceof NgModuleFactory$1 || Array.isArray(t)) {
    factoryOrRoutes = t;
  } else {
    factoryOrRoutes = await compiler.compileModuleAsync(t);
  }
  if (onLoadEndListener) {
    onLoadEndListener(route);
  }
  let injector;
  let rawRoutes;
  let requireStandaloneComponents = false;
  let factory = void 0;
  if (Array.isArray(factoryOrRoutes)) {
    rawRoutes = factoryOrRoutes;
    requireStandaloneComponents = true;
  } else {
    injector = factoryOrRoutes.create(parentInjector).injector;
    factory = factoryOrRoutes;
    rawRoutes = injector.get(ROUTES, [], {
      optional: true,
      self: true
    }).flat();
  }
  const routes2 = rawRoutes.map(standardizeConfig);
  (typeof ngDevMode === "undefined" || ngDevMode) && validateConfig(routes2, route.path, requireStandaloneComponents);
  return {
    routes: routes2,
    injector,
    factory
  };
}
function isWrappedDefaultExport(value) {
  return value && typeof value === "object" && "default" in value;
}
function maybeUnwrapDefaultExport(input2) {
  return isWrappedDefaultExport(input2) ? input2["default"] : input2;
}
async function maybeResolveResources(value) {
  if (false) {
    try {
      await resolveComponentResources(fetch);
    } catch (error) {
      console.error(error);
    }
  }
  return value;
}
var UrlHandlingStrategy = class _UrlHandlingStrategy {
  static \u0275fac = function UrlHandlingStrategy_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UrlHandlingStrategy)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _UrlHandlingStrategy,
    factory: () => (() => inject(DefaultUrlHandlingStrategy))(),
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UrlHandlingStrategy, [{
    type: Injectable,
    args: [{
      providedIn: "root",
      useFactory: () => inject(DefaultUrlHandlingStrategy)
    }]
  }], null, null);
})();
var DefaultUrlHandlingStrategy = class _DefaultUrlHandlingStrategy {
  shouldProcessUrl(url) {
    return true;
  }
  extract(url) {
    return url;
  }
  merge(newUrlPart, wholeUrl) {
    return newUrlPart;
  }
  static \u0275fac = function DefaultUrlHandlingStrategy_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DefaultUrlHandlingStrategy)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _DefaultUrlHandlingStrategy,
    factory: _DefaultUrlHandlingStrategy.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DefaultUrlHandlingStrategy, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var CREATE_VIEW_TRANSITION = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "view transition helper" : "");
var VIEW_TRANSITION_OPTIONS = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "view transition options" : "");
function createViewTransition(injector, from2, to) {
  const transitionOptions = injector.get(VIEW_TRANSITION_OPTIONS);
  const document = injector.get(DOCUMENT);
  if (!document.startViewTransition || transitionOptions.skipNextTransition) {
    transitionOptions.skipNextTransition = false;
    return new Promise((resolve) => setTimeout(resolve));
  }
  let resolveViewTransitionStarted;
  const viewTransitionStarted = new Promise((resolve) => {
    resolveViewTransitionStarted = resolve;
  });
  const transition = document.startViewTransition(() => {
    resolveViewTransitionStarted();
    return createRenderPromise(injector);
  });
  transition.updateCallbackDone.catch((error) => {
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      console.error(error);
    }
  });
  transition.ready.catch((error) => {
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      console.error(error);
    }
  });
  transition.finished.catch((error) => {
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      console.error(error);
    }
  });
  const {
    onViewTransitionCreated
  } = transitionOptions;
  if (onViewTransitionCreated) {
    runInInjectionContext(injector, () => onViewTransitionCreated({
      transition,
      from: from2,
      to
    }));
  }
  return viewTransitionStarted;
}
function createRenderPromise(injector) {
  return new Promise((resolve) => {
    afterNextRender({
      read: () => setTimeout(resolve)
    }, {
      injector
    });
  });
}
var noop = () => {
};
var NAVIGATION_ERROR_HANDLER = new InjectionToken(typeof ngDevMode === "undefined" || ngDevMode ? "navigation error handler" : "");
var NavigationTransitions = class _NavigationTransitions {
  currentNavigation = signal(null, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "currentNavigation"
  } : {}), {
    equal: () => false
  }));
  currentTransition = null;
  lastSuccessfulNavigation = signal(null, ...ngDevMode ? [{
    debugName: "lastSuccessfulNavigation"
  }] : []);
  events = new Subject();
  transitionAbortWithErrorSubject = new Subject();
  configLoader = inject(RouterConfigLoader);
  environmentInjector = inject(EnvironmentInjector);
  destroyRef = inject(DestroyRef);
  urlSerializer = inject(UrlSerializer);
  rootContexts = inject(ChildrenOutletContexts);
  location = inject(Location);
  inputBindingEnabled = inject(INPUT_BINDER, {
    optional: true
  }) !== null;
  titleStrategy = inject(TitleStrategy);
  options = inject(ROUTER_CONFIGURATION, {
    optional: true
  }) || {};
  paramsInheritanceStrategy = this.options.paramsInheritanceStrategy || "emptyOnly";
  urlHandlingStrategy = inject(UrlHandlingStrategy);
  createViewTransition = inject(CREATE_VIEW_TRANSITION, {
    optional: true
  });
  navigationErrorHandler = inject(NAVIGATION_ERROR_HANDLER, {
    optional: true
  });
  navigationId = 0;
  get hasRequestedNavigation() {
    return this.navigationId !== 0;
  }
  transitions;
  afterPreactivation = () => of(void 0);
  rootComponentType = null;
  destroyed = false;
  constructor() {
    const onLoadStart = (r) => this.events.next(new RouteConfigLoadStart(r));
    const onLoadEnd = (r) => this.events.next(new RouteConfigLoadEnd(r));
    this.configLoader.onLoadEndListener = onLoadEnd;
    this.configLoader.onLoadStartListener = onLoadStart;
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
    });
  }
  complete() {
    this.transitions?.complete();
  }
  handleNavigationRequest(request) {
    const id = ++this.navigationId;
    untracked(() => {
      this.transitions?.next(__spreadProps(__spreadValues({}, request), {
        extractedUrl: this.urlHandlingStrategy.extract(request.rawUrl),
        targetSnapshot: null,
        targetRouterState: null,
        guards: {
          canActivateChecks: [],
          canDeactivateChecks: []
        },
        guardsResult: null,
        id,
        routesRecognizeHandler: {},
        beforeActivateHandler: {}
      }));
    });
  }
  setupNavigations(router) {
    this.transitions = new BehaviorSubject(null);
    return this.transitions.pipe(filter((t) => t !== null), switchMap((overallTransitionState) => {
      let completedOrAborted = false;
      const abortController = new AbortController();
      const shouldContinueNavigation = () => {
        return !completedOrAborted && this.currentTransition?.id === overallTransitionState.id;
      };
      return of(overallTransitionState).pipe(switchMap((t) => {
        if (this.navigationId > overallTransitionState.id) {
          const cancellationReason = typeof ngDevMode === "undefined" || ngDevMode ? `Navigation ID ${overallTransitionState.id} is not equal to the current navigation id ${this.navigationId}` : "";
          this.cancelNavigationTransition(overallTransitionState, cancellationReason, NavigationCancellationCode.SupersededByNewNavigation);
          return EMPTY;
        }
        this.currentTransition = overallTransitionState;
        const lastSuccessfulNavigation = this.lastSuccessfulNavigation();
        this.currentNavigation.set({
          id: t.id,
          initialUrl: t.rawUrl,
          extractedUrl: t.extractedUrl,
          targetBrowserUrl: typeof t.extras.browserUrl === "string" ? this.urlSerializer.parse(t.extras.browserUrl) : t.extras.browserUrl,
          trigger: t.source,
          extras: t.extras,
          previousNavigation: !lastSuccessfulNavigation ? null : __spreadProps(__spreadValues({}, lastSuccessfulNavigation), {
            previousNavigation: null
          }),
          abort: () => abortController.abort(),
          routesRecognizeHandler: t.routesRecognizeHandler,
          beforeActivateHandler: t.beforeActivateHandler
        });
        const urlTransition = !router.navigated || this.isUpdatingInternalState() || this.isUpdatedBrowserUrl();
        const onSameUrlNavigation = t.extras.onSameUrlNavigation ?? router.onSameUrlNavigation;
        if (!urlTransition && onSameUrlNavigation !== "reload") {
          const reason = typeof ngDevMode === "undefined" || ngDevMode ? `Navigation to ${t.rawUrl} was ignored because it is the same as the current Router URL.` : "";
          this.events.next(new NavigationSkipped(t.id, this.urlSerializer.serialize(t.rawUrl), reason, NavigationSkippedCode.IgnoredSameUrlNavigation));
          t.resolve(false);
          return EMPTY;
        }
        if (this.urlHandlingStrategy.shouldProcessUrl(t.rawUrl)) {
          return of(t).pipe(switchMap((t2) => {
            this.events.next(new NavigationStart(t2.id, this.urlSerializer.serialize(t2.extractedUrl), t2.source, t2.restoredState));
            if (t2.id !== this.navigationId) {
              return EMPTY;
            }
            return Promise.resolve(t2);
          }), recognize(this.environmentInjector, this.configLoader, this.rootComponentType, router.config, this.urlSerializer, this.paramsInheritanceStrategy, abortController.signal), tap((t2) => {
            overallTransitionState.targetSnapshot = t2.targetSnapshot;
            overallTransitionState.urlAfterRedirects = t2.urlAfterRedirects;
            this.currentNavigation.update((nav) => {
              nav.finalUrl = t2.urlAfterRedirects;
              return nav;
            });
            this.events.next(new BeforeRoutesRecognized());
          }), switchMap((value) => from(overallTransitionState.routesRecognizeHandler.deferredHandle ?? of(void 0)).pipe(map(() => value))), tap(() => {
            const routesRecognized = new RoutesRecognized(t.id, this.urlSerializer.serialize(t.extractedUrl), this.urlSerializer.serialize(t.urlAfterRedirects), t.targetSnapshot);
            this.events.next(routesRecognized);
          }));
        } else if (urlTransition && this.urlHandlingStrategy.shouldProcessUrl(t.currentRawUrl)) {
          const {
            id,
            extractedUrl,
            source,
            restoredState,
            extras
          } = t;
          const navStart = new NavigationStart(id, this.urlSerializer.serialize(extractedUrl), source, restoredState);
          this.events.next(navStart);
          const targetSnapshot = createEmptyState(this.rootComponentType, this.environmentInjector).snapshot;
          this.currentTransition = overallTransitionState = __spreadProps(__spreadValues({}, t), {
            targetSnapshot,
            urlAfterRedirects: extractedUrl,
            extras: __spreadProps(__spreadValues({}, extras), {
              skipLocationChange: false,
              replaceUrl: false
            })
          });
          this.currentNavigation.update((nav) => {
            nav.finalUrl = extractedUrl;
            return nav;
          });
          return of(overallTransitionState);
        } else {
          const reason = typeof ngDevMode === "undefined" || ngDevMode ? `Navigation was ignored because the UrlHandlingStrategy indicated neither the current URL ${t.currentRawUrl} nor target URL ${t.rawUrl} should be processed.` : "";
          this.events.next(new NavigationSkipped(t.id, this.urlSerializer.serialize(t.extractedUrl), reason, NavigationSkippedCode.IgnoredByUrlHandlingStrategy));
          t.resolve(false);
          return EMPTY;
        }
      }), map((t) => {
        const guardsStart = new GuardsCheckStart(t.id, this.urlSerializer.serialize(t.extractedUrl), this.urlSerializer.serialize(t.urlAfterRedirects), t.targetSnapshot);
        this.events.next(guardsStart);
        this.currentTransition = overallTransitionState = __spreadProps(__spreadValues({}, t), {
          guards: getAllRouteGuards(t.targetSnapshot, t.currentSnapshot, this.rootContexts)
        });
        return overallTransitionState;
      }), checkGuards((evt) => this.events.next(evt)), switchMap((t) => {
        overallTransitionState.guardsResult = t.guardsResult;
        if (t.guardsResult && typeof t.guardsResult !== "boolean") {
          throw redirectingNavigationError(this.urlSerializer, t.guardsResult);
        }
        const guardsEnd = new GuardsCheckEnd(t.id, this.urlSerializer.serialize(t.extractedUrl), this.urlSerializer.serialize(t.urlAfterRedirects), t.targetSnapshot, !!t.guardsResult);
        this.events.next(guardsEnd);
        if (!shouldContinueNavigation()) {
          return EMPTY;
        }
        if (!t.guardsResult) {
          this.cancelNavigationTransition(t, "", NavigationCancellationCode.GuardRejected);
          return EMPTY;
        }
        if (t.guards.canActivateChecks.length === 0) {
          return of(t);
        }
        const resolveStart = new ResolveStart(t.id, this.urlSerializer.serialize(t.extractedUrl), this.urlSerializer.serialize(t.urlAfterRedirects), t.targetSnapshot);
        this.events.next(resolveStart);
        if (!shouldContinueNavigation()) {
          return EMPTY;
        }
        let dataResolved = false;
        return of(t).pipe(resolveData(this.paramsInheritanceStrategy), tap({
          next: () => {
            dataResolved = true;
            const resolveEnd = new ResolveEnd(t.id, this.urlSerializer.serialize(t.extractedUrl), this.urlSerializer.serialize(t.urlAfterRedirects), t.targetSnapshot);
            this.events.next(resolveEnd);
          },
          complete: () => {
            if (!dataResolved) {
              this.cancelNavigationTransition(t, typeof ngDevMode === "undefined" || ngDevMode ? `At least one route resolver didn't emit any value.` : "", NavigationCancellationCode.NoDataFromResolver);
            }
          }
        }));
      }), switchTap((t) => {
        const loadComponents = (route) => {
          const loaders2 = [];
          if (route.routeConfig?._loadedComponent) {
            route.component = route.routeConfig?._loadedComponent;
          } else if (route.routeConfig?.loadComponent) {
            const injector = route._environmentInjector;
            loaders2.push(this.configLoader.loadComponent(injector, route.routeConfig).then((loadedComponent) => {
              route.component = loadedComponent;
            }));
          }
          for (const child of route.children) {
            loaders2.push(...loadComponents(child));
          }
          return loaders2;
        };
        const loaders = loadComponents(t.targetSnapshot.root);
        return loaders.length === 0 ? of(t) : from(Promise.all(loaders).then(() => t));
      }), switchTap(() => this.afterPreactivation()), switchMap(() => {
        const {
          currentSnapshot,
          targetSnapshot
        } = overallTransitionState;
        const viewTransitionStarted = this.createViewTransition?.(this.environmentInjector, currentSnapshot.root, targetSnapshot.root);
        return viewTransitionStarted ? from(viewTransitionStarted).pipe(map(() => overallTransitionState)) : of(overallTransitionState);
      }), take(1), switchMap((t) => {
        const targetRouterState = createRouterState(router.routeReuseStrategy, t.targetSnapshot, t.currentRouterState);
        this.currentTransition = overallTransitionState = t = __spreadProps(__spreadValues({}, t), {
          targetRouterState
        });
        this.currentNavigation.update((nav) => {
          nav.targetRouterState = targetRouterState;
          return nav;
        });
        this.events.next(new BeforeActivateRoutes());
        const deferred = overallTransitionState.beforeActivateHandler.deferredHandle;
        return deferred ? from(deferred.then(() => t)) : of(t);
      }), tap((t) => {
        new ActivateRoutes(router.routeReuseStrategy, overallTransitionState.targetRouterState, overallTransitionState.currentRouterState, (evt) => this.events.next(evt), this.inputBindingEnabled).activate(this.rootContexts);
        if (!shouldContinueNavigation()) {
          return;
        }
        completedOrAborted = true;
        this.currentNavigation.update((nav) => {
          nav.abort = noop;
          return nav;
        });
        this.lastSuccessfulNavigation.set(untracked(this.currentNavigation));
        this.events.next(new NavigationEnd(t.id, this.urlSerializer.serialize(t.extractedUrl), this.urlSerializer.serialize(t.urlAfterRedirects)));
        this.titleStrategy?.updateTitle(t.targetRouterState.snapshot);
        t.resolve(true);
      }), takeUntil(abortSignalToObservable(abortController.signal).pipe(filter(() => !completedOrAborted && !overallTransitionState.targetRouterState), tap(() => {
        this.cancelNavigationTransition(overallTransitionState, abortController.signal.reason + "", NavigationCancellationCode.Aborted);
      }))), tap({
        complete: () => {
          completedOrAborted = true;
        }
      }), takeUntil(this.transitionAbortWithErrorSubject.pipe(tap((err) => {
        throw err;
      }))), finalize(() => {
        abortController.abort();
        if (!completedOrAborted) {
          const cancelationReason = typeof ngDevMode === "undefined" || ngDevMode ? `Navigation ID ${overallTransitionState.id} is not equal to the current navigation id ${this.navigationId}` : "";
          this.cancelNavigationTransition(overallTransitionState, cancelationReason, NavigationCancellationCode.SupersededByNewNavigation);
        }
        if (this.currentTransition?.id === overallTransitionState.id) {
          this.currentNavigation.set(null);
          this.currentTransition = null;
        }
      }), catchError((e) => {
        completedOrAborted = true;
        if (this.destroyed) {
          overallTransitionState.resolve(false);
          return EMPTY;
        }
        if (isNavigationCancelingError(e)) {
          this.events.next(new NavigationCancel(overallTransitionState.id, this.urlSerializer.serialize(overallTransitionState.extractedUrl), e.message, e.cancellationCode));
          if (!isRedirectingNavigationCancelingError(e)) {
            overallTransitionState.resolve(false);
          } else {
            this.events.next(new RedirectRequest(e.url, e.navigationBehaviorOptions));
          }
        } else {
          const navigationError = new NavigationError(overallTransitionState.id, this.urlSerializer.serialize(overallTransitionState.extractedUrl), e, overallTransitionState.targetSnapshot ?? void 0);
          try {
            const navigationErrorHandlerResult = runInInjectionContext(this.environmentInjector, () => this.navigationErrorHandler?.(navigationError));
            if (navigationErrorHandlerResult instanceof RedirectCommand) {
              const {
                message,
                cancellationCode
              } = redirectingNavigationError(this.urlSerializer, navigationErrorHandlerResult);
              this.events.next(new NavigationCancel(overallTransitionState.id, this.urlSerializer.serialize(overallTransitionState.extractedUrl), message, cancellationCode));
              this.events.next(new RedirectRequest(navigationErrorHandlerResult.redirectTo, navigationErrorHandlerResult.navigationBehaviorOptions));
            } else {
              this.events.next(navigationError);
              throw e;
            }
          } catch (ee) {
            if (this.options.resolveNavigationPromiseOnError) {
              overallTransitionState.resolve(false);
            } else {
              overallTransitionState.reject(ee);
            }
          }
        }
        return EMPTY;
      }));
    }));
  }
  cancelNavigationTransition(t, reason, code) {
    const navCancel = new NavigationCancel(t.id, this.urlSerializer.serialize(t.extractedUrl), reason, code);
    this.events.next(navCancel);
    t.resolve(false);
  }
  isUpdatingInternalState() {
    return this.currentTransition?.extractedUrl.toString() !== this.currentTransition?.currentUrlTree.toString();
  }
  isUpdatedBrowserUrl() {
    const currentBrowserUrl = this.urlHandlingStrategy.extract(this.urlSerializer.parse(this.location.path(true)));
    const currentNavigation = untracked(this.currentNavigation);
    const targetBrowserUrl = currentNavigation?.targetBrowserUrl ?? currentNavigation?.extractedUrl;
    return currentBrowserUrl.toString() !== targetBrowserUrl?.toString() && !currentNavigation?.extras.skipLocationChange;
  }
  static \u0275fac = function NavigationTransitions_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NavigationTransitions)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _NavigationTransitions,
    factory: _NavigationTransitions.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NavigationTransitions, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
function isBrowserTriggeredNavigation(source) {
  return source !== IMPERATIVE_NAVIGATION;
}
var ROUTE_INJECTOR_CLEANUP = new InjectionToken(typeof ngDevMode === "undefined" || ngDevMode ? "RouteInjectorCleanup" : "");
var RouteReuseStrategy = class _RouteReuseStrategy {
  static \u0275fac = function RouteReuseStrategy_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RouteReuseStrategy)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _RouteReuseStrategy,
    factory: () => (() => inject(DefaultRouteReuseStrategy))(),
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RouteReuseStrategy, [{
    type: Injectable,
    args: [{
      providedIn: "root",
      useFactory: () => inject(DefaultRouteReuseStrategy)
    }]
  }], null, null);
})();
var BaseRouteReuseStrategy = class {
  shouldDetach(route) {
    return false;
  }
  store(route, detachedTree) {
  }
  shouldAttach(route) {
    return false;
  }
  retrieve(route) {
    return null;
  }
  shouldReuseRoute(future, curr) {
    return future.routeConfig === curr.routeConfig;
  }
  shouldDestroyInjector(route) {
    return true;
  }
};
var DefaultRouteReuseStrategy = class _DefaultRouteReuseStrategy extends BaseRouteReuseStrategy {
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275DefaultRouteReuseStrategy_BaseFactory;
    return function DefaultRouteReuseStrategy_Factory(__ngFactoryType__) {
      return (\u0275DefaultRouteReuseStrategy_BaseFactory || (\u0275DefaultRouteReuseStrategy_BaseFactory = \u0275\u0275getInheritedFactory(_DefaultRouteReuseStrategy)))(__ngFactoryType__ || _DefaultRouteReuseStrategy);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _DefaultRouteReuseStrategy,
    factory: _DefaultRouteReuseStrategy.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DefaultRouteReuseStrategy, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var StateManager = class _StateManager {
  urlSerializer = inject(UrlSerializer);
  options = inject(ROUTER_CONFIGURATION, {
    optional: true
  }) || {};
  canceledNavigationResolution = this.options.canceledNavigationResolution || "replace";
  location = inject(Location);
  urlHandlingStrategy = inject(UrlHandlingStrategy);
  urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred";
  currentUrlTree = new UrlTree();
  getCurrentUrlTree() {
    return this.currentUrlTree;
  }
  rawUrlTree = this.currentUrlTree;
  getRawUrlTree() {
    return this.rawUrlTree;
  }
  createBrowserPath({
    finalUrl,
    initialUrl,
    targetBrowserUrl
  }) {
    const rawUrl = finalUrl !== void 0 ? this.urlHandlingStrategy.merge(finalUrl, initialUrl) : initialUrl;
    const url = targetBrowserUrl ?? rawUrl;
    const path = url instanceof UrlTree ? this.urlSerializer.serialize(url) : url;
    return path;
  }
  commitTransition({
    targetRouterState,
    finalUrl,
    initialUrl
  }) {
    if (finalUrl && targetRouterState) {
      this.currentUrlTree = finalUrl;
      this.rawUrlTree = this.urlHandlingStrategy.merge(finalUrl, initialUrl);
      this.routerState = targetRouterState;
    } else {
      this.rawUrlTree = initialUrl;
    }
  }
  routerState = createEmptyState(null, inject(EnvironmentInjector));
  getRouterState() {
    return this.routerState;
  }
  _stateMemento = this.createStateMemento();
  get stateMemento() {
    return this._stateMemento;
  }
  updateStateMemento() {
    this._stateMemento = this.createStateMemento();
  }
  createStateMemento() {
    return {
      rawUrlTree: this.rawUrlTree,
      currentUrlTree: this.currentUrlTree,
      routerState: this.routerState
    };
  }
  restoredState() {
    return this.location.getState();
  }
  static \u0275fac = function StateManager_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _StateManager)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _StateManager,
    factory: () => (() => inject(HistoryStateManager))(),
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StateManager, [{
    type: Injectable,
    args: [{
      providedIn: "root",
      useFactory: () => inject(HistoryStateManager)
    }]
  }], null, null);
})();
var HistoryStateManager = class _HistoryStateManager extends StateManager {
  currentPageId = 0;
  lastSuccessfulId = -1;
  get browserPageId() {
    if (this.canceledNavigationResolution !== "computed") {
      return this.currentPageId;
    }
    return this.restoredState()?.\u0275routerPageId ?? this.currentPageId;
  }
  registerNonRouterCurrentEntryChangeListener(listener) {
    return this.location.subscribe((event) => {
      if (event["type"] === "popstate") {
        setTimeout(() => {
          listener(event["url"], event.state, "popstate", {
            replaceUrl: true
          });
        });
      }
    });
  }
  handleRouterEvent(e, currentTransition) {
    if (e instanceof NavigationStart) {
      this.updateStateMemento();
    } else if (e instanceof NavigationSkipped) {
      this.commitTransition(currentTransition);
    } else if (e instanceof RoutesRecognized) {
      if (this.urlUpdateStrategy === "eager") {
        if (!currentTransition.extras.skipLocationChange) {
          this.setBrowserUrl(this.createBrowserPath(currentTransition), currentTransition);
        }
      }
    } else if (e instanceof BeforeActivateRoutes) {
      this.commitTransition(currentTransition);
      if (this.urlUpdateStrategy === "deferred" && !currentTransition.extras.skipLocationChange) {
        this.setBrowserUrl(this.createBrowserPath(currentTransition), currentTransition);
      }
    } else if (e instanceof NavigationCancel && !isRedirectingEvent(e)) {
      this.restoreHistory(currentTransition);
    } else if (e instanceof NavigationError) {
      this.restoreHistory(currentTransition, true);
    } else if (e instanceof NavigationEnd) {
      this.lastSuccessfulId = e.id;
      this.currentPageId = this.browserPageId;
    }
  }
  setBrowserUrl(path, {
    extras,
    id
  }) {
    const {
      replaceUrl,
      state
    } = extras;
    if (this.location.isCurrentPathEqualTo(path) || !!replaceUrl) {
      const currentBrowserPageId = this.browserPageId;
      const newState = __spreadValues(__spreadValues({}, state), this.generateNgRouterState(id, currentBrowserPageId));
      this.location.replaceState(path, "", newState);
    } else {
      const newState = __spreadValues(__spreadValues({}, state), this.generateNgRouterState(id, this.browserPageId + 1));
      this.location.go(path, "", newState);
    }
  }
  restoreHistory(navigation, restoringFromCaughtError = false) {
    if (this.canceledNavigationResolution === "computed") {
      const currentBrowserPageId = this.browserPageId;
      const targetPagePosition = this.currentPageId - currentBrowserPageId;
      if (targetPagePosition !== 0) {
        this.location.historyGo(targetPagePosition);
      } else if (this.getCurrentUrlTree() === navigation.finalUrl && targetPagePosition === 0) {
        this.resetInternalState(navigation);
        this.resetUrlToCurrentUrlTree();
      } else ;
    } else if (this.canceledNavigationResolution === "replace") {
      if (restoringFromCaughtError) {
        this.resetInternalState(navigation);
      }
      this.resetUrlToCurrentUrlTree();
    }
  }
  resetInternalState({
    finalUrl
  }) {
    this.routerState = this.stateMemento.routerState;
    this.currentUrlTree = this.stateMemento.currentUrlTree;
    this.rawUrlTree = this.urlHandlingStrategy.merge(this.currentUrlTree, finalUrl ?? this.rawUrlTree);
  }
  resetUrlToCurrentUrlTree() {
    this.location.replaceState(this.urlSerializer.serialize(this.getRawUrlTree()), "", this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId));
  }
  generateNgRouterState(navigationId, routerPageId) {
    if (this.canceledNavigationResolution === "computed") {
      return {
        navigationId,
        \u0275routerPageId: routerPageId
      };
    }
    return {
      navigationId
    };
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275HistoryStateManager_BaseFactory;
    return function HistoryStateManager_Factory(__ngFactoryType__) {
      return (\u0275HistoryStateManager_BaseFactory || (\u0275HistoryStateManager_BaseFactory = \u0275\u0275getInheritedFactory(_HistoryStateManager)))(__ngFactoryType__ || _HistoryStateManager);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _HistoryStateManager,
    factory: _HistoryStateManager.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HistoryStateManager, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
function afterNextNavigation(router, action) {
  router.events.pipe(filter((e) => e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError || e instanceof NavigationSkipped), map((e) => {
    if (e instanceof NavigationEnd || e instanceof NavigationSkipped) {
      return 0;
    }
    const redirecting = e instanceof NavigationCancel ? e.code === NavigationCancellationCode.Redirect || e.code === NavigationCancellationCode.SupersededByNewNavigation : false;
    return redirecting ? 2 : 1;
  }), filter((result) => result !== 2), take(1)).subscribe(() => {
    action();
  });
}
var Router = class _Router {
  get currentUrlTree() {
    return this.stateManager.getCurrentUrlTree();
  }
  get rawUrlTree() {
    return this.stateManager.getRawUrlTree();
  }
  disposed = false;
  nonRouterCurrentEntryChangeSubscription;
  console = inject(Console);
  stateManager = inject(StateManager);
  options = inject(ROUTER_CONFIGURATION, {
    optional: true
  }) || {};
  pendingTasks = inject(PendingTasksInternal);
  urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred";
  navigationTransitions = inject(NavigationTransitions);
  urlSerializer = inject(UrlSerializer);
  location = inject(Location);
  urlHandlingStrategy = inject(UrlHandlingStrategy);
  injector = inject(EnvironmentInjector);
  _events = new Subject();
  get events() {
    return this._events;
  }
  get routerState() {
    return this.stateManager.getRouterState();
  }
  navigated = false;
  routeReuseStrategy = inject(RouteReuseStrategy);
  injectorCleanup = inject(ROUTE_INJECTOR_CLEANUP, {
    optional: true
  });
  onSameUrlNavigation = this.options.onSameUrlNavigation || "ignore";
  config = inject(ROUTES, {
    optional: true
  })?.flat() ?? [];
  componentInputBindingEnabled = !!inject(INPUT_BINDER, {
    optional: true
  });
  currentNavigation = this.navigationTransitions.currentNavigation.asReadonly();
  constructor() {
    this.resetConfig(this.config);
    this.navigationTransitions.setupNavigations(this).subscribe({
      error: (e) => {
      }
    });
    this.subscribeToNavigationEvents();
  }
  eventsSubscription = new Subscription();
  subscribeToNavigationEvents() {
    const subscription = this.navigationTransitions.events.subscribe((e) => {
      try {
        const currentTransition = this.navigationTransitions.currentTransition;
        const currentNavigation = untracked(this.navigationTransitions.currentNavigation);
        if (currentTransition !== null && currentNavigation !== null) {
          this.stateManager.handleRouterEvent(e, currentNavigation);
          if (e instanceof NavigationCancel && e.code !== NavigationCancellationCode.Redirect && e.code !== NavigationCancellationCode.SupersededByNewNavigation) {
            this.navigated = true;
          } else if (e instanceof NavigationEnd) {
            this.navigated = true;
            this.injectorCleanup?.(this.routeReuseStrategy, this.routerState, this.config);
          } else if (e instanceof RedirectRequest) {
            const opts = e.navigationBehaviorOptions;
            const mergedTree = this.urlHandlingStrategy.merge(e.url, currentTransition.currentRawUrl);
            const extras = __spreadValues({
              scroll: currentTransition.extras.scroll,
              browserUrl: currentTransition.extras.browserUrl,
              info: currentTransition.extras.info,
              skipLocationChange: currentTransition.extras.skipLocationChange,
              replaceUrl: currentTransition.extras.replaceUrl || this.urlUpdateStrategy === "eager" || isBrowserTriggeredNavigation(currentTransition.source)
            }, opts);
            this.scheduleNavigation(mergedTree, IMPERATIVE_NAVIGATION, null, extras, {
              resolve: currentTransition.resolve,
              reject: currentTransition.reject,
              promise: currentTransition.promise
            });
          }
        }
        if (isPublicRouterEvent(e)) {
          this._events.next(e);
        }
      } catch (e2) {
        this.navigationTransitions.transitionAbortWithErrorSubject.next(e2);
      }
    });
    this.eventsSubscription.add(subscription);
  }
  resetRootComponentType(rootComponentType) {
    this.routerState.root.component = rootComponentType;
    this.navigationTransitions.rootComponentType = rootComponentType;
  }
  initialNavigation() {
    this.setUpLocationChangeListener();
    if (!this.navigationTransitions.hasRequestedNavigation) {
      this.navigateToSyncWithBrowser(this.location.path(true), IMPERATIVE_NAVIGATION, this.stateManager.restoredState(), {
        replaceUrl: true
      });
    }
  }
  setUpLocationChangeListener() {
    this.nonRouterCurrentEntryChangeSubscription ??= this.stateManager.registerNonRouterCurrentEntryChangeListener((url, state, source, extras) => {
      this.navigateToSyncWithBrowser(url, source, state, extras);
    });
  }
  navigateToSyncWithBrowser(url, source, state, extras) {
    const restoredState = state?.navigationId ? state : null;
    if (state) {
      const stateCopy = __spreadValues({}, state);
      delete stateCopy.navigationId;
      delete stateCopy.\u0275routerPageId;
      if (Object.keys(stateCopy).length !== 0) {
        extras.state = stateCopy;
      }
    }
    const urlTree = this.parseUrl(url);
    this.scheduleNavigation(urlTree, source, restoredState, extras).catch((e) => {
      if (this.disposed) {
        return;
      }
      this.injector.get(INTERNAL_APPLICATION_ERROR_HANDLER)(e);
    });
  }
  get url() {
    return this.serializeUrl(this.currentUrlTree);
  }
  getCurrentNavigation() {
    return untracked(this.navigationTransitions.currentNavigation);
  }
  get lastSuccessfulNavigation() {
    return this.navigationTransitions.lastSuccessfulNavigation;
  }
  resetConfig(config) {
    (typeof ngDevMode === "undefined" || ngDevMode) && validateConfig(config);
    this.config = config.map(standardizeConfig);
    this.navigated = false;
  }
  ngOnDestroy() {
    this.dispose();
  }
  dispose() {
    this._events.unsubscribe();
    this.navigationTransitions.complete();
    this.nonRouterCurrentEntryChangeSubscription?.unsubscribe();
    this.nonRouterCurrentEntryChangeSubscription = void 0;
    this.disposed = true;
    this.eventsSubscription.unsubscribe();
  }
  createUrlTree(commands, navigationExtras = {}) {
    const {
      relativeTo,
      queryParams,
      fragment,
      queryParamsHandling,
      preserveFragment
    } = navigationExtras;
    const f = preserveFragment ? this.currentUrlTree.fragment : fragment;
    let q = null;
    switch (queryParamsHandling ?? this.options.defaultQueryParamsHandling) {
      case "merge":
        q = __spreadValues(__spreadValues({}, this.currentUrlTree.queryParams), queryParams);
        break;
      case "preserve":
        q = this.currentUrlTree.queryParams;
        break;
      default:
        q = queryParams || null;
    }
    if (q !== null) {
      q = this.removeEmptyProps(q);
    }
    let relativeToUrlSegmentGroup;
    try {
      const relativeToSnapshot = relativeTo ? relativeTo.snapshot : this.routerState.snapshot.root;
      relativeToUrlSegmentGroup = createSegmentGroupFromRoute(relativeToSnapshot);
    } catch (e) {
      if (typeof commands[0] !== "string" || commands[0][0] !== "/") {
        commands = [];
      }
      relativeToUrlSegmentGroup = this.currentUrlTree.root;
    }
    return createUrlTreeFromSegmentGroup(relativeToUrlSegmentGroup, commands, q, f ?? null, this.urlSerializer);
  }
  navigateByUrl(url, extras = {
    skipLocationChange: false
  }) {
    const urlTree = isUrlTree(url) ? url : this.parseUrl(url);
    const mergedTree = this.urlHandlingStrategy.merge(urlTree, this.rawUrlTree);
    return this.scheduleNavigation(mergedTree, IMPERATIVE_NAVIGATION, null, extras);
  }
  navigate(commands, extras = {
    skipLocationChange: false
  }) {
    validateCommands(commands);
    return this.navigateByUrl(this.createUrlTree(commands, extras), extras);
  }
  serializeUrl(url) {
    return this.urlSerializer.serialize(url);
  }
  parseUrl(url) {
    try {
      return this.urlSerializer.parse(url);
    } catch (e) {
      this.console.warn(formatRuntimeError(4018, ngDevMode && `Error parsing URL ${url}. Falling back to '/' instead. 
` + e));
      return this.urlSerializer.parse("/");
    }
  }
  isActive(url, matchOptions) {
    let options;
    if (matchOptions === true) {
      options = __spreadValues({}, exactMatchOptions);
    } else if (matchOptions === false) {
      options = __spreadValues({}, subsetMatchOptions);
    } else {
      options = __spreadValues(__spreadValues({}, subsetMatchOptions), matchOptions);
    }
    if (isUrlTree(url)) {
      return containsTree(this.currentUrlTree, url, options);
    }
    const urlTree = this.parseUrl(url);
    return containsTree(this.currentUrlTree, urlTree, options);
  }
  removeEmptyProps(params) {
    return Object.entries(params).reduce((result, [key, value]) => {
      if (value !== null && value !== void 0) {
        result[key] = value;
      }
      return result;
    }, {});
  }
  scheduleNavigation(rawUrl, source, restoredState, extras, priorPromise) {
    if (this.disposed) {
      return Promise.resolve(false);
    }
    let resolve;
    let reject;
    let promise;
    if (priorPromise) {
      resolve = priorPromise.resolve;
      reject = priorPromise.reject;
      promise = priorPromise.promise;
    } else {
      promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
    }
    const taskId = this.pendingTasks.add();
    afterNextNavigation(this, () => {
      queueMicrotask(() => this.pendingTasks.remove(taskId));
    });
    this.navigationTransitions.handleNavigationRequest({
      source,
      restoredState,
      currentUrlTree: this.currentUrlTree,
      currentRawUrl: this.currentUrlTree,
      rawUrl,
      extras,
      resolve,
      reject,
      promise,
      currentSnapshot: this.routerState.snapshot,
      currentRouterState: this.routerState
    });
    return promise.catch(Promise.reject.bind(Promise));
  }
  static \u0275fac = function Router_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Router)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _Router,
    factory: _Router.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Router, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
function validateCommands(commands) {
  for (let i = 0; i < commands.length; i++) {
    const cmd = commands[i];
    if (cmd == null) {
      throw new RuntimeError(4008, (typeof ngDevMode === "undefined" || ngDevMode) && `The requested path contains ${cmd} segment at index ${i}`);
    }
  }
}

// node_modules/@angular/router/fesm2022/_router_module-chunk.mjs
var ReactiveRouterState = class _ReactiveRouterState {
  router = inject(Router);
  stateManager = inject(StateManager);
  fragment = signal("", ...ngDevMode ? [{
    debugName: "fragment"
  }] : []);
  queryParams = signal({}, ...ngDevMode ? [{
    debugName: "queryParams"
  }] : []);
  path = signal("", ...ngDevMode ? [{
    debugName: "path"
  }] : []);
  serializer = inject(UrlSerializer);
  constructor() {
    this.updateState();
    this.router.events?.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.updateState();
      }
    });
  }
  updateState() {
    const {
      fragment,
      root,
      queryParams
    } = this.stateManager.getCurrentUrlTree();
    this.fragment.set(fragment);
    this.queryParams.set(queryParams);
    this.path.set(this.serializer.serialize(new UrlTree(root)));
  }
  static \u0275fac = function ReactiveRouterState_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ReactiveRouterState)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _ReactiveRouterState,
    factory: _ReactiveRouterState.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ReactiveRouterState, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
var RouterLink = class _RouterLink {
  router;
  route;
  tabIndexAttribute;
  renderer;
  el;
  locationStrategy;
  hrefAttributeValue = inject(new HostAttributeToken("href"), {
    optional: true
  });
  reactiveHref = linkedSignal(() => {
    if (!this.isAnchorElement) {
      return this.hrefAttributeValue;
    }
    return this.computeHref(this._urlTree());
  }, ...ngDevMode ? [{
    debugName: "reactiveHref"
  }] : []);
  get href() {
    return untracked(this.reactiveHref);
  }
  set href(value) {
    this.reactiveHref.set(value);
  }
  set target(value) {
    this._target.set(value);
  }
  get target() {
    return untracked(this._target);
  }
  _target = signal(void 0, ...ngDevMode ? [{
    debugName: "_target"
  }] : []);
  set queryParams(value) {
    this._queryParams.set(value);
  }
  get queryParams() {
    return untracked(this._queryParams);
  }
  _queryParams = signal(void 0, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "_queryParams"
  } : {}), {
    equal: () => false
  }));
  set fragment(value) {
    this._fragment.set(value);
  }
  get fragment() {
    return untracked(this._fragment);
  }
  _fragment = signal(void 0, ...ngDevMode ? [{
    debugName: "_fragment"
  }] : []);
  set queryParamsHandling(value) {
    this._queryParamsHandling.set(value);
  }
  get queryParamsHandling() {
    return untracked(this._queryParamsHandling);
  }
  _queryParamsHandling = signal(void 0, ...ngDevMode ? [{
    debugName: "_queryParamsHandling"
  }] : []);
  set state(value) {
    this._state.set(value);
  }
  get state() {
    return untracked(this._state);
  }
  _state = signal(void 0, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "_state"
  } : {}), {
    equal: () => false
  }));
  set info(value) {
    this._info.set(value);
  }
  get info() {
    return untracked(this._info);
  }
  _info = signal(void 0, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "_info"
  } : {}), {
    equal: () => false
  }));
  set relativeTo(value) {
    this._relativeTo.set(value);
  }
  get relativeTo() {
    return untracked(this._relativeTo);
  }
  _relativeTo = signal(void 0, ...ngDevMode ? [{
    debugName: "_relativeTo"
  }] : []);
  set preserveFragment(value) {
    this._preserveFragment.set(value);
  }
  get preserveFragment() {
    return untracked(this._preserveFragment);
  }
  _preserveFragment = signal(false, ...ngDevMode ? [{
    debugName: "_preserveFragment"
  }] : []);
  set skipLocationChange(value) {
    this._skipLocationChange.set(value);
  }
  get skipLocationChange() {
    return untracked(this._skipLocationChange);
  }
  _skipLocationChange = signal(false, ...ngDevMode ? [{
    debugName: "_skipLocationChange"
  }] : []);
  set replaceUrl(value) {
    this._replaceUrl.set(value);
  }
  get replaceUrl() {
    return untracked(this._replaceUrl);
  }
  _replaceUrl = signal(false, ...ngDevMode ? [{
    debugName: "_replaceUrl"
  }] : []);
  isAnchorElement;
  onChanges = new Subject();
  applicationErrorHandler = inject(INTERNAL_APPLICATION_ERROR_HANDLER);
  options = inject(ROUTER_CONFIGURATION, {
    optional: true
  });
  reactiveRouterState = inject(ReactiveRouterState);
  constructor(router, route, tabIndexAttribute, renderer, el, locationStrategy) {
    this.router = router;
    this.route = route;
    this.tabIndexAttribute = tabIndexAttribute;
    this.renderer = renderer;
    this.el = el;
    this.locationStrategy = locationStrategy;
    const tagName = el.nativeElement.tagName?.toLowerCase();
    this.isAnchorElement = tagName === "a" || tagName === "area" || !!(typeof customElements === "object" && customElements.get(tagName)?.observedAttributes?.includes?.("href"));
    if (typeof ngDevMode !== "undefined" && ngDevMode) {
      effect(() => {
        if (isUrlTree(this.routerLinkInput()) && (this._fragment() !== void 0 || this._queryParams() || this._queryParamsHandling() || this._preserveFragment() || this._relativeTo())) {
          throw new RuntimeError(4017, "Cannot configure queryParams or fragment when using a UrlTree as the routerLink input value.");
        }
      });
    }
  }
  setTabIndexIfNotOnNativeEl(newTabIndex) {
    if (this.tabIndexAttribute != null || this.isAnchorElement) {
      return;
    }
    this.applyAttributeValue("tabindex", newTabIndex);
  }
  ngOnChanges(changes) {
    this.onChanges.next(this);
  }
  routerLinkInput = signal(null, ...ngDevMode ? [{
    debugName: "routerLinkInput"
  }] : []);
  set routerLink(commandsOrUrlTree) {
    if (commandsOrUrlTree == null) {
      this.routerLinkInput.set(null);
      this.setTabIndexIfNotOnNativeEl(null);
    } else {
      if (isUrlTree(commandsOrUrlTree)) {
        this.routerLinkInput.set(commandsOrUrlTree);
      } else {
        this.routerLinkInput.set(Array.isArray(commandsOrUrlTree) ? commandsOrUrlTree : [commandsOrUrlTree]);
      }
      this.setTabIndexIfNotOnNativeEl("0");
    }
  }
  onClick(button, ctrlKey, shiftKey, altKey, metaKey) {
    const urlTree = this._urlTree();
    if (urlTree === null) {
      return true;
    }
    if (this.isAnchorElement) {
      if (button !== 0 || ctrlKey || shiftKey || altKey || metaKey) {
        return true;
      }
      if (typeof this.target === "string" && this.target != "_self") {
        return true;
      }
    }
    const extras = {
      skipLocationChange: this.skipLocationChange,
      replaceUrl: this.replaceUrl,
      state: this.state,
      info: this.info
    };
    this.router.navigateByUrl(urlTree, extras)?.catch((e) => {
      this.applicationErrorHandler(e);
    });
    return !this.isAnchorElement;
  }
  ngOnDestroy() {
  }
  applyAttributeValue(attrName, attrValue) {
    const renderer = this.renderer;
    const nativeElement = this.el.nativeElement;
    if (attrValue !== null) {
      renderer.setAttribute(nativeElement, attrName, attrValue);
    } else {
      renderer.removeAttribute(nativeElement, attrName);
    }
  }
  _urlTree = computed(() => {
    this.reactiveRouterState.path();
    if (this._preserveFragment()) {
      this.reactiveRouterState.fragment();
    }
    const shouldTrackParams = (handling) => handling === "preserve" || handling === "merge";
    if (shouldTrackParams(this._queryParamsHandling()) || shouldTrackParams(this.options?.defaultQueryParamsHandling)) {
      this.reactiveRouterState.queryParams();
    }
    const routerLinkInput = this.routerLinkInput();
    if (routerLinkInput === null || !this.router.createUrlTree) {
      return null;
    } else if (isUrlTree(routerLinkInput)) {
      return routerLinkInput;
    }
    return this.router.createUrlTree(routerLinkInput, {
      relativeTo: this._relativeTo() !== void 0 ? this._relativeTo() : this.route,
      queryParams: this._queryParams(),
      fragment: this._fragment(),
      queryParamsHandling: this._queryParamsHandling(),
      preserveFragment: this._preserveFragment()
    });
  }, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "_urlTree"
  } : {}), {
    equal: (a, b) => this.computeHref(a) === this.computeHref(b)
  }));
  get urlTree() {
    return untracked(this._urlTree);
  }
  computeHref(urlTree) {
    return urlTree !== null && this.locationStrategy ? this.locationStrategy?.prepareExternalUrl(this.router.serializeUrl(urlTree)) ?? "" : null;
  }
  static \u0275fac = function RouterLink_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RouterLink)(\u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275injectAttribute("tabindex"), \u0275\u0275directiveInject(Renderer2), \u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(LocationStrategy));
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _RouterLink,
    selectors: [["", "routerLink", ""]],
    hostVars: 2,
    hostBindings: function RouterLink_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("click", function RouterLink_click_HostBindingHandler($event) {
          return ctx.onClick($event.button, $event.ctrlKey, $event.shiftKey, $event.altKey, $event.metaKey);
        });
      }
      if (rf & 2) {
        \u0275\u0275attribute("href", ctx.reactiveHref(), \u0275\u0275sanitizeUrlOrResourceUrl)("target", ctx._target());
      }
    },
    inputs: {
      target: "target",
      queryParams: "queryParams",
      fragment: "fragment",
      queryParamsHandling: "queryParamsHandling",
      state: "state",
      info: "info",
      relativeTo: "relativeTo",
      preserveFragment: [2, "preserveFragment", "preserveFragment", booleanAttribute],
      skipLocationChange: [2, "skipLocationChange", "skipLocationChange", booleanAttribute],
      replaceUrl: [2, "replaceUrl", "replaceUrl", booleanAttribute],
      routerLink: "routerLink"
    },
    features: [\u0275\u0275NgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RouterLink, [{
    type: Directive,
    args: [{
      selector: "[routerLink]",
      host: {
        "[attr.href]": "reactiveHref()",
        "[attr.target]": "_target()"
      }
    }]
  }], () => [{
    type: Router
  }, {
    type: ActivatedRoute
  }, {
    type: void 0,
    decorators: [{
      type: Attribute,
      args: ["tabindex"]
    }]
  }, {
    type: Renderer2
  }, {
    type: ElementRef
  }, {
    type: LocationStrategy
  }], {
    target: [{
      type: Input
    }],
    queryParams: [{
      type: Input
    }],
    fragment: [{
      type: Input
    }],
    queryParamsHandling: [{
      type: Input
    }],
    state: [{
      type: Input
    }],
    info: [{
      type: Input
    }],
    relativeTo: [{
      type: Input
    }],
    preserveFragment: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    skipLocationChange: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    replaceUrl: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    routerLink: [{
      type: Input
    }],
    onClick: [{
      type: HostListener,
      args: ["click", ["$event.button", "$event.ctrlKey", "$event.shiftKey", "$event.altKey", "$event.metaKey"]]
    }]
  });
})();
var RouterLinkActive = class _RouterLinkActive {
  router;
  element;
  renderer;
  cdr;
  links;
  classes = [];
  routerEventsSubscription;
  linkInputChangesSubscription;
  _isActive = false;
  get isActive() {
    return this._isActive;
  }
  routerLinkActiveOptions = {
    exact: false
  };
  ariaCurrentWhenActive;
  isActiveChange = new EventEmitter();
  link = inject(RouterLink, {
    optional: true
  });
  constructor(router, element, renderer, cdr) {
    this.router = router;
    this.element = element;
    this.renderer = renderer;
    this.cdr = cdr;
    this.routerEventsSubscription = router.events.subscribe((s) => {
      if (s instanceof NavigationEnd) {
        this.update();
      }
    });
  }
  ngAfterContentInit() {
    of(this.links.changes, of(null)).pipe(mergeAll()).subscribe((_) => {
      this.update();
      this.subscribeToEachLinkOnChanges();
    });
  }
  subscribeToEachLinkOnChanges() {
    this.linkInputChangesSubscription?.unsubscribe();
    const allLinkChanges = [...this.links.toArray(), this.link].filter((link) => !!link).map((link) => link.onChanges);
    this.linkInputChangesSubscription = from(allLinkChanges).pipe(mergeAll()).subscribe((link) => {
      if (this._isActive !== this.isLinkActive(this.router)(link)) {
        this.update();
      }
    });
  }
  set routerLinkActive(data) {
    const classes = Array.isArray(data) ? data : data.split(" ");
    this.classes = classes.filter((c) => !!c);
  }
  ngOnChanges(changes) {
    this.update();
  }
  ngOnDestroy() {
    this.routerEventsSubscription.unsubscribe();
    this.linkInputChangesSubscription?.unsubscribe();
  }
  update() {
    if (!this.links || !this.router.navigated) return;
    queueMicrotask(() => {
      const hasActiveLinks = this.hasActiveLinks();
      this.classes.forEach((c) => {
        if (hasActiveLinks) {
          this.renderer.addClass(this.element.nativeElement, c);
        } else {
          this.renderer.removeClass(this.element.nativeElement, c);
        }
      });
      if (hasActiveLinks && this.ariaCurrentWhenActive !== void 0) {
        this.renderer.setAttribute(this.element.nativeElement, "aria-current", this.ariaCurrentWhenActive.toString());
      } else {
        this.renderer.removeAttribute(this.element.nativeElement, "aria-current");
      }
      if (this._isActive !== hasActiveLinks) {
        this._isActive = hasActiveLinks;
        this.cdr.markForCheck();
        this.isActiveChange.emit(hasActiveLinks);
      }
    });
  }
  isLinkActive(router) {
    const options = isActiveMatchOptions(this.routerLinkActiveOptions) ? this.routerLinkActiveOptions : this.routerLinkActiveOptions.exact ?? false ? __spreadValues({}, exactMatchOptions) : __spreadValues({}, subsetMatchOptions);
    return (link) => {
      const urlTree = link.urlTree;
      return urlTree ? untracked(isActive(urlTree, router, options)) : false;
    };
  }
  hasActiveLinks() {
    const isActiveCheckFn = this.isLinkActive(this.router);
    return this.link && isActiveCheckFn(this.link) || this.links.some(isActiveCheckFn);
  }
  static \u0275fac = function RouterLinkActive_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RouterLinkActive)(\u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(Renderer2), \u0275\u0275directiveInject(ChangeDetectorRef));
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _RouterLinkActive,
    selectors: [["", "routerLinkActive", ""]],
    contentQueries: function RouterLinkActive_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        \u0275\u0275contentQuery(dirIndex, RouterLink, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.links = _t);
      }
    },
    inputs: {
      routerLinkActiveOptions: "routerLinkActiveOptions",
      ariaCurrentWhenActive: "ariaCurrentWhenActive",
      routerLinkActive: "routerLinkActive"
    },
    outputs: {
      isActiveChange: "isActiveChange"
    },
    exportAs: ["routerLinkActive"],
    features: [\u0275\u0275NgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RouterLinkActive, [{
    type: Directive,
    args: [{
      selector: "[routerLinkActive]",
      exportAs: "routerLinkActive"
    }]
  }], () => [{
    type: Router
  }, {
    type: ElementRef
  }, {
    type: Renderer2
  }, {
    type: ChangeDetectorRef
  }], {
    links: [{
      type: ContentChildren,
      args: [RouterLink, {
        descendants: true
      }]
    }],
    routerLinkActiveOptions: [{
      type: Input
    }],
    ariaCurrentWhenActive: [{
      type: Input
    }],
    isActiveChange: [{
      type: Output
    }],
    routerLinkActive: [{
      type: Input
    }]
  });
})();
function isActiveMatchOptions(options) {
  const o = options;
  return !!(o.paths || o.matrixParams || o.queryParams || o.fragment);
}
var PreloadingStrategy = class {
};
var PreloadAllModules = class _PreloadAllModules {
  preload(route, fn) {
    return fn().pipe(catchError(() => of(null)));
  }
  static \u0275fac = function PreloadAllModules_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PreloadAllModules)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _PreloadAllModules,
    factory: _PreloadAllModules.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PreloadAllModules, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var NoPreloading = class _NoPreloading {
  preload(route, fn) {
    return of(null);
  }
  static \u0275fac = function NoPreloading_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NoPreloading)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _NoPreloading,
    factory: _NoPreloading.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NoPreloading, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var RouterPreloader = class _RouterPreloader {
  router;
  injector;
  preloadingStrategy;
  loader;
  subscription;
  constructor(router, injector, preloadingStrategy, loader) {
    this.router = router;
    this.injector = injector;
    this.preloadingStrategy = preloadingStrategy;
    this.loader = loader;
  }
  setUpPreloading() {
    this.subscription = this.router.events.pipe(filter((e) => e instanceof NavigationEnd), concatMap(() => this.preload())).subscribe(() => {
    });
  }
  preload() {
    return this.processRoutes(this.injector, this.router.config);
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
  processRoutes(injector, routes2) {
    const res = [];
    for (const route of routes2) {
      if (route.providers && !route._injector) {
        route._injector = createEnvironmentInjector(route.providers, injector, typeof ngDevMode === "undefined" || ngDevMode ? `Route: ${route.path}` : "");
      }
      const injectorForCurrentRoute = route._injector ?? injector;
      if (route._loadedNgModuleFactory && !route._loadedInjector) {
        route._loadedInjector = route._loadedNgModuleFactory.create(injectorForCurrentRoute).injector;
      }
      const injectorForChildren = route._loadedInjector ?? injectorForCurrentRoute;
      if (route.loadChildren && !route._loadedRoutes && route.canLoad === void 0 || route.loadComponent && !route._loadedComponent) {
        res.push(this.preloadConfig(injectorForCurrentRoute, route));
      }
      if (route.children || route._loadedRoutes) {
        res.push(this.processRoutes(injectorForChildren, route.children ?? route._loadedRoutes));
      }
    }
    return from(res).pipe(mergeAll());
  }
  preloadConfig(injector, route) {
    return this.preloadingStrategy.preload(route, () => {
      if (injector.destroyed) {
        return of(null);
      }
      let loadedChildren$;
      if (route.loadChildren && route.canLoad === void 0) {
        loadedChildren$ = from(this.loader.loadChildren(injector, route));
      } else {
        loadedChildren$ = of(null);
      }
      const recursiveLoadChildren$ = loadedChildren$.pipe(mergeMap((config) => {
        if (config === null) {
          return of(void 0);
        }
        route._loadedRoutes = config.routes;
        route._loadedInjector = config.injector;
        route._loadedNgModuleFactory = config.factory;
        return this.processRoutes(config.injector ?? injector, config.routes);
      }));
      if (route.loadComponent && !route._loadedComponent) {
        const loadComponent$ = this.loader.loadComponent(injector, route);
        return from([recursiveLoadChildren$, loadComponent$]).pipe(mergeAll());
      } else {
        return recursiveLoadChildren$;
      }
    });
  }
  static \u0275fac = function RouterPreloader_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RouterPreloader)(\u0275\u0275inject(Router), \u0275\u0275inject(EnvironmentInjector), \u0275\u0275inject(PreloadingStrategy), \u0275\u0275inject(RouterConfigLoader));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _RouterPreloader,
    factory: _RouterPreloader.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RouterPreloader, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: Router
  }, {
    type: EnvironmentInjector
  }, {
    type: PreloadingStrategy
  }, {
    type: RouterConfigLoader
  }], null);
})();
var ROUTER_SCROLLER = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "Router Scroller" : "");
var RouterScroller = class _RouterScroller {
  options;
  routerEventsSubscription;
  scrollEventsSubscription;
  lastId = 0;
  lastSource = IMPERATIVE_NAVIGATION;
  restoredId = 0;
  store = {};
  urlSerializer = inject(UrlSerializer);
  zone = inject(NgZone);
  viewportScroller = inject(ViewportScroller);
  transitions = inject(NavigationTransitions);
  constructor(options) {
    this.options = options;
    this.options.scrollPositionRestoration ||= "disabled";
    this.options.anchorScrolling ||= "disabled";
  }
  init() {
    if (this.options.scrollPositionRestoration !== "disabled") {
      this.viewportScroller.setHistoryScrollRestoration("manual");
    }
    this.routerEventsSubscription = this.createScrollEvents();
    this.scrollEventsSubscription = this.consumeScrollEvents();
  }
  createScrollEvents() {
    return this.transitions.events.subscribe((e) => {
      if (e instanceof NavigationStart) {
        this.store[this.lastId] = this.viewportScroller.getScrollPosition();
        this.lastSource = e.navigationTrigger;
        this.restoredId = e.restoredState ? e.restoredState.navigationId : 0;
      } else if (e instanceof NavigationEnd) {
        this.lastId = e.id;
        this.scheduleScrollEvent(e, this.urlSerializer.parse(e.urlAfterRedirects).fragment);
      } else if (e instanceof NavigationSkipped && e.code === NavigationSkippedCode.IgnoredSameUrlNavigation) {
        this.lastSource = void 0;
        this.restoredId = 0;
        this.scheduleScrollEvent(e, this.urlSerializer.parse(e.url).fragment);
      }
    });
  }
  consumeScrollEvents() {
    return this.transitions.events.subscribe((e) => {
      if (!(e instanceof Scroll) || e.scrollBehavior === "manual") return;
      const instantScroll = {
        behavior: "instant"
      };
      if (e.position) {
        if (this.options.scrollPositionRestoration === "top") {
          this.viewportScroller.scrollToPosition([0, 0], instantScroll);
        } else if (this.options.scrollPositionRestoration === "enabled") {
          this.viewportScroller.scrollToPosition(e.position, instantScroll);
        }
      } else {
        if (e.anchor && this.options.anchorScrolling === "enabled") {
          this.viewportScroller.scrollToAnchor(e.anchor);
        } else if (this.options.scrollPositionRestoration !== "disabled") {
          this.viewportScroller.scrollToPosition([0, 0]);
        }
      }
    });
  }
  scheduleScrollEvent(routerEvent, anchor) {
    const scroll = untracked(this.transitions.currentNavigation)?.extras.scroll;
    this.zone.runOutsideAngular(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve);
        if (typeof requestAnimationFrame !== "undefined") {
          requestAnimationFrame(resolve);
        }
      });
      this.zone.run(() => {
        this.transitions.events.next(new Scroll(routerEvent, this.lastSource === "popstate" ? this.store[this.restoredId] : null, anchor, scroll));
      });
    });
  }
  ngOnDestroy() {
    this.routerEventsSubscription?.unsubscribe();
    this.scrollEventsSubscription?.unsubscribe();
  }
  static \u0275fac = function RouterScroller_Factory(__ngFactoryType__) {
    \u0275\u0275invalidFactory();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _RouterScroller,
    factory: _RouterScroller.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RouterScroller, [{
    type: Injectable
  }], () => [{
    type: void 0
  }], null);
})();
function getLoadedRoutes(route) {
  return route._loadedRoutes;
}
function getRouterInstance(injector) {
  return injector.get(Router, null, {
    optional: true
  });
}
function navigateByUrl(router, url) {
  if (!(router instanceof Router)) {
    throw new Error("The provided router is not an Angular Router.");
  }
  return router.navigateByUrl(url);
}
var NavigationStateManager = class _NavigationStateManager extends StateManager {
  injector = inject(EnvironmentInjector);
  navigation = inject(PlatformNavigation);
  inMemoryScrollingEnabled = inject(ROUTER_SCROLLER, {
    optional: true
  }) !== null;
  base = new URL(inject(PlatformLocation).href).origin;
  appRootURL = new URL(this.location.prepareExternalUrl?.("/") ?? "/", this.base).href;
  precommitHandlerSupported = inject(PRECOMMIT_HANDLER_SUPPORTED);
  activeHistoryEntry = this.navigation.currentEntry;
  currentNavigation = {};
  nonRouterCurrentEntryChangeSubject = new Subject();
  nonRouterEntryChangeListener;
  get registered() {
    return this.nonRouterEntryChangeListener !== void 0 && !this.nonRouterEntryChangeListener.closed;
  }
  constructor() {
    super();
    const navigateListener = (event) => {
      this.handleNavigate(event);
    };
    this.navigation.addEventListener("navigate", navigateListener);
    inject(DestroyRef).onDestroy(() => this.navigation.removeEventListener("navigate", navigateListener));
  }
  registerNonRouterCurrentEntryChangeListener(listener) {
    this.activeHistoryEntry = this.navigation.currentEntry;
    this.nonRouterEntryChangeListener = this.nonRouterCurrentEntryChangeSubject.subscribe(({
      path,
      state
    }) => {
      listener(path, state, "popstate", !this.precommitHandlerSupported ? {
        replaceUrl: true
      } : {});
    });
    return this.nonRouterEntryChangeListener;
  }
  async handleRouterEvent(e, transition) {
    this.currentNavigation = __spreadProps(__spreadValues({}, this.currentNavigation), {
      routerTransition: transition
    });
    if (e instanceof NavigationStart) {
      this.updateStateMemento();
      if (this.precommitHandlerSupported) {
        this.maybeCreateNavigationForTransition(transition);
      }
    } else if (e instanceof NavigationSkipped) {
      this.finishNavigation();
      this.commitTransition(transition);
    } else if (e instanceof BeforeRoutesRecognized) {
      transition.routesRecognizeHandler.deferredHandle = new Promise(async (resolve) => {
        if (this.urlUpdateStrategy === "eager") {
          try {
            this.maybeCreateNavigationForTransition(transition);
            await this.currentNavigation.commitUrl?.();
          } catch {
            return;
          }
        }
        resolve();
      });
    } else if (e instanceof BeforeActivateRoutes) {
      transition.beforeActivateHandler.deferredHandle = new Promise(async (resolve) => {
        if (this.urlUpdateStrategy === "deferred") {
          try {
            this.maybeCreateNavigationForTransition(transition);
            await this.currentNavigation.commitUrl?.();
          } catch {
            return;
          }
        }
        this.commitTransition(transition);
        resolve();
      });
    } else if (e instanceof NavigationCancel || e instanceof NavigationError) {
      const redirectingBeforeUrlCommit = e instanceof NavigationCancel && e.code === NavigationCancellationCode.Redirect && !!this.currentNavigation.commitUrl;
      if (redirectingBeforeUrlCommit) {
        return;
      }
      void this.cancel(transition, e);
    } else if (e instanceof NavigationEnd) {
      const {
        resolveHandler,
        removeAbortListener
      } = this.currentNavigation;
      this.currentNavigation = {};
      removeAbortListener?.();
      this.activeHistoryEntry = this.navigation.currentEntry;
      afterNextRender({
        read: () => resolveHandler?.()
      }, {
        injector: this.injector
      });
    }
  }
  maybeCreateNavigationForTransition(transition) {
    const {
      navigationEvent,
      commitUrl
    } = this.currentNavigation;
    if (commitUrl || navigationEvent && navigationEvent.navigationType === "traverse" && this.eventAndRouterDestinationsMatch(navigationEvent, transition)) {
      return;
    }
    this.currentNavigation.removeAbortListener?.();
    const path = this.createBrowserPath(transition);
    this.navigate(path, transition);
  }
  navigate(internalPath, transition) {
    const path = transition.extras.skipLocationChange ? this.navigation.currentEntry.url : this.location.prepareExternalUrl(internalPath);
    const state = __spreadProps(__spreadValues({}, transition.extras.state), {
      navigationId: transition.id
    });
    const info = {
      \u0275routerInfo: {
        intercept: true
      }
    };
    if (!this.navigation.transition && this.currentNavigation.navigationEvent) {
      transition.extras.replaceUrl = false;
    }
    const history = this.location.isCurrentPathEqualTo(path) || transition.extras.replaceUrl || transition.extras.skipLocationChange ? "replace" : "push";
    handleResultRejections(this.navigation.navigate(path, {
      state,
      history,
      info
    }));
  }
  finishNavigation() {
    this.currentNavigation.commitUrl?.();
    this.currentNavigation?.resolveHandler?.();
    this.currentNavigation = {};
  }
  async cancel(transition, cause) {
    this.currentNavigation.rejectNavigateEvent?.();
    const clearedState = {};
    this.currentNavigation = clearedState;
    if (isRedirectingEvent(cause)) {
      return;
    }
    const isTraversalReset = this.canceledNavigationResolution === "computed" && this.navigation.currentEntry.key !== this.activeHistoryEntry.key;
    this.resetInternalState(transition.finalUrl, isTraversalReset);
    if (this.navigation.currentEntry.id === this.activeHistoryEntry.id) {
      return;
    }
    if (cause instanceof NavigationCancel && cause.code === NavigationCancellationCode.Aborted) {
      await Promise.resolve();
      if (this.currentNavigation !== clearedState) {
        return;
      }
    }
    if (isTraversalReset) {
      handleResultRejections(this.navigation.traverseTo(this.activeHistoryEntry.key, {
        info: {
          \u0275routerInfo: {
            intercept: false
          }
        }
      }));
    } else {
      const internalPath = this.urlSerializer.serialize(this.getCurrentUrlTree());
      const pathOrUrl = this.location.prepareExternalUrl(internalPath);
      handleResultRejections(this.navigation.navigate(pathOrUrl, {
        state: this.activeHistoryEntry.getState(),
        history: "replace",
        info: {
          \u0275routerInfo: {
            intercept: false
          }
        }
      }));
    }
  }
  resetInternalState(finalUrl, traversalReset) {
    this.routerState = this.stateMemento.routerState;
    this.currentUrlTree = this.stateMemento.currentUrlTree;
    this.rawUrlTree = traversalReset ? this.stateMemento.rawUrlTree : this.urlHandlingStrategy.merge(this.currentUrlTree, finalUrl ?? this.rawUrlTree);
  }
  handleNavigate(event) {
    if (!event.canIntercept || event.navigationType === "reload") {
      return;
    }
    const routerInfo = event?.info?.\u0275routerInfo;
    if (routerInfo && !routerInfo.intercept) {
      return;
    }
    const isTriggeredByRouterTransition = !!routerInfo;
    if (!isTriggeredByRouterTransition) {
      this.currentNavigation.routerTransition?.abort();
      if (!this.registered) {
        this.finishNavigation();
        return;
      }
    }
    this.currentNavigation = __spreadValues({}, this.currentNavigation);
    this.currentNavigation.navigationEvent = event;
    const abortHandler = () => {
      this.currentNavigation.routerTransition?.abort();
    };
    event.signal.addEventListener("abort", abortHandler);
    this.currentNavigation.removeAbortListener = () => event.signal.removeEventListener("abort", abortHandler);
    let scroll = this.inMemoryScrollingEnabled ? "manual" : this.currentNavigation.routerTransition?.extras.scroll ?? "after-transition";
    const interceptOptions = {
      scroll
    };
    const {
      promise: handlerPromise,
      resolve: resolveHandler,
      reject: rejectHandler
    } = promiseWithResolvers();
    const {
      promise: precommitHandlerPromise,
      resolve: resolvePrecommitHandler,
      reject: rejectPrecommitHandler
    } = promiseWithResolvers();
    this.currentNavigation.rejectNavigateEvent = () => {
      event.signal.removeEventListener("abort", abortHandler);
      rejectPrecommitHandler();
      rejectHandler();
    };
    this.currentNavigation.resolveHandler = () => {
      this.currentNavigation.removeAbortListener?.();
      resolveHandler();
    };
    handlerPromise.catch(() => {
    });
    precommitHandlerPromise.catch(() => {
    });
    interceptOptions.handler = () => handlerPromise;
    if (this.deferredCommitSupported(event)) {
      const redirect = new Promise((resolve) => {
        interceptOptions.precommitHandler = (controller) => {
          if (this.navigation.transition?.navigationType === "traverse") {
            resolve(() => {
            });
          } else {
            resolve(controller.redirect.bind(controller));
          }
          return precommitHandlerPromise;
        };
      });
      this.currentNavigation.commitUrl = async () => {
        this.currentNavigation.commitUrl = void 0;
        const transition = this.currentNavigation.routerTransition;
        if (transition && !transition.extras.skipLocationChange) {
          const internalPath = this.createBrowserPath(transition);
          const history = this.location.isCurrentPathEqualTo(internalPath) || !!transition.extras.replaceUrl ? "replace" : "push";
          const state = __spreadProps(__spreadValues({}, transition.extras.state), {
            navigationId: transition.id
          });
          const pathOrUrl = this.location.prepareExternalUrl(internalPath);
          (await redirect)(pathOrUrl, {
            state,
            history
          });
        }
        resolvePrecommitHandler();
        return await this.navigation.transition?.committed;
      };
    }
    event.intercept(interceptOptions);
    if (!isTriggeredByRouterTransition) {
      this.handleNavigateEventTriggeredOutsideRouterAPIs(event);
    }
  }
  handleNavigateEventTriggeredOutsideRouterAPIs(event) {
    const path = event.destination.url.substring(this.appRootURL.length - 1);
    const state = event.destination.getState();
    this.nonRouterCurrentEntryChangeSubject.next({
      path,
      state
    });
  }
  eventAndRouterDestinationsMatch(navigateEvent, transition) {
    const internalPath = this.createBrowserPath(transition);
    const eventDestination = new URL(navigateEvent.destination.url);
    const routerDestination = this.location.prepareExternalUrl(internalPath);
    return new URL(routerDestination, eventDestination.origin).href === eventDestination.href;
  }
  deferredCommitSupported(event) {
    return this.precommitHandlerSupported && event.cancelable;
  }
  static \u0275fac = function NavigationStateManager_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NavigationStateManager)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _NavigationStateManager,
    factory: _NavigationStateManager.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NavigationStateManager, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
function handleResultRejections(result) {
  result.finished?.catch(() => {
  });
  result.committed?.catch(() => {
  });
  return result;
}
function provideRouter(routes2, ...features) {
  if (typeof ngDevMode === "undefined" || ngDevMode) {
    publishExternalGlobalUtil("\u0275getLoadedRoutes", getLoadedRoutes);
    publishExternalGlobalUtil("\u0275getRouterInstance", getRouterInstance);
    publishExternalGlobalUtil("\u0275navigateByUrl", navigateByUrl);
  }
  return makeEnvironmentProviders([{
    provide: ROUTES,
    multi: true,
    useValue: routes2
  }, typeof ngDevMode === "undefined" || ngDevMode ? {
    provide: ROUTER_IS_PROVIDED,
    useValue: true
  } : [], {
    provide: ActivatedRoute,
    useFactory: rootRoute
  }, {
    provide: APP_BOOTSTRAP_LISTENER,
    multi: true,
    useFactory: getBootstrapListener
  }, features.map((feature) => feature.\u0275providers)]);
}
function rootRoute() {
  return inject(Router).routerState.root;
}
function routerFeature(kind, providers) {
  return {
    \u0275kind: kind,
    \u0275providers: providers
  };
}
var ROUTER_IS_PROVIDED = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "Router is provided" : "", {
  factory: () => false
});
function getBootstrapListener() {
  const injector = inject(Injector);
  return (bootstrappedComponentRef) => {
    const ref = injector.get(ApplicationRef);
    if (bootstrappedComponentRef !== ref.components[0]) {
      return;
    }
    const router = injector.get(Router);
    const bootstrapDone = injector.get(BOOTSTRAP_DONE);
    if (injector.get(INITIAL_NAVIGATION) === 1) {
      router.initialNavigation();
    }
    injector.get(ROUTER_PRELOADER, null, {
      optional: true
    })?.setUpPreloading();
    injector.get(ROUTER_SCROLLER, null, {
      optional: true
    })?.init();
    router.resetRootComponentType(ref.componentTypes[0]);
    if (!bootstrapDone.closed) {
      bootstrapDone.next();
      bootstrapDone.complete();
      bootstrapDone.unsubscribe();
    }
  };
}
var BOOTSTRAP_DONE = new InjectionToken(typeof ngDevMode === "undefined" || ngDevMode ? "bootstrap done indicator" : "", {
  factory: () => {
    return new Subject();
  }
});
var INITIAL_NAVIGATION = new InjectionToken(typeof ngDevMode === "undefined" || ngDevMode ? "initial navigation" : "", {
  factory: () => 1
});
function withEnabledBlockingInitialNavigation() {
  const providers = [{
    provide: IS_ENABLED_BLOCKING_INITIAL_NAVIGATION,
    useValue: true
  }, {
    provide: INITIAL_NAVIGATION,
    useValue: 0
  }, provideAppInitializer(() => {
    const injector = inject(Injector);
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve());
    return locationInitialized.then(() => {
      return new Promise((resolve) => {
        const router = injector.get(Router);
        const bootstrapDone = injector.get(BOOTSTRAP_DONE);
        afterNextNavigation(router, () => {
          resolve(true);
        });
        injector.get(NavigationTransitions).afterPreactivation = () => {
          resolve(true);
          return bootstrapDone.closed ? of(void 0) : bootstrapDone;
        };
        router.initialNavigation();
      });
    });
  })];
  return routerFeature(2, providers);
}
function withDisabledInitialNavigation() {
  const providers = [provideAppInitializer(() => {
    inject(Router).setUpLocationChangeListener();
  }), {
    provide: INITIAL_NAVIGATION,
    useValue: 2
  }];
  return routerFeature(3, providers);
}
function withDebugTracing() {
  let providers = [];
  if (typeof ngDevMode === "undefined" || ngDevMode) {
    providers = [{
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useFactory: () => {
        const router = inject(Router);
        return () => router.events.subscribe((e) => {
          console.group?.(`Router Event: ${e.constructor.name}`);
          console.log(stringifyEvent(e));
          console.log(e);
          console.groupEnd?.();
        });
      }
    }];
  } else {
    providers = [];
  }
  return routerFeature(1, providers);
}
var ROUTER_PRELOADER = new InjectionToken(typeof ngDevMode === "undefined" || ngDevMode ? "router preloader" : "");
function withPreloading(preloadingStrategy) {
  const providers = [{
    provide: ROUTER_PRELOADER,
    useExisting: RouterPreloader
  }, {
    provide: PreloadingStrategy,
    useExisting: preloadingStrategy
  }];
  return routerFeature(0, providers);
}
function withComponentInputBinding() {
  const providers = [RoutedComponentInputBinder, {
    provide: INPUT_BINDER,
    useExisting: RoutedComponentInputBinder
  }];
  return routerFeature(8, providers);
}
function withViewTransitions(options) {
  performanceMarkFeature("NgRouterViewTransitions");
  const providers = [{
    provide: CREATE_VIEW_TRANSITION,
    useValue: createViewTransition
  }, {
    provide: VIEW_TRANSITION_OPTIONS,
    useValue: __spreadValues({
      skipNextTransition: !!options?.skipInitialTransition
    }, options)
  }];
  return routerFeature(9, providers);
}
var ROUTER_DIRECTIVES = [RouterOutlet, RouterLink, RouterLinkActive, \u0275EmptyOutletComponent];
var ROUTER_FORROOT_GUARD = new InjectionToken(typeof ngDevMode === "undefined" || ngDevMode ? "router duplicate forRoot guard" : "");
var ROUTER_PROVIDERS = [Location, {
  provide: UrlSerializer,
  useClass: DefaultUrlSerializer
}, Router, ChildrenOutletContexts, {
  provide: ActivatedRoute,
  useFactory: rootRoute
}, RouterConfigLoader, typeof ngDevMode === "undefined" || ngDevMode ? {
  provide: ROUTER_IS_PROVIDED,
  useValue: true
} : []];
var RouterModule = class _RouterModule {
  constructor() {
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      inject(ROUTER_FORROOT_GUARD, {
        optional: true
      });
    }
  }
  static forRoot(routes2, config) {
    return {
      ngModule: _RouterModule,
      providers: [ROUTER_PROVIDERS, typeof ngDevMode === "undefined" || ngDevMode ? config?.enableTracing ? withDebugTracing().\u0275providers : [] : [], {
        provide: ROUTES,
        multi: true,
        useValue: routes2
      }, typeof ngDevMode === "undefined" || ngDevMode ? {
        provide: ROUTER_FORROOT_GUARD,
        useFactory: provideForRootGuard
      } : [], config?.errorHandler ? {
        provide: NAVIGATION_ERROR_HANDLER,
        useValue: config.errorHandler
      } : [], {
        provide: ROUTER_CONFIGURATION,
        useValue: config ? config : {}
      }, config?.useHash ? provideHashLocationStrategy() : providePathLocationStrategy(), provideRouterScroller(), config?.preloadingStrategy ? withPreloading(config.preloadingStrategy).\u0275providers : [], config?.initialNavigation ? provideInitialNavigation(config) : [], config?.bindToComponentInputs ? withComponentInputBinding().\u0275providers : [], config?.enableViewTransitions ? withViewTransitions().\u0275providers : [], provideRouterInitializer()]
    };
  }
  static forChild(routes2) {
    return {
      ngModule: _RouterModule,
      providers: [{
        provide: ROUTES,
        multi: true,
        useValue: routes2
      }]
    };
  }
  static \u0275fac = function RouterModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RouterModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _RouterModule,
    imports: [RouterOutlet, RouterLink, RouterLinkActive, \u0275EmptyOutletComponent],
    exports: [RouterOutlet, RouterLink, RouterLinkActive, \u0275EmptyOutletComponent]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RouterModule, [{
    type: NgModule,
    args: [{
      imports: ROUTER_DIRECTIVES,
      exports: ROUTER_DIRECTIVES
    }]
  }], () => [], null);
})();
function provideRouterScroller() {
  return {
    provide: ROUTER_SCROLLER,
    useFactory: () => {
      const viewportScroller = inject(ViewportScroller);
      const config = inject(ROUTER_CONFIGURATION);
      if (config.scrollOffset) {
        viewportScroller.setOffset(config.scrollOffset);
      }
      return new RouterScroller(config);
    }
  };
}
function provideHashLocationStrategy() {
  return {
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  };
}
function providePathLocationStrategy() {
  return {
    provide: LocationStrategy,
    useClass: PathLocationStrategy
  };
}
function provideForRootGuard() {
  const router = inject(Router, {
    optional: true,
    skipSelf: true
  });
  if (router) {
    throw new RuntimeError(4007, `The Router was provided more than once. This can happen if 'forRoot' is used outside of the root injector. Lazy loaded modules should use RouterModule.forChild() instead.`);
  }
  return "guarded";
}
function provideInitialNavigation(config) {
  return [config.initialNavigation === "disabled" ? withDisabledInitialNavigation().\u0275providers : [], config.initialNavigation === "enabledBlocking" ? withEnabledBlockingInitialNavigation().\u0275providers : []];
}
var ROUTER_INITIALIZER = new InjectionToken(typeof ngDevMode === "undefined" || ngDevMode ? "Router Initializer" : "");
function provideRouterInitializer() {
  return [{
    provide: ROUTER_INITIALIZER,
    useFactory: getBootstrapListener
  }, {
    provide: APP_BOOTSTRAP_LISTENER,
    multi: true,
    useExisting: ROUTER_INITIALIZER
  }];
}

// src/app/features/dashboard/dashboard.component.ts
function DashboardComponent_div_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15)(1, "div", 16);
    \u0275\u0275element(2, "i");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 17)(4, "span", 18);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 19)(7, "span", 20);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 21);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const stat_r1 = ctx.$implicit;
    const i_r2 = ctx.index;
    \u0275\u0275styleProp("--delay", i_r2 * 60);
    \u0275\u0275advance();
    \u0275\u0275styleMap("--c: " + stat_r1.color);
    \u0275\u0275advance();
    \u0275\u0275classMap(stat_r1.icon);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(stat_r1.label);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", stat_r1.value, "", stat_r1.suffix);
    \u0275\u0275advance();
    \u0275\u0275classMap(stat_r1.trendClass);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", stat_r1.trend, " ");
  }
}
function DashboardComponent_div_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22)(1, "div", 23)(2, "span", 24);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "span", 25);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const d_r3 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275styleProp("height", d_r3.value + "%");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", d_r3.value, "%");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(d_r3.label);
  }
}
function DashboardComponent_div_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26)(1, "div", 27);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 28)(4, "div", 29)(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 30);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const act_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275styleMap("--bg: " + act_r4.color);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", act_r4.initials, " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(act_r4.user);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", act_r4.action, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", act_r4.meta, " \xB7 ", act_r4.time);
  }
}
var DashboardComponent = class _DashboardComponent {
  currentDate = (/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  stats = [
    {
      label: "Enseignants Actifs",
      value: 124,
      suffix: "",
      icon: "pi pi-users",
      color: "#3b82f6",
      trend: "+12%",
      trendClass: "positive"
    },
    {
      label: "S\xE9ances Aujourd'hui",
      value: 42,
      suffix: "",
      icon: "pi pi-check-circle",
      color: "#22c55e",
      trend: "Stable",
      trendClass: "neutral"
    },
    {
      label: "Retards Signal\xE9s",
      value: 3,
      suffix: "",
      icon: "pi pi-clock",
      color: "#f97316",
      trend: "-2",
      trendClass: "positive"
    },
    {
      label: "Progression Moyenne",
      value: 68,
      suffix: "%",
      icon: "pi pi-book",
      color: "#a855f7",
      trend: "+5%",
      trendClass: "positive"
    }
  ];
  chartData = [
    { label: "Lun", value: 80 },
    { label: "Mar", value: 60 },
    { label: "Mer", value: 90 },
    { label: "Jeu", value: 75 },
    { label: "Ven", value: 85 },
    { label: "Sam", value: 70 }
  ];
  activities = [
    {
      user: "Dr. Alou",
      initials: "DA",
      action: "a valid\xE9 son \xE9margement",
      meta: "Amphi 500",
      time: "Il y a 5 min",
      color: "#3b82f6"
    },
    {
      user: "K. Barry",
      initials: "KB",
      action: "a signal\xE9 une absence",
      meta: "Salle 12",
      time: "Il y a 15 min",
      color: "#f97316"
    },
    {
      user: "M. Lougue",
      initials: "ML",
      action: "a rempli le cahier de textes",
      meta: "Math\xE9matiques",
      time: "Il y a 1h",
      color: "#22c55e"
    }
  ];
  static \u0275fac = function DashboardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DashboardComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DashboardComponent, selectors: [["app-dashboard"]], decls: 27, vars: 4, consts: [[1, "dashboard"], [1, "dash-header"], [1, "header-date"], [1, "pi", "pi-calendar"], [1, "stats-grid"], ["class", "stat-card", 3, "--delay", 4, "ngFor", "ngForOf"], [1, "content-grid"], [1, "card", "chart-card"], [1, "card-header"], [1, "simple-chart"], [1, "chart-bars"], ["class", "bar-col", 4, "ngFor", "ngForOf"], [1, "card", "activity-card"], [1, "activity-list"], ["class", "activity-item", 4, "ngFor", "ngForOf"], [1, "stat-card"], [1, "stat-icon"], [1, "stat-info"], [1, "stat-label"], [1, "stat-row"], [1, "stat-value"], [1, "stat-trend"], [1, "bar-col"], [1, "bar"], [1, "bar-value"], [1, "bar-label"], [1, "activity-item"], [1, "activity-avatar"], [1, "activity-body"], [1, "activity-text"], [1, "activity-time"]], template: function DashboardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1)(2, "div")(3, "h1");
      \u0275\u0275text(4, "Tableau de Bord");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p");
      \u0275\u0275text(6, "Aper\xE7u en temps r\xE9el de l'activit\xE9 acad\xE9mique");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div", 2);
      \u0275\u0275element(8, "i", 3);
      \u0275\u0275elementStart(9, "span");
      \u0275\u0275text(10);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(11, "section", 4);
      \u0275\u0275template(12, DashboardComponent_div_12_Template, 11, 12, "div", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "section", 6)(14, "div", 7)(15, "div", 8)(16, "h3");
      \u0275\u0275text(17, "Taux d'assiduit\xE9 hebdomadaire");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(18, "div", 9)(19, "div", 10);
      \u0275\u0275template(20, DashboardComponent_div_20_Template, 6, 4, "div", 11);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(21, "div", 12)(22, "div", 8)(23, "h3");
      \u0275\u0275text(24, "Activit\xE9s R\xE9centes");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(25, "div", 13);
      \u0275\u0275template(26, DashboardComponent_div_26_Template, 10, 7, "div", 14);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(10);
      \u0275\u0275textInterpolate(ctx.currentDate);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngForOf", ctx.stats);
      \u0275\u0275advance(8);
      \u0275\u0275property("ngForOf", ctx.chartData);
      \u0275\u0275advance(6);
      \u0275\u0275property("ngForOf", ctx.activities);
    }
  }, dependencies: [CommonModule, NgForOf], styles: ['\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.dashboard[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 24px;\n  padding: 24px;\n  max-width: 1400px;\n  width: 100%;\n  margin: 0 auto;\n  opacity: 0;\n  animation: _ngcontent-%COMP%_fadeIn 0.5s ease forwards;\n}\n@media (max-width: 768px) {\n  .dashboard[_ngcontent-%COMP%] {\n    padding: 16px;\n    gap: 18px;\n  }\n}\n@media (max-width: 480px) {\n  .dashboard[_ngcontent-%COMP%] {\n    padding: 12px 8px;\n    gap: 14px;\n  }\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  to {\n    opacity: 1;\n  }\n}\n.dash-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  padding: 8px 0;\n}\n@media (max-width: 640px) {\n  .dash-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 12px;\n  }\n}\n.dash-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0 0 4px;\n  font-size: clamp(1.2rem, 4vw, 1.6rem);\n  font-weight: 700;\n  color: #0f172a;\n  letter-spacing: -0.02em;\n  word-break: break-word;\n}\n.dash-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: clamp(0.8rem, 2.5vw, 0.9rem);\n  color: #64748b;\n  font-weight: 400;\n  word-break: break-word;\n}\n.header-date[_ngcontent-%COMP%] {\n  display: none;\n}\n@media (min-width: 641px) {\n  .header-date[_ngcontent-%COMP%] {\n    display: flex;\n  }\n}\n.header-date[_ngcontent-%COMP%] {\n  align-items: center;\n  gap: 8px;\n  padding: 8px 14px;\n  background: #fff;\n  border: 1px solid var(--border-color);\n  border-radius: 10px;\n  font-size: 0.8rem;\n  font-weight: 500;\n  color: #475569;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);\n}\n.header-date[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: var(--primary-color);\n  font-size: 0.9rem;\n}\n.stats-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 16px;\n}\n@media (max-width: 768px) {\n  .stats-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, 1fr);\n    gap: 12px;\n  }\n}\n@media (max-width: 480px) {\n  .stats-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    gap: 10px;\n  }\n}\n.stat-card[_ngcontent-%COMP%] {\n  background: #fff;\n  border: 2px solid rgba(226, 232, 240, 0.7);\n  border-radius: 14px;\n  padding: 20px;\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  transition:\n    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),\n    box-shadow 0.3s ease,\n    border-color 0.3s ease;\n  position: relative;\n  overflow: hidden;\n  cursor: pointer;\n  opacity: 0;\n  transform: translateY(8px);\n  animation: _ngcontent-%COMP%_slideUp 0.4s ease forwards;\n  animation-delay: var(--delay, 0ms);\n}\n.stat-card[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 4px;\n  height: 100%;\n  background: var(--c, #3b82f6);\n  border-radius: 4px 0 0 4px;\n  transform: scaleY(0);\n  transform-origin: bottom;\n  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);\n}\n.stat-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-6px) scale(1.02);\n  box-shadow: 0 16px 32px rgba(2, 6, 23, 0.1), 0 6px 12px rgba(2, 6, 23, 0.06);\n  border-color: color-mix(in srgb, var(--c, var(--primary-color)) 30%, white);\n}\n.stat-card[_ngcontent-%COMP%]:hover::before {\n  transform: scaleY(1);\n}\n.stat-card[_ngcontent-%COMP%]:hover   .stat-icon[_ngcontent-%COMP%] {\n  transform: scale(1.1) rotate(-5deg);\n  box-shadow: 0 6px 16px color-mix(in srgb, var(--c) 25%, transparent);\n}\n.stat-card[_ngcontent-%COMP%]:hover   .stat-value[_ngcontent-%COMP%] {\n  color: var(--c, #0f172a);\n}\n@keyframes _ngcontent-%COMP%_slideUp {\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.stat-icon[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 1.15rem;\n  color: var(--c);\n  background: color-mix(in srgb, var(--c) 12%, white);\n  flex-shrink: 0;\n  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease;\n}\n.stat-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.stat-label[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  font-weight: 500;\n  color: #64748b;\n}\n.stat-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: baseline;\n  gap: 8px;\n}\n.stat-value[_ngcontent-%COMP%] {\n  font-size: 1.35rem;\n  font-weight: 700;\n  color: #0f172a;\n  line-height: 1;\n  transition: color 0.3s ease;\n}\n.stat-trend[_ngcontent-%COMP%] {\n  font-size: 0.72rem;\n  font-weight: 600;\n}\n.stat-trend.positive[_ngcontent-%COMP%] {\n  color: #16a34a;\n}\n.stat-trend.negative[_ngcontent-%COMP%] {\n  color: #dc2626;\n}\n.stat-trend.neutral[_ngcontent-%COMP%] {\n  color: #94a3b8;\n}\n.content-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 2fr 1.2fr;\n  gap: 20px;\n  min-width: 0;\n}\n@media (max-width: 900px) {\n  .content-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    gap: 16px;\n  }\n}\n.card[_ngcontent-%COMP%] {\n  background: #fff;\n  border: 1px solid rgba(226, 232, 240, 0.7);\n  border-radius: 14px;\n  padding: 24px;\n  min-width: 0;\n  overflow: hidden;\n  transition:\n    box-shadow 0.25s ease,\n    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),\n    border-color 0.25s ease;\n}\n.card[_ngcontent-%COMP%]:hover {\n  box-shadow: 0 16px 32px rgba(2, 6, 23, 0.08), 0 6px 12px rgba(2, 6, 23, 0.04);\n  transform: translateY(-3px);\n  border-color: rgba(59, 130, 246, 0.2);\n}\n.card-header[_ngcontent-%COMP%] {\n  margin-bottom: 16px;\n}\n.card-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1rem;\n  font-weight: 600;\n  color: #1e293b;\n}\n.simple-chart[_ngcontent-%COMP%] {\n  padding: 8px 0;\n}\n.chart-bars[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-end;\n  gap: clamp(12px, 3vw, 24px);\n  height: clamp(120px, 25vw, 160px);\n  padding: 0 4px;\n}\n.bar-col[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  min-width: 0;\n  align-items: center;\n  gap: 6px;\n}\n.bar[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 48px;\n  background:\n    linear-gradient(\n      180deg,\n      #3b82f6,\n      #93c5fd);\n  border-radius: 8px 8px 4px 4px;\n  display: flex;\n  justify-content: flex-start;\n  padding-top: 4px;\n  transition:\n    transform 0.2s ease,\n    box-shadow 0.2s ease,\n    filter 0.2s ease;\n  position: relative;\n  min-height: 8px;\n}\n.bar[_ngcontent-%COMP%]:hover {\n  transform: scaleY(1.03) translateY(-3px);\n  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.4);\n  filter: brightness(1.1);\n}\n.bar-value[_ngcontent-%COMP%] {\n  font-size: clamp(0.55rem, 1.5vw, 0.65rem);\n  font-weight: 700;\n  color: #fff;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);\n  line-height: 1;\n}\n.bar-label[_ngcontent-%COMP%] {\n  font-size: clamp(0.65rem, 2vw, 0.75rem);\n  color: #64748b;\n  font-weight: 500;\n  text-align: center;\n  white-space: nowrap;\n}\n.activity-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0;\n}\n.activity-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 12px;\n  padding: 12px 0;\n  border-bottom: 1px solid rgba(241, 245, 249, 0.9);\n}\n.activity-item[_ngcontent-%COMP%]:last-child {\n  border-bottom: none;\n  padding-bottom: 0;\n}\n.activity-avatar[_ngcontent-%COMP%] {\n  width: 36px;\n  height: 36px;\n  border-radius: 10px;\n  background: color-mix(in srgb, var(--bg) 12%, white);\n  color: var(--bg);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: 700;\n  font-size: 0.75rem;\n  flex-shrink: 0;\n}\n.activity-body[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  min-width: 0;\n}\n.activity-text[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  color: #334155;\n  line-height: 1.35;\n}\n.activity-text[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #0f172a;\n  font-weight: 600;\n}\n.activity-time[_ngcontent-%COMP%] {\n  font-size: 0.72rem;\n  color: #94a3b8;\n  font-weight: 500;\n}\n/*# sourceMappingURL=dashboard.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DashboardComponent, [{
    type: Component,
    args: [{ selector: "app-dashboard", standalone: true, imports: [CommonModule], template: `
    <div class="dashboard">
      <!-- Header -->
      <header class="dash-header">
        <div>
          <h1>Tableau de Bord</h1>
          <p>Aper\xE7u en temps r\xE9el de l'activit\xE9 acad\xE9mique</p>
        </div>
        <div class="header-date">
          <i class="pi pi-calendar"></i>
          <span>{{ currentDate }}</span>
        </div>
      </header>

      <!-- Stats Cards -->
      <section class="stats-grid">
        <div class="stat-card" *ngFor="let stat of stats; let i = index" [style.--delay]="i * 60">
          <div class="stat-icon" [style]="'--c: ' + stat.color">
            <i [class]="stat.icon"></i>
          </div>
          <div class="stat-info">
            <span class="stat-label">{{ stat.label }}</span>
            <div class="stat-row">
              <span class="stat-value">{{ stat.value }}{{ stat.suffix }}</span>
              <span class="stat-trend" [class]="stat.trendClass">
                {{ stat.trend }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <section class="content-grid">
        <!-- Chart -->
        <div class="card chart-card">
          <div class="card-header">
            <h3>Taux d'assiduit\xE9 hebdomadaire</h3>
          </div>
          <div class="simple-chart">
            <div class="chart-bars">
              <div class="bar-col" *ngFor="let d of chartData">
                <div class="bar" [style.height]="d.value + '%'">
                  <span class="bar-value">{{ d.value }}%</span>
                </div>
                <span class="bar-label">{{ d.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card activity-card">
          <div class="card-header">
            <h3>Activit\xE9s R\xE9centes</h3>
          </div>
          <div class="activity-list">
            <div class="activity-item" *ngFor="let act of activities">
              <div class="activity-avatar" [style]="'--bg: ' + act.color">
                {{ act.initials }}
              </div>
              <div class="activity-body">
                <div class="activity-text">
                  <strong>{{ act.user }}</strong> {{ act.action }}
                </div>
                <span class="activity-time">{{ act.meta }} \xB7 {{ act.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `, styles: ['/* angular:styles/component:scss;ae5e24f8d90ebccd8a1b69d83696ed5cf30d6f37b0ad49448a78fed5a93f902f;/home/aya97/suivi-pedagogique-system/frontend-web/src/app/features/dashboard/dashboard.component.ts */\n:host {\n  display: block;\n}\n.dashboard {\n  display: flex;\n  flex-direction: column;\n  gap: 24px;\n  padding: 24px;\n  max-width: 1400px;\n  width: 100%;\n  margin: 0 auto;\n  opacity: 0;\n  animation: fadeIn 0.5s ease forwards;\n}\n@media (max-width: 768px) {\n  .dashboard {\n    padding: 16px;\n    gap: 18px;\n  }\n}\n@media (max-width: 480px) {\n  .dashboard {\n    padding: 12px 8px;\n    gap: 14px;\n  }\n}\n@keyframes fadeIn {\n  to {\n    opacity: 1;\n  }\n}\n.dash-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  padding: 8px 0;\n}\n@media (max-width: 640px) {\n  .dash-header {\n    flex-direction: column;\n    gap: 12px;\n  }\n}\n.dash-header h1 {\n  margin: 0 0 4px;\n  font-size: clamp(1.2rem, 4vw, 1.6rem);\n  font-weight: 700;\n  color: #0f172a;\n  letter-spacing: -0.02em;\n  word-break: break-word;\n}\n.dash-header p {\n  margin: 0;\n  font-size: clamp(0.8rem, 2.5vw, 0.9rem);\n  color: #64748b;\n  font-weight: 400;\n  word-break: break-word;\n}\n.header-date {\n  display: none;\n}\n@media (min-width: 641px) {\n  .header-date {\n    display: flex;\n  }\n}\n.header-date {\n  align-items: center;\n  gap: 8px;\n  padding: 8px 14px;\n  background: #fff;\n  border: 1px solid var(--border-color);\n  border-radius: 10px;\n  font-size: 0.8rem;\n  font-weight: 500;\n  color: #475569;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);\n}\n.header-date i {\n  color: var(--primary-color);\n  font-size: 0.9rem;\n}\n.stats-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 16px;\n}\n@media (max-width: 768px) {\n  .stats-grid {\n    grid-template-columns: repeat(2, 1fr);\n    gap: 12px;\n  }\n}\n@media (max-width: 480px) {\n  .stats-grid {\n    grid-template-columns: 1fr;\n    gap: 10px;\n  }\n}\n.stat-card {\n  background: #fff;\n  border: 2px solid rgba(226, 232, 240, 0.7);\n  border-radius: 14px;\n  padding: 20px;\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  transition:\n    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),\n    box-shadow 0.3s ease,\n    border-color 0.3s ease;\n  position: relative;\n  overflow: hidden;\n  cursor: pointer;\n  opacity: 0;\n  transform: translateY(8px);\n  animation: slideUp 0.4s ease forwards;\n  animation-delay: var(--delay, 0ms);\n}\n.stat-card::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 4px;\n  height: 100%;\n  background: var(--c, #3b82f6);\n  border-radius: 4px 0 0 4px;\n  transform: scaleY(0);\n  transform-origin: bottom;\n  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);\n}\n.stat-card:hover {\n  transform: translateY(-6px) scale(1.02);\n  box-shadow: 0 16px 32px rgba(2, 6, 23, 0.1), 0 6px 12px rgba(2, 6, 23, 0.06);\n  border-color: color-mix(in srgb, var(--c, var(--primary-color)) 30%, white);\n}\n.stat-card:hover::before {\n  transform: scaleY(1);\n}\n.stat-card:hover .stat-icon {\n  transform: scale(1.1) rotate(-5deg);\n  box-shadow: 0 6px 16px color-mix(in srgb, var(--c) 25%, transparent);\n}\n.stat-card:hover .stat-value {\n  color: var(--c, #0f172a);\n}\n@keyframes slideUp {\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.stat-icon {\n  width: 48px;\n  height: 48px;\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 1.15rem;\n  color: var(--c);\n  background: color-mix(in srgb, var(--c) 12%, white);\n  flex-shrink: 0;\n  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease;\n}\n.stat-info {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.stat-label {\n  font-size: 0.8rem;\n  font-weight: 500;\n  color: #64748b;\n}\n.stat-row {\n  display: flex;\n  align-items: baseline;\n  gap: 8px;\n}\n.stat-value {\n  font-size: 1.35rem;\n  font-weight: 700;\n  color: #0f172a;\n  line-height: 1;\n  transition: color 0.3s ease;\n}\n.stat-trend {\n  font-size: 0.72rem;\n  font-weight: 600;\n}\n.stat-trend.positive {\n  color: #16a34a;\n}\n.stat-trend.negative {\n  color: #dc2626;\n}\n.stat-trend.neutral {\n  color: #94a3b8;\n}\n.content-grid {\n  display: grid;\n  grid-template-columns: 2fr 1.2fr;\n  gap: 20px;\n  min-width: 0;\n}\n@media (max-width: 900px) {\n  .content-grid {\n    grid-template-columns: 1fr;\n    gap: 16px;\n  }\n}\n.card {\n  background: #fff;\n  border: 1px solid rgba(226, 232, 240, 0.7);\n  border-radius: 14px;\n  padding: 24px;\n  min-width: 0;\n  overflow: hidden;\n  transition:\n    box-shadow 0.25s ease,\n    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),\n    border-color 0.25s ease;\n}\n.card:hover {\n  box-shadow: 0 16px 32px rgba(2, 6, 23, 0.08), 0 6px 12px rgba(2, 6, 23, 0.04);\n  transform: translateY(-3px);\n  border-color: rgba(59, 130, 246, 0.2);\n}\n.card-header {\n  margin-bottom: 16px;\n}\n.card-header h3 {\n  margin: 0;\n  font-size: 1rem;\n  font-weight: 600;\n  color: #1e293b;\n}\n.simple-chart {\n  padding: 8px 0;\n}\n.chart-bars {\n  display: flex;\n  align-items: flex-end;\n  gap: clamp(12px, 3vw, 24px);\n  height: clamp(120px, 25vw, 160px);\n  padding: 0 4px;\n}\n.bar-col {\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  min-width: 0;\n  align-items: center;\n  gap: 6px;\n}\n.bar {\n  width: 100%;\n  max-width: 48px;\n  background:\n    linear-gradient(\n      180deg,\n      #3b82f6,\n      #93c5fd);\n  border-radius: 8px 8px 4px 4px;\n  display: flex;\n  justify-content: flex-start;\n  padding-top: 4px;\n  transition:\n    transform 0.2s ease,\n    box-shadow 0.2s ease,\n    filter 0.2s ease;\n  position: relative;\n  min-height: 8px;\n}\n.bar:hover {\n  transform: scaleY(1.03) translateY(-3px);\n  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.4);\n  filter: brightness(1.1);\n}\n.bar-value {\n  font-size: clamp(0.55rem, 1.5vw, 0.65rem);\n  font-weight: 700;\n  color: #fff;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);\n  line-height: 1;\n}\n.bar-label {\n  font-size: clamp(0.65rem, 2vw, 0.75rem);\n  color: #64748b;\n  font-weight: 500;\n  text-align: center;\n  white-space: nowrap;\n}\n.activity-list {\n  display: flex;\n  flex-direction: column;\n  gap: 0;\n}\n.activity-item {\n  display: flex;\n  align-items: flex-start;\n  gap: 12px;\n  padding: 12px 0;\n  border-bottom: 1px solid rgba(241, 245, 249, 0.9);\n}\n.activity-item:last-child {\n  border-bottom: none;\n  padding-bottom: 0;\n}\n.activity-avatar {\n  width: 36px;\n  height: 36px;\n  border-radius: 10px;\n  background: color-mix(in srgb, var(--bg) 12%, white);\n  color: var(--bg);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: 700;\n  font-size: 0.75rem;\n  flex-shrink: 0;\n}\n.activity-body {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  min-width: 0;\n}\n.activity-text {\n  font-size: 0.85rem;\n  color: #334155;\n  line-height: 1.35;\n}\n.activity-text strong {\n  color: #0f172a;\n  font-weight: 600;\n}\n.activity-time {\n  font-size: 0.72rem;\n  color: #94a3b8;\n  font-weight: 500;\n}\n/*# sourceMappingURL=dashboard.component.css.map */\n'] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DashboardComponent, { className: "DashboardComponent", filePath: "src/app/features/dashboard/dashboard.component.ts", lineNumber: 495 });
})();

// src/app/core/services/auth.service.ts
var AuthService = class _AuthService {
  currentUserSubject = new BehaviorSubject(null);
  currentUser = this.currentUserSubject.asObservable();
  constructor() {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }
  login(credentials) {
    return of({
      id: 1,
      username: "admin",
      fullName: "Administrateur Mali",
      token: "fake-jwt-token-" + Math.random().toString(36).substring(7)
    }).pipe(
      delay(1500),
      // Simulation latence réseau
      tap((user) => {
        localStorage.setItem("user", JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }
  logout() {
    localStorage.removeItem("user");
    this.currentUserSubject.next(null);
  }
  isLoggedIn() {
    return !!this.currentUserSubject.value;
  }
  static \u0275fac = function AuthService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuthService, factory: _AuthService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuthService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

// src/app/features/login/login.component.ts
function LoginComponent_span_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 37);
    \u0275\u0275element(1, "i", 38);
    \u0275\u0275text(2, " Identifiant requis (min. 3 caract\xE8res) ");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_span_53_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 37);
    \u0275\u0275element(1, "i", 38);
    \u0275\u0275text(2, " Mot de passe requis (min. 4 caract\xE8res) ");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_span_56_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 39);
    \u0275\u0275element(1, "i", 40);
    \u0275\u0275text(2, " Se connecter");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_span_57_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 41);
    \u0275\u0275element(1, "span", 42);
    \u0275\u0275text(2, " Connexion...");
    \u0275\u0275elementEnd();
  }
}
var LoginComponent = class _LoginComponent {
  fb;
  authService;
  router;
  loginForm;
  isLoading = false;
  showPassword = false;
  constructor(fb, authService, router) {
    this.fb = fb;
    this.authService = authService;
    this.router = router;
    this.loginForm = this.fb.group({
      username: ["", [Validators.required, Validators.minLength(3)]],
      password: ["", [Validators.required, Validators.minLength(4)]]
    });
  }
  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginForm.markAllAsTouched();
      this.authService.login(this.loginForm.value).subscribe({
        next: () => this.router.navigate(["/dashboard"]),
        error: () => {
          this.isLoading = false;
          alert("\xC9chec de connexion. V\xE9rifiez vos identifiants.");
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  static \u0275fac = function LoginComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LoginComponent)(\u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoginComponent, selectors: [["app-login"]], decls: 62, vars: 8, consts: [[1, "login-page"], [1, "login-branding"], [1, "floating-shapes"], [1, "shape", "shape-1"], [1, "shape", "shape-2"], [1, "shape", "shape-3"], [1, "shape", "shape-4"], [1, "shape", "shape-5"], [1, "branding-content"], [1, "brand-icon"], ["src", "assets/images/intec.png", "alt", "Logo INTEC"], [1, "brand-features"], [1, "feature"], [1, "pi", "pi-check-circle"], [1, "login-auth"], [1, "auth-container"], [1, "auth-header"], [1, "auth-mobile-logo"], ["src", "assets/images/intec1.png", "alt", "Logo INTEC"], [1, "portal-form", 3, "ngSubmit", "formGroup"], [1, "form-group"], ["for", "username"], [1, "input-wrapper"], [1, "pi", "pi-user", "icon-left"], ["id", "username", "type", "text", "formControlName", "username", "placeholder", "Entrez votre identifiant", "autocomplete", "username"], ["class", "error-msg", 4, "ngIf"], ["for", "password"], [1, "pi", "pi-lock", "icon-left"], ["id", "password", "formControlName", "password", "placeholder", "Entrez votre mot de passe", "autocomplete", "current-password", 3, "type"], ["type", "button", "tabindex", "-1", 1, "eye-toggle", 3, "click"], [1, "pi", 3, "ngClass"], ["type", "submit", 1, "btn-connect", 3, "disabled"], [1, "btn-shimmer"], ["class", "btn-content", 4, "ngIf"], ["class", "btn-content btn-loading", 4, "ngIf"], [1, "security-footer"], [1, "pi", "pi-shield"], [1, "error-msg"], [1, "pi", "pi-exclamation-circle"], [1, "btn-content"], [1, "pi", "pi-sign-in"], [1, "btn-content", "btn-loading"], [1, "spinner"]], template: function LoginComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
      \u0275\u0275element(3, "div", 3)(4, "div", 4)(5, "div", 5)(6, "div", 6)(7, "div", 7);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "div", 8)(9, "div", 9);
      \u0275\u0275element(10, "img", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "h1");
      \u0275\u0275text(12, "INTEC - Suivi P\xE9dagogique");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "p");
      \u0275\u0275text(14, "Plateforme officielle de gestion acad\xE9mique intelligente et s\xE9curis\xE9e");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "div", 11)(16, "div", 12);
      \u0275\u0275element(17, "i", 13);
      \u0275\u0275elementStart(18, "span");
      \u0275\u0275text(19, "Suivi des \xE9margements en temps r\xE9el");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(20, "div", 12);
      \u0275\u0275element(21, "i", 13);
      \u0275\u0275elementStart(22, "span");
      \u0275\u0275text(23, "Cahier de textes num\xE9rique");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(24, "div", 12);
      \u0275\u0275element(25, "i", 13);
      \u0275\u0275elementStart(26, "span");
      \u0275\u0275text(27, "G\xE9n\xE9ration QR Code dynamique");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(28, "div", 14)(29, "div", 15)(30, "div", 16)(31, "div", 17);
      \u0275\u0275element(32, "img", 18);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "h2");
      \u0275\u0275text(34, "Bienvenue");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(35, "p");
      \u0275\u0275text(36, "Connectez-vous \xE0 votre espace");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(37, "form", 19);
      \u0275\u0275listener("ngSubmit", function LoginComponent_Template_form_ngSubmit_37_listener() {
        return ctx.onSubmit();
      });
      \u0275\u0275elementStart(38, "div", 20)(39, "label", 21);
      \u0275\u0275text(40, "Identifiant");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "div", 22);
      \u0275\u0275element(42, "i", 23)(43, "input", 24);
      \u0275\u0275elementEnd();
      \u0275\u0275template(44, LoginComponent_span_44_Template, 3, 0, "span", 25);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(45, "div", 20)(46, "label", 26);
      \u0275\u0275text(47, "Mot de passe");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(48, "div", 22);
      \u0275\u0275element(49, "i", 27)(50, "input", 28);
      \u0275\u0275elementStart(51, "button", 29);
      \u0275\u0275listener("click", function LoginComponent_Template_button_click_51_listener() {
        return ctx.showPassword = !ctx.showPassword;
      });
      \u0275\u0275element(52, "i", 30);
      \u0275\u0275elementEnd()();
      \u0275\u0275template(53, LoginComponent_span_53_Template, 3, 0, "span", 25);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(54, "button", 31);
      \u0275\u0275element(55, "span", 32);
      \u0275\u0275template(56, LoginComponent_span_56_Template, 3, 0, "span", 33)(57, LoginComponent_span_57_Template, 3, 0, "span", 34);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(58, "div", 35);
      \u0275\u0275element(59, "i", 36);
      \u0275\u0275elementStart(60, "span");
      \u0275\u0275text(61, "Connexion s\xE9curis\xE9e et chiffr\xE9e");
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      let tmp_1_0;
      let tmp_4_0;
      \u0275\u0275advance(37);
      \u0275\u0275property("formGroup", ctx.loginForm);
      \u0275\u0275advance(7);
      \u0275\u0275property("ngIf", ((tmp_1_0 = ctx.loginForm.get("username")) == null ? null : tmp_1_0.invalid) && ((tmp_1_0 = ctx.loginForm.get("username")) == null ? null : tmp_1_0.touched));
      \u0275\u0275advance(6);
      \u0275\u0275property("type", ctx.showPassword ? "text" : "password");
      \u0275\u0275advance(2);
      \u0275\u0275property("ngClass", ctx.showPassword ? "pi-eye-slash" : "pi-eye");
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ((tmp_4_0 = ctx.loginForm.get("password")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = ctx.loginForm.get("password")) == null ? null : tmp_4_0.touched));
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.loginForm.invalid || ctx.isLoading);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngIf", !ctx.isLoading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.isLoading);
    }
  }, dependencies: [CommonModule, NgClass, NgIf, ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName], styles: ['\n\n*[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n}\n.login-page[_ngcontent-%COMP%] {\n  display: flex;\n  height: 100vh;\n  min-height: 100vh;\n  overflow: hidden;\n  font-family:\n    "Inter",\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    Roboto,\n    sans-serif;\n}\n.login-branding[_ngcontent-%COMP%] {\n  width: 50%;\n  background:\n    linear-gradient(\n      135deg,\n      #0b3a82 0%,\n      #1d4ed8 55%,\n      #f59e0b 100%);\n  position: relative;\n  overflow: hidden;\n}\n.floating-shapes[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n  overflow: hidden;\n}\n.shape[_ngcontent-%COMP%] {\n  position: absolute;\n  border-radius: 50%;\n  opacity: 0.06;\n  background: white;\n}\n.shape-1[_ngcontent-%COMP%] {\n  width: 300px;\n  height: 300px;\n  top: -80px;\n  right: -60px;\n  animation: _ngcontent-%COMP%_float1 20s ease-in-out infinite;\n}\n.shape-2[_ngcontent-%COMP%] {\n  width: 200px;\n  height: 200px;\n  bottom: 10%;\n  left: -40px;\n  animation: _ngcontent-%COMP%_float2 15s ease-in-out infinite;\n}\n.shape-3[_ngcontent-%COMP%] {\n  width: 120px;\n  height: 120px;\n  top: 40%;\n  right: 15%;\n  animation: _ngcontent-%COMP%_float3 18s ease-in-out infinite;\n}\n.shape-4[_ngcontent-%COMP%] {\n  width: 80px;\n  height: 80px;\n  top: 20%;\n  left: 20%;\n  animation: _ngcontent-%COMP%_float1 12s ease-in-out infinite reverse;\n}\n.shape-5[_ngcontent-%COMP%] {\n  width: 160px;\n  height: 160px;\n  bottom: -30px;\n  right: 30%;\n  border-radius: 30% 70% 70% 30%/30% 30% 70% 70%;\n  animation: _ngcontent-%COMP%_morph 10s ease-in-out infinite, _ngcontent-%COMP%_float2 14s ease-in-out infinite;\n}\n@keyframes _ngcontent-%COMP%_float1 {\n  0%, 100% {\n    transform: translate(0, 0) scale(1);\n  }\n  33% {\n    transform: translate(30px, -30px) scale(1.1);\n  }\n  66% {\n    transform: translate(-20px, 20px) scale(0.95);\n  }\n}\n@keyframes _ngcontent-%COMP%_float2 {\n  0%, 100% {\n    transform: translate(0, 0) rotate(0deg);\n  }\n  50% {\n    transform: translate(25px, -25px) rotate(45deg);\n  }\n}\n@keyframes _ngcontent-%COMP%_float3 {\n  0%, 100% {\n    transform: translate(0, 0);\n  }\n  25% {\n    transform: translate(15px, 25px);\n  }\n  75% {\n    transform: translate(-15px, -15px);\n  }\n}\n@keyframes _ngcontent-%COMP%_morph {\n  0%, 100% {\n    border-radius: 30% 70% 70% 30%/30% 30% 70% 70%;\n  }\n  50% {\n    border-radius: 70% 30% 30% 70%/70% 70% 30% 30%;\n  }\n}\n.branding-content[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 2;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  color: white;\n  padding: 40px;\n  text-align: center;\n  height: 100%;\n}\n@media (max-height: 700px) {\n  .branding-content[_ngcontent-%COMP%] {\n    padding: 24px;\n  }\n}\n.brand-icon[_ngcontent-%COMP%] {\n  width: 100px;\n  height: 100px;\n  border-radius: 20px;\n  background: rgba(255, 255, 255, 0.95);\n  -webkit-backdrop-filter: blur(12px);\n  backdrop-filter: blur(12px);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-bottom: 24px;\n  border: 1px solid rgba(255, 255, 255, 0.3);\n  animation: _ngcontent-%COMP%_slideIn 0.8s cubic-bezier(0.22, 1, 0.36, 1);\n  box-shadow: 0 10px 24px rgba(2, 6, 23, 0.2);\n}\n@media (max-height: 700px) {\n  .brand-icon[_ngcontent-%COMP%] {\n    width: 72px;\n    height: 72px;\n    margin-bottom: 16px;\n  }\n}\n.brand-icon[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 80%;\n  height: 80%;\n  object-fit: contain;\n  border-radius: 14px;\n}\n.branding-content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: clamp(1.4rem, 3vw, 2.2rem);\n  font-weight: 800;\n  margin: 0 0 12px;\n  letter-spacing: -0.03em;\n  line-height: 1.2;\n}\n@media (max-height: 700px) {\n  .branding-content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: 1.3rem;\n    margin: 0 0 8px;\n  }\n}\n.branding-content[_ngcontent-%COMP%]    > p[_ngcontent-%COMP%] {\n  font-size: 1.05rem;\n  opacity: 0.75;\n  max-width: 400px;\n  line-height: 1.6;\n  margin: 0;\n}\n.brand-features[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  margin-top: 32px;\n  align-items: flex-start;\n}\n@media (max-height: 700px) {\n  .brand-features[_ngcontent-%COMP%] {\n    margin-top: 20px;\n    gap: 8px;\n  }\n}\n.feature[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  font-size: 0.95rem;\n  opacity: 0.9;\n}\n.feature[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: #f59e0b;\n  font-size: 1.15rem;\n}\n.login-auth[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: #fff;\n  position: relative;\n  padding: 16px;\n  overflow-y: auto;\n  overflow-x: hidden;\n}\n.login-auth[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: -150px;\n  right: -150px;\n  width: 400px;\n  height: 400px;\n  background:\n    radial-gradient(\n      circle,\n      rgba(29, 78, 216, 0.06) 0%,\n      transparent 70%);\n  border-radius: 50%;\n}\n.login-auth[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  bottom: -100px;\n  left: -100px;\n  width: 300px;\n  height: 300px;\n  background:\n    radial-gradient(\n      circle,\n      rgba(245, 158, 11, 0.08) 0%,\n      transparent 70%);\n  border-radius: 50%;\n}\n.auth-container[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 420px;\n  padding: 36px 32px;\n  animation: _ngcontent-%COMP%_slideIn 0.6s cubic-bezier(0.22, 1, 0.36, 1);\n  position: relative;\n  z-index: 1;\n}\n@media (max-height: 700px) {\n  .auth-container[_ngcontent-%COMP%] {\n    padding: 24px 20px;\n  }\n}\n@keyframes _ngcontent-%COMP%_slideIn {\n  from {\n    opacity: 0;\n    transform: translateY(24px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.auth-header[_ngcontent-%COMP%] {\n  margin-bottom: 28px;\n  text-align: center;\n}\n@media (max-height: 700px) {\n  .auth-header[_ngcontent-%COMP%] {\n    margin-bottom: 20px;\n  }\n}\n.auth-mobile-logo[_ngcontent-%COMP%] {\n  display: none;\n  align-items: center;\n  justify-content: center;\n  margin: 0 auto 12px;\n}\n.auth-mobile-logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 64px;\n  height: 64px;\n  object-fit: contain;\n  border-radius: 14px;\n  background: #fff;\n  padding: 6px;\n  border: 1px solid rgba(226, 232, 240, 0.9);\n  box-shadow: 0 6px 14px rgba(2, 6, 23, 0.08);\n}\n@media (max-height: 600px) {\n  .auth-mobile-logo[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n.auth-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 1.75rem;\n  font-weight: 800;\n  color: #0f172a;\n  margin: 0 0 6px;\n  letter-spacing: -0.025em;\n}\n@media (max-height: 700px) {\n  .auth-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n    font-size: 1.4rem;\n    margin: 0 0 4px;\n  }\n}\n.auth-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #64748b;\n  font-size: 0.9rem;\n  margin: 0;\n  font-weight: 400;\n}\n@media (max-height: 700px) {\n  .auth-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n    font-size: 0.82rem;\n  }\n}\n.portal-form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 18px;\n}\n@media (max-height: 700px) {\n  .portal-form[_ngcontent-%COMP%] {\n    gap: 14px;\n  }\n}\n.form-group[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.form-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  font-size: 0.82rem;\n  font-weight: 650;\n  color: #374151;\n  letter-spacing: 0.01em;\n}\n@media (max-height: 700px) {\n  .form-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n    font-size: 0.76rem;\n    margin-bottom: 2px;\n  }\n}\n.input-wrapper[_ngcontent-%COMP%] {\n  position: relative;\n  transition: all 0.25s ease;\n}\n.input-wrapper[_ngcontent-%COMP%]   .icon-left[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 16px;\n  top: 50%;\n  transform: translateY(-50%);\n  color: #94a3b8;\n  font-size: 1rem;\n  pointer-events: none;\n  transition: all 0.25s ease;\n  z-index: 1;\n}\n.input-wrapper[_ngcontent-%COMP%]:focus-within   .icon-left[_ngcontent-%COMP%] {\n  color: #2563eb;\n  transform: translateY(-50%) scale(1.15);\n}\n.input-wrapper[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 12px 16px 12px 46px;\n  border: 2px solid #e2e8f0;\n  border-radius: 14px;\n  font-size: 0.95rem;\n  background: #fafbfc;\n  transition: all 0.25s ease;\n  outline: none;\n  color: #0f172a;\n  font-weight: 500;\n}\n@media (max-height: 700px) {\n  .input-wrapper[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n    padding: 10px 14px 10px 42px;\n    font-size: 0.9rem;\n  }\n}\n.input-wrapper[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:hover {\n  border-color: #cbd5e1;\n  background: #fff;\n}\n.input-wrapper[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n  border-color: #2563eb;\n  background: #fff;\n  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1), 0 2px 8px rgba(37, 99, 235, 0.06);\n}\n.input-wrapper[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]::placeholder {\n  color: #b0b8c4;\n  font-weight: 400;\n}\n.input-wrapper[_ngcontent-%COMP%]   .eye-toggle[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 8px;\n  top: 50%;\n  transform: translateY(-50%);\n  background: transparent;\n  border: none;\n  color: #94a3b8;\n  cursor: pointer;\n  padding: 8px;\n  font-size: 1.05rem;\n  border-radius: 8px;\n  transition: all 0.2s ease;\n}\n.input-wrapper[_ngcontent-%COMP%]   .eye-toggle[_ngcontent-%COMP%]:hover {\n  color: #2563eb;\n  background: rgba(37, 99, 235, 0.06);\n}\n.error-msg[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: #ef4444;\n  margin-top: 2px;\n  font-weight: 500;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  animation: _ngcontent-%COMP%_shakeIn 0.4s ease;\n}\n.error-msg[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n}\n@keyframes _ngcontent-%COMP%_shakeIn {\n  0% {\n    transform: translateX(-4px);\n    opacity: 0;\n  }\n  50% {\n    transform: translateX(3px);\n  }\n  100% {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}\n.btn-connect[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: hidden;\n  width: 100%;\n  padding: 14px 24px;\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      135deg,\n      #1d4ed8 0%,\n      #2563eb 55%,\n      #f59e0b 100%);\n  color: white;\n  font-size: 1rem;\n  font-weight: 700;\n  border: none;\n  cursor: pointer;\n  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);\n  box-shadow: 0 6px 16px rgba(29, 78, 216, 0.32);\n  margin-top: 6px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 10px;\n}\n@media (max-height: 700px) {\n  .btn-connect[_ngcontent-%COMP%] {\n    padding: 12px 20px;\n    font-size: 0.92rem;\n  }\n}\n.btn-connect[_ngcontent-%COMP%]:hover:not(:disabled) {\n  transform: translateY(-3px) scale(1.02);\n  box-shadow: 0 12px 28px rgba(29, 78, 216, 0.35), 0 6px 14px rgba(245, 158, 11, 0.22);\n}\n.btn-connect[_ngcontent-%COMP%]:active:not(:disabled) {\n  transform: translateY(0) scale(1);\n  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);\n}\n.btn-connect[_ngcontent-%COMP%]:disabled {\n  opacity: 0.7;\n  cursor: not-allowed;\n  transform: none;\n  box-shadow: none;\n}\n.btn-connect[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: -100%;\n  width: 50%;\n  height: 100%;\n  background:\n    linear-gradient(\n      120deg,\n      transparent,\n      rgba(255, 255, 255, 0.25),\n      transparent);\n  transition: left 0.6s ease;\n}\n.btn-connect[_ngcontent-%COMP%]:hover:not(:disabled)::before {\n  left: 120%;\n}\n.spinner[_ngcontent-%COMP%] {\n  display: inline-block;\n  width: 18px;\n  height: 18px;\n  border: 2.5px solid rgba(255, 255, 255, 0.3);\n  border-top-color: #fff;\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_spin 0.7s linear infinite;\n}\n@keyframes _ngcontent-%COMP%_spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.security-footer[_ngcontent-%COMP%] {\n  margin-top: 24px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 10px;\n  font-size: 0.78rem;\n  color: #94a3b8;\n  font-weight: 500;\n  letter-spacing: 0.02em;\n}\n@media (max-height: 700px) {\n  .security-footer[_ngcontent-%COMP%] {\n    margin-top: 16px;\n  }\n}\n.security-footer[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  color: #f59e0b;\n  font-size: 0.95rem;\n}\n@media (max-width: 900px) {\n  .login-page[_ngcontent-%COMP%] {\n    height: auto;\n    min-height: 100vh;\n  }\n  .login-branding[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .login-auth[_ngcontent-%COMP%] {\n    width: 100%;\n    height: 100vh;\n    padding: 16px;\n  }\n  .auth-container[_ngcontent-%COMP%] {\n    padding: 28px 24px;\n  }\n  .auth-mobile-logo[_ngcontent-%COMP%] {\n    display: flex;\n  }\n  .auth-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n}\n@media (max-width: 480px) {\n  .login-page[_ngcontent-%COMP%] {\n    height: 100vh;\n    min-height: 100vh;\n  }\n  .login-auth[_ngcontent-%COMP%] {\n    height: 100vh;\n    padding: 12px;\n    align-items: flex-start;\n    overflow-y: auto;\n  }\n  .auth-container[_ngcontent-%COMP%] {\n    padding: 20px 16px;\n    max-width: 100%;\n    margin: auto 0;\n  }\n  .auth-header[_ngcontent-%COMP%] {\n    margin-bottom: 20px;\n  }\n  .auth-mobile-logo[_ngcontent-%COMP%] {\n    margin: 0 auto 10px;\n  }\n  .auth-mobile-logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n    width: 52px;\n    height: 52px;\n  }\n  .auth-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n    font-size: 1.3rem;\n  }\n  .auth-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n    font-size: 0.82rem;\n  }\n  .portal-form[_ngcontent-%COMP%] {\n    gap: 14px;\n  }\n  .form-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n    font-size: 0.78rem;\n  }\n  .input-wrapper[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n    padding: 11px 14px 11px 42px;\n    font-size: 0.9rem;\n  }\n  .btn-connect[_ngcontent-%COMP%] {\n    padding: 12px 18px;\n    font-size: 0.92rem;\n  }\n  .security-footer[_ngcontent-%COMP%] {\n    margin-top: 16px;\n    font-size: 0.72rem;\n  }\n}\n@media (max-width: 360px), (max-height: 580px) {\n  .login-auth[_ngcontent-%COMP%] {\n    height: auto;\n    min-height: 100vh;\n    align-items: flex-start;\n    overflow-y: auto;\n  }\n  .auth-container[_ngcontent-%COMP%] {\n    padding: 16px 14px;\n  }\n  .auth-mobile-logo[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .auth-header[_ngcontent-%COMP%] {\n    margin-bottom: 16px;\n  }\n  .auth-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n    font-size: 1.2rem;\n  }\n  .portal-form[_ngcontent-%COMP%] {\n    gap: 12px;\n  }\n  .input-wrapper[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n    padding: 10px 12px 10px 38px;\n    font-size: 0.88rem;\n    border-radius: 10px;\n  }\n  .input-wrapper[_ngcontent-%COMP%]   .icon-left[_ngcontent-%COMP%] {\n    left: 12px;\n    font-size: 0.9rem;\n  }\n  .btn-connect[_ngcontent-%COMP%] {\n    padding: 11px 16px;\n    font-size: 0.88rem;\n    border-radius: 10px;\n  }\n  .security-footer[_ngcontent-%COMP%] {\n    margin-top: 12px;\n  }\n}\n/*# sourceMappingURL=login.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LoginComponent, [{
    type: Component,
    args: [{ selector: "app-login", standalone: true, imports: [CommonModule, ReactiveFormsModule], template: `
    <div class="login-page">
      <!-- Left: Branding Panel -->
      <div class="login-branding">
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
          <div class="shape shape-4"></div>
          <div class="shape shape-5"></div>
        </div>
        <div class="branding-content">
          <div class="brand-icon">
            <img src="assets/images/intec.png" alt="Logo INTEC" />
          </div>
          <h1>INTEC - Suivi P\xE9dagogique</h1>
          <p>Plateforme officielle de gestion acad\xE9mique intelligente et s\xE9curis\xE9e</p>
          <div class="brand-features">
            <div class="feature">
              <i class="pi pi-check-circle"></i><span>Suivi des \xE9margements en temps r\xE9el</span>
            </div>
            <div class="feature">
              <i class="pi pi-check-circle"></i><span>Cahier de textes num\xE9rique</span>
            </div>
            <div class="feature">
              <i class="pi pi-check-circle"></i><span>G\xE9n\xE9ration QR Code dynamique</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Auth Form -->
      <div class="login-auth">
        <div class="auth-container">
          <div class="auth-header">
            <div class="auth-mobile-logo">
              <img src="assets/images/intec1.png" alt="Logo INTEC" />
            </div>
            <h2>Bienvenue</h2>
            <p>Connectez-vous \xE0 votre espace</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="portal-form">
            <div class="form-group">
              <label for="username">Identifiant</label>
              <div class="input-wrapper">
                <i class="pi pi-user icon-left"></i>
                <input
                  id="username"
                  type="text"
                  formControlName="username"
                  placeholder="Entrez votre identifiant"
                  autocomplete="username"
                />
              </div>
              <span
                class="error-msg"
                *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
              >
                <i class="pi pi-exclamation-circle"></i> Identifiant requis (min. 3 caract\xE8res)
              </span>
            </div>

            <div class="form-group">
              <label for="password">Mot de passe</label>
              <div class="input-wrapper">
                <i class="pi pi-lock icon-left"></i>
                <input
                  id="password"
                  [type]="showPassword ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="Entrez votre mot de passe"
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  class="eye-toggle"
                  (click)="showPassword = !showPassword"
                  tabindex="-1"
                >
                  <i class="pi" [ngClass]="showPassword ? 'pi-eye-slash' : 'pi-eye'"></i>
                </button>
              </div>
              <span
                class="error-msg"
                *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
              >
                <i class="pi pi-exclamation-circle"></i> Mot de passe requis (min. 4 caract\xE8res)
              </span>
            </div>

            <button type="submit" class="btn-connect" [disabled]="loginForm.invalid || isLoading">
              <span class="btn-shimmer"></span>
              <span *ngIf="!isLoading" class="btn-content"
                ><i class="pi pi-sign-in"></i> Se connecter</span
              >
              <span *ngIf="isLoading" class="btn-content btn-loading"
                ><span class="spinner"></span> Connexion...</span
              >
            </button>
          </form>

          <div class="security-footer">
            <i class="pi pi-shield"></i>
            <span>Connexion s\xE9curis\xE9e et chiffr\xE9e</span>
          </div>
        </div>
      </div>
    </div>
  `, styles: ['/* angular:styles/component:scss;97ba93d435f9bc14f11408be8e59ad0cdbf523d3a19563b58496746027ab37a5;/home/aya97/suivi-pedagogique-system/frontend-web/src/app/features/login/login.component.ts */\n* {\n  box-sizing: border-box;\n}\n.login-page {\n  display: flex;\n  height: 100vh;\n  min-height: 100vh;\n  overflow: hidden;\n  font-family:\n    "Inter",\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    Roboto,\n    sans-serif;\n}\n.login-branding {\n  width: 50%;\n  background:\n    linear-gradient(\n      135deg,\n      #0b3a82 0%,\n      #1d4ed8 55%,\n      #f59e0b 100%);\n  position: relative;\n  overflow: hidden;\n}\n.floating-shapes {\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n  overflow: hidden;\n}\n.shape {\n  position: absolute;\n  border-radius: 50%;\n  opacity: 0.06;\n  background: white;\n}\n.shape-1 {\n  width: 300px;\n  height: 300px;\n  top: -80px;\n  right: -60px;\n  animation: float1 20s ease-in-out infinite;\n}\n.shape-2 {\n  width: 200px;\n  height: 200px;\n  bottom: 10%;\n  left: -40px;\n  animation: float2 15s ease-in-out infinite;\n}\n.shape-3 {\n  width: 120px;\n  height: 120px;\n  top: 40%;\n  right: 15%;\n  animation: float3 18s ease-in-out infinite;\n}\n.shape-4 {\n  width: 80px;\n  height: 80px;\n  top: 20%;\n  left: 20%;\n  animation: float1 12s ease-in-out infinite reverse;\n}\n.shape-5 {\n  width: 160px;\n  height: 160px;\n  bottom: -30px;\n  right: 30%;\n  border-radius: 30% 70% 70% 30%/30% 30% 70% 70%;\n  animation: morph 10s ease-in-out infinite, float2 14s ease-in-out infinite;\n}\n@keyframes float1 {\n  0%, 100% {\n    transform: translate(0, 0) scale(1);\n  }\n  33% {\n    transform: translate(30px, -30px) scale(1.1);\n  }\n  66% {\n    transform: translate(-20px, 20px) scale(0.95);\n  }\n}\n@keyframes float2 {\n  0%, 100% {\n    transform: translate(0, 0) rotate(0deg);\n  }\n  50% {\n    transform: translate(25px, -25px) rotate(45deg);\n  }\n}\n@keyframes float3 {\n  0%, 100% {\n    transform: translate(0, 0);\n  }\n  25% {\n    transform: translate(15px, 25px);\n  }\n  75% {\n    transform: translate(-15px, -15px);\n  }\n}\n@keyframes morph {\n  0%, 100% {\n    border-radius: 30% 70% 70% 30%/30% 30% 70% 70%;\n  }\n  50% {\n    border-radius: 70% 30% 30% 70%/70% 70% 30% 30%;\n  }\n}\n.branding-content {\n  position: relative;\n  z-index: 2;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  color: white;\n  padding: 40px;\n  text-align: center;\n  height: 100%;\n}\n@media (max-height: 700px) {\n  .branding-content {\n    padding: 24px;\n  }\n}\n.brand-icon {\n  width: 100px;\n  height: 100px;\n  border-radius: 20px;\n  background: rgba(255, 255, 255, 0.95);\n  -webkit-backdrop-filter: blur(12px);\n  backdrop-filter: blur(12px);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-bottom: 24px;\n  border: 1px solid rgba(255, 255, 255, 0.3);\n  animation: slideIn 0.8s cubic-bezier(0.22, 1, 0.36, 1);\n  box-shadow: 0 10px 24px rgba(2, 6, 23, 0.2);\n}\n@media (max-height: 700px) {\n  .brand-icon {\n    width: 72px;\n    height: 72px;\n    margin-bottom: 16px;\n  }\n}\n.brand-icon img {\n  width: 80%;\n  height: 80%;\n  object-fit: contain;\n  border-radius: 14px;\n}\n.branding-content h1 {\n  font-size: clamp(1.4rem, 3vw, 2.2rem);\n  font-weight: 800;\n  margin: 0 0 12px;\n  letter-spacing: -0.03em;\n  line-height: 1.2;\n}\n@media (max-height: 700px) {\n  .branding-content h1 {\n    font-size: 1.3rem;\n    margin: 0 0 8px;\n  }\n}\n.branding-content > p {\n  font-size: 1.05rem;\n  opacity: 0.75;\n  max-width: 400px;\n  line-height: 1.6;\n  margin: 0;\n}\n.brand-features {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  margin-top: 32px;\n  align-items: flex-start;\n}\n@media (max-height: 700px) {\n  .brand-features {\n    margin-top: 20px;\n    gap: 8px;\n  }\n}\n.feature {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  font-size: 0.95rem;\n  opacity: 0.9;\n}\n.feature i {\n  color: #f59e0b;\n  font-size: 1.15rem;\n}\n.login-auth {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: #fff;\n  position: relative;\n  padding: 16px;\n  overflow-y: auto;\n  overflow-x: hidden;\n}\n.login-auth::before {\n  content: "";\n  position: absolute;\n  top: -150px;\n  right: -150px;\n  width: 400px;\n  height: 400px;\n  background:\n    radial-gradient(\n      circle,\n      rgba(29, 78, 216, 0.06) 0%,\n      transparent 70%);\n  border-radius: 50%;\n}\n.login-auth::after {\n  content: "";\n  position: absolute;\n  bottom: -100px;\n  left: -100px;\n  width: 300px;\n  height: 300px;\n  background:\n    radial-gradient(\n      circle,\n      rgba(245, 158, 11, 0.08) 0%,\n      transparent 70%);\n  border-radius: 50%;\n}\n.auth-container {\n  width: 100%;\n  max-width: 420px;\n  padding: 36px 32px;\n  animation: slideIn 0.6s cubic-bezier(0.22, 1, 0.36, 1);\n  position: relative;\n  z-index: 1;\n}\n@media (max-height: 700px) {\n  .auth-container {\n    padding: 24px 20px;\n  }\n}\n@keyframes slideIn {\n  from {\n    opacity: 0;\n    transform: translateY(24px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.auth-header {\n  margin-bottom: 28px;\n  text-align: center;\n}\n@media (max-height: 700px) {\n  .auth-header {\n    margin-bottom: 20px;\n  }\n}\n.auth-mobile-logo {\n  display: none;\n  align-items: center;\n  justify-content: center;\n  margin: 0 auto 12px;\n}\n.auth-mobile-logo img {\n  width: 64px;\n  height: 64px;\n  object-fit: contain;\n  border-radius: 14px;\n  background: #fff;\n  padding: 6px;\n  border: 1px solid rgba(226, 232, 240, 0.9);\n  box-shadow: 0 6px 14px rgba(2, 6, 23, 0.08);\n}\n@media (max-height: 600px) {\n  .auth-mobile-logo {\n    display: none;\n  }\n}\n.auth-header h2 {\n  font-size: 1.75rem;\n  font-weight: 800;\n  color: #0f172a;\n  margin: 0 0 6px;\n  letter-spacing: -0.025em;\n}\n@media (max-height: 700px) {\n  .auth-header h2 {\n    font-size: 1.4rem;\n    margin: 0 0 4px;\n  }\n}\n.auth-header p {\n  color: #64748b;\n  font-size: 0.9rem;\n  margin: 0;\n  font-weight: 400;\n}\n@media (max-height: 700px) {\n  .auth-header p {\n    font-size: 0.82rem;\n  }\n}\n.portal-form {\n  display: flex;\n  flex-direction: column;\n  gap: 18px;\n}\n@media (max-height: 700px) {\n  .portal-form {\n    gap: 14px;\n  }\n}\n.form-group {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.form-group label {\n  font-size: 0.82rem;\n  font-weight: 650;\n  color: #374151;\n  letter-spacing: 0.01em;\n}\n@media (max-height: 700px) {\n  .form-group label {\n    font-size: 0.76rem;\n    margin-bottom: 2px;\n  }\n}\n.input-wrapper {\n  position: relative;\n  transition: all 0.25s ease;\n}\n.input-wrapper .icon-left {\n  position: absolute;\n  left: 16px;\n  top: 50%;\n  transform: translateY(-50%);\n  color: #94a3b8;\n  font-size: 1rem;\n  pointer-events: none;\n  transition: all 0.25s ease;\n  z-index: 1;\n}\n.input-wrapper:focus-within .icon-left {\n  color: #2563eb;\n  transform: translateY(-50%) scale(1.15);\n}\n.input-wrapper input {\n  width: 100%;\n  padding: 12px 16px 12px 46px;\n  border: 2px solid #e2e8f0;\n  border-radius: 14px;\n  font-size: 0.95rem;\n  background: #fafbfc;\n  transition: all 0.25s ease;\n  outline: none;\n  color: #0f172a;\n  font-weight: 500;\n}\n@media (max-height: 700px) {\n  .input-wrapper input {\n    padding: 10px 14px 10px 42px;\n    font-size: 0.9rem;\n  }\n}\n.input-wrapper input:hover {\n  border-color: #cbd5e1;\n  background: #fff;\n}\n.input-wrapper input:focus {\n  border-color: #2563eb;\n  background: #fff;\n  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1), 0 2px 8px rgba(37, 99, 235, 0.06);\n}\n.input-wrapper input::placeholder {\n  color: #b0b8c4;\n  font-weight: 400;\n}\n.input-wrapper .eye-toggle {\n  position: absolute;\n  right: 8px;\n  top: 50%;\n  transform: translateY(-50%);\n  background: transparent;\n  border: none;\n  color: #94a3b8;\n  cursor: pointer;\n  padding: 8px;\n  font-size: 1.05rem;\n  border-radius: 8px;\n  transition: all 0.2s ease;\n}\n.input-wrapper .eye-toggle:hover {\n  color: #2563eb;\n  background: rgba(37, 99, 235, 0.06);\n}\n.error-msg {\n  font-size: 0.75rem;\n  color: #ef4444;\n  margin-top: 2px;\n  font-weight: 500;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  animation: shakeIn 0.4s ease;\n}\n.error-msg i {\n  font-size: 0.85rem;\n}\n@keyframes shakeIn {\n  0% {\n    transform: translateX(-4px);\n    opacity: 0;\n  }\n  50% {\n    transform: translateX(3px);\n  }\n  100% {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}\n.btn-connect {\n  position: relative;\n  overflow: hidden;\n  width: 100%;\n  padding: 14px 24px;\n  border-radius: 14px;\n  background:\n    linear-gradient(\n      135deg,\n      #1d4ed8 0%,\n      #2563eb 55%,\n      #f59e0b 100%);\n  color: white;\n  font-size: 1rem;\n  font-weight: 700;\n  border: none;\n  cursor: pointer;\n  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);\n  box-shadow: 0 6px 16px rgba(29, 78, 216, 0.32);\n  margin-top: 6px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 10px;\n}\n@media (max-height: 700px) {\n  .btn-connect {\n    padding: 12px 20px;\n    font-size: 0.92rem;\n  }\n}\n.btn-connect:hover:not(:disabled) {\n  transform: translateY(-3px) scale(1.02);\n  box-shadow: 0 12px 28px rgba(29, 78, 216, 0.35), 0 6px 14px rgba(245, 158, 11, 0.22);\n}\n.btn-connect:active:not(:disabled) {\n  transform: translateY(0) scale(1);\n  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);\n}\n.btn-connect:disabled {\n  opacity: 0.7;\n  cursor: not-allowed;\n  transform: none;\n  box-shadow: none;\n}\n.btn-connect::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: -100%;\n  width: 50%;\n  height: 100%;\n  background:\n    linear-gradient(\n      120deg,\n      transparent,\n      rgba(255, 255, 255, 0.25),\n      transparent);\n  transition: left 0.6s ease;\n}\n.btn-connect:hover:not(:disabled)::before {\n  left: 120%;\n}\n.spinner {\n  display: inline-block;\n  width: 18px;\n  height: 18px;\n  border: 2.5px solid rgba(255, 255, 255, 0.3);\n  border-top-color: #fff;\n  border-radius: 50%;\n  animation: spin 0.7s linear infinite;\n}\n@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.security-footer {\n  margin-top: 24px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 10px;\n  font-size: 0.78rem;\n  color: #94a3b8;\n  font-weight: 500;\n  letter-spacing: 0.02em;\n}\n@media (max-height: 700px) {\n  .security-footer {\n    margin-top: 16px;\n  }\n}\n.security-footer i {\n  color: #f59e0b;\n  font-size: 0.95rem;\n}\n@media (max-width: 900px) {\n  .login-page {\n    height: auto;\n    min-height: 100vh;\n  }\n  .login-branding {\n    display: none;\n  }\n  .login-auth {\n    width: 100%;\n    height: 100vh;\n    padding: 16px;\n  }\n  .auth-container {\n    padding: 28px 24px;\n  }\n  .auth-mobile-logo {\n    display: flex;\n  }\n  .auth-header h2 {\n    font-size: 1.5rem;\n  }\n}\n@media (max-width: 480px) {\n  .login-page {\n    height: 100vh;\n    min-height: 100vh;\n  }\n  .login-auth {\n    height: 100vh;\n    padding: 12px;\n    align-items: flex-start;\n    overflow-y: auto;\n  }\n  .auth-container {\n    padding: 20px 16px;\n    max-width: 100%;\n    margin: auto 0;\n  }\n  .auth-header {\n    margin-bottom: 20px;\n  }\n  .auth-mobile-logo {\n    margin: 0 auto 10px;\n  }\n  .auth-mobile-logo img {\n    width: 52px;\n    height: 52px;\n  }\n  .auth-header h2 {\n    font-size: 1.3rem;\n  }\n  .auth-header p {\n    font-size: 0.82rem;\n  }\n  .portal-form {\n    gap: 14px;\n  }\n  .form-group label {\n    font-size: 0.78rem;\n  }\n  .input-wrapper input {\n    padding: 11px 14px 11px 42px;\n    font-size: 0.9rem;\n  }\n  .btn-connect {\n    padding: 12px 18px;\n    font-size: 0.92rem;\n  }\n  .security-footer {\n    margin-top: 16px;\n    font-size: 0.72rem;\n  }\n}\n@media (max-width: 360px), (max-height: 580px) {\n  .login-auth {\n    height: auto;\n    min-height: 100vh;\n    align-items: flex-start;\n    overflow-y: auto;\n  }\n  .auth-container {\n    padding: 16px 14px;\n  }\n  .auth-mobile-logo {\n    display: none;\n  }\n  .auth-header {\n    margin-bottom: 16px;\n  }\n  .auth-header h2 {\n    font-size: 1.2rem;\n  }\n  .portal-form {\n    gap: 12px;\n  }\n  .input-wrapper input {\n    padding: 10px 12px 10px 38px;\n    font-size: 0.88rem;\n    border-radius: 10px;\n  }\n  .input-wrapper .icon-left {\n    left: 12px;\n    font-size: 0.9rem;\n  }\n  .btn-connect {\n    padding: 11px 16px;\n    font-size: 0.88rem;\n    border-radius: 10px;\n  }\n  .security-footer {\n    margin-top: 12px;\n  }\n}\n/*# sourceMappingURL=login.component.css.map */\n'] }]
  }], () => [{ type: FormBuilder }, { type: AuthService }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoginComponent, { className: "LoginComponent", filePath: "src/app/features/login/login.component.ts", lineNumber: 814 });
})();

// src/app/app.routes.ts
var routes = [
  { path: "login", component: LoginComponent },
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "dashboard", component: DashboardComponent },
  {
    path: "teachers",
    loadComponent: () => import("./chunk-4QNW776I.js").then((m) => m.TeachersComponent)
  },
  {
    path: "qr-generator",
    loadComponent: () => import("./chunk-NXM6XWZQ.js").then((m) => m.QrGeneratorComponent)
  },
  {
    path: "attendance",
    loadComponent: () => import("./chunk-7THHIE3A.js").then((m) => m.AttendanceComponent)
  },
  {
    path: "pedagogy",
    loadComponent: () => import("./chunk-USAT5G5H.js").then((m) => m.PedagogyComponent)
  }
];

// src/app/app.config.ts
var appConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};

// src/app/app.ts
function App_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 6)(1, "div", 7);
    \u0275\u0275element(2, "img", 8);
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "INTEC-PEDAGO");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "ul", 9)(6, "li", 10);
    \u0275\u0275listener("click", function App_div_2_Template_li_click_6_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeMobileMenu());
    });
    \u0275\u0275element(7, "i", 11);
    \u0275\u0275elementStart(8, "span");
    \u0275\u0275text(9, "Tableau de bord");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "li", 12);
    \u0275\u0275listener("click", function App_div_2_Template_li_click_10_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeMobileMenu());
    });
    \u0275\u0275element(11, "i", 13);
    \u0275\u0275elementStart(12, "span");
    \u0275\u0275text(13, "Enseignants");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "li", 14);
    \u0275\u0275listener("click", function App_div_2_Template_li_click_14_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeMobileMenu());
    });
    \u0275\u0275element(15, "i", 15);
    \u0275\u0275elementStart(16, "span");
    \u0275\u0275text(17, "S\xE9ance du jour");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "li", 16);
    \u0275\u0275listener("click", function App_div_2_Template_li_click_18_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeMobileMenu());
    });
    \u0275\u0275element(19, "i", 17);
    \u0275\u0275elementStart(20, "span");
    \u0275\u0275text(21, "Emargements");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "li", 18);
    \u0275\u0275listener("click", function App_div_2_Template_li_click_22_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeMobileMenu());
    });
    \u0275\u0275element(23, "i", 19);
    \u0275\u0275elementStart(24, "span");
    \u0275\u0275text(25, "Cahiers de textes");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(26, "div", 20)(27, "div", 21);
    \u0275\u0275listener("click", function App_div_2_Template_div_click_27_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.logout());
    });
    \u0275\u0275element(28, "i", 22);
    \u0275\u0275elementStart(29, "span");
    \u0275\u0275text(30, "D\xE9connexion");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("mobile-active", ctx_r1.mobileMenuOpen);
  }
}
function App_div_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 23)(1, "div", 24)(2, "div", 25);
    \u0275\u0275listener("click", function App_div_4_Template_div_click_2_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleMobileMenu());
    });
    \u0275\u0275element(3, "i", 26);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 27);
    \u0275\u0275element(5, "i", 28)(6, "input", 29);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 30)(8, "div", 31)(9, "div", 32);
    \u0275\u0275element(10, "i", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 32);
    \u0275\u0275element(12, "i", 34)(13, "span", 35);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div", 32);
    \u0275\u0275element(15, "i", 36);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 37)(17, "div", 38)(18, "span", 39);
    \u0275\u0275text(19, "Admin Mali");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "span", 40);
    \u0275\u0275text(21, "Super Administrateur");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div", 41);
    \u0275\u0275element(23, "img", 42)(24, "div", 43);
    \u0275\u0275elementEnd();
    \u0275\u0275element(25, "i", 44);
    \u0275\u0275elementEnd()()();
  }
}
var App = class _App {
  router;
  authService;
  showSidebar = false;
  mobileMenuOpen = false;
  constructor(router, authService) {
    this.router = router;
    this.authService = authService;
    this.updateSidebarVisibility(this.router.url);
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      this.updateSidebarVisibility(event.urlAfterRedirects || event.url);
      this.mobileMenuOpen = false;
    });
  }
  updateSidebarVisibility(url) {
    this.showSidebar = !url.includes("/login");
  }
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
  logout() {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
  static \u0275fac = function App_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _App)(\u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(AuthService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _App, selectors: [["app-root"]], decls: 7, vars: 6, consts: [[1, "layout-wrapper"], [1, "layout-mask", 3, "click"], ["class", "layout-sidebar", 3, "mobile-active", 4, "ngIf"], [1, "layout-main"], ["class", "layout-topbar", 4, "ngIf"], [1, "layout-content"], [1, "layout-sidebar"], [1, "sidebar-logo"], ["src", "/assets/images/intec.png", "alt", "Logo INTEC", 1, "brand-logo-sidebar"], [1, "sidebar-menu"], ["routerLink", "/dashboard", "routerLinkActive", "active", 3, "click"], [1, "pi", "pi-th-large"], ["routerLink", "/teachers", "routerLinkActive", "active", 3, "click"], [1, "pi", "pi-users"], ["routerLink", "/qr-generator", "routerLinkActive", "active", 3, "click"], [1, "pi", "pi-qrcode"], ["routerLink", "/attendance", "routerLinkActive", "active", 3, "click"], [1, "pi", "pi-check-square"], ["routerLink", "/pedagogy", "routerLinkActive", "active", 3, "click"], [1, "pi", "pi-book"], [1, "sidebar-footer"], [1, "logout-btn", 3, "click"], [1, "pi", "pi-power-off"], [1, "layout-topbar"], [1, "topbar-left"], [1, "menu-button", 3, "click"], [1, "pi", "pi-bars"], [1, "topbar-search"], [1, "pi", "pi-search"], ["type", "text", "placeholder", "Rechercher une information..."], [1, "topbar-right"], [1, "action-icons"], [1, "icon-btn"], [1, "pi", "pi-envelope"], [1, "pi", "pi-bell"], [1, "pulse-badge"], [1, "pi", "pi-cog"], [1, "user-anchor"], [1, "user-info"], [1, "user-name"], [1, "user-role"], [1, "avatar-wrapper"], ["src", "https://ui-avatars.com/api/?name=Admin+Mali&background=2563eb&color=fff", "alt", "Profile"], [1, "status-indicator", "online"], [1, "pi", "pi-chevron-down"]], template: function App_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
      \u0275\u0275listener("click", function App_Template_div_click_1_listener() {
        return ctx.closeMobileMenu();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275template(2, App_div_2_Template, 31, 2, "div", 2);
      \u0275\u0275elementStart(3, "div", 3);
      \u0275\u0275template(4, App_div_4_Template, 26, 0, "div", 4);
      \u0275\u0275elementStart(5, "div", 5);
      \u0275\u0275element(6, "router-outlet");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275classProp("no-sidebar", !ctx.showSidebar);
      \u0275\u0275advance();
      \u0275\u0275classProp("active", ctx.mobileMenuOpen);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.showSidebar);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngIf", ctx.showSidebar);
    }
  }, dependencies: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, NgIf], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(App, [{
    type: Component,
    args: [{ selector: "app-root", standalone: true, imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule], template: '<div class="layout-wrapper" [class.no-sidebar]="!showSidebar">\n  <!-- Overlay pour mobile -->\n  <div class="layout-mask" [class.active]="mobileMenuOpen" (click)="closeMobileMenu()"></div>\n\n  <!-- Sidebar -->\n  <div class="layout-sidebar" *ngIf="showSidebar" [class.mobile-active]="mobileMenuOpen">\n    <div class="sidebar-logo">\n      <img src="/assets/images/intec.png" alt="Logo INTEC" class="brand-logo-sidebar" />\n      <span>INTEC-PEDAGO</span>\n    </div>\n    <ul class="sidebar-menu">\n      <li routerLink="/dashboard" routerLinkActive="active" (click)="closeMobileMenu()">\n        <i class="pi pi-th-large"></i> <span>Tableau de bord</span>\n      </li>\n      <li routerLink="/teachers" routerLinkActive="active" (click)="closeMobileMenu()">\n        <i class="pi pi-users"></i> <span>Enseignants</span>\n      </li>\n      <li routerLink="/qr-generator" routerLinkActive="active" (click)="closeMobileMenu()">\n        <i class="pi pi-qrcode"></i> <span>S\xE9ance du jour</span>\n      </li>\n      <li routerLink="/attendance" routerLinkActive="active" (click)="closeMobileMenu()">\n        <i class="pi pi-check-square"></i> <span>Emargements</span>\n      </li>\n      <li routerLink="/pedagogy" routerLinkActive="active" (click)="closeMobileMenu()">\n        <i class="pi pi-book"></i> <span>Cahiers de textes</span>\n      </li>\n    </ul>\n\n    <div class="sidebar-footer">\n      <div class="logout-btn" (click)="logout()">\n        <i class="pi pi-power-off"></i> <span>D\xE9connexion</span>\n      </div>\n    </div>\n  </div>\n\n  <div class="layout-main">\n    <!-- Topbar -->\n    <div class="layout-topbar" *ngIf="showSidebar">\n      <div class="topbar-left">\n        <div class="menu-button" (click)="toggleMobileMenu()">\n          <i class="pi pi-bars"></i>\n        </div>\n\n        <div class="topbar-search">\n          <i class="pi pi-search"></i>\n          <input type="text" placeholder="Rechercher une information..." />\n        </div>\n      </div>\n\n      <div class="topbar-right">\n        <div class="action-icons">\n          <div class="icon-btn">\n            <i class="pi pi-envelope"></i>\n          </div>\n          <div class="icon-btn">\n            <i class="pi pi-bell"></i>\n            <span class="pulse-badge"></span>\n          </div>\n          <div class="icon-btn">\n            <i class="pi pi-cog"></i>\n          </div>\n        </div>\n\n        <div class="user-anchor">\n          <div class="user-info">\n            <span class="user-name">Admin Mali</span>\n            <span class="user-role">Super Administrateur</span>\n          </div>\n          <div class="avatar-wrapper">\n            <img\n              src="https://ui-avatars.com/api/?name=Admin+Mali&background=2563eb&color=fff"\n              alt="Profile"\n            />\n            <div class="status-indicator online"></div>\n          </div>\n          <i class="pi pi-chevron-down"></i>\n        </div>\n      </div>\n    </div>\n\n    <!-- Contenu Principal -->\n    <div class="layout-content">\n      <router-outlet></router-outlet>\n    </div>\n  </div>\n</div>\n' }]
  }], () => [{ type: Router }, { type: AuthService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(App, { className: "App", filePath: "src/app/app.ts", lineNumber: 14 });
})();

// src/main.ts
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
/*! Bundled license information:

@angular/router/fesm2022/_router-chunk.mjs:
@angular/router/fesm2022/_router_module-chunk.mjs:
@angular/router/fesm2022/router.mjs:
  (**
   * @license Angular v21.2.2
   * (c) 2010-2026 Google LLC. https://angular.dev/
   * License: MIT
   *)
*/
//# sourceMappingURL=main.js.map
