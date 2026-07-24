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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9715277777777778, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.975, 500, 1500, "Get User By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Post"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Recipe"], "isController": false}, {"data": [1.0, 500, 1500, "Get Quote By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Product"], "isController": false}, {"data": [0.9, 500, 1500, "Get Recipes - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Update User (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Update User (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Login (alias: /user/login)"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Posts"], "isController": false}, {"data": [0.95, 500, 1500, "Get Recipes - Sorted"], "isController": false}, {"data": [0.95, 500, 1500, "Update Todo (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Update Recipe (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Users"], "isController": false}, {"data": [1.0, 500, 1500, "Delete User"], "isController": false}, {"data": [1.0, 500, 1500, "Get Random Quote"], "isController": false}, {"data": [0.95, 500, 1500, "Update Comment (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Generate 2FA TOTP Code"], "isController": false}, {"data": [1.0, 500, 1500, "Get Product Categories"], "isController": false}, {"data": [0.95, 500, 1500, "Get All Todos"], "isController": false}, {"data": [0.9, 500, 1500, "Get All Quotes"], "isController": false}, {"data": [0.975, 500, 1500, "Update Product (PUT)"], "isController": false}, {"data": [0.9, 500, 1500, "Get Todo By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Caller IP Address"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products - Field Selection"], "isController": false}, {"data": [0.9, 500, 1500, "Get Recipes By Meal Type"], "isController": false}, {"data": [0.9, 500, 1500, "Get All Recipes"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products By Category"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - PATCH"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Get Product By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New User"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - PUT"], "isController": false}, {"data": [1.0, 500, 1500, "Get User's Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get User's Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Filter Users"], "isController": false}, {"data": [0.95, 500, 1500, "Get All Carts"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Update Post (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts - Paginated"], "isController": false}, {"data": [0.95, 500, 1500, "Get Recipe By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts By User Id"], "isController": false}, {"data": [0.95, 500, 1500, "Get Carts - Paginated"], "isController": false}, {"data": [0.95, 500, 1500, "Get Recipe Tags"], "isController": false}, {"data": [1.0, 500, 1500, "Get Authenticated User (alias: /user/me)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Square Image"], "isController": false}, {"data": [1.0, 500, 1500, "Get Authenticated User (me)"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Product"], "isController": false}, {"data": [0.95, 500, 1500, "Get Random Todo"], "isController": false}, {"data": [0.95, 500, 1500, "Delete Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - PATCH"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Comments"], "isController": false}, {"data": [0.95, 500, 1500, "Add New Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Image With Background Color"], "isController": false}, {"data": [1.0, 500, 1500, "Get User's Carts"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Image - Custom Format"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - POST"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - DELETE"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - GET"], "isController": false}, {"data": [1.0, 500, 1500, "Search Products"], "isController": false}, {"data": [1.0, 500, 1500, "Create Custom Mock Response"], "isController": false}, {"data": [0.95, 500, 1500, "Delete Todo"], "isController": false}, {"data": [0.95, 500, 1500, "Get Quotes - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - GET"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Tags"], "isController": false}, {"data": [1.0, 500, 1500, "Search Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comments For Post"], "isController": false}, {"data": [1.0, 500, 1500, "Search Users"], "isController": false}, {"data": [0.95, 500, 1500, "Update Comment (PATCH)"], "isController": false}, {"data": [0.95, 500, 1500, "Get Cart By Id"], "isController": false}, {"data": [0.95, 500, 1500, "Get Comment By Id"], "isController": false}, {"data": [0.95, 500, 1500, "Add New Recipe"], "isController": false}, {"data": [0.95, 500, 1500, "Add New Comment"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Tag List"], "isController": false}, {"data": [0.95, 500, 1500, "Get Carts By User Id"], "isController": false}, {"data": [0.975, 500, 1500, "Login (get access + refresh token)"], "isController": false}, {"data": [0.95, 500, 1500, "Update Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - DELETE"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Image With Text + Colors"], "isController": false}, {"data": [0.95, 500, 1500, "Update Todo (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 201 Created - POST"], "isController": false}, {"data": [1.0, 500, 1500, "Refresh Token"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts By Tag"], "isController": false}, {"data": [0.95, 500, 1500, "Get Recipes By Tag"], "isController": false}, {"data": [1.0, 500, 1500, "Update Recipe (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Users - Sorted"], "isController": false}, {"data": [0.95, 500, 1500, "Get Comments By Post Id"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - PUT"], "isController": false}, {"data": [0.95, 500, 1500, "Add New Todo"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Identicon"], "isController": false}, {"data": [0.95, 500, 1500, "Get Recipes - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Get Product Category List"], "isController": false}, {"data": [0.95, 500, 1500, "Get Todos By User Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Products"], "isController": false}, {"data": [1.0, 500, 1500, "Update Product (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comments - Paginated"], "isController": false}, {"data": [0.0, 500, 1500, "Get Products - Simulate Delay (perf testing)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Users - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Sized Image"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Post"], "isController": false}, {"data": [1.0, 500, 1500, "Get Users - Field Selection"], "isController": false}, {"data": [0.95, 500, 1500, "Delete Comment"], "isController": false}, {"data": [0.95, 500, 1500, "Search Recipes"], "isController": false}, {"data": [1.0, 500, 1500, "Update Post (PATCH)"], "isController": false}, {"data": [0.9, 500, 1500, "Get Todos - Paginated"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2160, 0, 0.0, 197.27222222222218, 7, 3252, 133.0, 149.0, 177.0, 2627.119999999999, 8.093858784647148, 51.98834315127459, 4.570140804102387], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get User By Id", 20, 0, 0.0, 163.9, 128, 646, 134.0, 160.60000000000002, 621.7499999999997, 646.0, 0.14440850277264328, 0.35091689245537777, 0.07601189745552217], "isController": false}, {"data": ["Add New Post", 20, 0, 0.0, 131.20000000000002, 127, 140, 130.5, 136.9, 139.85, 140.0, 0.14499583136984812, 0.16443716696269983, 0.09982623155834269], "isController": false}, {"data": ["Delete Recipe", 20, 0, 0.0, 132.75, 126, 164, 131.5, 135.9, 162.59999999999997, 164.0, 0.14439703408491988, 0.2659359048640141, 0.07939016620098623], "isController": false}, {"data": ["Get Quote By Id", 20, 0, 0.0, 130.2, 126, 135, 130.0, 134.0, 134.95, 135.0, 0.1447397940352731, 0.16315736743644113, 0.07632762576078854], "isController": false}, {"data": ["Add New Product", 20, 0, 0.0, 132.35, 126, 142, 132.0, 136.9, 141.75, 142.0, 0.14441475918838906, 0.17156304155534693, 0.1640179345079067], "isController": false}, {"data": ["Get Recipes - Paginated", 20, 0, 0.0, 406.75, 128, 3199, 135.0, 2191.7000000000044, 3159.4499999999994, 3199.0, 0.14224042899713385, 1.3459361687184848, 0.077093201263095], "isController": false}, {"data": ["Update User (PUT)", 20, 0, 0.0, 131.95, 127, 137, 131.5, 136.0, 136.95, 137.0, 0.14496955639315742, 0.35155117425340676, 0.08296109379530298], "isController": false}, {"data": ["Update User (PATCH)", 20, 0, 0.0, 132.85000000000005, 128, 144, 132.5, 137.9, 143.7, 144.0, 0.1449706072093883, 0.35152540791104603, 0.08579315231336847], "isController": false}, {"data": ["Login (alias: /user/login)", 20, 0, 0.0, 133.85, 126, 142, 134.5, 139.0, 141.85, 142.0, 0.14425538974199922, 0.4097754664858666, 0.09128661382110889], "isController": false}, {"data": ["Get All Posts", 20, 0, 0.0, 10.150000000000002, 8, 16, 10.0, 12.0, 15.799999999999997, 16.0, 0.14509786851231155, 2.2266571536876625, 0.07609136268663214], "isController": false}, {"data": ["Get Recipes - Sorted", 20, 0, 0.0, 295.2, 130, 3215, 136.5, 227.5000000000002, 3066.099999999998, 3215.0, 0.14214135958210442, 3.993498976138019, 0.07787236594293023], "isController": false}, {"data": ["Update Todo (PUT)", 20, 0, 0.0, 262.55000000000007, 127, 2758, 131.0, 139.8, 2627.099999999998, 2758.0, 0.14243188195245624, 0.1580173237227421, 0.08150886994544859], "isController": false}, {"data": ["Update Recipe (PUT)", 20, 0, 0.0, 142.65000000000003, 128, 270, 134.0, 148.8, 263.94999999999993, 270.0, 0.14438556721870083, 0.25738419375099264, 0.09292000859094125], "isController": false}, {"data": ["Get All Users", 20, 0, 0.0, 10.500000000000002, 7, 16, 10.0, 13.0, 15.849999999999998, 16.0, 0.14452328992817193, 6.068990224805978, 0.07579004559709797], "isController": false}, {"data": ["Delete User", 20, 0, 0.0, 131.60000000000002, 128, 138, 131.5, 136.9, 137.95, 138.0, 0.14497165804085302, 0.360234749887647, 0.07942294937589701], "isController": false}, {"data": ["Get Random Quote", 20, 0, 0.0, 137.5, 127, 193, 130.5, 149.70000000000002, 190.84999999999997, 193.0, 0.14471989464391669, 0.1661805548018061, 0.07702377205169395], "isController": false}, {"data": ["Update Comment (PUT)", 20, 0, 0.0, 257.05, 126, 2654, 131.0, 136.0, 2528.099999999998, 2654.0, 0.14243086761763007, 0.16453964340651905, 0.08595925408954629], "isController": false}, {"data": ["Generate 2FA TOTP Code", 20, 0, 0.0, 134.3, 127, 152, 132.0, 148.70000000000002, 151.85, 152.0, 0.14471675313492666, 0.15376861645357126, 0.07857667455372971], "isController": false}, {"data": ["Get Product Categories", 20, 0, 0.0, 133.54999999999998, 128, 138, 133.5, 137.0, 137.95, 138.0, 0.14439286410465593, 0.5046276784876291, 0.07769576965006389], "isController": false}, {"data": ["Get All Todos", 20, 0, 0.0, 256.65000000000003, 128, 2604, 133.0, 141.8, 2480.8999999999983, 2604.0, 0.14242782469983337, 0.4908404999750751, 0.07469115416387746], "isController": false}, {"data": ["Get All Quotes", 20, 0, 0.0, 384.79999999999995, 128, 2660, 132.0, 2378.300000000005, 2658.2, 2660.0, 0.14243391066545122, 0.6877860918627507, 0.0748334413457156], "isController": false}, {"data": ["Update Product (PUT)", 20, 0, 0.0, 154.75000000000003, 132, 529, 135.0, 138.0, 509.4499999999997, 529.0, 0.14441163091275372, 0.22282968498407862, 0.08405208205468868], "isController": false}, {"data": ["Get Todo By Id", 20, 0, 0.0, 384.05, 126, 2800, 131.0, 2288.7000000000053, 2786.3999999999996, 2800.0, 0.14243391066545122, 0.15798480052130812, 0.07497253696159982], "isController": false}, {"data": ["Get Caller IP Address", 20, 0, 0.0, 132.89999999999998, 127, 145, 132.5, 141.4, 144.85, 145.0, 0.14432305272121115, 0.15799427939499777, 0.07526221694641284], "isController": false}, {"data": ["Get Products - Field Selection", 20, 0, 0.0, 135.7, 129, 144, 135.5, 139.0, 143.75, 144.0, 0.14435847095507565, 0.4646820234005081, 0.08007383935789351], "isController": false}, {"data": ["Get Recipes By Meal Type", 20, 0, 0.0, 408.99999999999994, 128, 3252, 135.5, 2245.300000000005, 3213.2999999999993, 3252.0, 0.1421918879527923, 3.483076388148306, 0.07720575166186769], "isController": false}, {"data": ["Get All Recipes", 20, 0, 0.0, 387.99999999999994, 131, 2681, 136.0, 2383.6000000000054, 2678.55, 2681.0, 0.14223031354672622, 3.9533360120042387, 0.07486537011883343], "isController": false}, {"data": ["Get Products By Category", 20, 0, 0.0, 134.45000000000002, 129, 141, 134.0, 137.9, 140.85, 141.0, 0.1444043321299639, 1.1956932536101084, 0.07840703971119134], "isController": false}, {"data": ["Mock 200 OK - PATCH", 20, 0, 0.0, 131.85000000000002, 126, 138, 132.5, 134.9, 137.85, 138.0, 0.14489393763764924, 0.15164339156862175, 0.08376680769676596], "isController": false}, {"data": ["Get Posts - Sorted", 20, 0, 0.0, 134.45, 129, 141, 135.0, 138.9, 140.9, 141.0, 0.14497375974948534, 1.9262538871089334, 0.0792825248629998], "isController": false}, {"data": ["Get Product By Id", 20, 0, 0.0, 10.049999999999999, 8, 13, 10.0, 12.900000000000002, 13.0, 13.0, 0.14450345001986922, 0.3673548643473863, 0.07648522452223547], "isController": false}, {"data": ["Add New User", 20, 0, 0.0, 130.75, 126, 137, 131.0, 136.8, 137.0, 137.0, 0.14497165804085302, 0.2575653686266835, 0.08961626908189449], "isController": false}, {"data": ["Test Route - PUT", 20, 0, 0.0, 132.85, 127, 142, 132.5, 137.0, 141.75, 142.0, 0.14429389781106156, 0.15144518229730317, 0.08313808565285774], "isController": false}, {"data": ["Get User's Todos", 20, 0, 0.0, 130.9, 126, 138, 131.0, 136.9, 137.95, 138.0, 0.14496535328056595, 0.17342046657098953, 0.07715441165811371], "isController": false}, {"data": ["Get User's Posts", 20, 0, 0.0, 131.30000000000004, 126, 149, 130.5, 136.0, 148.35, 149.0, 0.1449643025404994, 0.23331608107128618, 0.07715385242634001], "isController": false}, {"data": ["Filter Users", 20, 0, 0.0, 141.4, 130, 233, 134.5, 161.00000000000006, 229.49999999999994, 233.0, 0.14495379597753216, 4.668432347345534, 0.0808287280304403], "isController": false}, {"data": ["Get All Carts", 20, 0, 0.0, 264.8, 130, 2720, 135.5, 141.9, 2591.099999999998, 2720.0, 0.14217874712088038, 4.322157546936759, 0.07456053437882106], "isController": false}, {"data": ["Get Posts - Field Selection", 20, 0, 0.0, 132.95, 128, 141, 132.5, 138.70000000000002, 140.9, 141.0, 0.1449748106266536, 0.6285167717734043, 0.08027413830596933], "isController": false}, {"data": ["Update Post (PUT)", 20, 0, 0.0, 131.19999999999996, 127, 140, 131.0, 135.0, 139.75, 140.0, 0.14499478018791323, 0.21123360652766499, 0.08722342245679156], "isController": false}, {"data": ["Get Posts - Paginated", 20, 0, 0.0, 132.70000000000002, 127, 140, 133.0, 137.9, 139.9, 140.0, 0.14497270888755193, 0.8667074477917033, 0.07829092579571896], "isController": false}, {"data": ["Get Recipe By Id", 20, 0, 0.0, 269.9000000000001, 125, 2894, 131.5, 137.8, 2756.199999999998, 2894.0, 0.14215954565809208, 0.2539783015665982, 0.07510577558694122], "isController": false}, {"data": ["Get Products - Paginated", 20, 0, 0.0, 142.49999999999997, 133, 224, 137.5, 149.4, 220.29999999999995, 224.0, 0.14433763459484425, 2.3357888773418782, 0.07837082503391934], "isController": false}, {"data": ["Get Posts By User Id", 20, 0, 0.0, 130.75, 127, 136, 130.0, 136.0, 136.0, 136.0, 0.14498532023632607, 0.23340654336873393, 0.07702345137554822], "isController": false}, {"data": ["Get Carts - Paginated", 20, 0, 0.0, 258.25, 130, 2605, 134.0, 146.10000000000002, 2482.099999999998, 2605.0, 0.14218380099955213, 1.5795662216609911, 0.07678480659448468], "isController": false}, {"data": ["Get Recipe Tags", 20, 0, 0.0, 257.75, 127, 2645, 132.0, 138.9, 2519.699999999998, 2645.0, 0.14217268294069976, 0.2794373538287103, 0.07552923781224676], "isController": false}, {"data": ["Get Authenticated User (alias: /user/me)", 20, 0, 0.0, 134.05, 128, 140, 134.5, 139.8, 140.0, 140.0, 0.14426683593975417, 0.35035426524900454, 0.07593732868313231], "isController": false}, {"data": ["Get Products - Sorted", 20, 0, 0.0, 140.5, 133, 162, 139.5, 150.70000000000002, 161.45, 162.0, 0.14434805202303796, 6.0093616478051874, 0.07936323563376012], "isController": false}, {"data": ["Generate Square Image", 20, 0, 0.0, 151.65, 139, 174, 149.0, 168.0, 173.7, 174.0, 0.14469790694477602, 0.45345271815018195, 0.07644684341516], "isController": false}, {"data": ["Get Authenticated User (me)", 20, 0, 0.0, 134.55, 128, 140, 134.5, 139.9, 140.0, 140.0, 0.1442335429527491, 0.3507100572246582, 0.07591980434719899], "isController": false}, {"data": ["Delete Product", 20, 0, 0.0, 133.39999999999998, 127, 138, 133.0, 138.0, 138.0, 138.0, 0.14483937313519307, 0.3721410065612236, 0.07977481098461806], "isController": false}, {"data": ["Get Random Todo", 20, 0, 0.0, 259.19999999999993, 126, 2697, 131.5, 136.9, 2568.999999999998, 2697.0, 0.14243593943623856, 0.15554588796345095, 0.07566909282550174], "isController": false}, {"data": ["Delete Cart", 20, 0, 0.0, 264.29999999999995, 128, 2738, 134.0, 142.60000000000002, 2608.249999999998, 2738.0, 0.14222424496703953, 0.2956222599610306, 0.07791777483057537], "isController": false}, {"data": ["Test Route - PATCH", 20, 0, 0.0, 133.3, 127, 142, 133.0, 138.8, 141.85, 142.0, 0.1443001443001443, 0.15154333513708515, 0.08342352092352093], "isController": false}, {"data": ["Get All Comments", 20, 0, 0.0, 132.0, 128, 139, 132.0, 136.9, 138.9, 139.0, 0.14499583136984812, 0.7287456501250589, 0.07646264544894334], "isController": false}, {"data": ["Add New Cart", 20, 0, 0.0, 254.14999999999998, 127, 2565, 133.0, 138.8, 2443.6999999999985, 2565.0, 0.1422070534698521, 0.2269966203604949, 0.10068370484926054], "isController": false}, {"data": ["Generate Image With Background Color", 20, 0, 0.0, 162.85, 149, 255, 155.0, 185.30000000000004, 251.59999999999997, 255.0, 0.14470209456281882, 1.0310448169518505, 0.07800347285026951], "isController": false}, {"data": ["Get User's Carts", 20, 0, 0.0, 132.79999999999998, 128, 140, 132.5, 137.9, 139.9, 140.0, 0.14496009973254861, 0.2991500808152556, 0.07715161558031153], "isController": false}, {"data": ["Generate Image - Custom Format", 20, 0, 0.0, 172.69999999999996, 157, 219, 168.0, 185.70000000000002, 217.34999999999997, 219.0, 0.14484147100997957, 0.3688506874538318, 0.08090754044698079], "isController": false}, {"data": ["Test Route - POST", 20, 0, 0.0, 136.0, 126, 188, 132.5, 140.0, 185.59999999999997, 188.0, 0.14428036560644644, 0.1512619008757818, 0.08214399721538894], "isController": false}, {"data": ["Test Route - DELETE", 20, 0, 0.0, 132.99999999999997, 126, 142, 132.5, 140.70000000000002, 141.95, 142.0, 0.14430847379358117, 0.15191849096628954, 0.0786368441179866], "isController": false}, {"data": ["Get Post By Id", 20, 0, 0.0, 130.84999999999997, 126, 136, 130.5, 135.0, 135.95, 136.0, 0.14497901428768184, 0.21230081242615131, 0.07631219599712942], "isController": false}, {"data": ["Test Route - GET", 20, 0, 0.0, 132.10000000000005, 125, 138, 133.0, 137.60000000000002, 138.0, 138.0, 0.14427620236180141, 0.1515322808985522, 0.07551957467375545], "isController": false}, {"data": ["Search Products", 20, 0, 0.0, 137.6, 129, 163, 137.0, 143.70000000000002, 162.04999999999998, 163.0, 0.14438244020762195, 5.407136485623119, 0.07825415460471698], "isController": false}, {"data": ["Create Custom Mock Response", 20, 0, 0.0, 228.3, 222, 250, 227.0, 235.70000000000002, 249.29999999999998, 250.0, 0.14461106853118535, 0.1548496451605906, 0.09221780053795318], "isController": false}, {"data": ["Delete Todo", 20, 0, 0.0, 254.65000000000003, 126, 2622, 130.5, 134.8, 2497.6499999999983, 2622.0, 0.1424369538433051, 0.16624367713459579, 0.07803430772079507], "isController": false}, {"data": ["Get Quotes - Paginated", 20, 0, 0.0, 244.9, 128, 2360, 133.0, 149.5, 2249.4999999999986, 2360.0, 0.14243593943623856, 0.3313791604647685, 0.07706006879655876], "isController": false}, {"data": ["Mock 200 OK - GET", 20, 0, 0.0, 131.44999999999996, 126, 137, 132.0, 136.8, 137.0, 137.0, 0.14488554042306578, 0.15170534808751088, 0.0764044842074761], "isController": false}, {"data": ["Get Post Tags", 20, 0, 0.0, 132.7, 129, 138, 132.5, 136.0, 137.9, 138.0, 0.14498742234111192, 2.151463262905693, 0.07674138955945571], "isController": false}, {"data": ["Search Posts", 20, 0, 0.0, 131.0, 126, 140, 131.0, 136.0, 139.8, 140.0, 0.1449832181924942, 0.22066049370410373, 0.07815501605689142], "isController": false}, {"data": ["Get Comments For Post", 20, 0, 0.0, 130.09999999999997, 126, 135, 130.0, 134.9, 135.0, 135.0, 0.14498742234111192, 0.2113503177036892, 0.07759092523723567], "isController": false}, {"data": ["Search Users", 20, 0, 0.0, 134.9, 126, 156, 131.0, 153.70000000000002, 155.9, 156.0, 0.14495379597753216, 0.1539143187171589, 0.07813915564413844], "isController": false}, {"data": ["Update Comment (PATCH)", 20, 0, 0.0, 249.50000000000003, 127, 2504, 131.0, 134.9, 2385.5499999999984, 2504.0, 0.14243289630172984, 0.163832604403313, 0.08137035579737496], "isController": false}, {"data": ["Get Cart By Id", 20, 0, 0.0, 246.34999999999997, 127, 2418, 133.0, 136.0, 2303.8999999999983, 2418.0, 0.1421949207974291, 0.28506332339746326, 0.07484674053692802], "isController": false}, {"data": ["Get Comment By Id", 20, 0, 0.0, 254.95, 127, 2618, 130.5, 135.9, 2493.8999999999983, 2618.0, 0.1424298532972511, 0.16375955837843614, 0.07538767625694347], "isController": false}, {"data": ["Add New Recipe", 20, 0, 0.0, 240.89999999999995, 126, 2256, 133.0, 155.3, 2150.999999999998, 2256.0, 0.14221716561188938, 0.18975019777074595, 0.14291158536585366], "isController": false}, {"data": ["Add New Comment", 20, 0, 0.0, 244.34999999999997, 126, 2402, 130.0, 137.8, 2288.7999999999984, 2402.0, 0.142426810422794, 0.1630745252736375, 0.09040764333478134], "isController": false}, {"data": ["Get Post Tag List", 20, 0, 0.0, 131.29999999999998, 127, 137, 131.0, 136.9, 137.0, 137.0, 0.14499162673355614, 0.38448267893779137, 0.07730998847316568], "isController": false}, {"data": ["Get Carts By User Id", 20, 0, 0.0, 250.39999999999998, 128, 2473, 133.0, 141.60000000000002, 2356.4499999999985, 2473.0, 0.14219896479153632, 0.29340340113261476, 0.07554320004550368], "isController": false}, {"data": ["Login (get access + refresh token)", 20, 0, 0.0, 181.9, 127, 533, 147.0, 461.2000000000007, 531.05, 533.0, 0.1438300504124327, 0.408244181175523, 0.037081184871955296], "isController": false}, {"data": ["Update Cart", 20, 0, 0.0, 261.95000000000005, 128, 2681, 135.5, 141.8, 2554.0499999999984, 2681.0, 0.1422161543329707, 0.32057659984285114, 0.09207940461206988], "isController": false}, {"data": ["Mock 200 OK - DELETE", 20, 0, 0.0, 131.1, 126, 137, 131.0, 135.0, 136.9, 137.0, 0.1448991863910684, 0.15200264259891183, 0.0795247487810356], "isController": false}, {"data": ["Generate Image With Text + Colors", 20, 0, 0.0, 168.3, 148, 280, 162.0, 184.0, 275.19999999999993, 280.0, 0.14471989464391669, 0.9031072605066643, 0.08140494073720314], "isController": false}, {"data": ["Update Todo (PATCH)", 20, 0, 0.0, 266.1, 125, 2781, 131.0, 187.20000000000013, 2651.599999999998, 2781.0, 0.14243593943623856, 0.15830002038614385, 0.08192848469525832], "isController": false}, {"data": ["Mock 201 Created - POST", 20, 0, 0.0, 132.89999999999998, 127, 146, 132.5, 143.3, 145.9, 146.0, 0.14488659002166054, 0.15336188957468544, 0.08362106904570449], "isController": false}, {"data": ["Refresh Token", 20, 0, 0.0, 134.29999999999998, 128, 145, 134.0, 138.9, 144.7, 145.0, 0.14424498568368516, 0.3850805833627834, 0.13790609471125762], "isController": false}, {"data": ["Get Posts By Tag", 20, 0, 0.0, 133.24999999999997, 130, 138, 133.0, 137.9, 138.0, 138.0, 0.14499162673355614, 2.0776280638543123, 0.07773476862961165], "isController": false}, {"data": ["Get Recipes By Tag", 20, 0, 0.0, 258.79999999999995, 126, 2663, 132.5, 137.8, 2536.749999999998, 2663.0, 0.14218380099955213, 0.26007555513887803, 0.07622940112183019], "isController": false}, {"data": ["Update Recipe (PATCH)", 20, 0, 0.0, 135.55, 127, 149, 134.0, 145.8, 148.85, 149.0, 0.1443918216472219, 0.2576491567517616, 0.08263047605983596], "isController": false}, {"data": ["Get Users - Sorted", 20, 0, 0.0, 143.25, 131, 234, 138.0, 157.40000000000003, 230.24999999999994, 234.0, 0.14438869436523122, 6.041990037180089, 0.07952658556835], "isController": false}, {"data": ["Get Comments By Post Id", 20, 0, 0.0, 242.7, 127, 2375, 130.0, 138.60000000000002, 2263.1999999999985, 2375.0, 0.1424298532972511, 0.20757342926577413, 0.07608313452499645], "isController": false}, {"data": ["Mock 200 OK - PUT", 20, 0, 0.0, 131.70000000000002, 126, 140, 131.5, 136.0, 139.8, 140.0, 0.1448897389086905, 0.15173804297429655, 0.08348139253528065], "isController": false}, {"data": ["Add New Todo", 20, 0, 0.0, 261.25, 126, 2742, 131.0, 136.0, 2611.699999999998, 2742.0, 0.1424349250436207, 0.1567688303421999, 0.09083008403660578], "isController": false}, {"data": ["Generate Identicon", 20, 0, 0.0, 136.8, 130, 142, 137.0, 142.0, 142.0, 142.0, 0.14487609471999072, 0.3448517940187904, 0.07738986700374505], "isController": false}, {"data": ["Get Recipes - Field Selection", 20, 0, 0.0, 261.75000000000006, 129, 2688, 133.5, 139.9, 2560.599999999998, 2688.0, 0.14215247274226334, 0.49021085876085696, 0.07912784127254895], "isController": false}, {"data": ["Get Product Category List", 20, 0, 0.0, 132.6, 128, 141, 133.0, 136.8, 140.8, 141.0, 0.1443991191653731, 0.19546056550305044, 0.07812217970470381], "isController": false}, {"data": ["Get Todos By User Id", 20, 0, 0.0, 260.94999999999993, 126, 2738, 131.0, 137.8, 2607.999999999998, 2738.0, 0.1424369538433051, 0.17063919250710402, 0.07566963172925584], "isController": false}, {"data": ["Get All Products", 20, 0, 0.0, 11.8, 7, 16, 11.5, 14.900000000000002, 15.95, 16.0, 0.14445022245334257, 6.373809639885596, 0.07617492199687988], "isController": false}, {"data": ["Update Product (PATCH)", 20, 0, 0.0, 132.65000000000003, 126, 140, 132.5, 136.9, 139.85, 140.0, 0.14483307987544355, 0.22583494007531318, 0.08316587008472735], "isController": false}, {"data": ["Get Comments - Paginated", 20, 0, 0.0, 131.59999999999997, 127, 138, 131.5, 136.9, 137.95, 138.0, 0.14499898500710495, 0.3454345936765943, 0.07872991764057652], "isController": false}, {"data": ["Get Products - Simulate Delay (perf testing)", 20, 0, 0.0, 2138.0499999999997, 2132, 2144, 2138.0, 2142.9, 2143.95, 2144.0, 0.14231026483940287, 6.275868781930865, 0.07657515227198337], "isController": false}, {"data": ["Get Users - Paginated", 20, 0, 0.0, 136.25000000000003, 131, 145, 136.0, 140.9, 144.8, 145.0, 0.1443845248666248, 2.1318290496249612, 0.07797328344848], "isController": false}, {"data": ["Generate Sized Image", 20, 0, 0.0, 168.45, 147, 292, 160.5, 213.3000000000001, 288.29999999999995, 292.0, 0.14469162597214685, 1.0282713872309641, 0.07700872671369145], "isController": false}, {"data": ["Delete Post", 20, 0, 0.0, 129.95000000000005, 126, 136, 129.5, 135.8, 136.0, 136.0, 0.14499898500710495, 0.22030216882231826, 0.07943792049705653], "isController": false}, {"data": ["Get Users - Field Selection", 20, 0, 0.0, 135.05, 130, 149, 134.0, 138.0, 148.45, 149.0, 0.14440016172818113, 0.4085650279053313, 0.0799559489256628], "isController": false}, {"data": ["Delete Comment", 20, 0, 0.0, 251.05, 127, 2539, 130.5, 136.0, 2418.849999999998, 2539.0, 0.14243391066545122, 0.1719152264521137, 0.07844992735870557], "isController": false}, {"data": ["Search Recipes", 20, 0, 0.0, 267.7, 127, 2825, 133.0, 144.4, 2690.999999999998, 2825.0, 0.14216661927779356, 0.1509687322291726, 0.07691436238271254], "isController": false}, {"data": ["Update Post (PATCH)", 20, 0, 0.0, 130.6, 126, 135, 131.0, 135.0, 135.0, 135.0, 0.1449968825670248, 0.21059947601751564, 0.08255193607087448], "isController": false}, {"data": ["Get Todos - Paginated", 20, 0, 0.0, 360.85, 127, 2464, 130.0, 2182.5000000000045, 2461.3, 2464.0, 0.1424298532972511, 0.26705597493234584, 0.07691768444666003], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2160, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
