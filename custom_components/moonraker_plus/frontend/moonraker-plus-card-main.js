var F=globalThis,V=F.ShadowRoot&&(F.ShadyCSS===void 0||F.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,X=Symbol(),vt=new WeakMap,H=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==X)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(V&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=vt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&vt.set(e,t))}return t}toString(){return this.cssText}},bt=r=>new H(typeof r=="string"?r:r+"",void 0,X),Y=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new H(e,r,X)},_t=(r,t)=>{if(V)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=F.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},Z=V?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return bt(e)})(r):r;var{is:Vt,defineProperty:Wt,getOwnPropertyDescriptor:qt,getOwnPropertyNames:Kt,getOwnPropertySymbols:Gt,getPrototypeOf:Jt}=Object,W=globalThis,$t=W.trustedTypes,Xt=$t?$t.emptyScript:"",Yt=W.reactiveElementPolyfillSupport,R=(r,t)=>r,Q={toAttribute(r,t){switch(t){case Boolean:r=r?Xt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},xt=(r,t)=>!Vt(r,t),yt={attribute:!0,type:String,converter:Q,reflect:!1,useDefault:!1,hasChanged:xt};Symbol.metadata??=Symbol("metadata"),W.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=yt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Wt(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:n}=qt(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){let l=i?.call(this);n?.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??yt}static _$Ei(){if(this.hasOwnProperty(R("elementProperties")))return;let t=Jt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(R("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(R("properties"))){let e=this.properties,s=[...Kt(e),...Gt(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(Z(i))}else t!==void 0&&e.push(Z(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return _t(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let n=(s.converter?.toAttribute!==void 0?s.converter:Q).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:Q;this._$Em=i;let l=o.fromAttribute(e,n.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(t,e,s,i=!1,n){if(t!==void 0){let o=this.constructor;if(i===!1&&(n=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??xt)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,n]of s){let{wrapped:o}=n,l=this[i];o!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,n,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[R("elementProperties")]=new Map,y[R("finalized")]=new Map,Yt?.({ReactiveElement:y}),(W.reactiveElementVersions??=[]).push("2.1.2");var ot=globalThis,wt=r=>r,q=ot.trustedTypes,At=q?q.createPolicy("lit-html",{createHTML:r=>r}):void 0,Pt="$lit$",w=`lit$${Math.random().toFixed(9).slice(2)}$`,Mt="?"+w,Zt=`<${Mt}>`,k=document,U=()=>k.createComment(""),O=r=>r===null||typeof r!="object"&&typeof r!="function",at=Array.isArray,Qt=r=>at(r)||typeof r?.[Symbol.iterator]=="function",tt=`[ 	
\f\r]`,j=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,St=/-->/g,kt=/>/g,A=RegExp(`>|${tt}(?:([^\\s"'>=/]+)(${tt}*=${tt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Et=/'/g,Ct=/"/g,Lt=/^(?:script|style|textarea|title)$/i,lt=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),c=lt(1),Ht=lt(2),ge=lt(3),E=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Tt=new WeakMap,S=k.createTreeWalker(k,129);function Rt(r,t){if(!at(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return At!==void 0?At.createHTML(t):t}var te=(r,t)=>{let e=r.length-1,s=[],i,n=t===2?"<svg>":t===3?"<math>":"",o=j;for(let l=0;l<e;l++){let a=r[l],h,m,u=-1,v=0;for(;v<a.length&&(o.lastIndex=v,m=o.exec(a),m!==null);)v=o.lastIndex,o===j?m[1]==="!--"?o=St:m[1]!==void 0?o=kt:m[2]!==void 0?(Lt.test(m[2])&&(i=RegExp("</"+m[2],"g")),o=A):m[3]!==void 0&&(o=A):o===A?m[0]===">"?(o=i??j,u=-1):m[1]===void 0?u=-2:(u=o.lastIndex-m[2].length,h=m[1],o=m[3]===void 0?A:m[3]==='"'?Ct:Et):o===Ct||o===Et?o=A:o===St||o===kt?o=j:(o=A,i=void 0);let _=o===A&&r[l+1].startsWith("/>")?" ":"";n+=o===j?a+Zt:u>=0?(s.push(h),a.slice(0,u)+Pt+a.slice(u)+w+_):a+w+(u===-2?l:_)}return[Rt(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},N=class r{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0,l=t.length-1,a=this.parts,[h,m]=te(t,e);if(this.el=r.createElement(h,s),S.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=S.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let u of i.getAttributeNames())if(u.endsWith(Pt)){let v=m[o++],_=i.getAttribute(u).split(w),x=/([.?@])?(.*)/.exec(v);a.push({type:1,index:n,name:x[2],strings:_,ctor:x[1]==="."?st:x[1]==="?"?it:x[1]==="@"?rt:P}),i.removeAttribute(u)}else u.startsWith(w)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(Lt.test(i.tagName)){let u=i.textContent.split(w),v=u.length-1;if(v>0){i.textContent=q?q.emptyScript:"";for(let _=0;_<v;_++)i.append(u[_],U()),S.nextNode(),a.push({type:2,index:++n});i.append(u[v],U())}}}else if(i.nodeType===8)if(i.data===Mt)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(w,u+1))!==-1;)a.push({type:7,index:n}),u+=w.length-1}n++}}static createElement(t,e){let s=k.createElement("template");return s.innerHTML=t,s}};function T(r,t,e=r,s){if(t===E)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,n=O(t)?void 0:t._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=T(r,i._$AS(r,t.values),i,s)),t}var et=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??k).importNode(e,!0);S.currentNode=i;let n=S.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let h;a.type===2?h=new z(n,n.nextSibling,this,t):a.type===1?h=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(h=new nt(n,this,t)),this._$AV.push(h),a=s[++l]}o!==a?.index&&(n=S.nextNode(),o++)}return S.currentNode=k,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},z=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=T(this,t,e),O(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==E&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Qt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(k.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=N.createElement(Rt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let n=new et(i,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(t){let e=Tt.get(t.strings);return e===void 0&&Tt.set(t.strings,e=new N(t)),e}k(t){at(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let n of t)i===e.length?e.push(s=new r(this.O(U()),this.O(U()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=wt(t).nextSibling;wt(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},P=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}_$AI(t,e=this,s,i){let n=this.strings,o=!1;if(n===void 0)t=T(this,t,e,0),o=!O(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else{let l=t,a,h;for(t=n[0],a=0;a<n.length-1;a++)h=T(this,l[s+a],e,a),h===E&&(h=this._$AH[a]),o||=!O(h)||h!==this._$AH[a],h===p?t=p:t!==p&&(t+=(h??"")+n[a+1]),this._$AH[a]=h}o&&!i&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},st=class extends P{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}},it=class extends P{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}},rt=class extends P{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=T(this,t,e,0)??p)===E)return;let s=this._$AH,i=t===p&&s!==p||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==p&&(s===p||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},nt=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){T(this,t)}};var ee=ot.litHtmlPolyfillSupport;ee?.(N,z),(ot.litHtmlVersions??=[]).push("3.3.3");var jt=(r,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let n=e?.renderBefore??null;s._$litPart$=i=new z(t.insertBefore(U(),n),n,void 0,e??{})}return i._$AI(r),i};var ct=globalThis,$=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=jt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return E}};$._$litElement$=!0,$.finalized=!0,ct.litElementHydrateSupport?.({LitElement:$});var se=ct.litElementPolyfillSupport;se?.({LitElement:$});(ct.litElementVersions??=[]).push("4.2.2");var D=null;function I(r,t=!1){if(!t&&D&&Date.now()-D.at<6e4)return D.promise;let e=r.connection.sendMessagePromise({type:"moonraker_plus/printers"}).then(s=>s.printers);return D={at:Date.now(),promise:e},e.catch(()=>{D=null}),e}function Ut(r){return r.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"printer"}var ie=new Set(["unavailable","unknown","","none"]);function b(r,t){return t?r.states[t]:void 0}function g(r,t){let e=b(r,t)?.state;return e===void 0||ie.has(e)?void 0:e}function f(r,t){let e=g(r,t);if(e===void 0)return;let s=Number(e);return Number.isFinite(s)?s:void 0}var re={s:1,min:60,h:3600,d:86400};function K(r,t){let e=f(r,t);if(e===void 0)return;let s=b(r,t)?.attributes.unit_of_measurement??"s";return e*(re[s]??1)}function G(r){if(r===void 0)return"\u2013";let t=Math.max(0,Math.round(r/60)),e=Math.floor(t/60),s=t%60;return e>=24?`${Math.floor(e/24)}d ${e%24}h`:e?`${e}h ${String(s).padStart(2,"0")}m`:`${s}m`}function dt(r,t){if(!t)return;let e=new Date(t);if(Number.isNaN(e.getTime()))return;let s=r.locale?.language??r.language??navigator.language,i=e.toLocaleTimeString(s,{hour:"2-digit",minute:"2-digit"}),n=new Date;return e.toDateString()===n.toDateString()?i:`${e.toLocaleDateString(s,{weekday:"short"})} ${i}`}function C(r){return r===void 0?"\u2013":`${Math.round(r)}`}function Ot(r){return r&&r[0].toUpperCase()+r.slice(1)}function ne(r,t){let e=b(r,t.active)?.attributes,s=e?.next_tool,i=e?.ttg_map;if(!(typeof s!="number"||s<0||!i))return i[s]}function oe(r,t,e,s,i){let o=b(r,e.entity)?.attributes??{},l=o.present??void 0,a=o.material??void 0,h=[e.label,o.filament_name,a,o.vendor].filter(Boolean),m,u;if(t.kind==="happy_hare")m=e.id.replace("gate_","");else if(t.kind==="creality_cfs")m=l===!1?e.id.slice(-1):a??"?";else if(t.kind==="snapmaker_u1"){m=l===!1?"\u2013":a??"?";let v=o.nozzle_temperature;u=typeof v=="number"?`${Math.round(v)}\xB0`:void 0}else m=a??String(s+1);return{layout:e,present:l,active:!!o.active,next:t.kind==="happy_hare"&&i!==void 0&&e.id===`gate_${i}`,color:o.color,material:a,title:h.join(" \xB7 "),label:m,sub:u}}function ae(r){let t=["dot"];return r.present===!1?t.push("empty"):r.color||t.push(r.present?"nodata":"unknown"),r.active?t.push("active"):r.next&&t.push("next"),t.join(" ")}function le(r,t,e){let s=[e.name],i=f(r,e.temperature),n=f(r,e.humidity);return i!==void 0&&s.push(`${C(i)}\xB0`),n!==void 0&&s.push(`${Math.round(n)}% RH`),e.connected===!1&&s.push("not connected"),c`${s.join(" \xB7 ")}`}function ce(r,t){let e=b(r,t.active)?.attributes??{},s=g(r,t.active),i=g(r,t.status);if(t.kind==="happy_hare"){let n=[t.units.map(o=>o.name).join(" + ")||t.name];return typeof e.tool=="number"&&e.tool>=0&&s?n.push(`T${e.tool} on ${s.toLowerCase()}`):s&&n.push(s),typeof e.next_tool=="number"&&e.next_tool>=0&&n.push(`next T${e.next_tool}`),i&&n.push(i),n.join(" \xB7 ")}return t.kind==="snapmaker_u1"?["Toolheads",s?`${s.toLowerCase()} active`:void 0].filter(Boolean).join(" \xB7 "):[t.name,s?`${s} active`:void 0].filter(Boolean).join(" \xB7 ")}function pt(r,t,e){let s=t.kind==="happy_hare"?ne(r,t):void 0,i=o=>c`
    <div class="spools">
      ${o.slots.map((l,a)=>{let h=oe(r,t,l,a,s);return c`<div class="spool" title=${h.title} @click=${()=>l.entity&&e(l.entity)}>
          <div class=${ae(h)} style=${h.color&&h.present!==!1?`background:${h.color}`:""}>
            ${h.present&&!h.color?"?":p}
          </div>
          <span>${h.label}</span>
          ${h.sub?c`<span class="sub">${h.sub}</span>`:p}
        </div>`})}
    </div>
  `;if(t.kind==="creality_cfs"){let o=t.units.filter(l=>l.slots.length);return c`${o.map(l=>c`<div>
        <div class="section-title">${le(r,t,l)}</div>
        ${i(l)}
      </div>`)}`}let n={...t.units[0],slots:t.units.flatMap(o=>o.slots)};return c`<div>
    <div class="section-title">${ce(r,t)}</div>
    ${i(n)}
  </div>`}function Nt(r,t){let e=b(r,t.status)?.attributes?.error;return typeof e=="string"&&e?`${t.name}: ${e}`:void 0}function ht(r,t){for(let e of t){let s=b(r,e.active)?.attributes;if(s&&typeof s.num_toolchanges=="number"&&typeof s.total_toolchanges=="number"&&s.total_toolchanges>0)return`${s.num_toolchanges} of ${s.total_toolchanges} tool changes`}}var zt=Y`
  :host {
    --mp-accent: var(--primary-color, #03a9f4);
    --mp-warn: var(--warning-color, #ffa600);
    --mp-error: var(--error-color, #db4437);
    --mp-ok: var(--success-color, #43a047);
    --mp-muted: var(--secondary-text-color, #727272);
    --mp-line: var(--divider-color, rgba(0, 0, 0, 0.12));
    --mp-tile: var(--secondary-background-color, rgba(127, 127, 127, 0.08));
    --mp-radius: var(--ha-card-border-radius, 12px);
    display: block;
  }
  ha-card {
    overflow: hidden;
    height: 100%;
  }
  .body {
    padding: 14px 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .clickable {
    cursor: pointer;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .title {
    font-size: 1.05rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .subtitle {
    font-size: 0.75rem;
    color: var(--mp-muted);
  }
  .chip {
    font-size: 0.75rem;
    padding: 3px 10px;
    border-radius: 999px;
    white-space: nowrap;
    background: var(--mp-tile);
    color: var(--mp-muted);
  }
  .chip.printing {
    background: color-mix(in srgb, var(--mp-accent) 16%, transparent);
    color: var(--mp-accent);
  }
  .chip.paused {
    background: color-mix(in srgb, var(--mp-warn) 18%, transparent);
    color: var(--mp-warn);
  }
  .chip.error,
  .chip.offline {
    background: color-mix(in srgb, var(--mp-error) 16%, transparent);
    color: var(--mp-error);
  }
  .chip.complete {
    background: color-mix(in srgb, var(--mp-ok) 16%, transparent);
    color: var(--mp-ok);
  }

  /* job */
  .job {
    display: flex;
    gap: 14px;
    align-items: center;
  }
  .ring {
    flex: none;
  }
  .ring .track {
    stroke: var(--mp-line);
  }
  .ring .bar {
    stroke: var(--mp-accent);
    transition: stroke-dashoffset 0.6s ease;
  }
  .ring.paused .bar {
    stroke: var(--mp-warn);
  }
  .ring text {
    fill: var(--primary-text-color);
  }
  .ring .small {
    fill: var(--mp-muted);
  }
  .jobinfo {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    flex: 1;
    font-size: 0.8rem;
    color: var(--mp-muted);
  }
  .filename {
    color: var(--primary-text-color);
    font-size: 0.85rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .jobinfo ha-icon {
    --mdc-icon-size: 15px;
    vertical-align: -2px;
    margin-right: 2px;
  }
  .thumb {
    width: 64px;
    height: 64px;
    flex: none;
    border-radius: 8px;
    background: var(--mp-tile);
    object-fit: contain;
  }
  .progressbar {
    height: 6px;
    border-radius: 3px;
    background: var(--mp-line);
    overflow: hidden;
  }
  .progressbar > div {
    height: 100%;
    background: var(--mp-accent);
    transition: width 0.6s ease;
  }
  .progressbar.paused > div {
    background: var(--mp-warn);
  }
  .progresslabels {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: var(--mp-muted);
    margin-bottom: 6px;
  }
  .metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
    gap: 8px;
  }
  .metric {
    background: var(--mp-tile);
    border-radius: 8px;
    padding: 8px 10px;
  }
  .metric span {
    display: block;
    font-size: 0.7rem;
    color: var(--mp-muted);
  }
  .metric b {
    font-size: 1rem;
    font-weight: 500;
  }

  /* temperatures */
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .temp {
    font-size: 0.75rem;
    background: var(--mp-tile);
    border-radius: 8px;
    padding: 4px 8px;
    color: var(--mp-muted);
    white-space: nowrap;
  }
  .temp b {
    font-weight: 500;
    color: var(--primary-text-color);
  }
  .temp.heating b {
    color: var(--mp-warn);
  }
  .bars {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .barrow {
    display: grid;
    grid-template-columns: minmax(70px, 110px) 1fr auto;
    gap: 10px;
    align-items: center;
    font-size: 0.85rem;
  }
  .barrow .label {
    color: var(--mp-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .barrow .track {
    height: 6px;
    border-radius: 3px;
    background: var(--mp-line);
    overflow: hidden;
  }
  .barrow .fill {
    height: 100%;
    border-radius: 3px;
    background: #d85a30;
    transition: width 0.6s ease;
  }
  .barrow .fill.fan {
    background: var(--mp-accent);
  }
  .barrow .value {
    min-width: 76px;
    text-align: right;
    white-space: nowrap;
  }
  .barrow .value b {
    font-weight: 500;
  }
  .section-title {
    font-size: 0.7rem;
    color: var(--mp-muted);
    margin-bottom: 6px;
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  /* spools */
  .spools {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 10px;
  }
  .spool {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    font-size: 0.7rem;
    color: var(--mp-muted);
    min-width: 30px;
    cursor: pointer;
  }
  .spool .dot {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    box-sizing: border-box;
    border: 1px solid var(--mp-line);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    color: var(--mp-muted);
    position: relative;
  }
  .spool .dot:not(.empty):not(.unknown) {
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.22);
  }
  .spool .dot::after {
    content: "";
    position: absolute;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--card-background-color, #fff);
    opacity: 0.9;
  }
  .spool .dot.empty,
  .spool .dot.unknown {
    background: transparent;
    border: 1.5px dashed var(--mp-line);
  }
  .spool .dot.empty::after,
  .spool .dot.unknown::after,
  .spool .dot.nodata::after {
    display: none;
  }
  .spool .dot.nodata {
    background: var(--mp-tile);
  }
  .spool .dot.active {
    outline: 2px solid var(--mp-accent);
    outline-offset: 2px;
  }
  .spool .dot.next {
    outline: 1.5px dashed var(--mp-accent);
    outline-offset: 2px;
  }
  .spool .sub {
    color: var(--disabled-text-color, var(--mp-muted));
  }
  .full .spool .dot {
    width: 34px;
    height: 34px;
  }
  .full .spool {
    min-width: 46px;
  }

  /* banner + actions */
  .banner {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: 8px;
    font-size: 0.8rem;
    background: color-mix(in srgb, var(--mp-error) 14%, transparent);
    color: var(--mp-error);
  }
  .banner span {
    flex: 1;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .actions.divided {
    border-top: 1px solid var(--mp-line);
    padding-top: 12px;
  }
  button.act {
    font: inherit;
    font-size: 0.8rem;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 5px 12px;
    border-radius: 999px;
    border: 1px solid var(--mp-line);
    background: transparent;
    color: var(--primary-text-color);
    cursor: pointer;
  }
  button.act:hover {
    background: var(--mp-tile);
  }
  button.act.danger {
    color: var(--mp-error);
  }
  button.act.on {
    background: color-mix(in srgb, var(--mp-warn) 18%, transparent);
    border-color: transparent;
  }
  button.act ha-icon {
    --mdc-icon-size: 16px;
  }

  /* camera */
  .camera {
    position: relative;
    background: #000;
    aspect-ratio: 16 / 9;
    overflow: hidden;
  }
  .camera .media {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
  .camera .overlay {
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    pointer-events: none;
  }
  .camera .overlay > * {
    pointer-events: auto;
  }
  .camera .chip {
    background: var(--card-background-color, #fff);
  }
  .placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--mp-muted);
    height: 100%;
  }
  .empty-state {
    padding: 16px;
    color: var(--mp-muted);
  }
`;var Dt=new Set(["printing","paused"]),It={extruder:0,bed:1,chamber:2,other:3},Bt=r=>[...r].sort((t,e)=>It[t.role]-It[e.role]||t.label.localeCompare(e.label,void 0,{numeric:!0})),M=r=>r.replace(/\s*\([^)]*\)$/,""),L=class extends ${constructor(){super(...arguments);this._showThumb=!1}static getConfigElement(){return document.createElement("moonraker-plus-card-editor")}static async getStubConfig(e){try{return{device_id:(await I(e))[0]?.device_id??void 0,variant:"compact"}}catch{return{variant:"compact"}}}setConfig(e){if(!e)throw new Error("Invalid configuration");this._config={variant:"compact",...e},this._layout=void 0,this._loadingFor=void 0}getCardSize(){return this._config?.variant==="full"?10:5}getGridOptions(){return this._config?.variant==="full"?{columns:"full",min_columns:6}:{columns:12,min_columns:6}}willUpdate(e){if(!this.hass||!this._config)return;let s=this._config.device_id??"*";this._loadingFor!==s&&(this._loadingFor=s,I(this.hass).then(i=>{let n=this._config.device_id?i.find(o=>o.device_id===this._config.device_id):i[0];this._layout=n,this._error=n?void 0:"Printer not found. Pick a Moonraker Plus device in the card settings."}).catch(i=>{this._error=`Couldn't load printer layout: ${i?.message??i}`}))}_moreInfo(e){e&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}_navigate(){let e=this._config.navigation_path;if(!e){this._moreInfo(this._layout?.job.print_state);return}let s=e.startsWith("/")?e:`${location.pathname.split("/").slice(0,2).join("/")}/${e}`;history.pushState(null,"",s),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}))}_press(e,s){e&&(s&&!confirm(s)||this.hass.callService("button","press",{entity_id:e}))}_toggle(e){this.hass.callService("light","toggle",{entity_id:e})}_printState(){let e=g(this.hass,this._layout?.job.print_state),s=g(this.hass,this._layout?.job.klippy_state);return e===void 0?"offline":s&&s!=="ready"?"error":e}_chip(e){return c`<span class="chip ${e}">${{standby:"Idle",printing:"Printing",paused:"Paused",complete:"Done",cancelled:"Cancelled",error:"Error",offline:"Offline"}[e]??Ot(e)}</span>`}_ring(e,s,i,n=88){let l=2*Math.PI*38,a=l*(1-Math.min(Math.max(e,0),100)/100);return c`<svg class="ring ${i?"paused":""}" width=${n} height=${n} viewBox="0 0 92 92">
      <circle class="track" cx="46" cy="46" r=${38} fill="none" stroke-width="7"></circle>
      <circle class="bar" cx="46" cy="46" r=${38} fill="none" stroke-width="7" stroke-linecap="round"
        stroke-dasharray=${l} stroke-dashoffset=${a} transform="rotate(-90 46 46)"></circle>
      <text x="46" y=${s?45:51} text-anchor="middle" font-size="18" font-weight="500">${Math.round(e)}%</text>
      ${s?Ht`<text class="small" x="46" y="61" text-anchor="middle" font-size="11">${s}</text>`:p}
    </svg>`}_layerText(){let e=f(this.hass,this._layout.job.current_layer),s=f(this.hass,this._layout.job.total_layers);return e!==void 0&&s!==void 0?`${e} / ${s}`:void 0}_primaryHeaters(){let e=this._layout,s=e.materials.some(i=>i.kind==="snapmaker_u1");return Bt(e.heaters).filter(i=>i.role==="extruder"?!s:i.role!=="other")}_tempChips(){let e=this._layout,s=[];for(let i of this._primaryHeaters()){let n=f(this.hass,i.temperature),o=f(this.hass,i.target),l=o!==void 0&&o>0&&n!==void 0&&Math.abs(o-n)>3,a=i.role==="extruder"?i.label.replace("Extruder","Nozzle"):i.role==="bed"?"Bed":i.role==="chamber"?"Chamber":M(i.label);s.push(c`<span class="temp ${l?"heating":""}" @click=${()=>this._moreInfo(i.temperature)}>
        ${a} <b>${C(n)}</b>${o?c`/${C(o)}`:p}°</span>`)}if(!e.heaters.some(i=>i.role==="chamber")){let i=e.temperatures.find(n=>n.chamber);i&&s.push(c`<span class="temp" @click=${()=>this._moreInfo(i.temperature)}>
          ${M(i.label).replace(/ (Fan|Temp)$/,"")} <b>${C(f(this.hass,i.temperature))}</b>°</span>`)}return c`<div class="chips">${s}</div>`}_banner(){let e=this._layout,s=g(this.hass,e.job.klippy_state);if(s&&s!=="ready"){let o=b(this.hass,e.job.klippy_state)?.attributes?.state_message??`Klipper ${s}`;return c`<div class="banner"><ha-icon icon="mdi:alert-circle-outline"></ha-icon><span>${o}</span>
        ${e.buttons.firmware_restart&&g(this.hass,e.buttons.firmware_restart)!==void 0?c`<button class="act" @click=${()=>this._press(e.buttons.firmware_restart,"Restart the printer firmware?")}>Restart</button>`:p}</div>`}let i=e.materials.map(o=>Nt(this.hass,o)).filter(Boolean);if(this._printState()==="error"){let o=b(this.hass,e.job.print_state)?.attributes?.message;o&&i.unshift(o)}if(!i.length)return p;let n=g(this.hass,e.buttons.resume)!==void 0;return c`<div class="banner"><ha-icon icon="mdi:alert-circle-outline"></ha-icon><span>${i.join(" \xB7 ")}</span>
      ${n?c`<button class="act" @click=${()=>this._press(e.buttons.resume)}>Resume</button>`:p}</div>`}_actions(e){let s=this._layout,i=s.buttons,n=l=>l&&g(this.hass,l)!==void 0,o=[];n(i.pause)&&o.push(c`<button class="act" @click=${()=>this._press(i.pause)}><ha-icon icon="mdi:pause"></ha-icon>Pause</button>`),n(i.resume)&&o.push(c`<button class="act" @click=${()=>this._press(i.resume)}><ha-icon icon="mdi:play"></ha-icon>Resume</button>`),n(i.cancel)&&o.push(c`<button class="act danger" @click=${()=>this._press(i.cancel,`Cancel the print on ${s.title}?`)}>
        <ha-icon icon="mdi:stop"></ha-icon>Cancel</button>`);for(let l of e?s.lights:s.lights.slice(0,1)){let a=g(this.hass,l.entity)==="on";o.push(c`<button class="act ${a?"on":""}" title=${l.label} @click=${()=>this._toggle(l.entity)}>
        <ha-icon icon=${a?"mdi:lightbulb-on":"mdi:lightbulb-outline"}></ha-icon>${e?l.label:"Light"}</button>`)}if(e)for(let l of s.macros)o.push(c`<button class="act" @click=${()=>this._press(l.entity)}><ha-icon icon="mdi:script-text-play-outline"></ha-icon>
          ${l.name.replace(/_/g," ").toLowerCase()}</button>`);return o.length?c`<div class="actions ${e?"divided":""}">${o}</div>`:p}_thumb(){let e=this._layout?.thumbnail;if(!(!e||g(this.hass,e)===void 0))return b(this.hass,e)?.attributes?.entity_picture}_cameraTransform(e){let s=[];return e.rotation&&s.push(`rotate(${e.rotation}deg)`),e.flip_horizontal&&s.push("scaleX(-1)"),e.flip_vertical&&s.push("scaleY(-1)"),s.length?`transform:${s.join(" ")}`:""}_renderCompact(){let e=this._layout,s=this._printState(),i=Dt.has(s),n=this._thumb(),o=dt(this.hass,g(this.hass,e.job.print_eta)),l=ht(this.hass,e.materials);return c`<ha-card>
      <div class="body">
        <div class="header clickable" @click=${()=>this._navigate()}>
          <div style="min-width:0">
            <div class="title">${this._config.title??e.title}</div>
          </div>
          ${this._chip(s)}
        </div>
        ${this._banner()}
        ${i?c`<div class="job clickable" @click=${()=>this._navigate()}>
              ${this._ring(f(this.hass,e.job.print_progress)??0,this._layerText(),s==="paused")}
              <div class="jobinfo">
                <span class="filename">${g(this.hass,e.job.print_filename)??""}</span>
                <span><ha-icon icon="mdi:timer-sand"></ha-icon>${G(K(this.hass,e.job.print_time_left))} left${o?c` · done ${o}`:p}</span>
                ${l?c`<span><ha-icon icon="mdi:swap-horizontal"></ha-icon>${l}</span>`:p}
              </div>
              ${n?c`<img class="thumb" src=${n} alt="" />`:p}
            </div>`:p}
        ${this._tempChips()}
        ${e.materials.map(a=>pt(this.hass,a,h=>this._moreInfo(h)))}
        ${this._actions(!1)}
      </div>
    </ha-card>`}_renderCamera(){let s=this._layout.cameras[0],i=this._printState(),n=this._thumb(),o=s?this.hass.states[s.entity]:void 0;if(!s&&!n)return p;let l=this._showThumb||!o;return c`<div class="camera">
      ${l?n?c`<img class="media" src=${n} alt="Print thumbnail" style="background:var(--mp-tile)" />`:c`<div class="placeholder"><ha-icon icon="mdi:image-off-outline"></ha-icon></div>`:c`<ha-camera-stream class="media" style=${this._cameraTransform(s)} .hass=${this.hass}
            .stateObj=${o} muted allow-exoplayer></ha-camera-stream>`}
      <div class="overlay">
        ${this._chip(i)}
        ${s&&n?c`<button class="act" style="background:var(--card-background-color)" @click=${()=>this._showThumb=!this._showThumb}>
              <ha-icon icon=${l?"mdi:video-outline":"mdi:image-outline"}></ha-icon>${l?"Camera":"Thumbnail"}</button>`:p}
      </div>
    </div>`}_renderFull(){let e=this._layout,s=this._printState(),i=Dt.has(s),n=f(this.hass,e.job.print_progress)??0,o=dt(this.hass,g(this.hass,e.job.print_eta)),l=this._layerText(),a=ht(this.hass,e.materials),h=e.fans.find(d=>d.part),m=f(this.hass,e.job.filament_used),u=e.cameras.length>0||!!this._thumb(),v=[...Bt(e.heaters).map(d=>({label:M(d.label),t:f(this.hass,d.temperature),target:f(this.hass,d.target),id:d.temperature,max:d.role==="bed"?120:d.role==="chamber"?80:300})),...e.temperatures.filter(d=>!d.system).map(d=>({label:M(d.label),t:f(this.hass,d.temperature),target:f(this.hass,d.target),id:d.temperature,max:80}))].filter(d=>d.t!==void 0),_=e.temperatures.filter(d=>d.system&&f(this.hass,d.temperature)!==void 0),x=e.fans.map(d=>({label:M(d.label),v:f(this.hass,d.speed),id:d.speed,part:d.part})).filter(d=>d.v!==void 0),ft=x.filter(d=>(d.v??0)>0||d.part),gt=x.length-ft.length;return c`<ha-card class="full">
      ${this._renderCamera()}
      <div class="body full">
        <div class="header">
          <div style="min-width:0">
            <div class="title">${this._config.title??e.title}</div>
            ${i?c`<div class="subtitle">${g(this.hass,e.job.print_filename)??""}</div>`:p}
          </div>
          ${u?p:this._chip(s)}
        </div>
        ${this._banner()}
        ${i?c`<div>
                <div class="progresslabels"><span>${Math.round(n)}%${l?` \xB7 layer ${l.replace(" / "," of ")}`:""}</span>
                  <span>${o?`done at ${o}`:""}</span></div>
                <div class="progressbar ${s==="paused"?"paused":""}"><div style="width:${n}%"></div></div>
              </div>
              <div class="metrics">
                <div class="metric"><span>Time left</span><b>${G(K(this.hass,e.job.print_time_left))}</b></div>
                <div class="metric"><span>Printing for</span><b>${G(K(this.hass,e.job.print_duration))}</b></div>
                ${m!==void 0?c`<div class="metric"><span>Filament</span><b>${m.toFixed(1)} m</b></div>`:p}
                ${h?c`<div class="metric"><span>Part fan</span><b>${Math.round(f(this.hass,h.speed)??0)}%</b></div>`:p}
                ${a?c`<div class="metric"><span>Tool changes</span><b>${a.split(" tool")[0]}</b></div>`:p}
              </div>`:p}
        <div class="bars">
          ${v.map(d=>c`<div class="barrow clickable" @click=${()=>this._moreInfo(d.id)}>
              <span class="label">${d.label}</span>
              <div class="track"><div class="fill" style="width:${Math.min(100,(d.t??0)/d.max*100)}%"></div></div>
              <span class="value"><b>${(d.t??0).toFixed(1)}</b>${d.target?` / ${Math.round(d.target)}\xB0`:"\xB0"}</span>
            </div>`)}
        </div>
        ${e.materials.map(d=>pt(this.hass,d,Ft=>this._moreInfo(Ft)))}
        ${_.length?c`<div>
              <div class="section-title">System</div>
              <div class="chips">${_.map(d=>c`<span class="temp clickable" @click=${()=>this._moreInfo(d.temperature)}>${M(d.label)} <b>${C(f(this.hass,d.temperature))}</b>°</span>`)}</div>
            </div>`:p}
        ${x.length?c`<div>
              <div class="section-title">Fans${gt?c` · ${gt} idle`:p}</div>
              <div class="bars">
                ${ft.map(d=>c`<div class="barrow clickable" @click=${()=>this._moreInfo(d.id)}>
                    <span class="label">${d.label}</span>
                    <div class="track"><div class="fill fan" style="width:${d.v}%"></div></div>
                    <span class="value"><b>${Math.round(d.v??0)}</b>%</span>
                  </div>`)}
              </div>
            </div>`:p}
        ${this._actions(!0)}
      </div>
    </ha-card>`}render(){return!this._config||!this.hass?p:this._error?c`<ha-card><div class="empty-state">${this._error}</div></ha-card>`:this._layout?this._config.variant==="full"?this._renderFull():this._renderCompact():c`<ha-card><div class="empty-state">Loading printer…</div></ha-card>`}};L.styles=zt,L.properties={hass:{attribute:!1},_config:{state:!0},_layout:{state:!0},_error:{state:!0},_showThumb:{state:!0}};var de=[{name:"device_id",selector:{device:{integration:"moonraker_plus"}}},{name:"variant",selector:{select:{mode:"box",options:[{value:"compact",label:"Compact"},{value:"full",label:"Full (camera, all sensors)"}]}}},{name:"title",selector:{text:{}}},{name:"navigation_path",selector:{navigation:{}}}],pe={device_id:"Printer",variant:"Layout",title:"Title (optional)",navigation_path:"Open on tap (optional)"},B=class extends ${setConfig(t){this._config=t}_changed(t){let e={...this._config,...t.detail.value};for(let s of Object.keys(e))(e[s]===""||e[s]===void 0)&&delete e[s];this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}render(){return!this.hass||!this._config?p:c`<ha-form
      .hass=${this.hass}
      .data=${{variant:"compact",...this._config}}
      .schema=${de}
      .computeLabel=${t=>pe[t.name]??t.name}
      @value-changed=${this._changed}
    ></ha-form>`}};B.properties={hass:{attribute:!1},_config:{state:!0}};var J=class extends HTMLElement{static async generate(t,e){let s=await I(e,!0),i=new Set(["printers"]),n=s.map(a=>{let h=Ut(a.title);for(;i.has(h);)h+="-2";return i.add(h),h}),o={title:"Printers",path:"printers",icon:"mdi:printer-3d",type:"sections",max_columns:4,sections:s.length?s.map((a,h)=>({type:"grid",cards:[{type:"custom:moonraker-plus-card",device_id:a.device_id,variant:"compact",navigation_path:n[h],grid_options:{columns:"full"}}]})):[{type:"grid",cards:[{type:"markdown",content:"No Moonraker Plus printers yet. Add one under Settings \u2192 Devices and services."}]}]},l=s.map((a,h)=>({title:a.title,path:n[h],subview:!0,back_path:"printers",type:"sections",max_columns:2,sections:[{type:"grid",column_span:2,cards:[{type:"custom:moonraker-plus-card",device_id:a.device_id,variant:"full",grid_options:{columns:"full"}}]}]}));return{title:t.title??"3D printers",views:[o,...l]}}};var mt=(r,t)=>{customElements.get(r)||customElements.define(r,t)};mt("moonraker-plus-card",L);mt("moonraker-plus-card-editor",B);mt("ll-strategy-dashboard-moonraker-plus",J);var ut=window;ut.customCards=ut.customCards??[];ut.customCards.push({type:"moonraker-plus-card",name:"Moonraker Plus printer",description:"3D printer status with job progress, temperatures, and MMU/CFS/toolhead filament slots.",preview:!0,documentationURL:"https://github.com/marcelolcosta/moonraker-plus"});console.info("%c MOONRAKER-PLUS-CARD %c loaded ","background:#378ADD;color:#fff;border-radius:3px 0 0 3px","");
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
