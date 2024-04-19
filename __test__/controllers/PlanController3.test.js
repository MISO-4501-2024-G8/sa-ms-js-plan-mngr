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
    checkToken: jest.fn(() => '')
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

describe('Plan Controller Admin', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/plans', planController);
    });

    it('should create a new plan', async () => {
        process.env.PLAN = 'basico';
        const newPlan = {
            name: "Plan Basico",
            startDate: "02-02-2024",
            endDate: "12-31-2024",
            value: 200
        };
        const response = await supertest(app)
            .post('/plans/planbasico')
            .send(newPlan);
        console.log('response:', response.error);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('name', newPlan.name);
    });

    it('should handle error when creating a new plan', async () => {
        process.env.PLAN = 'other';
        const newPlan = {
            name: "Plan Basico",
            startDate: "02-02-2024",
            endDate: "12-31-2024",
            value: 200
        };
        const response = await supertest(app)
            .post('/plans/planbasico')
            .send(newPlan);
        console.log('response:', response.error);
        expect(response.status).toBe(409);
    });

    it('should create a new plan intermedio', async () => {
        process.env.PLAN = 'intermedio';
        const newPlan = {
            name: "Plan Intermedio",
            startDate: "02-02-2024",
            endDate: "12-31-2024",
            value: 200,
            monitoreoTiempoReal: true,
            alertasRiesgo: false,
            comunicacionEntrenador: true
        };
        const response = await supertest(app)
            .post('/plans/planbasico_intermedio')
            .send(newPlan);
        console.log('response:', response.error);
        expect(response.status).toBe(201);
    });

    it('should handle error when creating a new plan', async () => {
        process.env.PLAN = 'other';
        const newPlan = {
            name: "Plan Intermedio",
            startDate: "02-02-2024",
            endDate: "12-31-2024",
            value: 200,
            monitoreoTiempoReal: true,
            alertasRiesgo: false,
            comunicacionEntrenador: true
        };
        const response = await supertest(app)
            .post('/plans/planbasico_intermedio')
            .send(newPlan);
        console.log('response:', response.error);
        expect(response.status).toBe(409);
    });

    it('should create a new plan premium', async () => {
        process.env.PLAN = 'premium';
        const newPlan = {
            name: "Plan Premium",
            startDate: "02-02-2024",
            endDate: "12-31-2024",
            value: 200,
            monitoreoTiempoReal: true,
            alertasRiesgo: false,
            comunicacionEntrenador: true,
            sesionesVirtuales: 2,
            masajes: true,
            cuidadoPosEjercicio: true
        };
        const response = await supertest(app)
            .post('/plans/planbasico_premium')
            .send(newPlan);
        console.log('response:', response.error);
        expect(response.status).toBe(201);
    });

    it('should handle error when creating a new plan', async () => {
        process.env.PLAN = 'other';
        const newPlan = {
            name: "Plan Premium",
            startDate: "02-02-2024",
            endDate: "12-31-2024",
            value: 200,
            monitoreoTiempoReal: true,
            alertasRiesgo: false,
            comunicacionEntrenador: true,
            sesionesVirtuales: 2,
            masajes: true,
            cuidadoPosEjercicio: true
        };
        const response = await supertest(app)
            .post('/plans/planbasico_premium')
            .send(newPlan);
        console.log('response:', response.error);
        expect(response.status).toBe(409);
    });

    it('should update a new plan', async () => {
        process.env.PLAN = 'basico';
        const newPlan = {
            name: "Plan Basico",
            startDate: "02-02-2024",
            endDate: "12-31-2024",
            value: 200
        };
        const response = await supertest(app)
            .put('/plans/planbasico/1')
            .send(newPlan);
        console.log('response:', response.error);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name', newPlan.name);
    });

    it('should handle error when trying to update a new plan', async () => {
        process.env.PLAN = 'other';
        const newPlan = {
            name: "Plan Basico",
            startDate: "02-02-2024",
            endDate: "12-31-2024",
            value: 200
        };
        const response = await supertest(app)
            .put('/plans/planbasico/1')
            .send(newPlan);
        console.log('response:', response.error);
        expect(response.status).toBe(404);
    });

    it('should update a new plan intermedio', async () => {
        process.env.PLAN = 'intermedio';
        const newPlan = {
            name: "Plan Intermedio",
            startDate: "02-02-2024",
            endDate: "12-31-2024",
            value: 200,
            monitoreoTiempoReal: true,
            alertasRiesgo: false,
            comunicacionEntrenador: true
        };
        const response = await supertest(app)
            .put('/plans/planbasico_intermedio/1')
            .send(newPlan);
        console.log('response:', response.error);
        expect(response.status).toBe(200);
    });

    it('should handle error when trying to update a new plan intermedio', async () => {
        process.env.PLAN = 'other';
        const newPlan = {
            name: "Plan Intermedio",
            startDate: "02-02-2024",
            endDate: "12-31-2024",
            value: 200,
            monitoreoTiempoReal: true,
            alertasRiesgo: false,
            comunicacionEntrenador: true
        };
        const response = await supertest(app)
            .put('/plans/planbasico_intermedio/1')
            .send(newPlan);
        console.log('response:', response.error);
        expect(response.status).toBe(404);
    });

    it('should update a new plan premium', async () => {
        process.env.PLAN = 'premium';
        const newPlan = {
            name: "Plan Premium",
            startDate: "02-02-2024",
            endDate: "12-31-2024",
            value: 200,
            monitoreoTiempoReal: true,
            alertasRiesgo: false,
            comunicacionEntrenador: true,
            sesionesVirtuales: 2,
            masajes: true,
            cuidadoPosEjercicio: true
        };
        const response = await supertest(app)
            .put('/plans/planbasico_premium/1')
            .send(newPlan);
        console.log('response:', response.error);
        expect(response.status).toBe(200);
    });

    it('should handle error when trying to update a new plan premium', async () => {
        process.env.PLAN = 'other';
        const newPlan = {
            name: "Plan Premium",
            startDate: "02-02-2024",
            endDate: "12-31-2024",
            value: 200,
            monitoreoTiempoReal: true,
            alertasRiesgo: false,
            comunicacionEntrenador: true,
            sesionesVirtuales: 2,
            masajes: true,
            cuidadoPosEjercicio: true
        };
        const response = await supertest(app)
            .put('/plans/planbasico_premium/1')
            .send(newPlan);
        console.log('response:', response.error);
        expect(response.status).toBe(404);
    });

    it('should delete a plan', async () => {
        process.env.PLAN = 'basico';
        const response = await supertest(app)
            .delete('/plans/planbasico/1');
        console.log('response:', response.error);
        expect(response.status).toBe(200);
    });

    it('should handle error when trying to delete a plan basico', async () => {
        process.env.PLAN = 'other';
        const response = await supertest(app)
            .delete('/plans/planbasico/1');
        console.log('response:', response.error);
        expect(response.status).toBe(404);
    });

    it('should delete a plan intermedio', async () => {
        process.env.PLAN = 'intermedio';
        const response = await supertest(app)
            .delete('/plans/planbasico_intermedio/1');
        console.log('response:', response.error);
        expect(response.status).toBe(200);
    });

    it('should handle error when trying to delete a plan intermedio', async () => {
        process.env.PLAN = 'other';
        const response = await supertest(app)
            .delete('/plans/planbasico_intermedio/1');
        console.log('response:', response.error);
        expect(response.status).toBe(404);
    });

    it('should delete a plan premium', async () => {
        process.env.PLAN = 'premium';
        const response = await supertest(app)
            .delete('/plans/planbasico_premium/1');
        console.log('response:', response.error);
        expect(response.status).toBe(200);
    });

    it('should handle error when trying to delete a plan premium', async () => {
        process.env.PLAN = 'other';
        const response = await supertest(app)
            .delete('/plans/planbasico_premium/1');
        console.log('response:', response.error);
        expect(response.status).toBe(404);
    });

    it('should post a new description feature', async () => {
        const newDescription = {
            tipoPlan: "basico",
            description: "Test Description"
        };
        const response = await supertest(app)
            .post('/plans/feature')
            .send(newDescription);
        console.log('response:', response.error);
        expect(response.status).toBe(201);
    });

    it('should put a description feature', async () => {
        process.env.FEATURE = 'other';
        const newDescription = {
            tipoPlan: "basico",
            description: "Test Description"
        };
        const response = await supertest(app)
            .put('/plans/feature/1')
            .send(newDescription);
        console.log('response:', response.error);
        expect(response.status).toBe(200);
    });

    it('should handle error when put a description feature', async () => {
        process.env.FEATURE = 'feature';
        const newDescription = {
            tipoPlan: "basico",
            description: "Test Description"
        };
        const response = await supertest(app)
            .put('/plans/feature/1')
            .send(newDescription);
        console.log('response:', response.error);
        expect(response.status).toBe(404);
    });

    it('should delete a description feature', async () => {
        process.env.FEATURE = 'other';
        const response = await supertest(app)
            .delete('/plans/feature/1');
        console.log('response:', response.error);
        expect(response.status).toBe(200);
    });

    it('should handle error when put a description feature', async () => {
        process.env.FEATURE = 'feature';
        const response = await supertest(app)
            .delete('/plans/feature/1');
        console.log('response:', response.error);
        expect(response.status).toBe(404);
    });

    it('should get features by plan', async () => {
        const response = await supertest(app)
            .get('/plans/features/basico');
        console.log('response:', response.error);
        expect(response.status).toBe(200);
    });

    it('should get all plans', async () => {
        const response = await supertest(app)
            .get('/plans/allplans');
        console.log('response:', response.error);
        expect(response.status).toBe(200);
    });

    it('should get a plan by id', async () => {
        const response = await supertest(app)
            .get('/plans/allplans/1');
        console.log('response:', response.error);
        expect(response.status).toBe(200);
    });


});