// 1st step
let selectedType;

// 2nd step
let a;
let b;
let c;
let d;
let e;
let f;
let span;

// 3rd step
let loadType = 'uniform';
let loadValues;

// 4th step
let supportsLocations;

// 5th step
let crackZones;

let beamData = {
    "beamType": null,
    "geometricData": {
        'a': 0,
        'b': 0,
        'c': 0,
        'd': 0,
        'e': 0,
        'f': 0,
        'span': 0
    },
    "loads": {
        "type": null,
        "data": [],
    },
    "supportLocations": [],
    "crackZones": [{
        "name": null,
        "start": 0,
        "end": 0,
        "spacing": 0,
        "width": 0,
        "depth": 0,
        "color": '#000000'
    }],
    "scale_cross": 1,
    "scale_span": 1

};

function selectType(type) {
    selectedType = type;
    $('#type-i').removeClass("btn-warning");
    $('#type-i').addClass("beam-type");
    $('#type-i').removeClass("beam-type-selected");
    $('#type-i').addClass("btn-outline-warning");
    $('#type-t').removeClass("btn-warning");
    $('#type-t').removeClass("beam-type-selected");
    $('#type-t').addClass("beam-type");
    $('#type-t').addClass("btn-outline-warning");
    $('#type-r').removeClass("btn-warning");
    $('#type-r').removeClass("beam-type-selected");
    $('#type-r').addClass("beam-type");
    $('#type-r').addClass("btn-outline-warning");

    $('#type-' + type).removeClass("btn-outline-warning");
    $('#type-' + type).addClass("btn-warning");
    $('#type-' + type).addClass("beam-type-selected");


    beamTypes = {'i': 'I', 't': "T", 'r': 'Rectangular'}

    $('#selected-type').text('Selected Beam Type : ' + beamTypes[type] + ' Beam');
    if(type === 'r'){
        $('#dimensions-img').attr('src','img/r.png');
    }else if(type === 't'){
        $('#dimensions-img').attr('src','img/t.png');
    }else if(type === 'i'){
        $('#dimensions-img').attr('src','img/i.png');
    }
}

function firstStep() {
    if (selectedType == null) {
        return
    }
    if (selectedType === 't') {
        $("#input-a").show();
        $("#input-b").show();
        $("#input-c").show();
        $("#input-d").show();
        $("#input-e").hide();
        $("#input-f").hide();
    } else if (selectedType === 'r') {
        $("#input-a").show();
        $("#input-b").show();
        $("#input-c").hide();
        $("#input-d").hide();
        $("#input-e").hide();
        $("#input-f").hide();
    } else {
        $("#input-a").show();
        $("#input-b").show();
        $("#input-c").show();
        $("#input-d").show();
        $("#input-e").show();
        $("#input-f").show();
    }
    moveStep(2);
}

function secondStep() {
    a = $("#a").val();
    b = $("#b").val();
    c = $("#c").val();
    d = $("#d").val();
    e = $("#e").val();
    f = $("#f").val();
    span = $("#span").val();

    if (selectedType === 't') {
        if (a === '' || b === '' || c === '' || d === '' || span === '') {
            return
        }
    } else if (selectedType === 'r') {
        if (a === '' || b === '' || span === '') {
            return
        }
    } else {
        if (a === '' || b === '' || c === '' || d === '' || e === '' || f === '' || span === '') {
            return
        }
    }
    moveStep(3);
}

function thirdStep() {
    if (loadType === 'uniform') {
        loadValues = [[0, parseFloat($('#uni-load-value').val())]];
    } else {
        const locationFields = $('.point-location');
        const valueFields = $('.point-load');
        point_load_data = [];
        for (let i = 0; i < locationFields.length; i++) {
            let temp = [parseFloat(locationFields[i].value), parseFloat(valueFields[i].value)];
            point_load_data.push(temp);
        }
        loadValues = point_load_data;
    }
    moveStep(4);
}

function fourthStep() {
    const supportFields = $('.support-location');
    support_locations = [];
    for (let i = 0; i < supportFields.length; i++) {
        support_locations.push(parseFloat(supportFields[i].value));
    }
    supportsLocations = support_locations;
    moveStep(5);
}

