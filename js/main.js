// function to fetch data from countries api.
async function fetchCountries() {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/all?fields=name`
    );
    if (response.ok) {
      return (data = await response.json());
    } else {
      console.error("Error: Unable to fetch data.");
    }
  } catch (error) {
    console.error("Exeption: ", error.message);
  }
}

// function to fetch data for selected country from api.
async function fetchCounty(countryName) {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${countryName}`
    );
    if (response.ok) {
      return (data = await response.json());
    } else {
      console.error("Error: Unable to fetch data.");
    }
  } catch (error) {
    console.error("Exeption: ", error.message);
  }
}

// function to fetch news for selected country from api.
async function fetchCountyNews(countryCode) {
  const newsApiKey = "f7d3b498b0b84f7399e6590959523a9e";
  try {
    const response = await fetch(
      `https://api.worldnewsapi.com/search-news?api-key=${newsApiKey}&source-countries=${countryCode}`
    );
    if (response.ok) {
      return (data = await response.json()).news;
    } else {
      console.error("Error: Unable to fetch data.");
    }
  } catch (error) {
    console.error("Exeption: ", error.message);
  }
}

// function to update the news for the selected country.
async function getNewsForSelectedCountry(selectedCountry) {
  let selectedCountryCode = selectedCountry[0].cca2;
  let selectedCountryNews = await fetchCountyNews(selectedCountryCode);
  // inserting news for selected country in news section.
  let newsSection = document.getElementById("newsSection");
  selectedCountryNews.forEach((news) => {
    newsSection.innerHTML += `
      <div id="newsBox" class="col-md-3 col-sm-6 overflow-hidden">
      <div class="news-box">
        <div class="new-thumb" style="height: 159.69px;"> 
          <span class="cat c1">General</span> 
          <img class="h-100" src="${news.image}" alt="no-image"> 
        </div>
        <div class="new-txt">
          <ul class="news-meta">
            <li>${news.publish_date}</li>
          </ul>
          <h6 style="line-height: 1.2; max-height: 110px;">
            <a style="line-height: 1.2; max-height: 110px;" href="index.html#">${
              news.title
            }</a>
          </h6>
          <div class="bg-white position-relative ">
            <p style="height: 170px; overflow: hidden;" class="bg-white overflow-hidden">
            ${news.text.substring(0, 100).replace(/ (\S+)$/, '.')}
            </p>
          </div>
        </div>
        <div class="news-box-f"> 
          <img src="https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png" alt=""> 
          ${news.author.split(" ", 1)[0]} 
          <a href="index.html#"><i class="fas fa-arrow-right"></i></a> 
        </div>
      </div>
    </div>
  `;
  });
}

// function to update the page content for the selected country.
async function updateCountrySections(selectedCountry) {
  // getting country elements from DOM. section(depart-info).
  let countryFlag = document.getElementById("countryFlag");
  let countryCoatOfArms = document.getElementById("countryCoatOfArms");
  let countryUnitedNationsTrue = document.getElementById(
    "countryUnitedNationsTrue"
  );
  let countryUnitedNationsFalse = document.getElementById(
    "countryUnitedNationsFalse"
  );
  let independentTrue = document.getElementById("independentTrue");
  let independentFalse = document.getElementById("independentFalse");
  // displaying country data on page. section(depart-info).
  countryFlag.src = selectedCountry[0].flags.png;
  countryCoatOfArms.src = selectedCountry[0].coatOfArms.png;
  if (selectedCountry[0].independent) {
    independentTrue.style.display = "inline-block";
    independentFalse.style.display = "none";
  } else {
    independentTrue.style.display = "none";
    independentFalse.style.display = "inline-block";
  }
  if (selectedCountry[0].unMember) {
    countryUnitedNationsTrue.style.display = "inline-block";
    countryUnitedNationsFalse.style.display = "none";
  } else {
    countryUnitedNationsTrue.style.display = "none";
    countryUnitedNationsFalse.style.display = "inline-block";
  }
  // getting country elements from DOM. section(some-facts).
  let countryPopulation = document.getElementById("countryPopulation");
  let countryRegion = document.getElementById("countryRegion");
  let countryStartOfWeek = document.getElementById("countryStartOfWeek");
  let countryTimeZone = document.getElementById("countryTimeZone");
  let Capital = document.getElementById("Capital");
  // displaying country data on page. section(some-facts).
  countryPopulation.innerHTML = selectedCountry[0].population.toLocaleString();
  countryRegion.innerHTML = selectedCountry[0].region;
  countryStartOfWeek.innerHTML = selectedCountry[0].startOfWeek;
  countryTimeZone.innerHTML = selectedCountry[0].timezones[0];
  Capital.innerHTML = selectedCountry[0].capital;
  // getting country elements from DOM. section(map-form).
  let countryMap = document.getElementById("countryMap");
  // displaying country data on page. section(map-form).
  let selectedCountryName = selectedCountry[0].name.common;
  const countryMapSource = `https://www.google.com/maps?q=${selectedCountryName}&hl=en&z=6&output=embed`;
  countryMap.src = `${countryMapSource}`;
  // updating news section.
  getNewsForSelectedCountry(selectedCountry);
}

// function to use data from countries api.
async function main() {
  let countries = await fetchCountries();
  // inserting countries names in select menu.
  let selectCountriesOptgroup = document.getElementById(
    "selectCountriesOptgroup"
  );
  countries.forEach((country) => {
    selectCountriesOptgroup.innerHTML += `<option>${country.name.common}</option>`;
  });
  // getting the selected country name.
  let selectCountries = document.getElementById("selectCountries");
  selectCountries.addEventListener("change", async (event) => {
    let selectedCountryName = event.target.value;
    // getting the selected country data by name.
    let selectedCountry = await fetchCounty(selectedCountryName);
    await updateCountrySections(selectedCountry);
    // displaying country Sections.
    let countrySections = document.getElementsByClassName("countrySections");
    Array.from(countrySections).forEach((element) => {
      element.classList.remove("d-none");
    });
  });
  // getting the sendMailButton.
  let sendMailButton = document.getElementById("sendMailButton");
  sendMailButton.addEventListener("click", (ev) => {
    ev.preventDefault();
    sendMail();
    document.getElementById("emailForm").reset();
  });
}

// init emaijs to send mail.
(function () {
  emailjs.init("5HMZ-0J70wF4iY24o");
})();
// function to send mail.
function sendMail() {
  var params = {
    from_name: document.getElementById("fullName").value,
    email_id: document.getElementById("email_id").value,
    message: document.getElementById("message").value,
  };

  emailjs
    .send("service_lci72y7", "template_wn2zmfe", params)
    .then(function (res) {
      alert('Email has been sent successfully! \nStatus: ' + res.status);
    })
    .catch(function (error) {
      console.error("Error sending email: ", error);
    });
}

// calling the main functions.
main();
