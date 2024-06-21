import { caturl, sub } from "../utils/shared.js";
import lng from "../utils/language.js";
export class Filtera {
    constructor(store) {
        this.store = store;
        this.close$ = document.createElement('div');
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.element = this._createElement();
        this.spinnerContainer = this.element.querySelector(".spinner-container");
        this.contentContainer = this.element.querySelector(".auth-body");
        this.filterButton = this.element.querySelector("#filterButton");
        this.closeButton = this.element.querySelector("#auth__close-button");
        console.log(this.closeButton)
        this.loaded = false;
        this.root = [];
        this.subcategories = [];
        this.subyears = [];
        this.yearIds = [];
        this.fetchData();
        this.lng = lng();
        
        this.closeButton.addEventListener("click", () => {
          this.close$.dispatchEvent(new CustomEvent("closed"));
        })
        
    }

    async fetchData() {
        try {
            this.loaded = false;
            this.loadingState();
            const response = await fetch('http://localhost:3001/api/category/full');
            console.log(response);
            if(!response.ok) {
                throw new Error("error");
            }
            this.root = (await response.json()).response;
            console.log(this.root);
            this.loaded = true;
            this.loadingState();
            this.listeners();
        } catch(err) {
            console.log(err)
        }
    }

    loadingState() {
      if(this.loaded) {
        this.contentContainer.style.display = 'block';
        this.spinnerContainer.style.display = 'none';
      } else {
        this.contentContainer.style.display = 'none';
        this.spinnerContainer.style.display = 'block';
      }
    }

    _createElement() {
        const template = `
        <div class="auth-container">
        <div class="auth__header-wrapper">
          <div class="auth__header">
            ${this.store.filter}
            <i class="material-symbols-outlined" style="display:none;">maximize</i>
            <button class="button button-icon" id="auth__close-button">
              <i class="material-symbols-outlined">close</i>
            </button>
          </div>
        </div>
        <div class="auth-body" style="display:none">
        <div class="custom-select" name="brand" id="brandSelect">
        <button
          class="select-button"
          role="combobox"
          aria-labelledby="select button"
          aria-haspopup="listbox"
          aria-expanded="false"
          aria-controls="listbox"
        >
          <div class="button-left">
            <span class="material-symbols-outlined">local_shipping</span>
            <span class="selected-value">${this.store.brand}</span>
          </div>
          <span class="material-symbols-outlined">arrow_drop_down</span>
        </button>
        <ul role="listbox" id="listbox" class="select-dropdown"></ul>
      </div>
      <div class="custom-select" name="model" id="modelSelect">
      <button
        class="select-button"
        role="combobox"
        aria-labelledby="select button"
        aria-haspopup="listbox"
        aria-expanded="false"
        aria-controls="listbox"
      >
        <div class="button-left">
          <span class="material-symbols-outlined">local_shipping</span>
          <span class="selected-value">${this.store.model}</span>
        </div>
        <span class="material-symbols-outlined">arrow_drop_down</span>
      </button>
      <ul role="listbox" id="listbox" class="select-dropdown"></ul>
    </div>
    <div class="custom-select" name="year" id="yearSelect">
    <button
      class="select-button"
      role="combobox"
      aria-labelledby="select button"
      aria-haspopup="listbox"
      aria-expanded="false"
      aria-controls="listbox"
    >
      <div class="button-left">
        <span class="material-symbols-outlined">local_shipping</span>
        <span class="selected-value">${this.store.year}</span>
      </div>
      <span class="material-symbols-outlined">arrow_drop_down</span>
    </button>
    <ul role="listbox" id="listbox" class="select-dropdown"></ul>
  </div>
    <div class="filter-actions">
       <a class="button button-buy w100 auth-button" data-link id="filterButton">${this.store.filter}</a>
    </div>
        </div>
        <div class="spinner-container">
           <svg class="spinner" width="35px" height="35px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
             <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
           </svg>
        </div>
        </div>
        `
        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = template;
        return tempContainer.firstElementChild;
    }

