document.getElementById("businessForm").addEventListener("submit", async function(e) {
e.preventDefault();

const data = {
businessName: document.getElementById("businessName").value,
ownerName: document.getElementById("ownerName").value,
category: document.getElementById("category").value,
city: document.getElementById("city").value,
phone: document.getElementById("phone").value,
description: document.getElementById("description").value,
);

