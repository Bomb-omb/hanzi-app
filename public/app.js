const _supabaseUrl = CONFIG.SUPABASE_URL;
const _supabaseAPIKey = CONFIG.SUPABASE_ANON_KEY;
const supabaseClient = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

const menuPage = document.getElementById('menu-page');
const practicePage = document.getElementById('practice-page');

// 2. Select the interactive elements
const levelButtons = document.querySelectorAll('.level-btn');
const backButton = document.getElementById('back-to-menu');
const flashcard = document.getElementById('flashcard');
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');

let currentCards = [];
let currentIndex = 0;

levelButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const level = event.target.getAttribute('data-level');

        loadLevel(level); 

        menuPage.classList.add('hidden');      
        practicePage.classList.remove('hidden'); 
    });
});

backButton.addEventListener('click', () => {
    practicePage.classList.add('hidden');    
    menuPage.classList.remove('hidden');    
});

flashcard.addEventListener('click', function() {
    flashcard.classList.toggle('card-flip');
});

async function loadLevel(selectedLevel) {
    document.getElementById('char').innerText = "";
    document.getElementById('pinyin').innerText = "";
    document.getElementById('definition').innerText = "";

    const { data, error } = await supabaseClient
        .from('hsk_characters')
        .select('*')
        .eq('hsk_level', parseInt(selectedLevel));

    if (data && data.length > 0) {
        currentCards = data; 
        shuffleArray(currentCards);
        currentIndex = 0;    
        displayCard();
    } else {
        alert("No cards found for this level yet!");
    }
}

function displayCard() {
    const card = currentCards[currentIndex];
    flashcard.style.visibility = 'hidden';

    flashcard.classList.add('no-transition');
    flashcard.classList.remove('card-flip');
    document.getElementById('char').innerText = card.char;
    document.getElementById('pinyin').innerText = card.pinyin;
    document.getElementById('definition').innerText = card.definition;

    void flashcard.offsetWidth;
    flashcard.classList.remove('no-transition');
    flashcard.style.visibility = 'visible';
}

nextButton.addEventListener('click', function() {
    if (currentIndex < currentCards.length - 1) {
        currentIndex++;
        displayCard();
    } else {
        alert("You've reached the end of the cards for this level!");
    }
});

prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--; 
        displayCard(); 
    } else {
        alert("You are at the very first word!");
    }
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}