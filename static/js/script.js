var LANGUAGES = {
    "_": { defaultLanguage: "th", defaultVOLanguage: "th" },
    "th": {
        audioList: [
            // Random audios
            "audio/th/japairudaingai.mp3",
            "audio/th/pommairukunrumaila.mp3",
            "audio/th/mairu.mp3",
            "audio/th/youngmairu.mp3",
            "audio/th/kaijapairu.mp3"
        ],
        texts: {
            "page-title": "ลุงป้อม แอ๊ะ แอ๋ ~",
            "doc-title": "Lungpom~",
            "page-descriptions": "ผมไม่รู้ แล้วคุณรู้หรอ?? ก็บอกว่าไม่รู้ไง!! <del>ไอx่า</del> อยากรู้ก็ไปถามเขานู่น ผมไม่รู้~~",
            "counter-descriptions": ["ลุงป้อมได้พูดคำว่า ` ไม่รู้ ` มา", "คำว่า ` ไม่รู้ ` ได้หลุดจากปากลุงป้อมไป"],
            "counter-unit": "ครั้ง",
            "counter-button": ["ก็บอกว่าไม่รู้วว~!", "กูไม่รู้วว~!", "ใครจะไปรู้อ่ะ?!"]
        },
        cardImage: "img/pomsmile.jpg"
    }
};

