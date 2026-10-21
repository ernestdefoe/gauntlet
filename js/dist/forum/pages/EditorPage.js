"use strict";
(self["webpackChunk_ernestdefoe_gauntlet"] = self["webpackChunk_ernestdefoe_gauntlet"] || []).push([["ernestdefoe-gauntlet:forum/pages/EditorPage"],{

/***/ "./src/common/api.ts"
/*!***************************!*\
  !*** ./src/common/api.ts ***!
  \***************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   api: () => (/* binding */ api),
/* harmony export */   call: () => (/* binding */ call),
/* harmony export */   t: () => (/* binding */ t),
/* harmony export */   tournamentUrl: () => (/* binding */ tournamentUrl)
/* harmony export */ });
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/app */ "flarum/common/app");
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_app__WEBPACK_IMPORTED_MODULE_0__);

const url = path => flarum_common_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute('apiUrl') + '/gauntlet' + path;
function call(method, path, body, params) {
  return flarum_common_app__WEBPACK_IMPORTED_MODULE_0___default().request({
    method,
    url: url(path),
    body,
    params
  });
}
const api = {
  list: function (filter, page) {
    if (page === void 0) {
      page = 1;
    }
    return call('GET', '/tournaments', undefined, {
      filter,
      page
    });
  },
  show: id => call('GET', `/tournaments/${id}`),
  save: (data, id) => call(id ? 'PATCH' : 'POST', id ? `/tournaments/${id}` : '/tournaments', data),
  remove: id => call('DELETE', `/tournaments/${id}`),
  act: (id, action) => call('POST', `/tournaments/${id}/${action}`),
  signUp: function (id, data) {
    if (data === void 0) {
      data = {};
    }
    return call('POST', `/tournaments/${id}/entrants`, data);
  },
  updateEntrant: (id, data) => call('PATCH', `/entrants/${id}`, data),
  withdraw: function (id, disqualify) {
    if (disqualify === void 0) {
      disqualify = false;
    }
    return call('DELETE', `/entrants/${id}`, undefined, disqualify ? {
      disqualify: 1
    } : undefined);
  },
  checkIn: function (id, undo) {
    if (undo === void 0) {
      undo = false;
    }
    return call(undo ? 'DELETE' : 'POST', `/entrants/${id}/checkin`);
  },
  join: id => call('POST', `/entrants/${id}/members`),
  leave: (id, userId) => call('DELETE', `/entrants/${id}/members/${userId}`),
  report: (id, score1, score2) => call('POST', `/matches/${id}/report`, {
    score1,
    score2
  }),
  resolve: (id, data) => call('POST', `/matches/${id}/resolve`, data),
  updateMatch: (id, data) => call('PATCH', `/matches/${id}`, data),
  matchDiscussion: id => call('POST', `/matches/${id}/discussion`),
  predict: (id, picks, tiebreaker) => call('PUT', `/tournaments/${id}/prediction`, {
    picks,
    tiebreaker
  }),
  board: function (id, page) {
    if (page === void 0) {
      page = 1;
    }
    return call('GET', `/tournaments/${id}/predictions`, undefined, {
      page
    });
  },
  history: userId => call('GET', `/users/${userId}`),
  picksTeams: q => call('GET', '/picks/teams', undefined, {
    q
  }),
  picksGames: (a, b) => call('GET', '/picks/games', undefined, {
    a,
    b
  })
};

/** "/tournaments/12-spring-cup" */
function tournamentUrl(t) {
  return flarum_common_app__WEBPACK_IMPORTED_MODULE_0___default().route('gauntlet.tournament', {
    id: t.id + (t.slug ? '-' + t.slug : '')
  });
}
const t = function (key, params) {
  if (params === void 0) {
    params = {};
  }
  return flarum_common_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans(`ernestdefoe-gauntlet.forum.${key}`, params);
};
flarum.reg.add('ernestdefoe-gauntlet', 'common/api', { call: call,api: api,tournamentUrl: tournamentUrl,t: t, });

/***/ },

