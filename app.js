// Course Management System JavaScript

class CourseManager {
    constructor() {
        // Initialize with sample data
        this.courses = [
            {
                id: 1,
                name: "React Fundamentals",
                description: "Learn the basics of React including components, state, and props",
                instructor: "Sarah Johnson",
                category: "Web Development",
                duration: 40,
                price: 149,
                difficulty: "Beginner",
                status: "Active",
                createdDate: "2024-09-01"
            },
            {
                id: 2,
                name: "Advanced Python",
                description: "Master advanced Python concepts including decorators, generators, and async programming",
                instructor: "Dr. Michael Chen",
                category: "Data Science",
                duration: 60,
                price: 199,
                difficulty: "Advanced",
                status: "Active",
                createdDate: "2024-08-15"
            },
            {
                id: 3,
                name: "UI/UX Design Principles",
                description: "Comprehensive guide to user interface and user experience design",
                instructor: "Emma Rodriguez",
                category: "Design",
                duration: 35,
                price: 129,
                difficulty: "Intermediate",
                status: "Active",
                createdDate: "2024-08-20"
            }
        ];
        
        this.categories = [
            "Web Development", "Data Science", "Mobile Development", "Design", 
            "Business", "Marketing", "Photography", "Music", "Languages", "Health & Fitness"
        ];
        
        this.instructors = {
            "Web Development": ["Sarah Johnson", "John Smith", "Alex Chen"],
            "Data Science": ["Dr. Michael Chen", "Dr. Lisa Wang", "Robert Kumar"],
            "Design": ["Emma Rodriguez", "David Kim", "Sofia Martinez"],
            "Business": ["James Wilson", "Rachel Green", "Mark Thompson"],
            "Marketing": ["Jennifer Lee", "Chris Brown", "Maria Garcia"],
            "Mobile Development": ["Alex Chen", "Sarah Kim", "Robert Kumar"],
            "Photography": ["Maria Garcia", "David Kim", "Sofia Martinez"],
            "Music": ["James Wilson", "Rachel Green", "Chris Brown"],
            "Languages": ["Dr. Lisa Wang", "Emma Rodriguez", "Jennifer Lee"],
            "Health & Fitness": ["Mark Thompson", "Sarah Johnson", "John Smith"]
        };
        
        this.aiSuggestions = {
            descriptionTemplates: {
                "Web Development": "Learn modern web development techniques including {topic} with hands-on projects and real-world applications.",
                "Data Science": "Master {topic} concepts and apply them to real-world data analysis and machine learning projects.",
                "Design": "Develop your {topic} skills through practical exercises and industry best practices.",
                "Business": "Enhance your {topic} knowledge with practical strategies and real-world case studies.",
                "Marketing": "Master {topic} strategies to drive growth and engagement in today's digital landscape.",
                "Mobile Development": "Build mobile applications using {topic} with industry best practices and modern frameworks.",
                "Photography": "Improve your {topic} skills with professional techniques and creative approaches.",
                "Music": "Learn {topic} fundamentals and advanced techniques for musical excellence.",
                "Languages": "Master {topic} through immersive learning and practical conversation practice.",
                "Health & Fitness": "Achieve your {topic} goals with science-based methods and practical guidance."
            },
            durationEstimates: {
                "Beginner": { min: 20, max: 40 },
                "Intermediate": { min: 35, max: 60 },
                "Advanced": { min: 50, max: 80 }
            }
        };
        
        this.nextId = 4;
        this.selectedCourses = new Set();
        this.currentView = 'grid';
        this.currentEditId = null;
        this.courseToDelete = null;
        
        this.init();
    }
    
    init() {
        this.populateSelects();
        this.renderCourses();
        this.updateStats();
        this.initTheme();
        this.bindEvents();
    }
    
