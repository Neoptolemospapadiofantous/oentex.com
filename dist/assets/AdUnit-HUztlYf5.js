var o=Object.defineProperty;var c=(n,e,t)=>e in n?o(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var i=(n,e,t)=>c(n,typeof e!="symbol"?e+"":e,t);import{r as a,j as d}from"./heroui-0ik-TEjB.js";class l{constructor(){i(this,"isInitialized",!1);i(this,"consentPreferences",null);this.loadConsentFromStorage(),this.initializeAdSense()}loadConsentFromStorage(){try{const e=localStorage.getItem("oentex-consent");if(e){const t=JSON.parse(e);this.consentPreferences=t.preferences}}catch(e){console.warn("Failed to load consent preferences:",e)}}initializeAdSense(){var t;if(typeof window>"u")return;const e=document.createElement("script");e.async=!0,e.src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",e.setAttribute("data-ad-client","ca-pub-9090270214622092"),(t=this.consentPreferences)!=null&&t.marketing&&(document.head.appendChild(e),this.isInitialized=!0),window.adsbygoogle||(window.adsbygoogle=[])}updateConsent(e){this.consentPreferences=e,e.marketing&&!this.isInitialized?this.initializeAdSense():!e.marketing&&this.isInitialized&&this.disableAdSense()}disableAdSense(){document.querySelectorAll('script[src*="googlesyndication.com"]').forEach(s=>s.remove()),document.querySelectorAll(".adsbygoogle").forEach(s=>{s.innerHTML="",s.style.display="none"}),this.isInitialized=!1}pushAd(e){var t;if((t=this.consentPreferences)!=null&&t.marketing&&window.adsbygoogle)try{window.adsbygoogle.push({})}catch(s){console.warn("AdSense error:",s)}}canShowAds(){var e;return((e=this.consentPreferences)==null?void 0:e.marketing)===!0}}const r=new l,f=({className:n=""})=>{const e=a.useRef(null);return a.useEffect(()=>{e.current&&r.canShowAds()?(e.current.innerHTML=`
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-9090270214622092"
             data-ad-slot="3413714242"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      `,r.pushAd(e.current)):e.current&&(e.current.innerHTML=`
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
      `)},[]),d.jsx("div",{ref:e,className:`ad-unit ${n}`,style:{minHeight:"90px",margin:"20px 0"}})};export{f as A};
