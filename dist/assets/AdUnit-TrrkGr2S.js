import{r as t,j as r}from"./heroui-0ik-TEjB.js";import{c as a}from"./index-J_PdArHL.js";const d=({className:n=""})=>{const e=t.useRef(null);return t.useEffect(()=>{e.current&&a.canShowAds()?(e.current.innerHTML=`
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-9090270214622092"
             data-ad-slot="3413714242"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      `,a.pushAd(e.current)):e.current&&(e.current.innerHTML=`
        <div style="
          background: #f5f5f5; 
          border: 1px dashed #ccc; 
          padding: 20px; 
          text-align: center; 
          color: #666;
          font-size: 14px;
          min-height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          Advertisement
        </div>
      `)},[]),r.jsx("div",{ref:e,className:`ad-unit ${n}`,style:{minHeight:"90px",margin:"20px auto",maxWidth:"728px",width:"100%",display:"block",textAlign:"center"}})};export{d as A};