/***/ "./src/forum/pages/EditorPage.tsx"
/*!****************************************!*\
  !*** ./src/forum/pages/EditorPage.tsx ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EditorPage)
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_components_Page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/components/Page */ "flarum/common/components/Page");
/* harmony import */ var flarum_common_components_Page__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Page__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_components_PageStructure__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/components/PageStructure */ "flarum/forum/components/PageStructure");
/* harmony import */ var flarum_forum_components_PageStructure__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_PageStructure__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_forum_components_IndexSidebar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/forum/components/IndexSidebar */ "flarum/forum/components/IndexSidebar");
/* harmony import */ var flarum_forum_components_IndexSidebar__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_IndexSidebar__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/components/Switch */ "flarum/common/components/Switch");
/* harmony import */ var flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/utils/extractText */ "flarum/common/utils/extractText");
/* harmony import */ var flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _common_api__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../common/api */ "./src/common/api.ts");
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../styles */ "./src/forum/styles.ts");









const DEFAULTS = {
  title: '',
  game: '',
  description: '',
  format: 'single',
  entryMode: 'members',
  entryType: 'solo',
  teamSize: 2,
  maxEntrants: 16,
  waitlist: true,
  startsAt: '',
  registrationClosesAt: '',
  checkinMinutes: 0,
  seeding: 'random',
  bestOf: 1,
  thirdPlace: false,
  grandFinalReset: true,
  swissRounds: 0,
  allowDraws: false,
  confirmation: 'agree',
  matchDiscussions: false,
  tagId: '',
  predictions: false,
  predictionsLockAt: '',
  predictionPoints: '',
  rewardPoints: ['', '', ''],
  rewardBadgeId: ''
};

