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
    } else if (req.params === undefined || req.params.id === undefined || req.params.id === null || req.params.id === 'undefined') {
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

/*
SPORT APP REQUESTS
*/


// crear un plan basico
planController.post('/planbasico', async (req, res) => {
    try {
        const isToken = await checkToken(req, res);
        if (isToken === '') {
            console.log('Petición de creación de plan básico');
            checkRequest(req, 'creación');
            console.log('Petición de creación de plan básico:', JSON.stringify(req.body));
            const idModel = uuidv4().split('-')[0];
            const typePlan = 'basico';
            const { name, startDate, endDate, value } = req.body;
            const planInfo = await Plan.create(
                {
                    id: idModel,
                    name,
                    typePlan,
                    startDate,
                    endDate,
                    value
                }
            );
            res.status(201).json(planInfo);
        } else {
            res.status(401).json({ error: isToken, code: 401 });
        }
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});

// crear un plan basico-intermedio

planController.post('/planbasico_intermedio', async (req, res) => {
    try {
        const isToken = await checkToken(req, res);
        if (isToken === '') {
            console.log('Petición de creación de plan básico-intermedio');
            checkRequest(req, 'creación');
            console.log('Petición de creación de plan básico-intermedio:', JSON.stringify(req.body));
            const idModel = uuidv4().split('-')[0];
            const typePlan = 'intermedio';
            const { name, startDate, endDate, value, monitoreoTiempoReal, alertasRiesgo, comunicacionEntrenador } = req.body;
            const planInfo = await Plan.create(
                {
                    id: idModel,
                    name,
                    typePlan,
                    startDate,
                    endDate,
                    value
                }
            );
            const planIntermedioInfo = await PlanIntermedio.create(
                {
                    id: idModel,
                    monitoreoTiempoReal,
                    alertasRiesgo,
                    comunicacionEntrenador
                }
            );

            const planIntermedio = {
                planInfo,
                planIntermedioInfo
            };

            res.status(201).json(planIntermedio);
        } else {
            res.status(401).json({ error: isToken, code: 401 });
        }
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});

// crear un plan basico-premium

planController.post('/planbasico_premium', async (req, res) => {
    try {
        const isToken = await checkToken(req, res);
        if (isToken === '') {
            console.log('Petición de creación de plan básico-premium');
            checkRequest(req, 'creación');
            console.log('Petición de creación de plan básico-premium:', JSON.stringify(req.body));
            const idModel = uuidv4().split('-')[0];
            const typePlan = 'premium';
            const {
                name, startDate, endDate, value,
                monitoreoTiempoReal, alertasRiesgo, comunicacionEntrenador,
                sesionesVirtuales, masajes, cuidadoPosEjercicio } = req.body;
            const planInfo = await Plan.create(
                {
                    id: idModel,
                    name,
                    typePlan,
                    startDate,
                    endDate,
                    value
                }
            );
            const planIntermedioInfo = await PlanIntermedio.create(
                {
                    id: idModel,
                    monitoreoTiempoReal,
                    alertasRiesgo,
                    comunicacionEntrenador
                });

            const planPremiumInfo = await PlanPremium.create(
                {
                    id: idModel,
                    sesionesVirtuales,
                    masajes,
                    cuidadoPosEjercicio
                }
            );

            const planPremium = {
                planInfo,
                planIntermedioInfo,
                planPremiumInfo
            };

            res.status(201).json(planPremium);
        } else {
            res.status(401).json({ error: isToken, code: 401 });
        }
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});

// actualizar un plan basico

planController.put('/planbasico/:id', async (req, res) => {
    try {
        const isToken = await checkToken(req, res);
        if (isToken === '') {
            console.log('Petición de actualización de plan básico');
            checkRequest(req, 'actualización');
            console.log('Petición de actualización de plan básico:', JSON.stringify(req.body));
            const plan = await findPlanById(Plan, req.params.id);
            if (plan === null) {
                res.status(404).json({ error: 'No se encontró el plan', code: 404 });
            }
            const { name, startDate, endDate, value } = req.body;
            plan.set({ name, startDate, endDate, value });
            await plan.save();
            res.status(200).json(plan);
        } else {
            res.status(401).json({ error: isToken, code: 401 });
        }
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});

// actualizar un plan basico-intermedio

planController.put('/planbasico_intermedio/:id', async (req, res) => {
    try {
        const isToken = await checkToken(req, res);
        if (isToken === '') {
            console.log('Petición de actualización de plan básico-intermedio');
            checkRequest(req, 'actualización');
            console.log('Petición de actualización de plan básico-intermedio:', JSON.stringify(req.body));
            const plan = await findPlanById(Plan, req.params.id);
            const planIntermedio = await findPlanById(PlanIntermedio, req.params.id);
            if (plan === null || planIntermedio === null) {
                res.status(404).json({ error: 'No se encontró el plan intermedio', code: 404 });
            }
            const { name, startDate, endDate, value, monitoreoTiempoReal, alertasRiesgo, comunicacionEntrenador } = req.body;

            plan.set({ name, startDate, endDate, value });
            await plan.save();
            planIntermedio.set({ monitoreoTiempoReal, alertasRiesgo, comunicacionEntrenador });
            await planIntermedio.save();

            const planIntermedioInfo = {
                plan,
                planIntermedio
            };
            res.status(200).json(planIntermedioInfo);
        } else {
            res.status(401).json({ error: isToken, code: 401 });
        }
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});

// actualizar un plan basico-premium

planController.put('/planbasico_premium/:id', async (req, res) => {
    try {
        const isToken = await checkToken(req, res);
        if (isToken === '') {
            console.log('Petición de actualización de plan básico-premium');
            checkRequest(req, 'actualización');
            console.log('Petición de actualización de plan básico-premium:', JSON.stringify(req.body));
            const plan = await findPlanById(Plan, req.params.id);
            const planIntermedio = await findPlanById(PlanIntermedio, req.params.id);
            const planPremium = await findPlanById(PlanPremium, req.params.id);
            if (plan === null || planIntermedio === null || planPremium === null) {
                res.status(404).json({ error: 'No se encontró el plan premium', code: 404 });
            }
            const {
                name, startDate, endDate, value,
                monitoreoTiempoReal, alertasRiesgo, comunicacionEntrenador,
                sesionesVirtuales, masajes, cuidadoPosEjercicio } = req.body;
            plan.set({ name, startDate, endDate, value });
            await plan.save();
            planIntermedio.set({ monitoreoTiempoReal, alertasRiesgo, comunicacionEntrenador });
            await planIntermedio.save();
            planPremium.set({ sesionesVirtuales, masajes, cuidadoPosEjercicio });
            await planPremium.save();
            const planPremiumInfo = {
                plan,
                planIntermedio,
                planPremium
            };
            res.status(200).json(planPremiumInfo);
        } else {
            res.status(401).json({ error: isToken, code: 401 });
        }
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});

const deletePlan = async (plan) => {
    if (process.env.NODE_ENV !== 'test') {
        const descriptionFeatures = await DescriptionFeatures.findAll({ where: { tipoPlan: plan.typePlan } });
        for (let feature of descriptionFeatures) {
            await feature.destroy();
        }
        await plan.destroy();
    }
    return plan;

}

// eliminar un plan basico

planController.delete('/planbasico/:id', async (req, res) => {
    try {
        const isToken = await checkToken(req, res);
        if (isToken === '') {
            console.log('Petición de eliminación de plan básico');
            checkRequest(req, 'eliminación');
            console.log('Petición de eliminación de plan básico:', JSON.stringify(req.body));
            const plan = await findPlanById(Plan, req.params.id);
            if (plan === null) {
                res.status(404).json({ error: 'No se encontró el plan', code: 404 });
            }
            if (process.env.NODE_ENV !== 'test') {
                // eliminar features de descripcion del plan
                deletePlan(plan);
            }
            res.status(200).json(plan);
        } else {
            res.status(401).json({ error: isToken, code: 401 });
        }
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});


// eliminar un plan basico-intermedio

planController.delete('/planbasico_intermedio/:id', async (req, res) => {
    try {
        const isToken = await checkToken(req, res);
        if (isToken === '') {
            console.log('Petición de eliminación de plan básico-intermedio');
            checkRequest(req, 'eliminación');
            console.log('Petición de eliminación de plan básico-intermedio:', JSON.stringify(req.body));
            const plan = await findPlanById(Plan, req.params.id);
            const planIntermedio = await findPlanById(PlanIntermedio, req.params.id);
            if (plan === null || planIntermedio === null) {
                res.status(404).json({ error: 'No se encontró el plan intermedio', code: 404 });
            }
            if (process.env.NODE_ENV !== 'test') {
                deletePlan(plan);
                await planIntermedio.destroy();
            }
            const planIntermedioInfo = {
                plan,
                planIntermedio
            };
            res.status(200).json(planIntermedioInfo);
        } else {
            res.status(401).json({ error: isToken, code: 401 });
        }
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});

// eliminar un plan basico-premium

planController.delete('/planbasico_premium/:id', async (req, res) => {
    try {
        const isToken = await checkToken(req, res);
        if (isToken === '') {
            console.log('Petición de eliminación de plan básico-premium');
            checkRequest(req, 'eliminación');
            console.log('Petición de eliminación de plan básico-premium:', JSON.stringify(req.body));
            const plan = await findPlanById(Plan, req.params.id);
            const planIntermedio = await findPlanById(PlanIntermedio, req.params.id);
            const planPremium = await findPlanById(PlanPremium, req.params.id);
            if (plan === null || planIntermedio === null || planPremium === null) {
                res.status(404).json({ error: 'No se encontró el plan premium', code: 404 });
            }
            if (process.env.NODE_ENV !== 'test') {
                deletePlan(plan);
                await planIntermedio.destroy();
                await planPremium.destroy();
            }
            const planPremiumInfo = {
                plan,
                planIntermedio,
                planPremium
            };
            res.status(200).json(planPremiumInfo);
        } else {
            res.status(401).json({ error: isToken, code: 401 });
        }
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});

// agregar una caracteristica de descripcion a plan
planController.post('/feature', async (req, res) => {
    try {
        const isToken = await checkToken(req, res);
        if (isToken === '') {
            console.log('Petición de creación de característica de descripción');
            checkRequest(req, 'creación');
            console.log('Petición de creación de característica de descripción:', JSON.stringify(req.body));
            const idModel = uuidv4().split('-')[0];
            const { tipoPlan, description } = req.body;
            const planFeature = await DescriptionFeatures.create(
                {
                    id: idModel,
                    tipoPlan,
                    description
                }
            );
            res.status(201).json(planFeature);
        } else {
            res.status(401).json({ error: isToken, code: 401 });
        }
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});
// actualizar una caracteristica de descripcion a plan
planController.put('/feature/:id', async (req, res) => {
    try {
        const isToken = await checkToken(req, res);
        if (isToken === '') {
            console.log('Petición de actualización de característica de descripción');
            checkRequest(req, 'actualización');
            console.log('Petición de actualización de característica de descripción:', JSON.stringify(req.body));
            const planFeature = await findPlanById(DescriptionFeatures, req.params.id);
            if (planFeature === null) {
                res.status(404).json({ error: 'No se encontró la característica de descripción', code: 404 });
            }
            const { tipoPlan, description } = req.body;
            planFeature.set({ tipoPlan, description });
            await planFeature.save();
            res.status(200).json(planFeature);
        } else {
            res.status(401).json({ error: isToken, code: 401 });
        }
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});

// eliminar una caracteristica de descripcion a plan
planController.delete('/feature/:id', async (req, res) => {
    try {
        const isToken = await checkToken(req, res);
        if (isToken === '') {
            console.log('Petición de eliminación de característica de descripción');
            checkRequest(req, 'eliminación');
            console.log('Petición de eliminación de característica de descripción:', JSON.stringify(req.body));
            const planFeature = await findPlanById(DescriptionFeatures, req.params.id);
            if (planFeature === null) {
                res.status(404).json({ error: 'No se encontró la característica de descripción', code: 404 });
            }
            if (process.env.NODE_ENV !== 'test') {
                await planFeature.destroy();
            }
            res.status(200).json(planFeature);
        } else {
            res.status(401).json({ error: isToken, code: 401 });
        }
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});


const getPlanFeatures = async (tipoPlan) => {
    const descriptionFeatures = await DescriptionFeatures.findAll({ where: { tipoPlan: tipoPlan } });
    return descriptionFeatures;
};

// obtener todas las caracteristicas de descripcion de un plan
planController.get('/features/:tipoPlan', async (req, res) => {
    try {
        console.log('Petición de obtener todas las características de descripción de un plan');
        const features = await getPlanFeatures(req.params.tipoPlan);
        res.status(200).json(features);
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});


const getPlanInfo = async (plan) => {
    if (plan.typePlan === 'basico') {
        // No se necesita agregar información adicional para el plan básico
        plan = { ...plan.dataValues }
    } else if (plan.typePlan === 'intermedio') {
        // Buscar información del plan intermedio y agregarla al objeto de plan
        const planIntermedio = await PlanIntermedio.findOne({ where: { id: plan.id } });
        let intermedioInfo = {};
        if (planIntermedio) {
            intermedioInfo = planIntermedio.dataValues
        }
        plan = {
            ...plan.dataValues,
            intermedioInfo
        };
    } else if (plan.typePlan === 'premium') {
        // Buscar información del plan intermedio y agregarla al objeto de plan
        let intermedioInfo = {};
        let premiumInfo = {};
        const planIntermedio = await PlanIntermedio.findOne({ where: { id: plan.id } });
        if (planIntermedio) {
            intermedioInfo = planIntermedio.dataValues
        }
        // Buscar información del plan premium y agregarla al objeto de plan
        const planPremium = await PlanPremium.findOne({ where: { id: plan.id } });
        if (planPremium) {
            premiumInfo = planPremium.dataValues
        }
        plan = {
            ...plan.dataValues,
            intermedioInfo,
            premiumInfo
        };
    }
    // Buscar características adicionales y agregarlas al objeto de plan
    if (plan.typePlan) {
        console.log('Obteniendo características de descripción para el plan', plan.typePlan);
        const descriptionFeatures = await getPlanFeatures(plan.typePlan);
        //console.log('Características de descripción obtenidas:', descriptionFeatures);
        const planComplete = {
            ...plan,
            features: descriptionFeatures
        };

        return planComplete;
    } else {
        return plan;
    }
}

// obtener todos los planes

planController.get('/allplans', async (req, res) => {
    try {
        console.log('Petición de obtener todos los planes');
        const planes = await Plan.findAll();
        const planesInfo = [];
        for (let plan of planes) {
            planesInfo.push(await getPlanInfo(plan));
        }
        res.status(200).json(planesInfo);
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});

// obtener un plan por id
planController.get('/allplan/:tipoPlan', async (req, res) => {
    try {
        console.log('Petición de obtener un plan por tipoPlan');
        const plan = await Plan.findOne({ where: { typePlan: req.params.tipoPlan } });
        if (plan) {
            const planInfo = await getPlanInfo(plan);
            res.status(200).json(planInfo);
        } else {
            res.status(404).json({ error: 'No se encontró el plan', code: 404 });
        }
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});





module.exports = planController;
