// ==================== UTILITY FUNCTIONS ====================

function scrollToClassify() {
    document.getElementById('classify').scrollIntoView({ behavior: 'smooth' });
}

// ==================== IMAGE UPLOAD ====================

const imageInput = document.getElementById('imageInput');
const uploadBox = document.querySelector('.upload-box');
const previewImage = document.getElementById('previewImage');
const modelSelect = document.getElementById('modelSelect');

let uploadedFile = null;

// Click to upload
uploadBox.addEventListener('click', () => {
    imageInput.click();
});

// File selected via input
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleFileUpload(file);
    }
});

// Drag & drop
uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.style.borderColor = '#8b2e42';
    uploadBox.style.backgroundColor = 'rgba(139, 46, 66, 0.1)';
});

uploadBox.addEventListener('dragleave', () => {
    uploadBox.style.borderColor = 'rgba(255,255,255,0.5)';
    uploadBox.style.backgroundColor = 'transparent';
});

uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.style.borderColor = 'rgba(255,255,255,0.5)';
    uploadBox.style.backgroundColor = 'transparent';
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleFileUpload(file);
    }
});

function handleFileUpload(file) {
    uploadedFile = file;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.style.display = 'block';
        console.log('✅ Image uploaded:', file.name);
    };
    reader.readAsDataURL(file);
}

// ==================== MODEL SELECTION MAPPING ====================

const modelMapping = {
    'model1': 'banana',
    'model2': 'egg',
    'model3': 'orange'
};

// ==================== IMAGE CLASSIFICATION ====================

async function classifyImage() {
    if (!uploadedFile) {
        alert('❌ Please upload an image first!');
        return;
    }

    const selectedModel = modelSelect.value;
    const modelType = modelMapping[selectedModel];

    if (!modelType) {
        alert('❌ Invalid model selected!');
        return;
    }

    console.log('🔍 Classifying with model:', modelType);

    const formData = new FormData();
    formData.append('image', uploadedFile);
    formData.append('object_type', modelType);

    try {
        const response = await fetch('/api/classify-image', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            displayResult(data.result);
        } else {
            alert('❌ Error: ' + data.error);
        }
    } catch (error) {
        console.error('❌ Error:', error);
        alert('❌ Error classifying image');
    }
}

function displayResult(result) {
    const resultClass = document.getElementById('resultClass');
    const confidenceText = document.getElementById('confidenceText');
    const confidenceLabel = document.getElementById('confidenceLabel');
    const confidenceBar = document.getElementById('confidenceBar');
    const summaryText = document.getElementById('summaryText');

    const condition = result.condition;
    const confidence = (result.confidence * 100).toFixed(2);

    // Update result display
    resultClass.textContent = condition.toUpperCase();
    confidenceText.textContent = confidence + '%';
    confidenceLabel.textContent = confidence + '%';
    confidenceBar.style.width = confidence + '%';

    // Update summary
    const modelName = modelMapping[modelSelect.value];
    summaryText.innerHTML = `
        <strong>Model:</strong> ${modelName.charAt(0).toUpperCase() + modelName.slice(1)}<br>
        <strong>Condition:</strong> ${condition}<br>
        <strong>Confidence:</strong> ${confidence}%<br>
        <br>
        ${condition.includes('Clean') 
            ? '✅ Water quality is clean and safe!' 
            : '⚠️ Iron contamination detected in water!'}
    `;

    // Change color based on result
    if (condition.includes('Clean')) {
        resultClass.style.color = '#4ade80';
    } else {
        resultClass.style.color = '#fca5a5';
    }

    console.log('✅ Result displayed:', result);
}

// ==================== MODELS CAROUSEL ====================

const modelsData = [
    {
        emoji: '🍌',
        title: 'Banana Expert',
        description: 'Specialized CNN model for banana classification.',
        images: ['photos/bc.jpg', 'photos/bi.jpg', 'photos/br.jpg']
    },
    {
        emoji: '🥚',
        title: 'Egg Classifier',
        description: 'Optimized AI for egg contamination analysis.',
        images: ['photos/ec.jpg', 'photos/ei.jpg', 'photos/er.jpg']
    },
    {
        emoji: '🍊',
        title: 'Orange Pro',
        description: 'Advanced classification system for oranges.',
        images: ['photos/oc.jpg', 'photos/oi.jpg', 'photos/or.jpg']
    }
];

let currentModelIndex = 1; // Start with Egg Classifier

class ModelsCarousel {
    constructor() {
        this.init();
    }

    init() {
        this.centerEmoji = document.getElementById('center-emoji');
        this.centerTitle = document.getElementById('center-title');
        this.centerDescription = document.getElementById('center-description');
        this.modelImages = document.querySelector('.model-images');
        this.dots = document.querySelectorAll('.dot');
        this.focusedCard = document.querySelector('.focused-card');
        this.sideModels = document.querySelectorAll('.side-model-item');

        if (!this.centerEmoji || !this.focusedCard) {
            console.error('❌ Carousel: Required DOM elements not found!');
            return;
        }

        console.log('✅ Carousel initialized');
        console.log('   Side models found:', this.sideModels.length);
        console.log('   Dots found:', this.dots.length);

        this.attachEventListeners();
        this.updateDisplay(currentModelIndex);
    }

    attachEventListeners() {
        // Dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                console.log('📍 Dot clicked:', index);
                this.switchModel(index);
            });
        });

        // Side model items click
        this.sideModels.forEach((item) => {
            item.addEventListener('click', () => {
                const dataIndex = parseInt(item.getAttribute('data-index'));
                console.log('👆 Side model clicked, index:', dataIndex);
                this.switchModel(dataIndex);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                console.log('⬅️ Arrow left pressed');
                this.switchModel(currentModelIndex - 1);
            }
            if (e.key === 'ArrowRight') {
                console.log('➡️ Arrow right pressed');
                this.switchModel(currentModelIndex + 1);
            }
        });
    }

    switchModel(newIndex) {
        // Wrap around
        if (newIndex < 0) newIndex = modelsData.length - 1;
        if (newIndex >= modelsData.length) newIndex = 0;

        if (newIndex === currentModelIndex) {
            return;
        }

        console.log('🔄 Switching from', modelsData[currentModelIndex].title, 'to', modelsData[newIndex].title);

        // Add transition out
        if (this.focusedCard) {
            this.focusedCard.classList.add('transition-out');
        }

        setTimeout(() => {
            currentModelIndex = newIndex;
            this.updateDisplay(newIndex);
            
            if (this.focusedCard) {
                this.focusedCard.classList.remove('transition-out');
                this.focusedCard.classList.add('transition-in');

                setTimeout(() => {
                    this.focusedCard.classList.remove('transition-in');
                }, 500);
            }
        }, 250);
    }

    updateDisplay(index) {
        const model = modelsData[index];

        console.log('📝 Updating display for:', model.title);

        // Update center card
        if (this.centerEmoji) this.centerEmoji.textContent = model.emoji;
        if (this.centerTitle) this.centerTitle.textContent = model.title;
        if (this.centerDescription) this.centerDescription.textContent = model.description;

        // Update images
        if (this.modelImages) {
            this.modelImages.innerHTML = model.images
                .map(img => `<img src="${img}" alt="${model.title} visualization" class="model-img">`)
                .join('');
        }

        // Update dots
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        // Update side models highlight
        this.sideModels.forEach((item) => {
            const itemIndex = parseInt(item.getAttribute('data-index'));
            item.classList.toggle('active', itemIndex === index);
        });
    }
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('📦 DOM Content Loaded, initializing carousel...');
    new ModelsCarousel();
});