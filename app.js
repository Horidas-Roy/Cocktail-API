let SL = 0;
let totalCard = 0;

const container = document.getElementById('items_container');
fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita')
    .then(res => res.json())
    .then(items => {
        disPlayItems(items.drinks);
        console.log(items);
    })
    .catch((err) => {
        console.log(err);
    })

const disPlayItems = (drinks) => {
    const container = document.getElementById("items_container");
    container.innerHTML = "";

    drinks.forEach(drink => {
        const div = document.createElement('div');
        div.classList.add('card');

        div.innerHTML = `
            <img class="w-100 rounded-top-3" src="${drink.strDrinkThumb}" alt="${drink.strDrink}"/>
            <div class="p-3 text-center">
                <h4>Name:${drink.strGlass}</h4>
                <p>Category:${drink.strCategory}</p>
                <p>Instructions:${drink.strInstructions.slice(0, 12)}...</p>
                <div class="d-flex gap-3 justify-content-center">
                    <button id="${drink.idDrink}"  class="btn btn-outline-primary" onClick="addToGroup('${drink.idDrink}')">Add to group</button>
                    <button class="btn btn-outline-success" onClick="details('${drink.idDrink}')">Details</button>
                </div>
            </div>
        `
        container.appendChild(div);
    });
}

const disPlayNotFound = () => {
    const container = document.getElementById("items_container");
    container.innerHTML = "";
    const div = document.createElement('div');
    div.classList.add("not_found");
    div.innerHTML = `<h1>Your Search Drink Not Found!</h1>`;
    container.appendChild(div);
}


document.getElementById("searchBtn").addEventListener('click', (e) => {
    const searchText = document.getElementById('searchText').value;
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchText}`)
        .then(res => res.json())
        .then(data => {
            if (data.drinks && data.drinks.length > 0) {
                disPlayItems(data.drinks);
            }
            else {
                disPlayNotFound();
                console.log("Not found");
            }
        })
        .catch((err) => console.log(err));
    document.getElementById('searchText').value = "";
})

const addToGroup = (id) => {
    // alert message
    if (SL > 6) {
        alert("You already added 7 or more");
        return;
    }
    //add card
    const cardNumber = document.getElementById("cardNumber");
    cardNumber.innerText = parseInt(cardNumber.innerText) + 1;
    SL = SL + 1;
    id = parseInt(id);
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(res => res.json())
        .then(data => {
            displayRow(data.drinks[0]);
            alreadySelected(id);
        })
        .catch((err) => console.log(err));
}

const displayRow = (drink) => {
    const tbody = document.getElementById('tbody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${SL}</td>
        <td><img class="card-img rounded-circle" src='${drink.strDrinkThumb}'></td>
        <td>${drink.strDrink}</td>
    `
    tbody.appendChild(tr);
    console.log(drink);
}

const alreadySelected = (id) => {
    const addBtn = document.getElementById(`${id}`);
    addBtn.innerText = "Already Selected";
    addBtn.classList.remove('btn-outline-primary');
    addBtn.classList.add('btn-outline-danger');
}


const showModal = ({title,img,category,alcoholic,instructions}) => {
    const modalContainer = document.getElementById('modalContainer');
    const div = document.createElement('div');
    div.innerHTML="";

    div.innerHTML = `
        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
            aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">${title}</h1>
                    </div>
                    <div class="modal-body">
                       <img class="col-12 modal-img rounded-top-4" src="${img}"/>
                    </div>
                    <div class="px-5">
                        <h6>Details</h6>
                        <p>Category: ${category}</p>
                        <p>Alcoholic: ${alcoholic}</p>
                        <p>${instructions}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `
    modalContainer.appendChild(div);

    const modalId = document.getElementById('staticBackdrop');
    const modal = new bootstrap.Modal(modalId);
    modal.show();
}

const details=(id)=>{
    id = parseInt(id);
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(res => res.json())
    .then(data => {
        const title = data.drinks[0].strGlass;
        const img = data.drinks[0].strDrinkThumb;
        const category = data.drinks[0].strCategory;
        const alcoholic = data.drinks[0].strAlcoholic;
        const instructions = data.drinks[0].strInstructions;
        showModal({title,img,category,alcoholic,instructions});
    })
    .catch((err) => console.log(err));
}