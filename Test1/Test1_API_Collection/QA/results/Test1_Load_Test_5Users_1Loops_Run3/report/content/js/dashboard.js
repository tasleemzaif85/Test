/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9666666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get User By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Post"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Recipe"], "isController": false}, {"data": [1.0, 500, 1500, "Get Quote By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Product"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Update User (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Update User (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Login (alias: /user/login)"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Update Todo (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Update Recipe (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Users"], "isController": false}, {"data": [1.0, 500, 1500, "Delete User"], "isController": false}, {"data": [1.0, 500, 1500, "Get Random Quote"], "isController": false}, {"data": [1.0, 500, 1500, "Update Comment (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Generate 2FA TOTP Code"], "isController": false}, {"data": [1.0, 500, 1500, "Get Product Categories"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Quotes"], "isController": false}, {"data": [0.8, 500, 1500, "Update Product (PUT)"], "isController": false}, {"data": [0.8, 500, 1500, "Get Todo By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Caller IP Address"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes By Meal Type"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Recipes"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products By Category"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - PATCH"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Get Product By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New User"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - PUT"], "isController": false}, {"data": [1.0, 500, 1500, "Get User's Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get User's Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Filter Users"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Carts"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Update Post (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipe By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts By User Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Carts - Paginated"], "isController": false}, {"data": [0.8, 500, 1500, "Get Recipe Tags"], "isController": false}, {"data": [1.0, 500, 1500, "Get Authenticated User (alias: /user/me)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Square Image"], "isController": false}, {"data": [1.0, 500, 1500, "Get Authenticated User (me)"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Product"], "isController": false}, {"data": [1.0, 500, 1500, "Get Random Todo"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - PATCH"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Comments"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Image With Background Color"], "isController": false}, {"data": [1.0, 500, 1500, "Get User's Carts"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Image - Custom Format"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - POST"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - DELETE"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - GET"], "isController": false}, {"data": [1.0, 500, 1500, "Search Products"], "isController": false}, {"data": [0.9, 500, 1500, "Create Custom Mock Response"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Todo"], "isController": false}, {"data": [1.0, 500, 1500, "Get Quotes - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - GET"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Tags"], "isController": false}, {"data": [1.0, 500, 1500, "Search Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comments For Post"], "isController": false}, {"data": [1.0, 500, 1500, "Search Users"], "isController": false}, {"data": [1.0, 500, 1500, "Update Comment (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Cart By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comment By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Recipe"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Comment"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Tag List"], "isController": false}, {"data": [1.0, 500, 1500, "Get Carts By User Id"], "isController": false}, {"data": [0.7, 500, 1500, "Login (get access + refresh token)"], "isController": false}, {"data": [1.0, 500, 1500, "Update Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - DELETE"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Image With Text + Colors"], "isController": false}, {"data": [1.0, 500, 1500, "Update Todo (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 201 Created - POST"], "isController": false}, {"data": [1.0, 500, 1500, "Refresh Token"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts By Tag"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes By Tag"], "isController": false}, {"data": [1.0, 500, 1500, "Update Recipe (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Users - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comments By Post Id"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - PUT"], "isController": false}, {"data": [0.8, 500, 1500, "Add New Todo"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Identicon"], "isController": false}, {"data": [0.8, 500, 1500, "Get Recipes - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Get Product Category List"], "isController": false}, {"data": [0.4, 500, 1500, "Get Todos By User Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Products"], "isController": false}, {"data": [1.0, 500, 1500, "Update Product (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comments - Paginated"], "isController": false}, {"data": [0.0, 500, 1500, "Get Products - Simulate Delay (perf testing)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Users - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Sized Image"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Post"], "isController": false}, {"data": [1.0, 500, 1500, "Get Users - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Comment"], "isController": false}, {"data": [0.4, 500, 1500, "Search Recipes"], "isController": false}, {"data": [1.0, 500, 1500, "Update Post (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Todos - Paginated"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 540, 0, 0.0, 247.62777777777774, 6, 2900, 182.0, 200.0, 272.34999999999775, 2610.2000000000025, 3.9019878460304502, 25.063765775050403, 2.2032301707661626], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get User By Id", 5, 0, 0.0, 180.2, 178, 184, 180.0, 184.0, 184.0, 184.0, 1.3888888888888888, 3.371853298611111, 0.7310655381944444], "isController": false}, {"data": ["Add New Post", 5, 0, 0.0, 179.2, 177, 183, 178.0, 183.0, 183.0, 183.0, 1.3664935774801859, 1.5501161519540858, 0.9407988009018858], "isController": false}, {"data": ["Delete Recipe", 5, 0, 0.0, 182.4, 178, 191, 181.0, 191.0, 191.0, 191.0, 1.375515818431912, 2.5326147696011008, 0.7562650447042641], "isController": false}, {"data": ["Get Quote By Id", 5, 0, 0.0, 180.0, 177, 184, 179.0, 184.0, 184.0, 184.0, 1.3358268768367618, 1.5048924659364147, 0.7044399545818862], "isController": false}, {"data": ["Add New Product", 5, 0, 0.0, 183.0, 178, 193, 181.0, 193.0, 193.0, 193.0, 1.443418013856813, 1.7146227266166283, 1.6393507325346421], "isController": false}, {"data": ["Get Recipes - Paginated", 5, 0, 0.0, 184.4, 180, 193, 183.0, 193.0, 193.0, 193.0, 1.8005041411595246, 17.031643860280877, 0.9758591780698596], "isController": false}, {"data": ["Update User (PUT)", 5, 0, 0.0, 180.8, 177, 185, 181.0, 185.0, 185.0, 185.0, 1.3770311209033324, 3.343603690443404, 0.7880275750481961], "isController": false}, {"data": ["Update User (PATCH)", 5, 0, 0.0, 180.6, 178, 185, 179.0, 185.0, 185.0, 185.0, 1.375894331315355, 3.3330502717391304, 0.8142499656026417], "isController": false}, {"data": ["Login (alias: /user/login)", 5, 0, 0.0, 185.2, 181, 194, 184.0, 194.0, 194.0, 194.0, 1.3513513513513513, 3.83472339527027, 0.855152027027027], "isController": false}, {"data": ["Get All Posts", 5, 0, 0.0, 7.8, 6, 9, 8.0, 9.0, 9.0, 9.0, 1.443001443001443, 22.143026244588746, 0.756730248917749], "isController": false}, {"data": ["Get Recipes - Sorted", 5, 0, 0.0, 185.8, 181, 195, 184.0, 195.0, 195.0, 195.0, 1.808972503617945, 50.81799475397975, 0.9910484126266281], "isController": false}, {"data": ["Update Todo (PUT)", 5, 0, 0.0, 179.4, 178, 181, 179.0, 181.0, 181.0, 181.0, 1.3426423200859292, 1.4942140507518795, 0.7683480464554242], "isController": false}, {"data": ["Update Recipe (PUT)", 5, 0, 0.0, 181.4, 176, 192, 180.0, 192.0, 192.0, 192.0, 1.363884342607747, 2.429418985270049, 0.8777341618930715], "isController": false}, {"data": ["Get All Users", 5, 0, 0.0, 8.8, 8, 11, 8.0, 11.0, 11.0, 11.0, 1.4484356894553883, 60.81958828215527, 0.7595800441772885], "isController": false}, {"data": ["Delete User", 5, 0, 0.0, 181.2, 178, 185, 181.0, 185.0, 185.0, 185.0, 1.3747594171020072, 3.413269865273577, 0.7531640947209238], "isController": false}, {"data": ["Get Random Quote", 5, 0, 0.0, 180.2, 177, 187, 179.0, 187.0, 187.0, 187.0, 1.3326226012793176, 1.5385023820628998, 0.7092571461886994], "isController": false}, {"data": ["Update Comment (PUT)", 5, 0, 0.0, 179.8, 178, 183, 180.0, 183.0, 183.0, 183.0, 1.3601741022850926, 1.576951849836779, 0.8208863234494015], "isController": false}, {"data": ["Generate 2FA TOTP Code", 5, 0, 0.0, 181.2, 178, 184, 182.0, 184.0, 184.0, 184.0, 1.3301409949454641, 1.4114562549880287, 0.722224993349295], "isController": false}, {"data": ["Get Product Categories", 5, 0, 0.0, 184.2, 180, 193, 182.0, 193.0, 193.0, 193.0, 1.4265335235378032, 4.984787357346648, 0.7675976283880172], "isController": false}, {"data": ["Get All Todos", 5, 0, 0.0, 181.0, 179, 183, 181.0, 183.0, 183.0, 183.0, 1.3561160835367507, 4.671449094792514, 0.7111663445890969], "isController": false}, {"data": ["Get All Quotes", 5, 0, 0.0, 181.2, 178, 184, 181.0, 184.0, 184.0, 184.0, 1.339405304045004, 6.464723412804714, 0.7037109898205197], "isController": false}, {"data": ["Update Product (PUT)", 5, 0, 0.0, 397.2, 184, 718, 186.0, 718.0, 718.0, 718.0, 1.4463407578825573, 2.2288337069713626, 0.8418155192363321], "isController": false}, {"data": ["Get Todo By Id", 5, 0, 0.0, 655.4, 177, 2563, 178.0, 2563.0, 2563.0, 2563.0, 0.823045267489712, 0.9156378600823045, 0.4332240226337448], "isController": false}, {"data": ["Get Caller IP Address", 5, 0, 0.0, 183.6, 179, 192, 182.0, 192.0, 192.0, 192.0, 1.3877324451845685, 1.51403778101582, 0.7236807868442964], "isController": false}, {"data": ["Get Products - Field Selection", 5, 0, 0.0, 186.2, 181, 195, 184.0, 195.0, 195.0, 195.0, 1.411631846414455, 4.544241424336533, 0.7830145398080182], "isController": false}, {"data": ["Get Recipes By Meal Type", 5, 0, 0.0, 218.2, 181, 349, 183.0, 349.0, 349.0, 349.0, 1.3513513513513513, 33.09860641891892, 0.7337415540540541], "isController": false}, {"data": ["Get All Recipes", 5, 0, 0.0, 185.8, 181, 195, 184.0, 195.0, 195.0, 195.0, 1.7863522686673812, 49.65291733654877, 0.9402772195426938], "isController": false}, {"data": ["Get Products By Category", 5, 0, 0.0, 184.2, 180, 192, 183.0, 192.0, 192.0, 192.0, 1.4376078205865441, 11.902662719235192, 0.7805761213341], "isController": false}, {"data": ["Mock 200 OK - PATCH", 5, 0, 0.0, 185.6, 180, 194, 181.0, 194.0, 194.0, 194.0, 1.1668611435239205, 1.2217856621936989, 0.6745915985997666], "isController": false}, {"data": ["Get Posts - Sorted", 5, 0, 0.0, 183.4, 180, 189, 181.0, 189.0, 189.0, 189.0, 1.3713658804168953, 18.224702585024684, 0.7499657158529895], "isController": false}, {"data": ["Get Product By Id", 5, 0, 0.0, 8.2, 8, 9, 8.0, 9.0, 9.0, 9.0, 1.4952153110047848, 3.801993776166268, 0.7914127915669856], "isController": false}, {"data": ["Add New User", 5, 0, 0.0, 179.6, 178, 182, 179.0, 182.0, 182.0, 182.0, 1.380071763731714, 2.4536705596191, 0.8531107680099365], "isController": false}, {"data": ["Test Route - PUT", 5, 0, 0.0, 183.0, 178, 192, 182.0, 192.0, 192.0, 192.0, 1.3732491073880801, 1.444057264487778, 0.7912275130458665], "isController": false}, {"data": ["Get User's Todos", 5, 0, 0.0, 179.6, 176, 183, 179.0, 183.0, 183.0, 183.0, 1.3815971262779772, 1.6506307854379663, 0.7353226892788063], "isController": false}, {"data": ["Get User's Posts", 5, 0, 0.0, 179.4, 177, 183, 179.0, 183.0, 183.0, 183.0, 1.3831258644536653, 2.227048755186722, 0.7361363243430151], "isController": false}, {"data": ["Filter Users", 5, 0, 0.0, 183.4, 181, 186, 182.0, 186.0, 186.0, 186.0, 1.3846579894765993, 44.595993578648574, 0.7721090937413458], "isController": false}, {"data": ["Get All Carts", 5, 0, 0.0, 187.0, 183, 196, 184.0, 196.0, 196.0, 196.0, 1.725327812284334, 52.45030247153209, 0.904786167184265], "isController": false}, {"data": ["Get Posts - Field Selection", 5, 0, 0.0, 183.0, 181, 189, 182.0, 189.0, 189.0, 189.0, 1.3706140350877192, 5.943432188870614, 0.7589239823190789], "isController": false}, {"data": ["Update Post (PUT)", 5, 0, 0.0, 180.4, 177, 185, 179.0, 185.0, 185.0, 185.0, 1.365001365001365, 1.9853838213213215, 0.8211336336336337], "isController": false}, {"data": ["Get Posts - Paginated", 5, 0, 0.0, 182.6, 180, 185, 183.0, 185.0, 185.0, 185.0, 1.3743815283122593, 8.212734933342496, 0.7422197120670698], "isController": false}, {"data": ["Get Recipe By Id", 5, 0, 0.0, 182.2, 178, 191, 180.0, 191.0, 191.0, 191.0, 0.9219988936013276, 1.6453718536787756, 0.4871107435921077], "isController": false}, {"data": ["Get Products - Paginated", 5, 0, 0.0, 187.4, 181, 198, 186.0, 198.0, 198.0, 198.0, 1.3989927252378287, 22.63854399832121, 0.7596093312814773], "isController": false}, {"data": ["Get Posts By User Id", 5, 0, 0.0, 180.0, 177, 184, 179.0, 184.0, 184.0, 184.0, 1.369487811558477, 2.201879622021364, 0.7275403998904411], "isController": false}, {"data": ["Get Carts - Paginated", 5, 0, 0.0, 185.0, 179, 195, 184.0, 195.0, 195.0, 195.0, 1.734304543877905, 19.267717004856053, 0.936592199965314], "isController": false}, {"data": ["Get Recipe Tags", 5, 0, 0.0, 515.0, 177, 1859, 180.0, 1859.0, 1859.0, 1859.0, 0.9276437847866419, 1.8241245361781078, 0.4928107606679036], "isController": false}, {"data": ["Get Authenticated User (alias: /user/me)", 5, 0, 0.0, 184.8, 180, 193, 185.0, 193.0, 193.0, 193.0, 1.3568521031207597, 3.295666553595658, 0.7142024253731343], "isController": false}, {"data": ["Get Products - Sorted", 5, 0, 0.0, 190.8, 186, 199, 190.0, 199.0, 199.0, 199.0, 1.403705783267827, 58.4393971960977, 0.7717640195115104], "isController": false}, {"data": ["Generate Square Image", 5, 0, 0.0, 206.2, 193, 226, 207.0, 226.0, 226.0, 226.0, 1.155001155001155, 3.6231393653268658, 0.6102105711480712], "isController": false}, {"data": ["Get Authenticated User (me)", 5, 0, 0.0, 186.0, 182, 197, 183.0, 197.0, 197.0, 197.0, 1.3408420488066506, 3.2562558661839636, 0.7057752581120944], "isController": false}, {"data": ["Delete Product", 5, 0, 0.0, 186.6, 178, 194, 185.0, 194.0, 194.0, 194.0, 1.7199862401100792, 4.4172068498452015, 0.9473361713106295], "isController": false}, {"data": ["Get Random Todo", 5, 0, 0.0, 179.6, 177, 183, 179.0, 183.0, 183.0, 183.0, 0.8225037012666557, 0.9020231020727094, 0.4369550912979109], "isController": false}, {"data": ["Delete Cart", 5, 0, 0.0, 183.6, 179, 193, 181.0, 193.0, 193.0, 193.0, 1.7787264318747777, 3.6964158662397724, 0.9744780549626467], "isController": false}, {"data": ["Test Route - PATCH", 5, 0, 0.0, 182.8, 178, 192, 182.0, 192.0, 192.0, 192.0, 1.3781697905181918, 1.4513850606394707, 0.7967544101433296], "isController": false}, {"data": ["Get All Comments", 5, 0, 0.0, 180.8, 179, 184, 181.0, 184.0, 184.0, 184.0, 1.3627691469065142, 6.847382631507223, 0.718647792313982], "isController": false}, {"data": ["Add New Cart", 5, 0, 0.0, 182.4, 178, 192, 181.0, 192.0, 192.0, 192.0, 1.7624250969333803, 2.818503260486429, 1.247810737574903], "isController": false}, {"data": ["Generate Image With Background Color", 5, 0, 0.0, 242.4, 205, 358, 220.0, 358.0, 358.0, 358.0, 1.1460004584001833, 8.162119671097868, 0.6177658721063488], "isController": false}, {"data": ["Get User's Carts", 5, 0, 0.0, 181.8, 177, 189, 180.0, 189.0, 189.0, 189.0, 1.3838915029061722, 2.8604929248546913, 0.7365438174647108], "isController": false}, {"data": ["Generate Image - Custom Format", 5, 0, 0.0, 209.4, 204, 218, 206.0, 218.0, 218.0, 218.0, 1.1814744801512287, 3.0090678166351603, 0.6599642603969754], "isController": false}, {"data": ["Test Route - POST", 5, 0, 0.0, 184.4, 180, 194, 182.0, 194.0, 194.0, 194.0, 1.3672409078479628, 1.4417448557560841, 0.778419384057971], "isController": false}, {"data": ["Test Route - DELETE", 5, 0, 0.0, 183.2, 178, 192, 182.0, 192.0, 192.0, 192.0, 1.383508577753182, 1.4540350892363034, 0.7539040882678473], "isController": false}, {"data": ["Get Post By Id", 5, 0, 0.0, 179.0, 177, 183, 178.0, 183.0, 183.0, 183.0, 1.3709898546750754, 2.006411519742254, 0.7216440738963532], "isController": false}, {"data": ["Test Route - GET", 5, 0, 0.0, 182.6, 177, 192, 182.0, 192.0, 192.0, 192.0, 1.3627691469065142, 1.43143993594985, 0.7133244753338784], "isController": false}, {"data": ["Search Products", 5, 0, 0.0, 187.4, 184, 196, 185.0, 196.0, 196.0, 196.0, 1.4204545454545454, 53.19851962002841, 0.7698752663352273], "isController": false}, {"data": ["Create Custom Mock Response", 5, 0, 0.0, 414.2, 274, 878, 307.0, 878.0, 878.0, 878.0, 1.1228385358185493, 1.2013495115652368, 0.7160288709858522], "isController": false}, {"data": ["Delete Todo", 5, 0, 0.0, 179.4, 178, 180, 180.0, 180.0, 180.0, 180.0, 1.3404825737265416, 1.5635472520107239, 0.7343854725201072], "isController": false}, {"data": ["Get Quotes - Paginated", 5, 0, 0.0, 180.4, 178, 182, 181.0, 182.0, 182.0, 182.0, 1.3383297644539613, 3.1163217679336186, 0.7240573139721627], "isController": false}, {"data": ["Mock 200 OK - GET", 5, 0, 0.0, 184.6, 178, 195, 181.0, 195.0, 195.0, 195.0, 1.179801793298726, 1.2362571525483717, 0.6221611019348748], "isController": false}, {"data": ["Get Post Tags", 5, 0, 0.0, 181.6, 180, 185, 180.0, 185.0, 185.0, 185.0, 1.3668671405139419, 20.28169209609076, 0.7234785060142155], "isController": false}, {"data": ["Search Posts", 5, 0, 0.0, 179.6, 177, 183, 179.0, 183.0, 183.0, 183.0, 1.3702384214853383, 2.083458224856125, 0.7386441490819402], "isController": false}, {"data": ["Get Comments For Post", 5, 0, 0.0, 179.6, 178, 184, 178.0, 184.0, 184.0, 184.0, 1.368738023542294, 1.9932247467834656, 0.7324887079113058], "isController": false}, {"data": ["Search Users", 5, 0, 0.0, 180.0, 178, 184, 179.0, 184.0, 184.0, 184.0, 1.38811771238201, 1.4713505517767906, 0.7482822043309273], "isController": false}, {"data": ["Update Comment (PATCH)", 5, 0, 0.0, 179.4, 177, 182, 178.0, 182.0, 182.0, 182.0, 1.358695652173913, 1.5646229619565217, 0.7762079653532609], "isController": false}, {"data": ["Get Cart By Id", 5, 0, 0.0, 182.4, 178, 193, 180.0, 193.0, 193.0, 193.0, 1.7452006980802792, 3.506080933682373, 0.9186163830715531], "isController": false}, {"data": ["Get Comment By Id", 5, 0, 0.0, 179.0, 177, 183, 178.0, 183.0, 183.0, 183.0, 1.3623978201634876, 1.568354053133515, 0.7211129087193461], "isController": false}, {"data": ["Add New Recipe", 5, 0, 0.0, 183.0, 177, 192, 183.0, 192.0, 192.0, 192.0, 1.3579576317218902, 1.811494262629006, 1.3645882842205324], "isController": false}, {"data": ["Add New Comment", 5, 0, 0.0, 179.8, 178, 183, 179.0, 183.0, 183.0, 183.0, 1.3601741022850926, 1.5586213785364527, 0.8633917641458106], "isController": false}, {"data": ["Get Post Tag List", 5, 0, 0.0, 181.2, 180, 184, 180.0, 184.0, 184.0, 184.0, 1.3664935774801859, 3.6252113794752665, 0.7286186458048648], "isController": false}, {"data": ["Get Carts By User Id", 5, 0, 0.0, 184.2, 179, 193, 182.0, 193.0, 193.0, 193.0, 1.753155680224404, 3.6175956565568024, 0.9313639551192147], "isController": false}, {"data": ["Login (get access + refresh token)", 5, 0, 0.0, 579.8, 208, 1039, 716.0, 1039.0, 1039.0, 1039.0, 1.0843634786380394, 3.0787874783127305, 0.2795624593363696], "isController": false}, {"data": ["Update Cart", 5, 0, 0.0, 185.2, 181, 194, 183.0, 194.0, 194.0, 194.0, 1.768033946251768, 3.9853280807991514, 1.1447329163719944], "isController": false}, {"data": ["Mock 200 OK - DELETE", 5, 0, 0.0, 184.4, 177, 195, 180.0, 195.0, 195.0, 195.0, 1.1627906976744187, 1.214798328488372, 0.638172238372093], "isController": false}, {"data": ["Generate Image With Text + Colors", 5, 0, 0.0, 206.6, 200, 215, 205.0, 215.0, 215.0, 215.0, 1.1848341232227488, 7.391791321090047, 0.6664691943127963], "isController": false}, {"data": ["Update Todo (PATCH)", 5, 0, 0.0, 180.2, 178, 184, 178.0, 184.0, 184.0, 184.0, 1.3412017167381973, 1.4913010494903434, 0.7714529405847639], "isController": false}, {"data": ["Mock 201 Created - POST", 5, 0, 0.0, 185.0, 178, 194, 182.0, 194.0, 194.0, 194.0, 1.1753643629525152, 1.2458403120592385, 0.6783597055712272], "isController": false}, {"data": ["Refresh Token", 5, 0, 0.0, 184.0, 179, 192, 182.0, 192.0, 192.0, 192.0, 1.3473457289140394, 3.5970446813527355, 1.2881361998113716], "isController": false}, {"data": ["Get Posts By Tag", 5, 0, 0.0, 183.4, 180, 189, 182.0, 189.0, 189.0, 189.0, 1.3657470636438132, 19.568061151324773, 0.732221814394974], "isController": false}, {"data": ["Get Recipes By Tag", 5, 0, 0.0, 183.6, 179, 192, 183.0, 192.0, 192.0, 192.0, 1.3469827586206897, 2.464557516163793, 0.722161654768319], "isController": false}, {"data": ["Update Recipe (PATCH)", 5, 0, 0.0, 183.0, 178, 192, 182.0, 192.0, 192.0, 192.0, 1.369487811558477, 2.445552160367023, 0.7837107984113941], "isController": false}, {"data": ["Get Users - Sorted", 5, 0, 0.0, 201.2, 188, 213, 204.0, 213.0, 213.0, 213.0, 1.3766519823788548, 57.604281387665196, 0.7582340996696035], "isController": false}, {"data": ["Get Comments By Post Id", 5, 0, 0.0, 179.4, 177, 183, 179.0, 183.0, 183.0, 183.0, 1.361285053090117, 1.9813078546147562, 0.7271708242580996], "isController": false}, {"data": ["Mock 200 OK - PUT", 5, 0, 0.0, 184.6, 178, 194, 181.0, 194.0, 194.0, 194.0, 1.1712344811431248, 1.2286524215272898, 0.6748323670648864], "isController": false}, {"data": ["Add New Todo", 5, 0, 0.0, 650.6, 179, 2528, 183.0, 2528.0, 2528.0, 2528.0, 0.8235875473562839, 0.9067505868061275, 0.5251979183824741], "isController": false}, {"data": ["Generate Identicon", 5, 0, 0.0, 189.4, 180, 200, 189.0, 200.0, 200.0, 200.0, 1.183151916706105, 2.817842670373876, 0.6320157211310933], "isController": false}, {"data": ["Get Recipes - Field Selection", 5, 0, 0.0, 721.6, 179, 2870, 183.0, 2870.0, 2870.0, 2870.0, 0.9192866335723479, 3.1731548193601764, 0.5117122862658577], "isController": false}, {"data": ["Get Product Category List", 5, 0, 0.0, 182.8, 178, 193, 180.0, 193.0, 193.0, 193.0, 1.4322543683758235, 1.9424949871097106, 0.7748719922658264], "isController": false}, {"data": ["Get Todos By User Id", 5, 0, 0.0, 1594.0, 180, 2663, 2291.0, 2663.0, 2663.0, 2663.0, 0.82223318533136, 0.9853950830455517, 0.43681137970728495], "isController": false}, {"data": ["Get All Products", 5, 0, 0.0, 11.2, 9, 14, 11.0, 14.0, 14.0, 14.0, 1.461988304093567, 64.51337490862574, 0.7709703947368421], "isController": false}, {"data": ["Update Product (PATCH)", 5, 0, 0.0, 183.2, 178, 193, 181.0, 193.0, 193.0, 193.0, 1.7111567419575633, 2.6680008341889114, 0.9825782854209445], "isController": false}, {"data": ["Get Comments - Paginated", 5, 0, 0.0, 180.6, 179, 183, 180.0, 183.0, 183.0, 183.0, 1.3623978201634876, 3.244475902588556, 0.7397394414168937], "isController": false}, {"data": ["Get Products - Simulate Delay (perf testing)", 5, 0, 0.0, 2190.2, 2185, 2198, 2190.0, 2198.0, 2198.0, 2198.0, 0.9035056017347307, 39.843891172750276, 0.48616365874593426], "isController": false}, {"data": ["Get Users - Paginated", 5, 0, 0.0, 186.0, 181, 196, 184.0, 196.0, 196.0, 196.0, 1.3804527885146327, 20.384057064467147, 0.7454984297349531], "isController": false}, {"data": ["Generate Sized Image", 5, 0, 0.0, 217.2, 194, 241, 215.0, 241.0, 241.0, 241.0, 1.1499540018399264, 8.175229631439743, 0.6120360654323828], "isController": false}, {"data": ["Delete Post", 5, 0, 0.0, 179.4, 178, 182, 179.0, 182.0, 182.0, 182.0, 1.3635124079629124, 2.073231268748296, 0.7470024031906191], "isController": false}, {"data": ["Get Users - Field Selection", 5, 0, 0.0, 188.6, 183, 200, 184.0, 200.0, 200.0, 200.0, 1.3877324451845685, 3.9317279003608103, 0.7684026332223147], "isController": false}, {"data": ["Delete Comment", 5, 0, 0.0, 179.4, 177, 183, 178.0, 183.0, 183.0, 183.0, 1.3575889220743957, 1.640773486288352, 0.7477345234862884], "isController": false}, {"data": ["Search Recipes", 5, 0, 0.0, 1604.4, 179, 2900, 1868.0, 2900.0, 2900.0, 2900.0, 0.9242144177449169, 0.980172712569316, 0.5000144408502772], "isController": false}, {"data": ["Update Post (PATCH)", 5, 0, 0.0, 179.4, 177, 182, 179.0, 182.0, 182.0, 182.0, 1.363884342607747, 1.9784314477632297, 0.7765083708401528], "isController": false}, {"data": ["Get Todos - Paginated", 5, 0, 0.0, 180.0, 178, 182, 179.0, 182.0, 182.0, 182.0, 1.3550135501355014, 2.541973661924119, 0.7317602472899729], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 540, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
