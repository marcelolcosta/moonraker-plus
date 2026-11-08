var B=globalThis,F=B.ShadowRoot&&(B.ShadyCSS===void 0||B.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,X=Symbol(),vt=new WeakMap,H=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==X)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(F&&e===void 0){let i=t!==void 0&&t.length===1;i&&(e=vt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&vt.set(t,e))}return e}toString(){return this.cssText}},_t=r=>new H(typeof r=="string"?r:r+"",void 0,X),Z=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((i,s,n)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[n+1],r[0]);return new H(t,r,X)},$t=(r,e)=>{if(F)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let i=document.createElement("style"),s=B.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=t.cssText,r.appendChild(i)}},Q=F?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let i of e.cssRules)t+=i.cssText;return _t(t)})(r):r;var{is:qt,defineProperty:Kt,getOwnPropertyDescriptor:Gt,getOwnPropertyNames:Jt,getOwnPropertySymbols:Yt,getPrototypeOf:Xt}=Object,V=globalThis,yt=V.trustedTypes,Zt=yt?yt.emptyScript:"",Qt=V.reactiveElementPolyfillSupport,L=(r,e)=>r,tt={toAttribute(r,e){switch(e){case Boolean:r=r?Zt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},wt=(r,e)=>!qt(r,e),xt={attribute:!0,type:String,converter:tt,reflect:!1,useDefault:!1,hasChanged:wt};Symbol.metadata??=Symbol("metadata"),V.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=xt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(e,i,t);s!==void 0&&Kt(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){let{get:s,set:n}=Gt(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:s,set(o){let c=s?.call(this);n?.call(this,o),this.requestUpdate(e,c,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??xt}static _$Ei(){if(this.hasOwnProperty(L("elementProperties")))return;let e=Xt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(L("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(L("properties"))){let t=this.properties,i=[...Jt(t),...Yt(t)];for(let s of i)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[i,s]of t)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let s=this._$Eu(t,i);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let s of i)t.unshift(Q(s))}else e!==void 0&&t.push(Q(e));return t}static _$Eu(e,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return $t(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){let i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(s!==void 0&&i.reflect===!0){let n=(i.converter?.toAttribute!==void 0?i.converter:tt).toAttribute(t,i.type);this._$Em=e,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(e,t){let i=this.constructor,s=i._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let n=i.getPropertyOptions(s),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:tt;this._$Em=s;let c=o.fromAttribute(t,n.type);this[s]=c??this._$Ej?.get(s)??c,this._$Em=null}}requestUpdate(e,t,i,s=!1,n){if(e!==void 0){let o=this.constructor;if(s===!1&&(n=this[e]),i??=o.getPropertyOptions(e),!((i.hasChanged??wt)(n,t)||i.useDefault&&i.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),n!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,n]of i){let{wrapped:o}=n,c=this[s];o!==!0||this._$AL.has(s)||c===void 0||this.C(s,void 0,n,c)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[L("elementProperties")]=new Map,y[L("finalized")]=new Map,Qt?.({ReactiveElement:y}),(V.reactiveElementVersions??=[]).push("2.1.2");var at=globalThis,At=r=>r,W=at.trustedTypes,St=W?W.createPolicy("lit-html",{createHTML:r=>r}):void 0,Mt="$lit$",w=`lit$${Math.random().toFixed(9).slice(2)}$`,Ht="?"+w,te=`<${Ht}>`,k=document,j=()=>k.createComment(""),O=r=>r===null||typeof r!="object"&&typeof r!="function",lt=Array.isArray,ee=r=>lt(r)||typeof r?.[Symbol.iterator]=="function",et=`[ 	
\f\r]`,R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,kt=/-->/g,Et=/>/g,A=RegExp(`>|${et}(?:([^\\s"'>=/]+)(${et}*=${et}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ct=/'/g,Tt=/"/g,Lt=/^(?:script|style|textarea|title)$/i,ct=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),d=ct(1),Rt=ct(2),_e=ct(3),E=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Pt=new WeakMap,S=k.createTreeWalker(k,129);function jt(r,e){if(!lt(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return St!==void 0?St.createHTML(e):e}var ie=(r,e)=>{let t=r.length-1,i=[],s,n=e===2?"<svg>":e===3?"<math>":"",o=R;for(let c=0;c<t;c++){let l=r[c],h,m,u=-1,g=0;for(;g<l.length&&(o.lastIndex=g,m=o.exec(l),m!==null);)g=o.lastIndex,o===R?m[1]==="!--"?o=kt:m[1]!==void 0?o=Et:m[2]!==void 0?(Lt.test(m[2])&&(s=RegExp("</"+m[2],"g")),o=A):m[3]!==void 0&&(o=A):o===A?m[0]===">"?(o=s??R,u=-1):m[1]===void 0?u=-2:(u=o.lastIndex-m[2].length,h=m[1],o=m[3]===void 0?A:m[3]==='"'?Tt:Ct):o===Tt||o===Ct?o=A:o===kt||o===Et?o=R:(o=A,s=void 0);let _=o===A&&r[c+1].startsWith("/>")?" ":"";n+=o===R?l+te:u>=0?(i.push(h),l.slice(0,u)+Mt+l.slice(u)+w+_):l+w+(u===-2?c:_)}return[jt(r,n+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},U=class r{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let n=0,o=0,c=e.length-1,l=this.parts,[h,m]=ie(e,t);if(this.el=r.createElement(h,i),S.currentNode=this.el.content,t===2||t===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=S.nextNode())!==null&&l.length<c;){if(s.nodeType===1){if(s.hasAttributes())for(let u of s.getAttributeNames())if(u.endsWith(Mt)){let g=m[o++],_=s.getAttribute(u).split(w),x=/([.?@])?(.*)/.exec(g);l.push({type:1,index:n,name:x[2],strings:_,ctor:x[1]==="."?st:x[1]==="?"?rt:x[1]==="@"?nt:T}),s.removeAttribute(u)}else u.startsWith(w)&&(l.push({type:6,index:n}),s.removeAttribute(u));if(Lt.test(s.tagName)){let u=s.textContent.split(w),g=u.length-1;if(g>0){s.textContent=W?W.emptyScript:"";for(let _=0;_<g;_++)s.append(u[_],j()),S.nextNode(),l.push({type:2,index:++n});s.append(u[g],j())}}}else if(s.nodeType===8)if(s.data===Ht)l.push({type:2,index:n});else{let u=-1;for(;(u=s.data.indexOf(w,u+1))!==-1;)l.push({type:7,index:n}),u+=w.length-1}n++}}static createElement(e,t){let i=k.createElement("template");return i.innerHTML=e,i}};function C(r,e,t=r,i){if(e===E)return e;let s=i!==void 0?t._$Co?.[i]:t._$Cl,n=O(e)?void 0:e._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(r),s._$AT(r,t,i)),i!==void 0?(t._$Co??=[])[i]=s:t._$Cl=s),s!==void 0&&(e=C(r,s._$AS(r,e.values),s,i)),e}var it=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??k).importNode(t,!0);S.currentNode=s;let n=S.nextNode(),o=0,c=0,l=i[0];for(;l!==void 0;){if(o===l.index){let h;l.type===2?h=new N(n,n.nextSibling,this,e):l.type===1?h=new l.ctor(n,l.name,l.strings,this,e):l.type===6&&(h=new ot(n,this,e)),this._$AV.push(h),l=i[++c]}o!==l?.index&&(n=S.nextNode(),o++)}return S.currentNode=k,s}p(e){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},N=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=C(this,e,t),O(e)?e===p||e==null||e===""?(this._$AH!==p&&this._$AR(),this._$AH=p):e!==this._$AH&&e!==E&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):ee(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==p&&O(this._$AH)?this._$AA.nextSibling.data=e:this.T(k.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:i}=e,s=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=U.createElement(jt(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{let n=new it(s,this),o=n.u(this.options);n.p(t),this.T(o),this._$AH=n}}_$AC(e){let t=Pt.get(e.strings);return t===void 0&&Pt.set(e.strings,t=new U(e)),t}k(e){lt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,s=0;for(let n of e)s===t.length?t.push(i=new r(this.O(j()),this.O(j()),this,this.options)):i=t[s],i._$AI(n),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let i=At(e).nextSibling;At(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},T=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,n){this.type=1,this._$AH=p,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=p}_$AI(e,t=this,i,s){let n=this.strings,o=!1;if(n===void 0)e=C(this,e,t,0),o=!O(e)||e!==this._$AH&&e!==E,o&&(this._$AH=e);else{let c=e,l,h;for(e=n[0],l=0;l<n.length-1;l++)h=C(this,c[i+l],t,l),h===E&&(h=this._$AH[l]),o||=!O(h)||h!==this._$AH[l],h===p?e=p:e!==p&&(e+=(h??"")+n[l+1]),this._$AH[l]=h}o&&!s&&this.j(e)}j(e){e===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},st=class extends T{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===p?void 0:e}},rt=class extends T{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==p)}},nt=class extends T{constructor(e,t,i,s,n){super(e,t,i,s,n),this.type=5}_$AI(e,t=this){if((e=C(this,e,t,0)??p)===E)return;let i=this._$AH,s=e===p&&i!==p||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,n=e!==p&&(i===p||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},ot=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){C(this,e)}};var se=at.litHtmlPolyfillSupport;se?.(U,N),(at.litHtmlVersions??=[]).push("3.3.3");var Ot=(r,e,t)=>{let i=t?.renderBefore??e,s=i._$litPart$;if(s===void 0){let n=t?.renderBefore??null;i._$litPart$=s=new N(e.insertBefore(j(),n),n,void 0,t??{})}return s._$AI(r),s};var dt=globalThis,$=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ot(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return E}};$._$litElement$=!0,$.finalized=!0,dt.litElementHydrateSupport?.({LitElement:$});var re=dt.litElementPolyfillSupport;re?.({LitElement:$});(dt.litElementVersions??=[]).push("4.2.2");var z=null;function D(r,e=!1){if(!e&&z&&Date.now()-z.at<6e4)return z.promise;let t=r.connection.sendMessagePromise({type:"moonraker_plus/printers"}).then(i=>i.printers);return z={at:Date.now(),promise:t},t.catch(()=>{z=null}),t}function Ut(r){return r.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"printer"}var ne=new Set(["unavailable","unknown","","none"]);function b(r,e){return e?r.states[e]:void 0}function v(r,e){let t=b(r,e)?.state;return t===void 0||ne.has(t)?void 0:t}function q(r,e){let t=b(r,e);return t!==void 0&&t.state!=="unavailable"}function f(r,e){let t=v(r,e);if(t===void 0)return;let i=Number(t);return Number.isFinite(i)?i:void 0}var oe={s:1,min:60,h:3600,d:86400};function K(r,e){let t=f(r,e);if(t===void 0)return;let i=b(r,e)?.attributes.unit_of_measurement??"s";return t*(oe[i]??1)}function G(r){if(r===void 0)return"\u2013";let e=Math.max(0,Math.round(r/60)),t=Math.floor(e/60),i=e%60;return t>=24?`${Math.floor(t/24)}d ${t%24}h`:t?`${t}h ${String(i).padStart(2,"0")}m`:`${i}m`}function pt(r,e){if(!e)return;let t=new Date(e);if(Number.isNaN(t.getTime()))return;let i=r.locale?.language??r.language??navigator.language,s=t.toLocaleTimeString(i,{hour:"2-digit",minute:"2-digit"}),n=new Date;return t.toDateString()===n.toDateString()?s:`${t.toLocaleDateString(i,{weekday:"short"})} ${s}`}function P(r){return r===void 0?"\u2013":`${Math.round(r)}`}function Nt(r){return r&&r[0].toUpperCase()+r.slice(1)}function ae(r,e){let t=b(r,e.active)?.attributes,i=t?.next_tool,s=t?.ttg_map;if(!(typeof i!="number"||i<0||!s))return s[i]}function le(r,e,t,i,s){let o=b(r,t.entity)?.attributes??{},c=o.present??void 0,l=o.material??void 0,h=[t.label,o.filament_name,l,o.vendor].filter(Boolean),m,u;if(e.kind==="happy_hare")m=t.id.replace("gate_","");else if(e.kind==="creality_cfs")m=c===!1?t.id.slice(-1):l??"?";else if(e.kind==="snapmaker_u1"){m=c===!1?"\u2013":l??"?";let g=o.nozzle_temperature;u=typeof g=="number"?`${Math.round(g)}\xB0`:void 0}else m=l??String(i+1);return{layout:t,present:c,active:!!o.active,next:e.kind==="happy_hare"&&s!==void 0&&t.id===`gate_${s}`,color:o.color,material:l,title:h.join(" \xB7 "),label:m,sub:u}}function ce(r){let e=["dot"];return r.present===!1?e.push("empty"):r.color||e.push(r.present?"nodata":"unknown"),r.active?e.push("active"):r.next&&e.push("next"),e.join(" ")}function de(r,e,t){let i=[t.name],s=f(r,t.temperature),n=f(r,t.humidity);return s!==void 0&&i.push(`${P(s)}\xB0`),n!==void 0&&i.push(`${Math.round(n)}% RH`),t.connected===!1&&i.push("not connected"),d`${i.join(" \xB7 ")}`}function pe(r,e){let t=b(r,e.active)?.attributes??{},i=v(r,e.active),s=v(r,e.status);if(e.kind==="happy_hare"){let n=[e.units.map(o=>o.name).join(" + ")||e.name];return typeof t.tool=="number"&&t.tool>=0&&i?n.push(`T${t.tool} on ${i.toLowerCase()}`):i&&n.push(i),typeof t.next_tool=="number"&&t.next_tool>=0&&n.push(`next T${t.next_tool}`),s&&n.push(s),n.join(" \xB7 ")}return e.kind==="snapmaker_u1"?["Toolheads",i?`${i.toLowerCase()} active`:void 0].filter(Boolean).join(" \xB7 "):[e.name,i?`${i} active`:void 0].filter(Boolean).join(" \xB7 ")}function ht(r,e,t){let i=e.kind==="happy_hare"?ae(r,e):void 0,s=o=>d`
    <div class="spools">
      ${o.slots.map((c,l)=>{let h=le(r,e,c,l,i);return d`<div class="spool" title=${h.title} @click=${()=>c.entity&&t(c.entity)}>
          <div class=${ce(h)} style=${h.color&&h.present!==!1?`background:${h.color}`:""}>
            ${h.present&&!h.color?"?":p}
          </div>
          <span>${h.label}</span>
          ${h.sub?d`<span class="sub">${h.sub}</span>`:p}
        </div>`})}
    </div>
  `;if(e.kind==="creality_cfs"){let o=e.units.filter(c=>c.slots.length);return d`${o.map(c=>d`<div>
        <div class="section-title">${de(r,e,c)}</div>
        ${s(c)}
      </div>`)}`}let n={...e.units[0],slots:e.units.flatMap(o=>o.slots)};return d`<div>
    <div class="section-title">${pe(r,e)}</div>
    ${s(n)}
  </div>`}function zt(r,e){let t=b(r,e.status)?.attributes?.error;return typeof t=="string"&&t?`${e.name}: ${t}`:void 0}function ut(r,e){for(let t of e){let i=b(r,t.active)?.attributes;if(i&&typeof i.num_toolchanges=="number"&&typeof i.total_toolchanges=="number"&&i.total_toolchanges>0)return`${i.num_toolchanges} of ${i.total_toolchanges} tool changes`}}var Dt=Z`
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

  /* controls */
  .temp.settable,
  .barrow.settable .value {
    cursor: pointer;
  }
  .temp.settable {
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--mp-accent) 35%, transparent);
  }
  .temp.editing,
  .barrow.editing {
    box-shadow: inset 0 0 0 1.5px var(--mp-accent);
    border-radius: 8px;
  }
  .barrow .pen {
    --mdc-icon-size: 14px;
    color: var(--mp-muted);
    vertical-align: -2px;
  }
  .editor {
    border: 1px solid var(--mp-line);
    border-radius: 10px;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: var(--mp-tile);
  }
  .editor-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
    font-weight: 500;
  }
  button.icon {
    border: none;
    background: transparent;
    color: var(--mp-muted);
    cursor: pointer;
    padding: 2px;
    display: inline-flex;
  }
  button.icon ha-icon {
    --mdc-icon-size: 18px;
  }
  .presets {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .editor-input {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
  }
  .editor-input input {
    width: 80px;
    font: inherit;
    padding: 5px 8px;
    border-radius: 8px;
    border: 1px solid var(--mp-line);
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color);
  }
  .editor-input .unit {
    flex: 1;
    font-size: 0.75rem;
    color: var(--mp-muted);
  }
  button.act.primary {
    background: var(--mp-accent);
    border-color: var(--mp-accent);
    color: #fff;
  }
  button.act.estop {
    color: #fff;
    background: var(--mp-error);
    border-color: var(--mp-error);
    font-weight: 500;
  }
  button.act.estop:hover {
    background: color-mix(in srgb, var(--mp-error) 85%, #000);
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
`;var It=new Set(["printing","paused"]),Bt={extruder:[0,200,215,230,250],bed:[0,55,60,70,85,100],chamber:[0,35,45,55,65],other:[0,40,60]},he=[0,25,50,75,100],Ft={extruder:0,bed:1,chamber:2,other:3},Vt=r=>[...r].sort((e,t)=>Ft[e.role]-Ft[t.role]||e.label.localeCompare(t.label,void 0,{numeric:!0})),J=r=>r.replace(/\s*\([^)]*\)$/,""),M=class extends ${constructor(){super(...arguments);this._showThumb=!1}static getConfigElement(){return document.createElement("moonraker-plus-card-editor")}static async getStubConfig(t){try{return{device_id:(await D(t))[0]?.device_id??void 0,variant:"compact"}}catch{return{variant:"compact"}}}setConfig(t){if(!t)throw new Error("Invalid configuration");this._config={variant:"compact",...t},this._layout=void 0,this._loadingFor=void 0}getCardSize(){return this._config?.variant==="full"?10:5}getGridOptions(){return this._config?.variant==="full"?{columns:"full",min_columns:6}:{columns:12,min_columns:6}}willUpdate(t){if(!this.hass||!this._config)return;let i=this._config.device_id??"*";this._loadingFor!==i&&(this._loadingFor=i,D(this.hass).then(s=>{let n=this._config.device_id?s.find(o=>o.device_id===this._config.device_id):s[0];this._layout=n,this._error=n?void 0:"Printer not found. Pick a Moonraker Plus device in the card settings."}).catch(s=>{this._error=`Couldn't load printer layout: ${s?.message??s}`}))}_moreInfo(t){t&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0}))}_navigate(){let t=this._config.navigation_path;if(!t){this._moreInfo(this._layout?.job.print_state);return}let i=t.startsWith("/")?t:`${location.pathname.split("/").slice(0,2).join("/")}/${t}`;history.pushState(null,"",i),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}))}_press(t,i){t&&(i&&!confirm(i)||this.hass.callService("button","press",{entity_id:t}))}_toggle(t){this.hass.callService("light","toggle",{entity_id:t})}_printState(){let t=v(this.hass,this._layout?.job.print_state),i=v(this.hass,this._layout?.job.klippy_state);return t===void 0?"offline":i&&i!=="ready"?"error":t}_chip(t){return d`<span class="chip ${t}">${{standby:"Idle",printing:"Printing",paused:"Paused",complete:"Done",cancelled:"Cancelled",error:"Error",offline:"Offline"}[t]??Nt(t)}</span>`}_ring(t,i,s,n=88){let c=2*Math.PI*38,l=c*(1-Math.min(Math.max(t,0),100)/100);return d`<svg class="ring ${s?"paused":""}" width=${n} height=${n} viewBox="0 0 92 92">
      <circle class="track" cx="46" cy="46" r=${38} fill="none" stroke-width="7"></circle>
      <circle class="bar" cx="46" cy="46" r=${38} fill="none" stroke-width="7" stroke-linecap="round"
        stroke-dasharray=${c} stroke-dashoffset=${l} transform="rotate(-90 46 46)"></circle>
      <text x="46" y=${i?45:51} text-anchor="middle" font-size="18" font-weight="500">${Math.round(t)}%</text>
      ${i?Rt`<text class="small" x="46" y="61" text-anchor="middle" font-size="11">${i}</text>`:p}
    </svg>`}_layerText(){let t=f(this.hass,this._layout.job.current_layer),i=f(this.hass,this._layout.job.total_layers);return t!==void 0&&i!==void 0?`${t} / ${i}`:void 0}_primaryHeaters(){let t=this._layout,i=t.materials.some(s=>s.kind==="snapmaker_u1");return Vt(t.heaters).filter(s=>s.role==="extruder"?!i:s.role!=="other")}_tempChips(){let t=[],i=(n,o,c,l,h)=>{let m=f(this.hass,o),u=f(this.hass,c)??f(this.hass,l),g=u!==void 0&&u>0&&m!==void 0&&Math.abs(u-m)>3,_=this._editor?.entity===l&&l;t.push(d`<span class="temp ${g?"heating":""} ${l?"settable":""} ${_?"editing":""}"
        title=${l?`Set ${n} temperature`:n}
        @click=${()=>l?this._openTemp(n,l,h):this._moreInfo(o)}>
        ${n} <b>${P(m)}</b>${u?d`/${P(u)}`:p}°</span>`)};for(let n of this._primaryHeaters().filter(o=>o.role!=="chamber")){let o=n.role==="extruder"?n.label.replace("Extruder","Nozzle"):"Bed";i(o,n.temperature,n.target,n.control,n.role)}let s=this._chamber();return s&&i(s.label,s.temperature,s.target,s.control,"chamber"),d`<div class="chips">${t}</div>`}_openTemp(t,i,s){if(!i)return;let n=b(this.hass,i),o=Number(n?.attributes?.max??300),c=f(this.hass,i);this._editor={kind:"temp",entity:i,label:t,max:o,presets:(Bt[s]??Bt.other).filter(l=>l<=o),value:c!==void 0?String(Math.round(c)):""}}_openFan(t,i){if(!i)return;let s=b(this.hass,i)?.attributes?.percentage;this._editor={kind:"fan",entity:i,label:t,max:100,presets:he,value:s!=null?String(s):""}}_apply(t){let i=this._editor;if(!i||!Number.isFinite(t))return;let s=Math.min(Math.max(Math.round(t),0),i.max);i.kind==="temp"?this.hass.callService("number","set_value",{entity_id:i.entity,value:s}):this.hass.callService("fan","set_percentage",{entity_id:i.entity,percentage:s}),this._editor=void 0}_renderEditor(){let t=this._editor;if(!t)return p;let i=t.kind==="temp"?"\xB0C":"%",s=n=>n===0?"Off":`${n}${t.kind==="temp"?"\xB0":"%"}`;return d`<div class="editor">
      <div class="editor-head">
        <span>${t.kind==="temp"?"Set":"Speed"} · ${t.label}</span>
        <button class="icon" title="Close" @click=${()=>this._editor=void 0}><ha-icon icon="mdi:close"></ha-icon></button>
      </div>
      <div class="presets">
        ${t.presets.map(n=>d`<button class="act" @click=${()=>this._apply(n)}>${s(n)}</button>`)}
      </div>
      <form class="editor-input" @submit=${n=>{n.preventDefault(),this._apply(Number(n.target.elements.namedItem("v").value))}}>
        <input name="v" type="number" inputmode="numeric" min="0" max=${t.max} step="1" .value=${t.value} />
        <span class="unit">${i} (max ${t.max})</span>
        <button class="act primary" type="submit">Set</button>
      </form>
    </div>`}_chamber(){let t=this._layout,i=t.heaters.find(o=>o.role==="chamber");if(i)return{label:"Chamber",temperature:i.temperature,target:i.target,control:i.control};let s=t.temperatures.filter(o=>o.chamber),n=s.find(o=>o.control)??s[0];return n?{label:"Chamber",temperature:n.temperature,target:n.target,control:n.control}:void 0}_banner(){let t=this._layout,i=v(this.hass,t.job.klippy_state);if(i&&i!=="ready"){let o=b(this.hass,t.job.klippy_state)?.attributes?.state_message??`Klipper ${i}`;return d`<div class="banner"><ha-icon icon="mdi:alert-circle-outline"></ha-icon><span>${o}</span>
        ${q(this.hass,t.buttons.firmware_restart)?d`<button class="act" @click=${()=>this._press(t.buttons.firmware_restart,"Restart the printer firmware?")}>Restart</button>`:p}</div>`}let s=t.materials.map(o=>zt(this.hass,o)).filter(Boolean);if(this._printState()==="error"){let o=b(this.hass,t.job.print_state)?.attributes?.message;o&&s.unshift(o)}if(!s.length)return p;let n=q(this.hass,t.buttons.resume);return d`<div class="banner"><ha-icon icon="mdi:alert-circle-outline"></ha-icon><span>${s.join(" \xB7 ")}</span>
      ${n?d`<button class="act" @click=${()=>this._press(t.buttons.resume)}>Resume</button>`:p}</div>`}_actions(t){let i=this._layout,s=i.buttons,n=c=>q(this.hass,c),o=[];n(s.pause)&&o.push(d`<button class="act" @click=${()=>this._press(s.pause)}><ha-icon icon="mdi:pause"></ha-icon>Pause</button>`),n(s.resume)&&o.push(d`<button class="act" @click=${()=>this._press(s.resume)}><ha-icon icon="mdi:play"></ha-icon>Resume</button>`),n(s.cancel)&&o.push(d`<button class="act danger" @click=${()=>this._press(s.cancel,`Cancel the print on ${i.title}?`)}>
        <ha-icon icon="mdi:stop"></ha-icon>Cancel</button>`),n(s.emergency_stop)&&o.push(d`<button class="act estop" title="Emergency stop"
        @click=${()=>this._press(s.emergency_stop,`EMERGENCY STOP ${i.title}?

This halts the printer immediately (heaters and motors off). Klipper needs a firmware restart afterwards.`)}>
        <ha-icon icon="mdi:alert-octagon"></ha-icon>${t?"Emergency stop":"E-stop"}</button>`);for(let c of t?i.lights:i.lights.slice(0,1)){let l=v(this.hass,c.entity)==="on";o.push(d`<button class="act ${l?"on":""}" title=${c.label} @click=${()=>this._toggle(c.entity)}>
        <ha-icon icon=${l?"mdi:lightbulb-on":"mdi:lightbulb-outline"}></ha-icon>${t?c.label:"Light"}</button>`)}if(t)for(let c of i.macros)o.push(d`<button class="act" @click=${()=>this._press(c.entity)}><ha-icon icon="mdi:script-text-play-outline"></ha-icon>
          ${c.name.replace(/_/g," ").toLowerCase()}</button>`);return o.length?d`<div class="actions ${t?"divided":""}">${o}</div>`:p}_thumb(){let t=this._layout?.thumbnail;if(!(!t||v(this.hass,t)===void 0))return b(this.hass,t)?.attributes?.entity_picture}_cameraTransform(t){let i=[];return t.rotation&&i.push(`rotate(${t.rotation}deg)`),t.flip_horizontal&&i.push("scaleX(-1)"),t.flip_vertical&&i.push("scaleY(-1)"),i.length?`transform:${i.join(" ")}`:""}_renderCompact(){let t=this._layout,i=this._printState(),s=It.has(i),n=this._thumb(),o=pt(this.hass,v(this.hass,t.job.print_eta)),c=ut(this.hass,t.materials);return d`<ha-card>
      <div class="body">
        <div class="header clickable" @click=${()=>this._navigate()}>
          <div style="min-width:0">
            <div class="title">${this._config.title??t.title}</div>
          </div>
          ${this._chip(i)}
        </div>
        ${this._banner()}
        ${s?d`<div class="job clickable" @click=${()=>this._navigate()}>
              ${this._ring(f(this.hass,t.job.print_progress)??0,this._layerText(),i==="paused")}
              <div class="jobinfo">
                <span class="filename">${v(this.hass,t.job.print_filename)??""}</span>
                <span><ha-icon icon="mdi:timer-sand"></ha-icon>${G(K(this.hass,t.job.print_time_left))} left${o?d` · done ${o}`:p}</span>
                ${c?d`<span><ha-icon icon="mdi:swap-horizontal"></ha-icon>${c}</span>`:p}
              </div>
              ${n?d`<img class="thumb" src=${n} alt="" />`:p}
            </div>`:p}
        ${this._tempChips()}
        ${this._renderEditor()}
        ${t.materials.map(l=>ht(this.hass,l,h=>this._moreInfo(h)))}
        ${this._actions(!1)}
      </div>
    </ha-card>`}_renderCamera(){let i=this._layout.cameras[0],s=this._printState(),n=this._thumb(),o=i?this.hass.states[i.entity]:void 0;if(!i&&!n)return p;let c=this._showThumb||!o;return d`<div class="camera">
      ${c?n?d`<img class="media" src=${n} alt="Print thumbnail" style="background:var(--mp-tile)" />`:d`<div class="placeholder"><ha-icon icon="mdi:image-off-outline"></ha-icon></div>`:d`<ha-camera-stream class="media" style=${this._cameraTransform(i)} .hass=${this.hass}
            .stateObj=${o} muted allow-exoplayer></ha-camera-stream>`}
      <div class="overlay">
        ${this._chip(s)}
        ${i&&n?d`<button class="act" style="background:var(--card-background-color)" @click=${()=>this._showThumb=!this._showThumb}>
              <ha-icon icon=${c?"mdi:video-outline":"mdi:image-outline"}></ha-icon>${c?"Camera":"Thumbnail"}</button>`:p}
      </div>
    </div>`}_renderFull(){let t=this._layout,i=this._printState(),s=It.has(i),n=f(this.hass,t.job.print_progress)??0,o=pt(this.hass,v(this.hass,t.job.print_eta)),c=this._layerText(),l=ut(this.hass,t.materials),h=t.fans.find(a=>a.part),m=f(this.hass,t.job.filament_used),u=t.cameras.length>0||!!this._thumb(),g=[...Vt(t.heaters).map(a=>({label:J(a.label),t:f(this.hass,a.temperature),target:f(this.hass,a.target),id:a.temperature,max:a.role==="bed"?120:a.role==="chamber"?80:300,control:a.control,role:a.role})),...t.temperatures.filter(a=>!a.system).map(a=>({label:J(a.label),t:f(this.hass,a.temperature),target:f(this.hass,a.target),id:a.temperature,max:80,control:a.control,role:a.chamber?"chamber":"other"}))].filter(a=>a.t!==void 0),_=t.temperatures.filter(a=>a.system&&f(this.hass,a.temperature)!==void 0),x=t.fans.map(a=>({label:J(a.label),v:f(this.hass,a.speed),id:a.speed,part:a.part,chamber:a.chamber,control:a.control??null})).filter(a=>a.v!==void 0),gt=x.filter(a=>(a.v??0)>0||a.part||a.chamber&&a.control),bt=x.length-gt.length;return d`<ha-card class="full">
      ${this._renderCamera()}
      <div class="body full">
        <div class="header">
          <div style="min-width:0">
            <div class="title">${this._config.title??t.title}</div>
            ${s?d`<div class="subtitle">${v(this.hass,t.job.print_filename)??""}</div>`:p}
          </div>
          ${u?p:this._chip(i)}
        </div>
        ${this._banner()}
        ${s?d`<div>
                <div class="progresslabels"><span>${Math.round(n)}%${c?` \xB7 layer ${c.replace(" / "," of ")}`:""}</span>
                  <span>${o?`done at ${o}`:""}</span></div>
                <div class="progressbar ${i==="paused"?"paused":""}"><div style="width:${n}%"></div></div>
              </div>
              <div class="metrics">
                <div class="metric"><span>Time left</span><b>${G(K(this.hass,t.job.print_time_left))}</b></div>
                <div class="metric"><span>Printing for</span><b>${G(K(this.hass,t.job.print_duration))}</b></div>
                ${m!==void 0?d`<div class="metric"><span>Filament</span><b>${m.toFixed(1)} m</b></div>`:p}
                ${h?d`<div class="metric"><span>Part fan</span><b>${Math.round(f(this.hass,h.speed)??0)}%</b></div>`:p}
                ${l?d`<div class="metric"><span>Tool changes</span><b>${l.split(" tool")[0]}</b></div>`:p}
              </div>`:p}
        <div class="bars">
          ${g.map(a=>d`<div class="barrow clickable ${a.control?"settable":""} ${this._editor?.entity===a.control&&a.control?"editing":""}"
              title=${a.control?`Set ${a.label} temperature`:a.label}
              @click=${()=>a.control?this._openTemp(a.label,a.control,a.role):this._moreInfo(a.id)}>
              <span class="label">${a.label}</span>
              <div class="track"><div class="fill" style="width:${Math.min(100,(a.t??0)/a.max*100)}%"></div></div>
              <span class="value"><b>${(a.t??0).toFixed(1)}</b>${a.target?` / ${Math.round(a.target)}\xB0`:"\xB0"}${a.control?d` <ha-icon class="pen" icon="mdi:pencil-outline"></ha-icon>`:p}</span>
            </div>`)}
        </div>
        ${this._editor?.kind==="temp"?this._renderEditor():p}
        ${t.materials.map(a=>ht(this.hass,a,Wt=>this._moreInfo(Wt)))}
        ${_.length?d`<div>
              <div class="section-title">System</div>
              <div class="chips">${_.map(a=>d`<span class="temp clickable" @click=${()=>this._moreInfo(a.temperature)}>${J(a.label)} <b>${P(f(this.hass,a.temperature))}</b>°</span>`)}</div>
            </div>`:p}
        ${x.length?d`<div>
              <div class="section-title">Fans${bt?d` · ${bt} idle`:p}</div>
              <div class="bars">
                ${gt.map(a=>d`<div class="barrow clickable ${a.control?"settable":""} ${this._editor?.entity===a.control&&a.control?"editing":""}"
                    title=${a.control?`Set ${a.label} speed`:a.label}
                    @click=${()=>a.control?this._openFan(a.label,a.control):this._moreInfo(a.id)}>
                    <span class="label">${a.label}</span>
                    <div class="track"><div class="fill fan" style="width:${a.v}%"></div></div>
                    <span class="value"><b>${Math.round(a.v??0)}</b>%${a.control?d` <ha-icon class="pen" icon="mdi:pencil-outline"></ha-icon>`:p}</span>
                  </div>`)}
              </div>
              ${this._editor?.kind==="fan"?this._renderEditor():p}
            </div>`:p}
        ${this._actions(!0)}
      </div>
    </ha-card>`}render(){return!this._config||!this.hass?p:this._error?d`<ha-card><div class="empty-state">${this._error}</div></ha-card>`:this._layout?this._config.variant==="full"?this._renderFull():this._renderCompact():d`<ha-card><div class="empty-state">Loading printer…</div></ha-card>`}};M.styles=Dt,M.properties={hass:{attribute:!1},_config:{state:!0},_layout:{state:!0},_error:{state:!0},_showThumb:{state:!0},_editor:{state:!0}};var ue=[{name:"device_id",selector:{device:{integration:"moonraker_plus"}}},{name:"variant",selector:{select:{mode:"box",options:[{value:"compact",label:"Compact"},{value:"full",label:"Full (camera, all sensors)"}]}}},{name:"title",selector:{text:{}}},{name:"navigation_path",selector:{navigation:{}}}],me={device_id:"Printer",variant:"Layout",title:"Title (optional)",navigation_path:"Open on tap (optional)"},I=class extends ${setConfig(e){this._config=e}_changed(e){let t={...this._config,...e.detail.value};for(let i of Object.keys(t))(t[i]===""||t[i]===void 0)&&delete t[i];this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}render(){return!this.hass||!this._config?p:d`<ha-form
      .hass=${this.hass}
      .data=${{variant:"compact",...this._config}}
      .schema=${ue}
      .computeLabel=${e=>me[e.name]??e.name}
      @value-changed=${this._changed}
    ></ha-form>`}};I.properties={hass:{attribute:!1},_config:{state:!0}};var Y=class extends HTMLElement{static async generate(e,t){let i=await D(t,!0),s=new Set(["printers"]),n=i.map(l=>{let h=Ut(l.title);for(;s.has(h);)h+="-2";return s.add(h),h}),o={title:"Printers",path:"printers",icon:"mdi:printer-3d",type:"sections",max_columns:4,sections:i.length?i.map((l,h)=>({type:"grid",cards:[{type:"custom:moonraker-plus-card",device_id:l.device_id,variant:"compact",navigation_path:n[h],grid_options:{columns:"full"}}]})):[{type:"grid",cards:[{type:"markdown",content:"No Moonraker Plus printers yet. Add one under Settings \u2192 Devices and services."}]}]},c=i.map((l,h)=>({title:l.title,path:n[h],subview:!0,back_path:"printers",type:"sections",max_columns:2,sections:[{type:"grid",column_span:2,cards:[{type:"custom:moonraker-plus-card",device_id:l.device_id,variant:"full",grid_options:{columns:"full"}}]}]}));return{title:e.title??"3D printers",views:[o,...c]}}};var ft=(r,e)=>{customElements.get(r)||customElements.define(r,e)};ft("moonraker-plus-card",M);ft("moonraker-plus-card-editor",I);ft("ll-strategy-dashboard-moonraker-plus",Y);var mt=window;mt.customCards=mt.customCards??[];mt.customCards.push({type:"moonraker-plus-card",name:"Moonraker Plus printer",description:"3D printer status with job progress, temperatures, and MMU/CFS/toolhead filament slots.",preview:!0,documentationURL:"https://github.com/marcelolcosta/moonraker-plus"});console.info("%c MOONRAKER-PLUS-CARD %c loaded ","background:#378ADD;color:#fff;border-radius:3px 0 0 3px","");
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
