// modulo
import * as Contacts from "./contacts.js";
// Selectores
const inputName = document.querySelector('#name-input');
const inputNumber = document.querySelector('#phone-input');

const inputNameList = document.querySelector('#input-name-list');
const inputNumberList = document.querySelector('#input-phone-list');

const form = document.querySelector('#main-form');
const formBtn = document.querySelector('#main-form-btn');
const contactsList = document.querySelector('#contacts-list');

// Regex - expresiones regulares
const NAME_REGEX = /^[A-Z][a-z]*[ ][A-Z][a-z]{3,}[ ]{0,1}$/;
const PHONE_REGEX = /^[0](412|424|414|426|416|212)[0-9]{7}$/;

// Validaciones de formulario
let nameValidation = false;
let phoneValidation = false;




// funciones

const renderValidation = (input, validation) => {
  const helperText = input.nextElementSibling;
  if (input.value === '') {
    input.classList.tog('input-invalid');
    input.classList.remove('input-valid');
    helperText?.classList.remove('show-helper-text');
  } else if (validation) {
    input.classList.add('input-valid');
    input.classList.remove('input-invalid');
    helperText?.classList.remove('show-helper-text');
  } else {
    input.classList.add('input-invalid');
    input.classList.remove('input-valid');
    helperText?.classList.add('show-helper-text');
  }
}

const renderButtonState = () => {
  if (nameValidation && phoneValidation) {
    formBtn.disabled = false;
  } else {

    formBtn.disabled = true;
  }
}

// Eventos input Formulario
inputName.addEventListener('input', e => {
  nameValidation = NAME_REGEX.test(inputName.value);
  renderValidation(inputName, nameValidation);
  renderButtonState();
});


inputNumber.addEventListener('input', e => {
  phoneValidation = PHONE_REGEX.test(inputNumber.value);
  renderValidation(inputNumber, phoneValidation);
  renderButtonState();
});
//Eventos input Lista


form.addEventListener('submit', e => {
  e.preventDefault();
  // 1. Validar
  if (!nameValidation || !phoneValidation) return;
  // 2. Obtener el numero y el nombre.
  const phone = inputNumber.value;
  const name = inputName.value;
  // 3. Asignar un id. Ramdom
  const id = crypto.randomUUID();
  // 4. Estructurar el contacto
  const newContact = {id, name, phone};
  // 5. Agregar al array de contactos
  Contacts.addContact(newContact);
  // 6. Guardar en el navegador
  Contacts.saveInBrowser();
  // 7. Renderizar en el navegador
  Contacts.renderContacts(contactsList);
});

contactsList.addEventListener('click', e => {
  const deleteBtn = e.target.closest('.delete-btn');
  const editBtn = e.target.closest('.edit-btn');


  if (deleteBtn) {
    //1. Encuentro el li
    const li = deleteBtn.parentElement.parentElement;
    //2. Actualizo el array de js, usando el metodo filter para devolver todos los contactos exepto el que quiero eliminar.
    //Manera explicita
    //contacts = contacts.filter(contact =>{
      // if (contact.id !== li. id) return contact;})

      Contacts.removeContact(li.id);
      //3. Renderizo los contactos actualizados
      Contacts.renderContacts(contactsList);

      Contacts.saveInBrowser();
  }
  if (editBtn){
    const li = editBtn.parentElement.parentElement;
    //obtener status
    const status = li.getAttribute('status');
    //obtener inputs
    const contactInputName = li.children[0].children[0];
    const contactInputPhone = li.children[0].children[1];
   
    
    //obetener el boton
    const contactEditBtn = li.children[1]. children[0];
    
          
    
    if (status === 'inputs-deshabilitados' ) {
      //1. remover el readonly
      contactInputName.removeAttribute('readonly');
      contactInputPhone.removeAttribute('readonly');



      //2. Cambiar el status a inputs-habiliados
      li.setAttribute('status', 'inputs-habilitados');

      //Estilo del input
      contactInputName.classList.remove('contacts-list-item-name-input');
      contactInputName.classList.add('contacts-list-item-name-input-active');


      contactInputPhone.classList.remove('contacts-list-item-phone-input');
      contactInputPhone.classList.add('contacts-list-item-phone-input-active');


      console.log(contactInputName);
      
      //3. cambir icono del boton para reflejar estado \
contactEditBtn.innerHTML = Contacts.editIconEnable;
      //4. cambiar estilo de los inputs para reflejar el estado 
      
    }
    if (status === 'inputs-habilitados' ) {
      
       inputNameList.addEventListener('input', e => {
         nameValidationList = NAME_REGEX.test(inputNameList.value);
         renderValidation(inputNameList, nameValidationList);
       });
       inputNumberList.addEventListener('input', e => {
         phoneValidationList = PHONE_REGEX.test(inputNumberList.value);
         renderValidation(inputNumberList, phoneValidationList);
        
       });
      //1. remover el readonly
contactInputName.setAttribute('readonly', true);
contactInputPhone.setAttribute('readonly',true);
 //2. Cambiar el status a inputs-habiliados
 li.setAttribute('status', 'inputs-deshabilitados');
 //3. cambir icono del boton para reflejar estado \
contactEditBtn.innerHTML = Contacts.editIconDisabled;
 //4. cambiar estilo de los inputs para reflejar el estado 

 //actualizar el contacto
 const updateContact = {
  id:li.id,
  name: contactInputName.value,
  phone: contactInputPhone.value
 }
 Contacts.updateContact(updateContact);

 //gardar en navegador
 Contacts.saveInBrowser();
 //mostrar la lista actualizado en el htlml
Contacts.renderContacts(contactsList);    
}

  }


});

window.onload = () => {
  //1. Obtener los contactos
  Contacts.getContactsFromLocalStorage();
  //2. Renderizar los contactos
  Contacts.renderContacts(contactsList);
}

