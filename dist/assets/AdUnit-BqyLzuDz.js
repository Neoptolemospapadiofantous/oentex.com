import{r as o,j as d}from"./heroui-0ik-TEjB.js";import{c as n}from"./index-B7y_UsvS.js";const l=({className:t=""})=>{const e=o.useRef(null);return o.useEffect(()=>{console.log("AdSense: AdUnit useEffect triggered"),console.log("AdSense: canShowAds:",n.canShowAds()),console.log("AdSense: window.adsbygoogle exists:",!!window.adsbygoogle),console.log("AdSense: adRef.current exists:",!!e.current),e.current&&n.canShowAds()?(e.current.innerHTML="",e.current.innerHTML=`
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-9090270214622092"
             data-ad-slot="3413714242"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      `,console.log("AdSense: Ad unit HTML inserted"),setTimeout(()=>{if(window.adsbygoogle&&e.current)try{const s=e.current.querySelector(".adsbygoogle");s&&!s.hasAttribute("data-adsbygoogle-status")?(window.adsbygoogle.push({}),console.log("AdSense: Push successful")):console.log("AdSense: Ad already loaded or element not found")}catch(s){console.error("AdSense: Push failed:",s)}},100)):e.current&&(console.log("AdSense: Showing placeholder - ads disabled"),e.current.innerHTML=`
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
      `)},[]),d.jsx("div",{ref:e,className:`ad-unit ${t}`,style:{minHeight:"90px",margin:"20px auto",maxWidth:"728px",width:"100%",display:"block",textAlign:"center"}})};export{l as A};
