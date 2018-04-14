!function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},n.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);class r{constructor(e,t,n,r,i){this.day=e,this.timeFrom=t,this.timeTo=n,this.title=r,this.id=i}setTimeFrom(e){this.timeFrom=e}setTimeTo(e){this.timeTo=e}setTitle(e){this.title=e}getTimeFromMinute(e){const t=this.timeFrom.split(":")[1];return e?t:parseInt(t)}getTimeFromHour(e){const t=this.timeFrom.split(":")[0];return e?t:parseInt(t)}getTimeFrom(){return this.timeFrom}getTimeToMinute(e){const t=this.timeTo.split(":")[1];return e?t:parseInt(t)}getTimeTo(){return this.timeTo}getBlockHeight(){let e=new Date(`2018/01/01 ${this.timeFrom}`);return 64*((new Date(`2018/01/01 ${this.timeTo}`)-e)/36e5)}}var i=(()=>{let e=[];return{getEvents:()=>e,addEvent:t=>(t.id=(()=>"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=16*Math.random()|0;return("x"==e?t:3&t|8).toString(16)}))(),e.push(t),localStorage.setItem("events",JSON.stringify(e)),t),loadEvents:()=>{const t=JSON.parse(localStorage.getItem("events"));t&&(e=t.map(e=>new r(e.day,e.timeFrom,e.timeTo,e.title,e.id)))},getEventById:t=>{return e.filter(e=>e.id===t)[0]},updateEvent:(t,n)=>{const r=e.findIndex(e=>e.id==t);e[r]=n,localStorage.setItem("events",JSON.stringify(e))},deleteEvent:t=>{e=e.filter(e=>e.id!==t),localStorage.setItem("events",JSON.stringify(e))},clearEvents:()=>{localStorage.removeItem("events")}}})();var a,o,s=(()=>{const e=["Sun","Mon","Tues","Wed","Thurs","Fri","Sat"],t=document.querySelector.bind(document),n=t("#table-head"),a=t("#table-body"),s=t("#btn-clear"),l=t("#event-ctx-dialog"),d=t("#event-ctx-dialog h3"),u=t("#close-event-ctx-dialog"),m=t(".btn-delete"),c=t("#add-event-form"),v=t("form #title"),p=t("#time-from"),g=t("#time-to");let h,f,y,x=!1;const T=()=>{const t=(e=>{const t=new Array;e.setDate(e.getDate()-e.getDay());for(let n=0;n<7;n++)t.push(new Date(e)),e.setDate(e.getDate()+1);return t})(new Date),r=t.map(t=>`<th>\n        ${e[t.getDay()]}<br/>\n        <span class="day-number">${t.getDate()}</span>\n      </th>`);r.unshift('<th id="time"></th>'),n.innerHTML=r.join("");const i=t.map(e=>`\n        <td data-day="${e.getDay()}">\n          ${E()}\n        </td>\n      `);i.unshift(`<td id="time-column">${$()}</td>`),a.innerHTML=i.join("")},E=()=>{const e=new Array;for(let t=0;t<24;t++){let n=t<10?"0"+t:t;e.push(`<div class="hour-block" data-hour="${n}"></div>`)}return e.join("")},$=()=>{const e=new Array;for(let t=0;t<24;t++){let n;const r=`\n        <div class="hour-wrapper">\n          <div class="hour">${n=(n=t%12)||12}${t>=12?"pm":"am"}</div>\n        </div>\n      `;e.push(r)}return e.join("")},F=e=>{p.value=e},b=e=>{g.value=e},I=(e,t)=>{return`${e<10?`0${e}`:`${e}`}:${t<10?`0${t}`:`${t}`}`},D=(e,t)=>{t?(d.textContent="Update event",m.style.display="inline-block"):(d.textContent="Add event",m.style.display="none"),l.style.display="block",l.style.top=e.pageY+"px",l.style.left=e.pageX+"px"},A=()=>{x=!1,v.value="",l.style.display="none"},N=e=>{const t=e.target.getAttribute("data-hour"),n=parseInt(t),i=(e=>{const t=e.pageY-e.target.offsetTop;return t>45?45:15*Math.floor(t/15)})(e);let a,s=I(n,i);if(s>="23:45")return;x=!0;const l=e.target.parentElement.getAttribute("data-day"),d=new r(l,s);f=d;const u=L();if(u){const e=k(u);a=(o=f,(new Date(`2018/01/01 ${e.getTimeFrom()}`)-new Date(`2018/01/01 ${o.getTimeFrom()}`))/36e5)<=1?e.getTimeFrom():I(n+1,i)}else a=23===n?I(n,45):I(n+1,i);d.setTimeFrom(s),d.setTimeTo(a),h=s,F(s),b(a),S(e,d)},S=(e,t)=>{let n=document.createElement("div");n.className="event pending-event",n.style.top=64*t.getTimeFromMinute()/60+"px",n.style.height=M(t.getTimeFrom(),t.getTimeTo())+"px",e.target.appendChild(n),y=n,D(e)},w=()=>{const e=document.querySelector(".pending-event");if(e)e.parentNode.removeChild(e);else{const e=i.getEventById(f.id);y.parentElement&&y.parentElement.removeChild(y),O(e)}A()},M=(e,t)=>{const n=new Date(`2018/01/01 ${e}`),r=(new Date(`2018/01/01 ${t}`)-n)/36e5;return Math.floor(64*r)},C=e=>e<10?`0${e}`:`${e}`,L=()=>{const e=f.day;let n=!1;for(var r=f.getTimeFromHour();r<24;r++){let a=`[data-day='${e}'] [data-hour='${C(r)}']`,o=t(a);if(o.childNodes.length>0)if(n=Array.from(o.childNodes).filter(e=>{let t=i.getEventById(e.getAttribute("data-id"));return!!t&&t.timeFrom>f.timeFrom})[0])return n}return n},k=e=>{const t=e.getAttribute("data-id");return i.getEventById(t)},B=e=>{if(""==e.target.value)return void F(h);if(e.target.value>=g.value){const[e,t]=g.value.split(":"),n=parseInt(e),r=parseInt(t),i=0===r?I(n-1,45):I(n,r-15);F(i)}const n=(()=>{const e=f.day;let n=!1;for(var r=f.getTimeFromHour();r>=0;r--){let a=`[data-day='${e}'] [data-hour='${C(r)}']`,o=t(a);if(o.childNodes.length>0){const e=Array.from(o.childNodes).filter(e=>{let t=i.getEventById(e.getAttribute("data-id"));return!!t&&t.timeTo<=f.timeFrom});if(n=e[e.length-1])return n}}return n})();if(n){const e=k(n);p.value<=e.getTimeTo()&&F(e.getTimeTo())}h=p.value;const r=f.day,a=p.value.split(":")[0],o=p.value.split(":")[1],s=t(`[data-day='${r}'] [data-hour='${a}']`);y.parentElement.removeChild(y),s.appendChild(y);const l=M(p.value,g.value);y.style.height=l+"px",y.style.top=64*o/60+"px"},H=()=>{u.addEventListener("click",()=>w()),s.addEventListener("click",()=>(()=>{if(A(),confirm("Remove all events?")){i.clearEvents();for(var e=document.getElementsByClassName("event");e[0];)e[0].parentNode.removeChild(e[0])}})()),m.addEventListener("click",e=>(e=e,e.preventDefault(),void(confirm("Are you sure?")&&(i.deleteEvent(f.id),y.parentNode.removeChild(y),A())))),c.addEventListener("submit",e=>(e=>{e.preventDefault(),f.setTitle(v.value),f.setTimeTo(g.value),f.setTimeFrom(p.value),f.id?i.updateEvent(f.id,f):(f=i.addEvent(f),document.querySelector(".pending-event").classList.remove("pending-event"));y.parentElement.removeChild(y),O(f),A()})(e)),p.addEventListener("input",e=>B(e)),g.addEventListener("input",e=>(e=>{if(e.target.value<=p.value){const[e,t]=p.value.split(":"),n=parseInt(e),r=parseInt(t),i=r>=45?I(n+1,0):I(n,r+15);b(i)}const t=L();if(t){const n=k(t);e.target.value>=n.getTimeFrom()&&b(n.getTimeFrom())}const n=M(p.value,g.value);y.style.height=n+"px"})(e)),document.addEventListener("click",e=>{e.target&&"hour-block"==e.target.className&&(x?w():N(e)),e.target&&"event"==e.target.className&&(x?w():(e=>{const t=e.target.getAttribute("data-id");x=!0,y=e.target,f=i.getEventById(t),v.value=f.title,h=f.getTimeFrom(),F(h),b(f.getTimeTo()),D(e,!0)})(e))})},O=e=>{const t=`[data-day='${e.day}'] [data-hour='${e.getTimeFromHour(!0)}']`,n=document.querySelector(t),r=document.createElement("div");r.className="event",r.innerHTML=`<p>${e.title}</p>`,r.setAttribute("data-id",e.id),r.setAttribute("title",e.title),r.style.top=64*e.getTimeFromMinute()/60+"px",r.style.height=e.getBlockHeight()+"px",n.appendChild(r)};return{startApp:()=>{console.log("starting app..."),i.loadEvents(),H(),T(),(()=>{let e=i.getEvents();0!=e.length&&e.forEach(e=>{O(e)})})()}}})();n(4);s.startApp()},,,,function(e,t){}]);