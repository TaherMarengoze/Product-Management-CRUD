//global variables
var localStoreKey = "PRODUCTS";
var IdentityKey = "PROD_ID";
var productsList = [];
var identity = 0;
var updateProductId = -1;
var inputValidationArray = [false,false,true,false];

//inputs
var inputProductName = document.getElementById('productName');
var inputProductPrice = document.getElementById('productPrice');
var inputProductDesc = document.getElementById('productDesc');
var inputProductCat = document.getElementById('productCat');
var inputProductImage = document.getElementById('productImage');

var displayPanel = document.getElementById('displayPanel');

//Control Buttons
var btnAddProduct = document.getElementById('btnAddProduct');
var btnUpdateProduct = document.getElementById('btnUpdateProduct');
var btnClearForm = document.getElementById('btnClearForm');

var localStoreVal = localStorage.getItem(localStoreKey);
if (localStoreVal){
    productsList = JSON.parse(localStoreVal);
    updateDisplay(productsList);
}

var localStoreIdentityVal = localStorage.getItem(IdentityKey);
if (localStoreIdentityVal){
    if (productsList.length > 0){
        identity = localStoreIdentityVal;
    }
    else{
        identity = 0;
    }
}else{
    identity = productsList.length;
}

inputProductName.addEventListener('input', function(e){
    if (e.target.value.length > 1){
        validateInput(e.target);
        inputValidationArray[0] = true;
    }else{
        invalidateInput(e.target);
        inputValidationArray[0] = false;
    }

    validateAllInputs();
});

inputProductPrice.addEventListener('input', function(e){
    var value = e.target.valueAsNumber;

    if (isNaN(value)){
        invalidateInput(e.target);
        inputValidationArray[1] = false;
    }else{
        validateInput(e.target);
        inputValidationArray[1] = true;
    }

    validateAllInputs();
});

inputProductDesc.addEventListener('input', function(e){
    validateInput(e.target);
    inputValidationArray[2] = true;

    validateAllInputs();
})

inputProductCat.addEventListener('input', function(e){
    if (e.target.value.trim() === ""){
        invalidateInput(e.target);
        inputValidationArray[3] = false;
    }else{
        validateInput(e.target);
        inputValidationArray[3] = true;
    }

    validateAllInputs();
} )

btnAddProduct.addEventListener('click', function(){
    addProduct();
});

btnUpdateProduct.addEventListener('click', function(){
    updateProduct();
})

btnClearForm.addEventListener('click', function(){
    populateInputs(null);
    resetValidationArray();
})

function addProduct(){
    var productName = inputProductName.value;
    var productPrice = inputProductPrice.value;
    var productDesc = inputProductDesc.value;
    var productCat = inputProductCat.value;
    var productId = identity++;

    var newProduct = {
        Id: productId,
        Name: productName,
        Price: productPrice,
        Description: productDesc,
        Category: productCat,
        Image: ""
    };

    productsList.push(newProduct);
    updateLocalStorage(true);

    updateDisplay(productsList);

    populateInputs(null);
    resetValidationArray();
}

function editProduct(productId){
    updateProductId = getProductIndexById(productId);
    populateInputs(productsList[updateProductId]);

    toggleUpdateButton(true);
}

function updateProduct(){
    var productName = inputProductName.value;
    var productPrice = inputProductPrice.value;
    var productDesc = inputProductDesc.value;
    var productCat = inputProductCat.value;
    
    productsList[updateProductId].Name = productName;
    productsList[updateProductId].Price = productPrice;
    productsList[updateProductId].Description = productDesc;
    productsList[updateProductId].Category = productCat;

    updateLocalStorage();

    updateDisplay(productsList);
    toggleUpdateButton(false);

    populateInputs(null);
    resetValidationArray();
}

function deleteProduct(productId){
    var prodIndex = getProductIndexById(productId);
    productsList.splice(prodIndex,1);

    updateLocalStorage(true);

    updateDisplay(productsList);
}

function getProductIndexById(productId){
    for(var i = 0; i < productsList.length; i++){
        if (productsList[i].Id == productId){
            return i;
        }
    }
    return -1;
}

function updateLocalStorage(updateIdentity = false){
    localStorage.setItem(localStoreKey, JSON.stringify(productsList));

    if (updateIdentity){
        localStorage.setItem(IdentityKey, identity );
    }
}

function updateDisplay(displayArray){
    displayPanel.innerHTML = "";

    for (var i=0; i < displayArray.length; i++){
        displayPanel.innerHTML += generateItemTemplate(displayArray[i]);
    }
}

function generateItemTemplate(product){
    return `
    <div class="col-lg-4 text-white">
        <div class="small">ID: ${product.Id}</div>
        <div class="border border-white rounded px-3 py-2">
            <figure class="border border-secondary rounded p-2">
                <img src="" alt="product image" class="w-100" />
            </figure>
            
            <div>
                <div>Product Name:&nbsp;<span>${product.Name}</span></div>
                <div>Product Price:&nbsp;<span>${product.Price}</span></div>
                <div>Product Category:&nbsp;<span>${product.Category}</span></div>
                <div>Product Description:&nbsp;<p class="product-description">${product.Description}</p></div>
            </div>

            <div class="d-flex justify-content-between mt-3">

                <button class="btn btn-sm btn-warning" onclick="editProduct(${product.Id})">
                    <i class="fa-solid fa-pencil"></i> Edit
                </button>

                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.Id})">
                    <i class="fa-solid fa-trash"></i> Delete
                </button>
            </div>
        </div>
    </div>
    `
}

function populateInputs(product){

    if (product){
        inputProductName.value = product.Name;
        inputProductPrice.value = product.Price;
        inputProductDesc.value = product.Description;
        inputProductCat.value = product.Category;
    }else{
        inputProductName.value = "";
        inputProductPrice.value = "";
        inputProductDesc.value = "";
        inputProductCat.value = "";

        resetInputValidationIndicator(inputProductName);
        resetInputValidationIndicator(inputProductPrice);
        resetInputValidationIndicator(inputProductDesc);
        resetInputValidationIndicator(inputProductCat);
    }
    
    validateAllInputs();
}

function toggleUpdateButton(hideAdd){
    btnAddProduct.hidden = hideAdd;
    btnUpdateProduct.hidden = !hideAdd
}

function validateInput(input){
    input.classList.add('is-valid');
    input.classList.remove('is-invalid');
}

function invalidateInput(input){
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
}

function resetInputValidationIndicator(input){
    input.classList.remove('is-valid');
    input.classList.remove('is-invalid');
}

function validateAllInputs(){
    var invalidated = false;

    for (var i=0; i < inputValidationArray.length; i++){
        if (!inputValidationArray[i]){
            invalidated = true;
            break;
        }
    }

    if (invalidated){
        btnAddProduct.disabled = true;
        btnUpdateProduct.disabled = true;
    }
    else{
        btnAddProduct.disabled = false;
        btnUpdateProduct.disabled = false;
    }
}

function resetValidationArray(){
    inputValidationArray = [false,false,true,false];
    validateAllInputs();
}