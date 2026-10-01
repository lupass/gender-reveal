(() => {
	const pages = ['p1.jpg', 'p2.jpg', 'p3.jpg', 'p4.jpg', 'p5.jpg', 'p6.jpg'];
	const storageKey = 'cuento-revelacion-piedras';
	const colors = ['#f2c86b', '#f48a72', '#93c4a0', '#8db9e2', '#f4d8e7', '#fffaf0'];
	const viewer = document.querySelector('#comic-viewer');
	const pageImage = document.querySelector('#comic-page-image');
	const backdropImage = document.querySelector('#comic-backdrop-image');
	const counter = document.querySelector('#comic-counter');
	const reveal = document.querySelector('#comic-reveal');
	let currentPage = 0;
	let isTurning = false;
	let revealTimer;
	let touchStartX = null;
	let suppressClick = false;

	pages.slice(1).forEach((source) => {
		const image = new Image();
		image.src = source;
	});

	function showReveal() {
		localStorage.setItem(storageKey, 'Petra y Pedro');
		document.querySelector('#reveal-label').textContent = '¡Son dos piedras de vesícula!';
		document.querySelector('#reveal-name-petra').textContent = 'Petra';
		document.querySelector('#reveal-name-pedro').textContent = 'Pedro';
		reveal.setAttribute('aria-hidden', 'false');
		reveal.classList.add('is-visible');
		launchConfetti('#ec7890');
	}

	function scheduleReveal() {
		window.clearTimeout(revealTimer);
		if (currentPage === pages.length - 1) revealTimer = window.setTimeout(showReveal, 700);
	}

	function turnPage(direction) {
		if (isTurning) return;
		const nextIndex = currentPage + direction;
		if (nextIndex < 0 || nextIndex >= pages.length) return;
		isTurning = true;
		window.clearTimeout(revealTimer);
		viewer.classList.add('is-turning');
		if (direction < 0) {
			reveal.classList.remove('is-visible');
			reveal.setAttribute('aria-hidden', 'true');
		}

		window.setTimeout(() => {
			currentPage = nextIndex;
			pageImage.src = pages[currentPage];
			pageImage.alt = `Página ${currentPage + 1} del cómic`;
			backdropImage.src = pages[currentPage];
			counter.textContent = `${currentPage + 1} / ${pages.length}`;
			viewer.classList.remove('is-turning');
			window.setTimeout(() => { isTurning = false; }, 320);
			scheduleReveal();
		}, 180);
	}

	function launchConfetti(accent) {
		const amount = window.matchMedia('(max-width: 650px)').matches ? 90 : 140;
		for (let index = 0; index < amount; index += 1) {
			const piece = document.createElement('i');
			piece.className = 'confetti-piece';
			piece.setAttribute('aria-hidden', 'true');
			piece.style.left = `${Math.random() * 100}vw`;
			piece.style.backgroundColor = Math.random() < .3 ? accent : colors[Math.floor(Math.random() * colors.length)];
			piece.style.setProperty('--fall-time', `${2.7 + Math.random() * 2.2}s`);
			piece.style.setProperty('--drift', `${Math.round((Math.random() - .5) * 220)}px`);
			piece.style.setProperty('--spin', `${Math.round(Math.random() * 800 - 400)}deg`);
			piece.style.animationDelay = `${Math.random() * 700}ms`;
			viewer.append(piece);
			window.setTimeout(() => piece.remove(), 6000);
		}
	}

	document.querySelector('#comic-next').addEventListener('click', () => turnPage(1));
	document.querySelector('#comic-previous').addEventListener('click', () => turnPage(-1));
	viewer.addEventListener('pointerdown', (event) => {
		touchStartX = event.clientX;
	}, { capture: true, passive: true });
	viewer.addEventListener('pointerup', (event) => {
		if (touchStartX === null) return;
		const distance = event.clientX - touchStartX;
		touchStartX = null;
		if (Math.abs(distance) < 55) return;
		suppressClick = true;
		window.setTimeout(() => { suppressClick = false; }, 500);
		turnPage(distance < 0 ? 1 : -1);
	}, { capture: true, passive: true });
	viewer.addEventListener('click', (event) => {
		if (!suppressClick) return;
		event.preventDefault();
		event.stopImmediatePropagation();
	}, true);
	document.addEventListener('keydown', (event) => {
		if (event.key === 'ArrowRight' || event.key === 'PageDown') turnPage(1);
		if (event.key === 'ArrowLeft' || event.key === 'PageUp') turnPage(-1);
	});

	scheduleReveal();
})();