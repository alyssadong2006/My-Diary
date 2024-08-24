showStories();

let addBtn = document.getElementById("addBtn");
addBtn.addEventListener("click", function (e) {
    let addTxt = document.getElementById("addTxt");
    let stories = localStorage.getItem("stories");
    var currentdate = new Date(); 
    let date = currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/" 
    + currentdate.getFullYear() + " at "  
    + currentdate.getHours() + ":"  
    if (currentdate.getMinutes() < 10){
      date += "0";
    }
    date += currentdate.getMinutes();
  
    if (stories == null) {
        storiesObj = [];
    } else {
        storiesObj = JSON.parse(stories);
    }
    storiesObj.push(date + ": " + addTxt.value);
    localStorage.setItem("stories", JSON.stringify(storiesObj));
    addTxt.value = "";

    localStorage.removeItem("draft");

    showStories();
});


function showStories() {
  let stories = localStorage.getItem("stories");
  if (stories == null) {
    storiesObj = [];
  } else {
    storiesObj = JSON.parse(stories);
  }
  let html = "";

  storiesObj.forEach(function (element, index) {
    html += `
              <div class="noteCard card">
                      <div class="card-body">
                          <p class="card-title">Diary ${index + 1}: ${element.slice(0,17)} ...</p>
                          
                          `;
    if (element.length < 100) {
      html += `<p class="card-text"> ${element}</p>`
    } else {
      html += `<p class="card-text" id = "${index}Text"> ${element.slice(0,100)}</p>
      <p class="readMore" id="${index}More" onclick="expandStory(this.id)"> >Read More</p>`
    }
    html += `<button id="${index}"onclick="deleteStory(this.id)" class="btn">Delete Story</button>
                      </div>
                  </div>`
  });
  let storiesElm = document.getElementById("stories");
  if (storiesObj.length != 0) {
    storiesElm.innerHTML = html;
  } else {
    storiesElm.innerHTML = `<div class="card" style="color:white;">Nothing to show! Use "Write a story" 
    section above to write your story.</div>`;
  }
}

function expandStory(Sindex) {
  let stories = localStorage.getItem("stories");
  storiesObj = JSON.parse(stories);
  index = parseInt(Sindex);
  story = document.getElementById(index + "Text");
  button = document.getElementById(Sindex);
  if (button.innerHTML == " &gt;Read More"){
    button.innerHTML = " >Read Less";
    story.innerHTML = storiesObj[index];
  } else if (button.innerHTML == " &gt;Read Less") {
    button.innerHTML = " >Read More";
    story.innerHTML = storiesObj[index].slice(0, 100);
  }
}

function deleteStory(index) {
  let stories = localStorage.getItem("stories");
  if (stories == null) {
    storiesObj = [];
  } else {
    storiesObj = JSON.parse(stories);
  }

  storiesObj.splice(index, 1);
  localStorage.setItem("stories", JSON.stringify(storiesObj));
  showStories();
}

let search = document.getElementById('searchTxt');
search.addEventListener('input', function () {
    let inputVal = search.value.toLowerCase();
    let noteCards = document.getElementsByClassName('noteCard');

    Array.from(noteCards).forEach(function (element) {
        let cardText = element.getElementsByTagName("p")[1].innerText.toLowerCase();
        if (cardText.includes(inputVal)) {
            element.style.display = "inline-block";
        } else {
            element.style.display = "none";
        }
    });
});


let addTxt = document.getElementById("addTxt");
function autoSave() {
    let content = addTxt.value;
    localStorage.setItem("draft", content);  
    console.log("Auto-saved draft at " + new Date().toLocaleTimeString());
}

setInterval(autoSave, 5000);

window.addEventListener('load', function () {
    let savedContent = localStorage.getItem("draft");
    if (savedContent) {
        addTxt.value = savedContent;
        console.log("Draft loaded from previous session.");
    }
});