let limit = 10;
let todos = [];
let page = 1;

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

const renderTodoToDOM = (todos) => {
	const slicedTodos = todos.slice(page - 1, page - 1 + limit);
	console.log(slicedTodos);

	const todoEl = slicedTodos.reduce((prev, current) => {
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
			</div>
		`);
	}, '');

	document.getElementById('todo-list').innerHTML = todoEl;
	document.getElementById('page-indicator').innerHTML = page;

	if (page === 1) {
		document.getElementById('previous-button').classList.add('disabled');
	} else {
		document.getElementById('previous-button').classList.remove('disabled');
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
