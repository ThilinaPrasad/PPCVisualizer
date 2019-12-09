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
    }
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
    beamData["beamType"] = selectedType;

    beamData["geometricData"]['a'] = parseFloat(a);
    beamData["geometricData"]['b'] = parseFloat(b);
    beamData["geometricData"]['c'] = parseFloat(c);
    beamData["geometricData"]['d'] = parseFloat(d);
    beamData["geometricData"]['e'] = parseFloat(e);
    beamData["geometricData"]['f'] = parseFloat(f);
    beamData["geometricData"]['span'] = parseFloat(span);

    beamData["loads"]['type'] = loadType;
    beamData["loads"]['data'] = loadValues;

    beamData["supportLocations"] = supportsLocations;

    beamData["cracks"]["spacing"] = parseInt($("#crack-spacing").val())
    beamData["cracks"]["width"] = parseInt($("#crack-width").val())
    beamData["cracks"]["depth"] = parseInt($("#crack-depth").val())

}

function visualize() {
    this.buildDataObject();

    alert(JSON.stringify(beamData));
    console.log(beamData);
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