    bindEvents() {
        // Modal events
        const addCourseBtn = document.getElementById('addCourseBtn');
        const modalClose = document.getElementById('modalClose');
        const modalOverlay = document.getElementById('modalOverlay');
        const cancelBtn = document.getElementById('cancelBtn');
        const courseForm = document.getElementById('courseForm');
        
        if (addCourseBtn) {
            addCourseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openModal();
            });
        }
        
        if (modalClose) {
            modalClose.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
        }
        
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
        }
        
        if (courseForm) {
            courseForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit(e);
            });
        }
        
        // Search and filter events
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const difficultyFilter = document.getElementById('difficultyFilter');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.handleFilter();
            });
        }
        
        if (difficultyFilter) {
            difficultyFilter.addEventListener('change', (e) => {
                this.handleFilter();
            });
        }
        
        // View toggle events
        const gridViewBtn = document.getElementById('gridViewBtn');
        const listViewBtn = document.getElementById('listViewBtn');
        
        if (gridViewBtn) {
            gridViewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.setView('grid');
            });
        }
        
        if (listViewBtn) {
            listViewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.setView('list');
            });
        }
        
        // Bulk operations
        const selectAll = document.getElementById('selectAll');
        const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
        
        if (selectAll) {
            selectAll.addEventListener('change', (e) => {
                this.handleSelectAll(e.target.checked);
            });
        }
        
        if (bulkDeleteBtn) {
            bulkDeleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleBulkDelete();
            });
        }
        
        // Export
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.exportCourses();
            });
        }
        
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }
        
        // AI features
        const generateDescription = document.getElementById('generateDescription');
        const courseCategory = document.getElementById('courseCategory');
        const courseDifficulty = document.getElementById('courseDifficulty');
        
        if (generateDescription) {
            generateDescription.addEventListener('click', (e) => {
                e.preventDefault();
                this.generateDescription();
            });
        }
        
        if (courseCategory) {
            courseCategory.addEventListener('change', () => {
                this.updateInstructors();
            });
        }
        
        if (courseDifficulty) {
            courseDifficulty.addEventListener('change', () => {
                this.updateDurationEstimate();
            });
        }
        
        // Delete modal events
        const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        
        if (cancelDeleteBtn) {
            cancelDeleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeDeleteModal();
            });
        }
        
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.confirmDelete();
            });
        }
        
        // Details modal events
        const detailsClose = document.getElementById('detailsClose');
        if (detailsClose) {
            detailsClose.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeDetailsModal();
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeDeleteModal();
                this.closeDetailsModal();
            }
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                this.openModal();
            }
        });
    }
    
    populateSelects() {
        // Populate category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            // Clear existing options except the first one
            while (categoryFilter.children.length > 1) {
                categoryFilter.removeChild(categoryFilter.lastChild);
            }
            
            this.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });
        }
        
        // Populate course category select
        const courseCategory = document.getElementById('courseCategory');
        if (courseCategory) {
            // Clear existing options except the first one
            while (courseCategory.children.length > 1) {
                courseCategory.removeChild(courseCategory.lastChild);
            }
            
            this.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                courseCategory.appendChild(option);
            });
        }
    }
    
    updateInstructors() {
        const category = document.getElementById('courseCategory').value;
        const instructorSelect = document.getElementById('courseInstructor');
        
        if (!instructorSelect) return;
        
        // Clear existing options except the first one
        instructorSelect.innerHTML = '<option value="">Select Instructor</option>';
        
        if (category && this.instructors[category]) {
            this.instructors[category].forEach(instructor => {
                const option = document.createElement('option');
                option.value = instructor;
                option.textContent = instructor;
                instructorSelect.appendChild(option);
            });
        }
        
        // Add "Other" option
        const otherOption = document.createElement('option');
        otherOption.value = 'other';
        otherOption.textContent = 'Other';
        instructorSelect.appendChild(otherOption);
    }
    
    updateDurationEstimate() {
        const difficulty = document.getElementById('courseDifficulty').value;
        const estimateDiv = document.getElementById('durationEstimate');
        
        if (!estimateDiv) return;
        
        if (difficulty && this.aiSuggestions.durationEstimates[difficulty]) {
            const estimate = this.aiSuggestions.durationEstimates[difficulty];
            estimateDiv.textContent = `AI Suggestion: ${estimate.min}-${estimate.max} hours for ${difficulty} level`;
            estimateDiv.style.display = 'block';
        } else {
            estimateDiv.style.display = 'none';
        }
    }
    
    generateDescription() {
        const courseName = document.getElementById('courseName').value;
        const category = document.getElementById('courseCategory').value;
        const descriptionField = document.getElementById('courseDescription');
        
        if (!courseName || !category) {
            this.showToast('Please enter course name and select category first', 'warning');
            return;
        }
        
        const template = this.aiSuggestions.descriptionTemplates[category];
        if (template) {
            const description = template.replace('{topic}', courseName.toLowerCase());
            descriptionField.value = description;
            this.showToast('Description generated successfully!', 'success');
        }
    }
    
    openModal(courseId = null) {
        const modal = document.getElementById('courseModal');
        const title = document.getElementById('modalTitle');
        const form = document.getElementById('courseForm');
        
        if (!modal || !title || !form) return;
        
        this.currentEditId = courseId;
        
        if (courseId) {
            title.textContent = 'Edit Course';
            this.populateForm(courseId);
        } else {
            title.textContent = 'Add New Course';
            form.reset();
            // Reset instructor select
            const instructorSelect = document.getElementById('courseInstructor');
            if (instructorSelect) {
                instructorSelect.innerHTML = '<option value="">Select Instructor</option>';
            }
        }
        
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        setTimeout(() => {
            const firstInput = document.getElementById('courseName');
            if (firstInput) firstInput.focus();
        }, 100);
    }
    
    closeModal() {
        const modal = document.getElementById('courseModal');
        if (modal) {
            modal.classList.add('hidden');
        }
        document.body.style.overflow = '';
        this.currentEditId = null;
    }
    
    populateForm(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course) return;
        
        const fields = [
            'courseName', 'courseDescription', 'courseCategory', 
            'courseInstructor', 'courseDifficulty', 'courseDuration', 
            'coursePrice', 'courseStatus'
        ];
        
        const mapping = {
            courseName: course.name,
            courseDescription: course.description,
            courseCategory: course.category,
            courseInstructor: course.instructor,
            courseDifficulty: course.difficulty,
            courseDuration: course.duration,
            coursePrice: course.price,
            courseStatus: course.status
        };
        
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && mapping[fieldId] !== undefined) {
                field.value = mapping[fieldId];
            }
        });
        
        // Update instructors based on category
        this.updateInstructors();
        setTimeout(() => {
            const instructorField = document.getElementById('courseInstructor');
            if (instructorField) {
                instructorField.value = course.instructor;
            }
        }, 100);
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const courseData = {
            name: formData.get('name') || document.getElementById('courseName').value,
            description: formData.get('description') || document.getElementById('courseDescription').value,
            category: formData.get('category') || document.getElementById('courseCategory').value,
            instructor: formData.get('instructor') || document.getElementById('courseInstructor').value,
            difficulty: formData.get('difficulty') || document.getElementById('courseDifficulty').value,
            duration: parseInt(formData.get('duration') || document.getElementById('courseDuration').value),
            price: parseFloat(formData.get('price') || document.getElementById('coursePrice').value),
            status: formData.get('status') || document.getElementById('courseStatus').value
        };
        
        // Validation
        if (!this.validateCourse(courseData)) {
            return;
        }
        
        if (this.currentEditId) {
            this.updateCourse(this.currentEditId, courseData);
        } else {
            this.createCourse(courseData);
        }
        
        this.closeModal();
    }
    
    validateCourse(courseData) {
        const errors = [];
        
        if (!courseData.name || !courseData.name.trim()) errors.push('Course name is required');
        if (!courseData.description || !courseData.description.trim()) errors.push('Description is required');
        if (!courseData.category) errors.push('Category is required');
        if (!courseData.instructor) errors.push('Instructor is required');
        if (!courseData.difficulty) errors.push('Difficulty is required');
        if (!courseData.duration || courseData.duration < 1) errors.push('Duration must be at least 1 hour');
        if (courseData.price === undefined || courseData.price < 0) errors.push('Price must be 0 or greater');
        if (!courseData.status) errors.push('Status is required');
        
        if (errors.length > 0) {
            this.showToast(errors.join(', '), 'error');
            return false;
        }
        
        return true;
    }
    
    createCourse(courseData) {
        const course = {
            id: this.nextId++,
            ...courseData,
            createdDate: new Date().toISOString().split('T')[0]
        };
        
        this.courses.push(course);
        this.renderCourses();
        this.updateStats();
        this.showToast('Course created successfully!', 'success');
    }
    
    updateCourse(id, courseData) {
        const index = this.courses.findIndex(c => c.id === id);
        if (index !== -1) {
            this.courses[index] = { ...this.courses[index], ...courseData };
            this.renderCourses();
            this.updateStats();
            this.showToast('Course updated successfully!', 'success');
        }
    }
    
    deleteCourse(id) {
        this.courseToDelete = id;
        const deleteModal = document.getElementById('deleteModal');
        if (deleteModal) {
            deleteModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeDeleteModal() {
        const deleteModal = document.getElementById('deleteModal');
        if (deleteModal) {
            deleteModal.classList.add('hidden');
        }
        document.body.style.overflow = '';
        this.courseToDelete = null;
    }
    
    confirmDelete() {
        if (this.courseToDelete) {
            const index = this.courses.findIndex(c => c.id === this.courseToDelete);
            if (index !== -1) {
                this.courses.splice(index, 1);
                this.renderCourses();
                this.updateStats();
                this.showToast('Course deleted successfully!', 'success');
            }
        }
        this.closeDeleteModal();
    }
    
    viewCourseDetails(id) {
        const course = this.courses.find(c => c.id === id);
        if (!course) return;
        
        const modal = document.getElementById('detailsModal');
        const title = document.getElementById('detailsTitle');
        const content = document.getElementById('detailsContent');
        
        if (!modal || !title || !content) return;
        
        title.textContent = course.name;
        content.innerHTML = this.generateDetailsHTML(course);
        
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    
    closeDetailsModal() {
        const detailsModal = document.getElementById('detailsModal');
        if (detailsModal) {
            detailsModal.classList.add('hidden');
        }
        document.body.style.overflow = '';
    }
    
    generateDetailsHTML(course) {
        return `
            <div class="course-details">
                <div class="course-details-header">
                    <h2 class="course-details-title">${course.name}</h2>
                    <p class="course-details-subtitle">by ${course.instructor}</p>
                    <div class="course-details-tags">
                        <span class="course-tag category">${course.category}</span>
                        <span class="course-tag difficulty">${course.difficulty}</span>
                        <span class="status status--${course.status.toLowerCase()}">${course.status}</span>
                    </div>
                </div>
                <div class="course-details-info">
                    <div class="info-item">
                        <div class="info-item-label">Duration</div>
                        <div class="info-item-value">${course.duration} hours</div>
                    </div>
                    <div class="info-item">
                        <div class="info-item-label">Price</div>
                        <div class="info-item-value">₹${course.price}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-item-label">Created</div>
                        <div class="info-item-value">${new Date(course.createdDate).toLocaleDateString()}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-item-label">Course ID</div>
                        <div class="info-item-value">#${course.id}</div>
                    </div>
                </div>
                <div class="course-description-full">
                    <h4>Description</h4>
                    <p>${course.description}</p>
                </div>
            </div>
        `;
    }
    
    renderCourses() {
        const container = document.getElementById('coursesGrid');
        const noCoursesMessage = document.getElementById('noCoursesMessage');
        
        if (!container || !noCoursesMessage) return;
        
        const filteredCourses = this.getFilteredCourses();
        
        if (filteredCourses.length === 0) {
            container.innerHTML = '';
            noCoursesMessage.classList.remove('hidden');
            return;
        }
        
        noCoursesMessage.classList.add('hidden');
        container.innerHTML = filteredCourses.map(course => this.generateCourseHTML(course)).join('');
        
        // Bind events for course cards
        this.bindCourseEvents();
    }
    
    generateCourseHTML(course) {
        return `
            <div class="course-card ${this.selectedCourses.has(course.id) ? 'selected' : ''}" data-id="${course.id}">
                <div class="course-card-header">
                    <input type="checkbox" class="course-checkbox" data-id="${course.id}" ${this.selectedCourses.has(course.id) ? 'checked' : ''}>
                    <h3 class="course-title">${course.name}</h3>
                    <div class="course-instructor">
                        <i class="fas fa-user"></i>
                        ${course.instructor}
                    </div>
                </div>
                <div class="course-card-body">
                    <p class="course-description">${course.description}</p>
                    <div class="course-meta">
                        <div class="meta-item">
                            <i class="fas fa-clock"></i>
                            ${course.duration}h
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-signal"></i>
                            ${course.difficulty}
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-calendar"></i>
                            ${new Date(course.createdDate).toLocaleDateString()}
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-circle"></i>
                            ${course.status}
                        </div>
                    </div>
                    <div class="course-tags">
                        <span class="course-tag category">${course.category}</span>
                        <span class="course-tag difficulty">${course.difficulty}</span>
                        <span class="status status--${course.status.toLowerCase()}">${course.status}</span>
                    </div>
                </div>
                <div class="course-card-footer">
                    <div class="course-price">₹${course.price}</div>
                    <div class="course-actions">
                        <button class="btn btn--outline btn--sm view-btn" data-id="${course.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn--outline btn--sm edit-btn" data-id="${course.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn--outline btn--sm delete-btn" data-id="${course.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    bindCourseEvents() {
        // Checkbox events
        document.querySelectorAll('.course-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                const courseId = parseInt(e.target.dataset.id);
                if (e.target.checked) {
                    this.selectedCourses.add(courseId);
                } else {
                    this.selectedCourses.delete(courseId);
                }
                this.updateBulkActions();
                this.updateCourseSelection();
            });
        });
        
        // Action button events
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const courseId = parseInt(e.target.closest('button').dataset.id);
                this.viewCourseDetails(courseId);
            });
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const courseId = parseInt(e.target.closest('button').dataset.id);
                this.openModal(courseId);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const courseId = parseInt(e.target.closest('button').dataset.id);
                this.deleteCourse(courseId);
            });
        });
    }
    
    updateCourseSelection() {
        document.querySelectorAll('.course-card').forEach(card => {
            const courseId = parseInt(card.dataset.id);
            card.classList.toggle('selected', this.selectedCourses.has(courseId));
        });
    }
    
    updateBulkActions() {
        const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
        const selectAllCheckbox = document.getElementById('selectAll');
        
        if (bulkDeleteBtn) {
            bulkDeleteBtn.disabled = this.selectedCourses.size === 0;
        }
        
        if (selectAllCheckbox) {
            const totalCourses = this.getFilteredCourses().length;
            selectAllCheckbox.checked = this.selectedCourses.size === totalCourses && totalCourses > 0;
            selectAllCheckbox.indeterminate = this.selectedCourses.size > 0 && this.selectedCourses.size < totalCourses;
        }
    }
    
    handleSelectAll(checked) {
        const filteredCourses = this.getFilteredCourses();
        
        if (checked) {
            filteredCourses.forEach(course => this.selectedCourses.add(course.id));
        } else {
            filteredCourses.forEach(course => this.selectedCourses.delete(course.id));
        }
        
        this.updateBulkActions();
        this.updateCourseSelection();
        this.renderCourses();
    }
    
    handleBulkDelete() {
        if (this.selectedCourses.size === 0) return;
        
        const count = this.selectedCourses.size;
        const confirmed = confirm(`Are you sure you want to delete ${count} course${count > 1 ? 's' : ''}? This action cannot be undone.`);
        
        if (confirmed) {
            this.courses = this.courses.filter(course => !this.selectedCourses.has(course.id));
            this.selectedCourses.clear();
            this.renderCourses();
            this.updateStats();
            this.updateBulkActions();
            this.showToast(`${count} course${count > 1 ? 's' : ''} deleted successfully!`, 'success');
        }
    }
    
    getFilteredCourses() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const difficultyFilter = document.getElementById('difficultyFilter');
        
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const categoryFilterValue = categoryFilter ? categoryFilter.value : '';
        const difficultyFilterValue = difficultyFilter ? difficultyFilter.value : '';
        
        return this.courses.filter(course => {
            const matchesSearch = !searchTerm || 
                course.name.toLowerCase().includes(searchTerm) ||
                course.description.toLowerCase().includes(searchTerm) ||
                course.instructor.toLowerCase().includes(searchTerm);
            
            const matchesCategory = !categoryFilterValue || course.category === categoryFilterValue;
            const matchesDifficulty = !difficultyFilterValue || course.difficulty === difficultyFilterValue;
            
            return matchesSearch && matchesCategory && matchesDifficulty;
        });
    }
    
    handleSearch(searchTerm) {
        this.renderCourses();
        this.updateBulkActions();
    }
    
    handleFilter() {
        this.renderCourses();
        this.updateBulkActions();
    }
    
    setView(view) {
        this.currentView = view;
        const container = document.getElementById('coursesGrid');
        const gridBtn = document.getElementById('gridViewBtn');
        const listBtn = document.getElementById('listViewBtn');
        
        if (!container || !gridBtn || !listBtn) return;
        
        if (view === 'grid') {
            container.classList.remove('list-view');
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
        } else {
            container.classList.add('list-view');
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
        }
    }
    
    updateStats() {
        const totalCourses = this.courses.length;
        const totalInstructors = new Set(this.courses.map(c => c.instructor)).size;
        const totalCategories = new Set(this.courses.map(c => c.category)).size;
        const avgPrice = totalCourses > 0 ? 
            Math.round(this.courses.reduce((sum, c) => sum + c.price, 0) / totalCourses) : 0;
        
        const elements = {
            totalCourses: document.getElementById('totalCourses'),
            totalInstructors: document.getElementById('totalInstructors'),
            totalCategories: document.getElementById('totalCategories'),
            avgPrice: document.getElementById('avgPrice')
        };
        
        if (elements.totalCourses) elements.totalCourses.textContent = totalCourses;
        if (elements.totalInstructors) elements.totalInstructors.textContent = totalInstructors;
        if (elements.totalCategories) elements.totalCategories.textContent = totalCategories;
        if (elements.avgPrice) elements.avgPrice.textContent = `₹${avgPrice}`;
    }
    
    exportCourses() {
        const filteredCourses = this.getFilteredCourses();
        const dataStr = JSON.stringify(filteredCourses, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `courses_export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showToast(`Exported ${filteredCourses.length} courses successfully!`, 'success');
    }
    
    initTheme() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;
        
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Set initial theme based on system preference
        if (prefersDark) {
            document.documentElement.setAttribute('data-color-scheme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.documentElement.setAttribute('data-color-scheme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        const themeToggle = document.getElementById('themeToggle');
        
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        if (themeToggle) {
            themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }
        
        this.showToast(`Switched to ${newTheme} mode`, 'info');
    }
    
    showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        
        const toast = document.createElement('div');
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        const titles = {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Info'
        };
        
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="${icons[type]}"></i>
            <div class="toast-content">
                <div class="toast-title">${titles[type]}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Close button event
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                toast.remove();
            });
        }
        
        container.appendChild(toast);
        
        // Auto remove after duration
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, duration);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CourseManager();
});