function createRow( hook ) {
	return `
			<tr>
				<td>${ hook.hook }</td>
				<td>${ hook.title }</td>
				<td>${ hook.type }</td>
				<td><a href="${ hook.sourceUrl }">${ hook.source }</a></td>
				<td>${ hook.desc }</td>
			</tr>
		  `;
}

export const createTable = hooks => {
	const table = document.createElement( 'table' );
	const thead = document.createElement( 'thead' );
	const tbody = document.createElement( 'tbody' );

	thead.innerHTML = '<tr>\n' +
		'<th>Hook</th>' +
		'<th>Title</th>' +
		'<th>Type</th>' +
		'<th>Source</th>' +
		'<th>Description</th>' +
		'</tr>';

	hooks.forEach( hook => {
		const row = createRow( hook );
		tbody.innerHTML += row;
	} );

	table.appendChild( thead );
	table.appendChild( tbody );
	document.body.appendChild( table );
};