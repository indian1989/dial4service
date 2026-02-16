function login(){
 fetch(`${API_BASE_URL}/api/users/login`,{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({
    email:email.value,
    password:password.value
  })
 }).then(r=>r.json())
 .then(d=>{
  localStorage.setItem("token",d.token);
  location.href="../index.html";
 });
}
