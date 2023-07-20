console.log('Working');
// Varibles=======================================
const yourTab = document.querySelector("[data-yourWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const grantAccessContainer = document.querySelector("[data-acessContainer]")
const accessBtn = document.querySelector("[data-accessBtn]")
const userInfoContainer = document.querySelector("[data-userInfoContianer]")
const searchForm = document.querySelector("[data-searchForm]")
const searchInput = document.querySelector("[data-searchInput]");
const lodingScreen = document.querySelector("[data-lodingScreen]")
const errorContainer = document.querySelector('[data-errorContainer]');

// Constant Data==================================
const API_KEY = 'c94036c7e952851a649789c4c98222eb';


// Initial Values=======================================
let currentTab = yourTab;
currentTab.classList.add('active');
getFromSessionStorage();


// Functions============================================
function switchTab(tab) {
    if (currentTab != tab) {
        // Add hera to remove active from err
        errorContainer.classList.remove('active');
        // switching logic for tabs
        currentTab.classList.remove('active');
        currentTab = tab;
        currentTab.classList.add('active');
        // switching logic for screens
        if (searchForm.classList.contains("active")) {
            // We are on Your Weather Tab
            console.log(' We are on Your Weather Tab')
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getFromSessionStorage();
        } else {
            // We are of Search Weather Tab
            console.log('We are of Search Weather Tab');
            grantAccessContainer.classList.remove('active');
            userInfoContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
    }
}

//--------------------------------------------------------
function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem('user-coordinates');
    if (!localCoordinates) {
        // Show Grant Access Screen
        console.log('Show Grant Access Screen')
        grantAccessContainer.classList.add('active');
    } else {
        console.log("getFromSessionStorage()", localCoordinates)

        fetchUserCoordinates(JSON.parse(localCoordinates));
    }
}
//--------------------------------------------------------

function getLocation() {
    if (navigator.geolocation) {
        //geo location avilable in browser
        navigator.geolocation.getCurrentPosition(setPosition)

    } else {
        alert('Geo Location in not Avilable in this Browser!')
    }
}

//--------------------------------------------------------
function setPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }
    console.log(userCoordinates);
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserCoordinates(userCoordinates);
}
//--------------------------------------------------------
async function fetchUserCoordinates(coordinates) {
    const lat = coordinates.lat;
    const lon = coordinates.lon;

    grantAccessContainer.classList.remove('active');
    lodingScreen.classList.add('active')
    try {
        let responce = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        let data = await responce.json();

        renderWeatherInfo(data);
        userInfoContainer.classList.add('active');
    } catch {

    }
    lodingScreen.classList.remove('active');
}

//--------------------------------------------------------

function renderWeatherInfo(weatherInfo) {
    console.log('renderWeatherInfo()');
    console.log(weatherInfo);

    //Featching the elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // Setting Data
    try {
        cityName.innerText = weatherInfo?.name;
        countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
        desc.innerText = weatherInfo?.weather?.[0]?.description;
        weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
        temp.innerText = `${weatherInfo?.main?.temp} °C`;
        windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
        humidity.innerText = `${weatherInfo?.main?.humidity}%`;
        cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
    } catch (e) {
        console.log(e)
        // Add ERROR SCREEN
    }

}


//--------------------------------------------------------
async function fetchWeatherInfo(city) {
    console.log('fetchWeatherInfo() : ', city);
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        if (data.cod != 200) {
            throw ('Page Not Found');
        }
        lodingScreen.classList.remove("active");
        renderWeatherInfo(data);
        userInfoContainer.classList.add("active");

    }
    catch (err) {
        console.log('ERROR', err)
        userInfoContainer.classList.remove("active");
        errorContainer.classList.add('active');
    }
}

// Listeners===========================================
yourTab.addEventListener('click', () => { switchTab(yourTab) });
searchTab.addEventListener('click', () => { switchTab(searchTab) });
// 
accessBtn.addEventListener('click', getLocation);
//
searchForm.addEventListener('submit', (e) => {
    // Add hera to remove active from err

    errorContainer.classList.remove('active');
    e.preventDefault();
    let cityName = searchInput.value;
    if (cityName == "") {
        return;
    } else {
        fetchWeatherInfo(cityName);
    }
})

searchInput.addEventListener('click', () => {
    searchInput.value = "";
})