import {TableClient} from '@azure/data-tables';
import * as assert from 'assert';
import {describe, it} from 'mocha';
import {CosmosDbTableStore} from '../src';
import {SessionData} from 'express-session';

const store = new CosmosDbTableStore({
  tableClient: TableClient.fromConnectionString(
    'UseDevelopmentStorage=true',
    'testTable2'
  ),
});

describe('system tests', () => {
  it('should return an empty session', done => {
    store.get('123', (err, session) => {
      assert.ifError(err);
      assert.strictEqual(session, undefined);
      done();
    });
  });

  it('Should create and retrieve a session', done => {
    const sessionData = {foo: 'bar'} as {} as SessionData;
    store.set('123', sessionData, err => {
      assert.ifError(err);
      store.get('123', (err, session) => {
        assert.ifError(err);
        assert.deepStrictEqual(session, {foo: 'bar'});
        done();
      });
    });
  });

  it('Should destroy a session', done => {
    store.destroy('123', err => {
      assert.ifError(err);
      assert.strictEqual(err, undefined);
      store.get('123', (err, session) => {
        assert.ifError(err);
        assert.strictEqual(session, undefined);
        done();
      });
    });
  });
});
