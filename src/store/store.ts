import {
  AnyAction,
  applyMiddleware,
  combineReducers,
  compose,
  createStore as _createStore,
  Middleware,
  Reducer,
  ReducersMapObject,
  Store
} from 'redux'
import thunkMiddleware from 'redux-thunk'
const __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'

export class ReduxStore<S, A extends AnyAction = AnyAction> {
  private _store: Store<S, A>
  private _combineReducers: Reducer<S>
  get store(): Store<S, A> {
    return this._store
  }
  get combineReducers(): Reducer<S> {
    return this._combineReducers
  }
  private _createComposer(debug: boolean) {
    if (!debug || typeof window === 'undefined') {
      return compose
    }
    if (window.hasOwnProperty(__NEXT_REDUX_STORE__)) {
      return (window as any)[__NEXT_REDUX_STORE__]
    }
    if (window.hasOwnProperty(__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)) {
      return (window as any)[__REDUX_DEVTOOLS_EXTENSION_COMPOSE__]
    }
    return compose
  }
  constructor(reducers: ReducersMapObject<S, A>, middlewares: Middleware<any, S, any>[] = [], debug: boolean = false) {
    const composeEnhancers = this._createComposer(debug)
    this._combineReducers = combineReducers<S>(reducers)
    this._store = _createStore<S, A, any, any>(
      this._combineReducers,
      composeEnhancers(
        applyMiddleware(
          ...middlewares,
          thunkMiddleware
        )
      )
    )
  }
}