function fifthStep() {
    const crack_zones_count = parseInt($("#cracks-zone-count").val());

    const startFields = $('.crack-zone-start');
    const endFields = $('.crack-zone-end');
    const spacingFields = $('.crack-spacing');
    const widthFields = $('.crack-width');
    const depthFields = $('.crack-depth');
    const colorFields = $('.crack-color');

    let crack_zones = [];
    for (let i = 0; i < crack_zones_count; i++) {
        let temp = {
            "name": 'Zone ' + (i + 1).toString(),
            "start": parseFloat(startFields[i].value),
            "end": parseFloat(endFields[i].value),
            "spacing": parseFloat(spacingFields[i].value),
            "width": parseFloat(widthFields[i].value),
            "depth": parseFloat(depthFields[i].value),
            "color": colorFields[i].value
        };
        crack_zones.push(temp);
    }
    crackZones = crack_zones;
}

function scaling(input, scale) {
    let temp = [];
    input.forEach(function (item) {
        item = item * scale;
        temp.push(item);
    });
    return temp;
}

function scalingPointLoads(input, scale) {
    let temp = [];
    input.forEach(function (item) {
        item[0] = item[0] * scale;
        temp.push(item);
    });
    return temp;
}

function scalingCrackData(crackData, scale_x, scale_y)  {
    let temp = [];
    crackData.forEach(function (item) {
        item['start'] = item['start'] * scale_x;
        item['end'] = item['end'] * scale_x;
        item['spacing'] = item['spacing'] * scale_x;
        item['width'] = item['width'] * scale_y * 20;
        item['depth'] = item['depth'] * scale_y;
        temp.push(item);
    });
    return temp;
}

function buildDataObject() {

    let cross_scale_val = scale();

    beamData["beamType"] = selectedType;

    beamData['scale_cross'] = cross_scale_val;
    beamData['scale_span'] = (cross_scale_val * parseFloat(span)) > 1000 ? 1000 / parseFloat(span) : cross_scale_val;

    beamData["geometricData"]['a'] = parseFloat(a) * cross_scale_val;
    beamData["geometricData"]['b'] = parseFloat(b) * cross_scale_val;
    beamData["geometricData"]['c'] = parseFloat(c) * cross_scale_val;
    beamData["geometricData"]['d'] = parseFloat(d) * cross_scale_val;
    beamData["geometricData"]['e'] = parseFloat(e) * cross_scale_val;
    beamData["geometricData"]['f'] = parseFloat(f) * cross_scale_val;
    beamData["geometricData"]['span'] = parseFloat(span) * beamData['scale_span'];

    beamData["loads"]['type'] = loadType;
    beamData["loads"]['data'] = scalingPointLoads(loadValues, beamData['scale_span']);

    beamData["supportLocations"] = scaling(supportsLocations, beamData['scale_span']);
    beamData["crackZones"] = scalingCrackData(crackZones, beamData['scale_span'], beamData['scale_cross']);

}

function moveStep(step) {
    $('#step-1').hide();
    $('#step-2').hide();
    $('#step-3').hide();
    $('#step-4').hide();
    $('#step-5').hide();

    $('#step-indicator-1').removeClass('active');
    $('#step-indicator-2').removeClass('active');
    $('#step-indicator-3').removeClass('active');
    $('#step-indicator-4').removeClass('active');
    $('#step-indicator-5').removeClass('active');

    $('#step-' + step).show();
    $('#step-indicator-' + step).addClass('active');
}

function changeLoadType(type) {
    loadType = type;
}

function addPointLoadInputField() {
    const count = parseInt($("#point-load-count").val());
    let content = '';
    for (let i = 0; i < count; i++) {
        content += '<div class="row p-2">\n' +
            '                            <div class="col-3"></div>\n' +
            '                            <div class="col-3">\n' +
            '                                <input type="number" class="form-control point-location" min="0" >\n' +
            '                            </div>\n' +
            '                            <div class="col-3">\n' +
            '                                <input type="number" class="form-control point-load" min="0" >\n' +
            '                            </div>\n' +
            '                            <div class="col-3 text-left pt-2 pl-0">\n' +
            '                            </div>\n' +
            '                        </div>';
    }
    $('#point-load-inputs').html(content);
}

