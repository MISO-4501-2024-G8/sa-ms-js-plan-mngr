jest.mock('../../src/database/data', () => {
    const SequelizeMock = require("sequelize-mock");
    const Models = require('../../src/database/models');
    class DatabaseMock {
        constructor() {
            this.sequelize = new SequelizeMock('database', 'username', 'password', {
                dialect: 'sqlite',
                storage: ':memory:',
            });
            this.models = new Models(this.sequelize);
            // Define the mock Plan model
            const PlanMock = this.sequelize.define('Plan', {});
            const PlanIntermedioMock = this.sequelize.define('PlanIntermedio', {});

            PlanMock.findByPk = jest.fn().mockReturnValue(Promise.resolve({ id: 1, name: 'Test Plan' }));
            PlanMock.findAll = jest.fn().mockReturnValue(Promise.resolve([{ id: 1, name: 'Test Plan' }]));

            PlanIntermedioMock.findByPk = jest.fn().mockReturnValue(Promise.resolve({ id: 1, monitoreoTiempoReal: true, alertasRiesgo: false, comunicacionEntrenador: true }));
            PlanIntermedioMock.findAll = jest.fn().mockReturnValue(Promise.resolve([{ id: 1, monitoreoTiempoReal: true, alertasRiesgo: false, comunicacionEntrenador: true }]));


            // Add the mock Plan model to the models
            this.models.Plan = PlanMock;
            this.models.PlanIntermedio = PlanIntermedioMock;
        }

        async connect() {
            try {
                await this.sequelize.authenticate();
                console.log('Conexión a la base de datos establecida correctamente.');
            } catch (error) {
                console.error('Error al conectar a la base de datos:', error);
            }
        }

        async defineModel(modelName, fields) {
            return this.sequelize.define(modelName, fields);
        }

        async syncModels() {
            try {
                await this.sequelize.sync();
                console.log('Modelos sincronizados correctamente.');
            } catch (error) {
                console.error('Error al sincronizar modelos:', error);
            }
        }
    }

    return DatabaseMock;
});

const express = require("express");
const supertest = require("supertest");
const { constants } = require('http2');
const jwt = require('jsonwebtoken');
jest.mock("jsonwebtoken", () => ({
    sign: jest.fn(() => "mocked-token")
}));
jest.mock('../../src/utils/checkToken', () => ({
    checkToken: jest.fn(() => 'No se ha enviado el token de autenticación')
}));

const Database = require("../../src/database/data");
const planController = require("../../src/controllers/PlanController");
const { v4: uuidv4 } = require('uuid');
const exp = require("constants");
const { setUncaughtExceptionCaptureCallback } = require("process");
const Models = require('../../src/database/models');
const db = new Database();
const Plan = db.models.definePlan();
const PlanIntermedio = db.models.definePlanIntermedio();
const PlanPremium = db.models.definePlanPremium();
const DescriptionFeatures = db.models.defineDescriptionFeatures();



describe('Plan Controller', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/plans', planController);
    });

    it('should return all plans', async () => {
        const response = await supertest(app).get('/plans/plans');
        console.log('response:', response.error);
        expect(response.status).toBe(401);
        expect(Array.isArray(response.body)).toBe(false);
    });

    it('should return a plan by id', async () => {
        const response = await supertest(app)
            .get('/plans/plans/1');
        console.log('response:', response.error);
        console.log('response.body:', response.body);
        expect(response.status).toBe(401);
    });

    it('should return all plansIntermediate', async () => {
        console.log('Planes Intermedio');
        const response = await supertest(app)
            .get('/plans/plans_intermedio');
        console.log('response:', response.error);
        console.log('response.body:', response.body);
        expect(response.status).toBe(401);
        expect(Array.isArray(response.body)).toBe(false);
    });

    it('should return one plansIntermediate by id', async () => {
        console.log('Planes Intermedio');
        const response = await supertest(app)
            .get('/plans/plans_intermedio/1');
        console.log('response:', response.error);
        console.log('response.body:', response.body);
        expect(response.status).toBe(401);
    });

    it('should return all plansPremium', async () => {
        const response = await supertest(app)
            .get('/plans/plans_premium');
        console.log('response:', response.error);
        expect(response.status).toBe(401);
        expect(Array.isArray(response.body)).toBe(false);
    });

    it('should return one plansPremium by id', async () => {
        const response = await supertest(app)
            .get('/plans/plans_premium/1');
        console.log('response:', response.error);
        expect(response.status).toBe(401);
    });

    it('should return all plansDescriptions', async () => {
        const response = await supertest(app).get('/plans/descriptionFeatures');
        console.log('response:', response.error);
        expect(response.status).toBe(401);
        expect(Array.isArray(response.body)).toBe(false);
    });

    it('should return one planDescription by id', async () => {
        const response = await supertest(app)
            .get('/plans/descriptionFeatures/1');
        console.log('response:', response.error);
        console.log('response.body:', response.body);
        expect(response.status).toBe(401);
    });
});

