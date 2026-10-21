/******/ (() => { // webpackBootstrap
/******/ 	// runtime can't be in strict mode because a global variable is assign and maybe created.
/******/ 	var __webpack_modules__ = ({

/***/ "./src/common/TournamentModel.ts"
/*!***************************************!*\
  !*** ./src/common/TournamentModel.ts ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TournamentModel)
/* harmony export */ });
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/Model */ "flarum/common/Model");
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Model__WEBPACK_IMPORTED_MODULE_0__);


/** Only what a notification needs to name and link its tournament. */
class TournamentModel extends (flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default()) {
  title = (() => flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default().attribute('title'))();
  slug = (() => flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default().attribute('slug'))();
}
flarum.reg.add('ernestdefoe-gauntlet', 'common/TournamentModel', TournamentModel);

/***/ },

/***/ "./src/forum/index.tsx"
/*!*****************************!*\
  !*** ./src/forum/index.tsx ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   extend: () => (/* binding */ extenders),
/* harmony export */   extenders: () => (/* binding */ extenders)
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_extenders__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/extenders */ "flarum/common/extenders");
/* harmony import */ var flarum_common_extenders__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extenders__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_forum_components_IndexSidebar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/forum/components/IndexSidebar */ "flarum/forum/components/IndexSidebar");
/* harmony import */ var flarum_forum_components_IndexSidebar__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_IndexSidebar__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/forum/components/UserPage */ "flarum/forum/components/UserPage");
/* harmony import */ var flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/components/LinkButton */ "flarum/common/components/LinkButton");
/* harmony import */ var flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _common_TournamentModel__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/TournamentModel */ "./src/common/TournamentModel.ts");
/* harmony import */ var _notifications_TournamentNotification__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./notifications/TournamentNotification */ "./src/forum/notifications/TournamentNotification.tsx");








const TYPES = ['gauntletMatchReady', 'gauntletResultReported', 'gauntletDispute', 'gauntletAwaiting', 'gauntletStarted', 'gauntletCheckin', 'gauntletPromoted', 'gauntletFinished'];

/*
 * Everything here runs on every page for every visitor, so it is only the
 * wiring. The pages, the bracket, the editor and the styles are their own
 * chunks, fetched the first time someone opens a tournament page.
 */
const extenders = [new (flarum_common_extenders__WEBPACK_IMPORTED_MODULE_1___default().Store)().add('gauntlet-tournaments', _common_TournamentModel__WEBPACK_IMPORTED_MODULE_6__["default"]), TYPES.reduce((ext, type) => ext.add(type, _notifications_TournamentNotification__WEBPACK_IMPORTED_MODULE_7__["default"]), new (flarum_common_extenders__WEBPACK_IMPORTED_MODULE_1___default().Notification)()), new (flarum_common_extenders__WEBPACK_IMPORTED_MODULE_1___default().Routes)().add('gauntlet.index', '/tournaments', () => __webpack_require__.e(/*! import() | forum/pages/TournamentsPage */ "ernestdefoe-gauntlet:forum/pages/TournamentsPage").then(() => (__webpack_require__(/*! ./pages/TournamentsPage */ "./src/forum/pages/TournamentsPage.tsx")))).add('gauntlet.new', '/tournaments/new', () => __webpack_require__.e(/*! import() | forum/pages/EditorPage */ "ernestdefoe-gauntlet:forum/pages/EditorPage").then(() => (__webpack_require__(/*! ./pages/EditorPage */ "./src/forum/pages/EditorPage.tsx")))).add('gauntlet.tournament', '/tournaments/:id', () => __webpack_require__.e(/*! import() | forum/pages/TournamentPage */ "ernestdefoe-gauntlet:forum/pages/TournamentPage").then(() => (__webpack_require__(/*! ./pages/TournamentPage */ "./src/forum/pages/TournamentPage.tsx")))).add('gauntlet.edit', '/tournaments/:id/edit', () => __webpack_require__.e(/*! import() | forum/pages/EditorPage */ "ernestdefoe-gauntlet:forum/pages/EditorPage").then(() => (__webpack_require__(/*! ./pages/EditorPage */ "./src/forum/pages/EditorPage.tsx")))).add('user.tournaments', '/u/:username/tournaments', () => __webpack_require__.e(/*! import() | forum/pages/UserTournamentsPage */ "ernestdefoe-gauntlet:forum/pages/UserTournamentsPage").then(() => (__webpack_require__(/*! ./pages/UserTournamentsPage */ "./src/forum/pages/UserTournamentsPage.tsx"))))];

flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().initializers.add('ernestdefoe-gauntlet', () => {
  const t = key => flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans(`ernestdefoe-gauntlet.forum.${key}`);
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_2__.extend)((flarum_forum_components_IndexSidebar__WEBPACK_IMPORTED_MODULE_3___default().prototype), 'navItems', function (items) {
    if (!flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute('canViewTournaments') || flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute('gauntletShowNav') === false) return;
    items.add('tournaments', m((flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_5___default()), {
      href: flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().route('gauntlet.index'),
      icon: "fas fa-trophy"
    }, t('nav')), 4);
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_2__.extend)((flarum_forum_components_UserPage__WEBPACK_IMPORTED_MODULE_4___default().prototype), 'navItems', function (items) {
    const user = this.user;
    if (!user || !flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute('canViewTournaments')) return;
    items.add('tournaments', m((flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_5___default()), {
      href: flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().route('user.tournaments', {
        username: user.slug()
      }),
      icon: "fas fa-trophy"
    }, t('profile.nav')), 70);
  });

  // 🚨 By module name: NotificationGrid is in a lazy chunk in Flarum 2, so a
  // static import of it is undefined when initializers run.
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_2__.extend)('flarum/forum/components/NotificationGrid', 'notificationTypes', items => {
    if (!flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute('canViewTournaments')) return;
    items.add('gauntletMatchReady', {
      name: 'gauntletMatchReady',
      icon: 'fas fa-flag-checkered',
      label: t('settings.match_ready')
    });
    items.add('gauntletResultReported', {
      name: 'gauntletResultReported',
      icon: 'fas fa-clipboard-check',
      label: t('settings.result_reported')
    });
    items.add('gauntletCheckin', {
      name: 'gauntletCheckin',
      icon: 'fas fa-user-check',
      label: t('settings.checkin')
    });
    items.add('gauntletPromoted', {
      name: 'gauntletPromoted',
      icon: 'fas fa-arrow-up',
      label: t('settings.promoted')
    });
    items.add('gauntletStarted', {
      name: 'gauntletStarted',
      icon: 'fas fa-play',
      label: t('settings.started')
    });
    items.add('gauntletFinished', {
      name: 'gauntletFinished',
      icon: 'fas fa-trophy',
      label: t('settings.finished')
    });
    if (flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute('canCreateTournaments')) {
      items.add('gauntletDispute', {
        name: 'gauntletDispute',
        icon: 'fas fa-scale-balanced',
        label: t('settings.dispute')
      });
      items.add('gauntletAwaiting', {
        name: 'gauntletAwaiting',
        icon: 'fas fa-gavel',
        label: t('settings.awaiting')
      });
    }
  });
});flarum.reg.addChunkModule('ernestdefoe-gauntlet:forum/pages/TournamentsPage', './src/forum/pages/TournamentsPage.tsx', 'ernestdefoe-gauntlet', 'forum/pages/TournamentsPage');
flarum.reg.addChunkModule('ernestdefoe-gauntlet:forum/pages/TournamentsPage', './src/forum/pages/TournamentsPage.tsx', 'ernestdefoe-gauntlet', 'common/api');
flarum.reg.addChunkModule('ernestdefoe-gauntlet:forum/pages/TournamentsPage', './src/forum/pages/TournamentsPage.tsx', 'ernestdefoe-gauntlet', 'forum/components/bits');
flarum.reg.addChunkModule('ernestdefoe-gauntlet:forum/pages/TournamentsPage', './src/forum/pages/TournamentsPage.tsx', 'ernestdefoe-gauntlet', 'forum/styles');
flarum.reg.addChunkModule('ernestdefoe-gauntlet:forum/pages/EditorPage', './src/forum/pages/EditorPage.tsx', 'ernestdefoe-gauntlet', 'forum/pages/EditorPage');
flarum.reg.addChunkModule('ernestdefoe-gauntlet:forum/pages/TournamentPage', './src/forum/pages/TournamentPage.tsx', 'ernestdefoe-gauntlet', 'forum/pages/TournamentPage');
flarum.reg.addChunkModule('ernestdefoe-gauntlet:forum/pages/TournamentPage', './src/forum/pages/TournamentPage.tsx', 'ernestdefoe-gauntlet', 'forum/bracket/layout');
flarum.reg.addChunkModule('ernestdefoe-gauntlet:forum/pages/TournamentPage', './src/forum/pages/TournamentPage.tsx', 'ernestdefoe-gauntlet', 'forum/components/Bracket');
flarum.reg.addChunkModule('ernestdefoe-gauntlet:forum/pages/TournamentPage', './src/forum/pages/TournamentPage.tsx', 'ernestdefoe-gauntlet', 'forum/components/MatchModal');
flarum.reg.addChunkModule('ernestdefoe-gauntlet:forum/pages/UserTournamentsPage', './src/forum/pages/UserTournamentsPage.tsx', 'ernestdefoe-gauntlet', 'forum/pages/UserTournamentsPage');

