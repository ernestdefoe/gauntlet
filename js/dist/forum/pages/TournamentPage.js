"use strict";
(self["webpackChunk_ernestdefoe_gauntlet"] = self["webpackChunk_ernestdefoe_gauntlet"] || []).push([["ernestdefoe-gauntlet:forum/pages/TournamentPage"],{

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

/***/ "./src/forum/bracket/layout.ts"
/*!*************************************!*\
  !*** ./src/forum/bracket/layout.ts ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BOX_H: () => (/* binding */ BOX_H),
/* harmony export */   BOX_W: () => (/* binding */ BOX_W),
/* harmony export */   COL_GAP: () => (/* binding */ COL_GAP),
/* harmony export */   HEAD_H: () => (/* binding */ HEAD_H),
/* harmony export */   ROW_GAP: () => (/* binding */ ROW_GAP),
/* harmony export */   ROW_H: () => (/* binding */ ROW_H),
/* harmony export */   candidates: () => (/* binding */ candidates),
/* harmony export */   feeders: () => (/* binding */ feeders),
/* harmony export */   layout: () => (/* binding */ layout),
/* harmony export */   maxRound: () => (/* binding */ maxRound),
/* harmony export */   prune: () => (/* binding */ prune)
/* harmony export */ });
/** Box and spacing sizes, in SVG pixels. The SVG is never scaled down: it scrolls. */
const BOX_W = 196;
const ROW_H = 26;
const BOX_H = ROW_H * 2;
const COL_GAP = 40;
const ROW_GAP = 18;
const HEAD_H = 28;
/** Which match feeds each slot, from the links the server sends with every match. */
function feeders(t) {
  const into = new Map();
  for (const m of t.matches) {
    for (const route of ['next', 'loser']) {
      const link = m[route];
      if (!link) continue;
      if (!into.has(link[0])) into.set(link[0], new Map());
      into.get(link[0]).set(link[1], {
        from: m,
        route
      });
    }
  }
  return into;
}
function maxRound(t, bracket) {
  return t.matches.reduce((max, m) => m.bracket === bracket ? Math.max(max, m.round) : max, 0);
}

/**
 * Lay a bracket out as columns of boxes. Leaves (matches nothing in the same
 * section feeds) stack top to bottom; every other match sits level with the
 * middle of the matches that feed it — which also centres a losers-bracket
 * drop-in round on the round before it. Void matches (no one will play) are
 * left out; byes keep their place, so the tree stays a tree.
 */
function layout(t, titleFor, sectionTitle) {
  const into = feeders(t);
  const sections = [];
  const keys = t.format === 'double' ? ['W', 'L', 'F'] : ['W'];
  for (const key of keys) {
    const brackets = key === 'W' && t.format === 'single' ? ['W', 'P'] : [key];
    const matches = t.matches.filter(m => brackets.includes(m.bracket));
    if (!matches.length) continue;
    const rounds = maxRound(t, key);
    const centre = new Map();
    let leaf = 0;
    const placed = [];
    const sorted = [...matches].sort((a, b) => a.round - b.round || (a.bracket === 'P' ? 1 : 0) - (b.bracket === 'P' ? 1 : 0) || a.position - b.position);
    for (const m of sorted) {
      if (m.status === 'void' && !(m.bracket === 'F' && m.round === 2)) continue;
      const column = m.bracket === 'F' ? m.round - 1 : m.round - 1;
      let y;
      const fed = [...(into.get(m.key)?.values() ?? [])].filter(f => f.route === 'next' && brackets.includes(f.from.bracket) && centre.has(f.from.key));
      if (m.bracket === 'P') {
        // Third place sits under the final.
        const final = centre.get(`W:${rounds}:1`) ?? 0;
        y = final + BOX_H + ROW_GAP * 2;
      } else if (m.bracket === 'F' && m.round === 2) {
        y = centre.get('F:1:1') ?? 0;
      } else if (fed.length) {
        y = fed.reduce((sum, f) => sum + centre.get(f.from.key), 0) / fed.length;
      } else {
        y = leaf * (BOX_H + ROW_GAP) + BOX_H / 2;
        leaf++;
      }
      centre.set(m.key, y);
      placed.push({
        match: m,
        x: column * (BOX_W + COL_GAP),
        y: y - BOX_H / 2 + HEAD_H,
        column
      });
    }
    if (!placed.length) continue;
    const columns = [];
    const columnCount = Math.max(...placed.map(p => p.column)) + 1;
    for (let c = 0; c < columnCount; c++) {
      columns.push({
        title: key === 'F' ? titleFor('F', c + 1, rounds) : titleFor(key, c + 1, rounds),
        x: c * (BOX_W + COL_GAP)
      });
    }
    const top = Math.min(...placed.map(p => p.y));
    if (top < HEAD_H) placed.forEach(p => p.y += HEAD_H - top);
    sections.push({
      key,
      title: sectionTitle(key),
      columns,
      placed,
      width: columnCount * (BOX_W + COL_GAP) - COL_GAP,
      height: Math.max(...placed.map(p => p.y)) + BOX_H + 4
    });
  }
  return sections;
}

/**
 * Who a member could have in a match, by their own picks so far — the same
 * rule the server checks: a slot fed by a match that needs a pick holds that
 * pick (or, for third place, the side they didn't pick); otherwise whoever is
 * actually in it.
 */
function candidates(t, m, picks, into) {
  if (into === void 0) {
    into = feeders(t);
  }
  if (m.status === 'bye' || m.status === 'void') return [];
  const out = [];
  for (const slot of [1, 2]) {
    const feed = into.get(m.key)?.get(slot);
    const actual = slot === 1 ? m.entrant1Id : m.entrant2Id;
    if (!feed || feed.from.status === 'bye' || feed.from.status === 'void') {
      if (actual) out.push(actual);
      continue;
    }
    const picked = picks[feed.from.key];
    if (!picked) continue;
    if (feed.route === 'next') out.push(picked);else {
      const other = candidates(t, feed.from, picks, into).filter(id => id !== picked);
      if (other.length === 1) out.push(other[0]);
    }
  }
  return out;
}

/** Drop picks that no longer fit after an earlier pick changed. */
function prune(t, picks) {
  const into = feeders(t);
  const clean = {};
  const order = [...t.matches].sort((a, b) => (a.bracket === 'P' ? 1 : 0) - (b.bracket === 'P' ? 1 : 0) || a.round - b.round || a.position - b.position);
  for (const m of order) {
    const pick = picks[m.key];
    if (pick && candidates(t, m, clean, into).includes(pick)) clean[m.key] = pick;
  }
  return clean;
}
flarum.reg.add('ernestdefoe-gauntlet', 'forum/bracket/layout', { BOX_W: BOX_W,ROW_H: ROW_H,BOX_H: BOX_H,COL_GAP: COL_GAP,ROW_GAP: ROW_GAP,HEAD_H: HEAD_H,feeders: feeders,maxRound: maxRound,layout: layout,candidates: candidates,prune: prune, });

/***/ },

/***/ "./src/forum/components/Bracket.tsx"
/*!******************************************!*\
  !*** ./src/forum/components/Bracket.tsx ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HEAD_H: () => (/* reexport safe */ _bracket_layout__WEBPACK_IMPORTED_MODULE_5__.HEAD_H),
/* harmony export */   "default": () => (/* binding */ Bracket),
/* harmony export */   entrantName: () => (/* binding */ entrantName),
/* harmony export */   maxRound: () => (/* reexport safe */ _bracket_layout__WEBPACK_IMPORTED_MODULE_5__.maxRound),
/* harmony export */   roundTitle: () => (/* binding */ roundTitle)
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/utils/extractText */ "flarum/common/utils/extractText");
/* harmony import */ var flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _common_api__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../common/api */ "./src/common/api.ts");
/* harmony import */ var _bits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./bits */ "./src/forum/components/bits.tsx");
/* harmony import */ var _bracket_layout__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../bracket/layout */ "./src/forum/bracket/layout.ts");






