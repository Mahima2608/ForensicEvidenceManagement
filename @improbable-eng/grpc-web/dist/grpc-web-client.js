!function(e,t){for(var r in t)e[r]=t[r]}(exports,function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=10)}([function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(3);t.Metadata=n.BrowserHeaders},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.debug=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];console.debug?console.debug.apply(null,e):console.log.apply(null,e)}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(0),o=r(8),s=r(9),i=r(1),a=r(4),u=r(14);t.client=function(e,t){return new d(e,t)};var d=function(){function e(e,t){this.started=!1,this.sentFirstMessage=!1,this.completed=!1,this.closed=!1,this.finishedSending=!1,this.onHeadersCallbacks=[],this.onMessageCallbacks=[],this.onEndCallbacks=[],this.parser=new o.ChunkParser,this.methodDefinition=e,this.props=t,this.createTransport()}return e.prototype.createTransport=function(){var e=this.props.host+"/"+this.methodDefinition.service.serviceName+"/"+this.methodDefinition.methodName,t={methodDefinition:this.methodDefinition,debug:this.props.debug||!1,url:e,onHeaders:this.onTransportHeaders.bind(this),onChunk:this.onTransportChunk.bind(this),onEnd:this.onTransportEnd.bind(this)};this.props.transport?this.transport=this.props.transport(t):this.transport=a.makeDefaultTransport(t)},e.prototype.onTransportHeaders=function(e,t){if(this.props.debug&&i.debug("onHeaders",e,t),this.closed)this.props.debug&&i.debug("grpc.onHeaders received after request was closed - ignoring");else if(0===t);else{this.responseHeaders=e,this.props.debug&&i.debug("onHeaders.responseHeaders",JSON.stringify(this.responseHeaders,null,2));var r=c(e);this.props.debug&&i.debug("onHeaders.gRPCStatus",r);var n=r&&r>=0?r:s.httpStatusToCode(t);this.props.debug&&i.debug("onHeaders.code",n);var o=e.get("grpc-message")||[];if(this.props.debug&&i.debug("onHeaders.gRPCMessage",o),this.rawOnHeaders(e),n!==s.Code.OK){var a=this.decodeGRPCStatus(o[0]);this.rawOnError(n,a,e)}}},e.prototype.onTransportChunk=function(e){var t=this;if(this.closed)this.props.debug&&i.debug("grpc.onChunk received after request was closed - ignoring");else{var r=[];try{r=this.parser.parse(e)}catch(e){return this.props.debug&&i.debug("onChunk.parsing error",e,e.message),void this.rawOnError(s.Code.Internal,"parsing error: "+e.message)}r.forEach(function(e){if(e.chunkType===o.ChunkType.MESSAGE){var r=t.methodDefinition.responseType.deserializeBinary(e.data);t.rawOnMessage(r)}else e.chunkType===o.ChunkType.TRAILERS&&(t.responseHeaders?(t.responseTrailers=new n.Metadata(e.trailers),t.props.debug&&i.debug("onChunk.trailers",t.responseTrailers)):(t.responseHeaders=new n.Metadata(e.trailers),t.rawOnHeaders(t.responseHeaders)))})}},e.prototype.onTransportEnd=function(){if(this.props.debug&&i.debug("grpc.onEnd"),this.closed)this.props.debug&&i.debug("grpc.onEnd received after request was closed - ignoring");else if(void 0!==this.responseTrailers){var e=c(this.responseTrailers);if(null!==e){var t=this.responseTrailers.get("grpc-message"),r=this.decodeGRPCStatus(t[0]);this.rawOnEnd(e,r,this.responseTrailers)}else this.rawOnError(s.Code.Internal,"Response closed without grpc-status (Trailers provided)")}else{if(void 0===this.responseHeaders)return void this.rawOnError(s.Code.Unknown,"Response closed without headers");var n=c(this.responseHeaders),o=this.responseHeaders.get("grpc-message");if(this.props.debug&&i.debug("grpc.headers only response ",n,o),null===n)return void this.rawOnEnd(s.Code.Unknown,"Response closed without grpc-status (Headers only)",this.responseHeaders);var a=this.decodeGRPCStatus(o[0]);this.rawOnEnd(n,a,this.responseHeaders)}},e.prototype.decodeGRPCStatus=function(e){if(!e)return"";try{return decodeURIComponent(e)}catch(t){return e}},e.prototype.rawOnEnd=function(e,t,r){var n=this;this.props.debug&&i.debug("rawOnEnd",e,t,r),this.completed||(this.completed=!0,this.onEndCallbacks.forEach(function(o){if(!n.closed)try{o(e,t,r)}catch(e){setTimeout(function(){throw e})}}))},e.prototype.rawOnHeaders=function(e){this.props.debug&&i.debug("rawOnHeaders",e),this.completed||this.onHeadersCallbacks.forEach(function(t){try{t(e)}catch(e){setTimeout(function(){throw e})}})},e.prototype.rawOnError=function(e,t,r){var o=this;void 0===r&&(r=new n.Metadata),this.props.debug&&i.debug("rawOnError",e,t),this.completed||(this.completed=!0,this.onEndCallbacks.forEach(function(n){if(!o.closed)try{n(e,t,r)}catch(e){setTimeout(function(){throw e})}}))},e.prototype.rawOnMessage=function(e){var t=this;this.props.debug&&i.debug("rawOnMessage",e.toObject()),this.completed||this.closed||this.onMessageCallbacks.forEach(function(r){if(!t.closed)try{r(e)}catch(e){setTimeout(function(){throw e})}})},e.prototype.onHeaders=function(e){this.onHeadersCallbacks.push(e)},e.prototype.onMessage=function(e){this.onMessageCallbacks.push(e)},e.prototype.onEnd=function(e){this.onEndCallbacks.push(e)},e.prototype.start=function(e){if(this.started)throw new Error("Client already started - cannot .start()");this.started=!0;var t=new n.Metadata(e||{});t.set("content-type","application/grpc-web+proto"),t.set("x-grpc-web","1"),this.transport.start(t)},e.prototype.send=function(e){if(!this.started)throw new Error("Client not started - .start() must be called before .send()");if(this.closed)throw new Error("Client already closed - cannot .send()");if(this.finishedSending)throw new Error("Client already finished sending - cannot .send()");if(!this.methodDefinition.requestStream&&this.sentFirstMessage)throw new Error("Message already sent for non-client-streaming method - cannot .send()");this.sentFirstMessage=!0;var t=u.frameRequest(e);this.transport.sendMessage(t)},e.prototype.finishSend=function(){if(!this.started)throw new Error("Client not started - .finishSend() must be called before .close()");if(this.closed)throw new Error("Client already closed - cannot .send()");if(this.finishedSending)throw new Error("Client already finished sending - cannot .finishSend()");this.finishedSending=!0,this.transport.finishSend()},e.prototype.close=function(){if(!this.started)throw new Error("Client not started - .start() must be called before .close()");if(this.closed)throw new Error("Client already closed - cannot .close()");this.closed=!0,this.props.debug&&i.debug("request.abort aborting request"),this.transport.cancel()},e}();function c(e){var t=e.get("grpc-status")||[];if(t.length>0)try{var r=t[0];return parseInt(r,10)}catch(e){return null}return null}},function(e,t,r){var n;n=function(){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.i=function(e){return e},r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:n})},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=1)}([function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(3);var o=function(){function e(e,t){void 0===e&&(e={}),void 0===t&&(t={splitValues:!1});var r,o=this;if(this.headersMap={},e)if("undefined"!=typeof Headers&&e instanceof Headers)n.getHeaderKeys(e).forEach(function(r){n.getHeaderValues(e,r).forEach(function(e){t.splitValues?o.append(r,n.splitHeaderValue(e)):o.append(r,e)})});else if("object"==typeof(r=e)&&"object"==typeof r.headersMap&&"function"==typeof r.forEach)e.forEach(function(e,t){o.append(e,t)});else if("undefined"!=typeof Map&&e instanceof Map){e.forEach(function(e,t){o.append(t,e)})}else"string"==typeof e?this.appendFromString(e):"object"==typeof e&&Object.getOwnPropertyNames(e).forEach(function(t){var r=e[t];Array.isArray(r)?r.forEach(function(e){o.append(t,e)}):o.append(t,r)})}return e.prototype.appendFromString=function(e){for(var t=e.split("\r\n"),r=0;r<t.length;r++){var n=t[r],o=n.indexOf(":");if(o>0){var s=n.substring(0,o).trim(),i=n.substring(o+1).trim();this.append(s,i)}}},e.prototype.delete=function(e,t){var r=n.normalizeName(e);if(void 0===t)delete this.headersMap[r];else{var o=this.headersMap[r];if(o){var s=o.indexOf(t);s>=0&&o.splice(s,1),0===o.length&&delete this.headersMap[r]}}},e.prototype.append=function(e,t){var r=this,o=n.normalizeName(e);Array.isArray(this.headersMap[o])||(this.headersMap[o]=[]),Array.isArray(t)?t.forEach(function(e){r.headersMap[o].push(n.normalizeValue(e))}):this.headersMap[o].push(n.normalizeValue(t))},e.prototype.set=function(e,t){var r=n.normalizeName(e);if(Array.isArray(t)){var o=[];t.forEach(function(e){o.push(n.normalizeValue(e))}),this.headersMap[r]=o}else this.headersMap[r]=[n.normalizeValue(t)]},e.prototype.has=function(e,t){var r=this.headersMap[n.normalizeName(e)];if(!Array.isArray(r))return!1;if(void 0!==t){var o=n.normalizeValue(t);return r.indexOf(o)>=0}return!0},e.prototype.get=function(e){var t=this.headersMap[n.normalizeName(e)];return void 0!==t?t.concat():[]},e.prototype.forEach=function(e){var t=this;Object.getOwnPropertyNames(this.headersMap).forEach(function(r){e(r,t.headersMap[r])},this)},e.prototype.toHeaders=function(){if("undefined"!=typeof Headers){var e=new Headers;return this.forEach(function(t,r){r.forEach(function(r){e.append(t,r)})}),e}throw new Error("Headers class is not defined")},e}();t.BrowserHeaders=o},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(0);t.BrowserHeaders=n.BrowserHeaders},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.iterateHeaders=function(e,t){for(var r=e[Symbol.iterator](),n=r.next();!n.done;)t(n.value[0]),n=r.next()},t.iterateHeadersKeys=function(e,t){for(var r=e.keys(),n=r.next();!n.done;)t(n.value),n=r.next()}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(2);function o(e){return e}t.normalizeName=function(e){if("string"!=typeof e&&(e=String(e)),/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(e))throw new TypeError("Invalid character in header field name");return e.toLowerCase()},t.normalizeValue=function(e){return"string"!=typeof e&&(e=String(e)),e},t.getHeaderValues=function(e,t){var r=o(e);if(r instanceof Headers&&r.getAll)return r.getAll(t);var n=r.get(t);return n&&"string"==typeof n?[n]:n},t.getHeaderKeys=function(e){var t=o(e),r={},s=[];return t.keys?n.iterateHeadersKeys(t,function(e){r[e]||(r[e]=!0,s.push(e))}):t.forEach?t.forEach(function(e,t){r[t]||(r[t]=!0,s.push(t))}):n.iterateHeaders(t,function(e){var t=e[0];r[t]||(r[t]=!0,s.push(t))}),s},t.splitHeaderValue=function(e){var t=[];return e.split(", ").forEach(function(e){e.split(",").forEach(function(e){t.push(e)})}),t}}])},e.exports=n()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(5),o=function(e){return n.CrossBrowserHttpTransport({withCredentials:!1})(e)};t.setDefaultTransportFactory=function(e){o=e},t.makeDefaultTransport=function(e){return o(e)}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(6),o=r(7);t.CrossBrowserHttpTransport=function(e){if(n.detectFetchSupport()){var t={credentials:e.withCredentials?"include":"same-origin"};return n.FetchReadableStreamTransport(t)}return o.XhrTransport({withCredentials:e.withCredentials})}},function(e,t,r){"use strict";var n=this&&this.__assign||function(){return(n=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)};Object.defineProperty(t,"__esModule",{value:!0});var o=r(0),s=r(1);t.FetchReadableStreamTransport=function(e){return function(t){return function(e,t){return e.debug&&s.debug("fetchRequest",e),new i(e,t)}(t,e)}};var i=function(){function e(e,t){this.cancelled=!1,this.controller=self.AbortController&&new AbortController,this.options=e,this.init=t}return e.prototype.pump=function(e,t){var r=this;if(this.reader=e,this.cancelled)return this.options.debug&&s.debug("Fetch.pump.cancel at first pump"),void this.reader.cancel();this.reader.read().then(function(e){if(e.done)return r.options.onEnd(),t;r.options.onChunk(e.value),r.pump(r.reader,t)}).catch(function(e){r.cancelled?r.options.debug&&s.debug("Fetch.catch - request cancelled"):(r.cancelled=!0,r.options.debug&&s.debug("Fetch.catch",e.message),r.options.onEnd(e))})},e.prototype.send=function(e){var t=this;fetch(this.options.url,n({},this.init,{headers:this.metadata.toHeaders(),method:"POST",body:e,signal:this.controller&&this.controller.signal})).then(function(e){if(t.options.debug&&s.debug("Fetch.response",e),t.options.onHeaders(new o.Metadata(e.headers),e.status),!e.body)return e;t.pump(e.body.getReader(),e)}).catch(function(e){t.cancelled?t.options.debug&&s.debug("Fetch.catch - request cancelled"):(t.cancelled=!0,t.options.debug&&s.debug("Fetch.catch",e.message),t.options.onEnd(e))})},e.prototype.sendMessage=function(e){this.send(e)},e.prototype.finishSend=function(){},e.prototype.start=function(e){this.metadata=e},e.prototype.cancel=function(){this.cancelled?this.options.debug&&s.debug("Fetch.abort.cancel already cancelled"):(this.cancelled=!0,this.reader?(this.options.debug&&s.debug("Fetch.abort.cancel"),this.reader.cancel()):this.options.debug&&s.debug("Fetch.abort.cancel before reader"),this.controller&&this.controller.abort())},e}();t.detectFetchSupport=function(){return"undefined"!=typeof Response&&Response.prototype.hasOwnProperty("body")&&"function"==typeof Headers}},function(e,t,r){"use strict";var n,o=this&&this.__extends||(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var s=r(0),i=r(1),a=r(11);t.XhrTransport=function(e){return function(t){if(a.detectMozXHRSupport())return new d(t,e);if(a.detectXHROverrideMimeTypeSupport())return new u(t,e);throw new Error("This environment's XHR implementation cannot support binary transfer.")}};var u=function(){function e(e,t){this.options=e,this.init=t}return e.prototype.onProgressEvent=function(){this.options.debug&&i.debug("XHR.onProgressEvent.length: ",this.xhr.response.length);var e=this.xhr.response.substr(this.index);this.index=this.xhr.response.length;var t=p(e);this.options.onChunk(t)},e.prototype.onLoadEvent=function(){this.options.debug&&i.debug("XHR.onLoadEvent"),this.options.onEnd()},e.prototype.onStateChange=function(){this.options.debug&&i.debug("XHR.onStateChange",this.xhr.readyState),this.xhr.readyState===XMLHttpRequest.HEADERS_RECEIVED&&this.options.onHeaders(new s.Metadata(this.xhr.getAllResponseHeaders()),this.xhr.status)},e.prototype.sendMessage=function(e){this.xhr.send(e)},e.prototype.finishSend=function(){},e.prototype.start=function(e){var t=this;this.metadata=e;var r=new XMLHttpRequest;this.xhr=r,r.open("POST",this.options.url),this.configureXhr(),this.metadata.forEach(function(e,t){r.setRequestHeader(e,t.join(", "))}),r.withCredentials=Boolean(this.init.withCredentials),r.addEventListener("readystatechange",this.onStateChange.bind(this)),r.addEventListener("progress",this.onProgressEvent.bind(this)),r.addEventListener("loadend",this.onLoadEvent.bind(this)),r.addEventListener("error",function(e){t.options.debug&&i.debug("XHR.error",e),t.options.onEnd(e.error)})},e.prototype.configureXhr=function(){this.xhr.responseType="text",this.xhr.overrideMimeType("text/plain; charset=x-user-defined")},e.prototype.cancel=function(){this.options.debug&&i.debug("XHR.abort"),this.xhr.abort()},e}();t.XHR=u;var d=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return o(t,e),t.prototype.configureXhr=function(){this.options.debug&&i.debug("MozXHR.configureXhr: setting responseType to 'moz-chunked-arraybuffer'"),this.xhr.responseType="moz-chunked-arraybuffer"},t.prototype.onProgressEvent=function(){var e=this.xhr.response;this.options.debug&&i.debug("MozXHR.onProgressEvent: ",new Uint8Array(e)),this.options.onChunk(new Uint8Array(e))},t}(u);function c(e,t){var r=e.charCodeAt(t);if(r>=55296&&r<=56319){var n=e.charCodeAt(t+1);n>=56320&&n<=57343&&(r=65536+(r-55296<<10)+(n-56320))}return r}function p(e){for(var t=new Uint8Array(e.length),r=0,n=0;n<e.length;n++){var o=String.prototype.codePointAt?e.codePointAt(n):c(e,n);t[r++]=255&o}return t}t.MozChunkedArrayBufferXHR=d,t.stringToArrayBuffer=p},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n,o=r(0),s=function(e){return 9===e||10===e||13===e};function i(e){return s(e)||e>=32&&e<=126}function a(e){for(var t=0;t!==e.length;++t)if(!i(e[t]))throw new Error("Metadata is not valid (printable) ASCII");return String.fromCharCode.apply(String,Array.prototype.slice.call(e))}function u(e){return 128==(128&e.getUint8(0))}function d(e){return e.getUint32(1,!1)}function c(e,t,r){return e.byteLength-t>=r}function p(e,t,r){if(e.slice)return e.slice(t,r);var n=e.length;void 0!==r&&(n=r);for(var o=new Uint8Array(n-t),s=0,i=t;i<n;i++)o[s++]=e[i];return o}t.decodeASCII=a,t.encodeASCII=function(e){for(var t=new Uint8Array(e.length),r=0;r!==e.length;++r){var n=e.charCodeAt(r);if(!i(n))throw new Error("Metadata contains invalid ASCII");t[r]=n}return t},function(e){e[e.MESSAGE=1]="MESSAGE",e[e.TRAILERS=2]="TRAILERS"}(n=t.ChunkType||(t.ChunkType={}));var h=function(){function e(){this.buffer=null,this.position=0}return e.prototype.parse=function(e,t){if(0===e.length&&t)return[];var r,s=[];if(null==this.buffer)this.buffer=e,this.position=0;else if(this.position===this.buffer.byteLength)this.buffer=e,this.position=0;else{var i=this.buffer.byteLength-this.position,h=new Uint8Array(i+e.byteLength),f=p(this.buffer,this.position);h.set(f,0);var l=new Uint8Array(e);h.set(l,i),this.buffer=h,this.position=0}for(;;){if(!c(this.buffer,this.position,5))return s;var g=p(this.buffer,this.position,this.position+5),b=new DataView(g.buffer,g.byteOffset,g.byteLength),y=d(b);if(!c(this.buffer,this.position,5+y))return s;var v=p(this.buffer,this.position+5,this.position+5+y);if(this.position+=5+y,u(b))return s.push({chunkType:n.TRAILERS,trailers:(r=v,new o.Metadata(a(r)))}),s;s.push({chunkType:n.MESSAGE,data:v})}},e}();t.ChunkParser=h},function(e,t,r){"use strict";var n;Object.defineProperty(t,"__esModule",{value:!0}),function(e){e[e.OK=0]="OK",e[e.Canceled=1]="Canceled",e[e.Unknown=2]="Unknown",e[e.InvalidArgument=3]="InvalidArgument",e[e.DeadlineExceeded=4]="DeadlineExceeded",e[e.NotFound=5]="NotFound",e[e.AlreadyExists=6]="AlreadyExists",e[e.PermissionDenied=7]="PermissionDenied",e[e.ResourceExhausted=8]="ResourceExhausted",e[e.FailedPrecondition=9]="FailedPrecondition",e[e.Aborted=10]="Aborted",e[e.OutOfRange=11]="OutOfRange",e[e.Unimplemented=12]="Unimplemented",e[e.Internal=13]="Internal",e[e.Unavailable=14]="Unavailable",e[e.DataLoss=15]="DataLoss",e[e.Unauthenticated=16]="Unauthenticated"}(n=t.Code||(t.Code={})),t.httpStatusToCode=function(e){switch(e){case 0:return n.Internal;case 200:return n.OK;case 400:return n.InvalidArgument;case 401:return n.Unauthenticated;case 403:return n.PermissionDenied;case 404:return n.NotFound;case 409:return n.Aborted;case 412:return n.FailedPrecondition;case 429:return n.ResourceExhausted;case 499:return n.Canceled;case 500:return n.Unknown;case 501:return n.Unimplemented;case 503:return n.Unavailable;case 504:return n.DeadlineExceeded;default:return n.Unknown}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(3),o=r(4),s=r(6),i=r(12),a=r(7),u=r(5),d=r(9),c=r(13),p=r(15),h=r(2);!function(e){e.setDefaultTransport=o.setDefaultTransportFactory,e.CrossBrowserHttpTransport=u.CrossBrowserHttpTransport,e.FetchReadableStreamTransport=s.FetchReadableStreamTransport,e.XhrTransport=a.XhrTransport,e.WebsocketTransport=i.WebsocketTransport,e.Code=d.Code,e.Metadata=n.BrowserHeaders,e.client=function(e,t){return h.client(e,t)},e.invoke=c.invoke,e.unary=p.unary}(t.grpc||(t.grpc={}))},function(e,t,r){"use strict";var n;function o(){if(void 0!==n)return n;if(XMLHttpRequest){n=new XMLHttpRequest;try{n.open("GET","https://localhost")}catch(e){}}return n}function s(e){var t=o();if(!t)return!1;try{return t.responseType=e,t.responseType===e}catch(e){}return!1}Object.defineProperty(t,"__esModule",{value:!0}),t.xhrSupportsResponseType=s,t.detectMozXHRSupport=function(){return"undefined"!=typeof XMLHttpRequest&&s("moz-chunked-arraybuffer")},t.detectXHROverrideMimeTypeSupport=function(){return"undefined"!=typeof XMLHttpRequest&&XMLHttpRequest.prototype.hasOwnProperty("overrideMimeType")}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n,o=r(1),s=r(8);!function(e){e[e.FINISH_SEND=1]="FINISH_SEND"}(n||(n={}));var i=new Uint8Array([1]);t.WebsocketTransport=function(){return function(e){return function(e){e.debug&&o.debug("websocketRequest",e);var t,r=function(e){if("https://"===e.substr(0,8))return"wss://"+e.substr(8);if("http://"===e.substr(0,7))return"ws://"+e.substr(7);throw new Error("Websocket transport constructed with non-https:// or http:// host.")}(e.url),a=[];function u(e){if(e===n.FINISH_SEND)t.send(i);else{var r=e,o=new Int8Array(r.byteLength+1);o.set(new Uint8Array([0])),o.set(r,1),t.send(o)}}return{sendMessage:function(e){t&&t.readyState!==t.CONNECTING?u(e):a.push(e)},finishSend:function(){t&&t.readyState!==t.CONNECTING?u(n.FINISH_SEND):a.push(n.FINISH_SEND)},start:function(n){(t=new WebSocket(r,["grpc-websockets"])).binaryType="arraybuffer",t.onopen=function(){var r;e.debug&&o.debug("websocketRequest.onopen"),t.send((r="",n.forEach(function(e,t){r+=e+": "+t.join(", ")+"\r\n"}),s.encodeASCII(r))),a.forEach(function(e){u(e)})},t.onclose=function(t){e.debug&&o.debug("websocketRequest.onclose",t),e.onEnd()},t.onerror=function(t){e.debug&&o.debug("websocketRequest.onerror",t)},t.onmessage=function(t){e.onChunk(new Uint8Array(t.data))}},cancel:function(){e.debug&&o.debug("websocket.abort"),t.close()}}}(e)}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(2);t.invoke=function(e,t){if(e.requestStream)throw new Error(".invoke cannot be used with client-streaming methods. Use .client instead.");var r=n.client(e,{host:t.host,transport:t.transport,debug:t.debug});return t.onHeaders&&r.onHeaders(t.onHeaders),t.onMessage&&r.onMessage(t.onMessage),t.onEnd&&r.onEnd(t.onEnd),r.start(t.metadata),r.send(t.request),r.finishSend(),{close:function(){r.close()}}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.frameRequest=function(e){var t=e.serializeBinary(),r=new ArrayBuffer(t.byteLength+5);return new DataView(r,1,4).setUint32(0,t.length,!1),new Uint8Array(r,5).set(t),new Uint8Array(r)}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(0),o=r(2);t.unary=function(e,t){if(e.responseStream)throw new Error(".unary cannot be used with server-streaming methods. Use .invoke or .client instead.");if(e.requestStream)throw new Error(".unary cannot be used with client-streaming methods. Use .client instead.");var r=null,s=null,i=o.client(e,{host:t.host,transport:t.transport,debug:t.debug});return i.onHeaders(function(e){r=e}),i.onMessage(function(e){s=e}),i.onEnd(function(e,o,i){t.onEnd({status:e,statusMessage:o,headers:r||new n.Metadata,message:s,trailers:i})}),i.start(t.metadata),i.send(t.request),i.finishSend(),{close:function(){i.close()}}}}]));