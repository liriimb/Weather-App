const searchForm = document.querySelector('.search-loaction');
const cityValue = document.querySelector('.search-loaction input');
const cityName = document.querySelector('.city-name p');
const cardBody = document.querySelector('.card-body');
const timeImage = document.querySelector('.card-top img');
const cardInfo = document.querySelector('.back-card');

const spitOutCelcius = (kelvin) => {
    celcius = Math.round(kelvin - 273.15);
    return celcius;
}
const isDayTime = (icon) => {
    if (icon.includes('d')) { return true }
    else { return false }
}

// Function to create sparkle effect
const createSparkle = (x, y) => {
  const sparkle = document.createElement('div');
  sparkle.classList.add('sparkle');
  sparkle.style.left = `${x}px`;
  sparkle.style.top = `${y}px`;
  sparkle.style.position = 'absolute';
  sparkle.style.pointerEvents = 'none'; // Prevent mouse events

  document.body.appendChild(sparkle);

  setTimeout(() => {
      sparkle.remove();
  }, 1000); // Remove sparkle after 1 second
};

// Trigger sparkle effect at search input
const triggerSparkleEffect = () => {
  const boundingRect = cityValue.getBoundingClientRect(); // Use cityValue instead
  for (let i = 0; i < 10; i++) {
      const randomX = boundingRect.left + Math.random() * boundingRect.width;
      const randomY = boundingRect.top + Math.random() * boundingRect.height;
      createSparkle(randomX, randomY);
  }
};

updateWeatherApp = (city) => {
    console.log(city);
    const imageName = city.weather[0].icon;
    const iconSrc = `http://openweathermap.org/img/wn/${imageName}@2x.png`
    cityName.textContent = city.name;
    cardBody.innerHTML = `
    <div class="card-mid row">
            <div class="col-8 text-center temp">
              <span>${spitOutCelcius(city.main.temp)}&deg;C</span>
            </div>
            <div class="col-4 condition-temp">
              <p class="condition">${city.weather[0].description}</p>
              <p class="high">${spitOutCelcius(city.main.temp_max)}&deg;C</p>
              <p class="low">${spitOutCelcius(city.main.temp_min)}&deg;C</p>
            </div>
          </div>

          <div class="icon-container card shadow mx-auto">
            <img src="${iconSrc}" alt="" />
          </div>
          <div class="card-bottom px-5 py-4 row">
            <div class="col text-center">
              <p>${spitOutCelcius(city.main.feels_like)}&deg;C</p>
              <span>Feels Like</span>
            </div>
            <div class="col text-center">
              <p>${city.main.humidity}%</p>
              <span>Humidity</span>
            </div>
          </div>
    `;
    if (isDayTime(imageName)) {
        console.log('day');
        timeImage.setAttribute('src', 'img/day_image.svg');
        if (cityName.classList.contains('text-white')) {
            cityName.classList.remove('text-white');
        } else {
            cityName.classList.add('text-black');
        }

    } else {
        console.log('night');
        timeImage.setAttribute('src', 'img/night_image.svg');
        if (cityName.classList.contains('text-black')) {
            cityName.classList.remove('text-black');
        } else {
            cityName.classList.add('text-white');
        }

    }

     // Trigger animation by showing the card with the new data
     cardInfo.classList.remove('d-none');
     cardInfo.classList.add('show');  // Add 'show' class to trigger the animation
 
     if (isDayTime(imageName)) {
         console.log('day');
         timeImage.setAttribute('src', 'img/day_image.svg');
     } else {
         console.log('night');
         timeImage.setAttribute('src', 'img/night_image.svg');
     }
}

// Add an event listener to the form
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  triggerSparkleEffect(); // Call sparkle effect
  const citySearched = cityValue.value.trim(); // Trim whitespace from the input
  searchForm.reset(); // Reset the form after submission

  // Check if the input is not empty
  if (citySearched) {
      // Fetch the weather data
      requestCity(citySearched)
          .then((data) => {
              updateWeatherApp(data, cityValue.value); // Update the weather app with the fetched data
              triggerSparkleEffect(); // Trigger the sparkle effect
          })
          .catch((error) => {
              console.error(error);
              showError('Could not find the city or country. Please try again.'); // Show error message
          });
  } else {
      showError('Please enter a city or country'); // Show error if input is empty
  }
});

const fetchWeather = async (city) => {
  try {
      const API_KEY = 'f6731a1cc82b42539f8435c9f2828c43';
      const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
      const response = await fetch(API_URL);
      
      if (!response.ok) throw new Error('City not found');
      
      const data = await response.json();
      updateWeatherApp(data);
  } catch (error) {
      console.error(error);
      showError('Could not find the city. Please try again.');
  }
}

const showError = (message) => {
  const errorDiv = document.createElement('div');
  errorDiv.classList.add('error-message');
  errorDiv.textContent = message;
  searchForm.appendChild(errorDiv);
  errorDiv.style.opacity = 1;
  setTimeout(() => {
      errorDiv.style.opacity = 0;
      setTimeout(() => {
          errorDiv.remove();
      }, 500);
  }, 2000);
}

document.getElementById('contactForm').addEventListener('submit', function(event) {
  event.preventDefault();

  var name = document.getElementById('name').value;
  var email = document.getElementById('email').value;
  var complaint = document.getElementById('complaint').value;

  // Send email using EmailJS
  emailjs.send("service_p38fwhw", "weatherwise2005@gmail.com", {
    name: name,
    email: email,
    complaint: complaint
  }).then(function(response) {
    console.log("Email sent:", response);
    alert("Email sent successfully!");
  }, function(error) {
    console.error("Email failed to send:", error);
    alert("Failed to send email. Please try again later.");
  });
});