const MAX_NAME = 19;
function entrantName(e) {
  if (!e) return '';
  return e.name || e.user?.displayName || extractDeleted();
}
function extractDeleted() {
  return flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('core.lib.username.deleted_text');
}
function roundTitle(tournament) {
  return (bracket, round, rounds) => {
    if (bracket === 'F') return String(round === 1 ? (0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('bracket.grand_final') : (0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('bracket.reset'));
    if (bracket === 'L') return String(round === rounds ? (0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('bracket.losers_final') : (0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('bracket.round', {
      number: round
    }));
    if (tournament.format === 'double' && round === rounds) return flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_2___default()((0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('bracket.winners_final'));
    if (round === rounds) return flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_2___default()((0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('bracket.final'));
    if (round === rounds - 1) return flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_2___default()((0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('bracket.semi_finals'));
    if (round === rounds - 2) return flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_2___default()((0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('bracket.quarter_finals'));
    return flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_2___default()((0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('bracket.round', {
      number: round
    }));
  };
}

/**
 * The bracket as SVG, at its natural size inside a scroller: on a phone it
 * pans sideways rather than shrinking text to nothing, and the round chips
 * above jump to a column.
 */
class Bracket extends (flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default()) {
  scroller = null;
  view() {
    const tournament = this.attrs.tournament;
    const sections = (0,_bracket_layout__WEBPACK_IMPORTED_MODULE_5__.layout)(tournament, roundTitle(tournament), key => tournament.format === 'double' ? flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_2___default()((0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)(`bracket.section_${key}`)) : null);
    const entrants = new Map(tournament.entrants.map(e => [e.id, e]));
    const into = this.attrs.picks ? (0,_bracket_layout__WEBPACK_IMPORTED_MODULE_5__.feeders)(tournament) : null;
    return m("div", {
      className: "Gauntlet-bracket"
    }, sections.map(section => m("section", {
      className: "Gauntlet-bracketSection",
      key: section.key
    }, section.title ? m("h3", {
      className: "Gauntlet-sectionTitle"
    }, section.title) : null, section.columns.length > 2 ? m("div", {
      className: "Gauntlet-roundChips",
      role: "toolbar",
      "aria-label": flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_2___default()((0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('bracket.jump'))
    }, section.columns.map(col => m("button", {
      type: "button",
      className: "Button Button--text Gauntlet-chip",
      onclick: e => this.jump(e, col.x)
    }, col.title))) : null, m("div", {
      className: "Gauntlet-bracketScroll"
    }, m("svg", {
      className: "Gauntlet-svg",
      width: section.width + 2,
      height: section.height,
      viewBox: `-1 0 ${section.width + 2} ${section.height}`,
      role: "group",
      "aria-label": section.title || flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_2___default()((0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('bracket.title'))
    }, section.columns.map(col => m("text", {
      className: "Gauntlet-colTitle",
      x: col.x + _bracket_layout__WEBPACK_IMPORTED_MODULE_5__.BOX_W / 2,
      y: 16,
      "text-anchor": "middle"
    }, col.title)), this.lines(section), section.placed.map(p => this.box(p, entrants, into)))))));
  }
  jump(e, x) {
    const scroller = e.currentTarget.closest('.Gauntlet-bracketSection')?.querySelector('.Gauntlet-bracketScroll');
    scroller?.scrollTo({
      left: Math.max(0, x - 8),
      behavior: 'smooth'
    });
  }
  lines(section) {
    const at = new Map(section.placed.map(p => [p.match.key, p]));
    return section.placed.map(p => {
      const link = p.match.next;
      const target = link ? at.get(link[0]) : null;
      if (!link || !target) return null;
      const x1 = p.x + _bracket_layout__WEBPACK_IMPORTED_MODULE_5__.BOX_W;
      const y1 = p.y + _bracket_layout__WEBPACK_IMPORTED_MODULE_5__.BOX_H / 2;
      const x2 = target.x;
      const y2 = target.y + (link[1] === 1 ? _bracket_layout__WEBPACK_IMPORTED_MODULE_5__.ROW_H / 2 : _bracket_layout__WEBPACK_IMPORTED_MODULE_5__.ROW_H * 1.5);
      const mid = x1 + _bracket_layout__WEBPACK_IMPORTED_MODULE_5__.COL_GAP / 2;
      const done = p.match.winnerId !== null;
      return m("path", {
        className: 'Gauntlet-line' + (done ? ' is-done' : ''),
        d: `M${x1} ${y1} H${mid} V${y2} H${x2}`
      });
    });
  }
  box(p, entrants, into) {
    const match = p.match;
    const predicting = !!this.attrs.picks && !!into;
    const picks = this.attrs.picks || {};
    const options = predicting ? (0,_bracket_layout__WEBPACK_IMPORTED_MODULE_5__.candidates)(this.attrs.tournament, match, picks, into) : [];
    const ids = [match.entrant1Id, match.entrant2Id];
    const live = match.game && match.game.status === 'in_progress';
    const bye = match.status === 'bye';
    const clickable = !predicting && !!this.attrs.onOpen && !bye && match.status !== 'void';
    const classes = ['Gauntlet-match', `is-${match.status}`];
    if (live) classes.push('is-live');
    if (clickable) classes.push('is-clickable');
    const label = [entrantName(entrants.get(ids[0])) || '?', entrantName(entrants.get(ids[1])) || '?'].join(' – ');
    return m("g", {
      className: classes.join(' '),
      transform: `translate(${p.x} ${p.y})`,
      role: clickable ? 'button' : undefined,
      tabindex: clickable ? 0 : undefined,
      "aria-label": clickable ? label : undefined,
      onclick: clickable ? () => this.attrs.onOpen(match) : undefined,
      onkeydown: clickable ? onActivate(() => this.attrs.onOpen(match)) : undefined
    }, m("rect", {
      className: "Gauntlet-boxBg",
      width: _bracket_layout__WEBPACK_IMPORTED_MODULE_5__.BOX_W,
      height: _bracket_layout__WEBPACK_IMPORTED_MODULE_5__.BOX_H,
      rx: 5
    }), m("line", {
      className: "Gauntlet-boxDivider",
      x1: 0,
      x2: _bracket_layout__WEBPACK_IMPORTED_MODULE_5__.BOX_W,
      y1: _bracket_layout__WEBPACK_IMPORTED_MODULE_5__.ROW_H,
      y2: _bracket_layout__WEBPACK_IMPORTED_MODULE_5__.ROW_H
    }), [1, 2].map(slot => {
      const actual = ids[slot - 1];
      // In a prediction bracket an empty slot shows the member's own pick.
      const shown = actual ?? (predicting ? options[slot - 1] ?? null : null);
      const entrant = shown ? entrants.get(shown) : undefined;
      const dead = (slot === 1 ? match.dead1 : match.dead2) && !actual;
      const won = match.winnerId !== null && actual === match.winnerId;
      const lost = match.winnerId !== null && actual !== null && actual !== match.winnerId;
      const score = live ? this.liveScore(match, entrant) : slot === 1 ? match.score1 : match.score2;
      const picked = predicting && shown !== null && picks[match.key] === shown;
      const canPick = predicting && shown !== null && options.includes(shown) && this.attrs.onPick && match.status !== 'completed';
      const verdict = predicting && match.status === 'completed' && picks[match.key] && shown === picks[match.key] ? match.winnerId === shown ? 'right' : 'wrong' : null;
      const row = ['Gauntlet-row'];
      if (won) row.push('is-won');
      if (lost) row.push('is-lost');
      if (!actual && shown) row.push('is-guess');
      if (picked) row.push('is-picked');
      if (verdict) row.push('is-' + verdict);
      if (canPick) row.push('is-pickable');
      const y = (slot - 1) * _bracket_layout__WEBPACK_IMPORTED_MODULE_5__.ROW_H;
      return m("g", {
        className: row.join(' '),
        role: canPick ? 'button' : undefined,
        tabindex: canPick ? 0 : undefined,
        "aria-pressed": canPick ? String(picked) : undefined,
        "aria-label": canPick ? flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_2___default()((0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('predict.pick_label', {
          name: entrantName(entrant)
        })) : undefined,
        onclick: canPick ? () => this.attrs.onPick(match.key, shown) : undefined,
        onkeydown: canPick ? onActivate(() => this.attrs.onPick(match.key, shown)) : undefined
      }, m("rect", {
        className: "Gauntlet-rowBg",
        y: y,
        width: _bracket_layout__WEBPACK_IMPORTED_MODULE_5__.BOX_W,
        height: _bracket_layout__WEBPACK_IMPORTED_MODULE_5__.ROW_H,
        rx: slot === 1 ? 5 : 0
      }), entrant?.seed ? m("text", {
        className: "Gauntlet-seed",
        x: 14,
        y: y + 17,
        "text-anchor": "middle"
      }, entrant.seed) : null, entrant ? this.mark(entrant, y) : null, m("text", {
        className: 'Gauntlet-name' + (!entrant && !dead ? ' is-tbd' : ''),
        x: 50,
        y: y + 17
      }, dead ? (0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('bracket.bye') : entrant ? truncate(entrantName(entrant)) : bye ? '' : (0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('bracket.tbd')), verdict ? m("text", {
        className: 'Gauntlet-verdict is-' + verdict,
        x: _bracket_layout__WEBPACK_IMPORTED_MODULE_5__.BOX_W - 8,
        y: y + 17,
        "text-anchor": "end"
      }, verdict === 'right' ? '✓' : '✗') : score !== null && score !== undefined ? m("text", {
        className: "Gauntlet-score",
        x: _bracket_layout__WEBPACK_IMPORTED_MODULE_5__.BOX_W - 8,
        y: y + 17,
        "text-anchor": "end"
      }, score) : null);
    }), match.bracket === 'P' ? m("text", {
      className: "Gauntlet-colTitle",
      x: _bracket_layout__WEBPACK_IMPORTED_MODULE_5__.BOX_W / 2,
      y: -6,
      "text-anchor": "middle"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('bracket.third_place')) : null, live ? m("text", {
      className: "Gauntlet-live",
      x: _bracket_layout__WEBPACK_IMPORTED_MODULE_5__.BOX_W - 4,
      y: -4,
      "text-anchor": "end"
    }, match.game.detail || (0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('bracket.live')) : match.status === 'disputed' && !predicting ? m("text", {
      className: "Gauntlet-flag",
      x: _bracket_layout__WEBPACK_IMPORTED_MODULE_5__.BOX_W - 4,
      y: -4,
      "text-anchor": "end"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_3__.t)('match.status.disputed')) : null);
  }
  liveScore(match, entrant) {
    if (!match.game || !entrant?.picksTeamId) return null;
    if (entrant.picksTeamId === match.game.homeTeamId) return match.game.homeScore;
    if (entrant.picksTeamId === match.game.awayTeamId) return match.game.awayScore;
    return null;
  }

  /** A logo, an avatar, or the first letter on a coloured disc. */
  mark(entrant, y) {
    const src = entrant.logoUrl || entrant.user?.avatarUrl;
    if (src) {
      return m("image", {
        className: "Gauntlet-logo",
        href: src,
        x: 26,
        y: y + 4,
        width: 18,
        height: 18,
        preserveAspectRatio: "xMidYMid meet"
      });
    }
    const name = entrantName(entrant);
    return m("g", null, m("circle", {
      className: "Gauntlet-initialBg",
      cx: 35,
      cy: y + 13,
      r: 9,
      style: {
        fill: (0,_bits__WEBPACK_IMPORTED_MODULE_4__.hue)(name)
      }
    }), m("text", {
      className: "Gauntlet-initial",
      x: 35,
      y: y + 17,
      "text-anchor": "middle"
    }, name.charAt(0).toUpperCase()));
  }
}

/**
 * Enter or Space on something drawn as a button. Never returns false: Mithril
 * would cancel the key, and Tab would stop moving focus.
 */
function onActivate(run) {
  return e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      run();
    }
  };
}
function truncate(name) {
  return name.length > MAX_NAME ? name.slice(0, MAX_NAME - 1) + '…' : name;
}

flarum.reg.add('ernestdefoe-gauntlet', 'forum/components/Bracket', Bracket);

/***/ },

/***/ "./src/forum/components/MatchModal.tsx"
/*!*********************************************!*\
  !*** ./src/forum/components/MatchModal.tsx ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MatchModal)
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_components_FormModal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/components/FormModal */ "flarum/common/components/FormModal");
/* harmony import */ var flarum_common_components_FormModal__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_FormModal__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/Link */ "flarum/common/components/Link");
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/utils/Stream */ "flarum/common/utils/Stream");
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _common_api__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../common/api */ "./src/common/api.ts");
/* harmony import */ var _Bracket__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Bracket */ "./src/forum/components/Bracket.tsx");







/**
 * One match: who is in it, what each side reported, and what the reader may
 * do about it — report, confirm, answer a report, or (organisers) rule,
 * award a forfeit, correct, link a Picks game, open a discussion.
 */
class MatchModal extends (flarum_common_components_FormModal__WEBPACK_IMPORTED_MODULE_1___default()) {
  mine = (() => flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_4___default()(''))();
  theirs = (() => flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_4___default()(''))();
  score1 = (() => flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_4___default()(''))();
  score2 = (() => flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_4___default()(''))();
  scheduled = (() => flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_4___default()(''))();
  games = null;
  /** The tournament as of the last change made here (attrs keep the copy it opened with). */

  oninit(vnode) {
    super.oninit(vnode);
    this.current = this.attrs.tournament;
    const match = this.attrs.match;
    this.score1(match.score1 !== null ? String(match.score1) : '');
    this.score2(match.score2 !== null ? String(match.score2) : '');
    this.scheduled(match.scheduledAt ? toLocalInput(match.scheduledAt) : '');
    const side = this.side();
    const report = side && match.reports?.[side];
    if (report) {
      this.mine(String(side === 1 ? report[0] : report[1]));
      this.theirs(String(side === 1 ? report[1] : report[0]));
    }
  }
  className() {
    return 'Modal--small Gauntlet';
  }
  title() {
    return (0,_common_api__WEBPACK_IMPORTED_MODULE_5__.t)('match.title');
  }
  match() {
    // Always the current copy: the tournament is replaced after each change.
    return this.current.matches.find(match => match.id === this.attrs.match.id) || this.attrs.match;
  }
  entrant(id) {
    return id ? this.current.entrants.find(e => e.id === id) : undefined;
  }

  /** 1 or 2 if the reader reports for a side here. */
  side() {
    const me = this.current.me.entrantId;
    const match = this.match();
    if (!me) return null;
    const entrant = this.entrant(me);
    if (!entrant || entrant.user?.id !== Number(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().session.user?.id())) return null;
    if (match.entrant1Id === me) return 1;
    if (match.entrant2Id === me) return 2;
    return null;
  }
  content() {
    const tournament = this.current;
    const match = this.match();
    const one = this.entrant(match.entrant1Id);
    const two = this.entrant(match.entrant2Id);
    const side = this.side();
    const live = ['open', 'reported', 'disputed'].includes(match.status);
    const manage = tournament.me.canManage && tournament.status !== 'cancelled' && !!one && !!two;
    return m("div", {
      className: "Modal-body"
    }, m("p", null, m("span", {
      className: 'Gauntlet-pill is-' + match.status
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_5__.t)('match.status.' + match.status)), ' ', match.bestOf > 1 ? m("span", {
      className: "helpText"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_5__.t)('match.best_of', {
      count: match.bestOf
    })) : null), m("table", {
      className: "Gauntlet-table"
    }, m("tbody", null, [one, two].map((e, i) => {
      const id = i === 0 ? match.entrant1Id : match.entrant2Id;
      const score = i === 0 ? match.score1 : match.score2;
      return m("tr", {
        className: match.winnerId && id === match.winnerId ? 'is-won' : ''
      }, m("td", null, m("strong", null, e ? (0,_Bracket__WEBPACK_IMPORTED_MODULE_6__.entrantName)(e) : (0,_common_api__WEBPACK_IMPORTED_MODULE_5__.t)('bracket.tbd')), e && e.members.length > 1 ? m("div", {
        className: "Gauntlet-roster"
      }, e.members.map(p => p.displayName).join(', ')) : null), m("td", {
        className: "num"
      }, m("strong", null, score ?? (match.winnerId && id === match.winnerId ? (0,_common_api__WEBPACK_IMPORTED_MODULE_5__.t)('match.forfeit_win') : ''))));
    }))), match.reports && (match.reports[1] || match.reports[2]) && match.status !== 'completed' ? m("ul", {
      className: "Gauntlet-meta",
      style: {
        margin: '10px 0'
      }
    }, [1, 2].map(s => match.reports[s] ? m("li", null, (0,_common_api__WEBPACK_IMPORTED_MODULE_5__.t)('match.reported_by', {
      name: (0,_Bracket__WEBPACK_IMPORTED_MODULE_6__.entrantName)(this.entrant(s === 1 ? match.entrant1Id : match.entrant2Id)),
      one: (0,_Bracket__WEBPACK_IMPORTED_MODULE_6__.entrantName)(one),
      two: (0,_Bracket__WEBPACK_IMPORTED_MODULE_6__.entrantName)(two),
      a: match.reports[s][0],
      b: match.reports[s][1]
    })) : null)) : null, match.game ? m("p", {
      className: "helpText"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_5__.t)('match.picks_game', {
      status: match.game.status,
      detail: match.game.detail || ''
    })) : null, match.discussionId ? m("p", null, m((flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_3___default()), {
      href: flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().route('discussion', {
        id: match.discussionId
      })
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_5__.t)('match.discussion'))) : null, side && live && tournament.status === 'running' ? this.reportForm(side, match) : null, match.status === 'awaiting' && side ? m("p", {
      className: "Gauntlet-notice"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_5__.t)('match.awaiting_staff')) : null, manage ? this.staffTools(match, one, two) : null);
  }
  reportForm(side, match) {
    const other = side === 1 ? 2 : 1;
    const theirReport = match.reports?.[other];
    const otherName = (0,_Bracket__WEBPACK_IMPORTED_MODULE_6__.entrantName)(this.entrant(other === 1 ? match.entrant1Id : match.entrant2Id));
    return m("div", {
      className: "Form"
    }, m("h4", null, (0,_common_api__WEBPACK_IMPORTED_MODULE_5__.t)('match.report_heading')), theirReport ? m("p", {
      className: "Gauntlet-notice"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_5__.t)('match.they_reported', {
      name: otherName,
      mine: side === 1 ? theirReport[0] : theirReport[1],
      theirs: side === 1 ? theirReport[1] : theirReport[0]
    }), ' ', m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default()), {
      className: "Button Button--primary",
      loading: this.loading,
      onclick: () => this.submitReport(side, side === 1 ? theirReport[0] : theirReport[1], side === 1 ? theirReport[1] : theirReport[0])
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_5__.t)('match.confirm'))) : null, m("div", {
      className: "Gauntlet-scoreForm"
    }, m("label", {
      htmlFor: "gauntlet-mine"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_5__.t)('match.my_score')), m("input", {
      id: "gauntlet-mine",
      className: "FormControl",
      type: "number",
      min: "0",
      max: "9999",
      inputmode: "numeric",
      bidi: this.mine
    })), m("div", {
      className: "Gauntlet-scoreForm"
    }, m("label", {
      htmlFor: "gauntlet-theirs"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_5__.t)('match.their_score', {
      name: otherName
    })), m("input", {
      id: "gauntlet-theirs",
      className: "FormControl",
      type: "number",
      min: "0",
      max: "9999",
      inputmode: "numeric",
      bidi: this.theirs
    })), m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default()), {
      className: "Button Button--primary",
      loading: this.loading,
      onclick: () => this.submitReport(side, Number(this.mine()), Number(this.theirs())),
      disabled: this.mine() === '' || this.theirs() === ''
    }, theirReport ? (0,_common_api__WEBPACK_IMPORTED_MODULE_5__.t)('match.report_different') : (0,_common_api__WEBPACK_IMPORTED_MODULE_5__.t)('match.report')));
  }
  staffTools(match, one, two) {
    const tournament = this.current;
    const canRule = tournament.status === 'running' || tournament.status === 'finished' && match.status === 'completed';
    const done = match.status === 'completed';
    return m("div", {
      className: "Form",
      style: {
        marginTop: '16px',
        borderTop: '1px solid var(--control-bg)',
        paddingTop: '12px'
      }
    }, m("h4", null, done ? (0,_common_api__WEBPACK_IMPORTED_MODULE_5__.t)('match.correct_heading') : (0,_common_api__WEBPACK_IMPORTED_MODULE_5__.t)('match.rule_heading')), canRule ? m("div", null, m("div", {
      className: "Gauntlet-scoreForm"
    }, m("label", {
      htmlFor: "gauntlet-s1"
    }, (0,_Bracket__WEBPACK_IMPORTED_MODULE_6__.entrantName)(one)), m("input", {
      id: "gauntlet-s1",
      className: "FormControl",
      type: "number",
      min: "0",
      max: "9999",
      inputmode: "numeric",
      bidi: this.score1
    })), m("div", {
      className: "Gauntlet-scoreForm"
    }, m("label", {
      htmlFor: "gauntlet-s2"
    }, (0,_Bracket__WEBPACK_IMPORTED_MODULE_6__.entrantName)(two)), m("input", {
      id: "gauntlet-s2",
      className: "FormControl",
      type: "number",
      min: "0",
      max: "9999",
      inputmode: "numeric",
      bidi: this.score2
    })), m("div", {
      className: "Gauntlet-actions"
    }, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default()), {
      className: "Button Button--primary",
      loading: this.loading,
      disabled: this.score1() === '' || this.score2() === '',
      onclick: () => this.resolve({
        score1: Number(this.score1()),
        score2: Number(this.score2())
      })
    }, done ? (0,_common_api__WEBPACK_IMPORTED_MODULE_5__.t)('match.save_correction') : (0,_common_api__WEBPACK_IMPORTED_MODULE_5__.t)('match.save_result')), m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default()), {
      className: "Button",
      onclick: () => this.resolve({
        winner: 1
      }),
      disabled: this.loading
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_5__.t)('match.forfeit_to', {
      name: (0,_Bracket__WEBPACK_IMPORTED_MODULE_6__.entrantName)(one)
    })), m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default()), {
      className: "Button",
      onclick: () => this.resolve({
        winner: 2
      }),
      disabled: this.loading
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_5__.t)('match.forfeit_to', {
      name: (0,_Bracket__WEBPACK_IMPORTED_MODULE_6__.entrantName)(two)
    })))) : null, m("div", {
      className: "Form-group"
    }, m("label", {
      htmlFor: "gauntlet-when"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_5__.t)('match.scheduled')), m("div", {
      className: "Gauntlet-actions",
      style: {
        margin: 0
      }
    }, m("input", {
      id: "gauntlet-when",
      className: "FormControl",
      type: "datetime-local",
      bidi: this.scheduled,
      style: {
        maxWidth: '240px'
      }
    }), m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default()), {
      className: "Button",
      onclick: () => this.change(_common_api__WEBPACK_IMPORTED_MODULE_5__.api.updateMatch(match.id, {
        scheduledAt: this.scheduled() ? new Date(this.scheduled()).toISOString() : null
      }))
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_5__.t)('match.save_time')))), tournament.me.picksAvailable && one.picksTeamId && two.picksTeamId ? this.picksLink(match, one, two) : null, !match.discussionId ? m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default()), {
      className: "Button",
      icon: "far fa-comments",
      onclick: () => this.change(_common_api__WEBPACK_IMPORTED_MODULE_5__.api.matchDiscussion(match.id))
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_5__.t)('match.start_discussion')) : null);
  }
  picksLink(match, one, two) {
    if (this.games === null) {
      this.games = [];
      _common_api__WEBPACK_IMPORTED_MODULE_5__.api.picksGames(one.picksTeamId, two.picksTeamId).then(_ref => {
        let {
          data
        } = _ref;
        this.games = data;
        m.redraw();
      });
    }
    return m("div", {
      className: "Form-group"
    }, m("label", {
      htmlFor: "gauntlet-game"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_5__.t)('match.picks_link')), m("select", {
      id: "gauntlet-game",
      className: "FormControl",
      onchange: e => this.change(_common_api__WEBPACK_IMPORTED_MODULE_5__.api.updateMatch(match.id, {
        picksEventId: e.target.value || null
      }))
    }, m("option", {
      value: ""
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_5__.t)('match.picks_none')), this.games.map(g => m("option", {
      value: g.id,
      selected: g.id === match.picksEventId
    }, (g.startsAt ? new Date(g.startsAt).toLocaleString() : '?') + ' · ' + g.status))));
  }
  submitReport(side, mine, theirs) {
    const [s1, s2] = side === 1 ? [mine, theirs] : [theirs, mine];
    this.change(_common_api__WEBPACK_IMPORTED_MODULE_5__.api.report(this.match().id, s1, s2));
  }
  resolve(data) {
    this.change(_common_api__WEBPACK_IMPORTED_MODULE_5__.api.resolve(this.match().id, {
      score1: null,
      score2: null,
      winner: null,
      ...data
    }));
  }
  change(request) {
    this.loading = true;
    request.then(_ref2 => {
      let {
        data
      } = _ref2;
      this.loading = false;
      this.current = data;
      this.attrs.onchange(data);
      const updated = data.matches.find(x => x.id === this.attrs.match.id);
      // Done once the match is settled; otherwise stay to show the new state.
      if (!updated || ['completed', 'awaiting'].includes(updated.status)) this.hide();
      m.redraw();
    }, () => {
      this.loading = false;
      m.redraw();
    });
  }
  onsubmit(e) {
    e.preventDefault();
  }
}
function toLocalInput(iso) {
  const d = new Date(iso);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
flarum.reg.add('ernestdefoe-gauntlet', 'forum/components/MatchModal', MatchModal);

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

/***/ "./src/forum/pages/TournamentPage.tsx"
/*!********************************************!*\
  !*** ./src/forum/pages/TournamentPage.tsx ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TournamentPage),
/* harmony export */   tournamentUrl: () => (/* reexport safe */ _common_api__WEBPACK_IMPORTED_MODULE_9__.tournamentUrl)
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
/* harmony import */ var flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/components/LinkButton */ "flarum/common/components/LinkButton");
/* harmony import */ var flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/components/Link */ "flarum/common/components/Link");
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/common/components/LoadingIndicator */ "flarum/common/components/LoadingIndicator");
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! flarum/common/utils/extractText */ "flarum/common/utils/extractText");
/* harmony import */ var flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _common_api__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../common/api */ "./src/common/api.ts");
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../styles */ "./src/forum/styles.ts");
/* harmony import */ var _components_Bracket__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../components/Bracket */ "./src/forum/components/Bracket.tsx");
/* harmony import */ var _components_MatchModal__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../components/MatchModal */ "./src/forum/components/MatchModal.tsx");
/* harmony import */ var _bracket_layout__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../bracket/layout */ "./src/forum/bracket/layout.ts");
/* harmony import */ var _components_bits__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../components/bits */ "./src/forum/components/bits.tsx");















