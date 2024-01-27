const card = document.querySelector('.card');
const submitBtn = document.querySelector('.search-btn');
const cityName = document.querySelector('.cityName');
const time = document.querySelector('.time');
const celsius = document.querySelector('.celsius');
const condition = document.querySelector('.condition');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const weatherImg = document.querySelector('.search-btn');
const feelslike = document.querySelector('.feelslike');
const img = document.querySelector('.img');
const interest = document.querySelector('.interest');
const list = document.querySelector('.list');
const sentence1 = document.querySelector('.sentance-1');
const sentence2 = document.querySelector('.sentance-2');
const sentence3 = document.querySelector('.sentance-3');
const sentence4 = document.querySelector('.sentance-4');
const sentence5 = document.querySelector('.sentance-5');
const favoritesList = document.querySelector('.favorites-list');
const favoritesContainer = document.querySelector('.favorites-container');
const addToFavoritesBtn = document.querySelector('.add-to-favorites')

const fetchData = async (url) => {
    const response = await fetch(url);
    return response.json();
};

const displayError = (error) => {
    console.error(error);
    alert('Please check your spelling and try again.');
};

const updateSentence = (element, text) => {
    element.textContent = text;
};

const loadFavorites = () => {
    favoritesList.innerHTML=''
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.forEach(async city => {
        const cityJson = await fetchData(`http://api.weatherapi.com/v1/current.json?key=5fc6649163f147c5bff83729242301&q=${city}&aqi=no`)
        const li = document.createElement('li')
        const deleteBtn = document.createElement('button')
        deleteBtn.classList.add('deleteBtn')
        deleteBtn.textContent = 'X'
        deleteBtn.addEventListener('click', () => {
            removeFromFavorites(city);
            li.remove();
        });
        li.textContent = `${city} ${cityJson.current.temp_c}°C`
        li.appendChild(deleteBtn)
        favoritesList.appendChild(li)
    });
};

const removeFromFavorites = (city) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav !== city);
    localStorage.setItem('favorites', JSON.stringify(favorites));
};

  
const saveFavorites = (city) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push(city);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    loadFavorites();
};


submitBtn.addEventListener('click', async () => {
    try {
        const userInput = await document.querySelector('.city').value;
        const dataJson = await fetchData(`http://api.weatherapi.com/v1/current.json?key=5fc6649163f147c5bff83729242301&q=${userInput}&aqi=no`);
        const countryJson = await fetchData(`https://restcountries.com/v3.1/name/${dataJson.location.country}`);

        updateSentence(sentence3, '');
        updateSentence(cityName, `${dataJson.location.country}, ${dataJson.location.name} ${countryJson[0].flag}`);
        updateSentence(time, dataJson.location.localtime);
        updateSentence(celsius, `${dataJson.current.temp_c}°C`);
        updateSentence(condition, dataJson.current.condition.text);
        updateSentence(wind, `Wind: ${dataJson.current.wind_kph} Km/h`);
        updateSentence(humidity, `Humidity: ${dataJson.current.humidity}%`);
        updateSentence(feelslike, `Feels like: ${dataJson.current.feelslike_c}°C`);
        updateSentence(sentence1, `The capital city of ${dataJson.location.country} is ${countryJson[0].capital}`);
        updateSentence(sentence2, `The population in ${dataJson.location.country} is ${countryJson[0].population.toLocaleString()} people!`);
        updateSentence(sentence3, `This country ${countryJson[0].borders ? `has borders with ${countryJson[0].borders.join(', ')}.` : 'does not have borders.'}`);
        updateSentence(sentence4, `And it's located on the continent of ${countryJson[0].continents[0]}`);
        img.src = dataJson.current.condition.icon;
        interest.style.display = 'block';
        card.style.display = 'block';
        list.style.display = 'block';
    } catch (error) {
        displayError(error);
    }
});

addToFavoritesBtn.addEventListener('click', () => {
  const currentCity = `${cityName.textContent}`;
  saveFavorites(currentCity);
});

window.addEventListener("load", (event) => {
    loadFavorites()
  });