function addSupports() {
    const count = parseInt($("#supports-count").val());
    let content = '';
    for (let i = 0; i < count; i++) {
        content += '<div class="row p-2">\n' +
            '                    <div class="col-4"></div>\n' +
            '                    <div class="col-4">\n' +
            '                        <input type="number" class="form-control support-location" min="0" >\n' +
            '                    </div>\n' +
            '                    <div class="col-4 text-left pt-2 pl-0">\n' +
            '                    </div>\n' +
            '                </div>';
    }
    $('#supports-inputs').html(content);
}

function addCracks() {
    const count = parseInt($("#cracks-zone-count").val());
    let content = '';
    for (let i = 1; i < count + 1; i++) {
        content += '                        <div class="row p-2">\n' +
            '                            <div class="col-2">\n' +
            '                                <input type="number" class="form-control crack-zone-start" min="0">\n' +
            '                            </div>\n' +
            '                            <div class="col-2 text-center">\n' +
            '                                <input type="number" class="form-control crack-zone-end" min="0">\n' +
            '                            </div>\n' +
            '                            <div class="col-2">\n' +
            '                                <input type="number" class="form-control crack-spacing" min="0">\n' +
            '                            </div>\n' +
            '                            <div class="col-2">\n' +
            '                                <input type="number" class="form-control crack-depth" min="0">\n' +
            '                            </div>\n' +
            '                            <div class="col-2">\n' +
            '                                <input type="number" class="form-control crack-width" min="0">\n' +
            '                            </div>\n' +
            '                            <div class="col-2 text-center">\n' +
            '                                <select class="browser-default custom-select crack-color" style="background-color: #d50000;" onchange="setBackgroundColor(this);">\n' +
            '                                    <option value="#d50000" style="color: white;background-color: #d50000;padding: 5px;font-weight: bold;" selected>&nbsp;&nbsp;</option>\n' +
            '                                    <option value="#f57f17" style="color: white;background-color: #f57f17;padding: 5px;font-weight: bold;" >&nbsp;&nbsp;</option>\n' +
            '                                    <option value="#000000" style="color: white;background-color: #000000;padding: 5px;font-weight: bold;" >&nbsp;&nbsp;</option>\n' +
            '                                    <option value="#ffff00" style="color: white;background-color: #ffff00;padding: 5px;font-weight: bold;" >&nbsp;&nbsp;</option>\n' +
            '                                    <option value="#3e2723" style="color: white;background-color: #3e2723;padding: 5px;font-weight: bold;" >&nbsp;&nbsp;</option>\n' +
            '                                    <option value="#2e7d32" style="color: white;background-color: #2e7d32;padding: 5px;font-weight: bold;" >&nbsp;&nbsp;</option>\n' +
            '                                </select>\n' +
            '                            </div>\n' +
            '                        </div>\n';
    }
    $('#cracks-zone-inputs').html(content);
}

function scale() {
    let type = selectedType;
    let width = 0;
    let height = 0;
    if (type === 'r') {
        height = parseFloat(b);
        width = parseFloat(a);
    } else if (type === 't') {
        height = parseFloat(b) + parseFloat(c);
        width = parseFloat(a);
    } else if (type === 'i') {
        height = parseFloat(b) + parseFloat(c) + parseFloat(e);
        width = parseFloat(a) > parseFloat(f) ? parseFloat(a) : parseFloat(f);
    }
    return Math.min(200 / width, 200 / height);

}

function visualize() {
    // Collecting 5th step data
    fifthStep();

    // Build the data json with all data
    this.buildDataObject();

    // Change the display
    $('#readings').hide();
    $('#display').show();

    drawCrossSection(beamData);
    drawLongitudinalSection(beamData);
}

