// Data Layanan
const services = [
    {
        id: 1,
        name: 'Desain Arsitektur',
        description: 'Layanan desain arsitektur lengkap untuk rumah tinggal, komersial, dan bangunan publik',
        price: 'Mulai dari Rp 15.000.000',
        features: [
            'Konsep desain 3D',
            'Gambar kerja lengkap',
            'RAB (Rencana Anggaran Biaya)',
            'Revisi unlimited hingga ACC',
            'Konsultasi dengan arsitek',
        ],
        imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6',
        category: 'Architecture',
        popular: true
    },
    {
        id: 2,
        name: 'Desain Interior',
        description: 'Transformasi ruang interior dengan desain yang fungsional dan estetis',
        price: 'Mulai dari Rp 10.000.000',
        features: [
            'Konsep interior 3D',
            'Pemilihan material & finishing',
            'Furniture custom design',
            'Mood board & color scheme',
            'Project supervision',
        ],
        imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6',
        category: 'Interior',
        popular: true
    },
    {
        id: 3,
        name: 'Build & Construction',
        description: 'Layanan konstruksi lengkap dari pondasi hingga finishing dengan quality control',
        price: 'Mulai dari Rp 20.000.000',
        features: [
            'Project Planning',
            'Material Sourcing',
            'Skilled workers team',
            'Mood board & color scheme',
            'Project supervision',
        ],
        imageUrl:'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6',
        category: 'Construction',
        popular: true
    },
];

// State Management
let currentCategory = 'All';
let searchTerm = '';

// Elemen DOM
const searchInput = document.getElementById('searchInput');
const categoryFilters = document.getElementById('categoryFilters');
const resultsCount = document.getElementById('resultsCount');
const popularServices = document.getElementById('popularServices');
const regularServices = document.getElementById('regularServices');
const popularServicesSection = document.getElementById('popularServicesSection');
const regularServicesSection = document.getElementById('regularServicesSection');
const noResults = document.getElementById('noResults');
const resetFiltersButton = document.getElementById('resetFilters');

// Inisialisasi Halaman
function initializePage() {
    setupEventListeners();
    createCategoryFilters();
    renderServices();
}

// Event Listeners
function setupEventListeners() {
    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value.toLowerCase();
        renderServices();
    });

    resetFiltersButton.addEventListener('click', () => {
        searchInput.value = '';
        searchTerm = '';
        currentCategory = 'All';
        updateActiveCategory();
        renderServices();
    });
}

// Create Filters
function createCategoryFilters() {
    const categories = ['All', ...new Set(services.map(s => s.category))];
    
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = `filter-button ${category === 'All' ? 'active' : ''}`;
        button.textContent = category;
        button.addEventListener('click', () => {
            currentCategory = category;
            updateActiveCategory();
            renderServices();
        });
        categoryFilters.appendChild(button);
    });
}

// Update Activity
function updateActiveCategory() {
    document.querySelectorAll('.filter-button').forEach(button => {
        button.classList.toggle('active', button.textContent === currentCategory);
    });
}

// Filter Services
function filterServices() {
    return services.filter(service => {
        const matchesCategory = currentCategory === 'All' || service.category === currentCategory;
        const matchesSearch = 
            service.name.toLowerCase().includes(searchTerm) ||
            service.description.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });
}

// Service Card
function createServiceCard(service) {
    const card = document.createElement('div');
    card.className = 'service-card fade-in';
    card.setAttribute('data-category', service.category);
    
    const categoryIcon = service.category.toLowerCase();
    
    card.innerHTML = `
        <div class="service-image">
            <img src="${service.imageUrl}" alt="${service.name}" onerror="console.error('Image failed to load:', this.src)">
            <div class="popular-badge">⭐ Popular</div>
        </div>
        <div class="service-content">
            <h2 class="service-title">${service.name}</h2>
            <p class="service-description">${service.description}</p>
            <div class="service-price">${service.price}</div>
            <ul class="features">
                ${service.features.slice(0, 3).map(feature => `
                    <li>
                        <span class="check-icon">✓</span>
                        ${feature}
                    </li>
                `).join('')}
            </ul>
            ${service.features.length > 3 ? 
                `<div class="additional-features">+${service.features.length - 3} fitur lainnya</div>` : 
                ''
            }
            <a href="#" class="consult-button">
                Konsultasi Gratis
                ${service.category === 'Construction' ? 
                    `<span class="arrow">→</span>` : 
                    `<span class="arrow">→</span>`
                }
            </a>
        </div>
    `;
    
    return card;
}

// Render
function renderServices() {
    const filteredServices = filterServices();
    const popularServicesList = filteredServices.filter(s => s.popular);
    const regularServicesList = filteredServices.filter(s => !s.popular);

    // Update results
    resultsCount.textContent = `Menampilkan ${filteredServices.length} dari ${services.length} layanan`;

    // Clear Services
    if (popularServices) popularServices.innerHTML = '';
    if (regularServices) regularServices.innerHTML = '';

    if (filteredServices.length === 0) {
        // No Results Massage
        if (noResults) {
            noResults.classList.remove('hidden');
            noResults.style.display = 'block';
        }
        if (popularServicesSection) popularServicesSection.classList.add('hidden');
        if (regularServicesSection) regularServicesSection.classList.add('hidden');
    } else {
        // Hide message
        if (noResults) {
            noResults.classList.add('hidden');
            noResults.style.display = 'none';
        }
        
        // Render popular services
        if (popularServicesList.length > 0 && popularServicesSection && popularServices) {
            popularServicesSection.classList.remove('hidden');
            popularServicesList.forEach(service => {
                popularServices.appendChild(createServiceCard(service));
            });
        } else if (popularServicesSection) {
            popularServicesSection.classList.add('hidden');
        }

        // Render regular services
        if (regularServicesList.length > 0 && regularServicesSection && regularServices) {
            regularServicesSection.classList.remove('hidden');
            regularServicesList.forEach(service => {
                regularServices.appendChild(createServiceCard(service));
            });
        } else if (regularServicesSection) {
            regularServicesSection.classList.add('hidden');
        }
    }
}

// Navigation function
function navigateTo(page) {
    console.log(`Navigating to ${page}`);
}

// Initialize DOM page
document.addEventListener('DOMContentLoaded', initializePage);
