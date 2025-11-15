const express = require('express');
const router = express.Router();

const GEOAPI = process.env.GEO_API;

router.get('/', async (req, res) => {
    try {
        const {type, CPRO} = req.query;

        let url;
        if(type === 'provincias') {
            url = `https://apiv1.geoapi.es/provincias?key=${GEOAPI}&type=JSON`;
        
        } else if(type === 'municipios') {
            url = `https://apiv1.geoapi.es/municipios?key=${GEOAPI}&CPRO=${CPRO}&type=JSON`;
        } else {
            return res.status(400).json({ error: 'Tipo de consulta no válido' });
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error al obtener datos de GeoAPI');
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;