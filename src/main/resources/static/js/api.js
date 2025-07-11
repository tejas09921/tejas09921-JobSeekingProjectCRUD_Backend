// API service layer for making HTTP requests

class ApiService {
    constructor(baseUrl = 'http://localhost:8080') {
        this.baseUrl = baseUrl;
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        // Add auth token if available
        if (authManager.isAuthenticated()) {
            defaultOptions.headers['Authorization'] = `Bearer ${authManager.token}`;
        }

        const config = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            
            // Handle different response types
            if (response.status === 204) {
                return null; // No content
            }
            
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorData}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (error) {
            console.error(`API request failed: ${endpoint}`, error);
            throw error;
        }
    }

    // GET request
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    // POST request
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // PUT request
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // User API methods
    async getAllUsers() {
        return this.get('/users');
    }

    async getUserByEmail(email) {
        return this.get(`/users/email/${email}`);
    }

    async createUser(userData) {
        return this.post('/users/add', userData);
    }

    async updateUser(id, userData) {
        return this.put(`/users/${id}`, userData);
    }

    async deleteUser(id) {
        return this.delete(`/users/${id}`);
    }

    // Job API methods
    async getAllJobs() {
        return this.get('/jobs');
    }

    async getJobById(id) {
        return this.get(`/jobs/${id}`);
    }

    async getJobsByCompany(company) {
        return this.get(`/jobs/company/${company}`);
    }

    async getJobsByLocation(location) {
        return this.get(`/jobs/location/${location}`);
    }

    async searchJobsByTitle(keyword) {
        return this.get(`/jobs/search/${keyword}`);
    }

    async createJob(jobData) {
        return this.post('/jobs/add', jobData);
    }

    async updateJob(id, jobData) {
        return this.put(`/jobs/${id}`, jobData);
    }

    async deleteJob(id) {
        return this.delete(`/jobs/${id}`);
    }

    // Application API methods
    async getAllApplications() {
        return this.get('/applications');
    }

    async getApplicationById(id) {
        return this.get(`/applications/${id}`);
    }

    async getApplicationsByJob(jobId) {
        return this.get(`/applications/job/${jobId}`);
    }

    async getApplicationsByApplicant(userId) {
        return this.get(`/applications/applicant/${userId}`);
    }

    async submitApplication(applicationData) {
        return this.post('/applications/apply', applicationData);
    }

    async updateApplicationStatus(id, status) {
        return this.put(`/applications/status/${id}`, status);
    }

    async deleteApplication(id) {
        return this.delete(`/applications/${id}`);
    }

    // Company API methods
    async getAllCompanies() {
        return this.get('/companies');
    }

    async getCompanyById(id) {
        return this.get(`/companies/${id}`);
    }

    async getCompanyByName(name) {
        return this.get(`/companies/name/${name}`);
    }

    async createCompany(companyData) {
        return this.post('/companies/add', companyData);
    }

    async updateCompany(id, companyData) {
        return this.put(`/companies/${id}`, companyData);
    }

    async deleteCompany(id) {
        return this.delete(`/companies/${id}`);
    }

    // Resume API methods
    async getResumeByUser(userId) {
        return this.get(`/resumes/user/${userId}`);
    }

    async createResume(resumeData) {
        return this.post('/resumes/add', resumeData);
    }

    async updateResume(id, resumeData) {
        return this.put(`/resumes/${id}`, resumeData);
    }

    async deleteResume(id) {
        return this.delete(`/resumes/${id}`);
    }
}

// Create global API service instance
const apiService = new ApiService();

// Error handling wrapper for API calls
async function handleApiCall(apiCall, errorMessage = 'Operation failed') {
    try {
        showLoading();
        const result = await apiCall();
        return result;
    } catch (error) {
        console.error('API call failed:', error);
        showToast('Error', errorMessage, 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

// Retry mechanism for failed requests
async function retryApiCall(apiCall, maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await apiCall();
        } catch (error) {
            if (attempt === maxRetries) {
                throw error;
            }
            
            console.warn(`API call attempt ${attempt} failed, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
        }
    }
}

// Batch API calls
async function batchApiCalls(apiCalls) {
    try {
        const results = await Promise.allSettled(apiCalls);
        
        const successful = results
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value);
            
        const failed = results
            .filter(result => result.status === 'rejected')
            .map(result => result.reason);
            
        if (failed.length > 0) {
            console.warn('Some API calls failed:', failed);
        }
        
        return { successful, failed };
    } catch (error) {
        console.error('Batch API calls failed:', error);
        throw error;
    }
}

// Cache management for API responses
class ApiCache {
    constructor(ttl = 5 * 60 * 1000) { // 5 minutes default TTL
        this.cache = new Map();
        this.ttl = ttl;
    }

    set(key, data) {
        const expiresAt = Date.now() + this.ttl;
        this.cache.set(key, { data, expiresAt });
    }

    get(key) {
        const cached = this.cache.get(key);
        
        if (!cached) {
            return null;
        }
        
        if (Date.now() > cached.expiresAt) {
            this.cache.delete(key);
            return null;
        }
        
        return cached.data;
    }

    clear() {
        this.cache.clear();
    }

    delete(key) {
        this.cache.delete(key);
    }
}

// Create global cache instance
const apiCache = new ApiCache();

// Cached API service wrapper
class CachedApiService extends ApiService {
    async get(endpoint, useCache = true) {
        if (useCache) {
            const cached = apiCache.get(endpoint);
            if (cached) {
                return cached;
            }
        }

        const data = await super.get(endpoint);
        
        if (useCache) {
            apiCache.set(endpoint, data);
        }
        
        return data;
    }

    // Override methods that modify data to clear relevant cache entries
    async post(endpoint, data) {
        const result = await super.post(endpoint, data);
        this.clearRelatedCache(endpoint);
        return result;
    }

    async put(endpoint, data) {
        const result = await super.put(endpoint, data);
        this.clearRelatedCache(endpoint);
        return result;
    }

    async delete(endpoint) {
        const result = await super.delete(endpoint);
        this.clearRelatedCache(endpoint);
        return result;
    }

    clearRelatedCache(endpoint) {
        // Clear cache entries related to the modified resource
        const resourceType = endpoint.split('/')[1];
        
        for (const [key] of apiCache.cache) {
            if (key.includes(`/${resourceType}`)) {
                apiCache.delete(key);
            }
        }
    }
}

// Replace the global API service with cached version
// const apiService = new CachedApiService();