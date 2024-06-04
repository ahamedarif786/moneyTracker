// STORAGE CONTROLLER

const StorageControler = (function () {
    return {
        storeItems: function (datum) {
            let items
            if (localStorage.getItem("items") === null) {
                items = [];
                items.push(datum);
            } else {
                items = JSON.parse(localStorage.getItem("items"));
                items.push(datum);
            }
            localStorage.setItem("items", JSON.stringify(items))
        },
        getItems: function () {
            let items;
            if (localStorage.getItem("items") === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem("items"));
            }
            return items;
        },
        updateinLS: function (data) {
            let items = JSON.parse(localStorage.getItem("items"));
            items.forEach((item, index)=>{
                if(data.id === item.id){
                    items.splice(index,1, data);
                }
            })
            localStorage.setItem("items", JSON.stringify(items))
        },
        deletItemLS: function(id){
            console.log("ok");
            let items = JSON.parse(localStorage.getItem("items"));
            items.forEach((item, index)=>{
                if(id === item.id){
                    items.splice(index,1);
                }
            })
            localStorage.setItem("items", JSON.stringify(items))


        }
    }
})()


// ITEM CONTROLLER
const Item = function (id, name, money) {
    this.id = id;
    this.name = name;
    this.money = money;
}
const ITEMControler = (function () {
    const data = {
        items: StorageControler.getItems(),
        currentItem: null,
        TotalMoney: 0
    }
    console.log(data.items);

    return {
        getItem: function () {
            return data.items;
        },
        addNewItem: function (name, money) {
            let ID;
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            money = parseInt(money);
            const newItem = new Item(ID, name, money);
            data.items.push(newItem);
            return newItem;
        },
        totalMoney: function () {
            let total = 0;
            if (data.items.length > 0) {
                data.items.forEach((item) => {
                    total += item.money;
                    // console.log(total);
                    data.TotalMoney = total;

                })
            }
            else {
                return data.TotalMoney = 0;
            }
            return total;
        },
        getItemtoEdit: function (id) {
            let found = null;
            data.items.forEach((item) => {
                if (item.id === id) {
                    found = item;
                }
            })
            return found;
        },
        setCurrentItem: function (edits) {
            data.currentItem = edits;


        },
        getCurrentItem: function () {
            return data.currentItem;
        },
        updateitems: function (name, money) {
            let found = null;
            money = parseInt(money);
            data.items.forEach((item) => {
                if (item.id === data.currentItem.id) {

                    item.item = name;
                    item.money = money;
                    found = item;
                }
            })
            return found;
        },
        deleteData: function (id) {
            const IDS = data.items.map((item) => {
                return item.id;
            })
            const index = IDS.indexOf(id);
            data.items.splice(index, 1);
        },
        clearallitems: function () {
            data.items = [];
        }
    }
})()

// UI CONTROLLER

const UIController = (function () {
    return {
        showItems: function (items) {
            let html = "";
            items.forEach(data => {
                html += `<li class="collection-item" id="item-${data.id}">
            <strong>${data.name} : <em>${data.money}$</em></strong>
            <a href="#" class="secondary-content edit-item">
                <i class="fa fa-pencil"></i>
            </a>
          </li>`;
                document.querySelector("#item-list").innerHTML = html;
            });
        },
        clearEditOptions: function () {
            document.querySelector(".add-btn").style.display = "inline";
            document.querySelector(".update-btn").style.display = "none";
            document.querySelector(".delete-btn").style.display = "none";
            document.querySelector(".back-btn").style.display = "none";

        },
        Editbuttons: function () {
            document.querySelector(".add-btn").style.display = "none";
            document.querySelector(".update-btn").style.display = "inline";
            document.querySelector(".delete-btn").style.display = "inline";
            document.querySelector(".back-btn").style.display = "inline";
        },
        getItemInput: function () {
            return {
                name: document.querySelector("#item-name").value,
                money: document.querySelector("#item-money").value

            }
        },
        addItemList: function (data) {
            const li = document.createElement("li");
            li.className = "collection-item";
            li.id = `item-${data.id}`;
            li.innerHTML = `<strong>${data.name} : <em>${data.money}$</em></strong>
                            <a href="#" class="secondary-content edit-item">
                            <i class="fa fa-pencil"></i>
                             </a>`
            document.querySelector(".collection").appendChild(li);
        },
        showTotalMoney: function (data) {
            const tot = document.querySelector(".total-money").textContent = data
        },
        clearInputs: function () {
            document.querySelector("#item-name").value = "";
            document.querySelector("#item-money").value = "";
        },
        showItemtoUI: function () {
            document.querySelector("#item-name").value = ITEMControler.getCurrentItem().name;
            document.querySelector("#item-money").value = ITEMControler.getCurrentItem().money
        },
        updatedItems: function (data) {
            let li = document.querySelectorAll("li");
            li.forEach((listItem) => {
                const listid = listItem.getAttribute("id");
                if (listid === `item-${data.id}`) {
                    document.querySelector(`#${listid}`)
                        .innerHTML = `<strong>${data.item} : <em>${data.money}$</em></strong>
                    <a href="#" class="secondary-content edit-item">
                        <i class="fa fa-pencil"></i>
                    </a>`

                }
            })

        },
        deleteItemsinUi: function (id) {
            // console.log(id);
            const Id = `#item-${id}`;
            console.log(Id);
            const item = document.querySelector(Id);
            // console.log(item);
            item.remove();
        },
        clearallUI: function () {
            const listLi = document.querySelectorAll("li");
            listLi.forEach((item) => {
                item.remove();
            })

        },
        addActive: function () {
            const labels = document.querySelectorAll("label");
            labels.forEach((label) => {
                label.classList.add("active")
            })

        },
        removeActive: function () {
            const labels = document.querySelectorAll("label");
            labels.forEach((label) => {
                label.classList.remove("active")
            })

        }


    }
})()

