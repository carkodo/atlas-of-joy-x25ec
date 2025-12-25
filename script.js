// --- 1. Your Location Data (18 DuPage County Parks) ---

const locations = [
    { id: 'p01', name: 'Gilbert Park', lat: 41.7947, lon: -88.0241, img: 'images/Gilbert.jpg', prompt: 'We passed by this park on the night of our memorable walk after the board meeting, and spent time exploring in visits since then.' },
    { id: 'p02', name: 'McCullom Park', lat: 41.7626, lon: -88.0066, img: 'images/McCullom.jpg', prompt: 'This place has so much meaning for us. The first time we professed our love; stolen moments in my car; a memorable sunrise.'},
    { id: 'p03', name: 'Ebersold Park', lat: 41.7784, lon: -88.0098, img: 'images/Ebersold1.jpg', prompt: 'Another amazing place, filled with memories. Stargazing, your birthday, and meaningful Sunday mornings.' },
    { id: 'p04', name: 'Oldfield Oaks', lat: 41.7286, lon: -88.0072, img: 'images/OldfieldOaks.jpg', prompt: 'We spent a beautiful fall day here, pausing to embrace and look in each other’s eyes.' },
    { id: 'p05', name: 'Meyer Woods Park', lat: 41.7285, lon: -88.0011, prompt: 'Our first park... and encounter with the police. Memorable by all accounts!' },
    { id: 'p06', name: 'Waterfall Glen', lat: 41.7214, lon: -87.9643, img: 'images/WaterfallGlen.jpg', prompt: 'A beautiful place for strolling and sharing our thoughts, and the first place you made me feel weak in the knees.' },
    { id: 'p07', name: 'Greene Valley', lat: 41.7447, lon: -88.0720, prompt: 'We spent so many incredible hours here, laying together on a blanket and learning more about each other in so many ways.' },
    { id: 'p08', name: 'Crabtree Park', lat: 41.7451, lon: -88.0549, prompt: 'Our favorite pocket park, where we spent many afternoons in each other’s arms.' },
    { id: 'p09', name: 'Fullersburg Woods', lat: 41.8206, lon: -87.9279, img: 'images/Fullersburg1.jpg', prompt: 'We’ve picnicked, and biked, and walked along the river here, holding hands and sharing our lives.' },
    { id: 'p10', name: 'Eldridge Park', lat: 41.8643, lon: -87.9525, img: 'images/Eldridge.jpg', prompt: 'The site of our first kiss. The place where you stole my heart.' },
    { id: 'p11', name: 'Knolls Park', lat: 41.8540, lon: -87.9952, img: 'images/Knolls2.jpg', prompt: 'The place where we first felt like we had found home -- and the site of our first Difficult Conversation.' },
    { id: 'p12', name: 'Lyman Woods', lat: 41.8292, lon: -88.0073, img: 'images/Lyman1.jpg', prompt: 'Our seasonal walks here have been so meaningful, so memorable.' },
    { id: 'p13', name: 'Ty Warner Park', lat: 41.8157, lon: -87.9723, prompt: 'Fond memories of laying on a blanket on the hill, talking... and more.' },
    { id: 'p14', name: 'West Desplaines River Path', lat: 41.6897, lon: -87.9714, img: 'images/RiverPath.jpg', prompt: 'Walking through the wilds of Lemont, there is peace in our clasped hands and connection in our shared stories.' },
    { id: 'p15', name: 'Bemis Woods', lat: 41.8279, lon: -87.9065, img: 'images/Bemis.jpg', prompt: 'A beautiful fall outing, walking hand in hand.' },
    { id: 'p16', name: 'St. James Farm', lat: 41.8332, lon: -88.1583, img: 'images/StJames.jpg', prompt: 'A new place to explore and remember why these walks are so important for us to connect.' },
    { id: 'p17', name: 'Big Rock', lat: 41.8214, lon: -88.0455, img: 'images/BigRock.jpg', prompt: 'Exploring the woods, hand in hand.' },
    { id: 'p18', name: 'Spruce Plot', lat: 41.8175, lon: -88.0450, img: 'images/SprucePlot.jpg', prompt: 'We had breakfast on a bench among the tall, majestic trees.' },
    { id: 'p19', name: 'Kingston Park', lat: 41.7837, lon: -88.0654, img: 'images/Kingston.jpg', prompt: 'A quiet place to share a breakfast picnic and create new connections.' },
    { id: 'p20', name: 'Whitlock Park', lat: 41.8137, lon: -87.9945, prompt: 'A newer addition to our repetoire of walks, and the closest to our neighborhood.' }
];

// --- 2. Map Initialization ---
// Calculated center to balance your new spread from St. James Farm to Fullersburg
const mapCenterLat = 41.775; 
const mapCenterLon = -88.015;

// Initializing with a zoom of 11 ensures the wider spread (St. James to Bemis) fits on screen
const map = L.map('map', { zoomControl: false }).setView([mapCenterLat, mapCenterLon], 11);

