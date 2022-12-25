// Get the dots container element
const dotsContainer = document.querySelector('.dots-container');

// Set the number of dots to create
const numDots = 10;

// Create a template string for the dot HTML
const dotTemplate = `<div class="dot"><br/></div>`;

// Create a string to hold the HTML for all of the dots
let dotsHTML = '';

// Create a loop to generate the HTML for the dots
for (let i = 0; i < numDots; i++) {
  // Add the dot HTML to the string
  dotsHTML += dotTemplate;
}

// Set the inner HTML of the dots container to the dots HTML
dotsContainer.innerHTML = dotsHTML;

// Get all of the dot elements
const dots = document.querySelectorAll('.dot');

// Set the width and height of the dots container
const containerWidth = dotsContainer.offsetWidth;
const containerHeight = dotsContainer.offsetHeight;

// Loop through the dot elements and set random positions
dots.forEach(dot => {
  // Generate random top and left values
  const top = Math.floor(Math.random() * containerHeight);
  const left = Math.floor(Math.random() * containerWidth);

  // Set the top and left positions of the dot
  dot.style.top = `${top}px`;
  dot.style.left = `${left}px`;
});
