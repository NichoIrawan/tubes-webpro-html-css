// DesignQuiz.js — lightweight quiz logic
(function(){
	const questions = [
		{
			text: 'Gaya desain apa yang paling Anda sukai?',
			options: [
				{label:'Minimalis Modern', value:'minimal'},
				{label:'Klasik Elegan', value:'klasik'},
				{label:'Industrial', value:'industrial'},
				{label:'Skandinavia', value:'skandinavia'}
			]
		},
		{
			text: 'Bentuk furniture yang Anda sukai?',
			options: [
				{label:'Sederhana & fungsional', value:'minimal'},
				{label:'Berornamen & mewah', value:'klasik'},
				{label:'Kasar & logam', value:'industrial'},
				{label:'Hangat & natural', value:'skandinavia'}
			]
		},
		{
			text: 'Palet warna pilihan Anda?',
			options: [
				{label:'Netral (putih, abu, kayu terang)', value:'minimal'},
				{label:'Warna hangat & klasik', value:'klasik'},
				{label:'Gelap / beton / hitam', value:'industrial'},
				{label:'Pastel & natural', value:'skandinavia'}
			]
		},
		{
			text: 'Prioritas utama saat mendesain ruang?',
			options: [
				{label:'Kesederhanaan & efisiensi', value:'minimal'},
				{label:'Kemewahan & detail', value:'klasik'},
				{label:'Daya tahan & bahan mentah', value:'industrial'},
				{label:'Kenyamanan & fungsi', value:'skandinavia'}
			]
		},
		{
			text: 'Gaya pencahayaan yang Anda suka?',
			options: [
				{label:'Pencahayaan tersembunyi natural', value:'minimal'},
				{label:'Lampu chandelier atau aksen', value:'klasik'},
				{label:'Lampu metal exposed', value:'industrial'},
				{label:'Lampu hangat dan lembut', value:'skandinavia'}
			]
		}
	];

	const stylesMap = {
		minimal:{
			title:'Minimalis Modern',
			desc:'Desain clean dengan garis simpel dan fungsional. Cocok untuk Anda yang menyukai kesederhanaan dan efisiensi.',
			chars:['Garis bersih dan simpel','Warna netral','Furniture fungsional','Ruang terbuka']
		},
		klasik:{
			title:'Klasik Elegan',
			desc:'Gaya yang menonjolkan detail dan kemewahan, cocok untuk yang menyukai keanggunan dan ornamen.',
			chars:['Detail ornamen','Material mewah','Warna hangat','Aksen dekoratif']
		},
		industrial:{
			title:'Industrial',
			desc:'Estetika kasar dan jujur pada material, cocok untuk ruang yang terinspirasi pabrik atau loft.',
			chars:['Material mentah','Warna gelap','Aksen logam','Tekstur beton']
		},
		skandinavia:{
			title:'Skandinavia',
			desc:'Hangat, fungsional, dan cerah — fokus pada kenyamanan dan palet natural.',
			chars:['Kayu terang','Warna pastel','Furnitur ergonomis','Pencahayaan maksimal']
		}
	};

	// state
	let current = 0;
	const answers = new Array(questions.length).fill(null);

	// elements
	const qTitle = document.getElementById('question-title');
	const optionsEl = document.getElementById('options');
	const prevBtn = document.getElementById('prevBtn');
	const nextBtn = document.getElementById('nextBtn');
	const progressText = document.getElementById('progress-text');
	const progressPercent = document.getElementById('progress-percent');
	const progressFill = document.getElementById('progress-fill');

	const infoModal = document.getElementById('infoModal');
	const closeModal = document.getElementById('closeModal');
	const cancelModal = document.getElementById('cancelModal');
	const showResultBtn = document.getElementById('showResultBtn');
	const userName = document.getElementById('userName');
	const userEmail = document.getElementById('userEmail');

	const resultScreen = document.getElementById('resultScreen');
	const resultTitle = document.getElementById('resultTitle');
	const resultDesc = document.getElementById('resultDesc');
	const resultChars = document.getElementById('resultChars');
	const retakeBtn = document.getElementById('retakeBtn');

	// init
	function renderQuestion(){
		const q = questions[current];
		qTitle.textContent = q.text;
		optionsEl.innerHTML = '';
		q.options.forEach((opt, idx)=>{
			const btn = document.createElement('button');
			btn.className = 'option';
			btn.type = 'button';
			btn.setAttribute('role','listitem');
			btn.dataset.value = opt.value;
			btn.innerHTML = `<span class="label">${opt.label}</span><span class="check">✓</span>`;
			if(answers[current] === opt.value) btn.classList.add('selected');
			btn.addEventListener('click', ()=>{
				// mark selection
				answers[current] = opt.value;
				// update visuals
				Array.from(optionsEl.children).forEach(c=>c.classList.remove('selected'));
				btn.classList.add('selected');
				nextBtn.disabled = false;
			});
			optionsEl.appendChild(btn);
		});

		// update nav
		prevBtn.disabled = current === 0;
		nextBtn.disabled = answers[current] === null;
		updateProgress();
	}

	function updateProgress(){
		const total = questions.length;
		const pct = Math.round(((current)/total)*100);
		progressText.textContent = `Pertanyaan ${current+1} dari ${total}`;
		const percentValue = Math.round(((current+1)/total)*100);
		progressPercent.textContent = percentValue + '%';
		progressFill.style.width = percentValue + '%';
	}

	prevBtn.addEventListener('click', ()=>{
		if(current>0){
			current--;
			renderQuestion();
		}
	});

	nextBtn.addEventListener('click', ()=>{
		if(current < questions.length -1){
			current++;
			renderQuestion();
			return;
		}

		// final: show modal to collect user info
		openModal();
	});

	function openModal(){
		infoModal.setAttribute('aria-hidden','false');
		infoModal.style.display = 'flex';
		userName.focus();
	}
	function closeModalFn(){
		infoModal.setAttribute('aria-hidden','true');
		infoModal.style.display = 'none';
	}

	closeModal.addEventListener('click', closeModalFn);
	cancelModal.addEventListener('click', ()=>{ closeModalFn(); });

	showResultBtn.addEventListener('click', ()=>{
		const name = userName.value.trim();
		const email = userEmail.value.trim();
		if(!name){ userName.focus(); return; }
		if(email && !/^\S+@\S+\.\S+$/.test(email)){ userEmail.focus(); return; }
		closeModalFn();
		showResult();
	});

	function showResult(){
		const tally = {};
		answers.forEach(v=>{ if(!v) return; tally[v] = (tally[v]||0)+1 });
		// choose style with max count
		let winner = null; let best = -1;
		Object.keys(stylesMap).forEach(k=>{ const c = tally[k]||0; if(c>best){best=c; winner=k}});
		if(!winner){ winner = questions[0].options[0].value }

		const style = stylesMap[winner];
		resultTitle.textContent = style.title;
		resultDesc.textContent = style.desc;
		resultChars.innerHTML = '';
		style.chars.forEach(ch=>{
			const el = document.createElement('div'); el.className='char-item';
			el.innerHTML = `<span class="tick">✓</span><span>${ch}</span>`;
			resultChars.appendChild(el);
		});

		// show result screen
		resultScreen.setAttribute('aria-hidden','false');
		document.querySelector('.quiz-card').style.display = 'none';
		progressFill.style.width = '100%';
		progressPercent.textContent = '100%';
	}

	retakeBtn.addEventListener('click', ()=>{
		// reset
		current = 0;
		for(let i=0;i<answers.length;i++) answers[i]=null;
		document.querySelector('.quiz-card').style.display = '';
		resultScreen.setAttribute('aria-hidden','true');
		renderQuestion();
	});

	// initial render
	renderQuestion();

	// keyboard: allow Enter to select focused option
	optionsEl.addEventListener('keydown', (e)=>{
		const focused = document.activeElement;
		if(e.key === 'Enter' && focused && focused.classList.contains('option')){
			focused.click();
		}
	});

})();