// Add the zoom control to the bottom right as we did before
L.control.zoom({ position: 'bottomright' }).addTo(map);
// --- 3. Base Map Provider (Clean Grayscale for Contrast) ---
// Loads a clean, light map background from the leaflet-providers library
L.tileLayer.provider('Esri.WorldGrayCanvas').addTo(map);

// --- 4. Custom Icons (Requires Font Awesome link in index.html) ---
// Icon for TO VISIT (Clean Antique Oxblood Heart)
const redHeartIcon = L.divIcon({
    className: 'custom-div-icon',
    html: '<i style="color: #6f1d1b; font-size: 30px;" class="fa-solid fa-heart"></i>',
    iconSize: [30, 30],
    iconAnchor: [15, 30]
});

// Icon for STAMPED (Clean Burnished Gold Seal)
const goldCheckIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `
        <i style="
            color: #bb9457; 
            font-size: 30px; 
            filter: contrast(150%) brightness(90%); 
            opacity: 0.9;
            mask-image: radial-gradient(circle, black 50%, rgba(0,0,0,0.5) 100%);
            -webkit-mask-image: radial-gradient(circle, black 50%, rgba(0,0,0,0.5) 100%);
        " class="fa-solid fa-circle-check"></i>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30]
});


// --- 5. Stamping Logic Function ---
// This function saves the location ID to the browser's local storage.
function stampLocation(locationId) {
    // 1. Get existing stamped IDs (or an empty array if none exist)
    const stampedIds = JSON.parse(localStorage.getItem('stampedLocations') || '[]');
    
    // 2. Add the new ID if it's not already in the list
    if (!stampedIds.includes(locationId)) {
        stampedIds.push(locationId);
        // 3. Save the updated list back to local storage
        localStorage.setItem('stampedLocations', JSON.stringify(stampedIds));
        
        // 4. Alert the user and reload the map to show the new icon color
        alert(`Memory STAMPED! Visit the map again to see the gold checkmark.`);
        window.location.reload();
    }
}

// Attach the stamping function to the window object so the HTML button can call it
window.stampLocation = stampLocation;

/// --- 6. Marker Placement Loop ---
const stampedIdsOnLoad = JSON.parse(localStorage.getItem('stampedLocations') || '[]');

locations.forEach(location => {
    const isStamped = stampedIdsOnLoad.includes(location.id);
    const currentIcon = isStamped ? goldCheckIcon : redHeartIcon;
    
    const marker = L.marker([location.lat, location.lon], { icon: currentIcon }).addTo(map);

    // 1. Start with the image (Edge-to-edge)
    let popupContent = '';
    if (location.img) {
        popupContent += `<img src="${location.img}" style="width: 100%; display: block; margin: 0; border-bottom: 1px solid #99582a;">`;
    }

    // 2. Title and Prompt (Centered via CSS)
    popupContent += `<h3 style="color: #6f1d1b; margin-top: 15px; font-family: 'Playfair Display', serif; text-align: center;">${location.name}</h3>`;
    popupContent += `<p style="text-align: center; padding: 0 15px;">${location.prompt}</p>`;

// 3. Action Area (Updated with your personal theme)
    popupContent += `<div style="display: flex; justify-content: center; width: 100%; padding-bottom: 15px; flex-direction: column; align-items: center;">`;

    if (isStamped) {
        // The "Ours Forever" Label
        popupContent += `
            <p style="
                color: #6f1d1b; 
                font-family: 'Playfair Display', serif; 
                font-weight: bold; 
                font-style: italic;
                letter-spacing: 2px;
                text-transform: uppercase;
                border-top: 1px solid #6f1d1b;
                border-bottom: 1px solid #6f1d1b;
                padding: 8px 0;
                width: 80%;
                text-align: center;
                margin: 10px 0;
            ">Ours Forever</p>`;
    } else {
        // The "Mark Our Spot" Button
        popupContent += `
            <button class="stamp-button" onclick="stampLocation('${location.id}')">
                Mark our spot
            </button>`;
    }

    popupContent += `</div>`; // Close the centered wrapper

    // 4. Bind the popup with consistent sizing
    marker.bindPopup(popupContent, {
        autoPan: true,
        autoPanPaddingTopLeft: L.point(10, 200),
        offset: L.point(0, -5),
        minWidth: 300,
        maxWidth: 300
    });

});


function checkPass() {
    const passInput = document.getElementById('pass-input');
    const overlay = document.getElementById('password-overlay');
    const error = document.getElementById('err-msg');
    
    // CHANGE 'ourword' to your actual secret word!
    // I recommend using your anniversary date or a nickname.
    const secretWord = 'library'; 

    if (passInput.value.toLowerCase() === secretWord) {
        // Fade out effect
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 800); // Matches the 0.8s transition in HTML
    } else {
        error.style.display = 'block';
        passInput.value = ''; // Clear the input for a second try
    }
}

// Allow pressing "Enter" key to unlock
document.getElementById('pass-input')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        checkPass();
    }
});