    eventHandler(dropdown) {
      console.log(dropdown);
    }

    listeners() {
      this.dropdowns = {};
      /*
      console.log(this.element.querySelector("#filterButton"))
      this.element.querySelector("#filterButton").addEventListener("click", () => {
        console.log('clicked')
        this.close$.dispatchEvent(new CustomEvent("closed"));
      })
      */
      const dropdownElements = this.element.querySelectorAll('.custom-select');
      dropdownElements.forEach(dropdownElement => {
          const dropdownName = dropdownElement.getAttribute("name");
          if(dropdownName) {
            this.dropdowns[dropdownName] = {
                button: dropdownElement.querySelector('[role="combobox"]'),
                dropdown: dropdownElement.querySelector('[role="listbox"]'),
                isDropdownOpen: false,
                currentOptionIndex: 0,
                valueChanges: document.createElement("div"),
                placeholder:dropdownElement.querySelector(".selected-value").textContent
            }
            this.dropdowns[dropdownName].multiple = (dropdownName === 'model' || dropdownName === 'year') ? true : false;
          }
          this.dropdowns[dropdownName].toggleWrapper = (event) => {
            this.toggleDropdown(this.dropdowns[dropdownName])
          }

          this.dropdowns[dropdownName].backDropWrapper = (event) => {
            this.handleDocumentInteraction(event, this.dropdowns[dropdownName]);
          }
      
          this.dropdowns[dropdownName].button.addEventListener("click", this.dropdowns[dropdownName].toggleWrapper);
          //dropdown.button.addEventListener("keydown", this.handleKeyPress.bind(this, dropdown));
          this.dropdowns[dropdownName].valueChanges.addEventListener("selected", (ev) => {
            console.log(ev);
          })
      });

      this.dropdowns['brand'].valueChanges.addEventListener("selected", (ev) => {
        console.log(this.subcategories);
        this.subcategories = this.root[ev.detail-1].subcategories;
        this.yearIds = [];
        this.updateSubcategories();
        this.updateYears();
        this.modelSelect.querySelector('.selected-value').textContent = this.store.model;
        this.yearSelect.querySelector('.selected-value').textContent = this.store.year;
        
      })
      this.dropdowns['model'].valueChanges.addEventListener("selected", (ev) => {
        console.log(ev);
        console.log(this.subcategories);
        //this.subyears = ev.detail;
        this.subyears = this.subcategories.filter(object => ev.detail.includes(object.id));
        this.yearSelect.querySelector('.selected-value').textContent = this.store.year;
        this.updateYears()
      })
      this.dropdowns['year'].valueChanges.addEventListener("selected", (ev) => {
        this.yearIds = ev.detail;
        this.filterButton.href = `/${this.lng}/filtered?yearIds=${this.yearIds.join(',')}&page=1`;
        console.log(this.filterButton);
      })
      this.brandSelect = this.element.querySelector("#brandSelect");
      this.modelSelect = this.element.querySelector("#modelSelect");
      this.yearSelect = this.element.querySelector("#yearSelect");
      this.sortSelect = this.element.querySelector("#sortSelect");
      this.submitButton = this.element.querySelector("#filterButton");
      this.setUpSelects();
    }

    updateSubcategories() {
        console.log(this.subcategories);
        const modelTemplate = `
        ${this.subcategories.map((item,i) => `
        <li role="option" class="list-item" data-index="${i}" value=${item.id}>
        <span class="checkbox__mark"></span>
        <img src="${sub}${item.images[0].imageUrl}" height="30" width="30" alt="">
        <span class="list-item-content">${item.name}</span>
        </li>
        `).join('')}
      `
      this.modelSelect.querySelector('ul').innerHTML = modelTemplate;
    }

