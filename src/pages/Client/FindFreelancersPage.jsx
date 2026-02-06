import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    Filter,
    Star,
    MapPin,
    Clock,
    DollarSign,
    X,
    ChevronDown,
    User,
    Loader2,
    RefreshCw,
} from 'lucide-react';
import AuthContext from '../../context/AuthContext';

const API_BASE_URL = 'http://127.0.0.1:8000/api/auth';

const FindFreelancersPage = () => {
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem('access_token');

    // State
    const [freelancers, setFreelancers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    // Search and filters
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        skills: '',
        minRate: '',
        maxRate: '',
        experienceLevel: '',
        availabilityStatus: '',
        minRating: '',
        country: '',
    });

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // Fetch freelancers
    const fetchFreelancers = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                account_type: 'freelancer',
                page: page.toString(),
            });

            if (searchQuery) params.append('search', searchQuery);
            if (filters.skills) params.append('skills', filters.skills);
            if (filters.minRate) params.append('min_rate', filters.minRate);
            if (filters.maxRate) params.append('max_rate', filters.maxRate);
            if (filters.experienceLevel) params.append('experience_level', filters.experienceLevel);
            if (filters.availabilityStatus) params.append('availability_status', filters.availabilityStatus);
            if (filters.minRating) params.append('min_rating', filters.minRating);
            if (filters.country) params.append('country', filters.country);

            const response = await fetch(`${API_BASE_URL}/users/?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch freelancers');
            }

            const data = await response.json();
            setFreelancers(data.results || data);
            setTotalCount(data.count || data.length || 0);
            setTotalPages(Math.ceil((data.count || data.length || 0) / 10));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFreelancers();
    }, [page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchFreelancers();
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        setPage(1);
        setShowFilters(false);
        fetchFreelancers();
    };

    const clearFilters = () => {
        setFilters({
            skills: '',
            minRate: '',
            maxRate: '',
            experienceLevel: '',
            availabilityStatus: '',
            minRating: '',
            country: '',
        });
        setSearchQuery('');
        setPage(1);
    };

    const renderStars = (rating) => {
        const numRating = parseFloat(rating) || 0;
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(numRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
            />
        ));
    };

    const getAvailabilityBadge = (status) => {
        const styles = {
            available: 'bg-green-100 text-green-800',
            busy: 'bg-yellow-100 text-yellow-800',
            unavailable: 'bg-red-100 text-red-800',
        };
        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'
                    }`}
            >
                {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
            </span>
        );
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Find Freelancers</h1>
                    <p className="text-gray-600 mt-2">
                        Browse talented freelancers and find the perfect match for your project
                    </p>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, title, skills, or bio..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Search
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                            <Filter className="h-5 w-5" />
                            Filters
                            <ChevronDown
                                className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                            />
                        </button>
                    </form>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                               

                                {/* Hourly Rate Range */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Hourly Rate ($)
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={filters.minRate}
                                            onChange={(e) => handleFilterChange('minRate', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={filters.maxRate}
                                            onChange={(e) => handleFilterChange('maxRate', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Experience Level */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Experience Level
                                    </label>
                                    <select
                                        value={filters.experienceLevel}
                                        onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">All Levels</option>
                                        <option value="entry">Entry Level</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="expert">Expert</option>
                                    </select>
                                </div>

                                {/* Availability */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Availability
                                    </label>
                                    <select
                                        value={filters.availabilityStatus}
                                        onChange={(e) => handleFilterChange('availabilityStatus', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Any</option>
                                        <option value="available">Available</option>
                                        <option value="busy">Busy</option>
                                        <option value="unavailable">Unavailable</option>
                                    </select>
                                </div>

                           

                                {/* Country */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., India, USA"
                                        value={filters.country}
                                        onChange={(e) => handleFilterChange('country', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2"
                                >
                                    <X className="h-4 w-4" />
                                    Clear All
                                </button>
                                <button
                                    type="button"
                                    onClick={applyFilters}
                                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Info */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-600">
                        {totalCount} freelancer{totalCount !== 1 ? 's' : ''} found
                    </p>
                    <button
                        onClick={fetchFreelancers}
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        <span className="ml-2 text-gray-600">Loading freelancers...</span>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={fetchFreelancers}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && freelancers.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No freelancers found
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Try adjusting your search or filter criteria
                        </p>
                        <button
                            onClick={clearFilters}
                            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

                {/* Freelancers Grid */}
                {!loading && !error && freelancers.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {freelancers.map((freelancer) => (
                            <div
                                key={freelancer.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="p-6">
                                    {/* Profile Header */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                            {freelancer.profile_picture ? (
                                                <img
                                                    src={`http://127.0.0.1:8000${freelancer.profile_picture}`}
                                                    alt={freelancer.full_name || freelancer.username}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                                                    {(freelancer.full_name || freelancer.username || 'U')
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 truncate">
                                                {freelancer.full_name || freelancer.username}
                                            </h3>
                                            <p className="text-sm text-gray-600 truncate">
                                                {freelancer.professional_profile?.title || 'Freelancer'}
                                            </p>
                                            {freelancer.freelancer_profile?.availability_status && (
                                                <div className="mt-1">
                                                    {getAvailabilityBadge(
                                                        freelancer.freelancer_profile.availability_status
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                   

                                    {/* Location & Experience */}
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                        {(freelancer.city || freelancer.country) && (
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4" />
                                                <span className="truncate">
                                                    {[freelancer.city, freelancer.country]
                                                        .filter(Boolean)
                                                        .join(', ')}
                                                </span>
                                            </div>
                                        )}
                                        {freelancer.freelancer_profile?.experience_level && (
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                <span className="capitalize">
                                                    {freelancer.freelancer_profile.experience_level}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Skills */}
                                    {freelancer.freelancer_profile?.skills &&
                                        freelancer.freelancer_profile.skills.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {freelancer.freelancer_profile.skills
                                                    .slice(0, 4)
                                                    .map((skill, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                {freelancer.freelancer_profile.skills.length > 4 && (
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                        +{freelancer.freelancer_profile.skills.length - 4} more
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                    {/* Bio Preview */}
                                    {freelancer.bio && (
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                            {freelancer.bio}
                                        </p>
                                    )}

                                    {/* View Profile Button */}
                                    <Link
                                        to={`/freelancer/profile/${freelancer.id}`}
                                        className="block w-full text-center py-2 px-4 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && !error && totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 text-gray-600">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindFreelancersPage;
