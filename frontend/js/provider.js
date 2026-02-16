function addBusiness(){
 fetch(`${API_BASE_URL}/api/business/add`,{
  method:"POST",
  headers:{
   "Content-Type":"application/json",
   "Authorization":"Bearer "+localStorage.getItem("token")
  },
  body:JSON.stringify({
   title:"AC Repair",
   city:"Delhi",
   category:"Home"
  })
 });
}
