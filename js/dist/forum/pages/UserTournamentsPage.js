"use strict";
(self["webpackChunk_ernestdefoe_gauntlet"] = self["webpackChunk_ernestdefoe_gauntlet"] || []).push([["ernestdefoe-gauntlet:forum/pages/UserTournamentsPage"],{

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

/***/ "./src/forum/components/bits.tsx"
/*!***************************************!*\
  !*** ./src/forum/components/bits.tsx ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatDate: () => (/* binding */ formatDate),
/* harmony export */   hue: () => (/* binding */ hue),
/* harmony export */   personAvatar: () => (/* binding */ personAvatar),
/* harmony export */   pill: () => (/* binding */ pill)
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _common_api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/api */ "./src/common/api.ts");


function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.getLocale() || undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}
function pill(status) {
  return m("span", {
    className: 'Gauntlet-pill is-' + status
  }, (0,_common_api__WEBPACK_IMPORTED_MODULE_1__.t)('status.' + status));
}

/** An avatar from a plain person record (not a store model), or their initial. */
function personAvatar(person) {
  if (person.avatarUrl) return m("img", {
    className: "Avatar",
    src: person.avatarUrl,
    alt: "",
    loading: "lazy",
    decoding: "async"
  });
  const name = person.displayName || '?';
  return m("span", {
    className: "Avatar",
    style: {
      '--avatar-bg': hue(name),
      color: '#fff'
    }
  }, name.charAt(0).toUpperCase());
}

/** A stable colour per name, for marks with no picture. */
function hue(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return `hsl(${h} 45% 45%)`;
}
flarum.reg.add('ernestdefoe-gauntlet', 'forum/components/bits', { formatDate: formatDate,pill: pill,personAvatar: personAvatar,hue: hue, });

/***/ },

/***/ "./src/forum/pages/UserTournamentsPage.tsx"
/*!*************************************************!*\
  !*** ./src/forum/pages/UserTournamentsPage.tsx ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UserTournamentsPage)
/* harmony export */ });
/* harmony import */ var flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/components/UserPage */ "flarum/forum/components/UserPage");
/* harmony import */ var flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/components/Link */ "flarum/common/components/Link");
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/LoadingIndicator */ "flarum/common/components/LoadingIndicator");
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _common_api__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../common/api */ "./src/common/api.ts");
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../styles */ "./src/forum/styles.ts");
/* harmony import */ var _components_bits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/bits */ "./src/forum/components/bits.tsx");







/** /u/:username/tournaments — placings, prediction brackets and ratings. */
class UserTournamentsPage extends (flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_0___default()) {
  history = null;
  oninit(vnode) {
    super.oninit(vnode);
    (0,_styles__WEBPACK_IMPORTED_MODULE_4__["default"])();
    this.loadUser(m.route.param('username'));
  }
  show(user) {
    super.show(user);
    _common_api__WEBPACK_IMPORTED_MODULE_3__.api.history(user.id()).then(_ref => {
      let {
        data
      } = _ref;
      this.history = data;
      m.redraw();
    });
  }
  content() {
    const h = this.history;
    if (!h) return m((flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_2___default()), {
      display: "block"
    });
    const won = h.entries.filter(e => e.finalRank === 1).length;
    const podium = h.entries.filter(e => e.finalRank !== null && e.finalRank <= 3).length;
    if (!h.entries.length && !h.predictions.length) return m("div", {
      className: "Gauntlet"
    }, m("p", {
      className: "Gauntlet-notice"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('profile.empty')));
    return m("div", {
      className: "Gauntlet"
    }, m("div", {
      className: "Gauntlet-stats"
    }, m("div", {
      className: "Gauntlet-stat"
    }, m("strong", null, h.entries.length), m("span", null, (0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('profile.entered'))), m("div", {
      className: "Gauntlet-stat"
    }, m("strong", null, won), m("span", null, (0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('profile.won'))), m("div", {
      className: "Gauntlet-stat"
    }, m("strong", null, podium), m("span", null, (0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('profile.podium'))), h.ratings.slice(0, 3).map(r => m("div", {
      className: "Gauntlet-stat"
    }, m("strong", null, r.rating), m("span", null, (0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('profile.rating', {
      game: r.game || (0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('profile.any_game')
    }))))), h.entries.length ? m("div", {
      className: "Gauntlet-tableWrap"
    }, m("table", {
      className: "Gauntlet-table"
    }, m("thead", null, m("tr", null, m("th", null, (0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('profile.tournament')), m("th", {
      className: "num"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('entrants.place')), m("th", {
      className: "num hide-phone"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('standings.record')))), m("tbody", null, h.entries.map(e => m("tr", null, m("td", null, m((flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_1___default()), {
      href: (0,_common_api__WEBPACK_IMPORTED_MODULE_3__.tournamentUrl)(e)
    }, e.title), " ", e.status !== 'finished' ? (0,_components_bits__WEBPACK_IMPORTED_MODULE_5__.pill)(e.status) : null, e.name ? m("div", {
      className: "Gauntlet-roster"
    }, e.name) : null), m("td", {
      className: "num"
    }, e.finalRank ? (0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('profile.place_of', {
      place: e.finalRank,
      count: e.entrantCount
    }) : '–'), m("td", {
      className: "num hide-phone"
    }, `${e.wins}–${e.draws}–${e.losses}`)))))) : null, h.predictions.length ? m("div", {
      className: "Gauntlet-tableWrap"
    }, m("h3", {
      className: "Gauntlet-roundTitle"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('profile.predictions')), m("table", {
      className: "Gauntlet-table"
    }, m("thead", null, m("tr", null, m("th", null, (0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('profile.tournament')), m("th", {
      className: "num"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('predict.points')), m("th", {
      className: "num"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('entrants.place')))), m("tbody", null, h.predictions.map(p => m("tr", null, m("td", null, m((flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_1___default()), {
      href: (0,_common_api__WEBPACK_IMPORTED_MODULE_3__.tournamentUrl)(p)
    }, p.title)), m("td", {
      className: "num"
    }, p.score), m("td", {
      className: "num"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('profile.place_of', {
      place: p.place,
      count: p.count
    }))))))) : null);
  }
}
flarum.reg.add('ernestdefoe-gauntlet', 'forum/pages/UserTournamentsPage', UserTournamentsPage);

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
//# sourceMappingURL=UserTournamentsPage.js.map