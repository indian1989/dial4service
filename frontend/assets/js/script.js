alert("welcome to Dail4Service.in Business Directory");

function openCategory(category) {
alert("You clicked category: ");
window.location.href = "category.html?category=" + encodeURIComponent(category);
}

functon searchCategory() {
let searchValue = document.getElementById("searchInput").value;

if (searchvalue === "") {
alert("Please enter a category or business name");
} else {
alert("Searching for: " + searchValue);
// future:
// window.location.href = "search.html?query=" + searchValue;
}
}

functon searchCategory() {
let value = document.getElementById("searchInput").value;

if (searchvalue === "") {
alert("Please enter a category");
} else {
window.location.href = "category.html?category=" + value;
}
}

function searchService() {
const location = document.getElementById("userLocation").value;

if (location === "") {
alert("Please select location");
return;
}

window.location.href = "category.html?location=" + location;
}

document.addEventListener("DOMContentLoaded", function() {
const locationSelect = document.getElementById("userLocation");

if (locationSelect) {
locationSelect.addEventListener("change", function () {
const location = this.value;

if (location !== "") {
window.location.href = "category.html?location=" + location;
}
});
}
});

document.addEventListener("DOMContentLoaded", loadCategories);

function loadCategories(0 {
fetch("data/categories.json")
.then(res => res.json())
.then(categories => {
const container = document.getElementById("categoryContainer");
container.innerHTML = "";

categories.forEach(cat => {
const div = document.creatElement("div");
div.className = "category-card";
dv.onclick = () => openCategory(cat.name);

div.innerHTML = '
<i class="fa-solid ${cat.icon}" style="color:${cat.color}"></i>
<p>$cat.name}</p>
';

container.appendChild(div);
});
});
.catch(err => console.error("Category load error:", err));
}

function openCategory(category) {
window.location.href =
"category.html?category=" + encodeURIComponent(category);
}