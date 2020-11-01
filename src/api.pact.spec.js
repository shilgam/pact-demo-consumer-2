import path from 'path';
import { Pact } from '@pact-foundation/pact';
import { eachLike, like } from '@pact-foundation/pact/dsl/matchers';
import { API } from './api';

jest.setTimeout(15000);

const mockProvider = new Pact({
  consumer: 'pact-demo-consumer',
  provider: 'pact-demo-provider',
  log: path.resolve(process.cwd(), 'logs', 'pact.log'),
  logLevel: 'warn',
  dir: path.resolve(process.cwd(), 'pacts'),
  spec: 2,
});

describe('API Pact test', () => {
  beforeAll(() => mockProvider.setup());

  afterEach(() => mockProvider.verify());

  afterAll(() => mockProvider.finalize());

  describe('getting all products', () => {
    test('products exists', async () => {
      // set up Pact interactions
      await mockProvider.addInteraction({
        state: 'products exist',
        uponReceiving: 'a request to get all products',
        withRequest: {
          method: 'GET',
          path: '/products',
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: eachLike({
            id: like(9),
            type: like('CREDIT_CARD'),
            name: like('Gem Visa'),
          }, { min: 2 }),
        },
      });

      const api = new API(mockProvider.mockService.baseUrl);

      // make request to Pact mock server
      const product = await api.getAllProducts();

      expect(product).toStrictEqual([
        { id: 9, name: 'Gem Visa', type: 'CREDIT_CARD' },
        { id: 9, name: 'Gem Visa', type: 'CREDIT_CARD' },
      ]);
    });

    test('no products exists', async () => {
      // set up Pact interactions
      await mockProvider.addInteraction({
        state: 'no products exist',
        uponReceiving: 'a request to get all products',
        withRequest: {
          method: 'GET',
          path: '/products',
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: [],
        },
      });

      const api = new API(mockProvider.mockService.baseUrl);

      // make request to Pact mock server
      const products = await api.getAllProducts();

      expect(products).toStrictEqual([]);
    });
  });

  describe('getting one product', () => {
    // TODO: fix provider state to return a reproducible result
    xtest('ID 10 exists', async () => {
      // set up Pact interactions
      await mockProvider.addInteraction({
        state: 'product with ID 10 exists',
        uponReceiving: 'a request to get a product',
        withRequest: {
          method: 'GET',
          path: '/products/10',
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: {
            id: like(10),
            type: like('CREDIT_CARD'),
            name: like('28 Degrees'),
          },
        },
      });

      const api = new API(mockProvider.mockService.baseUrl);

      // make request to Pact mock server
      const product = await api.getProduct(10);

      expect(product).toStrictEqual({
        id: 10,
        type: 'CREDIT_CARD',
        name: '28 Degrees',
      });
    });

    // TODO: fix provider to not throw an exception
    xtest('product does not exist', async () => {
      // set up Pact interactions
      await mockProvider.addInteraction({
        state: 'product with ID 11 does not exist',
        uponReceiving: 'a request to get a product',
        withRequest: {
          method: 'GET',
          path: '/products/11',
        },
        willRespondWith: {
          status: 404,
        },
      });

      const api = new API(mockProvider.mockService.baseUrl);

      // make request to Pact mock server
      await expect(api.getProduct(11)).rejects.toThrow('Request failed with status code 404');
    });
  });
});