function goBack() {
    moveStep(1);
    $("#cross-section").children('svg').remove();
    $("#longitudinal-section").children('svg').remove();
    $('#readings').show();
    $('#display').hide();
    document.getElementById("load_value").innerHTML = '';
}

function createSVG(container_id, width, height) {
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    svg.setAttribute('version', '1.1');
    // svg.innerHTML = ('<pattern id="concrete" height="100%" width="100%" patternContentUnits="objectBoundingBox">\n' +
    //     '                        <image height="1" width="1" preserveAspectRatio="none" xlink:href="img/beam_fill.jpg" />\n' +
    //     '                    </pattern>');
    const canvas = document.getElementById(container_id);
    canvas.style.minWidth = width;
    canvas.style.minHeight = height;
    svg.setAttribute('height', height);
    svg.setAttribute('width', width);
    svg.style.display = 'block';
    svg.style.margin = 'auto';
    let marginVal = (300 - height) / 2;
    document.getElementById(container_id + '-title').style.marginTop = marginVal.toString() + 'px';
    canvas.appendChild(svg);
    return svg;
}

function drawPolygon(points, fill = "gray", stroke = 'none', stroke_width = '2') {
    const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    poly.setAttribute("points", points);
    poly.setAttribute("stroke", stroke);
    poly.setAttribute('fill', fill);
    poly.setAttribute('stroke-width', stroke_width);
    return poly;
}

function drawPolygonWithText(points, loadVal) {
    const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    poly.textContent = loadVal;
    poly.setAttribute("points", points);
    poly.setAttribute("stroke", 'none');
    poly.setAttribute('fill', 'blue');
    poly.setAttribute('stroke-width', '2');
    return poly;
}

function initialPoints(dataJson, x_shift = 0, y_shift = 0) {
    let dimensions = dataJson['geometricData'];
    let points = [0, 0];
    if (dimensions['a'] < dimensions['f']) {
        let diff = dimensions['f'] - dimensions['a'];
        points[0] = diff / 2;
    }
    points[0] += x_shift;
    points[1] += y_shift;
    return points;
}

function drawCrossSection(dataJson) {
    let type = dataJson['beamType'];
    let dimensions = dataJson['geometricData'];
    let initials = initialPoints(dataJson);
    let height;
    let width;

    // A
    let x = [initials[0]];
    let y = [initials[1]];

    if (type === 'r') {
        //B
        x.push(x[0] + dimensions['a']);
        y.push(y[0]);

        //C
        x.push(x[0] + dimensions['a']);
        y.push(y[0] + dimensions['b']);

        //D
        x.push(x[0]);
        y.push(y[0] + dimensions['b']);

        height = dimensions['b'];
        width = dimensions['a'];

    } else if (type === 't') {

        //B
        x.push(x[0] + dimensions['a']);
        y.push(y[0]);

        //C
        x.push(x[0] + dimensions['a']);
        y.push(y[0] + dimensions['b']);

        //D
        x.push(x[0] + ((dimensions['a'] + dimensions['d']) / 2));
        y.push(y[0] + dimensions['b']);

        //E
        x.push(x[0] + ((dimensions['a'] + dimensions['d']) / 2));
        y.push(y[0] + dimensions['b'] + dimensions['c']);

        //J
        x.push(x[0] + ((dimensions['a'] - dimensions['d']) / 2));
        y.push(y[0] + dimensions['b'] + dimensions['c']);

        //K
        x.push(x[0] + ((dimensions['a'] - dimensions['d']) / 2));
        y.push(y[0] + dimensions['b']);

        //L
        x.push(x[0]);
        y.push(y[0] + dimensions['b']);

        height = dimensions['b'] + dimensions['c'];
        width = dimensions['a'];

    } else if (type === 'i') {

        //B
        x.push(x[0] + dimensions['a']);
        y.push(y[0]);

        //C
        x.push(x[0] + dimensions['a']);
        y.push(y[0] + dimensions['b']);

        //D
        x.push(x[0] + ((dimensions['a'] + dimensions['d']) / 2));
        y.push(y[0] + dimensions['b']);

        //E
        x.push(x[0] + ((dimensions['a'] + dimensions['d']) / 2));
        y.push(y[0] + dimensions['b'] + dimensions['c']);

        //F
        x.push(x[0] + ((dimensions['a'] + dimensions['f']) / 2));
        y.push(y[0] + dimensions['b'] + dimensions['c']);

        //G
        x.push(x[0] + ((dimensions['a'] + dimensions['f']) / 2));
        y.push(y[0] + dimensions['b'] + dimensions['c'] + dimensions['e']);

        //H
        x.push(x[0] + ((dimensions['a'] - dimensions['f']) / 2));
        y.push(y[0] + dimensions['b'] + dimensions['c'] + dimensions['e']);

        //I
        x.push(x[0] + ((dimensions['a'] - dimensions['f']) / 2));
        y.push(y[0] + dimensions['b'] + dimensions['c']);

        //J
        x.push(x[0] + ((dimensions['a'] - dimensions['d']) / 2));
        y.push(y[0] + dimensions['b'] + dimensions['c']);

        //K
        x.push(x[0] + ((dimensions['a'] - dimensions['d']) / 2));
        y.push(y[0] + dimensions['b']);

        //L
        x.push(x[0]);
        y.push(y[0] + dimensions['b']);

        height = dimensions['b'] + dimensions['c'] + dimensions['e'];
        width = dimensions['a'] > dimensions['f'] ? dimensions['a'] : dimensions['f'];
    }

    let points = "";
    for (let i = 0; i < x.length; i++) {
        points += x[i].toString() + ',' + y[i].toString() + ' ';
    }

    let svg = createSVG('cross-section', width, height);
    svg.appendChild(drawPolygon(points));

}

