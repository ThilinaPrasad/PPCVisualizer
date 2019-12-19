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

function buildDataObject(){

    let cross_scale_val = scale();

    beamData["beamType"] = selectedType;

    beamData['scale_cross'] = cross_scale_val;
    beamData['scale_span'] = 1000/parseFloat(span);

    beamData["geometricData"]['a'] = parseFloat(a)*cross_scale_val;
    beamData["geometricData"]['b'] = parseFloat(b)*cross_scale_val;
    beamData["geometricData"]['c'] = parseFloat(c)*cross_scale_val;
    beamData["geometricData"]['d'] = parseFloat(d)*cross_scale_val;
    beamData["geometricData"]['e'] = parseFloat(e)*cross_scale_val;
    beamData["geometricData"]['f'] = parseFloat(f)*cross_scale_val;
    beamData["geometricData"]['span'] = parseFloat(span)*beamData['scale_span'];

    beamData["loads"]['type'] = loadType;
    beamData["loads"]['data'] = loadValues;

    beamData["supportLocations"] = supportsLocations;

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

function visualize() {
    this.buildDataObject();

    $('#readings').hide();
    $('#display').show();


    drawCrossSection(beamData);
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

function crossSectionalView(points) {
    const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    poly.setAttribute("points", points);
    // poly.setAttribute("stroke", 'black');
    poly.setAttribute('fill', '#ffc107');
    poly.setAttribute('stroke-width', '2');
    return poly;
}

function initialPoints(dataJson) {
    let dimensions = dataJson['geometricData'];
    let scale = dataJson['scale'];
    let points = [0,0];
    if(dimensions['a']<dimensions['f']){
        let diff = dimensions['f'] - dimensions['a']
        points[0] = diff/2;
    }
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
    svg.appendChild(crossSectionalView(points));
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

