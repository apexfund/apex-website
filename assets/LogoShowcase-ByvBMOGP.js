import{r as k,j as o}from"./index-Bg-ck8fQ.js";const Y=14;function $(n,m){if(n<=0)return[];if(n<=2)return[n];const x=Math.max(3,Math.round(Math.sqrt(n*1.5))),l=Math.max(x,Math.ceil(n/m)),c=Array.from({length:l},(t,a)=>{const d=2*(a+.5)/l-1;return Math.sqrt(Math.max(0,1-d*d))}),i=c.reduce((t,a)=>t+a,0),s=c.map(t=>Math.min(m,Math.max(1,Math.round(t/i*n)))),f=(l-1)/2,u=s.map((t,a)=>a).sort((t,a)=>Math.abs(t-f)-Math.abs(a-f)),v=[...u].reverse();let p=s.reduce((t,a)=>t+a,0),b=0;for(;p<n&&b++<1e3;){const t=u.find(a=>s[a]<m);if(t===void 0)break;s[t]++,p++}for(b=0;p>n&&b++<1e3;){const t=v.find(a=>s[a]>1);if(t===void 0)break;s[t]--,p--}return s}function D({logos:n,emptyLabel:m="Logos will appear here soon.",uniform:x=!1,sizeScale:l=1,light:c=!1}){const i=n.filter(e=>e.url),[s,f]=k.useState(360),u=k.useRef(null),v=k.useCallback(e=>{var h;if((h=u.current)==null||h.disconnect(),!e)return;f(e.clientWidth);const r=new ResizeObserver(R=>{for(const C of R)f(C.contentRect.width)});r.observe(e),u.current=r},[]),p=Math.max(i.length,1),b=(s<480?30:s<768?42:60)*l,t=Math.round(Math.max(24*l,Math.min(b,92*l/Math.sqrt(p)))),a=Math.round(t*3.2),d=Math.round(t*.46),g=Math.round(t*3.4),j=Math.round(t*.55),F=x?g:a,y=s<480?8:Y,N=Math.max(1,Math.min(i.length,Math.floor((s+y)/(F+y)))),W=s<640;let w;if(W){const e=Math.min(2,N);w=[];for(let r=i.length;r>0;r-=e)w.push(Math.min(e,r))}else w=$(i.length,N);const z=[];let M=0;for(const e of w)z.push(i.slice(M,M+e).map((r,h)=>({logo:r,index:M+h}))),M+=e;const q=(e,r)=>o.jsx("div",{className:"pl-cell",style:{animationDelay:`${Math.min(r*.06,.9)}s`},children:o.jsx("div",{className:"pl-float",style:{animationDelay:`${r%5*-1.2}s`},children:o.jsxs("div",{className:"pl-item",children:[o.jsx("div",{className:"pl-tile",style:{display:"flex",alignItems:"center",justifyContent:"center",...x?{width:g,height:g,padding:`${j}px`,borderRadius:18}:{padding:`${d}px ${Math.round(d*1.4)}px`,borderRadius:999},background:"#ffffff",border:c?"1px solid rgba(12,25,41,0.14)":"1px solid rgba(220,240,250,0.35)",boxShadow:c?"0 4px 14px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.7)":"0 6px 20px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.6)"},children:o.jsx("img",{src:e.url,alt:e.name,draggable:!1,style:x?{maxWidth:g-j*2,maxHeight:g-j*2,width:"auto",height:"auto",objectFit:"contain",display:"block"}:{height:t,width:"auto",maxWidth:a-d*2,objectFit:"contain",display:"block"}})}),e.name&&o.jsx("span",{className:"pl-name",children:e.name})]})})},e._id);return o.jsxs("div",{ref:v,className:c?"pl-light":void 0,style:{width:"100%"},children:[o.jsx("style",{children:`
        @keyframes plIn {
          from { opacity: 0; transform: translateY(16px) scale(0.94); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes plFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        .pl-cluster { display: flex; flex-direction: column; align-items: center; }
        .pl-row { display: flex; justify-content: center; flex-wrap: nowrap; }
        .pl-cell { opacity: 0; animation: plIn 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) forwards; }
        .pl-float { animation: plFloat 6s ease-in-out infinite; }
        .pl-item { position: relative; }
        .pl-tile {
          transition: transform 0.32s cubic-bezier(0.2, 0.7, 0.2, 1),
                      box-shadow 0.32s ease, border-color 0.32s ease, opacity 0.32s ease;
        }
        .pl-cluster:has(.pl-item:hover) .pl-tile { opacity: 0.5; }
        .pl-cluster .pl-item:hover .pl-tile {
          opacity: 1;
          transform: translateY(-6px) scale(1.06);
          box-shadow: 0 14px 34px rgba(0,0,0,0.4);
          border-color: rgba(150,191,207,0.9);
        }
        .pl-light .pl-item:hover .pl-tile {
          box-shadow: 0 12px 28px rgba(0,0,0,0.14);
          border-color: rgba(59,143,170,0.85);
        }
        .pl-name {
          position: absolute;
          left: 50%;
          top: calc(100% + 8px);
          transform: translate(-50%, -4px);
          white-space: nowrap;
          font-size: 12px;
          letter-spacing: 0.02em;
          color: #DCF0F8;
          background: rgba(12, 25, 41, 0.94);
          border: 1px solid rgba(150, 191, 207, 0.35);
          padding: 4px 10px;
          border-radius: 8px;
          opacity: 0;
          pointer-events: none;
          z-index: 5;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
          transition: opacity 0.28s ease, transform 0.28s ease;
        }
        .pl-item:hover .pl-name { opacity: 1; transform: translate(-50%, 0); }
        @media (prefers-reduced-motion: reduce) {
          .pl-cell { opacity: 1; animation: none; }
          .pl-float { animation: none; }
          .pl-tile, .pl-name { transition: none; }
        }
      `}),i.length===0?o.jsx("div",{style:{padding:"48px 0",textAlign:"center",color:c?"rgba(12,25,41,0.4)":"rgba(220,240,250,0.45)",fontSize:14},children:m}):o.jsx("div",{className:"pl-cluster",style:{gap:y,padding:"4px 0"},children:z.map((e,r)=>o.jsx("div",{className:"pl-row",style:{gap:y},children:e.map(({logo:h,index:R})=>q(h,R))},r))})]})}export{D as L};
