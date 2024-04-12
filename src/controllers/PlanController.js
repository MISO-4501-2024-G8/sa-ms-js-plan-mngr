const express = require("express");
const { constants } = require('http2');
const Database = require("../database/data");
const jwt = require('jsonwebtoken');
const planController = express.Router();
const db = new Database();
const Plan = db.models.definePlan();
const PlanIntermedio = db.models.definePlanIntermedio();
const PlanPremium = db.models.definePlanPremium();
const DescriptionFeatures = db.models.defineDescriptionFeatures();
const expirationTime = 600 * 2000;
const { v4: uuidv4 } = require('uuid');
const { encrypt, decrypt } = require('../utils/encrypt_decrypt');
const { errorHandling } = require('../utils/errorHandling');
const secret = 'MISO-4501-2024-G8';

planController.get('/plans', async (req, res) => {
    try {
        const plans = await Plan.findAll();
        console.log('Petición de consulta de planes:', JSON.stringify(plans));
        res.status(200).json(plans);
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});

planController.get('/plans/:id', async (req, res) => { 
    try {
        const plan = await Plan.findOne({ where: { id: req.params.id } });
        res.status(200).json(plan);
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});

planController.post('/plans', async (req, res) => {
    try {
        if (req.body === undefined || req.body === null || Object.keys(req.body).length === 0) {
            const error = new Error("No se ha enviado el cuerpo de la petición");
            error.code = constants.HTTP_STATUS_BAD_REQUEST;
            throw error;
        }
        console.log('Petición de creación de plan:', JSON.stringify(req.body));
        const plan = await Plan.create({
            name: req.body.name,
            typePlan: req.body.typePlan,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            value: req.body.value
        } = req.body);
        res.status(201).json(plan);
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});


planController.put('/plans/:id', async (req, res) => {
    try {
        const plan = await Plan.findOne({ where: { id: req.params.id } });
        plan.name = req.body.name;
        plan.typePlan = req.body.typePlan;
        plan.startDate = req.body.startDate;
        plan.endDate = req.body.endDate;
        plan.value = req.body.value;
        await plan.save();
        res.status(200).json(plan);
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});

planController.delete('/plans/:id', async (req, res) => {
    try {
        const plan = await Plan.findOne({ where: { id: req.params.id } });
        await plan.destroy();
        res.status(200).json(plan);
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});

planController.get('/plans/intermedio', async (req, res) => {
    try {
        const plans = await PlanIntermedio.findAll();
        console.log('Petición de consulta de planes intermedios:', JSON.stringify(plans));
        res.status(200).json(plan);
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});

planController.post('/plans/intermedio', async (req, res) => {
    try {
        const plan = await PlanIntermedio.create({
            monitoreoTiempoReal: req.body.monitoreoTiempoReal,
            alertasRiesgo: req.body.alertasRiesgo,
            comunicacionEntrenador: req.body.comunicacionEntrenador
        });
        res.status(201).json(plan);
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});

planController.put('/plans/intermedio/:id', async (req, res) => {
    try {
        const plan = await Plan.findOne({ where: { id: req.params.id } });
        plan.monitoreoTiempoReal = req.body.monitoreoTiempoReal;
        plan.alertasRiesgo = req.body.alertasRiesgo;
        plan.comunicacionEntrenador = req.body.comunicacionEntrenador;
        await plan.save();
        res.status(200).json(plan);
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});

planController.delete('/plans/intermedio/:id', async (req, res) => {
    try {
        const plan = await Plan.findOne({ where: { id: req.params.id } });
        await plan.destroy();
        res.status(200).json(plan);
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});

planController.get('/plans/premium', async (req, res) => {
    try {
        const plan = await PlanPremium.findAll();
        res.status(200).json(plan);
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});

planController.post('/plans/premium', async (req, res) => {
    try {
        const plan = await PlanPremium.create({
            monitoreoTiempoReal: req.body.monitoreoTiempoReal,
            alertasRiesgo: req.body.alertasRiesgo,
            comunicacionEntrenador: req.body.comunicacionEntrenador
        });
        res.status(201).json(plan);
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});

planController.put('/plans/premium/:id', async (req, res) => {
    try {
        const plan = await Plan.findOne({ where: { id: req.params.id } });
        plan.monitoreoTiempoReal = req.body.monitoreoTiempoReal;
        plan.alertasRiesgo = req.body.alertasRiesgo;
        plan.comunicacionEntrenador = req.body.comunicacionEntrenador;
        await plan.save();
        res.status(200).json(plan);
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});

planController.delete('/plans/premium/:id', async (req, res) => {
    try {
        const plan = await Plan.findOne({ where: { id: req.params.id } });
        await plan.destroy();
        res.status(200).json(plan);
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});

planController.get('/descriptionFeatures', async (req, res) => {
    try {
        const descriptionFeatures = await DescriptionFeatures.findAll();
        res.status(200).json(descriptionFeatures);
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});

planController.post('/descriptionFeatures', async (req, res) => {
    try {
        const descriptionFeatures = await DescriptionFeatures.create({
            name: req.body.name,
            description: req.body.description
        });
        res.status(201).json(descriptionFeatures);
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});

planController.put('/descriptionFeatures/:id', async (req, res) => {
    try {
        const descriptionFeatures = DescriptionFeatures.findOne({ where: { id: req.params.id } });
        descriptionFeatures.name = req.body.name;
        descriptionFeatures.description = req.body.description;
        await descriptionFeatures.save();
        res.status(200).json(descriptionFeatures);
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});

planController.delete('/descriptionFeatures/:id', async (req, res) => {
    try {
        const descriptionFeatures = await DescriptionFeatures.findOne({ where: { id: req.params.id } });
        await descriptionFeatures.destroy();
        res.status(200).json(descriptionFeatures);
    } catch (error) {
        res.status(500).json(errorHandling(error));
    }
});

module.exports = planController;

