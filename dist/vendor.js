!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e(require("jquery"));else if("function"==typeof define&&define.amd)define(["jquery"],e);else{var i=e("object"==typeof exports?require("jquery"):t.jquery);for(var n in i)("object"==typeof exports?exports:t)[n]=i[n]}}("undefined"!=typeof self?self:this,function(t){return function(t){function e(n){if(i[n])return i[n].exports;var s=i[n]={i:n,l:!1,exports:{}};return t[n].call(s.exports,s,s.exports,e),s.l=!0,s.exports}var i={};return e.m=t,e.c=i,e.d=function(t,i,n){e.o(t,i)||Object.defineProperty(t,i,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(i,"a",i),i},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=15)}({0:function(e,i){e.exports=t},1:function(t,e,i){var n,s;(function(){function i(t,e,i,n){return new r(t,e,i,n)}function r(t,e,i,n){this.options=n||{},this.options.adapters=this.options.adapters||{},this.obj=t,this.keypath=e,this.callback=i,this.objectPath=[],this.update=this.update.bind(this),this.parse(),o(this.target=this.realize())&&this.set(!0,this.key,this.target,this.callback)}function o(t){return"object"==typeof t&&null!==t}function u(t){throw new Error("[sightglass] "+t)}i.adapters={},r.tokenize=function(t,e,i){var n,s,r=[],o={i:i,path:""};for(n=0;n<t.length;n++)s=t.charAt(n),~e.indexOf(s)?(r.push(o),o={i:s,path:""}):o.path+=s;return r.push(o),r},r.prototype.parse=function(){var t,e,n=this.interfaces();n.length||u("Must define at least one adapter interface."),~n.indexOf(this.keypath[0])?(t=this.keypath[0],e=this.keypath.substr(1)):(void 0===(t=this.options.root||i.root)&&u("Must define a default root adapter."),e=this.keypath),this.tokens=r.tokenize(e,n,t),this.key=this.tokens.pop()},r.prototype.realize=function(){var t,e=this.obj,i=!1;return this.tokens.forEach(function(n,s){o(e)?(void 0!==this.objectPath[s]?e!==(t=this.objectPath[s])&&(this.set(!1,n,t,this.update),this.set(!0,n,e,this.update),this.objectPath[s]=e):(this.set(!0,n,e,this.update),this.objectPath[s]=e),e=this.get(n,e)):(!1===i&&(i=s),(t=this.objectPath[s])&&this.set(!1,n,t,this.update))},this),!1!==i&&this.objectPath.splice(i),e},r.prototype.update=function(){var t,e;(t=this.realize())!==this.target&&(o(this.target)&&this.set(!1,this.key,this.target,this.callback),o(t)&&this.set(!0,this.key,t,this.callback),e=this.value(),this.target=t,(this.value()instanceof Function||this.value()!==e)&&this.callback())},r.prototype.value=function(){if(o(this.target))return this.get(this.key,this.target)},r.prototype.setValue=function(t){o(this.target)&&this.adapter(this.key).set(this.target,this.key.path,t)},r.prototype.get=function(t,e){return this.adapter(t).get(e,t.path)},r.prototype.set=function(t,e,i,n){var s=t?"observe":"unobserve";this.adapter(e)[s](i,e.path,n)},r.prototype.interfaces=function(){var t=Object.keys(this.options.adapters);return Object.keys(i.adapters).forEach(function(e){~t.indexOf(e)||t.push(e)}),t},r.prototype.adapter=function(t){return this.options.adapters[t.i]||i.adapters[t.i]},r.prototype.unobserve=function(){var t;this.tokens.forEach(function(e,i){(t=this.objectPath[i])&&this.set(!1,e,t,this.update)},this),o(this.target)&&this.set(!1,this.key,this.target,this.callback)},void 0!==t&&t.exports?t.exports=i:(n=[],void 0!==(s=function(){return this.sightglass=i}.apply(e,n))&&(t.exports=s))}).call(this)},15:function(t,e,i){i(1),t.exports=i(16)},16:function(t,e,i){(function(t,n){var s,r;(function(){var o,u,h,l,a,p=function(t,e){return function(){return t.apply(e,arguments)}},c=[].slice,d={}.hasOwnProperty,f=function(t,e){function i(){this.constructor=t}for(var n in e)d.call(e,n)&&(t[n]=e[n]);return i.prototype=e.prototype,t.prototype=new i,t.__super__=e.prototype,t},b=[].indexOf||function(t){for(var e=0,i=this.length;i>e;e++)if(e in this&&this[e]===t)return e;return-1};o={options:["prefix","templateDelimiters","rootInterface","preloadData","handler","executeFunctions"],extensions:["binders","formatters","components","adapters"],public:{binders:{},components:{},formatters:{},adapters:{},prefix:"rv",templateDelimiters:["{","}"],rootInterface:".",preloadData:!0,executeFunctions:!1,iterationAlias:function(t){return"%"+t+"%"},handler:function(t,e,i){return this.call(t,e,i.view.models)},configure:function(t){var e,i,n,s;null==t&&(t={});for(n in t)if(s=t[n],"binders"===n||"components"===n||"formatters"===n||"adapters"===n)for(i in s)e=s[i],o[n][i]=e;else o.public[n]=s},bind:function(t,e,i){var n;return null==e&&(e={}),null==i&&(i={}),n=new o.View(t,e,i),n.bind(),n},init:function(t,e,i){var n,s,r;if(null==i&&(i={}),null==e&&(e=document.createElement("div")),t=o.public.components[t],(s=t.template.call(this,e))instanceof HTMLElement){for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(s)}else e.innerHTML=s;return n=t.initialize.call(this,e,i),r=new o.View(e,n),r.bind(),r}}},t||window.$?(h=t||window.$,a="on"in h.prototype?["on","off"]:["bind","unbind"],u=a[0],l=a[1],o.Util={bindEvent:function(t,e,i){return h(t)[u](e,i)},unbindEvent:function(t,e,i){return h(t)[l](e,i)},getInputValue:function(t){var e;return e=h(t),"checkbox"===e.attr("type")?e.is(":checked"):e.val()}}):o.Util={bindEvent:function(){return"addEventListener"in window?function(t,e,i){return t.addEventListener(e,i,!1)}:function(t,e,i){return t.attachEvent("on"+e,i)}}(),unbindEvent:function(){return"removeEventListener"in window?function(t,e,i){return t.removeEventListener(e,i,!1)}:function(t,e,i){return t.detachEvent("on"+e,i)}}(),getInputValue:function(t){var e,i,n,s;if("checkbox"===t.type)return t.checked;if("select-multiple"===t.type){for(s=[],i=0,n=t.length;n>i;i++)e=t[i],e.selected&&s.push(e.value);return s}return t.value}},o.TypeParser=function(){function t(){}return t.types={primitive:0,keypath:1},t.parse=function(t){return/^'.*'$|^".*"$/.test(t)?{type:this.types.primitive,value:t.slice(1,-1)}:"true"===t?{type:this.types.primitive,value:!0}:"false"===t?{type:this.types.primitive,value:!1}:"null"===t?{type:this.types.primitive,value:null}:"undefined"===t?{type:this.types.primitive,value:void 0}:""===t?{type:this.types.primitive,value:void 0}:!1===isNaN(Number(t))?{type:this.types.primitive,value:Number(t)}:{type:this.types.keypath,value:t}},t}(),o.TextTemplateParser=function(){function t(){}return t.types={text:0,binding:1},t.parse=function(t,e){var i,n,s,r,o,u,h;for(u=[],r=t.length,i=0,n=0;r>n;){if(0>(i=t.indexOf(e[0],n))){u.push({type:this.types.text,value:t.slice(n)});break}if(i>0&&i>n&&u.push({type:this.types.text,value:t.slice(n,i)}),n=i+e[0].length,0>(i=t.indexOf(e[1],n))){o=t.slice(n-e[1].length),s=u[u.length-1],(null!=s?s.type:void 0)===this.types.text?s.value+=o:u.push({type:this.types.text,value:o});break}h=t.slice(n,i).trim(),u.push({type:this.types.binding,value:h}),n=i+e[1].length}return u},t}(),o.View=function(){function t(t,e,i){var n,s,r,u,h,l,a,c,d,f,b,v,y;for(this.els=t,this.models=e,null==i&&(i={}),this.update=p(this.update,this),this.publish=p(this.publish,this),this.sync=p(this.sync,this),this.unbind=p(this.unbind,this),this.bind=p(this.bind,this),this.select=p(this.select,this),this.traverse=p(this.traverse,this),this.build=p(this.build,this),this.buildBinding=p(this.buildBinding,this),this.bindingRegExp=p(this.bindingRegExp,this),this.options=p(this.options,this),this.els.jquery||this.els instanceof Array||(this.els=[this.els]),d=o.extensions,h=0,a=d.length;a>h;h++){if(s=d[h],this[s]={},i[s]){f=i[s];for(n in f)r=f[n],this[s][n]=r}b=o.public[s];for(n in b)r=b[n],null==(u=this[s])[n]&&(u[n]=r)}for(v=o.options,l=0,c=v.length;c>l;l++)s=v[l],this[s]=null!=(y=i[s])?y:o.public[s];this.build()}return t.prototype.options=function(){var t,e,i,n,s;for(e={},s=o.extensions.concat(o.options),i=0,n=s.length;n>i;i++)t=s[i],e[t]=this[t];return e},t.prototype.bindingRegExp=function(){return new RegExp("^"+this.prefix+"-")},t.prototype.buildBinding=function(t,e,i,n){var s,r,u,h,l,a,p;return l={},p=function(){var t,e,i,s;for(i=n.match(/((?:'[^']*')*(?:(?:[^\|']*(?:'[^']*')+[^\|']*)+|[^\|]+))|^$/g),s=[],t=0,e=i.length;e>t;t++)a=i[t],s.push(a.trim());return s}(),s=function(){var t,e,i,n;for(i=p.shift().split("<"),n=[],t=0,e=i.length;e>t;t++)r=i[t],n.push(r.trim());return n}(),h=s.shift(),l.formatters=p,(u=s.shift())&&(l.dependencies=u.split(/\s+/)),this.bindings.push(new o[t](this,e,i,h,l))},t.prototype.build=function(){var t,e,i,n,s;for(this.bindings=[],e=function(t){return function(i){var n,s,r,u,h,l,a,p,c,d,f,b,v;if(3===i.nodeType){if(h=o.TextTemplateParser,(r=t.templateDelimiters)&&(p=h.parse(i.data,r)).length&&(1!==p.length||p[0].type!==h.types.text)){for(c=0,f=p.length;f>c;c++)a=p[c],l=document.createTextNode(a.value),i.parentNode.insertBefore(l,i),1===a.type&&t.buildBinding("TextBinding",l,null,a.value);i.parentNode.removeChild(i)}}else 1===i.nodeType&&(n=t.traverse(i));if(!n)for(v=function(){var t,e,n,s;for(n=i.childNodes,s=[],t=0,e=n.length;e>t;t++)u=n[t],s.push(u);return s}(),d=0,b=v.length;b>d;d++)s=v[d],e(s)}}(this),s=this.els,i=0,n=s.length;n>i;i++)t=s[i],e(t);this.bindings.sort(function(t,e){var i,n;return((null!=(i=e.binder)?i.priority:void 0)||0)-((null!=(n=t.binder)?n.priority:void 0)||0)})},t.prototype.traverse=function(t){var e,i,n,s,r,u,h,l,a,p,c,d,f,b,v,y;for(s=this.bindingRegExp(),r="SCRIPT"===t.nodeName||"STYLE"===t.nodeName,b=t.attributes,p=0,d=b.length;d>p;p++)if(e=b[p],s.test(e.name)){if(l=e.name.replace(s,""),!(n=this.binders[l])){v=this.binders;for(u in v)a=v[u],"*"!==u&&-1!==u.indexOf("*")&&(h=new RegExp("^"+u.replace(/\*/g,".+")+"$"),h.test(l)&&(n=a))}n||(n=this.binders["*"]),n.block&&(r=!0,i=[e])}for(y=i||t.attributes,c=0,f=y.length;f>c;c++)e=y[c],s.test(e.name)&&(l=e.name.replace(s,""),this.buildBinding("Binding",t,l,e.value));return r||(l=t.nodeName.toLowerCase(),this.components[l]&&!t._bound&&(this.bindings.push(new o.ComponentBinding(this,t,l)),r=!0)),r},t.prototype.select=function(t){var e,i,n,s,r;for(s=this.bindings,r=[],i=0,n=s.length;n>i;i++)e=s[i],t(e)&&r.push(e);return r},t.prototype.bind=function(){var t,e,i,n;for(n=this.bindings,e=0,i=n.length;i>e;e++)t=n[e],t.bind()},t.prototype.unbind=function(){var t,e,i,n;for(n=this.bindings,e=0,i=n.length;i>e;e++)t=n[e],t.unbind()},t.prototype.sync=function(){var t,e,i,n;for(n=this.bindings,e=0,i=n.length;i>e;e++)t=n[e],"function"==typeof t.sync&&t.sync()},t.prototype.publish=function(){var t,e,i,n;for(n=this.select(function(t){var e;return null!=(e=t.binder)?e.publishes:void 0}),e=0,i=n.length;i>e;e++)t=n[e],t.publish()},t.prototype.update=function(t){var e,i,n,s,r,o;null==t&&(t={});for(i in t)n=t[i],this.models[i]=n;for(o=this.bindings,s=0,r=o.length;r>s;s++)e=o[s],"function"==typeof e.update&&e.update(t)},t}(),o.Binding=function(){function t(t,e,i,n,s){this.view=t,this.el=e,this.type=i,this.keypath=n,this.options=null!=s?s:{},this.getValue=p(this.getValue,this),this.update=p(this.update,this),this.unbind=p(this.unbind,this),this.bind=p(this.bind,this),this.publish=p(this.publish,this),this.sync=p(this.sync,this),this.set=p(this.set,this),this.eventHandler=p(this.eventHandler,this),this.formattedValue=p(this.formattedValue,this),this.parseFormatterArguments=p(this.parseFormatterArguments,this),this.parseTarget=p(this.parseTarget,this),this.observe=p(this.observe,this),this.setBinder=p(this.setBinder,this),this.formatters=this.options.formatters||[],this.dependencies=[],this.formatterObservers={},this.model=void 0,this.setBinder()}return t.prototype.setBinder=function(){var t,e,i,n;if(!(this.binder=this.view.binders[this.type])){n=this.view.binders;for(t in n)i=n[t],"*"!==t&&-1!==t.indexOf("*")&&(e=new RegExp("^"+t.replace(/\*/g,".+")+"$"),e.test(this.type)&&(this.binder=i,this.args=new RegExp("^"+t.replace(/\*/g,"(.+)")+"$").exec(this.type),this.args.shift()))}return this.binder||(this.binder=this.view.binders["*"]),this.binder instanceof Function?this.binder={routine:this.binder}:void 0},t.prototype.observe=function(t,e,i){return o.sightglass(t,e,i,{root:this.view.rootInterface,adapters:this.view.adapters})},t.prototype.parseTarget=function(){var t;return t=o.TypeParser.parse(this.keypath),t.type===o.TypeParser.types.primitive?this.value=t.value:(this.observer=this.observe(this.view.models,this.keypath,this.sync),this.model=this.observer.target)},t.prototype.parseFormatterArguments=function(t,e){var i,n,s,r,u,h,l;for(t=function(){var e,i,s;for(s=[],e=0,i=t.length;i>e;e++)n=t[e],s.push(o.TypeParser.parse(n));return s}(),r=[],i=h=0,l=t.length;l>h;i=++h)n=t[i],r.push(n.type===o.TypeParser.types.primitive?n.value:((u=this.formatterObservers)[e]||(u[e]={}),(s=this.formatterObservers[e][i])||(s=this.observe(this.view.models,n.value,this.sync),this.formatterObservers[e][i]=s),s.value()));return r},t.prototype.formattedValue=function(t){var e,i,n,s,r,o,u,h,l;for(h=this.formatters,i=o=0,u=h.length;u>o;i=++o)n=h[i],e=n.match(/[^\s']+|'([^']|'[^\s])*'|"([^"]|"[^\s])*"/g),s=e.shift(),n=this.view.formatters[s],r=this.parseFormatterArguments(e,i),(null!=n?n.read:void 0)instanceof Function?t=(l=n.read).call.apply(l,[this.model,t].concat(c.call(r))):n instanceof Function&&(t=n.call.apply(n,[this.model,t].concat(c.call(r))));return t},t.prototype.eventHandler=function(t){var e,i;return i=(e=this).view.handler,function(n){return i.call(t,this,n,e)}},t.prototype.set=function(t){var e;return t=t instanceof Function&&!this.binder.function&&o.public.executeFunctions?this.formattedValue(t.call(this.model)):this.formattedValue(t),null!=(e=this.binder.routine)?e.call(this,this.el,t):void 0},t.prototype.sync=function(){var t,e;return this.set(function(){var i,n,s,r,o,u,h;if(this.observer){if(this.model!==this.observer.target){for(o=this.dependencies,i=0,s=o.length;s>i;i++)e=o[i],e.unobserve();if(this.dependencies=[],null!=(this.model=this.observer.target)&&(null!=(u=this.options.dependencies)?u.length:void 0))for(h=this.options.dependencies,n=0,r=h.length;r>n;n++)t=h[n],e=this.observe(this.model,t,this.sync),this.dependencies.push(e)}return this.observer.value()}return this.value}.call(this))},t.prototype.publish=function(){var t,e,i,n,s,r,o,u,h,l,a,p,d;if(this.observer){for(u=this.getValue(this.el),r=this.formatters.length-1,a=this.formatters.slice(0).reverse(),i=h=0,l=a.length;l>h;i=++h)n=a[i],e=r-i,t=n.split(/\s+/),s=t.shift(),o=this.parseFormatterArguments(t,e),(null!=(p=this.view.formatters[s])?p.publish:void 0)&&(u=(d=this.view.formatters[s]).publish.apply(d,[u].concat(c.call(o))));return this.observer.setValue(u)}},t.prototype.bind=function(){var t,e,i,n,s,r,o;if(this.parseTarget(),null!=(s=this.binder.bind)&&s.call(this,this.el),null!=this.model&&(null!=(r=this.options.dependencies)?r.length:void 0))for(o=this.options.dependencies,i=0,n=o.length;n>i;i++)t=o[i],e=this.observe(this.model,t,this.sync),this.dependencies.push(e);return this.view.preloadData?this.sync():void 0},t.prototype.unbind=function(){var t,e,i,n,s,r,o,u,h,l;for(null!=(o=this.binder.unbind)&&o.call(this,this.el),null!=(u=this.observer)&&u.unobserve(),h=this.dependencies,s=0,r=h.length;r>s;s++)n=h[s],n.unobserve();this.dependencies=[],l=this.formatterObservers;for(i in l){e=l[i];for(t in e)n=e[t],n.unobserve()}return this.formatterObservers={}},t.prototype.update=function(t){var e,i;return null==t&&(t={}),this.model=null!=(e=this.observer)?e.target:void 0,null!=(i=this.binder.update)?i.call(this,t):void 0},t.prototype.getValue=function(t){return this.binder&&null!=this.binder.getValue?this.binder.getValue.call(this,t):o.Util.getInputValue(t)},t}(),o.ComponentBinding=function(t){function e(t,e,i){var n,s,r,u,h,l,a,c;for(this.view=t,this.el=e,this.type=i,this.unbind=p(this.unbind,this),this.bind=p(this.bind,this),this.locals=p(this.locals,this),this.component=this.view.components[this.type],this.static={},this.observers={},this.upstreamObservers={},s=t.bindingRegExp(),a=this.el.attributes||[],h=0,l=a.length;l>h;h++)n=a[h],s.test(n.name)||(r=this.camelCase(n.name),u=o.TypeParser.parse(n.value),b.call(null!=(c=this.component.static)?c:[],r)>=0?this.static[r]=n.value:u.type===o.TypeParser.types.primitive?this.static[r]=u.value:this.observers[r]=n.value)}return f(e,t),e.prototype.sync=function(){},e.prototype.update=function(){},e.prototype.publish=function(){},e.prototype.locals=function(){var t,e,i,n,s,r;i={},s=this.static;for(t in s)n=s[t],i[t]=n;r=this.observers;for(t in r)e=r[t],i[t]=e.value();return i},e.prototype.camelCase=function(t){return t.replace(/-([a-z])/g,function(t){return t[1].toUpperCase()})},e.prototype.bind=function(){var t,e,i,n,s,r,u,h,l,a,p,c,d,f,b,v,y,g,m,k;if(!this.bound){f=this.observers;for(e in f)i=f[e],this.observers[e]=this.observe(this.view.models,i,function(t){return function(e){return function(){return t.componentView.models[e]=t.observers[e].value()}}}(this).call(this,e));this.bound=!0}if(null!=this.componentView)this.componentView.bind();else{for(this.el.innerHTML=this.component.template.call(this),u=this.component.initialize.call(this,this.el,this.locals()),this.el._bound=!0,r={},b=o.extensions,a=0,c=b.length;c>a;a++){if(s=b[a],r[s]={},this.component[s]){v=this.component[s];for(t in v)h=v[t],r[s][t]=h}y=this.view[s];for(t in y)h=y[t],null==(l=r[s])[t]&&(l[t]=h)}for(g=o.options,p=0,d=g.length;d>p;p++)s=g[p],r[s]=null!=(m=this.component[s])?m:this.view[s];this.componentView=new o.View(Array.prototype.slice.call(this.el.childNodes),u,r),this.componentView.bind(),k=this.observers;for(e in k)n=k[e],this.upstreamObservers[e]=this.observe(this.componentView.models,e,function(t){return function(e,i){return function(){return i.setValue(t.componentView.models[e])}}}(this).call(this,e,n))}},e.prototype.unbind=function(){var t,e,i,n,s;i=this.upstreamObservers;for(t in i)e=i[t],e.unobserve();n=this.observers;for(t in n)e=n[t],e.unobserve();return null!=(s=this.componentView)?s.unbind.call(this):void 0},e}(o.Binding),o.TextBinding=function(t){function e(t,e,i,n,s){this.view=t,this.el=e,this.type=i,this.keypath=n,this.options=null!=s?s:{},this.sync=p(this.sync,this),this.formatters=this.options.formatters||[],this.dependencies=[],this.formatterObservers={}}return f(e,t),e.prototype.binder={routine:function(t,e){return t.data=null!=e?e:""}},e.prototype.sync=function(){return e.__super__.sync.apply(this,arguments)},e}(o.Binding),o.public.binders.text=function(t,e){return null!=t.textContent?t.textContent=null!=e?e:"":t.innerText=null!=e?e:""},o.public.binders.html=function(t,e){return t.innerHTML=null!=e?e:""},o.public.binders.show=function(t,e){return t.style.display=e?"":"none"},o.public.binders.hide=function(t,e){return t.style.display=e?"none":""},o.public.binders.enabled=function(t,e){return t.disabled=!e},o.public.binders.disabled=function(t,e){return t.disabled=!!e},o.public.binders.checked={publishes:!0,priority:2e3,bind:function(t){return o.Util.bindEvent(t,"change",this.publish)},unbind:function(t){return o.Util.unbindEvent(t,"change",this.publish)},routine:function(t,e){var i;return t.checked="radio"===t.type?(null!=(i=t.value)?i.toString():void 0)===(null!=e?e.toString():void 0):!!e}},o.public.binders.unchecked={publishes:!0,priority:2e3,bind:function(t){return o.Util.bindEvent(t,"change",this.publish)},unbind:function(t){return o.Util.unbindEvent(t,"change",this.publish)},routine:function(t,e){var i;return t.checked="radio"===t.type?(null!=(i=t.value)?i.toString():void 0)!==(null!=e?e.toString():void 0):!e}},o.public.binders.value={publishes:!0,priority:3e3,bind:function(t){return"INPUT"!==t.tagName||"radio"!==t.type?(this.event="SELECT"===t.tagName?"change":"input",o.Util.bindEvent(t,this.event,this.publish)):void 0},unbind:function(t){return"INPUT"!==t.tagName||"radio"!==t.type?o.Util.unbindEvent(t,this.event,this.publish):void 0},routine:function(e,i){var n,s,r,o,u,l,a;if("INPUT"===e.tagName&&"radio"===e.type)return e.setAttribute("value",i);if(null!=t){if(e=h(e),(null!=i?i.toString():void 0)!==(null!=(o=e.val())?o.toString():void 0))return e.val(null!=i?i:"")}else if("select-multiple"===e.type){if(null!=i){for(a=[],s=0,r=e.length;r>s;s++)n=e[s],a.push(n.selected=(u=n.value,b.call(i,u)>=0));return a}}else if((null!=i?i.toString():void 0)!==(null!=(l=e.value)?l.toString():void 0))return e.value=null!=i?i:""}},o.public.binders.if={block:!0,priority:4e3,bind:function(t){var e,i;return null==this.marker?(e=[this.view.prefix,this.type].join("-").replace("--","-"),i=t.getAttribute(e),this.marker=document.createComment(" rivets: "+this.type+" "+i+" "),this.bound=!1,t.removeAttribute(e),t.parentNode.insertBefore(this.marker,t),t.parentNode.removeChild(t)):void 0},unbind:function(){return this.nested?(this.nested.unbind(),this.bound=!1):void 0},routine:function(t,e){var i,n,s,r;if(!!e==!this.bound){if(e){s={},r=this.view.models;for(i in r)n=r[i],s[i]=n;return(this.nested||(this.nested=new o.View(t,s,this.view.options()))).bind(),this.marker.parentNode.insertBefore(t,this.marker.nextSibling),this.bound=!0}return t.parentNode.removeChild(t),this.nested.unbind(),this.bound=!1}},update:function(t){var e;return null!=(e=this.nested)?e.update(t):void 0}},o.public.binders.unless={block:!0,priority:4e3,bind:function(t){return o.public.binders.if.bind.call(this,t)},unbind:function(){return o.public.binders.if.unbind.call(this)},routine:function(t,e){return o.public.binders.if.routine.call(this,t,!e)},update:function(t){return o.public.binders.if.update.call(this,t)}},o.public.binders["on-*"]={function:!0,priority:1e3,unbind:function(t){return this.handler?o.Util.unbindEvent(t,this.args[0],this.handler):void 0},routine:function(t,e){return this.handler&&o.Util.unbindEvent(t,this.args[0],this.handler),o.Util.bindEvent(t,this.args[0],this.handler=this.eventHandler(e))}},o.public.binders["each-*"]={block:!0,priority:4e3,bind:function(t){var e,i,n,s,r;if(null==this.marker)e=[this.view.prefix,this.type].join("-").replace("--","-"),this.marker=document.createComment(" rivets: "+this.type+" "),this.iterated=[],t.removeAttribute(e),t.parentNode.insertBefore(this.marker,t),t.parentNode.removeChild(t);else for(r=this.iterated,n=0,s=r.length;s>n;n++)i=r[n],i.bind()},unbind:function(){var t,e,i,n;if(null!=this.iterated)for(n=this.iterated,e=0,i=n.length;i>e;e++)t=n[e],t.unbind()},routine:function(t,e){var i,n,s,r,u,h,l,a,p,c,d,f,b,v,y,g,m,k,w;if(h=this.args[0],e=e||[],this.iterated.length>e.length)for(m=Array(this.iterated.length-e.length),d=0,v=m.length;v>d;d++)m[d],c=this.iterated.pop(),c.unbind(),this.marker.parentNode.removeChild(c.els[0]);for(s=f=0,y=e.length;y>f;s=++f)if(u=e[s],n={index:s},n[o.public.iterationAlias(h)]=s,n[h]=u,null==this.iterated[s]){k=this.view.models;for(r in k)u=k[r],null==n[r]&&(n[r]=u);a=this.iterated.length?this.iterated[this.iterated.length-1].els[0]:this.marker,l=this.view.options(),l.preloadData=!0,p=t.cloneNode(!0),c=new o.View(p,n,l),c.bind(),this.iterated.push(c),this.marker.parentNode.insertBefore(p,a.nextSibling)}else this.iterated[s].models[h]!==u&&this.iterated[s].update(n);if("OPTION"===t.nodeName)for(w=this.view.bindings,b=0,g=w.length;g>b;b++)i=w[b],i.el===this.marker.parentNode&&"value"===i.type&&i.sync()},update:function(t){var e,i,n,s,r,o,u;e={};for(i in t)n=t[i],i!==this.args[0]&&(e[i]=n);for(u=this.iterated,r=0,o=u.length;o>r;r++)s=u[r],s.update(e)}},o.public.binders["class-*"]=function(t,e){var i;return i=" "+t.className+" ",!e==(-1!==i.indexOf(" "+this.args[0]+" "))?t.className=e?t.className+" "+this.args[0]:i.replace(" "+this.args[0]+" "," ").trim():void 0},o.public.binders["*"]=function(t,e){return null!=e?t.setAttribute(this.type,e):t.removeAttribute(this.type)},o.public.formatters.call=function(){var t,e;return e=arguments[0],t=2<=arguments.length?c.call(arguments,1):[],e.call.apply(e,[this].concat(c.call(t)))},o.public.adapters["."]={id:"_rv",counter:0,weakmap:{},weakReference:function(t){var e,i,n;return t.hasOwnProperty(this.id)||(e=this.counter++,Object.defineProperty(t,this.id,{value:e})),(i=this.weakmap)[n=t[this.id]]||(i[n]={callbacks:{}})},cleanupWeakReference:function(t,e){return Object.keys(t.callbacks).length||t.pointers&&Object.keys(t.pointers).length?void 0:delete this.weakmap[e]},stubFunction:function(t,e){var i,n,s;return n=t[e],i=this.weakReference(t),s=this.weakmap,t[e]=function(){var e,r,o,u,h,l,a,p,c;o=n.apply(t,arguments),l=i.pointers;for(r in l)for(e=l[r],c=null!=(a=null!=(p=s[r])?p.callbacks[e]:void 0)?a:[],u=0,h=c.length;h>u;u++)(0,c[u])();return o}},observeMutations:function(t,e,i){var n,s,r,o,u,h;if(Array.isArray(t)){if(r=this.weakReference(t),null==r.pointers)for(r.pointers={},s=["push","pop","shift","unshift","sort","reverse","splice"],u=0,h=s.length;h>u;u++)n=s[u],this.stubFunction(t,n);if(null==(o=r.pointers)[e]&&(o[e]=[]),b.call(r.pointers[e],i)<0)return r.pointers[e].push(i)}},unobserveMutations:function(t,e,i){var n,s,r;return Array.isArray(t)&&null!=t[this.id]&&(s=this.weakmap[t[this.id]])&&(r=s.pointers[e])?((n=r.indexOf(i))>=0&&r.splice(n,1),r.length||delete s.pointers[e],this.cleanupWeakReference(s,t[this.id])):void 0},observe:function(t,e,i){var n,s,r;return n=this.weakReference(t).callbacks,null==n[e]&&(n[e]=[],s=Object.getOwnPropertyDescriptor(t,e),(null!=s?s.get:void 0)||(null!=s?s.set:void 0)||(r=t[e],Object.defineProperty(t,e,{enumerable:!0,get:function(){return r},set:function(i){return function(s){var o,u,h,l,a;if(s!==r&&(i.unobserveMutations(r,t[i.id],e),r=s,u=i.weakmap[t[i.id]])){if(n=u.callbacks,n[e])for(a=n[e].slice(),h=0,l=a.length;l>h;h++)o=a[h],b.call(n[e],o)>=0&&o();return i.observeMutations(s,t[i.id],e)}}}(this)}))),b.call(n[e],i)<0&&n[e].push(i),this.observeMutations(t[e],t[this.id],e)},unobserve:function(t,e,i){var n,s,r;return(r=this.weakmap[t[this.id]])&&(n=r.callbacks[e])?((s=n.indexOf(i))>=0&&(n.splice(s,1),n.length||(delete r.callbacks[e],this.unobserveMutations(t[e],t[this.id],e))),this.cleanupWeakReference(r,t[this.id])):void 0},get:function(t,e){return t[e]},set:function(t,e,i){return t[e]=i}},o.factory=function(t){return o.sightglass=t,o.public._=o,o.public},"object"==typeof(void 0!==n&&null!==n?n.exports:void 0)?n.exports=o.factory(i(1)):(s=[i(1)],void 0!==(r=function(t){return this.rivets=o.factory(t)}.apply(e,s))&&(n.exports=r))}).call(this)}).call(e,i(0),i(2)(t))},2:function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),t.webpackPolyfill=1),t}}})});
//# sourceMappingURL=vendor.js.map