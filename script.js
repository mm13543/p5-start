let apiKey = 'StOECClhHckL8W5Tm6uM0Yw2SO7g62VA';
let offset = 0; // Track the offset for pagination

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  const searchButton = select('#searchButton');
  searchButton.mousePressed(searchGIFs);
  
}

function searchGIFs() {
  const searchInput = document.getElementById('searchInput').value;
  const url = `https://api.giphy.com/v1/gifs/search?q=${searchInput}&api_key=${apiKey}&limit=9&offset=${offset}`;
  console.log('API URL:', url);
  loadJSON(url, gotData);
}

function gotData(data) {
  console.log('Received data from the API:', data);
  // Clear previous results
  const gifContainer = select('#gifContainer');
  gifContainer.html('');

  // Apply the CSS class to style each cell
  for (let i = 0; i < data.data.length; i++) {
    const gifData = data.data[i];
    const img = createImg(gifData.images.fixed_height.url);
    img.parent(gifContainer);
    img.class('gif-cell');
    img.mouseOver(enlargeGIFOnHover);
    img.mouseOut(shrinkGIFOnHover);

    // Set the initial scale to 0.9
    img.style('transform', 'scale(0.9)');

    // Generate a random background color for each cell.
    const randomColor = color(random(255), random(255), random(255));
    img.style('background-color', randomColor);

    // Add a download link for the GIF
    const downloadLink = createA(gifData.images.fixed_height.url, 'Download', '_blank');
    downloadLink.parent(gifContainer);
    downloadLink.class('download-link');
  }

  // Add pagination buttons
  const paginationDiv = select('#pagination');
  paginationDiv.html('');
  if (offset > 0) {
    const prevButton = createButton('Previous');
    prevButton.parent(paginationDiv);
    prevButton.mousePressed(previousPage);
  }
  if (data.pagination.total_count > offset + 9) {
    const nextButton = createButton('Next');
    nextButton.parent(paginationDiv);
    nextButton.mousePressed(nextPage);
  }
}

function enlargeGIFOnHover() {
  // Animate the GIF to a larger size when hovered
  this.style('transform', 'scale(1.1)');
  this.style('transition', 'transform 0.3s'); // Add smooth transition
  this.style('animation', 'wiggle 0.4s infinite'); // Add wiggle animation
}

function shrinkGIFOnHover() {
  // Animate the GIF back to its original size when not hovered
  this.style('transform', 'scale(0.9)');
  this.style('transition', 'transform 0.3s'); // Add smooth transition
  this.style('animation', 'none'); // Remove the wiggle animation
}

function previousPage() {
  offset = max(0, offset - 9);
  searchGIFs();
}

function nextPage() {
  offset += 9;
  searchGIFs();
}