import apiClient from '../infrastructure/api/apiClient';

/**
 * Service class for managing classes and groups
 */
class ClassService {
    /**
     * Create a new group
     * @param {Object} groupData - Data for the new group
     * @returns {Promise<Object>} - Created group data
     */
    async createGroup(groupData) {
        try {
            const response = await apiClient.post('/grupos', groupData);
            return response.data;
        } catch (error) {
            console.error('Error creating group:', error);
            throw new Error(error.message || 'Error al crear el grupo');
        }
    }

    /**
     * Get all groups
     * @returns {Promise<Array>} - List of groups
     */
    async getGroups() {
        try {
            const response = await apiClient.get('/grupos');
            return response.data;
        } catch (error) {
            console.error('Error fetching groups:', error);
            throw new Error(error.message || 'Error al obtener los grupos');
        }
    }

    /**
     * Get a group by ID
     * @param {string} groupId - ID of the group to fetch
     * @returns {Promise<Object>} - Group data
     */
    async getGroupById(groupId) {
        try {
            const response = await apiClient.get(`/grupos/${groupId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching group with ID ${groupId}:`, error);
            throw new Error(error.message || 'Error al obtener el grupo');
        }
    }

    /**
     * Update a group
     * @param {string} groupId - ID of the group to update
     * @param {Object} groupData - New group data
     * @returns {Promise<Object>} - Updated group data
     */
    async updateGroup(groupId, groupData) {
        try {
            const response = await apiClient.put(`/grupos/${groupId}`, groupData);
            return response.data;
        } catch (error) {
            console.error(`Error updating group with ID ${groupId}:`, error);
            throw new Error(error.message || 'Error al actualizar el grupo');
        }
    }

    /**
     * Delete a group
     * @param {string} groupId - ID of the group to delete
     * @returns {Promise<boolean>} - True if deleted successfully
     */
    async deleteGroup(groupId) {
        try {
            await apiClient.delete(`/grupos/${groupId}`);
            return true;
        } catch (error) {
            console.error(`Error deleting group with ID ${groupId}:`, error);
            throw new Error(error.message || 'Error al eliminar el grupo');
        }
    }

    /**
     * Get groups summary (for dashboard)
     * @returns {Promise<Object>} - Summary information about groups
     */
    async getGroupsSummary() {
        try {
            const groups = await this.getGroups();

            // Calculate summary statistics
            return {
                totalGroups: groups.length,
                byGrade: this.countGroupsByGrade(groups),
                recentlyCreated: this.getRecentlyCreatedGroups(groups, 3)
            };
        } catch (error) {
            console.error('Error getting groups summary:', error);
            throw new Error(error.message || 'Error al obtener el resumen de grupos');
        }
    }

    /**
     * Count groups by grade
     * @param {Array} groups - List of groups
     * @returns {Object} - Count by grade
     * @private
     */
    countGroupsByGrade(groups) {
        const countByGrade = {};

        groups.forEach(group => {
            const grade = group.grado;
            countByGrade[grade] = (countByGrade[grade] || 0) + 1;
        });

        return countByGrade;
    }

    /**
     * Get most recently created groups
     * @param {Array} groups - List of groups
     * @param {number} limit - Maximum number of groups to return
     * @returns {Array} - Recently created groups
     * @private
     */
    getRecentlyCreatedGroups(groups, limit) {
        // Sort by creation date if available, otherwise just return the first 'limit' groups
        // Assuming there's a createdAt field, adjust as needed based on your API
        const sorted = [...groups].sort((a, b) => {
            if (a.createdAt && b.createdAt) {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return 0;
        });

        return sorted.slice(0, limit);
    }
}

export default new ClassService();