/***/ },

/***/ "./src/forum/notifications/TournamentNotification.tsx"
/*!************************************************************!*\
  !*** ./src/forum/notifications/TournamentNotification.tsx ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TournamentNotification)
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_forum_components_Notification__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/components/Notification */ "flarum/forum/components/Notification");
/* harmony import */ var flarum_forum_components_Notification__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_Notification__WEBPACK_IMPORTED_MODULE_1__);


const ICONS = {
  gauntletMatchReady: 'fas fa-flag-checkered',
  gauntletResultReported: 'fas fa-clipboard-check',
  gauntletDispute: 'fas fa-scale-balanced',
  gauntletAwaiting: 'fas fa-gavel',
  gauntletStarted: 'fas fa-play',
  gauntletCheckin: 'fas fa-user-check',
  gauntletPromoted: 'fas fa-arrow-up',
  gauntletFinished: 'fas fa-trophy'
};

/** Every Gauntlet notification: the type picks the icon and the words. */
class TournamentNotification extends (flarum_forum_components_Notification__WEBPACK_IMPORTED_MODULE_1___default()) {
  type() {
    return this.attrs.notification.contentType() || '';
  }
  icon() {
    return ICONS[this.type()] || 'fas fa-trophy';
  }
  href() {
    const tournament = this.attrs.notification.subject();
    if (!tournament) return flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().route('gauntlet.index');
    const data = this.attrs.notification.content() || {};
    const id = tournament.id() + (tournament.slug() ? '-' + tournament.slug() : '');
    return flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().route('gauntlet.tournament', data.match ? {
      id,
      match: data.match
    } : {
      id
    });
  }
  content() {
    const tournament = this.attrs.notification.subject();
    const data = this.attrs.notification.content() || {};
    const from = this.attrs.notification.fromUser();

    // Not the shared `t` helper: that module brings the whole API client into
    // forum.js, which every page loads.
    return flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('ernestdefoe-gauntlet.forum.notifications.' + this.type(), {
      title: tournament?.title() ?? '',
      opponent: data.opponent ?? '',
      round: data.round ?? '',
      username: from ? from.displayName() : ''
    });
  }
  excerpt() {
    return null;
  }
}
flarum.reg.add('ernestdefoe-gauntlet', 'forum/notifications/TournamentNotification', TournamentNotification);

/***/ },

/***/ "flarum/common/Component"
/*!*************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/Component')" ***!
  \*************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/Component');

/***/ },

/***/ "flarum/common/Model"
/*!*********************************************************!*\
  !*** external "flarum.reg.get('core', 'common/Model')" ***!
  \*********************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/Model');

/***/ },

/***/ "flarum/common/app"
/*!*******************************************************!*\
  !*** external "flarum.reg.get('core', 'common/app')" ***!
  \*******************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/app');

/***/ },

/***/ "flarum/common/components/Button"
/*!*********************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/Button')" ***!
  \*********************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/Button');

/***/ },

/***/ "flarum/common/components/FormModal"
/*!************************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/FormModal')" ***!
  \************************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/FormModal');

/***/ },

/***/ "flarum/common/components/Link"
/*!*******************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/Link')" ***!
  \*******************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/Link');

/***/ },

/***/ "flarum/common/components/LinkButton"
/*!*************************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/LinkButton')" ***!
  \*************************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/LinkButton');

/***/ },

/***/ "flarum/common/components/LoadingIndicator"
/*!*******************************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/LoadingIndicator')" ***!
  \*******************************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/LoadingIndicator');

/***/ },

/***/ "flarum/common/components/Page"
/*!*******************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/Page')" ***!
  \*******************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/Page');

/***/ },

/***/ "flarum/common/components/Switch"
/*!*********************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/components/Switch')" ***!
  \*********************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/components/Switch');

/***/ },

/***/ "flarum/common/extend"
/*!**********************************************************!*\
  !*** external "flarum.reg.get('core', 'common/extend')" ***!
  \**********************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/extend');

/***/ },

