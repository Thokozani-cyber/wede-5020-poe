document.addEventListener('DOMContentLoaded', function() {

    // ========================
    // 1. ACCORDION (About page)
    // ========================
    const headers = document.querySelectorAll('.accordion-header');
    headers.forEach(header => {
        header.addEventListener('click', function() {
            const body = this.nextElementSibling;
            body.classList.toggle('active');
            // Close others (optional)
            // document.querySelectorAll('.accordion-body').forEach(b => { if(b !== body) b.classList.remove('active'); });
        });
    });

    // ========================
    // 2. LIGHTBOX GALLERY (Services page)
    // ========================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = document.querySelector('.close-lightbox');

    // Function to render gallery from pets data
    function renderGallery(filteredPets = pets) {
        const gallery = document.getElementById('petGallery');
        if (!gallery) return;
        gallery.innerHTML = '';
        filteredPets.forEach(pet => {
            const img = document.createElement('img');
            img.src = pet.image;
            img.alt = `${pet.name} - ${pet.breed}`;
            img.loading = 'lazy';
            img.dataset.id = pet.id;
            img.addEventListener('click', function() {
                lightbox.style.display = 'flex';
                lightboxImg.src = this.src;
                lightboxImg.alt = this.alt;
            });
            const card = document.createElement('div');
            card.className = 'gallery-item';
            card.innerHTML = `
                ${img.outerHTML}
                <p><strong>${pet.name}</strong> (${pet.type})<br>${pet.breed} - ${pet.age}</p>
            `;
            // Re-attach event because outerHTML removes listeners
            card.querySelector('img').addEventListener('click', function(e) {
                lightbox.style.display = 'flex';
                lightboxImg.src = this.src;
                lightboxImg.alt = this.alt;
            });
            gallery.appendChild(card);
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => { lightbox.style.display = 'none'; });
    }
    window.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.style.display = 'none';
    });

    // ========================
    // 3. SEARCH / FILTER (Services page)
    // ========================
    const searchInput = document.getElementById('searchPet');
    if (searchInput) {
        // Initial render
        renderGallery(pets);
        searchInput.addEventListener('input', function() {
            const term = this.value.toLowerCase().trim();
            const filtered = pets.filter(p => 
                p.name.toLowerCase().includes(term) ||
                p.type.toLowerCase().includes(term) ||
                p.breed.toLowerCase().includes(term)
            );
            renderGallery(filtered);
        });
    }

    // ========================
    // 4. INTERACTIVE MAP (Contact page - Leaflet)
    // ========================
    if (document.getElementById('contactMap')) {
        // Check if Leaflet is loaded
        if (typeof L !== 'undefined') {
            const map = L.map('contactMap').setView([39.7817, -89.6501], 13); // Springfield, IL
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // Location 1
            L.marker([39.7917, -89.6501]).addTo(map)
                .bindPopup('Main Shelter: 123 Pet Lane')
                .openPopup();
            
            // Location 2
            L.marker([39.7717, -89.6301]).addTo(map)
                .bindPopup('Adoption Center: 456 Oak Avenue');
        } else {
            document.getElementById('contactMap').innerHTML = '<p>Map library failed to load.</p>';
        }
    }

    // ========================
    // 5. ENQUIRY FORM (AJAX Submission)
    // ========================
    const enquiryForm = document.getElementById('enquiryForm');
    const formResponse = document.getElementById('formResponse');
    const formError = document.getElementById('formError');

    if (enquiryForm) {
        enquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            formError.style.display = 'none';
            formResponse.innerHTML = '';

            // Client-side validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const type = document.getElementById('enquiryType').value;
            const message = document.getElementById('message').value.trim();

            let errors = [];
            if (name.length < 2) errors.push('Name must be at least 2 characters.');
            if (!email.includes('@')) errors.push('Please enter a valid email.');
            if (!type) errors.push('Please select an enquiry type.');
            if (message.length < 10) errors.push('Message must be at least 10 characters.');

            if (errors.length > 0) {
                formError.style.display = 'block';
                formError.innerHTML = errors.join('<br>');
                return;
            }

            // AJAX Simulation (Async)
            formResponse.innerHTML = '<em>Sending your enquiry via AJAX...</em>';
            formResponse.style.color = '#31708f';

            // Simulate async request with setTimeout (like calling a real API)
            setTimeout(function() {
                // Simulate a dynamic response based on type
                let reply = '';
                if (type === 'volunteer') {
                    reply = '✅ Thank you! Volunteer orientation is held every Saturday at 10 AM. We will email you the details shortly.';
                } else if (type === 'sponsor') {
                    reply = '✅ Thank you for your interest in sponsoring! Sponsorship costs $25/month which covers food and medical care. Our coordinator will contact you.';
                } else {
                    reply = '✅ Thank you! We appreciate your interest in both volunteering and sponsoring. A team member will call you within 48 hours.';
                }
                formResponse.style.color = '#3c763d';
                formResponse.innerHTML = reply;
                enquiryForm.reset();
            }, 1500); // Simulate network delay
        });
    }

    // ========================
    // 6. CONTACT FORM (Mailto: compilation)
    // ========================
    const contactForm = document.getElementById('contactForm');
    const contactError = document.getElementById('contactError');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            contactError.style.display = 'none';

            const name = document.getElementById('cname').value.trim();
            const email = document.getElementById('cemail').value.trim();
            const subject = document.getElementById('csubject').value;
            const message = document.getElementById('cmessage').value.trim();

            let errors = [];
            if (name.length < 2) errors.push('Name is required.');
            if (!email.includes('@')) errors.push('Valid email is required.');
            if (message.length < 10) errors.push('Message must be at least 10 characters.');

            if (errors.length > 0) {
                contactError.style.display = 'block';
                contactError.innerHTML = errors.join('<br>');
                return;
            }

            // Compile into email (mailto:)
            const recipient = 'info@pawsandclaws.org';
            const subjectLine = `General Enquiry: ${subject}`;
            const body = `Name: ${name}%0AEmail: ${email}%0A%0AMessage:%0A${encodeURIComponent(message)}`;
            const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subjectLine)}&body=${body}`;
            
            // Open user's email client
            window.location.href = mailtoLink;
            document.getElementById('mailtoFeedback').innerHTML = '📧 Opening your email client... Please send the email.';
        });
    }

});

// Array of pet objects for dynamic loading and search
const pets = [
    { id: 1, name: "Buddy", type: "Dog", breed: "Labrador Mix", age: "2 years", image: "images/pet1.jpg" },
    { id: 2, name: "Luna", type: "Cat", breed: "Siamese", age: "1 year", image: "images/pet2.jpg" },
    { id: 3, name: "Max", type: "Dog", breed: "German Shepherd", age: "3 years", image: "images/pet3.jpg" },
    { id: 4, name: "Bella", type: "Cat", breed: "Persian", age: "4 months", image: "images/pet4.jpg" },
    { id: 5, name: "Charlie", type: "Dog", breed: "Beagle", age: "5 years", image: "images/pet5.jpg" },
    { id: 6, name: "Milo", type: "Small Pet", breed: "Rabbit", age: "1 year", image: "images/pet6.jpg" }
];
