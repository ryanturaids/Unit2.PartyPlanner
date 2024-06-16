const apiURL = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2404-FTB-MT-WEB-PT/events'

const state = {
  events: []
};

const eventList = document.querySelector('#events');
const addEventForm = document.querySelector('#addEvents')
addEventForm.addEventListener('submit', addEvent)



// render
async function render() {
  await getEvents();
  renderEvents(); 
}

render();

// render events
function renderEvents() {
  const eventCard = state.events.map((event) => {
    const li = document.createElement('li');
    li.innerHTML = `
    <div>
      <p>${event.id}</p>
      <div>
        <button data-id="${event.id}" class="deleteButton">Delete Event</button>
      </div>
    </div>
    <h2>${event.name}</h2>
    <p>${event.description}</p>
    <p>${event.location}</p>
    <p>${new Date(event.date).toLocaleString()}</p>
    `
    return li
  })
  eventList.replaceChildren(...eventCard)
  const deleteButtons = document.querySelectorAll('.deleteButton');
  deleteButtons.forEach(button => {
    button.addEventListener('click', deleteEvent);
  })
}

// get events
async function getEvents() {
  const response = await fetch(apiURL, {
    method: 'GET'
  });
  const json = await response.json();
  state.events = json.data;
}

// add event
async function addEvent(event) {
  event.preventDefault();
  try {
    const response = await fetch(apiURL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: addEventForm.name.value,
        description: addEventForm.description.value,
        location: addEventForm.location.value,
        date: new Date(addEventForm.date.value).toISOString()
      })
    })
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create event: ${response.statusText} - ${errorText}`);
    }
    const createdEvent = await response.json();
    console.log('Event created:',createdEvent);
    render()
  } catch(error) {
    console.log(error)
  }
}

// delete event
async function deleteEvent(event) {
  const id = event.target.getAttribute('data-id');
  try {
    const response = await fetch(`${apiURL}/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.log(error)
  }
  render();
}