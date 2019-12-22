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

let beamData = {
    "beamType" : null,
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
    "cracks":{
        "spacing": 0,
        "width": 0,
        "depth": 0
    },
    "scale_cross":1,
    "scale_span":1

};

function selectType(type) {
        selectedType = type;
        $('#type-i').removeClass("btn-warning");
        $('#type-i').addClass("btn-outline-warning");
        $('#type-t').removeClass("btn-warning");
        $('#type-t').addClass("btn-outline-warning");
        $('#type-r').removeClass("btn-warning");
        $('#type-r').addClass("btn-outline-warning");

        $('#type-'+type).removeClass("btn-outline-warning");
        $('#type-'+type).addClass("btn-warning");

        beamTypes = {'i': 'I', 't': "T", 'r': 'Rectangular'}

        $('#selected-type').text('Selected Beam Type : '+beamTypes[type]+' Beam');
}

function firstStep(){
    if(selectedType == null){
        return
    }
    if(selectedType === 't'){
        $("#input-a").show();
        $("#input-b").show();
        $("#input-c").show();
        $("#input-d").show();
        $("#input-e").hide();
        $("#input-f").hide();
    }else if(selectedType === 'r'){
        $("#input-a").show();
        $("#input-b").show();
        $("#input-c").hide();
        $("#input-d").hide();
        $("#input-e").hide();
        $("#input-f").hide();
    } else{
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

    console.log(b === '');

    if(selectedType === 't'){
        if(a === '' || b === '' || c === '' || d === '' || span === ''){
            return
        }
    }else if(selectedType === 'r'){
        if(a === '' || b === '' || span === ''){
            return
        }
    } else{
        if(a === '' || b === '' || c === '' || d === '' || e === '' || f=== '' || span === ''){
            return
        }
    }
    moveStep(3);
}

function thirdStep() {
    if(loadType === 'uniform'){
        loadValues = [[0, parseFloat($('#uni-load-value').val())]];
    }else {
        const locationFields = $('.point-location');
        const valueFields = $('.point-load');
        point_load_data = [];
        for(let i=0; i< locationFields.length;i++){
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

function buildDataObject(){

    let cross_scale_val = scale();

    beamData["beamType"] = selectedType;

    beamData['scale_cross'] = cross_scale_val;
    beamData['scale_span'] = (cross_scale_val*parseFloat(span))>1000 ? 1000/parseFloat(span): cross_scale_val;

    beamData["geometricData"]['a'] = parseFloat(a)*cross_scale_val;
    beamData["geometricData"]['b'] = parseFloat(b)*cross_scale_val;
    beamData["geometricData"]['c'] = parseFloat(c)*cross_scale_val;
    beamData["geometricData"]['d'] = parseFloat(d)*cross_scale_val;
    beamData["geometricData"]['e'] = parseFloat(e)*cross_scale_val;
    beamData["geometricData"]['f'] = parseFloat(f)*cross_scale_val;
    beamData["geometricData"]['span'] = parseFloat(span)*beamData['scale_span'];

    beamData["loads"]['type'] = loadType;
    beamData["loads"]['data'] = scalingPointLoads(loadValues, beamData['scale_span']);

    beamData["supportLocations"] = scaling(supportsLocations, beamData['scale_span']);
    beamData["cracks"]["spacing"] = parseInt($("#crack-spacing").val());
    beamData["cracks"]["width"] = parseInt($("#crack-width").val());
    beamData["cracks"]["depth"] = parseInt($("#crack-depth").val());

}

function moveStep(step){
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

    $('#step-'+step).show();
    $('#step-indicator-'+step).addClass('active');
}

function changeLoadType(type) {
    loadType = type;
    console.log(type);
}

function addPointLoadInputField() {
    const count = parseInt($("#point-load-count").val());
    let content = '';
    for(let i =0; i<count; i++){
        content+= '<div class="row p-2">\n' +
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
    for(let i =0; i<count; i++){
        content+= '<div class="row p-2">\n' +
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

function scale(){
    let type = selectedType;
    let width = 0;
    let height = 0;
    if(type === 'r'){
        height = parseFloat(b);
        width = parseFloat(a);
    }else if(type === 't'){
        height = parseFloat(b)+parseFloat(c);
        width = parseFloat(a);
    }else if(type === 'i'){
        height = parseFloat(b)+parseFloat(c)+parseFloat(e);
        width = parseFloat(a)>parseFloat(f)? parseFloat(a) : parseFloat(f);
    }
    return Math.min(200/width, 200/height);

}

function visualize() {
    this.buildDataObject();

    $('#readings').hide();
    $('#display').show();


    drawCrossSection(beamData);
    drawLongitudinalSection(beamData);
    console.log(beamData);
}

function goBack() {
    moveStep(1);
    $("#cross-section").children('svg').remove();
    $("#longitudinal-section").children('svg').remove();
    $('#readings').show();
    $('#display').hide();
}

function createSVG(container_id,width, height){
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
    let marginVal = (300 - height)/2;
    document.getElementById(container_id+'-title').style.marginTop = marginVal.toString()+'px'
    canvas.appendChild(svg);
    return svg;
}

function drawPolygon(points, fill = "gray", stroke = 'none') {
    const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    poly.setAttribute("points", points);
    poly.setAttribute("stroke", stroke);
    poly.setAttribute('fill', fill);
    poly.setAttribute('stroke-width', '2');
    return poly;
}

function initialPoints(dataJson, x_shift = 0, y_shift = 0) {
    let dimensions = dataJson['geometricData'];
    let points = [0,0];
    if(dimensions['a']<dimensions['f']){
        let diff = dimensions['f'] - dimensions['a'];
        points[0] = diff/2;
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

    if(type === 'r'){
        //B
        x.push(x[0]+dimensions['a']);
        y.push(y[0]);

        //C
        x.push(x[0]+dimensions['a']);
        y.push(y[0]+dimensions['b']);

        //D
        x.push(x[0]);
        y.push(y[0]+dimensions['b']);

        height = dimensions['b'];
        width = dimensions['a'];

    }else if(type === 't'){
        //B
        x.push(x[0]+dimensions['a']);
        y.push(y[0]);

        //C
        x.push(x[0]+dimensions['a']);
        y.push(y[0]+dimensions['b']);

        //D
        x.push(x[0]+((dimensions['a']+dimensions['d'])/2));
        y.push(y[0]+dimensions['b']);

        //E
        x.push(x[0]+((dimensions['a']+dimensions['d'])/2));
        y.push(y[0]+dimensions['b']+dimensions['c']);

        //J
        x.push(x[0]+((dimensions['a']-dimensions['d'])/2));
        y.push(y[0]+dimensions['b']+dimensions['c']);

        //K
        x.push(x[0]+((dimensions['a']-dimensions['d'])/2));
        y.push(y[0]+dimensions['b']);

        //L
        x.push(x[0]);
        y.push(y[0]+dimensions['b']);

        height = dimensions['b']+dimensions['c'];
        width = dimensions['a'];

    }else if(type === 'i'){
        //B
        x.push(x[0]+dimensions['a']);
        y.push(y[0]);

        //C
        x.push(x[0]+dimensions['a']);
        y.push(y[0]+dimensions['b']);

        //D
        x.push(x[0]+((dimensions['a']+dimensions['d'])/2));
        y.push(y[0]+dimensions['b']);

        //E
        x.push(x[0]+((dimensions['a']+dimensions['d'])/2));
        y.push(y[0]+dimensions['b']+dimensions['c']);

        //F
        x.push(x[0]+((dimensions['a']+dimensions['f'])/2));
        y.push(y[0]+dimensions['b']+dimensions['c']);

        //G
        x.push(x[0]+((dimensions['a']+dimensions['f'])/2));
        y.push(y[0]+dimensions['b']+dimensions['c']+dimensions['e']);

        //H
        x.push(x[0]+((dimensions['a']-dimensions['f'])/2));
        y.push(y[0]+dimensions['b']+dimensions['c']+dimensions['e']);

        //I
        x.push(x[0]+((dimensions['a']-dimensions['f'])/2));
        y.push(y[0]+dimensions['b']+dimensions['c']);

        //J
        x.push(x[0]+((dimensions['a']-dimensions['d'])/2));
        y.push(y[0]+dimensions['b']+dimensions['c']);

        //K
        x.push(x[0]+((dimensions['a']-dimensions['d'])/2));
        y.push(y[0]+dimensions['b']);

        //L
        x.push(x[0]);
        y.push(y[0]+dimensions['b']);

        height = dimensions['b']+dimensions['c']+dimensions['e'];
        width = dimensions['a']>dimensions['f']? dimensions['a'] : dimensions['f'];
    }
    let points = "";
    for(let i=0; i<x.length; i++){
        points += x[i].toString() + ',' + y[i].toString() + ' ';
    }

    let svg = createSVG('cross-section',width,height);
    svg.appendChild(drawPolygon(points));
}

function drawLongitudinalSection(dataJson){
    let type = dataJson['beamType'];
    let initials = initialPoints(dataJson,20, 50);
    let dimensions = dataJson['geometricData'];
    let height;
    let width = dimensions['span'];
    // A(Initial point)
    let x = [initials[0]];
    let y = [initials[1]];

    if(type === 'r') {

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
    }else if(type === 't') {

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
    }else {

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
    for(let i=0; i<x.length; i++){
        points += x[i].toString() + ',' + y[i].toString() + ' ';
    }
    let svg = createSVG('longitudinal-section',width+80,height+100);
    svg.appendChild(drawPolygon(points));
    drawSupports(dataJson,svg);
    if(dataJson['loads']['type'] === "uniform"){
        drawUniformLoads(dataJson, svg);
    }else if(dataJson['loads']['type'] === "point"){
        drawPointLoads(dataJson, svg);
    }
}

//Draw Supports
function drawSupports(dataJson,svg) {
    let dimensions = dataJson['geometricData'];
    let supportLocations = dataJson['supportLocations'];
    let initials = initialPoints(dataJson, 20, 50);
    let type = dataJson['beamType'];
    let y = initials[1];
    if(type === 'r'){
        y+= dimensions['b'];
    }else if(type === 't'){
        y+= (dimensions['b']+dimensions['c']);
    }else if(type === 'i'){
        y+= (dimensions['b']+dimensions['c']+dimensions['e']);
    }
    for(let i=0; i<supportLocations.length; i++){
        let x = initials[0] + supportLocations[i];
        svg.appendChild(generateSupportCoordinates(x,y));
    }

}


function generateSupportCoordinates(initial_x,initial_y) {

    x = [initial_x];
    y = [initial_y];
    x.push(initial_x+15);
    y.push(initial_y+35);
    x.push(initial_x-15);
    y.push(initial_y+35);
    let supports = "";
    for(let i=0; i<x.length; i++){
        supports += x[i].toString() + ',' + y[i].toString() + ' ';
    }
    return drawPolygon(supports, "blue");
}

//Draw Point Loads
function drawPointLoads(dataJson, svg) {
    let pointDimensions = dataJson['loads']['data'];
    let initials = initialPoints(dataJson, 20, 50);
    let y = initials[1];
    for(let i=0; i<pointDimensions.length; i++){
        let x = initials[0] + pointDimensions[i][0];
        svg.appendChild(generatePointLoadCoordinates(x,y));
    }
}

function generatePointLoadCoordinates(initial_x,initial_y) {

    x = [initial_x];
    y = [initial_y];
    x.push(initial_x+10);
    y.push(initial_y-15);
    x.push(initial_x+5);
    y.push(initial_y-15);
    x.push(initial_x+5);
    y.push(initial_y-50);
    x.push(initial_x-5);
    y.push(initial_y-50);
    x.push(initial_x-5)
    y.push(initial_y-15);
    x.push(initial_x-10);
    y.push(initial_y-15);
    let supports = "";
    for(let i=0; i<x.length; i++){
        supports += x[i].toString() + ',' + y[i].toString() + ' ';
    }
    return drawPolygon(supports,"blue");
}

//Draw Uniform Loads
function drawUniformLoads(dataJson, svg) {
    let dimensions = dataJson['geometricData'];
    let span = dimensions['span'];
    let arrow_count = 20;
    let divider = span/arrow_count;
    let initials = initialPoints(dataJson, 20, 50);
    let y = initials[1];
    for(let i=0; i<=arrow_count; i++){
        let x = initials[0];
        x += divider*i;
        svg.appendChild(generateUniformLoadCoordinates(x,y));
    }
    //draw horizontal line
    x = [initials[0]-3];
    y = [initials[1]-25]; //100 - 40
    x.push(initials[0]-3);
    y.push(initials[1]-30);
    x.push(initials[0]+3+span);
    y.push(initials[1]-30);
    x.push(initials[0]+3+span);
    y.push(initials[1]-25);

    let supports = "";

    for(let i=0; i<x.length; i++){
        supports += x[i].toString() + ',' + y[i].toString() + ' ';
    }
    svg.appendChild(drawPolygon(supports,"blue"));
}

function generateUniformLoadCoordinates(initial_x,initial_y) {

    x = [initial_x];
    y = [initial_y];
    x.push(initial_x+5);
    y.push(initial_y-10);
    x.push(initial_x+2);
    y.push(initial_y-10);
    x.push(initial_x+2);
    y.push(initial_y-25);
    x.push(initial_x-2);
    y.push(initial_y-25);
    x.push(initial_x-2);
    y.push(initial_y-10);
    x.push(initial_x-5);
    y.push(initial_y-10);
    let supports = "";
    for(let i=0; i<x.length; i++){
        supports += x[i].toString() + ',' + y[i].toString() + ' ';
    }
    return drawPolygon(supports,"blue");
}