/** /tournaments/new and /tournaments/:id/edit — the organiser's form. */
class EditorPage extends (flarum_common_components_Page__WEBPACK_IMPORTED_MODULE_1___default()) {
  id = null;
  values = {
    ...DEFAULTS,
    rewardPoints: ['', '', '']
  };
  status = 'draft';
  loading = false;
  saving = false;
  badges = [];
  oninit(vnode) {
    super.oninit(vnode);
    (0,_styles__WEBPACK_IMPORTED_MODULE_8__["default"])();
    this.id = m.route.param('id') ? parseInt(String(m.route.param('id')), 10) : null;
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().setTitle(flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_6___default()((0,_common_api__WEBPACK_IMPORTED_MODULE_7__.t)(this.id ? 'editor.edit_title' : 'editor.new_title')));
    if (this.id) {
      this.loading = true;
      _common_api__WEBPACK_IMPORTED_MODULE_7__.api.show(this.id).then(_ref => {
        let {
          data
        } = _ref;
        this.status = data.status;
        this.values = {
          ...DEFAULTS,
          ...Object.fromEntries(Object.keys(DEFAULTS).map(k => [k, data[k] ?? DEFAULTS[k]])),
          startsAt: toLocal(data.startsAt),
          registrationClosesAt: toLocal(data.registrationClosesAt),
          predictionsLockAt: toLocal(data.predictionsLockAt),
          predictionPoints: (data.predictionPoints || []).join(', '),
          rewardPoints: [0, 1, 2].map(i => data.rewardPoints?.[i] ? String(data.rewardPoints[i]) : ''),
          rewardBadgeId: data.rewardBadgeId ? String(data.rewardBadgeId) : '',
          tagId: data.tagId ? String(data.tagId) : '',
          description: data.description || ''
        };
        this.loading = false;
        m.redraw();
      });
    }

    // FoF Badges may not be installed: a quiet miss, not an error alert.
    if (flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute('canRewardTournaments')) {
      flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().request({
        method: 'GET',
        url: flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute('apiUrl') + '/badges',
        errorHandler: () => {}
      }).then(res => {
        this.badges = res.data.map(b => ({
          id: b.id,
          name: b.attributes.name
        }));
        m.redraw();
      }).catch(() => {});
    }
  }
  started() {
    return ['running', 'finished', 'cancelled'].includes(this.status);
  }
  view() {
    return m((flarum_forum_components_PageStructure__WEBPACK_IMPORTED_MODULE_2___default()), {
      className: "Gauntlet GauntletEditor",
      sidebar: () => m((flarum_forum_components_IndexSidebar__WEBPACK_IMPORTED_MODULE_3___default()), null),
      loading: this.loading
    }, m("h2", null, (0,_common_api__WEBPACK_IMPORTED_MODULE_7__.t)(this.id ? 'editor.edit_title' : 'editor.new_title')), m("form", {
      className: "Gauntlet-form",
      onsubmit: e => this.submit(e)
    }, this.basics(), this.shape(), this.entry(), this.play(), this.values.format === 'single' && this.values.entryMode === 'staff' ? this.predictionFields() : null, flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute('canRewardTournaments') ? this.rewards() : null, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
      type: "submit",
      className: "Button Button--primary",
      loading: this.saving
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_7__.t)(this.id ? 'editor.save' : 'editor.create'))));
  }
  input(key, type, attrs) {
    if (type === void 0) {
      type = 'text';
    }
    if (attrs === void 0) {
      attrs = {};
    }
    return m("div", {
      className: "Form-group"
    }, m("label", {
      htmlFor: 'gauntlet-' + key
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_7__.t)('editor.fields.' + key)), m("input", Object.assign({
      id: 'gauntlet-' + key,
      className: "FormControl",
      type: type,
      value: this.values[key],
      oninput: e => this.values[key] = e.target.value
    }, attrs)));
  }
  select(key, options, disabled) {
    if (disabled === void 0) {
      disabled = false;
    }
    return m("div", {
      className: "Form-group"
    }, m("label", {
      htmlFor: 'gauntlet-' + key
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_7__.t)('editor.fields.' + key)), m("select", {
      id: 'gauntlet-' + key,
      className: "FormControl",
      disabled: disabled,
      onchange: e => this.values[key] = e.target.value
    }, options.map(o => m("option", {
      value: o,
      selected: String(this.values[key]) === o
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_7__.t)(`editor.options.${key}.${o}`)))));
  }
  toggle(key, disabled) {
    if (disabled === void 0) {
      disabled = false;
    }
    return m("div", {
      className: "Form-group"
    }, m((flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_5___default()), {
      state: !!this.values[key],
      disabled: disabled,
      onchange: v => this.values[key] = v
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_7__.t)('editor.fields.' + key)));
  }
  basics() {
    return m("fieldset", null, m("legend", null, (0,_common_api__WEBPACK_IMPORTED_MODULE_7__.t)('editor.basics')), this.input('title', 'text', {
      maxlength: 150,
      required: true
    }), this.input('game', 'text', {
      maxlength: 80,
      placeholder: flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_6___default()((0,_common_api__WEBPACK_IMPORTED_MODULE_7__.t)('editor.game_placeholder'))
    }), m("div", {
      className: "Form-group"
    }, m("label", {
      htmlFor: "gauntlet-description"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_7__.t)('editor.fields.description')), m("textarea", {
      id: "gauntlet-description",
      className: "FormControl",
      rows: 4,
      maxlength: 5000,
      value: this.values.description,
      oninput: e => this.values.description = e.target.value
    })));
  }
  shape() {
    const locked = this.started();
    const v = this.values;
    return m("fieldset", null, m("legend", null, (0,_common_api__WEBPACK_IMPORTED_MODULE_7__.t)('editor.format')), locked ? m("p", {
      className: "helpText"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_7__.t)('editor.locked')) : null, m("div", {
      className: "Gauntlet-grid2"
    }, this.select('format', ['single', 'double', 'round_robin', 'swiss'], locked), this.select('entryMode', ['members', 'staff'], locked || this.id !== null && this.status !== 'draft')), v.format === 'single' ? this.toggle('thirdPlace', locked) : null, v.format === 'double' ? this.toggle('grandFinalReset', locked) : null, v.format === 'swiss' ? this.input('swissRounds', 'number', {
      min: 0,
      max: 20,
      disabled: locked
    }) : null, v.format === 'round_robin' || v.format === 'swiss' ? this.toggle('allowDraws', locked) : null);
  }
  entry() {
    const v = this.values;
    const locked = this.started();
    return m("fieldset", null, m("legend", null, (0,_common_api__WEBPACK_IMPORTED_MODULE_7__.t)('editor.entry')), m("div", {
      className: "Gauntlet-grid2"
    }, v.entryMode === 'members' ? this.select('entryType', ['solo', 'team'], locked) : null, v.entryMode === 'members' && v.entryType === 'team' ? this.input('teamSize', 'number', {
      min: 0,
      max: 50,
      disabled: locked
    }) : null, this.input('maxEntrants', 'number', {
      min: 0,
      max: 256,
      disabled: locked
    }), this.select('seeding', ['random', 'manual', 'rating'], locked)), v.entryMode === 'members' ? this.toggle('waitlist') : null, m("div", {
      className: "Gauntlet-grid2"
    }, this.input('startsAt', 'datetime-local'), v.entryMode === 'members' ? this.input('registrationClosesAt', 'datetime-local') : null, v.entryMode === 'members' ? this.input('checkinMinutes', 'number', {
      min: 0,
      max: 1440
    }) : null), v.entryMode === 'members' ? m("p", {
      className: "helpText"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_7__.t)('editor.checkin_help')) : null);
  }
  play() {
    const tags = flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().store.all('tags').filter(tag => tag.canStartDiscussion?.());
    return m("fieldset", null, m("legend", null, (0,_common_api__WEBPACK_IMPORTED_MODULE_7__.t)('editor.play')), m("div", {
      className: "Gauntlet-grid2"
    }, this.select('bestOf', ['1', '3', '5', '7', '9'], this.started()), this.values.entryMode === 'members' ? this.select('confirmation', ['agree', 'staff']) : null, tags.length ? m("div", {
      className: "Form-group"
    }, m("label", {
      htmlFor: "gauntlet-tagId"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_7__.t)('editor.fields.tagId')), m("select", {
      id: "gauntlet-tagId",
      className: "FormControl",
      onchange: e => this.values.tagId = e.target.value
    }, m("option", {
      value: ""
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_7__.t)('editor.no_tag')), tags.map(tag => m("option", {
      value: tag.id(),
      selected: this.values.tagId === tag.id()
    }, tag.name())))) : null), this.toggle('matchDiscussions'), m("p", {
      className: "helpText"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_7__.t)('editor.discussion_help')));
  }
  predictionFields() {
    return m("fieldset", null, m("legend", null, (0,_common_api__WEBPACK_IMPORTED_MODULE_7__.t)('editor.predictions')), this.toggle('predictions', this.started()), this.values.predictions ? m("div", {
      className: "Gauntlet-grid2"
    }, this.input('predictionsLockAt', 'datetime-local'), this.input('predictionPoints', 'text', {
      placeholder: '10, 20, 40, 80'
    })) : null, m("p", {
      className: "helpText"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_7__.t)('editor.predictions_help')));
  }
  rewards() {
    return m("fieldset", null, m("legend", null, (0,_common_api__WEBPACK_IMPORTED_MODULE_7__.t)('editor.rewards')), m("div", {
      className: "Gauntlet-grid2"
    }, [0, 1, 2].map(i => m("div", {
      className: "Form-group"
    }, m("label", {
      htmlFor: 'gauntlet-reward' + i
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_7__.t)('editor.reward_place', {
      place: i + 1
    })), m("input", {
      id: 'gauntlet-reward' + i,
      className: "FormControl",
      type: "number",
      min: "0",
      value: this.values.rewardPoints[i],
      oninput: e => this.values.rewardPoints[i] = e.target.value
    }))), this.badges.length ? m("div", {
      className: "Form-group"
    }, m("label", {
      htmlFor: "gauntlet-badge"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_7__.t)('editor.fields.rewardBadgeId')), m("select", {
      id: "gauntlet-badge",
      className: "FormControl",
      onchange: e => this.values.rewardBadgeId = e.target.value
    }, m("option", {
      value: ""
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_7__.t)('editor.no_badge')), this.badges.map(b => m("option", {
      value: b.id,
      selected: this.values.rewardBadgeId === b.id
    }, b.name)))) : null), m("p", {
      className: "helpText"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_7__.t)('editor.rewards_help')));
  }
  submit(e) {
    e.preventDefault();
    const v = this.values;
    const data = {
      title: v.title,
      game: v.game,
      description: v.description,
      waitlist: !!v.waitlist,
      startsAt: fromLocal(v.startsAt),
      registrationClosesAt: fromLocal(v.registrationClosesAt),
      checkinMinutes: Number(v.checkinMinutes) || 0,
      confirmation: v.confirmation,
      matchDiscussions: !!v.matchDiscussions,
      tagId: v.tagId || null
    };
    if (!this.started()) {
      Object.assign(data, {
        format: v.format,
        entryMode: v.entryMode,
        entryType: v.entryMode === 'staff' ? 'solo' : v.entryType,
        teamSize: Number(v.teamSize) || 0,
        maxEntrants: Number(v.maxEntrants) || 0,
        seeding: v.seeding,
        bestOf: Number(v.bestOf) || 1,
        thirdPlace: !!v.thirdPlace,
        grandFinalReset: !!v.grandFinalReset,
        swissRounds: Number(v.swissRounds) || 0,
        allowDraws: !!v.allowDraws,
        predictions: v.format === 'single' && v.entryMode === 'staff' && !!v.predictions
      });
    }
    if (data.predictions || v.predictions) {
      data.predictionsLockAt = fromLocal(v.predictionsLockAt);
      data.predictionPoints = String(v.predictionPoints).split(/[,\s]+/).filter(Boolean).map(Number);
    }
    if (flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute('canRewardTournaments')) {
      data.rewardPoints = v.rewardPoints.map(p => Number(p) || 0);
      data.rewardBadgeId = v.rewardBadgeId || null;
    }
    this.saving = true;
    _common_api__WEBPACK_IMPORTED_MODULE_7__.api.save(data, this.id ?? undefined).then(_ref2 => {
      let {
        data: saved
      } = _ref2;
      return m.route.set((0,_common_api__WEBPACK_IMPORTED_MODULE_7__.tournamentUrl)(saved));
    }, () => {
      this.saving = false;
      m.redraw();
    });
  }
}
function toLocal(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fromLocal(value) {
  return value ? new Date(value).toISOString() : null;
}
flarum.reg.add('ernestdefoe-gauntlet', 'forum/pages/EditorPage', EditorPage);

/***/ },