/***/ "flarum/common/extenders"
/*!*************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/extenders')" ***!
  \*************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/extenders');

/***/ },

/***/ "flarum/common/utils/Stream"
/*!****************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/utils/Stream')" ***!
  \****************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/utils/Stream');

/***/ },

/***/ "flarum/common/utils/extractText"
/*!*********************************************************************!*\
  !*** external "flarum.reg.get('core', 'common/utils/extractText')" ***!
  \*********************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'common/utils/extractText');

/***/ },

/***/ "flarum/forum/app"
/*!******************************************************!*\
  !*** external "flarum.reg.get('core', 'forum/app')" ***!
  \******************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'forum/app');

/***/ },

/***/ "flarum/forum/components/IndexSidebar"
/*!**************************************************************************!*\
  !*** external "flarum.reg.get('core', 'forum/components/IndexSidebar')" ***!
  \**************************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'forum/components/IndexSidebar');

/***/ },

/***/ "flarum/forum/components/Notification"
/*!**************************************************************************!*\
  !*** external "flarum.reg.get('core', 'forum/components/Notification')" ***!
  \**************************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'forum/components/Notification');

/***/ },

/***/ "flarum/forum/components/PageStructure"
/*!***************************************************************************!*\
  !*** external "flarum.reg.get('core', 'forum/components/PageStructure')" ***!
  \***************************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'forum/components/PageStructure');

/***/ },

/***/ "flarum/forum/components/UserPage"
/*!**********************************************************************!*\
  !*** external "flarum.reg.get('core', 'forum/components/UserPage')" ***!
  \**********************************************************************/
(module) {

"use strict";
module.exports = flarum.reg.get('core', 'forum/components/UserPage');

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		flarum.reg._webpack_runtimes["ernestdefoe-gauntlet"] ||= __webpack_require__;// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		const getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	// define getter/value functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	__webpack_require__.f = {};
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = (chunkId) => {
/******/ 		return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 			__webpack_require__.f[key](chunkId, promises);
/******/ 			return promises;
/******/ 		}, []));
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	// This function allow to reference async chunks
/******/ 	__webpack_require__.u = (chunkId) => ({"ernestdefoe-gauntlet:forum/pages/TournamentsPage":"forum/pages/TournamentsPage","ernestdefoe-gauntlet:forum/pages/EditorPage":"forum/pages/EditorPage","ernestdefoe-gauntlet:forum/pages/TournamentPage":"forum/pages/TournamentPage","ernestdefoe-gauntlet:forum/pages/UserTournamentsPage":"forum/pages/UserTournamentsPage"}[chunkId] + ".js");
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	__webpack_require__.g = (function() {
/******/ 		if (typeof globalThis === 'object') return globalThis;
/******/ 		try {
/******/ 			return this || new Function('return this')();
/******/ 		} catch (e) {
/******/ 			if (typeof window === 'object') return window;
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop));
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		const inProgress = {};
/******/ 		const dataWebpackPrefix = "module.exports:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			let script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				const scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					const s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			const onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				const doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode?.removeChild(script);
/******/ 				doneFns?.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			const timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		let scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		const document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript?.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				const scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					let i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^https?:/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/^blob:|[?#].*$/g, "").replace(/\/[^/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	__webpack_require__.f.compat = (chunkId, promises) => {
/******/ 	
/******/ 		const originalLoadChunk = __webpack_require__.l;
/******/ 		__webpack_require__.l = flarum.reg.loadChunk.bind(flarum.reg, originalLoadChunk);
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		const installedChunks = {
/******/ 			"ernestdefoe-gauntlet:forum": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				let installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							const promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							const error = new Error();
/******/ 							const loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										const errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										const realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										error.event = event;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(__webpack_require__.p + __webpack_require__.u(chunkId), loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		const webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			let [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		const chunkLoadingGlobal = self["webpackChunk_ernestdefoe_gauntlet"] = self["webpackChunk_ernestdefoe_gauntlet"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!******************!*\
  !*** ./forum.ts ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   extend: () => (/* reexport safe */ _src_forum__WEBPACK_IMPORTED_MODULE_0__.extend),
/* harmony export */   extenders: () => (/* reexport safe */ _src_forum__WEBPACK_IMPORTED_MODULE_0__.extenders)
/* harmony export */ });
/* harmony import */ var _src_forum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/forum */ "./src/forum/index.tsx");

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=forum.js.map