function drawLongitudinalSection(dataJson) {

    let type = dataJson['beamType'];
    let initials = initialPoints(dataJson, 20, 50);
    let dimensions = dataJson['geometricData'];
    let height;
    let width = dimensions['span'];
    // A(Initial point)
    let x = [initials[0]];
    let y = [initials[1]];

    let first_line_points = "";
    let second_line_points = "";

    if(type === 't' || type === 'i'){
        // first line

        let line_x_1 = [initials[0]];
        let line_y_1 = [(initials[1] + dimensions['b'])];

        line_x_1.push(initials[0] + dimensions['span']);
        line_y_1.push((initials[1] + dimensions['b']));


        for (let i = 0; i < line_x_1.length; i++) {
            first_line_points += line_x_1[i].toString() + ',' + line_y_1[i].toString() + ' ';
        }
    }

    if(type === 'i'){
        // second line
        let line_x_2 = [initials[0]];
        let line_y_2 = [(initials[1] + dimensions['b'] + dimensions['c'])];

        line_x_2.push(initials[0] + dimensions['span']);
        line_y_2.push((initials[1] + dimensions['b'] + dimensions['c']));

        for (let i = 0; i < line_x_2.length; i++) {
            second_line_points += line_x_2[i].toString() + ',' + line_y_2[i].toString() + ' ';
        }
    }

    if (type === 'r') {

        //B
        x.push(x[0] + dimensions['span']);
        y.push(y[0]);

        //C
        x.push(x[0] + dimensions['span']);
        y.push(y[0] + dimensions['b']);

        //D
        x.push(x[0]);
        y.push(y[0] + dimensions['b']);

        height = dimensions['b'];
    } else if (type === 't') {

        //B
        x.push(x[0] + dimensions['span']);
        y.push(y[0]);

        //C
        x.push(x[0] + dimensions['span']);
        y.push(y[0] + dimensions['b'] + dimensions['c']);

        //D
        x.push(x[0]);
        y.push(y[0] + dimensions['b'] + dimensions['c']);
        height = dimensions['b'] + dimensions['c'];
    } else {

        //B
        x.push(x[0] + dimensions['span']);
        y.push(y[0]);

        //C
        x.push(x[0] + dimensions['span']);
        y.push(y[0] + dimensions['b'] + dimensions['c'] + dimensions['e']);

        //D
        x.push(x[0]);
        y.push(y[0] + dimensions['b'] + dimensions['c'] + dimensions['e']);
        height = dimensions['b'] + dimensions['c'] + dimensions['e'];
    }

    let points = "";
    for (let i = 0; i < x.length; i++) {
        points += x[i].toString() + ',' + y[i].toString() + ' ';
    }
    let svg = createSVG('longitudinal-section', width + 80, height + 100);
    svg.appendChild(drawPolygon(points));
    drawSupports(dataJson, svg);
    generateCrackLocations(dataJson,svg);
    if (dataJson['loads']['type'] === "uniform") {
        drawUniformLoads(dataJson, svg);
    } else if (dataJson['loads']['type'] === "point") {
        drawPointLoads(dataJson, svg);
    }

    if(type === 't' || type === 'i'){
        svg.appendChild(drawPolygon(first_line_points, 'none', 'purple', '1'));
    }

    if(type === 'i'){
        svg.appendChild(drawPolygon(second_line_points, 'none', 'purple', '1'));
    }

    if(dataJson['loads']['type'] === "uniform"){
        console.log(dataJson['loads']['data'][0][1]);
        document.getElementById("load_value").innerHTML = dataJson['loads']['data'][0][1] + "kN/m";
    }else{

    }

}

