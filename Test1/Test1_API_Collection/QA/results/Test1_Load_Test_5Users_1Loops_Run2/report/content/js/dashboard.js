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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9722222222222222, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get User By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Post"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Recipe"], "isController": false}, {"data": [1.0, 500, 1500, "Get Quote By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Product"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Update User (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Update User (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Login (alias: /user/login)"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Update Todo (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Update Recipe (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Users"], "isController": false}, {"data": [1.0, 500, 1500, "Delete User"], "isController": false}, {"data": [1.0, 500, 1500, "Get Random Quote"], "isController": false}, {"data": [1.0, 500, 1500, "Update Comment (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Generate 2FA TOTP Code"], "isController": false}, {"data": [1.0, 500, 1500, "Get Product Categories"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Quotes"], "isController": false}, {"data": [0.8, 500, 1500, "Update Product (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Todo By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Caller IP Address"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes By Meal Type"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Recipes"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products By Category"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - PATCH"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Get Product By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New User"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - PUT"], "isController": false}, {"data": [1.0, 500, 1500, "Get User's Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get User's Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Filter Users"], "isController": false}, {"data": [0.6, 500, 1500, "Get All Carts"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Update Post (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipe By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts By User Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Carts - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipe Tags"], "isController": false}, {"data": [1.0, 500, 1500, "Get Authenticated User (alias: /user/me)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Square Image"], "isController": false}, {"data": [1.0, 500, 1500, "Get Authenticated User (me)"], "isController": false}, {"data": [0.8, 500, 1500, "Delete Product"], "isController": false}, {"data": [1.0, 500, 1500, "Get Random Todo"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - PATCH"], "isController": false}, {"data": [0.8, 500, 1500, "Get All Comments"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Image With Background Color"], "isController": false}, {"data": [1.0, 500, 1500, "Get User's Carts"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Image - Custom Format"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - POST"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - DELETE"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - GET"], "isController": false}, {"data": [1.0, 500, 1500, "Search Products"], "isController": false}, {"data": [1.0, 500, 1500, "Create Custom Mock Response"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Todo"], "isController": false}, {"data": [1.0, 500, 1500, "Get Quotes - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - GET"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Tags"], "isController": false}, {"data": [1.0, 500, 1500, "Search Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comments For Post"], "isController": false}, {"data": [1.0, 500, 1500, "Search Users"], "isController": false}, {"data": [1.0, 500, 1500, "Update Comment (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Cart By Id"], "isController": false}, {"data": [0.4, 500, 1500, "Get Comment By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Recipe"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Comment"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Tag List"], "isController": false}, {"data": [1.0, 500, 1500, "Get Carts By User Id"], "isController": false}, {"data": [1.0, 500, 1500, "Login (get access + refresh token)"], "isController": false}, {"data": [1.0, 500, 1500, "Update Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - DELETE"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Image With Text + Colors"], "isController": false}, {"data": [1.0, 500, 1500, "Update Todo (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 201 Created - POST"], "isController": false}, {"data": [1.0, 500, 1500, "Refresh Token"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts By Tag"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes By Tag"], "isController": false}, {"data": [1.0, 500, 1500, "Update Recipe (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Users - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comments By Post Id"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - PUT"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Todo"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Identicon"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Get Product Category List"], "isController": false}, {"data": [1.0, 500, 1500, "Get Todos By User Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Products"], "isController": false}, {"data": [0.8, 500, 1500, "Update Product (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comments - Paginated"], "isController": false}, {"data": [0.0, 500, 1500, "Get Products - Simulate Delay (perf testing)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Users - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Sized Image"], "isController": false}, {"data": [0.8, 500, 1500, "Delete Post"], "isController": false}, {"data": [1.0, 500, 1500, "Get Users - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Comment"], "isController": false}, {"data": [1.0, 500, 1500, "Search Recipes"], "isController": false}, {"data": [1.0, 500, 1500, "Update Post (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Todos - Paginated"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 540, 0, 0.0, 183.19629629629623, 7, 4767, 88.0, 101.0, 127.74999999999966, 4174.040000000002, 4.123270517088665, 26.482878584477415, 2.328175884689686], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get User By Id", 5, 0, 0.0, 97.8, 85, 141, 88.0, 141.0, 141.0, 141.0, 1.3732491073880801, 3.335761552458116, 0.7228332703927492], "isController": false}, {"data": ["Add New Post", 5, 0, 0.0, 86.4, 80, 90, 88.0, 90.0, 90.0, 90.0, 1.3939224979091163, 1.5787805791747977, 0.9596829697518817], "isController": false}, {"data": ["Delete Recipe", 5, 0, 0.0, 84.4, 77, 91, 84.0, 91.0, 91.0, 91.0, 1.3912075681691707, 2.557430787423484, 0.764892442264886], "isController": false}, {"data": ["Get Quote By Id", 5, 0, 0.0, 86.0, 80, 89, 87.0, 89.0, 89.0, 89.0, 1.446759259259259, 1.6273215964988426, 0.762939453125], "isController": false}, {"data": ["Add New Product", 5, 0, 0.0, 85.2, 79, 88, 86.0, 88.0, 88.0, 88.0, 1.2850167052171677, 1.5231965593677719, 1.4594476837573889], "isController": false}, {"data": ["Get Recipes - Paginated", 5, 0, 0.0, 103.4, 82, 169, 88.0, 169.0, 169.0, 169.0, 1.426126640045636, 13.488316903166002, 0.7729494972903594], "isController": false}, {"data": ["Update User (PUT)", 5, 0, 0.0, 88.4, 82, 91, 90.0, 91.0, 91.0, 91.0, 1.38811771238201, 3.3653721023042755, 0.7943720502498612], "isController": false}, {"data": ["Update User (PATCH)", 5, 0, 0.0, 89.2, 84, 92, 90.0, 92.0, 92.0, 92.0, 1.3877324451845685, 3.360372432694976, 0.8212557243963363], "isController": false}, {"data": ["Login (alias: /user/login)", 5, 0, 0.0, 86.6, 80, 91, 88.0, 91.0, 91.0, 91.0, 1.3635124079629124, 3.8732274338696486, 0.8628476956640306], "isController": false}, {"data": ["Get All Posts", 5, 0, 0.0, 8.4, 8, 9, 8.0, 9.0, 9.0, 9.0, 1.4196479273140261, 21.787991109454858, 0.7444833368824532], "isController": false}, {"data": ["Get Recipes - Sorted", 5, 0, 0.0, 89.4, 83, 95, 88.0, 95.0, 95.0, 95.0, 1.422070534698521, 39.95157183233788, 0.7790835644197952], "isController": false}, {"data": ["Update Todo (PUT)", 5, 0, 0.0, 86.6, 80, 90, 88.0, 90.0, 90.0, 90.0, 1.4598540145985401, 1.6238024635036497, 0.8354242700729927], "isController": false}, {"data": ["Update Recipe (PUT)", 5, 0, 0.0, 84.0, 78, 89, 85.0, 89.0, 89.0, 89.0, 1.3993842709207949, 2.4934731842989084, 0.9005803071648475], "isController": false}, {"data": ["Get All Users", 5, 0, 0.0, 9.4, 8, 11, 9.0, 11.0, 11.0, 11.0, 1.4180374361883152, 59.546493902439025, 0.743638772688599], "isController": false}, {"data": ["Delete User", 5, 0, 0.0, 89.2, 82, 94, 90.0, 94.0, 94.0, 94.0, 1.3877324451845685, 3.447918834998612, 0.7602713884263114], "isController": false}, {"data": ["Get Random Quote", 5, 0, 0.0, 86.4, 80, 89, 88.0, 89.0, 89.0, 89.0, 1.443418013856813, 1.715750396939954, 0.7682254077655889], "isController": false}, {"data": ["Update Comment (PUT)", 5, 0, 0.0, 87.0, 80, 90, 89.0, 90.0, 90.0, 90.0, 1.485001485001485, 1.7190632425007426, 0.8962215993465994], "isController": false}, {"data": ["Generate 2FA TOTP Code", 5, 0, 0.0, 86.6, 81, 90, 87.0, 90.0, 90.0, 90.0, 1.4400921658986177, 1.5270039782546083, 0.781925043202765], "isController": false}, {"data": ["Get Product Categories", 5, 0, 0.0, 86.2, 80, 89, 89.0, 89.0, 89.0, 89.0, 1.2923235978288963, 4.514045942103903, 0.6953811546911346], "isController": false}, {"data": ["Get All Todos", 5, 0, 0.0, 87.8, 82, 91, 89.0, 91.0, 91.0, 91.0, 1.4766686355581806, 5.085277613703485, 0.7743857981393975], "isController": false}, {"data": ["Get All Quotes", 5, 0, 0.0, 89.2, 85, 93, 90.0, 93.0, 93.0, 93.0, 1.450536698578474, 6.997989646794314, 0.762098382651581], "isController": false}, {"data": ["Update Product (PUT)", 5, 0, 0.0, 993.4, 78, 4415, 90.0, 4415.0, 4415.0, 4415.0, 0.6077549532028685, 0.9377469004497386, 0.3537323751063571], "isController": false}, {"data": ["Get Todo By Id", 5, 0, 0.0, 86.8, 80, 91, 88.0, 91.0, 91.0, 91.0, 1.4714537963507945, 1.6346932018834608, 0.7745249963213655], "isController": false}, {"data": ["Get Caller IP Address", 5, 0, 0.0, 84.6, 77, 90, 84.0, 90.0, 90.0, 90.0, 1.3401232913428036, 1.4620954502814258, 0.6988533570088449], "isController": false}, {"data": ["Get Products - Field Selection", 5, 0, 0.0, 86.8, 81, 91, 89.0, 91.0, 91.0, 91.0, 1.3319126265316996, 4.2842322356153435, 0.738795285029302], "isController": false}, {"data": ["Get Recipes By Meal Type", 5, 0, 0.0, 87.6, 84, 91, 87.0, 91.0, 91.0, 91.0, 1.403705783267827, 34.3839376579169, 0.762168374508703], "isController": false}, {"data": ["Get All Recipes", 5, 0, 0.0, 88.8, 81, 94, 90.0, 94.0, 94.0, 94.0, 1.4624159110851127, 40.64802162547529, 0.7697677500731208], "isController": false}, {"data": ["Get Products By Category", 5, 0, 0.0, 87.0, 83, 91, 86.0, 91.0, 91.0, 91.0, 1.286008230452675, 10.649755658436215, 0.6982622813786008], "isController": false}, {"data": ["Mock 200 OK - PATCH", 5, 0, 0.0, 85.0, 77, 93, 85.0, 93.0, 93.0, 93.0, 1.416029453412631, 1.4812995610308695, 0.8186420277541773], "isController": false}, {"data": ["Get Posts - Sorted", 5, 0, 0.0, 90.6, 84, 94, 92.0, 94.0, 94.0, 94.0, 1.3865779256794233, 18.42713316347754, 0.7582848031059346], "isController": false}, {"data": ["Get Product By Id", 5, 0, 0.0, 8.6, 7, 12, 7.0, 12.0, 12.0, 12.0, 1.3224014810896587, 3.36050110751124, 0.6999429714361279], "isController": false}, {"data": ["Add New User", 5, 0, 0.0, 86.8, 81, 90, 88.0, 90.0, 90.0, 90.0, 1.3885031935573453, 2.466762704804221, 0.8583227749236323], "isController": false}, {"data": ["Test Route - PUT", 5, 0, 0.0, 86.8, 80, 99, 84.0, 99.0, 99.0, 99.0, 1.3509862199405567, 1.4151052924885166, 0.7784002634423128], "isController": false}, {"data": ["Get User's Todos", 5, 0, 0.0, 87.4, 83, 90, 87.0, 90.0, 90.0, 90.0, 1.3885031935573453, 1.6602376076089975, 0.738998281727298], "isController": false}, {"data": ["Get User's Posts", 5, 0, 0.0, 86.4, 80, 90, 87.0, 90.0, 90.0, 90.0, 1.3892747985551543, 2.2366781571269794, 0.7394089504028897], "isController": false}, {"data": ["Filter Users", 5, 0, 0.0, 91.8, 84, 97, 93.0, 97.0, 97.0, 97.0, 1.386193512614361, 44.64517777931799, 0.7729653278347657], "isController": false}, {"data": ["Get All Carts", 5, 0, 0.0, 1829.2, 89, 4767, 93.0, 4767.0, 4767.0, 4767.0, 0.6223549912870301, 18.920321057381127, 0.32637170929798354], "isController": false}, {"data": ["Get Posts - Field Selection", 5, 0, 0.0, 88.4, 81, 91, 90.0, 91.0, 91.0, 91.0, 1.3877324451845685, 6.017392190535665, 0.7684026332223147], "isController": false}, {"data": ["Update Post (PUT)", 5, 0, 0.0, 87.2, 82, 90, 88.0, 90.0, 90.0, 90.0, 1.3939224979091163, 2.026632631725676, 0.8385315026484527], "isController": false}, {"data": ["Get Posts - Paginated", 5, 0, 0.0, 88.8, 82, 92, 90.0, 92.0, 92.0, 92.0, 1.3873473917869035, 8.294819991675915, 0.7492217848224195], "isController": false}, {"data": ["Get Recipe By Id", 5, 0, 0.0, 83.0, 77, 86, 85.0, 86.0, 86.0, 86.0, 1.4168319637291016, 2.529266435250779, 0.7485411058373477], "isController": false}, {"data": ["Get Products - Paginated", 5, 0, 0.0, 89.0, 85, 93, 89.0, 93.0, 93.0, 93.0, 1.337971635001338, 21.653450712469894, 0.7264767861921327], "isController": false}, {"data": ["Get Posts By User Id", 5, 0, 0.0, 86.4, 80, 90, 87.0, 90.0, 90.0, 90.0, 1.3892747985551543, 2.236135471658794, 0.7380522367324256], "isController": false}, {"data": ["Get Carts - Paginated", 5, 0, 0.0, 87.6, 81, 98, 86.0, 98.0, 98.0, 98.0, 1.4854426619132501, 16.50030869355318, 0.8021970625371361], "isController": false}, {"data": ["Get Recipe Tags", 5, 0, 0.0, 85.8, 84, 88, 85.0, 88.0, 88.0, 88.0, 1.4088475626937165, 2.7659640039447733, 0.748450267681037], "isController": false}, {"data": ["Get Authenticated User (alias: /user/me)", 5, 0, 0.0, 87.0, 80, 93, 86.0, 93.0, 93.0, 93.0, 1.3598041881968996, 3.302040131221104, 0.7157563060919228], "isController": false}, {"data": ["Get Products - Sorted", 5, 0, 0.0, 91.4, 85, 98, 91.0, 98.0, 98.0, 98.0, 1.3336889837289945, 55.52418144838624, 0.7332684549213123], "isController": false}, {"data": ["Generate Square Image", 5, 0, 0.0, 102.2, 100, 104, 102.0, 104.0, 104.0, 104.0, 1.4306151645207439, 4.485481491416309, 0.7558230507868383], "isController": false}, {"data": ["Get Authenticated User (me)", 5, 0, 0.0, 86.8, 82, 90, 87.0, 90.0, 90.0, 90.0, 1.3683634373289546, 3.320686661877395, 0.7202616139846744], "isController": false}, {"data": ["Delete Product", 5, 0, 0.0, 897.8, 82, 4141, 91.0, 4141.0, 4141.0, 4141.0, 0.6230529595015577, 1.6004672897196262, 0.34316588785046725], "isController": false}, {"data": ["Get Random Todo", 5, 0, 0.0, 85.8, 79, 89, 87.0, 89.0, 89.0, 89.0, 1.4684287812041115, 1.6009315345080763, 0.7801027900146843], "isController": false}, {"data": ["Delete Cart", 5, 0, 0.0, 85.2, 79, 89, 85.0, 89.0, 89.0, 89.0, 1.4688601645123385, 3.053335689629847, 0.8047173362220916], "isController": false}, {"data": ["Test Route - PATCH", 5, 0, 0.0, 84.6, 77, 90, 85.0, 90.0, 90.0, 90.0, 1.348435814455232, 1.417701169768069, 0.779564455231931], "isController": false}, {"data": ["Get All Comments", 5, 0, 0.0, 910.2, 81, 4197, 91.0, 4197.0, 4197.0, 4197.0, 0.6552221202987812, 3.29159534300878, 0.34552729000131044], "isController": false}, {"data": ["Add New Cart", 5, 0, 0.0, 83.8, 77, 87, 85.0, 87.0, 87.0, 87.0, 1.475361463558572, 2.3568323067276484, 1.044567442460903], "isController": false}, {"data": ["Generate Image With Background Color", 5, 0, 0.0, 120.8, 103, 162, 110.0, 162.0, 162.0, 162.0, 1.424095699230988, 10.145012994873255, 0.7676765878667046], "isController": false}, {"data": ["Get User's Carts", 5, 0, 0.0, 88.0, 81, 91, 89.0, 91.0, 91.0, 91.0, 1.3885031935573453, 2.861618300472091, 0.738998281727298], "isController": false}, {"data": ["Generate Image - Custom Format", 5, 0, 0.0, 129.4, 121, 151, 123.0, 151.0, 151.0, 151.0, 1.4080540692762602, 3.582287559842298, 0.7865302027597859], "isController": false}, {"data": ["Test Route - POST", 5, 0, 0.0, 84.8, 79, 89, 85.0, 89.0, 89.0, 89.0, 1.3539128080151637, 1.4179063430815055, 0.7708312178445708], "isController": false}, {"data": ["Test Route - DELETE", 5, 0, 0.0, 84.8, 79, 88, 85.0, 88.0, 88.0, 88.0, 1.3444474321054047, 1.411669803710675, 0.7326188155418123], "isController": false}, {"data": ["Get Post By Id", 5, 0, 0.0, 86.0, 80, 89, 87.0, 89.0, 89.0, 89.0, 1.3892747985551543, 2.0350705056960265, 0.7312686683801055], "isController": false}, {"data": ["Test Route - GET", 5, 0, 0.0, 84.8, 80, 87, 86.0, 87.0, 87.0, 87.0, 1.3572204125950054, 1.4200448730998914, 0.7104200597176982], "isController": false}, {"data": ["Search Products", 5, 0, 0.0, 90.2, 84, 94, 92.0, 94.0, 94.0, 94.0, 1.2939958592132506, 48.45913399327122, 0.7013356463509317], "isController": false}, {"data": ["Create Custom Mock Response", 5, 0, 0.0, 95.4, 92, 97, 96.0, 97.0, 97.0, 97.0, 1.4338973329509608, 1.535838471465443, 0.9143896078290794], "isController": false}, {"data": ["Delete Todo", 5, 0, 0.0, 86.2, 80, 89, 87.0, 89.0, 89.0, 89.0, 1.4534883720930232, 1.6910996547965116, 0.7962958757267442], "isController": false}, {"data": ["Get Quotes - Paginated", 5, 0, 0.0, 87.4, 83, 90, 88.0, 90.0, 90.0, 90.0, 1.4484356894553883, 3.367330080388181, 0.7836263398030128], "isController": false}, {"data": ["Mock 200 OK - GET", 5, 0, 0.0, 86.6, 78, 93, 86.0, 93.0, 93.0, 93.0, 1.4180374361883152, 1.4822922575155986, 0.7477931792399319], "isController": false}, {"data": ["Get Post Tags", 5, 0, 0.0, 88.4, 82, 92, 89.0, 92.0, 92.0, 92.0, 1.3888888888888888, 20.60763888888889, 0.735134548611111], "isController": false}, {"data": ["Search Posts", 5, 0, 0.0, 88.2, 81, 93, 89.0, 93.0, 93.0, 93.0, 1.3892747985551543, 2.117016011392053, 0.7489059460961378], "isController": false}, {"data": ["Get Comments For Post", 5, 0, 0.0, 86.4, 80, 90, 87.0, 90.0, 90.0, 90.0, 1.3892747985551543, 2.027201566407335, 0.7434790914142817], "isController": false}, {"data": ["Search Users", 5, 0, 0.0, 152.0, 87, 373, 101.0, 373.0, 373.0, 373.0, 1.3885031935573453, 1.4663353061649542, 0.7484900027770064], "isController": false}, {"data": ["Update Comment (PATCH)", 5, 0, 0.0, 86.0, 81, 89, 87.0, 89.0, 89.0, 89.0, 1.4827995255041517, 1.7049298450474497, 0.8471071508007118], "isController": false}, {"data": ["Get Cart By Id", 5, 0, 0.0, 84.0, 77, 88, 86.0, 88.0, 88.0, 88.0, 1.483679525222552, 2.970546643175074, 0.7809602188427299], "isController": false}, {"data": ["Get Comment By Id", 5, 0, 0.0, 2367.0, 87, 4353, 3350.0, 4353.0, 4353.0, 4353.0, 0.6552221202987812, 0.7536334114139693, 0.346807020705019], "isController": false}, {"data": ["Add New Recipe", 5, 0, 0.0, 84.6, 80, 88, 84.0, 88.0, 88.0, 88.0, 1.4017381553125876, 1.8696230200448556, 1.4085825798990748], "isController": false}, {"data": ["Add New Comment", 5, 0, 0.0, 87.4, 83, 91, 87.0, 91.0, 91.0, 91.0, 1.4858841010401187, 1.7041233283803863, 0.9431881500742941], "isController": false}, {"data": ["Get Post Tag List", 5, 0, 0.0, 87.8, 81, 91, 89.0, 91.0, 91.0, 91.0, 1.3896609227348526, 3.686944135630906, 0.740971546692607], "isController": false}, {"data": ["Get Carts By User Id", 5, 0, 0.0, 84.8, 79, 89, 85.0, 89.0, 89.0, 89.0, 1.4784151389710232, 3.050386235955056, 0.785408042578356], "isController": false}, {"data": ["Login (get access + refresh token)", 5, 0, 0.0, 273.2, 111, 426, 352.0, 426.0, 426.0, 426.0, 1.2462612163509472, 3.53504914942672, 0.3213017198404786], "isController": false}, {"data": ["Update Cart", 5, 0, 0.0, 86.4, 83, 89, 86.0, 89.0, 89.0, 89.0, 1.4710208884966167, 3.3161177919976463, 0.9524285635481023], "isController": false}, {"data": ["Mock 200 OK - DELETE", 5, 0, 0.0, 85.4, 77, 93, 84.0, 93.0, 93.0, 93.0, 1.4140271493212668, 1.4792049632352942, 0.776057869061086], "isController": false}, {"data": ["Generate Image With Text + Colors", 5, 0, 0.0, 110.2, 91, 121, 112.0, 121.0, 121.0, 121.0, 1.4208581983518045, 8.86454559178744, 0.79923273657289], "isController": false}, {"data": ["Update Todo (PATCH)", 5, 0, 0.0, 87.0, 82, 89, 88.0, 89.0, 89.0, 89.0, 1.4564520827264782, 1.615751529274687, 0.8377444108651326], "isController": false}, {"data": ["Mock 201 Created - POST", 5, 0, 0.0, 85.0, 78, 91, 85.0, 91.0, 91.0, 91.0, 1.4200511218403862, 1.4966007526270946, 0.8195802861403011], "isController": false}, {"data": ["Refresh Token", 5, 0, 0.0, 86.6, 82, 91, 86.0, 91.0, 91.0, 91.0, 1.3657470636438132, 3.642170001365747, 1.3057288821360284], "isController": false}, {"data": ["Get Posts By Tag", 5, 0, 0.0, 90.6, 82, 99, 90.0, 99.0, 99.0, 99.0, 1.3892747985551543, 19.908145057654902, 0.7448358050847457], "isController": false}, {"data": ["Get Recipes By Tag", 5, 0, 0.0, 84.2, 78, 89, 84.0, 89.0, 89.0, 89.0, 1.4080540692762602, 2.5721737714728246, 0.7549039883131512], "isController": false}, {"data": ["Update Recipe (PATCH)", 5, 0, 0.0, 84.2, 78, 89, 84.0, 89.0, 89.0, 89.0, 1.3958682300390843, 2.494569200167504, 0.7988074050809604], "isController": false}, {"data": ["Get Users - Sorted", 5, 0, 0.0, 90.8, 83, 94, 93.0, 94.0, 94.0, 94.0, 1.3789299503585217, 57.70363994415334, 0.7594887617209046], "isController": false}, {"data": ["Get Comments By Post Id", 5, 0, 0.0, 86.6, 80, 90, 88.0, 90.0, 90.0, 90.0, 1.4858841010401187, 2.156563428677563, 0.793729104754829], "isController": false}, {"data": ["Mock 200 OK - PUT", 5, 0, 0.0, 84.0, 77, 90, 83.0, 90.0, 90.0, 90.0, 1.4180374361883152, 1.48838538712422, 0.8170332884288146], "isController": false}, {"data": ["Add New Todo", 5, 0, 0.0, 86.6, 80, 90, 87.0, 90.0, 90.0, 90.0, 1.4624159110851127, 1.612941923808131, 0.9325757714243931], "isController": false}, {"data": ["Generate Identicon", 5, 0, 0.0, 117.0, 102, 135, 112.0, 135.0, 135.0, 135.0, 1.411631846414455, 3.357312694099379, 0.7540650585827217], "isController": false}, {"data": ["Get Recipes - Field Selection", 5, 0, 0.0, 86.4, 79, 91, 89.0, 91.0, 91.0, 91.0, 1.419244961680386, 4.893900351263127, 0.7900094024978711], "isController": false}, {"data": ["Get Product Category List", 5, 0, 0.0, 85.2, 82, 88, 87.0, 88.0, 88.0, 88.0, 1.289324394017535, 1.7509125999226405, 0.6975446428571428], "isController": false}, {"data": ["Get Todos By User Id", 5, 0, 0.0, 85.8, 80, 89, 87.0, 89.0, 89.0, 89.0, 1.4649868151186638, 1.7499725314972165, 0.7782742455317903], "isController": false}, {"data": ["Get All Products", 5, 0, 0.0, 12.0, 8, 15, 12.0, 15.0, 15.0, 15.0, 1.364256480218281, 60.196484907912684, 0.7194321282401092], "isController": false}, {"data": ["Update Product (PATCH)", 5, 0, 0.0, 951.0, 79, 4417, 85.0, 4417.0, 4417.0, 4417.0, 0.6239860227130912, 0.9715657369274928, 0.3583044739797829], "isController": false}, {"data": ["Get Comments - Paginated", 5, 0, 0.0, 93.8, 88, 110, 90.0, 110.0, 110.0, 110.0, 0.655050438883794, 1.5622697088300799, 0.35567191798768505], "isController": false}, {"data": ["Get Products - Simulate Delay (perf testing)", 5, 0, 0.0, 2107.8, 2082, 2183, 2091.0, 2183.0, 2183.0, 2183.0, 0.8536793580331228, 37.64792662625918, 0.459352857691651], "isController": false}, {"data": ["Get Users - Paginated", 5, 0, 0.0, 91.0, 81, 101, 91.0, 101.0, 101.0, 101.0, 1.3831258644536653, 20.416774723374825, 0.7469419951590595], "isController": false}, {"data": ["Generate Sized Image", 5, 0, 0.0, 107.8, 101, 113, 108.0, 113.0, 113.0, 113.0, 1.4265335235378032, 10.141761768901569, 0.7592390335235378], "isController": false}, {"data": ["Delete Post", 5, 0, 0.0, 895.0, 81, 4128, 89.0, 4128.0, 4128.0, 4128.0, 0.6555657532450505, 0.9956404877409204, 0.35915272223679034], "isController": false}, {"data": ["Get Users - Field Selection", 5, 0, 0.0, 87.2, 80, 90, 89.0, 90.0, 90.0, 90.0, 1.3762730525736306, 3.8941538501238644, 0.7620574421965318], "isController": false}, {"data": ["Delete Comment", 5, 0, 0.0, 90.8, 81, 111, 88.0, 111.0, 111.0, 111.0, 1.4801657785671996, 1.7857390652753107, 0.8152475577264653], "isController": false}, {"data": ["Search Recipes", 5, 0, 0.0, 83.0, 77, 87, 84.0, 87.0, 87.0, 87.0, 1.4128284826222097, 1.5011302627860976, 0.7643622845436564], "isController": false}, {"data": ["Update Post (PATCH)", 5, 0, 0.0, 87.2, 81, 91, 88.0, 91.0, 91.0, 91.0, 1.3943112102621305, 2.023929866146124, 0.7938314800613497], "isController": false}, {"data": ["Get Todos - Paginated", 5, 0, 0.0, 86.2, 80, 91, 87.0, 91.0, 91.0, 91.0, 1.474491300501327, 2.7635192421114714, 0.7962828995871424], "isController": false}]}, function(index, item){
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
