// 최소 서비스 워커: 껍데기(아이콘·매니페스트)만 캐시, 미션 보드 본체는 항상 네트워크
var CACHE = 'mission-board-shell-v1';
var SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) { return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.mode === 'navigate' || SHELL.some(function (p) { return e.request.url.endsWith(p.replace('./', '/')); })) {
    e.respondWith(fetch(e.request).catch(function () { return caches.match(e.request); }));
  }
});
