document.addEventListener('input', event => {
	const target = event.target;

	if (target.tagName == 'TEXTAREA' || target.tagName == 'INPUT') {
		browser.storage.local.get().then(data => {
			Object.keys(data).forEach(item => {

				if (target.value.includes(item) && !target.value.includes('currentLang')) {
					target.value = target.value.replace(item, data[item]);
				}
			});
		});

	} else {
		browser.storage.local.get().then(data => {
			Object.keys(data).forEach(item => {

				target.querySelectorAll('*').forEach(element => {
					if (element.innerText.includes(item)) {
						element.innerHTML = element.innerHTML.replace(item, data[item]);
					}
				});
			});
		});
	}
});