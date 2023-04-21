const btnShow = document.querySelector(".btn-show");
const modal = document.querySelector(".modal");
const backDrop = document.querySelector(".backdrop");
const productsDOM = document.querySelector(".main-div");
let cart = [];
const cartTotal = document.querySelector(".cart-total");
const cartItems = document.querySelector(".cart-items");
const cartContent = document.querySelector(".cart-content");
const clearCart = document.querySelector(".btn-cancel");

import { productsData } from "./products.js";
class Products {
    //get from api end point
    getProducts(){
        return productsData;
    }
};
let buttsDOM = [];
class UI {
    displayProducts(products){
        let result = "";
        products.forEach(item => {
            result += `<div class="div">
            <img src=${item.imageUrl} alt="social-marketing-min" class="images">
             <div class="content">
               <p class="title-item">${item.title}</p>
               <p class="price-item">${item.price} $</p>
               <div>
                <i class="fa fa-credit-card"></i>
                <button class="add-to-cart" data-id=${item.id}>Add cart</button>
               </div>
             </div>
           </div>`
           productsDOM.innerHTML = result;
        });
    }
    getAddCartBtns(){
        const addToCartBtn = [...document.querySelectorAll(".add-to-cart")];
        buttsDOM = addToCartBtn;
        addToCartBtn.forEach(btn => {
            const id = btn.dataset.id;
            const isInCart = cart.find((p) => p.id === id);
            if (isInCart) {
                btn.innerText = "In Cart";
                btn.disabled = true;
            }
            btn.addEventListener("click",(event) =>{
                //console.log(event.target.dataset.id);
                event.target.innerText = "In cart";
                event.target.disabled = true;
                const addedProduct = {...Storage.getProduct(id), quantity : 1};
                cart = [...cart, addedProduct];
                Storage.saveCart(cart); 
                this.setCartValue(cart);
                this.addCartItem(addedProduct); 
            });
        });
    }
    setCartValue(cart){
       let tempCartItems = 0;
       const totalPrice = cart.reduce((acc, curr) =>{
            tempCartItems += curr.quantity;
            return acc + curr.quantity * curr.price;
        }, 0);
        console.log(totalPrice);
        cartTotal.innerText = `Total Price : ${totalPrice.toFixed(2)} $`;
        cartItems.innerText = tempCartItems;
    }
    addCartItem(cartItem){
        const div = document.createElement("div");
        div.classList.add("cart-modal");
        div.innerHTML = `<div class="head-product">
            <img src=${cartItem.imageUrl} alt="">
            <div class="content-product">
                <p>${cartItem.title}</p>
                <p>${cartItem.price} $</p>
            </div>
            <div class="number-product">
                <i class="fa fa-sort-asc" aria-hidden="true" data-id=${cartItem.id}></i>
                <p>${cartItem.quantity}</p>
                <i class="fa fa-sort-desc" aria-hidden="true" data-id=${cartItem.id}></i>
            </div>
            <i class="fa fa-trash" aria-hidden="true" data-id=${cartItem.id}></i>
        </div>`
        cartContent.appendChild(div);
    }
    setupApp(){
        cart = Storage.getCart() || [];
        cart.forEach((cartItem) => this.addCartItem(cartItem));
        this.setCartValue(cart);
    }
    cartLogic(){
        clearCart.addEventListener("click", () => {
            cart.forEach((cItem) => this.removeItem(cItem.id));
            while(cartContent.children.length){
                cartContent.removeChild(cartContent.children[0]);
            }
        });
        
        cartContent.addEventListener("click", (event) => {
            if (event.target.classList.contains("fa-sort-asc")){
                const addQuantity = event.target;
                const addedItem = cart.find((cItem) => cItem.id == addQuantity.dataset.id);
                addedItem.quantity++;
                this.setCartValue(cart);
                Storage.saveCart(cart);
                addQuantity.nextElementSibling.innerText = addedItem.quantity;
            }else if (event.target.classList.contains("fa-sort-desc")){
                const reductionQuantity = event.target;
                const reductionItem = cart.find((cItem) => cItem.id == reductionQuantity.dataset.id);
                if (reductionItem.quantity === 1){
                    this.removeItem(reductionItem.id);
                    cartContent.removeChild(reductionQuantity.parentElement.parentElement.parentElement);
                    return;
                }
                reductionItem.quantity--;
                this.setCartValue(cart);
                Storage.saveCart(cart);
                reductionQuantity.previousElementSibling.innerText = reductionItem.quantity;
            }else if (event.target.classList.contains("fa-trash")){
                const removeItems = event.target;
                const _removedItem = cart.find((c) => c.id == removeItems.dataset.id);
                this.removeItem(_removedItem.id);
                Storage.saveCart(cart);
                cartContent.removeChild(removeItems.parentElement.parentElement);
            }
        });
    }
    removeItem(id){
        cart = cart.filter((cItem) => cItem.id !== id);
        this.setCartValue(cart);
        Storage.saveCart(cart);
        const button = buttsDOM.find((btn) => parseInt(btn.dataset.id) === parseInt(id));
        button.innerText = "Add to cart";
        button.disabled = false;
    } 

};
class Storage {
    static savedProducts(products){
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id){
        const _products = JSON.parse(localStorage.getItem("products"));
        return _products.find((p) => p.id === parseInt(id))
    }
    static saveCart(cart){
        localStorage.setItem("savedcart", JSON.stringify(cart));
    }
    static getCart(){
        return JSON.parse(localStorage.getItem("cart"))
        ? JSON.parse(localStorage.getItem("cart"))
        : [];
    }
};
document.addEventListener("DOMContentLoaded", ()=>{
    const products = new Products();
    const productsData = products.getProducts();
    //console.log(productsData);
    const ui = new UI();
    ui.displayProducts(productsData);
    ui.getAddCartBtns();
    Storage.savedProducts(productsData);
    ui.setupApp();
    ui.cartLogic();
});

btnShow.addEventListener("click",(s)=>{
    backDrop.style.display = "block";
    modal.style.opacity = "1";
    modal.style.transform = "translate(17vw, 40vh)";
    btnShow.style.display = "none"; 
});
const btnModal = document.querySelectorAll(".btn");
btnModal.forEach((btn)=>{
    btn.addEventListener("click", ()=>{
        backDrop.style.display = "none";
        modal.style.opacity = "0";
        modal.style.transform = "translateY(-100vh)";
        btnShow.style.display = "block";
    });
});
