window.addEventListener('DOMContentLoaded', () => {
    //select items
    const alertMsg = document.querySelector('.alert'),
        form = document.querySelector('.grocery__form'),
        grocery = document.querySelector('.grocery'),
        container = document.querySelector('.grocery-container'),
        submitBtn = document.querySelector('.grocery__form-btn'),
        list = document.querySelector('.grocery__list'),
        clearBtn = document.querySelector('.grocery__clearBtn'),
        formInput = document.querySelector('.grocery__form-input');
    //edit flags
    let editElement;
    let editFlag = false;
    let editId = '';
    let value;


    //form submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        //get value from input, create new article, add innerHTML,
        //add classes, append to parent, and show container
        value = formInput.value;
        //create random id for local storage
        const id = new Date().getTime().toString();
        //if we have value and its not editing process
        if (value && !editFlag) {
            //CREATE NEW ARTICLE
            createArticle(id, value);
            //show alert
            showAlert('item added to the list', 'success');
            //add to localStorage
            addToLocalStorage(id, value);
            //reset
            resetToDefault();
        
        //IF EDITING
        } else if (value && editFlag) {
            //change value
            editElement.firstChild.textContent = value;
            //show alert message
            showAlert('item successfully edited', 'success');
            //change btn txt
            submitBtn.textContent = 'submit';
            //remove editFlag
            editFlag = false;
            //edit in local storage
            editLocalStorage(editId, value)
            //reset to default
            resetToDefault();
            
            
        }
        //if value is empty string
        else {
            showAlert('please enter value', 'remove');
        }
    })


    // ***** CLEAR ALL ITEMS ****

    clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        //clean grocery list innerHTML
        list.innerHTML = ``;
        //hide container
        container.classList.remove('show-container');
        //show message
        showAlert('list cleared!', 'remove');
        //reset
        resetToDefault();
        //remove all items from local storage
        clearLocalStorage();
    })

    // SHOW ALERT MESSAGE
    function showAlert(message, className) {
        //show message
        alertMsg.classList.add(className);
        alertMsg.textContent = `${message}`;
        //remove alert msg after 1 sec
        setTimeout(() => alertMsg.classList.remove(className), 1000)
    }
    // EDIT VALUE
    function editValue(e, id) {
            const target = e.currentTarget;
            //store editing element into temp variable
            editElement = target.parentElement.parentElement;
            //put into input value, value of element which we want to edit
            value = editElement.firstChild.textContent;
            formInput.value = value;
            //change button text
            submitBtn.textContent = 'Edit';
            //setup editFlag value to true
            editFlag = true;
            //save edit id
            editId = id;
                     
    }
    // DELETE VALUE
    function deleteValue(e, id) {
        const target = e.currentTarget;
        target.parentElement.parentElement.remove();
        //also check if list contains more then 1 article
        //if its only 1 article, hide container aswell
        if (list.childElementCount === 0) {
            container.classList.remove('show-container');
        }
        //remove item from storage
        removeFromLocalStorage(id);
        //reset
        resetToDefault();
    }
    // RESET TO DEFAULT
    function resetToDefault() {
        submitBtn.textContent = 'Submit';
        formInput.value = '';
        value = '';
        editFlag = false;
    }

    //CREATE ARTICLE
    function createArticle(id, value) {
        const article = document.createElement('article');
            article.classList.add('grocery__item');
            const attribute = document.createAttribute('data-id');
            attribute.value = id;
            article.setAttributeNode(attribute);
            article.innerHTML = `<p class="grocery__item-title">${value}</p>
            <div class="grocery__item-btnContainer">
                <button class="grocery__item-btn grocery__item-btn_edit ">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="grocery__item-btn grocery__item-btn_delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>`
            //get edit and delete buttons from grocery item
            // !!! important to use article and not document, so we choosing this elements
            // only when we created them on page !!!
            const deleteBtn = article.querySelector('.grocery__item-btn_delete');
            const editBtn = article.querySelector('.grocery__item-btn_edit');

            // //DELETE

            deleteBtn.addEventListener('click', (e) => {
                deleteValue(e, id);
            });

            // //EDIT

            editBtn.addEventListener('click', (e) => {
                editValue(e, id);
            });

            //APPEND

            list.append(article);
            container.classList.add('show-container');
    }


    // **** LOCAL STORAGE ****

    // ADD ITEM

    function addToLocalStorage(id, value) {
        const item = {id, value};
        
        let items = getLocalStorage();
        items.push(item);
        //and set it to local storage
        localStorage.setItem('list', JSON.stringify(items));

    }

    // REMOVE ITEM

    function removeFromLocalStorage(id) {
        let items = getLocalStorage();

        //check item with matching id, and remove it from the array
        items = items.filter(item => {
            return item.id !== id;
        })
        
        //then setup new array to local storage
        localStorage.setItem('list', JSON.stringify(items));
        
    }

    //EDIT ITEM

    function editLocalStorage(id, value) {
        let items = getLocalStorage();
        //find matching id, change value, and return new array
        items = items.map(item => {
            if (item.id === id) {
                item.value = value;
            }
            return item;
        })
        //setup edited array to localStorage

        localStorage.setItem('list', JSON.stringify(items));
    }

    //CLEAR ALL ITEMS

    function clearLocalStorage() {
        localStorage.removeItem('list');
    }

    //get list with items from storage, if theres none setup it as empty aray
    function getLocalStorage() {
        return localStorage.getItem("list") ? JSON.parse(localStorage.getItem('list')) 
        : [];
    }


    //***** SETUP PAGE *****
    let storageArr = getLocalStorage();
    if (storageArr.length >= 1) {
        storageArr.forEach(item => {
            createArticle(item.id, item.value);
        })
    }

    

})