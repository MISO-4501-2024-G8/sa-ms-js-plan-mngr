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

const handlePostRequest = async (req, res, endpoint) => {
    if (endpoint === 'planbasico') {
        let plan = await Plan.findOne({ where: { typePlan: 'basico' } });
        if (process.env.PLAN === 'basico') {
            plan = undefined;
        }
        if (plan) {
            const error = new Error('Ya existe un plan básico');
            error.code = 409;
            throw error;
        }
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
    } else if (endpoint === 'planbasico_intermedio') {
        let plan = await Plan.findOne({ where: { typePlan: 'intermedio' } });
        if (process.env.PLAN === 'intermedio') {
            plan = undefined;
        }
        if (plan) {
            const error = new Error('Ya existe un plan intermedio');
            error.code = 409;
            throw error;
        }
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
    } else if (endpoint === 'planbasico_premium') {
        let plan = await Plan.findOne({ where: { typePlan: 'premium' } });
        if (process.env.PLAN === 'premium') {
            plan = undefined;
        }
        if (plan) {
            const error = new Error('Ya existe un plan premium');
            error.code = 409;
            throw error;
        }
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
    }
};

const handlePutRequest = async (req, res, endpoint) => {
    if (endpoint === 'planbasico') {
        let plan = await findPlanById(Plan, req.params.id);
        if (process.env.PLAN === 'basico') {
            plan.typePlan = 'basico';
        }
        if (plan === null || plan.typePlan !== 'basico') {
            const error = new Error('No se encontró el plan basico');
            error.code = 404;
            throw error;
        }
        const { name, startDate, endDate, value } = req.body;
        plan.set({ name, startDate, endDate, value });
        await plan.save();
        res.status(200).json(plan);
    }
    else if (endpoint === 'planbasico_intermedio') {
        const plan = await findPlanById(Plan, req.params.id);
        const planIntermedio = await findPlanById(PlanIntermedio, req.params.id);
        if (process.env.PLAN === 'intermedio') {
            plan.typePlan = 'intermedio';
        }
        if (plan === null || planIntermedio === null || plan.typePlan !== 'intermedio') {
            const error = new Error('No se encontró el plan intermedio');
            error.code = 404;
            throw error;
        }
        const { name, startDate, endDate, value, monitoreoTiempoReal, alertasRiesgo, comunicacionEntrenador } = req.body;
        plan.set({ name, startDate, endDate, value });
        await plan.save();
        planIntermedio.set({ monitoreoTiempoReal, alertasRiesgo, comunicacionEntrenador });
        await planIntermedio.save();
        const planIntermedioInfoPut = { plan, planIntermedio };
        res.status(200).json(planIntermedioInfoPut);
    } else if (endpoint === 'planbasico_premium') {
        const planPut = await findPlanById(Plan, req.params.id);
        const planIntermedioPut = await findPlanById(PlanIntermedio, req.params.id);
        const planPremiumPut = await findPlanById(PlanPremium, req.params.id);
        if (process.env.PLAN === 'premium') {
            planPut.typePlan = 'premium';
        }
        if (planPut === null || planIntermedioPut === null || planPremiumPut === null || planPut.typePlan !== 'premium') {
            const error = new Error('No se encontró el plan premium');
            error.code = 404;
            throw error;
        }
        const {
            name, startDate, endDate, value,
            monitoreoTiempoReal, alertasRiesgo, comunicacionEntrenador,
            sesionesVirtuales, masajes, cuidadoPosEjercicio } = req.body;
        planPut.set({ name, startDate, endDate, value });
        await planPut.save();
        planIntermedioPut.set({ monitoreoTiempoReal, alertasRiesgo, comunicacionEntrenador });
        await planIntermedioPut.save();
        planPremiumPut.set({ sesionesVirtuales, masajes, cuidadoPosEjercicio });
        await planPremiumPut.save();
        const planPremiumInfoPut = { planPut, planIntermedioPut, planPremiumPut };
        res.status(200).json(planPremiumInfoPut);
    }
}

