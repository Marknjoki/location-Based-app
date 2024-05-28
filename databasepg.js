
/**
 * ESEQ/02705/2020
 * BRIAN NJOKI
 */
const express = require('express');
const cors = require("cors");
const { Client } = require('pg');

const app = express();
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'bapp2023',
    password: 'postgres',
    port: 5432,
});
app.use(cors());
app.get('/api/nearby-facilities', async (req, res) => {
    const { lat, lng, radius } = req.query;

    try {
        await client.connect();

        const hfquery = `
            SELECT id, hfname, ST_X(geom) as longitude, ST_Y(geom) as latitude
            FROM health_facilities
            WHERE ST_DWithin(
                ST_Transform(geom, 4326),
                ST_Transform(ST_SetSRID(ST_MakePoint($1, $2), 4326), 4326),
                $3
            );
        `;

        const result = await client.query(hfquery, [lng, lat, radius]);



        const instQuery = `
            SELECT id, instname, ST_X(geom) as longitude, ST_Y(geom) as latitude
            FROM institutes
            WHERE ST_DWithin(
                ST_Transform(geom, 4326),
                ST_Transform(ST_SetSRID(ST_MakePoint($1, $2), 4326), 4326),
                $3
            );
        `;

        const result_inst = await client.query(instQuery, [lng, lat, radius]);

        res.json({
            institutes: result.rows,
            facilities: result_inst.rows
        });

    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'An error occurred while querying the database' });
    } finally {
        await client.end();
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

