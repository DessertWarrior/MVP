let pageIndex= null;
async function loadPosts(){
  let container = document.querySelector('.container');
  container.innerHTML = '';
  fetch("/api/animeList")
    .then((res) => res.json())
    .then((result) => {
      result.forEach((element) => {
         addCard(element);
      });
    });
} 
async function fetchResult(index) {
  const response = await fetch(`/api/animeList/${index}`);
  const result = await response.json();
  console.log(result);
  return result;
}
async function fetchSend(url,options) {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);
    loadPosts();

}
function newcardDOM() {
    return  `<textarea id ="image" class= 'card-image'></textarea>
    <textarea id ="title" class='card-title'placeholder='Title' oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'></textarea>
    <div><h2>Source: </h2><textarea  id = "source" class='card-text' oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'></textarea></div>
    <div><h2>Theme: </h2><textarea  id = "theme" class='card-text' oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'></textarea></div>
    <div><h2>Genre: </h2><textarea  id = "genre" class='card-text' oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'></textarea></div>
    <div><h2>Studio: </h2><textarea  id = "studio" class='card-text' oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'></textarea></div>
    <div><h2> Rating: </h2><textarea  id = "rating" class='card-text' oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'></textarea></div>
    <div><h2> Opening: </h2><textarea  id = "opening" class='card-text' oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'></textarea></div>
    <textarea placeholder = 'description'id = "synosis" class='card-textbox' oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'></textarea>
    <div class="grid_space_200px"></div>
    <i class="fas fa-save"> Save</i>`;
}
function cardDOM(result) {
  return `<img src='${result.image}' alt='${result.title}'></img>
  <textarea readonly class='card-title' oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'>${result.title}</textarea>
  <div><h2>Source: </h2><textarea readonly class='card-text' oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'>${result.source}</textarea></div>
  <div><h2>Theme: </h2><textarea readonly class='card-text' oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'>${result.theme}</textarea></div>
  <div><h2>Genre: </h2><textarea readonly class='card-text' oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'>${result.genre}</textarea></div>
  <div><h2>Studio: </h2><textarea readonly class='card-text' oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'>${result.studio}</textarea></div>
  <div><h2> Rating: </h2><textarea readonly class='card-text' oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'>${result.score}</textarea></div>
  <div><h2> Opening: </h2><textarea readonly class='card-text' oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'>${result.opening}</textarea></div>
  <textarea readonly class='card-textbox' oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"'>${result.synosis}</textarea>
  <div class="grid_space_200px"></div>
  <i class="fas fa-pen"> Edit</i>`;
}
async function newPost() {
    const wrapperContainerEl = document.querySelector(".container");
    wrapperContainerEl.innerHTML = "";
    const cardResultEl = document.createElement("div");
    cardResultEl.className = "grid_space_200px";
    cardResultEl.style.display = "flex";
    cardResultEl.style.justifyContent = "center";
    cardResultEl.style.alignItems = "center";

    const contentEl = document.createElement("div");
    contentEl.className = "content";
    contentEl.innerHTML = newcardDOM();
    cardResultEl.appendChild(contentEl);
    wrapperContainerEl.appendChild(cardResultEl);

    let jsonData = {};
    const saveButton = contentEl.querySelector('i');
    saveButton.addEventListener('click',()=>{
        let textareas = contentEl.querySelectorAll('textarea');
        textareas.forEach(textarea=>{
            jsonData[textarea.getAttribute('id')] = textarea.value;
        })
        let options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(jsonData)
        }
        let url = `/api/animeList`;
       fetchSend(url,options);
    })
}
async function deletePost() { //add delete post functionality
 const removeButton = document.querySelector('#deleteForm > i');
 removeButton.addEventListener('click',()=>{
  if(!pageIndex)
    return;
  else {
    const wrapperContainerEl = document.querySelector(".container");
    const popupEl = document.createElement('div');
    popupEl.className = 'popup';

    const textMain = document.createElement('label');
    textMain.innerText='Are you sure to delete?';
    popupEl.appendChild(textMain);
    const yesButton = document.createElement('button');
    yesButton.innerText = 'Yes';
    const noButton = document.createElement('button');
    noButton.innerText = 'No';
    const buttonWrapper = document.createElement('div');
    buttonWrapper.appendChild(yesButton);
    buttonWrapper.appendChild(noButton);
    yesButton.addEventListener('click',()=>{
      let options = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
    }
    let url = `/api/animeList/${pageIndex}`;
   fetchSend(url,options);
    })
    noButton.addEventListener('click',()=>{
      wrapperContainerEl.removeChild(popupEl);
    })
    popupEl.appendChild(buttonWrapper);
    wrapperContainerEl.appendChild(popupEl);
  }
 })
}
async function makeResult(index) {
  const result = await fetchResult(index);
  const contentEl = document.createElement("div");
  contentEl.className = "content";
  contentEl.innerHTML = cardDOM(result);
  const editEl = contentEl.querySelector("i");
  const imgEl = contentEl.querySelector('img');

  editEl.addEventListener("click", async () => {
    if (editEl.innerText == " Edit") {
      editEl.className = "fas fa-save";
      editEl.innerText = " Save";
        imgEl.style.display = 'none';   //hides image

        //img portion
        const imageURLEl = document.createElement('textarea');
        imageURLEl.className = 'card-image';
        imageURLEl.readOnly = true;
        imageURLEl.value = imgEl.getAttribute('src') ;
        contentEl.prepend(imageURLEl);

      

      let textBoxs = contentEl.querySelectorAll("textarea");
      textBoxs.forEach((textBox) => {
        textBox.toggleAttribute("readonly");
        textBox.addEventListener("mouseover", () => {
          textBox.classList.toggle("hovered");
        });
        textBox.addEventListener("mouseleave", () => {
          textBox.classList.toggle("hovered");
        });
      });
    } //end of save mode
    else {
      imgEl.style.display= 'block';   //visible
      let imageURLEl = contentEl.querySelector('.card-image'); 
      imgEl.setAttribute('src',imageURLEl.value);// Use value property to get value
      contentEl.removeChild(imageURLEl);    //remove node

      let jsonData = {image: imgEl.getAttribute('src')};
      editEl.className = "fas fa-pen";
      editEl.innerText = " Edit";
      let textBoxs = contentEl.querySelectorAll("textarea");
      
      for (let i = 0; i < textBoxs.length; i++) {
        let textBox = textBoxs[i];
        textBox.toggleAttribute("readonly");
        const newNode = textBox.cloneNode(true); //deeply copy but notcontaining any event
        const rowContent = textBox.parentNode; //the div that contains h2 and tb
        rowContent.replaceChild(newNode, textBox);  //replace with one not containing events

        //set patch request
        let key;
        switch (i) {
          case 0: //title
            key = "title";
            break;
          case textBoxs.length - 1: //last synosis
            key = "synosis";
            break;
          default:
            key = rowContent.firstChild.innerText.slice(0,-1).toLowerCase();
        }
        jsonData[key] = textBox.value;
      }
      //PATCH http request
      let options = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify((jsonData))
      };
      await fetchSend(`/api/animeList/${index}`,options);
      
    }
  });
  return contentEl;
}
async function addResult(anime) {
  pageIndex = anime;
  const wrapperContainerEl = document.querySelector(".container");
  wrapperContainerEl.innerHTML = "";
  const cardResultEl = document.createElement("div");
  cardResultEl.className = "grid_space_200px";
  cardResultEl.style.display = "flex";
  cardResultEl.style.justifyContent = "center";
  cardResultEl.style.alignItems = "center";
  cardResultEl.appendChild(await makeResult(anime));

  wrapperContainerEl.appendChild(cardResultEl);
  const textareas = cardResultEl.querySelectorAll("textarea");
  textareas.forEach((textarea) => {
    textarea.style.height = textarea.scrollHeight + 3 + "px";
  });
}
async function addCard(anime) {
  try {
    let containerEl = document.querySelector(`.${anime.genre}_container > div`);
    if (!containerEl) throw new Error();
    else containerEl.appendChild(makeCard(anime));
  } catch (e) {
    containerEl = document.createElement("div");
    containerEl.className = `${anime.genre}_container`;
    containerEl.style.marginBottom = "50px";
    containerEl.innerHTML += `<label class="genre_name">${anime.genre}</label>`;
    containerEl.innerHTML += `<div class="genre_content"></div>`;
    document.querySelector(".container").appendChild(containerEl);
    containerEl = containerEl.querySelector(".genre_content");
    containerEl.style.display = "flex";
    containerEl.style.overflowX = "auto";
    containerEl.style.width = "100%";
    containerEl.style.gap = "30px";
  }
}

function makeCard(anime) {
  const cardEl = document.createElement("div");
  cardEl.className = "card";
  cardEl.innerHTML = `<img src="${anime.image}"><label>${anime.title}</label>`;
  const cardImgEl = cardEl.querySelector("img");
  cardImgEl.addEventListener("click", () => addResult(anime.id));
  return cardEl;
}
loadPosts();