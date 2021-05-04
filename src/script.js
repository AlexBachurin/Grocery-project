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

    //form submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        //get value from input, create new article, add innerHTML,
        //add classes, append to parent, and show container
        let value = formInput.value;
        //if we have value and its not editing process
        if (value && !editFlag) {
            const article = document.createElement('article');
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
            //DELETE
            deleteBtn.addEventListener('click', (e) => {
                deleteValue(e);
            });
            //EDIT
            editBtn.addEventListener('click', (e) => {
                editValue(e);
            });
            article.classList.add('grocery__item');
            list.append(article);
            container.classList.add('show-container');
            //show alert
            showAlert('item added to the list', 'success');
            //clear form
            form.reset();
        
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
            //clear form
            form.reset();
            //reset editElement
            editElement = null;
        }
        //if value is empty string
        else {
            showAlert('please enter value', 'remove');
        }
    })

    //clear items from grocery list
    clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        //clean grocery list innerHTML
        list.innerHTML = ``;
        //hide container
        container.classList.remove('show-container');
        //show message
        showAlert('list cleared!', 'remove');
    })

    //show alert
    function showAlert(message, className) {
        //show message
        alertMsg.classList.add(className);
        alertMsg.textContent = `${message}`;
        //remove alert msg after 1 sec
        setTimeout(() => alertMsg.classList.remove(className), 1000)
    }
    //edit
    function editValue(e) {
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
            
    }
    //delete
    function deleteValue(e) {
        const target = e.currentTarget;
        target.parentElement.parentElement.remove();
        //also check if list contains more then 1 article
        //if its only 1 article, hide container aswell
        if (list.childElementCount === 0) {
            container.classList.remove('show-container');
        }
    }

})