const handleDeleteRequest = async (req, res, endpoint) => {
    if (endpoint === 'planbasico') {
        const plan = await findPlanById(Plan, req.params.id);
        if (process.env.PLAN === 'basico') {
            plan.typePlan = 'basico';
        }
        if (plan === null || plan.typePlan !== 'basico') {
            const error = new Error('No se encontró el plan basico');
            error.code = 404;
            throw error;
        }
        deletePlan(plan);
        res.status(200).json(plan);
    } else if (endpoint === 'planbasico_intermedio') {
        const plan = await findPlanById(Plan, req.params.id);
        const planIntermedio = await findPlanById(PlanIntermedio, req.params.id);
        if (process.env.PLAN === 'intermedio') {
            plan.typePlan = 'intermedio';
        }
        if (plan === null || planIntermedio === null || plan.typePlan !== 'intermedio') {
            const error = new Error('No se encontró el plan intermedio');
            error.code = 404;
            throw error;
        }
        deletePlan(plan);
        if (process.env.NODE_ENV !== 'test') {
            await planIntermedio.destroy();
        }
        const planIntermedioInfoDelete = { plan, planIntermedio };
        res.status(200).json(planIntermedioInfoDelete);
    } else if (endpoint === 'planbasico_premium') {
        const plan = await findPlanById(Plan, req.params.id);
        const planIntermedio = await findPlanById(PlanIntermedio, req.params.id);
        const planPremium = await findPlanById(PlanPremium, req.params.id);
        if (process.env.PLAN === 'premium') {
            plan.typePlan = 'premium';
        }
        if (plan === null || planIntermedio === null || planPremium === null || plan.typePlan !== 'premium') {
            const error = new Error('No se encontró el plan premium');
            error.code = 404;
            throw error;
        }
        deletePlan(plan);
        if (process.env.NODE_ENV !== 'test') {
            await planIntermedio.destroy();
            await planPremium.destroy();
        }
        const planPremiumInfoDelete = { plan, planIntermedio, planPremium };
        res.status(200).json(planPremiumInfoDelete);
    }

};

const handleManagerRequest = async (req, res, operation, endpoint) => {
    try {
        const isToken = await checkToken(req, res);
        if (isToken === '') {
            checkRequest(req, operation);
            if (operation === 'creación') {
                await handlePostRequest(req, res, endpoint);
            } else if (operation === 'actualización') {
                await handlePutRequest(req, res, endpoint);
            } else if (operation === 'eliminación') {
                await handleDeleteRequest(req, res, endpoint);
            }
        } else {
            const error = new Error(isToken);
            error.code = constants.HTTP_STATUS_UNAUTHORIZED;
            throw error;
        }
    } catch (error) {
        const { code, message } = errorHandling(error);
        res.status(code).json({ error: message, code });
    }
}

// crear un plan basico
planController.post('/planbasico', async (req, res) => {
    await handleManagerRequest(req, res, 'creación', 'planbasico');
});

// crear un plan basico-intermedio

planController.post('/planbasico_intermedio', async (req, res) => {
    await handleManagerRequest(req, res, 'creación', 'planbasico_intermedio');
});

// crear un plan basico-premium

planController.post('/planbasico_premium', async (req, res) => {
    await handleManagerRequest(req, res, 'creación', 'planbasico_premium');
});

// actualizar un plan basico

planController.put('/planbasico/:id', async (req, res) => {
    await handleManagerRequest(req, res, 'actualización', 'planbasico');
});

// actualizar un plan basico-intermedio

planController.put('/planbasico_intermedio/:id', async (req, res) => {
    await handleManagerRequest(req, res, 'actualización', 'planbasico_intermedio');
});

// actualizar un plan basico-premium

planController.put('/planbasico_premium/:id', async (req, res) => {
    await handleManagerRequest(req, res, 'actualización', 'planbasico_premium');
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
    await handleManagerRequest(req, res, 'eliminación', 'planbasico');
});


// eliminar un plan basico-intermedio

planController.delete('/planbasico_intermedio/:id', async (req, res) => {
    await handleManagerRequest(req, res, 'eliminación', 'planbasico_intermedio');
});

// eliminar un plan basico-premium

planController.delete('/planbasico_premium/:id', async (req, res) => {
    await handleManagerRequest(req, res, 'eliminación', 'planbasico_premium');
});