// APP

const App = (function (ITEMControler, UIController, StorageControler) {

    const loadevents = function () {
        // Add Items
        document.querySelector(".add-btn").addEventListener("click", AddItems)

        // Edit Items
        document.querySelector(".collection").addEventListener("click", Editstate);

        // Update Items
        document.querySelector(".update-btn").addEventListener("click", UpdateItems);

        // Delete Items
        document.querySelector(".delete-btn").addEventListener("click", deleteItems);

        // Back event
        document.querySelector(".back-btn").addEventListener("click", (e) => {
            e.preventDefault();
            UIController.clearEditOptions();
            UIController.clearInputs();
            UIController.removeActive();
        });
        // Clear all
        document.querySelector(".clear-btn").addEventListener("click", clearAllItems);
    }
    const AddItems = function (e) {
        e.preventDefault();
        const input = UIController.getItemInput();
        if (input.name === "" || input.money === "") {
            alert("Please fill all the fields...")
        } else {
            // Add new item
            const AddItem = ITEMControler.addNewItem(input.name, input.money);
            UIController.addItemList(AddItem);
            StorageControler.storeItems(AddItem)
            const TotalMoney = ITEMControler.totalMoney()
            UIController.showTotalMoney(TotalMoney);
            UIController.clearInputs();
            document.querySelector(".no-item").style.display = "none";

        }
    }
    const Editstate = function (e) {
        e.preventDefault();
        if (e.target.parentElement.classList.contains("edit-item")) {
            UIController.Editbuttons();
            UIController.addActive();
            const listId = e.target.parentElement.parentElement.id;
            const listArr = listId.split("-");
            const id = parseInt(listArr[1]);
            const getEditItem = ITEMControler.getItemtoEdit(id);
            ITEMControler.setCurrentItem(getEditItem);
            UIController.showItemtoUI();
        }
    }
    const UpdateItems = function (e) {
        e.preventDefault();
        const input = UIController.getItemInput();
        const updateitems = ITEMControler.updateitems(input.name, input.money);
        UIController.updatedItems(updateitems);
        StorageControler.updateinLS(updateitems);
        const TotalMoney = ITEMControler.totalMoney()
        UIController.showTotalMoney(TotalMoney);
        UIController.clearInputs();
        UIController.removeActive();
        UIController.clearEditOptions();

    }
    const deleteItems = function (e) {
        e.preventDefault();
        const currentitem = ITEMControler.getCurrentItem()
        // console.log(currentitem);
        const deletedata = ITEMControler.deleteData(currentitem.id);
        UIController.deleteItemsinUi(currentitem.id);
        StorageControler.deletItemLS(currentitem.id)
        const TotalMoney = ITEMControler.totalMoney();
        UIController.showTotalMoney(TotalMoney);
        UIController.clearInputs();
        if (ITEMControler.getItem().length === 0) {
            document.querySelector(".no-item").style.display = "block";
        }
        UIController.clearEditOptions();
        UIController.removeActive();

    }
    const clearAllItems = function () {
        ITEMControler.clearallitems();
        UIController.clearallUI();
        localStorage.removeItem("items")
        const TotalMoney = ITEMControler.totalMoney();
        UIController.showTotalMoney(TotalMoney);
        UIController.clearInputs();
        document.querySelector(".no-item").style.display = "block";
        UIController.removeActive();

    }
    return {
        init: function () {
            UIController.clearEditOptions();
            const items = ITEMControler.getItem();
            if (items.length > 0) {
                const TotalMoney = ITEMControler.totalMoney()
                UIController.showTotalMoney(TotalMoney)
                UIController.showItems(items);
                document.querySelector(".no-item").style.display = "none";
            } else {
                document.querySelector(".no-item").style.display = "block";
            }
            loadevents()
        }
    }
})(ITEMControler, UIController, StorageControler);
App.init();
