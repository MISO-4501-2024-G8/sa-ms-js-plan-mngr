const express = require("express");
const { constants } = require('http2');
const Database = require("../database/data");
const { encrypt, decrypt } = require('../utils/encrypt_decrypt');
const { checkToken } = require('../utils/checkToken');
const { errorHandling } = require('../utils/errorHandling');

const db = new Database();
const Plan = db.models.definePlan();
const PlanIntermedio = db.models.definePlanIntermedio();
const PlanPremium = db.models.definePlanPremium();
const DescriptionFeatures = db.models.defineDescriptionFeatures();

const expirationTime = 600 * 2000;
const { v4: uuidv4 } = require('uuid');

const planController = express.Router();

// Función auxiliar para buscar un plan por su ID
const findPlanById = async (Model, id) => {
    return await Model.findOne({ where: { id } });
};

const checkRequest = (req, operation) => {
    if (operation !== 'eliminación') {
        if (req.body === undefined || req.body === null || Object.keys(req.body).length === 0) {
            const error = new Error("No se ha enviado el cuerpo de la petición");
            error.code = constants.HTTP_STATUS_BAD_REQUEST;
            throw error;
        }
    } else if (req.params === undefined || req.params.id === undefined || req.params.id === null) {
        const error = new Error("No se ha enviado el id de la petición");
        error.code = constants.HTTP_STATUS_BAD_REQUEST;
        throw error;
    }
};

// Función auxiliar para manejar las operaciones comunes de CRUD para planes
const handlePlanOperation = async (req, res, Model, operation) => {
    try {
        const isToken = await checkToken(req, res);
        if (isToken === '') {
            console.log(`Petición de handlePlanOperation para ${operation}`);
            checkRequest(req, operation);
            console.log(`Petición de ${operation} de plan:`, JSON.stringify(req.body));
            let plan;
            if (operation === 'creación') {
                const idModel = uuidv4().split('-')[0];
                req.body.id = idModel;
                plan = await Model.create(req.body);
            } else if (operation === 'actualización') {
                plan = await findPlanById(Model, req.params.id);
                plan.set(req.body);
                await plan.save();
            } else if (operation === 'eliminación') {
                plan = await findPlanById(Model, req.params.id);
                if (process.env.NODE_ENV !== 'test') {
                    await plan.destroy();
                }
            }
            res.status(operation === 'creación' ? 201 : 200).json(plan);
        } else {
            res.status(401).json({ error: isToken, code: 401 });
        }
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
};


// Rutas para los planes
planController.get('/plans', async (req, res) => {
    const isToken = await checkToken(req, res);
    if (isToken === '') {
        const plans = await Plan.findAll();
        res.status(200).json(plans);
    } else {
        res.status(401).json({ error: isToken, code: 401 });
    }
});

planController.get('/plans/:id', async (req, res) => {
    const isToken = await checkToken(req, res);
    if (isToken === '') {
        const plan = await findPlanById(Plan, req.params.id);
        res.status(200).json(plan);
    } else {
        res.status(401).json({ error: isToken, code: 401 });
    }
});

planController.post('/plans', async (req, res) => {
    await handlePlanOperation(req, res, Plan, 'creación');
});

planController.put('/plans/:id', async (req, res) => {
    await handlePlanOperation(req, res, Plan, 'actualización');
});

planController.delete('/plans/:id', async (req, res) => {
    await handlePlanOperation(req, res, Plan, 'eliminación');
});

// Rutas para los planes intermedios
planController.get('/plans_intermedio', async (req, res) => {
    const isToken = await checkToken(req, res);
    if (isToken === '') {
        const plans = await PlanIntermedio.findAll();
        res.status(200).json(plans);
    } else {
        res.status(401).json({ error: isToken, code: 401 });
    }
});

planController.get('/plans_intermedio/:id', async (req, res) => {
    const isToken = await checkToken(req, res);
    if (isToken === '') {
        const plan = await findPlanById(PlanIntermedio, req.params.id);
        res.status(200).json(plan);
    } else {
        res.status(401).json({ error: isToken, code: 401 });
    }
});

planController.post('/plans_intermedio', async (req, res) => {
    await handlePlanOperation(req, res, PlanIntermedio, 'creación');
});

planController.put('/plans_intermedio/:id', async (req, res) => {
    await handlePlanOperation(req, res, PlanIntermedio, 'actualización');
});

planController.delete('/plans_intermedio/:id', async (req, res) => {
    await handlePlanOperation(req, res, PlanIntermedio, 'eliminación');
});


// Rutas para los planes premium
planController.get('/plans_premium', async (req, res) => {
    const isToken = await checkToken(req, res);
    if (isToken === '') {
        const plans = await PlanPremium.findAll();
        res.status(200).json(plans);
    } else {
        res.status(401).json({ error: isToken, code: 401 });
    }
});

planController.get('/plans_premium/:id', async (req, res) => {
    const isToken = await checkToken(req, res);
    if (isToken === '') {
        const plan = await findPlanById(PlanPremium, req.params.id);
        res.status(200).json(plan);
    } else {
        res.status(401).json({ error: isToken, code: 401 });
    }
});

planController.post('/plans_premium', async (req, res) => {
    await handlePlanOperation(req, res, PlanPremium, 'creación');
});

planController.put('/plans_premium/:id', async (req, res) => {
    await handlePlanOperation(req, res, PlanPremium, 'actualización');
});

planController.delete('/plans_premium/:id', async (req, res) => {
    await handlePlanOperation(req, res, PlanPremium, 'eliminación');
});

// Rutas para las características de descripción
planController.get('/descriptionFeatures', async (req, res) => {
    const isToken = await checkToken(req, res);
    if (isToken === '') {
        const descriptionFeatures = await DescriptionFeatures.findAll();
        res.status(200).json(descriptionFeatures);
    } else {
        res.status(401).json({ error: isToken, code: 401 });
    }
});

planController.get('/descriptionFeatures/:id', async (req, res) => {
    const isToken = await checkToken(req, res);
    if (isToken === '') {
        const descriptionFeature = await findPlanById(DescriptionFeatures, req.params.id);
        res.status(200).json(descriptionFeature);
    } else {
        res.status(401).json({ error: isToken, code: 401 });
    }
});

planController.post('/descriptionFeatures', async (req, res) => {
    await handlePlanOperation(req, res, DescriptionFeatures, 'creación');
});

planController.put('/descriptionFeatures/:id', async (req, res) => {
    await handlePlanOperation(req, res, DescriptionFeatures, 'actualización');
});

planController.delete('/descriptionFeatures/:id', async (req, res) => {
    await handlePlanOperation(req, res, DescriptionFeatures, 'eliminación');
});


module.exports = planController;