    updateYears() {
      console.log(this.subyears)
        const yearTemplate = `
        ${this.subyears.map(item => `
        <label>${item.name}</label>
        ${item.images.map(img => `
            <li role="option" class="list-item" value=${img.id}>
                <span class="checkbox__mark"></span>
                <img src="${sub}${img.imageUrl}" height="30" width="30" alt="">
                <span class="">${item.name}</span>
                <span class="list-item-content">(${img.range})წ</span>
            </li>
        `).join('')}
    `).join('')}
        `
        this.yearSelect.querySelector('ul').innerHTML = yearTemplate;
        const subListContainer = this.modelSelect.querySelector('ul');
        const dropdownRect = subListContainer.getBoundingClientRect();
        //const viewportHeight = window.innerHeight;
        const dialog = document.querySelector('.auth-container');
        const viewportHeight = dialog.offsetHeight;
        console.log(dropdownRect)
        console.log(viewportHeight)
        if (dropdownRect.bottom > viewportHeight) {
          subListContainer.classList.add('upwards');
        } else {
          subListContainer.classList.remove('upwards');
        }
    }

    setUpSelects() {    
        const rootTemplate = `
           ${this.root.map(item => `
           <li role="option" class="list-item" value=${item.id}>
             <img src="${caturl}${item.image}" height="30" width="30" alt="">
             <span class="list-item-content">${item.name}</span>
             <i class="material-symbols-outlined checkbox">done</i>
           </li>
           `).join('')}
        `;
        this.brandSelect.querySelector('ul').innerHTML = rootTemplate;   
    }

    toggleDropdown(dropdown) {
      //event.stopPropagation();
      //const button = event.target.closest(".select-button");
      //const dropdown = button.nextElementSibling;
      //dropdown.classList.toggle('active');
      //button.setAttribute('aria-expanded', buttonState.toString());
      //const boundEventHandler = this.boundEventHandler.bind(this,dropdown);
      dropdown.dropdown.classList.toggle('ul-active');
      dropdown.isDropdownOpen = !dropdown.isDropdownOpen;
      dropdown.button.setAttribute('aria-expanded', dropdown.isDropdownOpen.toString());
      if (dropdown.isDropdownOpen) {
          if(Array.from(dropdown.dropdown.children).length !== 0) this.focusCurrentOption(dropdown);
          setTimeout(() => {
              document.addEventListener("click", dropdown.backDropWrapper);
          }, 0);
      } else {
          dropdown.button.focus();
          document.removeEventListener("click", dropdown.backDropWrapper);
          if(dropdown.multiple) {
            this.multipleDropdownClosedHandler(dropdown);
          }
      }
  }

  multipleDropdownClosedHandler(dropdown) {
    const listItems = Array.from(dropdown.dropdown.children);
    let selectedValues = [];
    let selectedRefs = [];
    
    listItems.forEach(li => {
        console.log(li)
        if(li.getAttribute('aria-selected') === 'true') {
            selectedValues.push(li.querySelector('.list-item-content').textContent);
            selectedRefs.push(li.getAttribute("value"));
            
        }
    })
    if(selectedValues.length !== 0) {
        dropdown.button.querySelector('.selected-value').textContent = selectedValues.join(', ');
    } else {
        dropdown.button.querySelector('.selected-value').textContent = dropdown.placeholder;
    }
    const arrayOfNumbers = selectedRefs.map(str => parseInt(str));
    console.log(arrayOfNumbers);
    dropdown.valueChanges.dispatchEvent(new CustomEvent("selected", {detail:arrayOfNumbers}))
  }

  boundEventHandler(dropdown, event) {
    this.handleDocumentInteraction(dropdown, event);
  }

