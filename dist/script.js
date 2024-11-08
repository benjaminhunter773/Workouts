const bodyPartSelect = document.getElementById('bodyPart');
const exerciseDetails = document.getElementById('exerciseDetails');
const searchInput = document.getElementById('searchInput');

// API options with your provided API key
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'f396806c91mshd4ea3e6098735ccp1b128ajsn440555032062', // Your actual API key
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
  }
};

// Fetch all body parts on page load
fetch('https://exercisedb.p.rapidapi.com/exercises/bodyPartList', options)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(bodyParts => {
    bodyParts.forEach(part => {
      const option = document.createElement('option');
      option.value = part;
      option.textContent = capitalizeFirstLetter(part);
      bodyPartSelect.appendChild(option);
    });
  })
  .catch(err => {
    console.error(err);
    bodyPartSelect.innerHTML = '<option value="">Failed to load body parts</option>';
  });

// Event listener for body part selection
bodyPartSelect.addEventListener('change', function() {
  const selectedPart = this.value;
  if (selectedPart) {
    exerciseDetails.innerHTML = '<div class="loader"></div>';
    fetch(`https://exercisedb.p.rapidapi.com/exercises/bodyPart/${selectedPart}`, options)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch exercises');
        }
        return response.json();
      })
      .then(exercises => {
        displayExercises(exercises);
      })
      .catch(err => {
        console.error(err);
        exerciseDetails.innerHTML = '<p>Failed to load exercises. Please try again later.</p>';
      });
  } else {
    exerciseDetails.innerHTML = '';
  }
});

// Event listener for search input
searchInput.addEventListener('input', function() {
  const query = this.value.toLowerCase();
  if (query.length === 0) {
    exerciseDetails.innerHTML = '';
    return;
  }

  exerciseDetails.innerHTML = '<div class="loader"></div>';

  fetch('https://exercisedb.p.rapidapi.com/exercises', options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch exercises');
      }
      return response.json();
    })
    .then(exercises => {
      const filtered = exercises.filter(exercise => exercise.name.toLowerCase().includes(query));
      displayExercises(filtered);
    })
    .catch(err => {
      console.error(err);
      exerciseDetails.innerHTML = '<p>Failed to load exercises. Please try again later.</p>';
    });
});

// Function to display exercises
function displayExercises(exercises) {
  exerciseDetails.innerHTML = ''; // Clear previous exercises

  if (exercises.length === 0) {
    exerciseDetails.innerHTML = '<p>No exercises found.</p>';
    return;
  }

  exercises.forEach(exercise => {
    const card = document.createElement('div');
    card.className = 'exercise-card';

    const img = document.createElement('img');
    img.src = exercise.gifUrl;
    img.alt = exercise.name;

    const info = document.createElement('div');
    info.className = 'exercise-info';

    const title = document.createElement('h2');
    title.textContent = capitalizeFirstLetter(exercise.name);

    const description = document.createElement('p');
    description.innerHTML = `<strong>Target:</strong> ${capitalizeFirstLetter(exercise.target)}<br>
                             <strong>Equipment:</strong> ${capitalizeFirstLetter(exercise.equipment)}<br>
                             <strong>Body Part:</strong> ${capitalizeFirstLetter(exercise.bodyPart)}`;

    info.appendChild(title);
    info.appendChild(description);

    card.appendChild(img);
    card.appendChild(info);

    exerciseDetails.appendChild(card);
  });
}

// Utility function to capitalize first letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}