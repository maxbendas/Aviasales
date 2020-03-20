const formSearch = document.querySelector('.form-search');
const inputCitiesFrom = document.querySelector('.input__cities-from');
const dropdownCitiesFrom = document.querySelector('.dropdown__cities-from');
const inputCitiesTo = document.querySelector('.input__cities-to');
const dropdownCitiesTo = document.querySelector('.dropdown__cities-to');
const inputDateDepart = document.querySelector('.input__date-depart');

//данные
const citiesApi = 'dataBase/cities.json';
const proxy = 'https://cors-anywhere.herokuapp.com/';
const API_KEY = 'c57f579ceff783514f2df094c5ef51d4';
const calendar = 'http://min-prices.aviasales.ru/calendar_preload';


let city = [];

const getData = (url, callback) => {
  const request = new XMLHttpRequest();

  request.open('GET', url);

  request.addEventListener('readystatechange', () => {
    if (request.readyState !== 4) return;

    if (request.status === 200) {
      callback(request.response);
    } else {
      console.error(request.status)
    }
  });

  request.send();
};

const showCity = (input, list) => {

  list.textContent = '';

  if (input.value !== '') {
    const filterCity = city.filter((item) => {
      const fixItem = item.name.toLowerCase();
      return fixItem.includes(input.value.toLowerCase());
    });

    filterCity.forEach((item) => {
      const li = document.createElement('li');
      li.classList.add('dropdown__city');
      li.textContent = item.name;
      list.append(li);
    });
  }
};

const selectCity = (event, input, list) => {
  const target = event.target;
  if (target.tagName.toLowerCase() === 'li') {
    input.value = target.textContent;
    list.textContent = '';
  }
}

const renderCheapDay = (cheapTicket) => {
  console.log('cheapTicket: ', cheapTicket);

};

const renderCheapYear = (cheapTickets) => {
  console.log('cheapTickets: ', cheapTickets);

};

const renderCheap = (data, date) => {
  const cheapTicketYear = JSON.parse(data).best_prices;

  // ==========================ДЗ=================
  const cheapTicketYearSort = cheapTicketYear.sort((a, b) => {
    if (a.value > b.value) {
      return 1;
    }
    if (a.value < b.value) {
      return -1;
    }
    // a должно быть равным b
    return 0;
  });

  console.log('cheapTicketYearSort: ', cheapTicketYearSort);
  // ==============================================

  const cheapTicketDay = cheapTicketYear.filter((item) => {
    return item.depart_date === date;
  })

  renderCheapDay(cheapTicketDay);
  renderCheapYear(cheapTicketYear);
};

inputCitiesFrom.addEventListener('input', () => {
  showCity(inputCitiesFrom, dropdownCitiesFrom)
});

inputCitiesTo.addEventListener('input', () => {
  showCity(inputCitiesTo, dropdownCitiesTo)
});

dropdownCitiesFrom.addEventListener('click', (event) => {
  selectCity(event, inputCitiesFrom, dropdownCitiesFrom)
});

dropdownCitiesTo.addEventListener('click', (event) => {
  selectCity(event, inputCitiesTo, dropdownCitiesTo)
});

formSearch.addEventListener('submit', (event) => {
  event.preventDefault()

  const cityFrom = city.find(item => inputCitiesFrom.value === item.name);
  const cityTo = city.find(item => inputCitiesTo.value === item.name);

  const formData = {
    from: cityFrom.code,
    to: cityTo.code,
    when: inputDateDepart.value,
  }

  const requestData = `?depart_date=${formData.when}&origin=${formData.from}&destination=${formData.to}&one_way=true`;
  console.log('requestData: ', requestData);

  // const requestData2 = '?depart_date=' + formData.when +
  //   '&origin=' + formData.from +
  //   '&destination=' + formData.to +
  //   '&one_way=true';

  getData(calendar + requestData, (response) => {
    renderCheap(response, formData.when);
  });

});

//Вызовы функций

getData(citiesApi, (data) => {
  city = JSON.parse(data).filter(item => item.name);
});

// getData(proxy + calendar + '?depart_date=2020-05-25&origin=SVX')