  focusCurrentOption(dropdown) {
      const currentOption = Array.from(dropdown.dropdown.children)[dropdown.currentOptionIndex];
      currentOption.classList.add('current');
      currentOption.focus();

      currentOption.scrollIntoView({
          block: 'nearest'
      });

      Array.from(dropdown.dropdown.children).forEach((option, index) => {
          if (option !== currentOption) {
              option.classList.remove('current');
          }
      });

      const subListContainer = dropdown.dropdown
       console.log(subListContainer)
       const dropdownRect = subListContainer.getBoundingClientRect();
       //const viewportHeight = window.innerHeight;
       const dialog = document.querySelector('.auth-container');
       let viewportHeightt = dialog.offsetHeight;
       const viewportHeight = window.innerHeight - (window.innerHeight-viewportHeightt)/2;
       console.log(dropdownRect)
       console.log(viewportHeight)
       
        if (dropdownRect.bottom > viewportHeight) {
          subListContainer.classList.add('upwards');
        } else {
          subListContainer.classList.remove('upwards');
        }
  }

  handleKeyPress(event, dropdown) {
      event.preventDefault();
      const { key } = event;
      const openKeys = ['ArrowDown', 'ArrowUp', 'Enter', ' '];
      if (!dropdown.isDropdownOpen && openKeys.includes(key)) {
          this.toggleDropdown(dropdown);

      } else if (dropdown.isDropdownOpen) {
          switch (key) {
              case 'Escape':
                  this.toggleDropdown(dropdown);
                  break;
              case 'ArrowDown':
                  this.moveFocusDown(dropdown);
                  break;
              case 'ArrowUp':
                  this.moveFocusUp(dropdown);
                  break;
              case 'Enter':
              case ' ':
                  this.selectCurrentOption(dropdown);
                  break;
              default:
                  break;
          }
      }
  }

  detach() {}

  handleDocumentInteraction(event, dropdowns) {
      console.log(dropdowns);
      console.log(event);
      const isHrefButton = event.target;
      console.log(event.target);
      const button = dropdowns.button;
      const dropdown = dropdowns.dropdown;
      const isClickInsideButton = button.contains(event.target);
      const isClickInsideDropdown = dropdown.contains(event.target);
      
      if (isClickInsideButton || (!isClickInsideDropdown && dropdowns.isDropdownOpen)) {
          this.toggleDropdown(dropdowns);
      }

      const clickedOption = event.target.closest('[role="option"]');
      if (clickedOption) {
          this.selectOptionByElement(clickedOption, dropdowns);
      }
  }

  moveFocusDown(dropdown) {
      if (dropdown.currentOptionIndex < dropdown.options.length - 1) {
          dropdown.currentOptionIndex++;
      } else {
          dropdown.currentOptionIndex = 0;
      }
      this.focusCurrentOption(dropdown);
  }

  moveFocusUp(dropdown) {
      if (dropdown.currentOptionIndex > 0) {
          dropdown.currentOptionIndex--;
      } else {
          dropdown.currentOptionIndex = dropdown.options.length - 1;
      }
      this.focusCurrentOption(dropdown);
  }

  selectCurrentOption(dropdown) {
      const selectedOption = Array.from(dropdown.dropdown.children)[dropdown.currentOptionIndex];
      this.selectOptionByElement(selectedOption, dropdown);
  }

  selectOptionByElement(optionElement, dropdown) {
      if(dropdown.multiple) {
        optionElement.classList.toggle('active');
        const isSelected = optionElement.getAttribute('aria-selected');
        if(isSelected === 'true') {
            optionElement.setAttribute('aria-selected', 'false');
            
        } else {
            optionElement.setAttribute('aria-selected', 'true');
            
        }
        this.multipleDropdownClosedHandler(dropdown);
      } else {
          const optionValue = optionElement.querySelector('.list-item-content').textContent;
          const dynamicList = Array.from(dropdown.dropdown.children);
          dropdown.button.querySelector(".selected-value").textContent = optionValue;
          dynamicList.forEach(option => {
              option.classList.remove('active');
              option.setAttribute('aria-selected', 'false');
          });
          
          dropdown.valueChanges.dispatchEvent(new CustomEvent("selected", {detail:optionElement.value}))
    
          optionElement.classList.add('active');
          optionElement.setAttribute('aria-selected', 'true');
          this.toggleDropdown(dropdown);
      }
  }
}