(() => {
    const $ = mdui.$;

    // initialize cachedObjects variable to store cached object URLs
    var cachedObjects = {};

    // function to try caching an object URL and return it if present in cache or else fetch it and cache it
    function cacheStaticObj(origUrl) {
        if (cachedObjects[origUrl]) {
            return cachedObjects[origUrl];
        } else {
            setTimeout(() => {
                fetch("static/" + origUrl)
                    .then((response) => response.blob())
                    .then((blob) => {
                        const blobUrl = URL.createObjectURL(blob);
                        cachedObjects[origUrl] = blobUrl;
                    })
                    .catch((error) => {
                        console.error(`Error caching object from ${origUrl}: ${error}`);
                    });
            }, 1);
            return origUrl;
        }
    };

    let firstSquish = true;

    // This code tries to retrieve the saved language 'lang' from localStorage. If it is not found or if its value is null, then it defaults to "en". 
    var current_language = localStorage.getItem("lang") || LANGUAGES._.defaultLanguage;
    var current_vo_language = localStorage.getItem("volang") || LANGUAGES._.defaultVOLanguage;

    // function that takes a textId, optional language and whether to use fallback/ default language for translation. It returns the translated text in the given language or if it cannot find the translation, in the default fallback language.
    function getLocalText(textId, language = null, fallback = true) {
        let curLang = LANGUAGES[language || current_language];
        let localTexts = curLang.texts;
        if (localTexts[textId] != undefined) {
            let value = localTexts[textId];
            if (value instanceof Array) {
                return randomChoice(value); // if there are multiple translations available for this text id, it randomly selects one of them and returns it.
            } else {
                return value;
            }
        }
        if (fallback) return getLocalText(textId, language = "en", fallback = false);
        else return null;
    }

    // function that updates all the relevant text elements with the translations in the chosen language.
    function multiLangMutation() {
        let curLang = LANGUAGES[current_language];
        let localTexts = curLang.texts;
        Object.entries(localTexts).forEach(([textId, value]) => {
            if (!(value instanceof Array))
                if (document.getElementById(textId) != undefined)
                    document.getElementById(textId).innerHTML = value; // replaces the innerHTML of the element with the given textId with its translated version.
        });
        refreshDynamicTexts()
        document.getElementById("herta-card").src = "static/" + curLang.cardImage; // sets the image of element with id "herta-card" to the translated version in the selected language.
    };

    multiLangMutation() // the function multiLangMutation is called initially when the page loads.

    // function that returns the list of audio files for the selected language
    function getLocalAudioList() {
        return LANGUAGES[current_vo_language].audioList;
    }

    // get global counter element and initialize its respective counts
    const localCounter = document.querySelector('#local-counter');
    let localCount = localStorage.getItem('count-v2') || 0;

    // display counter
    localCounter.textContent = localCount.toLocaleString('en-US');

    // initialize timer variable and add event listener to the counter button element
    const counterButton = document.querySelector('#counter-button');
    counterButton.addEventListener('click', (e) => {
        localCount++;
        localCounter.textContent = localCount.toLocaleString('en-US');
        triggerRipple(e);
        playKuru();
        animateBigPom();
        refreshDynamicTexts();
    });

    // try caching the image1 to image6.png images by calling the tryCacheUrl function
    cacheStaticObj("img/image1.png");
    cacheStaticObj("img/image2.png");
    cacheStaticObj("img/image3.png");
    cacheStaticObj("img/image4.png");
    cacheStaticObj("img/image5.png");
    cacheStaticObj("img/image6.png");

    // Define a function that takes an array as an argument and returns a random item from the array
    function randomChoice(myArr) {
        const randomIndex = Math.floor(Math.random() * myArr.length);
        const randomItem = myArr[randomIndex];
        return randomItem;
    }

    // Define a function that shuffles the items in an array randomly using Fisher-Yates algorithm
    function randomShuffle(myArr) {
        for (let i = myArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [myArr[i], myArr[j]] = [myArr[j], myArr[i]];
        }
        return myArr;
    }

    function getRandomAudioUrl() {
        var localAudioList = getLocalAudioList();
        if (current_vo_language == "th") {
            const randomIndex = Math.floor(Math.random() * 5);
            return localAudioList[randomIndex];
        }
        const randomIndex = Math.floor(Math.random() * localAudioList.length);
        return localAudioList[randomIndex];
    }

    function playKuru() {
        let audioUrl;
        if (firstSquish) {
            firstSquish = false;
            audioUrl = getLocalAudioList()[0];
        } else {
            audioUrl = getRandomAudioUrl();
        }
        let audio = new Audio();//cacheStaticObj(audioUrl));
        audio.src = audioUrl;
        audio.play();
        audio.addEventListener("ended", function () {
            this.remove();
        });
    }

    function animateBigPom() {
        let id = null;
        const random = Math.floor(Math.random() * 6) + 1;
        const elem = document.createElement("img");
        elem.src = cacheStaticObj(`img/image${random}.png`);
        elem.style.position = "absolute";
        elem.style.right = "-500px";
        elem.style.top = counterButton.getClientRects()[0].bottom + scrollY - 430 + "px"
        elem.style.zIndex = "-10";
        document.body.appendChild(elem);

        let pos = -500;
        const limit = window.innerWidth + 500;
        clearInterval(id);
        id = setInterval(() => {
            if (pos >= limit) {
                clearInterval(id);
                elem.remove()
            } else {
                pos += 20;
                elem.style.right = pos + 'px';
            }
        }, 12);
    };

    // This function creates ripples on a button click and removes it after 300ms.
    function triggerRipple(e) {
        let ripple = document.createElement("span");

        ripple.classList.add("ripple");

        const counter_button = document.getElementById("counter-button");
        counter_button.appendChild(ripple);

        let x = e.clientX - e.target.offsetLeft;
        let y = e.clientY - e.target.offsetTop;

        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        setTimeout(() => {
            ripple.remove();
        }, 300);
    };

    // This function retrieves localized dynamic text based on a given language code, and randomly replaces an element with one of the translations. 
    function refreshDynamicTexts() {
        let curLang = LANGUAGES[current_language];
        let localTexts = curLang.texts;
        Object.entries(localTexts).forEach(([textId, value]) => {
            if (value instanceof Array)
                if (document.getElementById(textId) != undefined)
                    document.getElementById(textId).innerHTML = randomChoice(value);
        });
    };
})();

// Get the counter element
const counterElement = document.getElementById('local-counter');

// Initialize the counter value
let counterValue = 0;

// Check if counter value is stored in local storage
if (localStorage.getItem('counterValue')) {
  // Retrieve the counter value from local storage
  counterValue = parseInt(localStorage.getItem('counterValue'));
  counterElement.textContent = counterValue;
}

// Add event listener to the counter button (Count Up Number)
document.getElementById('counter-button').addEventListener('click', function() {
  // Increment the counter value
  counterValue++;

  // Update the counter element
  counterElement.textContent = counterValue;

  // Save the counter value to local storage
  localStorage.setItem('counterValue', counterValue);
});

// Add event listener to the restart button (Reset Counter)
document.getElementById('restart-button').addEventListener('click', function() {
  // Reset the counter value
  counterValue = 0;

  // Update the counter element
  counterElement.textContent = counterValue;

  // Clear the counter value from local storage
  localStorage.removeItem('counterValue');
});