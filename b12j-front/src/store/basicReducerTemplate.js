import {apiCallBegan} from "./api";
import {urls} from "../configuration";
import {getPageNumberFromLink} from "../apps/functions";
import {getJwt} from "../common/authService";

export const standardInitialState = () => {
  return {
    list: [],
    dict: {},
    fetched: {},
    total: null,
    loading: false,
  }
}

export const basicReducers = (name) => {
  return {
    [`${name}Added`]: (state, action) => {
      state.list.push(action.payload.id);
      state.dict[action.payload.id] = action.payload;
      state.loading = false;
    },

    [`${name}Updated`]: (state, action) => {
      if (state.dict[action.payload.id]) state.dict[action.payload.id] = action.payload;
      else {
        state.dict[action.payload.id] = action.payload;
        state.list.push(action.payload)
      }
      state.loading = false;
    },

    [`${name}sReceived`]: (state, action) => {
      const data = action.payload.results;
      if (data) {
        for (let i = 0; i < data.length; i++) {
          state.dict[data[i].id] = data[i];
          state.list.push(data[i].id)
        }
      }
      state.loading = false;
    },

    [`${name}Requested`]: (state) => {
      state.loading = true;
    },

    [`${name}RequestFailed`]: (state) => {
      state.loading = false;
    }
  }
};

export const receivedWithPagination = (state, action) => {
  let page;
  state.loading = false;
  const nextUrl = action.payload.next;
  if (!nextUrl) page = Math.ceil(action.payload.count / 20)
  else page = getPageNumberFromLink(nextUrl);
  state.fetched[page] = Date.now();
  state.list[page] = []
  state.dict[page] = {}
  state.total = Math.ceil(action.payload.count / 20);
  const data = action.payload.results;
  for (let i = 0; i < data.length; i++) {
    state.dict[data[i].id] = data[i];
    state.list[page].push(data[i].id)
  }
}

export const receivedDiscussions = (state, action, name) => {
  const result = action.payload.results[0];
  let pid = undefined;
  if (result) pid = action.payload.results[0][name];

  state.loading = false;
  if (pid) {
    pid = parseInt(pid)
    state.fetched[pid] = Date.now();
    state.list[pid] = [];
    state.dict[pid] = {};
    const data = action.payload.results;
    for (let i = 0; i < data.length; i++) {
      state.dict[data[i].id] = data[i];
      state.list[pid].push(data[i].id)
    }
  }
}

export const updatedWithPagination = (state, action) => {
  if (state.dict[action.payload.id]) state.dict[action.payload.id] = action.payload;
  else {
    state.dict[action.payload.id] = action.payload;
    if (!state.list[1]) state.list[1] = []
    state.list[1] = [action.payload.id, ...state.list[1]]
  }
  state.loading = false;
}

export class basicActions {
  constructor(slice, store, ws, name) {
    const actions = slice.actions;
    this.ws = ws;
    this.store = store;
    this.name = name;
    this.added = actions[`${name}Added`];
    this.requestFailed = actions[`${name}RequestFailed`];
    this.requested = actions[`${name}Requested`];
    this.received = actions[`${name}sReceived`];
    this.updated = actions[`${name}Updated`];
    this.pending = {};
    this.pendingId = {};
  }

  start = () => {
    this.store.dispatch({
      type: this.requested.type
    })
  }

  failure = () => {
    this.store.dispatch({
      type: this.requestFailed.type
    })
  };

  _loadSection = (url, section) => {
    if (this.store.getState()[`${this.name}s`].fetched[section] || this.pending[section]) return;
    if (section < 1) {
      alert("Wrong page");
      return;
    }
    this.pending[section] = Date.now();
    this._load(url);
  }

  _load = (url = urls[`${this.name}s`] + '/') => {
    this.store.dispatch(apiCallBegan({
      url: url,
      onStart: this.requested.type,
      onSuccess: this.received.type,
      onFailed: this.requestFailed.type,
    }));
  };

  _loadById = (id) => {
    if (!this.pendingId[id]) {
      this.pendingId[id] = Date.now();
      const toSend = {"method": "GET", "target": this.name, "id": id, 'id_token': getJwt()}
      this.ws.send(JSON.stringify(toSend));
      this.start();
    }
  };

  add = (data) => {
    const toSend = {"method": "POST", "target": this.name, "data": data, 'id_token': getJwt()};
    this.ws.send(JSON.stringify(toSend));
    this.start();
  }

  edit = (data) => {
    const toSend = {"method": "PUT", "target": this.name, "id": data.id, "data": data, 'id_token': getJwt()};
    this.ws.send(JSON.stringify(toSend));
    this.start();
  }

  list(objList = []) {
    if (!objList) return;
    const dict = this.store.getState()[`${this.name}s`].dict;
    let data = []
    for (let i = 0; i < objList.length; i++) {
      data.push(dict[objList[i]]);
    }
    return data;
  }

  update = (data) => {
    this.store.dispatch({type: this.updated.type, payload: data})
  }

  getById = (id, key = null) => {
    const dict = this.store.getState()[`${this.name}s`].dict;
    if (key) {
      if (dict[id]) return dict[id][key];
      else if (id) this._loadById(id);
    } else if (dict[id]) return dict[id]
    if (id) this._loadById(id);
    return null;
  }
}
