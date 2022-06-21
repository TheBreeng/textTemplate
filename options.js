const toTopBtn = document.querySelector('.toTopBtn');

if ((/chrome/.test(navigator.userAgent.toLowerCase()))) {
	document.querySelector('body').style.width = '700px';
	document.querySelector('.help__wrapper').style.width = '710px';

	window.onscroll = () => {
		const scrolled = window.pageYOffset || document.documentElement.scrollTop;
		if (scrolled <= 200) {
			toTopBtn.style.display = 'none';
		} else {
			toTopBtn.style.display = 'block';
		}
	};
}

function switchLanguage(language) {
	function translateElement(element, translation) {
		if (element.includes('input') || element.includes('textarea')) {
			document.querySelector(element).setAttribute('placeholder', translation);
		} else {
			document.querySelector(element).innerText = translation;
		}
	}

	let helpText = [];

	if (language == 'en') {
		translateElement('header p', 'Add template');
		translateElement('form input[type="text"]', 'Abbreviation (maximum 16 characters)');
		translateElement('form textarea', 'Template');
		translateElement('form button[type="submit"]', 'Save');
		translateElement('form button[type="reset"]', 'Cancel');
		translateElement('.table__title', 'My templates');
		translateElement('table td:nth-child(2)', 'Abbreviation');
		translateElement('table td:nth-child(3)', 'Template');

		helpText.push(
			'How to use:',
			'In the "Abbreviation" field, write any text no longer than 16 characters, but you cannot use the word "currentLang". If the new abbreviation matches the previous one, it will be overwritten.',
			'You can write anything in the "Template" field. There are no restrictions on the length of the text. The text may be the same as the existing one.',
			'If the template text is too large, it will collapse. You can expand it by clicking the button <img src="/icons/show.svg">.',
			'You can edit the template by clicking the button <img src="/icons/edit.svg">.',
			'You can delete a template by clicking the button <img src="/icons/delete.png">.',
			'To apply the template, just enter "abbreviation*" in the input field and the template will automatically will be substituted. Register is respected. The "*" character at the end of the abbreviation is required.',
			'Example:'
		);

		trigger.checked = true;
	} else {
		translateElement('header p', 'Добавить шаблон');
		translateElement('form input[type="text"]', 'Сокращение (не более 16 символов)');
		translateElement('form textarea', 'Шаблон');
		translateElement('form button[type="submit"]', 'Сохранить');
		translateElement('form button[type="reset"]', 'Отменить');
		translateElement('.table__title', 'Мои шаблоны');
		translateElement('table td:nth-child(2)', 'Сокращение');
		translateElement('table td:nth-child(3)', 'Шаблон');

		helpText.push(
			'Как пользоваться:',
			'В поле "Сокращение" впишите любой текст длиной не более 16 символов, но нельзя использовать слово "currentLang". Если новое сокращение совпадет с предыдущим, то оно перезапишется.',
			'В поле "Шаблон" можно писать что угодно. Ограничений по длине текста нет. Текст может совпадать с существующим.',
			'Если текст шаблона слишком большой - он свернется. Развернуть можно нажав кнопку <img src="/icons/show.svg">.',
			'Отредактировать шаблон можно нажав кнопку <img src="/icons/edit.svg">.',
			'Удалить шаблон можно нажав кнопку <img src="/icons/delete.png">.',
			'Чтобы применить шаблон, достаточно вписать "сокращение*" в поле ввода и шаблон автоматически подставится. Регистр учитывается. Символ "*" в конце сокращения обязателен.',
			'Пример:'
		);

		trigger.checked = false;

		browser.storage.local.set({
			currentLang: 'ru'
		});
	}

	const helpWrapper = document.querySelector('.help__wrapper');
	helpText.forEach((text, i) => {
		helpWrapper.querySelectorAll('p')[i].innerHTML = text;
	});
}