//Draw Supports
function drawSupports(dataJson, svg) {
    let dimensions = dataJson['geometricData'];
    let supportLocations = dataJson['supportLocations'];
    let initials = initialPoints(dataJson, 20, 50);
    let type = dataJson['beamType'];
    let y = initials[1]+getBeamHeight(dataJson);
    for (let i = 0; i < supportLocations.length; i++) {
        let x = initials[0] + supportLocations[i];
        svg.appendChild(generateSupportCoordinates(x, y));
    }

}

function generateSupportCoordinates(initial_x, initial_y) {

    x = [initial_x];
    y = [initial_y];
    x.push(initial_x + 15);
    y.push(initial_y + 35);
    x.push(initial_x - 15);
    y.push(initial_y + 35);
    let supports = "";
    for (let i = 0; i < x.length; i++) {
        supports += x[i].toString() + ',' + y[i].toString() + ' ';
    }
    return drawPolygon(supports, "blue");
}

//Draw Point Loads
function drawPointLoads(dataJson, svg) {
    let pointDimensions = dataJson['loads']['data'];
    let initials = initialPoints(dataJson, 20, 50);
    let y = initials[1];
    for (let i = 0; i < pointDimensions.length; i++) {
        let x = initials[0] + pointDimensions[i][0];
        svg.appendChild(generatePointLoadCoordinates(x, y, (dataJson['loads']['data'][i][1] + "N")));
    }
}

function generatePointLoadCoordinates(initial_x, initial_y, loadVal) {

    x = [initial_x];
    y = [initial_y];
    x.push(initial_x + 10);
    y.push(initial_y - 15);
    x.push(initial_x + 5);
    y.push(initial_y - 15);
    x.push(initial_x + 5);
    y.push(initial_y - 50);
    x.push(initial_x - 5);
    y.push(initial_y - 50);
    x.push(initial_x - 5)
    y.push(initial_y - 15);
    x.push(initial_x - 10);
    y.push(initial_y - 15);
    let supports = "";
    for (let i = 0; i < x.length; i++) {
        supports += x[i].toString() + ',' + y[i].toString() + ' ';
    }
    return drawPolygonWithText(supports, loadVal);
}

//Draw Uniform Loads
function drawUniformLoads(dataJson, svg) {
    let dimensions = dataJson['geometricData'];
    let span = dimensions['span'];
    let arrow_count = 20;
    let divider = span / arrow_count;
    let initials = initialPoints(dataJson, 20, 50);
    let y = initials[1];
    for (let i = 0; i <= arrow_count; i++) {
        let x = initials[0];
        x += divider * i;
        svg.appendChild(generateUniformLoadCoordinates(x, y));
    }
    //draw horizontal line
    x = [initials[0] - 3];
    y = [initials[1] - 25]; //100 - 40
    x.push(initials[0] - 3);
    y.push(initials[1] - 30);
    x.push(initials[0] + 3 + span);
    y.push(initials[1] - 30);
    x.push(initials[0] + 3 + span);
    y.push(initials[1] - 25);

    let supports = "";

    for (let i = 0; i < x.length; i++) {
        supports += x[i].toString() + ',' + y[i].toString() + ' ';
    }

    svg.appendChild(drawPolygon(supports, "blue"));
}