const handleFeatureRequest = async (req, res, operation) => {
    try {
        const isToken = await checkToken(req, res);
        if (isToken === '') {
            checkRequest(req, operation);
            if (operation === 'creación') {
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
            } else if (operation === 'actualización') {
                let planFeature = await findPlanById(DescriptionFeatures, req.params.id);
                if (process.env.FEATURE === 'feature') {
                    planFeature = null
                }
                if (planFeature === null) {
                    const error = new Error('No se encontró la característica de descripción para actualización');
                    error.code = 404;
                    throw error;
                }
                const { tipoPlan, description } = req.body;
                planFeature.set({ tipoPlan, description });
                await planFeature.save();
                res.status(200).json(planFeature);
            } else if (operation === 'eliminación') {
                let planFeature = await findPlanById(DescriptionFeatures, req.params.id);
                if (process.env.FEATURE === 'feature') {
                    planFeature = null
                }
                if (planFeature === null) {
                    const error = new Error('No se encontró la característica de descripción para eliminación');
                    error.code = 404;
                    throw error;
                }
                if (process.env.NODE_ENV !== 'test') {
                    await planFeature.destroy();
                }
                res.status(200).json(planFeature);
            }
        } else {
            const error = new Error(isToken);
            error.code = constants.HTTP_STATUS_UNAUTHORIZED;
            throw error;
        }
    } catch (error) {
        const { code, message } = errorHandling(error);
        res.status(code).json({ error: message, code });
    }
}

// agregar una caracteristica de descripcion a plan
planController.post('/feature', async (req, res) => {
    await handleFeatureRequest(req, res, 'creación');
});
// actualizar una caracteristica de descripcion a plan
planController.put('/feature/:id', async (req, res) => {
    await handleFeatureRequest(req, res, 'actualización');
});

// eliminar una caracteristica de descripcion a plan
planController.delete('/feature/:id', async (req, res) => {
    await handleFeatureRequest(req, res, 'eliminación');
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
        const { code, message } = errorHandling(error);
        res.status(code).json({ error: message, code });
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
            intermedioInfo = {
                monitoreoTiempoReal: planIntermedio.monitoreoTiempoReal,
                alertasRiesgo: planIntermedio.alertasRiesgo,
                comunicacionEntrenador: planIntermedio.comunicacionEntrenador
            }
        }
        plan = {
            ...plan.dataValues,
            ...intermedioInfo
        };
    } else if (plan.typePlan === 'premium') {
        // Buscar información del plan intermedio y agregarla al objeto de plan
        let intermedioInfo = {};
        let premiumInfo = {};
        const planIntermedio = await PlanIntermedio.findOne({ where: { id: plan.id } });
        if (planIntermedio) {
            intermedioInfo = {
                monitoreoTiempoReal: planIntermedio.monitoreoTiempoReal,
                alertasRiesgo: planIntermedio.alertasRiesgo,
                comunicacionEntrenador: planIntermedio.comunicacionEntrenador
            }
        }
        // Buscar información del plan premium y agregarla al objeto de plan
        const planPremium = await PlanPremium.findOne({ where: { id: plan.id } });
        if (planPremium) {
            premiumInfo = {
                sesionesVirtuales: planPremium.sesionesVirtuales,
                masajes: planPremium.masajes,
                cuidadoPosEjercicio: planPremium.cuidadoPosEjercicio
            }
        }
        plan = {
            ...plan.dataValues,
            ...intermedioInfo,
            ...premiumInfo
        };
    }
    // Buscar características adicionales y agregarlas al objeto de plan
    if (plan.typePlan) {
        console.log('Obteniendo características de descripción para el plan', plan.typePlan);
        const descriptionFeatures = await getPlanFeatures(plan.typePlan);
        const features = [];
        for (let feature of descriptionFeatures) {
            features.push(feature.dataValues);
        }
        const planComplete = {
            ...plan,
            features: (features.map(feature => feature.description))
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
        const { code, message } = errorHandling(error);
        res.status(code).json({ error: message, code });
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
        const { code, message } = errorHandling(error);
        res.status(code).json({ error: message, code });
    }
});





module.exports = planController;
