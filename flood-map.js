/* Map-only add-on for FloodScope. Keep beside index.html. */
(function(){
 const css=document.createElement("link");css.rel="stylesheet";css.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";document.head.appendChild(css);
 const lib=document.createElement("script");lib.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";lib.onload=start;lib.onerror=()=>console.error("Leaflet could not load; check internet.");document.head.appendChild(lib);
 function start(){
  const k=document.querySelector(".kpis");if(!k||document.getElementById("floodMapSection"))return;
  const st=document.createElement("style");st.textContent="#floodMapSection{padding:18px 19px;margin-bottom:16px}#floodMap{height:390px;width:100%;border-radius:10px;z-index:1}.map-legend{font-size:10px;color:#718096;margin-top:10px;line-height:1.5}@media(max-width:700px){#floodMap{height:300px}}.flood-map-popup{font-family:'DM Sans',sans-serif;font-size:12px;line-height:1.6}";document.head.appendChild(st);
  const sec=document.createElement("section");sec.className="card chart-card";sec.id="floodMapSection";
  sec.innerHTML='<div class="card-head"><div><div class="card-title">Global Flood Impact Map</div><div class="card-desc">Country-level view · follows the existing filters</div></div><span class="tag">WORLD MAP</span></div><div id="floodMap"></div><div class="map-legend">Circle size represents recorded Total_Affected_REAL. Select a marker for details. Locations are approximate country centres, not exact flood-event coordinates.</div>';
  k.insertAdjacentElement("afterend",sec);
  const map=L.map("floodMap",{scrollWheelZoom:false}).setView([20,10],2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; OpenStreetMap contributors',maxZoom:10}).addTo(map);
  const layer=L.layerGroup().addTo(map);
  const coords={
   "Afghanistan":[33.94,67.71],"Algeria":[28.03,1.66],"Argentina":[-38.42,-63.62],"Australia":[-25.27,133.78],
   "Bangladesh":[23.68,90.36],"Brazil":[-14.24,-51.93],"Cambodia":[12.57,104.99],"Cameroon":[7.37,12.35],
   "Canada":[56.13,-106.35],"Chile":[-35.68,-71.54],"China":[35.86,104.2],"Colombia":[4.57,-74.3],
   "Congo":[-0.23,15.83],"Democratic Republic of the Congo":[-4.04,21.76],"Egypt":[26.82,30.8],
   "Ethiopia":[9.15,40.49],"France":[46.23,2.21],"Germany":[51.17,10.45],"Ghana":[7.95,-1.02],
   "India":[20.59,78.96],"Indonesia":[-0.79,113.92],"Iran":[32.43,53.69],"Iraq":[33.22,43.68],
   "Italy":[41.87,12.57],"Japan":[36.2,138.25],"Kenya":[-0.02,37.91],"Malaysia":[4.21,101.98],
   "Mexico":[23.63,-102.55],"Morocco":[31.79,-7.09],"Mozambique":[-18.67,35.53],"Myanmar":[21.91,95.96],
   "Nepal":[28.39,84.12],"Netherlands":[52.13,5.29],"New Zealand":[-40.9,174.89],"Niger":[17.61,8.08],
   "Nigeria":[9.08,8.68],"Pakistan":[30.38,69.35],"Peru":[-9.19,-75.02],"Philippines":[12.88,121.77],
   "Russia":[61.52,105.32],"Saudi Arabia":[23.89,45.08],"Somalia":[5.15,46.2],"South Africa":[-30.56,22.94],
   "South Korea":[35.91,127.77],"Spain":[40.46,-3.75],"Sri Lanka":[7.87,80.77],"Sudan":[12.86,30.22],
   "Thailand":[15.87,100.99],"Turkey":[38.96,35.24],"Türkiye":[38.96,35.24],"Uganda":[1.37,32.29],
   "Ukraine":[48.38,31.17],"United Arab Emirates":[23.42,53.85],"United Kingdom":[55.38,-3.44],
   "United States":[37.09,-95.71],"United States of America":[37.09,-95.71],"Vietnam":[14.06,108.28],
   "Yemen":[15.55,48.52],"Zambia":[-13.13,27.85],"Zimbabwe":[-19.02,29.15]
  };
  const alias={"usa":"United States","us":"United States","uk":"United Kingdom","viet nam":"Vietnam","russian federation":"Russia","turkiye":"Türkiye"};
  const norm=s=>String(s||"").trim().toLowerCase().replace(/[.,']/g,"").replace(/\s+/g," ");
  const lookup={};Object.keys(coords).forEach(n=>lookup[norm(n)]=coords[n]);
  function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function draw(){
   layer.clearLayers();if(typeof filtered!=="function")return;
   const groups={};filtered().forEach(r=>{const c=String(r.Country||"").trim();if(!c)return;const g=groups[c]||(groups[c]={records:0,affected:0,deaths:0,injured:0});g.records++;
    [["Total_Affected_REAL","affected"],["Deaths_REAL","deaths"],["Injured_REAL","injured"]].forEach(([col,key])=>{const n=Number(r[col]);if(r[col]!==""&&Number.isFinite(n))g[key]+=n;});
   });
   let plotted=0;Object.keys(groups).forEach(country=>{const p=lookup[norm(alias[norm(country)]||country)];if(!p)return;plotted++;const v=groups[country],rad=Math.max(6,Math.min(25,6+Math.sqrt(Math.max(0,v.affected))/35));
    L.circleMarker(p,{radius:rad,color:"#c83e50",weight:1.5,fillColor:"#e45b67",fillOpacity:.55}).bindPopup('<div class="flood-map-popup"><b>'+esc(country)+'</b><br>Flood records: '+v.records.toLocaleString("en-IN")+'<br>Recorded people affected: '+Math.round(v.affected).toLocaleString("en-IN")+'<br>Recorded deaths: '+Math.round(v.deaths).toLocaleString("en-IN")+'<br>Recorded injured: '+Math.round(v.injured).toLocaleString("en-IN")+'</div>').addTo(layer);
   });
   const desc=document.querySelector("#floodMapSection .card-desc");if(desc)desc.textContent="Country-level view · "+plotted+" mapped countries · follows existing filters";
  }
  if(typeof window.render==="function"){const old=window.render;window.render=function(){old.apply(this,arguments);draw();};}
  draw();setTimeout(()=>map.invalidateSize(),250);
 }
})();