require.config({
    paths: {
    	network_tools_cell_renderer: '../app/network_tools/NetworkToolsCellRenderer'
    }
});


require(['jquery','underscore','splunkjs/mvc', 'splunkjs/mvc/tokenutils', 'network_tools_cell_renderer', 'bootstrap.tab', 'splunkjs/mvc/simplexml/ready!'],
		function($, _, mvc, TokenUtils, NetworkToolsCellRenderer){
	
	// Setup the cell renderer
    var resultsTable = mvc.Components.get('element2');
    
    resultsTable.getVisualization(function(tableView){
        tableView.table.addCellRenderer(new NetworkToolsCellRenderer());
        tableView.table.render();
    });
	
	// Handle a click event from the execute button and force the search command to execute.
	$( "#execute_input" ).click(function() {
		
		// This will contain the parameters
		var params = {
				'host' : ''
		};
		
		// Get the host to use
		var host_input = mvc.Components.getInstance("host_input");
		
		if(host_input && host_input.val()){
			params['host'] = host_input.val();
		}
		
		// Kick off the search
		var tokens = mvc.Components.getInstance("submitted");
		tokens.set('whois_search', null);
		tokens.set('whois_search', TokenUtils.replaceTokenNames('| whois $host$', params ));
	});
	
	// By default, show the most recent whois result. To do this, we will set the whois search token to be a historical search.
	var tokens = mvc.Components.getInstance("submitted");
	tokens.set('whois_search', '| search sourcetype=whois | head 1 | fields * | fields - _* date_* host source sourcetype time index linecount splunk_server raw | eval row="value" | transpose column_name=attribute header_field=row | regex value=".+"');
	
});