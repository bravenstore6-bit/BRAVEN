const products=[
{id:1,name:"تيشيرت Dream Big",cat:"رجالي",price:299,old:349,dark:true},
{id:2,name:"تيشيرت Samurai",cat:"تصاميم",price:279,old:0,dark:false},
{id:3,name:"تيشيرت Adventure",cat:"كاجوال",price:319,old:0,dark:true},
{id:4,name:"تيشيرت Good Vibes",cat:"رجالي",price:299,old:349,dark:true},
{id:5,name:"تيشيرت Anime",cat:"تصاميم",price:289,old:0,dark:false},
{id:6,name:"تيشيرت Butterfly",cat:"نسائي",price:279,old:0,dark:false},
{id:7,name:"تيشيرت Kids",cat:"أطفال",price:229,old:0,dark:false},
{id:8,name:"هودي Street",cat:"هوديز",price:449,old:499,dark:true}];

let cart=JSON.parse(localStorage.getItem("braven_cart")||"[]");
const grid=document.getElementById("productGrid");
function render(list=products){if(!grid)return;grid.innerHTML=list.map(p=>`<article class="card"><div class="pic ${p.dark?"dark":""}">${p.name.split(" ")[1]||"TEE"}</div><div class="info"><b>${p.name}</b><div class="price">${p.price} ج.م ${p.old?`<span class="old">${p.old} ج.م</span>`:""}</div><div class="sizes"><span>S</span><span>M</span><span>L</span><span>XL</span></div><button class="add" onclick="addToCart(${p.id})">أضف إلى السلة 🛒</button></div></article>`).join("")}
function addToCart(id){cart.push(id);localStorage.setItem("braven_cart",JSON.stringify(cart));updateCount();alert("تمت إضافة المنتج إلى السلة");}
function updateCount(){let c=document.getElementById("cartCount");if(c)c.textContent=cart.length}
document.querySelectorAll(".categories button").forEach(b=>b.onclick=()=>{let f=b.dataset.filter;render(f==="خصومات"?products.filter(p=>p.old):products.filter(p=>p.cat===f))});
render();updateCount();