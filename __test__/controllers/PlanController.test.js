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

describe('Plan Controller', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/plans', planController);
        //request = supertest(app);
    });

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

});

