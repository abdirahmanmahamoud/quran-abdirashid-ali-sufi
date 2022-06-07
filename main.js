let nameSh = document.querySelector('.name');
let suurah = document.querySelector('.suurah');
let main_audio = document.querySelector('#main-audio');
let musicBtn = document.querySelector('#musicBtn');
let music_list = document.querySelector('.music-list');
let closeList = document.querySelector('#close');
let listSurah = document.querySelector('ul');
let audioPlay = document.querySelector('.play-puse');
let container = document.querySelector('.container');
let progress_bar = document.querySelector('.progress-bar');
let currentTimeAudio = document.querySelector('.current');
let durationTime = document.querySelector('.duration');
let progress_area = document.querySelector('.progress-area');
let next = document.querySelector('#next');
let backward = document.querySelector('#backward');
let repeat = document.querySelector('#repeat');

let surahNum = '1';

musicBtn.addEventListener('click',() =>{
    music_list.classList.toggle('show');
})

closeList.addEventListener('click',() =>{
    musicBtn.click();
})

const surah = async () =>{
    let surahUrl = await fetch('https://api.alquran.cloud/v1/surah');
    let res =  await surahUrl.json();
    surahName(res.data)
}
surah();

function surahName(data){
   data.forEach(element => {
    let surah = ` 
    <li>
    <div class="row">
        <span class = 'Surah'>${element.number}. ${element.englishName}</span>
        <p class='none'>${element.number}</p>
    </div>
    </li>
    `;
    listSurah.innerHTML += surah;
   });
}

if(localStorage.getItem('Surah')){
    let localStorageSurah = localStorage.getItem('Surah');
    searchSurah(localStorage.getItem('Surah'),'off');
}else{
    searchSurah(1,'off');
}
listSurah.addEventListener('click',(e) =>{
    if(e.target.classList == 'Surah'){
        let clickSurah = e.target.parentElement.children[1].innerText;
        surahNum = clickSurah;
        musicBtn.click();
        searchSurah(surahNum,'on');
        paused();
    }
})

function searchSurah(id,role){
    const surahId = async (id) =>{
        let searchSurahId = await fetch(`https://api.alquran.cloud/v1/surah/${id}`);
        let res =  await searchSurahId.json();
        let nub = '';
        if(res.data.number > 9){
            if(res.data.number > 100){
                nub = `${res.data.number}`;
            }else{
                nub = `0${res.data.number}`;
            }
        }else{
            nub = `00${res.data.number}`;
        }
        main_audio.src = `https://server16.mp3quran.net/soufi/Rewayat-Hafs-A-n-Assem/${nub}.mp3`;
        nameSh.innerHTML = 'Abdirashid Ali Sufi';
        suurah.innerHTML = res.data.englishName;

        if(role == 'on'){
            PlaySurah();
        }
        localStorage.setItem('Surah', id)
    }
    surahId(id);
}

audioPlay.addEventListener('click',() =>{
    const isMusicPaused = container.classList.contains('paused');
    isMusicPaused ? paused() : PlaySurah();
})
function PlaySurah(){
    container.classList.add('paused');
    audioPlay.querySelector('i').classList = 'fas fa-pause';
    main_audio.play();
}
function paused(){
    container.classList.remove('paused');
    audioPlay.querySelector('i').classList = 'fas fa-play';
    main_audio.pause();
}

main_audio.addEventListener('timeupdate',(e) =>{
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progress_bar.style.width = `${progressWidth}%`;
    
    main_audio.addEventListener('loadeddata',() =>{
        let audioDuration = main_audio.duration;
        
        let totalMin = Math.floor(audioDuration / 60);
         let totalSec = Math.floor(audioDuration % 60);
         if(totalSec < 10){
             totalSec = `0${totalSec}`;
         }
         if(totalMin < 10){
             totalMin = `0${totalMin}`;
         }
        durationTime.innerHTML = `${totalMin} : ${totalSec}`;
    })
    let CurrentMin = Math.floor(currentTime / 60);
        let CurrentSec = Math.floor(currentTime % 60);
        if(CurrentSec < 10){
            CurrentSec = `0${CurrentSec}`;
        }
        if(CurrentMin < 10){
            CurrentMin = `0${CurrentMin}`;
        }
        currentTimeAudio.innerHTML = `${CurrentMin} : ${CurrentSec}`;
})
progress_area.addEventListener('click',(e) =>{
    let progressWidth = progress_area.clientWidth;
    let clickedOffSetX = e.offsetX;
    let songDuration = main_audio.duration;
    main_audio.currentTime = (clickedOffSetX / progressWidth) * songDuration;
    PlaySurah();
})

next.addEventListener('click',() =>{
    nextSurah();
})

function nextSurah(){
    if(surahNum == '114'){
        surahNum = '1';
        searchSurah(surahNum,'on');
    }else{
        surahNum ++;
        searchSurah(surahNum,'on'); 
    }
}
backward.addEventListener('click',() =>{
    if(surahNum == '1'){
        surahNum = '114';
        searchSurah(surahNum,'on');
    }else{
        surahNum --;
        searchSurah(surahNum,'on');
    }
})

repeat.addEventListener('click', () =>{
    let getText = repeat.classList[1];
    switch(getText){
        case 'fa-redo':
            repeat.classList = 'fas fa-sync';
        break;
        case 'fa-sync':
            repeat.classList = 'fas fa-redo';
        break;
    }
})
main_audio.addEventListener('ended',() =>{
    let getText = repeat.classList[1];
    switch(getText){
        case 'fa-redo':
           nextSurah();
        break;
        case 'fa-sync':
            searchSurah(surahNum,'on');
        break;
    }
})