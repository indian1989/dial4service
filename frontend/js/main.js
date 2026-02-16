fetch(`${API_BASE_URL}/api/business`)
.then(res=>res.json())
.then(data=>{
 let html="";
 data.forEach(b=>{
  html+=`<p>${b.title} - ${b.city}</p>`;
 });
 document.getElementById("list").innerHTML=html;
});
