// Job Portal Frontend JavaScript

// Global variables
let currentUser = null;
let currentJobId = null;
let allJobs = [];

// API Base URL
const API_BASE_URL = 'http://localhost:8080';

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
        currentUser = JSON.parse(userData);
        updateNavigation(true);
    }
    
    // Load featured jobs on home page
    loadFeaturedJobs();
    
    // Setup form event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Register form
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    
    // Add job form
    document.getElementById('addJobForm').addEventListener('submit', handleAddJob);
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        showLoading('Logging in...');
        
        // Since we don't have JWT auth in the backend, we'll simulate login
        // by checking if user exists
        const response = await fetch(`${API_BASE_URL}/users/email/${email}`);
        
        if (response.ok) {
            const user = await response.json();
            
            // Simple password check (in real app, this would be handled by backend)
            if (user.password === password) {
                // Store user data
                currentUser = user;
                localStorage.setItem('authToken', 'dummy-token');
                localStorage.setItem('userData', JSON.stringify(user));
                
                // Update UI
                updateNavigation(true);
                hideModal('loginModal');
                showToast('Success', 'Login successful!', 'success');
                
                // Clear form
                document.getElementById('loginForm').reset();
            } else {
                showToast('Error', 'Invalid password!', 'error');
            }
        } else {
            showToast('Error', 'User not found!', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('Error', 'Login failed. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const userData = {
        name: document.getElementById('registerName').value,
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value,
        mobile: document.getElementById('registerMobile').value,
        role: document.getElementById('registerRole').value
    };
    
    try {
        showLoading('Creating account...');
        
        const response = await fetch(`${API_BASE_URL}/users/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        if (response.ok) {
            showToast('Success', 'Account created successfully! Please login.', 'success');
            hideModal('registerModal');
            document.getElementById('registerForm').reset();
            showLogin();
        } else {
            showToast('Error', 'Registration failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showToast('Error', 'Registration failed. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    updateNavigation(false);
    showHome();
    showToast('Success', 'Logged out successfully!', 'success');
}

// Navigation Functions
function updateNavigation(isLoggedIn) {
    const loginNav = document.getElementById('loginNav');
    const registerNav = document.getElementById('registerNav');
    const userNav = document.getElementById('userNav');
    const userName = document.getElementById('userName');
    
    if (isLoggedIn && currentUser) {
        loginNav.style.display = 'none';
        registerNav.style.display = 'none';
        userNav.style.display = 'block';
        userName.textContent = currentUser.name;
    } else {
        loginNav.style.display = 'block';
        registerNav.style.display = 'block';
        userNav.style.display = 'none';
    }
}

function showLogin() {
    showModal('loginModal');
}

function showRegister() {
    showModal('registerModal');
}

function showHome() {
    hideAllSections();
    document.getElementById('home').style.display = 'block';
    loadFeaturedJobs();
}

function showAllJobs() {
    hideAllSections();
    document.getElementById('jobs').style.display = 'block';
    loadAllJobs();
}

function showDashboard() {
    if (!currentUser) {
        showToast('Error', 'Please login first!', 'error');
        showLogin();
        return;
    }
    
    hideAllSections();
    document.getElementById('dashboard').style.display = 'block';
    
    if (currentUser.role === 'JOB_SEEKER') {
        document.getElementById('jobSeekerDashboard').style.display = 'block';
        document.getElementById('recruiterDashboard').style.display = 'none';
        loadJobSeekerDashboard();
    } else if (currentUser.role === 'RECRUITER') {
        document.getElementById('jobSeekerDashboard').style.display = 'none';
        document.getElementById('recruiterDashboard').style.display = 'block';
        loadRecruiterDashboard();
    }
}

function hideAllSections() {
    document.getElementById('home').style.display = 'none';
    document.getElementById('jobs').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';
}

// Job Functions
async function loadFeaturedJobs() {
    try {
        const response = await fetch(`${API_BASE_URL}/jobs`);
        if (response.ok) {
            const jobs = await response.json();
            allJobs = jobs;
            displayFeaturedJobs(jobs.slice(0, 6)); // Show first 6 jobs
        }
    } catch (error) {
        console.error('Error loading featured jobs:', error);
    }
}

async function loadAllJobs() {
    try {
        showJobsLoading(true);
        const response = await fetch(`${API_BASE_URL}/jobs`);
        if (response.ok) {
            const jobs = await response.json();
            allJobs = jobs;
            displayJobs(jobs);
        }
    } catch (error) {
        console.error('Error loading jobs:', error);
        showToast('Error', 'Failed to load jobs', 'error');
    } finally {
        showJobsLoading(false);
    }
}

function displayFeaturedJobs(jobs) {
    const container = document.getElementById('featuredJobsList');
    container.innerHTML = '';
    
    if (jobs.length === 0) {
        container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No jobs available at the moment.</p></div>';
        return;
    }
    
    jobs.forEach(job => {
        const jobCard = createJobCard(job);
        container.appendChild(jobCard);
    });
}

function displayJobs(jobs) {
    const container = document.getElementById('jobsList');
    container.innerHTML = '';
    
    if (jobs.length === 0) {
        container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No jobs found matching your criteria.</p></div>';
        return;
    }
    
    jobs.forEach(job => {
        const jobCard = createJobCard(job);
        container.appendChild(jobCard);
    });
}

function createJobCard(job) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6 mb-4';
    
    const postedDate = job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'Recently';
    const salary = job.salary ? `$${job.salary.toLocaleString()}` : 'Competitive';
    
    col.innerHTML = `
        <div class="card job-card h-100" onclick="showJobDetail(${job.id})">
            <div class="card-body">
                <h5 class="job-title">${job.title}</h5>
                <p class="job-company">${job.company}</p>
                <div class="job-meta">
                    <span><i class="fas fa-map-marker-alt"></i>${job.location}</span>
                    <span><i class="fas fa-briefcase"></i>${job.jobType || 'Full-time'}</span>
                    <span><i class="fas fa-calendar"></i>${postedDate}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="job-salary">${salary}</span>
                    <button class="btn btn-outline-primary btn-sm">
                        View Details <i class="fas fa-arrow-right ms-1"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

async function showJobDetail(jobId) {
    try {
        const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
        if (response.ok) {
            const job = await response.json();
            currentJobId = jobId;
            
            document.getElementById('jobDetailTitle').textContent = job.title;
            
            const postedDate = job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'Recently';
            const salary = job.salary ? `$${job.salary.toLocaleString()}` : 'Competitive';
            
            document.getElementById('jobDetailBody').innerHTML = `
                <div class="row">
                    <div class="col-md-8">
                        <h6 class="fw-bold text-primary">Job Description</h6>
                        <p class="mb-4">${job.description || 'No description available.'}</p>
                        
                        <h6 class="fw-bold text-primary">Job Details</h6>
                        <ul class="list-unstyled">
                            <li><strong>Company:</strong> ${job.company}</li>
                            <li><strong>Location:</strong> ${job.location}</li>
                            <li><strong>Job Type:</strong> ${job.jobType || 'Full-time'}</li>
                            <li><strong>Salary:</strong> ${salary}</li>
                            <li><strong>Posted:</strong> ${postedDate}</li>
                        </ul>
                    </div>
                    <div class="col-md-4">
                        <div class="card bg-light">
                            <div class="card-body text-center">
                                <h6 class="fw-bold">Quick Apply</h6>
                                <p class="text-muted small">Click apply to submit your application</p>
                                <div class="d-grid">
                                    <button class="btn btn-success" onclick="applyToJob()">
                                        <i class="fas fa-paper-plane me-2"></i>Apply Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Show/hide apply button based on login status
            const applyBtn = document.getElementById('applyJobBtn');
            if (currentUser && currentUser.role === 'JOB_SEEKER') {
                applyBtn.style.display = 'block';
            } else {
                applyBtn.style.display = 'none';
            }
            
            showModal('jobDetailModal');
        }
    } catch (error) {
        console.error('Error loading job details:', error);
        showToast('Error', 'Failed to load job details', 'error');
    }
}

async function applyToJob() {
    if (!currentUser) {
        showToast('Error', 'Please login to apply for jobs!', 'error');
        hideModal('jobDetailModal');
        showLogin();
        return;
    }
    
    if (currentUser.role !== 'JOB_SEEKER') {
        showToast('Error', 'Only job seekers can apply for jobs!', 'error');
        return;
    }
    
    try {
        const applicationData = {
            applicant: { id: currentUser.id },
            job: { id: currentJobId },
            status: 'APPLIED',
            resumeLink: 'https://example.com/resume.pdf' // Placeholder
        };
        
        const response = await fetch(`${API_BASE_URL}/applications/apply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(applicationData)
        });
        
        if (response.ok) {
            showToast('Success', 'Application submitted successfully!', 'success');
            hideModal('jobDetailModal');
        } else {
            showToast('Error', 'Failed to submit application', 'error');
        }
    } catch (error) {
        console.error('Error applying to job:', error);
        showToast('Error', 'Failed to submit application', 'error');
    }
}

// Search and Filter Functions
async function searchJobs() {
    const title = document.getElementById('searchTitle').value;
    const location = document.getElementById('searchLocation').value;
    
    if (!title && !location) {
        showAllJobs();
        return;
    }
    
    try {
        let filteredJobs = allJobs;
        
        if (title) {
            const response = await fetch(`${API_BASE_URL}/jobs/search/${title}`);
            if (response.ok) {
                filteredJobs = await response.json();
            }
        }
        
        if (location) {
            filteredJobs = filteredJobs.filter(job => 
                job.location.toLowerCase().includes(location.toLowerCase())
            );
        }
        
        hideAllSections();
        document.getElementById('jobs').style.display = 'block';
        displayJobs(filteredJobs);
        
    } catch (error) {
        console.error('Error searching jobs:', error);
        showToast('Error', 'Search failed', 'error');
    }
}

function applyFilters() {
    const jobType = document.getElementById('jobTypeFilter').value;
    const company = document.getElementById('companyFilter').value;
    const location = document.getElementById('locationFilter').value;
    
    let filteredJobs = allJobs;
    
    if (jobType) {
        filteredJobs = filteredJobs.filter(job => job.jobType === jobType);
    }
    
    if (company) {
        filteredJobs = filteredJobs.filter(job => 
            job.company.toLowerCase().includes(company.toLowerCase())
        );
    }
    
    if (location) {
        filteredJobs = filteredJobs.filter(job => 
            job.location.toLowerCase().includes(location.toLowerCase())
        );
    }
    
    displayJobs(filteredJobs);
}

function refreshJobs() {
    loadAllJobs();
    // Clear filters
    document.getElementById('jobTypeFilter').value = '';
    document.getElementById('companyFilter').value = '';
    document.getElementById('locationFilter').value = '';
}

// Dashboard Functions
async function loadJobSeekerDashboard() {
    try {
        const response = await fetch(`${API_BASE_URL}/applications/applicant/${currentUser.id}`);
        if (response.ok) {
            const applications = await response.json();
            document.getElementById('applicationsCount').textContent = applications.length;
            displayMyApplications(applications);
        }
    } catch (error) {
        console.error('Error loading job seeker dashboard:', error);
    }
}

async function loadRecruiterDashboard() {
    try {
        // Note: We need to add this endpoint to the backend or simulate it
        const response = await fetch(`${API_BASE_URL}/jobs`);
        if (response.ok) {
            const allJobs = await response.json();
            // Filter jobs posted by current user (if we had this field)
            const myJobs = allJobs; // For now, show all jobs
            document.getElementById('postedJobsCount').textContent = myJobs.length;
            displayMyJobs(myJobs);
        }
    } catch (error) {
        console.error('Error loading recruiter dashboard:', error);
    }
}

function displayMyApplications(applications) {
    const container = document.getElementById('myApplicationsList');
    
    if (applications.length === 0) {
        container.innerHTML = '<p class="text-muted">No applications yet. Start applying to jobs!</p>';
        return;
    }
    
    container.innerHTML = applications.map(app => `
        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="fw-bold">${app.job?.title || 'Job Title'}</h6>
                        <p class="text-muted mb-1">${app.job?.company || 'Company'}</p>
                        <small class="text-muted">Applied: ${new Date(app.appliedDate).toLocaleDateString()}</small>
                    </div>
                    <span class="badge status-${app.status.toLowerCase()}">${app.status}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function displayMyJobs(jobs) {
    const container = document.getElementById('myJobsList');
    
    if (jobs.length === 0) {
        container.innerHTML = '<p class="text-muted">No jobs posted yet. Create your first job posting!</p>';
        return;
    }
    
    container.innerHTML = jobs.map(job => `
        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="fw-bold">${job.title}</h6>
                        <p class="text-muted mb-1">${job.company} • ${job.location}</p>
                        <small class="text-muted">Posted: ${new Date(job.postedDate).toLocaleDateString()}</small>
                    </div>
                    <div class="dropdown">
                        <button class="btn btn-outline-secondary btn-sm dropdown-toggle" data-bs-toggle="dropdown">
                            Actions
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" onclick="viewJobApplications(${job.id})">View Applications</a></li>
                            <li><a class="dropdown-item" href="#" onclick="editJob(${job.id})">Edit Job</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item text-danger" href="#" onclick="deleteJob(${job.id})">Delete Job</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Job Management Functions
function showAddJobForm() {
    showModal('addJobModal');
}

async function handleAddJob(e) {
    e.preventDefault();
    
    if (!currentUser || currentUser.role !== 'RECRUITER') {
        showToast('Error', 'Only recruiters can post jobs!', 'error');
        return;
    }
    
    const jobData = {
        title: document.getElementById('jobTitle').value,
        company: document.getElementById('jobCompany').value,
        location: document.getElementById('jobLocation').value,
        jobType: document.getElementById('jobType').value,
        salary: document.getElementById('jobSalary').value ? parseFloat(document.getElementById('jobSalary').value) : null,
        description: document.getElementById('jobDescription').value,
        postedBy: { id: currentUser.id }
    };
    
    try {
        showLoading('Posting job...');
        
        const response = await fetch(`${API_BASE_URL}/jobs/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jobData)
        });
        
        if (response.ok) {
            showToast('Success', 'Job posted successfully!', 'success');
            hideModal('addJobModal');
            document.getElementById('addJobForm').reset();
            loadRecruiterDashboard(); // Refresh dashboard
        } else {
            showToast('Error', 'Failed to post job', 'error');
        }
    } catch (error) {
        console.error('Error posting job:', error);
        showToast('Error', 'Failed to post job', 'error');
    } finally {
        hideLoading();
    }
}

async function deleteJob(jobId) {
    if (!confirm('Are you sure you want to delete this job?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast('Success', 'Job deleted successfully!', 'success');
            loadRecruiterDashboard(); // Refresh dashboard
        } else {
            showToast('Error', 'Failed to delete job', 'error');
        }
    } catch (error) {
        console.error('Error deleting job:', error);
        showToast('Error', 'Failed to delete job', 'error');
    }
}

async function viewJobApplications(jobId) {
    try {
        const response = await fetch(`${API_BASE_URL}/applications/job/${jobId}`);
        if (response.ok) {
            const applications = await response.json();
            // You can implement a modal to show applications
            showToast('Info', `This job has ${applications.length} applications`, 'info');
        }
    } catch (error) {
        console.error('Error loading applications:', error);
    }
}

// Utility Functions
function showModal(modalId) {
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.show();
}

function hideModal(modalId) {
    const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    if (modal) {
        modal.hide();
    }
}

function showToast(title, message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    // Remove existing classes
    toast.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'bg-info');
    
    // Add appropriate class based on type
    switch (type) {
        case 'success':
            toast.classList.add('bg-success', 'text-white');
            break;
        case 'error':
            toast.classList.add('bg-danger', 'text-white');
            break;
        case 'warning':
            toast.classList.add('bg-warning', 'text-dark');
            break;
        default:
            toast.classList.add('bg-info', 'text-white');
    }
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

function showLoading(message = 'Loading...') {
    // You can implement a loading overlay here
    console.log(message);
}

function hideLoading() {
    // Hide loading overlay
    console.log('Loading complete');
}

function showJobsLoading(show) {
    const loading = document.getElementById('jobsLoading');
    const jobsList = document.getElementById('jobsList');
    
    if (show) {
        loading.style.display = 'block';
        jobsList.style.display = 'none';
    } else {
        loading.style.display = 'none';
        jobsList.style.display = 'block';
    }
}