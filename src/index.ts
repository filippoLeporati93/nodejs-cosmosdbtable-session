import {
  ListTableEntitiesOptions,
  odata,
  TableClient,
  TableEntityQueryOptions,
} from '@azure/data-tables';
import {Store, SessionData} from 'express-session';

export interface StoreOptions {
  tableClient: TableClient;
}

interface Entity {
  partitionKey: string;
  rowKey: string;
  data: string;
}

export class CosmosDbTableStore extends Store {
  tableClient: TableClient;

  constructor(options: StoreOptions) {
    super();
    this.tableClient = options.tableClient;
    if (!this.tableClient) {
      throw new Error('No TableClient provided to CosmosDbTableStore Session.');
    }
  }

  get = (
    sid: string,
    callback: (err?: Error | null, session?: SessionData) => void
  ) => {
    this.tableClient
      .createTable()
      .then(() => {
        this._getEntities({
          filter: odata`PartitionKey eq ${sid} and RowKey eq ${sid}`,
        })
          .then(onFulfilledValue => {
            if (!onFulfilledValue || onFulfilledValue.length <= 0)
              return callback();
            return callback(null, onFulfilledValue[0]);
          })
          .catch(err => {
            callback(err as Error);
          });
      })
      .catch(err => callback!(err as Error));
  };

  set = (
    sid: string,
    session: SessionData,
    callback?: (err?: Error) => void
  ) => {
    callback = callback || (() => {});
    let sessJson: string;

    try {
      sessJson = JSON.stringify(session);
    } catch (err) {
      return callback(err as Error);
    }

    const entity: Entity = {
      partitionKey: sid,
      rowKey: sid,
      data: sessJson,
    };

    this.tableClient
      .createTable()
      .then(() => {
        this.tableClient
          .upsertEntity(entity, 'Replace')
          .then(_ => callback!())
          .catch(err => callback!(err as Error));
      })
      .catch(err => callback!(err as Error));
  };

  destroy = (sid: string, callback?: (err?: Error) => void) => {
    callback = callback || (() => {});
    this.tableClient
      .deleteEntity(sid, sid)
      .then(_ => callback!())
      .catch(err => callback!(err as Error));
  };

  clear = (callback?: (err?: any) => void) => {
    callback = callback || (() => {});
    this.tableClient
      .deleteTable()
      .then(_ => callback!())
      .catch(err => callback!(err as Error));
  };

  length = (callback: (err: any, length: number) => void) => {
    callback = callback || (() => {});

    this._getEntities()
      .then(entities => callback(null, entities.length))
      .catch(err => callback(err as Error, 0));
  };

  all(
    callback: (
      err: any,
      obj?: SessionData[] | {[sid: string]: SessionData} | null
    ) => void
  ) {
    callback = callback || (() => {});

    this._getEntities()
      .then(entities => callback(null, entities))
      .catch(err => callback(err as Error, null));
  }

  private _getEntities = async (query?: TableEntityQueryOptions) => {
    const listEntities = this.tableClient.listEntities<Entity>({
      queryOptions: query ? query : undefined,
    });
    const entities = [];
    for await (const entity of listEntities) {
      entities.push(JSON.parse(entity.data));
    }
    return entities;
  };
}
