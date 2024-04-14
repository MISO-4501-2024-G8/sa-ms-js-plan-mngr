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

describe('Plan Controller', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/plans', planController);
  });

  // Plan Basico

  
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

  it('should generate error', async () => {
    const response = await supertest(app)
      .post('/plans/plans')
      .send(undefined);
    console.log('response:', response.error);
    expect(response.status).toBe(500);
  });

  it('should generate error', async () => {
    const response = await supertest(app)
      .post('/plans/plans/undefined')
      .send(undefined);
    console.log('response:', response.error);
    expect(response.status).toBe(404);
  });

  it('should return all plans', async () => {
    const response = await supertest(app).get('/plans/plans');
    console.log('response:', response.error);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return a plan by id', async () => {
    const response = await supertest(app)
      .get('/plans/plans/1');
    console.log('response:', response.error);
    console.log('response.body:', response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', "1");
  });

  it('should update plan by id', async () => {
    const newPlan = {
      id: 1,
      name: 'Nuevo Plan',
      typePlan: 'Basic',
      startDate: '2024-04-21',
      endDate: '2024-05-21',
      value: 200
    };
    const response = await supertest(app)
      .put('/plans/plans/1')
      .send(newPlan);
    console.log('response:', response.error);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', newPlan.name);
  });

  it('should delete plan by id', async () => {
    const response = await supertest(app)
      .delete('/plans/plans/1');
    console.log('response:', response.error);
    expect(response.status).toBe(200);
  });

  // Description Features

  it('should return all plansDescriptions', async () => {
    const response = await supertest(app).get('/plans/descriptionFeatures');
    console.log('response:', response.error);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return one planDescription by id', async () => {
    const response = await supertest(app)
      .get('/plans/descriptionFeatures/1');
    console.log('response:', response.error);
    console.log('response.body:', response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', "1");
  });

  it('should create a new planDescription', async () => {
    const newDescriptionFeatures = {
      id: 1,
      tipoPlan: 'Basic',
      description: 'Descripcion del plan basico'
    };
    const response = await supertest(app)
      .post('/plans/descriptionFeatures')
      .send(newDescriptionFeatures);
    console.log('response:', response.error);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('description', newDescriptionFeatures.description);
  });

  it('should update planDescription by id', async () => {
    const newDescriptionFeatures = {
      id: 1,
      tipoPlan: 'Basic',
      description: 'Descripcion del plan basico actualizada'
    };
    const response = await supertest(app)
      .put('/plans/descriptionFeatures/1')
      .send(newDescriptionFeatures);
    console.log('response:', response.error);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('description', newDescriptionFeatures.description);
  });

  it('should delete planDescription by id', async () => {
    const response = await supertest(app)
      .delete('/plans/descriptionFeatures/1');
    console.log('response:', response.error);
    expect(response.status).toBe(200);
  });

  // Plan Intermedio
  it('should create a new planIntermediate', async () => {
    const newPlanIntermediate = {
      id: 1,
      monitoreoTiempoReal: true,
      alertasRiesgo: false,
      comunicacionEntrenador: true
    };
    const response = await supertest(app)
      .post('/plans/plans_intermedio')
      .send(newPlanIntermediate);
    console.log('response:', response.error);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('comunicacionEntrenador', newPlanIntermediate.comunicacionEntrenador);

  });


  it('should return all plansIntermediate', async () => {
    console.log('Planes Intermedio');
    const response = await supertest(app)
      .get('/plans/plans_intermedio');
    console.log('response:', response.error);
    console.log('response.body:', response.body);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return one plansIntermediate by id', async () => {
    console.log('Planes Intermedio');
    const response = await supertest(app)
      .get('/plans/plans_intermedio/1');
    console.log('response:', response.error);
    console.log('response.body:', response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', "1");
  });

  it('should update planIntermediate by id', async () => {
    const newPlanIntermediate = {
      id: 1,
      monitoreoTiempoReal: false,
      alertasRiesgo: true,
      comunicacionEntrenador: false
    };
    const response = await supertest(app)
      .put('/plans/plans_intermedio/1')
      .send(newPlanIntermediate);
    console.log('response:', response.error);
    expect(response.status).toBe(200);
    expect(response.body !== undefined).toBe(true);
  });

  it('should delete plan intermedioby id', async () => {
    const response = await supertest(app)
      .delete('/plans/plans_intermedio/1');
    console.log('response:', response.error);
    expect(response.status).toBe(200);
  });

  // Plan Premium

  it('should create a new planPremium', async () => {
    const newPlanPremium = {
      id: 1,
      sesionesVirtuales: 2,
      masajes: true,
      cuidadoPosEjercicio: true
    };
    const response = await supertest(app)
      .post('/plans/plans_premium')
      .send(newPlanPremium);
    console.log('response:', response.error);
    expect(response.status).toBe(201);
  });

  it('should return all plansPremium', async () => {
    const response = await supertest(app)
      .get('/plans/plans_premium');
    console.log('response:', response.error);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return one plansPremium by id', async () => {
    const response = await supertest(app)
      .get('/plans/plans_premium/1');
    console.log('response:', response.error);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', "1");
  });

  it('should update planPremium by id', async () => {
    const newPlanPremium = {
      id: 1,
      sesionesVirtuales: 3,
      masajes: false,
      cuidadoPosEjercicio: false
    };
    const response = await supertest(app)
      .put('/plans/plans_premium/1')
      .send(newPlanPremium);
    console.log('response:', response.error);
    expect(response.status).toBe(200);
    expect(response.body !== undefined).toBe(true);
  });

  it('should delete plan premium by id', async () => {
    const response = await supertest(app)
      .delete('/plans/plans_premium/1');
    console.log('response:', response.error);
    expect(response.status).toBe(200);
  });

  

  it('should handle error', async () => {
    try {
      jest.spyOn(console, 'log').mockImplementation(() => {
        throw new Error("Simulated error in console.log");
      });
      const response = await supertest(app)
        .post('/plans/plans')
        .send(undefined);
      console.log('response:', response.error);
      expect(response.status).toBe(500);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Simulated error in console.log");
    }
    jest.restoreAllMocks();
  });

});