function generateUniformLoadCoordinates(initial_x, initial_y) {

    x = [initial_x];
    y = [initial_y];
    x.push(initial_x + 5);
    y.push(initial_y - 10);
    x.push(initial_x + 2);
    y.push(initial_y - 10);
    x.push(initial_x + 2);
    y.push(initial_y - 25);
    x.push(initial_x - 2);
    y.push(initial_y - 25);
    x.push(initial_x - 2);
    y.push(initial_y - 10);
    x.push(initial_x - 5);
    y.push(initial_y - 10);
    let supports = "";
    for (let i = 0; i < x.length; i++) {
        supports += x[i].toString() + ',' + y[i].toString() + ' ';
    }
    return drawPolygon(supports, "blue");
}

// Cracks
function getBeamHeight(dataJson){
    let dimensions = dataJson['geometricData'];
    let type = dataJson['beamType'];
    let y = 0;
    if (type === 'r') {
        y += dimensions['b'];
    } else if (type === 't') {
        y += (dimensions['b'] + dimensions['c']);
    } else if (type === 'i') {
        y += (dimensions['b'] + dimensions['c'] + dimensions['e']);
    }
    return y;
}

function generateCrackLocations(dataJson, svg) {
    let crackData = dataJson['crackZones'];
    let initials = initialPoints(dataJson, 20, 50);
    let y = initials[1]+getBeamHeight(dataJson);
    crackData.forEach((crackData) => {
        let rounds = Math.abs(crackData['start'] - crackData['end']) / crackData['spacing'];
        for(let i=1;i <rounds;i++){
            let x = crackData['start'] + (crackData['spacing'] * i) + 20;
            svg.appendChild(drawCracks(x,y,crackData['width'],crackData['depth'],crackData['color']));
        }
        svg.appendChild(drawCracks(crackData['start']+ 20,y,crackData['width'],crackData['depth'],crackData['color']));
        svg.appendChild(drawCracks(crackData['end']+ 20,y,crackData['width'],crackData['depth'],crackData['color']));
    });
}

function drawCracks(initial_x, initial_y, width, depth, color){
    // A
    let a = [initial_x, initial_y];
    // B
    let b = [(initial_x-(width/2)),initial_y];
    // C
    let c = [(initial_x-((3*width)/8)), (initial_y-(depth/4))];
    // D
    let d = [(initial_x-((width)/4)), (initial_y-(depth/2))];
    // E
    let e = [(initial_x-((width)/8)), (initial_y-(3*depth/4))];
    // F
    let f = [(initial_x), (initial_y-(depth))];
    // G
    let g = [(initial_x+((width)/8)), (initial_y-(3*depth/4))];
    // H
    let h = [(initial_x+((width)/4)), (initial_y-(depth/2))];
    // I
    let i = [(initial_x+((3*width)/8)), (initial_y-(depth/4))];
    // J
    let j = [(initial_x+(width/2)),initial_y];

    // Widths
    let w1 = width;
    let w2 = Math.abs(c[0] - i[0]);
    let w3 = Math.abs(d[0] - h[0]);

    // Shifting
    // 1
    c[0] = c[0]+(w1/4);
    i[0] = i[0]+(w1/4);

    // 2
    d[0] = d[0]-(w2/4);
    h[0] = h[0]-(w2/4);

    // 3
    e[0] = e[0]+(w3/4);
    g[0] = g[0]+(w3/4);

    let points = a.join(' ') + ',' + b.join(' ') + ',' + c.join(' ') + ',' + d.join(' ') + ',' + e.join(' ') + ',' + f.join(' ') + ',' + i.join(' ') + ',' + j.join(' ');
    // console.log(points);
    return drawPolygon(points, color);
}

function setBackgroundColor(element){
    element.style.backgroundColor = element.value;
}
