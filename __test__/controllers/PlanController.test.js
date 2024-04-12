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

  const basicPlans = [
    {
      id: 1,
      name: 'Nuevo Plan',
      typePlan: 'Basic',
      startDate: '2024-04-21',
      endDate: '2024-05-21',
      value: 100
    },
    {
      id: 2,
      name: 'Nuevo Plan',
      typePlan: 'Basic',
      startDate: '2024-04-21',
      endDate: '2024-05-21',
      value: 100
    }];

  it('should create a new plan', async () => {
    const newPlan = {
      id: 1,
      name: 'Nuevo Plan',
      typePlan: 'Basic',
      startDate: '2024-04-21',
      endDate: '2024-05-21',
      value: 100
    };
    const response = await supertest(app)
      .post('/plans/plans')
      .send(newPlan);
    console.log('response:', response.error);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('name', newPlan.name);

  });

  it('should return all plans', async () => {
    const response = await supertest(app).get('/plans/plans');
    console.log('response:', response.error);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return a plan by id', async () => {
    const response = await supertest(app).get('/plans/plans/1');
    console.log('response:', response.error);
    console.log('response.body:', response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', "1");
  });


  it('should return all plansDescriptions', async () => {
    const response = await supertest(app).get('/plans/descriptionFeatures');
    console.log('response:', response.error);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should create a new planDescription', async () => {
    const newDescription = {
      id: 1,
      tipoPlan: 'Basic',
      description: "Description1"
    };
    const response = await supertest(app)
      .post('/plans/descriptionFeatures')
      .send(newDescription);
    console.log('response:', response.error);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('description', newDescription.description);

  });

  it('should create a new planIntermediate', async () => {
    const newPlanIntermediate = {
      id: 1,
      monitoreoTiempoReal: true,
      alertasRiesgo: false,
      comunicacionEntrenador: true
    };
    const response = await supertest(app)
      .post('/plans/plans/intermedio')
      .send(newPlanIntermediate);
    console.log('response:', response.error);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('comunicacionEntrenador', newPlanIntermediate.comunicacionEntrenador);

  });

  
  it('should return all plansIntermediate', async () => {
    console.log('Planes Intermedio');
    const response = await supertest(app)
      .get('/plans/plans/intermedio');
    console.log('response:', response.error);
    console.log('response.body:', response.body);
    expect(response.status).toBe(200);
    //expect(Array.isArray(response.body)).toBe(true);
  });

});