document.addEventListener('click', event => {
	if (event.target.classList.contains('help__btn')) {
		document.querySelector('.help__wrapper').style.display = 'block';
	} else if (event.target.classList.contains('help__close')) {
		document.querySelector('.help__wrapper').style.display = 'none';
	}
});

const trigger = document.querySelector('.switch input[type="checkbox"]');
trigger.addEventListener('click', () => {
	browser.storage.local.get().then(res => {
		if (res.currentLang == 'ru') {
			browser.storage.local.set({
				currentLang: 'en'
			});
			switchLanguage('en');
			trigger.checked = true;
		} else {
			browser.storage.local.set({
				currentLang: 'ru'
			});
			switchLanguage('ru');
		}
	});
});

function newTemplate(e) {
	const keyInput = document.querySelector('#key'),
		templateInput = document.querySelector('#template'),
		keyValue = keyInput.value,
		templateValue = templateInput.value;

	function isFieldOk(field) {
		if (field.length == 0 || field == ' ' || field == undefined || keyValue.length > 16 || keyValue == 'currentLang') {
			return false;
		} else {
			return true;
		}
	}

	function showError(field) {
		field.style.borderColor = 'red';
		e.preventDefault();
	}

	if (isFieldOk(keyValue) && isFieldOk(templateValue)) {
		browser.storage.local.set({
			[`${keyValue.trim()}*`]: templateValue
		});
	} else if (!isFieldOk(keyValue)) {
		showError(keyInput);
	} else if (!isFieldOk(templateValue)) {
		showError(templateInput);
	}
}

function scrollToTop() {
	document.querySelector('body').scrollIntoView({
		block: "start",
		behavior: "smooth"
	});
}

function renderTable() {
	let num = 1;

	browser.storage.local.get().then(res => {

		Object.keys(res).forEach(item => {
			if (item != 'currentLang') {
				const newRow = document.createElement('tr');

				let text;
				if (res[item].length > 150) {
					text = `${res[item].slice(0, 150)}...`;
				} else {
					text = res[item];
				}

				newRow.innerHTML = `
					<td>${num++}</td>
					<td></td>
					<td></td>
					<td>
						<div class="tools">
							<img src="/icons/show.svg" class="show">
							<img src="/icons/edit.svg" class="edit">
							<img src="/icons/delete.png" class="delete">
						</div>
					</td>
				`;

				newRow.querySelector('td:nth-child(2)').innerText = item;
				newRow.querySelector('td:nth-child(3)').innerText = text;

				document.querySelector('table').append(newRow);

				newRow.addEventListener('click', e => {
					const targetClass = e.target.classList;
					switch (true) {
						case targetClass.contains('delete'):
							browser.storage.local.remove(item);
							location.reload();
							break;

						case targetClass.contains('edit'):
							document.querySelector('#key').value = item.slice(0, -1);
							document.querySelector('#template').value = res[item];

							scrollToTop();

							const submitBtn = document.querySelector('button[type="submit"]');

							function replace() {
								browser.storage.local.remove(item);

								newTemplate();
							}

							submitBtn.addEventListener('click', replace);

							document.querySelector('button[type="reset"]').addEventListener('click', () => {
								submitBtn.removeEventListener('click', replace);
							});
							break;

						case targetClass.contains('show'):
							targetClass.toggle('rotate');

							if (targetClass.contains('rotate') && res[item].length > 150) {
								e.target.parentElement.parentElement.previousElementSibling.textContent = res[item];
							} else if (res[item].length > 150) {
								e.target.parentElement.parentElement.previousElementSibling.textContent = `${res[item].slice(0, 150)}...`;
							}
							break;
						default:
							break;
					}
				});
			}
		});
	});
}

toTopBtn.onclick = scrollToTop;

document.addEventListener('DOMContentLoaded', () => {
	browser.storage.local.get().then(res => {
		switchLanguage(res.currentLang);
	});
});
document.addEventListener('DOMContentLoaded', renderTable);
document.querySelector('form').addEventListener('submit', newTemplate);