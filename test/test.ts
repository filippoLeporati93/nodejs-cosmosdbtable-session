import {TableClient} from '@azure/data-tables';
import * as assert from 'assert';
import {describe, it} from 'mocha';

import {CosmosDbTableStore} from '../src/index';
import {SessionData} from 'express-session';

describe('cosmosdb table session', () => {
  it('should throw without table client', done => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    assert.throws(() => new (TableClient as any)());
    done();
  });

  it('should get an entity', done => {
    const fakeTableClient = {
      createTable: () => {
        return new Promise((resolve, reject) => {
          // the function is executed automatically when the promise is constructed
          // after 1 second signal that the job is done with the result "done"
          setTimeout(() => resolve('done'), 100);
        });
      },
      listEntities: () => {
        done();
      },
    } as {} as TableClient;

    const store = new CosmosDbTableStore({
      tableClient: fakeTableClient,
    });

    const expectedSid = 'sid';
    store.get(expectedSid, err => {
      assert.ifError(err);
    });
  });

  it('should set an entity', done => {
    const fakeTableClient = {
      createTable: () => {
        return new Promise((resolve, reject) => {
          // the function is executed automatically when the promise is constructed
          // after 1 second signal that the job is done with the result "done"
          setTimeout(() => resolve('done'), 100);
        });
      },
      upsertEntity: (entity: any, mode: string) => {
        assert.strictEqual(mode, 'Replace');
        done();
      },
    } as {} as TableClient;

    const store = new CosmosDbTableStore({
      tableClient: fakeTableClient,
    });

    const expectedSid = 'sid';
    store.set(expectedSid, {} as SessionData, assert.ifError);
  });

  it('should destroy an entity', done => {
    const fakeTableClient = {
      deleteEntity: (sidPartitionKey: string, sidRowKey: string) => {
        assert.strictEqual(sidPartitionKey, expectedSid);
        assert.strictEqual(sidRowKey, expectedSid);
        done();
      },
    } as {} as TableClient;

    const store = new CosmosDbTableStore({
      tableClient: fakeTableClient,
    });

    const expectedSid = 'sid';
    store.destroy(expectedSid);
  });
});
