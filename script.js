"use strict";
const suralar = document.querySelector(".suralar");
const box1 = document.querySelector(".box__1");
const box2 = document.querySelector(".box__2");
const arabicText = document.querySelector(".arabic__text");
let audio = document.querySelector(".quranPlayer"),
  surahsContainer = document.querySelector(".surahs"),
  ayah = document.querySelector(".ayah"),
  next = document.querySelector(".next"),
  prev = document.querySelector(".prev"),
  play = document.querySelector(".play");
let menuBar = document.querySelector(".menu__bar");
let suraName = document.querySelector(".logo__name");
let windowX = window.matchMedia("(max-width: 700px)");

let addSura = async function () {
  let a = await fetch("https://api.quran.sutanlab.id/surah");
  let b = await a.json();
  for (let val in b.data) {
    suralar.innerHTML += `<div id="id_${Number(val) + 1}" class="row">
    <div class="sura__num">
      <p class="num_1">${Number(val) + 1}</p>
    </div>
    <div class="sura__info">
      <p class="arab__name name">${b.data[val].name.long}</p>
      <p class="sura__name name">${b.data[val].name.transliteration.en}</p>
    </div>
  </div>`;
  }
  let clicked = suralar.addEventListener("click", async function (e) {
    e.preventDefault();
    // e.stopPropagation();
    if (windowX.matches) {
      box1.style.opacity = "0";
      box1.style.display = "none";
      box2.style.opacity = "1";
      box2.style.display = "block";
      menuBar.style.opacity = "1";
      menuBar.style.display = "block";
    }
    const englishText = document.querySelector(".english__text");
    englishText.innerHTML = "";
    arabicText.innerHTML = "";
    let target = e.target;
    let num = +target.closest(".row").id.split("_")[1];
    let k = await fetch(`https://api.quran.sutanlab.id/surah/${num}`);
    let c = await k.json();
    let j = 1;
    let h = 0;
    let verses = c.data.verses;
    for (let d of verses) {
      let html2 = `<p class="txt__${h++} text__oyat">${j++}. ${
        d.text.transliteration.en
      }</p>`;
      englishText.insertAdjacentHTML("beforeend", html2);
    }
    impor(num);
    let AyahsAudios = [];
    let AyahsText = [];
    verses.forEach((verse) => {
      AyahsAudios.push(verse.audio.primary);
      AyahsText.push(verse.text.arab);
    });
    let AyahIndex = 0;
    changeAyah(AyahIndex);
    audio.addEventListener("ended", () => {
      AyahIndex++;
      if (AyahIndex < AyahsAudios.length) {
        changeAyah(AyahIndex);
      } else {
        AyahIndex = 0;
        changeAyah(AyahIndex);
        audio.pause();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "surah has been ended",
          showConfirmButton: false,
          timer: 1500,
        });
        isPlaying = true;
        togglePlay();
      }
    });
    //Handle Next And Prev
    next.addEventListener("click", () => {
      AyahIndex < AyahsAudios.length - 1 ? AyahIndex++ : (AyahIndex = 0);
      changeAyah(AyahIndex);
      isPlaying = false;
      togglePlay();
    });
    prev.addEventListener("click", () => {
      AyahIndex == 0 ? (AyahIndex = AyahsAudios.length - 1) : AyahIndex--;
      changeAyah(AyahIndex);
      isPlaying = false;
      togglePlay();
    });
    //handle Play And Pause Audio
    let isPlaying = false;
    togglePlay();
    function togglePlay() {
      if (isPlaying) {
        audio.pause();
        play.innerHTML = `<i class="fas fa-play"></i>`;
        isPlaying = false;
      } else {
        audio.play();
        play.innerHTML = `<i class="fas fa-pause"></i>`;
        isPlaying = true;
      }
    }
    play.addEventListener("click", togglePlay);
    function changeAyah(index) {
      belgila(index);
      audio.src = AyahsAudios[index];
      ayah.innerHTML = AyahsText[index];
    }
    suraName.textContent =
      target.closest(".sura__info").children[1].textContent;
  });
};
addSura();
let impor = function (id) {
  fetch(
    "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/uzb-alaaudeenmansou.json"
  )
    .then((res) => res.json())
    .then((res) => {
      let i = 1;
      let y = 0;
      res.quran.forEach((element) => {
        if (element.chapter == id) {
          let html1 = `<p class="texts__${y++} text__oyat">${i++}. ${
            element.text
          }</p>`;
          arabicText.insertAdjacentHTML("beforeend", html1);
        }
      });
    });
};
let belgila = function (index) {
  let uzbekcha = document.querySelector(`.texts__${index}`);
  let en = document.querySelector(`.txt__${index}`);
  en.style.backgroundColor = "#4343435c";
  if (uzbekcha !== null) {
    uzbekcha.style.backgroundColor = "#4343435c";
  }
};
menuBar.addEventListener("click", function (e) {
  e.preventDefault();
  if (windowX.matches) {
    box1.style.opacity = "1";
    box1.style.display = "block";
    box2.style.opacity = "0";
    box2.style.display = "none";
    menuBar.style.opacity = "0";
    menuBar.style.display = "none";
  }
});
