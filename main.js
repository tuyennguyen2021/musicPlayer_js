const wrapper = document.querySelector(".wrapper");
musicImg = wrapper.querySelector(".img-area img");
musicName = wrapper.querySelector(".song-detail .song-info .name");
musicAritist = wrapper.querySelector(".song-detail .song-info .artist");
mainAudio = wrapper.querySelector("#main-audio");
playPauseBtn = wrapper.querySelector(".play-pause");
prevBtn = wrapper.querySelector("#prev-icon");
nextBtn = wrapper.querySelector("#next-icon");
processBar = wrapper.querySelector(".process-bar");
processArea = wrapper.querySelector(".process-area");
showMoreBtn = wrapper.querySelector("#more-music");
hideMusicBtn = wrapper.querySelector("#close");
musicList = wrapper.querySelector(".music-list");
darkMode = wrapper.querySelector("#dark-mode");
heartSong = wrapper.querySelector(".heart");

//heart song
function clickHeart() {
  heartSong.querySelector("i").innerText = "favorite";
}

function nonHeart() {
  heartSong.querySelector("i").innerText = "favorite_border";
}
heartSong.addEventListener("click", () => {
  wrapper.classList.toggle("hearted");
  const heartFill = wrapper.classList.contains("hearted");
  heartFill ? clickHeart() : nonHeart();
});

//dark mode

darkMode.addEventListener("click", () => {
  wrapper.classList.toggle("dark__mode");
  if (wrapper.classList.contains("dark__mode")) {
    wrapper.querySelector(".song-detail").style.color = "#fff";
    darkMode.querySelector("i").innerText = "light_mode";
  } else {
    wrapper.querySelector(".song-detail").style.color = "#000";
    darkMode.querySelector("i").innerText = "dark_mode";
  }
});

let musicIndex = Math.floor(Math.random() * allMusic.length + 1);
window.addEventListener("load", () => {
  loadMusic(musicIndex);
  playingNow();
});

function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicAritist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `images${allMusic[indexNumb - 1].img}`;
  mainAudio.src = `songs${allMusic[indexNumb - 1].src}`;
}

function playMusic() {
  //   wrapper.classList.add("paused");
  playPauseBtn.querySelector("span").innerText = "pause";
  mainAudio.play();
}
function pauseMusic() {
  //   wrapper.classList.remove("paused");
  playPauseBtn.querySelector("span").innerText = "play_arrow";
  mainAudio.pause();
}

//play music button event

playPauseBtn.addEventListener("click", () => {
  wrapper.classList.toggle("paused");
  const isMusicPaused = wrapper.classList.contains("paused");
  isMusicPaused ? playMusic() : pauseMusic();
  playingNow();
});

//next

function nextMusic() {
  musicIndex++;
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);

  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

function prevMusic() {
  musicIndex--;
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

nextBtn.addEventListener("click", () => {
  nextMusic();
});

prevBtn.addEventListener("click", () => {
  prevMusic();
});

//update process

mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let processWidth = (currentTime / duration) * 100;
  processBar.style.width = `${processWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");
  mainAudio.addEventListener("loadeddata", () => {
    //update total duration
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });
  //update current time duration
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);

  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  console.log(currentMin);
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

processArea.addEventListener("click", (e) => {
  let processWidthval = processArea.clientWidth;
  let clickedOffSetX = e.offsetX;
  let songDuration = mainAudio.duration;

  mainAudio.currentTime = (clickedOffSetX / processWidthval) * songDuration;
  playMusic();
});

const repeatbtn = wrapper.querySelector("#repeat-icon");
repeatbtn.addEventListener("click", () => {
  let getText = repeatbtn.innerText;

  switch (getText) {
    case "repeat":
      repeatbtn.innerText = "repeat_one";
      repeatbtn.setAttribute("title", "Song looped");
      break;

    case "repeat_one":
      repeatbtn.innerText = "shuffle";
      repeatbtn.setAttribute("title", "Playback shuffle");
      break;
    case "shuffle":
      repeatbtn.innerText = "repeat";
      repeatbtn.setAttribute("title", "Playlist looped");
      break;
  }
});

//ending the song

mainAudio.addEventListener("ended", () => {
  let getText = repeatbtn.innerText;

  switch (getText) {
    case "repeat":
      nextMusic();
      break;

    case "repeat_one":
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;
    case "shuffle":
      let randIndex = Math.floor(Math.random() * allMusic.length + 1);
      do {
        randIndex = Math.floor(Math.random() * allMusic.length + 1);
      } while (musicIndex == randIndex);
      musicIndex = randIndex;
      loadMusic(musicIndex);
      playMusic();
      playingNow();
      break;
  }
});

showMoreBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", () => {
  showMoreBtn.click();
});

const ulTag = wrapper.querySelector(" .music-list ul");
console.log(ulTag);

//render list music

for (let i = 0; i < allMusic.length; i++) {
  let liTag = `
                <li li-index="${i + 1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <span id="${
                      allMusic[i].id
                    }" class="audio-duration">3:40</span>
                    <audio class="${allMusic[i].id}"  src="songs${
    allMusic[i].src
  }"></audio>
                </li>

    `;

  ulTag.insertAdjacentHTML("beforeend", liTag);

  let liAudioTagDuration = ulTag.querySelector(`#${allMusic[i].id}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].id}`);

  liAudioTag.addEventListener("loadeddata", () => {
    let audioDuration = liAudioTag.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    liAudioTagDuration.innerText = `${totalMin}:${totalSec}`;
    liAudioTagDuration.setAttribute("t_duration", `${totalMin}:${totalSec}`);
  });
}

//play on songs list

function playingNow() {
  const allLiTags = ulTag.querySelectorAll("li");
  for (let j = 0; j < allLiTags.length; j++) {
    let audioTag = allLiTags[j].querySelector(".audio-duration");
    console.log(audioTag);
    if (allLiTags[j].classList.contains("playing")) {
      allLiTags[j].classList.remove("playing");
      let addDuration = audioTag.getAttribute("t_duration");
      audioTag.innerText = addDuration;
      console.log((audioTag.innerText = addDuration), "abc");
    }
    if (allLiTags[j].getAttribute("li-index") == musicIndex) {
      allLiTags[j].classList.add("playing");
      audioTag.innerText = "playing";
    }

    allLiTags[j].setAttribute("onclick", "clicked(this)");
  }
}

function clicked(element) {
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex;
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}
