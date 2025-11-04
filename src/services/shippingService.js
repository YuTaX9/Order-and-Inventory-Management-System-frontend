

import api from './api';

export const fetchShippingZones = async () => {
    try {
        const response = await api.get('/shipping-zones/');
        return response.data;
    } catch (error) {
        console.error("Error fetching shipping zones:", error);
        throw error;
    }
};

export const calculateShippingPreview = async (shippingZoneId, cartTotal) => {
    if (!shippingZoneId) {
        return { shipping_cost: 0, is_free: false, message: "Select a zone" };
    }
    
    try {
        const response = await api.post('/calculate-shipping/', {
            shipping_zone_id: shippingZoneId,
            cart_total: cartTotal,
        });
        
        return response.data;
    } catch (error) {
        console.error("Error calculating shipping preview:", error.response?.data || error.message);
        throw error; 
    }
};


export const createShippingZone = async (zoneData) => {
    const response = await api.post('/shipping-zones/', zoneData);
    return response.data;
};

export const updateShippingZone = async (id, zoneData) => {
    const response = await api.put(`/shipping-zones/${id}/`, zoneData);
    return response.data;
};

export const deleteShippingZone = async (id) => {
    const response = await api.delete(`/shipping-zones/${id}/`);
    return response.data;
};