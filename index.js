let limit = 10;
let todos = [];
let page = 1;
let keyword = '';

window.addEventListener('load', function () {
	getTodos();
});

const getTodos = async () => {
	document.getElementById('loading-state').classList.remove('hidden');

	try {
		const response = await fetch('https://jsonplaceholder.typicode.com/todos');
		const result = await response.json();
		todos = result;

		renderTodoToDOM(result);
		document.getElementById('loading-state').classList.add('hidden');
	} catch (err) {
		console.error(err);
	}
};

const getUserInformation = async (datas) => {
	try {
		const userIds = datas.map((todo) =>
			fetch(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)
		);
		const result = await Promise.all(userIds);
		const results = result.map((res) => res.json());
		const users = await Promise.all(results);

		datas = datas.map((data, index) => ({ ...data, ...users[index] }));

		return datas;
	} catch (err) {
		console.error(err);
	}
};

const renderTodoToDOM = async (todos) => {
	let dataToRender = todos;

	if (keyword && keyword !== '') {
		dataToRender = todos.filter((todo) => {
			if (todo.title.toLowerCase().includes(keyword.toLowerCase())) return todo;
		});
	}

	dataToRender = dataToRender.slice((page - 1) * limit, page * limit);
	dataToRender = await getUserInformation(dataToRender);

	const todoEl = dataToRender.reduce((prev, current) => {
		return (prev += `
			<div class="todo-list-item drop-shadow-md bg-neutral-50 p-5">
				<div class="grid grid-rows-1 justify-center text-center text-lg">
					${toTitleCase(current.title)}
				</div>
				
				<div class="grid grid-rows-1 justify-center text-center text-sm">
					${
						current.completed
							? `
								<div class="text-green-500">
									Complete
								</div>
								`
							: `
								<div class="text-red-500">
									Not complete
								</div>
							
							`
					}
				</div>

				<div class="mt-3 text-sm">
					Author: ${current.name}
					Author email: ${current.email}
					Author phone: ${current.phone}
				</div>
			</div>
		`);
	}, '');

	document.getElementById('todo-list').innerHTML = todoEl;
	document.getElementById('page-indicator').innerHTML = page;

	if (page === 1) {
		document.getElementById('previous-button').classList.add('disabled');
		document.getElementById('previous-button').classList.add('cursor-none');
	} else {
		document.getElementById('previous-button').classList.remove('disabled');
		document.getElementById('previous-button').classList.remove('cursor-none');
	}
};

const next = () => {
	page += 1;
	renderTodoToDOM(todos);
};

const previous = () => {
	if (page !== 1) page -= 1;
	renderTodoToDOM(todos);
};

const toTitleCase = (str = ' ') => {
	const text = str.replace(/[^a-zA-Z0-9]/g, ' ');

	return text.replace(/\w\S*/g, (txt) => {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

const searchTodo = (e) => {
	keyword = e.target.value;
	renderTodoToDOM(todos);
};

const changePageLimit = (e) => {
	limit = e.target.value;
	renderTodoToDOM(todos);
};
