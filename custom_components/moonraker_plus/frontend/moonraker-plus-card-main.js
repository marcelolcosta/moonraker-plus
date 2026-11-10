var B=globalThis,V=B.ShadowRoot&&(B.ShadyCSS===void 0||B.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Z=Symbol(),$t=new WeakMap,R=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==Z)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(V&&e===void 0){let i=t!==void 0&&t.length===1;i&&(e=$t.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&$t.set(t,e))}return e}toString(){return this.cssText}},yt=n=>new R(typeof n=="string"?n:n+"",void 0,Z),Q=(n,...e)=>{let t=n.length===1?n[0]:e.reduce((i,s,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+n[r+1],n[0]);return new R(t,n,Z)},xt=(n,e)=>{if(V)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let i=document.createElement("style"),s=B.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=t.cssText,n.appendChild(i)}},tt=V?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(let i of e.cssRules)t+=i.cssText;return yt(t)})(n):n;var{is:Gt,defineProperty:Jt,getOwnPropertyDescriptor:Xt,getOwnPropertyNames:Yt,getOwnPropertySymbols:Zt,getPrototypeOf:Qt}=Object,W=globalThis,wt=W.trustedTypes,te=wt?wt.emptyScript:"",ee=W.reactiveElementPolyfillSupport,L=(n,e)=>n,et={toAttribute(n,e){switch(e){case Boolean:n=n?te:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},kt=(n,e)=>!Gt(n,e),St={attribute:!0,type:String,converter:et,reflect:!1,useDefault:!1,hasChanged:kt};Symbol.metadata??=Symbol("metadata"),W.litPropertyMetadata??=new WeakMap;var x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=St){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(e,i,t);s!==void 0&&Jt(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){let{get:s,set:r}=Xt(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:s,set(o){let l=s?.call(this);r?.call(this,o),this.requestUpdate(e,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??St}static _$Ei(){if(this.hasOwnProperty(L("elementProperties")))return;let e=Qt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(L("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(L("properties"))){let t=this.properties,i=[...Yt(t),...Zt(t)];for(let s of i)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[i,s]of t)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let s=this._$Eu(t,i);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let s of i)t.unshift(tt(s))}else e!==void 0&&t.push(tt(e));return t}static _$Eu(e,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return xt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){let i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(s!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:et).toAttribute(t,i.type);this._$Em=e,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(e,t){let i=this.constructor,s=i._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let r=i.getPropertyOptions(s),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:et;this._$Em=s;let l=o.fromAttribute(t,r.type);this[s]=l??this._$Ej?.get(s)??l,this._$Em=null}}requestUpdate(e,t,i,s=!1,r){if(e!==void 0){let o=this.constructor;if(s===!1&&(r=this[e]),i??=o.getPropertyOptions(e),!((i.hasChanged??kt)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:r},o){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),r!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,r]of i){let{wrapped:o}=r,l=this[s];o!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,r,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[L("elementProperties")]=new Map,x[L("finalized")]=new Map,ee?.({ReactiveElement:x}),(W.reactiveElementVersions??=[]).push("2.1.2");var lt=globalThis,At=n=>n,q=lt.trustedTypes,Et=q?q.createPolicy("lit-html",{createHTML:n=>n}):void 0,Lt="$lit$",w=`lit$${Math.random().toFixed(9).slice(2)}$`,Ht="?"+w,ie=`<${Ht}>`,A=document,j=()=>A.createComment(""),O=n=>n===null||typeof n!="object"&&typeof n!="function",ct=Array.isArray,se=n=>ct(n)||typeof n?.[Symbol.iterator]=="function",it=`[ 	
\f\r]`,H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ct=/-->/g,Tt=/>/g,S=RegExp(`>|${it}(?:([^\\s"'>=/]+)(${it}*=${it}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Pt=/'/g,Mt=/"/g,jt=/^(?:script|style|textarea|title)$/i,pt=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),p=pt(1),Ot=pt(2),we=pt(3),E=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),Rt=new WeakMap,k=A.createTreeWalker(A,129);function Ut(n,e){if(!ct(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return Et!==void 0?Et.createHTML(e):e}var ne=(n,e)=>{let t=n.length-1,i=[],s,r=e===2?"<svg>":e===3?"<math>":"",o=H;for(let l=0;l<t;l++){let c=n[l],h,m,u=-1,g=0;for(;g<c.length&&(o.lastIndex=g,m=o.exec(c),m!==null);)g=o.lastIndex,o===H?m[1]==="!--"?o=Ct:m[1]!==void 0?o=Tt:m[2]!==void 0?(jt.test(m[2])&&(s=RegExp("</"+m[2],"g")),o=S):m[3]!==void 0&&(o=S):o===S?m[0]===">"?(o=s??H,u=-1):m[1]===void 0?u=-2:(u=o.lastIndex-m[2].length,h=m[1],o=m[3]===void 0?S:m[3]==='"'?Mt:Pt):o===Mt||o===Pt?o=S:o===Ct||o===Tt?o=H:(o=S,s=void 0);let _=o===S&&n[l+1].startsWith("/>")?" ":"";r+=o===H?c+ie:u>=0?(i.push(h),c.slice(0,u)+Lt+c.slice(u)+w+_):c+w+(u===-2?l:_)}return[Ut(n,r+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},U=class n{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let r=0,o=0,l=e.length-1,c=this.parts,[h,m]=ne(e,t);if(this.el=n.createElement(h,i),k.currentNode=this.el.content,t===2||t===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=k.nextNode())!==null&&c.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(let u of s.getAttributeNames())if(u.endsWith(Lt)){let g=m[o++],_=s.getAttribute(u).split(w),y=/([.?@])?(.*)/.exec(g);c.push({type:1,index:r,name:y[2],strings:_,ctor:y[1]==="."?nt:y[1]==="?"?rt:y[1]==="@"?ot:T}),s.removeAttribute(u)}else u.startsWith(w)&&(c.push({type:6,index:r}),s.removeAttribute(u));if(jt.test(s.tagName)){let u=s.textContent.split(w),g=u.length-1;if(g>0){s.textContent=q?q.emptyScript:"";for(let _=0;_<g;_++)s.append(u[_],j()),k.nextNode(),c.push({type:2,index:++r});s.append(u[g],j())}}}else if(s.nodeType===8)if(s.data===Ht)c.push({type:2,index:r});else{let u=-1;for(;(u=s.data.indexOf(w,u+1))!==-1;)c.push({type:7,index:r}),u+=w.length-1}r++}}static createElement(e,t){let i=A.createElement("template");return i.innerHTML=e,i}};function C(n,e,t=n,i){if(e===E)return e;let s=i!==void 0?t._$Co?.[i]:t._$Cl,r=O(e)?void 0:e._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),r===void 0?s=void 0:(s=new r(n),s._$AT(n,t,i)),i!==void 0?(t._$Co??=[])[i]=s:t._$Cl=s),s!==void 0&&(e=C(n,s._$AS(n,e.values),s,i)),e}var st=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??A).importNode(t,!0);k.currentNode=s;let r=k.nextNode(),o=0,l=0,c=i[0];for(;c!==void 0;){if(o===c.index){let h;c.type===2?h=new N(r,r.nextSibling,this,e):c.type===1?h=new c.ctor(r,c.name,c.strings,this,e):c.type===6&&(h=new at(r,this,e)),this._$AV.push(h),c=i[++l]}o!==c?.index&&(r=k.nextNode(),o++)}return k.currentNode=A,s}p(e){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},N=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=C(this,e,t),O(e)?e===d||e==null||e===""?(this._$AH!==d&&this._$AR(),this._$AH=d):e!==this._$AH&&e!==E&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):se(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==d&&O(this._$AH)?this._$AA.nextSibling.data=e:this.T(A.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:i}=e,s=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=U.createElement(Ut(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{let r=new st(s,this),o=r.u(this.options);r.p(t),this.T(o),this._$AH=r}}_$AC(e){let t=Rt.get(e.strings);return t===void 0&&Rt.set(e.strings,t=new U(e)),t}k(e){ct(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,s=0;for(let r of e)s===t.length?t.push(i=new n(this.O(j()),this.O(j()),this,this.options)):i=t[s],i._$AI(r),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let i=At(e).nextSibling;At(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},T=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,r){this.type=1,this._$AH=d,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=d}_$AI(e,t=this,i,s){let r=this.strings,o=!1;if(r===void 0)e=C(this,e,t,0),o=!O(e)||e!==this._$AH&&e!==E,o&&(this._$AH=e);else{let l=e,c,h;for(e=r[0],c=0;c<r.length-1;c++)h=C(this,l[i+c],t,c),h===E&&(h=this._$AH[c]),o||=!O(h)||h!==this._$AH[c],h===d?e=d:e!==d&&(e+=(h??"")+r[c+1]),this._$AH[c]=h}o&&!s&&this.j(e)}j(e){e===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},nt=class extends T{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===d?void 0:e}},rt=class extends T{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==d)}},ot=class extends T{constructor(e,t,i,s,r){super(e,t,i,s,r),this.type=5}_$AI(e,t=this){if((e=C(this,e,t,0)??d)===E)return;let i=this._$AH,s=e===d&&i!==d||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==d&&(i===d||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},at=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){C(this,e)}};var re=lt.litHtmlPolyfillSupport;re?.(U,N),(lt.litHtmlVersions??=[]).push("3.3.3");var Nt=(n,e,t)=>{let i=t?.renderBefore??e,s=i._$litPart$;if(s===void 0){let r=t?.renderBefore??null;i._$litPart$=s=new N(e.insertBefore(j(),r),r,void 0,t??{})}return s._$AI(n),s};var dt=globalThis,$=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Nt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return E}};$._$litElement$=!0,$.finalized=!0,dt.litElementHydrateSupport?.({LitElement:$});var oe=dt.litElementPolyfillSupport;oe?.({LitElement:$});(dt.litElementVersions??=[]).push("4.2.2");var z=null;function F(n,e=!1){if(!e&&z&&Date.now()-z.at<6e4)return z.promise;let t=n.connection.sendMessagePromise({type:"moonraker_plus/printers"}).then(i=>i.printers);return z={at:Date.now(),promise:t},t.catch(()=>{z=null}),t}function zt(n){return n.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"printer"}var ae=new Set(["unavailable","unknown","","none"]);function b(n,e){return e?n.states[e]:void 0}function v(n,e){let t=b(n,e)?.state;return t===void 0||ae.has(t)?void 0:t}function K(n,e){let t=b(n,e);return t!==void 0&&t.state!=="unavailable"}function f(n,e){let t=v(n,e);if(t===void 0)return;let i=Number(t);return Number.isFinite(i)?i:void 0}var le={s:1,min:60,h:3600,d:86400};function G(n,e){let t=f(n,e);if(t===void 0)return;let i=b(n,e)?.attributes.unit_of_measurement??"s";return t*(le[i]??1)}function J(n){if(n===void 0)return"\u2013";let e=Math.max(0,Math.round(n/60)),t=Math.floor(e/60),i=e%60;return t>=24?`${Math.floor(t/24)}d ${t%24}h`:t?`${t}h ${String(i).padStart(2,"0")}m`:`${i}m`}function ht(n,e){if(!e)return;let t=new Date(e);if(Number.isNaN(t.getTime()))return;let i=n.locale?.language??n.language??navigator.language,s=t.toLocaleTimeString(i,{hour:"2-digit",minute:"2-digit"}),r=new Date;return t.toDateString()===r.toDateString()?s:`${t.toLocaleDateString(i,{weekday:"short"})} ${s}`}function P(n){return n===void 0?"\u2013":`${Math.round(n)}`}function Ft(n){return n&&n[0].toUpperCase()+n.slice(1)}function ce(n,e){let t=b(n,e.active)?.attributes,i=t?.next_tool,s=t?.ttg_map;if(!(typeof i!="number"||i<0||!s))return s[i]}function pe(n,e,t,i,s){let o=b(n,t.entity)?.attributes??{},l=o.present??void 0,c=o.material??void 0,h=[t.label,o.filament_name,c,o.vendor].filter(Boolean),m,u;if(e.kind==="happy_hare")m=t.id.replace("gate_","");else if(e.kind==="creality_cfs")m=l===!1?t.id.slice(-1):c??"?";else if(e.kind==="snapmaker_u1"){m=l===!1?"\u2013":c??"?";let g=o.nozzle_temperature;u=typeof g=="number"?`${Math.round(g)}\xB0`:void 0}else m=c??String(i+1);return{layout:t,present:l,active:!!o.active,next:e.kind==="happy_hare"&&s!==void 0&&t.id===`gate_${s}`,color:o.color,material:c,title:h.join(" \xB7 "),label:m,sub:u}}function de(n){let e=["dot"];return n.present===!1?e.push("empty"):n.color||e.push(n.present?"nodata":"unknown"),n.active?e.push("active"):n.next&&e.push("next"),e.join(" ")}function he(n,e,t){let i=[t.name],s=f(n,t.temperature),r=f(n,t.humidity);return s!==void 0&&i.push(`${P(s)}\xB0`),r!==void 0&&i.push(`${Math.round(r)}% RH`),t.connected===!1&&i.push("not connected"),p`${i.join(" \xB7 ")}`}function ue(n,e){let t=b(n,e.active)?.attributes??{},i=v(n,e.active),s=v(n,e.status);if(e.kind==="happy_hare"){let r=[e.units.map(o=>o.name).join(" + ")||e.name];return typeof t.tool=="number"&&t.tool>=0&&i?r.push(`T${t.tool} on ${i.toLowerCase()}`):i&&r.push(i),typeof t.next_tool=="number"&&t.next_tool>=0&&r.push(`next T${t.next_tool}`),s&&r.push(s),r.join(" \xB7 ")}return e.kind==="snapmaker_u1"?["Toolheads",i?`${i.toLowerCase()} active`:void 0].filter(Boolean).join(" \xB7 "):[e.name,i?`${i} active`:void 0].filter(Boolean).join(" \xB7 ")}function ut(n,e,t){let i=e.kind==="happy_hare"?ce(n,e):void 0,s=o=>p`
    <div class="spools">
      ${o.slots.map((l,c)=>{let h=pe(n,e,l,c,i);return p`<div class="spool" title=${h.title} @click=${()=>l.entity&&t(l.entity)}>
          <div class=${de(h)} style=${h.color&&h.present!==!1?`background:${h.color}`:""}>
            ${h.present&&!h.color?"?":d}
          </div>
          <span>${h.label}</span>
          ${h.sub?p`<span class="sub">${h.sub}</span>`:d}
        </div>`})}
    </div>
  `;if(e.kind==="creality_cfs"){let o=e.units.filter(l=>l.slots.length);return p`${o.map(l=>p`<div>
        <div class="section-title">${he(n,e,l)}</div>
        ${s(l)}
      </div>`)}`}let r={...e.units[0],slots:e.units.flatMap(o=>o.slots)};return p`<div>
    <div class="section-title">${ue(n,e)}</div>
    ${s(r)}
  </div>`}function Dt(n,e){let t=b(n,e.status)?.attributes?.error;return typeof t=="string"&&t?`${e.name}: ${t}`:void 0}function mt(n,e){for(let t of e){let i=b(n,t.active)?.attributes;if(i&&typeof i.num_toolchanges=="number"&&typeof i.total_toolchanges=="number"&&i.total_toolchanges>0)return`${i.num_toolchanges} of ${i.total_toolchanges} tool changes`}}var It=Q`
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
  .temp.fil {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .temp.fil b {
    font-weight: 500;
  }
  .temp.fil ha-icon {
    --mdc-icon-size: 14px;
  }
  .temp.fil.ok ha-icon {
    color: var(--mp-ok);
  }
  .temp.fil.runout {
    background: color-mix(in srgb, var(--mp-error) 16%, transparent);
    color: var(--mp-error);
  }
  .temp.fil.runout b {
    color: var(--mp-error);
  }
  .temp.fil.off {
    opacity: 0.7;
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
`;var Bt=new Set(["printing","paused"]),Vt={extruder:[0,200,215,230,250],bed:[0,55,60,70,85,100],chamber:[0,35,45,55,65],other:[0,40,60]},me=[0,25,50,75,100],Wt={extruder:0,bed:1,chamber:2,other:3},qt=n=>[...n].sort((e,t)=>Wt[e.role]-Wt[t.role]||e.label.localeCompare(t.label,void 0,{numeric:!0})),D=n=>n.replace(/\s*\([^)]*\)$/,""),fe=n=>{let e=D(n).replace(/\b(filament|sensor|switch|motion)\b/gi,"").replace(/\s+/g," ").trim();return!e||/^\d+$/.test(e)?"Filament":e},ft={ok:"Loaded",empty:"Empty",runout:"Runout",off:"Off"},ge={ok:"mdi:check-circle",empty:"mdi:circle-outline",runout:"mdi:alert-circle",off:"mdi:minus-circle-outline"},M=class extends ${constructor(){super(...arguments);this._showThumb=!1}static getConfigElement(){return document.createElement("moonraker-plus-card-editor")}static async getStubConfig(t){try{return{device_id:(await F(t))[0]?.device_id??void 0,variant:"compact"}}catch{return{variant:"compact"}}}setConfig(t){if(!t)throw new Error("Invalid configuration");this._config={variant:"compact",...t},this._layout=void 0,this._loadingFor=void 0}getCardSize(){return this._config?.variant==="full"?10:5}getGridOptions(){return this._config?.variant==="full"?{columns:"full",min_columns:6}:{columns:12,min_columns:6}}willUpdate(t){if(!this.hass||!this._config)return;let i=this._config.device_id??"*";this._loadingFor!==i&&(this._loadingFor=i,F(this.hass).then(s=>{let r=this._config.device_id?s.find(o=>o.device_id===this._config.device_id):s[0];this._layout=r,this._error=r?void 0:"Printer not found. Pick a Moonraker Plus device in the card settings."}).catch(s=>{this._error=`Couldn't load printer layout: ${s?.message??s}`}))}_moreInfo(t){t&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0}))}_navigate(){let t=this._config.navigation_path;if(!t){this._moreInfo(this._layout?.job.print_state);return}let i=t.startsWith("/")?t:`${location.pathname.split("/").slice(0,2).join("/")}/${t}`;history.pushState(null,"",i),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}}))}_press(t,i){t&&(i&&!confirm(i)||this.hass.callService("button","press",{entity_id:t}))}_toggle(t){this.hass.callService("light","toggle",{entity_id:t})}_printState(){let t=v(this.hass,this._layout?.job.print_state),i=v(this.hass,this._layout?.job.klippy_state);return t===void 0?"offline":i&&i!=="ready"?"error":t}_chip(t){return p`<span class="chip ${t}">${{standby:"Idle",printing:"Printing",paused:"Paused",complete:"Done",cancelled:"Cancelled",error:"Error",offline:"Offline"}[t]??Ft(t)}</span>`}_ring(t,i,s,r=88){let l=2*Math.PI*38,c=l*(1-Math.min(Math.max(t,0),100)/100);return p`<svg class="ring ${s?"paused":""}" width=${r} height=${r} viewBox="0 0 92 92">
      <circle class="track" cx="46" cy="46" r=${38} fill="none" stroke-width="7"></circle>
      <circle class="bar" cx="46" cy="46" r=${38} fill="none" stroke-width="7" stroke-linecap="round"
        stroke-dasharray=${l} stroke-dashoffset=${c} transform="rotate(-90 46 46)"></circle>
      <text x="46" y=${i?45:51} text-anchor="middle" font-size="18" font-weight="500">${Math.round(t)}%</text>
      ${i?Ot`<text class="small" x="46" y="61" text-anchor="middle" font-size="11">${i}</text>`:d}
    </svg>`}_layerText(){let t=f(this.hass,this._layout.job.current_layer),i=f(this.hass,this._layout.job.total_layers);return t!==void 0&&i!==void 0?`${t} / ${i}`:void 0}_primaryHeaters(){let t=this._layout,i=t.materials.some(s=>s.kind==="snapmaker_u1");return qt(t.heaters).filter(s=>s.role==="extruder"?!i:s.role!=="other")}_tempChips(t=!1){let i=[],s=(o,l,c,h,m)=>{let u=f(this.hass,l),g=f(this.hass,c)??f(this.hass,h),_=g!==void 0&&g>0&&u!==void 0&&Math.abs(g-u)>3,y=this._editor?.entity===h&&h;i.push(p`<span class="temp ${_?"heating":""} ${h?"settable":""} ${y?"editing":""}"
        title=${h?`Set ${o} temperature`:o}
        @click=${()=>h?this._openTemp(o,h,m):this._moreInfo(l)}>
        ${o} <b>${P(u)}</b>${g?p`/${P(g)}`:d}°</span>`)};for(let o of this._primaryHeaters().filter(l=>l.role!=="chamber")){let l=o.role==="extruder"?o.label.replace("Extruder","Nozzle"):"Bed";s(l,o.temperature,o.target,o.control,o.role)}let r=this._chamber();return r&&s(r.label,r.temperature,r.target,r.control,"chamber"),p`<div class="chips">${i}${t?this._filSummary():d}</div>`}_filamentSensors(){let t=this._printState()==="printing";return(this._layout?.filament_sensors??[]).flatMap(i=>{let s=b(this.hass,i.entity);if(!i.entity||!s||s.state==="unavailable"||s.state==="unknown")return[];let r=s.attributes?.enabled===!1?"off":s.state==="on"?"ok":t?"runout":"empty";return[{label:fe(i.label),entity:i.entity,state:r}]})}_filChip(t,i){return p`<span class="temp fil ${t.state} clickable" title="${t.label} filament sensor: ${ft[t.state]}"
      @click=${()=>this._moreInfo(t.entity)}><ha-icon icon=${ge[t.state]}></ha-icon>${i??p`${t.label} <b>${ft[t.state]}</b>`}</span>`}_filSummary(){let t=this._filamentSensors();if(!t.length)return d;let i=t.filter(l=>l.state!=="off"),s=i.find(l=>l.state==="runout");if(s)return this._filChip(s,p`Runout <b>${s.label==="Filament"?"":s.label}</b>`);if(!i.length)return this._filChip(t[0],"Sensor off");let r=i.filter(l=>l.state==="ok").length;if(i.length===1)return this._filChip(i[0],p`Filament <b>${ft[i[0].state]}</b>`);let o=i.find(l=>l.state==="empty")??i[0];return this._filChip({...o,state:r===i.length?"ok":"empty"},p`Filament <b>${r}/${i.length}</b>`)}_openTemp(t,i,s){if(!i)return;let r=b(this.hass,i),o=Number(r?.attributes?.max??300),l=f(this.hass,i);this._editor={kind:"temp",entity:i,label:t,max:o,presets:(Vt[s]??Vt.other).filter(c=>c<=o),value:l!==void 0?String(Math.round(l)):""}}_openFan(t,i){if(!i)return;let s=b(this.hass,i)?.attributes?.percentage;this._editor={kind:"fan",entity:i,label:t,max:100,presets:me,value:s!=null?String(s):""}}_apply(t){let i=this._editor;if(!i||!Number.isFinite(t))return;let s=Math.min(Math.max(Math.round(t),0),i.max);i.kind==="temp"?this.hass.callService("number","set_value",{entity_id:i.entity,value:s}):this.hass.callService("fan","set_percentage",{entity_id:i.entity,percentage:s}),this._editor=void 0}_renderEditor(){let t=this._editor;if(!t)return d;let i=t.kind==="temp"?"\xB0C":"%",s=r=>r===0?"Off":`${r}${t.kind==="temp"?"\xB0":"%"}`;return p`<div class="editor">
      <div class="editor-head">
        <span>${t.kind==="temp"?"Set":"Speed"} · ${t.label}</span>
        <button class="icon" title="Close" @click=${()=>this._editor=void 0}><ha-icon icon="mdi:close"></ha-icon></button>
      </div>
      <div class="presets">
        ${t.presets.map(r=>p`<button class="act" @click=${()=>this._apply(r)}>${s(r)}</button>`)}
      </div>
      <form class="editor-input" @submit=${r=>{r.preventDefault(),this._apply(Number(r.target.elements.namedItem("v").value))}}>
        <input name="v" type="number" inputmode="numeric" min="0" max=${t.max} step="1" .value=${t.value} />
        <span class="unit">${i} (max ${t.max})</span>
        <button class="act primary" type="submit">Set</button>
      </form>
    </div>`}_chamber(){let t=this._layout,i=t.heaters.find(o=>o.role==="chamber");if(i)return{label:"Chamber",temperature:i.temperature,target:i.target,control:i.control};let s=t.temperatures.filter(o=>o.chamber),r=s.find(o=>o.control)??s[0];return r?{label:"Chamber",temperature:r.temperature,target:r.target,control:r.control}:void 0}_banner(){let t=this._layout,i=v(this.hass,t.job.klippy_state);if(i&&i!=="ready"){let o=b(this.hass,t.job.klippy_state)?.attributes?.state_message??`Klipper ${i}`;return p`<div class="banner"><ha-icon icon="mdi:alert-circle-outline"></ha-icon><span>${o}</span>
        ${K(this.hass,t.buttons.firmware_restart)?p`<button class="act" @click=${()=>this._press(t.buttons.firmware_restart,"Restart the printer firmware?")}>Restart</button>`:d}</div>`}let s=t.materials.map(o=>Dt(this.hass,o)).filter(Boolean);if(this._printState()==="error"){let o=b(this.hass,t.job.print_state)?.attributes?.message;o&&s.unshift(o)}if(!s.length)return d;let r=K(this.hass,t.buttons.resume);return p`<div class="banner"><ha-icon icon="mdi:alert-circle-outline"></ha-icon><span>${s.join(" \xB7 ")}</span>
      ${r?p`<button class="act" @click=${()=>this._press(t.buttons.resume)}>Resume</button>`:d}</div>`}_actions(t){let i=this._layout,s=i.buttons,r=l=>K(this.hass,l),o=[];r(s.pause)&&o.push(p`<button class="act" @click=${()=>this._press(s.pause)}><ha-icon icon="mdi:pause"></ha-icon>Pause</button>`),r(s.resume)&&o.push(p`<button class="act" @click=${()=>this._press(s.resume)}><ha-icon icon="mdi:play"></ha-icon>Resume</button>`),r(s.cancel)&&o.push(p`<button class="act danger" @click=${()=>this._press(s.cancel,`Cancel the print on ${i.title}?`)}>
        <ha-icon icon="mdi:stop"></ha-icon>Cancel</button>`),r(s.emergency_stop)&&o.push(p`<button class="act estop" title="Emergency stop"
        @click=${()=>this._press(s.emergency_stop,`EMERGENCY STOP ${i.title}?

This halts the printer immediately (heaters and motors off). Klipper needs a firmware restart afterwards.`)}>
        <ha-icon icon="mdi:alert-octagon"></ha-icon>${t?"Emergency stop":"E-stop"}</button>`);for(let l of t?i.lights:i.lights.slice(0,1)){let c=v(this.hass,l.entity)==="on";o.push(p`<button class="act ${c?"on":""}" title=${l.label} @click=${()=>this._toggle(l.entity)}>
        <ha-icon icon=${c?"mdi:lightbulb-on":"mdi:lightbulb-outline"}></ha-icon>${t?l.label:"Light"}</button>`)}if(t)for(let l of i.macros)o.push(p`<button class="act" @click=${()=>this._press(l.entity)}><ha-icon icon="mdi:script-text-play-outline"></ha-icon>
          ${l.name.replace(/_/g," ").toLowerCase()}</button>`);return o.length?p`<div class="actions ${t?"divided":""}">${o}</div>`:d}_thumb(){let t=this._layout?.thumbnail;if(!(!t||v(this.hass,t)===void 0))return b(this.hass,t)?.attributes?.entity_picture}_cameraTransform(t){let i=[];return t.rotation&&i.push(`rotate(${t.rotation}deg)`),t.flip_horizontal&&i.push("scaleX(-1)"),t.flip_vertical&&i.push("scaleY(-1)"),i.length?`transform:${i.join(" ")}`:""}_renderCompact(){let t=this._layout,i=this._printState(),s=Bt.has(i),r=this._thumb(),o=ht(this.hass,v(this.hass,t.job.print_eta)),l=mt(this.hass,t.materials);return p`<ha-card>
      <div class="body">
        <div class="header clickable" @click=${()=>this._navigate()}>
          <div style="min-width:0">
            <div class="title">${this._config.title??t.title}</div>
          </div>
          ${this._chip(i)}
        </div>
        ${this._banner()}
        ${s?p`<div class="job clickable" @click=${()=>this._navigate()}>
              ${this._ring(f(this.hass,t.job.print_progress)??0,this._layerText(),i==="paused")}
              <div class="jobinfo">
                <span class="filename">${v(this.hass,t.job.print_filename)??""}</span>
                <span><ha-icon icon="mdi:timer-sand"></ha-icon>${J(G(this.hass,t.job.print_time_left))} left${o?p` · done ${o}`:d}</span>
                ${l?p`<span><ha-icon icon="mdi:swap-horizontal"></ha-icon>${l}</span>`:d}
              </div>
              ${r?p`<img class="thumb" src=${r} alt="" />`:d}
            </div>`:d}
        ${this._tempChips(!0)}
        ${this._renderEditor()}
        ${t.materials.map(c=>ut(this.hass,c,h=>this._moreInfo(h)))}
        ${this._actions(!1)}
      </div>
    </ha-card>`}_renderCamera(){let i=this._layout.cameras[0],s=this._printState(),r=this._thumb(),o=i?this.hass.states[i.entity]:void 0;if(!i&&!r)return d;let l=this._showThumb||!o;return p`<div class="camera">
      ${l?r?p`<img class="media" src=${r} alt="Print thumbnail" style="background:var(--mp-tile)" />`:p`<div class="placeholder"><ha-icon icon="mdi:image-off-outline"></ha-icon></div>`:p`<ha-camera-stream class="media" style=${this._cameraTransform(i)} .hass=${this.hass}
            .stateObj=${o} muted allow-exoplayer></ha-camera-stream>`}
      <div class="overlay">
        ${this._chip(s)}
        ${i&&r?p`<button class="act" style="background:var(--card-background-color)" @click=${()=>this._showThumb=!this._showThumb}>
              <ha-icon icon=${l?"mdi:video-outline":"mdi:image-outline"}></ha-icon>${l?"Camera":"Thumbnail"}</button>`:d}
      </div>
    </div>`}_renderFull(){let t=this._layout,i=this._printState(),s=Bt.has(i),r=f(this.hass,t.job.print_progress)??0,o=ht(this.hass,v(this.hass,t.job.print_eta)),l=this._layerText(),c=mt(this.hass,t.materials),h=t.fans.find(a=>a.part),m=f(this.hass,t.job.filament_used),u=t.cameras.length>0||!!this._thumb(),g=[...qt(t.heaters).map(a=>({label:D(a.label),t:f(this.hass,a.temperature),target:f(this.hass,a.target),id:a.temperature,max:a.role==="bed"?120:a.role==="chamber"?80:300,control:a.control,role:a.role})),...t.temperatures.filter(a=>!a.system).map(a=>({label:D(a.label),t:f(this.hass,a.temperature),target:f(this.hass,a.target),id:a.temperature,max:80,control:a.control,role:a.chamber?"chamber":"other"}))].filter(a=>a.t!==void 0),_=this._filamentSensors(),y=t.temperatures.filter(a=>a.system&&f(this.hass,a.temperature)!==void 0),Y=t.fans.map(a=>({label:D(a.label),v:f(this.hass,a.speed),id:a.speed,part:a.part,chamber:a.chamber,control:a.control??null})).filter(a=>a.v!==void 0),vt=Y.filter(a=>(a.v??0)>0||a.part||a.chamber&&a.control),_t=Y.length-vt.length;return p`<ha-card class="full">
      ${this._renderCamera()}
      <div class="body full">
        <div class="header">
          <div style="min-width:0">
            <div class="title">${this._config.title??t.title}</div>
            ${s?p`<div class="subtitle">${v(this.hass,t.job.print_filename)??""}</div>`:d}
          </div>
          ${u?d:this._chip(i)}
        </div>
        ${this._banner()}
        ${s?p`<div>
                <div class="progresslabels"><span>${Math.round(r)}%${l?` \xB7 layer ${l.replace(" / "," of ")}`:""}</span>
                  <span>${o?`done at ${o}`:""}</span></div>
                <div class="progressbar ${i==="paused"?"paused":""}"><div style="width:${r}%"></div></div>
              </div>
              <div class="metrics">
                <div class="metric"><span>Time left</span><b>${J(G(this.hass,t.job.print_time_left))}</b></div>
                <div class="metric"><span>Printing for</span><b>${J(G(this.hass,t.job.print_duration))}</b></div>
                ${m!==void 0?p`<div class="metric"><span>Filament</span><b>${m.toFixed(1)} m</b></div>`:d}
                ${h?p`<div class="metric"><span>Part fan</span><b>${Math.round(f(this.hass,h.speed)??0)}%</b></div>`:d}
                ${c?p`<div class="metric"><span>Tool changes</span><b>${c.split(" tool")[0]}</b></div>`:d}
              </div>`:d}
        <div class="bars">
          ${g.map(a=>p`<div class="barrow clickable ${a.control?"settable":""} ${this._editor?.entity===a.control&&a.control?"editing":""}"
              title=${a.control?`Set ${a.label} temperature`:a.label}
              @click=${()=>a.control?this._openTemp(a.label,a.control,a.role):this._moreInfo(a.id)}>
              <span class="label">${a.label}</span>
              <div class="track"><div class="fill" style="width:${Math.min(100,(a.t??0)/a.max*100)}%"></div></div>
              <span class="value"><b>${(a.t??0).toFixed(1)}</b>${a.target?` / ${Math.round(a.target)}\xB0`:"\xB0"}${a.control?p` <ha-icon class="pen" icon="mdi:pencil-outline"></ha-icon>`:d}</span>
            </div>`)}
        </div>
        ${this._editor?.kind==="temp"?this._renderEditor():d}
        ${t.materials.map(a=>ut(this.hass,a,Kt=>this._moreInfo(Kt)))}
        ${_.length?p`<div>
              <div class="section-title">Filament sensors</div>
              <div class="chips">${_.map(a=>this._filChip(a))}</div>
            </div>`:d}
        ${y.length?p`<div>
              <div class="section-title">System</div>
              <div class="chips">${y.map(a=>p`<span class="temp clickable" @click=${()=>this._moreInfo(a.temperature)}>${D(a.label)} <b>${P(f(this.hass,a.temperature))}</b>°</span>`)}</div>
            </div>`:d}
        ${Y.length?p`<div>
              <div class="section-title">Fans${_t?p` · ${_t} idle`:d}</div>
              <div class="bars">
                ${vt.map(a=>p`<div class="barrow clickable ${a.control?"settable":""} ${this._editor?.entity===a.control&&a.control?"editing":""}"
                    title=${a.control?`Set ${a.label} speed`:a.label}
                    @click=${()=>a.control?this._openFan(a.label,a.control):this._moreInfo(a.id)}>
                    <span class="label">${a.label}</span>
                    <div class="track"><div class="fill fan" style="width:${a.v}%"></div></div>
                    <span class="value"><b>${Math.round(a.v??0)}</b>%${a.control?p` <ha-icon class="pen" icon="mdi:pencil-outline"></ha-icon>`:d}</span>
                  </div>`)}
              </div>
              ${this._editor?.kind==="fan"?this._renderEditor():d}
            </div>`:d}
        ${this._actions(!0)}
      </div>
    </ha-card>`}render(){return!this._config||!this.hass?d:this._error?p`<ha-card><div class="empty-state">${this._error}</div></ha-card>`:this._layout?this._config.variant==="full"?this._renderFull():this._renderCompact():p`<ha-card><div class="empty-state">Loading printer…</div></ha-card>`}};M.styles=It,M.properties={hass:{attribute:!1},_config:{state:!0},_layout:{state:!0},_error:{state:!0},_showThumb:{state:!0},_editor:{state:!0}};var be=[{name:"device_id",selector:{device:{integration:"moonraker_plus"}}},{name:"variant",selector:{select:{mode:"box",options:[{value:"compact",label:"Compact"},{value:"full",label:"Full (camera, all sensors)"}]}}},{name:"title",selector:{text:{}}},{name:"navigation_path",selector:{navigation:{}}}],ve={device_id:"Printer",variant:"Layout",title:"Title (optional)",navigation_path:"Open on tap (optional)"},I=class extends ${setConfig(e){this._config=e}_changed(e){let t={...this._config,...e.detail.value};for(let i of Object.keys(t))(t[i]===""||t[i]===void 0)&&delete t[i];this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}render(){return!this.hass||!this._config?d:p`<ha-form
      .hass=${this.hass}
      .data=${{variant:"compact",...this._config}}
      .schema=${be}
      .computeLabel=${e=>ve[e.name]??e.name}
      @value-changed=${this._changed}
    ></ha-form>`}};I.properties={hass:{attribute:!1},_config:{state:!0}};var X=class extends HTMLElement{static async generate(e,t){let i=await F(t,!0),s=new Set(["printers"]),r=i.map(c=>{let h=zt(c.title);for(;s.has(h);)h+="-2";return s.add(h),h}),o={title:"Printers",path:"printers",icon:"mdi:printer-3d",type:"sections",max_columns:4,sections:i.length?i.map((c,h)=>({type:"grid",cards:[{type:"custom:moonraker-plus-card",device_id:c.device_id,variant:"compact",navigation_path:r[h],grid_options:{columns:"full"}}]})):[{type:"grid",cards:[{type:"markdown",content:"No Moonraker Plus printers yet. Add one under Settings \u2192 Devices and services."}]}]},l=i.map((c,h)=>({title:c.title,path:r[h],subview:!0,back_path:"printers",type:"sections",max_columns:2,sections:[{type:"grid",column_span:2,cards:[{type:"custom:moonraker-plus-card",device_id:c.device_id,variant:"full",grid_options:{columns:"full"}}]}]}));return{title:e.title??"3D printers",views:[o,...l]}}};var bt=(n,e)=>{customElements.get(n)||customElements.define(n,e)};bt("moonraker-plus-card",M);bt("moonraker-plus-card-editor",I);bt("ll-strategy-dashboard-moonraker-plus",X);var gt=window;gt.customCards=gt.customCards??[];gt.customCards.push({type:"moonraker-plus-card",name:"Moonraker Plus printer",description:"3D printer status with job progress, temperatures, and MMU/CFS/toolhead filament slots.",preview:!0,documentationURL:"https://github.com/marcelolcosta/moonraker-plus"});console.info("%c MOONRAKER-PLUS-CARD %c loaded ","background:#378ADD;color:#fff;border-radius:3px 0 0 3px","");
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