/***/ "./src/forum/styles.ts"
/*!*****************************!*\
  !*** ./src/forum/styles.ts ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ injectStyles)
/* harmony export */ });
/*
 * Gauntlet's styles live in its lazy chunk, not in forum.css: every page of
 * the forum loads forum.css, and only tournament pages need these. Colours
 * come from Flarum's own custom properties, so themes and dark mode apply.
 */
const css = `
.Gauntlet{--g-accent:var(--primary-color);--g-line:var(--control-bg);--g-ok:#2f9e44;--g-bad:#e03131}
.Gauntlet-head{margin-bottom:16px}
.Gauntlet-head h2{margin:0 0 4px;font-size:22px}
.Gauntlet-meta{color:var(--muted-color);font-size:13px;display:flex;flex-wrap:wrap;gap:4px 12px;margin:0;padding:0;list-style:none}
.Gauntlet-meta .icon{margin-right:4px}
.Gauntlet-description{white-space:pre-line;margin:12px 0}
.Gauntlet-actions{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}
.Gauntlet-tabs{display:flex;gap:4px;border-bottom:1px solid var(--g-line);margin:16px 0;overflow-x:auto;scrollbar-width:none}
.Gauntlet-tabs .Button{border-radius:0;border-bottom:2px solid transparent;flex-shrink:0}
.Gauntlet-tabs .Button.active{border-bottom-color:var(--g-accent);color:var(--text-color);font-weight:600}
.Gauntlet-notice{background:var(--control-bg);border-radius:var(--border-radius);padding:10px 14px;margin:12px 0}
.Gauntlet-notice.is-warn{background:var(--control-warning-bg);color:var(--control-warning-color)}
.Gauntlet-bracketSection{margin-bottom:24px}
.Gauntlet-sectionTitle{font-size:15px;margin:0 0 6px}
.Gauntlet-roundChips{display:flex;gap:4px;overflow-x:auto;scrollbar-width:none;margin-bottom:4px}
.Gauntlet-chip{flex-shrink:0;font-size:12px;padding:4px 10px;border-radius:999px;background:var(--control-bg)}
.Gauntlet-bracketScroll{overflow-x:auto;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain;padding-bottom:8px}
.Gauntlet-svg{display:block;font-size:13px;font-family:inherit}
.Gauntlet-colTitle{fill:var(--muted-color);font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em}
.Gauntlet-line{fill:none;stroke:var(--g-line);stroke-width:2}
.Gauntlet-line.is-done{stroke:var(--muted-color-light,var(--muted-color))}
.Gauntlet-boxBg{fill:var(--body-bg);stroke:var(--g-line);stroke-width:1.5}
.Gauntlet-boxDivider{stroke:var(--g-line)}
.Gauntlet-rowBg{fill:transparent}
.Gauntlet-match.is-open .Gauntlet-boxBg,.Gauntlet-match.is-reported .Gauntlet-boxBg,.Gauntlet-match.is-awaiting .Gauntlet-boxBg{stroke:var(--g-accent)}
.Gauntlet-match.is-disputed .Gauntlet-boxBg,.Gauntlet-match.is-live .Gauntlet-boxBg{stroke:var(--g-bad)}
.Gauntlet-match.is-bye{opacity:.55}
.Gauntlet-match.is-clickable,.Gauntlet-row.is-pickable{cursor:pointer}
.Gauntlet-match.is-clickable:hover .Gauntlet-boxBg,.Gauntlet-match:focus-visible .Gauntlet-boxBg{stroke:var(--g-accent);stroke-width:2.5}
.Gauntlet-match:focus,.Gauntlet-row:focus{outline:none}
.Gauntlet-row.is-pickable:hover .Gauntlet-rowBg,.Gauntlet-row:focus-visible .Gauntlet-rowBg{fill:var(--control-bg)}
.Gauntlet-row.is-picked .Gauntlet-rowBg{fill:color-mix(in srgb,var(--g-accent) 18%,transparent)}
.Gauntlet-row.is-right .Gauntlet-rowBg{fill:color-mix(in srgb,var(--g-ok) 18%,transparent)}
.Gauntlet-row.is-wrong .Gauntlet-name{text-decoration:line-through;fill:var(--muted-color)}
.Gauntlet-name{fill:var(--text-color)}
.Gauntlet-row.is-won .Gauntlet-name,.Gauntlet-row.is-won .Gauntlet-score{font-weight:700}
.Gauntlet-row.is-lost .Gauntlet-name,.Gauntlet-row.is-lost .Gauntlet-score{fill:var(--muted-color)}
.Gauntlet-name.is-tbd{fill:var(--muted-color);font-style:italic}
.Gauntlet-row.is-guess .Gauntlet-name{font-style:italic;fill:var(--muted-color)}
.Gauntlet-row.is-picked.is-guess .Gauntlet-name{fill:var(--text-color)}
.Gauntlet-seed{fill:var(--muted-color);font-size:11px}
.Gauntlet-score{fill:var(--text-color);font-variant-numeric:tabular-nums}
.Gauntlet-verdict.is-right{fill:var(--g-ok);font-weight:700}
.Gauntlet-verdict.is-wrong{fill:var(--g-bad);font-weight:700}
.Gauntlet-initial{fill:#fff;font-size:11px;font-weight:700}
.Gauntlet-live,.Gauntlet-flag{fill:var(--g-bad);font-size:10px;font-weight:700;text-transform:uppercase}
.Gauntlet-table{width:100%;border-collapse:collapse;font-size:14px}
.Gauntlet-table th{text-align:left;color:var(--muted-color);font-weight:600;font-size:12px;padding:6px 8px;border-bottom:1px solid var(--g-line)}
.Gauntlet-table td{padding:8px;border-bottom:1px solid var(--g-line);vertical-align:middle}
.Gauntlet-table .num{text-align:right;font-variant-numeric:tabular-nums}
.Gauntlet-tableWrap{overflow-x:auto}
.Gauntlet-person{display:inline-flex;align-items:center;gap:8px;min-width:0}
.Gauntlet-person .Avatar{--size:24px;flex-shrink:0}
.Gauntlet-person img.Gauntlet-teamLogo{width:24px;height:24px;object-fit:contain;flex-shrink:0}
.Gauntlet-roster{color:var(--muted-color);font-size:12px;margin-top:2px}
.Gauntlet-pill{display:inline-block;font-size:11px;font-weight:600;padding:1px 8px;border-radius:999px;background:var(--control-bg);color:var(--control-color);white-space:nowrap}
.Gauntlet-pill.is-registration,.Gauntlet-pill.is-open{background:var(--control-success-bg);color:var(--control-success-color)}
.Gauntlet-pill.is-running,.Gauntlet-pill.is-reported,.Gauntlet-pill.is-awaiting{background:color-mix(in srgb,var(--g-accent) 18%,transparent);color:var(--text-color)}
.Gauntlet-pill.is-disputed,.Gauntlet-pill.is-cancelled{background:var(--control-danger-bg);color:var(--control-danger-color)}
.Gauntlet-list{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.Gauntlet-card{display:block;border:1px solid var(--g-line);border-radius:var(--border-radius);padding:12px 14px;color:inherit}
.Gauntlet-card:hover{text-decoration:none;border-color:var(--g-accent)}
.Gauntlet-card h3{margin:0 0 4px;font-size:16px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.Gauntlet-matches{display:grid;gap:8px;grid-template-columns:repeat(auto-fill,minmax(260px,1fr))}
.Gauntlet-matchCard{border:1px solid var(--g-line);border-radius:var(--border-radius);padding:8px 10px;cursor:pointer;background:var(--body-bg);text-align:left;width:100%;color:inherit;font:inherit}
.Gauntlet-matchCard:hover,.Gauntlet-matchCard:focus-visible{border-color:var(--g-accent)}
.Gauntlet-matchCard .side{display:flex;justify-content:space-between;gap:8px;padding:2px 0}
.Gauntlet-matchCard .side.is-won{font-weight:700}
.Gauntlet-matchCard .side.is-lost{color:var(--muted-color)}
.Gauntlet-matchCard header{display:flex;justify-content:space-between;color:var(--muted-color);font-size:12px;margin-bottom:4px}
.Gauntlet-roundTitle{font-size:14px;margin:16px 0 8px;color:var(--muted-color)}
.Gauntlet-scoreForm{display:flex;align-items:center;gap:8px;margin:12px 0}
.Gauntlet-scoreForm .FormControl{width:80px;text-align:center}
.Gauntlet-scoreForm label{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.Gauntlet-form fieldset{border:0;padding:0;margin:0 0 20px}
.Gauntlet-form legend{font-weight:700;margin-bottom:8px;font-size:15px}
.Gauntlet-form .Form-group{margin-bottom:12px}
.Gauntlet-grid2{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
.Gauntlet-search{position:relative}
.Gauntlet-searchResults{list-style:none;margin:4px 0 0;padding:0;border:1px solid var(--g-line);border-radius:var(--border-radius);max-height:240px;overflow:auto}
.Gauntlet-searchResults button{display:flex;gap:8px;align-items:center;width:100%;padding:6px 10px;border:0;background:none;color:inherit;text-align:left;cursor:pointer}
.Gauntlet-searchResults button:hover{background:var(--control-bg)}
.Gauntlet-searchResults img{width:20px;height:20px;object-fit:contain}
.Gauntlet-board .is-me td{background:color-mix(in srgb,var(--g-accent) 10%,transparent)}
.Gauntlet-stats{display:grid;gap:10px;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));margin-bottom:16px}
.Gauntlet-stat{border:1px solid var(--g-line);border-radius:var(--border-radius);padding:10px 12px}
.Gauntlet-stat strong{display:block;font-size:20px}
.Gauntlet-stat span{color:var(--muted-color);font-size:12px}
@media (min-width:768px){.Gauntlet-roundChips{display:none}}
@media (max-width:767px){.Gauntlet-head h2{font-size:19px}.Gauntlet-table .hide-phone{display:none}}
`;
let injected = false;
function injectStyles() {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const style = document.createElement('style');
  style.id = 'gauntlet-styles';
  style.textContent = css;
  document.head.appendChild(style);
}

/***/ }

}]);
//# sourceMappingURL=EditorPage.js.map