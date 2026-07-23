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

    var data = {"OkPercent": 99.81481481481481, "KoPercent": 0.18518518518518517};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.975, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get User By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Post"], "isController": false}, {"data": [0.8, 500, 1500, "Delete Recipe"], "isController": false}, {"data": [1.0, 500, 1500, "Get Quote By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Product"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Update User (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Update User (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Login (alias: /user/login)"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Update Todo (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Update Recipe (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Users"], "isController": false}, {"data": [1.0, 500, 1500, "Delete User"], "isController": false}, {"data": [1.0, 500, 1500, "Get Random Quote"], "isController": false}, {"data": [1.0, 500, 1500, "Update Comment (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Generate 2FA TOTP Code"], "isController": false}, {"data": [1.0, 500, 1500, "Get Product Categories"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Quotes"], "isController": false}, {"data": [1.0, 500, 1500, "Update Product (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Todo By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Caller IP Address"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes By Meal Type"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Recipes"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products By Category"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - PATCH"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Get Product By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New User"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - PUT"], "isController": false}, {"data": [1.0, 500, 1500, "Get User's Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get User's Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Filter Users"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Carts"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Update Post (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipe By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts By User Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Carts - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipe Tags"], "isController": false}, {"data": [1.0, 500, 1500, "Get Authenticated User (alias: /user/me)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products - Sorted"], "isController": false}, {"data": [0.2, 500, 1500, "Generate Square Image"], "isController": false}, {"data": [1.0, 500, 1500, "Get Authenticated User (me)"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Product"], "isController": false}, {"data": [1.0, 500, 1500, "Get Random Todo"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - PATCH"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Comments"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Image With Background Color"], "isController": false}, {"data": [1.0, 500, 1500, "Get User's Carts"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Image - Custom Format"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - POST"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - DELETE"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - GET"], "isController": false}, {"data": [1.0, 500, 1500, "Search Products"], "isController": false}, {"data": [0.7, 500, 1500, "Create Custom Mock Response"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Todo"], "isController": false}, {"data": [1.0, 500, 1500, "Get Quotes - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - GET"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Tags"], "isController": false}, {"data": [1.0, 500, 1500, "Search Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comments For Post"], "isController": false}, {"data": [1.0, 500, 1500, "Search Users"], "isController": false}, {"data": [1.0, 500, 1500, "Update Comment (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Cart By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comment By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Recipe"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Comment"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Tag List"], "isController": false}, {"data": [1.0, 500, 1500, "Get Carts By User Id"], "isController": false}, {"data": [1.0, 500, 1500, "Login (get access + refresh token)"], "isController": false}, {"data": [1.0, 500, 1500, "Update Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - DELETE"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Image With Text + Colors"], "isController": false}, {"data": [1.0, 500, 1500, "Update Todo (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 201 Created - POST"], "isController": false}, {"data": [1.0, 500, 1500, "Refresh Token"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts By Tag"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes By Tag"], "isController": false}, {"data": [1.0, 500, 1500, "Update Recipe (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Users - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comments By Post Id"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - PUT"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Todo"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Identicon"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Get Product Category List"], "isController": false}, {"data": [1.0, 500, 1500, "Get Todos By User Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Products"], "isController": false}, {"data": [1.0, 500, 1500, "Update Product (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comments - Paginated"], "isController": false}, {"data": [0.0, 500, 1500, "Get Products - Simulate Delay (perf testing)"], "isController": false}, {"data": [0.6, 500, 1500, "Get Users - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Sized Image"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Post"], "isController": false}, {"data": [1.0, 500, 1500, "Get Users - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Comment"], "isController": false}, {"data": [1.0, 500, 1500, "Search Recipes"], "isController": false}, {"data": [1.0, 500, 1500, "Update Post (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Todos - Paginated"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 540, 1, 0.18518518518518517, 175.7055555555554, 7, 3025, 118.0, 136.90000000000003, 221.59999999999945, 2127.1800000000003, 4.240615674572012, 27.228025733273125, 2.3944340078726243], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get User By Id", 5, 0, 0.0, 120.2, 118, 124, 120.0, 124.0, 124.0, 124.0, 2.2727272727272725, 5.516690340909091, 1.1962890625], "isController": false}, {"data": ["Add New Post", 5, 0, 0.0, 117.2, 116, 118, 117.0, 118.0, 118.0, 118.0, 2.352941176470588, 2.6746323529411766, 1.6199448529411764], "isController": false}, {"data": ["Delete Recipe", 5, 1, 20.0, 698.2, 115, 3025, 116.0, 3025.0, 3025.0, 3025.0, 1.556178026766262, 2.430616343759726, 0.8555939737005913], "isController": false}, {"data": ["Get Quote By Id", 5, 0, 0.0, 116.2, 115, 118, 116.0, 118.0, 118.0, 118.0, 2.339728591483388, 2.638592360786149, 1.233841249415068], "isController": false}, {"data": ["Add New Product", 5, 0, 0.0, 117.2, 116, 118, 117.0, 118.0, 118.0, 118.0, 7.564296520423601, 8.976692511346444, 8.591090677004539], "isController": false}, {"data": ["Get Recipes - Paginated", 5, 0, 0.0, 121.0, 118, 124, 121.0, 124.0, 124.0, 124.0, 15.479876160990711, 146.5206559597523, 8.389971942724458], "isController": false}, {"data": ["Update User (PUT)", 5, 0, 0.0, 118.6, 118, 120, 118.0, 120.0, 120.0, 120.0, 2.3158869847151458, 5.62235844140806, 1.3253025127373785], "isController": false}, {"data": ["Update User (PATCH)", 5, 0, 0.0, 118.8, 118, 120, 118.0, 120.0, 120.0, 120.0, 2.3180343069077423, 5.6180640067222996, 1.3718054589707926], "isController": false}, {"data": ["Login (alias: /user/login)", 5, 0, 0.0, 118.6, 118, 120, 118.0, 120.0, 120.0, 120.0, 7.288629737609329, 20.688604682944604, 4.612336005830904], "isController": false}, {"data": ["Get All Posts", 5, 0, 0.0, 8.4, 7, 11, 8.0, 11.0, 11.0, 11.0, 2.4473813020068524, 37.563000948360255, 1.2834411710719529], "isController": false}, {"data": ["Get Recipes - Sorted", 5, 0, 0.0, 121.6, 120, 123, 122.0, 123.0, 123.0, 123.0, 15.625, 438.95263671875, 8.5601806640625], "isController": false}, {"data": ["Update Todo (PUT)", 5, 0, 0.0, 118.0, 116, 122, 117.0, 122.0, 122.0, 122.0, 2.34192037470726, 2.602641978922717, 1.3402005269320845], "isController": false}, {"data": ["Update Recipe (PUT)", 5, 0, 0.0, 118.2, 117, 121, 118.0, 121.0, 121.0, 121.0, 16.393442622950822, 29.194415983606557, 10.550076844262295], "isController": false}, {"data": ["Get All Users", 5, 0, 0.0, 9.4, 9, 11, 9.0, 11.0, 11.0, 11.0, 1.608234158893535, 67.53138569475716, 0.8433806087166291], "isController": false}, {"data": ["Delete User", 5, 0, 0.0, 119.8, 118, 124, 119.0, 124.0, 124.0, 124.0, 2.320185614849188, 5.763304814385151, 1.2711173143851509], "isController": false}, {"data": ["Get Random Quote", 5, 0, 0.0, 116.4, 116, 117, 116.0, 117.0, 117.0, 117.0, 2.339728591483388, 2.6920588149274685, 1.2452657054281704], "isController": false}, {"data": ["Update Comment (PUT)", 5, 0, 0.0, 117.2, 117, 118, 117.0, 118.0, 118.0, 118.0, 2.346316283435007, 2.7175108517128113, 1.4160385382449556], "isController": false}, {"data": ["Generate 2FA TOTP Code", 5, 0, 0.0, 119.8, 117, 125, 118.0, 125.0, 125.0, 125.0, 2.335357309668379, 2.476755896777207, 1.2680260392340028], "isController": false}, {"data": ["Get Product Categories", 5, 0, 0.0, 118.2, 117, 120, 118.0, 120.0, 120.0, 120.0, 7.575757575757576, 26.469282670454543, 4.076408617424242], "isController": false}, {"data": ["Get All Todos", 5, 0, 0.0, 117.6, 117, 118, 118.0, 118.0, 118.0, 118.0, 2.3430178069353325, 8.072886158622305, 1.2287114866447986], "isController": false}, {"data": ["Get All Quotes", 5, 0, 0.0, 119.0, 118, 120, 119.0, 120.0, 120.0, 120.0, 2.339728591483388, 11.296502105755732, 1.2292714670098268], "isController": false}, {"data": ["Update Product (PUT)", 5, 0, 0.0, 315.8, 116, 450, 445.0, 450.0, 450.0, 450.0, 7.541478129713424, 11.63037330316742, 4.389375942684766], "isController": false}, {"data": ["Get Todo By Id", 5, 0, 0.0, 116.4, 116, 117, 116.0, 117.0, 117.0, 117.0, 2.346316283435007, 2.607069011027687, 1.2350239030971377], "isController": false}, {"data": ["Get Caller IP Address", 5, 0, 0.0, 117.2, 115, 118, 118.0, 118.0, 118.0, 118.0, 7.342143906020558, 8.027601872246695, 3.828813325991189], "isController": false}, {"data": ["Get Products - Field Selection", 5, 0, 0.0, 119.8, 119, 122, 119.0, 122.0, 122.0, 122.0, 7.496251874062969, 24.12563249625187, 4.1580772113943025], "isController": false}, {"data": ["Get Recipes By Meal Type", 5, 0, 0.0, 124.0, 121, 128, 122.0, 128.0, 128.0, 128.0, 15.772870662460567, 386.3552346214511, 8.564175867507887], "isController": false}, {"data": ["Get All Recipes", 5, 0, 0.0, 122.0, 119, 128, 121.0, 128.0, 128.0, 128.0, 15.105740181268883, 419.83926548338366, 7.951165974320241], "isController": false}, {"data": ["Get Products By Category", 5, 0, 0.0, 119.6, 117, 122, 120.0, 122.0, 122.0, 122.0, 7.496251874062969, 62.06515882683658, 4.0702305097451275], "isController": false}, {"data": ["Mock 200 OK - PATCH", 5, 0, 0.0, 116.0, 114, 117, 116.0, 117.0, 117.0, 117.0, 3.6153289949385394, 3.7897403741865507, 2.090112075198843], "isController": false}, {"data": ["Get Posts - Sorted", 5, 0, 0.0, 142.6, 120, 226, 122.0, 226.0, 226.0, 226.0, 2.3266635644485807, 30.911906700791064, 1.2723941368078175], "isController": false}, {"data": ["Get Product By Id", 5, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 9.140767824497258, 23.242901622486286, 4.838179844606946], "isController": false}, {"data": ["Add New User", 5, 0, 0.0, 117.2, 116, 119, 117.0, 119.0, 119.0, 119.0, 2.3158869847151458, 4.112056362899491, 1.4315981067623902], "isController": false}, {"data": ["Test Route - PUT", 5, 0, 0.0, 118.8, 116, 126, 117.0, 126.0, 126.0, 126.0, 7.278020378457059, 7.622020560407568, 4.193390647743813], "isController": false}, {"data": ["Get User's Todos", 5, 0, 0.0, 116.8, 116, 119, 116.0, 119.0, 119.0, 119.0, 2.314814814814815, 2.768283420138889, 1.2320059317129628], "isController": false}, {"data": ["Get User's Posts", 5, 0, 0.0, 117.2, 116, 119, 117.0, 119.0, 119.0, 119.0, 2.3137436372049978, 3.727296390559926, 1.231435822535863], "isController": false}, {"data": ["Filter Users", 5, 0, 0.0, 177.4, 119, 291, 176.0, 291.0, 291.0, 291.0, 2.2603978300180834, 72.80997471179927, 1.2604366806057865], "isController": false}, {"data": ["Get All Carts", 5, 0, 0.0, 121.0, 120, 123, 121.0, 123.0, 123.0, 123.0, 14.925373134328359, 453.7284281716418, 7.827075559701492], "isController": false}, {"data": ["Get Posts - Field Selection", 5, 0, 0.0, 120.2, 119, 122, 120.0, 122.0, 122.0, 122.0, 2.331002331002331, 10.108901515151516, 1.290701486013986], "isController": false}, {"data": ["Update Post (PUT)", 5, 0, 0.0, 116.8, 116, 117, 117.0, 117.0, 117.0, 117.0, 2.3540489642184554, 3.4257849282015065, 1.4161075800376648], "isController": false}, {"data": ["Get Posts - Paginated", 5, 0, 0.0, 120.4, 118, 125, 120.0, 125.0, 125.0, 125.0, 2.3234200743494426, 13.884703909154274, 1.254737598745353], "isController": false}, {"data": ["Get Recipe By Id", 5, 0, 0.0, 116.4, 116, 117, 116.0, 117.0, 117.0, 117.0, 15.92356687898089, 28.454045581210192, 8.412743829617835], "isController": false}, {"data": ["Get Products - Paginated", 5, 0, 0.0, 121.0, 118, 122, 122.0, 122.0, 122.0, 122.0, 7.5075075075075075, 121.51018205705705, 4.076341966966967], "isController": false}, {"data": ["Get Posts By User Id", 5, 0, 0.0, 117.2, 116, 118, 117.0, 118.0, 118.0, 118.0, 2.335357309668379, 3.754816674451191, 1.2406585707613265], "isController": false}, {"data": ["Get Carts - Paginated", 5, 0, 0.0, 119.6, 119, 120, 120.0, 120.0, 120.0, 120.0, 15.015015015015015, 166.83675863363362, 8.108694632132131], "isController": false}, {"data": ["Get Recipe Tags", 5, 0, 0.0, 116.8, 116, 118, 117.0, 118.0, 118.0, 118.0, 15.92356687898089, 31.296651074840764, 8.459394904458598], "isController": false}, {"data": ["Get Authenticated User (alias: /user/me)", 5, 0, 0.0, 118.4, 118, 119, 118.0, 119.0, 119.0, 119.0, 7.288629737609329, 17.71193968658892, 3.8364955357142856], "isController": false}, {"data": ["Get Products - Sorted", 5, 0, 0.0, 121.4, 118, 123, 123.0, 123.0, 123.0, 123.0, 7.496251874062969, 312.06223060344826, 4.12147441904048], "isController": false}, {"data": ["Generate Square Image", 5, 0, 0.0, 2100.0, 128, 2890, 2710.0, 2890.0, 2890.0, 2890.0, 1.2462612163509472, 3.905276358424726, 0.6584251152791626], "isController": false}, {"data": ["Get Authenticated User (me)", 5, 0, 0.0, 125.2, 118, 135, 119.0, 135.0, 135.0, 135.0, 7.092198581560283, 17.21797429078014, 3.733100620567376], "isController": false}, {"data": ["Delete Product", 5, 0, 0.0, 118.6, 117, 122, 117.0, 122.0, 122.0, 122.0, 15.060240963855422, 38.706584149096386, 8.294898343373493], "isController": false}, {"data": ["Get Random Todo", 5, 0, 0.0, 116.8, 116, 118, 117.0, 118.0, 118.0, 118.0, 2.346316283435007, 2.5644503754106056, 1.2464805255748477], "isController": false}, {"data": ["Delete Cart", 5, 0, 0.0, 118.2, 117, 119, 118.0, 119.0, 119.0, 119.0, 15.24390243902439, 31.643006859756095, 8.351395769817072], "isController": false}, {"data": ["Test Route - PATCH", 5, 0, 0.0, 117.4, 116, 119, 117.0, 119.0, 119.0, 119.0, 7.299270072992701, 7.667084854014598, 4.219890510948905], "isController": false}, {"data": ["Get All Comments", 5, 0, 0.0, 118.2, 117, 121, 118.0, 121.0, 121.0, 121.0, 2.3551577955723033, 11.832827955723031, 1.2419777437588317], "isController": false}, {"data": ["Add New Cart", 5, 0, 0.0, 117.4, 117, 118, 117.0, 118.0, 118.0, 118.0, 15.151515151515152, 24.23650568181818, 10.727391098484848], "isController": false}, {"data": ["Generate Image With Background Color", 5, 0, 0.0, 147.8, 137, 159, 148.0, 159.0, 159.0, 159.0, 3.526093088857546, 25.128922778561357, 1.900784555712271], "isController": false}, {"data": ["Get User's Carts", 5, 0, 0.0, 125.8, 117, 161, 117.0, 161.0, 161.0, 161.0, 2.2675736961451247, 4.682628259637188, 1.2068629535147393], "isController": false}, {"data": ["Generate Image - Custom Format", 5, 0, 0.0, 144.6, 132, 156, 149.0, 156.0, 156.0, 156.0, 3.486750348675035, 8.883041317991632, 1.9476769525801954], "isController": false}, {"data": ["Test Route - POST", 5, 0, 0.0, 117.8, 117, 119, 117.0, 119.0, 119.0, 119.0, 7.267441860465116, 7.64926644258721, 4.1376158248546515], "isController": false}, {"data": ["Test Route - DELETE", 5, 0, 0.0, 116.4, 115, 118, 116.0, 118.0, 118.0, 118.0, 7.342143906020558, 7.736497338472834, 4.0008948237885456], "isController": false}, {"data": ["Get Post By Id", 5, 0, 0.0, 116.8, 116, 118, 117.0, 118.0, 118.0, 118.0, 2.3342670401493932, 3.415233280812325, 1.2286815767973858], "isController": false}, {"data": ["Test Route - GET", 5, 0, 0.0, 117.4, 116, 120, 117.0, 120.0, 120.0, 120.0, 7.288629737609329, 7.655908345481049, 3.815142128279883], "isController": false}, {"data": ["Search Products", 5, 0, 0.0, 120.8, 119, 122, 121.0, 122.0, 122.0, 122.0, 7.564296520423601, 283.28733689485625, 4.099789618003025], "isController": false}, {"data": ["Create Custom Mock Response", 5, 0, 0.0, 743.0, 211, 2082, 240.0, 2082.0, 2082.0, 2082.0, 1.2201073694485114, 1.308279191068814, 0.7780567502440215], "isController": false}, {"data": ["Delete Todo", 5, 0, 0.0, 117.0, 116, 118, 117.0, 118.0, 118.0, 118.0, 2.3430178069353325, 2.7338258552015, 1.2836259664948455], "isController": false}, {"data": ["Get Quotes - Paginated", 5, 0, 0.0, 118.2, 117, 121, 118.0, 121.0, 121.0, 121.0, 2.339728591483388, 5.44809458352831, 1.2658297262517548], "isController": false}, {"data": ["Mock 200 OK - GET", 5, 0, 0.0, 126.0, 115, 141, 128.0, 141.0, 141.0, 141.0, 3.5739814152966405, 3.739417664403145, 1.8847167619728378], "isController": false}, {"data": ["Get Post Tags", 5, 0, 0.0, 129.2, 117, 142, 133.0, 142.0, 142.0, 142.0, 2.335357309668379, 34.64675896193368, 1.2360973260158805], "isController": false}, {"data": ["Search Posts", 5, 0, 0.0, 118.0, 117, 119, 118.0, 119.0, 119.0, 119.0, 2.3342670401493932, 3.5465358018207285, 1.2583158263305323], "isController": false}, {"data": ["Get Comments For Post", 5, 0, 0.0, 117.4, 116, 120, 117.0, 120.0, 120.0, 120.0, 2.337540906965872, 3.406783251519402, 1.250949625993455], "isController": false}, {"data": ["Search Users", 5, 0, 0.0, 118.2, 115, 128, 116.0, 128.0, 128.0, 128.0, 2.2655188038060716, 2.4049013083371094, 1.2212562301767105], "isController": false}, {"data": ["Update Comment (PATCH)", 5, 0, 0.0, 117.2, 116, 120, 117.0, 120.0, 120.0, 120.0, 2.3430178069353325, 2.693555236644799, 1.3385404463448922], "isController": false}, {"data": ["Get Cart By Id", 5, 0, 0.0, 116.8, 116, 118, 116.0, 118.0, 118.0, 118.0, 15.197568389057752, 30.46637537993921, 7.9995013297872335], "isController": false}, {"data": ["Get Comment By Id", 5, 0, 0.0, 117.2, 116, 118, 117.0, 118.0, 118.0, 118.0, 2.3540489642184554, 2.7163518126177024, 1.2459907603578153], "isController": false}, {"data": ["Add New Recipe", 5, 0, 0.0, 118.6, 116, 125, 117.0, 125.0, 125.0, 125.0, 16.393442622950822, 21.875, 16.473488729508198], "isController": false}, {"data": ["Add New Comment", 5, 0, 0.0, 117.0, 116, 118, 117.0, 118.0, 118.0, 118.0, 2.3452157598499066, 2.692875674249531, 1.4886623475609755], "isController": false}, {"data": ["Get Post Tag List", 5, 0, 0.0, 118.4, 117, 119, 119.0, 119.0, 119.0, 119.0, 2.3507287259050305, 6.237236277621063, 1.2534159026798308], "isController": false}, {"data": ["Get Carts By User Id", 5, 0, 0.0, 118.4, 117, 120, 118.0, 120.0, 120.0, 120.0, 15.105740181268883, 31.205744901812686, 8.024924471299093], "isController": false}, {"data": ["Login (get access + refresh token)", 5, 0, 0.0, 282.2, 145, 477, 253.0, 477.0, 477.0, 477.0, 5.0352467270896275, 14.304231180765358, 1.2981495468277946], "isController": false}, {"data": ["Update Cart", 5, 0, 0.0, 118.6, 117, 121, 119.0, 121.0, 121.0, 121.0, 15.24390243902439, 34.35534965701219, 9.869831364329269], "isController": false}, {"data": ["Mock 200 OK - DELETE", 5, 0, 0.0, 116.4, 115, 119, 116.0, 119.0, 119.0, 119.0, 3.6153289949385394, 3.7968015636297903, 1.9841942335502532], "isController": false}, {"data": ["Generate Image With Text + Colors", 5, 0, 0.0, 144.0, 133, 161, 139.0, 161.0, 161.0, 161.0, 3.526093088857546, 22.00915682299013, 1.9834273624823697], "isController": false}, {"data": ["Update Todo (PATCH)", 5, 0, 0.0, 117.4, 117, 118, 117.0, 118.0, 118.0, 118.0, 2.3408239700374533, 2.607367011938202, 1.3464309749531835], "isController": false}, {"data": ["Mock 201 Created - POST", 5, 0, 0.0, 117.0, 115, 119, 117.0, 119.0, 119.0, 119.0, 3.6101083032490977, 3.829394178700361, 2.0835683664259927], "isController": false}, {"data": ["Refresh Token", 5, 0, 0.0, 118.6, 117, 120, 119.0, 120.0, 120.0, 120.0, 7.278020378457059, 19.38767967612809, 6.958185498544395], "isController": false}, {"data": ["Get Posts By Tag", 5, 0, 0.0, 125.6, 119, 146, 121.0, 146.0, 146.0, 146.0, 2.3507287259050305, 33.68153502585802, 1.2603028032440058], "isController": false}, {"data": ["Get Recipes By Tag", 5, 0, 0.0, 117.0, 116, 118, 117.0, 118.0, 118.0, 118.0, 15.974440894568689, 29.197034744408946, 8.564421924920127], "isController": false}, {"data": ["Update Recipe (PATCH)", 5, 0, 0.0, 117.2, 116, 118, 117.0, 118.0, 118.0, 118.0, 16.393442622950822, 29.319287909836067, 9.38140368852459], "isController": false}, {"data": ["Get Users - Sorted", 5, 0, 0.0, 133.2, 123, 137, 136.0, 137.0, 137.0, 137.0, 2.2482014388489207, 94.07493536420863, 1.238267198741007], "isController": false}, {"data": ["Get Comments By Post Id", 5, 0, 0.0, 118.8, 117, 126, 117.0, 126.0, 126.0, 126.0, 2.344116268166901, 3.4181976676043133, 1.2521792955930615], "isController": false}, {"data": ["Mock 200 OK - PUT", 5, 0, 0.0, 116.6, 115, 120, 116.0, 120.0, 120.0, 120.0, 3.61271676300578, 3.779946035043353, 2.081545791184971], "isController": false}, {"data": ["Add New Todo", 5, 0, 0.0, 117.6, 117, 119, 117.0, 119.0, 119.0, 119.0, 2.346316283435007, 2.5836975011731584, 1.4962348955889255], "isController": false}, {"data": ["Generate Identicon", 5, 0, 0.0, 130.2, 117, 149, 129.0, 149.0, 149.0, 149.0, 3.5410764872521248, 8.427347069759207, 1.8915711313739378], "isController": false}, {"data": ["Get Recipes - Field Selection", 5, 0, 0.0, 117.8, 117, 118, 118.0, 118.0, 118.0, 118.0, 15.822784810126583, 54.57006526898734, 8.807604825949367], "isController": false}, {"data": ["Get Product Category List", 5, 0, 0.0, 116.8, 116, 119, 116.0, 119.0, 119.0, 119.0, 7.564296520423601, 10.264986762481088, 4.092402609682299], "isController": false}, {"data": ["Get Todos By User Id", 5, 0, 0.0, 117.0, 117, 117, 117.0, 117.0, 117.0, 117.0, 2.346316283435007, 2.808705566635383, 1.2464805255748477], "isController": false}, {"data": ["Get All Products", 5, 0, 0.0, 10.0, 9, 12, 10.0, 12.0, 12.0, 12.0, 8.726003490401396, 385.02638252617805, 4.601603403141362], "isController": false}, {"data": ["Update Product (PATCH)", 5, 0, 0.0, 117.6, 116, 119, 118.0, 119.0, 119.0, 119.0, 15.151515151515152, 23.64169034090909, 8.70028409090909], "isController": false}, {"data": ["Get Comments - Paginated", 5, 0, 0.0, 117.4, 117, 118, 117.0, 118.0, 118.0, 118.0, 2.3551577955723033, 5.617879327602449, 1.2787770843146489], "isController": false}, {"data": ["Get Products - Simulate Delay (perf testing)", 5, 0, 0.0, 2124.4, 2122, 2128, 2124.0, 2128.0, 2128.0, 2128.0, 1.8733608092918694, 82.61301634507306, 1.0080291073435743], "isController": false}, {"data": ["Get Users - Paginated", 5, 0, 0.0, 906.2, 121, 1121, 1106.0, 1121.0, 1121.0, 1121.0, 1.5527950310559004, 22.928292410714285, 0.8385699728260869], "isController": false}, {"data": ["Generate Sized Image", 5, 0, 0.0, 194.0, 158, 268, 161.0, 268.0, 268.0, 268.0, 3.5285815102328866, 25.0770498853211, 1.8780048076923077], "isController": false}, {"data": ["Delete Post", 5, 0, 0.0, 116.4, 116, 117, 116.0, 117.0, 117.0, 117.0, 2.3562676720075397, 3.569837564797361, 1.2908849257775683], "isController": false}, {"data": ["Get Users - Field Selection", 5, 0, 0.0, 124.8, 120, 127, 126.0, 127.0, 127.0, 127.0, 2.263467632412856, 6.400485230873699, 1.253306784744228], "isController": false}, {"data": ["Delete Comment", 5, 0, 0.0, 116.4, 116, 117, 116.0, 117.0, 117.0, 117.0, 2.344116268166901, 2.8275902484763242, 1.291095288326301], "isController": false}, {"data": ["Search Recipes", 5, 0, 0.0, 117.2, 115, 122, 117.0, 122.0, 122.0, 122.0, 15.974440894568689, 17.00716353833866, 8.642422124600639], "isController": false}, {"data": ["Update Post (PATCH)", 5, 0, 0.0, 116.8, 116, 118, 117.0, 118.0, 118.0, 118.0, 2.3540489642184554, 3.4193480755649714, 1.3402446739642184], "isController": false}, {"data": ["Get Todos - Paginated", 5, 0, 0.0, 116.6, 116, 117, 117.0, 117.0, 117.0, 117.0, 2.3452157598499066, 4.401401999296435, 1.2665081203095685], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 1, 100.0, 0.18518518518518517], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 540, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete Recipe", 5, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
