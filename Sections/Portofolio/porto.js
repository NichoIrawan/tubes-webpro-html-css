// State Management
let portfolios = [];
let currentCategory = 'All';
let searchTerm = '';
let gridView = '3';

// Default Portfolio Data
const defaultPortfolios = [
    {
        id: 1,
        title: 'Modern Minimalist House',
        category: 'Residential',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
        description: 'A beautiful modern minimalist house with clean lines and open spaces, featuring sustainable materials and energy-efficient design',
        completedDate: '2025-09-15'
    },
    {
        id: 2,
        title: 'Corporate Office Design',
        category: 'Commercial',
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
        description: 'Contemporary office space design for tech company with collaborative zones and modern amenities',
        completedDate: '2025-08-20'
    },
    {
        id: 3,
        title: 'Luxury Villa Interior',
        category: 'Interior',
        imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
        description: 'High-end interior design for luxury villa with premium materials and custom furnishings',
        completedDate: '2025-10-05'
    },
    {
        id: 4,
        title: 'Urban Apartment Complex',
        category: 'Residential',
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
        description: 'Modern apartment complex with community spaces and smart home integration',
        completedDate: '2025-07-10'
    }
];

// Get portfolios from localStorage or use default data
function getPortfolios() {
    const stored = localStorage.getItem('portfolios');
    if (stored) {
        return JSON.parse(stored);
    }
    return defaultPortfolios;
}

// DOM Elements
let searchInput, categoryFilters, portfolioGrid, noResults, resetFiltersButton;

// Initialize page
function initializePage() {
    // Load portfolios
    portfolios = getPortfolios();
    
    // Get DOM elements
    searchInput = document.getElementById('searchInput');
    categoryFilters = document.getElementById('categoryFilters');
    portfolioGrid = document.getElementById('portfolioGrid');
    noResults = document.getElementById('noResults');
    resetFiltersButton = document.getElementById('resetFilters');
    
    // Setup event listeners
    setupEventListeners();
    createCategoryFilters();
    setupGridToggle();
    renderPortfolios();
}

// Event Listeners Setup
function setupEventListeners() {
    // Search input handler with debounce
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchTerm = e.target.value.toLowerCase();
            renderPortfolios();
        }, 300); // Debounce search for better performance
    });

    // Reset filters handler
    resetFiltersButton.addEventListener('click', () => {
        searchInput.value = '';
        searchTerm = '';
        currentCategory = 'All';
        updateActiveCategory();
        renderPortfolios();
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('portfolioModal');
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Create Filters
function createCategoryFilters() {
    const categories = ['All', ...new Set(portfolios.map(p => p.category))];
    
    categoryFilters.innerHTML = '';
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = `filter-button ${category === 'All' ? 'active' : ''}`;
        button.textContent = category;
        button.addEventListener('click', () => {
            currentCategory = category;
            updateActiveCategory();
            renderPortfolios();
        });
        categoryFilters.appendChild(button);
    });
}

// Setup Grid Toggle
function setupGridToggle() {
    const gridButtons = document.querySelectorAll('.grid-button');
    gridButtons.forEach(button => {
        button.addEventListener('click', () => {
            gridView = button.dataset.grid;
            portfolioGrid.className = `grid-${gridView}`;
            gridButtons.forEach(btn => btn.classList.toggle('active', btn === button));
        });
    });
}

// Update Active Category
function updateActiveCategory() {
    document.querySelectorAll('.filter-button').forEach(button => {
        button.classList.toggle('active', button.textContent === currentCategory);
    });
}

// Filter Portfolios
function filterPortfolios() {
    return portfolios.filter(portfolio => {
        const matchesCategory = currentCategory === 'All' || portfolio.category === currentCategory;
        const matchesSearch = 
            portfolio.title.toLowerCase().includes(searchTerm) ||
            portfolio.description.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });
}

// Format Date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Create Portfolio Card
function createPortfolioCard(portfolio) {
    const card = document.createElement('div');
    card.className = 'portfolio-card fade-in';
    
    card.innerHTML = `
        <div class="portfolio-image">
            <img src="${portfolio.imageUrl}" alt="${portfolio.title}">
            <div class="portfolio-overlay">
                <div class="view-details">
                    Lihat Detail <i data-feather="arrow-right"></i>
                </div>
            </div>
            <div class="category-badge">${portfolio.category}</div>
        </div>
        <div class="portfolio-content">
            <h3 class="portfolio-title">${portfolio.title}</h3>
            <p class="portfolio-description">${portfolio.description}</p>
            <div class="portfolio-date">
                <i data-feather="calendar"></i>
                <span>${formatDate(portfolio.completedDate)}</span>
            </div>
        </div>
    `;
    
    // Add click event for modal
    card.addEventListener('click', () => showModal(portfolio));
    
    // Initialize Feather icons
    feather.replace();
    
    return card;
}

// Render Portfolios
function renderPortfolios() {
    const filteredPortfolios = filterPortfolios();
    
    // Update results count
    document.getElementById('resultsCount').textContent = 
        `Menampilkan ${filteredPortfolios.length} dari ${portfolios.length} portfolio`;
    
    // Clear and update grid
    portfolioGrid.innerHTML = '';
    
    if (filteredPortfolios.length === 0) {
        noResults.classList.remove('hidden');
        portfolioGrid.classList.add('hidden');
    } else {
        noResults.classList.add('hidden');
        portfolioGrid.classList.remove('hidden');
        filteredPortfolios.forEach((portfolio, index) => {
            const card = createPortfolioCard(portfolio);
            // Add animation delay based on index
            card.style.animationDelay = `${index * 0.1}s`;
            portfolioGrid.appendChild(card);
        });
        
        // Re-initialize feather icons after rendering cards
        feather.replace();
    }
}

// Modal Functions
function showModal(portfolio) {
    const modal = document.getElementById('portfolioModal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title">${portfolio.title}</h2>
            <p>Detail lengkap portfolio proyek</p>
        </div>
        
        <div class="modal-image">
            <img src="${portfolio.imageUrl}" alt="${portfolio.title}"
                 onerror="this.src='../../Assets/images/placeholder.jpg'">
        </div>
        
        <div class="grid-cols-2">
            <div>
                <div class="text-label">Kategori</div>
                <div class="category-badge">${portfolio.category}</div>
            </div>
            <div>
                <div class="text-label">Tanggal Selesai</div>
                <div class="date-info">
                    <i data-feather="calendar"></i>
                    <span>${formatDate(portfolio.completedDate)}</span>
                </div>
            </div>
        </div>
        
        <div class="description">
            <div class="text-label">Deskripsi</div>
            <p>${portfolio.description}</p>
        </div>
        
        <div class="modal-actions">
            <button onclick="navigateTo('booking')" class="primary-button">
                Booking Konsultasi <i data-feather="arrow-right"></i>
            </button>
            <button onclick="navigateTo('contact')" class="secondary-button">
                Hubungi Kami <i data-feather="message-circle"></i>
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Initialize feather icons in modal
    feather.replace();
}

function closeModal() {
    const modal = document.getElementById('portfolioModal');
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
}

// Navigation
function navigateTo(page) {
    if (page === 'booking') {
        window.location.href = '/booking';
    } else if (page === 'contact') {
        window.location.href = '/contact';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);