/** /tournaments/:id — the whole tournament, and everything a reader may do in it. */
class TournamentPage extends (flarum_common_components_Page__WEBPACK_IMPORTED_MODULE_1___default()) {
  tournament = null;
  missing = false;
  tab = null;
  busy = false;
  teamName = '';
  groupId = '';
  picks = {};
  tiebreaker = '';
  picksDirty = false;
  board = null;
  boardPage = 1;
  boardMore = false;
  staffName = '';
  staffLogo = '';
  teamQuery = '';
  teamResults = [];
  searchTimer = 0;
  oninit(vnode) {
    super.oninit(vnode);
    (0,_styles__WEBPACK_IMPORTED_MODULE_10__["default"])();
    this.load();
  }
  load() {
    const id = parseInt(String(m.route.param('id')), 10);
    _common_api__WEBPACK_IMPORTED_MODULE_9__.api.show(id).then(_ref => {
      let {
        data
      } = _ref;
      return this.set(data, true);
    }, () => {
      this.missing = true;
      m.redraw();
    });
  }
  set(data, first) {
    if (first === void 0) {
      first = false;
    }
    this.tournament = data;
    if (first) {
      flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().setTitle(data.title);
      flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().history.push('tournament', data.title);
      const prediction = data.me.prediction;
      this.picks = prediction?.picks ? {
        ...prediction.picks
      } : {};
      this.tiebreaker = prediction?.tiebreaker != null ? String(prediction.tiebreaker) : '';
      const match = Number(m.route.param('match'));
      const linked = match ? data.matches.find(x => x.id === match) : null;
      if (linked) setTimeout(() => this.open(linked));
    }
    if (!this.tab || !this.tabs().includes(this.tab)) this.tab = this.tabs()[0];
    m.redraw();
  }
  tabs() {
    const tt = this.tournament;
    const tabs = [];
    const started = tt.matches.length > 0;
    if (tt.predictions && tt.me.canPredict && tt.me.predictionsOpen) tabs.push('predict');
    if (started && (tt.format === 'single' || tt.format === 'double')) tabs.push('bracket');
    if (started && tt.standings) tabs.push('standings');
    if (started) tabs.push('matches');
    if (tt.predictions && started) {
      if (!tabs.includes('predict') && tt.me.prediction) tabs.push('predict');
      tabs.push('board');
    }
    tabs.push('entrants');
    if (tt.me.canManage) tabs.push('manage');
    return tabs;
  }
  view() {
    return m((flarum_forum_components_PageStructure__WEBPACK_IMPORTED_MODULE_2___default()), {
      className: "Gauntlet GauntletPage",
      sidebar: () => m((flarum_forum_components_IndexSidebar__WEBPACK_IMPORTED_MODULE_3___default()), null),
      loading: !this.tournament && !this.missing
    }, this.missing ? m("p", {
      className: "Gauntlet-notice"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.missing')) : this.tournament ? this.content(this.tournament) : null);
  }
  content(tt) {
    return m("div", null, this.header(tt), this.actions(tt), m("div", {
      className: "Gauntlet-tabs",
      role: "tablist"
    }, this.tabs().map(tab => m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
      className: 'Button Button--flat' + (this.tab === tab ? ' active' : ''),
      role: "tab",
      "aria-selected": this.tab === tab,
      onclick: () => this.switchTab(tab)
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.tabs.' + tab)))), m("div", {
      role: "tabpanel"
    }, this.panel(tt)));
  }
  switchTab(tab) {
    this.tab = tab;
    if (tab === 'board' && !this.board) this.loadBoard();
  }
  header(tt) {
    const capacity = tt.maxEntrants ? (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.entrants_of', {
      count: tt.entrantCount,
      max: tt.maxEntrants
    }) : (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.entrants', {
      count: tt.entrantCount
    });
    return m("header", {
      className: "Gauntlet-head"
    }, m("h2", null, tt.title), m("ul", {
      className: "Gauntlet-meta"
    }, m("li", null, (0,_components_bits__WEBPACK_IMPORTED_MODULE_14__.pill)(tt.status)), m("li", null, m("i", {
      className: "icon fas fa-sitemap",
      "aria-hidden": "true"
    }), (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('format.' + tt.format)), tt.game ? m("li", null, m("i", {
      className: "icon fas fa-gamepad",
      "aria-hidden": "true"
    }), tt.game) : null, tt.entryMode === 'members' ? m("li", null, m("i", {
      className: "icon fas fa-users",
      "aria-hidden": "true"
    }), tt.entryType === 'team' ? (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.teams_of', {
      size: tt.teamSize || '∞'
    }) : (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.solo'), " \xB7 ", capacity) : null, tt.startsAt ? m("li", null, m("i", {
      className: "icon far fa-calendar",
      "aria-hidden": "true"
    }), (0,_components_bits__WEBPACK_IMPORTED_MODULE_14__.formatDate)(tt.startsAt)) : null, tt.bestOf > 1 ? m("li", null, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('match.best_of', {
      count: tt.bestOf
    })) : null, tt.organiser ? m("li", null, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.organiser'), " ", m((flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_6___default()), {
      href: flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().route('user', {
        username: tt.organiser.username
      })
    }, tt.organiser.displayName)) : null, tt.discussionId ? m("li", null, m("i", {
      className: "icon far fa-comments",
      "aria-hidden": "true"
    }), m((flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_6___default()), {
      href: flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().route('discussion', {
        id: tt.discussionId
      })
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.discussion'))) : null), tt.description ? m("p", {
      className: "Gauntlet-description"
    }, tt.description) : null);
  }
  mine(tt) {
    return tt.me.entrantId ? tt.entrants.find(e => e.id === tt.me.entrantId) : undefined;
  }
  actions(tt) {
    const me = this.mine(tt);
    const userId = Number(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().session.user?.id());
    const captain = me && me.user?.id === userId;
    const items = [];
    if (tt.status === 'registration' && tt.entryMode === 'members') {
      if (!(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().session).user) {
        items.push(m("p", {
          className: "Gauntlet-notice"
        }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.log_in')));
      } else if (!me && tt.me.canJoin) {
        items.push(tt.entryType === 'team' ? this.teamSignUp(tt) : m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
          className: "Button Button--primary",
          icon: "fas fa-right-to-bracket",
          loading: this.busy,
          onclick: () => this.run(_common_api__WEBPACK_IMPORTED_MODULE_9__.api.signUp(tt.id))
        }, tt.maxEntrants && tt.entrantCount >= tt.maxEntrants ? (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.join_waitlist') : (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.sign_up')));
      }
      if (me) {
        const waiting = me.status === 'waitlisted';
        items.push(m("p", {
          className: 'Gauntlet-notice' + (waiting ? ' is-warn' : '')
        }, waiting ? (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.you_waitlisted') : tt.entryType === 'team' ? (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.you_team', {
          name: me.name
        }) : (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.you_in'), tt.checkinMinutes ? ' ' + flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_8___default()(me.checkedIn ? (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.checked_in') : (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.checkin_window', {
          time: (0,_components_bits__WEBPACK_IMPORTED_MODULE_14__.formatDate)(tt.checkinOpensAt)
        })) : ''));
        if (tt.checkinMinutes && captain && tt.checkinOpensAt && new Date(tt.checkinOpensAt) <= new Date()) {
          items.push(m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
            className: 'Button' + (me.checkedIn ? '' : ' Button--primary'),
            icon: "fas fa-check",
            loading: this.busy,
            onclick: () => this.run(_common_api__WEBPACK_IMPORTED_MODULE_9__.api.checkIn(me.id, me.checkedIn))
          }, me.checkedIn ? (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.undo_checkin') : (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.check_in')));
        }
        items.push(captain ? m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
          className: "Button",
          onclick: () => confirm(flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_8___default()((0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.withdraw_confirm'))) && this.run(_common_api__WEBPACK_IMPORTED_MODULE_9__.api.withdraw(me.id))
        }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.withdraw')) : m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
          className: "Button",
          onclick: () => this.run(_common_api__WEBPACK_IMPORTED_MODULE_9__.api.leave(me.id, userId))
        }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.leave_team')));
      }
    }
    if (tt.status === 'running') {
      const yours = tt.matches.filter(x => ['open', 'reported', 'disputed'].includes(x.status) && me && (x.entrant1Id === me.id || x.entrant2Id === me.id));
      yours.forEach(x => items.push(m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
        className: "Button Button--primary",
        icon: "fas fa-flag-checkered",
        onclick: () => this.open(x)
      }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.your_match', {
        name: (0,_components_Bracket__WEBPACK_IMPORTED_MODULE_11__.entrantName)(tt.entrants.find(e => e.id === (x.entrant1Id === me.id ? x.entrant2Id : x.entrant1Id)))
      }))));
      if (tt.me.canManage) {
        const waiting = tt.matches.filter(x => x.status === 'disputed' || x.status === 'awaiting').length;
        if (waiting) items.push(m("p", {
          className: "Gauntlet-notice is-warn"
        }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.staff_waiting', {
          count: waiting
        })));
      }
    }
    if (tt.status === 'running' && me && captain && me.status === 'registered' && tt.entryMode === 'members') {
      items.push(m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
        className: "Button Button--text",
        onclick: () => confirm(flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_8___default()((0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.forfeit_confirm'))) && this.run(_common_api__WEBPACK_IMPORTED_MODULE_9__.api.withdraw(me.id))
      }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.withdraw_running')));
    }
    if (tt.status === 'finished') {
      const champion = tt.entrants.find(e => e.finalRank === 1);
      if (champion) {
        items.push(m("p", {
          className: "Gauntlet-notice"
        }, m("i", {
          className: "icon fas fa-trophy",
          "aria-hidden": "true"
        }), " ", (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.champion', {
          name: (0,_components_Bracket__WEBPACK_IMPORTED_MODULE_11__.entrantName)(champion)
        })));
      }
    }
    return items.length ? m("div", {
      className: "Gauntlet-actions"
    }, items) : null;
  }
  teamSignUp(tt) {
    return m("div", {
      className: "Gauntlet-actions",
      style: {
        margin: 0
      }
    }, tt.me.groups.length ? m("select", {
      className: "FormControl",
      style: {
        maxWidth: '220px'
      },
      "aria-label": flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_8___default()((0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.team_group')),
      value: this.groupId,
      onchange: e => this.groupId = e.target.value
    }, m("option", {
      value: ""
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.team_new')), tt.me.groups.map(g => m("option", {
      value: g.id
    }, g.name))) : null, !this.groupId ? m("input", {
      className: "FormControl",
      style: {
        maxWidth: '220px'
      },
      maxlength: 100,
      placeholder: flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_8___default()((0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.team_name')),
      "aria-label": flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_8___default()((0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.team_name')),
      value: this.teamName,
      oninput: e => this.teamName = e.target.value
    }) : null, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
      className: "Button Button--primary",
      loading: this.busy,
      disabled: !this.groupId && !this.teamName.trim(),
      onclick: () => this.run(_common_api__WEBPACK_IMPORTED_MODULE_9__.api.signUp(tt.id, this.groupId ? {
        groupId: Number(this.groupId)
      } : {
        name: this.teamName
      }))
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.enter_team')));
  }
  panel(tt) {
    switch (this.tab) {
      case 'bracket':
        return m(_components_Bracket__WEBPACK_IMPORTED_MODULE_11__["default"], {
          tournament: tt,
          onOpen: x => this.open(x)
        });
      case 'standings':
        return this.standings(tt);
      case 'matches':
        return this.matchList(tt);
      case 'predict':
        return this.predict(tt);
      case 'board':
        return this.boardView(tt);
      case 'manage':
        return this.manage(tt);
      default:
        return this.entrantsView(tt);
    }
  }
  standings(tt) {
    const byId = new Map(tt.entrants.map(e => [e.id, e]));
    const pts = n => n % 2 ? (n / 2).toFixed(1) : String(n / 2);
    return m("div", {
      className: "Gauntlet-tableWrap"
    }, m("table", {
      className: "Gauntlet-table"
    }, m("thead", null, m("tr", null, m("th", null, "#"), m("th", null, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('standings.entrant')), m("th", {
      className: "num"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('standings.played')), m("th", {
      className: "num"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('standings.record')), m("th", {
      className: "num hide-phone"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('standings.diff')), m("th", {
      className: "num hide-phone",
      title: flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_8___default()((0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)(tt.format === 'swiss' ? 'standings.buchholz_help' : 'standings.sb_help'))
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)(tt.format === 'swiss' ? 'standings.buchholz' : 'standings.sb')), m("th", {
      className: "num"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('standings.points')))), m("tbody", null, (tt.standings || []).map(row => m("tr", null, m("td", null, row.rank), m("td", null, this.person(byId.get(row.entrant))), m("td", {
      className: "num"
    }, row.played), m("td", {
      className: "num"
    }, `${row.wins}–${row.draws}–${row.losses}`), m("td", {
      className: "num hide-phone"
    }, row.for - row.against), m("td", {
      className: "num hide-phone"
    }, pts(row.tiebreak)), m("td", {
      className: "num"
    }, m("strong", null, pts(row.points))))))));
  }
  matchList(tt) {
    const byId = new Map(tt.entrants.map(e => [e.id, e]));
    const title = (0,_components_Bracket__WEBPACK_IMPORTED_MODULE_11__.roundTitle)(tt);
    const groups = new Map();
    const order = ['W', 'P', 'L', 'F', 'R', 'S'];
    [...tt.matches].filter(x => x.status !== 'void').sort((a, b) => order.indexOf(a.bracket) - order.indexOf(b.bracket) || a.round - b.round || a.position - b.position).forEach(x => {
      const label = x.bracket === 'P' ? flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_8___default()((0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('bracket.third_place')) : x.bracket === 'R' || x.bracket === 'S' ? flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_8___default()((0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('bracket.round', {
        number: x.round
      })) : (tt.format === 'double' ? flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_8___default()((0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('bracket.section_' + x.bracket)) + ' · ' : '') + title(x.bracket, x.round, (0,_bracket_layout__WEBPACK_IMPORTED_MODULE_13__.maxRound)(tt, x.bracket === 'F' ? 'W' : x.bracket));
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label).push(x);
    });
    return m("div", null, [...groups.entries()].map(_ref2 => {
      let [label, matches] = _ref2;
      return m("section", null, m("h3", {
        className: "Gauntlet-roundTitle"
      }, label), m("div", {
        className: "Gauntlet-matches"
      }, matches.map(x => m("button", {
        type: "button",
        className: "Gauntlet-matchCard",
        onclick: () => this.open(x),
        disabled: x.status === 'bye'
      }, m("header", null, m("span", {
        className: 'Gauntlet-pill is-' + x.status
      }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('match.status.' + x.status)), x.scheduledAt ? m("span", null, (0,_components_bits__WEBPACK_IMPORTED_MODULE_14__.formatDate)(x.scheduledAt)) : null), [1, 2].map(side => {
        const id = side === 1 ? x.entrant1Id : x.entrant2Id;
        const dead = side === 1 ? x.dead1 : x.dead2;
        return m("div", {
          className: 'side' + (x.winnerId && id === x.winnerId ? ' is-won' : x.winnerId && id ? ' is-lost' : '')
        }, m("span", null, id ? (0,_components_Bracket__WEBPACK_IMPORTED_MODULE_11__.entrantName)(byId.get(id)) : dead ? (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('bracket.bye') : (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('bracket.tbd')), m("span", null, side === 1 ? x.score1 ?? '' : x.score2 ?? ''));
      })))));
    }));
  }
  person(e) {
    if (!e) return null;
    const logo = e.logoUrl ? m("img", {
      className: "Gauntlet-teamLogo",
      src: e.logoUrl,
      alt: "",
      loading: "lazy",
      decoding: "async"
    }) : null;
    const avatar = !logo && e.user ? (0,_components_bits__WEBPACK_IMPORTED_MODULE_14__.personAvatar)(e.user) : null;
    const name = (0,_components_Bracket__WEBPACK_IMPORTED_MODULE_11__.entrantName)(e);
    return m("span", {
      className: "Gauntlet-person"
    }, logo || avatar, e.user && !e.name ? m((flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_6___default()), {
      href: flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().route('user', {
        username: e.user.username
      })
    }, name) : m("span", null, name));
  }
  entrantsView(tt) {
    const manage = tt.me.canManage && (tt.status === 'registration' || tt.status === 'draft');
    const me = this.mine(tt);
    const order = ['registered', 'waitlisted', 'withdrawn', 'disqualified', 'no_show'];
    const list = [...tt.entrants].sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status) || (a.finalRank ?? 999) - (b.finalRank ?? 999) || (a.seed ?? 999) - (b.seed ?? 999) || a.id - b.id);
    if (!list.length) return m("p", {
      className: "Gauntlet-notice"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('entrants.empty'));

    // Seeds mean something once drawn, or while an organiser sets them by hand.
    const seeded = tt.status === 'running' || tt.status === 'finished' || manage && tt.seeding === 'manual';
    return m("div", {
      className: "Gauntlet-tableWrap"
    }, m("table", {
      className: "Gauntlet-table"
    }, m("thead", null, m("tr", null, seeded ? m("th", null, tt.status === 'finished' ? (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('entrants.place') : (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('entrants.seed')) : null, m("th", null, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('standings.entrant')), tt.entryMode === 'members' ? m("th", {
      className: "num hide-phone"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('entrants.rating')) : null, m("th", null, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('entrants.status')), manage || tt.entryType === 'team' && !me ? m("th", null) : null)), m("tbody", null, list.map(e => m("tr", null, seeded ? m("td", null, manage && tt.seeding === 'manual' ? m("input", {
      className: "FormControl",
      type: "number",
      min: "1",
      style: {
        width: '64px'
      },
      "aria-label": flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_8___default()((0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('entrants.seed')),
      value: e.seed ?? '',
      onchange: ev => this.run(_common_api__WEBPACK_IMPORTED_MODULE_9__.api.updateEntrant(e.id, {
        seed: Number(ev.target.value) || 0
      }))
    }) : (tt.status === 'finished' ? e.finalRank : e.seed) ?? '–') : null, m("td", null, this.person(e), tt.entryType === 'team' && e.members.length ? m("div", {
      className: "Gauntlet-roster"
    }, e.members.map(p => p.displayName).join(', ')) : null), tt.entryMode === 'members' ? m("td", {
      className: "num hide-phone"
    }, e.rating ?? '') : null, m("td", null, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('entrants.statuses.' + e.status), tt.checkinMinutes && e.checkedIn ? ' ✓' : '', tt.status !== 'registration' && tt.status !== 'draft' && (e.wins || e.losses || e.draws) ? m("div", {
      className: "Gauntlet-roster"
    }, `${e.wins}–${e.draws}–${e.losses}`) : null), manage ? m("td", {
      className: "num"
    }, e.status === 'waitlisted' ? m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
      className: "Button Button--text",
      onclick: () => this.run(_common_api__WEBPACK_IMPORTED_MODULE_9__.api.updateEntrant(e.id, {
        promote: true
      }))
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('entrants.promote')) : null, tt.checkinMinutes ? m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
      className: "Button Button--text",
      onclick: () => this.run(_common_api__WEBPACK_IMPORTED_MODULE_9__.api.checkIn(e.id, e.checkedIn))
    }, e.checkedIn ? (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.undo_checkin') : (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournament.check_in')) : null, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
      className: "Button Button--text",
      icon: "fas fa-xmark",
      "aria-label": flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_8___default()((0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('entrants.remove')),
      onclick: () => confirm(flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_8___default()((0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('entrants.remove_confirm', {
        name: (0,_components_Bracket__WEBPACK_IMPORTED_MODULE_11__.entrantName)(e)
      }))) && this.run(_common_api__WEBPACK_IMPORTED_MODULE_9__.api.withdraw(e.id))
    })) : tt.entryType === 'team' && !me ? m("td", {
      className: "num"
    }, tt.status === 'registration' && tt.me.canJoin && (flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().session).user && e.status !== 'withdrawn' && (!tt.teamSize || e.members.length < tt.teamSize) ? m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
      className: "Button",
      onclick: () => this.run(_common_api__WEBPACK_IMPORTED_MODULE_9__.api.join(e.id))
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('entrants.join_team')) : null) : null)))));
  }
  predict(tt) {
    const open = tt.me.predictionsOpen && tt.me.canPredict;
    const playable = tt.matches.filter(x => (x.bracket === 'W' || x.bracket === 'P') && x.status !== 'bye' && x.status !== 'void');
    const made = playable.filter(x => this.picks[x.key]).length;
    const mine = tt.me.prediction;
    return m("div", null, m("p", {
      className: "Gauntlet-notice"
    }, open ? tt.predictionsLockAt ? (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('predict.open_until', {
      time: (0,_components_bits__WEBPACK_IMPORTED_MODULE_14__.formatDate)(tt.predictionsLockAt)
    }) : (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('predict.open_until_first') : (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('predict.closed'), ' ', mine ? (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('predict.score', {
      score: mine.score,
      correct: mine.correct,
      possible: mine.possible
    }) : null), m(_components_Bracket__WEBPACK_IMPORTED_MODULE_11__["default"], {
      tournament: tt,
      picks: this.picks,
      onPick: open ? (key, id) => this.pick(key, id) : undefined
    }), open ? m("div", {
      className: "Gauntlet-actions",
      style: {
        alignItems: 'center'
      }
    }, m("span", null, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('predict.progress', {
      made,
      total: playable.length
    })), m("label", {
      className: "Gauntlet-scoreForm",
      style: {
        margin: 0
      }
    }, m("span", null, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('predict.tiebreaker')), m("input", {
      className: "FormControl",
      type: "number",
      min: "0",
      max: "9999",
      inputmode: "numeric",
      value: this.tiebreaker,
      oninput: e => (this.tiebreaker = e.target.value, this.picksDirty = true)
    })), m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
      className: "Button Button--primary",
      loading: this.busy,
      disabled: !this.picksDirty || !made,
      onclick: () => this.savePicks(tt)
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('predict.save'))) : null);
  }
  pick(key, id) {
    this.picks = (0,_bracket_layout__WEBPACK_IMPORTED_MODULE_13__.prune)(this.tournament, {
      ...this.picks,
      [key]: id
    });
    this.picksDirty = true;
  }
  savePicks(tt) {
    this.busy = true;
    _common_api__WEBPACK_IMPORTED_MODULE_9__.api.predict(tt.id, this.picks, this.tiebreaker === '' ? null : Number(this.tiebreaker)).then(_ref3 => {
      let {
        data
      } = _ref3;
      this.busy = false;
      this.picksDirty = false;
      tt.me.prediction = data;
      this.board = null;
      flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().alerts.show({
        type: 'success'
      }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('predict.saved'));
      m.redraw();
    }, () => {
      this.busy = false;
      m.redraw();
    });
  }
  loadBoard(page) {
    if (page === void 0) {
      page = 1;
    }
    _common_api__WEBPACK_IMPORTED_MODULE_9__.api.board(this.tournament.id, page).then(_ref4 => {
      let {
        data,
        meta
      } = _ref4;
      this.board = page === 1 ? data : [...(this.board || []), ...data];
      this.boardPage = page;
      this.boardMore = meta.more;
      m.redraw();
    });
  }
  boardView(tt) {
    if (!this.board) return m((flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_7___default()), {
      display: "block"
    });
    if (!this.board.length) return m("p", {
      className: "Gauntlet-notice"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('predict.board_empty'));
    const me = Number(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().session.user?.id());
    return m("div", {
      className: "Gauntlet-tableWrap Gauntlet-board"
    }, m("table", {
      className: "Gauntlet-table"
    }, m("thead", null, m("tr", null, m("th", null, "#"), m("th", null, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('predict.member')), m("th", {
      className: "num"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('predict.points')), m("th", {
      className: "num hide-phone"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('predict.correct')), m("th", {
      className: "num"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('predict.possible')))), m("tbody", null, this.board.map(row => m("tr", {
      className: row.user?.id === me ? 'is-me' : ''
    }, m("td", null, row.place), m("td", null, row.user ? m((flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_6___default()), {
      href: flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().route('user', {
        username: row.user.username
      })
    }, row.user.displayName) : null), m("td", {
      className: "num"
    }, m("strong", null, row.score)), m("td", {
      className: "num hide-phone"
    }, row.correct), m("td", {
      className: "num"
    }, row.possible))))), this.boardMore ? m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
      className: "Button",
      onclick: () => this.loadBoard(this.boardPage + 1)
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('tournaments.more')) : null);
  }
  manage(tt) {
    const confirmRun = (key, request) => () => confirm(flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_8___default()((0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)(key))) && this.run(request());
    return m("div", {
      className: "Gauntlet-form"
    }, m("div", {
      className: "Gauntlet-actions"
    }, m((flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_5___default()), {
      className: "Button",
      icon: "fas fa-pen",
      href: flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().route('gauntlet.edit', {
        id: tt.id
      })
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('manage.edit')), tt.status === 'draft' ? m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
      className: "Button Button--primary",
      icon: "fas fa-bullhorn",
      loading: this.busy,
      onclick: () => this.run(_common_api__WEBPACK_IMPORTED_MODULE_9__.api.act(tt.id, 'publish'))
    }, tt.entryMode === 'staff' ? (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('manage.publish_staff') : (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('manage.publish')) : null, tt.status === 'registration' ? m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
      className: "Button Button--primary",
      icon: "fas fa-play",
      loading: this.busy,
      onclick: confirmRun('manage.start_confirm', () => _common_api__WEBPACK_IMPORTED_MODULE_9__.api.act(tt.id, 'start'))
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('manage.start')) : null, tt.status === 'running' ? m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
      className: "Button",
      icon: "fas fa-rotate-left",
      onclick: confirmRun('manage.reset_confirm', () => _common_api__WEBPACK_IMPORTED_MODULE_9__.api.act(tt.id, 'reset'))
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('manage.reset')) : null, !tt.discussionId && tt.status !== 'draft' ? m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
      className: "Button",
      icon: "far fa-comments",
      onclick: () => this.run(_common_api__WEBPACK_IMPORTED_MODULE_9__.api.act(tt.id, 'discussion'))
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('manage.discussion')) : null, tt.status !== 'finished' && tt.status !== 'cancelled' ? m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
      className: "Button",
      icon: "fas fa-ban",
      onclick: confirmRun('manage.cancel_confirm', () => _common_api__WEBPACK_IMPORTED_MODULE_9__.api.act(tt.id, 'cancel'))
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('manage.cancel')) : null, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
      className: "Button Button--danger",
      icon: "fas fa-trash",
      onclick: () => confirm(flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_8___default()((0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('manage.delete_confirm'))) && _common_api__WEBPACK_IMPORTED_MODULE_9__.api.remove(tt.id).then(() => m.route.set(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().route('gauntlet.index')))
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('manage.delete'))), tt.status === 'registration' && tt.entryMode === 'members' ? m("p", {
      className: "helpText"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('manage.start_help')) : null, tt.entryMode === 'staff' && (tt.status === 'draft' || tt.status === 'registration') ? this.staffField(tt) : null);
  }
  staffField(tt) {
    return m("fieldset", null, m("legend", null, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('manage.add_heading')), tt.me.picksAvailable ? m("div", {
      className: "Form-group Gauntlet-search"
    }, m("label", {
      htmlFor: "gauntlet-picks"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('manage.picks_search')), m("input", {
      id: "gauntlet-picks",
      className: "FormControl",
      type: "search",
      value: this.teamQuery,
      oninput: e => this.searchTeams(e.target.value)
    }), this.teamResults.length ? m("ul", {
      className: "Gauntlet-searchResults"
    }, this.teamResults.map(team => m("li", null, m("button", {
      type: "button",
      onclick: () => this.run(_common_api__WEBPACK_IMPORTED_MODULE_9__.api.signUp(tt.id, {
        picksTeamId: team.id
      })).then(() => (this.teamQuery = '', this.teamResults = []))
    }, team.logoUrl ? m("img", {
      src: team.logoUrl,
      alt: "",
      loading: "lazy",
      decoding: "async"
    }) : null, team.name)))) : null) : null, m("div", {
      className: "Gauntlet-grid2"
    }, m("div", {
      className: "Form-group"
    }, m("label", {
      htmlFor: "gauntlet-staff-name"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('manage.name')), m("input", {
      id: "gauntlet-staff-name",
      className: "FormControl",
      maxlength: 100,
      value: this.staffName,
      oninput: e => this.staffName = e.target.value
    })), m("div", {
      className: "Form-group"
    }, m("label", {
      htmlFor: "gauntlet-staff-logo"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('manage.logo')), m("input", {
      id: "gauntlet-staff-logo",
      className: "FormControl",
      type: "url",
      placeholder: "https://",
      value: this.staffLogo,
      oninput: e => this.staffLogo = e.target.value
    }))), m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
      className: "Button Button--primary",
      disabled: !this.staffName.trim(),
      loading: this.busy,
      onclick: () => this.run(_common_api__WEBPACK_IMPORTED_MODULE_9__.api.signUp(tt.id, {
        name: this.staffName,
        logoUrl: this.staffLogo || null
      })).then(() => (this.staffName = '', this.staffLogo = ''))
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('manage.add')), m("p", {
      className: "helpText"
    }, (0,_common_api__WEBPACK_IMPORTED_MODULE_9__.t)('manage.seed_help')));
  }
  searchTeams(q) {
    this.teamQuery = q;
    window.clearTimeout(this.searchTimer);
    if (q.trim().length < 2) {
      this.teamResults = [];
      return;
    }
    this.searchTimer = window.setTimeout(() => {
      _common_api__WEBPACK_IMPORTED_MODULE_9__.api.picksTeams(q).then(_ref5 => {
        let {
          data
        } = _ref5;
        if (this.teamQuery === q) this.teamResults = data;
        m.redraw();
      });
    }, 250);
  }
  open(match) {
    if (match.status === 'bye' || match.status === 'void') return;
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().modal.show(_components_MatchModal__WEBPACK_IMPORTED_MODULE_12__["default"], {
      tournament: this.tournament,
      match,
      onchange: data => this.set(data)
    });
  }
  run(request) {
    this.busy = true;
    return request.then(_ref6 => {
      let {
        data
      } = _ref6;
      this.busy = false;
      this.set(data);
    }, () => {
      this.busy = false;
      m.redraw();
    });
  }
}

flarum.reg.add('ernestdefoe-gauntlet', 'forum/pages/TournamentPage', TournamentPage);

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
//# sourceMappingURL=TournamentPage.js.map